'use strict';

const schema = [
  `CREATE TABLE IF NOT EXISTS academy_users (
    id CHAR(36) PRIMARY KEY, email_hash CHAR(64) UNIQUE, created_at BIGINT NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS academy_projects (
    id CHAR(36) PRIMARY KEY, owner_user_id CHAR(36) NOT NULL, title VARCHAR(120) NOT NULL,
    language CHAR(2) NOT NULL, status VARCHAR(12) NOT NULL DEFAULT 'draft',
    created_at BIGINT NOT NULL, updated_at BIGINT NOT NULL,
    INDEX academy_owner_updated (owner_user_id, updated_at),
    FOREIGN KEY (owner_user_id) REFERENCES academy_users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS academy_project_steps (
    project_id CHAR(36) NOT NULL, step VARCHAR(24) NOT NULL,
    content_json TEXT NOT NULL, updated_at BIGINT NOT NULL,
    PRIMARY KEY (project_id, step),
    FOREIGN KEY (project_id) REFERENCES academy_projects(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS academy_login_challenges (
    id CHAR(36) PRIMARY KEY, email_hash CHAR(64) NOT NULL, code_hash CHAR(64) NOT NULL,
    attempts INT NOT NULL DEFAULT 0, expires_at BIGINT NOT NULL, consumed_at BIGINT,
    created_at BIGINT NOT NULL, INDEX academy_challenges_email (email_hash),
    INDEX academy_challenges_expiry (expires_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS academy_sessions (
    id CHAR(36) PRIMARY KEY, user_id CHAR(36) NOT NULL, token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at BIGINT NOT NULL, revoked_at BIGINT, created_at BIGINT NOT NULL,
    INDEX academy_sessions_expiry (expires_at),
    FOREIGN KEY (user_id) REFERENCES academy_users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS academy_rate_buckets (
    bucket VARCHAR(96) PRIMARY KEY, count INT NOT NULL, expires_at BIGINT NOT NULL,
    INDEX academy_rate_expiry (expires_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
];

async function transaction(pool, run) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await run(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

function createAcademyDatabase(pool) {
  return {
    prepare(sql) {
      const query = sql.replace(/\s+/g, ' ').trim();
      return { bind(...args) {
        async function execute() {
          if (query.startsWith('INSERT INTO rate_buckets(')) {
            const [bucket, expiresAt, now] = args;
            return transaction(pool, async connection => {
              await connection.execute(
                `INSERT INTO academy_rate_buckets (bucket,count,expires_at) VALUES (?,1,?)
                 ON DUPLICATE KEY UPDATE count=IF(expires_at<?,1,count+1), expires_at=IF(expires_at<?,?,expires_at)`,
                [bucket, expiresAt, now, now, expiresAt]
              );
              const [rows] = await connection.execute('SELECT count FROM academy_rate_buckets WHERE bucket=?', [bucket]);
              return rows;
            });
          }
          if (query.startsWith('UPDATE academy_login_challenges SET attempts=attempts+1')) {
            return transaction(pool, async connection => {
              const [update] = await connection.execute(query.split(' RETURNING ')[0], args);
              if (!update.affectedRows) return [];
              const [rows] = await connection.execute(
                'SELECT email_hash,code_hash,attempts FROM academy_login_challenges WHERE id=?', [args[0]]
              );
              return rows;
            });
          }
          if (query.startsWith('INSERT INTO academy_projects ')) {
            return transaction(pool, async connection => {
              const [owners] = await connection.execute('SELECT id FROM academy_users WHERE id=? FOR UPDATE', [args[1]]);
              if (!owners.length) return { affectedRows: 0 };
              const [projects] = await connection.execute('SELECT id FROM academy_projects WHERE owner_user_id=? LIMIT ?', [args[1], args[7]]);
              if (projects.length >= args[7]) return { affectedRows: 0 };
              const [inserted] = await connection.execute(
                'INSERT INTO academy_projects (id,owner_user_id,title,language,created_at,updated_at) VALUES (?,?,?,?,?,?)',
                args.slice(0, 6)
              );
              return inserted;
            });
          }
          if (query.startsWith('INSERT INTO academy_project_steps(')) {
            const [step, content, updated, projectId, owner] = args;
            const [result] = await pool.execute(
              `INSERT INTO academy_project_steps(project_id,step,content_json,updated_at)
               SELECT id,?,?,? FROM academy_projects WHERE id=? AND owner_user_id=?
               ON DUPLICATE KEY UPDATE content_json=?, updated_at=?`,
              [step, content, updated, projectId, owner, content, updated]
            );
            return { affectedRows: result.affectedRows > 0 ? 1 : 0 };
          }
          const statement = query.startsWith('DELETE FROM rate_buckets')
            ? "DELETE FROM academy_rate_buckets WHERE bucket=CONCAT('academy-login-email:',(SELECT email_hash FROM academy_users WHERE id=?))"
            : query.replace(/^INSERT OR IGNORE INTO /, 'INSERT IGNORE INTO ');
          const [result] = await pool.execute(statement, args);
          return result;
        }
        return {
          async first() { return (await execute())[0] || null; },
          async all() { return { results: await execute() }; },
          async run() { return { meta: { changes: (await execute()).affectedRows } }; }
        };
      }};
    }
  };
}

// Production gets its own physical tables, preserving the existing staging workspace.
function academyTableScope(pool, production = false) {
  if (!production) return pool;
  const map = sql => sql.replace(/\bacademy_(users|projects|project_steps|login_challenges|sessions|rate_buckets)\b/g, 'danini_public_academy_$1');
  const scoped = connection => ({
    execute(sql, args) { return connection.execute(map(sql), args); },
    beginTransaction: () => connection.beginTransaction(),
    commit: () => connection.commit(),
    rollback: () => connection.rollback(),
    release: () => connection.release()
  });
  return {
    execute(sql, args) { return pool.execute(map(sql), args); },
    async getConnection() { return scoped(await pool.getConnection()); }
  };
}
async function initializeAcademy(pool, production = false) {
  const scoped = academyTableScope(pool, production);
  for (const statement of schema) await scoped.execute(statement);
  return createAcademyDatabase(scoped);
}

module.exports = { initializeAcademy, createAcademyDatabase, academyTableScope };
