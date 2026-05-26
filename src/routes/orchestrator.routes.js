const express = require('express');
const {
  orchestrateProjectMode,
  orchestrateArtifactGeneration,
  runtimeSnapshot
} = require('../core/orchestrator');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(runtimeSnapshot());
});

router.post('/project-mode', (req, res) => {
  const result = orchestrateProjectMode(req.body);

  if (result.status === 'validation_error') {
    return res.status(422).json(result);
  }

  return res.status(503).json(result);
});

router.post('/artifact-generation', (req, res) => {
  const result = orchestrateArtifactGeneration(req.body);

  if (result.status === 'validation_error') {
    return res.status(422).json(result);
  }

  return res.status(503).json(result);
});

module.exports = router;
