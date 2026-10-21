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
const german = () => localStorage.getItem('autodanini-language') === 'de';
let nextToken: string|null = null;

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
  article.append(top,meta,contact,note,form);
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
 if(inboxCount)inboxCount.textContent=String(list.length)+(nextToken?'+':'');
 if(nextPage)nextPage.hidden=!nextToken;
 show(list);
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
  if(signedOut)signedOut.hidden=true;
  if(signedIn)signedIn.hidden=true;
  notify('Pristup odbijen. Administratorska e-pošta mora biti posebno potvrđena u serveru.','Zugriff verweigert. Die Administrator-E-Mail muss serverseitig bestätigt werden.');
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
