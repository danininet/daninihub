'use strict';
const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 fs.mkdirSync('outputs/b2b',{recursive:true});
 try{
 for(const locale of ['de','sr']){
  for(const viewport of [{width:390,height:844,label:'mobile'},{width:1440,height:900,label:'desktop'}]){
   const page=await browser.newPage({viewport});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   for(const slug of ['','akademija/']){
     const url='http://127.0.0.1:4321/'+locale+'/'+slug;
     const res=await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000});
     assert.equal(res.status(),200,'missing '+url);
     const m=await page.evaluate(()=>({w:document.documentElement.scrollWidth,iw:innerWidth,h1:document.querySelectorAll('main h1').length}));
     assert.equal(m.h1,1,'one h1 '+url);
     if(m.w>m.iw+2){
       const offenders=await page.evaluate(()=>[...document.querySelectorAll('*')].map(el=>{
         const r=el.getBoundingClientRect();
         return {tag:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,85):'',right:Math.round(r.right),width:Math.round(r.width)};
       }).filter(o=>o.right>innerWidth+3).sort((a,b)=>b.right-a.right).slice(0,14));
       const internal=await page.evaluate(()=>[...document.querySelectorAll('*')].map(el=>{
        const r=el.getBoundingClientRect(),style=getComputedStyle(el);
        return {tag:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,65):'',
          sw:el.scrollWidth,cw:el.clientWidth,left:Math.round(r.left),right:Math.round(r.right),
          white:style.whiteSpace,overflow:style.overflowX};
       }).filter(o=>(o.sw>o.cw+30 && o.cw>0)||o.left< -10).sort((a,b)=>(b.sw-b.cw)-(a.sw-a.cw)).slice(0,20));
       console.error('OVERFLOW DIAGNOSTIC',url,viewport.width,JSON.stringify(offenders));
       console.error('INNER SCROLL DIAGNOSTIC',JSON.stringify(internal));
       await page.screenshot({path:'outputs/b2b/danini-academy-overflow-'+locale+'-'+(slug?'lesson':'home')+'-'+viewport.label+'.png',fullPage:true});
       throw Error('horizontal overflow '+url+': '+m.w+' > '+m.iw);
     }
     assert.deepEqual(errors,[],'JS errors '+url);
     if(slug==='akademija/'){
       assert.equal(await page.locator('.ed-module.ed-live').count(),1,'only one module available');
       assert.equal(await page.locator('.ed-module.ed-pending').count(),5,'planned curriculum');
       assert.equal(await page.locator('.ed-fields textarea').count(),5,'worksheet fields');
       assert.equal(await page.locator('.ed-prompt blockquote').count(),3,'AI prompts');
       const input=page.locator('.ed-fields textarea').first();
       await input.fill('Test poslovne niše '+locale);
       assert.equal(await input.inputValue(),'Test poslovne niše '+locale,'worksheet input broken');
     }else{
       assert.equal(await page.locator('a[href="/'+locale+'/akademija/"]').count()>0,true,'homepage academy path missing');
     }
     await page.screenshot({path:'outputs/b2b/danini-academy-'+locale+'-'+(slug?'lesson':'home')+'-'+viewport.label+'.png',fullPage:true});
     console.log('PASS education browser',url,viewport.label,m.iw);
   }
   await page.close();
  }
 }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
