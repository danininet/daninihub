'use strict';

const express = require('express');
const path = require('path');
const { BrevoClient } = require('@getbrevo/brevo');

const contactAttempts = new Map();
const clean = (value, max = 3000) => String(value || '').trim().slice(0, max);
const html = value => clean(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function contactAllowed(ip) {
  const now = Date.now();
  const recent = (contactAttempts.get(ip) || []).filter(time => now - time < 15 * 60 * 1000);
  if (recent.length >= 5) return false;
  recent.push(now);
  contactAttempts.set(ip, recent);
  return true;
}

function brevo() {
  if (!process.env.BREVO_API_KEY) throw new Error('BREVO_API_KEY_NOT_CONFIGURED');
  return new BrevoClient({ apiKey: process.env.BREVO_API_KEY }).transactionalEmails;
}

function sender() {
  const email = process.env.BREVO_SENDER_EMAIL || process.env.DANINIHUB_SENDER_EMAIL || process.env.MAIL_FROM || process.env.EMAIL_FROM;
  if (!email) throw new Error('BREVO_SENDER_NOT_CONFIGURED');
  return { email, name: process.env.BREVO_SENDER_NAME || process.env.DANINIHUB_SENDER_NAME || 'DaniniHub Transport & Logistics' };
}

async function sendContactEmails(data) {
  const isSr = /podrška|upoznavanje|organizacijom/i.test(data.interest);
  const details = `
    <h2>Neue DaniniHub Transport-Anfrage</h2>
    <p><strong>Firma/Name:</strong> ${html(data.company)}<br>
    <strong>E-Mail:</strong> ${html(data.email)}<br>
    <strong>Telefon:</strong> ${html(data.phone || '—')}<br>
    <strong>Fahrzeuge:</strong> ${html(data.fleet || '—')}<br>
    <strong>Relationen:</strong> ${html(data.routes || '—')}<br>
    <strong>Interesse:</strong> ${html(data.interest)}</p>
    <p><strong>Nachricht:</strong><br>${html(data.message).replace(/\n/g, '<br>')}</p>`;
  const confirmation = isSr
    ? `<h2>Hvala na upitu.</h2><p>Vaša poruka je stigla u DaniniHub Transport & Logistics. Pregledaću podatke i javiti se lično čim budem mogao.</p><p>Ova potvrda nije prihvatanje transportnog naloga niti pravno obavezujuća ponuda.</p><p>Dragan Zdravković<br>DaniniHub<br>info@daninihub.com</p>`
    : `<h2>Vielen Dank für Ihre Anfrage.</h2><p>Ihre Nachricht ist bei DaniniHub Transport & Logistics eingegangen. Ich prüfe die Angaben und melde mich persönlich, sobald es möglich ist.</p><p>Diese Bestätigung ist keine Annahme eines Transportauftrags und kein rechtsverbindliches Angebot.</p><p>Dragan Zdravković<br>DaniniHub<br>info@daninihub.com</p>`;
  const api = brevo();
  const from = sender();
  return Promise.allSettled([
    api.sendTransacEmail({ sender: from, to: [{ email: 'info@daninihub.com', name: 'DaniniHub' }], replyTo: { email: data.email, name: data.company }, subject: `Transport-Anfrage: ${clean(data.interest, 100)}`, htmlContent: details }),
    api.sendTransacEmail({ sender: from, to: [{ email: data.email, name: data.company }], replyTo: { email: 'info@daninihub.com', name: 'DaniniHub' }, subject: isSr ? 'DaniniHub – vaš upit je primljen' : 'DaniniHub – Ihre Anfrage ist eingegangen', htmlContent: confirmation })
  ]);
}

function mountPublicRuntime(app) {
  const front = path.join(__dirname, 'daninihub-front', 'dist');
  app.post('/api/contact', express.json({ limit: '24kb' }), async (req, res) => {
    const data = Object.fromEntries(Object.entries(req.body || {}).map(([key, value]) => [key, clean(value)]));
    if (data.website) return res.status(202).json({ ok: true });
    if (!contactAllowed(req.ip || 'unknown')) return res.status(429).json({ ok: false, error: 'RATE_LIMITED' });
    if (!data.company || !data.email || !data.message || data.consent !== 'yes' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return res.status(400).json({ ok: false, error: 'INVALID_CONTACT_DATA' });
    }
    try {
      const results = await sendContactEmails(data);
      if (results[0].status !== 'fulfilled') throw results[0].reason;
      return res.status(202).json({ ok: true, confirmationSent: results[1].status === 'fulfilled' });
    } catch (error) {
      console.error('Contact delivery failed:', error.message);
      return res.status(503).json({ ok: false, error: 'CONTACT_DELIVERY_FAILED' });
    }
  });
  app.use(express.static(front, { index: false }));

  const oldPublicRoutes = [
    '/en', /^\/en(?:\/.*)?$/, '/de/method', '/de/project-mode', '/de/levels', '/de/artifacts',
    '/de/trust', '/de/activation', '/de/ki-transparenz', '/de/affiliate-hinweis', '/de/cookies',
    '/sr/metoda', '/sr/projektni-rezim', '/sr/nivoi', '/sr/artefakti', '/sr/poverenje',
    '/sr/aktivacija', '/sr/ai-transparentnost', '/sr/affiliate-napomena', '/sr/kolacici',
    '/api/entry/12-eur/checkout'
  ];
  oldPublicRoutes.forEach(route => app.get(route, (req, res) => res.redirect(308, '/de/')));

  const siteRoutes = [
    '/', '/de', '/de/', '/sr', '/sr/',
    '/de/impressum', '/de/datenschutz', '/de/cookies', '/de/haftungsausschluss', '/de/praxis-wissen', '/de/glossar', '/de/pilot-beispiel',
    '/sr/impressum', '/sr/privatnost', '/sr/kolacici', '/sr/odricanje-odgovornosti', '/sr/praksa-propisi', '/sr/recnik', '/sr/primer-pilota'
  ];
  siteRoutes.forEach(route => app.get(route, (req, res) => {
    res.sendFile(path.join(front, 'index.html'));
  }));

  app.get('/robots.txt', (req, res) => res.type('text/plain').send(
    'User-agent: *\nAllow: /\nSitemap: https://daninihub.com/sitemap.xml\n'
  ));
  app.get('/sitemap.xml', (req, res) => res.type('application/xml').send(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    ['/de/','/sr/','/de/impressum','/de/datenschutz','/de/cookies','/de/haftungsausschluss','/de/praxis-wissen','/de/glossar','/de/pilot-beispiel','/sr/impressum','/sr/privatnost','/sr/kolacici','/sr/odricanje-odgovornosti','/sr/praksa-propisi','/sr/recnik','/sr/primer-pilota'].map(route => `<url><loc>https://daninihub.com${route}</loc></url>`).join('') +
    '</urlset>'
  ));
  app.get('/api/public-layer', (req, res) => res.json({
    ok: true,
    service: 'Balkan-DACH Transport Operations Support',
    languages: ['de', 'sr'],
    contact: 'info@daninihub.com'
  }));
}

module.exports = { mountPublicRuntime };
