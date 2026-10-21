import { api, auth } from '@appdeploy/client';
import { attachCaseSubmission } from './account-submission';
type User = { userId: string; name?: string; email?: string };
type CaseRow = {
 id: string; createdAt: string; type: string; vehicle: string; destination: string;
 budget: number | null; listing: string; notes: string; status: string;
};
const one = <T extends HTMLElement>(id: string): T | null => document.getElementById(id) as T | null;
const status = one<HTMLElement>('account-status');
const signedIn = one<HTMLElement>('account-logged-in');
const signedOut = one<HTMLElement>('account-logged-out');
const caseList = one<HTMLElement>('account-case-list');
const saveButton = one<HTMLButtonElement>('account-submit');
const caseForm = one<HTMLFormElement>('account-case-form');
const german = () => localStorage.getItem('autodanini-language') === 'de';
function message(sr: string, de: string): void { if (status) status.textContent = german() ? de : sr; }
function node<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, label?: string): HTMLElementTagNameMap[K] {
 const el = document.createElement(tag);
 if (className) el.className = className;
 if (label) el.textContent = label;
 return el;
}
function stamp(value: string): string {
 const when = new Date(value);
 return Number.isFinite(when.getTime()) ? when.toLocaleDateString(german()?'de-DE':'sr-RS') : '';
}
function showCases(cases: CaseRow[]): void {
 if (!caseList) return;
 caseList.replaceChildren();
 if (!Array.isArray(cases) || cases.length === 0) {
  caseList.append(node('p','account-empty',german()?'Noch keine gespeicherten Fahrzeuganfragen.':'Još nema sačuvanih zahteva.'));
  return;
 }
 for (const item of cases.sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)))) {
  const card=node('article','account-case');
  const top=node('div','account-case-top');
  top.append(node('strong','',item.vehicle));
  top.append(node('small','',stamp(item.createdAt)));
  const meta=node('p','account-case-meta',item.type + ' · ' + item.destination + (item.budget?' · '+new Intl.NumberFormat(german()?'de-DE':'sr-RS').format(item.budget)+' EUR':''));
  const label=node('span','account-case-badge',german()?'Gespeichert / Nicht eingereicht':'Sačuvano / Nije poslato');
  const info=node('p','account-case-notes',item.notes || (german()?'Keine Notizen.':'Bez napomena.'));
  const actions=node('div','account-case-actions');
  const whatsapp=node('a','btn primary',german()?'Per WhatsApp senden ↗':'Pošalji putem WhatsApp-a ↗');
  const details = ['AutoDanini - zahtev iz korisničkog naloga', 'Tip: '+item.type,
   'Vozilo: '+item.vehicle,'Odredište: '+item.destination,
   'Budžet: '+(item.budget||'nije naveden')+' EUR',
   'Oglas: '+(item.listing||'-'),'Napomene: '+(item.notes||'-'),
   'Molim dogovor o obimu usluge i konačnoj ceni.'];
  whatsapp.href='https://wa.me/4915730916621?text='+encodeURIComponent(details.join('\n'));
  whatsapp.target='_blank';whatsapp.rel='noopener noreferrer';
  const remove=node('button','account-remove',german()?'Löschen':'Obriši');
  remove.type='button';
  remove.addEventListener('click', async ()=>{
   if (!window.confirm(german()?'Gespeicherte Anfrage wirklich löschen?':'Obrisati sačuvani zahtev?')) return;
   remove.disabled=true;
   try {
    await api.delete('/api/my-cases/'+encodeURIComponent(item.id));
    message('Zahtev je obrisan iz vašeg naloga.','Anfrage aus Ihrem Konto gelöscht.');
    await loadCases();
   } catch (_error) {
    message('Brisanje nije uspelo. Pokušajte ponovo.','Löschen fehlgeschlagen. Bitte erneut versuchen.');
    remove.disabled=false;
   }
  });
  actions.append(whatsapp,remove);
  attachCaseSubmission(item.id, actions, german, message);
  if (item.listing && /^https:\/\//.test(item.listing)) {
   const link=node('a','account-listing',german()?'Inserat öffnen ↗':'Otvori oglas ↗');
   link.href=item.listing;link.target='_blank';link.rel='noopener noreferrer';
   card.append(top,meta,label,info,link,actions);
  } else {
   card.append(top,meta,label,info,actions);
  }
  caseList.append(card);
 }
}
async function loadCases(): Promise<void> {
 if(!caseList) return;
 caseList.replaceChildren(node('p','account-empty',german()?'Anfragen laden...':'Učitavam zahteve...'));
 const response=await api.get('/api/my-cases');
 const cases=response.data?.cases;
 if(!Array.isArray(cases)) throw new Error('Invalid cases response');
 showCases(cases);
}
async function refreshAccount(): Promise<void> {
 message('Proveravam prijavu…','Anmeldung wird geprüft…');
 try {
  const user: User|null=await auth.getUser();
  if(!user) {
   if(signedOut)signedOut.hidden=false;
   if(signedIn)signedIn.hidden=true;
   message('Niste prijavljeni. Za privatni nalog izaberite prijavu.','Nicht angemeldet. Bitte anmelden.');
   return;
  }
  if(signedOut)signedOut.hidden=true;
  if(signedIn)signedIn.hidden=false;
  const name=one<HTMLElement>('account-name'),email=one<HTMLElement>('account-email');
  if(name)name.textContent=user.name || (german()?'Mein Konto':'Moj nalog');
  if(email)email.textContent=user.email || '';
  message('Prijavljeni ste. Zahtevi su vidljivi samo vama.','Angemeldet. Ihre Anfragen sind nur für Sie sichtbar.');
  await loadCases();
 } catch (_error) {
  message('Nije uspelo učitavanje naloga. Proverite vezu i pokušajte ponovo.','Konto konnte nicht geladen werden. Bitte Verbindung prüfen.');
 }
}
one<HTMLButtonElement>('account-login')?.addEventListener('click',async ()=>{
 try {message('Otvara se bezbedna prijava…','Sichere Anmeldung wird geöffnet…');await auth.signIn();await refreshAccount();}
 catch(err:unknown) {
  const code=(err as {code?:string})?.code;
  if(code==='popup_blocked')message('Pregledač je blokirao prozor za prijavu. Dozvolite pop-up.','Popup blockiert. Bitte Pop-ups zulassen.');
  else if(code==='popup_closed')message('Prijava je prekinuta.','Anmeldung abgebrochen.');
  else message('Prijava nije uspela. Pokušajte ponovo.','Anmeldung fehlgeschlagen.');
 }
});
one<HTMLButtonElement>('account-logout')?.addEventListener('click',async ()=>{
 try { await auth.signOut(); if(caseList)caseList.replaceChildren();await refreshAccount();}
 catch(_error){message('Odjava nije uspela.','Abmeldung fehlgeschlagen.');}
});
one<HTMLButtonElement>('account-refresh')?.addEventListener('click',async ()=>{
 try{await loadCases();message('Lista je osvežena.','Liste aktualisiert.');}
 catch(_error){message('Ne mogu učitati zahteve.','Anfragen konnten nicht geladen werden.');}
});
caseForm?.addEventListener('submit',async ev=>{
 ev.preventDefault();if(!caseForm.reportValidity()||!saveButton)return;
 const data=new FormData(caseForm);
 const value=(k:string)=>String(data.get(k)||'').trim();
 saveButton.disabled=true;
 message('Čuvam zahtev…','Anfrage wird gespeichert…');
 try {
  const b=value('budget');
  await api.post('/api/my-cases',{
   type:value('type'),vehicle:value('vehicle'),destination:value('destination'),
   budget:b?Number(b):null,listing:value('listing'),notes:value('notes'),consent:true
  });
  caseForm.reset();
  message('Zahtev je sačuvan u privatnom nalogu, ali nije poslat AutoDanini timu.','Anfrage privat gespeichert, aber nicht an AutoDanini gesendet.');
  await loadCases();
 } catch(_error){message('Zahtev nije sačuvan. Proverite podatke i pokušajte ponovo.','Anfrage nicht gespeichert. Bitte Angaben prüfen.');}
 finally {saveButton.disabled=false;}
});
void refreshAccount();
