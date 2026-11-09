'use strict';

/**
 * Progressive enhancement for DANINI general, B2B and support contact forms.
 * An online form is not exposed until /api/lead/status confirms the Cloudflare
 * Worker is ready and a real Turnstile challenge has rendered.
 * No newsletter enrollment, background submission or local data storage.
 */
(() => {
  const de = document.documentElement.lang === 'de';
  const t = (sr, german) => de ? german : sr;
  const FORMS = document.querySelectorAll('form[data-danini-lead-kind]');
  if (!FORMS.length) return;

  let loader;
  function loadTurnstile() {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (!loader) {
      loader = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.onload = () => window.turnstile ? resolve(window.turnstile) : reject(new Error('challenge_unavailable'));
        script.onerror = () => reject(new Error('challenge_unavailable'));
        document.head.appendChild(script);
      });
    }
    return loader;
  }

  async function readiness() {
    const response = await fetch('/api/lead/status', {cache:'no-store', credentials:'same-origin', signal:AbortSignal.timeout(8000)});
    if (!response.ok) throw new Error('intake_unavailable');
    const body = await response.json();
    if (body.enabled !== true || typeof body.turnstileSiteKey !== 'string' || body.turnstileSiteKey.length < 5) {
      throw new Error('intake_disabled');
    }
    return body.turnstileSiteKey;
  }

  function mount(form) {
    const kind = form.dataset.daniniLeadKind;
    if (!['general','business','support','info','invoice','partner','privacy'].includes(kind)) return;
    const status = document.getElementById(form.id + '-status');
    const button = form.querySelector('button[type="submit"]');
    const challenge = form.querySelector('.danini-lead-turnstile');
    let token = '';
    let widget;
    let submitting = false;
    form.hidden = true;
    function say(message) { if (status) status.textContent = message; }
    say(t('Onlajn obrazac se proverava. U međuvremenu možete koristiti poslovni e-mail.',
      'Das Online-Formular wird geprüft. Sie können auch die geschäftliche E-Mail-Adresse nutzen.'));

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (submitting || !form.reportValidity()) return;
      const fd = new FormData(form);
      if (!fd.has('consent')) {
        say(t('Potvrdite da ste pročitali obaveštenje o privatnosti.',
          'Bitte bestätigen Sie die Kenntnisnahme der Datenschutzhinweise.'));
        return;
      }
      if (!token) {
        say(t('Dovršite zaštitnu proveru pre slanja.', 'Bitte schließen Sie die Sicherheitsprüfung ab.'));
        return;
      }
      const payload = {
        kind,language:de?'de':'sr',
        name:String(fd.get('name')||'').trim(),email:String(fd.get('email')||'').trim(),
        topic:String(fd.get('topic')||'').trim(),
        message:String(fd.get('message')||'').trim(),
        company:String(fd.get('company')||'').trim(),
        consent:true, turnstileToken:token,
        website:String(fd.get('website')||'')
      };
      submitting = true;
      button.disabled = true;
      say(t('Šaljemo vaš upit…','Ihre Anfrage wird übermittelt…'));
      try {
        const response = await fetch('/api/lead', {
          method:'POST',headers:{'content-type':'application/json'},credentials:'same-origin',
          body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)
        });
        const result = await response.json();
        if (response.status !== 202 || result.accepted !== true || !result.reference) throw new Error('not_accepted');
        say((de?'Anfrage angenommen. Referenz: ':'Upit je prihvaćen. Broj: ')+result.reference+
          (result.receiptAccepted===true?
            t('. Potvrda je prihvaćena za slanje e-mail servisom.', '. E-Mail-Bestätigung wurde zur Zustellung angenommen.') :
            t('. Potvrda e-mailom još nije potvrđena. Sačuvajte broj predmeta.', '. Die E-Mail-Bestätigung ist noch nicht bestätigt. Bitte Referenz notieren.')));
        form.reset();
      } catch {
        say(t('Upit nije potvrđen. Pošaljite ga na poslovni e-mail naveden na stranici.',
          'Die Anfrage wurde nicht bestätigt. Bitte schreiben Sie an die angegebene geschäftliche E-Mail-Adresse.'));
      } finally {
        submitting = false;
        button.disabled = false;
        token = '';
        if (window.turnstile && widget !== undefined) window.turnstile.reset(widget);
      }
    });

    readiness().then(async sitekey => {
      const turnstile = await loadTurnstile();
      widget = turnstile.render(challenge, {
        sitekey,
        callback: value => { token = value; },
        'expired-callback': () => { token = ''; },
        'error-callback': () => { token = ''; }
      });
      form.hidden = false;
      say(t('Obrazac je spreman za slanje.', 'Das Formular ist bereit.'));
    }).catch(() => {
      form.hidden = true;
      say(t('Onlajn obrazac trenutno nije aktivan. Pišite na poslovni e-mail ispod.',
        'Das Online-Formular ist derzeit nicht aktiv. Nutzen Sie bitte die unten angegebene E-Mail-Adresse.'));
    });
  }

  FORMS.forEach(mount);
})();