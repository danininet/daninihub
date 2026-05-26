const express = require('express');
const {
  createArtifact,
  transitionArtifactState,
  getArtifacts
} = require('../services/artifact.service');
const { ok, validationError } = require('../core/response.contract');

const router = express.Router();

router.get('/', (req, res) => {
  return res.json(ok({
    artifacts: getArtifacts(),
    ownershipRule: 'USER_OWNED_OUTPUT'
  }));
});

router.post('/create', (req, res) => {
  try {
    const artifact = createArtifact(req.body);

    return res.status(201).json(ok({
      artifact,
      pipeline: 'validation_required'
    }));
  } catch (error) {
    return res.status(error.status || 500).json(
      validationError(error.message)
    );
  }
});

router.post('/:artifactId/state', (req, res) => {
  try {
    const artifact = transitionArtifactState(
      req.params.artifactId,
      req.body.nextState
    );

    return res.json(ok({
      artifact
    }));
  } catch (error) {
    return res.status(error.status || 500).json(
      validationError(error.message)
    );
  }
});

module.exports = router;
