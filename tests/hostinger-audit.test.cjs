'use strict';
const {test}=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs');
test('static preview is marked and affiliate placements are inactive',()=>{
 for(const file of ['index.html','de/index.html','sr/index.html','de/ai-savetnik/index.html','sr/business/index.html','de/wissen/gebrauchtwagen-anzahlung/index.html','sr/wissen/email-formular-crm/index.html','auto/import.html']){
  const h=fs.readFileSync('dist/'+file,'utf8');
  assert.match(h,/name="robots" content="noindex,nofollow,noarchive"/,file);
  assert.match(h,/data-hostinger-preview/,file);
  assert.doesNotMatch(h,/data-affiliate-recommendations/,file);
 }
 for(const lang of ['de','sr']){
 const h=fs.readFileSync('dist/'+lang+'/index.html','utf8');
 assert.ok(h.includes('https://daninihub.com/'+lang+'/ai-savetnik/'));
 assert.ok(h.includes('https://daninihub.com/'+lang+'/business/#anfrage'));
 }
});
