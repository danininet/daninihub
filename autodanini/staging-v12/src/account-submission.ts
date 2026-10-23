import {api} from '@appdeploy/client';

/**
 * Add the explicit 'send for review' action to ONE saved case.
 * Called from existing src/account.ts showCases(item, actions).
 * Requires backend/admin.ts routes to be merged into backend/index.ts.
 *
 * No payment, auction bid or implicit submission happens when a user only saves a case.
 */
export function attachCaseSubmission(
 caseId:string,
 actions:HTMLElement,
 german:()=>boolean,
 notify:(sr:string,de:string)=>void
):void {
 // Existing buyer draft cases work independently; submissions stay off until
 // authenticated owner inbox, anti-abuse and audit trail pass release checks.
 if(import.meta.env.VITE_AUTODANINI_HOSTINGER_BUILD==='true' &&
    import.meta.env.VITE_AUTODANINI_SUBMISSIONS_ENABLED!=='true')return;
 const wrapper=document.createElement('div');
 wrapper.className='account-submit-review';
 const button=document.createElement('button');
 button.type='button';
 button.className='btn gold';
 button.textContent=german()?'Zur Prüfung einreichen':'Pošalji u obradu';
 const state=document.createElement('span');
 state.className='account-submit-state';
 state.setAttribute('role','status');
 const repliesBox=document.createElement('div');
 repliesBox.className='account-buyer-replies';
 repliesBox.setAttribute('aria-live','polite');
 wrapper.append(button,state,repliesBox);
 actions.append(wrapper);
 function renderReplies(value:unknown):void {
  repliesBox.replaceChildren();
  if(!Array.isArray(value)||!value.length)return;
  const title=document.createElement('strong');
  title.textContent=german()?'Antworten von AutoDanini':'Odgovori AutoDanini tima';
  repliesBox.append(title);
  for(const item of value){
   if(typeof item?.message!=='string')continue;
   const note=document.createElement('p');
   note.style.cssText='white-space:pre-wrap;padding:10px 12px;border-left:3px solid #cda76e;background:#f0f3f1;margin:10px 0;';
   note.textContent=item.message;
   repliesBox.append(note);
  }
 }
 const setStatus=(sr:string,de:string)=>{
  state.textContent=german()?de:sr;
 };
 async function check():Promise<void> {
  try {
   const response=await api.get('/api/my-submission/'+encodeURIComponent(caseId));
   if(response.data?.submitted===true) {
    const code=String(response.data.status||'new');
    renderReplies(response.data.replies);
    const remove=actions.querySelector<HTMLButtonElement>('.account-remove');
    if(remove){
     remove.disabled=true;
     remove.title=german()?'Eingereichte Anfragen nur über den Support bearbeiten/löschen.':
      'Poslat zahtev nije moguće obrisati kao skicu; kontaktirajte podršku.';
    }
    setStatus('Zahtev je predat. Status: '+code,'Anfrage eingereicht. Status: '+code);
    button.disabled=true;
    button.textContent=german()?'Bereits eingereicht':'Već poslato';
   } else setStatus('Još nije poslato u obradu.','Noch nicht eingereicht.');
  }catch(_error){
   setStatus('Status predaje trenutno nije dostupan.','Einreichungsstatus derzeit nicht verfügbar.');
  }
 }
 button.addEventListener('click',async ()=>{
  const sr='Slanjem odobravate da AutoDanini tim dobije podatke ovog sačuvanog zahteva, uz eventualno ime i e-poštu vašeg naloga. Zahtev nije ugovor niti uplata. Potvrdite predaju?';
  const de='Mit dem Einreichen erlauben Sie dem AutoDanini-Team Zugriff auf diese Anfrage und ggf. auf Ihren Kontonamen sowie die E-Mail-Adresse. Keine Bestellung oder Zahlung. Anfrage einreichen?';
  if(!window.confirm(german()?de:sr))return;
  button.disabled=true;
  setStatus('Predajem zahtev…','Anfrage wird eingereicht…');
  try {
   const response=await api.post('/api/case-submissions',{caseId,submitConsent:true});
   if(response.data?.submitted!==true)throw new Error('Not confirmed');
   setStatus('Zahtev je predat timu, ID: '+String(response.data.submissionId),
     'Anfrage an das Team eingereicht, ID: '+String(response.data.submissionId));
   button.textContent=german()?'Bereits eingereicht':'Već poslato';
   notify('Zahtev je predat u obradu.','Die Anfrage wurde eingereicht.');
   await check();
  }catch(_error){
   button.disabled=false;
   setStatus('Predaja nije potvrđena. Proverite status pre ponovnog pokušaja.',
    'Einreichung nicht bestätigt. Bitte Status vor einem neuen Versuch prüfen.');
  }
 });
 void check();
}
