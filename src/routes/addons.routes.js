const express = require('express');
const { listAddons, getAddon } = require('../config/addons');
const { ok, validationError } = require('../core/response.contract');

const router = express.Router();

router.get('/', (req, res) => {
  return res.json(ok({
    addons: listAddons(),
    transparency: {
      hiddenFees: false,
      hiddenUsage: false,
      publicLedgerPrinciple: true,
      fakeScarcity: false,
      fakeDiscounts: false
    },
    paymentStack: {
      stripe: 'blocked',
      checkout: 'blocked',
      invoice: 'blocked'
    }
  }));
});

router.get('/:addonId', (req, res) => {
  const addon = getAddon(req.params.addonId);

  if (!addon) {
    return res.status(404).json(
      validationError('Addon not found.')
    );
  }

  return res.json(ok({
    addon,
    usageModel: {
      type: 'SYSTEM_POWER_EXTENSION',
      transferableArtifacts: false,
      userOwnership: true,
      activeCheckout: false
    }
  }));
});

module.exports = router;
