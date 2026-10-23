'use strict';

(() => {
  const PHONE = '4915730916621';
  const PAYPAL = 'https://www.paypal.me/dragangaganet/9.90EUR';
  const isGerman = document.documentElement.lang === 'de';
  const t = (sr, de) => isGerman ? de : sr;
  const CTA = t(
    'Pošalji oglas Draganu na WhatsApp (+49 1573 0916621)',
    'Inserat per WhatsApp an Dragan senden (+49 1573 0916621)'
  );

  function validAdLink(value) {
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol);
    } catch {
      return false;
    }
  }

  function messageFor(adLink, service) {
    if (service === 'passport') {
      return 'Pozdrav Dragane, našao sam ovaj auto: ' + adLink + '. Želim Import Passport proveru (9,90 €).';
    }
    if (service === 'field') {
      return 'Pozdrav Dragane, našao sam ovaj auto: ' + adLink + '. Želim ponudu za Field Check (od 79 €).';
    }
    return 'Pozdrav Dragane, našao sam ovaj auto: ' + adLink + '. Želim besplatan upit / informacije o dovozu.';
  }

  function init() {
    if (document.getElementById('danini-sales')) return;

    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.id = 'danini-sales-open';
    openButton.textContent = t('Pošalji oglas', 'Inserat senden');
    openButton.setAttribute('aria-expanded', 'false');
    openButton.setAttribute('aria-controls', 'danini-sales');

    const panel = document.createElement('section');
    panel.id = 'danini-sales';
    panel.hidden = true;
    panel.setAttribute('aria-label', t('DANINI provera oglasa', 'DANINI Inseratprüfung'));
    panel.innerHTML = [
      '<button type="button" id="danini-sales-close" aria-label="' + t('Zatvori', 'Schließen') + '">×</button>',
      '<h2>' + t('Pošalji oglas pre plaćanja', 'Inserat vor Zahlung senden') + '</h2>',
      '<label for="danini-ad">' + t('Link oglasa', 'Inserat-Link') + '</label>',
      '<input id="danini-ad" type="url" required maxlength="2000" placeholder="https://www.mobile.de/...">',
      '<label for="danini-package">' + t('Usluga', 'Service') + '</label>',
      '<select id="danini-package">',
      '<option value="passport">Import Passport — 9,90 €</option>',
      '<option value="field">Field Check — ' + t('od', 'ab') + ' 79 €</option>',
      '<option value="free">' + t('Besplatan upit / dovoz', 'Kostenlose Anfrage / Überführung') + '</option>',
      '</select>',
      '<a id="danini-wa" class="danini-action" href="#" target="_blank" rel="noopener noreferrer">' + CTA + '</a>',
      '<div id="danini-payment" hidden>',
      '<p class="danini-small">' + t(
        'Uplata za proveru (9,90 €) se vrši nakon slanja oglasa putem PayPal-a:',
        'Die Zahlung für die Prüfung (9,90 €) erfolgt nach dem Versand des Inserats über PayPal:'
      ) + '</p>',
      '<a id="danini-pay" href="' + PAYPAL + '" target="_blank" rel="noopener noreferrer">PayPal — 9,90 €</a>',
      '<p class="danini-small">' + t(
        'PayPal.Me ne povezuje uplatu automatski sa oglasom. Navedi link u napomeni za uplatu, ako je dostupna, ili pošalji potvrdu u istom WhatsApp razgovoru.',
        'PayPal.Me ordnet die Zahlung nicht automatisch einem Inserat zu. Inserat-Link falls möglich als Zahlungsnotiz hinzufügen oder Beleg im selben WhatsApp-Chat senden.'
      ) + '</p>',
      '</div>'
    ].join('');

    const style = document.createElement('style');
    style.textContent = [
      '#danini-sales-open{position:fixed;right:16px;bottom:16px;z-index:79;background:#ff792f;color:#0b0e11;border:0;border-radius:28px;padding:14px 20px;font-size:16px;font-weight:800;cursor:pointer;min-height:48px}',
      '#danini-sales{position:fixed;z-index:80;right:12px;bottom:12px;width:min(390px,calc(100vw - 24px));max-height:calc(100dvh - 24px);overflow:auto;background:#111a21;color:#fff;border:1px solid #60707a;border-radius:14px;padding:18px;box-shadow:0 12px 40px #0009}',
      '#danini-sales[hidden],#danini-sales-open[hidden],#danini-payment[hidden]{display:none!important}',
      '#danini-sales h2{margin:8px 32px 16px 0;font-size:22px;line-height:1.3}',
      '#danini-sales label{display:block;font-size:15px;margin:12px 0 5px}',
      '#danini-sales input,#danini-sales select{display:block;width:100%;padding:12px;border-radius:8px;background:#fff;color:#111;border:1px solid #aaa;font-size:16px}',
      '#danini-sales-close{float:right;background:transparent;border:0;color:white;font-size:26px;cursor:pointer;min-width:44px;min-height:44px}',
      '#danini-wa{display:block;background:#ff792f;color:#111!important;text-align:center;border-radius:8px;padding:14px 10px;margin-top:14px;font-weight:800;text-decoration:none;min-height:48px}',
      '#danini-pay{display:inline-block;background:#e9f1ff;color:#111!important;text-decoration:none;font-weight:700;padding:12px 16px;border-radius:8px;min-height:44px}',
      '.danini-small{font-size:13px;line-height:1.5;color:#d4dde3}',
      '@media(max-width:420px){#danini-sales{max-height:calc(100dvh - 8px);bottom:4px;right:4px;width:calc(100vw - 8px)}}'
    ].join('');
    document.head.appendChild(style);
    document.body.append(openButton, panel);

    const adInput = panel.querySelector('#danini-ad');
    const serviceSelect = panel.querySelector('#danini-package');
    const whatsapp = panel.querySelector('#danini-wa');
    const payment = panel.querySelector('#danini-payment');

    const resetPayment = () => { payment.hidden = true; };
    const updateWhatsappUrl = () => {
      const adLink = adInput.value.trim();
      whatsapp.href = validAdLink(adLink)
        ? 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(messageFor(adLink, serviceSelect.value))
        : '#';
    };

    adInput.addEventListener('input', () => {
      adInput.setCustomValidity('');
      resetPayment();
      updateWhatsappUrl();
    });
    serviceSelect.addEventListener('change', () => {
      resetPayment();
      updateWhatsappUrl();
    });
    whatsapp.addEventListener('click', (event) => {
      const adLink = adInput.value.trim();
      if (!validAdLink(adLink)) {
        event.preventDefault();
        adInput.setCustomValidity(t('Unesi ispravan link oglasa.', 'Bitte gültigen Inserat-Link eingeben.'));
        adInput.reportValidity();
        adInput.focus();
        return;
      }
      updateWhatsappUrl();
      // Opening WhatsApp is not proof the user pressed Send in WhatsApp.
      // Only show the optional PayPal step after initiating a valid inquiry.
      payment.hidden = serviceSelect.value !== 'passport';
    });

    const close = () => {
      panel.hidden = true;
      openButton.hidden = false;
      openButton.setAttribute('aria-expanded', 'false');
    };
    openButton.addEventListener('click', () => {
      panel.hidden = false;
      openButton.hidden = true;
      openButton.setAttribute('aria-expanded', 'true');
      adInput.focus();
    });
    panel.querySelector('#danini-sales-close').addEventListener('click', close);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !panel.hidden) close();
    });
    updateWhatsappUrl();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
