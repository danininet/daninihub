'use strict';
(() => {
  const form=document.getElementById('quickcheck');
  if(!form)return;
  const de=document.documentElement.lang==='de';
  const t=(sr,german)=>de?german:sr;
  const euros=n=>new Intl.NumberFormat(de?'de-DE':'sr-RS',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(n);
  const extra=document.createElement('div');
  extra.innerHTML='<label>'+t('Marka i model','Marke und Modell')+'<input name="vehicleModel" maxlength="120" placeholder="VW Golf 2018"></label>'+
    '<label>'+t('Link oglasa (opciono)','Inserat-Link (optional)')+'<input type="url" name="adLink" maxlength="2000" placeholder="https://www.mobile.de/..."></label>'+
    '<label>'+t('Trošak ispitivanja/uverenja (€) — okvirno, proveriti cenu','Prüfung/Bescheinigung (€) — Schätzung, Preis prüfen')+'<input name="certificateCost" type="number" min="0" max="10000" step="any" value="280"></label>';
  form.insertBefore(extra,form.querySelector('button[type="submit"]'));
  const origin=form.elements.namedItem('originProof');
  if(origin) {
    const verified=origin.querySelector('[value="verified"]');
    if(verified)verified.textContent=t('Dokaz prihvatljiv carini (pretpostavka)','Nachweis von Zoll anerkannt (Annahme)');
  }
  const result=document.getElementById('quick-result');
  const link=(text,href,secondary=false)=>{
    const a=document.createElement('a');a.className='btn'+(secondary?' secondary':'');a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=text;a.style.cssText='display:block;margin:10px 0;padding:16px;text-align:center;min-height:50px';return a;
  };
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const values=Object.fromEntries(new FormData(form));
    const number=key=>Number(values[key]||0);
    const price=number('purchasePrice'),transport=number('transportToSerbia'),exportCost=number('exportCosts'),certificate=number('certificateCost');
    const fields=[price,transport,exportCost,certificate];
    if(fields.some(v=>!Number.isFinite(v)||v<0)||!price){result.textContent=t('Unesi ispravne pozitivne iznose.','Bitte gültige Beträge angeben.');return;}
    if(values.adLink){try{const u=new URL(values.adLink);if(!['http:','https:'].includes(u.protocol))throw Error();}catch{result.textContent=t('Link oglasa nije ispravan.','Inserat-Link ist ungültig.');return;}}
    // This is a transparent simplified landed-cost estimate, not a customs decision.
    // Transport is assumed not to be already included in the purchase/customs value.
    const customsBase=price+transport;
    const accepted=values.originProof==='verified';
    const duty=customsBase*(accepted?0:0.125);
    const vat=(customsBase+duty)*0.20;
    const total=customsBase+duty+vat+exportCost+certificate;
    result.replaceChildren();
    const heading=document.createElement('h2');
    heading.textContent=t('Procena ukupnog troška: ','Geschätzte Gesamtkosten: ')+euros(total);
    result.appendChild(heading);
    const lines=[
      [t('Cena vozila','Fahrzeugpreis'),price],
      [t('Prevoz (pretpostavka: nije uključen u cenu)','Transport (angenommen nicht im Preis enthalten)'),transport],
      [t('Carinska osnovica (pretpostavka)','Angenommener Zollwert'),customsBase],
      [t('Carina','Zoll'),duty],
      ['PDV / MwSt. (20%)',vat],
      [t('Izvoz i tablice','Export und Kennzeichen'),exportCost],
      [t('Ispitivanje/uverenje (procena)','Prüfung/Bescheinigung (Schätzung)'),certificate]
    ];
    const list=document.createElement('ul');
    for(const [label,value] of lines){const li=document.createElement('li');li.textContent=label+': '+euros(value);list.appendChild(li);}
    result.appendChild(list);
    const warning=document.createElement('p');warning.className='muted';
    warning.textContent=t(
      'Okvirna računica: carina 0% samo ako nadležna carina prihvati valjan dokaz o preferencijalnom poreklu. U suprotnom je ovde korišćeno 12,5%. Transport mora biti uračunat samo jednom. Nisu uključeni špedicija, registracija, eko takse niti moguća korekcija carinske vrednosti. Iznos uverenja i izvozne tablice su ručno podesive procene.',
      'Unverbindliche Schätzung: 0% Zoll nur bei anerkanntem Präferenzursprungsnachweis; sonst hier 12,5%. Transport nur einmal rechnen. Spedition, Zulassung, Umweltabgaben und abweichender Zollwert sind nicht enthalten. Prüf- und Exportkosten sind anpassbare Schätzungen.'
    );result.appendChild(warning);
    const msg=[
      'DANINI QUICKCHECK', 'Model: '+(values.vehicleModel||'Nije naveden'),
      'Cena: '+euros(price),'Ukupna procena: '+euros(total),
      'Carina: '+euros(duty),'PDV: '+euros(vat),
      'Dokaz o poreklu (pretpostavka): '+(accepted?'prihvaćen':'nepotvrđen / bez dokaza'),
      'Oglas: '+(values.adLink||'Nije unet'),
      'Molim proveru i ponudu.'
    ].join('\n');
    result.appendChild(link(t('Pošalji ovaj proračun Draganu na WhatsApp','Diese Berechnung per WhatsApp senden'),'https://wa.me/4915730916621?text='+encodeURIComponent(msg)));
    result.appendChild(link(t('Naruči proveru ovog auta (9,90 €) preko PayPal-a','Prüfung dieses Autos (9,90 €) via PayPal bestellen'),'https://www.paypal.me/dragangaganet/9.90EUR',true));
    if(typeof window.daniniTrack==='function')window.daniniTrack('calculator_completed',String(Math.round(total)));
  });
})();