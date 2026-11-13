/**
 * DANINI PR #207 isolated preview worker.
 * NEVER attach a production custom domain. No BREVO_API_KEY, D1, R2, payments or production email.
 * Bundle generator replaces the empty PAGES payload with compiled static advisor pages.
 */
const PAGES = {};
const TEST_SITEKEY = '1x00000000000000000000AA';
const TEST_SECRET = '1x0000000000000000000000000000000AA';
const headers = { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'x-robots-tag': 'noindex, nofollow' };
function json(payload,status=200){return new Response(JSON.stringify(payload),{status,headers:{...headers,'content-type':'application/json; charset=utf-8'}});}
function safe(v,length){return typeof v==='string'?v.trim().slice(0,length):'';}
function validate(body){
 if(!body||typeof body!=='object'||Array.isArray(body)||body.consent!==true||
  !['de','sr'].includes(body.language))return null;
 const source=safe(body.source,500);
 const vin=/^[A-HJ-NPR-Z0-9]{17}$/i.test(source);
 let url=false;
 if(!vin){try{const u=new URL(source);url=u.protocol==='https:'&&Boolean(u.hostname)&&!u.username&&!u.password&&source.length<=500;}catch{}}
 const name=safe(body.name,90),email=safe(body.email,254);
 if(!(url||vin)||!name||!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))return null;
 if(!Array.isArray(body.answers)||body.answers.length!==3)return null;
 const answers=body.answers.map((a,i)=>a?.question===i+1&&['confirmed','missing','critical'].includes(a.status)?{question:i+1,status:a.status}:null);
 if(answers.includes(null))return null;
 return {source,language:body.language,answers};
}
export default {
 async fetch(request){
  const url=new URL(request.url),pathname=url.pathname;
  if(pathname==='/api/lead/status'&&request.method==='GET')
    return json({enabled:true,channel:'preview_no_email',turnstileSiteKey:TEST_SITEKEY});
  if(pathname==='/api/ai-intake'){
   if(request.method!=='POST')return json({error:'method_not_allowed'},405);
   if(request.headers.get('origin')!==url.origin)return json({error:'invalid_origin'},403);
   if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type')||''))return json({error:'invalid_type'},415);
   if(Number(request.headers.get('content-length')||'0')>12000)return json({error:'too_large'},413);
   let body;
   try{const raw=await request.text();if(raw.length>12000)return json({error:'too_large'},413);body=JSON.parse(raw);}catch{return json({error:'invalid_json'},400);}
   const token=body?.['cf-turnstile-response'];
   if(typeof token!=='string'||token.length<10||token.length>2048)return json({error:'human_verification_failed'},403);
   const form=new FormData();form.set('secret',TEST_SECRET);form.set('response',token);
   try{
    const validated=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form,signal:AbortSignal.timeout(8000)});
    const result=await validated.json();
    // Cloudflare test keys return example.com, unlike production keys.
    if(!validated.ok||result.success!==true||result.hostname!=='example.com')return json({error:'human_verification_failed'},403);
   }catch{return json({error:'human_verification_failed'},403);}
   const payload=validate(body);
   if(!payload)return json({error:'invalid_fields'},400);
   const reference='PREVIEW-'+crypto.randomUUID().slice(0,8).toUpperCase();
   // No email, no storage, no external user data sent (except the captcha token to Cloudflare).
   return json({accepted:true,preview:true,reference,payload,mailSent:false},200);
  }
  const key=pathname==='/danini-advisor-client.js'?'/danini-advisor-client.js':
    pathname==='/de/'?'/de/ai-savetnik/':
    pathname==='/sr/'?'/sr/ai-savetnik/':
    pathname;
  const item=PAGES[key];
  if(item!==undefined)
   return new Response(item,{status:200,headers:{...headers,'content-type':key.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'}});
  return json({error:'not_found',preview:true},404);
 }
};