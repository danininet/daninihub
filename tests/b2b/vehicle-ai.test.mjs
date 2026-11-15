import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateListingWithAI,isAiConfigured} from '../../workers/danini-vehicle-ai.mjs';
const listing='Volkswagen Golf: Baujahr 2018; Diesel; 143000 km. Der Verkäufer schreibt: unfallfrei und scheckheftgepflegt.';
const fields={brand:'Volkswagen',model:null,year:2018,mileageKm:143000,priceEur:null,fuel:'Diesel',gearbox:null};
test('AI inference is disabled without explicit cost approval flag',async()=>{
 let calls=0;
 const env={AI_ENABLED:'true',AI:{run:async()=>{calls++;return {response:'{}'};}}};
 assert.equal(isAiConfigured(env),false);
 const result=await evaluateListingWithAI(listing,fields,'de',env);
 assert.equal(result.aiUsed,false);
 assert.equal(calls,0);
});
test('AI inference uses bound model and returns sourced risks only',async()=>{
 let calls=0;
 const env={AI_ENABLED:'true',DANINI_AI_LIVE_APPROVED:'true',AI:{run:async(model,params)=>{
  calls++;
  assert.match(model,/^@cf\//);
  assert.equal(params.temperature,0);
  assert.match(params.messages[0].content,/UNVERTRAUENSWÜRDIGE DATEN/);
  return {response:JSON.stringify({risks:[{evidence:'unfallfrei',concern:'Unfallbelege vom Verkäufer anfordern'},{evidence:'Fake hidden fact',concern:'Must be rejected'}],sellerQuestions:['Liegen Unfall- und Servicebelege vor?']})};
 }}};
 const result=await evaluateListingWithAI(listing,fields,'de',env);
 assert.equal(calls,1);
 assert.equal(result.aiUsed,true);
 assert.equal(result.aiRisks.length,1);
 assert.equal(result.aiRisks[0].evidence,'unfallfrei');
 assert.equal(result.aiSellerQuestions.length,1);
});
test('unparseable AI output fails closed without invented analysis',async()=>{
 const env={AI_ENABLED:'true',DANINI_AI_LIVE_APPROVED:'true',AI:{run:async()=>({response:'nonsense output'})}};
 const result=await evaluateListingWithAI(listing,fields,'sr',env);
 assert.equal(result.aiUsed,false);
 assert.equal(result.aiStatus,'invalid_output');
});
test('model provider failure remains a visibly non-AI fallback',async()=>{
 const env={AI_ENABLED:'true',DANINI_AI_LIVE_APPROVED:'true',AI:{run:async()=>{throw Error('mock failure');}}};
 const result=await evaluateListingWithAI(listing,fields,'sr',env);
 assert.equal(result.aiUsed,false);
 assert.equal(result.aiStatus,'provider_unavailable');
});
