'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const express=require('express');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'danini-cases-'));
process.env.DANINI_IMPORTOS_STORAGE_FILE=path.join(tmp,'records.json');process.env.DANINI_ADMIN_SECRET='case-test-secret';process.env.BREVO_API_KEY='';process.env.DB_HOST='';
const {mountImportOSRuntime}=require('../server-importos-runtime');
const {mountPublicRuntime}=require('../server-public-runtime');
async function main(){const app=express();mountImportOSRuntime(app);mountPublicRuntime(app);const server=app.listen(0);try{
  const base='http://127.0.0.1:'+server.address().port;
  const json=async(url,method='GET',body,headers={})=>{const r=await fetch(base+url,{method,headers:{'Content-Type':'application/json',...headers},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json()}};
  const admin={'X-Danini-Admin':process.env.DANINI_ADMIN_SECRET};
  const create=await json('/api/importos/service-request','POST',{serviceType:'AD_REVIEW',email:'private@example.invalid',name:'Private Person',privacyAcknowledged:true,language:'sr',budget:8000,criteria:'Benzin automatik',purpose:'Niš',message:'Private request'});assert.equal(create.status,200);
  const ref=create.data.reference,u=new URL(create.data.trackingUrl),fragment=new URLSearchParams(u.hash.slice(1)),token=fragment.get('token');assert.equal(fragment.get('reference'),ref);assert.ok(token.length>40);assert.equal(u.search,'');
  const endpoint='/api/importos/cases/'+ref;
  assert.equal((await json(endpoint)).status,404);assert.equal((await json(endpoint,'GET',null,{'X-Case-Token':'wrong'})).status,404);
  const draft=await json(endpoint,'GET',null,{'X-Case-Token':token});assert.equal(draft.status,200);assert.equal(draft.data.case.published,false);assert.equal(draft.data.case.criteria,undefined);assert.ok(!JSON.stringify(draft.data).includes('private@example.invalid'));
  assert.equal((await json('/api/importos/admin/cases/'+ref)).status,403);
  let c=(await json('/api/importos/admin/cases/'+ref,'GET',null,admin)).data.case;
  assert.equal(c.budget,8000);assert.equal(c.criteria,'Benzin automatik');assert.equal(c.steps.length,8);
  c.steps[0].status='DONE';let r=await json('/api/importos/admin/cases/'+ref,'PUT',c,admin);assert.equal(r.status,400);assert.equal(r.data.error,'DONE_REQUIRES_EXECUTOR_AND_EVIDENCE');
  c.steps[0].executor='Analyst';c.steps[0].evidence='Written comparison 03.10.2026';c.nextAction='Request VIN from seller';c.report='<script>alert(1)</script>';c.published=true;c.costs=[{label:'Transport',amount:500,status:'CONFIRMED',source:''}];
  r=await json('/api/importos/admin/cases/'+ref,'PUT',c,admin);assert.equal(r.data.error,'CONFIRMED_COST_REQUIRES_SOURCE');
  c.costs[0].source='Written quote';c.candidates=[{label:'Test car',link:'javascript:alert(1)',match:'UNKNOWN'}];r=await json('/api/importos/admin/cases/'+ref,'PUT',c,admin);assert.equal(r.data.error,'INVALID_SOURCE_URL');
  c.candidates[0].link='https://example.org/vehicle';
  const results=await Promise.all([json('/api/importos/admin/cases/'+ref,'PUT',c,admin),json('/api/importos/admin/cases/'+ref,'PUT',c,admin)]);assert.deepEqual(results.map(x=>x.status).sort(),[200,409]);
  const visible=await json(endpoint,'GET',null,{'X-Case-Token':token});assert.equal(visible.data.case.published,true);assert.equal(visible.data.case.totalListedCosts,500);assert.equal(visible.data.case.nextAction,c.nextAction);assert.equal(visible.data.case.steps[0].evidence,c.steps[0].evidence);assert.ok(!JSON.stringify(visible.data).includes('caseTokenHash'));assert.ok(!JSON.stringify(visible.data).includes('private@example.invalid'));assert.ok(!JSON.stringify(visible.data).includes('Private request'));
  const deniedRotate=await json('/api/importos/admin/cases/'+ref+'/link','POST',{});assert.equal(deniedRotate.status,403);
  const rotated=await json('/api/importos/admin/cases/'+ref+'/link','POST',{},admin);assert.equal(rotated.status,200);const freshToken=new URLSearchParams(rotated.data.trackingPath.split('#')[1]).get('token');assert.notEqual(freshToken,token);assert.equal((await json(endpoint,'GET',null,{'X-Case-Token':token})).status,404);assert.equal((await json(endpoint,'GET',null,{'X-Case-Token':freshToken})).status,200);
  const stored=await app.locals.importOSStore.get(ref);assert.ok(!JSON.stringify(stored).includes(token));
  const restarted=require('../importos-store').createImportOSStore();assert.equal((await restarted.get(ref)).payload.purchaseCase.version,2);
  for(const route of ['/sr/moj-dosije','/de/mein-dossier','/owner/cases']){const r=await fetch(base+route),html=await r.text();assert.equal(r.status,200);assert.equal(r.headers.get('x-robots-tag'),'noindex,nofollow');assert.equal(r.headers.get('referrer-policy'),'no-referrer');assert.ok(!html.includes('case-test-secret'));}
  const sitemap=await (await fetch(base+'/sitemap.xml')).text();assert.ok(!sitemap.includes('/moj-dosije'));assert.ok(!sitemap.includes('/mein-dossier'));
  const customerClient=fs.readFileSync('public/customer-case-client.js','utf8');assert.ok(!customerClient.includes('innerHTML'));assert.match(customerClient,/textContent/);
  console.log('Case workflow: private tokens, draft isolation, evidence requirements, concurrent updates, persistence and public privacy: OK');
}finally{server.close();fs.rmSync(tmp,{recursive:true,force:true})}}
main().catch(e=>{console.error(e);process.exitCode=1});
