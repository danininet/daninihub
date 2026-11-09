#!/usr/bin/env node
/**
 * Production read-only visual/interactivity checks on actual Cloudflare pages.
 * Never fills or submits visitor forms, sends emails, uses paid APIs or changes DNS.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright-core';
const base='https://daninihub.com';
const bin=[process.env.CHROME_PATH,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].find(p=>p&&fs.existsSync(p));
assert.ok(bin,'No system Chrome for production mobile QA');
const browser=await chromium.launch({headless:true,executablePath:bin,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];
let failures=0;
try {
 for(const width of [360,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:850},deviceScaleFactor:1});
  const page=await context.newPage();
  for(const path of ['/','/danini.html','/danini-sr.html','/buyers.html','/business.html','/contact.html']){
   const errors=[];
   page.on('pageerror',err=>errors.push(err.message));
   try {
    const resp=await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:22000});
    await page.waitForTimeout(650);
    assert.equal(resp?.status(),200,'HTTP '+path);
    const dimensions=await page.evaluate(()=>({
      viewport:document.documentElement.clientWidth,
      scroll:document.documentElement.scrollWidth,
      body:document.body.scrollWidth,
      title:document.title,
      icon:!!document.querySelector('link[rel="icon"]')
    }));
    assert.ok(dimensions.scroll<=dimensions.viewport+3,'Horizontal overflow at '+width+'px '+path+': '+JSON.stringify(dimensions));
    assert.ok(dimensions.title.length>8,'Missing title '+path);
    if(path.startsWith('/danini')){
      const nav=page.locator('.brandlinks a');
      assert.ok(await nav.count()>=3,'Brand links absent '+path);
      assert.ok(dimensions.icon,'Missing favicon '+path);
      assert.ok(await page.locator('svg[aria-label="DANINI znak"]').count()>=1,'DANINI logo missing');
    }else if(path==='/'){
      assert.ok(await page.locator('.dn-header').count()===1,'DANINI root header missing');
      assert.ok(await page.locator('.dn-nav a[href="/contact.html"]').count()===1,'Contact not reachable');
    }else {
      assert.ok(await page.locator('.dn-service-header').count()===1,'Shared business header missing '+path);
      assert.ok(await page.locator('.dn-service-nav a[href="/contact.html"]').count()===1,'Contact not in service nav');
    }
    if(path==='/contact.html')assert.ok(await page.locator('a[href^="mailto:kontakt@daninihub.com"]').count()>=1,'Direct contact email missing');
    assert.deepEqual(errors,[],'JavaScript runtime errors on '+path+' '+width+': '+errors.join('; '));
    results.push({path,width,status:'PASS',title:dimensions.title});
   }catch(e){failures++;console.log('FAIL '+width+'px '+path+': '+String(e?.message||e).slice(0,550));results.push({path,width,status:'FAIL',error:String(e?.message||e).slice(0,300)});}
  }
  await context.close();
 }
 console.log('DANINI LIVE MOBILE QA SUMMARY '+JSON.stringify({checked:results.length,passed:results.length-failures,failed:failures}));
}finally{await browser.close()}
if(failures)process.exitCode=1;
