const express = require('express');
const { getTier } = require('../config/tiers');
const { DISCLAIMERS, BADGES } = require('../config/disclaimers');
const { ok, blocked } = require('../core/response.contract');

const router = express.Router();

router.get('/7-eur', (req, res) => {
  const tier = getTier('START');

  return res.json(ok({
    entry: {
      label: 'ENTRY 7 EUR',
      tier: tier.id,
      price: {
        amount: 7,
        currency: 'EUR',
        status: 'external_checkout_manual_activation_mvp'
      },
      checkout: {
        preferredProvider: 'gumroad',
        reason: 'MVP checkout before Stripe webhook, PDF delivery, Brevo delivery and member access are fully validated.',
        activationRule: 'payment_first_before_resource_intensive_analysis',
        fulfillmentMode: 'manual_or_semiautomatic_until_full_pipeline_validation',
        gumroadProductUrl: process.env.GUMROAD_ENTRY_URL || 'not_configured'
      },
      includedWhenConnected: {
        oneActiveProject: true,
        gateSystem: tier.gates,
        projectActivationPack: true,
        emailDelivery: 'validation_required',
        usageLedger: true,
        artifactPdf: 'validation_required'
      },
      blockedAutomation: {
        stripe: blocked('stripe_full_automation', 'webhook_not_validated'),
        brevo: blocked('brevo_full_delivery', 'email_pipeline_not_validated'),
        pdf: blocked('project_activation_pack_pdf', 'artifact_pipeline_not_validated'),
        memberAccess: blocked('member_access', 'auth_not_validated')
      },
      systemPowerProtection: {
        freePrePaymentAnalysis: false,
        reason: 'DaniniHub does not run resource-intensive project analysis before ENTRY activation.'
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
