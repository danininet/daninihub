'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {render,routes}=require('../site-experience');
const {ROUTES,shell}=require('../server-public-runtime');
const eco=require('../danini-ecosystem');
const needed=['parts','b2b','place','article1','article2'];
const checks={
  start:['DANINI_Kartica_04_Zoll_Tablice_Dovoz_Na_Tockovima.jpg','DANINI_Kartica_05_Originalni_OE_Delovi_Servis.jpg','DANINI_Kartica_06_B2B_Sourcing_I_Preuzimanje.jpg','Usluge po transparentnoj individualnoj ponudi'],
  delivery:['Ausfuhrkennzeichen','CMR','Haftpflicht','Zoll'],
  calculator:['6.000 €','EUR.1','MwSt'],
  guides:['provera-oglasa-pre-kapare','uvoz-zoll-eur1-i-dovoz'],
  eco_parts:['VIN','110–180 €/h','25–45 €/h'],
  eco_b2b:['cena po ponudi','MwSt'],
  eco_place:['345 m²','648 m²','993 m²'],
  eco_article1:['VIN','DANINI'],
  eco_article2:['EUR.1','CMR']
};
for(const lang of ['sr','de']){
 for(const k of needed){
  const url=eco.route(lang,k);
  assert.ok(routes[url]&&ROUTES[url]&&routes[url].key==='eco_'+k,url);
 }
 for(const [key,tokens] of Object.entries(checks)){
  const html=render(lang,key,shell);
  for(const token of tokens){
   // Bilingual content sometimes has a deliberate wording difference.
   assert.ok(html.includes(token),lang+' '+key+' missing '+token);
  }
  assert.ok(!/RSD\s*\/\s*ton/i.test(html),'No RSD price in '+key);
  assert.match(html,/danini-order\.js/);
 }
}
for(const file of Object.values({driving:'DANINI_Kartica_04_Zoll_Tablice_Dovoz_Na_Tockovima.jpg',service:'DANINI_Kartica_05_Originalni_OE_Delovi_Servis.jpg',b2b:'DANINI_Kartica_06_B2B_Sourcing_I_Preuzimanje.jpg'})){
 const data=fs.readFileSync(path.join(__dirname,'..','public','images',file));
 assert.ok(data.length>100000,file);
 assert.equal(data[0],0xff,file);assert.equal(data[1],0xd8,file);assert.equal(data[2],0xff,file);
}
const order=fs.readFileSync(path.join(__dirname,'..','public','danini-order.js'),'utf8');
// Public inquiries require buyer approval of external transfer, not a premature payment.
assert.doesNotMatch(order,/paypal\.me|danini-order-pay|payment\.hidden/);
assert.match(order,/danini-order-consent-check/);
assert.match(order,/mailto:/);
assert.match(order,/wa\.me/);
assert.match(order,/pre bilo kakve uplate/i);
assert.match(order,/danini-order-checklist/);
assert.match(order,/10\.000 €/);
assert.match(order,/uvoz-zoll-eur1-i-dovoz/);
console.log('AutoDanini SR/DE ecosystem, safe inquiries, SEO routes and approved photos: OK');
