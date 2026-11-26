import test from "node:test";
import assert from "node:assert/strict";
import {classifyIntake} from "../../src/ai/intake-classification.ts";
import {reserveBusinessInference} from "../../src/ai/business-quota.ts";
import {analyze} from "../../src/ai/analyze.ts";
import {env,valid} from "./helpers.mjs";
const examples=[
 ["Wir möchten unsere Kundenanfragen und Angebotsentwürfe besser organisieren.","de","DANINI Business","business_automation","none_detected"],
 ["Želimo unaprediti obradu upita klijenata.","sr","DANINI Business","business_automation","none_detected"],
 ["Ich möchte ein Fahrzeug kaufen, ist eine Anzahlung erforderlich?","de","AutoDanini","vehicle_document_check","payment"],
 ["Zelim da proverim vozilo pre kapare.","sr","AutoDanini","vehicle_document_check","payment"],
 ["Wir suchen öffentliche Ausschreibungen.","de","DANINI Business","tender_preparation","none_detected"],
 ["Želimo da pratimo javne nabavke.","sr","DANINI Business","tender_preparation","none_detected"],
 ["Hello there","unknown","unresolved","clarify","none_detected"],
 ["Wir suchen ein Fahrzeug za firmu.","unknown","unresolved","clarify","none_detected"]
];
for(const [message,language,vertical,intent,risk] of examples)test("classification: "+message,()=>{
 assert.deepEqual(classifyIntake(message),{language,vertical,intent,risk,requiresHumanReview:true});
});
test("form language remains authoritative and mixed input needs clarification",()=>{
 assert.equal(classifyIntake("Wir suchen vozilo.","sr").language,"sr");
});
test("risk prevents inference even when enabled; no raw sensitive text in draft",async()=>{
 const e=env();e.AI_ENABLED="true";e.DANINI_AI_LIVE_APPROVED="true";
 let calls=0;e.AI={run:async()=>{calls++;throw Error("must not call");}};
 for(const message of ["Bitte schicken Sie mir Ihre Ausweisnummer.","Zelim pravni savet za firmu.","Bitte sofort senden Sie das Angebot.","Zelim da platim kaparu."]){
  const d=await analyze(e,{...valid(),vertical:"business",message});
  assert.equal(d.generatedBy,"rules");assert.notEqual(d.classification.risk,"none_detected");assert.equal(d.requiresHumanReview,true);assert.ok(!JSON.stringify(d).includes(message));
 }
 assert.equal(calls,0);
});
test("concurrent business inference reservations never exceed 20",async()=>{
 const e=env();e.PARTNERS={get:async()=>null};
 const results=await Promise.all(Array.from({length:50},()=>reserveBusinessInference(e)));
 assert.equal(results.filter(Boolean).length,20);
 assert.equal(await reserveBusinessInference(e),false);
});
test("migration respects existing daily KV count and storage failures",async()=>{
 const e=env();e.PARTNERS={get:async()=> "19"};
 assert.equal(await reserveBusinessInference(e),true);
 assert.equal(await reserveBusinessInference(e),false);
 assert.equal(await reserveBusinessInference({}),false);
 e.PARTNERS.get=async()=>{throw Error("unavailable");};assert.equal(await reserveBusinessInference(e),false);
});
test("rules-based questions are localized for business and tender",async()=>{
 const e=env();for(const [message,language,pattern] of [[examples[0][0],"de",/Anfrageprozess/],[examples[1][0],"sr",/poslovni proces/],[examples[4][0],"de",/Ausschreibung/],[examples[5][0],"sr",/tender/]]){
 const d=await analyze(e,{...valid(),vertical:"business",message,language});
 assert.equal(d.generatedBy,"rules");assert.match(d.questions[0],pattern);assert.equal(d.language,language);
 }
});
