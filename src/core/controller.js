const { blocked, validationError, ok } = require('./response.contract');

const ALLOWED_DECISIONS = new Set(['GO', 'REDEFINE', 'STOP']);

function validateDecisionPayload(payload = {}) {
  if (!payload.projectId || !payload.userId) {
    return validationError('projectId and userId are required.');
  }

  if (!ALLOWED_DECISIONS.has(payload.decision)) {
    return validationError('decision must be GO, REDEFINE or STOP.');
  }

  return ok({ controller: 'passed' });
}

function requireConnectedModule(moduleName, configured) {
  if (!configured) {
    return blocked(moduleName, 'not_configured');
  }

  return ok({ module: moduleName, status: 'available' });
}

function blockGeneratedOutputUntilValidated(moduleName) {
  return blocked(moduleName, 'controller_validation_required', {
    generatedOutputs: [],
    rule: 'No generated output is accepted before orchestrator and controller validation.'
  });
}

module.exports = {
  validateDecisionPayload,
  requireConnectedModule,
  blockGeneratedOutputUntilValidated
};
