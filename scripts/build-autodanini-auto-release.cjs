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
 'auctions','guides','about','contact','impressum','privacy','terms','cookies',
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
// SEO: the reviewed staging pages deliberately had noindex. The public
// Worker release may index ONLY useful public service/guide pages.
const indexablePages=['index','buyers','dealers','live','inspection','import',
 'exclusive','tender','guides','about','contact','cenovnik','faq'];
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
  '<link rel="alternate" hreflang="x-default" href="https://daninihub.com/">':'';
 html=html.replace('</head>','<link rel="canonical" href="'+canonical+'">'+alternates+'</head>');
 // The import calculator is only indicative. Its title must NOT promise
 // registration-ready all-in costs, because several charges are unknown.
 if(page==='import'){
  const seoTitle='Kalkulator uvoza auta iz Nemačke (carina i PDV) | AutoDanini';
  html=html.replace(/<title>[^<]*<\\/title>/,
   '<title>'+seoTitle+'</title>');
  html=html.replace(/(<meta property="og:title" content=")[^"]*(")/,
   '$1'+seoTitle+'$2');
  html=html.replace(/(<meta name="description" content=")[^"]*(")/,
   '$1Orijentacioni kalkulator uvoza vozila iz Nemačke u Srbiju: scenariji carine i PDV-a. Konačna osnovica i dodatni troškovi zahtevaju potvrdu.$2');
 }
 fs.writeFileSync(dest,html);
}
// A real indexable sitemap. Do not include account, admin, incomplete AI,
// empty auctions, legal holding pages or any pretend inventory.
const sitemapEntries=['https://daninihub.com/','https://daninihub.com/de/',
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
    localized=localized.replace(/(<link rel="canonical" href=")[^"]*(")/,
      '$1https://daninihub.com/de/$2');
    localized=localized.replace(/<title>[^<]*<\/title>/,
      '<title>AutoDanini | Fahrzeugprüfung und Importberatung</title>');
    localized=localized.replace(/(<meta name="description" content=")[^"]*(")/,
      '$1Fahrzeugangebote vergleichen, Dokumente prüfen, Besichtigung und Import nach Serbien vorbereiten. Unabhängige Unterstützung zwischen Deutschland und Balkan.$2');
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
