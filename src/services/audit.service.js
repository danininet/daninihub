const { query } = require('../db');

async function writeAuditLog(entry) {
  await query(
    `INSERT INTO audit_log (
      actor_type,
      actor_id,
      action,
      mode,
      input_summary,
      files_touched,
      test_command,
      test_result,
      decision
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.actorType,
      entry.actorId || null,
      entry.action,
      entry.mode || null,
      entry.inputSummary || null,
      entry.filesTouched || null,
      entry.testCommand || null,
      entry.testResult || null,
      entry.decision || 'INFO'
    ]
  );
}

module.exports = {
  writeAuditLog
};
