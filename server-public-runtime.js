'use strict';

const express=require('express');
const fs=require('fs');
const path=require('path');

const FRONT=path.join(__dirname,'daninihub-front','dist');
const PUBLIC_ASSETS=path.join(__dirname,'daninihub-front','public');
const INDEX=path.join(FRONT,'index.html');

const articles=[
  ['deutschland-selbstimport','Auto selbst aus Deutschland nach Serbien importieren','Kako samostalno uvesti auto iz Nemačke u Srbiju','Eigentum, VIN, Ausfuhr, Ursprung und Gesamtkosten in der richtigen Reihenfolge.','Vlasništvo, VIN, izvoz, poreklo i ukupni trošak pravilnim redosledom.'],
  ['schweiz-import','Fahrzeug aus der Schweiz importieren','Uvoz automobila iz Švajcarske','Exportdeklaration, Ursprung, Kennzeichen und CH-spezifische Kosten.','Izvozna deklaracija, poreklo, tablice i troškovi specifični za Švajcarsku.'],
  ['eur1-herkunft','EUR.1 und Ursprungsrisiko','EUR.1 i rizik porekla','Warum Verkaufsland und präferenzieller Ursprung nicht dasselbe sind.','Zašto zemlja prodaje i preferencijalno poreklo nisu ista stvar.'],
  ['safebuy-vor-kaution','SafeBuy vor Anzahlung','SafeBuy pre kapare','VIN, Verkäufer, Zahlungsweg und Preisabweichung vor Geldtransfer prüfen.','VIN, prodavac, način uplate i odstupanje cene pre slanja novca.'],
  ['oldtimer-30-plus','Oldtimer 30+: was wirklich geprüft wird','Oldtajmer 30+: šta se stvarno proverava','Alter, Originalität, Fahrbereitschaft und Dokumentation.','Starost, originalnost, vozno stanje i dokumentacija.'],
  ['transport-entscheidung','Eigene Achse, Trailer oder Lkw?','Točkovi, prikolica ili kamion?','Transportweg nach Fahrbereitschaft, Zulassung, Distanz, Wert und Stückzahl wählen.','Način dovoza birati prema ispravnosti, tablicama, udaljenosti, vrednosti i broju vozila.']
];

const ROUTES={
  '/de/':{lang:'de',title:'DANINI | Automotive Import Intelligence',description:'Import Passport, SafeBuy, Model DNA, Fahrzeugprüfung, Payment Protection, Originalteile, Überführung und Import Base Čalije für DE/CH → RS.'},
  '/sr/':{lang:'sr',title:'DANINI | Automotive Import Intelligence',description:'Import Passport, SafeBuy, Model DNA, pregled vozila, zaštita plaćanja, originalni delovi, dovoz i Import Base Čalije za DE/CH → RS.'},
  '/de/impressum':{lang:'de',title:'Impressum | DANINI',description:'Anbieterkennzeichnung und Kontakt von DANINI.'},
  '/sr/impressum':{lang:'sr',title:'Impresum | DANINI',description:'Podaci o pružaocu DANINI.'},
  '/de/datenschutz':{lang:'de',title:'Datenschutz | DANINI',description:'Datenschutzhinweise für QuickCheck, Passport, Serviceanfragen und Zahlungsautorisierung.'},
  '/sr/privatnost':{lang:'sr',title:'Privatnost | DANINI',description:'Privatnost za QuickCheck, Passport, servisne upite i autorizaciju plaćanja.'},
  '/de/cookies':{lang:'de',title:'Cookies | DANINI',description:'Technisch notwendige Speicherung bei DANINI.'},
  '/sr/kolacici':{lang:'sr',title:'Kolačići | DANINI',description:'Tehnički neophodna memorija na DANINI sajtu.'},
  '/de/bedingungen':{lang:'de',title:'Nutzungsrahmen | DANINI',description:'Rahmen für Import Passport, Prüfung, Payment Protection, Teile, Überführung und Import Base.'},
  '/sr/uslovi':{lang:'sr',title:'Uslovi | DANINI',description:'Okvir za Import Passport, pregled, rezervaciju plaćanja, delove, dovoz i Import Base.'}
};

