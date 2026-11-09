'use strict';
const URL='https://daninihub.com/api/lead/status';
(async()=>{
  const res=await fetch(URL,{headers:{accept:'application/json'},signal:AbortSignal.timeout(15000),cache:'no-store'});
  const text=await res.text();
  if(!res.ok)throw Error('DANINI_PUBLIC_INTAKE_STATUS_HTTP_'+res.status);
  let data;try{data=JSON.parse(text)}catch{throw Error('DANINI_PUBLIC_INTAKE_NON_JSON')}
  if(typeof data.enabled!=='boolean'||!['brevo','setup_required'].includes(data.channel))
    throw Error('DANINI_PUBLIC_INTAKE_UNEXPECTED_RESPONSE');
  if(data.enabled && data.channel!=='brevo')throw Error('DANINI_PUBLIC_INTAKE_CONTRADICTORY_STATUS');
  console.log('DANINI live intake status:',data.enabled?'CONFIGURED_BUT_E2E_UNVERIFIED':'DISABLED_OR_SETUP_REQUIRED','HTTP',res.status);
  // Never log public token/sitekey, keys, personal data, or accept mail delivery as proven.
})().catch(e=>{console.error('DANINI live intake probe failed:',e.message);process.exitCode=1});
