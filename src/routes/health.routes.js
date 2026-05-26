const express = require('express');
const { envSnapshot } = require('../config/env');
const { ok } = require('../core/response.contract');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(ok({
    service: 'DaniniHub',
    runtime: 'express-node',
    environment: envSnapshot(),
    checks: {
      routing: 'active',
      audit: 'active',
      validator: 'active',
      orchestrator: 'blocked',
      database: 'blocked',
      stripe: 'blocked',
      brevo: 'blocked'
    }
  }));
});

module.exports = router;
