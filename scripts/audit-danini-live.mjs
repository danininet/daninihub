// DANINI / Non-invasive public production audit. No form submissions or payments.
import {writeFileSync} from 'node:fs';
const origin='https://daninihub.com';
const pages=['/','/de/','/sr/','/danini.html','/danini-sr.html',...['index','buyers','dealers','live','inspection','import','exclusive','tender','auctions','guides','digital','ai-solutions','business','cnc','selbstimport','uvoz-vodic','about','contact','impressum','privacy','terms','cookies','ai-advisor','disclaimer','cenovnik','ai-primer','faq','nalog','admin','support','prepurchase'].map(p=>'/'+p+'.html')];
const problems=[], findings=[];
async function get(path){try{const r=await fetch(origin+path,{redirect:'follow',signal:AbortSignal.timeout(16000),headers:{'user-agent':'DANINI-technical-QA/2026','accept':'text/html,application/xml,image/svg+xml,*/*'}});const body=await r.text();return {status:r.status,body,headers:r.headers,final:r.url}}catch(e){return {status:0,body:'',error:String(e)}}}
function title(s){return (s.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]?.trim()||''}
function meta(s,name){const tags=[...s.matchAll(/<meta\b[^>]*>/gi)].map(x=>x[0]);return tags.filter(x=>new RegExp('(?:name|property)=["\']'+name+'["\']','i').test(x))}
function anchors(s){return [...s.matchAll(/<a\b[^>]*?href=["']([^"']+)["']/gi)].map(x=>x[1])}
function count(s,regex){return [...s.matchAll(regex)].length}
function note(level,page,msg){findings.push({level,page,msg});if(level==='ERROR')problems.push({page,msg})}
async function audit(){
 const requested=await Promise.all(pages.map(get));
 const htmlByPath=new Map(pages.map((p,i)=>[p,requested[i]]));
 for(const [i,p] of pages.entries()){
  const x=requested[i],s=x.body;if(x.status!==200){note('ERROR',p,'HTTP '+x.status+(x.error?' '+x.error:''));continue}
  const t=title(s);if(!t||t.length<15)note('WARN',p,'Title missing/too short: '+t);
  if(!/data-page=|<main\b|<section\b/i.test(s))note('WARN',p,'No recognizable page body');
  if(!meta(s,'description').length)note('WARN',p,'Meta description absent');
  const canonical=[...s.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)];
  const noindex=/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(s)||(x.headers?.get('x-robots-tag')||'').includes('noindex');
  if(!noindex && canonical.length!==1 && !['/sr/'].includes(p))note('WARN',p,'Indexable page should have exactly one canonical, found '+canonical.length);
  if(noindex && !['/sr/'].includes(p) && canonical.length===0)note('INFO',p,'Intentionally noindex; canonical optional');
  if(canonical.length>1)note('ERROR',p,'Duplicate canonical declarations');
  if(count(s,/<h1\b/gi)===0)note('WARN',p,'No H1');
  if(!/<meta\s+name=["']viewport["']/.test(s))note('WARN',p,'Mobile viewport meta missing');
  if((p==='/danini.html'||p==='/danini-sr.html')&&!meta(s,'og:title').length)note('ERROR',p,'DANINI share title missing');
  if(!noindex && !meta(s,'og:title').length && p!=='/danini.html' && p!=='/danini-sr.html')note('INFO',p,'Open Graph title not declared explicitly');
  if(p==='/danini.html'||p==='/danini-sr.html'){
   if(!/href=["']\/danini-favicon\.svg["']/.test(s))note('ERROR',p,'Missing DANINI favicon');
   if(!/class=["']brandlinks["']/.test(s))note('ERROR',p,'Master brand navigation missing');
   if(!/hreflang=["']sr["']/.test(s)||!/hreflang=["']de["']/.test(s))note('ERROR',p,'DE/SR alternate links missing');
  }
  if(p==='/buyers.html'||p==='/business.html'||p==='/contact.html'){
   if(p==='/buyers.html' && (!s.includes('autodanini-mark.svg') || !/<nav\b/.test(s)))note('ERROR',p,'AutoDanini logo/menu missing');
   if(p==='/business.html' && (!s.includes('danini-header') || !s.includes('business-nav')))note('ERROR',p,'DANINI business navigation missing');
   if(p==='/contact.html' && !s.includes('dn-service-header'))note('ERROR',p,'Shared contact logo/menu missing');
  }
  if(p==='/contact.html'&&!s.includes('mailto:kontakt@daninihub.com'))note('ERROR',p,'Direct email absent');
  // Live customer readiness: guides, visible pilot prices and qualified handoff.
  // Explicitly do not require payment, active Brevo or any paid AI/booking integration.
  if(p==='/guides.html'){
   const ids=['pretraga','prodavac','obilazak','licno','vozac','sleper','uvoz'];
   for(const id of ids)if(!s.includes('id="'+id+'"'))note('ERROR',p,'Free buyer guide missing: '+id);
   if(!s.includes('id="danini-journey-form"'))note('ERROR',p,'Customer choice and inquiry draft missing');
   for(const option of ['value="video"','value="expert"','value="buyer-trip"','value="driver"','value="carrier"'])
    if(!s.includes(option))note('ERROR',p,'Buyer handoff choice missing '+option);
   if(!s.includes('href="cenovnik.html"'))note('ERROR',p,'Price link missing from free guides');
  }
  if(p==='/cenovnik.html'){
   // Guard the current five indicative offers; a stale live deployment still fails.
   for(const euro of ['30–50 €','80–120 €','150–220 €','100–150 €'])
    if(!s.includes(euro))note('ERROR',p,'Current service price range missing '+euro);
   if(!s.includes('B2B za auto-kuće'))note('ERROR',p,'Current B2B quotation service missing');
   if(!s.includes('href="guides.html"'))note('ERROR',p,'Free guides link missing from prices');
   if(!s.includes('href="contact.html"'))note('ERROR',p,'Contact route missing from prices');
  }
  if(p==='/ai-advisor.html'&&!s.includes('id="ai-download-case"'))
   note('WARN',p,'Self-service dossier download link not visible in HTML');

  if(p==='/impressum.html'){
   if(!s.includes('Fischerstr. 54')||!s.includes('47055 Duisburg')||!s.includes('Dragan Zdravković')){
    console.log('LEGAL DELIVERY DIAGNOSTIC '+JSON.stringify({path:p,workerHeader:x.headers?.get('x-danini-legal-published'),mainIndex:s.indexOf('<main'),mainTag:s.match(/<main[^>]*>/)?.[0],bodyLength:s.length,final:x.final}));
    note('ERROR',p,'Public operator identity/address not published');
   }
   if(s.includes('radni tekst koji zahteva pravnu i poslovnu potvrdu'))note('ERROR',p,'Old placeholder Impressum is live');
  }
  if(p==='/privacy.html'){
   if(!s.includes('datenschutz@daninihub.com')||!s.includes('Fischerstr. 54'))note('ERROR',p,'Public privacy controller/contact not published');
  }

  if(p==='/'){if(!s.includes('danini-header') || !s.includes('business-nav'))note('ERROR',p,'DANINI masthead absent');}
  const local=anchors(s).filter(h=>h.startsWith('/')).map(h=>h.split('#')[0].split('?')[0]).filter(Boolean);
  const dead=[...new Set(local.filter(h=>/^(?:\/danini.*\.html|\/contact\.html|\/buyers\.html|\/business\.html)$/.test(h)))].filter(h=>!pages.includes(h));
  if(dead.length)note('WARN',p,'Important internal URL outside audit: '+dead.join(', '));
 }
 const photos=[
  '/images/DANINI_Kartica_01_Salon_Auto_Bez_Osobe.jpg',
  '/images/DANINI_Kartica_02_Uvoz_Dokumentacija_EUR1.jpg',
  '/images/DANINI_Kartica_01_Pregled_Auta_Nemacka.jpg'
 ];
 for(const path of photos){
  try{
   const response=await fetch(origin+path,{redirect:'follow',signal:AbortSignal.timeout(15000)});
   const bytes=new Uint8Array(await response.arrayBuffer());
   const jpeg=bytes.length>40000&&bytes[0]===255&&bytes[1]===216&&bytes[bytes.length-2]===255&&bytes[bytes.length-1]===217;
   if(response.status!==200||!(response.headers.get('content-type')||'').includes('image/jpeg')||!jpeg){
    note('ERROR',path,'Invalid public JPEG: HTTP '+response.status+', bytes '+bytes.length+', type '+response.headers.get('content-type'));
   }
  }catch(error){note('ERROR',path,'Photo load failed: '+String(error));}
 }
 const sr=htmlByPath.get('/sr/')?.body||'',de=htmlByPath.get('/de/')?.body||'';
 if(!sr.includes('workflow-preview')||!de.includes('workflow-preview')||!sr.includes('role="img"')||!de.includes('role="img"')){
  note('ERROR','/sr/ & /de/','DANINI business workflow visual missing from a language homepage');
 }
 const icon=await get('/danini-favicon.svg');
 if(icon.status!==200||!icon.body.includes('<svg')||!(icon.headers?.get('content-type')||'').includes('image/svg+xml'))note('ERROR','/danini-favicon.svg','SVG favicon not served correctly: '+icon.status);
 const [sitemap,robots,status]=await Promise.all([get('/sitemap.xml'),get('/robots.txt'),get('/api/lead/status')]);
 if(sitemap.status!==200||!sitemap.body.includes('<urlset'))note('ERROR','/sitemap.xml','Not valid sitemap XML');
 const locs=[...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
 if(new Set(locs).size!==locs.length)note('WARN','/sitemap.xml','Duplicate URLs in sitemap');
 for(const p of ['/','/de/','/sr/','/de/ueber-danini/','/sr/o-danini/','/de/danini-methode/','/sr/danini-metoda/','/auto/'])if(!locs.includes(origin+p))note('ERROR','/sitemap.xml','Missing '+p);
 if(!robots.body.includes('Sitemap: '+origin+'/sitemap.xml'))note('ERROR','/robots.txt','No sitemap declaration');
 let cfg={};try{cfg=JSON.parse(status.body)}catch{};
 if(status.status!==200||typeof cfg.enabled!=='boolean')note('ERROR','/api/lead/status','No valid readiness API');
 if(cfg.enabled)note('WARN','/api/lead/status','Public intake enabled: manual E2E evidence required');
 const result={checkedAt:new Date().toISOString(),origin,checkedPages:pages.length,errors:problems.length,warnings:findings.filter(x=>x.level==='WARN').length,sitemapUrls:locs.length,apiIntakeEnabled:cfg.enabled??null,findings};
 console.log('DANINI LIVE SITE AUDIT '+JSON.stringify({checkedPages:result.checkedPages,errors:result.errors,warnings:result.warnings,sitemapUrls:result.sitemapUrls,apiIntakeEnabled:result.apiIntakeEnabled}));
 for(const x of findings)console.log(x.level+' | '+x.page+' | '+x.msg);
 writeFileSync('danini-site-audit-result.json',JSON.stringify(result,null,2)+'\n');
 if(problems.length)process.exitCode=1;
}
audit().catch(e=>{console.error(e);process.exitCode=1});
