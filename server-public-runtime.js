'use strict';

const crypto = require('crypto');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { BrevoClient } = require('@getbrevo/brevo');
const { createContactLeadStore } = require('./contact-lead-store');

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

function leadReference(isPilot) {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `DH-${isPilot ? 'PILOT' : 'LEAD'}-${date}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

function publicUrl() {
  return String(process.env.DANINI_PUBLIC_URL || 'https://daninihub.com').replace(/\/$/, '');
}

function reviewToken(reference) {
  const secretMaterial = String(process.env.DANINI_ADMIN_SECRET || process.env.DANINI_SESSION_SECRET || process.env.BREVO_API_KEY || '');
  if (!secretMaterial) return '';
  const secret = crypto.createHash('sha256').update(`daninihub-lead-review-v1:${secretMaterial}`).digest();
  return crypto.createHmac('sha256', secret).update(reference).digest('hex');
}

function reviewUrl(reference) {
  const token = reviewToken(reference);
  return token ? `${publicUrl()}/lead-review/${encodeURIComponent(reference)}?token=${token}` : '';
}

function validReviewToken(reference, candidate) {
  const expected = reviewToken(reference);
  const received = clean(candidate, 128);
  if (!expected || expected.length !== received.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

function reviewAction(reference, reviewAvailable = true) {
  if (!reviewAvailable) return '<p><strong>Hinweis:</strong> Die Anfrage wurde per E-Mail zugestellt, konnte aber nicht für die Online-Freigabe gespeichert werden. Bitte antworten Sie in diesem Fall manuell.</p>';
  const url = reviewUrl(reference);
  return url
    ? `<p style="margin:24px 0"><a href="${html(url)}" style="display:inline-block;background:#087f8c;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">Anfrage prüfen und Follow-up freigeben</a></p>`
    : '<p><strong>Hinweis:</strong> Es ist noch kein sicherer serverseitiger Schlüssel konfiguriert. Follow-up kann noch nicht freigegeben werden.</p>';
}

function standardAdminEmail(data, reference, reviewAvailable = true) {
  return `<h2>Neue DaniniHub Transport-Anfrage</h2><p><strong>Referenz:</strong> ${html(reference)}</p><p><strong>Firma/Name:</strong> ${html(data.company)}<br><strong>E-Mail:</strong> ${html(data.email)}<br><strong>Telefon:</strong> ${valueOrDash(data.phone)}<br><strong>Fahrzeuge:</strong> ${valueOrDash(data.fleet)}<br><strong>Relationen:</strong> ${valueOrDash(data.routes)}<br><strong>Interesse:</strong> ${html(data.interest)}</p><p><strong>Nachricht:</strong><br>${html(data.message).replace(/\n/g, '<br>')}</p>${reviewAction(reference, reviewAvailable)}<p style="color:#607180;font-size:13px">Die Vorprüfung ist nur eine Entscheidungshilfe. Ein Follow-up wird erst nach Ihrer persönlichen Freigabe versendet.</p>`;
}

function pilotAdminEmail(data, reference, reviewAvailable = true) {
  return `<div style="font-family:Arial,sans-serif;max-width:760px;margin:auto;color:#17212b"><div style="background:#07131f;color:#fff;padding:26px 30px;border-radius:14px 14px 0 0"><div style="font-size:12px;letter-spacing:1.4px;color:#62d7e5;font-weight:700">DANINIHUB PILOT DESK</div><h1 style="margin:8px 0 4px;font-size:28px">Neue strukturierte Pilot-Anfrage</h1><div style="color:#b8c7d3">Referenz ${html(reference)}</div></div><div style="border:1px solid #d8e1e8;border-top:0;padding:28px 30px;border-radius:0 0 14px 14px"><h2 style="font-size:18px;margin:0 0 14px">Kontakt</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:8px 0;color:#607180;width:180px">Unternehmen / Name</td><td style="padding:8px 0;font-weight:700">${html(data.company)}</td></tr><tr><td style="padding:8px 0;color:#607180">E-Mail</td><td style="padding:8px 0"><a href="mailto:${html(data.email)}">${html(data.email)}</a></td></tr><tr><td style="padding:8px 0;color:#607180">Telefon</td><td style="padding:8px 0">${valueOrDash(data.phone)}</td></tr><tr><td style="padding:8px 0;color:#607180">Sprache</td><td style="padding:8px 0">${data.language === 'sr' ? 'Serbisch' : 'Deutsch'}</td></tr></table><h2 style="font-size:18px;margin:28px 0 14px">Operativer Bedarf</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:8px 0;color:#607180;width:180px">Fahrzeuge</td><td style="padding:8px 0;font-weight:700">${valueOrDash(data.fleet)}</td></tr><tr><td style="padding:8px 0;color:#607180">Relationen</td><td style="padding:8px 0">${valueOrDash(data.routes)}</td></tr><tr><td style="padding:8px 0;color:#607180">Zeitfresser / Aufgaben</td><td style="padding:8px 0">${valueOrDash(data.tasks)}</td></tr><tr><td style="padding:8px 0;color:#607180">Benötigtes Zeitfenster</td><td style="padding:8px 0">${valueOrDash(data.availability)}</td></tr><tr><td style="padding:8px 0;color:#607180">Systeme / Kanäle</td><td style="padding:8px 0">${valueOrDash(data.systems)}</td></tr><tr><td style="padding:8px 0;color:#607180">Operative Freigabe</td><td style="padding:8px 0">${valueOrDash(data.decision)}</td></tr></table><div style="margin-top:26px;padding:16px 18px;background:#eef8fa;border-left:4px solid #19b7c8"><strong>Nächster Schritt</strong><br>Bedarf prüfen, Rückfragen vorbereiten und entscheiden, ob ein klar begrenztes Pilotprojekt sinnvoll ist.</div>${reviewAction(reference, reviewAvailable)}<p style="margin-top:24px;color:#607180;font-size:13px">Diese Anfrage ist noch kein Transportauftrag, kein Angebot und keine Annahme eines Leistungsumfangs.</p></div></div>`;
}

