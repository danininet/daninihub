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

 // Beginner guidance, authored examples and honest off-site AI prompt builder.
 // This is NOT model inference. No user content is transferred without their action.
 const beginner=de?[
  {intro:'Wer soll das Problem lösen lassen? Beschreiben Sie zuerst EINE konkrete Kundengruppe und eine alltägliche Schwierigkeit.',fields:[
   ['Zum Beispiel: kleine Handwerksbetriebe in Duisburg mit deutsch-serbischen Kundenanfragen.','Nennen Sie eine Branche, einen Ort oder Markt und eine konkrete Kundengruppe.'],
   ['Zum Beispiel: Kundenanfragen gehen zwischen E-Mail und Telefon verloren.','Schreiben Sie eine beobachtbare Schwierigkeit, nicht nur „sie brauchen KI“.'],
   ['Zum Beispiel: Ich vermute, dass Betriebe dafür bezahlen würden. Das ist noch unbewiesen.','Was glauben Sie bislang und wie könnten Sie es überprüfen?']]},
  {intro:'Recherchieren Sie Quellen selbst und notieren Sie Datum und URL. Ein KI-Ergebnis beweist keine Nachfrage.',fields:[
   ['Zum Beispiel: URL eines öffentlich zugänglichen Branchenforums; geprüft am TT.MM.JJJJ; konkrete Frage.','NUR tatsächlich gelesene Quellen nennen; sonst ausdrücklich „noch nicht geprüft“.'],
   ['Zum Beispiel: manuelle Bürohilfe, bestehende CRM-Software oder andere lokale Anbieter.','Beschreiben Sie, wie Kunden das Problem heute lösen.'],
   ['Zum Beispiel: Noch keine Gespräche mit potenziellen Kunden; Zahlungsbereitschaft unbekannt.','Welche Aussage oder Quelle fehlt noch?']]},
  {intro:'Beschreiben Sie, was der Kunde konkret erhält – und was nicht. Preise hier sind nur eine Hypothese.',fields:[
   ['Zum Beispiel: eine sortierte Liste von fünf Anfragen und zwei prüfbare Antwortentwürfe.','Nennen Sie ein konkretes Dokument oder Ergebnis statt „KI-Lösung“.'],
   ['Zum Beispiel: maximal fünf Anfragen, ein Korrekturlauf, kein automatischer Versand.','Legen Sie Grenzen, Zeit und Ausschlüsse fest.'],
   ['Zum Beispiel: Testpreis 40 EUR, noch mit keinem Kunden validiert.','Kennzeichnen Sie ausdrücklich unveröffentlichte Preisannahmen.']]},
  {intro:'Eine Startseite braucht eine Zielgruppe, einen Nutzen und eine klare nächste Handlung – nicht sofort einen neuen Shop.',fields:[
   ['Zum Beispiel: Interessenten sollen eine unverbindliche Anfrage mit drei Angaben senden.','Was soll eine Besucherin oder ein Besucher tun?'],
   ['Zum Beispiel: Startseite, Leistung, Beispiel, Kontakt und Datenschutz.','Welche wenigen Seiten braucht die erste Version?'],
   ['Zum Beispiel: ein anonymisierter Musterfall, vor Veröffentlichung menschlich geprüft.','Welche Inhalte sind vorbereitet, und wer darf sie freigeben?']]},
  {intro:'Skizzieren Sie den Weg vom Eingang einer Anfrage zur tatsächlichen Lieferung und der menschlichen Kontrolle.',fields:[
   ['Zum Beispiel: Name/Kontakt, Problembeschreibung und gewünschter Termin.','Welche Angaben sind erforderlich, welche ausdrücklich nicht?'],
   ['Zum Beispiel: Anfrage → fehlende Angaben → Entwurf → eigene Freigabe → Versand.','Wer übernimmt welche Aufgabe und kontrolliert das Ergebnis?'],
   ['Zum Beispiel: keine vertraulichen Daten an offene KI; Kundenversand erst nach Freigabe.','Beschreiben Sie Datenminimierung und eine Kontrollstelle.']]},
  {intro:'Testen Sie nur eine kleine Annahme. Ein Plan ist keine bestätigte Nachfrage oder ein echter Umsatz.',fields:[
   ['Zum Beispiel: drei unverbindliche Gespräche mit passenden Betrieben, ohne Massenwerbung.','Welcher zulässige kleine Test liefert neue Informationen?'],
   ['Zum Beispiel: bis 15.12. drei dokumentierte Rückmeldungen, davon eine konkrete Angebotsanfrage.','Tragen Sie eine Frist und eine messbare Beobachtung ein.'],
   ['Zum Beispiel: REVIEW, wenn noch Belege fehlen; STOP nach zwei Tests ohne Interesse.','Wann machen Sie weiter, prüfen erneut oder stoppen?']]}
 ]:[
  {intro:'Kome konkretno želiš da pomogneš i koji jedan problem rešavaš? Počni od čoveka i problema, a ne od AI tehnologije.',fields:[
   ['Primer: male firme u Nemačkoj koje dobijaju upite na srpskom i nemačkom.','Napiši jednu grupu kupaca, tržište i po mogućnosti mesto.'],
   ['Primer: upiti se izgube između e-maila i telefona, pa odgovor kasni.','Napiši konkretan problem koji kupac prepoznaje.'],
   ['Primer: pretpostavljam da bi firme platile pomoć. Još nemam dokaz.','Navedite šta samo pretpostavljaš i kako to možeš proveriti.']]},
  {intro:'Zapiši stvarne izvore i datume. AI odgovor sam po sebi nije dokaz potražnje.',fields:[
   ['Primer: link do stvarno pročitanog javnog upita, datum provere i opis problema.','Ako nisi istraživao, napiši „još nisam proverio“, ne izmišljaj izvore.'],
   ['Primer: firma sada odgovara ručno ili koristi postojeći CRM.','Ko rešava isti problem i kako kupci danas rade?'],
   ['Primer: nisam razgovarao sa kupcima; ne znam da li bi platili.','Koji dokaz još nedostaje?']]},
  {intro:'Definiši mali proizvod ili uslugu koju možeš stvarno da isporučiš, sa jasnim granicama.',fields:[
   ['Primer: spisak pet pristiglih upita sa dva nacrta odgovora na nemačkom.','Napiši šta tačno kupac dobija: fajl, izveštaj ili konkretnu radnju.'],
   ['Primer: do pet upita, jedna ispravka; nema slanja bez odobrenja.','Napiši šta je uključeno i šta NIJE uključeno.'],
   ['Primer: razmišljam o testnoj ceni 40 €, ali je niko nije potvrdio.','Upiši okvirnu hipotezu o ceni, ne javni cenovnik.']]},
  {intro:'Ne treba ti odmah savršen sajt. Odredi kome se obraćaš i koju radnju želiš od posetioca.',fields:[
   ['Primer: posetilac šalje besplatan upit sa tri kratka podatka.','Šta tačno korisnik treba da uradi na sajtu?'],
   ['Primer: početna, opis usluge, primer rezultata, kontakt i privatnost.','Napiši osnovne stranice i jednu rečenicu ponude.'],
   ['Primer: anonimni demo slučaj, kontrola pre objave, bez lažnih recenzija.','Koji sadržaj pripremaš i šta moraš proveriti pre objave?']]},
  {intro:'Objasni redosled rada: od upita preko provere do isporuke i odobrenja.',fields:[
   ['Primer: kontakt, vrsta problema i željeni datum, bez ličnih dokumenata.','Koje minimalne informacije treba da pošalje kupac?'],
   ['Primer: upit → pitanja → nacrt → moja provera → slanje kupcu.','Ko radi svaki korak i kako se otkriva greška?'],
   ['Primer: ne ubacujem tuđe podatke u javni AI; ručno odobravam slanje.','Kako štitiš podatke i ko odobrava konačan rezultat?']]},
  {intro:'Izaberi mali test, rok i jasnu odluku. Plan i pretpostavke nisu stvarni kupci.',fields:[
   ['Primer: tri dobrovoljna razgovora sa odgovarajućim firmama.','Kako bezbedno i zakonito možeš proveriti interesovanje?'],
   ['Primer: do 15.12. tri povratne informacije i bar jedan ozbiljan upit.','Koji merljiv signal očekuješ i do kada?'],
   ['Primer: REVIEW ako nedostaju dokazi; STOP posle dva bezuspešna testa.','Šta znači nastavi (PASS), proveri (REVIEW), ili stani (STOP)?']]}
 ];
 const helperCopy=de?{
  tip:'Was soll ich eingeben?',example:'Beispiel (nur zum Verständnis, nicht automatisch übernommen)', 
  ai:'KI-Fragen für diesen Schritt vorbereiten',aiNote:'Dieses kostenlose Formular ruft kein KI-Modell auf. Sie können den vorbereiteten Text in einen KI-Assistenten Ihrer Wahl kopieren. Prüfen Sie alle Antworten selbst; keine personenbezogenen oder vertraulichen Daten senden.',
  copy:'KI-Prompt kopieren',copied:'Kopiert – bitte im eigenen KI-Assistenten einfügen.',promptTitle:'Prüffragen zu meinem Geschäftsvorhaben',promptEnd:'Stelle höchstens drei priorisierte Rückfragen. Trenne nachweislich belegte Fakten, meine Annahmen und unbekannte Punkte. Erfinde keine Belege, Kunden, Preise oder Garantien. Nenne einen kostenlosen überprüfbaren nächsten Schritt. Keine Rechts- oder Steuerberatung.',
  localCheck:'Entwurf prüfen (ohne KI)',localResult:'Automatische Vollständigkeitsprüfung – keine KI- oder Marktanalyse',
  missing:'Noch nicht ausgefüllt',checkOk:'Es sind Angaben vorhanden. Das beweist weder Nachfrage noch Eignung.',checkSource:'Ohne echte, datierte Quelle ist die Nachfrage nicht überprüft.',checkFinish:'Vor weiteren Ausgaben die offenen Punkte mit echten Quellen prüfen.'
 }:{
  tip:'Šta treba da upišem?',example:'Primer (samo objašnjenje, ne popunjava se automatski)',
  ai:'Pripremi AI pitanja za ovaj korak',aiNote:'Ovaj besplatni formular ne poziva AI model. Pripremljeni tekst možeš kopirati u AI asistenta po svom izboru. Proveri njegove odgovore; ne šalji lične ili poverljive podatke.',
  copy:'Kopiraj AI zadatak',copied:'Kopirano — nalepi u AI asistenta.',promptTitle:'Provera moje poslovne ideje',promptEnd:'Postavi najviše tri najvažnija potpitanja. Odvoji proverene činjenice, moje pretpostavke i nepoznate informacije. Ne izmišljaj izvore, kupce, cene ni garancije. Predloži jedan besplatan način provere. Ne pružaj pravni ili poreski savet.',
  localCheck:'Proveri nacrt (bez AI)',localResult:'Automatska provera popunjenosti — nije AI ni provera tržišta',
  missing:'Još nije popunjeno',checkOk:'Podaci su uneti, ali to još ne dokazuje potražnju.',checkSource:'Bez stvarnog izvora i datuma potražnja nije proverena.',checkFinish:'Pre trošenja novca proveri pretpostavke na stvarnim izvorima.'
 };
 const ids=['niche','market','offer','online_presence','operations','validation'];
 let challenge=null,turnstileId=null,siteKey=null,selected=null,stage='niche';

 // Free no-login preview. No localStorage, cookies, external services, or API calls for user fields.
 const demoData={name:'',steps:{}};
 const aiReviews={}; // In-memory only; never persisted or sent to a third party automatically.
 let aiAvailable=false,aiSiteKey=null,aiTurnstileId=null,aiBusy=false;
 const aiText=de?{
  inProgress:'Die KI prüft nur Ihre Angaben, keine externen Quellen …',
  completed:'KI-Rückfragen erzeugt. Die Daten und Annahmen sind weiterhin ungeprüft.',
  disabled:'KI-Analyse ist nicht freigeschaltet. Nutzen Sie die lokalen Hilfen oder kopieren Sie den vorbereiteten Prompt.',
  token:'Bitte lösen Sie zuerst die Sicherheitsprüfung.',
  input:'Geben Sie zuerst einen Projektnamen und mindestens eine konkrete Aussage ein.',
  error:'Die KI-Analyse konnte nicht abgeschlossen werden. Es wurde kein Ergebnis behauptet; versuchen Sie es später erneut.',
  limit:'Das Tageslimit für KI-Analysen ist erreicht. Der kostenlose lokale Builder bleibt nutzbar.',
  questions:'KI-Rückfragen (nicht unabhängig geprüft)',
  assumptions:'Unbestätigte Hypothesen aus der KI-Prüfung',
  next:'Nächster vorgeschlagener Prüfschritt',
  disclaimer:'Die ausdrücklich angeforderte KI-Prüfung stellt Fragen und Hypothesen bereit. Sie bestätigt keine Marktinformationen oder Erfolgsaussichten.'
 }:{
  inProgress:'AI proverava samo tvoje odgovore, ne spoljne izvore …',
  completed:'AI pitanja su pripremljena. Tvoje tvrdnje i pretpostavke ostaju neproverene.',
  disabled:'AI analiza nije odobrena. Koristi lokalna uputstva ili kopiraj pripremljeni zadatak.',
  token:'Prvo završi bezbednosnu proveru.',
  input:'Prvo unesi naziv i bar jednu konkretnu tvrdnju.',
  error:'AI analiza nije završena. Ne prikazujemo izmišljene rezultate; pokušaj kasnije.',
  limit:'Dostignuta je dnevna kvota za AI. Besplatni formular i dalje radi.',
  questions:'AI pitanja (nisu nezavisno proverena)',
  assumptions:'Nepotvrđene pretpostavke iz AI pregleda',
  next:'Predloženi sledeći korak',
  disclaimer:'AI je pozvan samo na tvoj izričit zahtev. Pitanja i pretpostavke nisu potvrda tržišta, kupaca ili uspeha.'
 };
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
 function aiDisclaimer(){return Object.keys(aiReviews).length?aiText.disclaimer:packageCopy.disclaimer}
 function aiTextLines(id){
  const x=aiReviews[id];if(!x)return [];
  return ['',aiText.questions,...x.questions.map(y=>'- '+y),aiText.assumptions,...x.assumptions.map(y=>'- '+y),aiText.next,x.nextStep,''];
 }
 function packageText(){
  const lines=[packageCopy.title,demoData.name,'',aiDisclaimer(),''];
  ids.forEach((id,i)=>{
   lines.push((i+1)+'. '+i18n.labels[i][0]);
   ['a','b','c'].forEach((key,j)=>lines.push(i18n.labels[i][j+1]+': '+(demoData.steps[id]?.[key]?.trim()||packageCopy.empty)));
   lines.push(...aiTextLines(id),'');
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
  const id=ids[demoStage];
  if(JSON.stringify(demoData.steps[id]||{})!==JSON.stringify(values))delete aiReviews[id];
  demoData.steps[id]=values;
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
  const help=append('p',beginner[demoStage].intro,'bb-beginner-intro');
  fields.append(help);
  const old=demoData.steps[ids[demoStage]]||{};
  for(const [n,key] of ['a','b','c'].entries()){
   const wrap=append('div',null,'bb-field');
   const label=append('label',labels[n+1]);const textarea=append('textarea');
   textarea.id='demo-field-'+key;textarea.name=key;textarea.maxLength=1500;textarea.rows=3;textarea.value=old[key]||'';
   label.htmlFor=textarea.id;
   textarea.placeholder=beginner[demoStage].fields[n][0];
   const explanation=append('p',helperCopy.tip+' '+beginner[demoStage].fields[n][1],'bb-field-tip');
   const example=append('p',helperCopy.example+': '+beginner[demoStage].fields[n][0],'bb-field-example');
   wrap.append(label,explanation,textarea,example);fields.append(wrap);
  }
  const tools=append('div',null,'bb-helper-panel');
  const note=append('p',aiAvailable?aiText.disclaimer:helperCopy.aiNote,'bb-field-tip');
  const promptButton=append('button',helperCopy.ai,'bb-outline');promptButton.type='button';
  const checkButton=append('button',helperCopy.localCheck,'bb-outline');checkButton.type='button';
  const promptArea=append('textarea');promptArea.id='demo-ai-prompt';promptArea.readOnly=true;promptArea.hidden=true;promptArea.rows=9;promptArea.setAttribute('aria-label',helperCopy.promptTitle);
  const copyButton=append('button',helperCopy.copy,'bb-outline');copyButton.type='button';copyButton.hidden=true;
  const feedback=append('p',null,'bb-field-tip');feedback.id='demo-help-feedback';feedback.setAttribute('role','status');
  function buildPrompt(){
    captureDemo();
    const answers=demoData.steps[ids[demoStage]]||{};
    return [helperCopy.promptTitle, 'Projekt: '+demoData.name,
      'Phase: '+labels[0],
      ...['a','b','c'].map((key,n)=>labels[n+1]+': '+(answers[key]||helperCopy.missing)),
      helperCopy.promptEnd].join('\\n');
  }
  promptButton.addEventListener('click',()=>{promptArea.value=buildPrompt();promptArea.hidden=false;copyButton.hidden=false;feedback.textContent='';});
  copyButton.addEventListener('click',async()=>{promptArea.value=buildPrompt();promptArea.select();
   try{await navigator.clipboard.writeText(promptArea.value);feedback.textContent=helperCopy.copied}
   catch{feedback.textContent=de?'Text markieren und manuell kopieren.':'Označi tekst i kopiraj ručno.';}
  });
  checkButton.addEventListener('click',()=>{
    captureDemo();
    const values=demoData.steps[ids[demoStage]]||{};
    const gaps=['a','b','c'].filter(key=>!(values[key]||'').trim()).map(key=>labels[['a','b','c'].indexOf(key)+1]);
    feedback.textContent=helperCopy.localResult+': '+(gaps.length
       ?(de?'Bitte ergänzen: ':'Dopuni: ')+gaps.join(', ')
       :helperCopy.checkOk)+(demoStage===1?' '+helperCopy.checkSource:'')+' '+helperCopy.checkFinish;
  });
  tools.append(note,promptButton,checkButton,promptArea,copyButton,feedback);fields.append(tools);
  const priorReview=aiReviews[ids[demoStage]];
  if(priorReview)fields.append(renderAiReview(priorReview));
  if(aiTurnstileId!==null&&window.turnstile)window.turnstile.reset(aiTurnstileId);
 }
 function renderAiReview(x){
  const box=append('section',null,'bb-ai-result');
  const sections=[[aiText.questions,x.questions],[aiText.assumptions,x.assumptions],[aiText.next,[x.nextStep]]];
  for(const [heading,items] of sections){
   box.append(append('h5',heading));
   for(const value of items)box.append(append('p',value));
  }
  box.append(append('p',aiText.disclaimer));
  return box;
 }
 async function loadAiStatus(){
  try{
   const status=await api('ai/status');
   aiAvailable=status.enabled===true&&typeof status.siteKey==='string'&&status.siteKey.length>6;
   if(!aiAvailable)return;
   aiSiteKey=status.siteKey;
   const target=$('demo-ai-controls');
   if(!target||!window.turnstile){
    if(!window.turnstile){
     const script=document.createElement('script');
     script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
     script.async=true;
     await new Promise((resolve,reject)=>{script.onload=resolve;script.onerror=reject;document.head.append(script)});
    }
   }
   if(!window.turnstile)throw Error('captcha_unavailable');
   aiTurnstileId=window.turnstile.render('#demo-ai-turnstile',{
    sitekey:aiSiteKey,action:'academy-ai',language:de?'de':'sr',theme:'auto'
   });
   show('demo-ai-controls',true);
   // Re-render labels after the explicit AI availability was confirmed.
   renderDemo();
  }catch{
   aiAvailable=false;show('demo-ai-controls',false);
  }
 }
 $('demo-ai-review').addEventListener('click',async()=>{
  if(aiBusy||!aiAvailable)return;
  captureDemo();
  const fields=demoData.steps[ids[demoStage]]||{};
  if(!demoData.name||!Object.values(fields).some(v=>v.length>8)){
   $('demo-ai-feedback').textContent=aiText.input;return;
  }
  const token=window.turnstile?.getResponse(aiTurnstileId)||'';
  if(!token){$('demo-ai-feedback').textContent=aiText.token;return}
  aiBusy=true;$('demo-ai-review').disabled=true;
  $('demo-ai-feedback').textContent=aiText.inProgress;
  const id=ids[demoStage];
  try{
   const x=await api('ai/review','POST',{language:de?'de':'sr',step:id,projectName:demoData.name,fields,turnstileToken:token});
   if(x.aiUsed!==true||x.unverified!==true||!Array.isArray(x.questions)||typeof x.nextStep!=='string')throw Error('invalid_ai_output');
   aiReviews[id]={questions:x.questions.slice(0,3),assumptions:(x.assumptions||[]).slice(0,3),nextStep:x.nextStep};
   $('demo-ai-feedback').textContent=aiText.completed;
   const prior=$('demo-fields').querySelector('.bb-ai-result');
   if(prior)prior.remove();
   $('demo-fields').append(renderAiReview(aiReviews[id]));
  }catch(error){
   const message=String(error?.message||'');
   $('demo-ai-feedback').textContent=message==='academy_ai_daily_limit'?aiText.limit:message==='academy_ai_disabled'?aiText.disabled:aiText.error;
  }finally{
   aiBusy=false;$('demo-ai-review').disabled=false;
   if(aiTurnstileId!==null&&window.turnstile)window.turnstile.reset(aiTurnstileId);
  }
 });
 function showDemoResult(){
  const result=$('demo-summary');result.replaceChildren();
  result.append(append('h4',packageCopy.title+' — '+demoData.name));
  result.append(append('p',aiDisclaimer(),'bb-evidence-note'));
  for(let i=0;i<6;i++){
    const step=append('section',null,'bb-demo-row');step.append(append('strong',(i+1)+'. '+i18n.labels[i][0]));
    const vals=demoData.steps[ids[i]]||{};
    for(let n=0;n<3;n++){
      const key=['a','b','c'][n];
      const value=(vals[key]||'').trim();
      if(value){step.append(append('strong',i18n.labels[i][n+1]),append('p',value));}
    }
    result.append(step);
    if(aiReviews[ids[i]])result.append(renderAiReview(aiReviews[ids[i]]));
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
  for(const key of Object.keys(aiReviews))delete aiReviews[key];
  show('demo-result',false);show('demo-form',true);renderDemo();
 });
 $('demo-export').addEventListener('click',()=>{
  const output={product:'DANINI Business Builder - private preview',version:1,language:de?'de':'sr',
   project:{title:demoData.name,steps:ids.map(id=>({step:id,fields:demoData.steps[id]||{},aiReview:aiReviews[id]||null}))},
   aiUsed:Object.keys(aiReviews).length>0,
   disclaimer:aiDisclaimer()};
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
   if(!config.enabled||!config.siteKey){show('demo',true);renderDemo();notice(i18n.unavailable);loadAiStatus();return}
   siteKey=config.siteKey;
   const session=await api('session');
   if(session.authenticated){show('dashboard',true);await refresh();notice(i18n.ready);return}
   show('signin',true);await loadTurnstile();notice(i18n.ready);
  }catch{show('signin',false);show('demo',true);renderDemo();notice(i18n.unavailable);loadAiStatus()}
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
