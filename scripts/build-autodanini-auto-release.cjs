'use strict';
/**
 * Self-contained AutoDanini visual-only release.
 * All 24 source pages and browser sources are VENDORED from the reviewed
 * AutoDanini v12 snapshot into this repository. No nested GitHub clone,
 * no external GitHub branch used during Hostinger's build.
 */
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const frontend=path.join(__dirname,'..','autodanini','staging-v12');
const out=path.resolve(__dirname,'../autodanini-auto-dist');
const pages=['index','buyers','dealers','live','inspection','import','exclusive','tender',
 'auctions','guides','digital','ai-solutions','business','cnc','selbstimport','uvoz-vodic','about','contact','impressum','privacy','terms','cookies',
 'ai-advisor','disclaimer','cenovnik','ai-primer','faq','nalog','admin','support'];
function run(args,env){
 const npm=process.platform==='win32'?'npm.cmd':'npm';
 const result=spawnSync(npm,args,{cwd:frontend,env,stdio:'inherit',shell:process.platform==='win32'});
 if(result.error)throw result.error;
 if(result.status!==0)throw new Error('AUTODANINI_SELF_CONTAINED_BUILD_FAILED '+args.join(' '));
}
if(!fs.existsSync(path.join(frontend,'vite.config.ts')))
 throw Error('AUTODANINI_VENDORED_SOURCE_MISSING');
const env={...process.env,
 NODE_ENV:'production',
 AUTODANINI_BUILD_TARGET:'hostinger',
 VITE_AUTODANINI_HOSTINGER_BUILD:'true',
 VITE_AUTODANINI_AUTH_ENABLED:'false',
 VITE_AUTODANINI_ADMIN_ENABLED:'false',
 VITE_AUTODANINI_SUBMISSIONS_ENABLED:'false',
 VITE_AUTODANINI_AI_ENABLED:'false'
};
// Vite is a devDependency. Hostinger can set NODE_ENV=production during build.
run(['install','--include=dev','--no-audit','--no-fund'],env);
run(['run','build'],env);
const compiled=path.join(frontend,'dist');
const absent=pages.filter(name=>!fs.existsSync(path.join(compiled,name+'.html')));
if(absent.length)throw Error('AUTODANINI_RELEASE_PAGES_MISSING '+absent.join(','));
for(const image of ['danini-auto-uvoz.webp','danini-pregled-auta.webp']){
 if(!fs.existsSync(path.join(compiled,image)))throw Error('AUTODANINI_RELEASE_ORIGINAL_PHOTO_MISSING '+image);
}
const admin=fs.readFileSync(path.join(compiled,'admin.html'),'utf8');
if(!admin.includes('data-page="admin"')||!admin.includes('noindex'))
 throw Error('AUTODANINI_OWNER_PAGE_UNSAFE');
