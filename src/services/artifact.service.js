const artifacts = [];

const VALID_STATES = ['DRAFT', 'VALIDATION_REQUIRED', 'BLOCKED', 'ARCHIVED'];

function requireArtifactPayload(payload = {}) {
  if (!payload.userId || !payload.projectId || !payload.title || !payload.type) {
    const error = new Error('Artifact requires userId, projectId, title and type.');
    error.status = 422;
    throw error;
  }
}

function createArtifact(payload = {}) {
  requireArtifactPayload(payload);

  const artifact = {
    id: `artifact_${Date.now()}_${artifacts.length + 1}`,
    createdAt: new Date().toISOString(),
    ownerUserId: payload.userId,
    ownerProjectId: payload.projectId,
    title: payload.title,
    type: payload.type,
    generatedBy: payload.generatedBy || 'blocked_until_controller_validation',
    state: 'VALIDATION_REQUIRED',
    delivery: {
      pdf: 'blocked',
      email: 'blocked',
      download: 'blocked',
      reason: 'artifact_pipeline_not_connected'
    },
    ownership: {
      userOwned: true,
      transferable: false,
      resaleAllowed: false,
      giftingAllowed: false
    },
    badges: Array.isArray(payload.badges) ? payload.badges : [],
    disclaimers: Array.isArray(payload.disclaimers) ? payload.disclaimers : []
  };

  artifacts.push(artifact);

  return artifact;
}

function transitionArtifactState(artifactId, nextState) {
  if (!VALID_STATES.includes(nextState)) {
    const error = new Error(`Invalid artifact state ${nextState}`);
    error.status = 422;
    throw error;
  }

  const artifact = artifacts.find((item) => item.id === artifactId);

  if (!artifact) {
    const error = new Error('Artifact not found');
    error.status = 404;
    throw error;
  }

  artifact.state = nextState;
  artifact.updatedAt = new Date().toISOString();

  return artifact;
}

function getArtifacts() {
  return artifacts;
}

module.exports = {
  createArtifact,
  transitionArtifactState,
  getArtifacts
};
