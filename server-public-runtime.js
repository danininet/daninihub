'use strict';

const crypto = require('crypto');
const express = require('express');
const path = require('path');
const { BrevoClient } = require('@getbrevo/brevo');

const contactAttempts = new Map();
const clean = (value, max = 3000) => String(value || '').trim().slice(0, max);
const html = value => clean(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const valueOrDash = value => html(value || '—');

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

function pilotReference() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `DH-PILOT-${date}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

function standardAdminEmail(data) {
  return `
    <h2>Neue DaniniHub Transport-Anfrage</h2>
    <p><strong>Firma/Name:</strong> ${html(data.company)}<br>
    <strong>E-Mail:</strong> ${html(data.email)}<br>
    <strong>Telefon:</strong> ${valueOrDash(data.phone)}<br>
    <strong>Fahrzeuge:</strong> ${valueOrDash(data.fleet)}<br>
    <strong>Relationen:</strong> ${valueOrDash(data.routes)}<br>
    <strong>Interesse:</strong> ${html(data.interest)}</p>
    <p><strong>Nachricht:</strong><br>${html(data.message).replace(/\n/g, '<br>')}</p>`;
}

function pilotAdminEmail(data, reference) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:760px;margin:auto;color:#17212b">
    <div style="background:#07131f;color:#fff;padding:26px 30px;border-radius:14px 14px 0 0">
      <div style="font-size:12px;letter-spacing:1.4px;color:#62d7e5;font-weight:700">DANINIHUB PILOT DESK</div>
      <h1 style="margin:8px 0 4px;font-size:28px">Neue strukturierte Pilot-Anfrage</h1>
      <div style="color:#b8c7d3">Referenz ${html(reference)}</div>
    </div>
    <div style="border:1px solid #d8e1e8;border-top:0;padding:28px 30px;border-radius:0 0 14px 14px">
      <h2 style="font-size:18px;margin:0 0 14px">Kontakt</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#607180;width:180px">Unternehmen / Name</td><td style="padding:8px 0;font-weight:700">${html(data.company)}</td></tr>
        <tr><td style="padding:8px 0;color:#607180">E-Mail</td><td style="padding:8px 0"><a href="mailto:${html(data.email)}">${html(data.email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#607180">Telefon</td><td style="padding:8px 0">${valueOrDash(data.phone)}</td></tr>
        <tr><td style="padding:8px 0;color:#607180">Sprache</td><td style="padding:8px 0">${data.language === 'sr' ? 'Serbisch' : 'Deutsch'}</td></tr>
      </table>
      <h2 style="font-size:18px;margin:28px 0 14px">Operativer Bedarf</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#607180;width:180px">Fahrzeuge</td><td style="padding:8px 0;font-weight:700">${valueOrDash(data.fleet)}</td></tr>
        <tr><td style="padding:8px 0;color:#607180">Relationen</td><td style="padding:8px 0">${valueOrDash(data.routes)}</td></tr>
        <tr><td style="padding:8px 0;color:#607180">Zeitfresser / Aufgaben</td><td style="padding:8px 0">${valueOrDash(data.tasks)}</td></tr>
        <tr><td style="padding:8px 0;color:#607180">Benötigtes Zeitfenster</td><td style="padding:8px 0">${valueOrDash(data.availability)}</td></tr>
        <tr><td style="padding:8px 0;color:#607180">Systeme / Kanäle</td><td style="padding:8px 0">${valueOrDash(data.systems)}</td></tr>
        <tr><td style="padding:8px 0;color:#607180">Operative Freigabe</td><td style="padding:8px 0">${valueOrDash(data.decision)}</td></tr>
      </table>
      <div style="margin-top:26px;padding:16px 18px;background:#eef8fa;border-left:4px solid #19b7c8">
        <strong>Nächster Schritt</strong><br>
        Bedarf prüfen, Rückfragen vorbereiten und entscheiden, ob ein begrenztes Erstgespräch sinnvoll ist.
      </div>
      <p style="margin-top:24px;color:#607180;font-size:13px">Diese Anfrage ist noch kein Transportauftrag, kein Angebot und keine Annahme eines Leistungsumfangs.</p>
    </div>
  </div>`;
}

