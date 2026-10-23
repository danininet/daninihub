import './styles.css';
import {api, auth} from '@appdeploy/client';

type CaseStatus = 'new' | 'reviewing' | 'waiting_on_buyer' | 'quote_draft' | 'closed';
type AdminRequest = {
 id:string; userId:string; ownerName:string; ownerEmail:string;
 vehicle:string; type:string; destination:string; budget:number|null;
 listing:string; notes:string; status:CaseStatus; quoteEUR:number|null;
 adminNote:string; createdAt:string; updatedAt:string;
};
const byId = <T extends HTMLElement>(id:string):T|null => document.getElementById(id) as T|null;
const status = byId<HTMLElement>('admin-status');
const signedOut = byId<HTMLElement>('admin-signed-out');
const signedIn = byId<HTMLElement>('admin-signed-in');
const requests = byId<HTMLElement>('admin-requests');
const inboxCount = byId<HTMLElement>('admin-count');
const nextPage = byId<HTMLButtonElement>('admin-next');
const search = byId<HTMLInputElement>('admin-search');
const statusFilter = byId<HTMLSelectElement>('admin-status-filter');
const german = () => localStorage.getItem('autodanini-language') === 'de';
let nextToken: string|null = null;
let loadedPage: AdminRequest[] = [];
function renderPage():void {
  const text=(search?.value||'').trim().toLocaleLowerCase();
  const selected=statusFilter?.value||'';
  const visible=loadedPage.filter(item=>{
    if(selected && item.status!==selected)return false;
    if(!text)return true;
    return [item.vehicle,item.ownerName,item.ownerEmail,item.destination,item.type]
      .some(value=>String(value||'').toLocaleLowerCase().includes(text));
  });
  if(inboxCount)inboxCount.textContent=String(visible.length)+' / '+String(loadedPage.length)+(nextToken?'+':'');
  show(visible);
}

