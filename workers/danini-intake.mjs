import {digitalRoute} from './danini-digital-commerce.mjs';
/**
 * DANINI / Cloudflare Workers lead intake.
 * Fail closed until Brevo sender + recipient + Turnstile + manual enablement are set.
 * No hard-coded tokens, customer payment, newsletter enrollment, AI calls or storage.
 * Email provider acceptance is NOT a delivery guarantee.
 */
const BREVO_URL='https://api.brevo.com/v3/smtp/email';
const BREVO_TEMPLATE_ID={general:{de:38,sr:39},vehicle:{de:40,sr:41},support:{de:42,sr:43},business:{de:48,sr:49}};
// Verified active 2026 DANINI final-logo transactional Brevo templates.
// Customer receives one neutral receipt only after the operator notification is accepted.

const TURNSTILE_URL='https://challenges.cloudflare.com/turnstile/v0/siteverify';
const MAX_BYTES=12000;
const MAX_ROWS=25;
const noStore={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'};
const asText=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
function response(payload,status=200){return new Response(JSON.stringify(payload),{status,headers:noStore});}
export function isReady(env={}){
 return env.DANINI_CONTACT_ACTIVE==='true' &&
  !!env.BREVO_API_KEY && !!env.DANINI_BREVO_SENDER &&
  !!env.DANINI_NOTIFY_TO && !!env.DANINI_TURNSTILE_SECRET &&
  !!env.DANINI_TURNSTILE_SITEKEY;
}
function validEmail(v){
 return typeof v==='string' && v.length<=254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(v);
}
function safeField(v,max){return asText(v,max).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'');}
function validatePayload(body){
 if(!body||typeof body!=='object'||Array.isArray(body))return null;
 const kind=asText(body.kind,12);
 if(!['general','vehicle','business','support'].includes(kind))return null;
 const name=safeField(body.name,90);
 const email=safeField(body.email,254).toLowerCase();
 const topic=safeField(body.topic,120);
 const message=safeField(body.message,3200);
 const language=body.language==='de'?'de':'sr';
 const company=safeField(body.company,120);
 if(!name||!validEmail(email)||!topic||message.length<10||body.consent!==true)return null;
 const details={};
 if(body.details && typeof body.details==='object' && !Array.isArray(body.details)){
  for(const [key,value] of Object.entries(body.details).slice(0,MAX_ROWS)){
   if(/^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(key) && typeof value==='string'){
    details[key]=safeField(value,350);
   }
  }
 }
 return {kind,name,email,topic,message,company,details,language};
}
async function verifyCaptcha(request,env,token){
 if(typeof token!=='string'||token.length<10||token.length>2048)return false;
 const form=new FormData();
 form.set('secret',env.DANINI_TURNSTILE_SECRET);
 form.set('response',token);
 const ip=request.headers.get('cf-connecting-ip');
 if(ip)form.set('remoteip',ip);
 try {
  const result=await fetch(TURNSTILE_URL,{method:'POST',body:form,signal:AbortSignal.timeout(8000)});
  if(!result.ok)return false;
  const data=await result.json();
  return data.success===true && ['daninihub.com','www.daninihub.com'].includes(String(data.hostname||''));
 }catch{return false;}
}
async function brevoSend(env,message){
 const result=await fetch(BREVO_URL,{
  method:'POST',
  headers:{'api-key':env.BREVO_API_KEY,'content-type':'application/json','accept':'application/json'},
  body:JSON.stringify(message),
  signal:AbortSignal.timeout(12000)
 });
 if(!result.ok)throw Error('BREVO_REJECTED_'+result.status);
 const data=await result.json();
 if(typeof data.messageId!=='string'||!data.messageId)throw Error('BREVO_MISSING_MESSAGE_ID');
 return data.messageId;
}
const sender=env=>({name:'DANINI',email:env.DANINI_BREVO_SENDER});
// Explicitly override legacy account-wide sender labels on template sends.
// All addresses correspond to the verified active DANINI senders in Brevo.
const receiptSender={
 general:{name:'DANINI',email:'info@daninihub.com'},
 vehicle:{name:'DANINI Auto',email:'auto@daninihub.com'},
 support:{name:'DANINI Support',email:'info@daninihub.com'},
 business:{name:'DANINI Business',email:'info@daninihub.com'}
};
function bodyText(d,ref){
 const details=Object.entries(d.details).map(([k,v])=>k+': '+v).join('\n');
 return [
  'DANINI – neue Anfrage / novi upit',
  'Referenz: '+ref,
  'Bereich: '+d.kind,
  'Thema: '+d.topic,
  'Kontakt: '+d.name,
  ...(d.company?['Unternehmen: '+d.company]:[]),
  'E-Mail: '+d.email,
  'Sprache: '+d.language,
  ...(details?['',details]:[]),
  '',
  'Nachricht / Poruka:',
  d.message,
  '',
  'Hinweis: vom Besucher ausdrücklich angefragte Einzelkommunikation. Kein Newsletter-Opt-in.',
  'Bitte über die bestätigte geschäftliche Antwortadresse antworten.'
 ].join('\n');
}

