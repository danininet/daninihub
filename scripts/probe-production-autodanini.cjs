'use strict';
// Read-only production verification after Hostinger's automatic GitHub deployment.
// Does not submit forms, trigger payments, edit DNS or access secrets.
const fs=require('node:fs');
const dns=require('node:dns').promises;
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
async function diagnosis(){
  try{const x=await dns.lookup('daninihub.com');console.log('DNS resolution:',x.address,x.family);}catch(error){console.log('DNS resolution FAILED:',String(error.code||error.message));}
  try{const x=await dns.lookup('github.com');console.log('Runner comparison: github.com resolved (IPv'+x.family+')');}catch(error){console.log('Runner comparison DNS FAILED:',String(error.code||error.message));}
}
async function check(){
  const [s,de,home,lead,form]=await Promise.all([
    get('/sr/'),get('/de/'),get('/'),get('/api/importos/lead-readiness'),get('/danini-order.js')
  ]);
  let body;
  try{body=JSON.parse(lead.text)}catch{body={}}
  const deployed=brandFound(s.text)&&brandFound(de.text)&&brandFound(home.text) &&
    s.text.includes('Jasna ponuda za stvaran automobil') &&
    de.text.includes('Klares Angebot für ein konkretes Fahrzeug') &&
    lead.status===200 && body.ok===true && typeof body.onlineIntakeReady==='boolean' &&
    form.status===200 && form.text.includes('danini-order-online-submit') &&
    !form.text.includes('paypal.me');
  return {deployed,s,de,home,lead,form,leadStatus:body};
}
async function main(){
  console.log('AutoDanini GitHub → Hostinger read-only QA',new Date().toISOString());
  let state;
  for(let attempt=1;attempt<=pauses;attempt++){
    state=await check();
    if(state.deployed)break;
    console.log('Connection diagnosis:',JSON.stringify({sr:{status:state.s.status,error:state.s.error,url:state.s.url},de:{status:state.de.status,error:state.de.error,url:state.de.url},root:{status:state.home.status,error:state.home.error,url:state.home.url},lead:{status:state.lead.status,error:state.lead.error},form:{status:state.form.status,error:state.form.error}}));
    if(attempt===1)await diagnosis();
    console.log('Current site not yet showing this version; deployment attempt',attempt+'/'+pauses);
    if(attempt<pauses)await sleep(24000);
  }
  if(!state.deployed)add('AutoDanini deployment detected',false,'Root and both languages must contain new brand and editorial proof; '+(state.s.error||state.de.error||state.home.error||'the server may still be deploying')+'.');
  else add('AutoDanini deployment detected',true,'Existing single domain serves the new SR/DE storefront.');
  add('Full AutoDanini sales form',state.form.status===200 && state.form.text.includes('danini-order-online-submit') && !state.form.text.includes('paypal.me'),'HTTP '+state.form.status+'; no premature PayPal.Me link');
  add('ImportOS lead endpoint',state.lead.status===200 && state.leadStatus.ok===true && typeof state.leadStatus.onlineIntakeReady==='boolean','HTTP '+state.lead.status);
  console.log('INFO | Production online lead automation | '+(state.leadStatus.onlineIntakeReady===true?'READY: MySQL and Brevo sender configured':'BLOCKED: MySQL and/or Brevo sender not ready; WhatsApp/e-mail remain available'));
  for(const [language,page] of [['SR',state.s],['DE',state.de],['ROOT',state.home]]){
    const ok=page.status===200 && !/2[–-]4 radna sata|2 do 4 radna sata|2 bis 4 Arbeitsstunden|Antwortziel per WhatsApp/.test(page.text);
    add(language+' no invented response SLA',ok,'HTTP '+page.status+(page.error?' ('+page.error+')':''));
    add(language+' one canonical',page.status===200 && (page.text.match(/rel="canonical"/g)||[]).length===1,'canonical count '+(page.text.match(/rel="canonical"/g)||[]).length);
    add(language+' indexable',page.status===200 && !/noindex/i.test(page.robots) && !/<meta name="robots" content="noindex/i.test(page.text),page.status===0?'Unreachable: '+(page.error||'unknown error'):(page.robots||'no noindex header'));
  }
  const [runtime,health,robots,sitemap,portrait]=await Promise.all([
    get('/api/runtime-version'),get('/health'),get('/robots.txt'),get('/sitemap.xml'),
    get('/images/DANINI_Dragan_Portret_CLEAN_1200x1200.jpg','HEAD')
  ]);
  add('ImportOS backend',runtime.status===200 && runtime.text.includes('Danini ImportOS'),'HTTP '+runtime.status+(runtime.error?' '+runtime.error:''));
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
