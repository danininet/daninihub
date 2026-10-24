'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const express=require('express');
// Regression guard: WhatsApp click does not unlock a premature payment.
const calcClient=fs.readFileSync(path.join(__dirname,'..','public','danini-quickcheck.js'),'utf8');
assert.doesNotMatch(calcClient,/paypal\.me|paymentUnlocked|danini-calc-pay/);
assert.match(calcClient,/pre bilo kakve uplate/);
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'danini-funnel-'));
process.env.DANINI_IMPORTOS_STORAGE_FILE=path.join(tmp,'records.json');
process.env.DANINI_ADMIN_SECRET='test-only-owner-secret';
process.env.BREVO_API_KEY='';
process.env.DB_HOST='';
process.env.DATABASE_URL='';
process.env.MYSQL_URL='';
process.env.DANINI_IMPORTOS_CHECKOUT_ENABLED='';
const {databaseConfigured,ImportOSStore}=require('../importos-store');
assert.equal(databaseConfigured({DATABASE_URL:'mysql://old_user:test-password@mysql.example.invalid:3306/old_database'}),true);
assert.equal(databaseConfigured({MYSQL_URL:'mariadb://user:secret@localhost/db'}),true);
assert.equal(databaseConfigured({DATABASE_URL:'postgresql://user:secret@localhost/db'}),false);
const oldStyle=new ImportOSStore({env:{DATABASE_URL:'mysql://old_user:test-password@mysql.example.invalid:3306/old_database'}});
assert.equal(oldStyle.mode,'mysql');
assert.equal(oldStyle.connectionOptions.database,'old_database');
assert.equal(oldStyle.connectionOptions.user,'old_user');
const {mountImportOSRuntime}=require('../server-importos-runtime');
async function main(){
  const app=express();mountImportOSRuntime(app);
  const server=app.listen(0);
  try{
    const base='http://127.0.0.1:'+server.address().port;
    const post=(url,payload,admin=false)=>fetch(base+url,{method:'POST',headers:{'Content-Type':'application/json',...(admin?{'X-Danini-Admin':process.env.DANINI_ADMIN_SECRET}:{})},body:JSON.stringify(payload)});
    const readiness=await fetch(base+'/api/importos/lead-readiness');assert.equal(readiness.status,200);assert.equal((await readiness.json()).onlineIntakeReady,false);
    const blockedOnline=await post('/api/importos/service-request',{source:'autodanini-web',serviceType:'FIELD_CHECK_LIVE',name:'Test',email:'test@example.invalid',message:'Testiranje online zahteva',privacyAcknowledged:true});assert.equal(blockedOnline.status,503);
    const view=await post('/api/importos/event',{event:'page_view',path:'/sr/kalkulator',language:'sr'});assert.equal(view.status,200);
    const calcEvent=await post('/api/importos/event',{event:'calculator_completed',path:'/sr/kalkulator',language:'sr',value:'10000-12000'});assert.equal(calcEvent.status,200);
    const request=await post('/api/importos/service-request',{serviceType:'FIELD_CHECK_LIVE',name:'Test kupac',email:'test-kupac@example.invalid',pickupLocation:'Duisburg',vehicle:'Karavan',message:'Test oglas',language:'sr',privacyAcknowledged:true});
    assert.equal(request.status,200);
    const received=await request.json();assert.match(received.reference,/^SRV-/);assert.equal(received.delivered,false);
    const review=await post('/api/importos/service-request',{serviceType:'AD_REVIEW',name:'Test izbor',email:'test-izbor@example.invalid',message:'Tri probna oglasa',language:'sr',privacyAcknowledged:true});assert.equal(review.status,200);
    const b2b=await post('/api/importos/service-request',{serviceType:'B2B_SOURCING',name:'B2B test',email:'b2b@example.invalid',message:'Nabavka tri vozila',language:'sr',privacyAcknowledged:true,listingUrl:'https://www.mobile.de/car',budgetEur:'20000'});assert.equal(b2b.status,200);
    const unauthorized=await fetch(base+'/api/importos/admin/records');assert.equal(unauthorized.status,403);
    const hiddenStatus=await fetch(base+'/api/importos/admin/readiness');assert.equal(hiddenStatus.status,403);
    const statusResponse=await fetch(base+'/api/importos/admin/readiness',{headers:{'X-Danini-Admin':process.env.DANINI_ADMIN_SECRET}});
    const status=await statusResponse.json();assert.equal(status.storage,'local-file');assert.equal(status.emailConfigured,false);assert.equal(status.checkoutEnabled,false);
    const metricsResponse=await fetch(base+'/api/importos/admin/metrics',{headers:{'X-Danini-Admin':process.env.DANINI_ADMIN_SECRET}});assert.equal(metricsResponse.status,200);const metrics=await metricsResponse.json();assert.equal(metrics.metrics.pageViews,1);assert.equal(metrics.metrics.calculatorCompleted,1);assert.ok(metrics.priority);
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