function confirmationEmail(data, reference) {
  const isSr = data.language === 'sr' || /podrška|upoznavanje|organizacijom/i.test(data.interest);
  if (data.source === 'pilot-check') {
    return isSr
      ? `<h2>Hvala na strukturisanom upitu za pilot-projekat.</h2><p>Vaši podaci su bezbedno primljeni pod referencom <strong>${html(reference)}</strong>.</p><p>Lično ću proveriti relacije, broj vozila, zadatke, traženo vreme podrške, sisteme i ovlašćenja. Nakon provere dobićete jasan predlog sledećeg koraka.</p><p>Ova potvrda nije prihvatanje transportnog naloga niti pravno obavezujuća ponuda.</p><p>Dragan Zdravković<br>DaniniHub<br>info@daninihub.com</p>`
      : `<h2>Vielen Dank für Ihre strukturierte Pilot-Anfrage.</h2><p>Ihre Angaben wurden unter der Referenz <strong>${html(reference)}</strong> sicher empfangen.</p><p>Ich prüfe Relationen, Fahrzeugzahl, Aufgaben, gewünschtes Zeitfenster, Systeme und Freigaben persönlich. Anschließend erhalten Sie einen klaren Vorschlag für den nächsten Schritt.</p><p>Diese Bestätigung ist weder die Annahme eines Transportauftrags noch ein rechtsverbindliches Angebot.</p><p>Dragan Zdravković<br>DaniniHub<br>info@daninihub.com</p>`;
  }
  return isSr
    ? `<h2>Hvala na upitu.</h2><p>Vaša poruka je primljena pod referencom <strong>${html(reference)}</strong>. Lično ću proveriti podatke i poslati vam jasan predlog sledećeg koraka.</p><p>Ova potvrda nije prihvatanje transportnog naloga niti pravno obavezujuća ponuda.</p><p>Dragan Zdravković<br>DaniniHub<br>info@daninihub.com</p>`
    : `<h2>Vielen Dank für Ihre Anfrage.</h2><p>Ihre Nachricht wurde unter der Referenz <strong>${html(reference)}</strong> empfangen. Ich prüfe die Angaben persönlich und sende Ihnen anschließend einen klaren Vorschlag für den nächsten Schritt.</p><p>Diese Bestätigung ist weder die Annahme eines Transportauftrags noch ein rechtsverbindliches Angebot.</p><p>Dragan Zdravković<br>DaniniHub<br>info@daninihub.com</p>`;
}

