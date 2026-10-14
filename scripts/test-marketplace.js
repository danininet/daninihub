'use strict';
const assert=require('node:assert/strict');
const market=require('../business-marketplace');
const founder=require('../founder-experience');
const experience=require('../site-experience');
const {shell}=require('../server-public-runtime');

const pairs=[['sr','buyer','/sr/trazim-auto'],['de','buyer','/de/fahrzeug-gesucht'],['sr','seller','/sr/ponudi-auto'],['de','seller','/de/fahrzeug-anbieten'],['sr','rental','/sr/placevi-nis'],['de','rental','/de/gewerbeflaechen-nis']];
for(const [lang,kind,route] of pairs){
 const meta=experience.routes[route];
 assert.ok(meta,'Missing route '+route);
 const html=experience.render(lang,meta.key,shell);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,'One H1: '+route);
 assert.ok(html.includes('data-dh-lead='),'Missing actionable lead form: '+route);
 assert.ok(html.includes('https://wa.me/4915730916621'),'Missing real WhatsApp contact: '+route);
 assert.ok(html.includes('info@daninihub.com'),'Missing email contact: '+route);
 assert.ok(html.includes('form.reportValidity()'),'Missing browser validation: '+route);
 assert.ok(html.includes('<meta name="viewport"'),'Responsive viewport: '+route);
 assert.ok(!html.includes('Fictitious bidder'),'No invented marketplace');
 if(kind==='rental'){
  assert.ok(html.includes('345 m²')&&html.includes('648 m²'),'Both Niš plots: '+route);
  assert.ok(html.includes('PLOT_LEASE_INQUIRY'),'Lease requests tagged');
 } else if(kind==='buyer'){
  assert.ok(html.includes('name="budget"')&&html.includes('name="model"'),'Buyer fields');
  assert.ok(html.includes('BUYER_REQUEST'),'Buyer requests tagged');
 } else {
  assert.ok(html.includes('name="price"')&&html.includes('name="listing"'),'Seller fields');
  assert.ok(html.includes('SELLER_OFFER'),'Seller offers tagged');
 }
}
for(const lang of ['sr','de']){
 const home=founder.home(lang);
 assert.ok(home.includes('dragan-original-2026.jpg'),'Owner photo preserved');
 assert.ok(home.includes('founder-gallery'),'Source-linked illustration preserved');
 assert.ok(home.includes(lang==='sr'?'/sr/trazim-auto':'/de/fahrzeug-gesucht'),'Home links to buyer');
 assert.ok(home.includes(lang==='sr'?'/sr/placevi-nis':'/de/gewerbeflaechen-nis'),'Home links to leases');
}
const fs=require('node:fs');
const client=fs.readFileSync(require.resolve('../business-marketplace'),'utf8');
assert.ok(client.includes('encodeURIComponent'),'WhatsApp body must be encoded');
assert.ok(!client.includes('fetch('),'Forms do not silently transmit data to unverified backend');
console.log('PASS: 6 SR/DE automotive matching and Niš leasing routes, direct contact and no fake auction');
