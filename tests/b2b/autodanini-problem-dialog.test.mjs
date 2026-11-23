import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require=createRequire(import.meta.url);
const {MAX_QUESTIONS,subjects,topicByText,getQuestion,validateMockAiFollowup}=require('../../public/danini-problem-guide.js');

test('all five situations provide three DE/SR questions and practical German seller questions',()=>{
 assert.equal(MAX_QUESTIONS,3);
 assert.deepEqual(subjects.map(x=>x.id),['deposit','travel','documents','seller','import']);
 for (const scenario of subjects){
   assert.equal(scenario.questions.length,3,scenario.id);
   for (const de of [false,true]){
     let answers=[];
     for (let i=0;i<MAX_QUESTIONS;i++){
       const q=getQuestion(scenario,i,answers,de);
       assert.ok(q.question.length>=15,scenario.id+' missing question');
       assert.ok(q.why.length>=15,scenario.id+' missing reason');
       answers.push({value:'unknown'});
     }
     assert.equal(getQuestion(scenario,MAX_QUESTIONS,answers,de),null);
   }
   assert.ok(scenario.questionsSeller.every(x=>x.endsWith('?')),scenario.id+' seller questions');
 });
});
test('next question depends on previous answer, including unknown; no repeated question',()=>{
 for (const scenario of subjects){
  for (let i=1;i<3;i++){
   const variants=['yes','no','unknown'].map(value=>getQuestion(scenario,i,i===1?[{value}]:[{value:'yes'},{value}],false).question);
   assert.equal(new Set(variants).size,3,scenario.id+' step '+i+' is not responsive');
  }
 }
});
test('free problem text classifies conservatively with an explicit unknown/ambiguous fallback',()=>{
 assert.equal(topicByText('Prodavac traži kaparu'),'deposit');
 assert.equal(topicByText('Ich soll eine Anzahlung leisten'),'deposit');
 assert.equal(topicByText('Želim da putujem u Nemačku'),'travel');
 assert.equal(topicByText('Fahrzeugbrief fehlt'),'documents');
 assert.equal(topicByText('Treba mi pomoć na nemačkom'),'seller');
 assert.equal(topicByText('Kolika je carina za uvoz auta?'),'import');
 assert.equal(topicByText('Nešto ne znam'),null);
 assert.equal(topicByText('Kapara i dokumenta su problem'),null);
});
test('model mock contract is strict; invalid, repeated or unsupported claims are rejected',()=>{
 const valid={kind:'follow_up',question:'Haben Sie die FIN bereits verglichen?',why:'Der Abgleich zeigt mögliche Widersprüche.',missing:['FIN-Abgleich']};
 assert.deepEqual(validateMockAiFollowup(valid),valid);
 assert.equal(validateMockAiFollowup({...valid,extra:'ignored'}),null);
 assert.equal(validateMockAiFollowup({...valid,kind:'vehicle_certified'}),null);
 assert.equal(validateMockAiFollowup({...valid,question:'X'.repeat(181)}),null);
 assert.equal(validateMockAiFollowup({...valid,missing:Array(6).fill('item')}),null);
 assert.equal(validateMockAiFollowup({...valid,why:'Garantiert sicherer Kauf'}),null);
 assert.equal(validateMockAiFollowup(valid,[valid.question]),null);
 assert.equal(validateMockAiFollowup('bad payload'),null);
});
test('free dialogue makes no network or model calls and never persists free-text notes',()=>{
 const source=readFileSync('public/danini-problem-guide.js','utf8');
 assert.doesNotMatch(source,/\bfetch\s*\(|\bXMLHttpRequest\b|\bAI\.run\s*\(/);
 assert.match(source,/sessionStorage\.setItem\(STORE,JSON\.stringify\(\{id:selected\.id,values:answers\.map\(a=>a\.value\)\}\)\)/);
 assert.match(source,/step=0;answers=\[\]/);
 assert.match(source,/answers=answers\.slice\(0,i\)/);
 assert.match(source,/result\.append\(el\('h3',l\.results\)/);
 assert.match(source,/noMail/);
 assert.match(source,/auto-check\/#contact/);
});
