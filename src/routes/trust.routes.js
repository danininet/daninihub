const express = require('express');
const {
  TRUST_BADGES,
  DISCLAIMER_LIBRARY,
  VISUAL_RULES
} = require('../config/ui-trust-elements');
const { ok } = require('../core/response.contract');

const router = express.Router();

router.get('/', (req, res) => {
  return res.json(ok({
    badges: TRUST_BADGES,
    disclaimers: DISCLAIMER_LIBRARY,
    visualRules: VISUAL_RULES,
    publicPrinciples: {
      noFakeTestimonials: true,
      noFakeMetrics: true,
      noFakeUrgency: true,
      noGuaranteeClaims: true,
      aiTransparencyRequired: true,
      humanReviewRequired: true
    }
  }));
});

module.exports = router;
