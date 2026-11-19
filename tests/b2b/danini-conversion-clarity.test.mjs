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
 assert.match(business,/keine Vermittlungs- oder Abschlussgarantie/);
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
