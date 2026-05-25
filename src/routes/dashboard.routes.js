const express = require('express');
const { getTier } = require('../config/tiers');

const router = express.Router();

router.get('/:tierId', (req, res) => {
  const tier = getTier(req.params.tierId);

  res.json({
    dashboard: 'DaniniHub Project Mode',
    tier,
    modules: {
      projectMode: true,
      gateSystem: true,
      artifactAccess: tier.artifactAccess,
      adminReview: tier.adminReview,
      usageLedger: true
    }
  });
});

module.exports = router;