function notify(sr:string,de:string):void {
 if(status) status.textContent = german() ? de : sr;
}
function make<K extends keyof HTMLElementTagNameMap>(tag:K, cls:string, text?:string):HTMLElementTagNameMap[K] {
 const el = document.createElement(tag);
 el.className = cls;
 if (text !== undefined) el.textContent = text;
 return el;
}
function formatDate(input:string):string {
 const d=new Date(input);
 return Number.isFinite(d.getTime()) ? d.toLocaleString(german()?'de-DE':'sr-RS') : '';
}
function money(num:number|null):string {
 return num===null ? '—' : new Intl.NumberFormat(german()?'de-DE':'sr-RS',{style:'currency',currency:'EUR'}).format(num);
}
function labeledInput(name:string,value:string):HTMLLabelElement {
 const label=make('label','admin-field');
 const caption=make('span','',name); label.append(caption);
 const input=make('textarea','admin-note') as HTMLTextAreaElement;
 input.maxLength=1600; input.rows=3; input.value=value; label.append(input);
 return label;
}
function show(items:AdminRequest[]):void {
 if(!requests)return;
 requests.replaceChildren();
 if(!items.length){requests.append(make('p','admin-empty',german()?'Keine eingegangenen Anfragen.':'Još nema poslatih zahteva.'));return;}
 for(const item of items){
  const article=make('article','admin-request');
  const top=make('div','admin-request-top');
  const title=make('h3','',item.vehicle);
  const badge=make('span','admin-badge',item.status);
  top.append(title,badge);
  const meta=make('p','admin-meta',item.type+' · '+item.destination+' · '+money(item.budget)+' · '+formatDate(item.createdAt));
  const contact=make('p','admin-contact', (item.ownerName || (german()?'Nutzer':'Korisnik')) +
    (item.ownerEmail?' · '+item.ownerEmail:''));
  const note=make('p','admin-description',item.notes || (german()?'Keine weiteren Angaben.':'Bez dodatnih napomena.'));
  const form=make('form','admin-edit') as HTMLFormElement;
  const fields=make('div','admin-edit-fields');
  const statusLabel=make('label','admin-field');
  statusLabel.append(make('span','',german()?'Bearbeitungsstatus':'Status obrade'));
  const statusSelect=make('select','admin-status-select') as HTMLSelectElement;
  const choices:CaseStatus[]=['new','reviewing','waiting_on_buyer','quote_draft','closed'];
  const descriptions:Record<CaseStatus,[string,string]>={
   new:['Novo','Neu'],reviewing:['U obradi','In Bearbeitung'],
   waiting_on_buyer:['Čeka kupca','Wartet auf Käufer'],
   quote_draft:['Predlog ponude','Angebotsentwurf'],
   closed:['Zatvoreno','Geschlossen']
  };
  for(const code of choices){
   const opt=make('option','',descriptions[code][german()?1:0]) as HTMLOptionElement;
   opt.value=code;opt.selected=code===item.status;
   statusSelect.append(opt);
  }
  statusLabel.append(statusSelect);
  const quoteLabel=make('label','admin-field');
  quoteLabel.append(make('span','',german()?'Angebotsentwurf in EUR':'Predlog ponude u EUR'));
  const quote=make('input','admin-quote') as HTMLInputElement;
  quote.type='number';quote.min='0';quote.max='1000000';quote.step='0.01';quote.placeholder=german()?'Nur Entwurf':'Samo predlog';
  quote.value=item.quoteEUR===null?'':String(item.quoteEUR);
  quoteLabel.append(quote);
  fields.append(statusLabel,quoteLabel);
  const adminNoteLabel=labeledInput(german()?'Interne Notiz':'Interna napomena',item.adminNote);
  const controls=make('div','admin-buttons');
  const save=make('button','btn gold',german()?'Änderungen speichern':'Sačuvaj promene') as HTMLButtonElement;
  save.type='submit';
  controls.append(save);
  if(item.listing && /^https:\/\//.test(item.listing)){
   const external=make('a','btn admin-external',german()?'Inserat öffnen ↗':'Otvori oglas ↗') as HTMLAnchorElement;
   external.href=item.listing;external.target='_blank';external.rel='noopener noreferrer';
   controls.append(external);
  }
  const info=make('p','admin-footnote',german()
   ?'Entwurf ohne Zahlung, Rechnungsversand oder automatische Benachrichtigung.'
   :'Predlog bez naplate, izdavanja računa ili automatskog obaveštenja kupcu.');
  form.append(fields,adminNoteLabel,controls,info);
  form.addEventListener('submit',async (event)=>{
   event.preventDefault();
   if(!form.reportValidity()||!item.id)return;
   const amount=quote.value.trim()?Number(quote.value):null;
   if(amount!==null && (!Number.isFinite(amount)||amount<0||amount>1000000)){
    notify('Neispravan predlog cene.','Ungültiger Preisentwurf.');return;
   }
   save.disabled=true;
   try{
    await api.put('/api/admin/requests/'+encodeURIComponent(item.id),{
     status:statusSelect.value,expectedStatus:item.status,quoteEUR:amount,
     adminNote:adminNoteLabel.querySelector('textarea')?.value || ''
    });
    notify('Status i napomena su sačuvani.','Status und Notiz gespeichert.');
    nextToken=null;await reload();
   }catch(_error){
    notify('Promena nije sačuvana. Osvežite i proverite dozvole.','Änderung nicht gespeichert. Bitte Berechtigung prüfen und neu laden.');
   }finally{save.disabled=false;}
  });
  const replySection=make('section','admin-edit');
  const replyHeading=make('h4','',german()?'Antwort im Kundenkonto':'Odgovor kupcu u njegovom nalogu');
  const replyInfo=make('p','admin-footnote',german()
   ?'Diese Nachricht wird im privaten Kundenkonto angezeigt; keine E-Mail, kein Vertrag und keine Zahlung.'
   :'Ova poruka biće vidljiva samo u privatnom nalogu kupca. Ne šalje se mejl, ugovor niti zahtev za uplatu.');
  const replyText=make('textarea','admin-note') as HTMLTextAreaElement;
  replyText.rows=4;replyText.maxLength=2000;
  replyText.placeholder=german()?'Antwort an den Kunden (bis 2000 Zeichen)':'Poruka kupcu (do 2.000 znakova)';
  replyText.setAttribute('aria-label',german()?'Antwort an den Käufer':'Odgovor kupcu');
  replyText.style.cssText='display:block;width:100%;padding:13px;margin:12px 0;background:#fbfcfa;border:1px solid #c9d0cb;color:#21313a;font:inherit;';
  const publish=make('button','btn gold',german()?'Antwort im Konto veröffentlichen':'Objavi odgovor u nalogu kupca') as HTMLButtonElement;
  publish.type='button';
  const historyButton=make('button','btn primary',german()?'Nachrichten anzeigen':'Prikaži prethodne odgovore') as HTMLButtonElement;
  historyButton.type='button';
  const history=make('div','admin-description');
  history.setAttribute('aria-live','polite');
  history.style.marginTop='14px';
  const replyState=make('p','admin-footnote');
  replyState.setAttribute('role','status');
  const showHistory=async ():Promise<void>=>{
   history.replaceChildren();
   const result=await api.get('/api/admin/requests/'+encodeURIComponent(item.id)+'/replies');
   const replies=result.data?.replies;
   if(!Array.isArray(replies))throw new Error('Invalid reply history');
   if(!replies.length)history.append(make('p','',german()?'Noch keine Antworten.':'Još nema odgovora.'));
   for(const reply of replies){
    if(typeof reply?.message!=='string')continue;
    const line=make('p','admin-description',reply.message);
    line.style.cssText='border-left:3px solid #c8a66b;padding:10px 13px;background:#f4f5f1;';
    history.append(line);
   }
  };
  historyButton.addEventListener('click',async()=>{
   historyButton.disabled=true;
   try{await showHistory();}
   catch{replyState.textContent=german()?'Nachrichten nicht verfügbar.':'Istorija poruka nije dostupna.';}
   finally{historyButton.disabled=false;}
  });
  publish.addEventListener('click',async()=>{
   const message=replyText.value.trim();
   if(message.length<2||message.length>2000){
    replyState.textContent=german()?'Bitte 2–2000 Zeichen eingeben.':'Unesite poruku od 2 do 2.000 znakova.';return;
   }
   if(!window.confirm(german()?
     'Diese Antwort jetzt im privaten Konto des Käufers veröffentlichen? Es wird keine E-Mail versendet.':
     'Objaviti ovaj odgovor u privatnom nalogu kupca? Mejl se neće poslati.'))return;
   publish.disabled=true;
   replyState.textContent=german()?'Antwort wird gespeichert...':'Čuvam odgovor kupcu...';
   try{
    const result=await api.post('/api/admin/requests/'+encodeURIComponent(item.id)+'/replies',
     {message,confirmSend:true});
    if(result.data?.sentToBuyerAccount!==true)throw new Error('Reply not confirmed');
    replyText.value='';
    replyState.textContent=german()?'Antwort im Kundenkonto gespeichert. Keine E-Mail versendet.':
     'Odgovor je sačuvan u nalogu kupca. Mejl nije poslat.';
    await showHistory().catch(()=>{});
   }catch{
    replyState.textContent=german()?'Antwort nicht gespeichert. Vor Wiederholung Verlauf prüfen.':
     'Čuvanje nije potvrđeno. Proverite istoriju pre ponovnog pokušaja.';
   }finally{publish.disabled=false;}
  });
  if(import.meta.env.VITE_AUTODANINI_SUBMISSIONS_ENABLED==='true') {
   const buttons=make('div','admin-buttons');buttons.append(publish,historyButton);
   replySection.append(replyHeading,replyInfo,replyText,buttons,replyState,history);
  }
  article.append(top,meta,contact,note,form,replySection);
  requests.append(article);
 }
}
async function reload(token?:string):Promise<void>{
 if(!requests)return;
 requests.replaceChildren(make('p','admin-loading',german()?'Anfragen werden geladen...':'Učitavam pristigle zahteve...'));
 const result=await api.get('/api/admin/requests'+(token?'?nextToken='+encodeURIComponent(token):''));
 const list=result.data?.requests;
 if(!Array.isArray(list))throw new Error('Invalid admin list response');
 nextToken=typeof result.data?.nextToken==='string'?result.data.nextToken:null;
 if(nextPage)nextPage.hidden=!nextToken;
 loadedPage=list as AdminRequest[];
 renderPage();
}
async function session():Promise<void>{
 notify('Proveravam administratorski pristup…','Admin-Berechtigung wird geprüft…');
 try{
  const owner=await auth.getUser();
  if(!owner){
   if(signedOut)signedOut.hidden=false;
   if(signedIn)signedIn.hidden=true;
   notify('Prijavite se da biste proverili svoj pristup.','Bitte anmelden, um Ihre Berechtigung zu prüfen.');
   return;
  }
  const result=await api.get('/api/admin/requests');
  if(!Array.isArray(result.data?.requests))throw new Error('Invalid inbox result');
  if(signedOut)signedOut.hidden=true;
  if(signedIn)signedIn.hidden=false;
  const who=byId<HTMLElement>('admin-owner');
  if(who)who.textContent=owner.name || owner.email || (german()?'Administrator':'Administrator');
  notify('Administratorska prijava potvrđena.','Administratorzugang bestätigt.');
  nextToken=null;
  await reload();
 }catch(_error){
  // A valid customer login without owner MFA is NOT an administrator.
  // Keep the owner login button visible so MFA can be completed or a
  // different private owner account can be used; never expose inbox data.
  if(signedOut)signedOut.hidden=false;
  if(signedIn)signedIn.hidden=true;
  if(requests)requests.replaceChildren();
  loadedPage=[];
  if(inboxCount)inboxCount.textContent='—';
  notify('Administratorska prijava nije potvrđena. Prijavite se privatnim vlasničkim nalogom i Authenticator kodom.',
   'Administratorzugang nicht bestätigt. Bitte mit dem privaten Inhaberkonto und Authenticator-Code anmelden.');
 }
}
byId<HTMLButtonElement>('admin-login')?.addEventListener('click',async ()=>{
 try{await auth.signIn();await session();}
 catch(_error){notify('Prijava je prekinuta ili blokirana.','Anmeldung abgebrochen oder blockiert.');}
});
byId<HTMLButtonElement>('admin-logout')?.addEventListener('click',async ()=>{
 try{await auth.signOut();if(requests)requests.replaceChildren();await session();}
 catch(_error){notify('Odjava nije uspela.','Abmeldung fehlgeschlagen.');}
});
search?.addEventListener('input',renderPage);
statusFilter?.addEventListener('change',renderPage);
byId<HTMLButtonElement>('admin-refresh')?.addEventListener('click',async ()=>{
 try{nextToken=null;await reload();notify('Lista je osvežena.','Liste aktualisiert.');}
 catch(_error){notify('Lista trenutno nije dostupna.','Liste momentan nicht verfügbar.');}
});
nextPage?.addEventListener('click',async ()=>{
 if(!nextToken)return;
 try{await reload(nextToken);}
 catch(_error){notify('Ne mogu otvoriti sledeću stranu.','Weitere Seite nicht verfügbar.');}
});
void session();
