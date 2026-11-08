/**
 * DANINI / one inbound channel for all public inquiry forms.
 * Do not claim an email was sent when the backend is not configured.
 * Turnstile is rendered ONLY after the server advertises a ready sender.
 */
type IntakeKind='general'|'vehicle'|'business'|'support';
type TurnstileWidget={render:(el:HTMLElement,options:{sitekey:string,theme:string})=>string|number;getResponse:(id:string|number)=>string;reset:(id:string|number)=>void};
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
 // No Brevo credentials are present. Offer a deliberate, local mailto handoff,
 // not a fake API success and not an automatic submission.
 const button=form.querySelector<HTMLButtonElement>('button[type="submit"]');
 const status=statusNode(form);
 if(button){
  button.disabled=false;
  button.title=translate('Otvori u sopstvenoj e-mail aplikaciji','In eigener E-Mail-App öffnen');
  const label=button.querySelector<HTMLElement>('[data-sr][data-de]');
  if(label){
   label.dataset.sr='Pripremi e-mail poruku';
   label.dataset.de='E-Mail-Entwurf öffnen';
   label.textContent=translate(label.dataset.sr,label.dataset.de);
  } else button.textContent=translate('Pripremi e-mail poruku','E-Mail-Entwurf öffnen');
 }
 status.textContent=translate(
  'Automatski Brevo prijem još nije aktiviran. Ovde se priprema poruka za vašu e-mail aplikaciju; morate sami potvrditi slanje.',
  'Automatischer Brevo-Empfang noch nicht aktiv. Hier wird eine E-Mail in Ihrer eigenen App vorbereitet; Sie müssen das Senden selbst bestätigen.'
 );
 const aside=document.createElement('p');
 aside.className='danini-manual-email-notice';
 aside.textContent=translate(
  'Ako nemate podešenu e-mail aplikaciju, kopirajte tekst i pošaljite na prikazanu adresu. Ne unosite poverljiva dokumenta.',
  'Falls keine E-Mail-App eingerichtet ist, kopieren Sie den Text und senden Sie ihn an die angezeigte Adresse. Keine vertraulichen Dokumente.'
 );
 const address=document.createElement('code');
 // Verified as a receiving Gmail alias using one internal inbox test.
 // Replace with a tested domain mailbox as soon as Cloudflare Email Routing works.
 const recipient=['dragangaganet','+daninihub','@gmail.com'].join('');
 address.textContent=recipient;
 aside.append(document.createTextNode(' '),address);
 form.append(aside);
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const kind:IntakeKind=form.id==='autodanini-support-form'?'support':
   form.id==='danini-general-inquiry-form'?'general':
   form.dataset.dealer==='true'?'business':'vehicle';
  const data=collect(form,kind);
  if(!data.consent)return;
  const subject='DaniniHub | DANINI '+data.kind.toUpperCase()+' | '+data.topic.slice(0,60);
  const detailLines=Object.entries(data.details).slice(0,20).map(([k,v])=>k+': '+v);
  const body=[
   'DANINI / unverbindliche Anfrage / informativni upit',
   'Kontakt: '+data.name,
   'E-Mail: '+data.email,
   ...(data.company?['Unternehmen: '+data.company]:[]),
   'Thema: '+data.topic,
   ...detailLines,
   '',
   data.message,
   '',
   'Keine Bestellung oder Zahlung / Nije narudžbina niti plaćanje.'
  ].join('\n');
  if(body.length>1700){
   status.textContent=translate(
    'Tekst je predugačak za otvaranje e-mail aplikacije. Skratite napomene ili oglase i pokušajte ponovo.',
    'Der Entwurf ist zu lang für eine E-Mail-App. Bitte kürzen Sie Notizen und Links.'
   );
   return;
  }
  const target='mailto:'+recipient+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  let preview=form.querySelector<HTMLTextAreaElement>('.danini-manual-draft');
  if(!preview){
   const wrapper=document.createElement('div');
   wrapper.className='danini-manual-preview';
   preview=document.createElement('textarea');
   preview.className='danini-manual-draft';
   preview.readOnly=true;preview.rows=6;
   preview.setAttribute('aria-label',translate('Nacrt poruke za kopiranje','E-Mail-Entwurf zum Kopieren'));
   const copy=document.createElement('button');
   copy.type='button';copy.className='btn outline';
   copy.textContent=translate('Kopiraj poruku','Nachricht kopieren');
   copy.addEventListener('click',async()=>{
    try{
     if(!preview)return;
     await navigator.clipboard.writeText(preview.value);
     status.textContent=translate('Kopirano. Pošaljite tekst preko svoje e-mail aplikacije.','Kopiert. Bitte senden Sie den Text über Ihre E-Mail-App.');
    }catch{preview?.focus();preview?.select();
     status.textContent=translate('Označen tekst: ručno kopirajte.','Text markiert: bitte manuell kopieren.');}
   });
   wrapper.append(preview,copy);
   form.append(wrapper);
  }
  preview.value='To: '+recipient+'\nSubject: '+subject+'\n\n'+body;
  status.textContent=translate(
   'Otvara se vaša e-mail aplikacija. Poruka NIJE poslata dok sami ne kliknete Pošalji. Nacrt možete i kopirati ispod.',
   'Ihre E-Mail-App wird geöffnet. Die Nachricht wurde NICHT versendet, bis Sie selbst auf Senden klicken. Der Entwurf ist unten kopierbar.'
  );
  window.location.href=target;
 });
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
  widget=ts.render(verification,{sitekey:config.turnstileSiteKey,theme:'auto'});
 }catch{makeFallback(form);return;}
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
  status.textContent=translate('Šaljemo upit e-mail servisu…','Anfrage wird an den E-Mail-Dienst übermittelt…');
  try {
   const res=await fetch('/api/lead',{method:'POST',credentials:'same-origin',
    headers:{'content-type':'application/json'},cache:'no-store',
    body:JSON.stringify({...payload,turnstileToken:token})});
   const result=await res.json() as {accepted?:boolean;reference?:string;error?:string;receiptAccepted?:boolean};
   if(res.status===202 && result.accepted){
    status.textContent=translate(
     'E-mail servis je prihvatio upit. Oznaka: '+result.reference+'. Ovo nije potvrda rezervacije ili narudžbine.',
     'Der E-Mail-Dienst hat die Anfrage angenommen. Referenz: '+result.reference+'. Keine Reservierung oder Bestellung.'
    );
    form.reset();tsApi()?.reset(widget);
   }else throw Error(result.error||'unknown_error');
  }catch{
   status.textContent=translate(
    'Slanje nije potvrđeno. Pokušajte ponovo ili koristite direktni kontakt. Nemojte pretpostaviti da smo dobili upit.',
    'Versand nicht bestätigt. Bitte erneut versuchen oder direkten Kontakt nutzen. Nicht von einer erfolgreichen Zustellung ausgehen.'
   );
   tsApi()?.reset(widget);
  }finally{if(btn)btn.disabled=false;}
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
}
void initialize();