fs.rmSync(out,{recursive:true,force:true});
fs.cpSync(compiled,out,{recursive:true});
// Branded asset from the reviewed design: replace the former inline monogram
// in the Cloudflare visual release only. Keep layout, photos and static safety.
for(const name of ['autodanini-mark.svg','prepurchase.html']){
 if(!fs.existsSync(path.join(out,name)))throw Error('AUTODANINI_PRELAUNCH_FILE_MISSING '+name);
}
for(const page of pages){
 const dest=path.join(out,page+'.html');
 let html=fs.readFileSync(dest,'utf8');
 let replaced=0;
 html=html.replace(/<svg class="ad-monogram"[^>]*>[\s\S]*?<\/svg>/g,()=>{
  replaced++;
  return '<img class="ad-monogram" src="/autodanini-mark.svg" width="50" height="50" alt="AutoDanini znak">';
 });
 if(!replaced && page!=='admin')throw Error('AUTODANINI_MARK_MISSING '+page);
 // AutoDanini is a distinct endorsed business line, not the DANINI master.
 // Reuse the existing, locally packaged SVG, don't generate a second icon.
 const brandPattern=/<span class="brand-lockup"><strong>[\s\S]*?<\/strong><small>[\s\S]*?<\/small><\/span>/;
 if(!brandPattern.test(html)&&page!=='admin')throw Error('AUTODANINI_HEADER_LOCKUP_MISSING '+page);
 html=html.replace(brandPattern,'<span class="brand-lockup"><strong>AutoDanini</strong><small>by DANINI · DE ↔ BALKAN</small></span>');
 html=html.replace('</head>','<link rel="icon" type="image/svg+xml" href="/autodanini-mark.svg"></head>');
 if(page==='ai-advisor'){
  // A privacy-preserving local wording check, not a paid or generative AI API.
  if(!fs.existsSync(path.join(out,'listing-helper.js')))throw Error('AUTODANINI_LISTING_HELPER_MISSING');
  if(html.includes('listing-helper.js'))throw Error('AUTODANINI_LISTING_HELPER_DUPLICATE');
  html=html.replace('</body>','<script defer src="/listing-helper.js"></script></body>');
 }
 if(page==='import'){
  // Inject AFTER Vite compilation, which may rewrite ordinary script tags.
  // Local browser-only calculator: no API cost or personal data transmission.
  if(!fs.existsSync(path.join(out,'import-v2.js')))throw Error('AUTODANINI_IMPORT_CALCULATOR_MISSING');
  if(html.includes('import-v2.js'))throw Error('AUTODANINI_IMPORT_CALCULATOR_DUPLICATED');
  html=html.replace('</body>','<script defer src="/import-v2.js"></script></body>');
 }

 // Email-first: remove public marketing WhatsApp links from footer and floating CTA.
 // User-initiated optional personal contact elsewhere remains available.
 html=html.replace(/<a\s+href="https:\/\/wa\.me\/4915730916621"[^>]*>WhatsApp[^<]*<\/a>/gi,'');
 html=html.replace(/<a\s+class="wa"[^>]*>WA<\/a>/gi,'');
 if(page==='index'){
  // Preserve the free calculator as the leading CTA and prevent a duplicate
  // gold CTA when the source homepage already includes it.
  const close='</div><div class="agent-ribbon">';
  if(!html.includes('<div class="heroactions">')||!html.includes(close))throw Error('AUTODANINI_HERO_ACTIONS_MISSING');
  const calculatorIsPrimary=html.includes('<div class="heroactions"><a class="btn gold" href="import.html">');
  const calculatorCTA='<a class="btn gold" href="/import.html"><span data-sr="Besplatan kalkulator uvoza" data-de="Kostenloser Importrechner">Besplatan kalkulator uvoza</span></a>';
  const prePurchaseCTA='<a class="btn ghost" href="/prepurchase.html"><span data-sr="Provera pre kapare" data-de="Check vor Anzahlung">Provera pre kapare</span></a>';
  html=html.replace(close,(calculatorIsPrimary?'':calculatorCTA)+prePurchaseCTA+close);
 }
 fs.writeFileSync(dest,html);
}
// SEO: the reviewed staging pages deliberately had noindex. The public
// Worker release may index ONLY useful public service/guide pages.
const indexablePages=['index','buyers','dealers','live','inspection','import',
 'exclusive','tender','guides','selbstimport','uvoz-vodic','about','contact','cenovnik','faq'];
