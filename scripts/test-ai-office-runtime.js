'use strict';

const assert=require('node:assert/strict');
const fs=require('fs');
const path=require('path');

const runtimeFile=path.join(process.cwd(),'runtime','ai-office-cases.json');
try{if(fs.existsSync(runtimeFile))fs.unlinkSync(runtimeFile)}catch{}

const store=require('../ai-office-store');
const runtime=require('../server-ai-office-runtime');

assert.ok(runtime.getTenant('demo'));
assert.match(runtime.makeSummary({service:'Reinigung',address:'Duisburg',urgency:'Normal'}),/Reinigung/);

const item=store.create('demo',{
  customerName:'Max Muster',
  phone:'+49 123',
  email:'max@example.test',
  service:'Gebäudereinigung',
  address:'Duisburg',
  objectType:'Büro',
  urgency:'Normal',
  preferredTime:'Morgen',
  message:'Test',
  privacyAcknowledged:true,
  summary:'Leistung: Gebäudereinigung'
});

assert.match(item.id,/^AO-DEMO-/);
assert.equal(item.status,'NEW');
assert.equal(store.list('demo').length,1);

const updated=store.updateStatus('demo',item.id,'READY_FOR_CALLBACK','reviewed');
assert.equal(updated.status,'READY_FOR_CALLBACK');
assert.equal(updated.history.length,2);

const s=store.summarize(store.list('demo'));
assert.equal(s.total,1);
assert.equal(s.ready_for_callback,1);
assert.throws(()=>store.updateStatus('demo',item.id,'INVALID'),/INVALID_OFFICE_STATUS/);

try{if(fs.existsSync(runtimeFile))fs.unlinkSync(runtimeFile)}catch{}
console.log('Danini AI Office runtime contract: OK');
