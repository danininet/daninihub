const artifacts = [];

const VALID_STATES = ['DRAFT', 'READY', 'DELIVERED', 'ARCHIVED'];

function createArtifact(payload) {
  const artifact = {
    id: `artifact_${Date.now()}`,
    createdAt: new Date().toISOString(),
    ownerUserId: payload.userId,
    ownerProjectId: payload.projectId,
    title: payload.title,
    type: payload.type,
    generatedBy: payload.generatedBy,
    state: 'DRAFT',
    ownership: {
      userOwned: true,
      transferable: true,
      resaleAllowed: true,
      giftingAllowed: true
    },
    badges: payload.badges || [],
    disclaimers: payload.disclaimers || []
  };

  artifacts.push(artifact);

  return artifact;
}

function transitionArtifactState(artifactId, nextState) {
  if (!VALID_STATES.includes(nextState)) {
    throw new Error(`Invalid artifact state ${nextState}`);
  }

  const artifact = artifacts.find((item) => item.id === artifactId);

  if (!artifact) {
    throw new Error('Artifact not found');
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
