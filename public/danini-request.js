'use strict';
(() => {
 const form=document.getElementById('service-form');
 if(!form)return;
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const data=new FormData(form);
  const url=String(data.get('adLink')||'').trim();
  try{const target=new URL(url);if(!['https:','http:'].includes(target.protocol))throw Error('protocol');}
  catch{const output=document.getElementById('service-result');output.textContent='Unesite ispravan link oglasa / Bitte gültigen Inserat-Link eingeben.';return;}
  const pkg=String(data.get('package'));
  const services={passport:'Import Passport — 9,90 €',field:'Field Check — od 79 €',free:'Besplatan upit / dovoz'};
  const message=['DANINI — direktan upit','Usluga: '+(services[pkg]||services.free),'Oglas: '+url,'Vozilo / lokacija: '+String(data.get('vehicle')||'Nije navedeno'),'Molim potvrdu dostupnosti i cene pre narudžbine.'].join('\n');
  const link='https://wa.me/4915730916621?text='+encodeURIComponent(message);
  const anchor=document.createElement('a');anchor.href=link;anchor.target='_blank';anchor.rel='noopener noreferrer';anchor.textContent='Otvori WhatsApp / WhatsApp öffnen';anchor.className='btn';
  const output=document.getElementById('service-result');output.replaceChildren(anchor);
  window.location.assign(link);
 });
})();