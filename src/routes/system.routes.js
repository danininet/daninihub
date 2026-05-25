const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    system: 'DaniniHub',
    mode: 'Project Mode',
    authority: 'Owner -> Meta Commander -> Core Orchestrator -> Operational Agents -> Controller',
    principles: [
      'Pitaj AI — AI pita tebe',
      'No hallucination',
      'Human decision authority',
      'Evidence-first execution',
      'DACH-first legal and operational standard'
    ]
  });
});

module.exports = router;
