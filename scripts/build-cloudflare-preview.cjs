'use strict';
// Independent, read-only, preview-only Cloudflare Pages site.
// No payment, user account, database, AI endpoint or secret is required.
const fs = require('node:fs');
const path = require('node:path');
const out = path.resolve(__dirname, '../cloudflare-preview-dist');
const assets = path.resolve(__dirname, '../public');
const WA = 'https://wa.me/4915730916621';
const MAIL = 'mailto:info@daninihub.com';
const photos = {
  portrait: '/images/DANINI_Dragan_Portret_CLEAN_1200x1200.jpg',
  phone: '/images/DANINI_Dragan_Telefon_CLEAN_1200x1200.jpg',
  field: '/images/DANINI_Dragan_Pregled_Auta_CLEAN_1200x1200.jpg',
  vehicle: '/images/DANINI_Kartica_01_Salon_Auto_Bez_Osobe.jpg',
  paperwork: '/images/DANINI_Kartica_02_Uvoz_Dokumentacija_EUR1.jpg',
  business: '/images/DANINI_Kartica_06_B2B_Sourcing_I_Preuzimanje.jpg'
};
function write(rel, html) {
  const target = path.join(out, rel);
  fs.mkdirSync(path.dirname(target), {recursive:true});
  fs.writeFileSync(target, html, 'utf8');
}
function esc(s) { return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
const copy = {
 sr: {
  tag:'DANINI AUTO · NEMAČKA / HOLANDIJA / ŠVAJCARSKA',
  title:'Vaš čovek na terenu. Proverite automobil pre kupovine.',
  lead:'Pronašli ste automobil u inostranstvu? Pomažemo vam da razgovarate sa prodavcem, dogovorite obilazak, pogledate vozilo uživo i organizujete nezavisni stručni pregled.',
  home:'Početna', services:'Usluge i cene', how:'Kako radimo', b2b:'Za firme', contact:'Kontakt',
  btn:'Pošaljite oglas putem WhatsApp-a',
  note:'Ne prodajemo vozila i ne garantujemo tehničku ispravnost. Konačnu odluku o kupovini donosite vi.',
  prices:[
   ['Online Check','59 €','Do tri oglasa, poređenje dostupnih podataka i opreme, kontakt sa prodavcem kada je moguće, kratka pisana procena. Bez odlaska na teren.'],
   ['Live Visit','189 €','Dogovor i obilazak jednog automobila, WhatsApp video-poziv, fotografije i izveštaj o vidljivom stanju. Do 60 minuta na lokaciji; lokalna zona do 50 km povratno.'],
   ['Buyer Concierge','349 €','Koordinacija kupovine jednog vozila: komunikacija, jedan lokalni obilazak, pomoć pri pregovorima i dokumentaciji, organizacija nezavisnog pregleda. Do šest sati rada.']
  ],
  priceNote:'Predložene početne cene za test tržišta. Dodatni put, eventualni hotel, stručni pregled, takse i transport nisu uključeni. Konačna ponuda se potvrđuje pre angažovanja.',
  aboutTitle:'Ne morate sami da putujete do svakog automobila.',
  aboutText:'DANINI Auto predstavlja interese kupca u dogovorenom obimu, uz jasnu razliku između informacija iz oglasa, izjava prodavca i onoga što je stvarno viđeno. Razgovaramo na srpskom i nemačkom jeziku.',
  steps:[['01','Pošaljete oglas','Pošaljite link, lokaciju, budžet i pitanja koja su vam važna.'],['02','Dobijete pisanu ponudu','Potvrđujemo mogućnost, obim, cenu i termin. Ništa se ne naplaćuje bez dogovora.'],['03','Dogovorimo pregled','Obilazak i video samo uz pristanak prodavca; dijagnostika samo uz njegovu izričitu saglasnost.'],['04','Dobijete izveštaj','Razdvajamo potvrđene činjenice, uočene rizike i nepoznanice. Odluka o kupovini ostaje vaša.']],
  b2bTitle:'DANINI Auto za auto-placeve i firme',
  b2bLead:'Nudimo komunikaciju sa nemačkim prodavcima, dogovaranje obilazaka, koordinaciju provere i partnerstva za kupce iz Srbije i regiona.',
  land:'Posebna ponuda: poslovni zakup dve lokacije u Čalijama, Niš, radne površine približno 345 i 648 m². Namena i ugovorni uslovi se proveravaju pre dogovora.',
  affiliate:'Partnerstva sa evropskim platformama za trgovinu vozilima su u fazi razmatranja. Nismo ovlašćeni predstavnik AUTO1 niti wirkaufendeinauto.de.',
  contactTitle:'Pošaljite nam konkretan oglas',
  contactText:'Napišite marku i model, URL oglasa, lokaciju vozila, šta želite da proverimo i kada vam je potreban pregled. Odgovaramo individualnom ponudom.',
  disclaimer:'Vizuelni obilazak i osnovno OBD očitavanje nisu potpuni tehnički pregled. Ne garantujemo stvarnu kilometražu, skrivene kvarove ili navode prodavca. Ne pružamo pravno savetovanje, prevoz putnika ili osiguranje.',
  footer:'DANINI Auto · Duisburg / Niš · Nezavisna podrška kupcima automobila',
  introServices:'Tri jasna paketa; za udaljene lokacije troškove izračunavamo unapred.',
  docs:'Pre uplate tražite jasnu specifikaciju, obim i troškove; ne šaljite kaparu na osnovu samog oglasa.',
  legalNote:'Postojeće pravne stranice su preuzete bez sadržinskih izmena. Pre puštanja na glavni domen potrebno ih je uskladiti sa novim paketima i pregledati.'
 },
 de: {
  tag:'DANINI AUTO · DEUTSCHLAND / NIEDERLANDE / SCHWEIZ',
  title:'Ihr Ansprechpartner vor Ort. Fahrzeug vor dem Kauf besser prüfen.',
  lead:'Sie haben ein Fahrzeug im Ausland gefunden? Wir unterstützen Sie beim Verkäuferkontakt, koordinieren Besichtigungen, zeigen das Auto per Live-Video und vermitteln auf Wunsch eine unabhängige Fachprüfung.',
  home:'Startseite', services:'Leistungen & Preise', how:'Ablauf', b2b:'Für Händler', contact:'Kontakt',
  btn:'Inserat per WhatsApp senden',
  note:'Wir verkaufen keine Fahrzeuge und garantieren keinen mangelfreien Zustand. Die Kaufentscheidung treffen Sie selbst.',
  prices:[
   ['Online Check','59 €','Bis zu drei Inserate vergleichen, verfügbare Angaben und Ausstattung prüfen, möglichen Verkäuferkontakt koordinieren, kurze schriftliche Einschätzung. Ohne Vor-Ort-Termin.'],
   ['Live Visit','189 €','Besichtigung eines Fahrzeugs nach Absprache, WhatsApp-Live-Video, Fotos, Bericht über sichtbare Merkmale. Bis 60 Minuten vor Ort; lokale Zone bis 50 km Hin- und Rückweg.'],
   ['Buyer Concierge','349 €','Koordination eines Fahrzeugkaufs: Kommunikation, ein lokaler Besichtigungstermin, Hilfe bei Verhandlungen und Unterlagen, Organisation einer unabhängigen Prüfung. Bis sechs Arbeitsstunden.']
  ],
  priceNote:'Unverbindliche Einführungspreise für den Markttest. Zusätzliche Anreise, ggf. Hotel, Fachprüfung, Gebühren und Transport sind nicht enthalten. Verbindliches Angebot vor Auftrag.',
  aboutTitle:'Sie müssen nicht für jedes Fahrzeug selbst anreisen.',
  aboutText:'DANINI Auto unterstützt den Käufer im vereinbarten Umfang und unterscheidet Inseratsangaben, Verkäuferaussagen und eigene Sichtbeobachtungen. Kommunikation auf Deutsch und Serbisch.',
  steps:[['01','Inserat senden','Link, Standort, Budget und Ihre wichtigsten Fragen mitteilen.'],['02','Angebot erhalten','Machbarkeit, Leistungsumfang, Preis und Termin vor der Beauftragung bestätigen.'],['03','Besichtigung abstimmen','Besichtigung und Video mit Einverständnis des Verkäufers; Diagnose nur mit ausdrücklicher Erlaubnis.'],['04','Bericht erhalten','Bestätigte Informationen, sichtbare Risiken und offene Punkte trennen. Die Kaufentscheidung bleibt bei Ihnen.']],
  b2bTitle:'DANINI Auto für Händler und Unternehmen',
  b2bLead:'Kommunikation mit Verkäufern in Deutschland, Koordination von Besichtigungen, Prüfdienstleistungen und Partnerangebote für Käufer auf dem Balkan.',
  land:'Separates Angebot: zwei gewerblich nutzbare Flächen im Stadtteil Čalije, Niš, mit Arbeitsflächen von ca. 345 und 648 m². Zulässige Nutzung und Vertragsbedingungen vorab prüfen.',
  affiliate:'Kooperationen mit europäischen Fahrzeugplattformen werden geprüft. DANINI ist kein autorisierter Vertreter von AUTO1 oder wirkaufendeinauto.de.',
  contactTitle:'Konkretes Inserat senden',
  contactText:'Marke, Modell, Link zum Inserat, Fahrzeugstandort, Prüfwünsche und gewünschter Termin. Wir erstellen ein individuelles Angebot.',
  disclaimer:'Sichtprüfung und einfaches OBD-Auslesen sind keine vollständige technische Untersuchung. Keine Garantie für Laufleistung, verdeckte Mängel oder Verkäuferangaben. Keine Rechtsberatung, Personenbeförderung oder Versicherung.',
  footer:'DANINI Auto · Duisburg / Niš · Unabhängige Unterstützung beim Fahrzeugkauf',
  introServices:'Drei transparente Pakete; Zusatzkosten für weitere Strecken erhalten Sie im Voraus.',
  docs:'Vor einer Zahlung Leistungsumfang und alle Kosten prüfen; eine Anzahlung nicht allein auf Grundlage des Inserats senden.',
  legalNote:'Bestehende Rechtstexte wurden unverändert übernommen. Vor dem Livegang auf der Hauptdomain müssen diese auf die neuen Angebote abgestimmt und geprüft werden.'
 }
};
function links(lang) {
  return [
    ['/'+lang+'/', copy[lang].home],
    ['/'+lang+'/'+(lang==='sr'?'usluge':'leistungen')+'/',copy[lang].services],
    ['/'+lang+'/'+(lang==='sr'?'kako-radimo':'ablauf')+'/',copy[lang].how],
    ['/'+lang+'/'+(lang==='sr'?'za-firme':'unternehmen')+'/',copy[lang].b2b],
    ['/'+lang+'/kontakt/',copy[lang].contact]
  ];
}
const css = [
':root{--ink:#0f172a;--slate:#1e293b;--yellow:#facc15;--muted:#a9b4c2;--line:#334155;--paper:#f9fafb}',
'*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--ink);color:#f7fafc;font:16px/1.7 Inter,system-ui,Arial,sans-serif}',
'a{color:inherit}img{display:block;max-width:100%}.wrap{max-width:1180px;margin:auto;padding:0 22px}',
'header{position:sticky;top:0;z-index:10;background:rgba(15,23,42,.97);border-bottom:1px solid var(--line)}',
'.bar{min-height:84px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.brand{text-decoration:none;font-weight:900;letter-spacing:.11em;font-size:22px}.brand small{display:block;font-size:10px;color:var(--yellow);letter-spacing:.22em}',
'nav{display:flex;align-items:center;gap:13px;flex-wrap:wrap}nav a{text-decoration:none;font-size:13px;font-weight:700}nav a:hover,.links a:hover{color:var(--yellow)}.lang{color:var(--yellow)}',
'.hero{padding:76px 0 64px;display:grid;grid-template-columns:1.1fr .9fr;gap:42px;align-items:center}.eyebrow{color:var(--yellow);font-size:12px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}',
'h1{font-size:clamp(35px,5vw,65px);line-height:1.08;letter-spacing:-.045em;margin:14px 0 24px}h2{font-size:clamp(27px,3.2vw,43px);line-height:1.18;margin:0 0 16px}h3{font-size:21px;margin:0 0 12px}.lead{font-size:19px;color:#d7dfe8;line-height:1.65;max-width:710px}',
'.heroimg{aspect-ratio:1/1;object-fit:cover;width:100%;border-radius:24px;border:1px solid #4b5563;box-shadow:0 30px 100px rgba(0,0,0,.25)}',
'.btn{display:inline-block;background:var(--yellow);color:#101827;text-decoration:none;border-radius:10px;padding:14px 19px;font-weight:900;margin:10px 12px 10px 0}.btn.secondary{background:transparent;color:#fff;border:1px solid #8390a5}.btn:hover{filter:brightness(1.1)}',
'.section{padding:66px 0;border-top:1px solid var(--line)}.muted{color:var(--muted)}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin:25px 0}',
'.card{background:var(--slate);border:1px solid var(--line);border-radius:16px;padding:25px}.price{color:var(--yellow);font-size:34px;font-weight:900;margin:0 0 14px}.card p{margin:0}',
'.split{display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:center}.split img{width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;border-radius:16px}',
'.steps{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:28px}.num{color:var(--yellow);font-weight:900;font-size:24px}.note{border-left:4px solid var(--yellow);padding:16px 20px;background:#1b293a;color:#dbe4ec;border-radius:0 10px 10px 0}',
'footer{background:#0b1322;padding:35px 0;border-top:1px solid var(--line)}.links{display:flex;gap:17px;flex-wrap:wrap}.links a{font-size:13px;color:var(--muted)}',
'@media(max-width:820px){.hero,.split{grid-template-columns:1fr}.grid{grid-template-columns:1fr}.steps{grid-template-columns:1fr}.hero{padding:42px 0}.bar{padding:14px 0}nav{gap:9px}nav a{font-size:12px}.heroimg{max-height:370px}}'
].join('');
function page(lang, slug, heading, body, description) {
 const c=copy[lang], menu=links(lang);
 const nav=menu.map(a=>'<a href="'+a[0]+'">'+esc(a[1])+'</a>').join('');
 const legal=[['/impressum','Impressum'],[lang==='sr'?'/privatnost':'/datenschutz',lang==='sr'?'Privatnost':'Datenschutz'],[lang==='sr'?'/uslovi':'/bedingungen',lang==='sr'?'Uslovi':'Bedingungen'],[lang==='sr'?'/kolacici':'/cookies',lang==='sr'?'Kolačići':'Cookies']];
 const footer=legal.map(a=>'<a href="/'+lang+a[0]+'/">'+a[1]+'</a>').join('');
 const langSw=lang==='sr'?'<a class="lang" href="/de/">DE</a>':'<a class="lang" href="/sr/">SR</a>';
 return '<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<title>'+esc(heading)+' | DANINI Auto</title><meta name="description" content="'+esc(description)+'"><meta name="robots" content="noindex,nofollow">'+
 '<link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/assets/cloudflare.css"></head><body>'+
 '<header><div class="wrap bar"><a class="brand" href="/'+lang+'/">DANINI<small>AUTO · BUYER SUPPORT</small></a><nav aria-label="Navigation">'+nav+langSw+'</nav></div></header>'+
 '<main>'+body+'</main><footer><div class="wrap"><p>'+esc(c.footer)+'</p><div class="links">'+footer+'<a href="'+WA+'">WhatsApp</a><a href="'+MAIL+'">info@daninihub.com</a></div>'+
 '<p class="muted" style="font-size:12px">'+esc(c.legalNote)+'</p></div></footer></body></html>';
}
function cards(lang) {
 const c=copy[lang]; return '<div class="grid">'+c.prices.map(x=>'<article class="card"><h3>'+esc(x[0])+'</h3><div class="price">'+esc(x[1])+'</div><p>'+esc(x[2])+'</p></article>').join('')+'</div>';
}
function hero(lang) {
 const c=copy[lang], serv=links(lang)[1][0];
 return '<section class="wrap hero"><div><p class="eyebrow">'+esc(c.tag)+'</p><h1>'+esc(c.title)+'</h1><p class="lead">'+esc(c.lead)+'</p>'+
 '<a class="btn" href="'+WA+'?text='+encodeURIComponent(lang==='sr'?'Pozdrav, želim DANINI ponudu za automobil: ':'Guten Tag, ich wünsche ein DANINI Angebot für dieses Fahrzeug: ')+'">'+esc(c.btn)+'</a>'+
 '<a class="btn secondary" href="'+serv+'">'+esc(c.services)+'</a><p class="muted">'+esc(c.note)+'</p></div>'+
 '<img class="heroimg" src="'+photos.portrait+'" alt="DANINI · Dragan Zdravković" width="1200" height="1200"></section>';
}
function servicesBody(lang) {
 const c=copy[lang];
 return '<section class="wrap section"><p class="eyebrow">'+esc(c.services)+'</p><h1>'+esc(c.services)+'</h1><p class="lead">'+esc(c.introServices)+'</p>'+cards(lang)+
 '<p class="note">'+esc(c.priceNote)+'</p><a class="btn" href="'+WA+'">'+esc(c.btn)+'</a></section>'+
 '<section class="wrap section split"><div><h2>'+esc(c.aboutTitle)+'</h2><p>'+esc(c.aboutText)+'</p><p class="note">'+esc(c.disclaimer)+'</p></div><img src="'+photos.field+'" alt="DANINI pregled vozila" loading="lazy"></section>';
}
function stepsBody(lang) {
 const c=copy[lang];return '<section class="wrap section"><p class="eyebrow">'+esc(c.how)+'</p><h1>'+esc(c.how)+'</h1><div class="steps">'+
 c.steps.map(s=>'<article class="card"><span class="num">'+esc(s[0])+'</span><h3>'+esc(s[1])+'</h3><p>'+esc(s[2])+'</p></article>').join('')+'</div><p class="note">'+esc(c.docs)+'</p></section>';
}
function b2bBody(lang) {
 const c=copy[lang];return '<section class="wrap hero"><div><p class="eyebrow">B2B · DE ↔ BALKAN</p><h1>'+esc(c.b2bTitle)+'</h1><p class="lead">'+esc(c.b2bLead)+'</p><p>'+esc(c.land)+'</p>'+
 '<a class="btn" href="'+WA+'">'+esc(c.contact)+'</a></div><img class="heroimg" src="'+photos.business+'" alt="DANINI Auto B2B" loading="lazy"></section>'+
 '<section class="wrap section"><p class="note">'+esc(c.affiliate)+'</p></section>';
}
function contactBody(lang) {
 const c=copy[lang];return '<section class="wrap hero"><div><p class="eyebrow">'+esc(c.contact)+'</p><h1>'+esc(c.contactTitle)+'</h1><p class="lead">'+esc(c.contactText)+'</p>'+
 '<a class="btn" href="'+WA+'">'+esc(c.btn)+'</a><p><a href="'+MAIL+'">info@daninihub.com</a></p><p class="note">'+esc(c.note)+'</p></div>'+
 '<img class="heroimg" src="'+photos.phone+'" alt="Kontakt DANINI Auto" loading="lazy"></section>';
}
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
fs.cpSync(assets,out,{recursive:true});
write('assets/cloudflare.css',css);
write('index.html','<!doctype html><html lang="sr"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/sr/"><meta name="robots" content="noindex"><title>DANINI Auto</title><a href="/sr/">DANINI Auto — SR</a></html>');
for (const lang of ['sr','de']) {
 const c=copy[lang];
 write(lang+'/index.html',page(lang,'',c.title,hero(lang)+
  '<section class="wrap section"><p class="eyebrow">'+esc(c.services)+'</p><h2>'+esc(c.services)+'</h2>'+cards(lang)+'<p class="note">'+esc(c.priceNote)+'</p></section>'+
  '<section class="wrap section split"><div><h2>'+esc(c.aboutTitle)+'</h2><p class="lead">'+esc(c.aboutText)+'</p><a class="btn" href="'+links(lang)[2][0]+'">'+esc(c.how)+'</a></div><img src="'+photos.vehicle+'" alt="Vozilo pre kupovine" loading="lazy"></section>'+
  '<section class="wrap section"><p class="note">'+esc(c.disclaimer)+'</p></section>',c.lead));
 const pages=lang==='sr'?[['usluge',servicesBody(lang),c.services],['kako-radimo',stepsBody(lang),c.how],['za-firme',b2bBody(lang),c.b2b],['kontakt',contactBody(lang),c.contact]]:[['leistungen',servicesBody(lang),c.services],['ablauf',stepsBody(lang),c.how],['unternehmen',b2bBody(lang),c.b2b],['kontakt',contactBody(lang),c.contact]];
 for (const [slug,body,title] of pages)write(lang+'/'+slug+'/index.html',page(lang,slug,title,body,title+' — DANINI Auto'));
}
// Reuse original legal source verbatim; legal review before production is mandatory.
const {legalPage}=require('../server-public-runtime');
const legalRoutes={sr:['impressum','privatnost','uslovi','kolacici'],de:['impressum','datenschutz','bedingungen','cookies']};
for (const [lang, slugs] of Object.entries(legalRoutes))for(const slug of slugs){
 const html=legalPage('/'+lang+'/'+slug);
 if(!html || !html.includes('<html'))throw Error('Missing legal source: '+lang+'/'+slug);
 write(lang+'/'+slug+'/index.html',html);
}
write('_headers','/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n');
write('robots.txt','User-agent: *\nDisallow: /\n');
console.log('Cloudflare preview built:',out);
