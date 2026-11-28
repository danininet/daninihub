'use strict';
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const http=require('node:http');
const net=require('node:net');
const path=require('node:path');
const fs=require('node:fs');
const root=path.resolve('hostinger-release');
const staging='gleaming-orangered-crow-58.hostingersite.com';
function request(port,host,url,method='GET',body){
 return new Promise((resolve,reject)=>{
  const req=http.request({hostname:'127.0.0.1',port,path:url,method,headers:{Host:host,...(body?{'content-type':'application/json','content-length':Buffer.byteLength(body),Origin:'https://'+host}:{})}},res=>{
   let data='';res.setEncoding('utf8');res.on('data',s=>data+=s);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:data}));
  });req.setTimeout(8000,()=>req.destroy(Error('request timeout')));req.on('error',reject);req.end(body);
 });
}
(async()=>{
 const marker=JSON.parse(fs.readFileSync(path.join(root,'_danini/build.json'),'utf8'));
 assert.equal(marker.mode,'production');
 const port=await new Promise(resolve=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});});
 // No inherited service credentials, public features or external network requests.
 const env={PATH:process.env.PATH,PORT:String(port),NODE_ENV:'production',HOSTINGER_PUBLIC_DOMAIN_ENABLED:'true'};
 const child=spawn(process.execPath,[path.join(root,'hostinger-preview.cjs')],{env,cwd:root,stdio:['ignore','pipe','pipe']});
 let logs='';child.stdout.on('data',v=>logs+=v);child.stderr.on('data',v=>logs+=v);
 try{
  let health;
  for(let i=0;i<100;i++){
   try{health=await request(port,staging,'/health');break}catch{}
   if(child.exitCode!==null)throw Error('Release exited: '+logs.slice(-3000));
   await new Promise(r=>setTimeout(r,100));
  }
  assert.equal(health?.status,200);assert.equal(JSON.parse(health.body).mode,'functional-frontend');
  for(const locale of ['de','sr']){
   for(const route of ['','auto-check/','business/','akademija/builder/']){
    const r=await request(port,staging,'/'+locale+'/'+route);
    assert.equal(r.status,200,locale+'/'+route);assert.match(r.headers['x-robots-tag'],/noindex/);
   }
   const r=await request(port,'daninihub.com','/'+locale+'/');assert.equal(r.status,200);assert.equal(r.headers['x-robots-tag'],undefined);
  }
  for(const route of ['/api/academy/ai/status','/api/academy/assistant/status','/api/assistant/status']){
   const r=await request(port,'daninihub.com',route);assert.equal(r.status,200,route);assert.equal(JSON.parse(r.body).enabled,false);
   assert.equal((await request(port,staging,route)).status,404,route);
  }
  const tenant=await request(port,'daninihub.com','/api/tenant-config');assert.equal(JSON.parse(tenant.body).enabled,false);
  assert.equal((await request(port,'daninihub.com','/api/vehicle-analysis','POST','{}')).status,503);
  assert.equal((await request(port,'daninihub.com','/api/academy/config')).status,404);
  assert.equal((await request(port,'daninihub.com','/portal/gmail-intake')).status,503);
  for(const route of ['/hostinger-preview.cjs','/.env','/_headers','/auto/admin.html'])assert.equal((await request(port,staging,route)).status,404,route);
  assert.match((await request(port,staging,'/robots.txt')).body,/Disallow: \//);
  console.log('PASS packaged Node release: eight DE/SR pages, canonical indexing, staging noindex, AI/Academy/Gmail/B2B closed without credentials, source protection');
 }finally{child.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
