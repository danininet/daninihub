/**
 * DANINI / buyer-controlled self-service request preparation.
 * Local-only; never saves, tracks, sends, books, buys or processes payment.
 * Mailto opens the visitor's own email composer for explicit approval.
 */
type JourneyField='kind'|'delivery'|'listing'|'location'|'destination'|'date'|'notes';
const widget=document.querySelector<HTMLFormElement>('#danini-journey-form');
if(widget){
 const output=document.querySelector<HTMLTextAreaElement>('#danini-journey-draft');
 const mail=document.querySelector<HTMLAnchorElement>('#danini-journey-mail');
 const copy=document.querySelector<HTMLButtonElement>('#danini-journey-copy');
 const status=document.querySelector<HTMLElement>('#danini-journey-status');
 const isDe=()=>document.documentElement.lang==='de';
 const deNames:Record<string,string>={
  'video':'Video-Besichtigung vor dem Kauf',
  'expert':'Unabhängigen Fachcheck anfragen',
  'buyer-trip':'Eigene Anreise und Abholung',
  'driver':'Überführung durch geeigneten Fahrer prüfen',
  'carrier':'Angebot für Autotransporter/Anhänger',
  'compare':'Inserate vergleichen',
  'unknown':'Noch nicht entschieden',
 };
 const srNames:Record<string,string>={
  'video':'Video-obilazak pre kupovine',
  'expert':'Nezavisan stručni pregled',
  'buyer-trip':'Moj lični dolazak po vozilo',
  'driver':'Dovoz vozila preko odgovarajućeg vozača',
  'carrier':'Transport šleperom ili prikolicom',
  'compare':'Upoređivanje oglasa',
  'unknown':'Još nisam odlučio',
 };
 const read=(name:JourneyField,max:number)=>String(new FormData(widget).get(name)||'').trim().slice(0,max).replace(/[\u0000-\u001f]/g,' ');
 const generate=()=>{
   const kind=read('kind',40),delivery=read('delivery',40);
   const dict=isDe()?deNames:srNames;
   const result=[
     'DANINI Auto / '+(isDe()?'Unverbindliche Anfrage':'Neobavezujući upit'),
     '-----------------------------------',
     (isDe()?'Gewünschte Hilfe: ':'Željena usluga: ')+(dict[kind]||kind),
     (isDe()?'Übergabe: ':'Preuzimanje: ')+(dict[delivery]||delivery),
     (isDe()?'Inserat (optional): ':'Link oglasa (opciono): ')+(read('listing',350)||'-'),
     (isDe()?'Fahrzeugstandort: ':'Lokacija automobila: ')+(read('location',120)||'-'),
     (isDe()?'Zielort/Land: ':'Odredište/država: ')+(read('destination',120)||'-'),
     (isDe()?'Wunschdatum: ':'Željeni termin: ')+(read('date',60)||'-'),
     (isDe()?'Anmerkungen: ':'Napomene: ')+(read('notes',700)||'-'),
     '',
     isDe()?'Nur Anfrage zur Prüfung der Machbarkeit; keine Buchung, Bestellung oder Zahlung.':
       'Samo upit za proveru izvodljivosti; nije rezervacija, narudžbina niti plaćanje.'
   ].join('\n');
   if(output)output.value=result;
   const href='mailto:auto@daninihub.com?subject='+encodeURIComponent('DANINI Auto | '+(dict[kind]||'Kundenanfrage'))+'&body='+encodeURIComponent(result);
   if(mail){
     if(href.length<=2200){mail.href=href;mail.hidden=false;}
     else {mail.hidden=true;mail.removeAttribute('href');}
   }
   if(status)status.textContent=isDe()?
     'Entwurf erstellt. Erst nach Ihrer ausdrücklichen Bestätigung in der E-Mail-App wird gesendet.':
     'Nacrt je spreman. Poruka se šalje tek kada je vi potvrdite u svom e-mail programu.';
 };
 widget.addEventListener('submit',e=>{e.preventDefault();generate()});
 widget.addEventListener('input',()=>{if(mail){mail.hidden=true;mail.removeAttribute('href')}if(status)status.textContent='';});
 copy?.addEventListener('click',async()=>{
  if(!output?.value)generate();
  try{await navigator.clipboard.writeText(output?.value||'');if(status)status.textContent=isDe()?'Entwurf kopiert.':'Nacrt kopiran.';}
  catch{output?.focus();output?.select();if(status)status.textContent=isDe()?'Text markieren und kopieren.':'Označite i kopirajte tekst.'}
 });
}
