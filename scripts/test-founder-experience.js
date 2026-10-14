'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const founder=require('../founder-experience');
const routes=founder.routes;
const experience=require('../site-experience');
const {shell}=require('../server-public-runtime');
for(const locale of ['sr','de']){
 const html=experience.render(locale,'start',shell);
 assert.equal((html.match(/<h1[^>]*>/g)||[]).length,1,'homepage must have exactly one H1: '+locale);
}

for(const lang of ['sr','de']){
 assert.ok(founder.home(lang).includes('dragan-original-2026.jpg'),'missing original portrait '+lang);
 assert.ok(founder.home(lang).includes('founder-gallery'),'missing grid '+lang);
 for(const key of ['profile','business','dealer','gtm','projects','cv','rental','contact']){
  const matches=Object.entries(routes).filter(([,v])=>v.lang===lang && v.key==='founder-'+key);
  assert.equal(matches.length,1,'expected unique '+lang+' '+key);
  const html=founder.page(lang,'founder-'+key);
  assert.ok(html.includes('mailto:info@daninihub.com'),'missing email '+lang+' '+key);
  assert.ok(html.includes('wa.me/4915730916621'),'missing WhatsApp '+lang+' '+key);
 }
}
assert.ok(founder.page('sr','founder-profile').includes('AI poslovne ilustracije'));
assert.ok(founder.page('de','founder-profile').includes('KI-Businessillustrationen'));
assert.ok(!/Stripe|PayPal|<form/i.test(founder.page('sr','founder-contact')),'form or payment accidentally added');
for(const name of ['dragan-original-2026.jpg','dragan-business-grid-3x3.png'])assert.ok(fs.existsSync(path.join(__dirname,'..','public',name)),'asset missing '+name);
console.log('PASS: bilingual owner portfolio, 12 routes, 3x3 visual, contact and source images');
