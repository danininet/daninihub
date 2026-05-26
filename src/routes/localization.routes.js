const express = require('express');
const { getLocales } = require('../config/localization');
const { ok } = require('../core/response.contract');

const router = express.Router();

router.get('/', (req, res) => {
  return res.json(ok({
    defaultLocale: 'de',
    marketPriority: 'DACH',
    locales: getLocales(),
    seo: {
      hreflang: true,
      localizedLegalPages: true,
      structuredMetadataRequired: true
    }
  }));
});

module.exports = router;
