'use strict';

const assert=require('node:assert/strict');
const fs=require('fs');
const path=require('path');
const { ContactLeadStore }=require('../contact-lead-store');
const runtime=require('../server-ai-office-runtime');

const file=path.join(process.cwd(),'runtime','ai-office-runtime-test.json');
try{if(fs.existsSync(file))fs.unlinkSync(file)}catch{}

(async()=>{
  assert.ok(runtime.getTenant('demo'));
  assert.equal(runtime.officeSource('demo'),'ai-office:demo');
  assert.match(runtime.makeSummary({service:'Reinigung',address:'Duisburg',urgency:'Normal'}),/Reinigung/);

  const store=new ContactLeadStore({env:{},storageFile:file});
  const lead=await store.create({
    reference:'AO-DEMO-TEST-001',
    source:'ai-office:demo',
    language:'de',
    email:'max@example.test',
    company:'Max Muster',
    status:'NEW',
    recommendation:'manual-review',
    payload:{tenant:'demo',phone:'+49 123',service:'Gebäudereinigung',address:'Duisburg',summary:'Leistung: Gebäudereinigung'}
  });

  let c=runtime.caseView(lead);
  assert.equal(c.status,'NEW');
  assert.equal(c.service,'Gebäudereinigung');

  await store.update(lead.reference,{status:'READY_FOR_CALLBACK',reviewNote:'reviewed',reviewedAt:new Date().toISOString()});
  const list=await store.list({sources:['ai-office:demo'],limit:10});
  const cases=list.map(runtime.caseView);
  const summary=runtime.summarizeCases(cases);
  assert.equal(summary.total,1);
  assert.equal(summary.ready_for_callback,1);

  try{if(fs.existsSync(file))fs.unlinkSync(file)}catch{}
  console.log('Danini AI Office runtime contract: OK');
})().catch(error=>{console.error(error);process.exit(1)});
