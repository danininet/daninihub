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
  // Keep native submission disabled without an inline handler forbidden by CSP.
  form.addEventListener('submit', event => event.preventDefault());
  const cta = el('advisor-cta');
  const status = el('advisor-status');
  const input = el('listing');
  try { const saved = sessionStorage.getItem('danini-advisor-source-v1'); if (saved) { input.value = saved.slice(0,6000); sessionStorage.removeItem('danini-advisor-source-v1'); } } catch {}
  // Protected Workers AI analysis with an explicitly labelled rules fallback.
  const analysisPanel = document.createElement('section');
  analysisPanel.setAttribute('aria-label', lang === 'de' ? 'Inserat-Vorprüfung' : 'Preliminarna provera oglasa');
  analysisPanel.style.cssText='margin:1rem 0;padding:1rem;border:1px solid currentColor;border-radius:0.75rem;overflow-wrap:anywhere';
  // Normalize user-pasted public listing addresses without fetching protected portals.
  // Users often paste mobile share links without a scheme or with http://.
  const normalizedSource = raw => {
    const value = raw.trim();
    if (!value || /\s/.test(value) || value.length > 6000) return value;
    if (/^https?:\/\//i.test(value)) {
      try { const u = new URL(value); if (u.protocol === 'http:' && u.username === '' && u.password === '') { u.protocol = 'https:'; return u.href; } } catch {}
      return value;
    }
    if (/^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[\/?#][^\s]*)?$/i.test(value)) {
      try { const u = new URL('https://' + value); if (!u.username && !u.password) return u.href; } catch {}
    }
    return value;
  };
  const listingSource = () => normalizedSource(input.value);
  const previewListingUrl = source => {
    try { const u = new URL(source);
      if (u.protocol !== 'https:' || !u.hostname.includes('.') || u.username || u.password) return null;
      if (u.hostname === 'localhost' || /^(?:127|10|192\.168)\./.test(u.hostname)) return null;
      return u;
    } catch { return null; }
  };
  const analysisButton = document.createElement('button');
  analysisButton.type='button';
  analysisButton.className='advisor-analysis-button';
  analysisButton.textContent=lang==='de'?'Inserat oder Link prüfen':'Proveri oglas ili link';
  const analysisHelp=document.createElement('p');
  analysisHelp.textContent=lang==='de'?'Ein Link reicht für die Quellenprüfung. Der Portalinhalt wird nur mit erlaubtem Zugriff gelesen; ohne diesen bleiben Fahrzeugdaten offen. Für die Auswertung sichtbarer Daten wählen Sie einen Screenshot oder erfassen Sie einmalig den geöffneten Inserat-Tab.':'Sam link je dovoljan za proveru izvora. Sadržaj oglasa se ne preuzima bez dozvoljenog pristupa; tada podaci o vozilu ostaju nepoznati. Za analizu vidljivih podataka izaberite screenshot ili preuzmite jednu sliku otvorenog taba.';
  const screenshotInput=el('listing-screenshot');
  const captureButton=el('listing-capture-tab');
  const captureStatus=el('listing-capture-status');
  const capturePreview=el('listing-capture-preview');
  let capturedTabImage=null;
  const clearCapturedTab=()=>{
    capturedTabImage=null;
    if(capturePreview){capturePreview.hidden=true;capturePreview.removeAttribute('src');}
  };
  screenshotInput?.addEventListener('change',clearCapturedTab);
  // User-initiated, one-frame capture of a browser TAB. Never run continuously,
  // silently capture a screen/window, or pull the third-party page with fetch.
  captureButton?.addEventListener('click',async()=>{
    if(!navigator.mediaDevices?.getDisplayMedia){
      captureStatus.textContent=lang==='de'?'Tab-Freigabe wird in diesem Browser nicht unterstützt. Bitte Screenshot auswählen.':'Ovaj browser ne podržava deljenje taba. Izaberite screenshot.';
      return;
    }
    clearCapturedTab();
    let stream=null;
    captureButton.disabled=true;
    try{
      stream=await navigator.mediaDevices.getDisplayMedia({
        video:{displaySurface:'browser'},
        audio:false,
        preferCurrentTab:false,
        selfBrowserSurface:'exclude',
        surfaceSwitching:'exclude'
      });
      const track=stream.getVideoTracks()[0];
      if(!track||track.getSettings().displaySurface!=='browser'){
        throw Error('tab_required');
      }
      const video=document.createElement('video');
      video.muted=true;
      video.playsInline=true;
      video.srcObject=stream;
      await video.play();
      if(!video.videoWidth||!video.videoHeight)throw Error('empty_frame');
      const scale=Math.min(1,1400/Math.max(video.videoWidth,video.videoHeight));
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(video.videoWidth*scale));
      canvas.height=Math.max(1,Math.round(video.videoHeight*scale));
      canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);
      let quality=.78;
      let image=canvas.toDataURL('image/jpeg',quality);
      while(image.length>1100000&&quality>.4){
        quality-=.12;
        image=canvas.toDataURL('image/jpeg',quality);
      }
      if(image.length>1100000)throw Error('image_too_large');
      capturedTabImage=image;
      capturePreview.src=image;
      capturePreview.hidden=false;
      captureStatus.textContent=lang==='de'?'Ein Bild des ausgewählten Tabs wurde erfasst. Prüfen Sie die Vorschau und klicken Sie auf „Inserat oder Link prüfen“.':'Jedna slika izabranog taba je preuzeta. Proverite prikaz i kliknite „Proveri oglas ili link“.';
    }catch(error){
      captureStatus.textContent=error?.message==='tab_required'
        ?(lang==='de'?'Bitte ausschließlich einen Browser-Tab auswählen, nicht den Bildschirm oder ein Fenster.':'Izaberite samo browser tab, ne ceo ekran ili prozor.')
        :(lang==='de'?'Tab-Erfassung nicht möglich. Bitte Screenshot auswählen.':'Nije moguće preuzeti tab. Izaberite screenshot.');
    }finally{
      stream?.getTracks().forEach(track=>track.stop());
      captureButton.disabled=false;
    }
  });
  const compressScreenshot=async file=>{
    if(!file) return null;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024)throw Error('invalid_image');
    const bmp=await createImageBitmap(file);
    try{
      const scale=Math.min(1,1400/Math.max(bmp.width,bmp.height));
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(bmp.width*scale));
      canvas.height=Math.max(1,Math.round(bmp.height*scale));
      canvas.getContext('2d').drawImage(bmp,0,0,canvas.width,canvas.height);
      let quality=.78;
      let data=canvas.toDataURL('image/jpeg',quality);
      while(data.length>1100000&&quality>.4){quality-=.12;data=canvas.toDataURL('image/jpeg',quality);}
      if(data.length>1100000)throw Error('image_too_large');
      return data;
    }finally{bmp.close();}
  };
  const analysisOutput=document.createElement('div');
  analysisOutput.setAttribute('role','status');
  analysisOutput.setAttribute('aria-live','polite');
  analysisPanel.append(analysisButton,analysisHelp,analysisOutput);
  input.insertAdjacentElement('afterend',analysisPanel);
  analysisButton.addEventListener('click',async()=>{
    if(analysisButton.disabled)return;
    analysisButton.disabled=true;
    analysisOutput.textContent=lang==='de'?'Eingabe wird sicher geprüft …':'Bezbedna provera unosa …';
    try{
      const source=listingSource();
      const file=screenshotInput?.files?.[0];
      if (source !== input.value.trim()) { input.value = source; input.dispatchEvent(new Event('input', {bubbles:true})); }
      if(!source&&!file&&!capturedTabImage){analysisOutput.textContent=lang==='de'?'Bitte Link, Text oder Screenshot eingeben.':'Unesite link, tekst ili screenshot.';return;}
      // Link-only preview is free of CAPTCHA/network calls. It is source recognition,
      // not a fabricated vehicle analysis; a screenshot/text is needed for actual data.
      const preview=previewListingUrl(source);
      if(preview && !file && !capturedTabImage && !captchaToken){
        const hostname=preview.hostname.replace(/^www\./,'');
        const platform=hostname.endsWith('mobile.de')?'mobile.de':hostname.endsWith('autoscout24.de')?'AutoScout24':hostname.endsWith('kleinanzeigen.de')?'Kleinanzeigen':hostname;
        analysisOutput.replaceChildren();
        const p=document.createElement('p');
        p.textContent=lang==='de'
          ? 'Link erkannt ('+platform+'). Bitte Sicherheitsprüfung bestätigen und erneut auf Prüfen klicken, damit verfügbare Inseratdaten geprüft werden können.'
          : 'Link prihvaćen ('+platform+'). Potvrdite bezbednosnu proveru i ponovo kliknite Proveri da se analiziraju dostupni podaci oglasa.';
        analysisOutput.append(p);
        const open=document.createElement('a');open.href=preview.href;open.target='_blank';open.rel='noopener noreferrer';
        open.textContent=lang==='de'?'Originalinserat öffnen':'Otvori originalni oglas';analysisOutput.append(open);
        const upload=document.createElement('button');upload.type='button';upload.className='advisor-analysis-button';
        upload.textContent=lang==='de'?'Screenshot hinzufügen':'Dodaj screenshot';
        upload.addEventListener('click',()=>screenshotInput?.click());analysisOutput.append(upload);
        return;
      }
      if(source && !preview && /^https?:\/\//i.test(source)) {analysisOutput.textContent=messages.invalid;return;}
      if(!captchaToken){analysisOutput.textContent=messages.captcha;return;}
      const image=capturedTabImage||await compressScreenshot(file);
      const res=await fetch('/api/vehicle-analysis',{method:'POST',headers:{'content-type':'application/json',accept:'application/json'},credentials:'same-origin',body:JSON.stringify({language:lang,source,...(image?{image}:{}),turnstileToken:captchaToken})});
      const data=await res.json();
      if(!res.ok){
        analysisOutput.textContent=data.message||(lang==='de'?'Prüfung nicht möglich: ':'Provera nije uspela: ')+String(data.error||res.status);
        return;
      }
      analysisOutput.replaceChildren();
      const line=(label,value)=>{
        const p=document.createElement('p');
        const b=document.createElement('strong');
        b.textContent=label+': ';
        p.append(b,document.createTextNode(String(value??'—')));
        analysisOutput.append(p);
      };
      line(lang==='de'?'Verfahren':'Metod',data.disclaimer);
      if(data.sourceType==='user_supplied_screenshot'){
        line(lang==='de'?'Bildverarbeitung':'Obrada slike',lang==='de'?'Sichtbare Inseratsangaben aus Ihrem Screenshot, nicht unabhängig bestätigt.':'Izdvojeni vidljivi podaci sa screenshota; bez nezavisne potvrde.');
      }
      if(data.sourceType==='licensed_listing'||data.sourceType==='authorized_listing'){
        line(lang==='de'?'Datenquelle':'Izvor podataka',data.sourcePlatform+' — '+(lang==='de'?'ausgelesene Inseratsangaben, nicht unabhängig geprüft':'izdvojeni navodi iz oglasa, nezavisno nepotvrđeni'));
        const open=document.createElement('a');open.href=data.sourceUrl;open.target='_blank';open.rel='noopener noreferrer';
        open.textContent=lang==='de'?'Originalinserat öffnen':'Otvori originalni oglas';open.className='advisor-email-fallback';analysisOutput.append(open);
      }
      if(data.sourceType==='listing_url'){
        line(lang==='de'?'Erkannte Quelle':'Prepoznat izvor',data.sourcePlatform);
        line(lang==='de'?'Inhalt abgerufen':'Sadržaj preuzet',lang==='de'?'Nein – keine Fahrzeugdaten verfügbar':'Ne – podaci o vozilu nisu dostupni');
        if(data.sourcePlatform==='mobile.de'&&data.providerStatus==='not_configured')
          line(lang==='de'?'Mobile.de API':'Mobile.de API',lang==='de'?'Noch kein lizenzierter Datenzugang eingerichtet':'Licencirani pristup podacima još nije podešen');
        const open=document.createElement('a');open.href=data.sourceUrl;open.target='_blank';open.rel='noopener noreferrer';open.textContent=lang==='de'?'Originalinserat beim Anbieter öffnen':'Otvori originalni oglas';analysisOutput.append(open);
        const screenshots=document.createElement('a');
        screenshots.href='mailto:auto@daninihub.com?subject='+encodeURIComponent('AutoDanini – Screenshots zum Inserat')+'&body='+encodeURIComponent((lang==='de'?'Bitte fügen Sie Screenshots manuell als Anhang hinzu. Inserat: ':'Dodajte screenshotove kao prilog e-mailu. Oglas: ')+data.sourceUrl);
        screenshots.textContent=lang==='de'?'Screenshots per E-Mail zur manuellen Prüfung senden':'Pošalji screenshotove za ručnu proveru mejlom';screenshots.className='advisor-email-fallback';analysisOutput.append(screenshots);
      }
      if(data.sourceType==='listing_url'&&!data.listingFetched){
        const note=document.createElement('p');note.className='advisor-source-fallback';
        note.textContent=lang==='de'
          ?'Für diesen Link liegen DANINI keine lesbaren Fahrzeugangaben vor. Bitte wählen Sie oben einen Screenshot des Inserats und klicken Sie erneut auf „Inserat oder Link prüfen“. Daraus kann die KI sichtbare Daten auslesen.'
          :'Za ovaj link DANINI nema dostupne podatke o vozilu. Izaberite screenshot oglasa iznad i ponovo kliknite „Proveri oglas ili link“. AI tada može da izdvoji vidljive podatke.';
        analysisOutput.append(note);
        if(screenshotInput){const upload=document.createElement('button');upload.type='button';upload.textContent=lang==='de'?'Screenshot auswählen':'Izaberi screenshot';upload.className='advisor-analysis-button';upload.addEventListener('click',()=>screenshotInput.click());analysisOutput.append(upload);}
        if(captureButton){const takeTab=document.createElement('button');takeTab.type='button';takeTab.textContent=lang==='de'?'Geöffnetes Inserat-Tab erfassen':'Preuzmi sliku otvorenog taba';takeTab.className='advisor-analysis-button';takeTab.addEventListener('click',()=>captureButton.click());analysisOutput.append(takeTab);}
        return;
      }
      const names={brand:'Marka',model:'Model',year:'Godina',mileageKm:'Kilometraža (km)',priceEur:'Cena (EUR)',fuel:'Gorivo',gearbox:'Menjač'};
      const deNames={brand:'Marke',model:'Modell',year:'Baujahr',mileageKm:'Kilometer',priceEur:'Preis (EUR)',fuel:'Kraftstoff',gearbox:'Getriebe'};
      for(const [key,label] of Object.entries(lang==='de'?deNames:names))line(label,data.fields?.[key]);
      line(lang==='de'?'Fehlende Angaben':'Nedostajući podaci',(data.missing||[]).map(key => (lang==='de'?deNames:names)[key] || key).join(', ')||'—');
      for(const risk of data.warnings||[])line(lang==='de'?'Hinweis':'Napomena',risk);
      if(data.aiUsed===true){
        line(lang==='de'?'KI-Status':'AI status',lang==='de'?'KI-Auswertung des kopierten Inseratstextes':'AI analiza kopiranog teksta oglasa');
        for(const item of data.aiRisks||[])line(lang==='de'?'KI-Risiko (unbestätigt)':'AI rizik (nepotvrđeno)',item.evidence+' — '+item.concern);
        const aiTitle=document.createElement('strong');aiTitle.textContent=lang==='de'?'Weitere KI-Fragen an den Verkäufer':'Dodatna AI pitanja za prodavca';
        analysisOutput.append(aiTitle);
        const aiUl=document.createElement('ul');
        for(const q of data.aiSellerQuestions||[]){const li=document.createElement('li');li.textContent=q;aiUl.append(li);}
        analysisOutput.append(aiUl);
      }else if(data.sourceType!=='listing_url'){
        line(lang==='de'?'KI nicht verfügbar':'AI nije dostupan',lang==='de'?'Nur regelbasierte Vorprüfung; keine KI-Analyse ausgeführt.':'Prikazana je samo preliminarna provera; AI analiza nije izvršena.');
      }
      const h=document.createElement('strong');h.textContent=lang==='de'?'Fragen an den Verkäufer':'Pitanja za prodavca';analysisOutput.append(h);
      const ul=document.createElement('ul');
      for(const q of data.questions||[]){const li=document.createElement('li');li.textContent=q;ul.append(li);}
      analysisOutput.append(ul);
      const next=document.createElement('a');
      next.href='#advisor-contact';
      next.textContent=lang==='de'?'Detailliertes Fahrzeugdossier anfragen':'Zatraži detaljan dosije vozila';
      next.className='advisor-email-fallback';
      analysisOutput.append(next);
    }catch{analysisOutput.textContent=lang==='de'?'Verbindung fehlgeschlagen. Bitte erneut versuchen.':'Veza nije uspela. Pokušajte ponovo.';}
    finally{analysisButton.disabled=false;captchaToken='';if(window.turnstile&&captchaWidget!==null)window.turnstile.reset(captchaWidget);}
  });
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
      if (data?.turnstileSiteKey) loadTurnstile(data.turnstileSiteKey);
      if (!serviceEnabled) show(messages.unavailable);
    }).catch(() => show(messages.unavailable));
  cta.addEventListener('click', async () => {
    if (cta.disabled || !answers.every(a => a !== null) || busy) return;
    const source = listingSource();
    if (source !== input.value.trim()) { input.value = source; input.dispatchEvent(new Event('input', {bubbles:true})); }
    if (!validSource(source)) { show(messages.invalid); input.focus(); return; }
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