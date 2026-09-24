'use strict';

const express=require('express');
const path=require('path');

const PUBLIC_ASSETS=path.join(__dirname,'public');

const articles=[
  ['deutschland-selbstimport','Auto selbst aus Deutschland nach Serbien importieren','Kako samostalno uvesti auto iz Nemačke u Srbiju','Eigentum, VIN, Ausfuhr, Ursprung und Gesamtkosten in der richtigen Reihenfolge.','Vlasništvo, VIN, izvoz, poreklo i ukupni trošak pravilnim redosledom.'],
  ['schweiz-import','Fahrzeug aus der Schweiz importieren','Uvoz automobila iz Švajcarske','Exportdeklaration, Ursprung, Kennzeichen und CH-spezifische Kosten.','Izvozna deklaracija, poreklo, tablice i troškovi specifični za Švajcarsku.'],
  ['eur1-herkunft','EUR.1 und Ursprungsrisiko','EUR.1 i rizik porekla','Warum Verkaufsland und präferenzieller Ursprung nicht dasselbe sind.','Zašto zemlja prodaje i preferencijalno poreklo nisu ista stvar.'],
  ['safebuy-vor-kaution','Vor Anzahlung prüfen','Provera pre kapare','VIN, Verkäufer, Zahlungsweg und Preisabweichung vor Geldtransfer prüfen.','VIN, prodavac, način uplate i odstupanje cene pre slanja novca.'],
  ['oldtimer-30-plus','Oldtimer 30+: was wirklich geprüft wird','Oldtajmer 30+: šta se stvarno proverava','Alter, Originalität, Fahrbereitschaft und Dokumentation.','Starost, originalnost, vozno stanje i dokumentacija.'],
  ['transport-entscheidung','Eigene Achse, Trailer oder Lkw?','Na točkovima, prikolica ili kamion?','Transportweg nach Fahrbereitschaft, Zulassung, Distanz, Wert und Stückzahl wählen.','Način dovoza birati prema ispravnosti, tablicama, udaljenosti, vrednosti i broju vozila.'],
  ['landed-cost-kalkulation','Was kostet der Autoimport wirklich?','Koliko stvarno košta uvoz automobila?','Vollständige Kostenrechnung vor dem Kauf.','Potpuna računica pre kupovine: izvoz, dovoz, poreklo, dažbine, tehnički postupak i registracija.'],
  ['vin-dokumente-checkliste','VIN- und Dokumentencheck vor Zahlung','VIN i dokumenti pre uplate','Praktische Checkliste für VIN, Verkäufer, Eigentum und Dokumente.','Praktična lista za VIN, prodavca, vlasništvo i dokumente.']
];

const ROUTES={
  '/de/':{lang:'de',title:'DANINI | Fahrzeugimport Deutschland/Schweiz → Serbien',description:'Kosten prüfen, Fahrzeug besichtigen, Originalteile beschaffen und Überführung nach Serbien organisieren.'},
  '/sr/':{lang:'sr',title:'Uvoz auta iz Nemačke i Švajcarske u Srbiju | DANINI',description:'Pre kupovine proveri troškove, poreklo i rizik. Organizuj pregled auta, originalne delove, dovoz i bazu u Nišu.'},
  '/de/impressum':{lang:'de',title:'Impressum | DANINI',description:'Anbieterkennzeichnung und Kontakt.'},
  '/sr/impressum':{lang:'sr',title:'Impresum | DANINI',description:'Podaci o pružaocu usluge.'},
  '/de/datenschutz':{lang:'de',title:'Datenschutz | DANINI',description:'Datenschutzhinweise.'},
  '/sr/privatnost':{lang:'sr',title:'Privatnost | DANINI',description:'Obaveštenje o privatnosti.'},
  '/de/cookies':{lang:'de',title:'Cookies | DANINI',description:'Cookie-Hinweise.'},
  '/sr/kolacici':{lang:'sr',title:'Kolačići | DANINI',description:'Obaveštenje o kolačićima.'},
  '/de/bedingungen':{lang:'de',title:'Nutzungsrahmen | DANINI',description:'Rahmen für digitale Analysen und Serviceleistungen.'},
  '/sr/uslovi':{lang:'sr',title:'Uslovi | DANINI',description:'Okvir korišćenja digitalnih i terenskih usluga.'}
};

for(const [slug,deTitle,srTitle,deDesc,srDesc] of articles){
  ROUTES['/de/wissen/'+slug]={lang:'de',title:deTitle+' | DANINI',description:deDesc};
  ROUTES['/sr/vodic/'+slug]={lang:'sr',title:srTitle+' | DANINI',description:srDesc};
}