function confirmationEmail(data, reference) {
  const isSr = data.language === 'sr' || /podrška|upoznavanje|organizacijom/i.test(data.interest);
  if (data.source === 'pilot-check') {
    return isSr
      ? `<h2>Hvala na strukturisanom pilot-upitu.</h2><p>Podaci iz provere pilota su kompletno prosleđeni DaniniHub-u pod referencom <strong>${html(reference)}</strong>.</p><p>Pregledaću navedene relacije, broj vozila, zadatke, vreme podrške, sisteme i ovlašćenja i javiti se lično čim bude moguće.</p><p>Ova potvrda nije prihvatanje transportnog naloga niti pravno obavezujuća ponuda.</p><p>Dragan Zdravković<br>DaniniHub<br>info@daninihub.com</p>`
      : `<h2>Vielen Dank für Ihre strukturierte Pilot-Anfrage.</h2><p>Ihre Angaben aus dem Pilot-Check wurden vollständig unter der Referenz <strong>${html(reference)}</strong> an DaniniHub übermittelt.</p><p>Ich prüfe Relationen, Fahrzeugzahl, Aufgaben, gewünschtes Zeitfenster, Systeme und Freigaben und melde mich persönlich, sobald es möglich ist.</p><p>Diese Bestätigung ist keine Annahme eines Transportauftrags und kein rechtsverbindliches Angebot.</p><p>Dragan Zdravković<br>DaniniHub<br>info@daninihub.com</p>`;
  }
  return isSr
    ? `<h2>Hvala na upitu.</h2><p>Vaša poruka je stigla u DaniniHub Transport & Logistics. Pregledaću podatke i javiti se lično čim budem mogao.</p><p>Ova potvrda nije prihvatanje transportnog naloga niti pravno obavezujuća ponuda.</p><p>Dragan Zdravković<br>DaniniHub<br>info@daninihub.com</p>`
    : `<h2>Vielen Dank für Ihre Anfrage.</h2><p>Ihre Nachricht ist bei DaniniHub Transport & Logistics eingegangen. Ich prüfe die Angaben und melde mich persönlich, sobald es möglich ist.</p><p>Diese Bestätigung ist keine Annahme eines Transportauftrags und kein rechtsverbindliches Angebot.</p><p>Dragan Zdravković<br>DaniniHub<br>info@daninihub.com</p>`;
}

async function sendContactEmails(data) {
  const isPilot = data.source === 'pilot-check';
  const reference = isPilot ? pilotReference() : null;
  const details = isPilot ? pilotAdminEmail(data, reference) : standardAdminEmail(data);
  const confirmation = confirmationEmail(data, reference);
  const isSr = data.language === 'sr' || /podrška|upoznavanje|organizacijom/i.test(data.interest);
  const api = brevo();
  const from = sender();
  return Promise.allSettled([
    api.sendTransacEmail({
      sender: from,
      to: [{ email: 'info@daninihub.com', name: 'DaniniHub' }],
      replyTo: { email: data.email, name: data.company },
      subject: isPilot ? `[${reference}] Neue Pilot-Anfrage: ${clean(data.company, 80)}` : `Transport-Anfrage: ${clean(data.interest, 100)}`,
      htmlContent: details
    }),
    api.sendTransacEmail({
      sender: from,
      to: [{ email: data.email, name: data.company }],
      replyTo: { email: 'info@daninihub.com', name: 'DaniniHub' },
      subject: isPilot ? (isSr ? `DaniniHub – pilot-upit ${reference}` : `DaniniHub – Pilot-Anfrage ${reference}`) : (isSr ? 'DaniniHub – vaš upit je primljen' : 'DaniniHub – Ihre Anfrage ist eingegangen'),
      htmlContent: confirmation
    })
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
    if (data.source === 'pilot-check' && (!data.fleet || !data.routes || !data.tasks)) {
      return res.status(400).json({ ok: false, error: 'INCOMPLETE_PILOT_DATA' });
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
    '/de/impressum', '/de/datenschutz', '/de/cookies', '/de/haftungsausschluss', '/de/praxis-wissen', '/de/glossar', '/de/pilot-beispiel', '/de/operations-desk-demo', '/de/pilot-check',
    '/sr/impressum', '/sr/privatnost', '/sr/kolacici', '/sr/odricanje-odgovornosti', '/sr/praksa-propisi', '/sr/recnik', '/sr/primer-pilota', '/sr/operativni-pult-demo', '/sr/provera-pilota'
  ];
  siteRoutes.forEach(route => app.get(route, (req, res) => {
    res.sendFile(path.join(front, 'index.html'));
  }));

  app.get('/robots.txt', (req, res) => res.type('text/plain').send(
    'User-agent: *\nAllow: /\nSitemap: https://daninihub.com/sitemap.xml\n'
  ));
  app.get('/sitemap.xml', (req, res) => res.type('application/xml').send(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    ['/de/','/sr/','/de/impressum','/de/datenschutz','/de/cookies','/de/haftungsausschluss','/de/praxis-wissen','/de/glossar','/de/pilot-beispiel','/de/operations-desk-demo','/de/pilot-check','/sr/impressum','/sr/privatnost','/sr/kolacici','/sr/odricanje-odgovornosti','/sr/praksa-propisi','/sr/recnik','/sr/primer-pilota','/sr/operativni-pult-demo','/sr/provera-pilota'].map(route => `<url><loc>https://daninihub.com${route}</loc></url>`).join('') +
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