function qualifiedFollowupEmail(lead) {
  const isSr = lead.language === 'sr';
  const pilotCheck = `${publicUrl()}${isSr ? '/sr/provera-pilota' : '/de/pilot-check'}`;
  const defaultBrief = `${publicUrl()}${isSr ? '/sr/primer-pilota' : '/de/pilot-beispiel'}`;
  const brief = clean(isSr ? process.env.DANINI_PILOT_BRIEF_SR_URL : process.env.DANINI_PILOT_BRIEF_DE_URL, 1000) || defaultBrief;
  const demo = `${publicUrl()}${isSr ? '/sr/operativni-pult-demo' : '/de/operations-desk-demo'}`;
  const isPilot = lead.source === 'pilot-check';
  if (!isPilot) return isSr ? { subject:`DaniniHub – sledeći korak za vaš upit ${lead.reference}`, htmlContent:`<h2>Vaš upit je lično pregledan.</h2><p>Hvala, ${html(lead.company)}.</p><p><a href="${html(pilotCheck)}">Pokreni proveru pilota</a></p>` } : { subject:`DaniniHub – nächster Schritt zu Ihrer Anfrage ${lead.reference}`, htmlContent:`<h2>Ihre Anfrage wurde persönlich geprüft.</h2><p>Vielen Dank, ${html(lead.company)}.</p><p><a href="${html(pilotCheck)}">Pilot-Check starten</a></p>` };
  return isSr ? { subject:`DaniniHub – predlog pilota ${lead.reference}`, htmlContent:`<h2>Vaša provera pilota je lično pregledana.</h2><p><a href="${html(brief)}">Pogledaj predlog</a></p><p><a href="${html(demo)}">Otvori demo</a></p>` } : { subject:`DaniniHub – Pilotvorschlag ${lead.reference}`, htmlContent:`<h2>Ihr Pilot-Check wurde persönlich geprüft.</h2><p><a href="${html(brief)}">Vorschlag ansehen</a></p><p><a href="${html(demo)}">Demo öffnen</a></p>` };
}

