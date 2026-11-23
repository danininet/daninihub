import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MAX_ADDITIONAL_QUESTIONS,BUYER_DIALOG_MODEL,validateBuyerQuestion,simulateBuyerFollowUp} from '../../workers/danini-buyer-dialog-ai.mjs';

const context={
 locale:'sr',topic:'deposit',
 answers:['yes','unknown','no'],
 asked:['Da li prodavac traži avans?', 'Da li ste dobili originalne papire?', 'Da li ste proverili VIN?']
};
const valid={kind:'follow_up',question:'Da li prodavac dopušta nezavisan pregled pre kapare?',why:'Ova informacija je važna pre odlučivanja o uplati.',missing:['nezavisni pregled']};

test('AI supplement is mock-only and cannot call inference without an explicit injected test fake',async()=>{
 let called=0;
 const blocked=await simulateBuyerFollowUp(context);
 assert.equal(blocked.mode,'rules_only');
 assert.equal(blocked.aiUsed,false);
 assert.equal(blocked.followUp,null);
 const mock=async options=>{
  called++;
  assert.equal(options.model,BUYER_DIALOG_MODEL);
  assert.equal(options.max_tokens,250);
  assert.equal(options.temperature,0);
  const sent=JSON.parse(options.messages[1].content);
  assert.deepEqual(Object.keys(sent).sort(),['answers','asked','extraQuestions','topic']);
  assert.deepEqual(sent.answers,context.answers);
  assert.equal(options.messages.length,2);
  return JSON.stringify(valid);
 };
 const result=await simulateBuyerFollowUp(context,mock);
 assert.equal(called,1);
 assert.equal(result.mode,'mock_only');
 assert.equal(result.aiUsed,false,'mock must not be labeled real AI');
 assert.deepEqual(result.followUp,valid);
});
test('at most two additional mock questions, with no unlimited chat loop',async()=>{
 assert.equal(MAX_ADDITIONAL_QUESTIONS,2);
 let calls=0;
 const run=async()=>{calls++;return valid;};
 const next=await simulateBuyerFollowUp({...context,extraQuestions:1,asked:[...context.asked,'Da li je dokumentacija potpuna?']},run);
 assert.equal(next.mode,'mock_only');
 const stop=await simulateBuyerFollowUp({...context,extraQuestions:2,asked:[...context.asked,'Da li je dokumentacija potpuna?','Da li je potreban pregled?']},run);
 assert.equal(stop.mode,'rules_only');
 assert.equal(stop.reason,'invalid_context_or_limit');
 assert.equal(calls,1);
});
test('invalid model responses, duplicates, hallucinated assurances and outage return explicit rules-only fallback',async()=>{
 const samples=[
  {...valid,extra:'x'},
  {...valid,question:context.asked[0]},
  {...valid,why:'Garantiert sicherer Kauf.'},
  {...valid,missing:['VIN','vin']},
  {...valid,question:'This is not a question'},
  {...valid,question:'Da li je auto 100% siguran?'},
 ];
 for (const candidate of samples){
  assert.equal(validateBuyerQuestion(candidate,context.asked),null);
  const r=await simulateBuyerFollowUp(context,async()=>candidate);
  assert.equal(r.mode,'rules_only');
  assert.equal(r.reason,'invalid_mock_response');
  assert.equal(r.aiUsed,false);
 }
 const outage=await simulateBuyerFollowUp(context,async()=>{throw Error('mock timeout')});
 assert.equal(outage.reason,'mock_unavailable');
 assert.equal(outage.aiUsed,false);
});
test('model contract stays disconnected from production and does not transmit free-text or PII',()=>{
 const source=readFileSync('workers/danini-buyer-dialog-ai.mjs','utf8');
 assert.doesNotMatch(source,/\bfetch\s*\(|\benv\.AI\.run\s*\(/);
 assert.doesNotMatch(source,/email|documentImage|sourceUrl|phoneNumber/);
 assert.match(source,/simulated_not_live/);
 assert.match(source,/ai_not_released/);
});
