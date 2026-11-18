import test from 'node:test';
import assert from 'node:assert/strict';
import {handleVehicleAnalysis} from '../../workers/danini-vehicle-analysis.mjs';
import {handleApi} from '../../workers/danini-intake.mjs';
import {readFileSync} from 'node:fs';

const longText='Volkswagen Golf Baujahr 2018, Diesel, Automatik, 143.000 km, 12.500 EUR. Unfallfrei laut Anbieter, scheckheftgepflegt. Weitere Angaben nach Rückfrage.';
const make=(source,origin='https://daninihub.com',token='mock-token-long-enough')=>new Request('https://daninihub.com/api/vehicle-analysis',{method:'POST',headers:{origin,'content-type':'application/json','cf-connecting-ip':'192.0.2.1'},body:JSON.stringify({language:'de',source,turnstileToken:token})});
test('URL-only input returns honest source screening with no third-party fetch',async()=>{
 const original=globalThis.fetch,calls=[];
 globalThis.fetch=async (url)=>{calls.push(String(url));return Response.json({success:true,hostname:'daninihub.com'});};
 const memory=new Map();
 const env={DANINI_TURNSTILE_SECRET:'test',PARTNERS:{get:async k=>memory.get(k),put:async(k,v)=>memory.set(k,v)}};
 try {
  const r=await handleVehicleAnalysis(make('https://www.mobile.de/fahrzeuge/details.html?id=123'),env);
  assert.equal(r.status,200);
  const result=await r.json();
  assert.equal(result.sourceType,'listing_url');
  assert.equal(result.sourcePlatform,'mobile.de');
  assert.equal(result.listingFetched,false);
  assert.equal(result.aiUsed,false);
  assert.equal(result.fields.brand,null);
  assert.ok(result.questions.length>0);
  assert.deepEqual(calls.map(url=>new URL(url).hostname),['challenges.cloudflare.com']);
 }finally{globalThis.fetch=original;}
});
test('URL-only input rejects unsafe HTTP or credential-bearing URLs',async()=>{
 for(const url of ['http://www.mobile.de/fahrzeuge/details.html?id=123','https://user:pass@mobile.de/car']){
  const r=await handleVehicleAnalysis(make(url));
  assert.equal(r.status,400);
 }
});
test('blocks cross-origin before verification',async()=>{
 const r=await handleVehicleAnalysis(make(longText,'https://attacker.example'));
 assert.equal(r.status,403);
});
test('requires CAPTCHA before processing copied text',async()=>{
 const r=await handleVehicleAnalysis(make(longText,'https://daninihub.com',''),{DANINI_TURNSTILE_SECRET:'test'});
 assert.equal(r.status,403);
});
test('verified text extraction reports gaps and never claims AI',async()=>{
 const original=globalThis.fetch;
 const calls=[];
 globalThis.fetch=async url=>{calls.push(String(url));return Response.json({success:true,hostname:'daninihub.com'});};
 const memory=new Map();
 const env={DANINI_TURNSTILE_SECRET:'test',PARTNERS:{get:async k=>memory.get(k),put:async(k,v)=>{memory.set(k,v);}}};
 try{
  const r=await handleVehicleAnalysis(make(longText),env);
  assert.equal(r.status,200);
  const result=await r.json();
  assert.equal(result.aiUsed,false);
  assert.equal(result.fields.brand,'Volkswagen');
  assert.equal(result.fields.year,2018);
  assert.equal(result.fields.mileageKm,143000);
  assert.equal(result.fields.priceEur,12500);
  assert.ok(result.missing.includes('model'));
  assert.equal(result.questions.length,4);
  assert.equal(calls.length,1);
  assert.match(calls[0],/turnstile/);
 }finally{globalThis.fetch=original;}
});
test('listing price parser handles German and English decimal cents without inflating EUR amounts',async()=>{
 const original=globalThis.fetch;
 globalThis.fetch=async()=>Response.json({success:true,hostname:'daninihub.com'});
 try{
  for(const [price,expected] of [
   ['12.500',12500],
   ['12.500,00',12500],
   ['12,500.00',12500],
   ['12500,00',12500],
   ['1250.50',1250.5]
  ]){
   const memory=new Map();
   const env={DANINI_TURNSTILE_SECRET:'test',PARTNERS:{get:async k=>memory.get(k),put:async(k,v)=>memory.set(k,v)}};
   const description=longText.replace('12.500 EUR',price+' EUR');
   const response=await handleVehicleAnalysis(make(description),env);
   assert.equal(response.status,200,price);
   const parsed=await response.json();
   assert.equal(parsed.fields.priceEur,expected,price);
  }
 }finally{globalThis.fetch=original;}
});

test('rate limiting caps repeated analyses',async()=>{
 const original=globalThis.fetch;
 globalThis.fetch=async()=>Response.json({success:true,hostname:'daninihub.com'});
 const data=new Map();
 const env={DANINI_TURNSTILE_SECRET:'test',PARTNERS:{get:async k=>data.get(k),put:async(k,v)=>{data.set(k,v);}}};
 try{
  for(let i=0;i<5;i++)assert.equal((await handleVehicleAnalysis(make(longText),env)).status,200);
  assert.equal((await handleVehicleAnalysis(make(longText),env)).status,429);
 }finally{globalThis.fetch=original;}
});

test('public CAPTCHA sitekey remains available for analysis when contact sending is disabled',async()=>{
 const env={DANINI_CONTACT_ACTIVE:'false',DANINI_TURNSTILE_SECRET:'configured-test-secret',DANINI_TURNSTILE_SITEKEY:'0xTEST_PUBLIC_SITEKEY'};
 const r=await handleApi(new Request('https://daninihub.com/api/lead/status'),env);
 assert.equal(r.status,200);
 const body=await r.json();
 assert.equal(body.enabled,false);
 assert.equal(body.channel,'setup_required');
 assert.equal(body.turnstileSiteKey,env.DANINI_TURNSTILE_SITEKEY);
 const client=readFileSync('public/danini-advisor-client.js','utf8');
 assert.match(client,/if \(data\?\.turnstileSiteKey\) loadTurnstile\(data\.turnstileSiteKey\)/);
 assert.doesNotMatch(client,/if \(serviceEnabled\) loadTurnstile/);
 const advisorCopy=readFileSync('src/pages/[locale]/ai-savetnik.astro','utf8');
 assert.match(advisorCopy,/Eingegebene Links und Texte werden für diese Prüfung an DANINI übermittelt/);
 assert.match(advisorCopy,/Uneti link i tekst šalju se DANINI serveru/);
 assert.doesNotMatch(advisorCopy,/nur innerhalb dieser Browser-Sitzung/);
});
