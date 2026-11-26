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
   assert.match(await audit.locator('[data-tqa-status]').innerText(),/REVIEW/);
   assert.equal(await audit.locator('[data-tqa-gaps] li').count(),3);
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
