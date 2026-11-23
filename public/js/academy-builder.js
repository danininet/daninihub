const root=document.getElementById('builder');
if(root){
 const de=root.dataset.locale==='de';
 const $=id=>document.getElementById(id);
 const i18n=de?{
  unavailable:'Der kostenlose Business Builder ist jetzt nutzbar: sechs Schritte, persönliches Startpaket, Text-/JSON-Export und Drucken/PDF. Ohne Anmeldung; Ihre Angaben verlassen diesen Browser-Tab nicht.',ready:'Geschützter Pilot. Anmeldung per E-Mail-Code.',
  generic:'Die Aktion konnte nicht abgeschlossen werden. Bitte später erneut versuchen.',sent:'Bitte prüfen Sie Ihre E-Mails und geben Sie den einmaligen Code ein.',saved:'Arbeitsschritt gespeichert.',created:'Projekt erstellt.',deleted:'Projekt gelöscht.',
  noProjects:'Noch keine Projekte. Erstellen Sie Ihr erstes Projekt.',open:'Öffnen',confirmDelete:'Dieses Projekt samt Inhalten endgültig löschen?', noFields:'Bitte mindestens ein Feld ausfüllen.',
  labels:[['Nische','Zielgruppe','Kundenproblem','Ihre bisherigen Annahmen'],['Markt','Tatsächlich geprüfte Quelle + Datum','Alternative / Wettbewerb','Offene Belege / Unsicherheiten'],['Angebot','Konkretes Ergebnis','Leistungsumfang und Grenzen','Preishypothese (nicht veröffentlicht)'],['Online-Auftritt','Ziel der Website','Kernbotschaft und Seiten','Geplante Inhalte / Veröffentlichungsfreigabe'],['Abläufe','Wichtige Kundenanfragen','Ablauf / Verantwortliche','Datenschutz und Freigaben'],['Validierung','Kleiner Markttest','Messgröße und Termin','PASS / REVIEW / STOP Entscheidung']]
 }:{
  unavailable:'Besplatni Business Builder je aktivan: šest koraka, lični poslovni paket, TXT/JSON izvoz i štampa/PDF. Bez registracije; tvoji unosi ostaju u ovoj kartici browsera.',ready:'Zaštićeni pilot. Prijava jednokratnim e-mail kodom.',
  generic:'Radnja nije završena. Pokušaj ponovo kasnije.',sent:'Proveri e-mail i unesi jednokratni kod.',saved:'Korak je sačuvan.',created:'Projekat je kreiran.',deleted:'Projekat je obrisan.',
  noProjects:'Još nema projekata. Kreiraj svoj prvi projekat.',open:'Otvori',confirmDelete:'Trajno obrisati projekat i sav njegov sadržaj?',noFields:'Popuni bar jedno polje.',
  labels:[['Niša','Ciljna grupa','Problem kupca','Moje pretpostavke'],['Tržište','Stvarno provereni izvor i datum','Alternativa / konkurencija','Nedostajući dokazi'],['Ponuda','Konkretan rezultat','Obim i ograničenja','Cenovna hipoteza (nije objavljena)'],['Online prisustvo','Cilj sajta','Glavna poruka i stranice','Sadržaj i odobrenje za objavu'],['Operacije','Važni upiti kupaca','Proces i odgovornosti','Privatnost i odobravanja'],['Validacija','Mali tržišni test','Merilo i rok','Odluka PASS / REVIEW / STOP']]
 };
 const ids=['niche','market','offer','online_presence','operations','validation'];
 let challenge=null,turnstileId=null,siteKey=null,selected=null,stage='niche';

 // Free no-login preview. No localStorage, cookies, external services, or API calls for user fields.
 const demoData={name:'',steps:{}};
 let demoStage=0;
 const demoCopy=de?{
  count:n=>'Schritt '+(n+1)+' von 6',back:'← Zurück',next:'Weiter →',finish:'Dossier erstellen →',
  export:'Ergebnis als JSON speichern',edit:'← Angaben bearbeiten',reset:'Neu beginnen',
  resetConfirm:'Alle Angaben in diesem Tab endgültig verwerfen?',
  nameError:'Bitte geben Sie zuerst einen Projektnamen ein.'
 }:{
  count:n=>'Korak '+(n+1)+' od 6',back:'← Nazad',next:'Nastavi →',finish:'Pripremi dosije →',
  export:'Sačuvaj rezultat kao JSON',edit:'← Izmeni odgovore',reset:'Počni od početka',
  resetConfirm:'Trajno obrisati sve unete odgovore iz ove kartice?',
  nameError:'Prvo unesi naziv projekta.'
 };

 const packageCopy=de?{
  title:'Mein Online-Business – operatives Startpaket',
  disclaimer:'Arbeitsentwurf aus Ihren Eingaben. DANINI hat keine Angaben unabhängig verifiziert, keine KI-Analyse ausgeführt und keinen Markterfolg geprüft.',
  sources:'Vom Nutzer genannte Quellen (noch unabhängig zu prüfen)',
  assumptions:'Annahmen und offene Hypothesen',
  next:'Nächste konkrete Prüfschritte',
  missingSources:'Noch keine datierte Quelle angegeben. Öffentliche Quellen und deren Datum dokumentieren.',
  missingAssumptions:'Zielgruppe, Nachfrage, Nutzen und Preis sind bis zur Prüfung als Hypothesen zu behandeln.',
  missingNext:'Einen kleinen Nachfragetest festlegen, Ergebnis dokumentieren und danach entscheiden.',
  empty:'Noch nicht ausgefüllt',
  exportText:'Als lesbaren Text speichern',
  print:'Startpaket drucken / als PDF speichern'
 }:{
  title:'Moj online biznis — početni operativni paket',
  disclaimer:'Radni nacrt iz tvojih unosa. DANINI nije nezavisno proverio podatke, izvršio AI analizu niti potvrdio tržišnu potražnju.',
  sources:'Izvori koje korisnik navodi (tek treba nezavisno proveriti)',
  assumptions:'Pretpostavke i otvorene hipoteze',
  next:'Naredni konkretni koraci za proveru',
  missingSources:'Još nema navedenog izvora i datuma. Zabeleži javne izvore i datum provere.',
  missingAssumptions:'Ciljnu grupu, potražnju, korist i cenu tretiraj kao hipoteze dok se ne provere.',
  missingNext:'Odredi mali test potražnje, dokumentuj rezultat i tek onda donesi odluku.',
  empty:'Nije popunjeno',
  exportText:'Sačuvaj kao čitljiv tekst',
  print:'Odštampaj paket / sačuvaj kao PDF'
 };
 function packageEvidence(){
  const niche=demoData.steps.niche||{},market=demoData.steps.market||{},offer=demoData.steps.offer||{},validation=demoData.steps.validation||{};
  return [
   [packageCopy.sources,market.a?.trim()?[market.a.trim()]:[packageCopy.missingSources]],
   [packageCopy.assumptions,[niche.c,offer.c].filter(v=>typeof v==='string'&&v.trim()).map(v=>v.trim()).length?[niche.c,offer.c].filter(v=>typeof v==='string'&&v.trim()).map(v=>v.trim()):[packageCopy.missingAssumptions]],
   [packageCopy.next,[market.c,validation.a,validation.b].filter(v=>typeof v==='string'&&v.trim()).map(v=>v.trim()).length?[market.c,validation.a,validation.b].filter(v=>typeof v==='string'&&v.trim()).map(v=>v.trim()):[packageCopy.missingNext]]
  ];
 }
 function packageText(){
  const lines=[packageCopy.title,demoData.name,'',packageCopy.disclaimer,''];
  ids.forEach((id,i)=>{
   lines.push((i+1)+'. '+i18n.labels[i][0]);
   ['a','b','c'].forEach((key,j)=>lines.push(i18n.labels[i][j+1]+': '+(demoData.steps[id]?.[key]?.trim()||packageCopy.empty)));
   lines.push('');
  });
  for(const [heading,items] of packageEvidence()){lines.push(heading);for(const item of items)lines.push('- '+item);lines.push('');}
  return lines.join('\n');
 }
 function saveLocalText(filename,content){
  const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
  const link=append('a');link.href=url;link.download=filename;link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 }

 function captureDemo(){
  demoData.name=$('demo-title').value.trim();
  const values={};
  for(const field of $('demo-fields').querySelectorAll('textarea'))if(field.value.trim())values[field.name]=field.value.trim();
  demoData.steps[ids[demoStage]]=values;
 }
 function renderDemo(){
  $('demo-title').value=demoData.name;
  const labels=i18n.labels[demoStage];
  $('demo-count').textContent=demoCopy.count(demoStage);
  $('demo-step-title').textContent=labels[0];
  $('demo-meter-fill').style.width=((demoStage+1)/6*100)+'%';
  $('demo-back').textContent=demoCopy.back;
  $('demo-back').disabled=demoStage===0;
  $('demo-next').textContent=demoStage===5?demoCopy.finish:demoCopy.next;
  $('demo-export').textContent=demoCopy.export;
  $('demo-text').textContent=packageCopy.exportText;
  $('demo-print').textContent=packageCopy.print;
  $('demo-edit').textContent=demoCopy.edit;
  $('demo-reset').textContent=demoCopy.reset;
  const fields=$('demo-fields');fields.replaceChildren();
  const info=append('p',de?'Notieren Sie Ihre eigenen Fakten und Annahmen. Ungeprüfte Angaben bitte klar markieren.':'Odvoji svoje činjenice i pretpostavke; označi sve što još nije provereno.','bb-demo-stage');
  fields.append(info);
  const old=demoData.steps[ids[demoStage]]||{};
  for(const [n,key] of ['a','b','c'].entries()){
   const wrap=append('div',null,'bb-field');
   const label=append('label',labels[n+1]);const textarea=append('textarea');
   textarea.id='demo-field-'+key;textarea.name=key;textarea.maxLength=1500;textarea.rows=3;textarea.value=old[key]||'';
   label.htmlFor=textarea.id;wrap.append(label,textarea);fields.append(wrap);
  }
 }
 function showDemoResult(){
  const result=$('demo-summary');result.replaceChildren();
  result.append(append('h4',packageCopy.title+' — '+demoData.name));
  result.append(append('p',packageCopy.disclaimer,'bb-evidence-note'));
  for(let i=0;i<6;i++){
    const step=append('section',null,'bb-demo-row');step.append(append('strong',(i+1)+'. '+i18n.labels[i][0]));
    const vals=demoData.steps[ids[i]]||{};
    for(let n=0;n<3;n++){
      const key=['a','b','c'][n];
      const value=(vals[key]||'').trim();
      if(value){step.append(append('strong',i18n.labels[i][n+1]),append('p',value));}
    }
    result.append(step);
  }
  for(const [heading,items] of packageEvidence()){
   const section=append('section',null,'bb-evidence-section');
   section.append(append('h5',heading));
   for(const item of items)section.append(append('p',item));
   result.append(section);
  }
  show('demo-form',false);show('demo-result',true);
 }
 $('demo-form').addEventListener('submit',event=>{
  event.preventDefault();
  captureDemo();
  if(!demoData.name){$('demo-title').focus();notice(demoCopy.nameError);return;}
  if(demoStage<5){demoStage++;renderDemo();}
  else showDemoResult();
 });
 $('demo-back').addEventListener('click',()=>{if(demoStage>0){captureDemo();demoStage--;renderDemo();}});
 $('demo-edit').addEventListener('click',()=>{show('demo-result',false);show('demo-form',true);renderDemo();});
 $('demo-reset').addEventListener('click',()=>{
  if(!confirm(demoCopy.resetConfirm))return;
  demoData.name='';demoData.steps={};demoStage=0;
  show('demo-result',false);show('demo-form',true);renderDemo();
 });
 $('demo-export').addEventListener('click',()=>{
  const output={product:'DANINI Business Builder - private preview',version:1,language:de?'de':'sr',
   project:{title:demoData.name,steps:ids.map(id=>({step:id,fields:demoData.steps[id]||{}}))},
   disclaimer:'User supplied, not verified; no AI processing, no server storage, no guarantee of results.'};
  const url=URL.createObjectURL(new Blob([JSON.stringify(output,null,2)],{type:'application/json'}));
  const a=append('a');a.href=url;a.download='danini-builder-preview-'+(de?'de':'sr')+'.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 });

 $('demo-text').addEventListener('click',()=>saveLocalText('danini-online-business-startpaket-'+(de?'de':'sr')+'.txt',packageText()));
 $('demo-print').addEventListener('click',()=>window.print());

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
   if(!config.enabled||!config.siteKey){show('demo',true);renderDemo();notice(i18n.unavailable);return}
   siteKey=config.siteKey;
   const session=await api('session');
   if(session.authenticated){show('dashboard',true);await refresh();notice(i18n.ready);return}
   show('signin',true);await loadTurnstile();notice(i18n.ready);
  }catch{show('signin',false);show('demo',true);renderDemo();notice(i18n.unavailable)}
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
