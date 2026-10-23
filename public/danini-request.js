'use strict';

(() => {
  const form = document.getElementById('service-form');
  if (!form) return;

  const payment = document.getElementById('danini-request-payment');
  const result = document.getElementById('service-result');
  const de = document.documentElement.lang === 'de';
  const tr = (sr, german) => de ? german : sr;

  // A change to the selected vehicle or service invalidates the previous PayPal step.
  const reset = () => { if (payment) payment.hidden = true; };
  form.addEventListener('input', reset);
  form.addEventListener('change', reset);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const adLink = String(data.get('adLink') || '').trim();
    let url;
    try {
      url = new URL(adLink);
      if (!['https:', 'http:'].includes(url.protocol)) throw Error('Invalid protocol');
    } catch {
      result.textContent = tr('Unesi ispravan link oglasa.', 'Bitte gültigen Inserat-Link eingeben.');
      return;
    }

    const service = String(data.get('package') || 'passport');
    let message = 'Pozdrav Dragane, našao sam ovaj auto: ' + adLink + '. ';
    if (service === 'passport') {
      message += 'Želim Import Passport proveru (9,90 €).';
    } else if (service === 'field') {
      message += 'Želim ponudu za Field Check (od 79 €).';
    } else {
      message += 'Želim besplatan upit / informacije o dovozu.';
    }

    const whatsappUrl = 'https://wa.me/4915730916621?text=' + encodeURIComponent(message);
    const fallback = document.createElement('a');
    fallback.href = whatsappUrl;
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    fallback.className = 'btn';
    fallback.textContent = tr('Ponovo otvori WhatsApp', 'WhatsApp erneut öffnen');
    result.replaceChildren(fallback);

    // PayPal is optional and appears only after initiating the WhatsApp step.
    if (payment) payment.hidden = service !== 'passport';
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
})();
