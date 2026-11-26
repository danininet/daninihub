'use strict';
const { chromium } = require('@playwright/test');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const port = 4242;
const server = spawn(process.execPath, ['hostinger-preview.cjs'], { env: {...process.env, PORT:String(port)}, stdio:'inherit' });
const base = 'http://127.0.0.1:'+port;
(async()=>{
  let browser;
  try {
    let ready=false;
    for(let i=0;i<60;i++){try{if((await fetch(base+'/health')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,500));}
    assert(ready,'Hostinger preview runtime did not become healthy');
    browser=await chromium.launch({headless:true});
    fs.mkdirSync('artifacts/hostinger-desktop',{recursive:true});
    const failures=[];
    for(const width of [1024,1280,1440,1920]){
      const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
      for(const route of ['/de/','/sr/','/de/auto-check/','/sr/auto-check/','/de/business/','/sr/business/','/de/akademija/','/sr/akademija/','/de/wissen/','/sr/wissen/']){
        const label=width+'-'+route.replace(/\//g,'-').replace(/^-|-$/g,'');
        const response=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:30000});
        await page.locator('main h1').waitFor({state:'visible',timeout:15000});
        // External widgets can keep a network connection open indefinitely. Wait for the
        // actual layout inputs instead of global network silence.
        await page.evaluate(async()=>{
          const images=[...document.images];
          for(const image of images)if(image.loading==='lazy')image.loading='eager';
          await Promise.race([Promise.all([document.fonts.ready,...images.map(image=>image.decode().catch(()=>{}))]),new Promise(resolve=>setTimeout(resolve,10000))]);
        });
        await page.screenshot({path:'artifacts/hostinger-desktop/'+label+'.png',fullPage:true,animations:'disabled'});
        const metrics=await page.evaluate(()=>{
          const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
          const nav=[...document.querySelectorAll('.danini-header .business-nav a')].map(e=>({text:e.textContent.trim(),...rect(e)}));
          const brand=document.querySelector('.danini-header .brand'), lang=document.querySelector('.danini-header .lang');
          const overlap=(a,b)=>a.left<b.right-1&&a.right>b.left+1&&a.top<b.bottom-1&&a.bottom>b.top+1;
          const collisions=nav.flatMap((a,i)=>nav.slice(i+1).filter(b=>overlap(a,b)).map(b=>a.text+' / '+b.text));
          if(brand)for(const a of nav)if(overlap(a,rect(brand)))collisions.push('brand / '+a.text);
          if(lang)for(const a of nav)if(overlap(a,rect(lang)))collisions.push('language / '+a.text);
          const outside=nav.filter(a=>a.left<0||a.right>innerWidth+1).map(a=>a.text);
          const h=document.querySelector('main h1');
          const hero=document.querySelector('.d-hero-grid'), panel=document.querySelector('.d-visual');
          return {viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,navCount:nav.length,collisions,outside,h1:h?{...rect(h),fontSize:getComputedStyle(h).fontSize}:null,hero:hero?rect(hero):null,panel:panel?rect(panel):null,images:[...document.images].filter(e=>!e.complete||e.naturalWidth===0).map(e=>e.getAttribute('src')?.slice(0,100))};
        });
        console.log('VISUAL_QA '+JSON.stringify({route,width,status:response?.status(),...metrics}));
        if(!response?.ok()||metrics.navCount!==8||metrics.collisions.length||metrics.outside.length||metrics.scrollWidth>width+1||!metrics.h1||metrics.images.length)failures.push(label);
      }
      await page.close();
    }
    assert.equal(failures.length,0,'Desktop QA failed: '+failures.join(', '));
    await require('./test-hostinger-public-visuals.cjs').auditPublicVisuals(browser,base);
  } finally {await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
