/**
 * AutoDanini Support Desk — WhatsApp handoff only.
 * No support ticket, cookies, localStorage, hidden network requests or
 * backend persistence. The visitor confirms sending inside WhatsApp.
 */
const form=document.querySelector<HTMLFormElement>('#autodanini-support-form');
const status=document.querySelector<HTMLElement>('#support-status');
const sr=()=>localStorage.getItem('autodanini-language')!=='de';
if(form){
 form.addEventListener('submit',(event)=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const data=new FormData(form);
  if(data.get('consent')!=='on')return;
  const topic=String(data.get('topic')||'').slice(0,100);
  const name=String(data.get('name')||'').trim().slice(0,90);
  const link=String(data.get('link')||'').trim().slice(0,500);
  const message=String(data.get('message')||'').trim().slice(0,1500);
  if(message.length<8||!/^[\p{L}\p{N}\p{P}\p{Z}\p{S}\r\n]+$/u.test(message)){
   if(status)status.textContent=sr()?'Proverite opis zahteva.':'Bitte die Nachricht prüfen.';
   return;
  }
  if(link){
   try{const url=new URL(link);if(!['https:','http:'].includes(url.protocol))throw Error('invalid')}
   catch{if(status)status.textContent=sr()?'Unesite ispravan link (https://).':'Bitte einen gültigen Link eingeben.';return}
  }
  const rows=[
    'AUTO DANINI — SUPPORT', 'Tema / Thema: '+topic,
    ...(name?['Ime/Firma: '+name]:[]),
    ...(link?['Link: '+link]:[]),
    '',message
  ];
  const target='https://wa.me/4915730916621?text='+encodeURIComponent(rows.join('\n'));
  if(target.length>4500){
    if(status)status.textContent=sr()?'Poruka je predugačka. Skratite je.':'Die Nachricht ist zu lang. Bitte kürzen.';
    return;
  }
  if(status)status.textContent=sr()?
    'Otvara se WhatsApp. Poruka nije poslata dok je sami ne potvrdite.':
    'WhatsApp wird geöffnet. Die Nachricht wird erst nach Ihrer Bestätigung gesendet.';
  window.location.assign(target);
 });
}
