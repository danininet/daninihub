'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const net=require('node:net');
const fs=require('node:fs');
const path=require('node:path');
test('Hostinger serves current bilingual platform and blocks backend',async(t)=>{
 const port=await new Promise((resolve,reject)=>{const s=net.createServer();s.on('error',reject);s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});});
 const child=spawn(process.execPath,['hostinger-preview.cjs'],{env:{...process.env,PORT:String(port)},stdio:'inherit'});
 t.after(()=>child.kill());
 const base='http://127.0.0.1:'+port;
 let ready=false;
 for(let i=0;i<100;i++){try{ready=(await fetch(base+'/health')).ok;if(ready)break;}catch{} await new Promise(r=>setTimeout(r,100));}
 assert.ok(ready,'preview startup');
 for(const [route,marker] of [['/de/','Auto in Deutschland gefunden?'],['/sr/','Našao si auto u Nemačkoj?'],['/de/auto-check/','universal-advisor-form'],['/sr/auto-check/','universal-advisor-form'],['/de/business/','DANINI Anfragebüro'],['/de/akademija/','data-education-print'],['/sr/akademija/','data-education-print']]){
  const r=await fetch(base+route);assert.equal(r.status,200,route);assert.ok((await r.text()).includes(marker),route);assert.match(r.headers.get('x-robots-tag'),/noindex/);
 }
 for(const route of ['/api/health','/api/lead/status','/portal','/owner/'])assert.equal((await fetch(base+route)).status,503,route);
 assert.equal((await fetch(base+'/api/intake',{method:'POST',body:'{}'})).status,405);
 assert.equal((await fetch(base+'/auto/admin.html')).status,404);
 assert.match(await (await fetch(base+'/robots.txt')).text(),/Disallow: \//);
 assert.equal((await fetch(base+'/',{redirect:'manual'})).headers.get('location'),'/de/');
});
