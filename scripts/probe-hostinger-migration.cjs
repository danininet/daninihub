'use strict';
// Public, read-only evidence. No authentication, submissions, emails or payments.
const fs=require('node:fs');
const path=require('node:path');
const origins={hostinger:'https://gleaming-orangered-crow-58.hostingersite.com',production:'https://daninihub.com',staging:'https://danini-b2b-staging.dragangaganet.workers.dev'};
const output=process.argv[2];
if(!output)throw new Error('Specify an evidence JSON output path');
const siteRoutes=['/','/de/','/sr/','/robots.txt','/sitemap.xml','/_danini/build.json'];
for(const locale of ['de','sr'])for(const suffix of ['auto-check/','ai-savetnik/','business/','akademija/','akademija/builder/','wissen/','impressum/','datenschutz/','agb/','ai-transparenz/','wissen/gebrauchtwagen-anzahlung/','wissen/fahrzeugpapiere/','wissen/auto-deutschland-serbien/','wissen/kundenanfragen/','wissen/email-formular-crm/','wissen/ki-buero/'])siteRoutes.push('/'+locale+'/'+suffix);
const statuses=['/health','/api/health','/api/tenant-config','/api/academy/config','/api/academy/session','/api/academy/projects','/api/academy/ai/status','/api/assistant/status','/api/danini/digital/status','/portal','/operator/sandbox-checkout/'];
const redirects=fs.readFileSync('public/_redirects','utf8').trim().split('\n').map(line=>line.split(/\s+/)[0]);
async function probe(hostname,route){
 const started=Date.now();
 try{
  const response=await fetch(origins[hostname]+route,{redirect:'manual',headers:{'cache-control':'no-cache'},signal:AbortSignal.timeout(20000)});
  const body=await response.text();
  const result={hostname,route,status:response.status,ms:Date.now()-started,type:response.headers.get('content-type'),platform:response.headers.get('platform'),runtime:response.headers.get('x-danini-runtime'),location:response.headers.get('location')?.split('?')[0]||null,bytes:Buffer.byteLength(body),preview:body.includes('data-hostinger-preview'),robots:response.headers.get('x-robots-tag')||body.match(/<meta[^>]*name="robots"[^>]*content="([^"]+)"/)?.[1]||null,canonical:body.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1]||null};
  if(/application\/json/i.test(result.type||'')){
   const parsed=JSON.parse(body);result.json=Object.fromEntries(Object.entries(parsed).filter(([key])=>['status','ok','error','enabled','authenticated','checkoutEnabled','paypalEnvironment','paypalMode','sandbox','live','mode','revision','schema','softwareEnabled'].includes(key)));
  }
  return result;
 }catch(error){return {hostname,route,error:error.name,ms:Date.now()-started};}
}
(async()=>{
 const jobs=[];for(const name of ['hostinger','production'])for(const route of [...new Set([...siteRoutes,...statuses,...redirects])])jobs.push([name,route]);
 for(const route of statuses)jobs.push(['staging',route]);
 const results=[];let next=0;
 await Promise.all(Array.from({length:4},async()=>{while(next<jobs.length){const job=jobs[next++];results.push(await probe(...job));}}));
 results.sort((a,b)=>(a.hostname+a.route).localeCompare(b.hostname+b.route));
 const evidence={capturedAt:new Date().toISOString(),scope:'read-only HTTP observations; not functional E2E',results};
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(evidence,null,2)+'\n');
 for(const hostname of Object.keys(origins)){
  const rows=results.filter(x=>x.hostname===hostname);console.log(JSON.stringify({hostname,total:rows.length,statuses:rows.reduce((acc,r)=>(acc[r.status||r.error]=(acc[r.status||r.error]||0)+1,acc),{})}));
 }
})().catch(error=>{console.error(error.message);process.exitCode=1;});
