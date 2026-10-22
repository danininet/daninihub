'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const net=require('node:net');
const http=require('node:http');
const {spawn}=require('node:child_process');

const root=path.resolve(__dirname,'..');
async function freePort(){
 const server=net.createServer();
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',resolve).once('error',reject));
 const port=server.address().port;
 await new Promise(resolve=>server.close(resolve));
 return port;
}
function request(port,host,route){
 return new Promise((resolve,reject)=>{
  const req=http.request({hostname:'127.0.0.1',port,path:route,
   headers:{Host:host,Accept:'text/html,application/json'},timeout:5000},res=>{
    let body='';
    res.setEncoding('utf8');
    res.on('data',chunk=>{body+=chunk;if(body.length>2000000)req.destroy(new Error('response too large'))});
    res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body}));
  });
  req.on('timeout',()=>req.destroy(new Error('timeout')));
  req.on('error',reject);req.end();
 });
}
test('only auto.daninihub.com serves the new support-enabled AutoDanini UI; old DANINI unaffected',async t=>{
 for(const page of ['index','admin','buyers','dealers','auctions','live','support']){
  assert.equal(fs.existsSync(path.join(root,'autodanini-auto-dist',page+'.html')),true,page);
 }
 const port=await freePort();
 const child=spawn(process.execPath,['server.js'],{cwd:root,
  env:{...process.env,NODE_ENV:'development',PORT:String(port),DB_HOST:'',
   AUTODANINI_PREVIEW_ENABLED:'false',BREVO_API_KEY:''},
  stdio:['ignore','pipe','pipe']});
 let errors='';
 child.stderr.on('data',chunk=>errors+=String(chunk));
 t.after(()=>{if(child.exitCode===null)child.kill('SIGTERM')});
 await Promise.race([
  new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(new Error('server did not start: '+errors.slice(-1000))),11000);
   child.stdout.on('data',chunk=>{
    if(String(chunk).includes('listening on port')){
     clearTimeout(timer);resolve();
    }
   });
   child.once('exit',code=>{
    clearTimeout(timer);reject(new Error('Server exited before listening: '+code+' '+errors.slice(-1000)));
   });
  }),
  new Promise((_,reject)=>setTimeout(()=>reject(new Error('server timeout')),12000))
 ]);
 const auto=await request(port,'auto.daninihub.com','/');
 assert.equal(auto.status,200);
 assert.match(auto.body,/AUTO\s*<span>\s*DANINI/i);
 assert.match(auto.headers['x-robots-tag'],/noindex/);
 const adm=await request(port,'auto.daninihub.com','/admin.html');
 assert.equal(adm.status,200);
 assert.match(adm.body,/id="admin-login"/);
 assert.match(auto.headers['content-security-policy'],/frame-ancestors 'none'/);
 assert.match(auto.headers['content-security-policy'],/connect-src 'self'/);
 const support=await request(port,'auto.daninihub.com','/support.html');
 assert.equal(support.status,200);
 assert.match(support.body,/autodanini-support-form/);
 assert.match(support.body,/WhatsApp/);
 for(const forbidden of ['/dragan-original-portrait.jpg','/dragan-business-grid-ai.png']){
  const response=await request(port,'auto.daninihub.com',forbidden);
  assert.equal(response.status,404,'Owner source/collage must not be public: '+forbidden);
 }
 for(const approved of ['/dragan-business-phone.jpg','/dragan-business-portrait.jpg']){
  // request() is text-only, so check status/Content-Type while a separate
  // build check confirms the binary JPEG signature.
  const response=await request(port,'auto.daninihub.com',approved);
  assert.equal(response.status,200,'Approved single business photo not served: '+approved);
  assert.match(response.headers['content-type'],/image\/jpeg/);
  assert.match(response.headers['cache-control'],/public, max-age=300/);
 }
 const robots=await request(port,'auto.daninihub.com','/robots.txt');
 assert.match(robots.body,/Disallow:/);

 const api=await request(port,'auto.daninihub.com','/api/importos/checkout');
 assert.equal(api.status,503);
 const guest=await request(port,'auto.daninihub.com','/api/admin/requests');
 assert.equal(guest.status,503);
 const health=await request(port,'auto.daninihub.com','/health');
 const state=JSON.parse(health.body);
 assert.equal(state.checkoutEnabled,false);
 assert.equal(state.adminEnabled,false);
 assert.equal(state.releaseMode,'public-visual-only');
 const original=await request(port,'daninihub.com','/');
 assert.equal(original.status,200);
 assert.doesNotMatch(original.body,/AUTO<span>DANINI<\/span>/);
 assert.match(original.body,/\/sr\/upit/);
 const other=await request(port,'calije.daninihub.com','/');
 assert.doesNotMatch(other.body,/AUTO<span>DANINI<\/span>/);
});
