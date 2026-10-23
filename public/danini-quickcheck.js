'use strict';
(() => {
  const form=document.getElementById('quickcheck');
  if(!form)return;
  const de=document.documentElement.lang==='de';
  const t=(sr,german)=>de?german:sr;
  const euros=n=>new Intl.NumberFormat(de?'de-DE':'sr-RS',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(n);
  const extra=document.createElement('div');
  extra.innerHTML='<label>'+t('Način dovoza','Transportart')+'<select name="deliveryMode"><option value="truck">'+t('Kamion / transporter','Lkw / Transporter')+'</option><option value="plates">'+t('Izvozne tablice / vožnja','Ausfuhrkennzeichen / Selbstfahrt')+'</option></select></label><label>'+t('Marka i model','Marke und Modell')+'<input name="vehicleModel" maxlength="120" placeholder="VW Golf 2018"></label>'+
    '<label>'+t('Link oglasa (opciono)','Inserat-Link (optional)')+'<input type="url" name="adLink" maxlength="2000" placeholder="https://www.mobile.de/..."></label>'+
    '<label>'+t('Trošak ispitivanja/uverenja (€) — okvirno, proveriti cenu','Prüfung/Bescheinigung (€) — Schätzung, Preis prüfen')+'<input name="certificateCost" type="number" min="0" max="10000" step="any" value="280"></label>';
  form.insertBefore(extra,form.querySelector('button[type="submit"]'));
  const mode=extra.querySelector('[name="deliveryMode"]');
  const transport=form.elements.namedItem('transportToSerbia');
  const exportInput=form.elements.namedItem('exportCosts');
  if(exportInput)exportInput.value='0';
  mode.addEventListener('change',()=>{
    if(mode.value==='truck'){if(transport)transport.value='700';if(exportInput)exportInput.value='0';}
    else{if(transport)transport.value='0';if(exportInput)exportInput.value='180';}
  });
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
    if(window.daniniQuickcheckAbort)window.daniniQuickcheckAbort.abort();
    window.daniniQuickcheckAbort=new AbortController();
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
    const adInput = form.elements.namedItem('adLink');
    const whatsapp = link(
      t('Pošalji oglas Draganu na WhatsApp (+49 1573 0916621)',
        'Inserat per WhatsApp an Dragan senden (+49 1573 0916621)'),
      '#'
    );
    result.appendChild(whatsapp);

    const payment = document.createElement('div');
    payment.hidden = true;
    const note = document.createElement('p');
    note.textContent = t(
      'Uplata za proveru (9,90 €) se vrši nakon slanja oglasa putem PayPal-a:',
      'Die Zahlung für die Prüfung (9,90 €) erfolgt nach dem Versand des Inserats über PayPal:'
    );
    const paypal = link('PayPal — 9,90 €', 'https://www.paypal.me/dragangaganet/9.90EUR', true);
    paypal.style.display = 'inline-block';
    const reminder = document.createElement('p');
    reminder.className = 'muted';
    reminder.textContent = t(
      'PayPal.Me ne povezuje uplatu automatski sa oglasom. Navedi link oglasa u napomeni, ako je dostupna, ili pošalji potvrdu u istom WhatsApp razgovoru.',
      'PayPal.Me ordnet die Zahlung nicht automatisch dem Inserat zu. Inserat-Link falls möglich als Notiz eintragen oder Zahlungsbeleg im selben WhatsApp-Chat senden.'
    );
    payment.append(note, paypal, reminder);
    result.appendChild(payment);

    const isValidLink = value => {
      try {
        const url = new URL(value);
        return ['https:', 'http:'].includes(url.protocol);
      } catch {
        return false;
      }
    };
    const updateLink = () => {
      const adLink = adInput.value.trim();
      const msg = 'Pozdrav Dragane, našao sam ovaj auto: ' + adLink +
        '. Želim Import Passport proveru (9,90 €).';
      whatsapp.href = isValidLink(adLink)
        ? 'https://wa.me/4915730916621?text=' + encodeURIComponent(msg)
        : '#';
    };
    updateLink();
    const resetPayment = () => { payment.hidden = true; updateLink(); };
    // Old results are replaced on recalculation, so listeners only matter for the current result.
    adInput.addEventListener('input', resetPayment, {signal: window.daniniQuickcheckAbort.signal});
    whatsapp.addEventListener('click', event => {
      const adLink = adInput.value.trim();
      if (!isValidLink(adLink)) {
        event.preventDefault();
        adInput.setCustomValidity(t(
          'Unesi link oglasa pre slanja na WhatsApp.',
          'Bitte Inserat-Link vor dem WhatsApp-Versand eingeben.'
        ));
        adInput.reportValidity();
        adInput.focus();
        return;
      }
      adInput.setCustomValidity('');
      updateLink();
      // WhatsApp itself does not confirm that the message was sent.
      payment.hidden = false;
    });

    if(typeof window.daniniTrack==='function')window.daniniTrack('calculator_completed',String(Math.round(total)));
  });
})();