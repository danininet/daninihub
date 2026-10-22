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
  return {response,buffer,text:buffer.subarray(0,120000).toString('utf8')};
 }finally{clearTimeout(timer);}
}
(async()=>{
 const [home,about,support,admin,health,phone,portrait,original,grid,adminApi]=await Promise.all([
  get('/?smoke='+Date.now()),get('/about.html'),get('/support.html'),
  get('/admin.html'),get('/health'),get('/dragan-business-phone.jpg'),
  get('/dragan-business-portrait.jpg'),get('/dragan-original-portrait.jpg'),
  get('/dragan-business-grid-ai.png'),get('/api/admin/requests')
 ]);
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
