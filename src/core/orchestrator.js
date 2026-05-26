const { blocked, ok } = require('./response.contract');
const {
  validateDecisionPayload,
  blockGeneratedOutputUntilValidated
} = require('./controller');

function orchestrateProjectMode(payload = {}) {
  const validation = validateDecisionPayload(payload);

  if (validation.status !== 'ok') {
    return validation;
  }

  return blocked('orchestrator', 'not_connected', {
    projectId: payload.projectId,
    userId: payload.userId,
    decision: payload.decision,
    nextLayer: 'validator',
    outputs: []
  });
}

function orchestrateArtifactGeneration(payload = {}) {
  const validation = validateDecisionPayload(payload);

  if (validation.status !== 'ok') {
    return validation;
  }

  return blockGeneratedOutputUntilValidated('artifact_generation');
}

function runtimeSnapshot() {
  return ok({
    orchestrator: 'runtime_shell_active',
    validator: 'required',
    artifactGeneration: 'blocked',
    autonomousExecution: false
  });
}

module.exports = {
  orchestrateProjectMode,
  orchestrateArtifactGeneration,
  runtimeSnapshot
};
