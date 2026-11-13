// Read-only assertions plus rejected-origin negative test; never sends a valid lead.
import assert from 'node:assert/strict';
const origin='https://daninihub.com';
async function load(path,opts={}){const r=await fetch(origin+path,{redirect:'follow',signal:AbortSignal.timeout(20000),...opts});return {status:r.status,body:await r.text(),headers:r.headers,url:r.url};}
for(const [path,language] of [['/','de'],['/de/','de'],['/sr/','sr']]){const r=await load(path);assert.equal(r.status,200);assert.match(r.body,new RegExp('<html[^>]*lang="'+language+'"'));assert.match(r.body,/danini-header/);assert.match(r.body,/business-nav/);assert.match(r.body,/workflow-preview/);assert.match(r.body,/AutoDanini/);assert.match(r.body,/hreflang="de"/);assert.match(r.body,/hreflang="sr"/);assert.equal((r.body.match(/<h1\b/g)||[]).length,1);}
for(const path of ['/de/ueber-danini/','/sr/o-danini/','/de/danini-methode/','/sr/danini-metoda/']){const r=await load(path);assert.equal(r.status,200);assert.match(r.body,/danini-header/);}
const buyers=await load('/buyers.html');assert.equal(buyers.status,200);assert.match(buyers.url,/\/auto\/buyers\/?$/);assert.match(buyers.body,/autodanini-mark.svg/);assert.match(buyers.body,/<nav\b/);
const business=await load('/business.html');assert.equal(business.url,origin+'/de/');assert.match(business.body,/business-nav/);
const contact=await load('/contact.html');assert.equal(contact.status,200);assert.match(contact.body,/dn-service-header/);assert.match(contact.body,/mailto:(?:info|kontakt)@daninihub.com/);
const sitemap=await load('/sitemap.xml');assert.equal(sitemap.status,200);for(const p of ['/','/de/','/sr/','/auto/','/de/danini-methode/','/sr/danini-metoda/'])assert.ok(sitemap.body.includes('<loc>'+origin+p+'</loc>'),p);
const robots=await load('/robots.txt');assert.match(robots.body,/Sitemap:\s*https:\/\/daninihub.com\/sitemap.xml/);
const status=await load('/api/lead/status');assert.equal(status.status,200);const data=JSON.parse(status.body);assert.equal(typeof data.enabled,'boolean');assert.equal(status.headers.get('cache-control'),'no-store');if(data.enabled)assert.ok(data.turnstileSiteKey);
const rejected=await load('/api/lead',{method:'POST',headers:{'content-type':'application/json',Origin:'https://not-danini.invalid'},body:'{}'});assert.ok([403,503].includes(rejected.status));
console.log('PASS current Astro DE/SR master, methods, AutoDanini redirects, SEO and legacy lead origin rejection');
