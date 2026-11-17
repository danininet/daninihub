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
for(const route of ["wissen/","wissen/glossar/","wissen/dokumente/","wissen/gebrauchtwagen-anzahlung/","wissen/kundenanfragen/","wissen/dokumente/auto-dienstleistungsvereinbarung/","wissen/dokumente/business-sow/"]){
const response=await page.goto("http://127.0.0.1:4321/"+locale+"/"+route,{waitUntil:"networkidle"});
assert.equal(response.status(),200,locale+" "+route);
assert.equal(await page.locator("main h1").count(),1,locale+" "+route+" heading");
assert.equal(await page.locator("body").evaluate(el=>el.scrollWidth<=innerWidth+2),true,locale+" "+route+" overflow");
assert.equal((await page.locator('link[rel="canonical"]').getAttribute("href")).includes("/"+locale+"/"+route),true);
assert.equal(await page.locator('link[hreflang]').count()>=2,true);
assert.deepEqual(errors,[],locale+" "+route+" JS");
passed++;
}
assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"),"noindex,follow");
await page.goto("http://127.0.0.1:4321/"+locale+"/wissen/glossar/");
assert.equal(await page.locator(".glossary-item").count(),24);
assert.equal(await page.locator('.glossary-item a[href^="#begriff-"]').count(),48);
await page.goto("http://127.0.0.1:4321/"+locale+"/wissen/");
assert.equal(await page.locator(".knowledge-vertical").count(),2);
assert.equal(await page.locator(".manuscript").count(),3,locale+" missing source manuscripts");
const originals=locale==="de"
?[["anfragemanagement-kleine-unternehmen",true],["ki-angebotsvorbereitung",true],["dsgvo-kundenanfragen-ki",false]]
:[["fahrzeugbrief-fahrzeugschein-coc-hu",true],["privatni-prodavac-ili-auto-kuca-nemacka",false],["eur1-poreklo-vozila-uvoz-nemacka-srbija",true]];
for(const [slug,indexable] of originals){
 const url="/"+locale+"/wissen/"+slug+"/";
 const r=await page.goto(baseUrl+url,{waitUntil:"networkidle"});
 assert.equal(r.status(),200,url);
 assert.equal(await page.locator(".source-body p").count()>15,true,"source manuscript truncated "+url);
 assert.equal(await page.locator("h1").count(),1);
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
await page.goto(baseUrl+"/"+locale+"/wissen/");

const img=page.locator(".knowledge-vertical img");
await img.scrollIntoViewIfNeeded();
assert.equal(await img.evaluate(el=>el.complete&&el.naturalWidth>0),true,"missing first-party image");
await page.screenshot({path:"qa-screenshots/"+locale+"-"+device+"-knowledge.png",fullPage:true});
await context.close();
}
}
console.log("Knowledge browser checks PASS: "+passed+" routes plus glossary and image QA");
}finally{await browser.close()}
