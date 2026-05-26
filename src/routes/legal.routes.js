const express = require('express');
const { getLegalPages } = require('../config/legal-pages');
const { ok } = require('../core/response.contract');

const router = express.Router();

router.get('/', (req, res) => {
  return res.json(ok({
    region: 'DACH',
    launchRequirement: 'mandatory_before_public_release',
    pages: getLegalPages(),
    transparency: {
      aiDisclosureRequired: true,
      affiliateDisclosureRequired: true,
      noGuaranteeClaims: true,
      independentVerificationRequired: true
    }
  }));
});

module.exports = router;
