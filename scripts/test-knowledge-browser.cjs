'use strict';
// Real Chromium layout and internal-navigation QA for DANINI knowledge conversion.
const { chromium }=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const base='http://127.0.0.1:4321';
 const output=path.join(__dirname,'..','outputs','b2b');
 fs.mkdirSync(output,{recursive:true});
 let checked=0;
 try{
  for(const lang of ['de','sr']){
   for(const route of ['','checkliste/','produkte/','partner/']){
    for(const width of [390,1366]){
     const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:1});
     const url=base+'/'+lang+'/wissen/'+route;
     const errors=[];
     page.on('pageerror',e=>errors.push(e.message));
     const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:20000});
     if(!response||response.status()!==200)throw Error('HTTP not 200 '+url);
     await page.evaluate(()=>document.fonts.ready);
     const actual=await page.evaluate(()=>({
      scroll:document.documentElement.scrollWidth,
      view:window.innerWidth,
      h1:document.querySelector('h1')?.textContent?.trim(),
      main:!!document.querySelector('main'),
      clickable:[...document.querySelectorAll('main a')].filter(a=>a.getAttribute('href')?.startsWith('/')).length
     }));
     if(actual.scroll>actual.view+2){
      const offenders=await page.evaluate(()=>[...document.querySelectorAll('*')].map(el=>{
        const r=el.getBoundingClientRect();return {tag:el.tagName,cls:el.className?.toString().slice(0,70),left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width)};
      }).filter(x=>x.right>innerWidth+3).sort((a,b)=>b.right-a.right).slice(0,12));
      console.error('OVERFLOW OFFENDERS',url,width,JSON.stringify(offenders));
      await page.screenshot({path:path.join(output,'knowledge-overflow-'+lang+'-'+(route||'index').replace('/','')+'-'+width+'.png'),fullPage:true});
      throw Error('Horizontal overflow '+url+' '+width+' got '+actual.scroll);
     }
     if(!actual.main||!actual.h1||actual.h1.length<8)throw Error('Missing semantic content '+url);
     if(actual.clickable<2)throw Error('Missing internal CTAs '+url);
     if(errors.length)throw Error('Browser error '+url+': '+errors.join('; '));
     const key=route?route.replace('/',''):'index';
     if(route===''||route==='produkte/'||route==='checkliste/'){
      await page.screenshot({path:path.join(output,'knowledge-'+lang+'-'+key+'-'+width+'.png'),fullPage:true});
     }
     await page.close();
     console.log('PASS Chromium '+url+' width='+width+' no overflow and visible content');
     checked++;
    }
   }
  }
  console.log('PASS '+checked+' DE/SR knowledge page/viewport combinations');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
