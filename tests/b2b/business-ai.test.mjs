import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze} from '../../src/ai/analyze.ts';
import {intake,caseStatus} from '../../src/api/intake.ts';
import {digest} from '../../src/security/http.ts';
import {env,valid,req,captcha} from './helpers.mjs';

for(const language of ['de','sr'])test(`business ${language}: recorded case, grounded draft access and idempotent retry`,async()=>{
 const e=env(), before=globalThis.fetch;
 const input={...valid(),vertical:'business',language,message:'Tražim proizvođača metalnih komponenti u Srbiji za isporuke firmama u Nemačkoj.'};
 const kv=new Map();
 e.PARTNERS={get:async k=>kv.get(k),put:async(k,v)=>kv.set(k,v)};
 e.AI_ENABLED='true';e.DANINI_AI_LIVE_APPROVED='true';
 e.AI={run:async(_model,body)=>{
   assert.ok(!body.messages[1].content.includes(input.email));
   return {response:{summary:'Preliminarni zahtev za poslovno istraživanje.',questions:['Koje količine i rokove očekujete?'],missingData:['Količine'],limitations:['Dobavljači još nisu provereni.']}};
 }};
 globalThis.fetch=captcha;
 try{
  const created=await (await intake(req(input),e)).json();
  const repeated=await (await intake(req(input),e)).json();
  assert.equal(created.caseId,repeated.caseId);
  assert.equal(e.DANINI_DB.db.prepare('SELECT count(*) AS n FROM cases').get().n,1);
  const draft=await analyze(e,input);assert.equal(draft.generatedBy,'ai');
  const serialized=JSON.stringify(draft);
  await e.DOCUMENTS.put(`cases/${created.caseId}/draft.json`,serialized);
  e.DANINI_DB.db.prepare('UPDATE cases SET draft_hash=?,status=? WHERE id=?').run(await digest(serialized),'awaiting_approval',created.caseId);
  const read=token=>caseStatus(new Request('https://danini.test/api/case/'+created.caseId,{headers:{authorization:'Bearer '+token}}),e,created.caseId);
  assert.equal((await read('wrong-token')).status,404);
  const output=await (await read(created.accessToken)).json();
  assert.equal(output.preliminary.generatedBy,'ai');
  assert.equal(output.preliminary.requiresHumanReview,true);
  assert.deepEqual(output.preliminary.questions,draft.questions);
  assert.equal(JSON.stringify(output).includes(input.email),false);
  await e.DOCUMENTS.put(`cases/${created.caseId}/draft.json`,JSON.stringify({...draft,summary:'tampered'}));
  assert.equal((await (await read(created.accessToken)).json()).preliminary,null);
 }finally{globalThis.fetch=before;}
});
test('business inference fails closed at daily cap and labels malformed output as rules',async()=>{
 const e=env();e.AI_ENABLED='true';e.DANINI_AI_LIVE_APPROVED='true';
 let calls=0;e.AI={run:async()=>{calls++;return {response:'invalid'};}};
 e.PARTNERS={get:async()=> '20',put:async()=>{}};
 assert.equal((await analyze(e,{...valid(),vertical:'business'})).generatedBy,'rules');assert.equal(calls,0);
 e.PARTNERS.get=async()=> '0';
 const fallback=await analyze(e,{...valid(),vertical:'business'});
 assert.equal(fallback.generatedBy,'rules');assert.equal(calls,1);assert.equal(fallback.questions.length,3);
});
