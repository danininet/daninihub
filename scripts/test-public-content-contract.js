'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

const serverRuntime = read('server-public-runtime.js');
const appSource = read('daninihub-front/src/App.jsx');
const landingSource = read('daninihub-front/src/PublicLanding.jsx');
const legalSource = read('daninihub-front/src/LegalKnowledge.jsx');
const pilotSource = read('daninihub-front/src/PilotCheck.jsx');
const businessSource = read('daninihub-front/src/BusinessPages.jsx');
const driverArticleSource = read('daninihub-front/src/DriverCommunicationArticle.jsx');
const handoverArticleSource = read('daninihub-front/src/ShiftHandoverArticle.jsx');
const escalationArticleSource = read('daninihub-front/src/DeviationEscalationArticle.jsx');
const documentsArticleSource = read('daninihub-front/src/TransportDocumentsArticle.jsx');

// Current public runtime and contact workflow.
assert.match(serverRuntime, /mountPublicRuntime/);
assert.match(serverRuntime, /app\.post\('\/api\/contact'/);
assert.match(serverRuntime, /isPilot \? 'PILOT' : 'LEAD'/);
assert.match(serverRuntime, /Neue strukturierte Pilot-Anfrage/);
assert.match(serverRuntime, /INCOMPLETE_PILOT_DATA/);
assert.match(serverRuntime, /confirmationSent/);
assert.match(serverRuntime, /lead-review/);
assert.match(serverRuntime, /sendQualifiedFollowup/);
assert.match(serverRuntime, /14-tägigen DaniniHub Founding Pilot/);
assert.match(serverRuntime, /followup-sent/);
assert.match(serverRuntime, /DANINI_ADMIN_SECRET/);
assert.match(serverRuntime, /DANINI_SESSION_SECRET/);
assert.match(serverRuntime, /daninihub-lead-review-v1/);
assert.match(serverRuntime, /continuing with email delivery/);
assert.match(serverRuntime, /reviewAvailable: leadStored/);
assert.match(serverRuntime, /legacyGoneRoutes/);
assert.match(serverRuntime, /status\(410\)/);
assert.match(serverRuntime, /X-Robots-Tag/);
assert.match(serverRuntime, /X-Content-Type-Options/);
assert.match(serverRuntime, /X-Frame-Options/);
assert.match(serverRuntime, /Referrer-Policy/);
assert.match(serverRuntime, /Permissions-Policy/);

// Core German and Serbian public routes must be served by the SPA runtime.
for (const route of [
  '/de/', '/sr/',
  '/de/impressum', '/de/datenschutz', '/de/cookies', '/de/haftungsausschluss',
  '/sr/impressum', '/sr/privatnost', '/sr/kolacici', '/sr/odricanje-odgovornosti',
  '/de/pilot-beispiel', '/sr/primer-pilota',
  '/de/operations-desk-demo', '/sr/operativni-pult-demo',
  '/de/pilot-check', '/sr/provera-pilota',
  '/de/leistungsrahmen', '/sr/obim-usluge',
  '/de/continuity-support', '/sr/kontinuitet-podrska',
  '/de/fahrerkommunikation', '/sr/komunikacija-vozaci'
  ,'/de/praxis-wissen/warum-tms-disponenten-nicht-ersetzen', '/sr/praksa-znanje/zasto-tms-ne-menja-disponente',
  '/de/praxis-wissen/eta-ist-keine-zusage', '/sr/praksa-znanje/eta-nije-obecanje',
  '/de/praxis-wissen/fahrerkommunikation-balkan-dach', '/sr/praksa-znanje/komunikacija-sa-vozacima-balkan-dach',
  '/de/praxis-wissen/schichtuebergabe-disposition', '/sr/praksa-znanje/predaja-smene-dispozicija',
  '/de/praxis-wissen/abweichungen-eskalieren', '/sr/praksa-znanje/eskalacija-odstupanja',
  '/de/praxis-wissen/transportdokumente-cmr-pod', '/sr/praksa-znanje/transportna-dokumenta-cmr-pod'
]) {
  assert.match(serverRuntime, new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}
assert.match(serverRuntime, /\/sr\/praksa-znanje/);
assert.doesNotMatch(serverRuntime, /\/sr\/praksa-propisi/);
assert.match(serverRuntime, /renderSeoPage/);
assert.match(serverRuntime, /hreflang="x-default"/);

// React router selection and SEO metadata for the current public product.
assert.match(appSource, /PilotCheck/);
assert.match(appSource, /BusinessPages/);
assert.match(appSource, /Operations Desk/);
assert.match(appSource, /Balkan–DACH Operations Support/);
assert.match(appSource, /link\[rel="canonical"\]/);

// Homepage must present the actual transport service, not the retired AI-analysis product.
assert.match(landingSource, /BALKAN–DACH TRANSPORT OPERATIONS SUPPORT/);
assert.match(landingSource, /Weniger Rückfragen\. Klare Informationen\. Ruhigere Abläufe\./);
assert.match(landingSource, /Deutsch \+ Sprachen des Balkans/);
assert.match(landingSource, /Pilotprojekt für ein Transportunternehmen/);
assert.match(landingSource, /DaniniHub ist kein Frachtführer, keine Spedition, kein Verkehrsleiter/);
assert.doesNotMatch(landingSource, /Persönliche KI-Analyse|12 EUR|12 €/);
assert.doesNotMatch(landingSource, /CookieNotice|dh_cookie_notice|localStorage/);
assert.match(landingSource, /Datenschutzerklärung/);

// Legal and privacy content must contain the current provider and processing details.
for (const value of [
  'Dragan Zdravković',
  'Fischerstraße 54',
  '47055 Duisburg',
  'info@daninihub.com',
  'Hostinger',
  'Brevo',
  'Sendinblue SAS',
  'Standardvertragsklauseln',
  'Pflicht- und freiwillige Angaben',
  'LDI NRW',
  'DSGVO',
  'Keine automatisierte Entscheidung'
]) {
  assert.match(legalSource, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}
assert.match(legalSource, /DaniniHub übernimmt nicht die Rolle von Frachtführer, Spediteur, Verkehrsleiter/);
assert.match(legalSource, /DaniniHub ne preuzima ulogu prevoznika, špeditera, rukovodioca transporta/);

// Driver communication article must preserve safe, closed-loop operating boundaries.
for (const value of [
  'Fahrerkommunikation Balkan–DACH',
  'Balkan–DACH komunikacija sa vozačima',
  'sicheren Stillstand',
  'bezbednom mirovanju',
  'Zugestellt“ bedeutet nicht „verstanden',
  'Isporučeno“ ne znači „razumljeno',
  'Instrukcije vozaču, bezbednosne odluke'
]) {
  assert.match(driverArticleSource, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

// Shift handover article must transfer operational control, not only summarize events.
for (const value of [
  'Schichtübergabe in der Disposition: 10 Pflichtinformationen',
  'Predaja smene u dispoziciji: 10 obaveznih informacija',
  'Übergabe bedeutet Kontrollwechsel',
  'Predaja znači promenu operativne kontrole',
  'neuer Kundentermin noch nicht bestätigt',
  'ne obećavati novi termin pre dobijenog odobrenja',
  'Telefonat darf Details ergänzen, ersetzt aber nicht',
  'Razgovor može dopuniti detalje, ali ne zamenjuje'
]) {
  assert.match(handoverArticleSource, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

// Escalation article must require measurable thresholds, authority and a decision deadline.
for (const value of [
  'Transportabweichungen richtig eskalieren',
  'Eskalacija odstupanja u transportu',
  'Eine Meldung informiert. Eine Eskalation fordert',
  'Obaveštenje prenosi informaciju. Eskalacija zahteva',
  'Keine universellen Minutenwerte',
  'Ne postoji univerzalan broj minuta',
  'Ohne solchen Weg darf operative Unterstützung keine Befugnis erfinden',
  'Bez tog puta operativna podrška ne sme sama da izmisli ovlašćenje'
]) {
  assert.match(escalationArticleSource, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

// Document handover article must separate file receipt, verification and acceptance.
for (const value of [
  'Transportdokumente übergeben: CMR, POD und offene Nachweise',
  'Predaja transportnih dokumenata: CMR, POD i otvoreni dokazi',
  'Ein Dokument ist nicht erledigt, nur weil eine Datei vorhanden ist',
  'Dokumentacioni proces nije završen samo zato što datoteka postoji',
  'digital bedeutet nicht automatisch überall akzeptiert',
  'digitalno ne znači automatski prihvaćeno svuda',
  'eine Einwilligung ist weder automatisch erforderlich',
  'saglasnost nije automatski neophodna'
]) {
  assert.match(documentsArticleSource, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

// Pilot intake must submit structured operational fields and preserve human approval boundaries.
for (const field of ['fleet', 'routes', 'tasks', 'availability', 'systems', 'decision']) {
  assert.match(pilotSource, new RegExp(`\\b${field}\\b`));
}
assert.match(pilotSource, /source:\s*'pilot-check'/);
assert.match(pilotSource, /Keine automatische Entscheidung/);
assert.match(pilotSource, /Nema automatske odluke/);
assert.match(pilotSource, /form\.reset\(\)/);
assert.match(pilotSource, /Was ein begrenzter Pilot konkret prüft/);
assert.match(pilotSource, /Šta konkretno proverava ograničeni pilot/);

// New service pages must cover scope, continuity and multilingual driver communication.
assert.match(businessSource, /Leistungsrahmen/);
assert.match(businessSource, /Continuity Support/i);
assert.match(businessSource, /Fahrerkommunikation/);
assert.match(businessSource, /Obim usluge/i);
assert.match(businessSource, /Podrška kontinuitetu/i);
assert.match(businessSource, /Komunikacija sa vozačima/i);

console.log('DaniniHub transport public content contract: OK');
