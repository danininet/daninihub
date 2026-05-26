const express = require('express');
const { getTier } = require('../config/tiers');
const { DISCLAIMERS, BADGES } = require('../config/disclaimers');
const { ok, blocked } = require('../core/response.contract');

const router = express.Router();

router.get('/7-eur', (req, res) => {
  const tier = getTier('START');

  return res.status(503).json(ok({
    entry: {
      label: 'ENTRY 7 EUR',
      tier: tier.id,
      price: {
        amount: 7,
        currency: 'EUR',
        status: 'defined_not_sellable'
      },
      includedWhenConnected: {
        oneActiveProject: true,
        gateSystem: tier.gates,
        projectActivationPack: true,
        emailDelivery: true,
        usageLedger: true
      },
      blockedActivation: {
        stripe: blocked('stripe', 'not_configured'),
        brevo: blocked('brevo', 'not_configured'),
        pdf: blocked('project_activation_pack_pdf', 'not_configured'),
        memberAccess: blocked('member_access', 'auth_not_configured')
      },
      badges: [
        BADGES.AI_ASSISTED,
        BADGES.HUMAN_REVIEW_REQUIRED,
        BADGES.USER_OWNED_ARTIFACT
      ],
      disclaimers: [
        DISCLAIMERS.GENERAL,
        DISCLAIMERS.AI,
        DISCLAIMERS.OWNERSHIP
      ]
    }
  }));
});

module.exports = router;
