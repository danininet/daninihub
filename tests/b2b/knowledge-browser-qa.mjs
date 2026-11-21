import {chromium} from "@playwright/test";
import assert from "node:assert/strict";
import {mkdirSync} from "node:fs";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
mkdirSync("qa-screenshots",{recursive:true});
let passed=0;
const baseUrl="http://127.0.0.1:4321";
try{
for(const locale of ["de","sr"]){
for(const [device,width,height] of [["mobile",390,844],["desktop",1440,900]]){
const context=await browser.newContext({viewport:{width,height}});
const page=await context.newPage();
const errors=[];page.on("pageerror",e=>errors.push(e.message));
for(const route of ["wissen/","wissen/checkliste/","wissen/produkte/","wissen/partner/","wissen/glossar/","wissen/dokumente/","wissen/gebrauchtwagen-anzahlung/","wissen/kundenanfragen/","wissen/dokumente/auto-dienstleistungsvereinbarung/","wissen/dokumente/business-sow/"]){
const response=await page.goto("http://127.0.0.1:4321/"+locale+"/"+route,{waitUntil:"networkidle"});
assert.equal(response.status(),200,locale+" "+route);
assert.equal(await page.locator("main h1").count(),1,locale+" "+route+" heading");
assert.equal(await page.locator("body").evaluate(el=>el.scrollWidth<=innerWidth+2),true,locale+" "+route+" overflow");
assert.equal((await page.locator('link[rel="canonical"]').getAttribute("href")).includes("/"+locale+"/"+route),true);
const intentionalDuplicate = locale==="de" && route==="wissen/kundenanfragen/";
assert.equal(await page.locator('link[hreflang]').count(),intentionalDuplicate?0:3,locale+" "+route+" correct hreflang for indexable versus noindex content");
assert.deepEqual(errors,[],locale+" "+route+" JS");
passed++;
}
assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"),"noindex,follow");
await page.goto("http://127.0.0.1:4321/"+locale+"/wissen/glossar/");
assert.equal(await page.locator(".glossary-item").count(),24);
assert.equal(await page.locator('.glossary-item a[href^="#begriff-"]').count(),48);
await page.goto("http://127.0.0.1:4321/"+locale+"/wissen/");
assert.equal(await page.locator(".kh-path").count(),2,"new knowledge problem-led verticals");
assert.equal(await page.locator(".kh-article").count(),locale==="sr"?6:3,locale+" missing source manuscripts");
const originals=locale==="de"
?[["anfragemanagement-kleine-unternehmen",true],["ki-angebotsvorbereitung",true],["dsgvo-kundenanfragen-ki",false]]
:[["fahrzeugbrief-fahrzeugschein-coc-hu",true],["privatni-prodavac-ili-auto-kuca-nemacka",false],["eur1-poreklo-vozila-uvoz-nemacka-srbija",true],["upravljanje-upitima-malih-firmi",true],["ai-priprema-poslovne-ponude",true],["gdpr-ai-obrada-upita-klijenata",false]];
for(const [slug,indexable] of originals){
 const url="/"+locale+"/wissen/"+slug+"/";
 const r=await page.goto(baseUrl+url,{waitUntil:"networkidle"});
 assert.equal(r.status(),200,url);
 assert.equal(await page.locator(".source-body p").count()>15,true,"source manuscript truncated "+url);
 assert.equal(await page.locator("main h1").count(),1,url+" main heading");
 assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"),"https://daninihub.com"+url);
 assert.equal(await page.locator('link[rel="alternate"][hreflang]').count(),0,"untranslated article has false alternate");
 assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"),indexable?"index,follow":"noindex,follow");
 assert.equal(await page.locator("body").evaluate(el=>el.scrollWidth<=innerWidth+2),true,url+" mobile overflow");
 assert.equal(await page.locator("script[type='application/ld+json']").count()>0,true);
 assert.equal(await page.locator(".source-article a[href*='/wissen/']").count()>=2,true);
}
const logo=await page.locator(".brand-logo");
assert.equal(await logo.count(),1,"DANINI actual logo missing");
await logo.scrollIntoViewIfNeeded();
assert.equal(await logo.evaluate(el=>el.complete&&el.naturalWidth>0),true,"broken DANINI logo");
assert.equal(await logo.getAttribute("alt"),"DANINI","approved full logo must have accessible name");
assert.equal((await logo.getAttribute("src")).startsWith("data:image/png;base64,"),true,"wrong brand asset: original approved raster expected");
assert.equal(await logo.evaluate(el=>el.naturalWidth>=300&&el.naturalHeight>=100),true,"approved logo resolution missing");
await page.goto(baseUrl+"/"+locale+"/wissen/");

const img=page.locator(".kh-path img").first();
await img.scrollIntoViewIfNeeded();
assert.equal(await img.evaluate(el=>el.complete&&el.naturalWidth>0),true,"missing first-party image");
await page.screenshot({path:"qa-screenshots/"+locale+"-"+device+"-knowledge.png",fullPage:true});

/* Computed-style WCAG AA QA: prevent invisible text on dark backgrounds. */
const styleRead=await page.evaluate(()=>{
 const section=document.querySelector('.kh-section-light');
 const title=section?.querySelector('.kh-section-intro h2');
 const para=section?.querySelector('.kh-section-intro>p:last-child');
 return {bg:section?getComputedStyle(section).backgroundColor:null,
         title:title?getComputedStyle(title).color:null,
         para:para?getComputedStyle(para).color:null};
});
function luminance(rgb){
 const nums=(rgb.match(/[0-9.]+/g)||[]).slice(0,3).map(Number);
 assert.equal(nums.length,3,'Cannot parse computed RGB '+rgb);
 return nums.map((x,i)=>{const n=x/255;return (n<=.04045?n/12.92:((n+.055)/1.055)**2.4)*[.2126,.7152,.0722][i]}).reduce((a,b)=>a+b,0);
}
function ratio(fg,bg){const a=luminance(fg),b=luminance(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)}
assert.ok(ratio(styleRead.title,styleRead.bg)>=4.5,'Wissen title contrast <4.5:1 '+JSON.stringify(styleRead));
assert.ok(ratio(styleRead.para,styleRead.bg)>=4.5,'Wissen description contrast <4.5:1 '+JSON.stringify(styleRead));
const academyResponse=await page.goto(baseUrl+"/"+locale+"/akademija/",{waitUntil:"domcontentloaded"});
assert.equal(academyResponse.status(),200);
assert.equal(await page.locator('.ed-map-grid li').count(),3,'Academy visual learning path must show 3 actual steps');

assert.equal(await page.locator('.ed-case-business-visual').count(),1,'Business example graphic missing');
const photo=page.locator('.ed-case-auto img');
await photo.scrollIntoViewIfNeeded();
assert.equal(await photo.evaluate(el=>el.complete&&el.naturalWidth>0),true,'Academy first-party case photo broken');
assert.equal(await page.evaluate(()=>{window.scrollTo(document.documentElement.scrollWidth,0);return window.scrollX}),0,'Academy horizontal overflow '+locale+' '+device);
await page.screenshot({path:"qa-screenshots/"+locale+"-"+device+"-academy-home.png",fullPage:true});

assert.equal(await page.locator('.ed-map-grid a[href^="/'+locale+'/akademija/"]').count(),2,'Academy graphics must link both module pages');
const mapStyle=await page.evaluate(()=>{
 const section=document.querySelector('.ed-map');
 const title=section.querySelector('h2');
 return {bg:getComputedStyle(section).backgroundColor,fg:getComputedStyle(title).color};
});
assert.ok(ratio(mapStyle.fg,mapStyle.bg)>=4.5,'Academy diagram heading contrast <4.5:1');
const moduleResponse=await page.goto(baseUrl+"/"+locale+"/akademija/modul-03/",{waitUntil:"domcontentloaded"});
assert.equal(moduleResponse.status(),200);
assert.equal(await page.locator('.academyl-flow li').count(),3,'Module 03 offer graphic must have three steps');
assert.equal(await page.locator('[data-lesson-print]').count(),1,'Module 03 print action lost');
await page.screenshot({path:"qa-screenshots/"+locale+"-"+device+"-academy-module03.png",fullPage:true});

await context.close();
}
}
console.log("Knowledge browser checks PASS: "+passed+" routes plus glossary and image QA");
}finally{await browser.close()}
