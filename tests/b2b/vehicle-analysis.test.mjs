import test from 'node:test';
import assert from 'node:assert/strict';
import {handleVehicleAnalysis} from '../../workers/danini-vehicle-analysis.mjs';

const longText='Volkswagen Golf Baujahr 2018, Diesel, Automatik, 143.000 km, 12.500 EUR. Unfallfrei laut Anbieter, scheckheftgepflegt. Weitere Angaben nach Rückfrage.';
const make=(source,origin='https://daninihub.com',token='mock-token-long-enough')=>new Request('https://daninihub.com/api/vehicle-analysis',{method:'POST',headers:{origin,'content-type':'application/json','cf-connecting-ip':'192.0.2.1'},body:JSON.stringify({language:'de',source,turnstileToken:token})});
test('URL never fetched; asks for copied ad text',async()=>{
 const r=await handleVehicleAnalysis(make('https://www.mobile.de/fahrzeuge/details.html?id=123'));
 assert.equal(r.status,422);
 assert.equal((await r.json()).error,'text_required');
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
