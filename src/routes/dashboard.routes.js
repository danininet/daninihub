const express = require('express');
const { getTier } = require('../config/tiers');
const { ok, blocked, validationError } = require('../core/response.contract');

const router = express.Router();

router.get('/:tierId', (req, res) => {
  if (!req.params.tierId) {
    return res.status(422).json(
      validationError('tierId is required.')
    );
  }

  const tier = getTier(req.params.tierId);

  return res.json(ok({
    dashboard: 'DaniniHub Project Mode',
    tier,
    modules: {
      projectMode: blocked('project_mode', 'orchestrator_not_connected'),
      gateSystem: blocked('gate_system', 'validator_not_connected'),
      artifactAccess: blocked('artifact_access', 'artifact_pipeline_not_connected'),
      adminReview: tier.adminReview ? 'pending_runtime' : 'not_enabled',
      usageLedger: 'active'
    }
  }));
});

module.exports = router;
