'use strict';

// Single source of truth for DANINI lead capture, across SR/DE pages.
// No customer data is stored on the server; the buyer chooses to open WhatsApp.
(() => {
  const PHONE = '4915730916621';
  const CONTACT_EMAIL = 'info@daninihub.com';
  const de = document.documentElement.lang === 'de';
  const t = (sr, german) => de ? german : sr;
  const services = {
    field: t('Pregled vozila pre kupovine — obilazak na upit','Fahrzeugbesichtigung vor dem Kauf — auf Anfrage'),
    transport: t('Organizacija dovoza automobila / motocikla','Fahrzeug- oder Motorradtransport organisieren'),
    b2b: t('Nabavka vozila za auto-kuće — B2B','Fahrzeugbeschaffung für Händler — B2B'),
    passport: t('Procena oglasa, dokumenata i ukupnog troška','Inserat, Unterlagen und Gesamtkosten prüfen'),
    combo: t('Poređenje više vozila pre kupovine','Mehrere Fahrzeuge vor dem Kauf vergleichen'),
    oe: t('Originalni OE delovi — upit po VIN-u','Original-OE-Teile — Anfrage mit FIN'),
    vat: t('Izvozna dokumentacija i PDV — razjašnjenje','Ausfuhrunterlagen und Umsatzsteuer klären')
  };

  function validLink(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
      return false;
    }
  }

  function message(link, service, details, buyer) {
    const lines = [
      t('AUTODANINI — zahtev za ponudu', 'AUTODANINI — Anfrage für ein Angebot'),
      t('Usluga: ', 'Leistung: ') + (services[service] || services.passport)
    ];
    if (buyer.name) lines.push(t('Ime: ', 'Name: ') + buyer.name);
    if (link) lines.push(t('Oglas: ', 'Inserat: ') + link);
    if (buyer.location) lines.push(t('Lokacija / relacija: ', 'Standort / Strecke: ') + buyer.location);
    if (buyer.budget) lines.push(t('Budžet (€): ', 'Budget (€): ') + buyer.budget);
    if (details) lines.push(t('Opis zahteva: ', 'Beschreibung: ') + details);
    lines.push(t('Molim pisanu ponudu sa obimom usluge, ukupnom cenom i rokom, pre bilo kakve uplate.',
      'Bitte ein schriftliches Angebot mit Leistungsumfang, Gesamtpreis und Termin vor einer Zahlung.'));
    return lines.join('\n');
  }

  function mount(host, index) {
    const formId = 'danini-order-' + index;
    const defaultService = Object.prototype.hasOwnProperty.call(services,host.dataset.service)
      ? host.dataset.service : 'passport';
    host.classList.add('danini-order-host');
    host.innerHTML = [
      '<section class="danini-order-card" aria-label="' + t('Pošalji oglas', 'Inserat senden') + '">',
      '<span class="danini-order-eyebrow">AUTODANINI · ZAHTEV ZA KONKRETNU PONUDU</span>',
      '<h2>' + t('Šta možemo da uradimo za vaše vozilo?', 'Wie können wir Ihnen beim Fahrzeug helfen?') + '</h2>',
      '<p>' + t('Izaberite uslugu, navedite lokaciju ili oglas i dobićete potvrdu izvodljivosti i cenu pre narudžbine.',
        'Wählen Sie die Leistung und geben Sie Standort oder Inserat an. Umfang und Preis werden vor der Beauftragung geklärt.') + '</p>',
      '<label for="' + formId + '-url">' + t('Link oglasa (ako postoji)', 'Inserat-Link (falls vorhanden)') + '</label>',
      '<input type="url" id="' + formId + '-url" maxlength="2000" placeholder="' +
        t('Zalepi link oglasa sa mobile.de ili AutoScout24...', 'Inserat-Link von mobile.de oder AutoScout24 einfügen...') + '">',
      '<label for="' + formId + '-details">' + t('Koji auto tražite i šta vam je potrebno?', 'Welches Fahrzeug und welche Leistung benötigen Sie?') + '</label>',
      '<textarea class="danini-order-details" id="' + formId + '-details" rows="3" maxlength="1500" placeholder="' + t('Npr. Mercedes E klasa 2018, provera u Duisburgu ili prevoz do Niša. Ne šaljite lične dokumente.', 'Z.B. Mercedes E-Klasse 2018, Prüfung in Duisburg oder Transport nach Niš. Keine Ausweisdokumente senden.') + '"></textarea>',
      '<label for="' + formId + '-name">' + t('Ime (opciono)', 'Name (optional)') + '</label>',
      '<input class="danini-order-name" id="' + formId + '-name" type="text" maxlength="80" autocomplete="name" placeholder="' + t('Kako da vas oslovimo?', 'Wie dürfen wir Sie ansprechen?') + '">',
      '<label for="' + formId + '-location">' + t('Grad vozila / relacija prevoza (opciono)', 'Fahrzeugstandort / Transportstrecke (optional)') + '</label>',
      '<input class="danini-order-location" id="' + formId + '-location" type="text" maxlength="180" placeholder="' + t('Npr. Essen — Niš', 'z.B. Essen — Niš') + '">',
      '<label for="' + formId + '-budget">' + t('Budžet za kupovinu vozila u € (opciono)', 'Kaufbudget in € (optional)') + '</label>',
      '<input class="danini-order-budget" id="' + formId + '-budget" type="number" min="0" max="10000000" step="100" inputmode="numeric" placeholder="' + t('Npr. 10000', 'z.B. 10000') + '">',
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
      '<label for="' + formId + '-email">' + t('E-mail za potvrdu preko sajta (opciono za WhatsApp)', 'E-Mail für eine Anfrage über die Website (optional für WhatsApp)') + '</label>',
      '<input class="danini-order-contact-email" id="' + formId + '-email" type="email" maxlength="190" autocomplete="email" placeholder="ime@primer.com">',
      '<label class="danini-order-consent"><input type="checkbox" class="danini-order-consent-check"><span>' + t(
        'Razumem da se upit šalje preko izabrane aplikacije ili, kada je omogućeno, kroz AutoDanini sistem radi obrade ponude i potvrde e-mejlom. Ne šaljem lozinke ni lična dokumenta. <a href="/sr/privatnost">Privatnost</a>.',
        'Ich verstehe, dass meine Anfrage über die gewählte App oder, wenn verfügbar, über das AutoDanini-System zur Angebotserstellung und E-Mail-Bestätigung verarbeitet wird. Keine Passwörter oder Ausweisdokumente. <a href="/de/datenschutz">Datenschutz</a>.') + '</span></label>',
      '<div class="danini-order-online" hidden><button type="button" class="danini-order-online-submit">' +
       t('Pošalji upit preko sajta i dobij broj predmeta', 'Anfrage über die Website senden und Vorgangsnummer erhalten') +
       '</button><p class="danini-order-online-note">' +
       t('Dostupno samo kada su baza i potvrda mejlom aktivne. Upit se ne naplaćuje.', 'Nur verfügbar, wenn Datenbank und E-Mail-Bestätigung aktiv sind. Anfrage kostenlos.') + '</p></div>',
      '<p class="danini-order-help" role="status" aria-live="polite"></p>',
      '<a class="danini-order-email" href="#" aria-disabled="true">' +
        t('Nemate WhatsApp? Pošaljite upit mejlom →', 'Kein WhatsApp? Anfrage per E-Mail senden →') + '</a>',
      '<p class="danini-order-note">' + t(
        'Nema automatske rezervacije niti online uplate preko ovog obrasca. Dobijate odgovor sa ponudom za dostupnu uslugu, obimom i ukupnom cenom.',
        'Dieses Formular nimmt weder Buchungen noch Online-Zahlungen vor. Sie erhalten ein Angebot mit verfügbarer Leistung, Umfang und Gesamtpreis.') +
        '</p>',
      '</section>'
    ].join('');

    const input = host.querySelector('input[type="url"]');
    const select = host.querySelector('select');
    const details = host.querySelector('.danini-order-details');
    const name = host.querySelector('.danini-order-name');
    const location = host.querySelector('.danini-order-location');
    const budget = host.querySelector('.danini-order-budget');
    const consent = host.querySelector('.danini-order-consent-check');
    const contactEmail = host.querySelector('.danini-order-contact-email');
    const onlineContainer = host.querySelector('.danini-order-online');
    const onlineSubmit = host.querySelector('.danini-order-online-submit');
    let onlineIntakeReady = false;
    const whatsapp = host.querySelector('.danini-order-wa');
    const email = host.querySelector('.danini-order-email');
    const urlStatus = host.querySelector('.danini-url-status');
    const help = host.querySelector('.danini-order-help');
    const serviceTypes={passport:'AD_REVIEW',field:'FIELD_CHECK_LIVE',transport:'TRAILER_TRANSPORT',b2b:'B2B_SOURCING',combo:'AD_REVIEW',oe:'ORIGINAL_PARTS',vat:'EXPORT_DOCS'};

    function update() {
      const raw = input.value.trim();
      const note = details.value.trim();
      const linkOk = validLink(raw);
      const hasRequest = (linkOk || (!raw && note.length >= 15));
      const ready = hasRequest && consent.checked;
      let recognized = false;
      if (linkOk) {
        const hostname = new URL(raw).hostname.toLowerCase();
        recognized = hostname === 'mobile.de' || hostname.endsWith('.mobile.de') ||
          hostname === 'autoscout24.de' || hostname.endsWith('.autoscout24.de') ||
          hostname === 'autoscout24.com' || hostname.endsWith('.autoscout24.com');
      }
      urlStatus.classList.toggle('recognized',recognized);
      urlStatus.textContent = raw && !linkOk
        ? t('Link nije ispravan. Unesite punu HTTP(S) adresu oglasa.', 'Ungültiger Link. Bitte eine vollständige HTTP(S)-Adresse eingeben.')
        : !hasRequest ? t('Unesite link oglasa ili najmanje 15 znakova opisa zahteva.', 'Bitte Inserat-Link oder mindestens 15 Zeichen Ihrer Anfrage eingeben.')
        : recognized ? t('✓ Oglas prepoznat. Proverite podatke pre slanja.', '✓ Inserat erkannt. Bitte Angaben vor dem Senden prüfen.')
        : t('✓ Upit spreman. Potvrdite slanje putem WhatsApp-a ili mejla.', '✓ Anfrage bereit. Versand über WhatsApp oder E-Mail bestätigen.');
      const buyer={
        name:name.value.trim(),location:location.value.trim(),
        budget:budget.value.trim()
      };
      const content=message(linkOk?raw:'',select.value,note,buyer);
      const wa='https://wa.me/' + PHONE + '?text=' + encodeURIComponent(content);
      const mail='mailto:' + CONTACT_EMAIL + '?subject=' +
        encodeURIComponent(t('AutoDanini — upit za ponudu','AutoDanini — Anfrage')) +
        '&body=' + encodeURIComponent(content);
      const safeLength=wa.length <= 4700;
      whatsapp.href=ready && safeLength ? wa : '#';
      email.href=ready && mail.length<=5800 ? mail : '#';
      whatsapp.setAttribute('aria-disabled',String(!ready||!safeLength));
      email.setAttribute('aria-disabled',String(!ready||mail.length>5800));
      if (!safeLength && hasRequest) {
        help.textContent=t('Upit je predugačak za WhatsApp. Skratite opis ili link.', 'Anfrage für WhatsApp zu lang. Bitte Text oder Link kürzen.');
      } else if (!consent.checked && hasRequest) {
        help.textContent=t('Označite saglasnost za prenos podataka kroz izabranu aplikaciju.', 'Bitte der Übertragung durch die gewählte App zustimmen.');
      } else {
        help.textContent='';
      }
    }

    for (const control of [input,select,details,name,location,budget,consent,contactEmail]) {
      control.addEventListener(control===select||control===consent?'change':'input',update);
    }
    function validateOpen(event) {
      if (event.currentTarget.getAttribute('aria-disabled')==='true') {
        event.preventDefault();
        if (!consent.checked) consent.focus();
        else if (input.value.trim()) input.focus();
        else details.focus();
        update();
        return;
      }
      help.textContent=t('Poruka se šalje tek kada je potvrdite u izabranoj aplikaciji. AutoDanini još nije primio zahtev.',
        'Die Nachricht wird erst nach Bestätigung in der gewählten App versendet. AutoDanini hat noch keine Anfrage erhalten.');
    }
    whatsapp.addEventListener('click',validateOpen);
    email.addEventListener('click',validateOpen);
    async function submitOnline(){
      if(!onlineIntakeReady)return;
      update();
      const raw=input.value.trim(),note=details.value.trim(),mail=contactEmail.value.trim();
      if(!consent.checked || !(validLink(raw)||(!raw&&note.length>=15))){
        help.textContent=t('Popunite oglas ili opis i potvrdite obaveštenje o privatnosti.',
          'Bitte Inserat oder Beschreibung eingeben und Datenschutzhinweis bestätigen.');return;
      }
      if(!mail||!contactEmail.checkValidity()){
        help.textContent=t('Za zahtev preko sajta obavezan je ispravan e-mail.',
          'Für die Anfrage über die Website benötigen wir eine gültige E-Mail-Adresse.');
        contactEmail.focus();return;
      }
      const body={
        language:de?'de':'sr',source:'autodanini-web',
        serviceType:serviceTypes[select.value]||'AD_REVIEW',
        email:mail,name:name.value.trim(),privacyAcknowledged:true,
        vehicle:raw||note.slice(0,180),listingUrl:raw,
        pickupLocation:location.value.trim(),budgetEur:budget.value.trim(),
        message:(raw?t('Oglas: ','Inserat: ')+raw+'\n':'')+note,
        website:''
      };
      onlineSubmit.disabled=true;
      help.textContent=t('Proveravam prijem zahteva…','Anfrage wird übermittelt…');
      try{
        const response=await fetch('/api/importos/service-request',{
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify(body),signal:AbortSignal.timeout(15000)
        });
        const result=await response.json();
        if(!response.ok || !result.ok)throw new Error(result.error||'REQUEST_FAILED');
        help.replaceChildren();
        const paragraph=document.createElement('p');
        paragraph.textContent=t('Zahtev je evidentiran pod brojem ','Anfrage erfasst unter ')+result.reference+
          (result.delivered?t('. Potvrda je upućena mejlom.','. Bestätigung per E-Mail verschickt.')
          :t('. E-mail nije potvrđen; sačuvajte broj i kontaktirajte nas na WhatsApp.','. E-Mail nicht bestätigt; Nummer notieren und per WhatsApp nachfragen.'));
        help.appendChild(paragraph);
        if(result.trackingUrl && result.trackingUrl.startsWith('https://daninihub.com/')){
          const link=document.createElement('a');link.href=result.trackingUrl;
          link.textContent=t('Otvori svoj privatni dosije','Privates Dossier öffnen');
          link.rel='nofollow';help.appendChild(link);
        }
        if(typeof window.daniniTrack==='function')window.daniniTrack('service_request_started',body.serviceType);
      }catch(error){
        help.textContent=t('Zahtev nije potvrđen kroz sajt. Pošaljite ga preko WhatsApp-a ili mejla. Detalj: ',
          'Website-Eingang nicht bestätigt. Bitte per WhatsApp oder E-Mail senden. Hinweis: ')+error.message;
      }finally{onlineSubmit.disabled=false;}
    }
    onlineSubmit.addEventListener('click',submitOnline);
    fetch('/api/importos/lead-readiness',{cache:'no-store',signal:AbortSignal.timeout(9000)})
      .then(r=>r.ok?r.json():null).then(data=>{
        onlineIntakeReady=data?.onlineIntakeReady===true;
        onlineContainer.hidden=!onlineIntakeReady;
      }).catch(()=>{onlineContainer.hidden=true;});
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
      '.danini-order-wa{display:flex;gap:9px;align-items:center;justify-content:center;text-align:center;border-radius:9px;padding:16px 14px;min-height:54px;text-decoration:none;font-weight:850;margin:20px 0 8px;line-height:1.35}',
      '.danini-order-wa{background:#25d366;color:#072a18!important}',
      '.danini-order-wa:hover{background:#65e99b}',
      '.danini-order-email{display:inline-block;margin:12px 0;color:#d7edff;text-decoration:underline;font-size:15px;font-weight:750}.danini-order-email[aria-disabled="true"]{opacity:.5;cursor:not-allowed}',
      '.danini-order-note{font-size:13px;color:#c3d5ca;margin-top:12px}',
      '.danini-order-checklist{margin:16px 0;background:#0f1d22;border:1px solid #48645a;border-radius:9px;padding:12px 15px;color:#e2edea}.danini-order-checklist summary{cursor:pointer;font-weight:800}.danini-order-checklist li{padding:4px 0;line-height:1.45}.danini-order-checklist a{color:#abf3c8}',
      '.danini-url-status{font-size:14px;color:#a7b8b1;margin:12px 0 0}.danini-url-status.recognized{color:#8df6b0;font-weight:850}',
      '.danini-order-wa[aria-disabled="true"]{opacity:.55;cursor:not-allowed;filter:grayscale(.5)}',
      '.danini-order-online[hidden]{display:none!important}.danini-order-online-submit{display:block;width:100%;margin:17px 0 6px;border-radius:10px;border:0;background:#d5a866;color:#131b20;padding:15px;font-size:16px;font-weight:850;cursor:pointer}.danini-order-online-submit:disabled{opacity:.6}.danini-order-online-note{font-size:13px;color:#e2d2bf}.danini-order-consent{display:flex!important;gap:12px;align-items:flex-start;line-height:1.45;font-size:13px!important}.danini-order-consent input{width:20px!important;min-height:20px!important;flex:0 0 20px;margin-top:2px}.danini-order-consent a{color:#adedd0}.danini-order-help{color:#f1d19f;font-size:13px}',
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
