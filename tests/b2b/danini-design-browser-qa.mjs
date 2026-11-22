/**
 * Issue #268: browser-level, rendered visual quality checks.
 * Purely local Astro preview; no real customer submissions, payments or AI inference.
 * This is intentionally not a replacement for reviewing photo/gradient screenshots.
 */
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';

const origin=process.env.DANINI_VISUAL_TEST_ORIGIN || 'http://127.0.0.1:4321';
const routes=['','business/','auto-check/','ai-savetnik/','akademija/','akademija/builder/','akademija/modul-03/','wissen/','wissen/produkte/','wissen/glossar/','wissen/gebrauchtwagen-anzahlung/'];
const viewports=[
 {name:'small',width:320,height:780},
 {name:'mobile',width:390,height:844},
 {name:'tablet',width:768,height:1024},
 {name:'desktop',width:1440,height:900}
];
const probes={
 '': ['.d-education h2','.d-education p','.d-education small','.d-trust h2','.d-trust-grid p','.d-trust-note p','.d-contact .d-eyebrow','.d-contact h2','.d-card h3','.d-card p'],
 'business/':['.b-section h2','.b-card h3','.b-card p','.b-extra .b-extra-limits','.b-section .b-eyebrow','.b-demo-document b','.bc-form label','.bc-fieldset small','.bc-action-note'],
 'auto-check/':['.auto-hero h1','.auto-hero .auto-lead','.auto-advisor-box h2','.auto-steps article p','.ac-form label','.ac-status'],
 'akademija/':['.ed-intro strong','.ed-section h2','.ed-section .ed-kicker','.ed-map-head h2','.ed-module h3','.ed-module p','.ed-module small','.ed-builder-preview h2'],
 'wissen/':['.kh-section-light .kh-section-intro h2','.kh-section-light .kh-section-intro>p:last-child','.kh-path h3','.kh-path p'],
 'wissen/produkte/':[],
 'wissen/glossar/':['.glossary-item h2','.glossary-item p'],
 'wissen/gebrauchtwagen-anzahlung/':['.knowledge-article h1','.guide-part h2','.guide-part p'],
 'wissen/anfragemanagement-kleine-unternehmen/':['.source-article h1','.source-body p'],
 'wissen/fahrzeugbrief-fahrzeugschein-coc-hu/':['.source-article h1','.source-body p'],
 'akademija/builder/':['.bb-demo > p:not(.bb-demo-label)','.bb-demo #demo-fields .bb-demo-stage','.bb-demo #demo-fields label','.bb-demo #demo-fields textarea','.bb-demo #demo-title'],
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
   for(const route of [...routes,locale==='de'?'wissen/anfragemanagement-kleine-unternehmen/':'wissen/fahrzeugbrief-fahrzeugschein-coc-hu/']){
    const url=origin+'/'+locale+'/'+route;
    const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
    assert.equal(response?.status(),200,'HTTP error '+url);
    await page.locator('main h1').first().waitFor({timeout:10000});
    if(route==='akademija/builder/'){await page.locator('#demo').waitFor({state:'visible',timeout:15000});await page.locator('#demo-fields textarea').first().waitFor({state:'visible',timeout:15000});}
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
    const tone=await page.evaluate((route)=>{
      const targets={
        '':['.d-education','.d-trust'],
        'business/':['.b-section','.b-extra'],
        'auto-check/':['.auto-hero','.auto-advisor','.auto-process'],
        'akademija/':['.ed-intro','.ed-section'],
        'wissen/':['.kh-section-light','.kh-academy'],
        'wissen/glossar/':['.section.white'],
        'wissen/gebrauchtwagen-anzahlung/':['.section.white'],
        'wissen/anfragemanagement-kleine-unternehmen/':['.section.white'],
        'wissen/fahrzeugbrief-fahrzeugschein-coc-hu/':['.section.white']
      };
      return (targets[route]||[]).map(selector=>{
        const el=document.querySelector(selector);
        return {selector,muted:el?getComputedStyle(el).getPropertyValue('--danini-muted').trim():null};
      });
    },route);
    for(const color of tone)assert.equal(color.muted,'#475569','light section inherits washed-out text '+url+' '+color.selector+' got '+color.muted);
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
    if(route==='akademija/builder/'){
     const dynamic=await page.evaluate(()=>{
      const field=document.querySelector('#demo-fields textarea');
      const label=document.querySelector('#demo-fields label');
      const stage=document.querySelector('#demo-fields .bb-demo-stage');
      const name=document.querySelector('#demo-title');
      const paragraph=document.querySelector('#demo > p:not(.bb-demo-label)');
      const styles=[field,label,stage,name,paragraph].map(el=>el?({color:getComputedStyle(el).color,background:getComputedStyle(el).backgroundColor}):null);
      return {styles,fieldTag:field?.tagName,fieldLabel:label?.getAttribute('for'),fieldId:field?.id,placeholder:getComputedStyle(name,'::placeholder').color};
     });
     assert.equal(dynamic.fieldTag,'TEXTAREA','Builder JS-generated field missing '+url);
     assert.equal(dynamic.fieldLabel,dynamic.fieldId,'Builder dynamic label is not associated '+url);
     assert.deepEqual(dynamic.styles[0],{color:'rgb(28, 58, 79)',background:'rgb(255, 255, 255)'},'Builder textarea must be dark text on white '+url);
     assert.equal(dynamic.styles[1].color,'rgb(25, 61, 80)','Builder dynamic label must be dark '+url);
     assert.equal(dynamic.styles[2].color,'rgb(22, 74, 93)','Builder JS-generated help must be dark '+url);
     assert.equal(dynamic.styles[4].color,'rgb(51, 65, 85)','Builder description must be dark '+url);
     assert.equal(dynamic.placeholder,'rgb(71, 85, 105)','Builder placeholder must be legible '+url);
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
