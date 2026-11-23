'use strict';
// DANINI Academy Browser QA: actual Astro/Worker page, mocked API only.
// No real OTP emails, purchases, AI calls, secrets or public registration.
const assert = require('node:assert/strict');
const {randomUUID} = require('node:crypto');
const {readFileSync} = require('node:fs');
const {chromium} = require('@playwright/test');
const BASE = process.env.ACADEMY_BUILDER_TEST_ORIGIN || 'http://127.0.0.1:4321';
const sleep = ms => new Promise(resolve => setTimeout(resolve,ms));

async function scenario(browser, language, width) {
  let signedIn = false, projects = new Map(), submittedOtp = 0;
  const session = await browser.newContext({viewport:{width,height:width<700?844:900},acceptDownloads:true});
  await session.addInitScript(() => {
    // Turnstile is specifically mocked for browser E2E; backend has separate tests.
    window.turnstile={render:()=>1,reset:()=>{},getResponse:()=>'E2E_MOCK_TURNSTILE'};
  });
  const page = await session.newPage();
  const consoleErrors=[]; const apiCalls=[];
  page.on('pageerror', error => consoleErrors.push(error.message));
  await page.route('**/api/academy/**', async route => {
    const req=route.request(),path=new URL(req.url()).pathname.replace('/api/academy/','');
    const method=req.method();const input=method==='GET'?{}:(req.postDataJSON?.()||{}); apiCalls.push(method+' '+path);
    let code=200,body={};
    if(path==='config'&&method==='GET')body={enabled:true,siteKey:'1x00000000000000000000AA'};
    else if(path==='session'&&method==='GET')body={authenticated:signedIn};
    else if(path==='auth/start'&&method==='POST'){
      assert.equal(input.language,language);assert.ok(input.email?.includes('@'));
      assert.equal(input.turnstileToken,'E2E_MOCK_TURNSTILE');
      body={accepted:true,challengeId:'11111111-1111-4111-8111-111111111111'};
      submittedOtp++;
    }
    else if(path==='auth/verify'&&method==='POST'){
      if(input.code==='12345678'&&input.challengeId==='11111111-1111-4111-8111-111111111111'){
        signedIn=true;body={authenticated:true,expiresInSeconds:604800};
      }else{code=401;body={error:'invalid_or_expired_code'}};
    }
    else if(path==='logout'&&method==='POST'){signedIn=false;body={loggedOut:true}}
    else if(!signedIn){code=401;body={error:'login_required'}}
    else if(path==='projects'&&method==='GET')body={projects:[...projects.values()].map(p=>({id:p.id,title:p.title,language:p.language,status:'draft'}))};
    else if(path==='projects'&&method==='POST'){
      const p={id:randomUUID(),title:input.title,language:input.language,steps:[]};projects.set(p.id,p);body={project:p};code=201;
    }
    else {
      const m=path.match(/^projects\/([a-f0-9-]{36})(?:\/(export|steps\/(niche|market|offer|online_presence|operations|validation)))?$/);
      const p=m&&projects.get(m[1]);
      if(!p){code=404;body={error:'not_found'}}
      else if(m[2]==='export'&&method==='GET')body={schemaVersion:1,project:p};
      else if(m[3]&&method==='PUT'){
        p.steps=p.steps.filter(s=>s.step!==m[3]);p.steps.push({step:m[3],fields:input.fields});
        body={saved:true,step:m[3]};
      }
      else if(!m[2]&&method==='GET')body={project:p};
      else if(!m[2]&&method==='DELETE'){projects.delete(p.id);body={deleted:true}}
      else {code=405;body={error:'method_not_allowed'}}
    }
    await route.fulfill({status:code,contentType:'application/json',body:JSON.stringify(body)});
  });
  const path=`/${language}/akademija/builder/`;
  const response=await page.goto(BASE+path,{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response?.status(),200,`Builder page ${path}`);
  try { await page.locator('#signin').waitFor({state:'visible',timeout:8000}); }
  catch (e) {
    console.error('Builder initialize diagnostics', JSON.stringify({
      lang:language, viewport:width,
      notice:await page.locator('#notice').textContent().catch(()=>null),
      signinHidden:await page.locator('#signin').evaluate(el=>el.hidden).catch(()=>null),
      configRequests:apiCalls,
      pageErrors:consoleErrors,
      inlineScripts:await page.locator('script').count()
    }));
    throw e;
  }
  await page.locator('#email').fill(language==='de'?'alice@beispiel.test':'ana@primer.test');
  await page.locator('#login-form button').click();
  await page.locator('#verify-form').waitFor({state:'visible'});
  await page.locator('#otp').fill('12345678');
  await page.locator('#verify-form button').click();
  await page.locator('#dashboard').waitFor({state:'visible'});
  assert.equal(submittedOtp,1);
  await page.locator('#project-title').fill('Moj online projekat');
  await page.locator('#new-project button').click();
  await page.locator('#editor').waitFor({state:'visible'});
  const tabs=page.locator('.bb-tab');
  assert.equal(await tabs.count(),6);
  const expected=['niche','market','offer','online_presence','operations','validation'];
  for(let n=0;n<6;n++){
    if(n>0)await tabs.nth(n).click();
    assert.equal(await tabs.nth(n).getAttribute('aria-pressed'),'true');
    await page.locator('#field-a').fill(`Original ${expected[n]} pitanje`);
    await page.locator('#field-b').fill(`Informacija ${n}`);
    await page.locator('#step-form button').click();
    await page.waitForFunction(index=>document.querySelectorAll('.bb-tab')[index]?.textContent.includes('✓'),n);
    assert.equal(await tabs.nth(n).getAttribute('aria-pressed'),'true',`Save moved away from ${expected[n]}`);
  }
  assert.equal(projects.size,1);
  const finalProject=[...projects.values()][0];assert.equal(finalProject.steps.length,6);
  await page.locator('#project-list button').click();
  await page.waitForFunction(() => document.querySelector('.bb-tab[aria-pressed="true"]')?.textContent.startsWith('1.') && document.querySelector('#field-a')?.value === 'Original niche pitanje');
  assert.equal(await page.locator('#field-a').inputValue(),'Original niche pitanje');
  let exported;
  const downloadWait=page.waitForEvent('download');
  await page.locator('#export').click();
  const download=await downloadWait;
  assert.match(download.suggestedFilename(),/^danini-project-/);
  exported=JSON.parse(readFileSync(await download.path(),'utf8'));
  assert.equal(exported.project.steps.length,6);
  assert.equal(exported.project.steps[0].fields.a,'Original niche pitanje');
  await page.locator('#logout').click();
  await page.locator('#signin').waitFor({state:'visible'});
  assert.equal(await page.locator('#dashboard').isVisible(),false);
  // A new login restores the same server-side project, even without JS state.
  await page.locator('#email').fill(language==='de'?'alice@beispiel.test':'ana@primer.test');
  await page.locator('#login-form button').click();
  await page.locator('#verify-form').waitFor({state:'visible'});
  await page.locator('#otp').fill('12345678');
  await page.locator('#verify-form button').click();
  await page.locator('#dashboard').waitFor({state:'visible'});
  assert.equal(await page.locator('#project-list button').count(),1);
  await page.locator('#project-list button').click();
  await page.waitForFunction(() => document.querySelector('.bb-tab[aria-pressed="true"]')?.textContent.startsWith('1.') && document.querySelector('#field-a')?.value === 'Original niche pitanje');
  assert.equal(await page.locator('#field-a').inputValue(),'Original niche pitanje');
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#delete-project').click();
  await page.waitForFunction(()=>document.querySelector('#editor').hidden===true);
  assert.equal(projects.size,0);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth+1),true,`Horizontal overflow ${language}/${width}`);
  assert.deepEqual(consoleErrors,[],`Browser JS errors for ${language}/${width}`);
  console.log(`PASS Browser Builder ${language} ${width}px: OTP mock, 6 stages, reload, export, logout, delete`);
  await session.close();
}
async function preview(browser,language,width){
 const ctx=await browser.newContext({viewport:{width,height:width<700?844:900},acceptDownloads:true});
 const page=await ctx.newPage(),errors=[],writes=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',request=>{if(request.url().includes('/api/academy/')&&request.method()!=='GET')writes.push(request.method()+' '+request.url())});
 await page.route('**/api/academy/config',route=>route.fulfill({status:404,contentType:'application/json',body:'{"error":"not_found"}'}));
 const res=await page.goto(BASE+'/'+language+'/akademija/builder/',{waitUntil:'domcontentloaded'});
 assert.equal(res?.status(),200);
 await page.locator('#demo').waitFor({state:'visible',timeout:15000});
 assert.equal(await page.locator('#signin').isVisible(),false);
 assert.equal(await page.locator('#dashboard').isVisible(),false);
 await page.locator('#demo-title').fill('Moja demonstraciona ideja');
 for(let i=0;i<6;i++){
  assert.equal(await page.locator('.bb-beginner-intro').count(),1,'Step '+i+' beginner explanation missing');
  assert.equal(await page.locator('#demo-fields .bb-field-tip').count()>=4,true,'Short field instructions missing');
  assert.equal(await page.locator('#demo-fields .bb-field-example').count(),3,'Every field needs a beginner example');
  for(const key of ['a','b','c'])assert.ok((await page.locator('#demo-field-'+key).getAttribute('placeholder')).length>15,'Example placeholder missing '+key);
  await page.getByRole('button',{name:language==='de'?'Entwurf prüfen (ohne KI)':'Proveri nacrt (bez AI)'}).click();
  const review=await page.locator('#demo-help-feedback').innerText();
  assert.ok(review.includes(language==='de'?'Bitte ergänzen':'Dopuni'),'Missing required-fields hint');
  await page.getByRole('button',{name:language==='de'?'KI-Fragen für diesen Schritt vorbereiten':'Pripremi AI pitanja za ovaj korak'}).click();
  const prompt=await page.locator('#demo-ai-prompt').inputValue();
  assert.ok(prompt.includes('Moja demonstraciona ideja'),'AI prompt lacks personal project name');
  assert.ok(prompt.includes(language==='de'?'Erfinde keine':'Ne izmišljaj'),'AI prompt must state verification boundaries');
  assert.equal(await page.locator('#demo-ai-prompt').isVisible(),true,'Prompt panel missing');
  assert.equal(await page.locator('#demo-count').innerText(),(language==='de'?'Schritt ':'Korak ')+(i+1)+(language==='de'?' von 6':' od 6'));
  await page.locator('#demo-field-a').fill('Napisani podatak '+i);
  await page.locator('#demo-field-b').fill('Pretpostavka '+i);
  await page.locator('#demo-next').click();
 }
 await page.locator('#demo-result').waitFor({state:'visible'});
 assert.match(await page.locator('#demo-summary').innerText(),/Napisani podatak 0/);
 assert.match(await page.locator('#demo-summary').innerText(),/Napisani podatak 5/);
 const downloadEvent=page.waitForEvent('download');
 await page.locator('#demo-export').click();
 const download=await downloadEvent;
 const payload=JSON.parse(readFileSync(await download.path(),'utf8'));
 assert.equal(payload.project.title,'Moja demonstraciona ideja');
 assert.equal(payload.project.steps.length,6);
 assert.equal(payload.project.steps[0].fields.a,'Napisani podatak 0');
 assert.equal(payload.project.steps[5].fields.a,'Napisani podatak 5');
 // Verify the real new free-preview controls (not just existence of buttons).
 const expectedHeading=language==='sr'?'Moj online biznis — početni operativni paket':'Mein Online-Business – operatives Startpaket';
 const rendered=await page.locator('#demo-summary').innerText();
 assert.ok(rendered.includes(expectedHeading),'Missing localized package title');
 assert.ok(rendered.includes(language==='sr'?'Pretpostavke i otvorene hipoteze':'Annahmen und offene Hypothesen'),'Missing hypothesis section');
 assert.ok(rendered.includes(language==='sr'?'Naredni konkretni koraci za proveru':'Nächste konkrete Prüfschritte'),'Missing next-step section');
 const textEvent=page.waitForEvent('download');
 await page.locator('#demo-text').click();
 const textDownload=await textEvent;
 assert.equal(textDownload.suggestedFilename(),'danini-online-business-startpaket-'+language+'.txt');
 const textData=readFileSync(await textDownload.path(),'utf8');
 assert.ok(textData.includes(expectedHeading),'TXT lacks localized heading');
 assert.ok(textData.includes('Napisani podatak 0')&&textData.includes('Napisani podatak 5'),'TXT lost data');
 await page.evaluate(()=>{window.__academyPrintCalled=false;window.print=()=>{window.__academyPrintCalled=true}});
 await page.locator('#demo-print').click();
 assert.equal(await page.evaluate(()=>window.__academyPrintCalled),true,'Print action did not call window.print');
 await page.emulateMedia({media:'print'});
 const visibility=await page.evaluate(()=>({
  result:getComputedStyle(document.getElementById('demo-result')).visibility,
  actions:getComputedStyle(document.querySelector('#demo-result .bb-demo-actions')).display
 }));
 assert.equal(visibility.result,'visible','Dossier hidden in print');
 assert.equal(visibility.actions,'none','Interactive controls appeared in print');
 const pdf=await page.pdf({format:'A4',printBackground:true});
 assert.equal(pdf.subarray(0,5).toString(),'%PDF-','Invalid PDF');
 assert.ok(pdf.length>2000,'PDF unexpectedly empty');
 await page.emulateMedia({media:'screen'});
 console.log('PASS Builder '+language+' '+width+'px: DE/SR TXT, evidence labels, print action, valid Chromium PDF '+pdf.length+' bytes');
 await page.locator('#demo-edit').click();
 assert.equal(await page.locator('#demo-field-a').inputValue(),'Napisani podatak 5');
 await page.locator('#demo-back').click();
 assert.equal(await page.locator('#demo-field-a').inputValue(),'Napisani podatak 4');
 await page.locator('#demo-next').click(); // back to step 6
  await page.locator('#demo-next').click(); // finish dossier
 await page.locator('#demo-result').waitFor({state:'visible'});
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#demo-reset').click();
 await page.locator('#demo-title').evaluate(el=>el.scrollIntoView());
 assert.equal(await page.locator('#demo-title').inputValue(),'');
 assert.equal(await page.locator('#demo-count').innerText(),(language==='de'?'Schritt 1 von 6':'Korak 1 od 6'));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),true,'preview horizontal overflow '+language+'/'+width);
 assert.deepEqual(errors,[],'Preview JS errors');
 assert.deepEqual(writes,[],'Preview unexpectedly sent customer data to API');
 await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('#demo').waitFor({state:'visible'});
 assert.equal(await page.locator('#demo-title').inputValue(),'','Preview persisted data after refresh');
 console.log('PASS Browser preview '+language+' '+width+'px: 6 steps, JSON, navigation, reset, private/offline');
 await ctx.close();
}
async function disabled(browser) {
  const context=await browser.newContext({viewport:{width:390,height:840}});
  const page=await context.newPage();
  await page.route('**/api/academy/config',route=>route.fulfill({status:404,contentType:'application/json',body:JSON.stringify({error:'not_found'})}));
  const response=await page.goto(BASE+'/sr/akademija/builder/',{waitUntil:'domcontentloaded'});
  assert.equal(response?.status(),200);
  await page.waitForFunction(()=>document.querySelector('#notice').textContent.includes('Besplatni Business Builder je aktivan'));
  assert.equal(await page.locator('#signin').isVisible(),false);
  assert.equal(await page.locator('#dashboard').isVisible(),false);
  await context.close();
  console.log('PASS disabled: no login or public registration visible');
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH || undefined,args:['--no-sandbox']});
 try{
  for(const lang of ['sr','de'])for(const width of [390,1440])await scenario(browser,lang,width);
  await disabled(browser);
  for(const lang of ['sr','de'])for(const width of [390,1440])await preview(browser,lang,width);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});