const express = require('express');
const { getTier } = require('../config/tiers');
const { DISCLAIMERS, BADGES } = require('../config/disclaimers');

const router = express.Router();

router.get('/7-eur', (req, res) => {
  const tier = getTier('START');

  res.json({
    entry: {
      label: 'ENTRY 7 EUR',
      tier: tier.id,
      included: {
        projectMode: true,
        gateSystem: tier.gates,
        activationPack: true,
        artifactRights: 'USER_OWNED',
        supportInfrastructure: true,
        reviewbookAccess: true
      },
      generatedArtifacts: [
        'texts',
        'tables',
        'strategies',
        'structures',
        'translations',
        'analysis',
        'website concepts',
        'promotion concepts'
      ],
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
  });
});

module.exports = router;
