/* AutoDanini guided buyer dialogue.
 * Local, rules-only, zero model calls and no transmission of the free dialogue.
 * Notes are never persisted; sessionStorage contains only topic and yes/no/unknown values.
 */
(function () {
  'use strict';
  const MAX_QUESTIONS = 3;
  const STORE = 'danini-problem-guide-v2';
  const text = {
    de: {
      yes:'Ja', no:'Nein', unknown:'Nicht bekannt', next:'Antwort übernehmen',
      edit:'Ändern', back:'Zurück', restart:'Gespräch neu starten',
      start:'Anliegen einordnen', choose:'Bitte wählen Sie eines der fünf Themen aus.',
      progress:'Frage', reason:'Warum diese Frage?', note:'Oder kurz antworten (optional)',
      noteSend:'Kurze Antwort übernehmen', results:'Ihre nächsten Schritte',
      source:'Kostenlose regelbasierte Orientierung. Keine generative KI und keine unabhängige Fahrzeugprüfung.',
      known:'Ihre Angaben (nicht unabhängig geprüft)', missing:'Nicht bestätigt / noch zu klären',
      verified:'Unabhängig bestätigte Fahrzeugdaten: keine.',
      seller:'Fragen an den Verkäufer auf Deutsch',
      service:'Unverbindliche individuelle Vorprüfung anfragen',
      listing:'Optional: Inserat oder Text prüfen', noMail:'Kein E-Mail-Konto für diesen Schritt nötig.',
      noFacts:'Nicht bestätigt', claimedYes:'Laut Ihrer Angabe: ja — nicht unabhängig bestätigt.', claimedNo:'Laut Ihrer Angabe: nein — Nachweis fehlt.', unclear:'Auch bejahte Angaben sind ohne unabhängige Belege nicht bestätigt.',
      photo:'Ein Foto eines Dokuments ist noch keine Prüfung des Originals oder der FIN am Fahrzeug.',
      intro:'Ihre Antworten sind Selbstauskünfte. Kein Ergebnis bestätigt Eigentum, Zustand, Laufleistung oder Echtheit der Dokumente.',
      step:'Nächster Schritt', questionChange:'Frühere Antwort ändern'
    },
    sr: {
      yes:'Da', no:'Ne', unknown:'Ne znam', next:'Sačuvaj odgovor',
      edit:'Ispravi', back:'Nazad', restart:'Počni novi razgovor',
      start:'Prepoznaj problem', choose:'Izaberi jednu od pet oblasti da nastavimo.',
      progress:'Pitanje', reason:'Zašto pitamo?', note:'Ili kratko objasni (opciono)',
      noteSend:'Sačuvaj kratak odgovor', results:'Tvoji sledeći koraci',
      source:'Besplatno usmeravanje po pravilima. Nema generativne AI analize niti nezavisne provere vozila.',
      known:'Tvoji navodi (nisu nezavisno provereni)', missing:'Nije potvrđeno / treba proveriti',
      verified:'Nezavisno potvrđeni podaci o vozilu: nema ih.',
      seller:'Pitanja prodavcu na nemačkom',
      service:'Zatraži neobavezujuću individualnu predproveru',
      listing:'Opciono: analiza oglasa ili teksta', noMail:'Za ovaj korak nije potrebna e-mail adresa.',
      noFacts:'Nije potvrđeno', claimedYes:'Prema tvojoj izjavi: da — nije nezavisno potvrđeno.', claimedNo:'Prema tvojoj izjavi: ne — dokaz nedostaje.', unclear:'I potvrdni odgovori ostaju nepotvrđeni bez nezavisnih dokaza.',
      photo:'Fotografija dokumenta ne potvrđuje autentičnost originala niti VIN na samom vozilu.',
      intro:'Odgovori su tvoje izjave. Rezultat ne potvrđuje vlasništvo, stanje, kilometražu ni autentičnost dokumenata.',
      step:'Sledeći korak', questionChange:'Ispravi raniji odgovor'
    }
  };
  // Each following question responds to the immediately preceding answer.
  const subjects = [
    {
      id:'deposit', title:['Prodavac traži kaparu','Anzahlung vor dem Kauf'],
      questions:[
        {base:[ 'Da li prodavac traži uplatu pre nego što pogledaš auto?', 'Verlangt der Verkäufer Geld vor einer Besichtigung?', 'To određuje da li postoji neposredan rizik od uplate bez pregleda.','So klären wir, ob eine Zahlung vor einer Prüfung gefordert wird.' ]},
        {
          yes:['Da li si nezavisno proverio identitet prodavca i njegovo pravo prodaje?','Haben Sie Identität und Verkaufsberechtigung unabhängig überprüft?','Sama prepiska ili oglas ne dokazuju identitet.','Inserat und Chat bestätigen die Identität nicht.'],
          no:['Da li prodavac ipak zahteva novac da rezerviše vozilo?','Verlangt der Anbieter trotzdem eine Reservierungsgebühr?','Rezervacija može predstavljati uplatu pre kontrole.','Auch eine Reservierung kann eine Vorauszahlung sein.'],
          unknown:['Da li prodavac jasno navodi kada i pod kojim uslovima se plaća?','Sind Zeitpunkt und Bedingungen einer Zahlung schriftlich klar?','Najpre razjasni da li novac treba poslati unapred.','Zuerst die Zahlungsbedingungen klären.']
        },
        {
          yes:['Možeš li videti originalna dokumenta i organizovati pregled pre uplate?','Können Sie Originalpapiere und Besichtigung vor Zahlung prüfen?','Dokumentacija i pregled ostaju neophodni.','Unterlagen und Besichtigung sind weiterhin wichtig.'],
          no:['Da li si zatražio originalna dokumenta i mogućnost nezavisnog pregleda?','Haben Sie Originalpapiere und unabhängige Besichtigung angefragt?','Bez toga nema osnova za potvrdu kupovine.','Ohne dies ist die Kaufentscheidung nicht abgesichert.'],
          unknown:['Da li prodavac pristaje na pregled dokumentacije i vozila pre bilo kakve uplate?','Erlaubt der Verkäufer eine Dokumenten- und Fahrzeugprüfung vor jeder Zahlung?','Nejasan uslov uplate treba rešiti pre slanja novca.','Unklare Bedingungen gehören vor einer Überweisung geklärt.']
        }
      ],
      questionsSeller:['Können Sie Zulassungsbescheinigung Teil I und II bei der Besichtigung vorlegen?','Ist eine unabhängige Besichtigung vor einer Zahlung möglich?'],
      action:['Nemoj slati kaparu na osnovu oglasa. Traži dokumenta, proveru prodavca i mogućnost pregleda pre odluke.','Keine Anzahlung allein anhand des Inserats leisten. Dokumente, Verkäufer und Besichtigung zuerst klären.']
    },
    {
      id:'travel',title:['Da li da putujem u Nemačku zbog auta?','Vor einer Reise nach Deutschland'],
      questions:[
        {base:['Imaš li VIN i dostupnu dokumentaciju vozila pre puta?','Liegen FIN und Fahrzeugunterlagen bereits vor?','Bez podataka se teško procenjuje smisao putovanja.','Ohne Unterlagen lässt sich die Anreise kaum vorbereiten.']},
        {yes:['Da li je prodavac potvrdio tačan termin i dostupnost vozila?','Hat der Verkäufer Verfügbarkeit und Termin verbindlich bestätigt?','Put planiraj tek uz potvrđen susret.','Reisen Sie erst mit bestätigtem Termin.'],
         no:['Da li si zatražio VIN i dokumenta pre dogovaranja putovanja?','Haben Sie FIN und Unterlagen vor der Reise angefordert?','Najpre pribavi osnovne podatke.','Zuerst die Mindestangaben beschaffen.'],
         unknown:['Možeš li dobiti osnovna dokumenta od prodavca pre kupovine karte?','Können Sie die Unterlagen vor einer Ticketbuchung erhalten?','Ne ulaži u put dok se dostupnost ne razjasni.','Keine Anreisekosten ohne Klärung.']},
        {yes:['Da li znaš troškove puta i postoji li mogućnost nezavisnog pregleda?','Sind Reisekosten und eine unabhängige Prüfung geklärt?','Računaj i mogućnost da od kupovine odustaneš.','Berücksichtigen Sie auch einen Kaufabbruch.'],
         no:['Da li možeš odložiti put dok prodavac ne potvrdi neophodne podatke?','Können Sie die Reise bis zur Bestätigung der Angaben verschieben?','Nepotvrđen termin povećava rizik nepotrebnog puta.','Ohne Termin riskieren Sie eine unnötige Fahrt.'],
         unknown:['Da li možeš potvrditi dostupnost vozila i proceniti trošak puta?','Können Sie Verfügbarkeit und Reisekosten vorab klären?','Ne zasnivaj odluku na pretpostavci.','Nicht auf Vermutungen reisen.']}
      ],
      questionsSeller:['Können Sie die FIN und Fahrzeugunterlagen vor der Anreise bereitstellen?','Ist eine verbindliche Besichtigung mit dem Fahrzeug vor Ort möglich?'],
      action:['Pre puta traži dokumenta, pisanu potvrdu termina i okvir poznatih troškova.','Vor der Anreise Unterlagen, schriftliche Terminbestätigung und bekannte Kosten klären.']
    },
    {
      id:'documents',title:['Nedostaju ili su nejasna dokumenta','Fahrzeugdokumente verstehen'],
      questions:[
        {base:['Da li su dostupni Zulassungsbescheinigung Teil I i II?','Sind Zulassungsbescheinigung Teil I und II vorhanden?','Oba dela su relevantna za proveru dokumentacije.','Beide Teile sind für die Unterlagenprüfung relevant.']},
        {yes:['Da li je VIN iz papira upoređen sa VIN-om na samom vozilu?','Wurde die FIN der Unterlagen am Fahrzeug abgeglichen?','Slika papira nije nezavisna potvrda vozila.','Ein Dokumentenfoto prüft nicht das Fahrzeug.'],
         no:['Da li si tražio da vidiš originalna dokumenta pre plaćanja?','Haben Sie die Originaldokumente vor einer Zahlung angefordert?','Bez originala ne donositi zaključke.','Ohne Originale keine Schlussfolgerung.'],
         unknown:['Da li prodavac može dostaviti spisak dokumenata koje ima?','Kann der Verkäufer die vorhandenen Unterlagen auflisten?','Najpre identifikuj šta zaista postoji.','Zuerst klären, was vorhanden ist.']},
        {yes:['Postoje li računi servisa i dokazi o prijavljenim popravkama?','Gibt es Wartungsrechnungen und Belege zu bekannten Reparaturen?','Usklađeni brojevi nisu dokaz celokupne istorije.','Abgeglichene Nummern belegen nicht die Historie.'],
         no:['Da li je moguć pregled originala i VIN-a uživo?','Ist ein Vergleich der Originale und der FIN vor Ort möglich?','Neslaganje i nedostupnost moraju ostati otvoreni.','Unklarheiten müssen offen bleiben.'],
         unknown:['Da li možeš dogovoriti nezavisno poređenje dokumenata i vozila?','Ist eine unabhängige Prüfung von Dokumenten und Fahrzeug möglich?','Bez te provere ne označavati podatak potvrđenim.','Ohne Vergleich nichts als bestätigt kennzeichnen.']}
      ],
      questionsSeller:['Können Sie Zulassungsbescheinigung Teil I und II im Original vorlegen?','Sind Wartungsrechnungen und Nachweise über bekannte Unfallschäden vorhanden?'],
      action:['Napravi spisak dokumenata koji nedostaju; originala i VIN proveravaju se neposredno.','Fehlende Unterlagen auflisten; Originale und FIN beim Fahrzeug prüfen.']
    },
    {
      id:'seller',title:['Treba mi pomoć u razgovoru na nemačkom','Verkäufer auf Deutsch fragen'],
      questions:[
        {base:['Da li je prodavac potvrdio da je vozilo dostupno za pregled?','Hat der Verkäufer die Besichtigung des Fahrzeugs bestätigt?','Prvo potvrdi da se vozilo može pogledati.','Zuerst die tatsächliche Besichtigung klären.']},
        {yes:['Da li je prodavac pismeno naveo poznata oštećenja i mane?','Hat der Verkäufer bekannte Schäden und Mängel schriftlich benannt?','Pisani odgovori olakšavaju kasniju proveru.','Schriftliche Angaben lassen sich nachprüfen.'],
         no:['Da li si zatražio termin i pisanu potvrdu dostupnosti?','Haben Sie um Termin und schriftliche Bestätigung gebeten?','Ne putuj bez dogovora.','Nicht ohne Vereinbarung reisen.'],
         unknown:['Možeš li zatražiti da prodavac potvrdi lokaciju i termin?','Können Sie Standort und Termin bestätigen lassen?','Bez termina i mesta nema sigurnog plana.','Ohne Termin und Ort keine klare Planung.']},
        {yes:['Da li prodavac dozvoljava nezavisan stručni pregled?','Ist eine unabhängige technische Besichtigung möglich?','Navodi prodavca nisu stručna potvrda.','Verkäuferangaben ersetzen keine Fachprüfung.'],
         no:['Da li će prodavac pisano odgovoriti na pitanja o šteti i servisima?','Wird der Anbieter Schäden und Wartung schriftlich erläutern?','Nejasan odgovor ostaje nepotvrđen.','Unklare Antworten bleiben unbestätigt.'],
         unknown:['Da li možeš dobiti pisane odgovore pre kupovine?','Können Sie vor dem Kauf schriftliche Antworten erhalten?','Razgovor bez dokaza nije potvrda.','Ein Gespräch ist noch kein Beleg.']}
      ],
      questionsSeller:['Ist das Fahrzeug noch verfügbar und wann ist eine Besichtigung möglich?','Welche Unfallschäden, Reparaturen oder Mängel sind Ihnen bekannt?','Ist eine unabhängige Fahrzeugprüfung vor Vertragsabschluss möglich?'],
      action:['Pošalji pitanja na nemačkom, sačuvaj odgovore i svaku nejasnoću označi za proveru.','Fragen schriftlich senden, Antworten dokumentieren und offene Punkte prüfen.']
    },
    {
      id:'import',title:['Uvoz i ukupni troškovi','Einfuhr und Kosten klären'],
      questions:[
        {base:['Znaš li u koju državu će vozilo biti uvezeno?','Steht das Einfuhrland bereits fest?','Dažbine zavise od odredišne države.','Abgaben hängen vom Zielland ab.']},
        {yes:['Imaš li pismeno potvrđenu cenu auta i trošak prevoza?','Sind Kaufpreis und Transportkosten schriftlich belegt?','Nepoznati iznosi ne ulaze u obračun.','Unbekannte Kosten nicht schätzen.'],
         no:['Možeš li prvo odrediti zemlju registracije?','Können Sie zuerst das Zulassungsland festlegen?','Bez zemlje ne može se utvrditi primenjivi postupak.','Ohne Zielland ist das Verfahren unklar.'],
         unknown:['Da li proveravaš pravila države u koju auto treba da stigne?','Prüfen Sie die Vorgaben des voraussichtlichen Ziellands?','Ne prenositi poreska pravila druge države.','Steuerregeln nicht zwischen Ländern übertragen.']},
        {yes:['Da li su porezi, dokumentacija i registracija provereni kod nadležnih izvora?','Sind Abgaben, Unterlagen und Zulassung bei zuständigen Stellen geprüft?','Zbir poznatih stavki nije konačan trošak uvoza.','Bekannte Beträge sind keine Gesamtkosten-Garantie.'],
         no:['Da li možeš zatražiti pisanu ponudu za transport i konačnu cenu vozila?','Können Sie Kaufpreis und Transport schriftlich anfordern?','Bez toga zbir nije potpun.','Sonst bleibt die Summe unvollständig.'],
         unknown:['Da li možeš proveriti dokumente i dažbine kod nadležnih organa?','Können Sie Unterlagen und Abgaben bei den zuständigen Stellen klären?','Ne nudimo carinsku garanciju.','Keine Zollgarantie.']}
      ],
      questionsSeller:['Ist der Gesamtpreis einschließlich möglicher Mehrwertsteuer schriftlich bestätigt?','Welche Fahrzeug- und Exportdokumente erhalten Käufer beim Kauf?'],
      action:['Saberi samo dokumentovane iznose. Nepoznate poreze, tablice i registraciju proveri za tačnu državu uvoza.','Nur belegte Kosten addieren; Steuern, Kennzeichen und Zulassung für das Zielland separat prüfen.']
    }
  ];
  const phrase = (pair, de) => pair[de ? 1 : 0];
  const topicByText = (raw) => {
    const value = String(raw || '').toLowerCase().slice(0,360);
    const groups = {
      deposit:/kapar|avans|uplati|anzahlung|vorauszahlung|reservierungsgebühr/,
      travel:/putujem|putov|putan|dolazak|reisen|anreise|fahrt nach deutschland/,
      documents:/dokument|papir|saobraćajn|fahrzeugbrief|fahrzeugschein|zulassungsbescheinigung/,
      seller:/ne govorim nemačk|ne znam nemačk|na nemačkom|pomoć na nemačk|deutsch sprechen|kein deutsch|verkäufer kontaktieren|frage auf deutsch|kontakt mit verkäufer/,
      import:/uvoz|carin|porez|registracij|einfuhr|zoll|importkosten/
    };
    const found = Object.entries(groups).filter(([,pattern])=>pattern.test(value)).map(([id])=>id);
    return found.length===1 ? found[0] : null; // No guess when multiple intentions.
  };
  function getQuestion(scenario, step, answers, de) {
    if (!scenario || step<0 || step>=MAX_QUESTIONS) return null;
    const options = scenario.questions[step];
    const prior = step===0 ? 'base' : (answers[step-1]?.value || 'unknown');
    const pair = options[prior] || options.unknown || options.base;
    return {question:pair[de?1:0],why:pair[de?3:2]};
  }
  // Test-only future model contract. No inference endpoint is exposed by this guide.
  // Reject unknown fields and model claims of independent verification.
  function validateMockAiFollowup(value, asked=[]) {
    if (!value || typeof value!=='object' || Array.isArray(value)) return null;
    if (Object.keys(value).sort().join(',')!=='kind,missing,question,why') return null;
    if (value.kind!=='follow_up' || typeof value.question!=='string' || typeof value.why!=='string' || !Array.isArray(value.missing)) return null;
    const q=value.question.trim(), why=value.why.trim();
    if (q.length<10 || q.length>180 || why.length<8 || why.length>240 || value.missing.length>5) return null;
    if (!value.missing.every(item=>typeof item==='string' && item.length<=100)) return null;
    if (asked.some(item=>item.trim().toLowerCase()===q.toLowerCase())) return null;
    if (/garantiert|garantovano|sigurn[aoi]|sicherer kauf|unfallfrei bestätigt|verified independently/i.test(q+' '+why)) return null;
    return {kind:'follow_up',question:q,why,missing:value.missing};
  }
  if (typeof module==='object' && module.exports) module.exports={MAX_QUESTIONS,subjects,topicByText,getQuestion,validateMockAiFollowup};
  if (typeof document==='undefined') return;
  const root=document.querySelector('[data-problem-guide]');
  if (!root) return;
  const de=document.querySelector('[data-advisor]')?.dataset.locale==='de';
  const l=text[de?'de':'sr'];
  const options=root.querySelector('#problem-guide-options');
  const question=root.querySelector('#problem-guide-question');
  const result=root.querySelector('#problem-guide-result');
  const history=root.querySelector('#problem-guide-history');
  const progress=root.querySelector('#problem-guide-progress');
  const description=root.querySelector('#problem-guide-description');
  const start=root.querySelector('#problem-guide-start');
  const feedback=root.querySelector('#problem-guide-feedback');
  if (!options || !question || !result || !history || !progress || !description || !start || !feedback) return;
  let selected=null,step=0,answers=[];
  const el=(tag,content,cls)=>{
    const node=document.createElement(tag);
    if (content!==undefined) node.textContent=content;
    if (cls) node.className=cls;
    return node;
  };
  const button=(label,handler,pressed=false)=>{
    const b=el('button',label);
    b.type='button';
    b.setAttribute('aria-pressed',String(pressed));
    b.addEventListener('click',handler);
    return b;
  };
  const save=()=>{
    try {
      if(!selected){sessionStorage.removeItem(STORE);return;}
      // Never persist free text, listing URLs, contact or documents.
      sessionStorage.setItem(STORE,JSON.stringify({id:selected.id,values:answers.map(a=>a.value)}));
    } catch { /* private browsing may disallow storage; memory state still works */ }
  };
  const focusQuestion=()=>{
    const heading=question.querySelector('h3') || result.querySelector('h3');
    if (heading) {heading.tabIndex=-1;heading.focus({preventScroll:true});}
  };
  const showOptions=()=>{
    options.replaceChildren();
    for(const scenario of subjects)options.append(button(phrase(scenario.title,de),()=>{
      selected=scenario;step=0;answers=[];description.value='';feedback.textContent='';save();showOptions();render();
    },selected?.id===scenario.id));
  };
  const restart=()=>{
    selected=null;step=0;answers=[];description.value='';feedback.textContent='';
    save();showOptions();render();start.focus();
  };
  const choose=(value,note='')=>{
    if(!selected||step>=MAX_QUESTIONS)return;
    const info=getQuestion(selected,step,answers,de);
    answers[step]={value,question:info.question,note:note.slice(0,250)};
    step++;save();render();focusQuestion();
  };
  const render=()=>{
    question.replaceChildren();result.replaceChildren();history.replaceChildren();
    if(!selected){progress.textContent='';return;}
    progress.textContent=step<MAX_QUESTIONS
      ?l.progress+' '+(step+1)+' / '+MAX_QUESTIONS
      :MAX_QUESTIONS+' / '+MAX_QUESTIONS;
    if(answers.length){
      const header=el('strong',l.known);
      const list=el('ol');
      answers.forEach((item,i)=>{
        const li=el('li',item.question+' — '+(item.value==='yes'?l.yes:item.value==='no'?l.no:l.unknown)+(item.note?' — '+item.note:''));
        li.append(button(l.edit+' '+(i+1),()=>{answers=answers.slice(0,i);step=i;save();render();focusQuestion();}));
        list.append(li);
      });
      history.append(header,list);
    }
    if(step<MAX_QUESTIONS){
      const info=getQuestion(selected,step,answers,de);
      question.append(el('h3',info.question),el('p',l.reason+' '+info.why));
      const choices=el('div',undefined,'advisor-answer-buttons');
      for(const value of ['yes','no','unknown'])choices.append(button(l[value],()=>choose(value)));
      question.append(choices);
      const label=el('label',l.note);
      label.htmlFor='problem-guide-reply';
      const reply=el('textarea');
      reply.id='problem-guide-reply';reply.rows=2;reply.maxLength=250;
      const noteButton=button(l.noteSend,()=>{const raw=reply.value.trim();if(raw)choose('unknown',raw);else reply.focus();});
      question.append(label,reply,noteButton);
      const nav=el('div',undefined,'advisor-answer-buttons');
      if(step>0)nav.append(button(l.back,()=>{answers=answers.slice(0,step-1);step--;save();render();focusQuestion();}));
      nav.append(button(l.restart,restart));
      question.append(nav);
      return;
    }
    result.append(el('h3',l.results),el('p',l.source),el('p',l.intro),el('p',l.verified));
    const missing=el('ul');
    // Every answer is a self-report, including YES. No answer independently verifies a vehicle.
    answers.forEach(item=>{
      const evidenceStatus=item.value==='yes'?l.claimedYes:item.value==='no'?l.claimedNo:l.noFacts;
      missing.append(el('li',item.question+' — '+evidenceStatus));
    });
    if(!missing.childElementCount)missing.append(el('li',l.unclear));
    result.append(el('strong',l.missing),missing);
    if(answers.some(a=>/fotograf|slik[au]|photo|foto|bild/i.test(a.note)))result.append(el('p',l.photo));
    result.append(el('strong',l.step),el('p',phrase(selected.action,de)),el('strong',l.seller));
    const seller=el('ul');
    selected.questionsSeller.forEach(s=>seller.append(el('li',s)));
    result.append(seller,el('p',l.noMail));
    const actions=el('div',undefined,'advisor-answer-buttons');
    const service=el('a',l.service);service.href='/'+(de?'de':'sr')+'/auto-check/#contact';
    service.addEventListener('click',()=>{
      try {
        // Explicit opt-in handoff: only topic and fixed-choice answers, never free text or PII.
        sessionStorage.setItem('danini-auto-enquiry-handoff-v1',JSON.stringify({id:selected.id,values:answers.map(a=>a.value)}));
      }catch{ /* contact form remains accessible without sessionStorage */ }
    });
    actions.append(service);
    const listing=el('a',l.listing);listing.href='#listing';listing.addEventListener('click',()=>document.querySelector('.advisor-advanced')?.setAttribute('open',''));actions.append(listing);
    result.append(actions);
    question.append(button(l.back,()=>{step=MAX_QUESTIONS-1;answers=answers.slice(0,step);save();render();focusQuestion();}));
    question.append(button(l.restart,restart));
  };
  start.addEventListener('click',()=>{
    const found=topicByText(description.value);
    if(!found){feedback.textContent=l.choose;options.querySelector('button')?.focus();return;}
    selected=subjects.find(x=>x.id===found);step=0;answers=[];feedback.textContent='';
    // Problem free text stays local, not persisted or sent to server.
    save();showOptions();render();focusQuestion();
  });
  try {
    const data=JSON.parse(sessionStorage.getItem(STORE)||'null');
    const candidate=subjects.find(x=>x.id===data?.id);
    if(candidate && Array.isArray(data?.values) && data.values.length<=MAX_QUESTIONS && data.values.every(v=>['yes','no','unknown'].includes(v))){
      selected=candidate;
      for(const value of data.values){
        const info=getQuestion(selected,answers.length,answers,de);
        answers.push({value,question:info.question,note:''});
      }
      step=answers.length;
    }
  }catch{ /* ignore invalid session data */ }
  showOptions();render();
})();