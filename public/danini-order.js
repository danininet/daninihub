'use strict';

// Single source of truth for DANINI lead capture, across SR/DE pages.
// No customer data is stored on the server; the buyer chooses to open WhatsApp.
(() => {
  const PHONE = '4915730916621';
  const PAYPAL = 'https://www.paypal.me/dragangaganet/9.90EUR';
  const de = document.documentElement.lang === 'de';
  const t = (sr, german) => de ? german : sr;
  const services = {
    passport: t('Import Passport — Poziv prodavcu i provera papira (9,90 €)',
      'Import Passport — Verkäuferanruf und Dokumentencheck (9,90 €)'),
    field: t('Field Check — Pregled vozila uživo u Nemačkoj (od 79 €)',
      'Field Check — Fahrzeugbesichtigung in Deutschland (ab 79 €)'),
    delivery: t('Upit za dovoz vozila', 'Anfrage zur Fahrzeugüberführung')
  };

  function validLink(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
      return false;
    }
  }

  function message(link, service) {
    const vehicle = de
      ? 'Hallo Dragan, ich habe dieses Fahrzeug gefunden: ' + link + '. '
      : 'Pozdrav Dragane, našao sam ovaj auto: ' + link + '. ';
    const request = service === 'field'
      ? t('Želim Field Check pregled vozila (od 79 €).',
          'Ich möchte einen Field Check (ab 79 €).')
      : service === 'delivery'
        ? t('Želim ponudu za dovoz vozila.', 'Ich möchte ein Überführungsangebot.')
        : t('Želim Import Passport proveru (9,90 €).',
            'Ich möchte die Import Passport Prüfung (9,90 €).');
    return vehicle + request;
  }

  function mount(host, index) {
    const formId = 'danini-order-' + index;
    const defaultService = ['passport', 'field', 'delivery'].includes(host.dataset.service)
      ? host.dataset.service : 'passport';
    host.classList.add('danini-order-host');
    host.innerHTML = [
      '<section class="danini-order-card" aria-label="' + t('Pošalji oglas', 'Inserat senden') + '">',
      '<span class="danini-order-eyebrow">DANINI · OD OGLASA DO ODLUKE</span>',
      '<h2>' + t('Pošalji oglas — pre kapare i puta', 'Inserat senden — vor Anzahlung und Anreise') + '</h2>',
      '<p>' + t('Prvo šalješ oglas Draganu. Zatim dogovaramo konkretnu proveru.',
        'Sende zuerst das Inserat. Danach stimmen wir die konkrete Prüfung ab.') + '</p>',
      '<label for="' + formId + '-url">' + t('Link oglasa', 'Inserat-Link') + '</label>',
      '<input type="url" id="' + formId + '-url" required maxlength="2000" placeholder="' +
        t('Zalepi link oglasa sa mobile.de ili AutoScout24...', 'Inserat-Link von mobile.de oder AutoScout24 einfügen...') + '">',
      '<label for="' + formId + '-service">' + t('Izaberi uslugu', 'Leistung wählen') + '</label>',
      '<select id="' + formId + '-service">',
      Object.entries(services).map(([value, label]) =>
        '<option value="' + value + '"' + (value === defaultService ? ' selected' : '') + '>' + label + '</option>').join(''),
      '</select>',
      '<a class="danini-order-wa" href="#" target="_blank" rel="noopener noreferrer">',
      '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-8.8 8.4 8.5 8.5 0 0 1-3.8-1L3 21l2.1-5.2a8.4 8.4 0 1 1 15.9-4.3Z"/><path d="M9 9c.4 2.5 2 4 4.6 5.5l1.3-1.1 2.1 1-1 2c-3.5.7-8.2-3.9-8.5-7.3L9 9Z"/></svg>',
      '<span>' + t('1. Pošalji oglas Draganu na WhatsApp',
        '1. Inserat per WhatsApp an Dragan senden') + '</span></a>',
      '<div class="danini-payment" hidden>',
      '<p><strong>' + t(
        'Nakon slanja oglasa na WhatsApp, uplatu za Import Passport (9,90 €) izvršite ovde:',
        'Nach dem Versand des Inserats per WhatsApp können Sie den Import Passport (9,90 €) hier bezahlen:') +
        '</strong></p>',
      '<a class="danini-order-pay" href="' + PAYPAL +
        '" target="_blank" rel="noopener noreferrer">2. ' +
        t('Plati 9,90 € preko PayPal-a', '9,90 € über PayPal bezahlen') + '</a>',
      '<p class="danini-order-note">' + t(
        'PayPal.Me ne povezuje automatski uplatu sa oglasom. Pošaljite potvrdu u istom WhatsApp razgovoru; pre početka usluge potvrđujemo obim i dostupnost.',
        'PayPal.Me ordnet die Zahlung nicht automatisch dem Inserat zu. Bitte senden Sie den Beleg im gleichen WhatsApp-Chat; Umfang und Verfügbarkeit werden vorab bestätigt.') + '</p>',
      '</div>',
      '<p class="danini-order-note">' + t(
        'Import Passport: 9,90 €. Field Check: od 79 €, po potvrđenoj lokaciji i obimu. Upit za dovoz: bez obaveze plaćanja.',
        'Import Passport: 9,90 €. Field Check: ab 79 € je nach Standort und Umfang. Transportanfrage: ohne Zahlungspflicht.') +
        '</p>',
      '</section>'
    ].join('');

    const input = host.querySelector('input');
    const select = host.querySelector('select');
    const whatsapp = host.querySelector('.danini-order-wa');
    const payment = host.querySelector('.danini-payment');

    function update() {
      payment.hidden = true;
      const raw = input.value.trim();
      whatsapp.href = validLink(raw)
        ? 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(message(raw, select.value))
        : '#';
    }

    input.addEventListener('input', () => {
      input.setCustomValidity('');
      update();
    });
    select.addEventListener('change', update);
    whatsapp.addEventListener('click', (event) => {
      if (!validLink(input.value.trim())) {
        event.preventDefault();
        input.setCustomValidity(t('Unesite ispravan link oglasa pre slanja.',
          'Bitte zuerst einen gültigen Inserat-Link eingeben.'));
        input.reportValidity();
        input.focus();
        return;
      }
      update();
      // Browser cannot know whether the buyer actually pressed Send in WhatsApp.
      // This only unlocks the optional payment step after opening that inquiry.
      payment.hidden = select.value !== 'passport';
    });
    update();
  }

  function init() {
    const hosts = document.querySelectorAll('.danini-order-slot');
    if (!hosts.length) return;
    const css = document.createElement('style');
    css.textContent = [
      '.danini-order-host{margin:30px 0 50px}',
      '.danini-order-card{background:linear-gradient(135deg,#12231c,#111a22);border:1px solid #436753;border-radius:18px;padding:clamp(18px,3vw,32px);max-width:860px;margin:auto;box-shadow:0 16px 40px rgba(0,0,0,.15)}',
      '.danini-order-card h2{font-size:clamp(26px,4vw,38px)!important;line-height:1.2;margin:12px 0}',
      '.danini-order-card p{line-height:1.6}',
      '.danini-order-eyebrow{font-size:12px;letter-spacing:.14em;color:#77e4a3;font-weight:800}',
      '.danini-order-card label{display:block;margin:18px 0 7px;font-size:15px;font-weight:800;color:#fff}',
      '.danini-order-card input,.danini-order-card select{display:block;width:100%;padding:14px;border-radius:9px;border:1px solid #84968c;background:#fff;color:#171a18;font-size:16px;min-height:52px}',
      '.danini-order-wa,.danini-order-pay{display:flex;gap:9px;align-items:center;justify-content:center;text-align:center;border-radius:9px;padding:16px 14px;min-height:54px;text-decoration:none;font-weight:850;margin:20px 0 8px;line-height:1.35}',
      '.danini-order-wa{background:#25d366;color:#072a18!important}',
      '.danini-order-wa:hover{background:#65e99b}',
      '.danini-order-pay{background:#cfe4ff;color:#003087!important;max-width:450px}',
      '.danini-order-note{font-size:13px;color:#c3d5ca;margin-top:12px}',
      '.danini-payment[hidden]{display:none!important}',
      '@media(max-width:600px){.danini-order-card{border-radius:12px;padding:18px}.danini-order-wa{font-size:15px}}'
    ].join('');
    document.head.appendChild(css);
    hosts.forEach((host, index) => mount(host, index + 1));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
