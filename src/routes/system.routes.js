const express = require('express');
const { ok } = require('../core/response.contract');
const { getLocales } = require('../config/localization');
const { getLegalPages } = require('../config/legal-pages');
const {
  TRUST_BADGES,
  DISCLAIMER_LIBRARY,
  VISUAL_RULES
} = require('../config/ui-trust-elements');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(ok({
    runtime: 'express-node',
    mode: 'project-mode',
    authority: [
      'Owner',
      'Meta Commander',
      'Core Orchestrator',
      'Operational Agents',
      'Controller'
    ],
    principles: [
      'Pitaj AI — AI pita tebe',
      'No hallucination',
      'Human decision authority',
      'Evidence-first execution',
      'DACH-first legal and operational standard'
    ],
    localization: getLocales(),
    legalPages: getLegalPages(),
    trust: {
      badges: TRUST_BADGES,
      disclaimers: DISCLAIMER_LIBRARY,
      visualRules: VISUAL_RULES
    },
    modules: {
      orchestrator: 'runtime_shell_active',
      validator: 'active',
      audit: 'active',
      legalRegistry: 'active',
      localizationRegistry: 'active',
      trustRegistry: 'active',
      stripe: 'blocked',
      brevo: 'blocked',
      database: 'blocked'
    }
  }));
});

module.exports = router;
