'use strict';
const assert=require('node:assert/strict');
const express=require('express');
const {mountPublicRuntime,ROUTES}=require('../server-public-runtime');
const {routes}=require('../site-experience');
async function main(){
  const app=express();mountPublicRuntime(app);
  const server=app.listen(0);
  try{
    const base='http://127.0.0.1:'+server.address().port;
    for(const route of ['/sr/kupovina-i-uvoz','/de/kauf-und-import','/sr/uporedi-oglase','/de/inserate-vergleichen','/', '/sr/pregled-auta','/sr/uvoz-auta','/sr/dovoz-auta','/sr/kalkulator','/sr/upit','/sr/vodici','/sr/kako-radimo','/de/fahrzeugpruefung','/de/rechner','/de/anfrage','/sr/vodic/vin-dokumente-checkliste','/sr/vodic/landed-cost-kalkulation','/sr/sistem','/de/system','/de/wissen/vin-dokumente-checkliste','/sr/?quote=unknown']){
      const response=await fetch(base+route),html=await response.text();
      assert.equal(response.status,200,route);
      assert.match(html,/<title>[^<]+<\/title>/,route);
      if(route==='/'){
        assert.match(html,/href="\/sr\/upit"/);
        assert.match(html,/danini-auto-uvoz\.webp/);
        assert.match(html,/IMPORT PASSPORT/);
        assert.match(html,/9,90 €/);
        assert.match(html,/od 79 €/);
        assert.doesNotMatch(html,/id="quickcheck"/);
      }
      if(route==='/sr/pregled-auta'){assert.match(html,/danini-pregled-auta\.webp/);assert.doesNotMatch(html,/danini-auto-uvoz\.webp/)}
      if(route==='/sr/uporedi-oglase'){assert.match(html,/id="buyer-plan"/);assert.match(html,/buyer-plan-client/)}
      if(route==='/sr/upit')assert.match(html,/id="service-form"/);
      if(route==='/sr/kalkulator'){assert.match(html,/\/api\/importos\/event/);assert.match(html,/calculator_completed/);assert.match(html,/passport_checkout_started/);assert.match(html,/id="quickcheck"/);assert.match(html,/Otključaj puni Import Passport/);assert.match(html,/Prihvatam/);assert.match(html,/termsAccepted:true/);assert.match(html,/\/api\/importos\/checkout/);assert.match(html,/\/api\/importos\/checkout\/paypal/);}
      if(route.includes('?quote=')){
        assert.match(html,/id="quote-checkout"/);
        assert.match(html,/Kupovina auta iz Nemačke uz jasnu računicu/);
        assert.doesNotMatch(html,/Proveri auto pre nego što pošalješ novac/);
      }
      if(route==='/sr/vodic/landed-cost-kalkulation'){assert.match(html,/Uvoz auta iz Nemačke u Srbiju 2026/);assert.match(html,/Uprava carina/);assert.match(html,/ABS · kontrolisanje vozila/);assert.match(html,/href="\/sr\/kalkulator"/);}
      if(route==='/sr/sistem'){assert.match(html,/DANINI Agent Control Center/);assert.match(html,/ORCHESTRATOR/);assert.match(html,/REVENUE AGENT/);assert.match(html,/FUNNEL AGENT/);}
      if(route==='/de/wissen/vin-dokumente-checkliste')assert.match(html,/VIN vor Anreise/);
    }
    for(const route of Object.keys(routes))assert.ok(ROUTES[route],route);
    const map=await (await fetch(base+'/sitemap.xml')).text();
    assert.match(map,/\/sr\/upit/);
    for(const path of ['/danini-auto-uvoz.webp','/danini-pregled-auta.webp']){const image=await fetch(base+path);assert.equal(image.status,200);assert.match(image.headers.get('content-type'),/image\/webp/)}
    for(const [route,meta] of Object.entries(ROUTES)){
      if(route.endsWith('/moj-dosije')||route.endsWith('/mein-dossier'))continue;
      const response=await fetch(base+route),page=await response.text();
      assert.equal(response.status,200,route);
      assert.ok(page.includes('rel="canonical" href="https://daninihub.com'+route+'"'),route);
      assert.match(page,/hreflang="sr"/);assert.match(page,/hreflang="de"/);
      assert.match(response.headers.get('cache-control'),/s-maxage=300/);
    }
    const quoteResponse=await fetch(base+'/sr/?quote=unknown');assert.equal(quoteResponse.headers.get('cache-control'),'no-store');
    const dossier=await fetch(base+'/sr/moj-dosije');assert.equal(dossier.headers.get('cache-control'),'no-store');assert.equal(dossier.headers.get('x-robots-tag'),'noindex,nofollow');
    const retired=await fetch(base+'/sr/opportunity-map');assert.equal(retired.status,410);assert.equal(retired.headers.get('x-robots-tag'),'noindex,follow');
    assert.match(map,/xmlns:xhtml=/);assert.match(map,/xhtml:link/);assert.doesNotMatch(map,/moj-dosije|mein-dossier|opportunity-map/);
    console.log('DANINI public pages, quote links and image: OK');
  }finally{server.close()}
}
main().catch(error=>{console.error(error);process.exitCode=1});