for(const [slug,deTitle,srTitle,deDesc,srDesc] of articles){
  ROUTES['/de/wissen/'+slug]={lang:'de',title:deTitle+' | DANINI Wissen',description:deDesc};
  ROUTES['/sr/vodic/'+slug]={lang:'sr',title:srTitle+' | DANINI vodič',description:srDesc};
}

function esc(v){
  return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function shell({lang,title,description,body,scripts=''}) {
  return '<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<title>'+esc(title)+'</title><meta name="description" content="'+esc(description)+'"><meta name="robots" content="index,follow,max-image-preview:large">'+
    '<meta name="theme-color" content="#080b0e"><link rel="icon" href="/favicon.svg">'+
    '<style>'+
    ':root{--bg:#080b0e;--panel:#10171d;--line:#2c3841;--text:#eef3f7;--muted:#9aa7b2;--signal:#ff6d2d}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 70% 0,#1a232b 0,#0a0e12 36%,#070a0d 72%);color:var(--text);font-family:Inter,Arial,sans-serif}a{color:inherit}.head{position:sticky;top:0;z-index:20;background:rgba(8,11,14,.97);border-bottom:1px solid var(--line)}.top{max-width:1240px;margin:auto;padding:13px 18px;display:flex;justify-content:space-between;align-items:center;gap:14px}.brand{display:flex;align-items:center;gap:10px;text-decoration:none}.brand img{width:44px}.brand strong{letter-spacing:.2em}.brand small{display:block;color:#83919c;font-size:9px;letter-spacing:.14em;margin-top:4px}.lang a{padding:7px 10px;border:1px solid var(--line);text-decoration:none;font-size:11px}.nav{max-width:1240px;margin:auto;padding:0 18px 11px;display:flex;gap:7px;overflow:auto}.nav a{flex:0 0 auto;text-decoration:none;border:1px solid var(--line);background:#0f151a;padding:8px 10px;font-size:11px;font-weight:800}.wrap{max-width:1240px;margin:auto;padding:0 18px}.hero{min-height:610px;display:grid;grid-template-columns:1.3fr .7fr;gap:60px;align-items:center;padding:72px 0}.eyebrow{color:var(--signal);font-size:10px;font-weight:900;letter-spacing:.2em}.hero h1{font-size:clamp(48px,7.4vw,98px);line-height:.92;letter-spacing:-.055em;margin:10px 0;text-transform:uppercase}.lead{font-size:19px;line-height:1.7;color:#aab5be;max-width:840px}.btn{display:inline-block;background:var(--signal);color:#080b0e;padding:13px 18px;font-weight:900;text-decoration:none;border:0;border-radius:5px;cursor:pointer}.machine{background:#10171d;border:1px solid #34414b;padding:20px}.machine div{display:flex;justify-content:space-between;padding:15px 0;border-bottom:1px solid #253039}.machine strong{color:#fff}.machine span{color:#82909b;font-size:11px}.section{padding:72px 0;border-top:1px solid #202a32}.section h2{font-size:clamp(34px,5vw,62px);line-height:1;margin:0 0 16px;letter-spacing:-.04em}.muted{color:var(--muted);line-height:1.7}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.card{background:var(--panel);border:1px solid var(--line);padding:20px}.card h3{font-size:24px;margin:4px 0 10px}.card p{color:var(--muted);line-height:1.6}.flow{display:flex;gap:8px;flex-wrap:wrap}.flow span{padding:9px 11px;border:1px solid var(--line);font-size:11px}.form{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;background:#0d1318;border:1px solid var(--line);padding:20px}.form label{display:grid;gap:6px;font-size:11px;font-weight:800}.form input,.form select,.form textarea{width:100%;padding:12px;background:#080d11;color:#fff;border:1px solid #34414b}.wide{grid-column:1/-1}.result{margin-top:16px;background:#10171d;border-left:4px solid var(--signal);padding:20px}.articles{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.articles a{display:block;text-decoration:none;background:#10171d;border:1px solid var(--line);padding:20px;min-height:190px}.articles a b{display:block;font-size:20px;margin:8px 0}.articles a span{color:var(--signal);font-size:10px}.foot{padding:30px 18px;border-top:1px solid var(--line);color:#82909b}.foot .wrap{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}.error{color:#ff9e73}.ok{color:#91d3a9}@media(max-width:900px){.hero{grid-template-columns:1fr;min-height:auto}.grid,.articles{grid-template-columns:1fr 1fr}.form{grid-template-columns:1fr 1fr}}@media(max-width:620px){.hero h1{font-size:46px}.grid,.articles,.form{grid-template-columns:1fr}.wide{grid-column:auto}.top{align-items:flex-start}.brand small{display:none}}'+
    '</style></head><body>'+body+scripts+'</body></html>';
}

function home(lang){
  const sr=lang==='sr';
  const nav=[
    ['passport','Passport'],['inspection',sr?'Pregled':'Inspection'],['parts',sr?'Delovi':'Parts'],['transport','Transport'],
    ['payment-protection','Payment Safe'],['base','Import Base'],['wissen',sr?'Vodiči':'Knowledge'],['service-request','Service Desk']
  ];
  const articleCards=articles.map(a=>{
    const slug=a[0],title=sr?a[2]:a[1],desc=sr?a[4]:a[3],href=sr?'/sr/vodic/'+slug:'/de/wissen/'+slug;
    return '<a href="'+href+'"><span>DANINI KNOWLEDGE</span><b>'+esc(title)+'</b><p>'+esc(desc)+'</p></a>';
  }).join('');

  const body=
  '<header class="head"><div class="top"><a class="brand" href="/'+lang+'/"><img src="/importos-mark.svg" alt="DANINI"><div><strong>DANINI</strong><small>AUTOMOTIVE IMPORT INTELLIGENCE</small></div></a><div class="lang"><a href="/de/">DE</a><a href="/sr/">SR</a></div></div>'+
  '<nav class="nav">'+nav.map(x=>'<a href="#'+x[0]+'">'+x[1]+'</a>').join('')+'</nav></header>'+
  '<main class="wrap">'+
  '<section class="hero"><div><p class="eyebrow">IMPORTOS · DE / CH → RS</p><h1>'+(sr?'Od oglasa do sigurne odluke o uvozu.':'Vom Inserat bis zur sicheren Import-Entscheidung.')+'</h1><p class="lead">'+(sr?'Import Passport, SafeBuy, Model DNA, stvarni pregled vozila, originalni delovi, rezervacija plaćanja, dovoz i Import Base Čalije u jednom sistemu.':'Import Passport, SafeBuy, Model DNA, reale Fahrzeugprüfung, Originalteile, Zahlungsautorisierung, Überführung und Import Base Čalije in einem System.')+'</p><a class="btn" href="#passport">'+(sr?'Pokreni QuickCheck':'QuickCheck starten')+'</a></div>'+
  '<aside class="machine"><p class="eyebrow">DECIDE · VERIFY · EXECUTE</p>'+['SEARCH','VERIFY','IMPORTABILITY','INSPECT','PAYMENT HOLD','EXECUTE'].map((x,i)=>'<div><span>'+String(i+1).padStart(2,'0')+'</span><strong>'+x+'</strong></div>').join('')+'</aside></section>'+
  '<section class="section" id="passport"><p class="eyebrow">IMPORT PASSPORT · FREE QUICKCHECK</p><h2>'+(sr?'Prvo pronađi rizik. Tek onda troši novac.':'Erst das Risiko finden. Dann Geld ausgeben.')+'</h2>'+
  '<form class="form" id="quickcheck"><label>'+(sr?'Zemlja':'Quelle')+'<select name="sourceCountry"><option value="DE">Deutschland</option><option value="CH">Schweiz</option></select></label><label>'+(sr?'Kupovna cena':'Kaufpreis')+'<input name="purchasePrice" type="number" value="10000"></label><label>'+(sr?'Transport do Srbije':'Transport bis Serbien')+'<input name="transportToSerbia" type="number" value="700"></label><label>'+(sr?'Izvoz / tablice':'Export / Kennzeichen')+'<input name="exportCosts" type="number" value="250"></label><label>'+(sr?'Godište':'Baujahr')+'<input name="year" type="number" value="2014"></label><label>Euro<input name="euroClass" type="number" value="5"></label><label>Origin / EUR.1<select name="originProof"><option value="unknown">'+(sr?'Nepoznato':'Unklar')+'</option><option value="verified">'+(sr?'Proveren':'Verifiziert')+'</option><option value="missing">'+(sr?'Nedostaje':'Fehlt')+'</option></select></label><label>'+(sr?'Vrednost u Srbiji':'Marktwert Serbien')+'<input name="serbiaMarketValue" type="number" value="14500"></label><button class="btn wide" type="submit">'+(sr?'Izračunaj QuickCheck':'QuickCheck berechnen')+'</button></form><div id="quick-result"></div></section>'+
  '<section class="section" id="inspection"><p class="eyebrow">FIELD OPS · DUISBURG</p><h2>'+(sr?'Pregled vozila u Nemačkoj':'Fahrzeugprüfung in Deutschland')+'</h2><div class="grid"><article class="card"><h3>FieldCheck Live</h3><p>'+(sr?'Live video, fotografije, vidljivo stanje, dokumenti i strukturisana pitanja prodavcu.':'Live-Video, Fotos, sichtbarer Zustand, Dokumente und strukturierte Verkäuferfragen.')+'</p></article><article class="card"><h3>Pro Mechanic Check</h3><p>'+(sr?'Nezavisni profesionalni pregled mehaničara sa višegodišnjim radnim iskustvom u BRABUS-u, kada je dostupan. Nije BRABUS usluga niti partnerstvo.':'Unabhängige professionelle Prüfung durch einen Mechaniker mit mehrjähriger Berufserfahrung bei BRABUS, soweit verfügbar. Keine BRABUS-Leistung und keine Partnerschaft.')+'</p></article><article class="card"><h3>Model DNA</h3><p>'+(sr?'Dugoročne prednosti, slabosti i poznate tačke provere konkretne generacije.':'Langzeit-Stärken, Schwächen und bekannte Prüfpunkte der konkreten Baureihe.')+'</p></article></div></section>'+
  '<section class="section" id="parts"><p class="eyebrow">ORIGINAL PARTS DESK</p><h2>'+(sr?'Originalni delovi bez nagađanja':'Originalteile beschaffen statt raten')+'</h2><p class="muted">'+(sr?'Originalni/Genuine/OEM delovi po VIN-u ili tačnom broju dela, zavisno od dostupnosti. Slanje paketom/kurirom ili zajedno sa transportom vozila.':'Original-/Genuine-/OEM-Teile nach VIN oder exakter Teilenummer, abhängig von Verfügbarkeit. Versand per Paket/Kurier oder gebündelt mit Fahrzeugtransport.')+'</p></section>'+
  '<section class="section" id="transport"><p class="eyebrow">VEHICLE DELIVERY</p><h2>'+(sr?'Tri načina do odredišta':'Drei Wege zum Ziel')+'</h2><div class="grid"><article class="card"><h3>Drive2Destination</h3><p>'+(sr?'Samo usluga vozača, uz legalne tablice/registraciju, osiguranje i ovlašćenje.':'Nur Fahrerleistung bei legalen Kennzeichen/Zulassung, Versicherung und Vollmacht.')+'</p></article><article class="card"><h3>Trailer</h3><p>'+(sr?'Za neispravna, neregistrovana ili vrednija vozila preko odgovarajućeg partnera.':'Für nicht fahrbereite, nicht zugelassene oder wertvollere Fahrzeuge über passenden Partner.')+'</p></article><article class="card"><h3>Truck / Carrier</h3><p>'+(sr?'Za više vozila i duže relacije, sa jasno odvojenim transportnim troškom.':'Für mehrere Fahrzeuge und längere Strecken mit separat ausgewiesenem Transportpreis.')+'</p></article></div></section>'+
  '<section class="section" id="payment-protection"><p class="eyebrow">PAYMENT PROTECTION</p><h2>'+(sr?'Autorizacija pre usluge. Naplata posle izvršenja.':'Autorisieren vor der Leistung. Einziehen nach Ausführung.')+'</h2><div class="flow"><span>QUOTE</span><span>AUTHORIZE</span><span>HOLD</span><span>SERVICE</span><span>CAPTURE / RELEASE</span></div><p class="muted">'+(sr?'Za potvrđenu uslugu iznos se prvo rezerviše karticom ili PayPal-om. Ako se usluga izvrši, naplaćuje se; ako ne, autorizacija se oslobađa.':'Für bestätigte Leistungen wird der Betrag zunächst per Karte oder PayPal autorisiert. Nach Ausführung wird er eingezogen; fällt die Leistung aus, wird die Autorisierung freigegeben.')+'</p></section>'+
  '<section class="section" id="base"><p class="eyebrow">PHYSICAL NODE · NIŠ</p><h2>Import Base Čalije</h2><p class="muted">'+(sr?'Blok A, Blok B ili deo površine za prodaju, privremeno držanje vozila, pregled kupaca i primopredaju. Kapacitet, prilaz, dozvoljena namena i zakup potvrđuju se pre ugovora.':'Block A, Block B oder Teilfläche für Verkauf, Zwischenabstellung, Besichtigung und Übergabe. Kapazität, Zufahrt, zulässige Nutzung und Miete werden vor Vertrag bestätigt.')+'</p><a class="btn" href="https://calije.daninihub.com/" target="_blank" rel="noreferrer">'+(sr?'Otvori Čalije':'Čalije öffnen')+'</a></section>'+
  '<section class="section" id="wissen"><p class="eyebrow">KNOWLEDGE GARAGE</p><h2>'+(sr?'Vodiči koji rešavaju konkretne probleme':'Ratgeber für konkrete Importprobleme')+'</h2><div class="articles">'+articleCards+'</div></section>'+
  '<section class="section" id="service-request"><p class="eyebrow">SERVICE DESK</p><h2>'+(sr?'Pošalji upit za uslugu':'Service anfragen')+'</h2><form class="form" id="service-form"><label>'+(sr?'Usluga':'Service')+'<select name="serviceType"><option>FIELD_CHECK_LIVE</option><option>PRO_MECHANIC_CHECK</option><option>ORIGINAL_PARTS</option><option>DRIVER_ONLY</option><option>TRAILER_TRANSPORT</option><option>TRUCK_TRANSPORT</option><option>IMPORT_BASE</option></select></label><label>'+(sr?'Ime / firma':'Name / Firma')+'<input name="name" required></label><label>Email<input name="email" type="email" required></label><label>Telefon<input name="phone"></label><label>'+(sr?'Vozilo':'Fahrzeug')+'<input name="vehicle"></label><label>VIN<input name="vin"></label><label>OEM / '+(sr?'broj dela':'Teilenummer')+'<input name="partNumber"></label><label>'+(sr?'Mesto vozila':'Standort')+'<input name="pickupLocation"></label><label>'+(sr?'Odredište':'Ziel')+'<input name="destination"></label><label class="wide">'+(sr?'Detalji':'Details')+'<textarea name="message"></textarea></label><label class="wide"><span><input name="privacyAcknowledged" type="checkbox" required> '+(sr?'Pročitao/la sam obaveštenje o privatnosti.':'Ich habe die Datenschutzhinweise gelesen.')+'</span></label><button class="btn wide" type="submit">'+(sr?'Pošalji upit':'Anfrage senden')+'</button></form><div id="service-result"></div></section>'+
  '</main><footer class="foot"><div class="wrap"><span>DANINI · Automotive Import Intelligence · Duisburg / Niš</span><span><a href="/'+lang+'/'+(sr?'privatnost':'datenschutz')+'">'+(sr?'Privatnost':'Datenschutz')+'</a> · <a href="/'+lang+'/impressum">Impressum</a></span></div></footer>';

  const scripts='<script>'+
  'const q=document.getElementById("quickcheck");if(q)q.addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(q);const body=Object.fromEntries(fd.entries());["purchasePrice","transportToSerbia","exportCosts","year","euroClass","serbiaMarketValue"].forEach(k=>body[k]=Number(body[k]||0));body.currency=body.sourceCountry==="CH"?"CHF":"EUR";body.fxToEur=1;body.registrationDoc=true;body.ownershipDoc=true;body.vinProvided=true;const out=document.getElementById("quick-result");out.innerHTML="<div class=\\"result\\">…</div>";try{const r=await fetch("/api/importos/evaluate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const p=await r.json();if(!r.ok)throw new Error(p.error||"ERROR");const x=p.result;out.innerHTML="<div class=\\"result\\"><b>"+x.decision+"</b><p>'+ (sr?'Troškovni raspon: ':'Kostenkorridor: ') +'"+Math.round(x.corridor.best)+" € – "+Math.round(x.corridor.worst)+" €</p><p>Fraud Shield: "+x.fraud.score+"/100 · Importability: "+x.importability.status+"</p></div>"}catch(err){out.innerHTML="<div class=\\"result error\\">"+err.message+"</div>"}});'+
  'const sf=document.getElementById("service-form");if(sf)sf.addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(sf);const body=Object.fromEntries(fd.entries());body.privacyAcknowledged=fd.get("privacyAcknowledged")==="on";body.language="'+lang+'";const out=document.getElementById("service-result");out.innerHTML="<div class=\\"result\\">…</div>";try{const r=await fetch("/api/importos/service-request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const p=await r.json();if(!r.ok)throw new Error(p.error||"ERROR");out.innerHTML="<div class=\\"result ok\\">'+(sr?'Upit je sačuvan. Referenca: ':'Anfrage gespeichert. Referenz: ')+'<b>"+p.reference+"</b></div>";sf.reset()}catch(err){out.innerHTML="<div class=\\"result error\\">"+err.message+"</div>"}});'+
  '</script>';

  return shell({lang,title:'DANINI | Automotive Import Intelligence',description:ROUTES['/'+lang+'/'].description,body,scripts});
}

function legalPage(route){
  const meta=ROUTES[route];
  if(!meta)return null;
  const sr=meta.lang==='sr';
  const title=route.includes('impressum')?(sr?'Impresum':'Impressum')
    :route.includes('datenschutz')||route.includes('privatnost')?(sr?'Privatnost':'Datenschutz')
    :route.includes('cookies')||route.includes('kolacici')?(sr?'Kolačići':'Cookies')
    :(sr?'Uslovi':'Nutzungsrahmen');
  const body='<header class="head"><div class="top"><a class="brand" href="/'+meta.lang+'/"><img src="/importos-mark.svg" alt="DANINI"><div><strong>DANINI</strong><small>AUTOMOTIVE IMPORT INTELLIGENCE</small></div></a></div></header><main class="wrap"><section class="section"><p class="eyebrow">LEGAL</p><h2>'+title+'</h2><p class="muted">'+(
    route.includes('impressum')?'Dragan Zdravković · DaniniHub / DANINI · Fischerstraße 54 · 47055 Duisburg · Deutschland · info@daninihub.com · +49 1573 0916621'
    :route.includes('datenschutz')||route.includes('privatnost')?(sr?'Obrađujemo samo podatke potrebne za QuickCheck, servisne upite, ponude i plaćanje. Za prava i pitanja: info@daninihub.com.':'Wir verarbeiten nur Daten, die für QuickCheck, Serviceanfragen, Angebote und Zahlungen erforderlich sind. Kontakt: info@daninihub.com.')
    :route.includes('cookies')||route.includes('kolacici')?(sr?'DANINI trenutno ne koristi reklamne ili marketinške kolačiće.':'DANINI verwendet derzeit keine Werbe- oder Marketing-Cookies.')
    :(sr?'ImportOS je pomoć pri odluci. Terenske, transportne i druge usluge imaju poseban obim, cenu i uslove potvrđene pre narudžbine.':'ImportOS ist eine Entscheidungshilfe. Field-, Transport- und weitere Leistungen haben einen gesondert bestätigten Umfang, Preis und Bedingungen.')
  )+'</p></section></main>';
  return shell({lang:meta.lang,title:meta.title,description:meta.description,body});
}

function knowledgePage(route){
  const meta=ROUTES[route]; if(!meta)return null;
  const slug=route.split('/').filter(Boolean).pop();
  const item=articles.find(a=>a[0]===slug); if(!item)return null;
  const sr=meta.lang==='sr',title=sr?item[2]:item[1],desc=sr?item[4]:item[3];
  const body='<header class="head"><div class="top"><a class="brand" href="/'+meta.lang+'/"><img src="/importos-mark.svg" alt="DANINI"><div><strong>DANINI</strong><small>AUTOMOTIVE IMPORT INTELLIGENCE</small></div></a></div></header><main class="wrap"><section class="section"><p class="eyebrow">KNOWLEDGE GARAGE</p><h2>'+esc(title)+'</h2><p class="lead">'+esc(desc)+'</p><div class="grid"><article class="card"><h3>'+(sr?'Zašto je bitno':'Warum es wichtig ist')+'</h3><p>'+(sr?'Cilj je da se odluka o kupovini donese tek kada su dokumentacija, trošak i rizik dovoljno jasni.':'Die Kaufentscheidung sollte erst fallen, wenn Dokumente, Kosten und Risiko ausreichend klar sind.')+'</p></article><article class="card"><h3>'+(sr?'Pravilo sistema':'Systemregel')+'</h3><p>'+(sr?'Ne računamo optimističan scenario kao siguran dok dokaz nije potvrđen.':'Ein optimistisches Szenario gilt nicht als sicher, solange der Nachweis fehlt.')+'</p></article><article class="card"><h3>'+(sr?'Sledeći korak':'Nächster Schritt')+'</h3><p>'+(sr?'Pokreni QuickCheck ili pošalji servisni upit sa konkretnim vozilom.':'QuickCheck starten oder Serviceanfrage mit konkretem Fahrzeug senden.')+'</p></article></div></section></main>';
  return shell({lang:meta.lang,title:meta.title,description:meta.description,body});
}

function mountPublicRuntime(app){
  // Serve brand assets even if the Vite build is temporarily unavailable.
  if(fs.existsSync(PUBLIC_ASSETS))app.use(express.static(PUBLIC_ASSETS,{index:false,maxAge:'1h'}));
  function sendFrontend(res,fallbackHtml){
    res.set('Cache-Control','no-store, no-cache, must-revalidate');
    if(fs.existsSync(INDEX))return res.sendFile(INDEX);
    return res.type('html').send(fallbackHtml);
  }

  app.get('/',(req,res)=>sendFrontend(res,home('de')));
  app.get('/de',(req,res)=>sendFrontend(res,home('de')));
  app.get('/sr',(req,res)=>sendFrontend(res,home('sr')));
  app.get('/en',(req,res)=>sendFrontend(res,home('de')));

  app.get('/robots.txt',(req,res)=>res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /importos/success\nDisallow: /payment/\nDisallow: /owner/\nSitemap: https://daninihub.com/sitemap.xml\n'));
  app.get('/sitemap.xml',(req,res)=>{
    const urls=Object.keys(ROUTES).map(route=>'<url><loc>https://daninihub.com'+route+'</loc><lastmod>2026-09-21</lastmod></url>').join('');
    res.type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls+'</urlset>');
  });

  app.get('/de/',(req,res)=>sendFrontend(res,home('de')));
  app.get('/sr/',(req,res)=>sendFrontend(res,home('sr')));

  app.get('/owner/importos',(req,res)=>{
    res.set('X-Robots-Tag','noindex,nofollow');
    res.set('Cache-Control','no-store');
    if(fs.existsSync(INDEX))return res.sendFile(INDEX);
    return res.status(503).type('text/plain').send('Owner desk frontend not built');
  });

  app.get(Object.keys(ROUTES).filter(r=>r!=='/de/'&&r!=='/sr/'),(req,res)=>{
    const route=req.path;
    const page=route.includes('/wissen/')||route.includes('/vodic/')?knowledgePage(route):legalPage(route);
    if(!page)return res.status(404).end();
    return sendFrontend(res,page);
  });

  if(fs.existsSync(FRONT))app.use(express.static(FRONT,{index:false,maxAge:'1h'}));
}

module.exports={mountPublicRuntime,ROUTES,home};
