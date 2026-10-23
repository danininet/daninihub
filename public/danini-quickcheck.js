'use strict';

// Reused by browser and npm tests; figures are illustrative EUR-only estimates.
// Transport is assumed not to be included in the purchase/customs value.
function daniniEstimate(price, transport, exportCost, certificate, dutyRate) {
  const numbers = [price, transport, exportCost, certificate, dutyRate];
  if (numbers.some(value => !Number.isFinite(value) || value < 0)) {
    throw new Error('All amounts and the duty rate must be non-negative finite numbers');
  }
  const customsBase = price + transport;
  const duty = customsBase * dutyRate;
  const vat = (customsBase + duty) * 0.20;
  return { customsBase, duty, vat, total: customsBase + duty + vat + exportCost + certificate };
}

if (typeof module !== 'undefined' && module.exports) module.exports = { daniniEstimate };

// DANINI QuickCheck: transparent EUR-only estimates.
// This is NOT a customs assessment. Shipment costs are counted only once.
(() => {
  if (typeof document === 'undefined') return;
  const form = document.getElementById('quickcheck');
  const result = document.getElementById('quick-result');
  if (!form || !result) return;

  const de = document.documentElement.lang === 'de';
  const t = (sr, german) => de ? german : sr;
  const eur = value => new Intl.NumberFormat(de ? 'de-DE' : 'sr-RS', {
    style: 'currency', currency: 'EUR', minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);

  const extra = document.createElement('div');
  extra.className = 'danini-calc-extra';
  extra.innerHTML = [
    '<label>' + t('Način dovoza', 'Transportart') + '<select name="deliveryMode">',
    '<option value="truck">' + t('Kamion / transporter', 'Lkw / Autotransporter') + '</option>',
    '<option value="plates">' + t('Izvozne tablice / vožnja', 'Ausfuhrkennzeichen / Selbstfahrt') + '</option>',
    '</select></label>',
    '<label>' + t('Marka i model', 'Marke und Modell') +
      '<input name="vehicleModel" maxlength="120" placeholder="VW Golf 2018"></label>',
    '<label>' + t('Zalepi link oglasa (za WhatsApp proveru)', 'Inserat-Link für WhatsApp-Prüfung') +
      '<input type="url" name="adLink" maxlength="2000" placeholder="https://www.mobile.de/..."></label>',
    '<label>' + t('AMSS ispitivanje/uverenje (€) — okvirno, proveriti važeću cenu',
      'Prüfung/Bescheinigung (€) — Schätzung, aktuelle Gebühr prüfen') +
      '<input name="certificateCost" type="number" min="0" max="10000" step="any" value="280"></label>'
  ].join('');
  form.insertBefore(extra, form.querySelector('button[type="submit"]'));

  const transportInput = form.elements.namedItem('transportToSerbia');
  const exportInput = form.elements.namedItem('exportCosts');
  const mode = form.elements.namedItem('deliveryMode');
  // Initial estimate: truck transport OR export plates, not both.
  if (transportInput) transportInput.value = '700';
  if (exportInput) exportInput.value = '0';
  mode.addEventListener('change', () => {
    if (mode.value === 'truck') {
      if (transportInput) transportInput.value = '700';
      if (exportInput) exportInput.value = '0';
    } else {
      if (transportInput) transportInput.value = '0';
      if (exportInput) exportInput.value = '180';
    }
  });

  const origin = form.elements.namedItem('originProof');
  if (origin) {
    const verified = origin.querySelector('[value="verified"]');
    if (verified) verified.textContent = t(
      'Pretpostavka: priznat EUR.1 / izjava o poreklu',
      'Annahme: anerkannter EUR.1 / Ursprungserklärung'
    );
  }

  const style = document.createElement('style');
  style.textContent = [
    '.danini-calc-extra{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;grid-column:1/-1}',
    '.danini-calc-extra label{display:block}',
    '#quick-result{margin-top:28px}',
    '.danini-calc-box{background:#101f1a;border:1px solid #426650;border-radius:18px;padding:clamp(18px,3vw,28px)}',
    '.danini-calc-box h2{font-size:clamp(30px,4vw,46px);line-height:1.12;margin:0 0 14px}',
    '.danini-calc-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:16px 0}',
    '.danini-calc-card{background:#192b27;border:1px solid #3b5750;border-radius:12px;padding:18px}',
    '.danini-calc-card strong{display:block;font-size:clamp(23px,3vw,34px);line-height:1.3;margin:8px 0;color:#fff}',
    '.danini-calc-diff{font-size:clamp(19px,3vw,27px);font-weight:850;color:#89f0ac;margin:15px 0}',
    '.danini-calc-details{list-style:none;padding:0;margin:12px 0 22px}',
    '.danini-calc-details li{padding:8px 0;border-bottom:1px solid #385046}',
    '.danini-calc-whatsapp,.danini-calc-pay{display:flex;align-items:center;justify-content:center;text-align:center;font-weight:800;border-radius:9px;min-height:56px;text-decoration:none;padding:15px 12px;line-height:1.4}',
    '.danini-calc-whatsapp{background:#25d366;color:#082b19!important}',
    '.danini-calc-pay{background:#cee6ff;color:#003087!important;max-width:420px;margin-top:8px}',
    '.danini-calc-payment[hidden]{display:none!important}',
    '.danini-calc-warning{color:#c5d4cc;line-height:1.65;font-size:14px}',
    '@media(max-width:650px){.danini-calc-extra,.danini-calc-cards{grid-template-columns:1fr}}'
  ].join('');
  document.head.appendChild(style);

  const validLink = value => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };
  const estimate = daniniEstimate;
  function addText(parent, type, value, className) {
    const element = document.createElement(type);
    if (className) element.className = className;
    element.textContent = value;
    parent.appendChild(element);
    return element;
  }
  function addRow(parent, name, value) {
    addText(parent, 'li', name + ': ' + eur(value));
  }

  let activeListeners = null;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    if (activeListeners) activeListeners.abort();
    activeListeners = new AbortController();
    const values = Object.fromEntries(new FormData(form).entries());
    const price = Number(values.purchasePrice);
    const transport = Number(values.transportToSerbia || 0);
    const exportCost = Number(values.exportCosts || 0);
    const certificate = Number(values.certificateCost || 0);
    const amounts = [price, transport, exportCost, certificate];
    if (!price || amounts.some(x => !Number.isFinite(x) || x < 0)) {
      result.textContent = t('Unesite validne iznose u evrima.', 'Bitte gültige Euro-Beträge eingeben.');
      return;
    }
    if (values.adLink && !validLink(values.adLink)) {
      result.textContent = t('Link oglasa nije ispravan.', 'Ungültiger Inserat-Link.');
      return;
    }

    const zero = estimate(price, transport, exportCost, certificate, 0);
    const standard = estimate(price, transport, exportCost, certificate, 0.125);
    const hasAcceptedProof = values.originProof === 'verified';
    const selected = hasAcceptedProof ? zero : standard;
    const difference = standard.total - zero.total;

    result.replaceChildren();
    const card = document.createElement('section');
    card.className = 'danini-calc-box';
    result.appendChild(card);
    addText(card, 'p', 'QUICKCHECK · ' + t('Besplatna procena, samo €',
      'Kostenlose Schätzung, nur €'), 'eyebrow');
    addText(card, 'h2', t('Okvirni ukupni trošak: ', 'Geschätzte Gesamtkosten: ') +
      eur(selected.total));

    const cards = document.createElement('div');
    cards.className = 'danini-calc-cards';
    card.appendChild(cards);
    for (const item of [
      [t('Carina 0% — samo uz prihvaćen dokaz', '0% Zoll — nur mit anerkanntem Nachweis'), zero],
      [t('Carina 12,5% — bez dokaza', '12,5% Zoll — ohne Nachweis'), standard]
    ]) {
      const cell = document.createElement('div');
      cell.className = 'danini-calc-card';
      addText(cell, 'span', item[0]);
      addText(cell, 'strong', eur(item[1].total));
      addText(cell, 'span', t('Carina: ', 'Zoll: ') + eur(item[1].duty) +
        ' · ' + t('PDV: ', 'MwSt.: ') + eur(item[1].vat));
      cards.appendChild(cell);
    }
    addText(card, 'p',
      t('Moguća dodatna ukupna obaveza bez prihvaćenog porekla: ',
        'Mögliche Mehrkosten ohne anerkannten Ursprung: ') + eur(difference),
      'danini-calc-diff');
    const list = document.createElement('ul');
    list.className = 'danini-calc-details';
    card.appendChild(list);
    addRow(list, t('Cena vozila', 'Fahrzeugpreis'), price);
    addRow(list, t('Trošak transporta, nije uračunat u cenu', 'Fracht, nicht im Preis enthalten'), transport);
    addRow(list, t('Pretpostavljena carinska osnovica', 'Angenommener Zollwert'), selected.customsBase);
    addRow(list, t('Carina u izabranom scenariju', 'Zoll im gewählten Szenario'), selected.duty);
    addRow(list, t('PDV 20%', 'MwSt. 20%'), selected.vat);
    addRow(list, t('Izvozne tablice / ostali izvozni troškovi', 'Ausfuhrkennzeichen / Export'), exportCost);
    addRow(list, t('AMSS ispitivanje/uverenje (procena)', 'Prüfung/Bescheinigung (Schätzung)'), certificate);

    addText(card, 'p', t(
      'VAŽNO: Carina od 0% važi samo kada Uprava carina prihvati valjan dokaz o preferencijalnom poreklu. Zemlja kupovine i nemačke tablice nisu dokaz. Ako je dokaz nepoznat, za budžet računajte konzervativni scenario od 12,5%. Carinska vrednost se može razlikovati od cene oglasa. Prevoz uključite samo jednom. Nisu uračunati špedicija, registracija i drugi mogući troškovi. AMSS i izvozni troškovi su promenljive procene.',
      'WICHTIG: 0% Zoll nur mit von den serbischen Behörden anerkanntem Präferenzursprungsnachweis. Kaufland und Kennzeichen sind kein Nachweis. Bei unbekanntem Ursprung sollte mit 12,5% gerechnet werden. Tatsächlicher Zollwert kann abweichen. Fracht nur einmal erfassen; Spedition, Zulassung und weitere Gebühren sind nicht enthalten. Prüf- und Exportkosten sind Schätzwerte.'
    ), 'danini-calc-warning');

    const input = form.elements.namedItem('adLink');
    const whatsapp = document.createElement('a');
    whatsapp.className = 'danini-calc-whatsapp';
    whatsapp.target = '_blank';
    whatsapp.rel = 'noopener noreferrer';
    whatsapp.textContent = t(
      'Pošalji ovu računicu i oglas Draganu na WhatsApp za proveru (9,90 €)',
      'Berechnung und Inserat für Prüfung (9,90 €) per WhatsApp senden'
    );
    card.appendChild(whatsapp);
    const payment = document.createElement('div');
    payment.className = 'danini-calc-payment';
    payment.hidden = true;
    addText(payment, 'p', t(
      'Nakon slanja oglasa na WhatsApp, uplatu za Import Passport (9,90 €) izvršite ovde:',
      'Nach dem Versand des Inserats per WhatsApp können Sie Import Passport (9,90 €) hier bezahlen:'
    ));
    const payLink = document.createElement('a');
    payLink.className = 'danini-calc-pay';
    payLink.href = 'https://www.paypal.me/dragangaganet/9.90EUR';
    payLink.target = '_blank';
    payLink.rel = 'noopener noreferrer';
    payLink.textContent = t('2. Plati 9,90 € preko PayPal-a', '2. 9,90 € über PayPal bezahlen');
    payment.appendChild(payLink);
    addText(payment, 'p', t(
      'Pošaljite potvrdu PayPal uplate u istom WhatsApp razgovoru. Plaćanje nije automatski povezano s oglasom.',
      'Bitte den PayPal-Beleg im selben WhatsApp-Chat senden. Zahlung wird nicht automatisch einem Inserat zugeordnet.'
    ), 'danini-calc-warning');
    card.appendChild(payment);

    function buildLink() {
      const ad = input.value.trim();
      const msg = (de
        ? 'Hallo Dragan, ich habe dieses Fahrzeug gefunden: '
        : 'Pozdrav Dragane, našao sam ovaj auto: ') + ad + '. ' +
        (de ? 'Ich möchte die Import Passport Prüfung (9,90 €).'
            : 'Želim Import Passport proveru (9,90 €).') + '\n' +
        t('Cena auta: ', 'Fahrzeugpreis: ') + eur(price) + '\n' +
        t('Procena sa 0% carine: ', 'Schätzung mit 0% Zoll: ') + eur(zero.total) + '\n' +
        t('Procena sa 12,5% carine: ', 'Schätzung mit 12,5% Zoll: ') + eur(standard.total) + '\n' +
        t('Razlika: ', 'Differenz: ') + eur(difference);
      whatsapp.href = validLink(ad)
        ? 'https://wa.me/4915730916621?text=' + encodeURIComponent(msg)
        : '#';
    }
    function reset() {
      input.setCustomValidity('');
      payment.hidden = true;
      buildLink();
    }
    input.addEventListener('input', reset, { signal: activeListeners.signal });
    whatsapp.addEventListener('click', e => {
      if (!validLink(input.value.trim())) {
        e.preventDefault();
        input.setCustomValidity(t('Prvo zalepi link oglasa.',
          'Bitte zuerst einen Inserat-Link eingeben.'));
        input.reportValidity();
        input.focus();
        return;
      }
      buildLink();
      // Initiates WhatsApp; message delivery is confirmed only by WhatsApp.
      payment.hidden = false;
    });
    buildLink();
    if (typeof window.daniniTrack === 'function') {
      window.daniniTrack('calculator_completed', String(Math.round(selected.total)));
    }
  });
})();
