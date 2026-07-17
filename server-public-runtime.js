'use strict';

const express = require('express');
const path = require('path');

function mountPublicRuntime(app) {
  const front = path.join(__dirname, 'daninihub-front', 'dist');
  app.use(express.static(front, { index: false }));

  const oldPublicRoutes = [
    '/en', '/en/*', '/de/method', '/de/project-mode', '/de/levels', '/de/artifacts',
    '/sr/metoda', '/sr/projektni-rezim', '/sr/nivoi', '/sr/artefakti',
    '/api/entry/12-eur/checkout'
  ];
  oldPublicRoutes.forEach(route => app.get(route, (req, res) => res.redirect(308, '/de/')));

  const siteRoutes = [
    '/', '/de', '/de/', '/sr', '/sr/',
    '/de/impressum', '/de/datenschutz', '/sr/impressum', '/sr/privatnost'
  ];
  siteRoutes.forEach(route => app.get(route, (req, res) => {
    res.sendFile(path.join(front, 'index.html'));
  }));

  app.get('/robots.txt', (req, res) => res.type('text/plain').send(
    'User-agent: *\nAllow: /\nSitemap: https://daninihub.com/sitemap.xml\n'
  ));
  app.get('/sitemap.xml', (req, res) => res.type('application/xml').send(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://daninihub.com/de/</loc></url><url><loc>https://daninihub.com/sr/</loc></url></urlset>'
  ));
  app.get('/api/public-layer', (req, res) => res.json({
    ok: true,
    service: 'Balkan-DACH Transport Operations Support',
    languages: ['de', 'sr'],
    contact: 'info@daninihub.com'
  }));
}

module.exports = { mountPublicRuntime };
