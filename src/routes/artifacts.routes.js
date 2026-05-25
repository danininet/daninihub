const express = require('express');
const {
  createArtifact,
  transitionArtifactState,
  getArtifacts
} = require('../services/artifact.service');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    artifacts: getArtifacts(),
    ownershipRule: 'USER_OWNED_OUTPUT'
  });
});

router.post('/create', (req, res) => {
  const artifact = createArtifact(req.body);

  res.status(201).json({
    status: 'created',
    artifact
  });
});

router.post('/:artifactId/state', (req, res) => {
  const artifact = transitionArtifactState(
    req.params.artifactId,
    req.body.nextState
  );

  res.json({
    status: 'updated',
    artifact
  });
});

module.exports = router;
