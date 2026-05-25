const { getAgent } = require('./registry');
const { validateExecution } = require('./guards/validator');
const { assertEvidence } = require('./guards/zeroHallucination');

async function runTask(task) {
  const orchestrator = getAgent('CORE_ORCHESTRATOR');

  if (!orchestrator) {
    throw new Error('Core orchestrator unavailable');
  }

  assertEvidence(task);

  const validation = validateExecution(task);

  return {
    orchestrator: orchestrator.id,
    status: validation.status,
    mode: task.mode || 'UNSPECIFIED',
    timestamp: new Date().toISOString(),
    summary: validation.summary
  };
}

module.exports = {
  runTask
};
