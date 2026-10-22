'use strict';
// Read-only verification of the publicly deployed AutoDanini Node app.
// Never submits user data or attempts sign-in / password or TOTP guessing.
const assert=require('node:assert/strict');
const origin='https://auto.daninihub.com';
async function get(path){
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),12000);
 try{
  const response=await fetch(origin+path,{signal:controller.signal,redirect:'follow',
   headers:{'Accept':'text/html,image/jpeg,application/json,text/plain'}});
  if(new URL(response.url).origin!==origin)throw new Error('Host redirect left trusted origin: '+new URL(response.url).origin);
  const buffer=Buffer.from(await response.arrayBuffer());
  return {response,buffer,text:buffer.subarray(0,1400000).toString('utf8')};
 }finally{clearTimeout(timer);}
}
(async()=>{
 // Hostinger's shared reverse proxy may reject bursts of 10 concurrent
 // requests. Probe individually to distinguish real 404/502 from overload.
 const home=await get('/?smoke='+Date.now());
 const about=await get('/about.html');
 const support=await get('/support.html');
 const admin=await get('/admin.html');
 const health=await get('/health');
 const phone=await get('/dragan-business-phone.jpg');
 const portrait=await get('/dragan-business-portrait.jpg');
 const original=await get('/dragan-original-portrait.jpg');
 const grid=await get('/dragan-business-grid-ai.png');
 const adminApi=await get('/api/admin/requests');
 // Failures here must be diagnosed from the actual Hostinger response,
 // not conflated with an image-build error.
 for(const [name,item] of [['phone',phone],['portrait',portrait],['original',original],['grid',grid]]){
  console.log('PHOTO_HTTP_DIAGNOSTIC',{name,status:item.response.status,
   type:item.response.headers.get('content-type'),
   via:item.response.headers.get('via'),
   length:item.buffer.length,
   detail:item.response.status>=400?item.text.slice(0,160):'binary response'});
 }
 for(const [name,item] of [['home',home],['about',about],['support',support],['admin',admin]]){
  assert.equal(item.response.status,200,name+' returned '+item.response.status);
  assert.match(item.text,/AutoDanini|AUTO<span>DANINI|AUTO\s*<span>\s*DANINI/i,name);
 }
 assert.match(home.text,/dragan-business-phone\.jpg/);
 assert.match(about.text,/dragan-business-portrait\.jpg/);
 assert.match(about.text,/dragan-business-phone\.jpg/);
 assert.match(support.text,/autodanini-support-form/);
 assert.match(support.text,/WhatsApp/);
 assert.match(admin.text,/Admin Desk/);
 assert.equal(health.response.status,200);
 const state=JSON.parse(health.text);
 assert.equal(state.adminEnabled,false);
 assert.equal(state.accountsEnabled,false);
 assert.equal(state.checkoutEnabled,false);
 assert.equal(state.durableStore,false);
 for(const [name,item] of [['phone',phone],['portrait',portrait]]){
  assert.equal(item.response.status,200,name+' photo HTTP');
  assert.match(item.response.headers.get('content-type')||'',/image\/jpeg/i);
  assert.ok(item.buffer.length>50000,name+' photo too small');
  assert.equal(item.buffer.subarray(0,3).toString('hex'),'ffd8ff',name+' photo not JPEG');
 }
 assert.equal(original.response.status,404,'Original owner photo must not be public');
 assert.equal(grid.response.status,404,'Full 3x3 grid must not be public');
 assert.equal(adminApi.response.status,503,'Public admin API must deny access');
 const csp=home.response.headers.get('content-security-policy')||'';
 assert.match(csp,/frame-ancestors 'none'/);
 assert.match(csp,/script-src 'self'/);
 console.log('LIVE_AUTODANINI_SMOKE_OK',{
  httpPages:4,approvedSinglePhotos:2,sourcePhotosPublic:false,
  support:'WhatsApp with explicit confirmation',
  privateApi:'locked',admin:'disabled pending owner MFA and MySQL'
 });
})().catch(error=>{
 console.error('LIVE_AUTODANINI_SMOKE_FAILED:',error.message,
  'reason='+String(error.cause?.code||'unknown'),
  'details='+String(error.cause?.message||'').slice(0,160));
 process.exitCode=1
});
