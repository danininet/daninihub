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
 html=html.replace('</head>','<link rel="icon" type="image/svg+xml" href="/autodanini-mark.svg"></head>');
 if(page==='index'){
  // Maintain the chosen self-service dossier as the first action.
  // Keep the existing pre-purchase tool reachable but secondary.
  const close='</div><div class="agent-ribbon">';
  if(!html.includes('<div class="heroactions">')||!html.includes(close))throw Error('AUTODANINI_HERO_ACTIONS_MISSING');
  html=html.replace(close,
   '<a class="btn ghost" href="/prepurchase.html"><span data-sr="Provera pre kapare" data-de="Check vor Anzahlung">Provera pre kapare</span></a>'+close);
 }
 fs.writeFileSync(dest,html);
}
// SEO: the reviewed staging pages deliberately had noindex. The public
// Worker release may index ONLY useful public service/guide pages.
const indexablePages=['index','buyers','dealers','live','inspection','import',
 'exclusive','tender','guides','selbstimport','uvoz-vodic','about','contact','cenovnik','faq'];
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
  const seoTitle='Kalkulator uvoza auta iz Nemačke (carina i PDV) | AutoDanini';
  html=html.replace(/<title>[^<]*<\/title>/,
   '<title>'+seoTitle+'</title>');
  html=html.replace(/(<meta property="og:title" content=")[^"]*(")/,
   '$1'+seoTitle+'$2');
  html=html.replace(/(<meta name="description" content=")[^"]*(")/,
   '$1Orijentacioni kalkulator uvoza vozila iz Nemačke u Srbiju: scenariji carine i PDV-a. Konačna osnovica i dodatni troškovi zahtevaju potvrdu.$2');
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
// Publish the previously approved DANINI umbrella design as a separate
// first-class public brand page. Keep the established AutoDanini SEO home
// intact until a separately reviewed canonical migration is justified.
const brandSource=path.join(__dirname,'..','docs','brand-preview','danini-master-preview.html');
let brand=fs.readFileSync(brandSource,'utf8');
if(!brand.includes('data-locale="de"')||!brand.includes('data-locale="sr"'))
 throw Error('DANINI_MASTER_BRAND_LOCALES_MISSING');
brand=brand.replace('<meta name="robots" content="noindex,nofollow">',
 '<meta name="robots" content="index,follow"><link rel="canonical" href="https://daninihub.com/danini.html">');
brand=brand.replace(' | Designentwurf</title>','</title>');
brand=brand.replace('Diese Seite ist ein Entwurf, kein öffentliches Beta-Angebot und keine Buchungsmöglichkeit.',
 'Die Inhalte dienen der Orientierung. Konkrete Leistungen und Konditionen werden vor einer Beauftragung individuell bestätigt.');
brand=brand.replace('Ova stranica je nacrt, nije javna ponuda za besplatan pilot ili naručivanje usluge.',
 'Ova stranica je informativna; konkretna usluga i uslovi potvrđuju se pre bilo kakvog angažovanja.');
brand=brand.replace('© DANINI · Design preview only / samo nacrt · Bez plaćanja, prikupljanja podataka ili aktivne forme.',
 '© DANINI · Krovni brend · DE / SR · Bez online naplate na ovoj stranici. <a href="/impressum.html">Impressum</a> · <a href="/privacy.html">Datenschutz</a>');
brand=brand.replace('<a class="logo" href="#top" aria-label="DANINI">',
 '<a class="logo" href="/danini.html" aria-label="DANINI">');
brand=brand.replace('<div class="switch" role="group"',
 '<a href="/index.html" style="color:#facc15;font-weight:700;text-decoration:none" aria-label="AutoDanini">AutoDanini ↗</a><div class="switch" role="group"');
brand=brand.replace('<section class="content"><div class="shell"><span class="section-label">Über DANINI</span>',
 '<section class="content"><div class="shell"><span class="section-label">Über DANINI</span>');
brand=brand.replace('href="#kontakt-de">Kontakt</a>',
 'href="/contact.html">Kontakt / Anfrage</a>');
brand=brand.replace('href="#kontakt-sr">Kontakt</a>',
 'href="/contact.html">Kontakt / Upit</a>');
brand=brand.replace('</main>',
 '<section class="content soft"><div class="shell"><span class="section-label">DANINI Auto · DE ↔ Balkan</span><h2>AutoDanini — praktična prva oblast / erster Geschäftsbereich</h2><p class="lead">Digitalni dosije vozila, provera dostupnih dokaza i okvirni obračun uvoza. Fahrzeugdossier, Nachweis-Check und grobe Importkalkulation. Bez garancije stanja vozila; keine verbindliche Kaufzusage.</p><div class="actions"><a class="btn btn-primary" href="/buyers.html">AutoDanini / Privatkunden</a><a class="btn" style="border:1px solid #64748b" href="/contact.html">Kontakt / Anfrage</a></div></div></section></main>');
if(!brand.includes('href="/buyers.html"')||!brand.includes('href="/privacy.html"'))
 throw Error('DANINI_MASTER_BRAND_LINKS_MISSING');
fs.writeFileSync(path.join(out,'danini.html'),brand);
// A real indexable sitemap. Do not include account, admin, incomplete AI,
// empty auctions, legal holding pages or any pretend inventory.
const sitemapEntries=['https://daninihub.com/danini.html','https://daninihub.com/','https://daninihub.com/de/','https://daninihub.com/prepurchase.html',
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
