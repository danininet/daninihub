/**
 * DANINI Auto: free, locally generated seven-guide text export.
 * This is not the separate, paid DANINI Auto-Biznis Master PDF.
 * Does not contact servers, collect personal data or create a purchase.
 */
const button=document.querySelector<HTMLButtonElement>('#danini-guides-download');
const status=document.querySelector<HTMLElement>('#danini-guides-download-status');
if(button){
 button.addEventListener('click',()=>{
  const de=document.documentElement.lang==='de';
  const articles=Array.from(document.querySelectorAll<HTMLElement>('.dn-guides-stack article.dn-guide'));
  if(articles.length!==7){
   if(status)status.textContent=de?'Download nicht verfügbar: Bitte Seite neu laden.':'Preuzimanje nije dostupno: osvežite stranicu.';
   return;
  }
  const blocks=articles.map((article,index)=>{
   const title=article.querySelector('h3')?.innerText.trim()||String(index+1);
   const summary=article.querySelector('.dn-guide-head p')?.innerText.trim()||'';
   const points=Array.from(article.querySelectorAll('ol > li')).map((li,i)=>(i+1)+'. '+li.innerText.trim());
   return [title,summary,...points].filter(Boolean).join('\n');
  });
  const documentText=[
   de?'DANINI Auto — 7 kostenlose Ratgeber':'DANINI Auto — 7 besplatnih vodiča',
   de?'Vorbereitung auf Fahrzeugkauf, Prüfung und Import':'Priprema kupovine, provere i uvoza automobila',
   'https://daninihub.com/guides.html',
   '',
   blocks.join('\n\n'+('-'.repeat(45))+'\n\n'),
   '',
   de?'Information, kein technischer Befund, keine verbindliche Preis- oder Zollauskunft.':'Informativan sadržaj, nije stručni nalaz, konačna ponuda niti carinsko rešenje.',
   de?'Direkte Anfrage: auto@daninihub.com':'Direktan upit: auto@daninihub.com'
  ].join('\n');
  const url=URL.createObjectURL(new Blob(['\ufeff',documentText],{type:'text/plain;charset=utf-8'}));
  const a=document.createElement('a');
  a.href=url;a.download=de?'DANINI-Auto-7-Ratgeber-DE.txt':'DANINI-Auto-7-Vodica-SR.txt';
  document.body.append(a);a.click();a.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  if(status)status.textContent=de?'7 Ratgeber lokal exportiert.':'7 vodiča preuzeto lokalno.';
 });
}
