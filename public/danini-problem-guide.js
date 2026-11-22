/* AutoDanini problem-first guidance: deterministic, local-only, NO model calls or external data. */
(() => {
  'use strict';
  const root=document.querySelector('[data-problem-guide]');
  if(!root)return;
  const de=document.querySelector('[data-advisor]')?.dataset.locale==='de';
  const i18n=de?{
    yes:'Ja',no:'Nein',unknown:'Noch unklar',next:'Weiter',back:'Zurück',
    title:'Ihre nächsten Prüfschritte',source:'Basierend nur auf Ihren Antworten; keine externe Überprüfung, keine KI-Analyse.',
    missing:'Nicht unabhängig bestätigt:',seller:'Fragen für den Verkäufer (Deutsch):',
    contact:'Individuelle Vorprüfung anfragen',details:'Inseratdaten optional ergänzen',
    summaryYes:'Sie haben angegeben: Ja',summaryNo:'Sie haben angegeben: Nein',summaryUnknown:'Sie haben angegeben: Noch unklar',
    answers:'Ihre Angaben:',restart:'Anderes Anliegen auswählen'
  }:{
    yes:'Da',no:'Ne',unknown:'Ne znam',next:'Dalje',back:'Nazad',
    title:'Tvoji sledeći koraci',source:'Samo na osnovu tvojih odgovora; nema nezavisne provere niti AI analize.',
    missing:'Nije nezavisno potvrđeno:',seller:'Pitanja prodavcu na nemačkom:',
    contact:'Zatraži individualnu predproveru',details:'Po želji dopuni podatke oglasa',
    summaryYes:'Odgovor: Da',summaryNo:'Odgovor: Ne',summaryUnknown:'Odgovor: Ne znam',
    answers:'Tvoji odgovori:',restart:'Izaberi drugi problem'
  };
  // Questions are intentionally factual: answers are not treated as verified evidence.
  const scenarios=[
    {id:'deposit',title:de?'Anzahlung vor dem Kauf':'Prodavac traži kaparu',
     qs:de?['Verlangt der Verkäufer Geld vor der Besichtigung?','Haben Sie Identität und Verfügungsberechtigung des Verkäufers unabhängig geklärt?','Gibt es die Fahrzeugunterlagen und eine mögliche Besichtigung vor der Zahlung?']:
          ['Traži li prodavac uplatu pre pregleda vozila?','Da li je identitet prodavca i pravo prodaje nezavisno potvrđeno?','Imate li dokumenta vozila i mogućnost pregleda pre plaćanja?'],
     seller:['Können Sie die Fahrzeugpapiere bei einer Besichtigung vorzeigen?','Ist eine unabhängige Besichtigung vor einer Anzahlung möglich?'],
     next:de?'Keine Anzahlung auf Basis des Inserats allein. Erst Identität, Berechtigung, Unterlagen und unabhängige Besichtigung klären.':'Ne uplaćuj kaparu samo na osnovu oglasa. Prvo proveri identitet, pravo prodaje, dokumenta i mogućnost nezavisnog pregleda.'},
    {id:'travel',title:de?'Vor einer Reise nach Deutschland':'Da li da putujem zbog auta?',
     qs:de?['Sind VIN und Fahrzeugdokumente vorab verfügbar?','Hat der Verkäufer einen verbindlichen Besichtigungstermin bestätigt?','Sind bekannte Reisekosten und ein unabhängiger Check eingeplant?']:
          ['Imate li VIN i dostupnu dokumentaciju pre puta?','Da li je prodavac potvrdio termin pregleda?','Znate li troškove puta i mogućnosti nezavisnog pregleda?'],
     seller:['Können Sie die FIN und Dokumente vor der Anreise bereitstellen?','Können wir vorab einen festen Besichtigungstermin vereinbaren?'],
     next:de?'Reise erst planen, wenn Unterlagen, Termin und Prüfmöglichkeit geklärt sind.':'Planiraj put tek kada imaš dokumenta, potvrđen termin i mogućnost pregleda.'},
    {id:'documents',title:de?'Fahrzeugdokumente verstehen':'Nedostaju ili su nejasna dokumenta',
     qs:de?['Sind Zulassungsbescheinigung Teil I und II verfügbar?','Wurde die FIN in den Unterlagen mit dem Fahrzeug abgeglichen?','Liegen Belege zu Wartung und gemeldeten Schäden vor?']:
          ['Da li su dostupni Zulassungsbescheinigung Teil I i II?','Da li je VIN iz dokumenata upoređen sa vozilom?','Postoje li računi za servis i prijavljene popravke?'],
     seller:['Können Sie Teil I und II bei der Besichtigung vorlegen?','Sind Wartungsrechnungen und Reparaturnachweise vorhanden?'],
     next:de?'Nicht vorhandene Dokumente nicht durch Vermutungen ersetzen. Originale und FIN vor Ort abgleichen.':'Ne dopunjuj nepoznato pretpostavkama. Originalna dokumenta i VIN proveri na licu mesta.'},
    {id:'seller',title:de?'Verkäufer auf Deutsch fragen':'Treba mi pomoć na nemačkom',
     qs:de?['Steht das Fahrzeug beim Anbieter zur Besichtigung bereit?','Hat der Anbieter bekannte Schäden schriftlich beschrieben?','Ist eine unabhängige Untersuchung vor dem Kauf möglich?']:
          ['Da li je automobil dostupan za pregled kod prodavca?','Da li je prodavac pismeno naveo poznata oštećenja?','Da li dozvoljava nezavisan pregled pre kupovine?'],
     seller:['Ist das Fahrzeug noch verfügbar und wann ist eine Besichtigung möglich?','Welche Unfallschäden, Reparaturen oder Mängel sind Ihnen bekannt?','Ist eine unabhängige Fahrzeugprüfung vor Vertragsabschluss möglich?'],
     next:de?'Antworten schriftlich sichern und unklare Angaben nachfragen.':'Sačuvaj pisane odgovore i traži dodatna objašnjenja za nejasne navode.'},
    {id:'import',title:de?'Einfuhr und Kosten klären':'Uvoz i ukupni troškovi',
     qs:de?['Ist das Zielland der Einfuhr bereits festgelegt?','Sind Kaufpreis und Transportkosten schriftlich bekannt?','Sind Steuern, Zulassung und Dokumente für das Zielland geprüft?']:
          ['Znate li tačno u koju državu uvozite vozilo?','Imate li potvrđenu cenu vozila i trošak prevoza?','Da li ste proverili poreze, registraciju i dokumentaciju za tu državu?'],
     seller:['Sind der Endpreis und die enthaltene Mehrwertsteuer schriftlich bestätigt?','Welche Fahrzeug- und Exportdokumente können Sie übergeben?'],
     next:de?'Nur belegte Beträge addieren; unbekannte Abgaben separat für das Zielland prüfen.':'Saberi samo poznate iznose; nepoznate dažbine proveri prema državi uvoza.'}
  ];
  const options=root.querySelector('#problem-guide-options');
  const question=root.querySelector('#problem-guide-question');
  const result=root.querySelector('#problem-guide-result');
  if(!options||!question||!result)return;
  let selected=null,step=0,answers=[];
  const el=(tag,content,cls)=>{
    const node=document.createElement(tag);
    if(content!==undefined)node.textContent=content;
    if(cls)node.className=cls;
    return node;
  };
  const button=(label,handler,pressed=false)=>{
    const b=el('button',label);
    b.type='button';b.setAttribute('aria-pressed',String(pressed));b.addEventListener('click',handler);
    return b;
  };
  const showOptions=()=>{
    options.replaceChildren();
    for(const scenario of scenarios)options.append(button(scenario.title,()=>{
      selected=scenario;step=0;answers=[];showOptions();render();
    },selected?.id===scenario.id));
  };
  const render=()=>{
    question.replaceChildren();result.replaceChildren();
    if(!selected)return;
    if(step<3){
      question.append(el('h3',(step+1)+' / 3 — '+selected.qs[step]));
      const choices=el('div',undefined,'advisor-answer-buttons');
      for(const value of ['yes','no','unknown']){
        choices.append(button(i18n[value],()=>{
          answers[step]=value;step++;render();
        }));
      }
      question.append(choices);
      if(step>0)question.append(button(i18n.back,()=>{step--;render();}));
      return;
    }
    result.append(el('h3',i18n.title),el('p',i18n.source));
    const list=el('ul');
    selected.qs.forEach((q,i)=>list.append(el('li',q+' — '+(answers[i]==='yes'?i18n.summaryYes:answers[i]==='no'?i18n.summaryNo:i18n.summaryUnknown))));
    result.append(el('strong',i18n.answers),list,el('p',selected.next));
    result.append(el('strong',i18n.missing),el('p',de?'Diese Antworten und Anbieterangaben sind nicht unabhängig geprüft.':'Odgovori i navodi prodavca nisu nezavisno provereni.'));
    result.append(el('strong',i18n.seller));
    const ul=el('ul');
    selected.seller.forEach(q=>ul.append(el('li',q)));
    result.append(ul);
    const actions=el('div',undefined,'advisor-answer-buttons');
    const link=el('a',i18n.details);link.href='#listing';actions.append(link);
    const contact=el('a',i18n.contact);contact.href='#advisor-contact';actions.append(contact);
    result.append(actions);
    question.append(button(i18n.back,()=>{step=2;render();}));
  };
  showOptions();
})();
