'use strict';

const express=require('express');
const fs=require('fs');
const path=require('path');

const FRONT=path.join(__dirname,'daninihub-front','dist');
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
  '/de/':{lang:'de',title:'DANINI | Automotive Import Intelligence',description:'Import Passport, SafeBuy, Model DNA, Fahrzeugprüfung, Payment Protection, Originalteile, Überführung und Import Base Čalije für DE/CH → RS.',snapshot:'<main><h1>DANINI — Automotive Import Intelligence</h1><p>Vom Inserat bis zur sicheren Import-Entscheidung: Import Passport, SafeBuy, Model DNA, reale Prüfung, Originalteile, Payment Protection, Fahrzeugüberführung und Import Base in Niš.</p><h2>DECIDE · VERIFY · EXECUTE</h2><p>Ein sichtbarer Prozess von Suche und Ursprung über Fahrzeugprüfung und Zahlungsautorisierung bis Ausführung.</p></main>'},
  '/sr/':{lang:'sr',title:'DANINI | Automotive Import Intelligence',description:'Import Passport, SafeBuy, Model DNA, pregled vozila, zaštita plaćanja, originalni delovi, dovoz i Import Base Čalije za DE/CH → RS.',snapshot:'<main><h1>DANINI — Automotive Import Intelligence</h1><p>Od oglasa do sigurne odluke: Import Passport, SafeBuy, Model DNA, stvarni pregled, originalni delovi, zaštićena autorizacija plaćanja, dovoz i Import Base u Nišu.</p><h2>DECIDE · VERIFY · EXECUTE</h2><p>Vidljiv tok od pretrage i porekla preko pregleda vozila i autorizacije plaćanja do izvršenja.</p></main>'},
  '/de/impressum':{lang:'de',title:'Impressum | DANINI',description:'Anbieterkennzeichnung und Kontakt von DANINI.',snapshot:'<main><h1>Impressum</h1><p>Dragan Zdravković · DaniniHub / DANINI · Fischerstraße 54 · 47055 Duisburg · Deutschland · info@daninihub.com</p></main>'},
  '/sr/impressum':{lang:'sr',title:'Impresum | DANINI',description:'Podaci o pružaocu DANINI.',snapshot:'<main><h1>Impresum</h1><p>Dragan Zdravković · DaniniHub / DANINI · Fischerstraße 54 · 47055 Duisburg · Nemačka · info@daninihub.com</p></main>'},
  '/de/datenschutz':{lang:'de',title:'Datenschutz | DANINI',description:'Datenschutzhinweise für QuickCheck, Passport, Serviceanfragen und Zahlungsautorisierung.',snapshot:'<main><h1>Datenschutz</h1><p>Hinweise zu Fahrzeug-, Kontakt-, Zahlungs- und Servicedaten.</p></main>'},
  '/sr/privatnost':{lang:'sr',title:'Privatnost | DANINI',description:'Privatnost za QuickCheck, Passport, servisne upite i autorizaciju plaćanja.',snapshot:'<main><h1>Privatnost</h1><p>Informacije o obradi podataka o vozilu, kontaktu, plaćanju i servisima.</p></main>'},
  '/de/cookies':{lang:'de',title:'Cookies | DANINI',description:'Technisch notwendige Speicherung bei DANINI.',snapshot:'<main><h1>Cookies</h1><p>DANINI aktiviert derzeit keine Werbe- oder Marketing-Cookies.</p></main>'},
  '/sr/kolacici':{lang:'sr',title:'Kolačići | DANINI',description:'Tehnički neophodna memorija na DANINI sajtu.',snapshot:'<main><h1>Kolačići</h1><p>DANINI trenutno ne aktivira reklamne ili marketinške kolačiće.</p></main>'},
  '/de/bedingungen':{lang:'de',title:'Nutzungsrahmen | DANINI',description:'Rahmen für Import Passport, Prüfung, Payment Protection, Teile, Überführung und Import Base.',snapshot:'<main><h1>Nutzungs- und Leistungsrahmen</h1><p>ImportOS ist eine Entscheidungshilfe. Autorisierung und spätere Erfassung von Zahlungen erfolgen nur für bestätigte Serviceangebote.</p></main>'},
  '/sr/uslovi':{lang:'sr',title:'Uslovi | DANINI',description:'Okvir za Import Passport, pregled, rezervaciju plaćanja, delove, dovoz i Import Base.',snapshot:'<main><h1>Okvir korišćenja i usluga</h1><p>ImportOS je pomoć pri odluci. Autorizacija i naknadna naplata odnose se samo na potvrđenu ponudu usluge.</p></main>'}
};

for(const [slug,deTitle,srTitle,deDesc,srDesc] of articles){
  ROUTES['/de/wissen/'+slug]={lang:'de',title:deTitle+' | DANINI Wissen',description:deDesc,snapshot:'<main><h1>'+deTitle+'</h1><p>'+deDesc+'</p><p>DANINI Knowledge Garage · DE/CH → RS</p></main>'};
  ROUTES['/sr/vodic/'+slug]={lang:'sr',title:srTitle+' | DANINI vodič',description:srDesc,snapshot:'<main><h1>'+srTitle+'</h1><p>'+srDesc+'</p><p>DANINI Knowledge Garage · DE/CH → RS</p></main>'};
}

function inject(route){
  const meta=ROUTES[route];
  let html=fs.readFileSync(INDEX,'utf8');
  const canonical='https://daninihub.com'+route;
  html=html.replace(/<html[^>]*>/,'<html lang="'+meta.lang+'">');
  html=html.replace(/<title>[^<]*<\/title>/,'<title>'+meta.title+'</title>');
  html=html.replace(/<meta name="description" content="[^"]*"/,'<meta name="description" content="'+meta.description+'"');
  html=html.replace('</head>','<link rel="canonical" href="'+canonical+'"><meta property="og:title" content="'+meta.title+'"><meta property="og:description" content="'+meta.description+'"></head>');
  html=html.replace('<div id="root"></div>','<div id="root">'+meta.snapshot+'</div>');
  return html;
}

function mountPublicRuntime(app){
  app.get('/',(req,res)=>res.redirect(308,'/de/'));
  app.get('/de',(req,res)=>res.redirect(308,'/de/'));
  app.get('/sr',(req,res)=>res.redirect(308,'/sr/'));
  app.get('/en',(req,res)=>res.redirect(308,'/de/'));
  app.get('/owner/importos',(req,res)=>{res.set('X-Robots-Tag','noindex,nofollow');res.set('Cache-Control','no-store');return res.sendFile(INDEX)});

  app.get('/robots.txt',(req,res)=>res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /importos/success\nDisallow: /payment/\nDisallow: /owner/\nSitemap: https://daninihub.com/sitemap.xml\n'));
  app.get('/sitemap.xml',(req,res)=>{
    const urls=Object.keys(ROUTES).map(route=>'<url><loc>https://daninihub.com'+route+'</loc><lastmod>2026-09-21</lastmod></url>').join('');
    res.type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls+'</urlset>');
  });

  app.get(Object.keys(ROUTES),(req,res)=>{
    const route=ROUTES[req.path]?req.path:(ROUTES[req.path+'/']?req.path+'/':req.path);
    if(!ROUTES[route])return res.status(404).end();
    res.set('Cache-Control','no-store, no-cache, must-revalidate');
    res.type('html').send(inject(route));
  });

  app.use(express.static(FRONT,{index:false,maxAge:'1h'}));
}

module.exports={mountPublicRuntime,ROUTES};
