'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const express=require('express');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'danini-funnel-'));
process.env.DANINI_IMPORTOS_STORAGE_FILE=path.join(tmp,'records.json');
process.env.DANINI_ADMIN_SECRET='test-only-owner-secret';
process.env.BREVO_API_KEY='';
process.env.DB_HOST='';
process.env.DANINI_IMPORTOS_CHECKOUT_ENABLED='';
const {mountImportOSRuntime}=require('../server-importos-runtime');
async function main(){
  const app=express();mountImportOSRuntime(app);
  const server=app.listen(0);
  try{
    const base='http://127.0.0.1:'+server.address().port;
    const post=(url,payload,admin=false)=>fetch(base+url,{method:'POST',headers:{'Content-Type':'application/json',...(admin?{'X-Danini-Admin':process.env.DANINI_ADMIN_SECRET}:{})},body:JSON.stringify(payload)});
    const request=await post('/api/importos/service-request',{serviceType:'FIELD_CHECK_LIVE',name:'Test kupac',email:'test-kupac@example.invalid',pickupLocation:'Duisburg',vehicle:'Karavan',message:'Test oglas',language:'sr',privacyAcknowledged:true});
    assert.equal(request.status,200);
    const received=await request.json();assert.match(received.reference,/^SRV-/);assert.equal(received.delivered,false);
    const unauthorized=await fetch(base+'/api/importos/admin/records');assert.equal(unauthorized.status,403);
    const hiddenStatus=await fetch(base+'/api/importos/admin/readiness');assert.equal(hiddenStatus.status,403);
    const statusResponse=await fetch(base+'/api/importos/admin/readiness',{headers:{'X-Danini-Admin':process.env.DANINI_ADMIN_SECRET}});
    const status=await statusResponse.json();assert.equal(status.storage,'local-file');assert.equal(status.emailConfigured,false);assert.equal(status.checkoutEnabled,false);
    const quote=await post('/api/importos/admin/quotes',{requestReference:received.reference,email:'test-kupac@example.invalid',name:'Test kupac',serviceType:'FIELD_CHECK_LIVE',description:'Obilazak vozila u Duisburgu',amountEur:79,language:'sr'},true);
    assert.equal(quote.status,200);
    const offered=await quote.json();assert.equal(offered.delivered,false);assert.match(offered.bookingUrl,/\/sr\/\?quote=QTE-/);
    const access=await fetch(base+'/api/importos/admin/records',{headers:{'X-Danini-Admin':process.env.DANINI_ADMIN_SECRET}});
    const records=(await access.json()).records;
    assert.equal(records.find(r=>r.reference===received.reference).status,'QUOTED');
    assert.equal(records.find(r=>r.reference===offered.quote.reference).payload.requestReference,received.reference);
    const publicQuote=await fetch(base+'/api/importos/quotes/'+encodeURIComponent(offered.quote.reference));assert.equal(publicQuote.status,200);
    console.log('DANINI request → owner quote → public link: OK');
  }finally{server.close();fs.rmSync(tmp,{recursive:true,force:true})}
}
main().catch(error=>{console.error(error);process.exitCode=1});
