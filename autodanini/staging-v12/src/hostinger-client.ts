/**
 * Hostinger browser adapter for the original AutoDanini v12 HTML/CSS.
 * ACCOUNT ACCESS OFF BY DEFAULT. Enable only with matching Hostinger API,
 * complete E2E tenant-isolation tests, a verified Brevo sender and HTTPS.
 * Never use this adapter in the existing AppDeploy build.
 */
type ApiResponse<T=Record<string,unknown>>={data:T};
type JsonObject=Record<string,unknown>;
type AppUser={userId:string;name?:string;email?:string};
const ENABLE_ACCOUNTS=import.meta.env.VITE_AUTODANINI_AUTH_ENABLED==='true';
const ENABLE_AI=import.meta.env.VITE_AUTODANINI_AI_ENABLED==='true';
const UNAVAILABLE='HOSTINGER_FEATURE_NOT_READY';

function allowedPath(path:string):boolean {
 return (ENABLE_AI && path==='/api/advice') ||
  (ENABLE_ACCOUNTS && (
   path==='/api/my-cases' ||
   /^\/api\/my-cases\/[a-f0-9]{32}$/.test(path) ||
   /^\/api\/my-submission\/[a-f0-9]{32}$/.test(path) ||
   path==='/api/case-submissions'));
}
async function send<T=JsonObject>(method:'GET'|'POST'|'PUT'|'DELETE',path:string,body?:JsonObject):Promise<ApiResponse<T>> {
 if(!allowedPath(path))throw new Error(UNAVAILABLE);
 if(path==='/api/advice'){
  if(method!=='POST'||body?.consent!==true)throw new Error('CONSENT_REQUIRED');
  const question=typeof body.question==='string'?body.question.trim():'';
  if(question.length<30||question.length>2500)throw new Error('INVALID_QUESTION');
  body={question,mode:body.mode==='dealer'||body.mode==='import'?body.mode:'buyer',lang:body.lang==='de'?'de':'sr',consent:true};
 }
 const response=await fetch(path,{
  method,credentials:'same-origin',
  headers:{'Accept':'application/json',...(method!=='GET'?{'Content-Type':'application/json'}:{})},
  ...(method!=='GET'?{body:JSON.stringify(body??{})}:{}),
  signal:AbortSignal.timeout(15000)
 });
 if(!response.ok)throw new Error('REQUEST_UNAVAILABLE_'+response.status);
 return {data:await response.json() as T};
}
async function authRequest<T=JsonObject>(method:'GET'|'POST',path:string,body?:JsonObject):Promise<T>{
 if(!ENABLE_ACCOUNTS)throw new Error(UNAVAILABLE);
 const response=await fetch(path,{
  method,credentials:'same-origin',
  headers:{'Accept':'application/json',...(method==='POST'?{'Content-Type':'application/json'}:{})},
  ...(method==='POST'?{body:JSON.stringify(body??{})}:{}),
  signal:AbortSignal.timeout(15000)
 });
 if(!response.ok)throw new Error('LOGIN_UNAVAILABLE_'+response.status);
 return await response.json() as T;
}

/** Native accessible modal only when buyer explicitly requests login. */
function ask(title:string,label:string,inputType:'email'|'text',pattern?:string):Promise<string|null> {
 return new Promise(resolve=>{
  const dlg=document.createElement('dialog');
  dlg.setAttribute('aria-label',title);
  dlg.style.cssText='width:min(420px,calc(100vw - 32px));max-width:100%;padding:26px;border:1px solid #cda76e;border-radius:10px;background:#111820;color:#fff;box-shadow:0 16px 70px #0009;';
  const heading=document.createElement('h2');
  heading.textContent=title;heading.style.margin='0 0 15px';
  const form=document.createElement('form');
  const lab=document.createElement('label');lab.textContent=label;
  lab.style.cssText='display:grid;gap:8px;margin-bottom:18px';
  const field=document.createElement('input');field.type=inputType;
  field.required=true;field.autocomplete=inputType==='email'?'email':'one-time-code';
  if(pattern){field.pattern=pattern;field.inputMode='numeric';field.maxLength=6;}
  field.style.cssText='background:#fff;color:#111820;border-radius:5px;border:1px solid #bbb;padding:12px;width:100%;box-sizing:border-box';
  lab.append(field);
  const actions=document.createElement('div');
  actions.style.cssText='display:flex;gap:12px;justify-content:flex-end';
  const cancel=document.createElement('button');cancel.type='button';
  cancel.textContent='Otkaži / Abbrechen';
  const submit=document.createElement('button');submit.type='submit';
  submit.textContent='Nastavi / Weiter';
  actions.append(cancel,submit);form.append(lab,actions);dlg.append(heading,form);
  document.body.append(dlg);
  let settled=false;
  const finish=(value:string|null)=>{if(settled)return;settled=true;dlg.close();dlg.remove();resolve(value)};
  cancel.addEventListener('click',()=>finish(null));
  dlg.addEventListener('cancel',e=>{e.preventDefault();finish(null)});
  form.addEventListener('submit',ev=>{ev.preventDefault();if(field.reportValidity())finish(field.value.trim())});
  dlg.showModal();field.focus();
 });
}

