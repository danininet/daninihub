"use strict";
/* Browser QA is local Wrangler preview only. No real AI, Brevo, payment or CAPTCHA. */
const { chromium } = require("@playwright/test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 let completed=0;
 const records=[];
 fs.mkdirSync("outputs/b2b/dialog",{recursive:true});
 try{
  for(const locale of ["de","sr"]){
   for(const width of [320,390,768,1440]){
    const context=await browser.newContext({viewport:{width,height:900}});
    const page=await context.newPage();
    const jsErrors=[],postCalls=[];
    page.on("pageerror",error=>jsErrors.push(error.message));
    page.on("request",request=>{if(request.method()==="POST"&&request.url().includes("/api/"))postCalls.push(request.url());});
    const url="http://127.0.0.1:4321/"+locale+"/ai-savetnik/";
    const response=await page.goto(url,{waitUntil:"domcontentloaded"});
    assert.equal(response?.status(),200,url+" HTTP");
    assert.equal(await page.locator("main h1").count(),1);
    const canonical=await page.locator('link[rel="canonical"]').getAttribute("href");
    assert.match(canonical||"",new RegExp("/"+locale+"/ai-savetnik/$"));
    assert.equal(await page.locator("#problem-guide-options button").count(),5,"five problem paths");
    assert.equal(await page.locator(".advisor-advanced").getAttribute("open"),null,"legacy analyzer should be optional");
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
    assert.equal(overflow,false,locale+" "+width+" horizontal overflow");
    for(let topic=0;topic<5;topic++){
      await page.locator("#problem-guide-options button").nth(topic).focus();
      await page.keyboard.press("Enter"); // WCAG keyboard activation.
      await page.locator("#problem-guide-question h3").waitFor();
      assert.match(await page.locator("#problem-guide-progress").innerText(),/1 \/ 3/);
      const first=await page.locator("#problem-guide-question h3").innerText();
      // Each next question changes with the preceding answer.
      await page.locator("#problem-guide-question .advisor-answer-buttons button").nth(0).click();
      assert.match(await page.locator("#problem-guide-progress").innerText(),/2 \/ 3/);
      const second=await page.locator("#problem-guide-question h3").innerText();
      assert.notEqual(second,first,"repeated follow-up");
      await page.locator("#problem-guide-question .advisor-answer-buttons button").nth(2).click();
      assert.match(await page.locator("#problem-guide-progress").innerText(),/3 \/ 3/);
      const third=await page.locator("#problem-guide-question h3").innerText();
      assert.notEqual(third,second,"repeated final question");
      // Edit earlier answer; later answers must be invalidated, then complete again.
      await page.locator("#problem-guide-history li button").first().click();
      assert.match(await page.locator("#problem-guide-progress").innerText(),/1 \/ 3/);
      await page.locator("#problem-guide-question .advisor-answer-buttons button").nth(2).click();
      await page.locator("#problem-guide-question .advisor-answer-buttons button").nth(1).click();
      await page.locator("#problem-guide-question .advisor-answer-buttons button").nth(2).click();
      const summary=await page.locator("#problem-guide-result").innerText();
      assert.match(summary,locale==="de"?/Nicht bestätigt/:/Nije potvrđeno/);
      assert.match(summary,/Zulassungsbescheinigung|Ist das Fahrzeug|Welche|Können Sie|Wartungsrechnungen/);
      const service=await page.locator("#problem-guide-result a").first().getAttribute("href");
      assert.equal(service,"/"+locale+"/auto-check/#contact","individual enquiry must link to existing protected intake");
      await page.locator("#problem-guide-question button").last().click(); // reset
      assert.equal(await page.locator("#problem-guide-history li").count(),0);
      assert.equal(await page.locator("#problem-guide-result").innerText(),"");
      completed++;
    }
    // Opt-in offer handoff preserves only the fixed answers; no automatic send.
    await page.locator("#problem-guide-options button").first().click();
    for(let n=0;n<3;n++)await page.locator("#problem-guide-question .advisor-answer-buttons button").nth(n%3).click();
    await page.locator("#problem-guide-result a").first().click();
    await page.waitForURL("**/"+locale+"/auto-check/#contact");
    const offerText=await page.locator("form[data-auto-enquiry] textarea[name=source]").inputValue();
    assert.match(offerText,locale==="de"?/Anfrage zur individuellen Vorprüfung/:/Upit za individualnu predproveru/);
    assert.match(offerText,locale==="de"?/keine Fahrzeugdaten bestätigt/:/podaci nisu nezavisno potvrđeni/);
    assert.match(offerText,locale==="de"?/Antworten/:/Odgovori/);
    assert.equal(await page.locator("form[data-auto-enquiry] select[name=intent]").inputValue(),"documents");
    assert.equal(await page.locator("form[data-auto-enquiry] input[name=email]").inputValue(),"");
    assert.equal(await page.locator("form[data-auto-enquiry] button[data-auto-submit]").isDisabled(),false,"fallback is usable when lead API is off");
    assert.equal(await page.locator("form[data-auto-enquiry]").evaluate(el=>el.checkValidity()),false,"mandatory contact details still protect the handoff");
    await page.goto(url,{waitUntil:"domcontentloaded"});
    await page.locator("#problem-guide-question button").last().click(); // restart after saved session
    // The short free-form problem stays local, no email, no API submission.
    await page.locator("#problem-guide-description").fill(locale==="de"?"Verkäufer verlangt eine Anzahlung.":"Prodavac traži kaparu.");
    await page.locator("#problem-guide-start").click();
    assert.match(await page.locator("#problem-guide-progress").innerText(),/1 \/ 3/);
    await page.locator("#problem-guide-question .advisor-answer-buttons button").nth(2).click();
    assert.equal(await page.evaluate(()=>JSON.parse(sessionStorage.getItem("danini-problem-guide-v2")).values[0]),"unknown");
    await page.reload({waitUntil:"domcontentloaded"});
    assert.match(await page.locator("#problem-guide-progress").innerText(),/2 \/ 3/,"session restore");
    assert.equal(await page.locator("#problem-guide-description").inputValue(),"","free text must not persist");
    // User may opt into the existing listing analysis, not forced to use it first.
    await page.locator("#problem-guide-question .advisor-answer-buttons button").nth(2).click();
    await page.locator("#problem-guide-question .advisor-answer-buttons button").nth(2).click();
    await page.locator("#problem-guide-result a[href='#listing']").click();
    assert.ok(await page.locator(".advisor-advanced").evaluate(el=>el.open),"listing analyzer opens on request");
    assert.equal(await page.locator("#listing").count(),1);
    assert.equal(await page.locator("#advisor-cta").isDisabled(),true,"no unverified lead submission");
    assert.deepEqual(postCalls,[],"free guide must not POST data to backend");
    assert.deepEqual(jsErrors,[],"dialog browser JavaScript exception");
    if(width===320||width===1440){
      await page.screenshot({path:"outputs/b2b/dialog/"+locale+"-"+width+".png",fullPage:true});
    }
    records.push({locale,width,topics:5,session:"restored",postCalls:postCalls.length,jsErrors:jsErrors.length});
    await context.close();
   }
  }
 }finally{await browser.close();}
 fs.writeFileSync("outputs/b2b/dialog/results.json",JSON.stringify(records,null,2));
 console.log("PASS AutoDanini dialogue: "+completed+" buyer journeys, DE/SR × 320/390/768/1440, keyboard, editing, reset, session, no POST.");
})().catch(error=>{console.error(error);process.exitCode=1;});
