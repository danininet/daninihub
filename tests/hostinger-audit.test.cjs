'use strict';
const {test}=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs');
test('static preview remains noindex and only Make is approved in relevant guides',()=>{
 const link='https://www.make.com/en/register?pc=danini';
 const files=['index.html','de/index.html','sr/index.html','de/ai-savetnik/index.html','sr/business/index.html','auto/import.html'];
 for(const lang of ['de','sr']) for(const guide of ['gebrauchtwagen-anzahlung','fahrzeugpapiere','auto-deutschland-serbien','kundenanfragen','email-formular-crm','ki-buero']) files.push(lang+'/wissen/'+guide+'/index.html');
 for(const file of files){
  const h=fs.readFileSync('dist/'+file,'utf8');
  assert.match(h,/name="robots" content="noindex,nofollow,noarchive"/,file);
  assert.match(h,/data-hostinger-preview/,file);
  assert.match(h,/data-hostinger-preview-csp/,file);
  assert.match(h,/form-action 'none'/,file);
  if(/wissen\/(email-formular-crm|ki-buero)\//.test(file)){
   assert.match(h,/data-affiliate-recommendations/,file);
   assert.ok(h.includes('href="'+link+'"'),file);
   assert.match(h,/rel="sponsored noopener noreferrer"/,file);
   assert.ok(h.includes(file.startsWith('de/')?'Werbung / Affiliate-Links':'Oglas / affiliate linkovi'),file);
  }else{assert.doesNotMatch(h,/data-affiliate-recommendations/,file);assert.ok(!h.includes(link),file);}
  assert.doesNotMatch(h,/REFERRALCODE=BU8DANINIBES/,file);
 }
 for(const lang of ['de','sr']){
 const h=fs.readFileSync('dist/'+lang+'/index.html','utf8');
 assert.ok(h.includes('https://daninihub.com/'+lang+'/ai-savetnik/'));
 assert.ok(h.includes('https://daninihub.com/'+lang+'/business/#anfrage'));
 }
});
