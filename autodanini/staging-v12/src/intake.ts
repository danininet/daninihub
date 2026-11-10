/**
 * DANINI / one inbound channel for all public inquiry forms.
 * Do not claim an email was sent when the backend is not configured.
 * Turnstile is rendered ONLY after the server advertises a ready sender.
 */
type IntakeKind='general'|'vehicle'|'business'|'support';
type TurnstileWidget={render:(el:HTMLElement,options:{sitekey:string,theme:string,language:string})=>string|number;getResponse:(id:string|number)=>string;reset:(id:string|number)=>void;remove?:(id:string|number)=>void};
type IntakeConfig={enabled:boolean;turnstileSiteKey?:string|null};
const isGerman=()=>document.documentElement.lang==='de'||localStorage.getItem('autodanini-language')==='de';
const translate=(sr:string,de:string)=>isGerman()?de:sr;
const asStr=(v:FormDataEntryValue|null,max=700)=>String(v||'').trim().slice(0,max);
const safeDetails=(form:HTMLFormElement)=>{
 const details:Record<string,string>={};
 for(const [k,v] of new FormData(form).entries()){
  if(['consent','email','person','name','company','message','topic','cf-turnstile-response'].includes(k))continue;
  if(typeof v==='string'&&/^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(k))details[k]=v.trim().slice(0,350);
 }
 return details;
};
const tsApi=():TurnstileWidget|undefined=>(window as unknown as {turnstile?:TurnstileWidget}).turnstile;
let captchaScript:Promise<void>|null=null;
function loadTurnstile(){
 if(captchaScript)return captchaScript;
 captchaScript=new Promise<void>((resolve,reject)=>{
  if(tsApi()){resolve();return;}
  const script=document.createElement('script');
  script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.async=true;script.defer=true;
  script.onload=()=>resolve();
  script.onerror=()=>reject(new Error('captcha_load_failed'));
  document.head.append(script);
 });
 return captchaScript;
}
function makeLabel(form:HTMLFormElement,fieldName:string,srLabel:string,deLabel:string,required:boolean){
 if(form.querySelector<HTMLInputElement>('input[name="'+fieldName+'"]'))return;
 const label=document.createElement('label');
 label.className='danini-intake-email';
 const text=document.createElement('span');
 text.dataset.sr=srLabel;text.dataset.de=deLabel;
 text.textContent=translate(srLabel,deLabel);
 const input=document.createElement('input');
 input.name=fieldName;input.type='email';input.maxLength=254;input.autocomplete='email';
 input.placeholder='name@example.com';input.required=required;
 label.append(text,input);
 const consent=form.querySelector('input[name="consent"]')?.closest('label');
 form.insertBefore(label,consent||form.querySelector('button[type="submit"]')||null);
}
function setFormWording(form:HTMLFormElement){
 const consent=form.querySelector<HTMLInputElement>('input[name="consent"]');
 const span=consent?.closest('label')?.querySelector<HTMLElement>('span');
 if(span){
  span.dataset.sr='Prihvatam obradu navedenih podataka radi odgovora na ovaj pojedinačni upit. Nema prijave na newsletter ni automatske kupovine.';
  span.dataset.de='Ich bin mit der Verarbeitung dieser Angaben zur Beantwortung dieser einzelnen Anfrage einverstanden. Kein Newsletter und keine Bestellung.';
  span.textContent=translate(span.dataset.sr,span.dataset.de);
 }
 const btn=form.querySelector<HTMLButtonElement>('button[type="submit"]');
 if(btn){
  const span=btn.querySelector<HTMLElement>('[data-sr][data-de]');
  if(span){
   span.dataset.sr='Pošalji e-mail upit';
   span.dataset.de='E-Mail-Anfrage absenden';
   span.textContent=translate(span.dataset.sr,span.dataset.de);
  }else btn.textContent=translate('Pošalji e-mail upit','E-Mail-Anfrage absenden');
 }
 const status=form.querySelector<HTMLElement>('[role="status"]');
 if(status){
  status.textContent=translate('Proveravamo dostupnost zaštićenog e-mail obrasca…','Verfügbarkeit des geschützten E-Mail-Formulars wird geprüft…');
 }
}
function statusState(form:HTMLFormElement,state:'ready'|'sending'|'success'|'error'|'offline'){
 form.dataset.intakeState=state;
 const status=statusNode(form);
 status.setAttribute('data-state',state);
}
function manualEmailFallback(form:HTMLFormElement,kind:IntakeKind,payload:ReturnType<typeof collect>){
 const status=statusNode(form);
 const destination=kind==='support'?'support@daninihub.com':kind==='business'?'business@daninihub.com':kind==='vehicle'?'auto@daninihub.com':'kontakt@daninihub.com';
 const subject='DANINI '+kind.toUpperCase()+' / '+payload.topic;
 const message=['Name: '+payload.name,'Email: '+payload.email,payload.company?'Company: '+payload.company:'','Topic: '+payload.topic,'','Message:',payload.message].filter(Boolean).join('\n').slice(0,1600);
 const a=document.createElement('a');
 a.className='danini-email-fallback';
 a.href='mailto:'+destination+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(message);
 a.textContent=translate('Pošaljite isti upit preko e-maila ↗','Gleiche Anfrage per E-Mail senden ↗');
 a.rel='nofollow';
 status.append(document.createTextNode(' '),a);
}
function statusNode(form:HTMLFormElement){
 let el=form.querySelector<HTMLElement>('[role="status"]');
 if(!el){el=document.createElement('p');el.setAttribute('role','status');el.setAttribute('aria-live','polite');form.append(el);}
 return el;
}
function collect(form:HTMLFormElement,kind:IntakeKind){
 const f=new FormData(form);
 const name=asStr(f.get('person')||f.get('name'),90);
 const email=asStr(f.get('email'),254);
 const company=asStr(f.get('company'),120);
 const topic=kind==='vehicle'||kind==='business'?
   asStr(f.get('service'),120)||'Fahrzeuganfrage':asStr(f.get('topic'),120)||'Allgemeine Anfrage';
 const message=kind==='vehicle'||kind==='business'?
  [
   'Anfrage / Upit: '+topic,
   'Fahrzeug: '+asStr(f.get('vehicle')),
   ...(company?['Unternehmen: '+company]:[]),
   'Budget EUR: '+asStr(f.get('budget')),
   'Land: '+asStr(f.get('country')),
   'Hinweise: '+(asStr(f.get('notes'),1500)||'-'),
   'Weitere Felder befinden sich im strukturierten RFQ.'
  ].join('\n') : asStr(f.get('message'),3200);
 return {kind,name,email,company,topic,message,language:isGerman()?'de':'sr',details:safeDetails(form),consent:f.get('consent')==='on'};
}
function makeFallback(form:HTMLFormElement){
 const button=form.querySelector<HTMLButtonElement>('button[type="submit"]');
 if(button){button.disabled=true;button.title=translate('Automatsko e-mail slanje još nije aktivirano','Automatischer E-Mail-Versand noch nicht aktiviert');}
 const status=statusNode(form);
 const address=form.id==='autodanini-support-form'?'support@daninihub.com':
  form.dataset.dealer==='true'?'business@daninihub.com':
  form.classList.contains('rfq')?'auto@daninihub.com':'kontakt@daninihub.com';
 statusState(form,'offline');
 status.textContent=translate(
  'Automatski obrazac trenutno nije aktivan. Upit možete poslati direktno na poslovnu e-mail adresu:',
  'Das automatische Formular ist derzeit noch nicht aktiv. Bitte senden Sie Ihre Anfrage direkt an die geschäftliche E-Mail-Adresse:'
 )+' ';
 const link=document.createElement('a');
 link.href='mailto:'+address;
 link.textContent=address;
 link.rel='nofollow';
 status.append(link);
}

