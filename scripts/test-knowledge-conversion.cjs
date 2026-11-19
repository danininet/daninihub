'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const dist=path.join(__dirname,'..','dist');
function read(relative){
  const p=path.join(dist,relative);
  assert.ok(fs.existsSync(p),'Missing output: '+relative);
  const data=fs.readFileSync(p,'utf8');
  assert.ok(data.length>1000,'Unexpectedly empty: '+relative);
  return data;
}
function linkPresent(html,locale,slug){
  const route='/'+locale+'/wissen/'+slug+'/';
  assert.ok(html.includes(route),'Missing link to '+route);
}
for(const lang of ['de','sr']){
  const root=lang+'/wissen/';
  const hub=read(root+'index.html');
  const checklist=read(root+'checkliste/index.html');
  const products=read(root+'produkte/index.html');
  const partner=read(root+'partner/index.html');
  for(const slug of ['checkliste','produkte','partner'])linkPresent(hub,lang,slug);
  for(const p of [hub,checklist,products,partner]){
    assert.match(p,/<html lang="(?:de|sr)"/i,'Language attribute missing');
    assert.match(p,/<meta name="description"/i,'SEO description missing');
    assert.ok(!/Subscribe now|Buy now|Erfolgsquote 100%/i.test(p),'Misleading claim');
  }
  assert.match(hub,/AutoDanini/);
  assert.match(hub,/DANINI Business/);
  assert.match(hub,/DANINI_Kartica_01_Salon_Auto_Bez_Osobe\.jpg/,'Owned visual not used');
  assert.match(checklist,/window\.print\(\)/,'Print-to-PDF action absent');
  assert.match(checklist,/cl-square/,'Actual checkbox design absent');
  const count=(checklist.match(/class="cl-square"/g)||[]).length;
  assert.equal(count,12,'Must have exactly 12 checklist items in '+lang);
  assert.ok(checklist.includes('/'+lang+'/auto-check/'),'Lead handoff missing');
  assert.ok(products.includes('49 €'),'Established PDF price omitted');
  assert.ok(products.includes('149 €'),'Disabled proposed software status omitted');
  assert.match(products,/\/digital\.html/,'Existing digital product not linked');
  assert.ok(products.includes('Checkout')||products.includes('PayPal'),'Checkout limitation omitted');
  assert.ok(partner.includes('mailto:info@daninihub.com'),'Partner enquiry missing');
  assert.ok(partner.includes(lang==='de'?'Provisionsprogramm':'provizijskog programa'),'Must not imply active affiliate program');
  for(const slug of ['gebrauchtwagen-anzahlung','fahrzeugpapiere','auto-deutschland-serbien','kundenanfragen','email-formular-crm','ki-buero']){
    const article=read(root+slug+'/index.html');
    linkPresent(article,lang,'produkte');
    assert.match(article,/application\/ld\+json/,'Article schema missing');
  }
  console.log('PASS '+lang+' knowledge hub, 12-point checklist, catalog, partner page, six guide CTAs');
}
const sitemap=read('sitemap.xml');
for(const lang of ['de','sr'])for(const slug of ['checkliste','produkte','partner'])
 assert.ok(sitemap.includes('https://daninihub.com/'+lang+'/wissen/'+slug+'/'),'Sitemap route absent');
for(const legacy of ['de/wissen/anfragemanagement-kleine-unternehmen','sr/wissen/fahrzeugbrief-fahrzeugschein-coc-hu'])
 assert.ok(sitemap.includes(legacy),'Existing indexable SEO article lost: '+legacy);
console.log('PASS all six new sitemap URLs; existing SEO kept');
