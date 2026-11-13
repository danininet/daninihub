import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const home=readFileSync('src/components/Home.astro','utf8');
const advisor=readFileSync('src/pages/[locale]/ai-savetnik.astro','utf8');
const client=readFileSync('public/danini-advisor-client.js','utf8');
const nav=readFileSync('src/components/Header.astro','utf8');

test('SR/DE automotive hero and universal source input',()=>{
 assert.match(home,/Kupovina automobila iz Nemačke bez rizika/);
 assert.match(home,/Autokauf in Deutschland ohne Risiko/);
 assert.match(home,/<textarea id="vehicle-source"/);
 assert.match(home,/maxlength="6000"/);
 assert.match(home,/Kleinanzeigen/);
 assert.match(home,/Quoka/);
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
test('four item navigation retains German and Serbian labels',()=>{
 for(const label of ['Startseite','Početna','KI-Berater','AI Savetnik','Vor-Ort-Prüfung','Provera na terenu','Kontakt']) assert.ok(nav.includes(label),label);
});
