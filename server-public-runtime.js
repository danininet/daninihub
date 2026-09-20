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
  return { email, name: process.env.BREVO_SENDER_NAME || process.env.DANINIHUB_SENDER_NAME || 'DaniniHub Revenue OS' };
}

function leadReference(source) {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const isPilot = source === 'pilot-check';
  const type = source === 'ai-opportunity-check' ? 'OPP' : (isPilot ? 'PILOT' : 'LEAD');
  return `DH-${type}-${date}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
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
  return `<h2>Neue DaniniHub Anfrage</h2><p><strong>Referenz:</strong> ${html(reference)}</p><p><strong>Firma/Name:</strong> ${html(data.company)}<br><strong>E-Mail:</strong> ${html(data.email)}<br><strong>Telefon:</strong> ${valueOrDash(data.phone)}<br><strong>Fahrzeuge:</strong> ${valueOrDash(data.fleet)}<br><strong>Relationen:</strong> ${valueOrDash(data.routes)}<br><strong>Interesse:</strong> ${html(data.interest)}</p><p><strong>Nachricht:</strong><br>${html(data.message).replace(/\n/g, '<br>')}</p>${reviewAction(reference, reviewAvailable)}<p style="color:#607180;font-size:13px">Die Vorprüfung ist nur eine Entscheidungshilfe. Ein Follow-up wird erst nach Ihrer persönlichen Freigabe versendet.</p>`;
}

function opportunityAdminEmail(data, reference, reviewAvailable = true) {
  return `<div style="font-family:Arial,sans-serif;max-width:760px;margin:auto;color:#17212b"><div style="background:#07131f;color:#fff;padding:26px 30px;border-radius:14px 14px 0 0"><div style="font-size:12px;letter-spacing:1.4px;color:#62d7e5;font-weight:700">DANINIHUB REVENUE OS</div><h1 style="margin:8px 0 4px;font-size:28px">Neue B2B-Fit-Check-Anfrage</h1><div style="color:#b8c7d3">Referenz ${html(reference)}</div></div><div style="border:1px solid #d8e1e8;border-top:0;padding:28px 30px;border-radius:0 0 14px 14px"><h2 style="font-size:18px">Kontakt und Engpass</h2><p><strong>Name / Unternehmen:</strong> ${html(data.company)}<br><strong>E-Mail:</strong> ${html(data.email)}<br><strong>Telefon:</strong> ${valueOrDash(data.phone)}<br><strong>Sprache:</strong> ${data.language === 'sr' ? 'Serbisch' : 'Deutsch'}</p><p><strong>Beschreibung:</strong><br>${html(data.message).replace(/\n/g, '<br>')}</p><div style="margin-top:26px;padding:16px 18px;background:#eef8fa;border-left:4px solid #19b7c8"><strong>Nächster Schritt</strong><br>Prüfen, ob ein kleiner, klar begrenzter und messbarer Markttest sinnvoll ist. Kein Preis, Vertrag oder externer Versand ohne die vorgesehenen Freigaben.</div>${reviewAction(reference, reviewAvailable)}<p style="margin-top:24px;color:#607180;font-size:13px">Kein Einkommensversprechen und keine automatische Auftragsannahme.</p></div></div>`;
}
function pilotAdminEmail(data, reference, reviewAvailable = true) {
  return `<div style="font-family:Arial,sans-serif;max-width:760px;margin:auto;color:#17212b"><div style="background:#07131f;color:#fff;padding:26px 30px;border-radius:14px 14px 0 0"><div style="font-size:12px;letter-spacing:1.4px;color:#62d7e5;font-weight:700">DANINIHUB PILOT DESK</div><h1 style="margin:8px 0 4px;font-size:28px">Neue strukturierte Pilot-Anfrage</h1><div style="color:#b8c7d3">Referenz ${html(reference)}</div></div><div style="border:1px solid #d8e1e8;border-top:0;padding:28px 30px;border-radius:0 0 14px 14px"><h2 style="font-size:18px;margin:0 0 14px">Kontakt</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:8px 0;color:#607180;width:180px">Unternehmen / Name</td><td style="padding:8px 0;font-weight:700">${html(data.company)}</td></tr><tr><td style="padding:8px 0;color:#607180">E-Mail</td><td style="padding:8px 0"><a href="mailto:${html(data.email)}">${html(data.email)}</a></td></tr><tr><td style="padding:8px 0;color:#607180">Telefon</td><td style="padding:8px 0">${valueOrDash(data.phone)}</td></tr><tr><td style="padding:8px 0;color:#607180">Sprache</td><td style="padding:8px 0">${data.language === 'sr' ? 'Serbisch' : 'Deutsch'}</td></tr></table><h2 style="font-size:18px;margin:28px 0 14px">Operativer Bedarf</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:8px 0;color:#607180;width:180px">Fahrzeuge</td><td style="padding:8px 0;font-weight:700">${valueOrDash(data.fleet)}</td></tr><tr><td style="padding:8px 0;color:#607180">Relationen</td><td style="padding:8px 0">${valueOrDash(data.routes)}</td></tr><tr><td style="padding:8px 0;color:#607180">Zeitfresser / Aufgaben</td><td style="padding:8px 0">${valueOrDash(data.tasks)}</td></tr><tr><td style="padding:8px 0;color:#607180">Benötigtes Zeitfenster</td><td style="padding:8px 0">${valueOrDash(data.availability)}</td></tr><tr><td style="padding:8px 0;color:#607180">Systeme / Kanäle</td><td style="padding:8px 0">${valueOrDash(data.systems)}</td></tr><tr><td style="padding:8px 0;color:#607180">Operative Freigabe</td><td style="padding:8px 0">${valueOrDash(data.decision)}</td></tr></table><div style="margin-top:26px;padding:16px 18px;background:#eef8fa;border-left:4px solid #19b7c8"><strong>Nächster Schritt</strong><br>Bedarf prüfen, Rückfragen vorbereiten und entscheiden, ob ein klar begrenztes Pilotprojekt sinnvoll ist.</div>${reviewAction(reference, reviewAvailable)}<p style="margin-top:24px;color:#607180;font-size:13px">Diese Anfrage ist noch kein Transportauftrag, kein Angebot und keine Annahme eines Leistungsumfangs.</p></div></div>`;
}

