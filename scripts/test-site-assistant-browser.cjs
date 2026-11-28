'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('@playwright/test');
const BASE=process.env.SITE_ASSISTANT_TEST_ORIGIN||'http://127.0.0.1:4321';
async function scenario(browser,locale,section,width){
 const context=await browser.newContext({viewport:{width,height:width<650?820:950}});
 await context.addInitScript(()=>{window.turnstile={render:()=>7,getResponse:()=>'mock-site-helper-turnstile',reset:()=>{}}});
 const page=await context.newPage();
 const calls=[],errs=[];page.on('pageerror',e=>errs.push(e.message));
 await page.route('**/api/academy/assistant/**',async route=>{
  const req=route.request(),url=new URL(req.url());
  if(url.pathname.endsWith('/status'))return route.fulfill({status:200,contentType:'application/json',
    body:JSON.stringify({enabled:true,siteKey:'0x000000000000TEST'})});
  if(url.pathname.endsWith('/projects'))return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({authenticated:true,projects:[{id:'123e4567-e89b-42d3-a456-426614174000',title:'Moj online biznis',language:locale}]})});
  const data=req.postDataJSON();calls.push(data);
  return route.fulfill({status:200,contentType:'application/json',
   body:JSON.stringify({aiUsed:true,answer:locale==='de'?'Schreiben Sie zuerst eine konkrete Kundengruppe.':'Prvo napiši jednu konkretnu ciljnu grupu.',
    nextStep:locale==='de'?'Überprüfen Sie den Entwurf selbst.':'Proveri svoj nacrt.',unverified:true})});
 });
 try{
  const route=section==='academy'?'akademija/builder/':section==='auto'?'auto-check/':'business/';
  const res=await page.goto(BASE+'/'+locale+'/'+route,{waitUntil:'domcontentloaded'});
  assert.equal(res.status(),200);
  const active=section==='academy'?'#demo-title':section==='auto'?'#vehicle-source':'[data-business-enquiry] textarea[name="message"]';
  if(section==='academy')await page.locator('#demo').waitFor({state:'visible'});
  await page.locator(active).fill('PRIVATNA_PROBNA_VREDNOST_NIKADA_NE_SLANJE_SE_AUTOMATSKI');
  await page.locator('#danini-assistant-toggle').click();
  await page.locator('#danini-assistant-panel').waitFor({state:'visible'});
  await page.locator('#danini-assistant-local').click();
  assert.ok((await page.locator('#danini-assistant-reply').innerText()).length>30);
  assert.equal(calls.length,0,'Local form help must not call AI');
  await page.locator('#danini-assistant-ask').waitFor({state:'visible'});
  await page.locator('#danini-assistant-project-reload').click();
  await page.locator('#danini-assistant-project').selectOption('123e4567-e89b-42d3-a456-426614174000');
  await page.locator('#danini-assistant-question').fill(locale==='de'?'Was muss ich in das aktuelle Feld eingeben?':'Šta tačno treba da napišem u izabrano polje?');
  await page.locator('#danini-assistant-ask').click();
  await page.waitForFunction(()=>document.querySelector('#danini-assistant-reply')?.textContent?.includes('Proveri svoj nacrt.')||
   document.querySelector('#danini-assistant-reply')?.textContent?.includes('Überprüfen Sie'));
  assert.equal(calls.length,1);
  assert.equal(calls[0].language,locale);assert.equal(calls[0].context,section);
  assert.equal(calls[0].projectId,'123e4567-e89b-42d3-a456-426614174000');
  assert.deepEqual(calls[0].history,[]);
  assert.ok(calls[0].question.length>=8);
  assert.ok(!JSON.stringify(calls[0]).includes('PRIVATNA_PROBNA_VREDNOST'),'Form values were leaked automatically');
  assert.equal(await page.locator('#danini-assistant-history .da-turn').count(),2);
  assert.ok((await page.locator('#danini-assistant-history').innerText()).includes('DANINI AI:'));
  await page.locator('#danini-assistant-question').fill(locale==='de'?'Wie könnte ich diese Idee als Online-Unternehmen testen?':'Kako da testiram ideju za sopstveno online preduzeće?');
  await page.locator('#danini-assistant-ask').click();
  await page.waitForFunction(()=>document.querySelectorAll('#danini-assistant-history .da-turn').length===4);
  assert.equal(calls.length,2);
  assert.equal(calls[1].history.length,2);
  await page.locator('#danini-assistant-project').selectOption('');
  assert.equal(await page.locator('#danini-assistant-history .da-turn').count(),0,'Changing project must clear current chat context');
  assert.equal(errs.length,0,'Page script error: '+errs.join('; '));
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#danini-assistant-panel').isVisible(),false);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),true);
  console.log('PASS unified site assistant '+locale+'/'+section+'/'+width+'px local guidance, explicit AI opt-in, no form value leakage');
 }finally{await context.close()}
}
async function statusRecovery(browser,locale){
 const context=await browser.newContext({viewport:{width:390,height:844}});
 await context.addInitScript(()=>{window.turnstile={render:()=>7,getResponse:()=>'mock-site-helper-turnstile',reset:()=>{}}});
 const page=await context.newPage();let online=false;
 await page.route('**/api/academy/assistant/status',route=>route.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({enabled:online,siteKey:online?'0x000000000000TEST':null})}));
 try{
  const res=await page.goto(BASE+'/'+locale+'/akademija/builder/',{waitUntil:'domcontentloaded'});
  assert.equal(res.status(),200);
  await page.locator('#danini-assistant-toggle').click();
  await page.locator('#danini-assistant-retry').waitFor({state:'visible'});
  assert.equal(await page.locator('#danini-assistant-ask').isVisible(),false);
  await page.locator('#danini-assistant-local').click();
  assert.ok((await page.locator('#danini-assistant-reply').innerText()).length>25);
  const off=await page.locator('#danini-assistant-status').innerText();
  assert.ok(off.includes(locale==='de'?'deaktiviert':'isključen'),'Disabled AI status must not be confused with field help');
  online=true;
  await page.locator('#danini-assistant-retry').click();
  await page.locator('#danini-assistant-ask').waitFor({state:'visible',timeout:12000});
  assert.equal(await page.locator('#danini-assistant-retry').isVisible(),false);
  assert.ok((await page.locator('#danini-assistant-status').innerText()).includes(locale==='de'?'bereit':'spreman'));
  console.log('PASS site helper '+locale+': offline static guidance, clear AI status, retry recovery');
 }finally{await context.close()}
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const locale of ['de','sr'])
   for(const section of ['academy','auto','business'])await scenario(browser,locale,section,390);
  for(const locale of ['de','sr'])await scenario(browser,locale,'academy',1440);
  for(const locale of ['de','sr'])await statusRecovery(browser,locale);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