/** Strict vehicle self-assessment intake. No URL fetching, no automated diagnosis. */
function validateAiIntake(body){
 if(!body||typeof body!=='object'||Array.isArray(body)||body.consent!==true)return null;
 if(body.language!=='de'&&body.language!=='sr')return null;
 const source=safeField(body.source,500);
 const vin=/^[A-HJ-NPR-Z0-9]{17}$/i.test(source);
 let httpsUrl=false;
 if(!vin){
  try{
   const u=new URL(source);
   httpsUrl=u.protocol==='https:' && !!u.hostname && !u.username && !u.password && source.length<=500;
  }catch{}
 }
 if(!vin&&!httpsUrl)return null;
 const name=safeField(body.name,90);
 const email=safeField(body.email,254).toLowerCase();
 if(!name||!validEmail(email))return null;
 if(!Array.isArray(body.answers)||body.answers.length!==3)return null;
 const statuses=[];
 for(let i=0;i<3;i++){
  const entry=body.answers[i];
  if(!entry||typeof entry!=='object'||Array.isArray(entry)||entry.question!==i+1||
    !['confirmed','missing','critical'].includes(entry.status))return null;
  statuses.push(entry.status);
 }
 return {source,name,email,language:body.language,statuses};
}
function aiReport(data,reference){
 const topics=data.language==='de'?
  ['Herkunftsnachweis','FIN und Fahrzeugpapiere','Service-/Schadenhistorie']:
  ['Dokaz o poreklu','VIN i dokumenta','Servisna i štetna istorija'];
 const labels={confirmed:'CONFIRMED (self-reported; NOT independently checked)',
  missing:'AMBER / MISSING EVIDENCE',critical:'RED / REQUIRES HUMAN REVIEW'};
 return ['DANINI — AI Berater / AI Savetnik','Referenz: '+reference,
  'Sprache / Jezik: '+data.language,
  'Inserat / VIN: '+data.source,
  'Kontakt: '+data.name,'E-Mail: '+data.email,'',
  'Risikomatrix / Matrica rizika:',
  ...data.statuses.map((value,i)=>(i+1)+'. '+topics[i]+': '+labels[value]),
  '', 'Nur Angaben des Absenders / Samo izjave podnosioca.',
  'Keine automatische Fahrzeuginspektion / Nema automatskog pregleda.',
  'Anfrage zur manuellen Prüfung; kein Newsletter-Abonnement.'
 ].join('\n');
}
export async function handleAiIntake(request,env={}){
 if(request.method!=='POST')return response({error:'method_not_allowed'},405);
 if(!isReady(env))return response({error:'not_configured'},503);
 const origin=request.headers.get('origin');
 if(!['https://daninihub.com','https://www.daninihub.com'].includes(origin))
  return response({error:'invalid_origin'},403);
 if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type')||''))
  return response({error:'invalid_type'},415);
 if(Number(request.headers.get('content-length')||'0')>MAX_BYTES)
  return response({error:'too_large'},413);
 let body;
 try{
  const raw=await request.text();
  if(raw.length>MAX_BYTES)return response({error:'too_large'},413);
  body=JSON.parse(raw);
 }catch{return response({error:'invalid_json'},400);}
 if(!body||typeof body!=='object'||Array.isArray(body))return response({error:'invalid_fields'},400);
 const token=body['cf-turnstile-response'];
 if(!await verifyCaptcha(request,env,token))
  return response({error:'human_verification_failed'},403);
 const data=validateAiIntake(body);
 if(!data)return response({error:'invalid_fields'},400);
 const reference='DN-AI-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+crypto.randomUUID().slice(0,8).toUpperCase();
 const email={
  sender:sender(env),
  to:[{email:'kontakt@daninihub.com'}],
  replyTo:{email:data.email,name:data.name},
  subject:'DANINI AI / Fahrzeugprüfung / '+reference,
  textContent:aiReport(data,reference),
  tags:['danini','vehicle-intake','manual-review']
 };
 try{await brevoSend(env,email);}
 catch{
  // Do not leak provider response, account settings or personal data.
  return response({error:'mail_provider_unavailable'},502);
 }
 return response({accepted:true,reference},202);
}

