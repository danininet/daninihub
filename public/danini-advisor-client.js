/* DANINI Advisor — three-question state machine; no live listing scrape or automated valuation. */
(() => {
  'use strict';
  const root = document.querySelector('[data-advisor]');
  if (!root) return;
  const lang = root.dataset.locale === 'de' ? 'de' : 'sr';
  const messages = lang === 'de' ? {
    loading: 'Eingabe wird vorbereitet …', missing: 'Angaben fehlen — beantworten Sie drei Fragen.',
    ready: 'Alle drei Antworten liegen vor. Dies ist eine Selbstauskunft, keine Fahrzeugprüfung.',
    invalid: 'Bitte https-Inserat, 17-stellige FIN oder Beschreibung (mindestens 30 Zeichen) eingeben.',
    contact: 'Name, gültige E-Mail und Datenschutzeinwilligung sind erforderlich.',
    captcha: 'Bitte die Sicherheitsprüfung abschließen.', unavailable: 'Anfragen sind derzeit nicht verfügbar.',
    sending: 'Anfrage wird übermittelt …', sent: 'Anfrage angenommen. Referenz: ',
    failure: 'Senden nicht möglich. Bitte später erneut versuchen.',
    green: 'Angabe bestätigt (nicht unabhängig geprüft)',
    amber: 'Nachweis offen / weitere Prüfung erforderlich',
    red: 'Kritischer Widerspruch — menschliche Prüfung erforderlich',
    unknown: 'Offen'
  } : {
    loading: 'Priprema unosa …', missing: 'Nedostaju podaci — odgovorite na tri pitanja.',
    ready: 'Sva tri odgovora su uneta. Ovo su izjave korisnika, a ne pregled vozila.',
    invalid: 'Unesite https oglas, VIN od 17 znakova ili opis od najmanje 30 znakova.',
    contact: 'Obavezni su ime, ispravna e-mail adresa i saglasnost za obradu.',
    captcha: 'Završite bezbednosnu proveru.', unavailable: 'Slanje upita trenutno nije dostupno.',
    sending: 'Slanje upita …', sent: 'Upit prihvaćen. Referenca: ',
    failure: 'Slanje nije uspelo. Pokušajte kasnije.',
    green: 'Potvrđeno prema korisniku (nije nezavisno provereno)',
    amber: 'Dokaz nedostaje / potrebna provera',
    red: 'Kritično neslaganje — potrebna ljudska provera',
    unknown: 'Nepoznato'
  };
  const el = id => root.querySelector('#' + id);
  const form = el('advisor-contact');
  const cta = el('advisor-cta');
  const status = el('advisor-status');
  const input = el('listing');
  try { const saved = sessionStorage.getItem('danini-advisor-source-v1'); if (saved) { input.value = saved.slice(0,6000); sessionStorage.removeItem('danini-advisor-source-v1'); } } catch {}
  const answers = [null, null, null];
  let phase = 'idle', busy = false, captchaToken = '', captchaWidget = null;
  let serviceEnabled = false;
  const stateRows = [...root.querySelectorAll('[data-risk-row]')];
  const update = () => {
    const done = answers.every(a => a !== null);
    cta.disabled = !done || busy;
    phase = busy ? 'submitting' : done ? 'complete' : 'missing_data';
    status.textContent = done ? messages.ready : messages.missing;
    stateRows.forEach((row, i) => {
      const a = answers[i];
      const dot = row.querySelector('.dot');
      dot.className = 'dot ' + (a === null ? 'neutral' : a === 'confirmed' ? 'green' : a === 'missing' ? 'yellow' : 'red');
      row.querySelector('[data-risk-label]').textContent = a === null ? messages.unknown : a === 'confirmed' ? messages.green : a === 'missing' ? messages.amber : messages.red;
    });
  };
  phase = 'loading';
  status.textContent = messages.loading;
  root.querySelectorAll('[data-question]').forEach((card, i) => {
    card.querySelectorAll('button[data-answer]').forEach(button => {
      button.disabled = false;
      button.addEventListener('click', () => {
        if (busy) return;
        answers[i] = button.dataset.answer;
        card.querySelectorAll('button[data-answer]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        update();
      });
    });
  });
  input.addEventListener('input', () => {
    el('vehicle-identifier').textContent = (input.value.trim().slice(0,180) || '—');
  });
  // The handoff sets textarea.value programmatically; dispatch input so previews update.
  input.dispatchEvent(new Event('input', { bubbles: true }));
  const costs = ['cost-price','cost-transport','cost-fees','cost-check'].map(el);
  const total = el('cost-total');
  if (total && costs.every(Boolean)) {
    const numberFormat = new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'sr-RS', { style:'currency', currency:'EUR' });
    const recalculate = () => {
      const values = costs.map(field => field.value.trim());
      if (values.every(value => value === '')) {
        total.textContent = lang === 'de' ? 'Beträge eingeben' : 'Unesite iznose';
        return;
      }
      const nums = values.map(value => value === '' ? 0 : Number(value));
      if (nums.some(n => !Number.isFinite(n) || n < 0 || n > 10000000)) {
        total.textContent = lang === 'de' ? 'Ungültiger Betrag' : 'Neispravan iznos';
        return;
      }
      const cents = nums.reduce((sum,n) => sum + Math.round(n * 100), 0);
      total.textContent = (lang === 'de' ? 'Zwischensumme: ' : 'Zbir poznatih troškova: ') + numberFormat.format(cents / 100);
    };
    costs.forEach(field => field.addEventListener('input', recalculate));
    recalculate();
  }
  update();
  const validSource = value => {
    const v = value.trim();
    if (/^[A-HJ-NPR-Z0-9]{17}$/i.test(v)) return true;
    if (v.length >= 30 && v.length <= 6000 && !/^https?:\/\//i.test(v)) return true;
    try {
      const u = new URL(v);
      return u.protocol === 'https:' && !!u.hostname && !u.username && !u.password && v.length <= 6000;
    } catch { return false; }
  };
  const feedback = el('advisor-feedback');
  const show = message => { feedback.textContent = message; };
  function loadTurnstile(sitekey) {
    if (!sitekey || typeof sitekey !== 'string') return;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => {
      if (!window.turnstile) return;
      captchaWidget = window.turnstile.render(el('advisor-turnstile'), {
        sitekey,
        callback: token => { captchaToken = token; },
        'expired-callback': () => { captchaToken = ''; },
        'error-callback': () => { captchaToken = ''; }
      });
    };
    script.onerror = () => show(messages.unavailable);
    document.head.appendChild(script);
  }
  fetch('/api/lead/status', { headers: { accept: 'application/json' }, credentials: 'same-origin' })
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      serviceEnabled = data?.enabled === true;
      if (serviceEnabled) loadTurnstile(data.turnstileSiteKey);
      else show(messages.unavailable);
    }).catch(() => show(messages.unavailable));
  cta.addEventListener('click', async () => {
    if (cta.disabled || !answers.every(a => a !== null) || busy) return;
    const source = input.value.trim();
    if (!validSource(source)) { show(messages.invalid); input.focus(); return; }
    // Protected backend still accepts URL/VIN only; never send copied text until updated.
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(source) && !/^https:\/\//i.test(source)) { show(lang === 'de' ? 'Textprüfung bleibt lokal. Kontaktieren Sie uns für eine manuelle Prüfung.' : 'Provera teksta ostaje lokalna. Kontaktirajte nas za ručnu proveru.'); return; }
    if (!form.reportValidity() || !el('advisor-consent').checked) { show(messages.contact); return; }
    if (!serviceEnabled) { show(messages.unavailable); return; }
    if (!captchaToken) { show(messages.captcha); return; }
    const payload = {
      language: lang, source,
      answers: answers.map((value, index) => ({ question: index + 1, status: value })),
      name: el('advisor-name').value.trim(),
      email: el('advisor-email').value.trim(),
      consent: el('advisor-consent').checked,
      'cf-turnstile-response': captchaToken
    };
    busy = true;
    update();
    show(messages.sending);
    try {
      const response = await fetch('/api/ai-intake', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.accepted) throw new Error('REJECTED');
      show(messages.sent + String(data.reference || '—'));
    } catch {
      show(messages.failure);
    } finally {
      busy = false;
      captchaToken = '';
      if (window.turnstile && captchaWidget !== null) window.turnstile.reset(captchaWidget);
      update();
    }
  });
})();