const seoLabels={
 index:'AutoDanini',buyers:'Privatni kupci',dealers:'Za auto-kuće',live:'Live video pregled',
 inspection:'Nezavisna provera vozila',import:'Kalkulator uvoza',exclusive:'Klasična i posebna vozila',
 tender:'Ponude i tenderi',guides:'Vodiči',selbstimport:'Autoimport aus Deutschland',
 'uvoz-vodic':'Vodič za uvoz vozila',about:'O nama',contact:'Kontakt',cenovnik:'Cenovnik',faq:'Česta pitanja'
};
const seoLabelsDe={
 buyers:'Privatkunden',dealers:'Für Autohäuser',live:'Live-Videobesichtigung',
 inspection:'Unabhängige Fahrzeugprüfung',import:'Importkosten-Rechner',
 exclusive:'Besondere Fahrzeuge',tender:'Angebote und Ausschreibungen',
 guides:'Ratgeber',selbstimport:'Autoimport selbst planen',
 'uvoz-vodic':'Ratgeber Fahrzeugimport',about:'Über uns',contact:'Kontakt',
 cenovnik:'Preise',faq:'Häufige Fragen'
};
const relatedPages={
 buyers:['inspection','guides','contact'],dealers:['business','guides','contact'],
 live:['inspection','buyers','contact'],inspection:['guides','buyers','contact'],
 import:['selbstimport','uvoz-vodic','contact'],exclusive:['inspection','buyers','contact'],
 tender:['dealers','buyers','contact'],guides:['inspection','import','contact'],
 selbstimport:['import','uvoz-vodic','contact'],'uvoz-vodic':['import','selbstimport','contact'],
 about:['buyers','dealers','contact'],cenovnik:['buyers','inspection','contact'],
 faq:['guides','buyers','contact']
};
for(const page of indexablePages){
 const dest=path.join(out,page+'.html');
 let html=fs.readFileSync(dest,'utf8');
 const noindex='<meta name="robots" content="noindex,follow">';
 if(!html.includes(noindex))throw Error('AUTODANINI_SEO_META_NOT_FOUND '+page);
 html=html.replace(noindex,'<meta name="robots" content="index,follow">');
 const canonical=page==='index'?'https://daninihub.com/':
  'https://daninihub.com/'+page+'.html';
 const alternates=page==='index'?
  '<link rel="alternate" hreflang="sr" href="https://daninihub.com/">'+
  '<link rel="alternate" hreflang="de" href="https://daninihub.com/de/">'+
  '<link rel="alternate" hreflang="x-default" href="https://daninihub.com/">':
  (page==='selbstimport'||page==='uvoz-vodic'?
    '<link rel="alternate" hreflang="sr" href="https://daninihub.com/uvoz-vodic.html">'+
    '<link rel="alternate" hreflang="de" href="https://daninihub.com/selbstimport.html">':'');
 html=html.replace('</head>','<link rel="canonical" href="'+canonical+'">'+alternates+'</head>');
 // The import calculator is only indicative. Its title must NOT promise
 // registration-ready all-in costs, because several charges are unknown.
 if(page==='import'){
  const seoTitle='Kalkulator uvoza auta – Srbija, BiH i Hrvatska';
  html=html.replace(/<title>[^<]*<\/title>/,
   '<title>'+seoTitle+'</title>');
  html=html.replace(/(<meta property="og:title" content=")[^"]*(")/,
   '$1'+seoTitle+'$2');
  html=html.replace(/(<meta name="description" content=")[^"]*(")/,
   '$1Besplatan kalkulator uvoza iz Nemačke u Srbiju, BiH i Hrvatsku. Procenite carinu, PDV, PPMV, transport i dodatne troškove.$2');
 }
 if(page!=='index'&&page!=='contact'){
  // Plain descriptive internal links improve visitor discovery without promising unavailable services.
  const related=(relatedPages[page]||['buyers','guides','contact']);
  const cards=related.map(link=>{
   const sr=seoLabels[link]||link,de=seoLabelsDe[link]||sr;
   return '<a href="/'+link+'.html"><span data-sr="'+sr+'" data-de="'+de+'">'+sr+'</span><span aria-hidden="true">↗</span></a>';
  }).join('');
  const section='<section class="dn-related section" aria-label="Povezane stranice / Weiterführende Links"><div class="wrap"><span class="dn-related-eyebrow">AUTODANINI · SAZNAJTE VIŠE / MEHR ERFAHREN</span><h2 data-sr="Sledeći korak" data-de="Ihr nächster Schritt">Sledeći korak</h2><div class="dn-related-grid">'+cards+'</div></div></section>';
  if(!html.includes('</main>'))throw Error('Missing semantic main: '+page);
  html=html.replace('</main>',section+'</main>');
 }
 const breadcrumb=page==='index'?[]:[
  {'@type':'ListItem',position:1,name:'DANINI / AutoDanini',item:'https://daninihub.com/'},
  {'@type':'ListItem',position:2,name:seoLabels[page]||page,item:canonical}
 ];
 if(breadcrumb.length){
  const schema={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:breadcrumb};
  html=html.replace('</head>','<script type="application/ld+json">'+JSON.stringify(schema)+'</script></head>');
 }
 fs.writeFileSync(dest,html);
}
// Match legacy URLs to equivalent new content; never redirect everything home.
const legacyRedirects=[
  "# DANINI SEO legacy routes identified in Search Console export",
  "/de/wissen/deutschland-selbstimport /selbstimport.html 301",
  "/de/autoimport /selbstimport.html 301",
  "/de/wissen/uvoz-zoll-eur1-i-dovoz /selbstimport.html 301",
  "/sr/vodic/uvoz-zoll-eur1-i-dovoz /uvoz-vodic.html 301",
  "/sr/uvoz-auta /uvoz-vodic.html 301",
  "/sr/kalkulator /import.html 301",
  "/de/rechner /import.html 301",
  "/de/wissen/landed-cost-kalkulation /import.html 301",
  "/de/fahrzeugpruefung /inspection.html 301",
  "/de/b2b-fahrzeugsuche /dealers.html 301",
  "/sr/b2b-pretraga-vozila /dealers.html 301",
  "/de/ratgeber /guides.html 301",
  "/sr/vodici /guides.html 301",
  "/de/impressum /impressum.html 301",
  "/de/datenschutz /privacy.html 301",
  "/de/bedingungen /terms.html 301",
  "/de/wissen/provera-oglasa-pre-kapare /prepurchase.html 301"
];
fs.writeFileSync(path.join(out,'_redirects'),legacyRedirects.join('\n')+'\n');
// Publish the already-reviewed, separate DANINI umbrella-brand page without
// replacing the established AutoDanini landing page or touching legal routes.
// The preview remains in GitHub; publication uses an explicit development-stage
// disclaimer rather than pretending all planned services are already available.
const umbrellaSource=path.resolve(__dirname,'../docs/brand-preview/danini-master-preview.html');
if(!fs.existsSync(umbrellaSource))throw Error('DANINI_MASTER_BRAND_PREVIEW_MISSING');
let umbrella=fs.readFileSync(umbrellaSource,'utf8');
for(const [before,after] of [
  ['<meta name="robots" content="noindex,nofollow">','<meta name="robots" content="index,follow">'],
  [' | Designentwurf</title>',' | DANINI</title>'],
  ['DANINI befindet sich in der Entwicklungs- und Prüfphase. Diese Seite ist ein Entwurf, kein öffentliches Beta-Angebot und keine Buchungsmöglichkeit.',
   'DANINI befindet sich in der Entwicklungs- und Prüfphase. Angebote und Termine werden nur nach individueller Prüfung bestätigt.'],
  ['DANINI je u razvojnoj i testnoj fazi. Ova stranica je nacrt, nije javna ponuda za besplatan pilot ili naručivanje usluge.',
   'DANINI je u razvojnoj i testnoj fazi. Ponude i termini važe tek posle pojedinačne provere i potvrde.'],
  ['© DANINI · Design preview only / samo nacrt · Bez plaćanja, prikupljanja podataka ili aktivne forme.',
   '© DANINI · Razvojna faza / Entwicklungsphase · Bez online naplate ili obrasca / Keine Online-Zahlung oder Formular.'],
  ["'DANINI — Über uns und Methode | Entwurf'","'DANINI — Dachmarke und Methode'"],
  ["'DANINI — O nama i metoda | Nacrt'","'DANINI — Krovni brend i metoda'"]
]){
 if(!umbrella.includes(before))throw Error('DANINI_MASTER_COPY_MARKER_MISSING '+before.slice(0,55));
 umbrella=umbrella.replace(before,after);
}
umbrella=umbrella.replace('</head>',
  '<link rel="canonical" href="https://daninihub.com/danini.html">'+
  '<link rel="alternate" hreflang="de" href="https://daninihub.com/danini.html">'+
  '<link rel="alternate" hreflang="sr" href="https://daninihub.com/danini.html">'+
  '</head>');
umbrella=umbrella.replace('<div class="switch" role="group"',
  '<a href="/index.html" style="color:#fff;text-decoration:underline;font-size:13px;margin-left:auto;margin-right:16px">AutoDanini ↗</a><div class="switch" role="group"');
umbrella=umbrella.replace('<div class="note">DANINI befindet sich',
  '<div class="actions"><a class="btn btn-secondary" href="/buyers.html">AutoDanini — Fahrzeuge ↗</a><a class="btn btn-secondary" href="/business.html">DANINI Business ↗</a></div><div class="note">DANINI befindet sich');
umbrella=umbrella.replace('<div class="note">DANINI je u razvojnoj',
  '<div class="actions"><a class="btn btn-secondary" href="/buyers.html">AutoDanini — vozila ↗</a><a class="btn btn-secondary" href="/business.html">DANINI Business ↗</a></div><div class="note">DANINI je u razvojnoj');
// Separate language URLs for Google and visitors. Don't place two hreflang
// languages on the same canonical URL.
umbrella=umbrella.replace(/<link rel="alternate" hreflang="sr" href="https:\/\/daninihub.com\/danini.html">/,
 '<link rel="alternate" hreflang="sr" href="https://daninihub.com/danini-sr.html">');
umbrella=umbrella.replace('</head>', '<link rel="alternate" hreflang="x-default" href="https://daninihub.com/danini.html"></head>');
umbrella=umbrella.replace("document.getElementById('sr').addEventListener('click',()=>setLocale('sr'));",
 "document.getElementById('sr').addEventListener('click',()=>{location.href='/danini-sr.html'});");
function addBrandSocialMeta(html,language){
 const de=language==='de';
 const title=de?'DANINI — Klar entscheiden mit KI':'DANINI — Pitaj AI, AI pita tebe';
 const description=de?
  'DANINI verbindet nachvollziehbare Analysen und digitale Geschäftskommunikation zwischen Deutschland und dem Balkan.':
  'DANINI povezuje proverljive analize i digitalnu poslovnu komunikaciju između Nemačke i Balkana.';
 const url=de?'https://daninihub.com/danini.html':'https://daninihub.com/danini-sr.html';
 const tags=[
  ['og:type','website'],['og:site_name','DANINI'],
  ['og:title',title],['og:description',description],['og:url',url],
  ['og:locale',de?'de_DE':'sr_RS']
 ].map(([property,value])=>'<meta property="'+property+'" content="'+value+'">').join('');
 if(!html.includes('</head>'))throw Error('DANINI_SOCIAL_HEAD_MISSING_'+language);
 return html.replace('</head>',tags+'<meta name="twitter:card" content="summary"></head>');
}
const daniniSiteSchema={'@context':'https://schema.org','@type':'WebSite',name:'DANINI',url:'https://daninihub.com/',inLanguage:['de-DE','sr-RS'],publisher:{'@type':'Person',name:'Dragan Zdravković',url:'https://daninihub.com/danini.html'}};
function withBrandSchema(html){
 return html.replace('</head>','<script type="application/ld+json">'+JSON.stringify(daniniSiteSchema)+'</script></head>');
}
fs.writeFileSync(path.join(out,'danini.html'),withBrandSchema(addBrandSocialMeta(umbrella,'de')));
let umbrellaSr=umbrella
 .replace('<html lang="de">','<html lang="sr">')
 .replace('DANINI — Von der richtigen Frage zur nachvollziehbaren Entscheidung | DANINI','DANINI — Pitaj AI, AI pita tebe | Brend DANINI')
 .replace('DANINI: Menschen fragen, KI fragt zurück. Eine verantwortungsvolle Methode für klare Entscheidungen und konkrete nächste Schritte.',
 'DANINI: Pitaj AI — AI pita tebe. Odgovorna metoda za jasne odluke, proveru informacija i konkretne sledeće korake.')
 .replace('<link rel="canonical" href="https://daninihub.com/danini.html">',
 '<link rel="canonical" href="https://daninihub.com/danini-sr.html">')
 .replace("document.getElementById('de').addEventListener('click',()=>setLocale('de'));",
 "document.getElementById('de').addEventListener('click',()=>{location.href='/danini.html'});")
 .replace("setLocale('de');","setLocale('sr');")
 .replace('<div lang="sr" data-locale="sr" hidden>','<div lang="sr" data-locale="sr">')
 .replace('<div lang="de" data-locale="de">','<div lang="de" data-locale="de" hidden>');
if(!umbrellaSr.includes('content="DANINI: Pitaj AI')||
 !umbrellaSr.includes('href="https://daninihub.com/danini-sr.html"')||
 !umbrellaSr.includes("setLocale('sr');"))throw Error('DANINI_SR_LOCALE_BUILD_INVALID');
fs.writeFileSync(path.join(out,'danini-sr.html'),withBrandSchema(addBrandSocialMeta(umbrellaSr,'sr')));

if(!umbrella.includes('href="/index.html"')||!umbrella.includes('rel="canonical"')||!umbrella.includes('Pitaj AI — AI pita tebe'))throw Error('DANINI_MASTER_OUTPUT_FAILED');
// A real indexable sitemap. Do not include account, admin, incomplete AI,
// empty auctions, legal holding pages or any pretend inventory.
const sitemapEntries=['https://daninihub.com/','https://daninihub.com/de/','https://daninihub.com/danini.html','https://daninihub.com/danini-sr.html','https://daninihub.com/prepurchase.html',
 ...indexablePages.filter(p=>p!=='index').map(p=>'https://daninihub.com/'+p+'.html')];
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n'+
 '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
 sitemapEntries.map(url=>'  <url><loc>'+url+'</loc></url>').join('\n')+
 '\n</urlset>\n';
fs.writeFileSync(path.join(out,'sitemap.xml'),sitemap);
fs.writeFileSync(path.join(out,'robots.txt'),
 'User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /payment/\nDisallow: /owner/\n'+
 'Sitemap: https://daninihub.com/sitemap.xml\n');
// The public Cloudflare static release must include real /de/ and /sr/ entry
// points. Without these files, Workers static assets return 404 for /de/.
// The source site uses client-side DE/SR switching; prime the language before
// its Vite module loads and make all links/assets root-relative so /de/ does
// not accidentally request /de/assets/* or /de/buyers.html.
const rootHome=fs.readFileSync(path.join(out,'index.html'),'utf8');
// Make the German page readable and indexable without client-side translation.
function germanTextInStaticHome(html){
  return html.replace(/(<span\b[^>]*\bdata-de="([^"]*)"[^>]*>)([^<]*)(<\/span>)/g,
    (_full,open,de,_old,close)=>open+de+close);
}
for(const locale of ['sr','de']){
  let localized=rootHome
    .replace('<html lang="sr">','<html lang="'+locale+'">')
    .replace(/\b(href|src)=(["'])([^"']+)\2/g,(full,attribute,quote,url)=>{
      if(/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(url))return full;
      return attribute+'='+quote+'/'+url.replace(/^\.\//,'')+quote;
    })
    .replace(/url\((['"]?)\.\/([^)'"]+)\1\)/g,
      (full,quote,url)=>'url('+quote+'/'+url+quote+')');
  localized=localized.replace('</head>',
    '<script>try{localStorage.setItem("autodanini-language","'+locale+'")}catch(_){}</script></head>');
  // /sr/ duplicates the root SR landing page and stays canonical to '/'.
  // /de/ is a distinct indexed entrypoint with its own canonical URL.
  if(locale==='de'){
    localized=germanTextInStaticHome(localized);
    localized=localized.replace(/(<link rel="canonical" href=")[^"]*(")/,
      '$1https://daninihub.com/de/$2');
    localized=localized.replace(/<title>[^<]*<\/title>/,
      '<title>DANINI | Autokauf selbst vorbereiten · Hilfe auf Anfrage</title>');
    localized=localized.replace(/(<meta name="description" content=")[^"]*(")/,
      '$1DANINI Auto: Fahrzeugdossier selbst erstellen, Unterlagen prüfen und Importkosten einschätzen. Unabhängige Hilfe nur bei Bedarf, keine aktiven Online-Zahlungen.$2');
  }
  const localeDir=path.join(out,locale);
  fs.mkdirSync(localeDir,{recursive:true});
  fs.writeFileSync(path.join(localeDir,'index.html'),localized);
  if(!localized.includes('autodanini-language') ||
     !localized.includes('href="/buyers.html"') ||
     !localized.includes('/assets/'))
    throw Error('AUTODANINI_LOCALE_BUILD_INVALID '+locale);
}
fs.writeFileSync(path.join(out,'AUTODANINI_RELEASE_INFO.json'),
 JSON.stringify({site:'AutoDanini',source:'vendored-reviewed-v12-20261022',pages:pages.length,
  releaseMode:'public-visual-only',accounts:false,admin:false,payments:false,ai:false},null,2)+'\n');
console.log('AutoDanini self-contained release complete:',pages.length,'pages');
