const express = require('express');
const {
  getUsageByUser,
  getLedgerSnapshot
} = require('../services/ledger.service');
const { ok, validationError } = require('../core/response.contract');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(ok(getLedgerSnapshot()));
});

router.get('/:userId', (req, res) => {
  if (!req.params.userId) {
    return res.status(422).json(
      validationError('userId is required.')
    );
  }

  const entries = getUsageByUser(req.params.userId);

  return res.json(ok({
    userId: req.params.userId,
    entries,
    totalEntries: entries.length,
    unit: 'SYSTEM_POWER'
  }));
});

module.exports = router;
