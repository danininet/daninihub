'use strict';

// Single source of truth for DANINI lead capture, across SR/DE pages.
// No customer data is stored on the server; the buyer chooses to open WhatsApp.
(() => {
  const PHONE = '4915730916621';
  const PAYPAL = 'https://www.paypal.me/dragangaganet/9.90EUR';
  const CHECKOUT = {passport:PAYPAL, oe:'https://www.paypal.me/dragangaganet/19EUR', combo:'https://www.paypal.me/dragangaganet/29.90EUR', transport:'https://www.paypal.me/dragangaganet/59EUR', b2b:'https://www.paypal.me/dragangaganet/99EUR'};
  const AMOUNT = {passport:'9,90 €',oe:'19,00 €',combo:'29,90 €',transport:'59,00 €',b2b:'99,00 €'};
  const de = document.documentElement.lang === 'de';
  const t = (sr, german) => de ? german : sr;
  const services = {
    passport: t('Import Passport — Poziv prodavcu i provera papira (9,90 €)',
      'Import Passport — Verkäuferanruf und Dokumentencheck (9,90 €)'),
    field: t('Field Check — Pregled vozila uživo u Nemačkoj (od 79 €)',
      'Field Check — Fahrzeugbesichtigung in Deutschland (ab 79 €)'),
    delivery: t('Upit za dovoz vozila', 'Anfrage zur Fahrzeugüberführung'),
    oe: t('OE servis i originalni delovi po VIN-u (19,00 €)', 'OE-Service und Originalteile nach VIN (19,00 €)'),
    combo: t('SVE PRE KUPOVINE: Passport + OE + ruta (29,90 €)', 'ALLES VOR DEM KAUF: Passport + OE + Route (29,90 €)'),
    transport: t('Koordinacija šlepera ili dovoza na točkovima (59,00 €)', 'Lkw- oder Fahrerüberführung koordinieren (59,00 €)'),
    b2b: t('B2B pretraga do tri vozila (99,00 €)', 'B2B Suche nach bis zu drei Fahrzeugen (99,00 €)')
  };

  function validLink(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
      return false;
    }
  }

  function message(link, service, details) {
    const vehicle = link
      ? t('Pozdrav Dragane, šaljem oglas: ', 'Hallo Dragan, mein Inserat: ') + link + '. '
      : t('Pozdrav Dragane, dostavljam specifikaciju usluge. ',
          'Hallo Dragan, meine Spezifikation zur Anfrage. ');
    const intent = {
      passport:t('Import Passport 9,90 €','Import Passport 9,90 €'),
      field:t('Field Check od 79 €','Field Check ab 79 €'),
      delivery:t('Dovoz: tražim individualnu ponudu','Überführung: individuelles Angebot'),
      oe:t('OE servis i delovi 19,00 €','OE Service und Teile 19,00 €'),
      combo:t('Sve pre kupovine 29,90 €','Alles vor dem Kauf 29,90 €'),
      transport:t('Koordinacija transporta 59,00 €, ne cena prevoza','Transportkoordination 59,00 €, ohne Frachtkosten'),
      b2b:t('B2B do tri vozila 99,00 €','B2B bis drei Fahrzeuge 99,00 €')
    };
    return vehicle + (intent[service] || intent.passport) +
      (details ? '\n' + t('Specifikacija: ','Details: ') + details : '') +
      '\n' + t('Molim potvrdu dostupnosti, obima i roka pre uplate.',
        'Bitte Verfügbarkeit, Umfang und Termin vor Zahlung bestätigen.');
  }

  function mount(host, index) {
    const formId = 'danini-order-' + index;
    const defaultService = Object.prototype.hasOwnProperty.call(services,host.dataset.service)
      ? host.dataset.service : 'passport';
    host.classList.add('danini-order-host');
    host.innerHTML = [
      '<section class="danini-order-card" aria-label="' + t('Pošalji oglas', 'Inserat senden') + '">',
      '<span class="danini-order-eyebrow">DANINI · OD OGLASA DO ODLUKE</span>',
      '<h2>' + t('Pošalji oglas — pre kapare i puta', 'Inserat senden — vor Anzahlung und Anreise') + '</h2>',
      '<p>' + t('Prvo šalješ oglas Draganu. Zatim dogovaramo konkretnu proveru.',
        'Sende zuerst das Inserat. Danach stimmen wir die konkrete Prüfung ab.') + '</p>',
      '<label for="' + formId + '-url">' + t('Link oglasa', 'Inserat-Link') + '</label>',
      '<input type="url" id="' + formId + '-url" maxlength="2000" placeholder="' +
        t('Zalepi link oglasa sa mobile.de ili AutoScout24...', 'Inserat-Link von mobile.de oder AutoScout24 einfügen...') + '">',
      '<label for="' + formId + '-details">' + t('VIN / HSN/TSN / model / grad / tražena vozila ili ruta', 'VIN / HSN/TSN / Modell / Ort / Wunschfahrzeuge oder Route') + '</label>',
      '<textarea class="danini-order-details" id="' + formId + '-details" rows="3" maxlength="1500" placeholder="' + t('Za B2B i OE narudžbine navedite specifikaciju; za oglas možete dodati pitanja.', 'Für B2B/OE bitte Spezifikation, zum Inserat weitere Fragen angeben.') + '"></textarea>',
      '<label for="' + formId + '-service">' + t('Izaberi uslugu', 'Leistung wählen') + '</label>',
      '<select id="' + formId + '-service">',
      Object.entries(services).map(([value, label]) =>
        '<option value="' + value + '"' + (value === defaultService ? ' selected' : '') + '>' + label + '</option>').join(''),
      '</select>',
      '<details class="danini-order-checklist"><summary>' + t('Pročitaj 7 pravila pre kupovine i uvoza', '7 Regeln vor Kauf und Import lesen') + '</summary><ol>',
      '<li>' + t('EUR.1 ili prihvaćena izjava o poreklu; prag 6.000 €.', 'EUR.1 oder gültige Ursprungserklärung; Schwelle 6.000 €.') + '</li>',
      '<li>' + t('19% MwSt i ABD/MRN: povrat nije automatski.', '19% MwSt und ABD/MRN: keine automatische Erstattung.') + '</li>',
      '<li>' + t('Gotovina od 10.000 €: proveriti pravila i identitet.', 'Bargeld ab 10.000 €: Pflichten und Identität prüfen.') + '</li>',
      '<li>' + t('COC i originalna dokumenta.', 'COC und Originaldokumente.') + '</li>',
      '<li>' + t('Drugi ključ i Felgenschloss.', 'Zweitschlüssel und Felgenschloss.') + '</li>',
      '<li>' + t('Masa vozila, ekološka naknada i carinska vrednost.', 'Fahrzeugmasse, Umweltgebühr und Zollwert.') + '</li>',
      '<li>' + t('VIN, Check Engine, Airbag i vetrobran pre AMSS pregleda.', 'VIN, Check Engine, Airbag und Windschutzscheibe vor technischer Prüfung.') + '</li>',
      '</ol><p><a target="_self" href="/' + (de ? 'de/wissen/' : 'sr/vodic/') + 'uvoz-zoll-eur1-i-dovoz">' + t('Otvori vodič i zvanične izvore', 'Ratgeber und amtliche Quellen öffnen') + ' →</a></p></details>',

      '<p class="danini-url-status" role="status" aria-live="polite"></p>',
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
    const details = host.querySelector('.danini-order-details');
    const paymentLink = host.querySelector('.danini-order-pay');
    const paymentTitle = host.querySelector('.danini-payment strong');
    const whatsapp = host.querySelector('.danini-order-wa');
    const payment = host.querySelector('.danini-payment');
    const urlStatus = host.querySelector('.danini-url-status');

    function update() {
      payment.hidden = true;
      const raw = input.value.trim();
      const exempt = ['oe','b2b','transport','delivery'].includes(select.value);
      const valid = validLink(raw) || (exempt && !raw && details.value.trim().length >= 10);
      let recognized = false;
      if (validLink(raw)) {
        const hostname = new URL(raw).hostname.toLowerCase();
        recognized = hostname === 'mobile.de' || hostname.endsWith('.mobile.de') ||
          hostname === 'autoscout24.de' || hostname.endsWith('.autoscout24.de') ||
          hostname === 'autoscout24.com' || hostname.endsWith('.autoscout24.com');
      }
      urlStatus.classList.toggle('recognized',recognized);
      urlStatus.textContent = !raw ? t('Zalepi link da aktiviraš WhatsApp dugme.',
        'Inserat-Link einfügen, um WhatsApp zu aktivieren.')
        : !valid ? t('Unesi link oglasa ili barem 10 znakova specifikacije za OE, B2B ili transport.',
          'Bitte Inserat-Link oder mindestens 10 Zeichen für OE, B2B oder Transport eingeben.')
        : recognized ? t('✓ Oglas prepoznat — spreman za slanje.',
          '✓ Inserat erkannt — versandbereit.')
        : t('✓ Link je ispravan — spreman za slanje.',
          '✓ Link gültig — versandbereit.');
      whatsapp.href = valid
        ? 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(message(validLink(raw)?raw:'', select.value, details.value.trim()))
        : '#';
      whatsapp.setAttribute('aria-disabled', String(!valid));
      const amount = AMOUNT[select.value];
      paymentLink.href = CHECKOUT[select.value] || PAYPAL;
      paymentLink.textContent = t('2. PayPal — plati ','2. PayPal — ') + (amount || '9,90 €');
      paymentTitle.textContent = t('Nakon potvrde obima, uplata usluge: ', 'Nach Bestätigung der Leistung: ') + (amount || '9,90 €');
    }

    input.addEventListener('input', () => {
      input.setCustomValidity('');
      update();
    });
    details.addEventListener('input', update);
    select.addEventListener('change', update);
    whatsapp.addEventListener('click', (event) => {
      const exempt = ['oe','b2b','transport','delivery'].includes(select.value);
      if (!(validLink(input.value.trim()) || (exempt && !input.value.trim() && details.value.trim().length >= 10))) {
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
      payment.hidden = !Boolean(CHECKOUT[select.value]);
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
      '.danini-order-card input,.danini-order-card textarea,.danini-order-card select{display:block;width:100%;padding:14px;border-radius:9px;border:1px solid #84968c;background:#fff;color:#171a18;font-size:16px;min-height:52px}',
      '.danini-order-wa,.danini-order-pay{display:flex;gap:9px;align-items:center;justify-content:center;text-align:center;border-radius:9px;padding:16px 14px;min-height:54px;text-decoration:none;font-weight:850;margin:20px 0 8px;line-height:1.35}',
      '.danini-order-wa{background:#25d366;color:#072a18!important}',
      '.danini-order-wa:hover{background:#65e99b}',
      '.danini-order-pay{background:#cfe4ff;color:#003087!important;max-width:450px}',
      '.danini-order-note{font-size:13px;color:#c3d5ca;margin-top:12px}',
      '.danini-order-checklist{margin:16px 0;background:#0f1d22;border:1px solid #48645a;border-radius:9px;padding:12px 15px;color:#e2edea}.danini-order-checklist summary{cursor:pointer;font-weight:800}.danini-order-checklist li{padding:4px 0;line-height:1.45}.danini-order-checklist a{color:#abf3c8}',
      '.danini-url-status{font-size:14px;color:#a7b8b1;margin:12px 0 0}.danini-url-status.recognized{color:#8df6b0;font-weight:850}',
      '.danini-order-wa[aria-disabled="true"]{opacity:.55;cursor:not-allowed;filter:grayscale(.5)}',
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
