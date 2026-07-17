'use strict';

/**
 * Compatibility layer for installations that still import registerPublicSite.
 * The maintained public experience lives in server-public-runtime.js.
 */
function registerPublicSite(app) {
  app.get('/start', (req, res) => res.redirect(308, '/analyse-starten'));
  app.post('/checkout', (req, res) => res.redirect(303, '/api/entry/12-eur/checkout'));
}

module.exports = { registerPublicSite };
