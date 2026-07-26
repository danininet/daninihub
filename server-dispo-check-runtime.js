'use strict';

const express = require('express');
const { BrevoClient } = require('@getbrevo/brevo');

const attempts = new Map();
const clean = (value, max = 2000) => String(value || '').trim().slice(0, max);
const escapeHtml = value => clean(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

function allowed(ip) {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter(time => now - time < 15 * 60 * 1000);
  if (recent.length >= 5) return false;
  recent.push(now);
  attempts.set(ip, recent);
  return true;
}

function sender() {
  const email = process.env.BREVO_SENDER_EMAIL || process.env.DANINIHUB_SENDER_EMAIL || process.env.MAIL_FROM || process.env.EMAIL_FROM;
  if (!email) throw new Error('BREVO_SENDER_NOT_CONFIGURED');
  return { email, name: process.env.BREVO_SENDER_NAME || process.env.DANINIHUB_SENDER_NAME || 'DaniniHub DispoLab' };
}

function api() {
  if (!process.env.BREVO_API_KEY) throw new Error('BREVO_API_KEY_NOT_CONFIGURED');
  return new BrevoClient({ apiKey: process.env.BREVO_API_KEY }).transactionalEmails;
}

function resultProfile(score, lang) {
  const sr = lang === 'sr';
  if (score >= 80) return sr ? {
    level: 'Veoma visoka sigurnost u postupanju',
    intro: 'Vaši odgovori pokazuju veoma strukturisan pristup operativnim situacijama.',
    tips: ['Nastavite da jasno razdvajate činjenice, pretpostavke i otvorena pitanja.', 'Kod složenijih slučajeva dokumentujte vreme sledeće provere i odgovornu ulogu.', 'Vežbajte nemačku komunikaciju pod vremenskim pritiskom i sa nepotpunim podacima.']
  } : {
    level: 'Sehr hohe Handlungssicherheit',
    intro: 'Ihre Antworten zeigen ein sehr strukturiertes Vorgehen in operativen Situationen.',
    tips: ['Trennen Sie weiterhin bestätigte Fakten, Annahmen und offene Punkte.', 'Dokumentieren Sie bei komplexen Fällen den nächsten Prüfzeitpunkt und die verantwortliche Rolle.', 'Trainieren Sie deutsche Kundenkommunikation unter Zeitdruck und bei unvollständigen Informationen.']
  };
  if (score >= 65) return sr ? {
    level: 'Sigurno rešavanje mnogih standardnih situacija',
    intro: 'Vaš pristup je uglavnom pouzdan, uz nekoliko mesta za precizniju kontrolu.',
    tips: ['Pre obećanja klijentu uvek proverite izvor i pouzdanost ETA.', 'U statusnom zapisu navedite sledeću radnju, rok i odgovornu osobu.', 'Nepotvrđene informacije označite jasno i planirajte ciljanu proveru.']
  } : {
    level: 'Sicher in vielen Standardsituationen',
    intro: 'Ihr Vorgehen ist überwiegend belastbar; einzelne Kontrollschritte können präziser werden.',
    tips: ['Prüfen Sie vor Kundenzusagen immer Quelle und Belastbarkeit der ETA.', 'Halten Sie nächste Aktion, Frist und verantwortliche Person im Status fest.', 'Kennzeichnen Sie unbestätigte Informationen und planen Sie eine gezielte Prüfung.']
  };
  if (score >= 50) return sr ? {
    level: 'Operativno upotrebljivo uz jasne procedure',
    intro: 'Osnove postoje, ali bi fiksne kontrolne liste povećale sigurnost i doslednost.',
    tips: ['Koristite redosled: činjenice, rizik, komunikacija, dokumentovanje, eskalacija.', 'Ne poistovećujte poruku vozača sa potvrđenim dokazom ili konačnim statusom.', 'Kod predaje smene uvek navedite rok i ko preuzima sledeću radnju.']
  } : {
    level: 'Operativ einsetzbar mit klaren Verfahren',
    intro: 'Die Grundlagen sind vorhanden; feste Checklisten würden Sicherheit und Konsistenz erhöhen.',
    tips: ['Arbeiten Sie in der Reihenfolge Fakten, Risiko, Kommunikation, Dokumentation und Eskalation.', 'Setzen Sie eine Fahrermeldung nicht mit einem bestätigten Nachweis oder Endstatus gleich.', 'Nennen Sie bei jeder Übergabe Frist und verantwortliche Person für die nächste Aktion.']
  };
  if (score >= 35) return sr ? {
    level: 'Upotrebljivo uz podršku',
    intro: 'Prepoznajete deo problema, ali je potrebno više strukture pri proveri i predaji odgovornosti.',
    tips: ['Ne komunicirajte precizan ETA dok ključni podaci nisu potvrđeni.', 'Svaki otvoreni slučaj mora imati sledeću proveru, rok i odgovornu osobu.', 'Vežbajte razliku između statusa, dokaza i pretpostavke.']
  } : {
    level: 'Mit Unterstützung einsetzbar',
    intro: 'Sie erkennen Teile des Problems, benötigen aber mehr Struktur bei Prüfung und Verantwortungsübergabe.',
    tips: ['Kommunizieren Sie keine präzise ETA, solange Schlüsseldaten nicht bestätigt sind.', 'Jeder offene Fall braucht nächsten Prüfpunkt, Frist und verantwortliche Person.', 'Trainieren Sie die Unterscheidung zwischen Status, Nachweis und Annahme.']
  };
  return sr ? {
    level: 'Potrebne su osnove',
    intro: 'Pre samostalnog rada preporučuje se sistematsko vežbanje osnovnih operativnih postupaka.',
    tips: ['Prvo proverite činjenice, pa tek onda komunicirajte procenu.', 'Nikada ne predstavljajte nepotpun dokument kao potvrđen dokaz.', 'Koristite standardnu check-listu za eskalaciju i predaju smene.']
  } : {
    level: 'Grundlagen erforderlich',
    intro: 'Vor selbstständigem Einsatz empfiehlt sich ein systematisches Training der operativen Grundlagen.',
    tips: ['Prüfen Sie zuerst die Fakten und kommunizieren Sie erst danach eine Einschätzung.', 'Stellen Sie ein unvollständiges Dokument niemals als bestätigten Nachweis dar.', 'Nutzen Sie eine feste Checkliste für Eskalation und Schichtübergabe.']
  };
}

function userEmail(data) {
  const sr = data.language === 'sr';
  const score = Number(data.score);
  const profile = resultProfile(score, data.language);
  const productUrl = `${String(process.env.DANINI_PUBLIC_URL || 'https://daninihub.com').replace(/\/$/, '')}${sr ? '/sr/dispo-lab' : '/de/dispolab'}`;
  const subject = sr ? `Vaš DaniniHub Dispatch Readiness rezultat: ${score}/100` : `Ihr DaniniHub Dispatch Readiness Ergebnis: ${score}/100`;
  const body = sr ? `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#17212b">
      <div style="background:#07131f;color:#fff;padding:28px;border-radius:14px 14px 0 0"><div style="color:#64dce7;font-size:12px;font-weight:800;letter-spacing:1.4px">DANINIHUB DISPOLAB</div><h1 style="margin:10px 0 0">Vaš rezultat: ${score}/100</h1></div>
      <div style="border:1px solid #d9e3e7;border-top:0;padding:28px;border-radius:0 0 14px 14px">
        <h2>${escapeHtml(profile.level)}</h2><p>${escapeHtml(profile.intro)}</p>
        <h3>Tri preporuke za sledeći korak</h3><ol>${profile.tips.map(tip => `<li style="margin:0 0 10px">${escapeHtml(tip)}</li>`).join('')}</ol>
        <div style="background:#eef8fa;border-left:4px solid #13a8b6;padding:16px 18px;margin:24px 0"><strong>Puni Dispatch Readiness Check – planirana cena 29 €</strong><br>10 detaljnijih simulacija, analiza po kompetencijama i personalizovani završni izveštaj. Proizvod je trenutno u fazi ranog pristupa; prijava ne predstavlja kupovinu.</div>
        <p><a href="${escapeHtml(productUrl)}" style="display:inline-block;background:#087f8c;color:#fff;padding:13px 19px;border-radius:8px;text-decoration:none;font-weight:800">Pogledaj DispoLab i prijavi interesovanje</a></p>
        <p style="font-size:13px;color:#62737d">Rezultat je edukativna DaniniHub procena na osnovu simuliranih situacija. Nije zvanična kvalifikacija niti garancija zaposlenja.</p>
        <p>Srdačan pozdrav,<br>Dragan Zdravković<br>DaniniHub</p>
      </div>
    </div>` : `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#17212b">
      <div style="background:#07131f;color:#fff;padding:28px;border-radius:14px 14px 0 0"><div style="color:#64dce7;font-size:12px;font-weight:800;letter-spacing:1.4px">DANINIHUB DISPOLAB</div><h1 style="margin:10px 0 0">Ihr Ergebnis: ${score}/100</h1></div>
      <div style="border:1px solid #d9e3e7;border-top:0;padding:28px;border-radius:0 0 14px 14px">
        <h2>${escapeHtml(profile.level)}</h2><p>${escapeHtml(profile.intro)}</p>
        <h3>Drei Empfehlungen für den nächsten Schritt</h3><ol>${profile.tips.map(tip => `<li style="margin:0 0 10px">${escapeHtml(tip)}</li>`).join('')}</ol>
        <div style="background:#eef8fa;border-left:4px solid #13a8b6;padding:16px 18px;margin:24px 0"><strong>Vollständiger Dispatch Readiness Check – geplanter Preis 29 €</strong><br>10 vertiefende Simulationen, Kompetenzanalyse und personalisierter Abschlussbericht. Das Produkt befindet sich derzeit im Early Access; die Interessensmeldung ist kein Kauf.</div>
        <p><a href="${escapeHtml(productUrl)}" style="display:inline-block;background:#087f8c;color:#fff;padding:13px 19px;border-radius:8px;text-decoration:none;font-weight:800">DispoLab ansehen und Interesse vormerken</a></p>
        <p style="font-size:13px;color:#62737d">Das Ergebnis ist eine edukative DaniniHub-Einschätzung auf Grundlage simulierter Situationen. Es ist keine offizielle Qualifikation und keine Beschäftigungsgarantie.</p>
        <p>Freundliche Grüße<br>Dragan Zdravković<br>DaniniHub</p>
      </div>
    </div>`;
  return { subject, body, profile };
}

function mountDispoCheckRuntime(app) {
  app.post('/api/dispo-check/result', express.json({ limit: '40kb' }), async (req, res) => {
    if (!allowed(req.ip || req.socket?.remoteAddress || 'global')) return res.status(429).json({ ok: false, error: 'RATE_LIMITED' });
    const data = {
      language: req.body?.language === 'de' ? 'de' : 'sr',
      name: clean(req.body?.name, 100),
      email: clean(req.body?.email, 180),
      role: clean(req.body?.role, 120),
      score: Number(req.body?.score),
      level: clean(req.body?.level, 160),
      consent: clean(req.body?.consent, 20),
      website: clean(req.body?.website, 120)
    };
    if (data.website) return res.json({ ok: true });
    if (!data.name || !/^\S+@\S+\.\S+$/.test(data.email) || !Number.isFinite(data.score) || data.score < 0 || data.score > 100 || data.consent !== 'yes') {
      return res.status(400).json({ ok: false, error: 'INVALID_RESULT_DATA' });
    }
    try {
      const from = sender();
      const mail = userEmail(data);
      const client = api();
      const deliveries = await Promise.allSettled([
        client.sendTransacEmail({ sender: from, to: [{ email: data.email, name: data.name }], replyTo: { email: 'info@daninihub.com', name: 'DaniniHub' }, subject: mail.subject, htmlContent: mail.body }),
        client.sendTransacEmail({ sender: from, to: [{ email: 'info@daninihub.com', name: 'DaniniHub' }], replyTo: { email: data.email, name: data.name }, subject: `[Dispo-Check ${data.score}/100] ${data.name}`, htmlContent: `<h2>Neuer Dispo-Check Lead</h2><p><strong>Name:</strong> ${escapeHtml(data.name)}<br><strong>E-Mail:</strong> ${escapeHtml(data.email)}<br><strong>Rolle:</strong> ${escapeHtml(data.role || '—')}<br><strong>Sprache:</strong> ${escapeHtml(data.language)}<br><strong>Score:</strong> ${data.score}/100<br><strong>Niveau:</strong> ${escapeHtml(mail.profile.level)}</p><p>Interesse am vollständigen Dispatch Readiness Check zum geplanten Preis von 29 €.</p>` })
      ]);
      if (deliveries.every(item => item.status === 'rejected')) throw deliveries[0].reason || new Error('EMAIL_DELIVERY_FAILED');
      return res.json({ ok: true, score: data.score, level: mail.profile.level, deliveryPartial: deliveries.some(item => item.status === 'rejected') });
    } catch (error) {
      console.error('Dispo-Check result email failed:', error.message);
      return res.status(503).json({ ok: false, error: 'RESULT_EMAIL_FAILED' });
    }
  });
}

module.exports = { mountDispoCheckRuntime, resultProfile, userEmail };