export const api={
 get:<T=JsonObject>(path:string)=>send<T>('GET',path),
 post:<T=JsonObject>(path:string,body?:JsonObject)=>send<T>('POST',path,body),
 put:<T=JsonObject>(path:string,body?:JsonObject)=>send<T>('PUT',path,body),
 delete:<T=JsonObject>(path:string)=>send<T>('DELETE',path)
};
export const auth={
 async getUser():Promise<AppUser|null>{
  if(!ENABLE_ACCOUNTS)return null;
  const result=await authRequest<{user:AppUser|null}>('GET','/api/auth/me');
  return result.user||null;
 },
 async signIn():Promise<void>{
  if(!ENABLE_ACCOUNTS)throw new Error(UNAVAILABLE);
  const german=localStorage.getItem('autodanini-language')==='de';
  const email=await ask(german?'Sicher anmelden':'Bezbedna prijava',german?'Ihre E-Mail-Adresse':'Vaša e-mail adresa','email');
  if(!email)return;
  const started=await authRequest<{challengeId:string}>('POST','/api/auth/start',{email});
  const code=await ask(german?'Code aus der E-Mail':'Kod iz e-mail poruke',german?'Sechsstelliger Code (10 Minuten gültig)':'Šestocifreni kod (važi 10 minuta)','text','[0-9]{6}');
  if(!code)return;
  await authRequest('POST','/api/auth/verify',{challengeId:started.challengeId,code});
 },
 async signOut():Promise<void>{
  if(!ENABLE_ACCOUNTS)return;
  await authRequest('POST','/api/auth/logout',{});
 }
};

/**
 * Keep the existing photographic design when an image service works;
 * silently fall back to first-party original business photos if it fails.
 */
function protectPhotographs():void {
  const replacement='/danini-auto-uvoz.webp';
  for(const photo of document.querySelectorAll<HTMLImageElement>('img')){
    if(!photo.src.startsWith('https://images.unsplash.com/'))continue;
    const fail=()=>{photo.removeEventListener('error',fail);photo.src=replacement;};
    photo.addEventListener('error',fail,{once:true});
    if(photo.complete && photo.naturalWidth===0)fail();
  }
  for(const element of document.querySelectorAll<HTMLElement>('[style*="images.unsplash.com"]')){
    const background=element.style.backgroundImage;
    const match=background.match(/https:\/\/images\.unsplash\.com\/[^)'"]+/);
    if(!match)continue;
    const probe=new Image();
    probe.onerror=()=>{
      // Preserve existing backgrounds, gradients, positioning and element sizes.
      element.style.backgroundImage=background.replace(match[0],replacement);
    };
    probe.src=match[0];
  }
}

document.addEventListener('DOMContentLoaded',()=>{
 protectPhotographs();
 if(!ENABLE_AI){
   // The styling and layout are unchanged. Don't offer a paid model button
   // until the quota-protected Hostinger service is explicitly activated.
   const run=document.getElementById('ai-go');
   if(run instanceof HTMLButtonElement){
     run.disabled=true;
     run.setAttribute('aria-disabled','true');
     const german=localStorage.getItem('autodanini-language')==='de';
     run.textContent=german?'KI-Beratung in Vorbereitung':'AI savetnik u pripremi';
   }
 }
 const german=localStorage.getItem('autodanini-language')==='de';
 const label=german?'Anmeldung in Vorbereitung':'Prijava u pripremi';
 // Owner dashboard is never exposed through the customer-only adapter.
 const adminButton=document.getElementById('admin-login');
 if(adminButton instanceof HTMLButtonElement){
  adminButton.disabled=true;adminButton.textContent=label;adminButton.setAttribute('aria-disabled','true');
 }
 if(!ENABLE_ACCOUNTS){
  const buyerButton=document.getElementById('account-login');
  if(buyerButton instanceof HTMLButtonElement){
   buyerButton.disabled=true;buyerButton.textContent=label;buyerButton.setAttribute('aria-disabled','true');
  }
  const caseForm=document.getElementById('account-case-form');
  if(caseForm instanceof HTMLFormElement){
   for(const el of caseForm.querySelectorAll('button,input,select,textarea')){
    if(el instanceof HTMLButtonElement||el instanceof HTMLInputElement||
       el instanceof HTMLSelectElement||el instanceof HTMLTextAreaElement)el.disabled=true;
   }
  }
 }
 if(!ENABLE_ACCOUNTS){
  const status=document.getElementById('account-status');
  if(status)status.textContent=german?
   'Privates Konto ist im Hostinger-Test noch nicht freigeschaltet.':
   'Privatni nalozi nisu aktivni u Hostinger probnoj verziji.';
 }
 const ownerStatus=document.getElementById('admin-status');
 if(ownerStatus)ownerStatus.textContent=german?
  'Administratorzugang erst nach separater Sicherheitsprüfung.':
  'Administratorski pristup biće otvoren tek nakon zasebne bezbednosne provere.';
});
