const { getGate } = require('../config/gates');
const { registerUsage } = require('./ledger.service');

const executions = [];

function executeGate(payload) {
  const gate = getGate(payload.gateId);

  if (!gate) {
    throw new Error(`Gate ${payload.gateId} not found`);
  }

  const execution = {
    executionId: `gate_${Date.now()}`,
    timestamp: new Date().toISOString(),
    gate,
    projectId: payload.projectId,
    userId: payload.userId,
    decision: payload.decision,
    artifactIntent: payload.artifactIntent || [],
    generatedOutputs: payload.generatedOutputs || []
  };

  executions.push(execution);

  registerUsage({
    projectId: payload.projectId,
    userId: payload.userId,
    source: gate.code,
    mode: 'PROJECT_MODE',
    systemPowerUsed: gate.systemPowerCost,
    status: 'recorded'
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
