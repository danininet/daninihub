const express = require('express');
const { GATES } = require('../config/gates');
const { executeGate, getExecutions } = require('../services/gate.service');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    gates: GATES,
    principle: 'Pitaj AI — AI pita tebe'
  });
});

router.get('/executions', (req, res) => {
  res.json({
    executions: getExecutions()
  });
});

router.post('/execute', (req, res) => {
  const execution = executeGate(req.body);

  res.status(201).json({
    status: 'executed',
    execution
  });
});

module.exports = router;
