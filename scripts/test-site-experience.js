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
    for(const route of ['/', '/sr/pregled-auta','/sr/uvoz-auta','/sr/dovoz-auta','/sr/kalkulator','/sr/upit','/sr/vodici','/sr/kako-radimo','/de/fahrzeugpruefung','/de/rechner','/de/anfrage','/sr/vodic/vin-dokumente-checkliste','/de/wissen/vin-dokumente-checkliste','/sr/?quote=unknown']){
      const response=await fetch(base+route),html=await response.text();
      assert.equal(response.status,200,route);
      assert.match(html,/<title>[^<]+<\/title>/,route);
      if(route==='/'){
        assert.match(html,/href="\/sr\/upit"/);
        assert.match(html,/pregled-polovnog-automobila\.webp/);
        assert.doesNotMatch(html,/id="quickcheck"/);
      }
      if(route==='/sr/upit')assert.match(html,/id="service-form"/);
      if(route==='/sr/kalkulator')assert.match(html,/id="quickcheck"/);
      if(route.includes('?quote='))assert.match(html,/id="quote-checkout"/);
      if(route==='/de/wissen/vin-dokumente-checkliste')assert.match(html,/VIN vor Anreise/);
    }
    for(const route of Object.keys(routes))assert.ok(ROUTES[route],route);
    const map=await (await fetch(base+'/sitemap.xml')).text();
    assert.match(map,/\/sr\/upit/);
    const image=await fetch(base+'/pregled-polovnog-automobila.webp');assert.equal(image.status,200);assert.match(image.headers.get('content-type'),/image\/webp/);
    console.log('DANINI public pages, quote links and image: OK');
  }finally{server.close()}
}
main().catch(error=>{console.error(error);process.exitCode=1});
