const express = require('express');
const { listAddons, getAddon } = require('../config/addons');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    addons: listAddons(),
    transparency: {
      hiddenFees: false,
      hiddenUsage: false,
      publicLedgerPrinciple: true
    }
  });
});

router.get('/:addonId', (req, res) => {
  const addon = getAddon(req.params.addonId);

  if (!addon) {
    return res.status(404).json({
      status: 'not_found',
      addonId: req.params.addonId
    });
  }

  return res.json({
    addon,
    usageModel: {
      type: 'SYSTEM_POWER_EXTENSION',
      transferableArtifacts: true,
      userOwnership: true
    }
  });
});

module.exports = router;
