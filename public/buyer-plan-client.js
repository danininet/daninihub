'use strict';
(function(){
  const sr=document.documentElement.lang==='sr';
  const form=document.getElementById('buyer-plan');
  const intake=document.getElementById('service-form');
  const draftKey='danini-buyer-plan-draft';
  if(intake&&new URLSearchParams(location.search).get('service')==='AD_REVIEW'){
    intake.elements.serviceType.value='AD_REVIEW';
    try{const draft=sessionStorage.getItem(draftKey);if(draft){intake.elements.message.value=draft;sessionStorage.removeItem(draftKey)}}catch{}
  }
  if(intake){try{const raw=sessionStorage.getItem('danini-case-brief');if(raw){const brief=JSON.parse(raw);for(const key of ['budget','criteria','purpose'])if(intake.elements[key])intake.elements[key].value=brief[key]||'';sessionStorage.removeItem('danini-case-brief')}}catch{}}
  if(!form)return;
  const out=document.getElementById('buyer-result');
  const eur=n=>new Intl.NumberFormat(sr?'sr-RS':'de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
  const node=(tag,text,parent)=>{const el=document.createElement(tag);el.textContent=text;parent.appendChild(el);return el};
  form.addEventListener('submit',async event=>{
    event.preventDefault();const fd=new FormData(form),budget=Number(fd.get('budget')),reserve=Number(fd.get('reserve'));
    if(!(budget>0)||!Number.isFinite(reserve)||reserve<0){out.replaceChildren();node('p',sr?'Unesi pozitivan budžet i rezervu od nula ili više evra.':'Positives Budget und eine nicht negative Reserve eingeben.',out);return}
    const button=form.querySelector('button[type="submit"]');button.disabled=true;out.replaceChildren();node('p',sr?'Pripremam poređenje…':'Vergleich wird vorbereitet…',out);
    try{
      const rows=[];
      for(let i=0;i<3;i++){
        const label=String(fd.get('label'+i)||'').trim(),price=Number(fd.get('price'+i));
        if(!label&&!price&&!fd.get('link'+i))continue;
        if(!label||!(price>0))throw Error(sr?'Svaki dodatni oglas mora imati model i cenu veću od nule.':'Jedes weitere Inserat benötigt Modell und positiven Preis.');
        const body={sourceCountry:'DE',currency:'EUR',fxToEur:1,purchasePrice:price,transportToSerbia:Number(fd.get('transport'+i)||0),exportCosts:Number(fd.get('export'+i)||0),otherCosts:Number(fd.get('local'+i)||0)+reserve,year:Number(fd.get('year'+i)||0),euroClass:Number(fd.get('euro'+i)||0),originProof:fd.get('origin'+i),vinProvided:fd.has('vin'+i),registrationDoc:fd.has('registration'+i),ownershipDoc:fd.has('ownership'+i)};
        const response=await fetch('/api/importos/evaluate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)}),data=await response.json();
        if(!response.ok||!data.result)throw Error(sr?'Kalkulator trenutno nije dostupan. Podaci u formularu su sačuvani.':'Der Rechner ist derzeit nicht verfügbar. Formulareingaben bleiben erhalten.');
        const questions=[];
        if(!body.vinProvided)questions.push(sr?'Pošaljite VIN vozila.':'Bitte senden Sie die VIN.');
        if(!body.registrationDoc)questions.push(sr?'Možete li dostaviti fotografije saobraćajne dozvole?':'Können Sie Fotos der Zulassungsunterlagen senden?');
        if(!body.ownershipDoc)questions.push(sr?'Ko je vlasnik i koji dokaz vlasništva dobijam?':'Wer ist Eigentümer und welchen Eigentumsnachweis erhalte ich?');
        if(body.originProof!=='verified')questions.push(sr?'Koji dokaz o poreklu dobijam i može li biti potvrđen pre uplate?':'Welcher Ursprungsnachweis ist vor Zahlung verfügbar?');
        if(!body.euroClass)questions.push(sr?'Kojim dokumentom je potvrđena Euro norma?':'Welches Dokument bestätigt die Euro-Norm?');
        for(const [key,label] of [['transport',sr?'dovoz':'Transport'],['export',sr?'izvoz':'Export'],['local',sr?'lokalni troškovi i registracija':'Abwicklung und Zulassung']])if(!Number(fd.get(key+i)))questions.push((sr?'Nije procenjeno: ':'Nicht kalkuliert: ')+label+'.');
        questions.push(sr?'Koje poznate kvarove, oštećenja i servisne radove možete potvrditi pisanim putem?':'Welche bekannten Mängel, Schäden und Servicearbeiten können Sie schriftlich bestätigen?');
        rows.push({label,link:String(fd.get('link'+i)||''),result:data.result,questions});
      }
      if(!rows.length)throw Error(sr?'Unesi bar jedan oglas.':'Mindestens ein Inserat eingeben.');
      out.replaceChildren();node('h2',sr?'Tvoj plan pre puta':'Dein Plan vor der Anreise',out);
      const summary=[(sr?'Budžet: ':'Budget: ')+eur(budget),(sr?'Rezerva po vozilu: ':'Reserve pro Fahrzeug: ')+eur(reserve)];
      for(const row of rows){const card=node('article','',out);card.className='card';card.style.marginTop='16px';node('h3',row.label,card);const c=row.result.corridor;node('p',(sr?'Procena sa rezervom: ':'Schätzung mit Reserve: ')+eur(c.best)+' – '+eur(c.worst),card);
        const missingCosts=row.questions.some(q=>q.startsWith(sr?'Nije procenjeno:':'Nicht kalkuliert:'));
        const status=row.result.importability.status==='STOP'?(sr?'Zastani: uneta Euro norma zahteva razjašnjenje mogućnosti uvoza.':'Stopp: Importfähigkeit mit dieser Euro-Norm klären.'):c.best>budget?(sr?'Prelazi budžet i u jeftinijem scenariju.':'Über Budget, auch im günstigeren Szenario.'):c.worst>budget?(sr?'U budžetu samo uz povoljniji scenario; poreklo i troškove prvo potvrdi.':'Nur im günstigeren Szenario im Budget; Ursprung und Kosten zuerst bestätigen.'):(sr?'Uneta računica staje u budžet. Stanje vozila još nije provereno.':'Die eingegebene Rechnung passt ins Budget. Fahrzeugzustand noch ungeprüft.');
        node('p',status,card);if(missingCosts)node('p',sr?'Računica je nepotpuna: dodaj neprocenjene stavke pre odluke.':'Die Rechnung ist unvollständig: fehlende Kosten vor Entscheidung ergänzen.',card);node('h4',sr?'Šta prvo razjasniti':'Zuerst klären',card);const list=node('ul','',card);row.questions.forEach(q=>node('li',q,list));summary.push('\n'+row.label,row.link,eur(c.best)+' – '+eur(c.worst),status,...row.questions);
      }
      const text=summary.join('\n');const copy=node('button',sr?'Kopiraj plan i pitanja':'Plan und Fragen kopieren',out);copy.className='btn secondary';copy.type='button';copy.onclick=async()=>{try{await navigator.clipboard.writeText(text);copy.textContent=sr?'Plan je kopiran':'Plan kopiert'}catch{node('p',text,out)}};
      const ask=node('button',sr?'Pošalji ovaj izbor na ručnu proveru':'Diesen Vergleich zur Prüfung anfragen',out);ask.className='btn';ask.type='button';ask.style.margin='12px';ask.onclick=()=>{try{sessionStorage.setItem(draftKey,text)}catch{}location.assign(sr?'/sr/upit?service=AD_REVIEW':'/de/anfrage?service=AD_REVIEW')};
    }catch(error){out.replaceChildren();node('p',error.message,out)}finally{button.disabled=false}
  });
})();
