/* DANINI contextual help, static local guidance + opt-in AI. No analytics or form value capture. */
(()=>{
 'use strict';
 const root=document.querySelector('[data-danini-assistant]');if(!root)return;
 const lang=root.dataset.language==='de'?'de':'sr';
 const $=id=>document.getElementById(id);
 const panel=$('danini-assistant-panel'),toggle=$('danini-assistant-toggle'),close=$('danini-assistant-close');
 const reply=$('danini-assistant-reply'),question=$('danini-assistant-question');
 const local=$('danini-assistant-local'),ask=$('danini-assistant-ask'),verify=$('danini-assistant-captcha');
 const note=$('danini-assistant-note'),status=$('danini-assistant-status');
 const project=$('danini-assistant-project'),reloadProjects=$('danini-assistant-project-reload'),projectNotice=$('danini-assistant-project-notice'),historyBox=$('danini-assistant-history');
 let conversation=[]; // kept only in current browser tab; never mixed between selected projects
 const pathname=location.pathname;
 const context=pathname.includes('/akademija/')?'academy':pathname.includes('/auto-check/')?'auto':pathname.includes('/business/')?'business':'general';
 let field='',fieldName='',lastFocus=null,ready=false,busy=false,widget=null,initialized=false,initBusy=false;
 const T=lang==='de'?{
  noField:'Klicken Sie zuerst auf ein Formularfeld. Ich erkläre dann, was dort hineingehört.',
  generic:'Wählen Sie ein Feld aus oder stellen Sie eine konkrete Frage zum nächsten Arbeitsschritt.',
  academy:['Beschreiben Sie Ihre konkrete Zielgruppe und EIN echtes Problem. Kennzeichnen Sie Vermutungen.',
   'Notieren Sie echte öffentliche Hinweise mit URL und Datum. Ohne Quelle: „noch nicht geprüft“.',
   'Beschreiben Sie ein kleines Ergebnis für einen Kunden, Umfang, Ausschlüsse und einen unverbindlichen Testpreis.',
   'Erklären Sie Nutzen, Zielgruppe, nächste Handlung und die wenigen nötigen Seiten.',
   'Beschreiben Sie Eingang, fehlende Angaben, menschliche Freigabe und sichere Lieferung.',
   'Definieren Sie einen kleinen zulässigen Nachfrage-Test, Frist und Stop-Kriterium.'],
  auto:'Geben Sie Inseratslink oder kopierte Fahrzeugangaben, Standort und ein konkretes Anliegen ein. Ein Link bestätigt weder FIN noch Zustand. Keine Ausweiskopien, Karten- oder personenbezogenen Daten.',
  details:{business:{name:'Bitte geben Sie Ihren Namen als Kontaktperson ein.',email:'Ihre erreichbare geschäftliche E-Mail, z. B. kontakt@beispiel.de.',company:'Firmenname, falls vorhanden; Sie können dieses Feld leer lassen.',country:'Welchen DACH-Markt betrifft Ihre Anfrage: DE, AT oder CH?',direction:'Wählen Sie die Richtung der Zusammenarbeit, falls bekannt.',service:'Wählen Sie die Leistung, die Ihrer Frage am nächsten kommt; die Details werden vor der Beauftragung geklärt.',message:'Beschreiben Sie einen konkreten Ablauf: Was passiert heute, wo entstehen Probleme und welches Ergebnis wünschen Sie?'},auto:{source:'Kopieren Sie Inseratstext oder Link und möglichst Modell, Erstzulassung, Kilometerstand und Preis. Nur ein Link ist kein überprüfter Beleg.',location:'Tragen Sie den Ort oder die Postleitzahl des Fahrzeugstandorts ein, falls bekannt.',intent:'Wählen Sie, ob es um Dokumente, Verkäuferfragen oder einen möglichen unabhängigen Vor-Ort-Check geht.',name:'Name der Kontaktperson.',email:'E-Mail für eine Antwort, ohne Passwörter oder Zahlungsdaten.'}},
  business:'Nennen Sie eine bestehende Anfrage oder Routine, die Schwierigkeit und das gewünschte Ergebnis. Eine Anfrage ist keine kostenpflichtige Bestellung.',
  aiOff:'KI ist derzeit serverseitig deaktiviert. Die kostenlosen Feldhilfen bleiben verfügbar.',
  aiLoad:'Die Sicherheitsprüfung konnte nicht geladen werden. Kostenlosen Hinweis nutzen oder KI-Verbindung erneut prüfen.',
  aiRetry:'KI-Verbindung erneut prüfen',
  aiReady:'KI ist bereit. Frage eingeben, Sicherheitsprüfung abschließen und erst dann senden.',
  aiStatusError:'KI-Status ist derzeit nicht erreichbar. Die kostenlosen Hinweise bleiben verfügbar.',
  aiWait:'KI-Antwort wird vorbereitet …',aiError:'Keine bestätigte KI-Antwort. Versuchen Sie es später; die Feldhilfe bleibt verfügbar.',
  aiLimit:'Das gemeinsame Tageslimit der kostenlosen KI-Hilfe ist erreicht.',
  token:'Bitte zuerst die Sicherheitsprüfung abschließen.',
  source:'KI-Erläuterung – nicht unabhängig geprüft. Keine Rechts-, Steuer- oder Zahlungsauskünfte.',
  field:'Feld',next:'Nächster Schritt'
 }:{
  noField:'Prvo dodirni polje formulara. Objasniću šta tu treba upisati.',
  generic:'Izaberi polje formulara ili napiši konkretno pitanje o sledećem koraku.',
  academy:['Napiši konkretnu ciljnu grupu i JEDAN stvaran problem. Pretpostavke posebno označi.',
   'Zapiši stvarne javne pokazatelje, izvor i datum. Ako ih nema: „još nije provereno“.',
   'Napiši tačan rezultat za kupca, obim, šta nije uključeno i samo pretpostavljenu cenu.',
   'Objasni kome pomažeš, šta dobija i koju radnju treba da uradi na sajtu.',
   'Opisi prijem upita, dodatna pitanja, ljudsku proveru i bezbednu isporuku.',
   'Odredi mali dozvoljen test potražnje, rok i uslov kada treba odustati.'],
  auto:'Unesi link ili kopirane podatke iz oglasa, mesto vozila i konkretno pitanje. Sam link ne potvrđuje VIN ni stanje. Ne unosi lična dokumenta ili podatke kartice.',
  details:{business:{name:'Upiši ime osobe koja šalje poslovni upit.',email:'Unesi poslovnu e-mail adresu na koju možemo odgovoriti, npr. kontakt@primer.de.',company:'Naziv firme ako postoji; ovo polje nije obavezno.',country:'Izaberi koje DACH tržište je relevantno: Nemačka, Austrija ili Švajcarska.',direction:'Izaberi smer poslovne saradnje, ako ga znaš.',service:'Izaberi najbližu uslugu. Detaljan obim i uslovi se utvrđuju pre dogovora.',message:'Opiši jedan konkretan postupak: šta sada radiš, gde nastaje problem i kakav rezultat želiš.'},auto:{source:'Nalepi tekst oglasa ili link i, ako znaš, marku, model, godište, kilometražu i cenu. Link sam po sebi nije potvrda oglasa.',location:'Upiši grad ili poštanski broj gde se auto nalazi, ako znaš.',intent:'Izaberi da li želiš pomoć oko dokumenata, pitanja prodavcu ili moguće nezavisne provere.',name:'Ime kontakt osobe.',email:'Adresa na koju želiš odgovor; bez lozinki ili podataka kartice.'}},
  business:'Navedi jedan postojeći postupak ili upit, šta sada ne radi i koji konkretan rezultat očekuješ. Upit nije plaćena narudžbina.',
  aiOff:'AI servis je trenutno isključen. Besplatna objašnjenja polja i dalje rade.',
  aiLoad:'Bezbednosna provera nije učitana. Možeš koristiti besplatno objašnjenje ili ponovo proveriti AI vezu.',
  aiRetry:'Ponovo proveri AI vezu',
  aiReady:'AI je spreman. Unesi pitanje, završi bezbednosnu proveru i tek onda pošalji.',
  aiStatusError:'Status AI servisa trenutno nije dostupan. Besplatna objašnjenja i dalje rade.',
  aiWait:'Pripremam AI odgovor …',aiError:'Nije dobijen potvrđen AI odgovor. Probaj kasnije; pomoć uz polja ostaje dostupna.',
  aiLimit:'Zajednička dnevna kvota besplatne AI pomoći je dostignuta.',
  token:'Prvo završi bezbednosnu proveru.',
  source:'AI objašnjenje – nije nezavisno provereno. Nema pravnog, poreskog ni platnog savetovanja.',
  field:'Polje',next:'Sledeći korak'
 };
 function explain(){
  let instruction=T.generic;
  if(context==='academy'){
   let stage=0;
   const count=$('demo-count')?.textContent||'';
   const number=count.match(/[1-6]/);
   if(number)stage=Number(number[0])-1;
   instruction=T.academy[stage];
  }else if(context==='auto'||context==='business')instruction=T[context];
  instruction=T.details?.[context]?.[fieldName]||instruction;
  const heading=field?T.field+': '+field+'. ':'';
  reply.textContent=heading+instruction;
  note.textContent=lang==='de'?'Kostenloser Hinweis ohne KI-Aufruf.':'Besplatno objašnjenje bez AI poziva.';
 }
 document.addEventListener('focusin',event=>{
  const el=event.target;
  if(!(el instanceof HTMLElement)||!el.matches('input,textarea,select'))return;
  if(root.contains(el)||['checkbox','hidden','submit','button','password'].includes(el.getAttribute('type')))return;
  lastFocus=el;fieldName=el.getAttribute('name')||'';
  const associated=el.id?document.querySelector('label[for="'+CSS.escape(el.id)+'"]'):el.closest('label');
  field=(associated?.textContent||el.getAttribute('aria-label')||el.name||'').trim().slice(0,65);
 });
 function open(){
  panel.hidden=false;toggle.setAttribute('aria-expanded','true');question.focus();
  if(!initialized){initialized=true;initialize();loadProjects();}
 }
 function shut(){panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus();}
 toggle.addEventListener('click',()=>panel.hidden?open():shut());close.addEventListener('click',shut);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)shut()});
 local.addEventListener('click',()=>{explain();lastFocus?.focus({preventScroll:true})});
 function unavailable(message){
  ready=false;ask.hidden=true;status.textContent=message;
  retry.hidden=false;
 }
 function appendTurn(role,content){
  const message=document.createElement('div');
  message.className='da-turn '+(role==='user'?'da-turn-user':'da-turn-assistant');
  message.textContent=(role==='user'?(lang==='de'?'Sie: ':'Ti: '):'DANINI AI: ')+content;
  historyBox.append(message);
  while(historyBox.children.length>8)historyBox.firstElementChild.remove();
  historyBox.scrollTop=historyBox.scrollHeight;
 }
 let projectLoadPromise=null;
 function loadProjects(){
  if(projectLoadPromise)return projectLoadPromise;
  projectLoadPromise=loadProjectsImpl().finally(()=>{projectLoadPromise=null;});
  return projectLoadPromise;
 }
 async function loadProjectsImpl(){
  try{
   const res=await fetch('/api/academy/assistant/projects',{credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(8000)});
   const body=await res.json();
   if(!res.ok||!body.authenticated||!Array.isArray(body.projects)){
    project.replaceChildren(new Option(lang==='de'?'Ohne Projektdaten fragen':'Pitaj bez podataka projekta',''));
    projectNotice.textContent=lang==='de'?'Anmelden, um private Projekte auszuwählen. Fragen sind auch ohne Konto möglich.':'Prijavi se da izabereš privatni projekat. Pitanja rade i bez naloga.';
    return;
   }
   const currentSelection=project.value;
   project.replaceChildren(new Option(lang==='de'?'Ohne Projektdaten fragen':'Pitaj bez podataka projekta',''));
   for(const p of body.projects){
    if(typeof p.id==='string'&&typeof p.title==='string')project.add(new Option(p.title.slice(0,80),p.id));
   }
   if([...project.options].some(o=>o.value===currentSelection))project.value=currentSelection;
   projectNotice.textContent=lang==='de'?'Auswahl sendet nur Ihre eigenen gespeicherten Projektschritte bei der nächsten KI-Anfrage.':'Izbor šalje samo tvoje sačuvane korake projekta pri sledećem AI pitanju.';
  }catch{projectNotice.textContent=lang==='de'?'Projektliste momentan nicht erreichbar. Allgemeine Fragen sind möglich.':'Lista projekata nije dostupna; opšta pitanja i dalje rade.'}
 }
 reloadProjects.addEventListener('click',loadProjects);
 project.addEventListener('change',()=>{conversation=[];historyBox.replaceChildren();reply.textContent='';note.textContent='';});
 const retry=$('danini-assistant-retry');
 retry.addEventListener('click',initialize);
 async function initialize(){
  if(initBusy||busy)return;
  initBusy=true;retry.hidden=true;
  status.textContent=lang==='de'?'KI-Verbindung wird geprüft …':'Proveravam AI vezu …';
  try{
   const res=await fetch('/api/academy/assistant/status',{cache:'no-store',signal:AbortSignal.timeout(10000)});
   if(!res.ok){unavailable(T.aiStatusError);return;}
   const data=await res.json();
   if(data.enabled!==true){unavailable(T.aiOff);return;}
   if(typeof data.siteKey!=='string'||data.siteKey.length<7){unavailable(T.aiStatusError);return;}
   if(!window.turnstile){
    const script=document.createElement('script');
    script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
    await new Promise((resolve,reject)=>{script.onload=resolve;script.onerror=reject;document.head.appendChild(script)});
   }
   if(!window.turnstile){unavailable(T.aiLoad);return;}
   if(widget!==null){window.turnstile.remove?.(widget);widget=null;}
   widget=window.turnstile.render(verify,{sitekey:data.siteKey,action:'danini-assistant',language:lang,theme:'auto'});
   ready=true;ask.hidden=false;retry.hidden=true;status.textContent=T.aiReady;
  }catch{unavailable(T.aiLoad);}
  finally{initBusy=false;}
 }
 ask.addEventListener('click',async()=>{
  if(!ready||busy)return;
  const prompt=question.value.trim();
  if(prompt.length<8||prompt.length>620){status.textContent=lang==='de'?'Bitte 8–620 Zeichen eingeben.':'Unesi pitanje od 8 do 620 znakova.';return}
  const token=window.turnstile?.getResponse(widget)||'';
  if(!token){status.textContent=T.token;return}
  busy=true;ask.disabled=true;status.textContent=T.aiWait;reply.textContent='';
  try{
   const response=await fetch('/api/academy/assistant/ask',{method:'POST',credentials:'same-origin',cache:'no-store',
    headers:{'content-type':'application/json'},body:JSON.stringify({language:lang,context,field,question:prompt,history:conversation.slice(-4),...(project.value?{projectId:project.value}:{}),turnstileToken:token})});
   const result=await response.json().catch(()=>({}));
   if(!response.ok)throw Error(result.error||'server_error');
   if(result.aiUsed!==true||typeof result.answer!=='string'||typeof result.nextStep!=='string')throw Error('invalid_output');
   reply.textContent=result.answer+'\n\n'+T.next+': '+result.nextStep;
   appendTurn('user',prompt);
   appendTurn('assistant',reply.textContent);
   conversation.push({role:'user',content:prompt.slice(0,350)},{role:'assistant',content:result.answer.slice(0,350)});
   conversation=conversation.slice(-4);
   question.value='';
   note.textContent=T.source;
   status.textContent='';
  }catch(e){status.textContent=e.message==='assistant_daily_limit'?T.aiLimit:T.aiError}
  finally{busy=false;ask.disabled=false;window.turnstile?.reset(widget);}
 });
})();
