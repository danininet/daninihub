'use strict';
// Read-only Cloudflare production readiness. NO order, payment, email or secret access.
const base='https://daninihub.com';
async function inspect(route){
 try{
  const result=await fetch(base+route,{signal:AbortSignal.timeout(18000),redirect:'follow',headers:{accept:'application/json,text/html;q=0.9','cache-control':'no-cache'}});
  const body=await result.text();
  return {status:result.status,ok:result.ok,body:body.slice(0,250000)};
 }catch(e){return {status:0,error:String(e?.cause?.code||e?.message||e)}}
}
const checks=[];
function record(name,state,note){checks.push({name,state,note}); console.log(state+' | '+name+' | '+note);}
async function main(){
 const endpoints={
  homepageDE:'/de/',homepageSR:'/sr/',
  builderDE:'/de/akademija/builder/',builderSR:'/sr/akademija/builder/',
  businessDE:'/de/business/',autoDE:'/de/auto-check/',
  digitalStore:'/digital.html',leadStatus:'/api/lead/status',
  paymentStatus:'/api/danini/digital/status',
  unauthorizedPdf:'/api/danini/digital/download/DGD-'+('0'.repeat(32))+'?token=INVALID'
 };
 const received={};
 for(const [name,route] of Object.entries(endpoints))received[name]=await inspect(route);
 for(const [name,r] of Object.entries(received)){
  if(name==='paymentStatus'){
   let p=null;try{p=JSON.parse(r.body||'null')}catch{}
   if(r.status!==200||p?.ok!==true||typeof p.enabled!=='boolean'){
    record(name,'FAIL','HTTP '+r.status+' non-verifiable checkout readiness');
   } else {
    record(name,p.enabled===true&&p.mode==='live'?'READY':'BLOCKED',
      'HTTP 200, mode='+(p.mode||'unknown')+', enabled='+p.enabled+', delivery='+(p.delivery||'unknown'));
   }
  }else if(name==='leadStatus'){
   let p=null;try{p=JSON.parse(r.body||'null')}catch{}
   record(name,r.status===200&&p?.enabled===true?'READY':'BLOCKED','HTTP '+r.status+' lead enabled='+(p?.enabled===true));
  }else if(name==='unauthorizedPdf'){
   record(name,[403,404,503].includes(r.status)?'PASS':'FAIL','HTTP '+r.status+' invalid download not served');
  }else if(name==='builderDE'||name==='builderSR'){
   record(name,r.status===200&&r.body.includes('id="demo-export"')&&r.body.includes('id="demo-print"')?'PASS':'FAIL',
     'HTTP '+r.status+' six-step export/print controls in live HTML');
  }else{
   record(name,r.status===200?'PASS':'FAIL','HTTP '+r.status);
  }
 }
 const summary=['# DANINI real production readiness – '+new Date().toISOString(),
 '','Read-only GET check, no sandbox or real payment created.','','| Surface | Result | Detail |','|---|---|---|'];
 checks.forEach(x=>summary.push('| '+x.name+' | '+x.state+' | '+x.note+' |'));
 summary.push('','Status READY is an API readiness indication, **not** proof of a paid transaction. A working PayPal Sandbox capture and owner-approved live/legal onboarding remain separate gates.');
 if(process.env.GITHUB_STEP_SUMMARY)require('fs').appendFileSync(process.env.GITHUB_STEP_SUMMARY,summary.join('\n')+'\n');
 console.log('DANINI public readiness summary: '+checks.map(x=>x.name+':'+x.state).join(', '));
}
main().catch(e=>{console.error(e);process.exitCode=1});
