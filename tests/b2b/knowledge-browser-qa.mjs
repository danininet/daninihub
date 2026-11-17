import {chromium} from "@playwright/test";
import assert from "node:assert/strict";
import {mkdirSync} from "node:fs";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
mkdirSync("qa-screenshots",{recursive:true});
let passed=0;
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
const img=page.locator(".knowledge-vertical img");
await img.scrollIntoViewIfNeeded();
assert.equal(await img.evaluate(el=>el.complete&&el.naturalWidth>0),true,"missing first-party image");
await page.screenshot({path:"qa-screenshots/"+locale+"-"+device+"-knowledge.png",fullPage:true});
await context.close();
}
}
console.log("Knowledge browser checks PASS: "+passed+" routes plus glossary and image QA");
}finally{await browser.close()}
