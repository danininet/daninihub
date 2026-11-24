import test from "node:test";
import assert from "node:assert/strict";
import { makeAiBridge } from "../../src/api/make-ai-bridge.ts";
const token = "synthetic-test-token-not-a-real-secret-123";
const input = { mode:"TEST", reference:"DN-TEST-BRIDGE-01", message:"Ich möchte ein Fahrzeug prüfen.", language:"de", vertical:"AutoDanini", synthetic:true };
function fixture() {
  let count=0, calls=0;
  const env = { MAKE_AI_BRIDGE_ENABLED:"true", MAKE_AI_BRIDGE_TOKEN:token, AI_ENABLED:"true", DANINI_AI_LIVE_APPROVED:"true",
    MAKE_AI_TEST_DB:{prepare(sql){assert.match(sql,/WHERE attempts < 5 RETURNING attempts/);return {bind(){return {async first(){return count>=5?null:{attempts:++count};}}}}}},
    AI:{async run(){calls++;return {response:"Synthetic draft"};}} };
  return {env, calls:()=>calls};
}
const req=(body=input,auth=token)=>new Request("https://example.invalid/test",{method:"POST",headers:{authorization:"Bearer "+auth},body:JSON.stringify(body)});
test("disabled and unauthorized never call AI",async()=>{const f=fixture();assert.equal((await makeAiBridge(req(),{...f.env,MAKE_AI_BRIDGE_ENABLED:"false"})).status,404);assert.equal((await makeAiBridge(req(input,"wrong"),f.env)).status,401);assert.equal(f.calls(),0);});
test("reject live and non-synthetic input",async()=>{const f=fixture();for(const body of [{...input,mode:"LIVE"},{...input,synthetic:false}])assert.equal((await makeAiBridge(req(body),f.env)).status,400);assert.equal(f.calls(),0);});
test("oversized body rejected",async()=>{const f=fixture();assert.equal((await makeAiBridge(req({...input,message:"x".repeat(5000)}),f.env)).status,413);assert.equal(f.calls(),0);});
test("missing quota DB fails closed",async()=>{const f=fixture();assert.equal((await makeAiBridge(req(),{...f.env,MAKE_AI_TEST_DB:undefined})).status,503);assert.equal(f.calls(),0);});
test("five reserved attempts and sixth rejected",async()=>{const f=fixture();const results=await Promise.all(Array.from({length:6},()=>makeAiBridge(req(),f.env)));assert.equal(results.filter(r=>r.status===200).length,5);assert.equal(results.filter(r=>r.status===429).length,1);assert.equal(f.calls(),5);const b=await results.find(r=>r.status===200).json();assert.equal(b.requiresHumanReview,true);assert.equal(b.externalActionAllowed,false);assert.equal(b.verified,false);});
test("AI failure consumes reservation and fails closed",async()=>{const f=fixture();f.env.AI.run=async()=>{throw Error("synthetic failure");};assert.equal((await makeAiBridge(req(),f.env)).status,503);});
