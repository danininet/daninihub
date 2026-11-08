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
  'auctions','guides','digital','ai-solutions','business','cnc','selbstimport','uvoz-vodic','about','contact','impressum','privacy','terms','cookies',
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
 // Cloudflare static hosting needs physical localized HTML entrypoints.
 // Express route tests alone do not detect a static /de/ 404.
 for(const locale of ['sr','de']){
  const file=path.join(root,'autodanini-auto-dist',locale,'index.html');
  assert.ok(fs.existsSync(file),'missing Cloudflare /'+locale+'/ entrypoint');
  const html=fs.readFileSync(file,'utf8');
  assert.ok(html.includes('autodanini-language","'+locale+'"'),
    'localized page must select the correct language before Vite starts');
  assert.match(html,/href="\/buyers\.html"/,
    'localized nav must link to the actual root HTML files');
  assert.match(html,/\/assets\//,
    'localized Vite assets must load from the site root');
 }
 const germanHome=fs.readFileSync(path.join(root,'autodanini-auto-dist','de','index.html'),'utf8');
 assert.match(germanHome,/Fahrzeuge\. Digitale Tools\. Klare Entscheidungen\./,
   'German homepage HTML must be localized without requiring JavaScript');
 for(const newPage of ['digital','ai-solutions','business','cnc']){
   const page=fs.readFileSync(path.join(root,'autodanini-auto-dist',newPage+'.html'),'utf8');
   assert.match(page,/<meta name="robots" content="noindex,follow">/,
     'Prelaunch products must not be search-indexed');
   assert.doesNotMatch(page,/checkout\.stripe\.com|paypal\.me/,
     'No live checkout in prelaunch digital/AI pages');
 }
 for(const guide of ['selbstimport','uvoz-vodic']){
   const html=fs.readFileSync(path.join(root,'autodanini-auto-dist',guide+'.html'),'utf8');
   assert.match(html,/<meta name="robots" content="index,follow">/,
     guide+' must serve useful informational content to Google');
   assert.match(html,/<link rel="canonical" href="https:\/\/daninihub.com\//,
     guide+' must have canonical');
   assert.match(html,/hreflang="de"/);
   assert.match(html,/hreflang="sr"/);
   assert.match(html,/carina\.rs/,guide+' must cite Serbian customs authority');
 }
 const redirectList=fs.readFileSync(path.join(root,'autodanini-auto-dist','_redirects'),'utf8');
 assert.match(redirectList,/\/de\/wissen\/deutschland-selbstimport \/selbstimport\.html 301/);
 assert.match(redirectList,/\/sr\/kalkulator \/import\.html 301/);
 assert.doesNotMatch(redirectList,/\/de\/wissen\/deutschland-selbstimport \/ 301/,
   'old organic URLs must not all redirect to homepage');
 const cncHtml=fs.readFileSync(path.join(root,'autodanini-auto-dist','cnc.html'),'utf8');
 assert.match(cncHtml,/id="danini-rfq-form"/);
 assert.match(cncHtml,/keine Online-Bestellung|ne kreira narudžbinu|keine Bestellung/i);
 assert.doesNotMatch(cncHtml,/type="file"/,'do not collect confidential CAD drawings in public prelaunch');
 const homepageHtml=fs.readFileSync(path.join(root,'autodanini-auto-dist','index.html'),'utf8');
 assert.match(homepageHtml,/danini-feature-business" href="business.html"/);
 // Cloudflare Git Builds used to lack an explicit assets directory. That can
 // publish an incomplete or legacy dist while only the homepage appears live.
 const wrangler=JSON.parse(fs.readFileSync(path.join(root,'wrangler.jsonc'),'utf8'));
 assert.equal(wrangler.name,'daninihub');
 assert.equal(wrangler.assets.directory,'./autodanini-auto-dist');
 assert.equal(wrangler.assets.html_handling,'auto-trailing-slash');
 assert.deepEqual(wrangler.routes,[
   {pattern:'daninihub.com',custom_domain:true},
   {pattern:'www.daninihub.com',custom_domain:true}
 ],'Wrangler must preserve existing apex custom domain and create only the missing www custom domain');
 assert.notEqual(wrangler.assets.not_found_handling,'single-page-application',
   'Every navigation request must resolve to the real multi-page asset');
 const builtFiles=fs.readdirSync(path.join(root,'autodanini-auto-dist'));
 for(const page of pages)assert.ok(builtFiles.includes(page+'.html'),
   'Cloudflare deployment missing public page '+page);

 // Public pre-launch enquiry is not a payment processor or auto-reservation.
 const prepurchaseFile=path.join(root,'autodanini-auto-dist','prepurchase.html');
 const brandedMark=path.join(root,'autodanini-auto-dist','autodanini-mark.svg');
 assert.ok(fs.existsSync(prepurchaseFile),'Pre-purchase landing missing in Cloudflare output');
 assert.ok(fs.existsSync(brandedMark),'New brandmark missing in Cloudflare output');
 const prepurchase=fs.readFileSync(prepurchaseFile,'utf8');
 assert.ok(prepurchase.includes('https://wa.me/4915730916621'),'Prelaunch lead form missing known WhatsApp');
 assert.ok(prepurchase.includes('Naplata još nije omogućena'),'Prelaunch must not sell before business registration');
 assert.ok(prepurchase.includes('Pripremi WhatsApp upit'),'Prelaunch needs working enquiry CTA');
 assert.ok(!prepurchase.includes('sk_test_')&&!prepurchase.includes('sk_live_'),'No Stripe secret in browser');
 for(const name of pages.filter(page=>page!=='admin')){
  const html=fs.readFileSync(path.join(root,'autodanini-auto-dist',name+'.html'),'utf8');
  assert.ok(html.includes('src="/autodanini-mark.svg"'),'Branded navigation missing: '+name);
 }
 const homepage=fs.readFileSync(path.join(root,'autodanini-auto-dist','index.html'),'utf8');
 assert.ok(homepage.includes('href="/prepurchase.html"'),'New lead magnet must be linked on homepage');
 const sitemapForLead=fs.readFileSync(path.join(root,'autodanini-auto-dist','sitemap.xml'),'utf8');
 assert.ok(sitemapForLead.includes('<loc>https://daninihub.com/prepurchase.html</loc>'));
 // SEO publication must not inherit staging's site-wide noindex.
 const publicSeo=['index','buyers','dealers','live','inspection','import',
  'exclusive','tender','guides','about','contact','cenovnik','faq'];
 for(const page of publicSeo){
  const html=fs.readFileSync(path.join(root,'autodanini-auto-dist',page+'.html'),'utf8');
  assert.match(html,/<meta name="robots" content="index,follow">/,'Public SEO blocked: '+page);
  const canonical=page==='index'?'https://daninihub.com/':'https://daninihub.com/'+page+'.html';
  assert.ok(html.includes('<link rel="canonical" href="'+canonical+'">'),'Missing canonical: '+page);
 }
 for(const page of ['auctions','ai-advisor','ai-primer','nalog','admin','support']){
  const html=fs.readFileSync(path.join(root,'autodanini-auto-dist',page+'.html'),'utf8');
  assert.match(html,/<meta name="robots" content="noindex/,'Unready or private page wrongly indexable: '+page);
 }
 const seoGerman=fs.readFileSync(path.join(root,'autodanini-auto-dist','de','index.html'),'utf8');
 assert.ok(seoGerman.includes('<link rel="canonical" href="https://daninihub.com/de/">'));
 assert.ok(seoGerman.includes('<meta name="robots" content="index,follow">'));
 const seoSitemap=fs.readFileSync(path.join(root,'autodanini-auto-dist','sitemap.xml'),'utf8');
 assert.ok(seoSitemap.includes('<loc>https://daninihub.com/import.html</loc>'));
 assert.ok(seoSitemap.includes('<loc>https://daninihub.com/de/</loc>'));
 assert.ok(!seoSitemap.includes('admin.html')&&!seoSitemap.includes('auctions.html'));
 const seoRobots=fs.readFileSync(path.join(root,'autodanini-auto-dist','robots.txt'),'utf8');
 assert.ok(seoRobots.includes('Sitemap: https://daninihub.com/sitemap.xml'));
 const importPage=fs.readFileSync(path.join(root,'autodanini-auto-dist','import.html'),'utf8');
 assert.ok(importPage.includes('<title>Kalkulator uvoza auta iz Nemačke (carina i PDV) | AutoDanini</title>'));
 const frontend=fs.readFileSync(path.join(root,'autodanini','staging-v12','src','main.ts'),'utf8');
 assert.ok(frontend.includes("a.href = '/' + path + '.html';"),
   'Dynamic links must work from both / and /de/');
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
 assert.match(auto.body,/<strong>DANINI<\/strong>/i);
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
 assert.match(advisor.body,/<img class="ai-owner-avatar" src="\.\/autodanini-mark\.svg"/);
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
 // No fabricated response-time SLA or misleading "seller call is the service" promise.
 assert.doesNotMatch(original.body,/2\s*[–-]\s*4\s*radna\s*sata|2\s*do\s*4\s*radna\s*sata/i);
 assert.doesNotMatch(german.body,/2\s*[–-]\s*4\s*Arbeitsstunden|2\s*bis\s*4\s*Arbeitsstunden/i);
 assert.match(original.body,/ukupne troškove|ukupnih troškova/i);
 assert.match(german.body,/Gesamtkosten|Importkosten/i);
 assert.match(auto.body,/podrška pri izboru vozila/i);
 assert.doesNotMatch(auto.body,/Kontaktiranje prodavca i priprema upita za rezervaciju/);
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