function mountPublicRuntime(app, options = {}) {
  const front = options.front || path.join(__dirname, 'daninihub-front', 'dist');
  const leadStore = options.leadStore || createContactLeadStore();
  app.use(express.static(front, { index: false, maxAge: '1h' }));

  app.post('/api/contact', express.json({ limit: '100kb' }), async (req, res) => {
    const data = req.body || {};
    if (!contactAllowed(req.ip)) return res.status(429).json({ ok:false, error:'RATE_LIMITED' });
    if (!clean(data.company) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(data.email, 180))) return res.status(400).json({ ok:false, error:'INVALID_CONTACT' });
    const reference = leadReference(data.source === 'pilot-check');
    let stored = true;
    try { await leadStore.create({ ...data, reference, status:'NEW' }); } catch { stored = false; }
    try {
      const api = brevo();
      const from = sender();
      await api.sendTransacEmail({ sender:from, to:[{ email:'info@daninihub.com', name:'DaniniHub' }], replyTo:{ email:clean(data.email,180), name:clean(data.company,180) }, subject:`DaniniHub Anfrage ${reference}`, htmlContent:data.source === 'pilot-check' ? pilotAdminEmail(data, reference, stored) : standardAdminEmail(data, reference, stored) });
      await api.sendTransacEmail({ sender:from, to:[{ email:clean(data.email,180), name:clean(data.company,180) }], replyTo:{ email:'info@daninihub.com', name:'DaniniHub' }, subject:`DaniniHub – Bestätigung ${reference}`, htmlContent:confirmationEmail(data, reference) });
      return res.json({ ok:true, reference });
    } catch (error) {
      console.error('Contact delivery failed:', error.message);
      return res.status(503).json({ ok:false, error:'CONTACT_DELIVERY_FAILED', reference });
    }
  });

  app.get('/lead-review/:reference', async (req, res) => {
    const reference = clean(req.params.reference, 120);
    if (!validReviewToken(reference, req.query.token)) return res.status(403).type('text/plain').send('Invalid token');
    const lead = await leadStore.get(reference);
    if (!lead) return res.status(404).type('text/plain').send('Lead not found');
    res.type('html').send(`<h1>${html(reference)}</h1><p>${html(lead.company)} · ${html(lead.email)}</p><form method="post" action="/lead-review/${encodeURIComponent(reference)}/approve?token=${encodeURIComponent(req.query.token)}"><button>Approve follow-up</button></form>`);
  });

  app.post('/lead-review/:reference/approve', express.urlencoded({ extended:false }), async (req, res) => {
    const reference = clean(req.params.reference, 120);
    if (!validReviewToken(reference, req.query.token)) return res.status(403).type('text/plain').send('Invalid token');
    const lead = await leadStore.get(reference);
    if (!lead) return res.status(404).type('text/plain').send('Lead not found');
    const followup = qualifiedFollowupEmail(lead);
    await brevo().sendTransacEmail({ sender:sender(), to:[{ email:lead.email, name:lead.company }], replyTo:{ email:'info@daninihub.com', name:'DaniniHub' }, subject:followup.subject, htmlContent:followup.htmlContent });
    await leadStore.update(reference, { status:'FOLLOWUP_SENT' });
    return res.type('html').send('<h1>Follow-up sent</h1>');
  });

  const legacyGoneRoutes = ['/de/ki-beratung','/sr/ki-savetovanje','/de/ki-produkte','/sr/ki-proizvodi','/de/vertrauenszentrum','/sr/centar-poverenja','/api/entry/12-eur/checkout'];
  legacyGoneRoutes.forEach(route => app.get(route, (req, res) => { res.set('X-Robots-Tag', 'noindex'); res.status(410).type('text/plain').send('Gone'); }));

  const routePairs = [
    ['/de/', '/sr/'],
    ['/de/dispolab', '/sr/dispo-lab'],
    ['/de/dispolab/check', '/sr/dispo-lab/provera'],
    ['/de/transport-room-demo', '/sr/transportna-soba-demo'],
    ['/de/transport-network-demo', '/sr/transportna-mreza-demo'],
    ['/de/leistungsrahmen', '/sr/obim-usluge'],
    ['/de/continuity-support', '/sr/kontinuitet-podrska'],
    ['/de/fahrerkommunikation', '/sr/komunikacija-vozaci'],
    ['/de/pilot-check', '/sr/provera-pilota'],
    ['/de/praxis-wissen', '/sr/praksa-znanje'],
    ['/de/praxis-wissen/warum-tms-disponenten-nicht-ersetzen', '/sr/praksa-znanje/zasto-tms-ne-menja-disponente'],
    ['/de/praxis-wissen/eta-ist-keine-zusage', '/sr/praksa-znanje/eta-nije-obecanje'],
    ['/de/praxis-wissen/fahrerkommunikation-balkan-dach', '/sr/praksa-znanje/komunikacija-sa-vozacima-balkan-dach'],
    ['/de/praxis-wissen/schichtuebergabe-disposition', '/sr/praksa-znanje/predaja-smene-dispozicija'],
    ['/de/praxis-wissen/abweichungen-eskalieren', '/sr/praksa-znanje/eskalacija-odstupanja'],
    ['/de/praxis-wissen/transportdokumente-cmr-pod', '/sr/praksa-znanje/transportna-dokumenta-cmr-pod'],
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
    '/de/dispolab': ['DaniniHub DispoLab | Praxistraining für Disponenten', 'Interaktive Balkan–DACH-Fallsimulationen für operatives Denken, Kommunikation, Risiko, Dokumentation und Eskalation.'],
    '/sr/dispo-lab': ['DaniniHub DispoLab | Praktični trening za disponente', 'Interaktivne Balkan–DACH simulacije za operativno razmišljanje, komunikaciju, rizik, dokumentovanje i eskalaciju.'],
    '/de/dispolab/check': ['Kostenloser Dispo-Check | DaniniHub', 'Kostenloser interaktiver Praxischeck mit drei simulierten Transportfällen zu ETA, CMR und Schichtübergabe.'],
    '/sr/dispo-lab/provera': ['Besplatni Dispo-Check | DaniniHub', 'Besplatna interaktivna provera kroz tri simulirana transportna slučaja: ETA, CMR i predaja smene.'],
    '/de/transport-room-demo': ['DaniniHub Transport Room | Interaktiver Pilot MVP', 'Interaktiver Pilot eines gemeinsamen Transport Room mit Status, ETA, Kommunikation, Dokumenten und Incidents.'],
    '/sr/transportna-soba-demo': ['DaniniHub Transport Room | Interaktivni pilot MVP', 'Interaktivni pilot zajedničke transportne sobe sa statusima, ETA, komunikacijom, dokumentima i incidentima.'],
    '/de/transport-network-demo': ['DaniniHub Transport Network | Unternehmenspilot', 'Fiktiver Unternehmensbereich mit Firmenprofilen, Teammitgliedern und mehreren privaten Transport Rooms.'],
    '/sr/transportna-mreza-demo': ['DaniniHub Transport Network | Kompanijski pilot', 'Fiktivni kompanijski prostor sa profilima firmi, članovima tima i više privatnih transportnih soba.'],
    '/de/leistungsrahmen': ['Leistungsrahmen für Transport Operations | DaniniHub', 'Klar begrenzte operative Unterstützung für Status, ETA, Fahrerkommunikation, Dokumente und Eskalationen im Balkan–DACH-Transport.'],
    '/sr/obim-usluge': ['Obim operativne podrške u transportu | DaniniHub', 'Jasno ograničena podrška za statuse, ETA, vozače, dokumentaciju i eskalacije u Balkan–DACH transportu.'],
    '/de/continuity-support': ['Continuity Support für Transportteams | DaniniHub', 'Operative Unterstützung bei Urlaub, Krankheit, Spitzenlast und fehlender Abendkapazität – mit klaren Aufgaben und Übergaben.'],
    '/sr/kontinuitet-podrska': ['Podrška kontinuitetu transportnih timova | DaniniHub', 'Operativna podrška tokom odmora, bolovanja, vršnog opterećenja i manjka kapaciteta, uz jasne zadatke i predaju.'],
    '/de/fahrerkommunikation': ['Mehrsprachige Fahrerkommunikation Balkan–DACH | DaniniHub', 'Deutschsprachige Schnittstelle für Fahrer aus dem Balkanraum: Status, ETA, Anweisungen, Rückfragen und dokumentierte Eskalation.'],
    '/sr/komunikacija-vozaci': ['Višejezička komunikacija sa vozačima | DaniniHub', 'Nemačka komunikaciona veza za vozače sa Balkana: status, ETA, instrukcije, pitanja i dokumentovana eskalacija.'],
    '/de/pilot-check': ['Pilot-Check für Transport Operations | DaniniHub', 'Prüfen Sie strukturiert, ob ein begrenzter DaniniHub-Pilot zu Relationen, Fahrzeugzahl und operativem Engpass passt.'],
    '/sr/provera-pilota': ['Provera pilota za transportnu operativu | DaniniHub', 'Proverite strukturisano da li ograničeni DaniniHub pilot odgovara relacijama, broju vozila i operativnom problemu.'],
    '/de/praxis-wissen': ['Praxis & Wissen für Transportteams | DaniniHub', 'Fachinhalte zu Status, ETA, Dokumenten, Kommunikation, Eskalation und Kontinuität im Balkan–DACH-Transport.'],
    '/sr/praksa-znanje': ['Praksa i znanje za transportne timove | DaniniHub', 'Stručni sadržaji o statusu, ETA, dokumentima, komunikaciji, eskalaciji i kontinuitetu Balkan–DACH transporta.'],
    '/de/praxis-wissen/warum-tms-disponenten-nicht-ersetzen': ['Warum TMS-Systeme Disponenten nicht ersetzen | DaniniHub', 'Fachbeitrag über die operative Lücke zwischen TMS-Daten, Fahrerkommunikation, Entscheidung, Eskalation und Schichtübergabe.'],
    '/sr/praksa-znanje/zasto-tms-ne-menja-disponente': ['Zašto TMS sistemi ne menjaju disponente | DaniniHub', 'Stručni članak o praznini između TMS podataka, komunikacije sa vozačem, odluke, eskalacije i predaje smene.'],
    '/de/praxis-wissen/eta-ist-keine-zusage': ['ETA ist keine Zusage: Transportstatus richtig kommunizieren | DaniniHub', 'Plantermin, operative ETA, bestätigten Kundentermin und nächsten Prüfpunkt in der Transportkommunikation klar trennen.'],
    '/sr/praksa-znanje/eta-nije-obecanje': ['ETA nije obećanje: pravilna komunikacija statusa | DaniniHub', 'Kako jasno razdvojiti planirani termin, operativnu ETA, termin potvrđen klijentu i sledeću proveru u transportnoj komunikaciji.'],
    '/de/praxis-wissen/fahrerkommunikation-balkan-dach': ['Fahrerkommunikation Balkan–DACH: Wo Informationsfehler Kosten verursachen | DaniniHub', 'Praxisstandard für eindeutige, sichere und dokumentierte Fahrerkommunikation auf Balkan–DACH-Transportrelationen.'],
    '/sr/praksa-znanje/komunikacija-sa-vozacima-balkan-dach': ['Balkan–DACH komunikacija sa vozačima: gde greške stvaraju troškove | DaniniHub', 'Praktičan standard za jasnu, bezbednu i dokumentovanu komunikaciju sa vozačima na Balkan–DACH transportnim relacijama.'],
    '/de/praxis-wissen/schichtuebergabe-disposition': ['Schichtübergabe Disposition: 10 Pflichtinformationen | DaniniHub', 'Zehn Pflichtinformationen für eine belastbare Schichtübergabe mit offenen Entscheidungen, Verantwortung, Eskalation und nächster Prüfung.'],
    '/sr/praksa-znanje/predaja-smene-dispozicija': ['Predaja smene u dispoziciji: 10 obaveznih informacija | DaniniHub', 'Deset obaveznih informacija za pouzdanu predaju smene, otvorene odluke, odgovornost, eskalaciju i sledeću proveru.'],
    '/de/praxis-wissen/abweichungen-eskalieren': ['Transportabweichungen eskalieren: Schwellen und Verantwortung | DaniniHub', 'Operativer Leitfaden für messbare Eskalationsschwellen, verantwortliche Rollen, Entscheidungsbedarf, Frist und dokumentierten nächsten Schritt.'],
    '/sr/praksa-znanje/eskalacija-odstupanja': ['Eskalacija odstupanja: pragovi i odgovornost | DaniniHub', 'Operativni vodič za merljive pragove eskalacije, odgovornu ulogu, potrebnu odluku, rok i dokumentovan sledeći korak.'],
    '/de/praxis-wissen/transportdokumente-cmr-pod': ['Transportdokumente: CMR, POD und offene Nachweise | DaniniHub', 'Praxisleitfaden für Status, Prüfung, sichere Übergabe und Nachverfolgung von CMR, POD und offenen Transportnachweisen.'],
    '/sr/praksa-znanje/transportna-dokumenta-cmr-pod': ['Transportna dokumenta: CMR, POD i otvoreni dokazi | DaniniHub', 'Praktičan vodič za status, proveru, bezbednu predaju i praćenje CMR-a, POD-a i otvorenih transportnih dokaza.'],
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
    const isArticle = /warum-tms-disponenten-nicht-ersetzen|zasto-tms-ne-menja-disponente|eta-ist-keine-zusage|eta-nije-obecanje|fahrerkommunikation-balkan-dach|komunikacija-sa-vozacima-balkan-dach|schichtuebergabe-disposition|predaja-smene-dispozicija|abweichungen-eskalieren|eskalacija-odstupanja|transportdokumente-cmr-pod|transportna-dokumenta-cmr-pod/.test(normalized);
    const datePublished = /fahrerkommunikation-balkan-dach|komunikacija-sa-vozacima-balkan-dach|schichtuebergabe-disposition|predaja-smene-dispozicija|abweichungen-eskalieren|eskalacija-odstupanja|transportdokumente-cmr-pod|transportna-dokumenta-cmr-pod/.test(normalized) ? '2026-07-19' : '2026-07-18';
    const dateModified = /eta-ist-keine-zusage|eta-nije-obecanje|fahrerkommunikation-balkan-dach|komunikacija-sa-vozacima-balkan-dach|schichtuebergabe-disposition|predaja-smene-dispozicija|abweichungen-eskalieren|eskalacija-odstupanja|transportdokumente-cmr-pod|transportna-dokumenta-cmr-pod/.test(normalized) ? '2026-07-19' : '2026-07-18';
    const articleSchema = isArticle ? `<script type="application/ld+json">${JSON.stringify({ '@context':'https://schema.org', '@type':'Article', headline:title.replace(' | DaniniHub',''), description, datePublished, dateModified, inLanguage:language === 'sr' ? 'sr' : 'de', mainEntityOfPage:canonical, author:{ '@type':'Person', name:'Dragan Zdravković' }, publisher:{ '@type':'Organization', name:'DaniniHub', url:'https://daninihub.com', logo:{ '@type':'ImageObject', url:'https://daninihub.com/logo-mark.svg' } } })}</script>` : '';
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
  siteRoutes.forEach(route => app.get(route, (req, res) => { res.type('html').send(renderSeoPage(route)); }));
  app.get('/robots.txt', (req, res) => res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: https://daninihub.com/sitemap.xml\n'));
  app.get('/sitemap.xml', (req, res) => res.type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + siteRoutes.map(route => `<url><loc>https://daninihub.com${route}</loc></url>`).join('') + '</urlset>'));
  app.get('/api/public-layer', (req, res) => res.json({ ok:true, service:'Balkan-DACH Transport Operations Support', languages:['de','sr'], contact:'info@daninihub.com' }));
}

module.exports = { mountPublicRuntime };
