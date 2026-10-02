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
  if(!form)return;
  const out=document.getElementById('buyer-result');
  const eur=n=>new Intl.NumberFormat(sr?'sr-RS':'de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
  const node=(tag,text,parent)=>{const el=document.createElement(tag);el.textContent=text;parent.appendChild(el);return el};
  const li=(text,parent,cls='')=>{const el=node('li',text,parent);if(cls)el.className=cls;return el};
  const sellerMessage=(label,checks)=>[
    'Guten Tag, ich interessiere mich konkret für '+label+'.',
    checks.vin?'':'Bitte senden Sie mir vor einer Anzahlung die vollständige VIN.',
    checks.registration?'':'Bitte senden Sie gut lesbare Fotos von Zulassungsbescheinigung Teil I und II.',
    checks.ownership?'':'Bitte bestätigen Sie schriftlich, wer Eigentümer des Fahrzeugs ist und welcher Eigentumsnachweis beim Kauf übergeben wird.',
    checks.identity?'':'Bitte senden Sie die vollständigen Verkäufer-/Firmendaten, damit ich Identität und Rechnungssteller abgleichen kann.',
    checks.bank?'':'Bitte bestätigen Sie, dass das Zahlungskonto auf den Verkäufer bzw. berechtigten Eigentümer lautet.',
    checks.origin?'':'Bitte bestätigen Sie, welcher Ursprungsnachweis für den Export nach Serbien verfügbar ist (z. B. EUR.1 bzw. zulässige Ursprungserklärung).',
    checks.service?'':'Bitte senden Sie Nachweise zur Servicehistorie und die letzten Rechnungen/Inspektionsbelege.',
    checks.accident?'':'Bitte bestätigen Sie schriftlich bekannte Unfallschäden, Nachlackierungen, Reparaturen und sonstige Mängel.',
    'Bitte nennen Sie außerdem, ob eine Anzahlung nötig ist, wie hoch sie ist und unter welchen Bedingungen sie zurückgezahlt wird.',
    'Vielen Dank.'
  ].filter(Boolean).join('\n');
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const fd=new FormData(form),budget=Number(fd.get('budget')),reserve=Number(fd.get('reserve'));
    if(!(budget>0)||!Number.isFinite(reserve)||reserve<0){out.replaceChildren();node('p',sr?'Unesi pozitivan budžet i rezervu od nula ili više evra.':'Positives Budget und eine nicht negative Reserve eingeben.',out);return}
    const button=form.querySelector('button[type="submit"]');button.disabled=true;out.replaceChildren();node('p',sr?'Buyer Shield proverava dokaze i trošak…':'Buyer Shield prüft Belege und Kosten…',out);
    try{
      const rows=[];
      for(let i=0;i<3;i++){
        const label=String(fd.get('label'+i)||'').trim(),price=Number(fd.get('price'+i)),link=String(fd.get('link'+i)||'').trim();
        if(!label&&!price&&!link)continue;
        if(!label||!(price>0))throw Error(sr?'Svaki dodatni oglas mora imati model i cenu veću od nule.':'Jedes weitere Inserat benötigt Modell und positiven Preis.');
        const checks={
          vin:fd.has('vin'+i),registration:fd.has('registration'+i),ownership:fd.has('ownership'+i),
          identity:fd.has('sellerIdentity'+i),bank:fd.has('bankOwnerMatch'+i),accident:fd.has('accidentDisclosure'+i),
          origin:fd.get('origin'+i)==='verified',service:fd.get('serviceHistory'+i)==='complete'
        };
        const deposit=Number(fd.get('deposit'+i)||0);
        const sellerType=String(fd.get('sellerType'+i)||'unknown');
        const serviceHistory=String(fd.get('serviceHistory'+i)||'unknown');
        const body={
          sourceCountry:'DE',currency:'EUR',fxToEur:1,purchasePrice:price,
          transportToSerbia:Number(fd.get('transport'+i)||0),exportCosts:Number(fd.get('export'+i)||0),
          otherCosts:Number(fd.get('local'+i)||0)+reserve,year:Number(fd.get('year'+i)||0),
          euroClass:Number(fd.get('euro'+i)||0),originProof:fd.get('origin'+i),
          vinProvided:checks.vin,registrationDoc:checks.registration,ownershipDoc:checks.ownership,
          prepaymentRequested:deposit>0,thirdPartyAccount:deposit>0&&!checks.bank,sellerMismatch:!checks.identity
        };
        const response=await fetch('/api/importos/evaluate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
        const data=await response.json();
        if(!response.ok||!data.result)throw Error(sr?'Kalkulator trenutno nije dostupan.':'Der Rechner ist derzeit nicht verfügbar.');
        const blockers=[],warnings=[],proof=[];
        if(!checks.vin)blockers.push(sr?'Nema VIN-a.':'VIN fehlt.');
        if(!checks.registration)blockers.push(sr?'Nisu dostavljeni registracioni dokumenti.':'Zulassungsunterlagen fehlen.');
        if(!checks.ownership)blockers.push(sr?'Vlasništvo nije dokazano.':'Eigentum nicht belegt.');
        if(!checks.identity)blockers.push(sr?'Identitet prodavca nije potvrđen.':'Verkäuferidentität nicht bestätigt.');
        if(deposit>0&&!checks.bank)blockers.push(sr?'Traži se kapara, ali račun za uplatu nije potvrđeno povezan sa prodavcem/vlasnikom.':'Anzahlung gefordert, aber Zahlungskonto nicht nachweislich mit Verkäufer/Eigentümer verbunden.');
        if(data.result.importability.status==='STOP')blockers.push(sr?'Mogućnost uvoza zahteva razjašnjenje pre bilo kakve uplate.':'Importfähigkeit muss vor jeder Zahlung geklärt werden.');
        if(!checks.origin)warnings.push(sr?'Poreklo nije potvrđeno: ne računaj automatski povoljniju carinu.':'Ursprung nicht bestätigt: günstigeren Zoll nicht automatisch annehmen.');
        if(serviceHistory==='unknown')warnings.push(sr?'Servisna istorija je nepoznata.':'Servicehistorie unbekannt.');
        if(serviceHistory==='partial')warnings.push(sr?'Servisna istorija je samo delimična.':'Servicehistorie nur teilweise belegt.');
        if(!checks.accident)warnings.push(sr?'Nema pisane izjave o poznatim oštećenjima/nezgodama.':'Keine schriftliche Erklärung zu bekannten Schäden/Unfällen.');
        for(const [key,labelText] of [['transport',sr?'dovoz':'Transport'],['export',sr?'izvoz/tablice':'Export/Kennzeichen'],['local',sr?'troškovi u Srbiji':'Kosten in Serbien']]){
          if(!Number(fd.get(key+i)))warnings.push((sr?'Nije procenjeno: ':'Nicht kalkuliert: ')+labelText+'.');
        }
        const c=data.result.corridor;
        if(c.best>budget)blockers.push(sr?'Prelazi budžet čak i u povoljnijem scenariju.':'Über Budget selbst im günstigeren Szenario.');
        else if(c.worst>budget)warnings.push(sr?'Budžet zavisi od povoljnijeg scenarija; zatvori otvorene troškove pre odluke.':'Budget passt nur im günstigeren Szenario; offene Kosten zuerst klären.');
        Object.entries(checks).filter(([,v])=>v).forEach(([k])=>proof.push(k));
        const readiness=Math.max(0,100-blockers.length*22-warnings.length*7);
        let gate=blockers.length?'RED':warnings.length>2?'AMBER':'GREEN';
        if(deposit>0&&blockers.length)gate='RED';
        rows.push({label,link,result:data.result,blockers,warnings,readiness,gate,deposit,sellerType,checks,message:sellerMessage(label,checks)});
      }
      if(!rows.length)throw Error(sr?'Unesi bar jedan oglas.':'Mindestens ein Inserat eingeben.');
      out.replaceChildren();node('h2',sr?'Buyer Shield rezultat':'Buyer Shield Ergebnis',out);
      const summary=[(sr?'Budžet: ':'Budget: ')+eur(budget),(sr?'Rezerva: ':'Reserve: ')+eur(reserve)];
      for(const row of rows){
        const card=node('article','',out);card.className='card';card.style.marginTop='16px';
        const gateText=row.gate==='RED'?(sr?'CRVENO · NE ŠALJI KAPARU':'ROT · KEINE ANZAHLUNG'):row.gate==='AMBER'?(sr?'ŽUTO · TRAŽI DOKAZE':'GELB · BELEGE ANFORDERN'):(sr?'ZELENO ZA SLEDEĆI KORAK · NE GARANCIJA KUPOVINE':'GRÜN FÜR DEN NÄCHSTEN SCHRITT · KEINE KAUFGARANTIE');
        const badge=node('p',gateText,card);badge.className='result';
        node('h3',row.label,card);
        const c=row.result.corridor;
        node('p',(sr?'Landed-cost raspon sa rezervom: ':'Landed-Cost-Korridor mit Reserve: ')+eur(c.best)+' – '+eur(c.worst),card);
        node('p',(sr?'Evidence readiness: ':'Evidence readiness: ')+row.readiness+'/100',card);
        if(row.deposit>0)node('p',(sr?'Tražena kapara: ':'Geforderte Anzahlung: ')+eur(row.deposit),card);
        if(row.blockers.length){node('h4',sr?'STOP razlozi':'STOP-Gründe',card);const ul=node('ul','',card);row.blockers.forEach(x=>li(x,ul));}
        if(row.warnings.length){node('h4',sr?'Otvoreni rizici':'Offene Risiken',card);const ul=node('ul','',card);row.warnings.forEach(x=>li(x,ul));}
        node('h4',sr?'Poruka prodavcu na nemačkom':'Nachricht an den Verkäufer',card);
        const pre=node('pre',row.message,card);pre.style.whiteSpace='pre-wrap';pre.style.fontFamily='inherit';
        const copyMsg=node('button',sr?'Kopiraj poruku prodavcu':'Verkäufernachricht kopieren',card);copyMsg.className='btn secondary';copyMsg.type='button';copyMsg.onclick=async()=>{try{await navigator.clipboard.writeText(row.message);copyMsg.textContent=sr?'Kopirano':'Kopiert'}catch{}};
        summary.push('\n'+row.label,gateText,eur(c.best)+' – '+eur(c.worst),'Readiness '+row.readiness+'/100',...row.blockers,...row.warnings,'\n'+row.message);
      }
      const text=summary.join('\n');
      const copy=node('button',sr?'Kopiraj ceo Buyer Shield':'Buyer Shield kopieren',out);copy.className='btn secondary';copy.type='button';copy.onclick=async()=>{try{await navigator.clipboard.writeText(text);copy.textContent=sr?'Kopirano':'Kopiert'}catch{}};
      const ask=node('button',sr?'Pošalji crvene/žute stavke na dublju proveru':'Offene Punkte tiefer prüfen lassen',out);ask.className='btn';ask.type='button';ask.style.margin='12px';ask.onclick=()=>{try{sessionStorage.setItem(draftKey,text)}catch{}location.assign(sr?'/sr/upit?service=AD_REVIEW':'/de/anfrage?service=AD_REVIEW')};
      window.daniniTrack&&window.daniniTrack('calculator_completed','buyer_shield');
    }catch(error){out.replaceChildren();node('p',error.message,out)}finally{button.disabled=false}
  });
})();