export async function handleApi(request,env={}){
 const url=new URL(request.url);
 if(url.pathname==='/api/lead/status' && request.method==='GET'){
  return response({enabled:isReady(env),channel:isReady(env)?'brevo':'setup_required',
   turnstileSiteKey:isReady(env)?env.DANINI_TURNSTILE_SITEKEY:null});
 }
 if(url.pathname==='/api/ai-intake')return handleAiIntake(request,env);
 if(url.pathname!=='/api/lead')return response({error:'not_found'},404);
 if(request.method!=='POST')return response({error:'method_not_allowed'},405);
 if(!isReady(env))return response({error:'not_configured'},503);
 const origin=request.headers.get('origin');
 if(!origin || !['https://daninihub.com','https://www.daninihub.com'].includes(origin))
  return response({error:'invalid_origin'},403);
 const type=request.headers.get('content-type')||'';
 if(!/^application\/json(?:\s*;|$)/i.test(type))return response({error:'invalid_type'},415);
 const size=Number(request.headers.get('content-length')||'0');
 if(size>MAX_BYTES)return response({error:'too_large'},413);
 let body;
 try{const raw=await request.text();if(raw.length>MAX_BYTES)return response({error:'too_large'},413);body=JSON.parse(raw);}
 catch{return response({error:'invalid_json'},400);}
 const data=validatePayload(body);
 if(!data)return response({error:'invalid_fields'},400);
 if(!await verifyCaptcha(request,env,body.turnstileToken))return response({error:'human_verification_failed'},400);
 const ref='DN-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+crypto.randomUUID().slice(0,8).toUpperCase();
 const alert={
  sender:sender(env),to:[{email:env.DANINI_NOTIFY_TO}],
  replyTo:{email:data.email,name:data.name},
  subject:'DaniniHub | DANINI ['+data.kind.toUpperCase()+'] '+data.topic.slice(0,55)+' / '+ref,
  textContent:bodyText(data,ref),
  tags:['danini','service-enquiry']
 };
 try{await brevoSend(env,alert);}catch(e){
  // Safe operational diagnostics: never expose API keys, customer content or raw Brevo errors.
  const msg=e instanceof Error?e.message:'unknown';
  const match=msg.match(/^BREVO_REJECTED_(\d{3})$/);
  const providerStatus=match?Number(match[1]):null;
  return response({error:'mail_provider_unavailable',providerStatus},502);
 }
 // A confirmation is secondary; the operator notification is the authoritative step.
 // Never include customer-supplied text in confirmation (spam/backscatter mitigation).
 const acknowledgment={
  sender:receiptSender[data.kind],
  templateId:BREVO_TEMPLATE_ID[data.kind][data.language],
  to:[{email:data.email,name:data.name}],
  replyTo:{email:data.kind==='vehicle'?'auto@daninihub.com':'info@daninihub.com'},
  params:{REFERENCE:ref},
  tags:['danini','transactional-receipt']
 };
 let receiptAccepted=false;
 try{await brevoSend(env,acknowledgment);receiptAccepted=true;}catch{}
 return response({accepted:true,reference:ref,receiptAccepted},202);
}
export default {
 async fetch(request,env){
  const pathname=new URL(request.url).pathname;
  if(pathname.startsWith('/api/danini/digital/'))return digitalRoute(request,env);
  if(pathname.startsWith('/api/'))return handleApi(request,env);
  return env.ASSETS.fetch(request);
 }
};
