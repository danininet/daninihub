'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('docs/brand-preview/danini-master-preview.html','utf8');
test('brand preview stays isolated and is not indexable',()=>{
 assert.match(html,/<!doctype html>/i);
 assert.match(html,/<meta name="robots" content="noindex,nofollow">/);
 assert.match(html,/<html lang="de">/);
 assert.match(html,/<div lang="de" data-locale="de">/);
 assert.match(html,/<div lang="sr" data-locale="sr" hidden>/);
 assert.ok(!/<form\b/i.test(html),'Preview must not accept personal submissions');
 assert.ok(!/fetch\s*\(/.test(html),'Preview must not call external endpoints');
 assert.ok(!/<script[^>]+src=/.test(html),'No external scripts');
 assert.ok(!/api-key|BREVO_API_KEY|STRIPE_SECRET_KEY|TURNSTILE_SECRET/i.test(html),'No secret identifiers');
});
test('DE and SR provide real content, method and development notices',()=>{
 for(const marker of ['Weniger leere Antworten','Manje praznih odgovora',
  'Unsere Methode in sechs Schritten','Naša metoda u šest koraka',
  'DANINI befindet sich in der Entwicklungs','DANINI je u razvojnoj i testnoj fazi']){
  assert.ok(html.includes(marker),'Missing '+marker);
 }
 assert.equal((html.match(/class="step"/g)||[]).length,12,'Six distinct steps in each language');
});
test('all fragment links resolve to unique ids',()=>{
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(new Set(ids).size,ids.length,'IDs must be unique');
 const targets=[...html.matchAll(/href="#([^"]+)"/g)].map(x=>x[1]);
 for(const id of targets)assert.ok(ids.includes(id),'Missing fragment '+id);
});
test('language buttons have event handlers and state is accessible',()=>{
 assert.match(html,/id="de" aria-pressed="true"/);
 assert.match(html,/id="sr" aria-pressed="false"/);
 assert.match(html,/document\.getElementById\('de'\)\.addEventListener/);
 assert.match(html,/document\.getElementById\('sr'\)\.addEventListener/);
 assert.match(html,/document\.documentElement\.lang=value/);
 assert.match(html,/node\.hidden=node\.dataset\.locale!==value/);
});
test('approved palette, no extra services or misleading lead submission',()=>{
 for(const color of ['#0f172a','#1e293b','#facc15','#f9fafb'])assert.ok(html.includes(color),'Missing '+color);
 assert.ok(!/class="[^"]*submit/.test(html));
 assert.ok(!/https:\/\/wa\.me\//i.test(html),'No primary WhatsApp CTA');
 assert.ok(!/€\s*\d+/.test(html),'No unapproved paid offer');
});
