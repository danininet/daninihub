'use strict';
// Read-only, credential-free production verification. Does NOT submit a payment.
const BASE='https://daninihub.com';
const TIMEOUT_MS=11000;
async function probe(uri){
  try{
    const res=await fetch(BASE+uri,{redirect:'follow',signal:AbortSignal.timeout(TIMEOUT_MS),headers:{'Accept':'application/json,text/html;q=0.9,*/*;q=0.6','User-Agent':'DANINI-Production-Readiness/1.0'}});
    const contentType=res.headers.get('content-type')||'';
    const content=await res.text();
    return {ok:true,status:res.status,url:res.url,contentType,content:content.slice(0,150000)};
  }catch(e){return {ok:false,error:String(e.cause?.code||e.code||e.message||e.name||'UNKNOWN_CONNECTION_ERROR').slice(0,120)}}
}
const checks=[];
function report(name,status,detail){
  checks.push({name,status,detail});
  console.log(status.padEnd(8)+' | '+name+' | '+detail);
  if(status==='FAIL')console.log('::warning title=Production not ready::'+name+' — '+detail.replace(/\r|\n|::/g,' ').slice(0,180));
}
async function main(){
  console.log('DANINI read-only production readiness — '+new Date().toISOString());
  for(const [label,url] of [
    ['Health endpoint','/health'],
    ['Runtime version','/api/runtime-version'],
    ['Digital checkout status','/api/danini/digital/status'],
    ['SR product page','/sr/auto-biznis-vodic-i-softver'],
    ['DE product page','/de/auto-business-guide-software'],
    ['Unauthorized PDF download','/digital/download/DGD-'+('0'.repeat(36))+'?token=INVALID']
  ]){
    const r=await probe(url);
    if(!r.ok){report(label,'FAIL','Network: '+r.error);continue}
    if(r.url.startsWith('http:')){report(label,'FAIL','Insecure redirect to HTTP');continue}
    if(label==='Unauthorized PDF download'){
      report(label,[403,404,503].includes(r.status)?'PASS':'FAIL','HTTP '+r.status+' (unauthorized PDF must not be served)');
      continue;
    }
    if(r.status!==200){report(label,'FAIL','HTTP '+r.status+'; final URL '+r.url);continue}
    if(label==='Digital checkout status'){
      try{
        const json=JSON.parse(r.content);
        if(json.ok!==true||typeof json.enabled!=='boolean')report(label,'FAIL','Unexpected API status JSON');
        else if(json.enabled===true)report(label,'PASS','Server checkout enabled; real payment test still REQUIRED');
        else report(label,'BLOCKED','Checkout safely DISABLED; PayPal + private PDF + DB + webhook need configuration');
      }catch{report(label,'FAIL','Unexpected non-JSON API response')}
    }else if(label==='Health endpoint'){
      try{
        const json=JSON.parse(r.content);
        report(label,json.ok===true?'PASS':'FAIL','HTTP 200, storage '+(json.storage||'unknown')+', backend '+(json.service||'unknown'));
      }catch{report(label,'FAIL','Health returned HTML or invalid JSON')}
    }else if(label==='Runtime version'){
      try{
        const json=JSON.parse(r.content);report(label,json.ok===true&&json.service==='Danini ImportOS'?'PASS':'FAIL','Backend '+(json.deploymentMarker||json.service||'unknown'));
      }catch{report(label,'FAIL','Invalid runtime version API response')}
    }else {
      const markers=r.content.includes('danini-digital-checkout.js')&&r.content.includes('name="instantDeliveryConsent"');
      report(label,markers?'PASS':'FAIL','HTTP 200; new storefront checkout '+(markers?'present':'MISSING'));
    }
  }
  const summary=['## DANINI production digital sale — '+new Date().toISOString(),'','No payment created; no secrets accessed.','','| Probe | Status | Detail |','|---|---|---|'];
  for(const c of checks)summary.push('| '+c.name+' | '+c.status+' | '+c.detail.replace(/\|/g,'/').replace(/\r|\n/g,' ').slice(0,180)+' |');
  summary.push('','**PASS ≠ transaction proven.** A real Sandbox order, PayPal signature verification, Brevo e-mail and browser download must still be tested after configuring Hostinger and PayPal.');
  const fs=require('node:fs');if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,summary.join('\n')+'\n');
  console.log('\nResult: '+checks.map(x=>x.status).join(', ')+'; no payment or deployment performed.');
}
main().catch(e=>{console.error('Unexpected probe failure:',e.message);process.exitCode=1});
