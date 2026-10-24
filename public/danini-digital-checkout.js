'use strict';
(() => {
  const forms=Array.from(document.querySelectorAll('.danini-digital-checkout'));
  if(!forms.length)return;
  const sr=document.documentElement.lang!=='de';
  const msg=(a,b)=>sr?a:b;
  let ready=false;
  function status(form,label){
    const el=form.querySelector('.danini-digital-status');
    if(el)el.textContent=label;
  }
  async function probe(){
    try{
      const response=await fetch('/api/danini/digital/status',{cache:'no-store'});
      const result=await response.json();
      ready=response.ok && result.enabled===true;
    }catch{ready=false}
    for(const form of forms){
      form.querySelector('button').disabled=!ready;
      status(form,ready
        ? msg('Plaćanje se potvrđuje direktno kroz PayPal. PDF je dostupan odmah po uspešnoj uplati.','PayPal bestätigt Ihre Zahlung. PDF-Download direkt nach erfolgreicher Zahlung.')
        : msg('Automatska kupovina još nije aktivirana. Za naručivanje trenutno koristite WhatsApp, bez uplate unapred.','Automatischer Kauf ist noch nicht freigeschaltet. Bitte per WhatsApp anfragen und vorerst nicht bezahlen.'));
    }
  }
  for(const form of forms)form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!ready)return;
    if(!form.reportValidity())return;
    const button=form.querySelector('button');
    button.disabled=true;
    status(form,msg('Otvaram bezbednu PayPal naplatu…','PayPal-Zahlung wird geöffnet…'));
    try{
      const data=new FormData(form);
      const r=await fetch('/api/danini/digital/checkout',{
        method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({sku:form.dataset.sku,email:String(data.get('email')||'').trim(),
          termsAccepted:form.querySelector('[name="termsAccepted"]').checked,
          instantDeliveryConsent:form.querySelector('[name="instantDeliveryConsent"]').checked,
          language:sr?'sr':'de'})
      });
      const out=await r.json();
      if(!r.ok || out.ok!==true || typeof out.checkoutUrl!=='string')throw Error(out.error||'CHECKOUT_UNAVAILABLE');
      const url=new URL(out.checkoutUrl);
      if(url.protocol!=='https:' || !['paypal.com','www.paypal.com','sandbox.paypal.com','www.sandbox.paypal.com'].includes(url.hostname))throw Error('INVALID_PAYMENT_DESTINATION');
      window.location.assign(url.href);
    }catch(e){
      status(form,msg('Plaćanje trenutno nije dostupno. Niste zaduženi na ovoj stranici. Obratite nam se na WhatsApp.','Zahlung derzeit nicht verfügbar. Hier wurde nichts abgebucht. Bitte per WhatsApp anfragen.'));
      button.disabled=!ready;
    }
  });
  probe();
})();
