import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const business=readFileSync('src/components/BusinessLanding.astro','utf8');
const form=readFileSync('src/components/BusinessContact.astro','utf8');
const home=readFileSync('src/components/Home.astro','utf8');
const header=readFileSync('src/components/Header.astro','utf8');
test('B2B guide links use the published Serbian evergreen slugs',()=>{
 for(const path of ['upravljanje-upitima-malih-firmi','ai-priprema-poslovne-ponude','gdpr-ai-obrada-upita-klijenata'])assert.ok(business.includes('/sr/wissen/'+path+'/'));
});
test('two-direction commercial offer is scoped honestly',()=>{
 assert.match(business,/Unternehmen in Deutschland/);
 assert.match(business,/oba smera/);
 assert.match(business,/Keine Vermittlungs- oder Abschlussgarantie/);
 assert.match(form,/DACH–Balkan poslovno povezivanje/);
});
test('forms explain their next step and not a payment',()=>{
 assert.match(form,/Slanje nije narudžbina niti pokretanje naplate/);
 assert.match(form,/Unverbindliche Anfrage absenden/);
 assert.match(home,/Sam unos linka ne pokreće naplatu/);
 assert.match(home,/Zatraži ponudu za konkretnu proveru/);
});
test('approved brand artwork remains used, not favicon substitute',()=>{
 assert.match(header,/src={daniniBrandLogo}/);
 assert.doesNotMatch(header,/danini-favicon\.svg/);
});

test('knowledge hub links directly to canonical calculator and keeps AutoDanini enquiry path',()=>{
 const knowledge=readFileSync('src/pages/[locale]/wissen/index.astro','utf8');
 assert.match(knowledge, /href="\/auto\/import\/"/);
 assert.doesNotMatch(knowledge, /href="\/import\.html"/);
 assert.match(knowledge, /root\+"auto-check\/"/);
});

test('social share previews carry the existing brand image and canonical URLs',()=>{
 const layout=readFileSync('src/layouts/Base.astro','utf8');
 const brand=readFileSync('src/components/DaniniLanding.astro','utf8');
 const advisor=readFileSync('src/pages/[locale]/ai-savetnik.astro','utf8');
 for(const page of [home,brand,advisor]) assert.match(page,/ogImage="\/images\/DANINI_Kartica_01_Salon_Auto_Bez_Osobe\.jpg"/);
 assert.match(layout,/property="og:image"/);
 assert.match(layout,/rel="canonical"/);
 assert.match(layout,/hreflang="x-default"/);
});
test('AI interaction disclosure is visible before user input and existing transparency is linked',()=>{
 const advisor=readFileSync('src/pages/[locale]/ai-savetnik.astro','utf8');
 const footer=readFileSync('src/components/Footer.astro','utf8');
 assert.match(advisor,/advisor-ai-disclosure/);
 assert.match(advisor,/KI-gestützte Vorprüfung/);
 assert.match(advisor,/AI-podržana predprovera/);
 assert.ok(advisor.indexOf('advisor-ai-disclosure')<advisor.indexOf('advisor-grid'),'disclosure must precede user input');
 assert.match(footer,/ai-transparenz/);
});

test('AI status labels accurately identify screenshot, licensed listing and copied text',()=>{
 const client=readFileSync('public/danini-advisor-client.js','utf8');
 assert.match(client,/data\.sourceType==='user_supplied_screenshot'/);
 assert.match(client,/AI analiza podataka sa dostavljenog screenshota/);
 assert.match(client,/KI-Auswertung der Angaben aus dem hochgeladenen Screenshot/);
 assert.match(client,/data\.sourceType==='authorized_listing'/);
 assert.match(client,/AI analiza dozvoljeno preuzetih podataka oglasa/);
 assert.match(client,/AI analiza kopiranog teksta oglasa/);
 assert.match(client,/if\(data\.aiModel\)line\(/);
 assert.match(client,/if\(data\.aiUsed===true\)/);
 assert.match(client,/Nur regelbasierte Vorprüfung; keine KI-Analyse ausgeführt/);
});
