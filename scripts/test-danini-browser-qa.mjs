#!/usr/bin/env node
/**
 * Browser-level QA of existing DANINI Cloudflare asset build.
 * Uses the real headless Chrome bundled with GitHub Actions; no SaaS credits,
 * live personal data, API keys, payments, or outgoing contact messages.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright-core';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','autodanini-auto-dist');
const MIME={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png',
 '.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.json':'application/json',
 '.txt':'text/plain; charset=utf-8'};
const server=http.createServer((request,response)=>{
 const pathname=new URL(request.url||'/', 'http://localhost').pathname;
 if(pathname.startsWith('/api/')){
  response.writeHead(503,{'content-type':'application/json','cache-control':'no-store'});
  response.end(JSON.stringify({enabled:false,error:'test_service_offline'}));
  return;
 }
 const candidate=pathname==='/'?'index.html':
  pathname==='/de/'?'de/index.html':
  pathname==='/sr/'?'sr/index.html':
  pathname.replace(/^\//,'').replace(/\/$/,'/index.html');
 const relative=path.posix.normalize(candidate);
 const filepath=path.resolve(root,relative);
 if(!filepath.startsWith(root+path.sep)||!fs.existsSync(filepath)||!fs.statSync(filepath).isFile()){
  response.writeHead(404);response.end('not found');return;
 }
 response.writeHead(200,{'content-type':MIME[path.extname(filepath)]||'application/octet-stream',
  'cache-control':'no-store'});
 fs.createReadStream(filepath).pipe(response);
});
const listen=()=>new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve(server.address().port)));
const close=()=>new Promise(resolve=>server.close(resolve));
function browserBin(){
 const candidates=[process.env.CHROME_PATH,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable',
  '/usr/bin/chromium','/usr/bin/chromium-browser'].filter(Boolean);
 return candidates.find(p=>fs.existsSync(p));
}
let browser;
let context;
try{
 assert.ok(fs.existsSync(path.join(root,'index.html')),'Build site before browser QA');
 const port=await listen();
 const base='http://127.0.0.1:'+port;
 const bin=browserBin();
 assert.ok(bin,'Headless Chrome missing on runner; QA must not silently pass without a browser');
 browser=await chromium.launch({headless:true,executablePath:bin,args:['--no-sandbox','--disable-dev-shm-usage']});
 context=await browser.newContext({acceptDownloads:true,viewport:{width:1440,height:900}});
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 // Local build should never require internet for its core features.
 await page.route('https://**/*',route=>route.abort());
 await page.goto(base+'/',{waitUntil:'domcontentloaded'});
 await assert.doesNotReject(async()=>await page.locator('.hero h1').waitFor());
 assert.match(await page.locator('.hero h1').innerText(),/Pripremite kupovinu auta sami/i);
 const primary=page.locator('.heroactions a').first();
 assert.match(await primary.getAttribute('href'),/ai-advisor\.html/);
 const cards=page.locator('.dn-photo-card');
 assert.equal(await cards.count(),6,'Six approved service photos should appear on homepage');
 for(let i=0;i<6;i++){
  const photo=cards.nth(i).locator('img');
  assert.ok((await photo.getAttribute('alt')||'').length>25,'Service image needs descriptive alt');
  const ok=await photo.evaluate(async img=>{img.loading='eager';await img.decode();return img.naturalWidth>300});
  assert.equal(ok,true,'Approved service photo must decode '+i);
  assert.ok((await cards.nth(i).locator('a').getAttribute('href')||'').endsWith('.html'),'Service page must be linked');
 }
 console.log('PASS Home photography: six first-party cards decode with alt text and crawlable links');
 console.log('PASS Home: self-service first, primary CTA leads to existing dossier');
 await page.goto(base+'/de/',{waitUntil:'domcontentloaded'});
 assert.match(await page.locator('.hero h1').innerText(),/Autokauf selbst vorbereiten/i);
 console.log('PASS DE: localized homepage works with JavaScript');
 // /de/ intentionally persists DE. Reset to SR before asserting Serbian dossier.
 await page.evaluate(()=>localStorage.setItem('autodanini-language','sr'));
 await page.goto(base+'/ai-advisor.html',{waitUntil:'networkidle'});
 const question='Mercedes C280 2007, 215000 km, Automatik, unvollständige Servicehistorie – welche Unterlagen sind offen?';
 await page.locator('#ai-question').fill(question);
 await page.locator('#ai-listing-url').fill('https://example.org/auto/123');
 await page.locator('#ai-evidence-seller').selectOption('missing');
 await page.locator('#ai-evidence-service').selectOption('missing');
 await page.locator('#ai-evidence-inspection').selectOption('unknown');
 await page.locator('#ai-consent').check();
 await page.locator('#ai-go').click();
 const output=await page.locator('#ai-output').innerText();
 assert.match(output,/DIGITALNI DOSIJE VOZILA/i);
 assert.match(output,/Mercedes C280/);
 assert.match(output,/Dokaz o vlasništvu nedostaje/i);
 assert.match(output,/Servisni dokazi nedostaju/i);
 assert.match(output,/https:\/\/example\.org\/auto\/123/);
 assert.equal(await page.locator('#ai-download-case').isVisible(),true);
 const [download]=await Promise.all([
  page.waitForEvent('download',{timeout:15000}),
  page.locator('#ai-download-case').click()
 ]);
 const downloaded=fs.readFileSync(await download.path(),'utf8');
 assert.match(downloaded,/Mercedes C280/);
 assert.match(download.suggestedFilename(),/^danini-fahrzeugdossier-.*\.txt$/);
 console.log('PASS SR dossier: real browser fields, proof statuses and downloadable UTF-8 file');
 await page.locator('#language').click();
 await page.locator('#ai-question').fill('Volkswagen Golf 2018, Diesel 150000 km, HU unbekannt, vor Anzahlung Unterlagen prüfen.');
 await page.locator('#ai-consent').check();
 await page.locator('#ai-go').click();
 assert.match(await page.locator('#ai-output').innerText(),/FAHRZEUGDOSSIER/i);
 console.log('PASS DE dossier: language switch generates German-language case');
 await page.goto(base+'/guides.html',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('.dn-guides-stack article.dn-guide').count(),7);
 assert.equal(await page.locator('.dn-guides-toc a').count(),7);
 const [guidesDe]=await Promise.all([
  page.waitForEvent('download',{timeout:15000}),
  page.locator('#danini-guides-download').click()
 ]);
 assert.ok(guidesDe.suggestedFilename().endsWith('7-Ratgeber-DE.txt'));
 const guideTxtDe=fs.readFileSync(await guidesDe.path(),'utf8');
 assert.match(guideTxtDe,/Fahrzeugsuche und Inserate vergleichen/);
 assert.match(guideTxtDe,/Überführung auf eigener Achse/);
 await page.locator('#language').click();
 const [guidesSr]=await Promise.all([
  page.waitForEvent('download',{timeout:15000}),
  page.locator('#danini-guides-download').click()
 ]);
 assert.ok(guidesSr.suggestedFilename().endsWith('7-Vodica-SR.txt'));
 const guideTxtSr=fs.readFileSync(await guidesSr.path(),'utf8');
 assert.match(guideTxtSr,/Samostalna pretraga i poređenje oglasa/);
 assert.match(guideTxtSr,/Prevoz vozila šleperom ili prikolicom/);
 console.log('PASS seven guides: downloadable SR/DE, current language, original seven articles and links');
 await page.locator('#danini-journey-form select[name="kind"]').selectOption('expert');
 await page.locator('#danini-journey-form select[name="delivery"]').selectOption('carrier');
 await page.locator('#danini-journey-form input[name="location"]').fill('Duisburg');
 await page.locator('#danini-journey-form input[name="destination"]').fill('Niš');
 await page.locator('#danini-journey-form select[name="driveable"]').selectOption('no');
 await page.locator('#danini-journey-form select[name="plates"]').selectOption('unregistered');
 await page.locator('#danini-journey-form select[name="papers"]').selectOption('missing');
 await page.locator('#danini-journey-form select[name="seller"]').selectOption('written');
 await page.locator('#danini-journey-form button[type="submit"]').click();
 const inquiry=await page.locator('#danini-journey-draft').inputValue();
 assert.match(inquiry,/Nezavisan stručni pregled/);
 assert.match(inquiry,/Transport šleperom ili prikolicom/);
 assert.match(inquiry,/Duisburg/); assert.match(inquiry,/Niš/);
 assert.match(inquiry,/Ne može da se vozi/);
 assert.match(inquiry,/Odjavljeno \/ bez tablica/);
 assert.match(inquiry,/Dokumenta nepotpuna/);
 assert.match(inquiry,/Prodavac pismeno potvrdio/);
 assert.match(inquiry,/Tablice, osiguranje, dozvole/);
 assert.ok((await page.locator('#danini-journey-mail').getAttribute('href')||'').startsWith('mailto:auto@daninihub.com?'));
 console.log('PASS buyer handoff: expert inspection + transport choice produces local email draft; no message sent');
 await page.goto(base+'/import.html',{waitUntil:'domcontentloaded'});
 await page.locator('#price').fill('10000');
 await page.locator('#extra').fill('1000');
 await page.locator('#recalc').click();
 assert.notEqual((await page.locator('#total').innerText()).trim(),'—');
 console.log('PASS import: calculator changes result for valid example');
 await page.evaluate(()=>localStorage.setItem('autodanini-language','sr'));
 await page.goto(base+'/guides.html',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('.dn-guide').count(),7,'Seven published full guides are required');
 const guideForm=page.locator('#danini-journey-form');
 assert.equal(await guideForm.count(),1);
 await guideForm.locator('select[name="kind"]').selectOption('expert');
 await guideForm.locator('select[name="delivery"]').selectOption('buyer-trip');
 await guideForm.locator('input[name="location"]').fill('Essen, Deutschland');
 await guideForm.locator('input[name="destination"]').fill('Nis, Serbia');
 await guideForm.locator('button[type="submit"]').click();
 const draft=await page.locator('#danini-journey-draft').inputValue();
 assert.match(draft,/Essen, Deutschland/);
 assert.match(draft,/Nis, Serbia/);
 assert.match(draft,/Nezavisan stručni pregled/);
 assert.match(await page.locator('#danini-journey-mail').getAttribute('href'),/^mailto:auto@daninihub\.com\?/);
 assert.equal(await page.locator('#danini-journey-mail').isVisible(),true);
 await page.locator('#language').click();
 await guideForm.locator('select[name="kind"]').selectOption('carrier');
 await guideForm.locator('button[type="submit"]').click();
 assert.match(await page.locator('#danini-journey-draft').inputValue(),/Autotransporter/);
 console.log('PASS SR/DE guides: seven guides, independent selection, local e-mail draft, no automatic submission');
 await page.goto(base+'/cenovnik.html',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('#preuzimanje-i-transport article').count(),3,'Three collection/transport quote modes required');
 console.log('PASS transparent pricing: buyer pickup, driver, and truck have quote-based disclosure');
 await page.goto(base+'/contact.html',{waitUntil:'domcontentloaded',timeout:15000});
 assert.equal(await page.locator('a.wa').count(),0,'Floating WhatsApp button must be removed');
 assert.equal(await page.locator('a[href*="wa.me"]').count(),0,'Contact page must use email-first flow, not WhatsApp buttons');
 const form=page.locator('#danini-general-inquiry-form');
 assert.equal(await form.count(),1);
 assert.equal(await form.locator('button[type="submit"]').isDisabled(),true,
   'Unconfigured Brevo must never produce fake accepted form');
 assert.equal(await page.locator('a[href*="+daninihub"]').count(),0,
   'Never restore unapproved plus-alias on public contact page');
 console.log('PASS contact: disabled until Brevo/Turnstile configured; no unapproved plus alias');

 // Regression for the real report: a successful 202 with DN reference must not
 // turn into a false "Versand nicht bestätigt" if Turnstile.reset throws.
 // No live Brevo requests, CAPTCHA bypass or customer emails in this test.
 await page.route('**/api/lead/status',route=>route.fulfill({
  status:200,contentType:'application/json',
  body:JSON.stringify({enabled:true,channel:'brevo',turnstileSiteKey:'0x4AAAAATESTONLY'})
 }));
 await page.route('**/api/lead',async route=>{
  const d=JSON.parse(route.request().postData()||'{}');
  assert.equal(d.email,'internal-qa@example.invalid');
  assert.equal(d.consent,true);
  assert.equal(d.turnstileToken,'simulated-only-local-qa-token');
  await route.fulfill({status:202,contentType:'application/json',
    body:JSON.stringify({accepted:true,reference:'DN-20261110-1234ABCD',receiptAccepted:false})});
 });
 await page.addInitScript(()=>{
  window.__daniniTurnstileLanguages=[];
  window.turnstile={
   render:(_el,options)=>{window.__daniniTurnstileLanguages.push(options.language);return 'test-only-widget';},
   getResponse:()=> 'simulated-only-local-qa-token',
   reset:()=>{throw new Error('simulated third-party reset failure');},
   remove:()=>{}
  };
 });
 await page.goto(base+'/contact.html',{waitUntil:'domcontentloaded'});
 const activeForm=page.locator('#danini-general-inquiry-form');
 await activeForm.locator('button[type="submit"]').waitFor({state:'visible'});
 await assert.doesNotReject(async()=>{
  await page.waitForFunction(()=>!document.querySelector('#danini-general-inquiry-form button[type="submit"]')?.disabled,{timeout:15000});
 });
 await activeForm.locator('input[name="name"]').fill('DANINI Internal QA');
 await activeForm.locator('input[name="email"]').fill('internal-qa@example.invalid');
 await activeForm.locator('textarea[name="message"]').fill('This is a local mocked test for the accepted-reference and CAPTCHA reset regression.');
 await activeForm.locator('input[name="consent"]').check();
 await activeForm.locator('button[type="submit"]').click();
 await assert.doesNotReject(async()=>await page.waitForFunction(()=>document.querySelector('#danini-general-inquiry-form [role="status"]')?.textContent?.includes('DN-20261110-1234ABCD')));
 const successText=await activeForm.locator('[role="status"]').innerText();
 assert.match(successText,/DN-20261110-1234ABCD/);
 assert.match(successText,/sačuvajte oznaku upita|Referenz notieren/);
 assert.doesNotMatch(successText,/Versand nicht bestätigt|Slanje nije potvrđeno/);
 console.log('PASS contact: accepted DN reference survives throwing CAPTCHA reset; receipt failure disclosed');
 // Language is explicitly bound to the site selector, not the browser language.
 // The actual Turnstile language is passed during live render, not mocked here.
 assert.ok(await page.locator('#language').count()===1);
 const beforeLocale=await page.evaluate(()=>window.__daniniTurnstileLanguages);
 assert.ok(beforeLocale.includes('sr'),'Initial Turnstile must be in Serbian for SR site');
 await page.locator('#language').click();
 await page.waitForFunction(()=>window.__daniniTurnstileLanguages.includes('de'));
 const afterLocale=await page.evaluate(()=>window.__daniniTurnstileLanguages);
 assert.equal(afterLocale.at(-1),'de','Turnstile must rerender in German after language switch');
 console.log('PASS contact: Turnstile explicitly renders in SR then DE when selector is clicked');

 await page.setViewportSize({width:390,height:844});
 await page.goto(base+'/',{waitUntil:'domcontentloaded'});
 const width=await page.evaluate(()=>({viewport:window.innerWidth,document:document.documentElement.scrollWidth}));
 assert.ok(width.document<=width.viewport+3,
   'Mobile home has horizontal overflow: '+JSON.stringify(width));
 console.log('PASS mobile: 390px viewport fits without horizontal overflow');
 assert.deepEqual(errors,[], 'Browser page errors detected: '+errors.join('; '));
 console.log('PASS no unexpected client JavaScript errors');
 console.log('DANINI real-browser QA PASS (self-service, download, DE, import, contact, mobile)');
}catch(error){
 console.error('DANINI real-browser QA FAIL:',error.stack||error.message||error);
 process.exitCode=1;
}finally{
 if(context)await context.close().catch(()=>{});
 if(browser)await browser.close().catch(()=>{});
 if(server.listening)await close();
}
