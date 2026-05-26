const express = require('express');
const { getSeoRegistry } = require('../config/seo-registry');
const { ok } = require('../core/response.contract');

const router = express.Router();

router.get('/', (req, res) => {
  return res.json(ok({
    seo: getSeoRegistry()
  }));
});

module.exports = router;
