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

 assert.ok(home.includes(lang==='de'?'Module 01–03 sind kostenlos verfügbar':'Moduli 01–03 su besplatni i dostupni'),'Homepage incorrectly advertises only one free lesson '+lang);
 assert.ok(home.includes(lang==='de'?'Module 04–06 sind in Vorbereitung':'Moduli 04–06 su u pripremi'),'Homepage planning status missing '+lang);
 assert.ok(hub.includes('/'+lang+'/akademija/'),'knowledge hub backlink missing '+lang);
 assert.ok(academy.includes('DANINI')&&academy.includes('AutoDanini'),'education examples missing '+lang);
 assert.ok(academy.includes('data-education-print'),'printable worksheet missing '+lang);
 assert.equal((academy.match(/class="ed-prompt"/g)||[]).length,3,'expected three AI prompts '+lang);
 assert.equal((academy.match(/<textarea[^>]*maxlength=/g)||[]).length,5,'expected five worksheet fields '+lang);
 assert.equal((academy.match(/class="ed-module ed-live"/g)||[]).length,3,'three free modules live '+lang);
 assert.equal((academy.match(/class="ed-module ed-pending"/g)||[]).length,3,'three modules remain planned '+lang);
 assert.ok(!/garantovana zarada|guaranteed income|garantiertes Einkommen/i.test(academy),'income promise forbidden '+lang);
 assert.ok(academy.includes('/'+lang+'/business/')&&academy.includes('/'+lang+'/wissen/checkliste/'),'cases not linked '+lang);
 assert.ok(home.includes('/'+lang+'/auto-check/')&&home.includes('/'+lang+'/business/'),'existing services inaccessible '+lang);
 const module02=page(lang+'/akademija/modul-02/index.html');
 const module03=page(lang+'/akademija/modul-03/index.html');
 assert.ok(module03.includes('https://daninihub.com/'+lang+'/akademija/modul-03/'),'Module 03 canonical '+lang);
 assert.ok(module03.includes('data-lesson-print'),'Module 03 print '+lang);
 assert.ok(module03.includes('DANINI Business')&&module03.includes('AutoDanini'),'Module 03 examples '+lang);
 assert.ok(academy.includes('/'+lang+'/akademija/modul-03/'),'Module 03 link '+lang);
 for(const file of ['danini-modul03-ponuda-angebot.csv','danini-modul03-offer-worksheet-de-sr.md']){assert.ok(fs.statSync(path.join(root,'downloads/akademija',file)).size>100,'missing Module 03 download '+file);assert.ok(module03.includes('/downloads/akademija/'+file),'Module 03 download link '+file);}
 assert.ok(module02.includes('https://daninihub.com/'+lang+'/akademija/modul-02/'),'Module 02 canonical '+lang);
 assert.ok(!module02.includes('noindex,follow'),'Module 02 must be indexable '+lang);
 assert.ok(academy.includes('/'+lang+'/akademija/modul-02/'),'Module 02 navigation missing '+lang);
 assert.ok(module02.includes('data-lesson-print'),'Module 02 print action missing '+lang);
 for(const asset of ['danini-starter-kit-recherche.csv','danini-starter-kit-offer-de-sr.md','danini-starter-kit-checklist-de-sr.md']){
   assert.ok(academy.includes('/downloads/akademija/'+asset),'Starter kit download link missing '+asset);
   assert.ok(fs.statSync(path.join(root,'downloads/akademija',asset)).size>100,'Starter Kit download missing in built assets '+asset);
 }
 const canonical='https://daninihub.com/'+lang+'/akademija/';
 assert.ok(academy.includes(canonical),'academy SEO canonical missing '+lang);
 console.log('PASS DANINI academy',lang,'landing, three lessons, three planned, Starter Kit, prompts, worksheet, business cases');
}
const sitemap=page('sitemap.xml');
for(const lang of ['de','sr']){
 assert.ok(sitemap.includes('https://daninihub.com/'+lang+'/akademija/'),'missing sitemap '+lang);
 assert.ok(sitemap.includes('https://daninihub.com/'+lang+'/akademija/modul-02/'),'missing Module 02 sitemap '+lang);
 assert.ok(sitemap.includes('https://daninihub.com/'+lang+'/akademija/modul-03/'),'missing Module 03 sitemap '+lang);
}
console.log('PASS DANINI academy sitemap / de sr');


/* Visual regression guard: Academy 3-step diagrams, light knowledge sections,
   and measurable AA contrast. No brittle screenshot-only assertion. */
const academySource=fs.readFileSync(path.join(__dirname,'../src/pages/[locale]/akademija/index.astro'),'utf8');
const lesson03Source=fs.readFileSync(path.join(__dirname,'../src/layouts/AcademyModule03Layout.astro'),'utf8');
const knowledgeSource=fs.readFileSync(path.join(__dirname,'../src/pages/[locale]/wissen/index.astro'),'utf8');
assert.match(academySource,/class="ed-map-grid"/,'three-step graphic missing');
assert.match(academySource,/class="ed-map-caption"/,'infographic disclosure missing');
assert.match(academySource,/ed-map-grid li/,'infographic styling missing');
assert.match(lesson03Source,/class="academyl-flow"/,'Module 03 graphic missing');
assert.match(knowledgeSource,/section white kh-section-light/g,'knowledge light section styling missing');
assert.equal((knowledgeSource.match(/section white kh-section-light/g)||[]).length,2,'both knowledge light panels required');
assert.match(knowledgeSource,/\.section\.white\.kh-section-light\{background:#f4f8fb/,'knowledge background override missing');
function contrastRatio(fg,bg){
 const lum=h=>{const rgb=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
 return rgb.map((x,i)=>(x<=.04045?x/12.92:((x+.055)/1.055)**2.4)*[.2126,.7152,.0722][i]).reduce((a,b)=>a+b,0);};
 const a=lum(fg),b=lum(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}
for(const [fg,bg,label] of [
 ['#102d41','#f4f8fb','knowledge headings'],
 ['#365468','#f4f8fb','knowledge descriptions'],
 ['#75520b','#f4f8fb','gold kicker on light background'],
 ['#f5f9fb','#102c41','Academy method text'],
 ['#e2edf3','#102c41','Academy method supporting text'],
 ['#173e50','#ffffff','Module 03 diagram titles']
])assert.ok(contrastRatio(fg,bg)>=4.5,label+' WCAG AA failed: '+contrastRatio(fg,bg).toFixed(2));
console.log('PASS visual source and WCAG contrast baseline for Academy + Wissen');
