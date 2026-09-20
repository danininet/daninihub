'use strict';

const express=require('express');
const fs=require('fs');
const path=require('path');

const FRONT=path.join(__dirname,'daninihub-front','dist');
const INDEX=path.join(FRONT,'index.html');

const ROUTES={
  '/de/':{
    lang:'de',
    title:'Danini ImportOS | Fahrzeugimport DE/CH → Serbien',
    description:'Import Passport, SafeBuy, Model DNA, Fahrzeugprüfung in Deutschland, Originalteile, Überführung und Import Base Čalije für Importe aus Deutschland und der Schweiz nach Serbien.',
    snapshot:'<main><h1>Danini ImportOS – vom Inserat bis zur sicheren Import-Entscheidung</h1><p>ImportOS verbindet Importfähigkeit, Herkunft/EUR.1, Zoll und PDV, Fraud Shield, Model DNA, reale Fahrzeugprüfung, Originalteile, Überführung und eine optionale Import-Basis in Niš.</p><h2>DECIDE · VERIFY · EXECUTE</h2><p>Kostenkorridor statt Fake-Präzision, Vor-Ort-Prüfung ab Duisburg, unabhängige professionelle Kaufprüfung, Teilebeschaffung und Fahrzeugüberführung auf eigener Achse oder über Transportpartner.</p></main>'
  },
  '/sr/':{
    lang:'sr',
    title:'Danini ImportOS | Uvoz automobila DE/CH → Srbija',
    description:'Import Passport, SafeBuy, Model DNA, pregled vozila u Nemačkoj, originalni delovi, dovoz i Import Base Čalije za uvoz iz Nemačke i Švajcarske u Srbiju.',
    snapshot:'<main><h1>Danini ImportOS – od oglasa do sigurne odluke o uvozu</h1><p>ImportOS spaja mogućnost uvoza, poreklo/EUR.1, carinu i PDV, Fraud Shield, Model DNA, stvarni pregled vozila, originalne delove, dovoz i opcionu Import Base lokaciju u Nišu.</p><h2>DECIDE · VERIFY · EXECUTE</h2><p>Raspon troška umesto lažne preciznosti, obilazak vozila iz Duisburga, nezavisni profesionalni pregled, nabavka delova i dovoz na točkovima ili preko transportnog partnera.</p></main>'
  },
  '/de/impressum':{lang:'de',title:'Impressum | Danini ImportOS',description:'Anbieterkennzeichnung und Kontakt von Danini ImportOS.',snapshot:'<main><h1>Impressum</h1><p>Dragan Zdravković · DaniniHub / Danini ImportOS · Fischerstraße 54 · 47055 Duisburg · Deutschland · info@daninihub.com</p></main>'},
  '/sr/impressum':{lang:'sr',title:'Impresum | Danini ImportOS',description:'Podaci o pružaocu Danini ImportOS.',snapshot:'<main><h1>Impresum</h1><p>Dragan Zdravković · DaniniHub / Danini ImportOS · Fischerstraße 54 · 47055 Duisburg · Nemačka · info@daninihub.com</p></main>'},
  '/de/datenschutz':{lang:'de',title:'Datenschutz | Danini ImportOS',description:'Datenschutzhinweise für ImportOS QuickCheck, Passport und Serviceanfragen.',snapshot:'<main><h1>Datenschutz</h1><p>Hinweise zur Verarbeitung von Fahrzeug-, Kontakt-, Zahlungs- und Servicedaten bei Danini ImportOS.</p></main>'},
  '/sr/privatnost':{lang:'sr',title:'Privatnost | Danini ImportOS',description:'Privatnost za ImportOS QuickCheck, Passport i servisne upite.',snapshot:'<main><h1>Privatnost</h1><p>Informacije o obradi podataka o vozilu, kontaktu, plaćanju i servisnim upitima.</p></main>'},
  '/de/cookies':{lang:'de',title:'Cookies | Danini ImportOS',description:'Technisch notwendige Speicherung bei Danini ImportOS.',snapshot:'<main><h1>Cookies</h1><p>ImportOS aktiviert derzeit keine Werbe- oder Marketing-Cookies.</p></main>'},
  '/sr/kolacici':{lang:'sr',title:'Kolačići | Danini ImportOS',description:'Tehnički neophodna memorija na Danini ImportOS.',snapshot:'<main><h1>Kolačići</h1><p>ImportOS trenutno ne aktivira reklamne ili marketinške kolačiće.</p></main>'},
  '/de/bedingungen':{lang:'de',title:'Nutzungsrahmen | Danini ImportOS',description:'Rahmen für Import Passport, Fahrzeugprüfung, Teile, Überführung und Import Base.',snapshot:'<main><h1>Nutzungs- und Leistungsrahmen</h1><p>ImportOS ist eine Entscheidungshilfe. Fachprüfung, Fahrerleistung, Teilebeschaffung, Transport und Import Base haben gesonderte Bedingungen.</p></main>'},
  '/sr/uslovi':{lang:'sr',title:'Uslovi | Danini ImportOS',description:'Okvir za Import Passport, pregled vozila, delove, dovoz i Import Base.',snapshot:'<main><h1>Okvir korišćenja i usluga</h1><p>ImportOS je pomoć pri odluci. Stručni pregled, usluga vozača, nabavka delova, transport i Import Base imaju posebne uslove.</p></main>'}
};

function inject(route){
  const meta=ROUTES[route];
  let html=fs.readFileSync(INDEX,'utf8');
  const canonical='https://daninihub.com'+route;
  html=html.replace(/<html[^>]*>/,`<html lang="${meta.lang}">`);
  html=html.replace(/<title>[^<]*<\/title>/,`<title>${meta.title}</title>`);
  html=html.replace(/<meta name="description" content="[^"]*"/,`<meta name="description" content="${meta.description}"`);
  html=html.replace('</head>',`<link rel="canonical" href="${canonical}"><meta property="og:title" content="${meta.title}"><meta property="og:description" content="${meta.description}"></head>`);
  html=html.replace('<div id="root"></div>',`<div id="root">${meta.snapshot}</div>`);
  return html;
}

function mountPublicRuntime(app){
  app.get('/',(req,res)=>res.redirect(308,'/de/'));
  app.get('/de',(req,res)=>res.redirect(308,'/de/'));
  app.get('/sr',(req,res)=>res.redirect(308,'/sr/'));
  app.get('/en',(req,res)=>res.redirect(308,'/de/'));

  app.get('/robots.txt',(req,res)=>res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /importos/success\nSitemap: https://daninihub.com/sitemap.xml\n'));
  app.get('/sitemap.xml',(req,res)=>{
    const urls=Object.keys(ROUTES).map(route=>`<url><loc>https://daninihub.com${route}</loc><lastmod>2026-09-21</lastmod></url>`).join('');
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  });

  app.get(Object.keys(ROUTES),(req,res)=>{
    const route=req.path.endsWith('/')?req.path:req.path;
    const normalized=ROUTES[route]?route:(ROUTES[route+'/']?route+'/':route);
    if(!ROUTES[normalized])return res.status(404).end();
    res.set('Cache-Control','no-store, no-cache, must-revalidate');
    res.type('html').send(inject(normalized));
  });

  app.use(express.static(FRONT,{index:false,maxAge:'1h'}));
}

module.exports={mountPublicRuntime,ROUTES};
