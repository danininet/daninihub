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
test('licensed mobile.de API extracts actual advertised fields from fixed official endpoint',async()=>{
 const original=globalThis.fetch,calls=[];
 globalThis.fetch=async(url,options={})=>{
  calls.push({url:String(url),auth:options.headers?.Authorization});
  if(String(url).includes('siteverify'))return Response.json({success:true,hostname:'daninihub.com'});
  return Response.json({mobileAdId:'48234555768960',make:'BMW',model:'320',firstRegistration:'2020-02',mileage:107500,
   price:{consumerPriceGross:'18990.00',currency:'EUR'},fuel:'DIESEL',gearbox:'AUTOMATIC_GEAR'});
 };
 const map=new Map();
 const env={DANINI_TURNSTILE_SECRET:'test',MOBILE_DE_SEARCH_USER:'licensed-test',MOBILE_DE_SEARCH_PASSWORD:'dummy-password',
  PARTNERS:{get:async k=>map.get(k),put:async(k,v)=>map.set(k,v)}};
 try{
  const response=await handleVehicleAnalysis(make('https://suchen.mobile.de/fahrzeuge/details.html?id=48234555768960&utm_source=linkcopy'),env);
  assert.equal(response.status,200);
  const data=await response.json();
  assert.equal(data.status,'licensed_listing_data');assert.equal(data.listingFetched,true);
  assert.equal(data.fields.brand,'BMW');assert.equal(data.fields.model,'320');
  assert.equal(data.fields.year,2020);assert.equal(data.fields.mileageKm,107500);
  assert.equal(data.fields.priceEur,18990);
  assert.equal(calls[1].url,'https://services.mobile.de/search-api/ad/48234555768960');
  assert.match(calls[1].auth,/^Basic /);
  assert.equal(data.aiUsed,false);
 }finally{globalThis.fetch=original}
});
test('mobile.de lookup without licensed credentials never fetches third-party domains',async()=>{
 const original=globalThis.fetch,calls=[];
 globalThis.fetch=async url=>{calls.push(String(url));return Response.json({success:true,hostname:'daninihub.com'});};
 const map=new Map();
 try{
  const response=await handleVehicleAnalysis(make('https://suchen.mobile.de/fahrzeuge/details.html?id=48234555768960'),{
   DANINI_TURNSTILE_SECRET:'test',PARTNERS:{get:async k=>map.get(k),put:async(k,v)=>map.set(k,v)}
  });
  const data=await response.json();
  assert.equal(data.sourceType,'listing_url');
  assert.equal(data.providerStatus,'not_configured');
  assert.equal(calls.length,1);
 }finally{globalThis.fetch=original}
});
test('URL-only input rejects unsafe HTTP or credential-bearing URLs',async()=>{
 for(const url of ['http://www.mobile.de/fahrzeuge/details.html?id=123','https://user:pass@mobile.de/car']){
  const r=await handleVehicleAnalysis(make(url));
  assert.equal(r.status,400);
 }
});
test('screenshot vision extracts seller-supplied fields without visiting listing portal',async()=>{
 const old=globalThis.fetch,calls=[];
 globalThis.fetch=async url=>{calls.push(String(url));return Response.json({success:true,hostname:'daninihub.com'});};
 const memory=new Map(),models=[];
 const env={DANINI_TURNSTILE_SECRET:'test',AI_ENABLED:'true',DANINI_AI_LIVE_APPROVED:'true',
  AI:{run:async(model,payload)=>{models.push(model);assert.match(payload.messages[1].content[1].image_url.url,/^data:image\/png;base64,/);
   return {response:JSON.stringify({brand:'Volkswagen',model:'Golf',year:2018,mileageKm:143000,priceEur:12500,fuel:'Diesel',gearbox:'Automatik',visibleClaims:['unfallfrei laut Anbieter'],questions:['Sind Unfallbelege vorhanden?']})};}},
  PARTNERS:{get:async k=>memory.get(k),put:async(k,v)=>memory.set(k,v)}
 };
 const req=new Request('https://daninihub.com/api/vehicle-analysis',{method:'POST',headers:{origin:'https://daninihub.com','content-type':'application/json','cf-connecting-ip':'192.0.2.4'},body:JSON.stringify({language:'sr',source:'https://www.mobile.de/fahrzeuge/details.html?id=123',image:'data:image/png;base64,aGVsbG8=',turnstileToken:'mock-token-long-enough'})});
 try{
  const response=await handleVehicleAnalysis(req,env);
  assert.equal(response.status,200);
  const body=await response.json();
  assert.equal(body.sourceType,'user_supplied_screenshot');
  assert.equal(body.fields.brand,'Volkswagen');
  assert.equal(body.fields.priceEur,12500);
  assert.equal(body.listingFetched,false);
  assert.equal(body.aiUsed,true);
  assert.equal(models[0],'@cf/qwen/qwen3.8-27b');
  assert.equal(calls.length,1);
  assert.match(calls[0],/siteverify/);
 }finally{globalThis.fetch=old;}
});
test('screenshot rejects unsupported types and invalid base64 before inference',async()=>{
 for(const image of ['data:image/svg+xml;base64,aGVsbG8=','data:image/png;base64,NOT*BASE64','data:image/png;base64,'+'A'.repeat(1250004)]){
  const r=await handleVehicleAnalysis(new Request('https://daninihub.com/api/vehicle-analysis',{method:'POST',headers:{origin:'https://daninihub.com','content-type':'application/json'},body:JSON.stringify({language:'sr',source:'',image})}));
  assert.equal(r.status,400);
 }
});
test('screenshot is refused when vision AI is not approved',async()=>{
 const old=globalThis.fetch;
 globalThis.fetch=async()=>Response.json({success:true,hostname:'daninihub.com'});
 const map=new Map();
 try{
  const r=await handleVehicleAnalysis(new Request('https://daninihub.com/api/vehicle-analysis',{method:'POST',headers:{origin:'https://daninihub.com','content-type':'application/json','cf-connecting-ip':'192.0.2.5'},body:JSON.stringify({language:'sr',source:'',image:'data:image/png;base64,aGVsbG8=',turnstileToken:'mock-token-long-enough'})}),{DANINI_TURNSTILE_SECRET:'test',PARTNERS:{get:async k=>map.get(k),put:async(k,v)=>map.set(k,v)}});
  assert.equal(r.status,503);assert.equal((await r.json()).error,'vision_unavailable');
 }finally{globalThis.fetch=old}
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
