const express = require('express');
const { getUsageByUser } = require('../services/ledger.service');

const router = express.Router();

router.get('/:userId', (req, res) => {
  const entries = getUsageByUser(req.params.userId);

  res.json({
    userId: req.params.userId,
    entries,
    totalEntries: entries.length,
    unit: 'SYSTEM_POWER'
  });
});

module.exports = router;
