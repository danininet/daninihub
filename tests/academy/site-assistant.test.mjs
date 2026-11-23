import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {siteAssistantRoute} from '../../workers/danini-site-assistant.mjs';
function env(patch={}){
 const db=new DatabaseSync(':memory:');
 db.exec('CREATE TABLE rate_buckets(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at INTEGER NOT NULL)');
 const bound={prepare(sql){return{bind(...args){return{async first(){return db.prepare(sql).get(...args)||null},async run(){return db.prepare(sql).run(...args)}}}}}};
 return {db,vars:{
 DANINI_SITE_ASSISTANT_ENABLED:'true',ACADEMY_AI_ENABLED:'true',DANINI_ACADEMY_AI_SPEND_APPROVED:'true',AI_ENABLED:'true',
 DANINI_AI_LIVE_APPROVED:'true',DANINI_DB:bound,DANINI_TURNSTILE_SITEKEY:'test-site-key',DANINI_TURNSTILE_SECRET:'test-secret',
 AI:{run:async()=>({response:{answer:'Prvo definiši konkretan problem koji korisnik ima, umesto da obećavaš rezultat bez provere.',nextStep:'Napravi listu tri stvarna razgovora sa potencijalnim kupcima.',requiresHuman:false}})},
 ...patch}};
}
const status=()=>new Request('https://daninihub.com/api/assistant/status');
const ask=(over={},origin='https://daninihub.com')=>new Request('https://daninihub.com/api/assistant/ask',{method:'POST',headers:{origin,'content-type':'application/json','cf-connecting-ip':'192.0.2.6'},
 body:JSON.stringify({language:'sr',context:'academy',field:'Ciljna grupa',question:'Šta upisujem u ciljnu grupu?',turnstileToken:'test-token-very-long',...over})});
function mockHuman(result={success:true,hostname:'daninihub.com',action:'danini-assistant'}){
 const old=globalThis.fetch;const calls=[];globalThis.fetch=async(url)=>{calls.push(url);return Response.json(result)};
 return{calls,restore:()=>globalThis.fetch=old};
}
test('site assistant defaults closed unless separate and Academy spend gates are ON',async()=>{
 const {db,vars}=env({DANINI_SITE_ASSISTANT_ENABLED:'false'});
 try{
  const r=await siteAssistantRoute(status(),vars);
  assert.equal(r.status,200);assert.equal((await r.json()).enabled,false);
  const p=await siteAssistantRoute(ask(),vars);assert.equal(p.status,503);
  for(const key of ['ACADEMY_AI_ENABLED','DANINI_ACADEMY_AI_SPEND_APPROVED','DANINI_AI_LIVE_APPROVED']){
   const x=await siteAssistantRoute(status(),{...vars,DANINI_SITE_ASSISTANT_ENABLED:'true',[key]:'false'});
   assert.equal((await x.json()).enabled,false);
  }
 }finally{db.close()}
});
test('bad origin and payload are rejected before verification or AI use',async()=>{
 const {db,vars}=env();let calls=0;vars.AI={run(){calls++;throw Error('must not infer')}};
 const cap=mockHuman();
 try{
  assert.equal((await siteAssistantRoute(ask({},'https://evil.example'),vars)).status,403);
  assert.equal((await siteAssistantRoute(ask({question:'x'.repeat(421)}),vars)).status,400);
  assert.equal((await siteAssistantRoute(ask({context:'unknown'}),vars)).status,400);
  assert.equal((await siteAssistantRoute(ask({language:'en'}),vars)).status,400);
  assert.equal((await siteAssistantRoute(ask({field:'x'.repeat(66)}),vars)).status,400);
  assert.equal((await siteAssistantRoute(new Request('https://daninihub.com/api/assistant/ask'),vars)).status,405);
  assert.equal(cap.calls.length,0);assert.equal(calls,0);
 }finally{cap.restore();db.close()}
});
test('Turnstile action mismatch denies inference without consuming quota',async()=>{
 const {db,vars}=env(),cap=mockHuman({success:true,hostname:'daninihub.com',action:'academy-ai'});let calls=0;
 vars.AI={run(){calls++;return null}};
 try{
  const r=await siteAssistantRoute(ask(),vars);assert.equal(r.status,403);
  assert.equal((await r.json()).error,'human_verification_failed');
  assert.equal(calls,0);
  assert.equal(db.prepare('SELECT COUNT(*) total FROM rate_buckets').get().total,0);
 }finally{cap.restore();db.close()}
});
test('limited response and shared Academy AI quota are enforced',async()=>{
 const {db,vars}=env(),cap=mockHuman();let calls=0;
 vars.AI={run:async(model,body)=>{calls++;assert.equal(model,'@cf/meta/llama-3.1-8b-instruct-fast');assert.equal(body.max_tokens,280);
   return {response:{answer:'Napiši ko je tipičan kupac i koji konkretan problem rešava tvoja usluga.',nextStep:'Proveri interesovanje kroz tri stvarna razgovora.',requiresHuman:false}}}};
 try{
  for(let i=0;i<2;i++){
   const r=await siteAssistantRoute(ask(),vars);assert.equal(r.status,200,await r.clone().text());
   const b=await r.json();assert.equal(b.aiUsed,true);assert.equal(b.unverified,true);assert.match(b.nextStep,/tri stvarna/);
  }
  const third=await siteAssistantRoute(ask(),vars);assert.equal(third.status,429);
  assert.equal((await third.json()).error,'assistant_daily_limit');assert.equal(calls,2);
  const daily=db.prepare("SELECT count FROM rate_buckets WHERE key LIKE 'academy-ai-global:%'").get();
  assert.equal(daily.count,3);
 }finally{cap.restore();db.close()}
});
test('invalid model result does not pretend there was a successful answer',async()=>{
 const {db,vars}=env({AI:{run:async()=>({response:{answer:'short'}})}}),cap=mockHuman();
 try{const r=await siteAssistantRoute(ask(),vars);assert.equal(r.status,502);assert.equal((await r.json()).error,'assistant_invalid_output')}
 finally{cap.restore();db.close()}
});
