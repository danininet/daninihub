'use strict';
// Read-only production verification after Hostinger's automatic GitHub deployment.
// Does not submit forms, trigger payments, edit DNS or access secrets.
const fs=require('node:fs');
const origin='https://daninihub.com';
const pauses=process.env.GITHUB_ACTIONS==='true'?4:1;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function get(path,method='GET'){
  try{
    const r=await fetch(origin+path,{
      method,redirect:'follow',signal:AbortSignal.timeout(12000),
      headers:{'Accept':'text/html,application/json;q=0.9,*/*;q=0.7','User-Agent':'AutoDanini-ReadOnly-QA/2026'}
    });
    const text=method==='HEAD'?'':(await r.text()).slice(0,850000);
    return {status:r.status,text,url:r.url,type:r.headers.get('content-type')||'',robots:r.headers.get('x-robots-tag')||''};
  }catch(error){return {status:0,text:'',url:'',type:'',robots:'',error:String(error.cause?.code||error.message)}}
}
const checks=[];
function add(name,ok,message){checks.push({name,status:ok?'PASS':'FAIL',message});console.log((ok?'PASS':'FAIL')+' | '+name+' | '+message);}
function brandFound(html){return /<strong>AutoDanini<\/strong>/.test(html) && html.includes('decision-proof');}
async function check(){
  const s=await get('/sr/'),de=await get('/de/'),home=await get('/');
  if(!brandFound(s.text)||!brandFound(de.text)||!brandFound(home.text))return {deployed:false,s,de,home};
  return {deployed:true,s,de,home};
}
async function main(){
  console.log('AutoDanini GitHub → Hostinger read-only QA',new Date().toISOString());
  let state;
  for(let attempt=1;attempt<=pauses;attempt++){
    state=await check();
    if(state.deployed)break;
    console.log('Current site not yet showing this version; deployment attempt',attempt+'/'+pauses);
    if(attempt<pauses)await sleep(24000);
  }
  if(!state.deployed)add('AutoDanini deployment detected',false,'Root and both languages must contain new brand and editorial proof; it may still be deploying.');
  else add('AutoDanini deployment detected',true,'Existing single domain serves the new SR/DE storefront.');
  for(const [language,page] of [['SR',state.s],['DE',state.de],['ROOT',state.home]]){
    const ok=page.status===200 && !/2[–-]4 radna sata|2 do 4 radna sata|2 bis 4 Arbeitsstunden|Antwortziel per WhatsApp/.test(page.text);
    add(language+' no invented response SLA',ok,'HTTP '+page.status);
    add(language+' one canonical',page.status===200 && (page.text.match(/rel="canonical"/g)||[]).length===1,'canonical count '+(page.text.match(/rel="canonical"/g)||[]).length);
    add(language+' indexable',page.status===200 && !/noindex/i.test(page.robots) && !/<meta name="robots" content="noindex/i.test(page.text),page.robots||'no noindex header');
  }
  const [runtime,health,robots,sitemap,portrait]=await Promise.all([
    get('/api/runtime-version'),get('/health'),get('/robots.txt'),get('/sitemap.xml'),
    get('/images/DANINI_Dragan_Portret_CLEAN_1200x1200.jpg','HEAD')
  ]);
  add('ImportOS backend',runtime.status===200 && runtime.text.includes('Danini ImportOS'),'HTTP '+runtime.status);
  add('Backend health',health.status===200 && health.text.includes('"ok":true'),'HTTP '+health.status+' '+(health.text.match(/"storage":"[^"]+"/)||[])[0]);
  add('Robots and sitemap',robots.status===200 && sitemap.status===200 && robots.text.includes('Sitemap: https://daninihub.com/sitemap.xml') && sitemap.text.includes('daninihub.com/sr/'),'robots '+robots.status+' sitemap '+sitemap.status);
  add('Approved portrait',portrait.status===200 && /image\//.test(portrait.type),'HTTP '+portrait.status+' '+portrait.type);
  const summary=['## AutoDanini – production verification','',new Date().toISOString(),
    '','Checked only daninihub.com. Read-only requests; no payment, migration, DNS or secret changes.','','| Test | Result | Detail |','|---|---|---|'];
  for(const c of checks)summary.push('| '+c.name+' | '+c.status+' | '+c.message.replace(/[|\n\r]/g,' ').slice(0,150)+' |');
  if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,summary.join('\n')+'\n');
  if(checks.some(c=>c.status!=='PASS'))process.exitCode=1;
}
main().catch(e=>{console.error(e.message);process.exitCode=1});
