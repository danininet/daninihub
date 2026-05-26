const { getGate } = require('../config/gates');
const { registerUsage } = require('./ledger.service');

const executions = [];
const ALLOWED_DECISIONS = new Set(['GO', 'REDEFINE', 'STOP']);

function executeGate(payload = {}) {
  const gate = getGate(payload.gateId);

  if (!gate) {
    const error = new Error(`Gate ${payload.gateId} not found`);
    error.status = 404;
    throw error;
  }

  if (!ALLOWED_DECISIONS.has(payload.decision)) {
    const error = new Error('Gate decision must be GO, REDEFINE or STOP.');
    error.status = 422;
    throw error;
  }

  if (!payload.projectId || !payload.userId) {
    const error = new Error('Gate execution requires projectId and userId.');
    error.status = 422;
    throw error;
  }

  const execution = {
    executionId: `gate_${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: 'blocked',
    reason: 'validator_not_connected',
    gate: {
      id: gate.id,
      code: gate.code,
      name: gate.name,
      purpose: gate.purpose
    },
    projectId: payload.projectId,
    userId: payload.userId,
    decision: payload.decision,
    artifactIntent: Array.isArray(payload.artifactIntent) ? payload.artifactIntent : [],
    generatedOutputs: [],
    note: 'No generated gate output is accepted until orchestrator and controller validation are connected.'
  };

  executions.push(execution);

  registerUsage({
    projectId: payload.projectId,
    userId: payload.userId,
    source: gate.code,
    mode: 'PROJECT_MODE_BLOCKED',
    systemPowerUsed: 0,
    status: 'blocked'
  });

  return execution;
}

function getExecutions() {
  return executions;
}

module.exports = {
  executeGate,
  getExecutions
};
