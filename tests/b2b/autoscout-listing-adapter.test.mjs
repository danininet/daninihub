import test from 'node:test';
import assert from 'node:assert/strict';
import {canonicalAutoScoutUrl,parseAutoScoutMarkdown,readPermittedAutoScoutAd} from '../../workers/danini-autoscout-data.mjs';
const raw='https://www.autoscout24.de/angebote/audi-a4-40-tdi-quattro-acc-ahk-kamera-led-diesel-schwarz-cat_ma9gr1626ge134va133mt181tr479950-47e7c37c-542c-4657-8f6d-5916b8f10de4?utm_source=web-share';
const markdown=String.raw`---
title: "Audi A4 allroad Kombi in Schwarz gebraucht in Koblenz für € 25.980"
meta:
 description: "Audi A4 85.251 km"
---
# Audi A4 allroad
## Basisdaten
Kilometerstand
85.251 km
Erstzulassung
08/2023
Kraftstoff
Diesel
Getriebe
Automatik
## Fahrzeughistorie
Kilometerstand
85.251 km
Erstzulassung
08/2023
Fahrzeugzustand
Unfallfahrzeug
Repariert
Fahrzeughalter
1
## Technische Daten
Leistung
150 kW (204 PS)
Diesel Kombi in Schwarz.`;
test('normalizes exactly one AutoScout24 individual ad and drops tracking',()=>{
 const normalized=canonicalAutoScoutUrl(raw);
 assert.ok(normalized.startsWith('https://www.autoscout24.de/angebote/'));
 assert.ok(!normalized.includes('utm_'));
 for(const bad of ['https://evil.example/angebote/audi-a4-40-tdi-47e7c37c-542c-4657-8f6d-5916b8f10de4',
 'https://autoscout24.de.evil.example/angebote/audi-a4-40-tdi-47e7c37c-542c-4657-8f6d-5916b8f10de4',
 'https://user:pass@www.autoscout24.de/angebote/audi-a4-40-tdi-47e7c37c-542c-4657-8f6d-5916b8f10de4',
 'https://www.autoscout24.de/lst/audi'])assert.equal(canonicalAutoScoutUrl(bad),null);
});
test('extracts confirmed ad claims, highlights Unfallfahrzeug Repariert',()=>{
 const result=parseAutoScoutMarkdown(markdown);
 assert.equal(result.fields.brand,'Audi');
 assert.equal(result.fields.model,'A4 allroad');
 assert.equal(result.fields.year,2023);
 assert.equal(result.fields.mileageKm,85251);
 assert.equal(result.fields.priceEur,25980);
 assert.equal(result.fields.fuel,'Diesel');
 assert.ok(result.accidentRepaired);
 assert.deepEqual(result.warnings,['accident_reported']);
 assert.match(result.sourceExcerpt,/Unfallfahrzeug/);
});
test('rejects invalid/empty source instead of inventing car fields',()=>{
 assert.equal(parseAutoScoutMarkdown('blocked'),null);
});
test('no commercial browser call without explicit permission and spend approval',async()=>{
 let calls=0;
 const env={BROWSER:{quickAction:async()=>{calls++;return new Response(markdown)}},
 PARTNERS:{get:async()=>null,put:async()=>{}}};
 const url=new URL(raw);
 assert.equal((await readPermittedAutoScoutAd(url,env)).status,'permission_required');
 env.DANINI_AUTOSCOUT24_DATA_PERMISSION='true';
 assert.equal((await readPermittedAutoScoutAd(url,env)).status,'budget_not_approved');
 assert.equal(calls,0);
});
test('explicitly permitted source retrieval only calls fixed single-ad canonical URL',async()=>{
 const calls=[],map=new Map();
 const env={DANINI_AUTOSCOUT24_DATA_PERMISSION:'true',DANINI_BROWSER_RENDERING_COST_APPROVED:'true',
 BROWSER:{quickAction:async(action,args)=>{calls.push({action,...args});return new Response(markdown)}},
 PARTNERS:{get:async key=>map.get(key),put:async(k,v)=>map.set(k,v)}};
 const a=await readPermittedAutoScoutAd(new URL(raw),env);
 assert.equal(a.status,'ok');
 assert.equal(a.record.fields.priceEur,25980);
 const b=await readPermittedAutoScoutAd(new URL(raw),env);
 assert.equal(b.status,'ok');
 assert.equal(b.cache,true);
 assert.equal(calls.length,1);
 assert.equal(calls[0].action,'markdown');
 assert.equal(calls[0].url,canonicalAutoScoutUrl(raw));
});
