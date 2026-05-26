const express = require('express');

const router = express.Router();

function blockedRoute(route) {
  return {
    route,
    status: 'blocked',
    reason: 'not_configured',
    system: 'DaniniHub',
    mode: 'constitutional_runtime',
    message: 'Public modules remain disabled until backend orchestration, validation and compliance layers are operational.'
  };
}

router.get('/', (req, res) => {
  res.status(503).json({
    status: 'system_runtime_locked',
    project: 'DaniniHub',
    architecture: 'Express / Node.js',
    publicFrontend: 'disabled',
    governance: 'USTAV-first',
    activeModules: {
      audit: 'active',
      validation: 'active',
      routing: 'active'
    },
    blockedModules: [
      blockedRoute('/methode'),
      blockedRoute('/projektmodus'),
      blockedRoute('/preise'),
      blockedRoute('/reviewbook'),
      blockedRoute('/partner')
    ]
  });
});

module.exports = router;
