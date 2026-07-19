'use strict';

const fs = require('fs');
const path = require('path');

function databaseConfigured(env) {
  return Boolean(env.DB_HOST && env.DB_USER && env.DB_NAME);
}

function nowIso() {
  return new Date().toISOString();
}

function parseRow(row) {
  if (!row) return null;
  return {
    caseId: row.case_id,
    status: row.status,
    approval: row.approval,
    payload: typeof row.payload_json === 'string' ? JSON.parse(row.payload_json) : row.payload_json,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

class DispatchCaseStore {
  constructor(options = {}) {
    this.env = options.env || process.env;
    this.storageFile = options.storageFile || path.join(__dirname, 'runtime', 'dispatch-cases.json');
    this.mysql = options.mysql || null;
    this.pool = null;
    this.mode = databaseConfigured(this.env) ? 'mysql' : 'file';
    this.initialized = false;
    this.fileQueue = Promise.resolve();
  }

  initializeFileStore() {
    fs.mkdirSync(path.dirname(this.storageFile), { recursive: true });
    if (!fs.existsSync(this.storageFile)) fs.writeFileSync(this.storageFile, '{}\n', { mode: 0o600 });
  }

  async init() {
    if (this.initialized) return;
    if (this.mode === 'mysql') {
      const mysql = this.mysql || require('mysql2/promise');
      try {
        this.pool = mysql.createPool({
          host: this.env.DB_HOST,
          port: this.env.DB_PORT ? Number(this.env.DB_PORT) : undefined,
          user: this.env.DB_USER,
          password: this.env.DB_PASSWORD,
          database: this.env.DB_NAME,
          waitForConnections: true,
          connectionLimit: 5,
          queueLimit: 0
        });
        await this.pool.execute(`
          CREATE TABLE IF NOT EXISTS danini_dispatch_cases (
            case_id VARCHAR(64) PRIMARY KEY,
            status VARCHAR(40) NOT NULL,
            approval VARCHAR(20) NOT NULL,
            payload_json LONGTEXT NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            INDEX idx_dispatch_status_updated (status, updated_at)
          ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);
      } catch (error) {
        console.error(`Dispatch database unavailable; using protected local fallback: ${error.message}`);
        if (this.pool && typeof this.pool.end === 'function') {
          try { await this.pool.end(); } catch {}
        }
        this.pool = null;
        this.mode = 'file';
        this.initializeFileStore();
      }
    } else {
      this.initializeFileStore();
    }
    this.initialized = true;
  }

  async get(caseId) {
    await this.init();
    if (this.mode === 'mysql') {
      const [rows] = await this.pool.execute('SELECT * FROM danini_dispatch_cases WHERE case_id = ? LIMIT 1', [caseId]);
      return parseRow(rows[0]);
    }
    const records = JSON.parse(fs.readFileSync(this.storageFile, 'utf8'));
    return records[caseId] || null;
  }

  async list(limit = 100) {
    await this.init();
    const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 250));
    if (this.mode === 'mysql') {
      const [rows] = await this.pool.query(`SELECT * FROM danini_dispatch_cases ORDER BY updated_at DESC LIMIT ${safeLimit}`);
      return rows.map(parseRow);
    }
    const records = JSON.parse(fs.readFileSync(this.storageFile, 'utf8'));
    return Object.values(records)
      .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
      .slice(0, safeLimit);
  }

  async upsert(caseRecord) {
    await this.init();
    const existing = await this.get(caseRecord.caseId);
    const createdAt = existing?.createdAt || caseRecord.createdAt || nowIso();
    const updatedAt = nowIso();
    const record = {
      caseId: caseRecord.caseId,
      status: caseRecord.status || 'DRAFT',
      approval: caseRecord.approval || 'PENDING',
      payload: caseRecord.payload,
      createdAt,
      updatedAt
    };
    if (this.mode === 'mysql') {
      await this.pool.execute(
        `INSERT INTO danini_dispatch_cases
          (case_id, status, approval, payload_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          status = VALUES(status), approval = VALUES(approval), payload_json = VALUES(payload_json), updated_at = VALUES(updated_at)`,
        [record.caseId, record.status, record.approval, JSON.stringify(record.payload), new Date(createdAt), new Date(updatedAt)]
      );
      return record;
    }
    return this.withFile(records => {
      records[record.caseId] = record;
      return record;
    });
  }

  withFile(operation) {
    const task = this.fileQueue.then(() => {
      const records = JSON.parse(fs.readFileSync(this.storageFile, 'utf8'));
      const result = operation(records);
      const temporary = `${this.storageFile}.${process.pid}.tmp`;
      fs.writeFileSync(temporary, `${JSON.stringify(records, null, 2)}\n`, { mode: 0o600 });
      fs.renameSync(temporary, this.storageFile);
      return result;
    });
    this.fileQueue = task.catch(() => {});
    return task;
  }
}

function createDispatchCaseStore(options) {
  return new DispatchCaseStore(options);
}

module.exports = { DispatchCaseStore, createDispatchCaseStore, databaseConfigured };
