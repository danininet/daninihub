'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {spawn}=require('node:child_process');
const net=require('node:net');
const {resolveAssets}=require('../hostinger-assets.cjs');

async function launch(t,fixture){
 const port=await new Promise(resolve=>{const server=net.createServer();server.listen(0,'127.0.0.1',()=>{const value=server.address().port;server.close(()=>resolve(value));});});
 const child=spawn(process.execPath,[path.join(fixture,'nodejs/hostinger-preview.cjs')],{cwd:os.tmpdir(),env:{...process.env,PORT:String(port),DANINI_STAGING_HEALTH:'false'},stdio:'pipe'});
 let stderr='';child.stderr.on('data',data=>stderr+=data);
 t.after(()=>child.kill());
 const base='http://127.0.0.1:'+port;
 for(let attempt=0;attempt<100;attempt++){
   try{const r=await fetch(base+'/health');return {base,health:r};}catch{}
   if(child.exitCode!==null)throw new Error('Runtime exited: '+stderr);
   await new Promise(resolve=>setTimeout(resolve,50));
 }
 throw new Error('No runtime health: '+stderr);
}
function fixture(t){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'danini-hostinger-layout-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 fs.mkdirSync(path.join(root,'nodejs'));
 for(const file of ['hostinger-preview.cjs','hostinger-assets.cjs','hostinger-staging-health.cjs'])fs.copyFileSync(path.join(__dirname,'..',file),path.join(root,'nodejs',file));
 fs.symlinkSync(path.resolve(__dirname,'../node_modules'),path.join(root,'nodejs/node_modules'),'dir');
 return root;
}
test('Hostinger split public_html/nodejs layout serves assets regardless of working directory',async t=>{
 const root=fixture(t);
 for(const lang of ['de','sr']){fs.mkdirSync(path.join(root,'public_html',lang),{recursive:true});fs.writeFileSync(path.join(root,'public_html',lang,'index.html'),'<h1>'+lang+'</h1>');}
 assert.equal(resolveAssets(path.join(root,'nodejs')).layout,'sibling-public-html');
 const {base,health}=await launch(t,root);
 assert.equal(health.status,200);
 assert.equal((await health.json()).assets,'sibling-public-html');
 assert.equal(await (await fetch(base+'/de/')).text(),'<h1>de</h1>');
 assert.equal((await fetch(base+'/api/health')).status,503);
});
test('Missing assets report JSON 503 without crashing the runtime or serving source',async t=>{
 const root=fixture(t);
 const {base,health}=await launch(t,root);
 assert.equal(health.status,503);
 assert.deepEqual(await health.json(),{ok:false,mode:'visual-preview',backend:false,assets:'missing'});
 assert.equal((await fetch(base+'/package.json')).status,503);
 assert.equal((await fetch(base+'/api/intake',{method:'POST'})).status,405);
});
