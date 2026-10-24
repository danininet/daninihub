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
    res.on('data',chunk=>{body+=chunk;if(body.length>600000)req.destroy(new Error('response too large'))});
    res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body}));
  });
  req.on('timeout',()=>req.destroy(new Error('timeout')));
  req.on('error',reject);req.end();
 });
}
test('AutoDanini root cutover preserves legacy APIs, language pages and legal safety gates',async t=>{
 const pages=['index','buyers','dealers','live','inspection','import','exclusive','tender',
  'auctions','guides','about','contact','impressum','privacy','terms','cookies',
  'ai-advisor','disclaimer','cenovnik','ai-primer','faq','nalog','admin','support'];
 for(const page of pages){
  const file=path.join(root,'autodanini-auto-dist',page+'.html');
  assert.equal(fs.existsSync(file),true,'missing page: '+page);
  const html=fs.readFileSync(file,'utf8');
  for(const match of html.matchAll(/(?:href|src)="(?:\.\/)?([a-z0-9-]+\.html)(?:\?[^"]*)?"/g)){
   assert.equal(fs.existsSync(path.join(root,'autodanini-auto-dist',match[1])),true,
    'broken internal link on '+page+': '+match[1]);
  }
 }
 const release=JSON.parse(fs.readFileSync(path.join(root,'autodanini-auto-dist','AUTODANINI_RELEASE_INFO.json'),'utf8'));
 assert.equal(release.pages,pages.length,'release manifest must count all published pages');
 const port=await freePort();
 const child=spawn(process.execPath,['server.js'],{cwd:root,
  env:{...process.env,NODE_ENV:'development',PORT:String(port),DB_HOST:'',
   DANINI_AUTODANINI_ROOT_ENABLED:'true',BREVO_API_KEY:''},
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
 const auto=await request(port,'daninihub.com','/');
 assert.equal(auto.status,200);
 assert.match(auto.body,/AUTO\s*<span>\s*DANINI/i);
 assert.match(auto.headers['x-robots-tag'],/noindex/);
 const adm=await request(port,'daninihub.com','/admin.html');
 assert.equal(adm.status,200);
 assert.match(adm.body,/id="admin-login"/);
 assert.match(auto.headers['content-security-policy'],/frame-ancestors 'none'/);
 assert.match(auto.headers['content-security-policy'],/connect-src 'self'/);
 const support=await request(port,'daninihub.com','/support.html');
 assert.equal(support.status,200);
 assert.match(support.body,/autodanini-support-form/);
 assert.match(support.body,/WhatsApp/);
 // Owner's existing business contact is available on both draft legal pages,
 // and outdated collage provenance is not presented as current photography.
 for (const legalPage of ['/impressum.html','/privacy.html']) {
   const legal=await request(port,'daninihub.com',legalPage);
   assert.equal(legal.status,200,legalPage);
   assert.match(legal.body,/mailto:kontakt@daninihub\.com/,legalPage);
   assert.match(legal.body,/radni tekst koji zahteva pravnu i poslovnu potvrdu/,
     'draft status must remain visible until full operator details are verified');
   assert.doesNotMatch(legal.body,/prikaz iz postojećeg 3×3 materijala/,
     'obsolete image provenance must not appear');
 }

 // Regression: AI adviser must use the approved standalone portrait at 1x.
 // A 3x3 grid with CSS background-size:300% shows only mouth/chin.
 const advisor=await request(port,'daninihub.com','/ai-advisor.html');
 assert.equal(advisor.status,200,'AI adviser must exist on actual Hostinger domain');
 assert.match(advisor.body,/<img class="ai-owner-avatar" src="\.\/dragan-business-portrait\.jpg"/);
 assert.doesNotMatch(advisor.body,/poslovni portret iz postojećeg 3×3 materijala/);
 const avatarCss=fs.readFileSync(path.join(root,'autodanini','staging-v12','src','styles.css'),'utf8')
   .split('\n').find(line=>line.startsWith('.ai-owner-avatar{'))||'';
 assert.match(avatarCss,/object-fit:contain/,'entire founder portrait must fit, not crop');
 assert.doesNotMatch(avatarCss,/background-size:300%/,'do not zoom founder face');
 for(const forbidden of ['/dragan-original-portrait.jpg','/dragan-business-grid-ai.png']){
  const response=await request(port,'daninihub.com',forbidden);
  assert.equal(response.status,404,'Owner source/collage must not be public: '+forbidden);
 }
 for(const approved of ['/dragan-business-phone.jpg','/dragan-business-portrait.jpg']){
  // request() is text-only, so check status/Content-Type while a separate
  // build check confirms the binary JPEG signature.
  const response=await request(port,'daninihub.com',approved);
  assert.equal(response.status,200,'Approved single business photo not served: '+approved);
  assert.match(response.headers['content-type'],/image\/jpeg/);
  assert.match(response.headers['cache-control'],/public, max-age=300/);
 }
 const robots=await request(port,'daninihub.com','/robots.txt');
 assert.match(robots.body,/Allow: \/|Sitemap:/,'existing public robots policy must remain');
 const indexed=await request(port,'daninihub.com','/index.html');
 assert.equal(indexed.status,200);
 assert.match(indexed.headers['x-robots-tag'],/noindex/);
 const rootSupport=await request(port,'daninihub.com','/support.html');
 assert.equal(rootSupport.status,200);
 assert.match(rootSupport.body,/autodanini-support-form/);

 // Legacy API and multilingual service pages must remain available.
 const api=await request(port,'daninihub.com','/api/runtime-version');
 assert.equal(api.status,200);
 assert.match(api.body,/daninihub-sales-20260924/);
 const guest=await request(port,'daninihub.com','/api/importos/admin/records');
 assert.equal(guest.status,403,'admin endpoint must still require authorization');
 const health=await request(port,'daninihub.com','/health');
 const state=JSON.parse(health.body);
 assert.equal(health.status,200);
 assert.equal(state.checkoutEnabled,false);
 assert.equal(state.service,'DANINI Automotive Import Intelligence');
 const original=await request(port,'daninihub.com','/sr/');
 assert.equal(original.status,200);
 assert.match(original.body,/\/sr\/upit/);
 const german=await request(port,'daninihub.com','/de/');
 assert.equal(german.status,200);
 const robotsLegacy=await request(port,'daninihub.com','/robots.txt');
 assert.match(robotsLegacy.body,/Allow: \/|Sitemap:/);
 const sitemap=await request(port,'daninihub.com','/sitemap.xml');
 assert.equal(sitemap.status,200);
 const other=await request(port,'another-host.invalid','/');
 assert.equal(other.status,200);
 assert.doesNotMatch(other.body,/AUTO\s*<span>\s*DANINI/i);
 const rootImage=await request(port,'daninihub.com','/dragan-original-portrait.jpg');
 assert.equal(rootImage.status,404);
});
