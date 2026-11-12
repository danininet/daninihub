#!/usr/bin/env node
/**
 * DANINI production SEO smoke test (read-only).
 * Usage: node scripts/check-danini-public-seo.mjs
 * No credentials, payments, customer data, or mutations.
 */
const base = 'https://daninihub.com';
const fail = [];
const seen = [];
async function read(url) {
  const response = await fetch(url, {
    redirect:'follow', headers:{accept:'text/html,application/xml;q=0.9,*/*;q=0.5'},
    signal:AbortSignal.timeout(12000), cache:'no-store'
  });
  return {response,body:await response.text()};
}
try {
  const sitemap = await read(base+'/sitemap.xml');
  if(sitemap.response.status!==200)fail.push('sitemap status '+sitemap.response.status);
  const links=[...sitemap.body.matchAll(/<loc>\s*(https?:\/\/[^<]+)\s*<\/loc>/g)].map(m=>m[1].trim());
  for(const path of ['/sr/','/de/'])if(!links.includes(base+path))fail.push('missing sitemap '+path);
  if(links.length<19)fail.push('sitemap has fewer than expected 19 URLs: '+links.length);
  for(const link of [...new Set(links)]){
    if(!link.startsWith(base+'/')){fail.push('unexpected sitemap domain '+link);continue}
    try{
      const {response,body}=await read(link);
      const finalUrl=response.url.replace(/\/$/,'/');
      const actual=new URL(finalUrl);
      seen.push({url:link,status:response.status,final:finalUrl});
      if(response.status!==200)fail.push('non-200 '+link+' => '+response.status);
      if(actual.origin!==base)fail.push('cross-domain redirect '+link+' => '+finalUrl);
      if(finalUrl!==link)fail.push('redirected sitemap URL '+link+' => '+finalUrl);
      if((response.headers.get('content-type')||'').includes('text/html')){
        const canonical=body.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1];
        if(!canonical)fail.push('missing canonical '+link);
        else if(!canonical.startsWith(base+'/'))fail.push('bad canonical '+link+' => '+canonical);
      }
    }catch(error){fail.push('fetch '+link+' => '+String(error))}
  }
  for(const path of ['/sr/','/de/']){
    try{
      const {response,body}=await read(base+path);
      if(response.status!==200)fail.push(path+' status '+response.status);
      for(const [lang,href] of [['sr',base+'/sr/'],['de',base+'/de/']])
        if(!body.includes('hreflang="'+lang+'"')||!body.includes(href))fail.push(path+' missing hreflang '+lang);
      if(!body.includes('rel="canonical" href="'+base+path+'"'))fail.push(path+' canonical mismatch');
    }catch(error){fail.push('home '+path+' => '+String(error))}
  }
  const robots=await read(base+'/robots.txt');
  if(robots.response.status!==200)fail.push('robots.txt status '+robots.response.status);
  console.log(JSON.stringify({checked:seen.length,expectedMin:19,failures:fail,urls:seen},null,2));
  if(fail.length)process.exitCode=1;
}catch(error){console.error('SEO check unable to run:',String(error));process.exitCode=1}
