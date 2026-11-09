// DANINI / Non-invasive public production audit. No form submissions or payments.
import {writeFileSync} from 'node:fs';
const origin='https://daninihub.com';
const pages=['/','/de/','/sr/','/danini.html','/danini-sr.html','/contact.html','/buyers.html','/dealers.html','/business.html','/guides.html','/about.html','/privacy.html','/impressum.html','/support.html','/ai-advisor.html','/digital.html','/auctions.html','/cenovnik.html','/faq.html'];
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
  if(canonical.length!==1 && !['/sr/'].includes(p))note('WARN',p,'Canonical count '+canonical.length);
  if(canonical.length>1)note('ERROR',p,'Duplicate canonical declarations');
  if(count(s,/<h1\b/gi)===0)note('WARN',p,'No H1');
  if(p==='/danini.html'||p==='/danini-sr.html'){
   if(!/href=["']\/danini-favicon\.svg["']/.test(s))note('ERROR',p,'Missing DANINI favicon');
   if(!/class=["']brandlinks["']/.test(s))note('ERROR',p,'Master brand navigation missing');
   if(!/hreflang=["']sr["']/.test(s)||!/hreflang=["']de["']/.test(s))note('ERROR',p,'DE/SR alternate links missing');
  }
  if(p==='/buyers.html'||p==='/business.html'||p==='/contact.html'){
   if(!s.includes('dn-service-header'))note('ERROR',p,'Shared logo/menu not in rendered HTML');
  }
  if(p==='/contact.html'&&!s.includes('mailto:kontakt@daninihub.com'))note('ERROR',p,'Direct email absent');
  if(p==='/'){if(!s.includes('dn-header'))note('ERROR',p,'DANINI masthead absent');}
  const local=anchors(s).filter(h=>h.startsWith('/')).map(h=>h.split('#')[0].split('?')[0]).filter(Boolean);
  const dead=[...new Set(local.filter(h=>/^(?:\/danini.*\.html|\/contact\.html|\/buyers\.html|\/business\.html)$/.test(h)))].filter(h=>!pages.includes(h));
  if(dead.length)note('WARN',p,'Important internal URL outside audit: '+dead.join(', '));
 }
 const icon=await get('/danini-favicon.svg');
 if(icon.status!==200||!icon.body.includes('<svg')||!(icon.headers?.get('content-type')||'').includes('image/svg+xml'))note('ERROR','/danini-favicon.svg','SVG favicon not served correctly: '+icon.status);
 const [sitemap,robots,status]=await Promise.all([get('/sitemap.xml'),get('/robots.txt'),get('/api/lead/status')]);
 if(sitemap.status!==200||!sitemap.body.includes('<urlset'))note('ERROR','/sitemap.xml','Not valid sitemap XML');
 const locs=[...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
 if(new Set(locs).size!==locs.length)note('WARN','/sitemap.xml','Duplicate URLs in sitemap');
 for(const p of ['/danini.html','/danini-sr.html','/','/de/'])if(!locs.includes(origin+p))note('ERROR','/sitemap.xml','Missing '+p);
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
