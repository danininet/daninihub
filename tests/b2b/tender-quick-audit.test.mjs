import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assess, choices, weights } from "../../src/lib/tender-quick-audit.mjs";
test("all 1024 valid combinations are bounded and unknown answers require review",()=>{
  for(let n=0;n<1024;n++){
    const answers=Array.from({length:5},(_,i)=>choices[(n>>(2*i))&3]);
    const r=assess(answers);
    const expected=answers.reduce((s,a,i)=>s+weights[i]*({yes:1,partial:.5,no:0,unknown:0}[a]),0);
    assert.equal(r.score,expected);
    assert.ok(r.score>=0&&r.score<=100);
    assert.deepEqual(r.gaps,answers.flatMap((a,i)=>a==="yes"?[]:[i]));
    assert.equal(r.eligibility,"unverified");
    assert.equal(r.status,answers.includes("unknown")?"review":expected>=80?"initial-ready":expected>=50?"partial":"prepare");
  }
});
test("minimum, maximum, partial and malformed inputs",()=>{
  assert.equal(assess(Array(5).fill("yes")).score,100);
  assert.equal(assess(Array(5).fill("no")).score,0);
  assert.equal(assess(Array(5).fill("partial")).score,50);
  for(const input of [null,{},[],Array(5),["yes","yes","yes","yes",""],Array(6).fill("yes"),Array(5).fill("__proto__")])
    assert.throws(()=>assess(input),TypeError);
});
test("audit is mounted within Business and transfer is draft-only",()=>{
  const landing=readFileSync("src/components/BusinessLanding.astro","utf8");
  const ui=readFileSync("src/components/TenderQuickAudit.astro","utf8");
  assert.match(landing,/<TenderQuickAudit locale=\{locale\}/);
  assert.match(landing,/<BusinessContact locale=\{locale\}/);
  assert.match(ui,/form\[data-business-enquiry\]/);
  assert.match(ui,/message\.value = next/);
  assert.match(ui,/old\.includes\(summary\)/);
  assert.match(ui,/message\.maxLength/);
  assert.match(ui,/transfer\.addEventListener\("click"/);
  assert.doesNotMatch(ui,/\bfetch\s*\(|\.submit\s*\(|\.requestSubmit\s*\(|localStorage|sessionStorage|sendBeacon/);
});
