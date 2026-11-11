/**
 * 49 EUR PDF checkout UI. No payment call until production worker reports
 * ready and Turnstile successfully validates this browser.
 */
type DNWidget={render:(host:HTMLElement,args:{sitekey:string,language:string,theme:string})=>string|number;getResponse:(id:string|number)=>string;reset:(id:string|number)=>void;remove?:(id:string|number)=>void};
type DNWindow=Window & {turnstile?:DNWidget};
const box=document.querySelector<HTMLFormElement>('#danini-digital-checkout-form');
const summary=document.querySelector<HTMLElement>('#danini-digital-checkout-status');
const notice=document.querySelector<HTMLElement>('#danini-digital-checkout-message');
if(box&&summary&&notice){
 const de=()=>document.documentElement.lang==='de'||localStorage.getItem('autodanini-language')==='de';
 const phrase=(sr:string,german:string)=>de()?german:sr;
 const button=box.querySelector<HTMLButtonElement>('button[type="submit"]');
 const slot=document.querySelector<HTMLElement>('#danini-digital-captcha');
 const api=()=> (window as DNWindow).turnstile;
 const status=(message:string)=>{summary.textContent=message;};
 const message=(m:string)=>{notice.textContent=m;};
 let widget:string|number|undefined;
 (async()=>{
  try{
   const statusRes=await fetch('/api/danini/digital/status',{cache:'no-store'});
   if(!statusRes.ok)throw Error('status');
   const state=await statusRes.json() as {enabled?:boolean;mode?:string};
   if(!state.enabled){
    status(phrase('PDF je dostupan za informisanje, ali automatska kupovina još nije aktivirana. Bez naplate.','Der PDF-Ratgeber ist angekündigt; der automatische Kauf ist noch nicht freigeschaltet. Keine Zahlung.'));
    return;
   }
   const leadRes=await fetch('/api/lead/status',{cache:'no-store'});
   const lead=await leadRes.json() as {turnstileSiteKey?:string};
   if(!lead.turnstileSiteKey||!slot)throw Error('captcha');
   const script=document.createElement('script');
   script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
   script.async=true;
   await new Promise<void>((resolve,reject)=>{script.onload=()=>resolve();script.onerror=()=>reject(Error('captcha'));document.head.append(script);});
   if(!api())throw Error('captcha');
   widget=api()!.render(slot,{sitekey:lead.turnstileSiteKey,language:de()?'de':'sr',theme:'auto'});
   box.hidden=false;
   if(button)button.disabled=false;
   status(phrase('Bezbedna kupovina PDF vodiča spremna — 49 €.', 'Sicherer PDF-Kauf bereit — 49 €.'));
   document.addEventListener('danini:language-changed',()=>{
    const ts=api();if(!ts?.remove||widget===undefined)return;
    try{ts.remove(widget);widget=ts.render(slot,{sitekey:lead.turnstileSiteKey!,language:de()?'de':'sr',theme:'auto'});}catch{if(button)button.disabled=true;}
   });
  }catch{
   status(phrase('Trenutno ne možemo potvrditi spremnost plaćanja. Nije izvršena naplata.','Zahlungsbereitschaft konnte nicht bestätigt werden. Es wurde nichts berechnet.'));
  }
 })();
 box.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!box.reportValidity()||widget===undefined)return;
  const captcha=api()?.getResponse(widget)||'';
  if(!captcha){message(phrase('Potvrdite bezbednosnu proveru.','Bitte Sicherheitsprüfung bestätigen.'));return;}
  const fields=new FormData(box);
  const email=String(fields.get('email')||'').trim();
  if(!email)return;
  if(button)button.disabled=true;
  message(phrase('Kreiramo bezbedan PayPal checkout…','Sicherer PayPal-Checkout wird erstellt…'));
  try{
   const r=await fetch('/api/danini/digital/checkout',{method:'POST',headers:{'content-type':'application/json'},credentials:'same-origin',cache:'no-store',body:JSON.stringify({
    sku:'guide',email,language:de()?'de':'sr',
    termsAccepted:fields.get('termsAccepted')==='on',
    instantDeliveryConsent:fields.get('instantDeliveryConsent')==='on',turnstileToken:captcha
   })});
   const result=await r.json() as {ok?:boolean;checkoutUrl?:string};
   if(!r.ok||result.ok!==true||!result.checkoutUrl)throw Error('not_ready');
   const destination=new URL(result.checkoutUrl);
   if(destination.protocol!=='https:'||!/(^|\.)paypal\.com$/.test(destination.hostname))throw Error('unsafe');
   window.location.assign(destination.href);
  }catch{
   message(phrase('Checkout nije otvoren. Nije izvršena naplata. Pokušajte kasnije ili pišite na info@daninihub.com.', 'Checkout konnte nicht geöffnet werden. Keine Zahlung erfolgt. Bitte später versuchen oder info@daninihub.com kontaktieren.'));
   if(button)button.disabled=false;
   if(widget!==undefined)try{api()?.reset(widget);}catch{}
  }
 });
}