async function setup(form:HTMLFormElement,config:IntakeConfig){
 if(form.dataset.intakeReady)return;
 form.dataset.intakeReady='true';
 form.setAttribute('method','post');
 form.setAttribute('action','/api/lead');
 const kind:IntakeKind=form.id==='autodanini-support-form'?'support':
  form.id==='danini-general-inquiry-form'?'general':
  form.dataset.dealer==='true'?'business':'vehicle';
 makeLabel(form,'email','E-mail za odgovor (obavezno)','E-Mail für die Antwort (erforderlich)',true);
 if(kind==='general'||kind==='support'){
  const name=form.querySelector<HTMLInputElement>('input[name="name"]');
  if(name)name.required=true;
 }
 setFormWording(form);
 const status=statusNode(form);
 if(!config.enabled || !config.turnstileSiteKey){makeFallback(form);return;}
 const verification=document.createElement('div');
 verification.className='danini-captcha';verification.setAttribute('aria-label','Human verification / Provera');
 const button=form.querySelector<HTMLButtonElement>('button[type="submit"]');
 form.insertBefore(verification,button||null);
 let widget:string|number;
 try{
  await loadTurnstile();
  const ts=tsApi();if(!ts)throw Error('missing_turnstile');
  const render=()=>ts.render(verification,{sitekey:config.turnstileSiteKey!,theme:'auto',language:isGerman()?'de':'sr'});
  widget=render();
  // The user can toggle SR/DE without reloading. Recreate the challenge on
  // that change so its text follows the chosen site language, not browser UI.
  document.addEventListener('danini:language-changed',()=>{
   const current=tsApi();
   if(!current?.remove)return;
   try{
    current.remove(widget);
    widget=render();
    status.textContent=translate('Formular je spreman. Podaci idu samo radi odgovora na upit.','Formular bereit. Daten werden nur zur Bearbeitung Ihrer Anfrage übermittelt.');
   }catch{
    if(button)button.disabled=true;
    status.textContent=translate('Bezbednosna provera trenutno nije dostupna. Kontaktirajte nas e-mailom.','Sicherheitsprüfung derzeit nicht verfügbar. Kontaktieren Sie uns bitte per E-Mail.');
   }
  });
 }catch{makeFallback(form);return;}
 statusState(form,'ready');
 status.textContent=translate('Formular je spreman. Podaci idu samo radi odgovora na upit.','Formular bereit. Daten werden nur zur Bearbeitung Ihrer Anfrage übermittelt.');
 if(button)button.disabled=false;
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const payload=collect(form,kind);
  if(!payload.consent)return;
  const token=tsApi()?.getResponse(widget);
  if(!token){
   status.textContent=translate('Potvrdite da niste robot.','Bitte bestätigen Sie die Sicherheitsprüfung.');
   return;
  }
  const btn=form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if(btn)btn.disabled=true;
  statusState(form,'sending');
  status.textContent=translate('Šaljemo upit e-mail servisu…','Anfrage wird an den E-Mail-Dienst übermittelt…');
  // Resetting the form or a third-party CAPTCHA widget MUST NOT overwrite a
  // server-accepted reference with a misleading "not sent" message.
  let accepted=false;
  let diagnostic='';
  try {
   const res=await fetch('/api/lead',{method:'POST',credentials:'same-origin',
    headers:{'content-type':'application/json'},cache:'no-store',
    body:JSON.stringify({...payload,turnstileToken:token})});
   const result=await res.json() as {accepted?:boolean;reference?:string;error?:string;receiptAccepted?:boolean;providerStatus?:number|null};
   diagnostic='HTTP '+res.status+' / '+(typeof result.error==='string'?result.error:'unexpected_response')+(typeof result.providerStatus==='number'?' / Brevo '+result.providerStatus:'');
   if(res.status!==202||result.accepted!==true||!/^DN-[0-9]{8}-[A-F0-9]{8}$/.test(result.reference||'')){
    const errorCode=typeof result.error==='string'?result.error:'unknown_error';
    // No sensitive payloads, email addresses or CAPTCHA tokens in diagnostics.
    throw Error(errorCode);
   }
   accepted=true;
   statusState(form,'success');
   const reference=result.reference as string;
   try{sessionStorage.setItem('danini-last-accepted-reference',reference);}catch{}
   status.textContent=translate(
    'E-mail servis je prihvatio upit. Oznaka: '+reference+'. '+(result.receiptAccepted?'Potvrda je poslata e-mail servisu. ':'Potvrda za pošiljaoca nije prihvaćena; sačuvajte oznaku upita. ')+'Ovo nije potvrda rezervacije ili narudžbine.',
    'Der E-Mail-Dienst hat die Anfrage angenommen. Referenz: '+reference+'. '+(result.receiptAccepted?'Eingangsbestätigung an den E-Mail-Dienst übergeben. ':'Die Eingangsbestätigung wurde nicht angenommen; bitte Referenz notieren. ')+'Keine Reservierung oder Bestellung.'
   );
   // DOM cleanup is secondary; a failed reset cannot retract Brevo acceptance.
   try{form.reset();}catch{}
  }catch(error){
   if(!accepted){
    statusState(form,'error');
    const code=error instanceof Error?error.message:'unknown_error';
    const referenceCode=diagnostic||'connection_or_invalid_response';
    const humanCheck=code==='human_verification_failed';
    const providerError=code==='mail_provider_unavailable';
    status.textContent=humanCheck?translate(
     'Bezbednosna provera nije prihvaćena. Osvežite CAPTCHA i pokušajte ponovo.',
     'Sicherheitsprüfung nicht akzeptiert. Bitte CAPTCHA erneuern und erneut versuchen.'
    ):providerError?translate(
     'E-mail servis trenutno nije prihvatio upit. Nemojte ponavljati plaćanje ni pretpostaviti da je upit primljen.',
     'Der E-Mail-Dienst hat die Anfrage derzeit nicht angenommen. Bitte nicht von einem erfolgreichen Versand ausgehen.'
    ):translate(
     'Slanje nije potvrđeno. Pokušajte ponovo ili koristite direktni kontakt. Nemojte pretpostaviti da smo dobili upit.',
     'Versand nicht bestätigt. Bitte erneut versuchen oder direkten Kontakt nutzen. Nicht von einer erfolgreichen Zustellung ausgehen.'
    );
    // Surface a bounded, non-sensitive diagnostic code instead of a silent generic failure.
    // Makes failed public requests distinguishable without exposing customer content or secrets.
    status.textContent+=' ['+referenceCode.slice(0,100)+']';
    manualEmailFallback(form,kind,payload);
   }
  }finally{
   try{tsApi()?.reset(widget);}catch{}
   if(btn)btn.disabled=false;
  }
 });
}
async function initialize(){
 // Carry the pre-purchase vehicle description only through this tab's
 // sessionStorage. No query strings, network transmission or persistent lead DB.
 const general=document.querySelector<HTMLFormElement>('#danini-general-inquiry-form');
 if(general){
  try{
   const draft=sessionStorage.getItem('danini-prepurchase-draft');
   if(draft&&draft.length<3000){
    const text=general.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
    const topic=general.querySelector<HTMLSelectElement>('select[name="topic"]');
    if(text&&!text.value)text.value=draft;
    if(topic)topic.value='AutoDanini – Fahrzeugkauf / Fahrzeugprüfung';
   }
   sessionStorage.removeItem('danini-prepurchase-draft');
  }catch{}
 }
 const forms=Array.from(document.querySelectorAll<HTMLFormElement>('.rfq[data-dealer], #autodanini-support-form, #danini-general-inquiry-form'));
 if(!forms.length)return;
 // Prevent browser-native submissions or false positive UI before readiness.
 for(const form of forms){
  form.action='/api/lead';form.method='post';
  const btn=form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if(btn)btn.disabled=true;
  const status=statusNode(form);
  status.textContent=translate('Provera e-mail kanala…','E-Mail-Kanal wird geprüft…');
 }
 let config:IntakeConfig={enabled:false};
 try{
  const r=await fetch('/api/lead/status',{credentials:'same-origin',cache:'no-store'});
  if(r.ok)config=(await r.json()) as IntakeConfig;
 }catch{}
 for(const form of forms)await setup(form,config);
 // A successful DN acceptance belongs to this tab, not to the recipient's email inbox.
 // Show it again after a reload so users can reference it without copying sensitive data.
 try{
  const last=sessionStorage.getItem('danini-last-accepted-reference');
  if(last && /^DN-[0-9]{8}-[A-F0-9]{8}$/.test(last) && general){
   const reminder=document.createElement('p');
   reminder.className='danini-reference-reminder';
   reminder.textContent=translate('Prethodno prihvaćen upit: '+last+' (nije potvrda isporuke).','Zuletzt angenommene Anfrage: '+last+' (keine Zustellbestätigung).');
   general.prepend(reminder);
  }
 }catch{}
}
void initialize();
