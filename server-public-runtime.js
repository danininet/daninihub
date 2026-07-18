'use strict';

const crypto = require('crypto');
const express = require('express');
const fs = require('fs');
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
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });
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

  app.get(/^\/en\/?$/, (req, res) => res.redirect(308, '/de/'));

  const legacyGoneRoutes = [
    /^\/en\/.+$/, '/analyse-starten', '/de/method', '/de/project-mode', '/de/levels', '/de/artifacts',
    '/de/trust', '/de/activation', '/de/ki-transparenz', '/de/affiliate-hinweis',
    '/sr/metoda', '/sr/projektni-rezim', '/sr/nivoi', '/sr/artefakti', '/sr/poverenje',
    '/sr/aktivacija', '/sr/ai-transparentnost', '/sr/affiliate-napomena', '/sr/projektni-mod',
    '/sr/centar-poverenja',
    '/api/entry/12-eur/checkout'
  ];
  legacyGoneRoutes.forEach(route => app.get(route, (req, res) => {
    res.set('X-Robots-Tag', 'noindex');
    res.status(410).type('text/plain').send('Gone');
  }));

  const routePairs = [
    ['/de/', '/sr/'],
    ['/de/leistungsrahmen', '/sr/obim-usluge'],
    ['/de/continuity-support', '/sr/kontinuitet-podrska'],
    ['/de/fahrerkommunikation', '/sr/komunikacija-vozaci'],
    ['/de/pilot-check', '/sr/provera-pilota'],
    ['/de/praxis-wissen', '/sr/praksa-znanje'],
    ['/de/praxis-wissen/warum-tms-disponenten-nicht-ersetzen', '/sr/praksa-znanje/zasto-tms-ne-menja-disponente'],
    ['/de/praxis-wissen/eta-ist-keine-zusage', '/sr/praksa-znanje/eta-nije-obecanje'],
    ['/de/praxis-wissen/fahrerkommunikation-balkan-dach', '/sr/praksa-znanje/komunikacija-sa-vozacima-balkan-dach'],
    ['/de/pilot-beispiel', '/sr/primer-pilota'],
    ['/de/operations-desk-demo', '/sr/operativni-pult-demo'],
    ['/de/impressum', '/sr/impressum'],
    ['/de/datenschutz', '/sr/privatnost'],
    ['/de/cookies', '/sr/kolacici'],
    ['/de/haftungsausschluss', '/sr/odricanje-odgovornosti'],
    ['/de/glossar', '/sr/recnik']
  ];
  const seo = {
    '/de/': ['DaniniHub Transport & Logistics | Balkan–DACH Operations Support', 'Operative Transport-Unterstützung zwischen Balkan und DACH: Kommunikation, Status, Termine, Dokumente und klar begrenzte Zuständigkeiten.'],
    '/sr/': ['DaniniHub Transport & Logistics | Balkan–DACH operativna podrška', 'Operativna podrška transportnim firmama između Balkana i DACH regiona: komunikacija, statusi, termini i dokumentacija.'],
    '/de/leistungsrahmen': ['Leistungsrahmen für Transport Operations | DaniniHub', 'Klar begrenzte operative Unterstützung für Status, ETA, Fahrerkommunikation, Dokumente und Eskalationen im Balkan–DACH-Transport.'],
    '/sr/obim-usluge': ['Obim operativne podrške u transportu | DaniniHub', 'Jasno ograničena podrška za statuse, ETA, vozače, dokumentaciju i eskalacije u Balkan–DACH transportu.'],
    '/de/continuity-support': ['Continuity Support für Transportteams | DaniniHub', 'Operative Unterstützung bei Urlaub, Krankheit, Spitzenlast und fehlender Abendkapazität – mit klaren Aufgaben und Übergaben.'],
    '/sr/kontinuitet-podrska': ['Podrška kontinuitetu transportnih timova | DaniniHub', 'Operativna podrška tokom odmora, bolovanja, vršnog opterećenja i manjka kapaciteta, uz jasne zadatke i predaju.'],
    '/de/fahrerkommunikation': ['Mehrsprachige Fahrerkommunikation Balkan–DACH | DaniniHub', 'Deutschsprachige Schnittstelle für Fahrer aus dem Balkanraum: Status, ETA, Anweisungen, Rückfragen und dokumentierte Eskalation.'],
    '/sr/komunikacija-vozaci': ['Višejezička komunikacija sa vozačima | DaniniHub', 'Nemačka komunikaciona veza za vozače sa Balkana: status, ETA, instrukcije, pitanja i dokumentovana eskalacija.'],
    '/de/pilot-check': ['Pilot-Check für Transport Operations | DaniniHub', 'Prüfen Sie strukturiert, ob ein begrenzter DaniniHub-Pilot zu Relationen, Fahrzeugzahl und operativem Engpass passt.'],
    '/sr/provera-pilota': ['Provera pilota za transportnu operativu | DaniniHub', 'Proverite strukturisano da li ograničeni DaniniHub pilot odgovara relacijama, broju vozila i operativnom problemu.'],
    '/de/praxis-wissen': ['Praxis & Wissen für Transportteams | DaniniHub', 'Fachbeiträge, Checklisten und Praxisbeispiele zu Disposition, ETA, Fahrerkommunikation und Balkan–DACH-Transporten.'],
    '/sr/praksa-znanje': ['Praksa i znanje za transportne timove | DaniniHub', 'Stručni članci, kontrolne liste i praktični primeri o dispoziciji, ETA, komunikaciji i Balkan–DACH transportu.'],
    '/de/praxis-wissen/warum-tms-disponenten-nicht-ersetzen': ['Warum TMS-Systeme Disponenten nicht ersetzen | DaniniHub', 'Fachbeitrag über die operative Lücke zwischen TMS-Daten, Fahrerkommunikation, Entscheidung, Eskalation und Schichtübergabe.'],
    '/sr/praksa-znanje/zasto-tms-ne-menja-disponente': ['Zašto TMS sistemi ne menjaju disponente | DaniniHub', 'Stručni članak o praznini između TMS podataka, komunikacije sa vozačem, odluke, eskalacije i predaje smene.'],
    '/de/praxis-wissen/eta-ist-keine-zusage': ['ETA ist keine Zusage: Transportstatus richtig kommunizieren | DaniniHub', 'Plantermin, operative ETA, bestätigten Kundentermin und nächsten Prüfpunkt in der Transportkommunikation klar trennen.'],
    '/sr/praksa-znanje/eta-nije-obecanje': ['ETA nije obećanje: pravilna komunikacija statusa | DaniniHub', 'Kako jasno razdvojiti planirani termin, operativnu ETA, termin potvrđen klijentu i sledeću proveru u transportnoj komunikaciji.'],
    '/de/praxis-wissen/fahrerkommunikation-balkan-dach': ['Fahrerkommunikation Balkan–DACH: Wo Informationsfehler Kosten verursachen | DaniniHub', 'Praxisstandard für eindeutige, sichere und dokumentierte Fahrerkommunikation auf Balkan–DACH-Transportrelationen.'],
    '/sr/praksa-znanje/komunikacija-sa-vozacima-balkan-dach': ['Balkan–DACH komunikacija sa vozačima: gde greške stvaraju troškove | DaniniHub', 'Praktičan standard za jasnu, bezbednu i dokumentovanu komunikaciju sa vozačima na Balkan–DACH transportnim relacijama.'],
    '/de/pilot-beispiel': ['Pilot-Beispiel für Transport Operations | DaniniHub', 'Fiktive Simulation eines begrenzten Operations Supports mit Status, ETA, Abweichung und dokumentierter Eskalation.'],
    '/sr/primer-pilota': ['Primer pilota za transportnu operativu | DaniniHub', 'Fiktivna simulacija ograničene operativne podrške sa statusom, ETA, odstupanjem i dokumentovanom eskalacijom.'],
    '/de/operations-desk-demo': ['Interaktiver Transport Operations Desk | DaniniHub', 'Interaktive DaniniHub-Simulation einer Transporttour mit Statuspunkten, ETA, Abweichung, Eskalation und Übergabe.'],
    '/sr/operativni-pult-demo': ['Interaktivni transportni operativni pult | DaniniHub', 'Interaktivna DaniniHub simulacija ture sa statusima, ETA, odstupanjem, eskalacijom i predajom.'],
    '/de/glossar': ['Transport-Glossar Deutsch–Serbisch | DaniniHub', 'Praxisnahes deutsch-serbisches Glossar für Disposition, Fahrerkommunikation, Dokumente, Zoll und Balkan–DACH-Transporte.'],
    '/sr/recnik': ['Nemačko-srpski rečnik transporta | DaniniHub', 'Praktičan nemačko-srpski rečnik za dispoziciju, vozače, dokumentaciju, carinu i Balkan–DACH transport.'],
    '/de/impressum': ['Impressum | DaniniHub Transport & Logistics', 'Anbieterkennzeichnung und Kontaktdaten von DaniniHub Transport & Logistics in Duisburg.'],
    '/sr/impressum': ['Impresum | DaniniHub Transport & Logistics', 'Podaci o pružaocu usluge i kontakt DaniniHub Transport & Logistics u Duisburgu.'],
    '/de/datenschutz': ['Datenschutzerklärung | DaniniHub', 'Informationen zur Verarbeitung von Kontakt-, Hosting- und E-Mail-Daten bei DaniniHub gemäß DSGVO.'],
    '/sr/privatnost': ['Zaštita podataka | DaniniHub', 'Informacije o obradi kontaktnih, hosting i e-mail podataka u DaniniHub-u prema GDPR-u.'],
    '/de/cookies': ['Cookies und externe Inhalte | DaniniHub', 'Informationen zu Cookies, Tracking und externen Inhalten auf der DaniniHub-Website.'],
    '/sr/kolacici': ['Kolačići i spoljni sadržaji | DaniniHub', 'Informacije o kolačićima, praćenju i spoljnim sadržajima na DaniniHub sajtu.'],
    '/de/haftungsausschluss': ['Haftungsausschluss | DaniniHub', 'Leistungsgrenzen und rechtliche Hinweise zur operativen Transport-Unterstützung von DaniniHub.'],
    '/sr/odricanje-odgovornosti': ['Odricanje odgovornosti | DaniniHub', 'Granice usluge i pravne napomene za DaniniHub operativnu podršku u transportu.']
  };
  const htmlTemplate = () => fs.readFileSync(path.join(front, 'index.html'), 'utf8');
  const renderSeoPage = route => {
    const normalized = route === '/de' ? '/de/' : route === '/sr' ? '/sr/' : route;
    const language = normalized.startsWith('/sr') ? 'sr' : 'de';
    const pair = routePairs.find(([de, sr]) => de === normalized || sr === normalized) || routePairs[0];
    const [title, description] = seo[normalized] || (language === 'sr' ? seo['/sr/'] : seo['/de/']);
    const canonical = `https://daninihub.com${normalized}`;
    const isArticle = /warum-tms-disponenten-nicht-ersetzen|zasto-tms-ne-menja-disponente|eta-ist-keine-zusage|eta-nije-obecanje|fahrerkommunikation-balkan-dach|komunikacija-sa-vozacima-balkan-dach/.test(normalized);
    const datePublished = /fahrerkommunikation-balkan-dach|komunikacija-sa-vozacima-balkan-dach/.test(normalized) ? '2026-07-19' : '2026-07-18';
    const dateModified = /eta-ist-keine-zusage|eta-nije-obecanje|fahrerkommunikation-balkan-dach|komunikacija-sa-vozacima-balkan-dach/.test(normalized) ? '2026-07-19' : '2026-07-18';
    const articleSchema = isArticle ? `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title.replace(' | DaniniHub', ''),
      description,
      datePublished,
      dateModified,
      inLanguage: language === 'sr' ? 'sr' : 'de',
      mainEntityOfPage: canonical,
      author: { '@type': 'Person', name: 'Dragan Zdravković' },
      publisher: { '@type': 'Organization', name: 'DaniniHub', url: 'https://daninihub.com', logo: { '@type': 'ImageObject', url: 'https://daninihub.com/logo-mark.svg' } }
    })}</script>` : '';
    return htmlTemplate()
      .replace('<html lang="de">', `<html lang="${language}">`)
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
      .replace(/<meta name="description" content="[^"]*"\/>/, `<meta name="description" content="${description}"/>`)
      .replace(/<link rel="canonical" href="[^"]*"\/>/, `<link rel="canonical" href="${canonical}"/>`)
      .replace(/<link rel="alternate" hreflang="de" href="[^"]*"\/>/, `<link rel="alternate" hreflang="de" href="https://daninihub.com${pair[0]}"/>`)
      .replace(/<link rel="alternate" hreflang="sr" href="[^"]*"\/>/, `<link rel="alternate" hreflang="sr" href="https://daninihub.com${pair[1]}"/>`)
      .replace(/<link rel="alternate" hreflang="x-default" href="[^"]*"\/>/, `<link rel="alternate" hreflang="x-default" href="https://daninihub.com${pair[0]}"/>`)
      .replace(/<meta property="og:title" content="[^"]*"\/>/, `<meta property="og:title" content="${title}"/>`)
      .replace(/<meta property="og:description" content="[^"]*"\/>/, `<meta property="og:description" content="${description}"/>`)
      .replace(/<meta property="og:url" content="[^"]*"\/>/, `<meta property="og:url" content="${canonical}"/>`)
      .replace('</head>', `${articleSchema}</head>`);
  };
  const siteRoutes = routePairs.flat();
  app.get('/', (req, res) => res.redirect(308, '/de/'));
  app.get(/^\/(?:de|sr)$/, (req, res) => res.redirect(308, `${req.path}/`));
  siteRoutes.forEach(route => app.get(route, (req, res) => {
    res.type('html').send(renderSeoPage(route));
  }));

  app.get('/robots.txt', (req, res) => res.type('text/plain').send(
    'User-agent: *\nAllow: /\nSitemap: https://daninihub.com/sitemap.xml\n'
  ));
  app.get('/sitemap.xml', (req, res) => res.type('application/xml').send(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    siteRoutes.map(route => `<url><loc>https://daninihub.com${route}</loc></url>`).join('') +
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
