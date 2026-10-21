#!/usr/bin/env node
// AutoDanini / DaniniHub public-health smoke checks.
// Read-only, no cookies, auth tokens, API keys, test purchases, or AI inference calls.
// Exit code 1 on failure so GitHub Actions can surface a failing workflow.
const origin=process.env.AUTODANINI_PREVIEW || 'https://auto-danini-import-b2b-p8swk5.v2.appdeploy.ai';
const calije=process.env.CALIJE_PREVIEW || 'https://daninihub-calije-zakup-placeva-n1v9xy.v2.appdeploy.ai';
function target(base,path,marker,name) {
 const url=new URL(path,base+'/');
 if(url.protocol!=='https:') throw new Error('HTTPS required');
 return {url:url.toString(),marker,name};
}
const endpoints=[
 target(origin,'/index.html',/AUTODANINI/i,'AutoDanini početna'),
 target(origin,'/nalog.html',/account-case-form/,'AutoDanini korisnički nalog (HTML)'),
 target(origin,'/ai-advisor.html',/ai-form/,'AutoDanini AI savetnik (HTML)'),
 target(origin,'/disclaimer.html',/Haftungshinweise|Odricanje od odgovornosti/i,'AutoDanini pravna upozorenja'),
 target(calije,'/index.html',/danini|čalije|calije/i,'DaniniHub Čalije (pregled)')
];
async function fetchCheck({url,marker,name}) {
 for(let attempt=1;attempt<=2;attempt++){
  try {
   const response=await fetch(url,{method:'GET',redirect:'follow',signal:AbortSignal.timeout(12000),headers:{'User-Agent':'AutoDanini-Uptime-Check/1.0','Cache-Control':'no-cache'}});
   if(!response.ok) throw new Error('HTTP '+response.status);
   const body=(await response.text()).slice(0,600000);
   if(!marker.test(body)) throw new Error('Required page marker missing');
   process.stdout.write('OK   '+name+' | HTTP '+response.status+' | '+url+'\n');
   return true;
  } catch(err){
   if(attempt===2) {
    process.stderr.write('FAIL '+name+' | '+url+' | '+String(err).slice(0,450)+'\n');
    return false;
   }
   await new Promise(resolve=>setTimeout(resolve,3000));
  }
 }
 return false;
}
let failures=0;
for(const check of endpoints) {
 if(!(await fetchCheck(check)))failures++;
}
console.log('Checked '+endpoints.length+' public pages, failures='+failures+'. No AI calls or private information accessed.');
if(failures)process.exitCode=1;
