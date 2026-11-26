'use strict';
const assert=require('node:assert/strict');
async function auditTenderQuickAudit(browser,base){
 for(const locale of ['de','sr']){
  const page=await browser.newPage({viewport:{width:390,height:844}});
  let writes=0;
  try{
   await page.route('**/*',route=>{
     const req=route.request();
     if(!['GET','HEAD'].includes(req.method())){writes++;return route.abort();}
     if(!req.url().startsWith(base+'/'))return route.abort();
     return route.continue();
   });
   await page.goto(base+'/'+locale+'/business/',{waitUntil:'domcontentloaded'});
   const audit=page.locator('[data-tender-audit]'), evaluate=audit.locator('[data-tqa-evaluate]'), reset=audit.locator('[data-tqa-reset]'), transfer=audit.locator('[data-tqa-transfer]');
   await reset.waitFor({state:'visible'});
   await page.waitForFunction(()=>!document.querySelector('[data-tqa-reset]').disabled);
   assert.ok(await evaluate.isDisabled());
   for(const [i,value] of ['yes','partial','unknown','no','yes'].entries()) await audit.locator('[data-tqa-question]').nth(i).locator('input[value="'+value+'"]').check();
   await evaluate.click();
   assert.match(await audit.locator('[data-tqa-score]').innerText(),/50\s*\/\s*100/);
   assert.match(await audit.locator('[data-tqa-status]').innerText(),locale==='de'?/Prüfung erforderlich/:/Potrebna je dodatna provera/);
   assert.equal(await audit.locator('[data-tqa-gaps] li').count(),3);
   const contrast=await audit.evaluate(el=>{const lum=s=>{const v=s.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722;};return [...el.querySelectorAll('legend,label,[data-tqa-status],[data-tqa-gaps] li,[data-tqa-result] p,[data-tqa-result] small')].map(e=>{let b=e;while(b&&getComputedStyle(b).backgroundColor==='rgba(0, 0, 0, 0)')b=b.parentElement;const a=lum(getComputedStyle(e).color),c=lum(getComputedStyle(b).backgroundColor);return {text:e.textContent.slice(0,70),ratio:(Math.max(a,c)+.05)/(Math.min(a,c)+.05)};});});
   assert.ok(contrast.every(x=>x.ratio>=4.5),JSON.stringify(contrast));
   assert.equal(await page.locator('select[name=country] option[value=DE]').textContent(),locale==='de'?'Deutschland':'Nemačka');
   assert.equal(await page.locator('head meta[property="og:image"]').count(),1);
   assert.equal(await page.locator('head meta[name="twitter:image"]').count(),1);
   const inquiry=page.locator('#anfrage');assert.equal(await inquiry.count(),1);
   const demo=page.locator('[data-tender-demo-entry] img');assert.equal(await demo.count(),1);
   const form=page.locator('form[data-business-enquiry]'), message=form.locator('textarea[name=message]'), service=form.locator('select[name=service]');
   await message.fill('Test existing draft; not submitted.');
   await service.selectOption('check');
   await transfer.click();
   const draft=await message.inputValue();
   assert.ok(draft.startsWith('Test existing draft; not submitted.'));
   assert.ok(draft.includes('DACH Tender Quick Audit'));
   assert.equal(await service.inputValue(),'check');
   await transfer.click();assert.equal(await message.inputValue(),draft);
   await reset.click();assert.ok(await evaluate.isDisabled());assert.ok(await audit.locator('[data-tqa-result]').isHidden());
   assert.equal(writes,0,'Audit must not submit or transmit anything');
   console.log('TENDER_QUICK_AUDIT_BROWSER_PASS '+locale);
  }finally{await page.close();}
 }
}
module.exports={auditTenderQuickAudit};
