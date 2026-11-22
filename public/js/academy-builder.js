const root=document.getElementById('builder');
if(root){
 const de=root.dataset.locale==='de';
 const $=id=>document.getElementById(id);
 const i18n=de?{
  unavailable:'Der Business Builder wird vorbereitet. Kein Login, keine Speicherung und kein Kauf möglich.',ready:'Geschützter Pilot. Anmeldung per E-Mail-Code.',
  generic:'Die Aktion konnte nicht abgeschlossen werden. Bitte später erneut versuchen.',sent:'Bitte prüfen Sie Ihre E-Mails und geben Sie den einmaligen Code ein.',saved:'Arbeitsschritt gespeichert.',created:'Projekt erstellt.',deleted:'Projekt gelöscht.',
  noProjects:'Noch keine Projekte. Erstellen Sie Ihr erstes Projekt.',open:'Öffnen',confirmDelete:'Dieses Projekt samt Inhalten endgültig löschen?', noFields:'Bitte mindestens ein Feld ausfüllen.',
  labels:[['Nische','Zielgruppe','Kundenproblem','Ihre bisherigen Annahmen'],['Markt','Tatsächlich geprüfte Quelle + Datum','Alternative / Wettbewerb','Offene Belege / Unsicherheiten'],['Angebot','Konkretes Ergebnis','Leistungsumfang und Grenzen','Preishypothese (nicht veröffentlicht)'],['Online-Auftritt','Ziel der Website','Kernbotschaft und Seiten','Geplante Inhalte / Veröffentlichungsfreigabe'],['Abläufe','Wichtige Kundenanfragen','Ablauf / Verantwortliche','Datenschutz und Freigaben'],['Validierung','Kleiner Markttest','Messgröße und Termin','PASS / REVIEW / STOP Entscheidung']]
 }:{
  unavailable:'AI Business Builder je u pripremi. Prijava, čuvanje projekata i kupovina nisu aktivni.',ready:'Zaštićeni pilot. Prijava jednokratnim e-mail kodom.',
  generic:'Radnja nije završena. Pokušaj ponovo kasnije.',sent:'Proveri e-mail i unesi jednokratni kod.',saved:'Korak je sačuvan.',created:'Projekat je kreiran.',deleted:'Projekat je obrisan.',
  noProjects:'Još nema projekata. Kreiraj svoj prvi projekat.',open:'Otvori',confirmDelete:'Trajno obrisati projekat i sav njegov sadržaj?',noFields:'Popuni bar jedno polje.',
  labels:[['Niša','Ciljna grupa','Problem kupca','Moje pretpostavke'],['Tržište','Stvarno provereni izvor i datum','Alternativa / konkurencija','Nedostajući dokazi'],['Ponuda','Konkretan rezultat','Obim i ograničenja','Cenovna hipoteza (nije objavljena)'],['Online prisustvo','Cilj sajta','Glavna poruka i stranice','Sadržaj i odobrenje za objavu'],['Operacije','Važni upiti kupaca','Proces i odgovornosti','Privatnost i odobravanja'],['Validacija','Mali tržišni test','Merilo i rok','Odluka PASS / REVIEW / STOP']]
 };
 const ids=['niche','market','offer','online_presence','operations','validation'];
 let challenge=null,turnstileId=null,siteKey=null,selected=null,stage='niche';
 function notice(message){$('notice').textContent=message}
 function show(id,visible){$(id).hidden=!visible}
 function append(tag,content,className){const el=document.createElement(tag);if(className)el.className=className;if(content!=null)el.textContent=String(content);return el}
 async function api(path,method='GET',payload){
  const response=await fetch('/api/academy/'+path,{method,credentials:'same-origin',headers:payload?{'content-type':'application/json'}:{},body:payload?JSON.stringify(payload):undefined,cache:'no-store'});
  const body=await response.json().catch(()=>({}));if(!response.ok)throw Error(body.error||'request_failed');return body;
 }
 async function loadTurnstile(){
  if(!window.turnstile){
   const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
   await new Promise((resolve,reject)=>{script.onload=resolve;script.onerror=reject;document.head.append(script)});
  }
  if(!window.turnstile)throw Error('turnstile_unavailable');
  if(turnstileId!==null){window.turnstile.reset(turnstileId);return;}
  turnstileId=window.turnstile.render('#turnstile',{sitekey:siteKey,action:'academy-login',language:de?'de':'sr',theme:'auto'});
 }
 async function initialize(){
  try{
   const config=await api('config');
   if(!config.enabled||!config.siteKey){notice(i18n.unavailable);return}
   siteKey=config.siteKey;
   const session=await api('session');
   if(session.authenticated){show('dashboard',true);await refresh();notice(i18n.ready);return}
   show('signin',true);await loadTurnstile();notice(i18n.ready);
  }catch{show('signin',false);notice(i18n.unavailable)}
 }
 async function refresh(){
  const data=await api('projects');const list=$('project-list');list.replaceChildren();
  if(!data.projects.length)list.append(append('p',i18n.noProjects));
  for(const project of data.projects){const button=append('button',project.title+' · '+project.language.toUpperCase(),'bb-project');button.type='button';button.onclick=()=>openProject(project.id);list.append(button)}
 }
 async function openProject(id){
  const data=await api('projects/'+id);selected=data.project;stage='niche';show('editor',true);renderEditor();
 }
 function renderEditor(){if(!selected)return;
  $('selected-title').textContent=selected.title;
  const tabs=$('step-tabs');tabs.replaceChildren();
  ids.forEach((id,index)=>{const done=selected.steps?.some(x=>x.step===id);
   const button=append('button',(index+1)+'. '+i18n.labels[index][0]+(done?' ✓':''),'bb-tab');button.type='button';button.setAttribute('aria-pressed',String(stage===id));button.onclick=()=>{stage=id;renderEditor()};tabs.append(button);
  });
  const index=ids.indexOf(stage),labels=i18n.labels[index];$('stage-title').textContent=labels[0];
  $('stage-help').textContent=de?'Strukturieren Sie die Angaben. Recherchierte Fakten und Annahmen ausdrücklich trennen.':'Zapiši podatke. Razdvoji proverene činjenice i pretpostavke.';
  const saved=selected.steps?.find(x=>x.step===stage)?.fields||{},fields=$('step-fields');fields.replaceChildren();
  ['a','b','c'].forEach((key,idx)=>{const wrap=append('div',null,'bb-field'),label=append('label',labels[idx+1]);const input=append('textarea');
   input.name=key;input.id='field-'+key;label.htmlFor=input.id;input.maxLength=1500;input.rows=3;input.value=saved[key]||'';wrap.append(label,input);fields.append(wrap)});
 }
 $('login-form').addEventListener('submit',async event=>{event.preventDefault();const email=$('email').value.trim();const token=window.turnstile?.getResponse(turnstileId)||'';
  try{const d=await api('auth/start','POST',{email,language:de?'de':'sr',turnstileToken:token});challenge=d.challengeId;show('verify-form',true);notice(i18n.sent)}catch{notice(i18n.generic)}finally{window.turnstile?.reset(turnstileId)}
 });
 $('verify-form').addEventListener('submit',async event=>{event.preventDefault();try{
  await api('auth/verify','POST',{challengeId:challenge,code:$('otp').value.trim()});show('signin',false);show('dashboard',true);await refresh();notice(i18n.ready);
 }catch{notice(i18n.generic)}});
 $('new-project').addEventListener('submit',async event=>{event.preventDefault();try{
  const r=await api('projects','POST',{title:$('project-title').value.trim(),language:de?'de':'sr'});$('project-title').value='';await refresh();await openProject(r.project.id);notice(i18n.created);
 }catch{notice(i18n.generic)}});
 $('step-form').addEventListener('submit',async event=>{event.preventDefault();if(!selected)return;
  const fields={};for(const el of $('step-fields').querySelectorAll('textarea'))if(el.value.trim())fields[el.name]=el.value.trim();
  if(!Object.keys(fields).length){notice(i18n.noFields);return}
  try{const keepStage=stage;await api('projects/'+selected.id+'/steps/'+keepStage,'PUT',{fields});await openProject(selected.id);stage=keepStage;renderEditor();notice(i18n.saved)}catch{notice(i18n.generic)}
 });
 $('export').addEventListener('click',async()=>{if(!selected)return;try{const data=await api('projects/'+selected.id+'/export');
  const href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const link=append('a');link.href=href;link.download='danini-project-'+selected.id+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(href),1000);
 }catch{notice(i18n.generic)}});
 $('delete-project').addEventListener('click',async()=>{if(!selected||!confirm(i18n.confirmDelete))return;try{
  await api('projects/'+selected.id,'DELETE');selected=null;show('editor',false);await refresh();notice(i18n.deleted);
 }catch{notice(i18n.generic)}});
 $('logout').addEventListener('click',async()=>{try{await api('logout','POST',{});selected=null;show('dashboard',false);show('editor',false);show('signin',true);show('verify-form',false);await loadTurnstile();notice(i18n.ready)}catch{notice(i18n.generic)}});
 initialize();
}
