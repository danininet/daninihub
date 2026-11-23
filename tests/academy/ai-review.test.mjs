import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {academyAiRoute} from '../../workers/danini-academy-ai.mjs';

const origin='https://daninihub.com';
function db(){
 const engine=new DatabaseSync(':memory:');
 engine.exec('CREATE TABLE rate_buckets(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at INTEGER NOT NULL)');
 const api={prepare(sql){return {bind(...a){return {
  async first(){return engine.prepare(sql).get(...a)||null},
  async run(){return engine.prepare(sql).run(...a)},
  async all(){return {results:engine.prepare(sql).all(...a)}}
 }}}}};
 return {engine,api};
}
function env(override={}){
 const {engine,api}=db();
 const state={ACADEMY_AI_ENABLED:'true',DANINI_ACADEMY_AI_SPEND_APPROVED:'true',
 AI_ENABLED:'true',DANINI_AI_LIVE_APPROVED:'true',DANINI_DB:api,
 DANINI_TURNSTILE_SECRET:'test',DANINI_TURNSTILE_SITEKEY:'1x00000000000000000000AA',
 AI:{run:async()=>({response:JSON.stringify({questions:['Ko bi konkretno koristio ovu uslugu?'],assumptions:['Potražnja nije potvrđena razgovorima'],nextStep:'Razgovaraj sa tri potencijalna kupca bez prikupljanja poverljivih podataka.'})})},
 ...override};return {engine,state};
}
function req(data={},opts={}){
 return new Request(origin+'/api/academy/ai/review',{
  method:'POST',headers:{origin:opts.origin??origin,'content-type':'application/json','cf-connecting-ip':opts.ip??'192.0.2.5'},
  body:JSON.stringify({language:'sr',step:'niche',projectName:'Digitalna administracija',
   fields:{a:'Male firme u Nemačkoj',b:'Prijave kupaca kasne',c:'Nije provereno'},turnstileToken:'testing-turnstile-token',...data})});
}
const status=()=>new Request(origin+'/api/academy/ai/status');
function fakeVerification(result={success:true,hostname:'daninihub.com',action:'academy-ai'}){
 const previous=globalThis.fetch;
 const calls=[];
 globalThis.fetch=async(url)=>{calls.push(String(url));return Response.json(result)};
 return {calls,restore:()=>{globalThis.fetch=previous}};
}
test('default CLOSED; no AI inference, no Turnstile, no secrets in status',async()=>{
 const {state,engine}=env({ACADEMY_AI_ENABLED:'false'});let calls=0;
 state.AI={run:()=>{calls++;throw Error('must not run')}};
 const f=fakeVerification();
 try{
  const s=await academyAiRoute(status(),state);
  assert.equal(s.status,200);const body=await s.json();
  assert.equal(body.enabled,false);assert.equal(body.siteKey,null);
  const p=await academyAiRoute(req(),state);
  assert.equal(p.status,503);assert.equal((await p.json()).error,'academy_ai_disabled');
  assert.equal(calls,0);assert.equal(f.calls.length,0);
  state.ACADEMY_AI_ENABLED='true';state.DANINI_ACADEMY_AI_SPEND_APPROVED='false';
  assert.equal((await (await academyAiRoute(status(),state)).json()).enabled,false);
  assert.equal((await academyAiRoute(req(),state)).status,503);
 }finally{f.restore();engine.close()}
});
test('validate origins, size, step, project, and Turnstile before quota or charge',async()=>{
 const {state,engine}=env();let calls=0;state.AI={run:()=>{calls++;throw Error('never')}};
 const f=fakeVerification({success:true,hostname:'wrong.example',action:'academy-ai'});
 try{
  assert.equal((await academyAiRoute(req({step:'nonexistent'}),state)).status,400);
  assert.equal((await academyAiRoute(req({}, {origin:'https://attacker.example'}),state)).status,403);
  assert.equal((await academyAiRoute(req({projectName:'x'.repeat(200)}),state)).status,400);
  assert.equal((await academyAiRoute(req({fields:{a:'x'.repeat(1501)}}),state)).status,400);
  assert.equal((await academyAiRoute(req(),state)).status,403);
  assert.equal(calls,0);
  assert.equal(engine.prepare('SELECT COUNT(*) n FROM rate_buckets').get().n,0);
 }finally{f.restore();engine.close()}
});
test('real guarded inference returns bounded DE/SR questions and advances atomic daily cap',async()=>{
 const {state,engine}=env(),f=fakeVerification();const modelCalls=[];
 state.AI={run:async (model,params)=>{
  modelCalls.push({model,params});
  return {response:JSON.stringify({questions:['Ko je tačno ciljna grupa?','Kako ćete proveriti potražnju?','Koji je mali prvi test?','Četvrto pitanje se odbacuje'],
   assumptions:['Tržišna potražnja nije potvrđena'],nextStep:'Proverite sa tri stvarne firme i zabeležite datum, pa tek onda razmotrite ponudu.'})};
 }};
 try{
  for(let i=0;i<2;i++){
   const r=await academyAiRoute(req(),state);
   assert.equal(r.status,200,await r.clone().text());const p=await r.json();
   assert.equal(p.aiUsed,true);assert.equal(p.questions.length,3);
   assert.equal(p.unverified,true);assert.match(p.nextStep,/Proverite/);
  }
  const third=await academyAiRoute(req(),state);
  assert.equal(third.status,429);assert.equal((await third.json()).error,'academy_ai_daily_limit');
  assert.equal(modelCalls.length,2);
  assert.equal(modelCalls[0].model,'@cf/meta/llama-3.1-8b-instruct-fast');
  assert.equal(modelCalls[0].params.max_tokens,380);
  const global=engine.prepare("SELECT count FROM rate_buckets WHERE key LIKE 'academy-ai-global:%'").get();
  assert.equal(global.count,3); // rejected per-IP call consumed a global slot conservatively.
  assert.equal(f.calls.length,3);
 }finally{f.restore();engine.close()}
});
test('provider, invalid model JSON and storage errors never claim successful analysis',async()=>{
 const f=fakeVerification();
 try{
  for(const [AI,expected] of [[{run:async()=>{throw Error('provider unavailable')}},'academy_ai_provider_unavailable'],
    [{run:async()=>({response:'not valid'})},'academy_ai_invalid_output']]){
   const {state,engine}=env({AI});try{
    const r=await academyAiRoute(req(),state);
    assert.ok([502,503].includes(r.status));assert.equal((await r.json()).error,expected);
   }finally{engine.close()}
  }
  const {state,engine}=env({DANINI_DB:{prepare(){throw Error('missing schema')}}});
  try{const r=await academyAiRoute(req(),state);assert.equal(r.status,503);assert.equal((await r.json()).error,'academy_ai_quota_unavailable')}
  finally{engine.close()}
 }finally{f.restore()}
});
