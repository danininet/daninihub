import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const source = readFileSync("src/components/AutoContact.astro", "utf8");
for(const locale of ["de","sr"]){
 test("AutoDanini "+locale+" provides usable visitor-controlled email draft fallback",()=>{
   assert.match(source,/data-auto-enquiry/);
   assert.match(source,/emailFallback = true/);
   assert.match(source,/if \(emailFallback\)/);
   assert.match(source,/mailto:auto@daninihub\.com\?subject=/);
   assert.match(source,/form\.reportValidity\(\)/);
   assert.match(source,/<button data-auto-submit type="submit" disabled>/);
   assert.match(source,/submit\.disabled = false;\s*void init\(\)/);
   assert.match(source,locale==="de"?/E-Mail-Entwurf öffnen/:/Otvori nacrt e-maila/);
 });
}
test("Normal secured AutoDanini lead flow and transparent acknowledgement remain unchanged",()=>{
 assert.match(source,/fetch\("\/api\/lead\/status"/);
 assert.match(source,/action:"business-contact"/);
 assert.match(source,/fetch\("\/api\/lead"/);
 assert.match(source,/turnstileToken:token/);
 assert.match(source,/response\.status!==202/);
 assert.match(source,/data\.accepted!==true/);
 assert.match(source,/!data\.reference/);
 assert.match(source,/getResponse\(widget\)/);
});
