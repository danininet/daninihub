'use strict';

const crypto = require('crypto');
const db = require('./db.js');

const TOKEN_COSTS = Object.freeze({
  light: 5,
  medium: 15,
  heavy: 50
});

const MEDIUM_AGENTS = new Set([
  'research.intent.analyst',
  'seo.keyword.master',
  'market.competitor.analyst'
]);

const HEAVY_AGENTS = new Set([
  'pdf_generator',
  'core.artifact.system',
  'content.ebook.formatter'
]);

function tokenCostForAgent(agentId) {
  if (HEAVY_AGENTS.has(agentId)) return TOKEN_COSTS.heavy;
  if (MEDIUM_AGENTS.has(agentId)) return TOKEN_COSTS.medium;
  return TOKEN_COSTS.light;
}

function normalizeTask(rawTask) {
  if (typeof rawTask !== 'string' || !rawTask.trim()) {
    throw new Error('TASK_REQUIRED');
  }

  const source = rawTask.trim();
  const modeMatch = source.match(/^MODE:\s*([A-Z0-9_-]+)\s*$/im);
  const ownerTaskMatch = source.match(/^OWNER TASK:\s*([\s\S]+)$/im);

  return {
    raw: source,
    mode: modeMatch ? modeMatch[1].toUpperCase() : 'GENERAL',
    ownerTask: ownerTaskMatch ? ownerTaskMatch[1].trim() : source
  };
}

function executionIdFor(task) {
  const digest = crypto
    .createHash('sha256')
    .update(`${Date.now()}:${task.raw}`)
    .digest('hex')
    .slice(0, 16);

  return `dos_${digest}`;
}

/**
 * CORE GUARD: atomic token debit before a paid agent execution.
 */
async function autorizujIPokreniAgenta(userId, agentId) {
  if (!Number.isInteger(Number(userId)) || Number(userId) <= 0) {
    return { dozvoljeno: false, poruka: 'Neispravan userId.' };
  }

  if (typeof agentId !== 'string' || !agentId.trim()) {
    return { dozvoljeno: false, poruka: 'Neispravan agentId.' };
  }

  const normalizedAgentId = agentId.trim();
  const cenaTokena = tokenCostForAgent(normalizedAgentId);
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      'SELECT balance FROM token_ledger WHERE user_id = ? FOR UPDATE',
      [Number(userId)]
    );

    if (rows.length === 0) {
      throw new Error('Korisnik nema otvoren token račun.');
    }

    const trenutnoStanje = Number(rows[0].balance);
    if (!Number.isFinite(trenutnoStanje) || trenutnoStanje < cenaTokena) {
      throw new Error(
        `Nedovoljno DH-TOKENA. Potrebno: ${cenaTokena}, Raspoloživo: ${trenutnoStanje || 0}.`
      );
    }

    const novoStanje = trenutnoStanje - cenaTokena;

    await connection.query(
      'UPDATE token_ledger SET balance = ? WHERE user_id = ?',
      [novoStanje, Number(userId)]
    );

    await connection.query(
      'INSERT INTO audit_logs (user_id, action, agent_id, tokens_spent) VALUES (?, ?, ?, ?)',
      [Number(userId), 'AGENT_EXECUTION', normalizedAgentId, cenaTokena]
    );

    await connection.commit();

    return {
      dozvoljeno: true,
      preostalo: novoStanje,
      potroseno: cenaTokena,
      agentId: normalizedAgentId,
      poruka: 'Agent odobren.'
    };
  } catch (error) {
    await connection.rollback();
    return { dozvoljeno: false, poruka: error.message };
  } finally {
    connection.release();
  }
}

/**
 * Stable orchestration entry point used by danini.js.
 *
 * The executor is dependency-injected so the core contract can be tested in
 * dry-run mode without a database, model provider, filesystem mutation or
 * production secrets. A concrete runtime executor will be connected in the
 * next layer; until then apply mode fails closed instead of claiming success.
 */
async function runAgentExecutionTask(rawTask, options = {}) {
  const task = normalizeTask(rawTask);
  const applyChanges = options.applyChanges !== false;
  const executor = options.executor;
  const executionId = executionIdFor(task);
  const startedAt = new Date().toISOString();

  const envelope = {
    ok: true,
    system: 'Danini OS',
    executionId,
    mode: task.mode,
    ownerTask: task.ownerTask,
    applyChanges,
    startedAt
  };

  if (!applyChanges) {
    return {
      ...envelope,
      status: 'dry_run',
      completedAt: new Date().toISOString(),
      result: {
        accepted: true,
        mutationsApplied: false
      }
    };
  }

  if (typeof executor !== 'function') {
    return {
      ...envelope,
      ok: false,
      status: 'blocked',
      completedAt: new Date().toISOString(),
      error: {
        code: 'EXECUTOR_NOT_CONNECTED',
        message: 'Danini OS execution contract radi, ali produkcioni executor još nije povezan.'
      }
    };
  }

  try {
    const result = await executor(task, {
      executionId,
      startedAt,
      context: options.context || {}
    });

    return {
      ...envelope,
      status: 'completed',
      completedAt: new Date().toISOString(),
      result
    };
  } catch (error) {
    return {
      ...envelope,
      ok: false,
      status: 'failed',
      completedAt: new Date().toISOString(),
      error: {
        code: error.code || 'AGENT_EXECUTION_FAILED',
        message: error.message
      }
    };
  }
}

module.exports = {
  autorizujIPokreniAgenta,
  normalizeTask,
  runAgentExecutionTask,
  tokenCostForAgent
};
