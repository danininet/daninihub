'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../cloudflare-preview-dist');
const required=[
 'index.html','sr/index.html','de/index.html',
 'sr/usluge/index.html','de/leistungen/index.html',
 'sr/kako-radimo/index.html','de/ablauf/index.html',
 'sr/za-firme/index.html','de/unternehmen/index.html',
 'sr/kontakt/index.html','de/kontakt/index.html',
 'sr/impressum/index.html','de/impressum/index.html',
 'sr/privatnost/index.html','de/datenschutz/index.html',
 'sr/uslovi/index.html','de/bedingungen/index.html',
 'sr/kolacici/index.html','de/cookies/index.html',
 'assets/cloudflare.css','robots.txt','_headers',
 'images/DANINI_Dragan_Portret_CLEAN_1200x1200.jpg',
 'images/DANINI_Dragan_Telefon_CLEAN_1200x1200.jpg',
 'images/DANINI_Dragan_Pregled_Auta_CLEAN_1200x1200.jpg'
];
for(const rel of required)assert.ok(fs.statSync(path.join(root,rel)).isFile(),'missing '+rel);
const pages=required.filter(x=>x.endsWith('.html'));
for(const p of pages){
 const content=fs.readFileSync(path.join(root,p),'utf8');
 assert.match(content,/<html/,'html '+p);
 assert.doesNotMatch(content,/<script[^>]+src="[^"]*\/api\//,'API script '+p);
}
for(const p of ['sr/index.html','de/index.html','sr/usluge/index.html','de/leistungen/index.html']){
 const s=fs.readFileSync(path.join(root,p),'utf8');
 for(const price of ['59 €','189 €','349 €'])assert.ok(s.includes(price),'missing '+price+' in '+p);
 assert.match(s,/4915730916621/,'WhatsApp');
 assert.match(s,/noindex,nofollow/,'staging index blocked');
 assert.doesNotMatch(s,/paypal\.com\/checkout|api\/v1|\/api\/checkout/,'backend-only checkout');
}
const b2b=fs.readFileSync(path.join(root,'sr/za-firme/index.html'),'utf8');
assert.match(b2b,/345/);
assert.match(b2b,/648/);
assert.doesNotMatch(b2b,/affiliate.*href=/i,'unapproved affiliate');
assert.match(fs.readFileSync(path.join(root,'_headers'),'utf8'),/noindex, nofollow/);
assert.match(fs.readFileSync(path.join(root,'robots.txt'),'utf8'),/Disallow: \//);
console.log('Cloudflare preview smoke tests passed:',required.length,'files');
