const express = require('express');
const { envSnapshot } = require('../config/env');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DaniniHub',
    runtime: 'express',
    timestamp: new Date().toISOString(),
    env: envSnapshot()
  });
});

module.exports = router;
