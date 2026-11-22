/**
 * Issue #268: browser-level, rendered visual quality checks.
 * Purely local Astro preview; no real customer submissions, payments or AI inference.
 * This is intentionally not a replacement for reviewing photo/gradient screenshots.
 */
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';

const origin=process.env.DANINI_VISUAL_TEST_ORIGIN || 'http://127.0.0.1:4321';
const routes=['','business/','auto-check/','ai-savetnik/','akademija/','akademija/builder/','akademija/modul-03/','wissen/','wissen/produkte/'];
const viewports=[
 {name:'small',width:320,height:780},
 {name:'mobile',width:390,height:844},
 {name:'tablet',width:768,height:1024},
 {name:'desktop',width:1440,height:900}
];
const probes={
 '': ['.d-education h2','.d-education p','.d-trust h2','.d-trust-grid p','.d-contact .d-eyebrow','.d-contact h2','.d-card h3','.d-card p'],
 'business/':['.b-section h2','.b-card h3','.b-card p','.b-section .b-eyebrow','.b-demo-document b','.bc-form label','.bc-fieldset small','.bc-action-note'],
 'auto-check/':['.auto-hero h1','.auto-hero .auto-lead','.auto-advisor-box h2','.auto-steps article p','.ac-form label','.ac-status'],
 'akademija/':['.ed-intro strong','.ed-section h2','.ed-map-head h2','.ed-module h3','.ed-module p','.ed-builder-preview h2'],
 'wissen/':['.kh-section-light .kh-section-intro h2','.kh-section-light .kh-section-intro>p:last-child','.kh-path h3','.kh-path p'],
 'wissen/produkte/':[],
 'akademija/builder/':[],
 'akademija/modul-03/':[],
 'ai-savetnik/':[]
};
function sRGBtoLum([r,g,b]){
 return [r,g,b].map((value,index)=>{
  const x=value/255;
  return (x<=.04045?x/12.92:((x+.055)/1.055)**2.4)*[.2126,.7152,.0722][index];
 }).reduce((a,b)=>a+b,0);
}
function ratio(foreground,background){
 const x=sRGBtoLum(foreground),y=sRGBtoLum(background);
 return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const evidence=[];
mkdirSync('qa-screenshots/issue-268',{recursive:true});
try{
 for(const locale of ['de','sr']){
  for(const viewport of viewports){
   const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   for(const route of routes){
    const url=origin+'/'+locale+'/'+route;
    const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
    assert.equal(response?.status(),200,'HTTP error '+url);
    await page.locator('main h1').first().waitFor({timeout:10000});
    const meta=await page.evaluate(()=>{
     const doc=document.documentElement;
     const body=document.body;
     const links=[...document.querySelectorAll('main a[href],main button')];
     const hasVisibleCTA=links.some(el=>{
      const r=el.getBoundingClientRect(),style=getComputedStyle(el);
      return r.width>0&&r.height>0&&style.visibility!=='hidden'&&style.display!=='none';
     });
     window.scrollTo(doc.scrollWidth,0);
     const actualScrollX=window.scrollX;
     window.scrollTo(0,0);
     return {h1:document.querySelectorAll('main h1').length,width:window.innerWidth,
      scrollWidth:doc.scrollWidth,actualScrollX,
      clipped:getComputedStyle(doc).overflowX==='clip'||getComputedStyle(body).overflowX==='clip',
      hasVisibleCTA};
    });
    assert.equal(meta.h1,1,'missing/duplicate main H1 '+url);
    assert.ok(meta.hasVisibleCTA,'no visible interactive action '+url);
    if(meta.actualScrollX>1){
     const offenders=await page.evaluate(()=>[...document.querySelectorAll('body *')].map(el=>{
      const box=el.getBoundingClientRect(),style=getComputedStyle(el);
      return {tag:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,85):'',text:el.textContent?.trim().slice(0,35),left:Math.round(box.left),right:Math.round(box.right),width:Math.round(box.width),overflowX:style.overflowX};
     }).filter(x=>x.right>innerWidth+2 || x.left < -2).sort((a,b)=>b.right-a.right).slice(0,20));
     console.error('ISSUE268 OVERFLOW DIAGNOSTIC',url,JSON.stringify(offenders));
     const name=route?route.replaceAll('/','').replaceAll('-','_'):'home';
     await page.screenshot({path:'qa-screenshots/issue-268/overflow-'+locale+'-'+viewport.width+'-'+name+'.png',fullPage:true});
    }
    assert.ok(meta.actualScrollX<=1,'horizontal scrolling '+url+' '+JSON.stringify(meta));
    if(meta.scrollWidth>meta.width+3 && !meta.clipped){
     console.log('NOTE decorative document overflow:',url,JSON.stringify(meta));
    }
    const inspected=await page.evaluate((selectors)=>{
      const rgb=(string)=>{
       const match=string.match(/rgba?\(([^)]+)\)/);
       if(!match)return null;
       const values=match[1].split(',').map(x=>Number.parseFloat(x));
       return values.length>=3?{rgb:values.slice(0,3),alpha:values[3]??1}:null;
      };
      const sample=(selector)=>{
       const element=document.querySelector(selector);
       if(!element)return {selector,error:'missing'};
       let cur=element,bg=null,complexBackground=false;
       while(cur){
        const computed=getComputedStyle(cur);
        if(computed.backgroundImage!=='none')complexBackground=true;
        const color=rgb(computed.backgroundColor);
        if(color?.alpha===1){bg=color.rgb;break;}
        cur=cur.parentElement;
       }
       const fg=rgb(getComputedStyle(element).color);
       return {selector,fg:fg?.rgb,bg,complexBackground,tag:element.tagName,size:Number.parseFloat(getComputedStyle(element).fontSize),text:element.textContent?.trim().slice(0,70)};
      };
      return selectors.map(sample);
    },probes[route]||[]);
    for(const p of inspected){
     assert.ok(!p.error,'missing visual probe '+url+' '+p.selector);
     assert.ok(p.fg?.length===3 && p.bg?.length===3,'unresolved computed colors '+url+' '+p.selector);
     // Computed background-color alone cannot represent CSS gradients or photos.
     // Keep these explicit for screenshot review instead of reporting a false AA ratio.
     if(p.complexBackground){
      evidence.push({url,viewport:viewport.width,...p,ratio:null,manualBackgroundReview:true});
      // Existing automated AutoDanini tests check that headings on its light gradient
      // remain dark. Keep this independent invariant here as well.
      if(p.selector.startsWith('.auto-hero ')){
       assert.ok(Math.max(...p.fg)<175,'AutoDanini light-gradient text must remain dark '+url+' '+p.selector);
      }
      continue;
     }
     const measured=ratio(p.fg,p.bg);
     assert.ok(measured>=4.5,'contrast <4.5:1 '+url+' '+p.selector+': '+measured.toFixed(2)+':1 fg='+p.fg+' bg='+p.bg);
     evidence.push({url,viewport:viewport.width,...p,ratio:Number(measured.toFixed(2))});
    }
    if(!route){
     const icons=await page.locator('.d-visual-service .danini-icon').count();
     assert.equal(icons,3,'home: three first-party icons must render');
     assert.equal(await page.locator('.d-visual-service .danini-icon[aria-hidden="true"]').count(),3,'decorative icons must be hidden from screen readers');
    }
    if(route==='akademija/'){
     assert.equal(await page.locator('.ed-map-grid .danini-icon').count(),3,'academy process icons missing');
    }
    if(route==='business/'){
     assert.equal(await page.locator('.b-card .danini-icon').count(),3,'business card icons missing');
    }
    const screenshotRoutes=['','business/','auto-check/','akademija/','wissen/'];
    if(screenshotRoutes.includes(route) && ['small','mobile','desktop'].includes(viewport.name)){
     await page.evaluate(()=>document.fonts.ready);
     const name=route?route.replaceAll('/','').replaceAll('-','_'):'home';
     const path='qa-screenshots/issue-268/'+locale+'-'+viewport.name+'-'+name+'.png';
     await page.screenshot({path,fullPage:true,animations:'disabled'});
    }
    assert.deepEqual(errors,[],'JavaScript exceptions on '+url);
    console.log('PASS issue268',locale,viewport.width,route||'home','contrast samples',inspected.length);
   }
   await context.close();
  }
 }
 writeFileSync('qa-screenshots/issue-268/contrast-results.json',JSON.stringify(evidence,null,2));
 console.log('PASS issue268 rendered DE/SR contrast '+evidence.length+' computed color samples, icons, no horizontal scroll');
} finally {await browser.close();}
