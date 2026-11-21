'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../dist');
function page(p){const f=path.join(root,p);assert.ok(fs.existsSync(f),'missing rendered page '+p);return fs.readFileSync(f,'utf8')}
for(const lang of ['de','sr']){
 const home=page(lang+'/index.html');
 const academy=page(lang+'/akademija/index.html');
 const hub=page(lang+'/wissen/index.html');
 const catalog=page(lang+'/wissen/produkte/index.html');
 assert.ok(catalog.includes('/'+lang+'/akademija/'),'Academy product must be linked from catalog '+lang);
 assert.ok(catalog.indexOf('pd-education')<catalog.indexOf('pd-grid'),'Academy must be primary catalog card '+lang);
 assert.ok(home.includes('/'+lang+'/akademija/'),'academy missing as homepage CTA '+lang);
 assert.ok(home.includes('DANINI Business')&&home.includes('AUTODANINI'),'existing live examples lost '+lang);
 assert.ok(home.includes('DANINI AKADEMIJA'),'academy not first-class '+lang);
 assert.ok(hub.includes('/'+lang+'/akademija/'),'knowledge hub backlink missing '+lang);
 assert.ok(academy.includes('DANINI')&&academy.includes('AutoDanini'),'education examples missing '+lang);
 assert.ok(academy.includes('data-education-print'),'printable worksheet missing '+lang);
 assert.equal((academy.match(/class="ed-prompt"/g)||[]).length,3,'expected three AI prompts '+lang);
 assert.equal((academy.match(/<textarea[^>]*maxlength=/g)||[]).length,5,'expected five worksheet fields '+lang);
 assert.equal((academy.match(/class="ed-module ed-live"/g)||[]).length,1,'only module 01 is live '+lang);
 assert.equal((academy.match(/class="ed-module ed-pending"/g)||[]).length,5,'5 modules must be planned '+lang);
 assert.ok(!/garantovana zarada|guaranteed income|garantiertes Einkommen/i.test(academy),'income promise forbidden '+lang);
 assert.ok(academy.includes('/'+lang+'/business/')&&academy.includes('/'+lang+'/wissen/checkliste/'),'cases not linked '+lang);
 assert.ok(home.includes('/'+lang+'/auto-check/')&&home.includes('/'+lang+'/business/'),'existing services inaccessible '+lang);
 const canonical='https://daninihub.com/'+lang+'/akademija/';
 assert.ok(academy.includes(canonical),'academy SEO canonical missing '+lang);
 console.log('PASS DANINI academy',lang,'landing, one lesson, six-module honesty, prompts, worksheet, business cases');
}
const sitemap=page('sitemap.xml');
for(const lang of ['de','sr'])assert.ok(sitemap.includes('https://daninihub.com/'+lang+'/akademija/'),'missing sitemap '+lang);
console.log('PASS DANINI academy sitemap / de sr');
