import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const home=readFileSync('src/components/Home.astro','utf8');
const advisor=readFileSync('src/pages/[locale]/ai-savetnik.astro','utf8');
const client=readFileSync('public/danini-advisor-client.js','utf8');
const nav=readFileSync('src/components/Header.astro','utf8');

test('SR/DE automotive hero and universal source input',()=>{
 assert.match(home,/Našao si auto u Nemačkoj?/);
 assert.match(home,/Auto in Deutschland gefunden?/);
 assert.match(home,/<textarea id="vehicle-source"/);
 assert.match(home,/maxlength="6000"/);
 assert.match(home,/podaci stvarno dostupni/);
 assert.match(home,/Quoka/);
});
test('Balkan-first copy and sample deliverables are labeled fictional in DE/SR',()=>{
 const brand=readFileSync('src/components/DaniniLanding.astro','utf8');
 const business=readFileSync('src/components/BusinessLanding.astro','utf8');
 assert.match(brand,/Za firme sa Balkana/);
 assert.match(business,/DANINI pomaže u oba smera/);
 assert.match(business,/Geschäfte mit Deutschland vorbereiten/);
 assert.match(business,/DEMO · NIJE STVARNI KLIJENT/);
 assert.match(business,/DEMO · KEIN KUNDENPROJEKT/);
 assert.match(home,/DEMO · NIJE STVARNO VOZILO/);
 assert.match(home,/DEMO · KEIN ECHTES FAHRZEUG/);
 assert.match(home,/Transport, Prüfung und weitere Abgaben nicht ermittelt/);
 assert.doesNotMatch(home,/KI-Berater und Fahrzeugprüfung/);
});

test('AutoDanini DE/SR inquiry integrates existing protected lead API and preserves fallback',()=>{
 const contact=readFileSync('src/components/AutoContact.astro','utf8');
 assert.match(home,/import AutoContact from "\.\/AutoContact\.astro"/);
 assert.match(home,/<AutoContact locale=\{locale\}/);
 assert.match(contact,/id="contact"/);
 assert.match(contact,/data-auto-enquiry data-locale=\{locale\}/);
 assert.match(contact,/fetch\("\/api\/lead\/status"/);
 assert.match(contact,/fetch\("\/api\/lead"/);
 assert.match(contact,/kind:"vehicle"/);
 assert.match(contact,/language:de\?"de":"sr"/);
 assert.match(contact,/data-auto-captcha/);
 assert.match(contact,/turnstileToken:token/);
 assert.match(contact,/response\.status!==202/);
 assert.match(contact,/mailto:auto@daninihub\.com/);
 assert.match(contact,/href=\{"\/"\+locale\+"\/datenschutz\/"\}/);
});

test('client side handoff does not expose source in query or network',()=>{
 assert.match(home,/sessionStorage\.setItem\("danini-advisor-source-v1"/);
 assert.match(home,/window\.location\.assign/);
 assert.doesNotMatch(home,/URLSearchParams|encodeURIComponent\(value\)/);
 assert.match(client,/sessionStorage\.getItem\('danini-advisor-source-v1'\)/);
 assert.match(client,/sessionStorage\.removeItem\('danini-advisor-source-v1'\)/);
});
test('PR207 three questions and risk UI wired in both locales',()=>{
 assert.match(advisor,/data-advisor data-locale=\{locale\}/);
 assert.match(advisor,/data-question=\{i\}/);
 assert.match(advisor,/data-risk-row=\{i\}/);
 assert.match(advisor,/id="listing"/);
 assert.match(advisor,/id="advisor-contact"/);
 assert.match(advisor,/id="advisor-cta"/);
 assert.match(advisor,/danini-advisor-client\.js/);
 assert.match(client,/fetch\('\/api\/lead\/status'/);
 assert.match(client,/fetch\('\/api\/ai-intake'/);
 assert.match(advisor,/Kostenübersicht/);
 assert.match(advisor,/Pregled troškova/);
});
test('DANINI navigation keeps both commercial lines and languages',()=>{
 for(const label of ['Startseite','Početna','DANINI Business','AutoDanini','Unsere Methode','Naša metoda','Kontakt']) assert.ok(nav.includes(label),label);
 const brand=readFileSync('src/components/DaniniLanding.astro','utf8');
 const business=readFileSync('src/components/BusinessLanding.astro','utf8');
 const route=readFileSync('src/pages/[locale]/auto-check.astro','utf8');
 const rootPage=readFileSync('src/pages/index.astro','utf8');
 assert.match(rootPage,/DaniniLanding/);
 assert.match(brand,/Sa Balkana do pouzdanijih odluka/);
 assert.match(brand,/Für Unternehmen und Käufer vom Balkan/);
 assert.match(business,/DANINI Anfragebüro/);
 assert.match(route,/slug="auto-check"/);
});