function confirmationEmail(data, reference) {
  const isSr = data.language === 'sr';
  const revenue = data.source === 'revenue-os-intake' || data.source === 'ai-opportunity-check';
  if (revenue) {
    return isSr
      ? `<h2>Hvala na DaniniHub B2B upitu.</h2><p>Upit je primljen pod referencom <strong>${html(reference)}</strong>.</p><p>Sledeći korak je ručna provera da li problem ima smisla pretvoriti u mali i merljiv tržišni test. Ova potvrda nije ponuda, ugovor, garancija zarade niti automatsko prihvatanje posla.</p><p>Dragan Zdravković<br>DaniniHub<br>info@daninihub.com</p>`
      : `<h2>Vielen Dank für Ihre DaniniHub-B2B-Anfrage.</h2><p>Ihre Anfrage wurde unter der Referenz <strong>${html(reference)}</strong> empfangen.</p><p>Als Nächstes wird manuell geprüft, ob sich der Engpass für einen kleinen und messbaren Markttest eignet. Diese Bestätigung ist kein Angebot, kein Vertrag, keine Umsatzgarantie und keine automatische Auftragsannahme.</p><p>Dragan Zdravković<br>DaniniHub<br>info@daninihub.com</p>`;
  }
  return isSr
    ? `<h2>Hvala na upitu.</h2><p>Vaša poruka je primljena pod referencom <strong>${html(reference)}</strong> i biće ručno pregledana.</p><p>Ova potvrda nije pravno obavezujuća ponuda niti prihvatanje naloga.</p><p>Dragan Zdravković<br>DaniniHub<br>info@daninihub.com</p>`
    : `<h2>Vielen Dank für Ihre Anfrage.</h2><p>Ihre Nachricht wurde unter der Referenz <strong>${html(reference)}</strong> empfangen und wird manuell geprüft.</p><p>Diese Bestätigung ist kein rechtsverbindliches Angebot und keine Auftragsannahme.</p><p>Dragan Zdravković<br>DaniniHub<br>info@daninihub.com</p>`;
}
function qualifiedFollowupEmail(lead) {
  const isSr = lead.language === 'sr';
  const home = `${publicUrl()}/${isSr ? 'sr' : 'de'}/`;
  return isSr
    ? {
        subject: `DaniniHub – ručna provera upita ${lead.reference}`,
        htmlContent: `<h2>Vaš upit je ručno pregledan.</h2><p>Hvala, ${html(lead.company)}.</p><p>Sledeći korak se dogovara samo ako postoji jasan problem, merljiv test i odgovarajući B2B okvir. <a href="${html(home)}">DaniniHub Revenue OS</a></p><p>Ova poruka nije garancija rezultata niti automatsko prihvatanje posla.</p>`
      }
    : {
        subject: `DaniniHub – manuelle Prüfung Ihrer Anfrage ${lead.reference}`,
        htmlContent: `<h2>Ihre Anfrage wurde manuell geprüft.</h2><p>Vielen Dank, ${html(lead.company)}.</p><p>Ein nächster Schritt wird nur vereinbart, wenn ein klarer Engpass, ein messbarer Test und ein passender B2B-Rahmen vorliegen. <a href="${html(home)}">DaniniHub Revenue OS</a></p><p>Diese Nachricht ist keine Ergebnisgarantie und keine automatische Auftragsannahme.</p>`
      };
}
function mountPublicRuntime(app, options = {}) {
  const front = options.front || path.join(__dirname, 'daninihub-front', 'dist');
  const leadStore = options.leadStore || createContactLeadStore();
  app.use(express.static(front, { index: false, maxAge: '1h' }));

  app.post('/api/contact', express.json({ limit: '100kb' }), async (req, res) => {
    const data = req.body || {};
    if (clean(data.website, 200)) return res.status(400).json({ ok:false, error:'SPAM_REJECTED' });
    if (data.source === 'revenue-os-intake' && data.privacy_acknowledged !== true) return res.status(400).json({ ok:false, error:'PRIVACY_NOTICE_REQUIRED' });
    if (!contactAllowed(req.ip)) return res.status(429).json({ ok:false, error:'RATE_LIMITED' });
    if (!clean(data.company) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(data.email, 180))) return res.status(400).json({ ok:false, error:'INVALID_CONTACT' });
    const reference = leadReference(data.source);
    let stored = true;
    try { await leadStore.create({ ...data, reference, status:'NEW' }); } catch { stored = false; }
    try {
      const api = brevo();
      const from = sender();
      await api.sendTransacEmail({ sender:from, to:[{ email:'info@daninihub.com', name:'DaniniHub' }], replyTo:{ email:clean(data.email,180), name:clean(data.company,180) }, subject:`DaniniHub ${data.source === 'revenue-os-intake' || data.source === 'ai-opportunity-check' ? 'Revenue-OS-Anfrage' : data.source === 'pilot-check' ? 'Pilot-Anfrage' : 'Anfrage'} ${reference}`, htmlContent:(data.source === 'revenue-os-intake' || data.source === 'ai-opportunity-check') ? opportunityAdminEmail(data, reference, stored) : data.source === 'pilot-check' ? pilotAdminEmail(data, reference, stored) : standardAdminEmail(data, reference, stored) });
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

  const legacyRedirects = new Map([
    ['/de/opportunity-check','/de/#contact'],
    ['/sr/opportunity-check','/sr/#contact'],
    ['/de/opportunity-map','/de/'],
    ['/sr/opportunity-map','/sr/'],
    ['/de/location-launch','/de/'],
    ['/sr/location-launch','/sr/'],
    ['/de/haftungsausschluss','/de/ai-transparenz'],
    ['/sr/odricanje-odgovornosti','/sr/ai-transparentnost'],
    ['/de/agb','/de/bedingungen'],
    ['/sr/opsti-uslovi','/sr/uslovi'],
    ['/de/leistungsrahmen','/de/bedingungen'],
    ['/sr/obim-usluge','/sr/uslovi'],
    ['/de/pilot-check','/de/#contact'],
    ['/sr/provera-pilota','/sr/#contact'],
    ['/en','/de/'],
    ['/en/','/de/']
  ]);
  legacyRedirects.forEach((target, route) => app.get(route, (req, res) => res.redirect(308, target)));

  const discontinuedRoutes = [
    '/de/ki-beratung','/sr/ki-savetovanje','/de/ki-produkte','/sr/ki-proizvodi',
    '/de/vertrauenszentrum','/sr/centar-poverenja','/api/entry/12-eur/checkout',
    '/de/externe-disposition','/sr/eksterna-dispozicija',
    '/de/balkan-desk','/sr/balkan-desk','/de/dach-desk','/sr/dach-desk',
    '/de/fuer-dach-speditionen','/sr/za-balkanske-transportne-firme',
    '/de/vorher-nachher','/sr/pre-posle',
    '/de/capacity-signal','/sr/signal-kapaciteta',
    '/de/transport-network-demo','/sr/transportna-mreza-demo',
    '/de/transport-room-demo','/sr/transportna-soba-demo',
    '/de/dispolab','/sr/dispo-lab','/de/dispolab/check','/sr/dispo-lab/provera',
    '/de/continuity-support','/sr/kontinuitet-podrska',
    '/de/fahrerkommunikation','/sr/komunikacija-vozaci',
    '/de/praxis-wissen','/sr/praksa-znanje',
    '/de/pilot-beispiel','/sr/primer-pilota',
    '/de/operations-desk-demo','/sr/operativni-pult-demo',
    '/de/glossar','/sr/recnik'
  ];
  const gonePage = route => {
    const sr = route.startsWith('/sr/');
    return `<!doctype html><html lang="${sr?'sr':'de'}"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DaniniHub</title></head><body style="font-family:system-ui;max-width:760px;margin:60px auto;padding:20px"><h1>${sr?'Ova ranija ponuda je ugašena.':'Dieses frühere Angebot wurde eingestellt.'}</h1><p>${sr?'DaniniHub je konsolidovan na AI Office 24/7 i Revenue OS. Stari transportni sadržaj se više ne nudi kao aktivna usluga.':'DaniniHub wurde auf AI Office 24/7 und Revenue OS konsolidiert. Der frühere Transport-Inhalt wird nicht mehr als aktive Leistung angeboten.'}</p><p><a href="/${sr?'sr':'de'}/">${sr?'Aktuelna ponuda':'Aktuelles Angebot'} →</a></p></body></html>`;
  };
  discontinuedRoutes.forEach(route => app.get(route, (req, res) => {
    res.set('X-Robots-Tag', 'noindex, follow');
    return res.status(410).type('html').send(gonePage(route));
  }));
  app.get(/^\/(?:de|sr)\/(?:praxis-wissen|praksa-znanje)\/.+$/, (req, res) => {
    res.set('X-Robots-Tag', 'noindex, follow');
    return res.status(410).type('html').send(gonePage(req.path));
  });
  app.get(/^\/en\/.+$/, (req, res) => {
    res.set('X-Robots-Tag', 'noindex, follow');
    return res.status(410).type('html').send(gonePage('/de/old'));
  });

  const routePairs = [
    ['/de/', '/sr/'],
    ['/de/impressum', '/sr/impressum'],
    ['/de/datenschutz', '/sr/privatnost'],
    ['/de/cookies', '/sr/kolacici'],
    ['/de/ai-transparenz', '/sr/ai-transparentnost'],
    ['/de/bedingungen', '/sr/uslovi']
  ];

  const seo = {
    '/de/': ['AI Office 24/7 für Dienstleister | DaniniHub', 'AI Office 24/7 für lokale Dienstleister: Anfragen strukturieren, Rückrufe und Termine vorbereiten, Follow-up sichtbar halten – mit menschlicher Kontrolle.'],
    '/sr/': ['AI Office 24/7 za uslužne firme | DaniniHub', 'AI Office 24/7 za lokalne uslužne firme: strukturisan prijem upita, priprema poziva i termina, follow-up i ljudska kontrola važnih odluka.'],
    '/de/impressum': ['Impressum & Anbieterkennzeichnung | DaniniHub', 'Impressum und Anbieterkennzeichnung von DaniniHub in Duisburg mit Kontaktangaben und B2B-Hinweisen.'],
    '/sr/impressum': ['Impresum i podaci o pružaocu | DaniniHub', 'Podaci o pružaocu usluge DaniniHub u Duisburgu, kontakt i B2B pravne napomene.'],
    '/de/datenschutz': ['Datenschutz & DSGVO | DaniniHub AI Office', 'Datenschutzhinweise für DaniniHub AI Office 24/7: Kontaktanfragen, Hosting, E-Mail, KI-Verarbeitung, Speicherdauer und Betroffenenrechte.'],
    '/sr/privatnost': ['Privatnost i GDPR | DaniniHub AI Office', 'Obaveštenje o privatnosti za DaniniHub AI Office 24/7: upiti, hosting, email, AI obrada, čuvanje i prava korisnika.'],
    '/de/cookies': ['Cookies & lokale Speicherung | DaniniHub', 'Informationen zu technisch notwendiger Speicherung und zum Umgang mit künftigem optionalem Tracking bei DaniniHub.'],
    '/sr/kolacici': ['Kolačići i lokalna memorija | DaniniHub', 'Informacije o tehnički neophodnoj memoriji i pravilima za eventualni budući opcioni tracking na DaniniHub-u.'],
    '/de/ai-transparenz': ['KI-Transparenz & Human Control | DaniniHub', 'Wie DaniniHub KI einsetzt: klare Kennzeichnung, Human-in-the-loop, keine Erfolgsversprechen und menschliche Freigabe bei Preis, Vertrag und Risiko.'],
    '/sr/ai-transparentnost': ['AI transparentnost i ljudska kontrola | DaniniHub', 'Kako DaniniHub koristi AI: jasno označavanje, human-in-the-loop, bez garancije rezultata i ljudska potvrda kod cene, ugovora i rizika.'],
    '/de/bedingungen': ['B2B-Leistungsrahmen für AI Office | DaniniHub', 'Öffentlicher B2B-Leistungsrahmen für DaniniHub AI Office 24/7: kein automatischer Vertragsschluss, klare Leistung, Preis und Haftungsgrenzen.'],
    '/sr/uslovi': ['B2B okvir za AI Office | DaniniHub', 'Javni B2B okvir za DaniniHub AI Office 24/7: nema automatskog ugovora, jasan obim rada, cena i granice odgovornosti.']
  };

  const rootSnapshot = language => language === 'sr'
    ? `<main><h1>AI Office 24/7 za lokalne uslužne firme</h1><p>DaniniHub pomaže malim B2B uslužnim firmama da nove upite prime uredno, pripreme povratne pozive i termine i drže otvorene slučajeve vidljivim. Sistem je namenjen svakodnevnom radu između terena i kancelarije: manje rasutih informacija, manje nepotrebnih dodatnih pitanja i jasnija predaja čoveku koji donosi stručnu i komercijalnu odluku.</p><h2>Za čišćenje objekata, Hausmeister servis i održavanje</h2><p>Prvi tržišni test je usmeren na lokalne firme u Nemačkoj, posebno u NRW. Tipični slučajevi su čišćenje objekata, Hausmeister servis, bašte i održavanje. Pre povratnog poziva mogu se strukturisano prikupiti usluga, adresa, vrsta objekta, hitnost, fotografije i željeni termin. Postojeći sajt, telefon i email treba da ostanu u upotrebi gde god je to moguće.</p><h2>Šta AI Office 24/7 radi</h2><p>Workflow može da strukturira web i email upite, pripremi nedostajuće informacije, napravi red za povratni poziv ili termin, drži otvorene upite i ponude vidljivim za follow-up i prosledi nejasne ili osetljive slučajeve čoveku. Cena, ugovor i pravno važne odluke se ne donose autonomno.</p><h2>Mali merljiv pilot umesto velike platforme</h2><p>Počinjemo sa jednim jasnim uskim grlom i ograničenim pilotom. Merimo vreme odgovora, kompletnost upita, otvorene follow-upove i administrativni rad. Pilot nije garancija prihoda ili konverzije. Tek kada postoji smislen merljiv rezultat, odlučuje se o stalnom radu ili dodatnoj automatizaciji.</p><h2>Fit-check pre ponude</h2><p>Prvi korak je kratak opis trenutnog problema. Zatim ručno proveravamo da li mali test ima smisla. Kontakt forma nije narudžbina i ne zaključuje ugovor automatski.</p><nav><a href="/sr/privatnost">Privatnost</a> <a href="/sr/uslovi">B2B okvir</a> <a href="/sr/ai-transparentnost">AI transparentnost</a> <a href="/sr/impressum">Impresum</a></nav></main>`
    : `<main><h1>AI Office 24/7 für lokale Dienstleister</h1><p>DaniniHub hilft kleinen B2B-Dienstleistern dabei, neue Anfragen sauber zu erfassen, Rückrufe und Termine vorzubereiten und offene Vorgänge sichtbar zu halten. Das System ist für den Alltag zwischen Außendienst und Büro gedacht: weniger verstreute Informationen, weniger unnötige Rückfragen und eine klarere Übergabe an den Menschen, der die fachliche und kommerzielle Entscheidung trifft.</p><h2>Für Gebäudereinigung, Hausmeisterservice und Objektservice</h2><p>Im ersten Markt-Test konzentrieren wir uns auf lokale Servicebetriebe in Deutschland, besonders in Nordrhein-Westfalen. Typische Fälle sind Anfragen zu Gebäudereinigung, Hausmeisterservice, Garten- und Objektpflege. Vor einem Rückruf können Leistung, Adresse, Objektart, Dringlichkeit, Fotos und Wunschtermin strukturiert gesammelt werden. Bestehende Website, Telefon und E-Mail sollen dabei möglichst erhalten bleiben.</p><h2>Was AI Office 24/7 übernimmt</h2><p>Der Workflow kann Web- und E-Mail-Anfragen strukturieren, fehlende Angaben vorbereiten, Rückruf- oder Terminlisten erzeugen, offene Anfragen und Angebote für den Follow-up sichtbar halten und unklare oder sensible Fälle an einen Menschen eskalieren. Preiszusagen, Verträge und rechtlich relevante Entscheidungen werden nicht autonom getroffen.</p><h2>Kleiner messbarer Pilot statt großer Plattform</h2><p>Wir starten mit genau einem Engpass und einem klar begrenzten Pilot. Gemessen werden zum Beispiel Reaktionszeit, Vollständigkeit der Anfrage, offene Follow-ups und administrativer Aufwand. Der Pilot ist keine Umsatz- oder Conversion-Garantie. Erst wenn ein sinnvoller messbarer Nutzen sichtbar wird, wird über einen dauerhaften Betrieb oder weitere Automatisierung entschieden.</p><h2>Fit-Check vor Angebot</h2><p>Der erste Schritt ist eine kurze Beschreibung des heutigen Problems. Danach prüfen wir manuell, ob ein kleiner Test sinnvoll ist. Das Kontaktformular ist keine Bestellung und führt nicht automatisch zu einem Vertrag.</p><nav><a href="/de/datenschutz">Datenschutz</a> <a href="/de/bedingungen">B2B-Rahmen</a> <a href="/de/ai-transparenz">KI-Transparenz</a> <a href="/de/impressum">Impressum</a></nav></main>`;

  const legalSnapshot = (normalized, language) => {
    const [title, description] = seo[normalized] || seo[language === 'sr' ? '/sr/' : '/de/'];
    const home = language === 'sr' ? '/sr/' : '/de/';
    return `<main><h1>${html(title.replace(/ \| DaniniHub(?: AI Office)?$/,''))}</h1><p>${html(description)}</p><p><a href="${home}">${language==='sr'?'Nazad na AI Office 24/7':'Zurück zu AI Office 24/7'}</a></p></main>`;
  };

  const rootFaq = {
    de: [
      ['Ist AI Office 24/7 ein Chatbot?','Nein. Ein Chat kann Teil des Workflows sein, aber das Produkt ist ein betreuter Prozess für Intake, Rückruf, Termin, Follow-up und Eskalation.'],
      ['Muss bestehende Software ersetzt werden?','Nein. Der Pilot soll vorhandene Kanäle möglichst nutzen und nur einen klaren Engpass verbessern.'],
      ['Entscheidet KI über Preise oder Verträge?','Nein. Preis, Vertrag, rechtlich relevante Zusagen und unklare Fälle bleiben unter menschlicher Kontrolle.'],
      ['Garantiert der Pilot mehr Umsatz?','Nein. Gemessen werden operative Signale wie Reaktionszeit, Vollständigkeit, offene Vorgänge und Admin-Aufwand.']
    ],
    sr: [
      ['Da li je AI Office 24/7 chatbot?','Ne. Chat može biti deo toka, ali proizvod je vođeni proces za prijem upita, poziv, termin, follow-up i eskalaciju.'],
      ['Da li moram menjati postojeći softver?','Ne. Pilot pokušava da koristi postojeće kanale i unapredi samo jedno jasno usko grlo.'],
      ['Da li AI odlučuje o cenama ili ugovorima?','Ne. Cena, ugovor, pravno važne izjave i nejasni slučajevi ostaju pod ljudskom kontrolom.'],
      ['Da li pilot garantuje više prihoda?','Ne. Mere se operativni signali kao brzina odgovora, kompletnost, otvoreni slučajevi i administrativno vreme.']
    ]
  };

  const htmlTemplate = () => fs.readFileSync(path.join(front, 'index.html'), 'utf8');
  const renderSeoPage = route => {
    const normalized = route === '/de' ? '/de/' : route === '/sr' ? '/sr/' : route;
    const language = normalized.startsWith('/sr') ? 'sr' : 'de';
    const pair = routePairs.find(([de, sr]) => de === normalized || sr === normalized) || routePairs[0];
    const [title, description] = seo[normalized] || seo[language === 'sr' ? '/sr/' : '/de/'];
    const canonical = `https://daninihub.com${normalized}`;
    const isRoot = normalized === '/de/' || normalized === '/sr/';
    const bodySnapshot = isRoot ? rootSnapshot(language) : legalSnapshot(normalized, language);
    const schemas = [
      {
        '@context':'https://schema.org',
        '@type':'Organization',
        name:'DaniniHub',
        url:'https://daninihub.com',
        email:'info@daninihub.com',
        telephone:'+49 1573 0916621',
        address:{ '@type':'PostalAddress', streetAddress:'Fischerstraße 54', postalCode:'47055', addressLocality:'Duisburg', addressCountry:'DE' },
        founder:{ '@type':'Person', name:'Dragan Zdravković' }, logo:'https://daninihub.com/logo-mark.svg'
      }
    ];
    if (isRoot) {
      schemas.push({
        '@context':'https://schema.org',
        '@type':'Service',
        name:'Danini AI Office 24/7',
        serviceType:'B2B Anfrage- und Follow-up-Automation für lokale Dienstleister',
        provider:{ '@type':'Organization', name:'DaniniHub', url:'https://daninihub.com', logo:'https://daninihub.com/logo-mark.svg' },
        areaServed:[{ '@type':'Country', name:'Germany' },{ '@type':'AdministrativeArea', name:'North Rhine-Westphalia' }],
        audience:{ '@type':'BusinessAudience', audienceType:'Gebäudereinigung, Hausmeisterservice, Garten- und Objektservice' },
        description
      });
      schemas.push({
        '@context':'https://schema.org',
        '@type':'FAQPage',
        mainEntity:rootFaq[language].map(([name,answer])=>({ '@type':'Question', name, acceptedAnswer:{ '@type':'Answer', text:answer } }))
      });
    }
    const structured = schemas.map(schema=>`<script type="application/ld+json">${JSON.stringify(schema)}</script>`).join('');
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
      .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, structured)
      .replace('<div id="root"></div>', `<div id="root">${bodySnapshot}</div>`);
  };

  const siteRoutes = routePairs.flat();
  app.get('/', (req, res) => {
    const accepted = String(req.headers['accept-language'] || '').toLowerCase();
    const preferences = accepted
      .split(',')
      .map((entry, index) => {
        const [tag, qualityValue] = entry.trim().split(';q=');
        const quality = qualityValue === undefined ? 1 : Number(qualityValue);
        return { tag, quality: Number.isFinite(quality) ? quality : 0, index };
      })
      .filter(({ tag }) => tag)
      .sort((left, right) => right.quality - left.quality || left.index - right.index);
    const preferred = preferences.find(({ tag }) => /^(sr|bs|hr|sh|cnr|de)(-|$)/.test(tag));
    const language = preferred && /^(sr|bs|hr|sh|cnr)(-|$)/.test(preferred.tag) ? 'sr' : 'de';
    res.set('Vary', 'Accept-Language');
    res.set('Cache-Control', 'private, no-store');
    return res.redirect(302, `/${language}/`);
  });
  app.get(/^\/(?:de|sr)$/, (req, res) => res.redirect(308, `${req.path}/`));
  siteRoutes.forEach(route => app.get(route, (req, res) => { res.type('html').send(renderSeoPage(route)); }));
  app.get('/robots.txt', (req, res) => res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /internal/\nDisallow: /lead-review/\nDisallow: /api/\nSitemap: https://daninihub.com/sitemap.xml\n'));
  app.get('/sitemap.xml', (req, res) => res.type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + siteRoutes.map(route => `<url><loc>https://daninihub.com${route}</loc><lastmod>2026-09-20</lastmod><changefreq>${route === "/de/" || route === "/sr/" ? "weekly" : "monthly"}</changefreq><priority>${route === "/de/" || route === "/sr/" ? "1.0" : "0.3"}</priority></url>`).join('') + '</urlset>'));
  app.get('/api/public-layer', (req, res) => res.json({ ok:true, service:'DaniniHub Revenue OS', languages:['de','sr'], contact:'info@daninihub.com' }));
}

module.exports = { mountPublicRuntime };
