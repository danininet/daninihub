'use strict';

const assert = require('node:assert/strict');
const express = require('express');
const { mountPublicRuntime, ROUTES } = require('../server-public-runtime');
const { routes } = require('../site-experience');

async function main() {
  const app = express();
  mountPublicRuntime(app);
  const server = app.listen(0);
  try {
    const base = 'http://127.0.0.1:' + server.address().port;
    const request = async route => {
      const response = await fetch(base + route);
      const html = await response.text();
      assert.equal(response.status, 200, route);
      assert.match(html, /<title>[^<]+<\/title>/, route);
      return { response, html };
    };
    const routesToCheck = [
      '/', '/sr/', '/de/',
      '/sr/kupovina-i-uvoz', '/de/kauf-und-import',
      '/sr/uporedi-oglase', '/de/inserate-vergleichen',
      '/sr/pregled-auta', '/de/fahrzeugpruefung',
      '/sr/uvoz-auta', '/de/autoimport',
      '/sr/dovoz-auta', '/de/ueberfuehrung',
      '/sr/kalkulator', '/de/rechner',
      '/sr/upit', '/de/anfrage',
      '/sr/vodici', '/sr/kako-radimo',
      '/sr/vodic/safebuy-vor-kaution', '/de/wissen/safebuy-vor-kaution',
      '/sr/vodic/transport-entscheidung', '/de/wissen/transport-entscheidung',
      '/sr/vodic/vin-dokumente-checkliste',
      '/sr/vodic/landed-cost-kalkulation',
      '/sr/sistem', '/de/system',
      '/de/wissen/vin-dokumente-checkliste',
      '/sr/auto-biznis-vodic-i-softver', '/de/auto-business-guide-software',
      '/sr/?quote=unknown'
    ];
    for (const route of routesToCheck) {
      const { html, response } = await request(route);
      assert.match(html, /danini-sales\.js/, route);
      assert.doesNotMatch(html, /Sistem i agenti<\/a>|System & Agents<\/a>/, route);
      assert.doesNotMatch(html,/AI_Influenserka|AI Influencerka|[gG]enerated.person/,route);
      assert.match(html,/danini-live-bar/,route);
      assert.doesNotMatch(html,/Cilj odgovora na WhatsApp: 2[–-]4|Antwortziel per WhatsApp: 2[–-]4/,route);
      if (route === '/' || route === '/sr/' || route === '/de/') {
      // The three founder shots are square; service-card car photos remain widescreen.
      assert.match(html,/\.hero-visual\.danini-portrait img\{width:100%;height:auto;aspect-ratio:1\/1/);
      assert.match(html,/\.danini-trust-photo img\{display:block;width:100%;height:auto;aspect-ratio:1\/1/);
      assert.match(html,/\.feature img\{height:auto;aspect-ratio:16\/9/);
      assert.match(html,/\.feature img\{height:auto;aspect-ratio:16\/9/);
        assert.match(html, /danini-order-slot/, route);
        assert.match(html, /danini-order-home/, route);
        assert.match(html, /<strong>AutoDanini<\/strong>/,route);
        assert.match(html,/href="\/(sr\/upit|de\/anfrage)"/,route);
        assert.match(html,/decision-proof/,route);
        assert.equal((html.match(/rel="canonical"/g)||[]).length,1,'canonical exactly once: '+route);
        assert.match(html, /DANINI_Dragan_Portret_CLEAN_1200x1200\.jpg/, route);
        assert.match(html, /Jasna ponuda za stvaran automobil|Klares Angebot für ein konkretes Fahrzeug/, route);
        for(const image of ['DANINI_Kartica_01_Salon_Auto_Bez_Osobe.jpg','DANINI_Kartica_02_Uvoz_Dokumentacija_EUR1.jpg','DANINI_Kartica_03_Dovoz_Transport_Srbija.jpg'])assert.ok(html.includes(image),image);
        assert.match(html, /B2B/, route);
        assert.doesNotMatch(html, /Sve 9 opcija|Alle 9 Leistungen/, route);
        assert.match(html, /danini-order\.js/, route);
        assert.doesNotMatch(html, /id="quickcheck"/, route);
      }
      if (route.includes('auto-biznis-vodic-i-softver') || route.includes('auto-business-guide-software')) {
        assert.doesNotMatch(html,/data-sku="software"/);
        assert.match(html,/49,00 €/);
        assert.match(html,/993 m²/);
        assert.match(html,/PayPal/);
        assert.match(html,/danini-order\.js/);
        assert.match(html,/danini-digital-checkout\.js/);
        assert.match(html,/name="instantDeliveryConsent"/);
        assert.doesNotMatch(html,/paypal\.me\/dragangaganet\/149EUR/);
      }
      if (route === '/sr/') {
        assert.match(html, /Dragan Zdravković · Vaš čovek na terenu u Nemačkoj/);
        assert.match(html, /Duisburg \(Severna Rajna-Vestfalija\) & Niš/);
        assert.match(html, /Šta ako nemački prodavac odbije razgovor ili pregled\?/);
        assert.match(html, /Šta zapravo dobijam kao rezultat provere\?/);
        assert.match(html, /Kako plaćam uslugu\?/);
      }
      if (route === '/de/') {
        assert.match(html, /Ihr Ansprechpartner vor Ort/);
        assert.match(html, /Häufige Fragen/);
      }
      if (['/sr/pregled-auta','/sr/uvoz-auta','/sr/dovoz-auta',
           '/de/fahrzeugpruefung','/de/autoimport','/de/ueberfuehrung'].includes(route)) {
        assert.match(html, /danini-order-slot/, route);
        assert.match(html, /danini-order-service/, route);
        assert.match(html, /danini-order\.js/, route);
      }
      if (route === '/sr/pregled-auta') {
        assert.match(html, /DANINI_Dragan_Pregled_Auta_CLEAN_1200x1200\.jpg/);
        assert.doesNotMatch(html, /danini-auto-uvoz\.webp/);
      }
      if (route === '/sr/uporedi-oglase') {
        assert.match(html, /id="buyer-plan"/);
        assert.match(html, /buyer-plan-client/);
      }
      if (route === '/sr/upit' || route === '/de/anfrage') {
        assert.match(html, /danini-order-slot/);
        assert.match(html, /danini-order-request/);
        assert.doesNotMatch(html, /id="service-form"/);
      }
      if (route === '/sr/kalkulator' || route === '/de/rechner') {
        assert.match(html, /id="quickcheck"/);
        assert.match(html, /danini-quickcheck\.js/);
      }
      if (route.includes('?quote=')) {
        assert.match(html, /id="quote-checkout"/);
        assert.match(html, /AutoDanini — proverite automobil i trošak pre kupovine/);
      }
      if (route.includes('safebuy-vor-kaution')) {
        assert.match(html, /AutoDanini — preverite|Pre kapare: kako proveriti|Vor der Anzahlung: Gebrauchtwagen/);
        assert.match(html, /www\.adac\.de\/rund-ums-fahrzeug/);
        assert.match(html, /AUTODANINI/);
        assert.match(html, /Vorsicht|dokumenta|Dokumente/i);
      }
      if (route.includes('transport-entscheidung')) {
        assert.match(html, /Duisburg/);
        assert.match(html, /Niš/);
        assert.match(html, /Transport|dovoz/);
      }
      if (route === '/sr/vodic/landed-cost-kalkulation') {
        assert.match(html, /Uvoz auta iz Nemačke u Srbiju 2026/);
        assert.match(html, /Uprava carina/);
        assert.match(html, /ABS · kontrolisanje vozila/);
        assert.match(html, /href="\/sr\/kalkulator"/);
      }
      if (route === '/sr/sistem' || route === '/de/system') {
        assert.equal(response.headers.get('x-robots-tag'), 'noindex,nofollow');
      }
      if (route === '/de/wissen/vin-dokumente-checkliste') {
        assert.match(html, /VIN vor Anreise/);
      }
    }
    for (const route of Object.keys(routes)) assert.ok(ROUTES[route], route);
    for (const asset of ['/danini-sales.js','/danini-order.js',
      '/danini-quickcheck.js','/danini-mobile-nav.js', '/danini-digital-checkout.js']) {
      const response = await fetch(base + asset);
      assert.equal(response.status, 200, asset);
      assert.match(response.headers.get('content-type'), /javascript/, asset);
    }
    const float = await (await fetch(base+'/danini-sales.js')).text();
    assert.match(float, /#25d366/);
    assert.match(float, /Pošalji oglas \/ WhatsApp/);
    assert.match(float, /encodeURIComponent/);
    const order = await (await fetch(base+'/danini-order.js')).text();
    assert.match(order, /danini-order-slot/);
    assert.doesNotMatch(order, /paypal\.me|payment\.hidden|danini-order-pay/);
    assert.match(order, /danini-order-consent-check/);
    assert.match(order, /mailto:/);
    assert.match(order, /wa\.me/);
    assert.match(order, /Kaufbudget in €|Budžet za kupovinu vozila/);
    assert.match(order, /Poruka se šalje tek kada je potvrdite/);
    assert.match(order, /AUTODANINI · ZAHTEV ZA KONKRETNU PONUDU/);
    const calc = await (await fetch(base+'/danini-quickcheck.js')).text();
    assert.match(calc, /0\.125/);
    assert.match(calc, /0\.20/);
    assert.match(calc, /Moguća dodatna ukupna obaveza/);
    assert.match(calc, /Pošalji ovu računicu i oglas za konkretnu ponudu/);
    assert.doesNotMatch(calc,/paypal\.me|danini-calc-pay|paymentUnlocked/);

    for(const name of [
      'DANINI_Dragan_Portret_CLEAN_1200x1200.jpg',
      'DANINI_Dragan_Telefon_CLEAN_1200x1200.jpg',
      'DANINI_Kartica_01_Salon_Auto_Bez_Osobe.jpg',
      'DANINI_Kartica_02_Uvoz_Dokumentacija_EUR1.jpg',
      'DANINI_Kartica_03_Dovoz_Transport_Srbija.jpg',
      'DANINI_Dragan_Pregled_Auta_CLEAN_1200x1200.jpg'
    ]){
      const response=await fetch(base+'/images/'+name);
      assert.equal(response.status,200,name);
      assert.match(response.headers.get('content-type'),/image\/jpeg/,name);
    }
    assert.match(calc,/form\.addEventListener\('input', refresh\)/);
    assert.match(calc,/danini-calc-risk-alert/);
    assert.match(calc,/pre bilo kakve uplate/);
    assert.match(order,/danini-order-online-submit/);
    assert.match(order,/lead-readiness/);
    assert.match(order,/Oglas prepoznat/);
    const sitemap = await (await fetch(base+'/sitemap.xml')).text();
    assert.match(sitemap, /\/sr\/upit/);
    assert.match(sitemap, /xmlns:xhtml=/);
    assert.match(sitemap, /xhtml:link/);
    assert.doesNotMatch(sitemap, /moj-dosije|mein-dossier|opportunity-map|\/sr\/sistem|\/de\/system/);

    for (const img of ['/danini-auto-uvoz.webp','/danini-pregled-auta.webp']) {
      const response = await fetch(base+img);
      assert.equal(response.status, 200, img);
      assert.match(response.headers.get('content-type'), /image\/webp/);
    }
    for (const [route] of Object.entries(ROUTES)) {
      if (route.endsWith('/moj-dosije') || route.endsWith('/mein-dossier') ||
          route.endsWith('/sistem') || route.endsWith('/system')) continue;
      const { response, html } = await request(route);
      assert.ok(html.includes('rel="canonical" href="https://daninihub.com'+route+'"'),route);
      assert.match(html, /hreflang="sr"/, route);
      assert.match(html, /hreflang="de"/, route);
      assert.match(response.headers.get('cache-control'), /s-maxage=300/, route);
    }
    const dossier = await fetch(base+'/sr/moj-dosije');
    assert.equal(dossier.headers.get('cache-control'), 'no-store');
    assert.equal(dossier.headers.get('x-robots-tag'), 'noindex,nofollow');
    const retired = await fetch(base+'/sr/opportunity-map');
    assert.equal(retired.status, 410);
    assert.equal(retired.headers.get('x-robots-tag'), 'noindex,follow');
    console.log('DANINI public sales pages, assets, canonical SEO and internal-page privacy: OK');
  } finally {
    server.close();
  }
}
main().catch(error => {console.error(error); process.exitCode = 1;});