function esc(v){
  return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function shell({lang,title,description,body,scripts=''}) {
  return '<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<title>'+esc(title)+'</title><meta name="description" content="'+esc(description)+'"><meta name="robots" content="index,follow,max-image-preview:large">'+
    '<meta name="theme-color" content="#080b0e"><link rel="icon" href="/favicon.svg">'+
    '<style>'+
    ':root{--bg:#080b0e;--panel:#10171d;--line:#2c3841;--text:#eef3f7;--muted:#a5b0b9;--signal:#ff6d2d;--soft:#151e25}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 70% 0,#1a232b 0,#0a0e12 36%,#070a0d 72%);color:var(--text);font-family:Inter,Arial,sans-serif}a{color:inherit}img{display:block;max-width:100%}.head{position:sticky;top:0;z-index:30;background:rgba(8,11,14,.97);border-bottom:1px solid var(--line);backdrop-filter:blur(12px)}.top{max-width:1240px;margin:auto;padding:13px 18px;display:flex;justify-content:space-between;align-items:center;gap:14px}.brand{display:flex;align-items:center;gap:10px;text-decoration:none}.brand img{width:44px}.brand strong{letter-spacing:.2em;font-size:18px}.brand small{display:block;color:#94a1ab;font-size:10px;letter-spacing:.08em;margin-top:4px}.lang a{padding:7px 10px;border:1px solid var(--line);text-decoration:none;font-size:11px}.nav{max-width:1240px;margin:auto;padding:0 18px 11px;display:flex;gap:7px;overflow:auto;scrollbar-width:none}.nav a{flex:0 0 auto;text-decoration:none;border:1px solid var(--line);background:#0f151a;padding:8px 10px;font-size:12px;font-weight:800}.wrap{max-width:1240px;margin:auto;padding:0 18px}.hero{display:grid;grid-template-columns:1.02fr .98fr;gap:48px;align-items:center;padding:58px 0 54px}.hero h1{font-size:clamp(44px,6.7vw,88px);line-height:.96;letter-spacing:-.055em;margin:10px 0 18px}.eyebrow{color:var(--signal);font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.lead{font-size:20px;line-height:1.68;color:#b5bec6;max-width:800px}.hero-visual{border:1px solid #33404a;border-radius:20px;overflow:hidden;background:#0b1014;box-shadow:0 30px 90px rgba(0,0,0,.3)}.btn{display:inline-block;background:var(--signal);color:#080b0e;padding:14px 19px;font-weight:900;text-decoration:none;border:0;border-radius:6px;cursor:pointer}.btn.secondary{background:#141d24;color:#fff;border:1px solid #3a4751}.hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}.trust{display:flex;gap:8px;flex-wrap:wrap;margin-top:22px}.trust span{border:1px solid #34414a;background:#0f151a;padding:8px 10px;color:#aeb8c0;font-size:12px}.section{padding:68px 0;border-top:1px solid #202a32}.section h2{font-size:clamp(34px,5vw,58px);line-height:1.02;margin:0 0 16px;letter-spacing:-.04em}.section h3{font-size:24px;margin:4px 0 10px}.muted{color:var(--muted);line-height:1.72}.two{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:center}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.card{background:var(--panel);border:1px solid var(--line);padding:20px;border-radius:10px}.card p{color:var(--muted);line-height:1.62}.price{font-size:28px;font-weight:900;color:#fff}.price small{font-size:12px;color:#9ba7b1}.money-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.money-grid .card{min-height:180px}.form{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;background:#0d1318;border:1px solid var(--line);padding:20px;border-radius:10px}.form label{display:grid;gap:6px;font-size:12px;font-weight:800}.form input,.form select,.form textarea{width:100%;padding:12px;background:#080d11;color:#fff;border:1px solid #34414b;border-radius:5px}.wide{grid-column:1/-1}.result{margin-top:16px;background:#10171d;border-left:4px solid var(--signal);padding:20px}.articles{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.articles a{display:block;text-decoration:none;background:#10171d;border:1px solid var(--line);padding:20px;min-height:190px;border-radius:10px}.articles a b{display:block;font-size:20px;margin:8px 0}.articles a span{color:var(--signal);font-size:10px}.steps{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.steps div{background:#10171d;border:1px solid var(--line);padding:16px}.steps span{color:var(--signal);font-size:11px}.steps strong{display:block;margin-top:8px}.visual{border:1px solid #33404a;border-radius:16px;overflow:hidden;background:#0b1014}.foot{padding:30px 18px;border-top:1px solid var(--line);color:#8997a2}.foot .wrap{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}.error{color:#ff9e73}.ok{color:#91d3a9}@media(max-width:950px){.hero,.two{grid-template-columns:1fr}.grid,.articles,.money-grid{grid-template-columns:1fr 1fr}.form{grid-template-columns:1fr 1fr}.steps{grid-template-columns:1fr 1fr 1fr}}@media(max-width:620px){.hero h1{font-size:44px}.grid,.articles,.money-grid,.form,.steps{grid-template-columns:1fr}.wide{grid-column:auto}.top{align-items:flex-start}.brand small{max-width:210px}.hero{padding-top:38px}}'+
    '</style></head><body>'+body+scripts+'</body></html>';
}

function serviceOptions(sr){
  return [
    ['FIELD_CHECK_LIVE',sr?'Obilazak auta uživo':'Live-Fahrzeugcheck'],
    ['PRO_MECHANIC_CHECK',sr?'Profesionalni pregled mehaničara':'Professioneller Mechaniker-Check'],
    ['ORIGINAL_PARTS',sr?'Nabavka originalnih delova':'Originalteile beschaffen'],
    ['DRIVER_ONLY',sr?'Dovoz vožnjom na točkovima':'Überführung auf eigener Achse'],
    ['TRAILER_TRANSPORT',sr?'Prevoz prikolicom':'Trailer-Transport'],
    ['TRUCK_TRANSPORT',sr?'Prevoz kamionom / autotransporterom':'Lkw / Autotransporter'],
    ['IMPORT_BASE',sr?'Zakup auto placa Čalije':'Import-Basis Čalije']
  ].map(([v,l])=>'<option value="'+v+'">'+l+'</option>').join('');
}

function home(lang){
  const sr=lang==='sr';
  const nav=sr
    ? [['passport','Izračunaj uvoz'],['inspection','Pregled auta'],['transport','Dovoz'],['wissen','Vodiči'],['service-request','Zatraži ponudu']]
    : [['passport','Import prüfen'],['inspection','Fahrzeug prüfen'],['parts','Teile'],['transport','Überführung'],['payment-protection','Sicher zahlen'],['base','Import-Basis'],['wissen','Ratgeber'],['service-request','Anfrage']];

  const articleCards=articles.map(a=>{
    const slug=a[0],title=sr?a[2]:a[1],desc=sr?a[4]:a[3],href=sr?'/sr/vodic/'+slug:'/de/wissen/'+slug;
    return '<a href="'+href+'"><span>'+(sr?'PRAKTIČNI VODIČ':'PRAXIS-RATGEBER')+'</span><b>'+esc(title)+'</b><p>'+esc(desc)+'</p></a>';
  }).join('');

  const subtitle=sr?'UVOZ AUTOMOBILA · NEMAČKA I ŠVAJCARSKA → SRBIJA':'FAHRZEUGIMPORT MIT PRÜFUNG UND KOSTENKONTROLLE';
  const body=
  '<header class="head"><div class="top"><a class="brand" href="/'+lang+'/"><img src="/importos-mark.svg" alt="DANINI"><div><strong>DANINI</strong><small>'+subtitle+'</small></div></a><div class="lang"><a href="/sr/">SR</a><a href="/de/">DE</a></div></div><nav class="nav">'+nav.map(x=>'<a href="#'+x[0]+'">'+x[1]+'</a>').join('')+'</nav></header>'+
  '<main class="wrap">'+
  '<section class="hero"><div><p class="eyebrow">'+(sr?'PRE KUPOVINE PROVERI RAČUNICU I AUTO':'ALLES PRÜFEN, BEVOR DU ZAHLST')+'</p><h1>'+(sr?'Kupuješ auto u Nemačkoj? Proveri ga pre nego što platiš.':'Auto aus Deutschland oder der Schweiz? Erst prüfen, dann kaufen.')+'</h1><p class="lead">'+(sr?'Pošalji oglas za auto koji želiš da kupiš. Dobijaš ponudu za pregled na licu mesta, proveru dokumenata i dovoz u Srbiju. Okviran trošak uvoza možeš izračunati besplatno.':'Auf einer Seite siehst du Gesamtkosten, Herkunfts- und Dokumentenrisiko, bekannte Modellschwächen sowie Optionen für Prüfung, Teile und Überführung.')+'</p><div class="hero-actions"><a class="btn" href="#service-request">'+(sr?'Pošalji oglas za pregled':'Konkretes Auto prüfen')+'</a><a class="btn secondary" href="#passport">'+(sr?'Izračunaj trošak uvoza':'Service anfragen')+'</a></div><div class="trust"><span>'+(sr?'Početna računica je besplatna':'Kostenloser Erstcheck')+'</span><span>'+(sr?'Pregled auta od 79 €':'Vollreport 9,90 €')+'</span></div></div><div class="hero-visual"><img src="/pregled-polovnog-automobila.webp" width="1696" height="943" alt="'+(sr?'Pregled polovnog automobila pre kupovine':'Gebrauchtwagenprüfung vor dem Kauf')+'"></div></section>'+

  '<section class="section"><p class="eyebrow">'+(sr?'ŠTA TAČNO DOBIJAŠ':'WAS DU KONKRET BEKOMMST')+'</p><h2>'+(sr?'Od oglasa do auta u Srbiji — bez nagađanja.':'Vom Inserat bis zum Auto in Serbien — ohne Rätselraten.')+'</h2><div class="steps">'+
    (sr
      ? [['01','Proveri cenu i rizik'],['02','Proveri dokumente i poreklo'],['03','Pregledaj auto na licu mesta'],['04','Rezerviši i plati sigurnije'],['05','Organizuj delove i dovoz']]
      : [['01','Kosten & Risiko prüfen'],['02','Dokumente & Ursprung prüfen'],['03','Auto vor Ort prüfen'],['04','Zahlung absichern'],['05','Teile & Überführung organisieren']]
    ).map(x=>'<div><span>'+x[0]+'</span><strong>'+x[1]+'</strong></div>').join('')+'</div></section>'+

  '<section class="section" id="passport"><p class="eyebrow">'+(sr?'BESPLATNA POČETNA PROVERA':'KOSTENLOSER ERSTCHECK')+'</p><h2>'+(sr?'Koliko će te auto približno koštati do Srbije?':'Was kostet das Auto ungefähr bis Serbien?')+'</h2><p class="muted">'+(sr?'Unesi osnovne podatke. Sistem prikazuje troškovni raspon i upozorava šta moraš da proveriš pre uplate.':'Grunddaten eingeben. Das System zeigt einen Kostenkorridor und offene Prüfpunkte vor der Zahlung.')+'</p>'+
  '<form class="form" id="quickcheck"><label>'+(sr?'Odakle kupuješ':'Kaufland')+'<select name="sourceCountry"><option value="DE">Nemačka / Deutschland</option><option value="CH">Švajcarska / Schweiz</option></select></label><label>'+(sr?'Cena auta':'Kaufpreis')+'<input name="purchasePrice" type="number" value="10000"></label><label>'+(sr?'Dovoz do Srbije':'Transport bis Serbien')+'<input name="transportToSerbia" type="number" value="700"></label><label>'+(sr?'Izvozne tablice i papiri':'Export / Kennzeichen')+'<input name="exportCosts" type="number" value="250"></label><label>'+(sr?'Godište':'Baujahr')+'<input name="year" type="number" value="2014"></label><label>Euro<input name="euroClass" type="number" value="5"></label><label>'+(sr?'Dokaz porekla / EUR.1':'Ursprungsnachweis / EUR.1')+'<select name="originProof"><option value="unknown">'+(sr?'Ne znam':'Unklar')+'</option><option value="verified">'+(sr?'Imam proveru':'Verifiziert')+'</option><option value="missing">'+(sr?'Nema dokumenta':'Fehlt')+'</option></select></label><label>'+(sr?'Sličan auto u Srbiji vredi':'Marktwert Serbien')+'<input name="serbiaMarketValue" type="number" value="14500"></label><button class="btn wide" type="submit">'+(sr?'IZRAČUNAJ I UPOZORI ME NA RIZIK':'KOSTEN UND RISIKO PRÜFEN')+'</button></form><div id="quick-result"></div><p class="muted">'+(sr?'Detaljan izveštaj za konkretan auto: 9,90 € kada plaćanje bude omogućeno. Trenutno možeš poslati upit za pregled ili dovoz.':'Vollständiger Report für ein konkretes Fahrzeug: 9,90 € nach Aktivierung des Checkouts.')+'</p></section>'+

  '<section class="section" id="inspection"><div class="two"><div><p class="eyebrow">'+(sr?'PREGLED AUTA U NEMAČKOJ':'FAHRZEUGCHECK IN DEUTSCHLAND')+'</p><h2>'+(sr?'Ne kupuj samo po slikama iz oglasa.':'Nicht nur nach Inserat-Fotos kaufen.')+'</h2><div class="grid" style="grid-template-columns:1fr 1fr"><article class="card"><h3>'+(sr?'Obilazak uživo':'Live-Besichtigung')+'</h3><p>'+(sr?'Live video, fotografije, dokumenti i vidljivo stanje vozila. Polazna tačka Duisburg. Od 79 € u zavisnosti od udaljenosti.':'Live-Video, Fotos, Dokumente und sichtbarer Fahrzeugzustand. Start Duisburg. Ab 79 € je nach Entfernung.')+'</p></article><article class="card"><h3>'+(sr?'Profesionalni pregled':'Mechaniker-Check')+'</h3><p>'+(sr?'Kada je dostupan, stručni mehaničar može detaljnije proveriti auto. Obim pregleda i cena se potvrđuju pre naručivanja.':'Unabhängiger Mechaniker mit mehrjähriger BRABUS-Berufserfahrung, soweit verfügbar. Keine BRABUS-Leistung oder Partnerschaft.')+'</p></article></div></div><div class="visual"><img src="/visual-pregled.svg" alt="'+(sr?'Pregled polovnog automobila pre kupovine':'Gebrauchtwagenprüfung vor dem Kauf')+'"></div></div></section>'+

  '<section class="section" id="parts"><p class="eyebrow">'+(sr?'ORIGINALNI DELOVI':'ORIGINALTEILE')+'</p><h2>'+(sr?'Pošalji VIN ili broj dela — tražimo tačan deo.':'VIN oder Teilenummer senden — wir suchen das passende Teil.')+'</h2><p class="muted">'+(sr?'Pomažemo da nađeš odgovarajući originalni deo prema broju šasije (VIN) ili broju dela. Cena i rok isporuke zavise od dostupnosti.':'Beschaffung von Original/Genuine/OEM-Teilen je nach Verfügbarkeit. Versand per Paket, Kurier oder zusammen mit dem Fahrzeug.')+'</p></section>'+

  '<section class="section" id="transport"><div class="two"><div class="visual"><img src="/visual-logistika.svg" alt="'+(sr?'Dovoz automobila i slanje originalnih delova':'Fahrzeugüberführung und Teileversand')+'"></div><div><p class="eyebrow">'+(sr?'DOVOZ VOZILA':'FAHRZEUGÜBERFÜHRUNG')+'</p><h2>'+(sr?'Vožnja, prikolica ili kamion — zavisi od konkretnog auta.':'Eigene Achse, Trailer oder Lkw — je nach Fahrzeug.')+'</h2><div class="grid" style="grid-template-columns:1fr"><article class="card"><h3>'+(sr?'Na točkovima':'Eigene Achse')+'</h3><p>'+(sr?'Mi možemo ponuditi samo uslugu vozača, ako auto ima legalne tablice/registraciju, osiguranje i ovlašćenje.':'Wir bieten die Fahrerleistung, wenn Kennzeichen/Zulassung, Versicherung und Vollmacht für die Route passen.')+'</p></article><article class="card"><h3>'+(sr?'Prikolica ili autotransporter':'Trailer oder Autotransporter')+'</h3><p>'+(sr?'Za neregistrovan, neispravan ili više automobila organizuje se ponuda odgovarajućeg transportnog partnera.':'Für nicht zugelassene, nicht fahrbereite oder mehrere Fahrzeuge wird ein passender Transportpartner angeboten.')+'</p></article></div></div></div></section>'+

  '<section class="section"><p class="eyebrow">'+(sr?'USLUGE I CENE':'LEISTUNGEN UND PREISE')+'</p><h2>'+(sr?'Pregled auta od 79 €, ostale usluge po ponudi.':'Leistungen und Preise im Überblick.')+'</h2><p class="muted">'+(sr?'Početna računica je besplatna. Za obilazak, pregled, delove i dovoz dobijaš ponudu pre naručivanja.':'Du erhältst vor dem Auftrag ein Angebot.')+'</p><div class="money-grid">'+
  '<article class="card"><h3>'+(sr?'Kompletan izveštaj o autu':'Vollständiger Fahrzeugreport')+'</h3><div class="price">9,90 €</div><p>'+(sr?'Procena troška, provera porekla, poznate slabosti modela i koraci pre kupovine. Dostupno po aktivaciji naplate.':'Kosten, Ursprung, Risiken, Modellhistorie und nächste Schritte.')+'</p></article>'+
  '<article class="card"><h3>'+(sr?'Obilazak vozila uživo':'Live-Fahrzeugbesichtigung')+'</h3><div class="price">'+(sr?'od 79 €':'ab 79 €')+'</div><p>'+(sr?'Cena zavisi od udaljenosti od Duisburga. Pošalji oglas i lokaciju vozila za tačnu ponudu.':'Preis abhängig von der Entfernung ab Duisburg.')+'</p></article>'+
  '<article class="card"><h3>'+(sr?'Profesionalni pregled mehaničara':'Professioneller Mechaniker-Check')+'</h3><div class="price"><small>'+(sr?'ponuda po vozilu':'Preis nach Fahrzeug')+'</small></div><p>'+(sr?'Obim i termin potvrđuju se pre narudžbine.':'Umfang und Termin werden vor Auftrag bestätigt.')+'</p></article>'+
  '<article class="card"><h3>'+(sr?'Dovoz / transport':'Überführung / Transport')+'</h3><div class="price"><small>'+(sr?'ponuda po ruti':'Preis nach Route')+'</small></div><p>'+(sr?'Vozač, prikolica ili kamion u zavisnosti od vozila i relacije.':'Fahrer, Trailer oder Lkw je nach Fahrzeug und Strecke.')+'</p></article>'+
  '<article class="card"><h3>'+(sr?'Delovi za auto':'Originalteile')+'</h3><div class="price"><small>'+(sr?'ponuda po VIN-u / delu':'Angebot nach VIN / Teil')+'</small></div><p>'+(sr?'Cena dela i dostave prikazuje se odvojeno.':'Teile- und Versandpreis werden getrennt ausgewiesen.')+'</p></article>'+
  '<article class="card"><h3>'+(sr?'Plac u Nišu':'Import-Basis Čalije')+'</h3><div class="price"><small>'+(sr?'zakup na upit':'Miete auf Anfrage')+'</small></div><p>'+(sr?'Dostupnost i uslovi zakupa potvrđuju se na upit.':'Block A, Block B oder Teilfläche nach rechtlicher und technischer Prüfung.')+'</p></article>'+
  '</div></section>'+

  '<section class="section" id="quote-checkout" hidden><p class="eyebrow">'+(sr?'PONUDA ZA TVOJ AUTO':'DEIN ANGEBOT')+'</p><h2>'+(sr?'Tvoja ponuda':'Dein Angebot')+'</h2><div id="quote-content" class="card"></div></section>'+
  '<section class="section" id="payment-protection"><p class="eyebrow">'+(sr?'SIGURNO PLAĆANJE USLUGE':'GESICHERTE SERVICEZAHLUNG')+'</p><h2>'+(sr?'Rezervacija iznosa pre usluge. Naplata tek posle izvršenja.':'Betrag vorab autorisieren. Erst nach Leistung einziehen.')+'</h2><div class="steps">'+
    (sr
      ? [['01','Dobiješ ponudu'],['02','Kartica ili PayPal rezerviše iznos'],['03','Usluga se izvrši'],['04','Iznos se naplati'],['05','Ako nema usluge — rezervacija se oslobađa']]
      : [['01','Angebot erhalten'],['02','Karte oder PayPal autorisieren'],['03','Leistung wird erbracht'],['04','Betrag wird eingezogen'],['05','Keine Leistung — Autorisierung freigeben']]
    ).map(x=>'<div><span>'+x[0]+'</span><strong>'+x[1]+'</strong></div>').join('')+'</div></section>'+

  '<section class="section" id="base"><p class="eyebrow">'+(sr?'AUTO PLAC U NIŠU':'IMPORT-BASIS IN NIŠ')+'</p><h2>'+(sr?'Čalije: fizička baza za uvoznike.':'Čalije: physische Basis für Importeure.')+'</h2><p class="muted">'+(sr?'Ako ti treba prostor u Nišu za vozilo, pošalji upit. Mogućnost korišćenja, prilaz i cena potvrđuju se pre dogovora.':'Block A, Block B oder Teilfläche für Verkauf, Zwischenabstellung, Besichtigung und Übergabe. Kapazität, Zufahrt, Nutzung und Miete werden vor Vertrag bestätigt.')+'</p><a class="btn" href="https://calije.daninihub.com/" target="_blank" rel="noreferrer">'+(sr?'Pogledaj Čalije lokaciju':'Čalije Standort ansehen')+'</a></section>'+

  '<section class="section" id="wissen"><p class="eyebrow">'+(sr?'KORISNI VODIČI':'PRAXIS-RATGEBER')+'</p><h2>'+(sr?'Odgovori na pitanja zbog kojih se najčešće gubi novac.':'Antworten auf Fragen, bei denen Importeure oft Geld verlieren.')+'</h2><div class="articles">'+articleCards+'</div></section>'+

  '<section class="section" id="service-request"><p class="eyebrow">'+(sr?'POŠALJI KONKRETAN UPIT':'KONKRETE ANFRAGE SENDEN')+'</p><h2>'+(sr?'Pošalji oglas i lokaciju auta. Dobićeš konkretnu ponudu.':'Welches Auto, welche Leistung, welcher Standort?')+'</h2><form class="form" id="service-form"><label>'+(sr?'Usluga':'Leistung')+'<select name="serviceType">'+serviceOptions(sr)+'</select></label><label>'+(sr?'Ime / firma':'Name / Firma')+'<input name="name" required></label><label>Email<input name="email" type="email" required></label><label>Telefon<input name="phone"></label><label>'+(sr?'Vozilo':'Fahrzeug')+'<input name="vehicle"></label><label>VIN<input name="vin"></label><label>'+(sr?'Broj dela / OEM':'Teilenummer / OEM')+'<input name="partNumber"></label><label>'+(sr?'Gde je auto':'Standort')+'<input name="pickupLocation"></label><label>'+(sr?'Gde treba da stigne':'Ziel')+'<input name="destination"></label><label class="wide">'+(sr?'Link ka oglasu i šta želiš da proverimo':'Details')+'<textarea name="message"></textarea></label><label class="wide"><span><input name="privacyAcknowledged" type="checkbox" required> '+(sr?'Pročitao/la sam obaveštenje o privatnosti.':'Ich habe die Datenschutzhinweise gelesen.')+'</span></label><button class="btn wide" type="submit">'+(sr?'ZATRAŽI PONUDU ZA AUTO':'ANFRAGE SENDEN')+'</button></form><div id="service-result"></div></section>'+
  '</main><footer class="foot"><div class="wrap"><span>DANINI · '+(sr?'Pametan uvoz automobila · Duisburg / Niš':'Fahrzeugimport · Duisburg / Niš')+'</span><span><a href="/'+lang+'/'+(sr?'privatnost':'datenschutz')+'">'+(sr?'Privatnost':'Datenschutz')+'</a> · <a href="/'+lang+'/impressum">Impressum</a></span></div></footer>';

  const scripts='<script>'+
  'const sr='+String(sr)+';const decisionMap={DO_NOT_BUY_YET:sr?"NE KUPUJ JOŠ":"NOCH NICHT KAUFEN",VERIFY_BEFORE_PAYMENT:sr?"PROVERI PRE UPLATE":"VOR ZAHLUNG PRÜFEN",CALCULATED_CANDIDATE:sr?"VREDI DALJE PROVERITI":"WEITER PRÜFEN"};const importMap={PASS_BASELINE:sr?"OSNOVNI USLOVI PROLAZE":"BASISANFORDERUNGEN OK",CHECK:sr?"POTREBNA DODATNA PROVERA":"WEITERE PRÜFUNG NÖTIG",STOP:sr?"STOP — NE KUPUJ JOŠ":"STOP",HISTORIC_REVIEW:sr?"POSEBAN POSTUPAK ZA OLDTAJMER":"HISTORIC-PRÜFUNG"};'+
  'const q=document.getElementById("quickcheck");if(q)q.addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(q);const body=Object.fromEntries(fd.entries());["purchasePrice","transportToSerbia","exportCosts","year","euroClass","serbiaMarketValue"].forEach(k=>body[k]=Number(body[k]||0));body.currency=body.sourceCountry==="CH"?"CHF":"EUR";body.fxToEur=1;body.registrationDoc=true;body.ownershipDoc=true;body.vinProvided=true;const out=document.getElementById("quick-result");out.innerHTML="<div class=\\"result\\">…</div>";try{const r=await fetch("/api/importos/evaluate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const p=await r.json();if(!r.ok)throw new Error(p.error||"ERROR");const x=p.result;out.innerHTML="<div class=\\"result\\"><h3>"+(decisionMap[x.decision]||x.decision)+"</h3><p>"+(sr?"Procena ukupnog troška: ":"Geschätzter Kostenkorridor: ")+Math.round(x.corridor.best)+" € – "+Math.round(x.corridor.worst)+" €</p><p>"+(sr?"Rizik prevare: ":"Betrugsrisiko: ")+x.fraud.score+"/100 · "+(sr?"Uvoz: ":"Import: ")+(importMap[x.importability.status]||x.importability.status)+"</p><p>"+(sr?"Ovo je početna procena. Pre kupovine proveri dokumenta i konkretno vozilo.":"Dies ist eine Ersteinschätzung. Vor Kauf Dokumente und konkretes Fahrzeug prüfen.")+"</p></div>"}catch(err){out.innerHTML="<div class=\\"result error\\">"+err.message+"</div>"}});'+
  'const sf=document.getElementById("service-form");if(sf)sf.addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(sf);const body=Object.fromEntries(fd.entries());body.privacyAcknowledged=fd.get("privacyAcknowledged")==="on";body.language="'+lang+'";const out=document.getElementById("service-result");out.innerHTML="<div class=\\"result\\">…</div>";try{const r=await fetch("/api/importos/service-request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const p=await r.json();if(!r.ok)throw new Error(p.error||"ERROR");out.innerHTML="<div class=\\"result ok\\">'+(sr?'Upit je sačuvan. Zapiši broj upita: ':'Anfrage gespeichert. Referenz: ')+'<b>"+p.reference+"</b></div>";sf.reset()}catch(err){out.innerHTML="<div class=\\"result error\\">"+err.message+"</div>"}});'+
  'const quoteRef=new URLSearchParams(location.search).get("quote");if(quoteRef){const panel=document.getElementById("quote-checkout"),box=document.getElementById("quote-content");panel.hidden=false;const add=(tag,value)=>{const el=document.createElement(tag);el.textContent=value;box.appendChild(el);return el};add("p",sr?"Učitavam ponudu…":"Angebot wird geladen…");fetch("/api/importos/quotes/"+encodeURIComponent(quoteRef)).then(async r=>{const data=await r.json();if(!r.ok)throw Error(data.error||"QUOTE_UNAVAILABLE");box.replaceChildren();const q=data.quote;add("h3",q.description||q.serviceType);add("p",(sr?"Iznos usluge: ":"Preis: ")+(q.amountCents/100).toFixed(2)+" "+q.currency);if(q.serviceDate)add("p",(sr?"Termin: ":"Termin: ")+q.serviceDate);add("p",(sr?"Broj ponude: ":"Angebotsnummer: ")+q.reference);if(q.status==="CAPTURED"||q.status==="AUTHORIZED"||q.status==="AUTHORIZATION_PENDING"){add("p",sr?"Plaćanje je već obrađeno ili je u toku. Sačuvaj broj ponude.":"Zahlung bearbeitet oder in Bearbeitung.");return}const options=data.paymentOptions||{};if(!options.card&&!options.paypal){add("p",sr?"Plaćanje trenutno nije uključeno. Pošalji broj ponude na info@daninihub.com za dogovor.":"Zahlung derzeit nicht verfügbar. Bitte Angebotsnummer an info@daninihub.com senden.");return}for(const [provider,label] of [["stripe",sr?"Rezerviši iznos karticom":"Mit Karte autorisieren"],["paypal","PayPal"]]){if(!(provider==="stripe"?options.card:options.paypal))continue;const button=document.createElement("button");button.className="btn";button.type="button";button.textContent=label;button.style.marginRight="10px";button.onclick=async()=>{button.disabled=true;try{const response=await fetch("/api/importos/quotes/"+encodeURIComponent(q.reference)+"/authorize/"+provider,{method:"POST"});const result=await response.json();if(!response.ok||!result.checkoutUrl)throw Error(result.error||"PAYMENT_UNAVAILABLE");location.assign(result.checkoutUrl)}catch(error){add("p",(sr?"Plaćanje nije uspelo: ":"Zahlung fehlgeschlagen: ")+error.message);button.disabled=false}};box.appendChild(button)}}).catch(()=>{box.replaceChildren();add("p",sr?"Ponuda nije dostupna ili je istekla. Pošalji broj ponude na info@daninihub.com.":"Angebot nicht verfügbar oder abgelaufen. Bitte Angebotsnummer an info@daninihub.com senden.")});}'+
  '</script>';

  return shell({lang,title:ROUTES['/'+lang+'/'].title,description:ROUTES['/'+lang+'/'].description,body,scripts});
}

function legalPage(route){
  const meta=ROUTES[route]; if(!meta)return null;
  const sr=meta.lang==='sr';
  const title=route.includes('impressum')?(sr?'Impresum':'Impressum')
    :route.includes('datenschutz')||route.includes('privatnost')?(sr?'Privatnost':'Datenschutz')
    :route.includes('cookies')||route.includes('kolacici')?(sr?'Kolačići':'Cookies')
    :(sr?'Uslovi korišćenja':'Nutzungsbedingungen');
  const text=route.includes('impressum')
    ?'Dragan Zdravković · DaniniHub / DANINI · Fischerstraße 54 · 47055 Duisburg · Deutschland · info@daninihub.com · +49 1573 0916621'
    :route.includes('datenschutz')||route.includes('privatnost')
      ?(sr?'Obrađujemo samo podatke potrebne za procenu, servisni upit, ponudu i plaćanje. Za pitanja: info@daninihub.com.':'Wir verarbeiten nur Daten, die für Prüfung, Serviceanfrage, Angebot und Zahlung erforderlich sind. Kontakt: info@daninihub.com.')
      :route.includes('cookies')||route.includes('kolacici')
        ?(sr?'DANINI trenutno ne koristi reklamne ili marketinške kolačiće.':'DANINI verwendet derzeit keine Werbe- oder Marketing-Cookies.')
        :(sr?'Digitalna procena je pomoć pri odluci. Pregled, delovi, dovoz i druge usluge imaju posebno potvrđen obim i cenu pre narudžbine.':'Die digitale Prüfung ist eine Entscheidungshilfe. Prüfung, Teile, Überführung und weitere Leistungen werden vor Auftrag separat bestätigt.');
  const body='<header class="head"><div class="top"><a class="brand" href="/'+meta.lang+'/"><img src="/importos-mark.svg" alt="DANINI"><div><strong>DANINI</strong><small>'+(sr?'PAMETAN UVOZ AUTOMOBILA':'FAHRZEUGIMPORT')+'</small></div></a></div></header><main class="wrap"><section class="section"><p class="eyebrow">'+(sr?'PRAVNE INFORMACIJE':'RECHTLICHE INFORMATIONEN')+'</p><h2>'+title+'</h2><p class="muted">'+text+'</p></section></main>';
  return shell({lang:meta.lang,title:meta.title,description:meta.description,body});
}

function knowledgePage(route){
  const meta=ROUTES[route]; if(!meta)return null;
  const slug=route.split('/').filter(Boolean).pop();
  const item=articles.find(a=>a[0]===slug); if(!item)return null;
  const sr=meta.lang==='sr',title=sr?item[2]:item[1],desc=sr?item[4]:item[3];
  const practical={
    'deutschland-selbstimport':['Pre kapare zatraži broj šasije, fotografije saobraćajne dozvole i podatke prodavca.','Izračunaj cenu auta, put, tablice ili prevoz, dažbine i troškove do registracije.','Proveri da li prodavac može da preda originalna dokumenta i dokaz o vlasništvu.'],
    'schweiz-import':['Cena u švajcarskim francima nije konačan trošak u evrima: proveri kurs i naknade.','Pre kupovine pitaj prodavca koja dokumenta dobijaš za izvoz i poreklo vozila.','Uporedi prevoz na točkovima sa ponudom prevoznika i ostavi rezervu za nepredviđene troškove.'],
    'eur1-herkunft':['Mesto gde kupuješ auto ne dokazuje njegovo preferencijalno poreklo.','Traži dokaz o poreklu pre nego što u računicu uključiš povoljniju carinu.','Ako dokaz nije potvrđen, izračunaj i skuplji scenario.'],
    'safebuy-vor-kaution':['Uporedi broj šasije u oglasu, na automobilu i u dokumentima.','Proveri identitet prodavca i kome novac stvarno šalješ.','Sačuvaj oglas, poruke, ugovor i potvrdu o uplati; ne žuri sa kaparom zbog navodne hitnosti.'],
    'oldtimer-30-plus':['Sama starost ne znači automatski da vozilo ispunjava uslove za poseban postupak.','Dokumentuj originalnost, tehničko stanje i istoriju pre nego što platiš vozilo.','Unapred proveri postupak i troškove kod nadležnih institucija za konkretan primerak.'],
    'transport-entscheidung':['Vožnja na točkovima zahteva važeće tablice, osiguranje i dokumenta za rutu.','Neispravan ili neregistrovan auto traži prikolicu ili transporter.','Uporedi ukupnu cenu prevoza, vreme, rizik i mesto predaje vozila.'],
    'landed-cost-kalkulation':['Kreni od kupovne cene i dodaj put ili prevoz, izvozne troškove i dažbine.','Dodaj tehnički postupak, osiguranje, registraciju i rezervu za popravke.','Računaj raspon, jer poreklo, vrednost i dokumenti mogu promeniti konačan iznos.'],
    'vin-dokumente-checkliste':['Traži VIN pre polaska i uporedi ga sa fotografijama dokumentacije.','Proveri vlasnika, prodavca, račun ili ugovor i originalna dokumenta.','Ako se podaci ne slažu, zastani i razjasni razliku pre uplate.']
  };
  const points=practical[slug]||[];
  const body='<header class="head"><div class="top"><a class="brand" href="/'+meta.lang+'/"><img src="/importos-mark.svg" alt="DANINI"><div><strong>DANINI</strong><small>'+(sr?'UVOZ AUTOMOBILA':'FAHRZEUGIMPORT')+'</small></div></a></div></header><main class="wrap"><section class="section"><p class="eyebrow">'+(sr?'PRAKTIČNI VODIČ':'PRAXIS-RATGEBER')+'</p><h2>'+esc(title)+'</h2><p class="lead">'+esc(desc)+'</p><div class="grid">'+(sr?points.map((p,i)=>'<article class="card"><p class="eyebrow">KORAK '+(i+1)+'</p><p>'+esc(p)+'</p></article>').join(''):'<article class="card"><h3>Warum wichtig</h3><p>Kaufen erst, wenn Kosten, Dokumente und Risiko ausreichend klar sind.</p></article><article class="card"><h3>Regel</h3><p>Das günstigste Szenario gilt erst nach belegbarer Prüfung.</p></article><article class="card"><h3>Nächster Schritt</h3><p>Zur Startseite, Fahrzeug prüfen oder konkrete Anfrage senden.</p></article>')+'</div><p class="muted">'+(sr?'Ovo je početna kontrolna lista. Konačni uslovi zavise od konkretnog vozila i važećih pravila.':'Diese Hinweise sind eine erste Checkliste für das konkrete Fahrzeug.')+'</p><a class="btn" href="/'+meta.lang+'/#passport">'+(sr?'Izračunaj okvirni trošak':'Kosten prüfen')+'</a> <a class="btn secondary" href="/'+meta.lang+'/#service-request">'+(sr?'Pošalji upit za auto':'Anfrage senden')+'</a></section></main>';
  return shell({lang:meta.lang,title:meta.title,description:meta.description,body});
}

function ownerPage(){
  const body='<header class="head"><div class="top"><a class="brand" href="/sr/"><img src="/importos-mark.svg" alt="DANINI"><div><strong>DANINI</strong><small>OWNER QUOTE DESK</small></div></a></div></header><main class="wrap"><section class="section"><p class="eyebrow">INTERNAL · NOINDEX</p><h2>Service Quote & Payment Control</h2><p class="muted">Kreiraj ponudu, pošalji booking link, pa nakon usluge naplati autorizovani iznos ili oslobodi rezervaciju.</p><form class="form" id="owner-quote"><label>Admin secret<input name="secret" type="password" required></label><label>Email<input name="email" type="email" required></label><label>Ime / firma<input name="name"></label><label>Usluga<select name="serviceType">'+serviceOptions(true)+'</select></label><label>Iznos EUR<input name="amountEur" type="number" min="5" step="0.01" required></label><label>Termin<input name="serviceDate" type="datetime-local"></label><label>Rok ponude (h)<input name="expiresInHours" type="number" min="1" max="168" value="72"></label><label>Jezik<select name="language"><option value="sr">SR</option><option value="de">DE</option></select></label><label class="wide">Opis<textarea name="description" required></textarea></label><button class="btn wide" type="submit">KREIRAJ SIGURNU PONUDU</button></form><div id="owner-result"></div></section></main>';
  const scripts='<script>document.getElementById("owner-quote").addEventListener("submit",async e=>{e.preventDefault();const f=new FormData(e.currentTarget);const secret=f.get("secret");const body=Object.fromEntries(f.entries());delete body.secret;body.amountEur=Number(body.amountEur);body.expiresInHours=Number(body.expiresInHours);const out=document.getElementById("owner-result");try{const r=await fetch("/api/importos/admin/quotes",{method:"POST",headers:{"Content-Type":"application/json","X-Danini-Admin":secret},body:JSON.stringify(body)});const p=await r.json();if(!r.ok)throw new Error(p.error||"ERROR");out.innerHTML="<div class=\\"result ok\\"><b>"+p.quote.reference+"</b><p><a target=\\"_blank\\" href=\\""+p.bookingUrl+"\\">"+p.bookingUrl+"</a></p></div>"}catch(err){out.innerHTML="<div class=\\"result error\\">"+err.message+"</div>"}});</script>';
  return shell({lang:'sr',title:'DANINI Owner Quote Desk',description:'Internal quote control',body,scripts}).replace('content="index,follow,max-image-preview:large"','content="noindex,nofollow"');
}

function mountPublicRuntime(app){
  app.use(express.static(PUBLIC_ASSETS,{index:false,maxAge:'1h'}));

  app.get('/',(req,res)=>{res.set('Cache-Control','no-store');return res.type('html').send(home('sr'))});
  app.get(['/sr','/sr/'],(req,res)=>{res.set('Cache-Control','no-store');return res.type('html').send(home('sr'))});
  app.get(['/de','/de/'],(req,res)=>{res.set('Cache-Control','no-store');return res.type('html').send(home('de'))});
  app.get('/en',(req,res)=>res.redirect(308,'/sr/'));

  app.get('/robots.txt',(req,res)=>res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /importos/success\nDisallow: /payment/\nDisallow: /owner/\nSitemap: https://daninihub.com/sitemap.xml\n'));
  app.get('/sitemap.xml',(req,res)=>{
    const urls=Object.keys(ROUTES).map(route=>'<url><loc>https://daninihub.com'+route+'</loc><lastmod>2026-09-23</lastmod></url>').join('');
    res.type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls+'</urlset>');
  });

  app.get('/owner/importos',(req,res)=>{
    res.set('X-Robots-Tag','noindex,nofollow');
    res.set('Cache-Control','no-store');
    return res.type('html').send(ownerPage());
  });

  app.get(Object.keys(ROUTES).filter(r=>r!=='/de/'&&r!=='/sr/'),(req,res)=>{
    const page=req.path.includes('/wissen/')||req.path.includes('/vodic/')?knowledgePage(req.path):legalPage(req.path);
    if(!page)return res.status(404).end();
    res.set('Cache-Control','no-store');
    return res.type('html').send(page);
  });
}

module.exports={mountPublicRuntime,ROUTES,home,ownerPage};
