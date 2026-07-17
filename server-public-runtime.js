'use strict';

const { SITE_URL, SITE_ROUTES, UI_COPY, LEGAL_KEYS, PUBLIC_KEYS, escapeHtml, legalLabel, renderPage } = require('./core/site-ui');
const { UPDATED, getLegalDocument } = require('./core/site-legal-content');

const marketing = {
  de: {
    home: ['Eine bessere Antwort beginnt mit den richtigen Rückfragen.', 'Beschreiben Sie Ihre konkrete Situation. Nach genau drei aufeinander aufbauenden Rückfragen erhalten Sie eine persönliche Analyse mit Entscheidung, Risiken und priorisierten nächsten Schritten.'],
    method: ['Vier Antworten statt endlosem Chat.', 'Die Ausgangsfrage erfasst Ihr Ziel. Jede der drei Rückfragen greift Ihre vorherige Antwort auf und klärt genau eine offene Annahme.'],
    project: ['Ihre Angaben bestimmen das Ergebnis.', 'Die Analyse trennt belegte Informationen von Annahmen, benennt fehlende Daten und ordnet die Situation als GO, REDEFINE oder STOP ein.'],
    levels: ['12 EUR. Einmalig. Ohne Abo.', 'Im Preis enthalten sind der geführte Dialog, die persönliche Abschlussanalyse, ein PDF-Dokument und die Zustellung per E-Mail.'],
    artifacts: ['Ein Ergebnis, mit dem Sie weiterarbeiten können.', 'Das PDF dokumentiert Ausgangslage, Kernerkenntnisse, offene Annahmen, Entscheidung, Risiken und konkrete nächste Schritte.'],
    activation: ['Starten Sie Ihre persönliche Analyse.', 'Nach der Zahlung über Gumroad erhalten Sie Ihren persönlichen Zugangslink per E-Mail.'],
    trust: ['Klar über Leistung, Daten und Grenzen.', 'DaniniHub erklärt verständlich, wie KI, Datenverarbeitung, Zahlung, Widerruf und Verantwortung im Produkt behandelt werden.'],
    stepLabel: 'So funktioniert es', resultLabel: 'Im Ergebnis enthalten', priceLabel: 'Ein Produkt. Ein klarer Preis.',
    steps: [['01', 'Situation beschreiben', 'Nennen Sie das konkrete Problem, die anstehende Entscheidung und das gewünschte Ergebnis.'], ['02', 'Drei Rückfragen beantworten', 'Jede Rückfrage bezieht sich auf Ihre Angaben und klärt einen entscheidenden offenen Punkt.'], ['03', 'Analyse erhalten', 'Sie erhalten Einordnung, Risiken und einen priorisierten Handlungsplan als PDF und per E-Mail.']],
    features: [['Konkrete Ausgangslage', 'Keine allgemeine Coaching-Zusammenfassung.'], ['Belegte Erkenntnisse', 'Aussagen werden an Ihre Antworten gebunden.'], ['Offene Annahmen', 'Unbekanntes wird nicht als Tatsache ausgegeben.'], ['Nächste Schritte', 'Prioritäten für 72 Stunden und sieben Tage.']],
    oneTime: 'einmalig · keine automatische Verlängerung', trustTitle: 'Transparenz ist Teil des Produkts.', trustText: 'Die Analyse kann Fehler enthalten und ersetzt keine Fachberatung. Sensible Daten gehören nicht in den Dialog.'
  },
  sr: {
    home: ['Bolji odgovor počinje pravim podpitanjima.', 'Opišite konkretnu situaciju. Nakon tačno tri povezana podpitanja dobijate ličnu analizu sa odlukom, rizicima i prioritetnim sledećim koracima.'],
    method: ['Četiri odgovora umesto beskonačnog chata.', 'Početno pitanje definiše cilj. Svako od tri podpitanja koristi prethodni odgovor i razjašnjava jednu otvorenu pretpostavku.'],
    project: ['Vaši odgovori određuju rezultat.', 'Analiza odvaja potvrđene informacije od pretpostavki, označava šta nedostaje i daje procenu GO, REDEFINE ili STOP.'],
    levels: ['12 EUR. Jednokratno. Bez pretplate.', 'U cenu ulaze vođeni razgovor, lična završna analiza, PDF dokument i isporuka emailom.'],
    artifacts: ['Rezultat koji možete odmah da koristite.', 'PDF dokumentuje polaznu situaciju, ključne uvide, otvorene pretpostavke, odluku, rizike i konkretne sledeće korake.'],
    activation: ['Pokrenite ličnu analizu.', 'Nakon plaćanja preko Gumroad-a, lični pristupni link stiže emailom.'],
    trust: ['Jasno o usluzi, podacima i granicama.', 'DaniniHub objašnjava kako proizvod koristi AI, obrađuje podatke, naplaćuje uslugu i razgraničava odgovornost.'],
    stepLabel: 'Kako funkcioniše', resultLabel: 'Šta dobijate', priceLabel: 'Jedan proizvod. Jasna cena.',
    steps: [['01', 'Opišite situaciju', 'Navedite konkretan problem, odluku koja je pred vama i rezultat koji očekujete.'], ['02', 'Odgovorite na tri podpitanja', 'Svako podpitanje koristi vaše odgovore i razjašnjava jednu ključnu nepoznanicu.'], ['03', 'Preuzmite analizu', 'Dobijate procenu, rizike i prioritetan plan u PDF-u i emailu.']],
    features: [['Konkretna polazna situacija', 'Bez opšte coaching analize.'], ['Uvidi zasnovani na odgovorima', 'Tvrdnje su vezane za vaš unos.'], ['Otvorene pretpostavke', 'Nepoznato se ne predstavlja kao činjenica.'], ['Sledeći koraci', 'Prioriteti za 72 sata i sedam dana.']],
    oneTime: 'jednokratno · bez automatskog produženja', trustTitle: 'Transparentnost je deo proizvoda.', trustText: 'Analiza može sadržati greške i nije stručni savet. Ne unosite osetljive podatke.'
  },
  en: {
    home: ['A better answer starts with the right follow-up questions.', 'Describe your specific situation. After exactly three connected follow-up questions, receive a personal analysis with a decision, risks and prioritized next steps.'],
    method: ['Four answers instead of an endless chat.', 'The opening question establishes your goal. Each of three follow-ups uses your previous answer to resolve one open assumption.'],
    project: ['Your answers determine the result.', 'The analysis separates supported information from assumptions, identifies missing facts and provides a GO, REDEFINE or STOP assessment.'],
    levels: ['12 EUR. One-time. No subscription.', 'The price includes the guided dialogue, personal final analysis, PDF document and email delivery.'],
    artifacts: ['A result you can act on.', 'The PDF documents the starting point, key insights, open assumptions, decision, risks and concrete next actions.'],
    activation: ['Start your personal analysis.', 'After payment through Gumroad, your personal access link is delivered by email.'],
    trust: ['Clear about the service, data and limits.', 'DaniniHub explains how the product uses AI, processes data, handles payment, withdrawal and responsibility.'],
    stepLabel: 'How it works', resultLabel: 'Included in the result', priceLabel: 'One product. One clear price.',
    steps: [['01', 'Describe the situation', 'State the specific problem, the decision ahead and the result you need.'], ['02', 'Answer three follow-ups', 'Each follow-up uses your answers and resolves one critical unknown.'], ['03', 'Receive the analysis', 'Get an assessment, risks and prioritized plan as PDF and by email.']],
    features: [['Specific starting point', 'No generic coaching summary.'], ['Answer-based insights', 'Claims remain tied to your input.'], ['Open assumptions', 'Unknowns are not presented as facts.'], ['Next actions', 'Priorities for 72 hours and seven days.']],
    oneTime: 'one-time · no automatic renewal', trustTitle: 'Transparency is part of the product.', trustText: 'The analysis may contain errors and is not professional advice. Do not submit sensitive data.'
  }
};

function renderSteps(lang) {
  const m = marketing[lang];
  return `<section class="section"><div class="section-head"><span class="eyebrow">${escapeHtml(m.stepLabel)}</span><h2>${escapeHtml(m.home[0])}</h2></div><div class="grid">${m.steps.map(([number, title, text]) => `<article class="card"><span class="card-number">${number}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join('')}</div></section>`;
}

function renderResult(lang) {
  const m = marketing[lang];
  return `<section class="section"><div class="section-head"><span class="eyebrow">${escapeHtml(m.resultLabel)}</span><h2>${escapeHtml(m.artifacts[0])}</h2><p>${escapeHtml(m.artifacts[1])}</p></div><div class="feature-list">${m.features.map(([title, text]) => `<div class="feature"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span></div>`).join('')}</div></section>`;
}

function renderPrice(lang) {
  const m = marketing[lang];
  const t = UI_COPY[lang];
  return `<section class="price-panel"><div><span class="eyebrow">${escapeHtml(m.priceLabel)}</span><h2>${escapeHtml(m.levels[0])}</h2><p>${escapeHtml(m.levels[1])}</p></div><div class="price-box"><span class="price">12 €</span><small>${escapeHtml(m.oneTime)}</small><a class="button-primary" href="/api/entry/12-eur/checkout">${escapeHtml(t.start)}</a></div></section>`;
}

function renderTrustNote(lang) {
  const m = marketing[lang];
  return `<section class="section"><div class="card"><span class="eyebrow">${escapeHtml(UI_COPY[lang].legal)}</span><h2>${escapeHtml(m.trustTitle)}</h2><p>${escapeHtml(m.trustText)}</p><div class="actions"><a class="button-secondary" href="${SITE_ROUTES[lang].trust}">${escapeHtml(UI_COPY[lang].nav[4])}</a><a class="button-secondary" href="${SITE_ROUTES[lang].privacy}">${escapeHtml(legalLabel(lang, 'privacy'))}</a><a class="button-secondary" href="${SITE_ROUTES[lang].ai}">${escapeHtml(legalLabel(lang, 'ai'))}</a></div></div></section>`;
}

function renderMarketing(lang, key) {
  const m = marketing[lang];
  const pair = m[key] || m.home;
  const body = `<section class="hero${key === 'home' ? '' : ' compact'}"><span class="badge">${escapeHtml(UI_COPY[lang].claim)} · 12 EUR</span><h1>${escapeHtml(pair[0])}</h1><p class="lead">${escapeHtml(pair[1])}</p><div class="actions"><a class="button-primary" href="/api/entry/12-eur/checkout">${escapeHtml(UI_COPY[lang].start)}</a><a class="button-secondary" href="${SITE_ROUTES[lang].method}">${escapeHtml(UI_COPY[lang].nav[0])}</a></div></section>${renderSteps(lang)}${renderResult(lang)}${renderPrice(lang)}${renderTrustNote(lang)}`;
  return renderPage({ lang, pageKey: key, title: pair[0], description: pair[1], body });
}

function renderTrustIndex(lang) {
  const m = marketing[lang];
  const body = `<section class="legal-masthead"><div class="breadcrumbs"><a href="${SITE_ROUTES[lang].home}">DaniniHub</a><span>›</span><span>${escapeHtml(UI_COPY[lang].legal)}</span></div><span class="eyebrow">${escapeHtml(UI_COPY[lang].nav[4])}</span><h1>${escapeHtml(m.trust[0])}</h1><p class="lead">${escapeHtml(m.trust[1])}</p></section><section class="trust-index">${LEGAL_KEYS.map((key, index) => { const doc = getLegalDocument(lang, key); return `<a class="trust-card" href="${SITE_ROUTES[lang][key]}"><small>${String(index + 1).padStart(2, '0')}</small><h2>${escapeHtml(doc.title)}</h2><p>${escapeHtml(doc.intro)}</p></a>`; }).join('')}</section>`;
  return renderPage({ lang, pageKey: 'trust', title: m.trust[0], description: m.trust[1], body });
}

function sectionId(index) {
  return `abschnitt-${index + 1}`;
}

function renderLegal(lang, key) {
  const doc = getLegalDocument(lang, key);
  const translatedNote = doc.translated
    ? `<div class="legal-note"><strong>${lang === 'sr' ? 'Informativni prevod' : 'Informational translation'}</strong>${escapeHtml(UI_COPY[lang].primary)}</div>`
    : '';
  const toc = `<aside class="legal-toc" aria-label="Document navigation"><strong>${escapeHtml(UI_COPY[lang].legal)}</strong>${doc.sections.map((section, index) => `<a href="#${sectionId(index)}">${escapeHtml(section[0])}</a>`).join('')}</aside>`;
  const article = `<article class="legal-document">${translatedNote}${doc.sections.map((section, index) => `<section id="${sectionId(index)}"><h2>${escapeHtml(section[0])}</h2>${section[1]}</section>`).join('')}<nav class="legal-next"><a href="${SITE_ROUTES[lang].trust}">← ${escapeHtml(UI_COPY[lang].nav[4])}</a><a href="mailto:dragangaganet@gmail.com">${lang === 'de' ? 'Kontakt' : lang === 'sr' ? 'Kontakt' : 'Contact'} →</a></nav></article>`;
  const body = `<section class="legal-masthead"><div class="breadcrumbs"><a href="${SITE_ROUTES[lang].home}">DaniniHub</a><span>›</span><a href="${SITE_ROUTES[lang].trust}">${escapeHtml(UI_COPY[lang].nav[4])}</a><span>›</span><span>${escapeHtml(doc.title)}</span></div><span class="eyebrow">${escapeHtml(UI_COPY[lang].legal)}</span><h1>${escapeHtml(doc.title)}</h1><p class="lead">${escapeHtml(doc.intro)}</p><div class="document-meta"><span>${lang === 'de' ? 'Stand' : lang === 'sr' ? 'Ažurirano' : 'Updated'}: ${escapeHtml(UPDATED[lang])}</span><span>DaniniHub · ${escapeHtml(UI_COPY[lang].claim)}</span></div></section><div class="legal-layout">${toc}${article}</div>`;
  return renderPage({ lang, pageKey: key, title: doc.title, description: doc.intro, body });
}

function mountPublicRuntime(app) {
  for (const lang of ['de', 'sr', 'en']) {
    app.get(SITE_ROUTES[lang].home, (req, res) => res.type('html').send(renderMarketing(lang, 'home')));
    for (const key of PUBLIC_KEYS) app.get(SITE_ROUTES[lang][key], (req, res) => res.type('html').send(renderMarketing(lang, key)));
    app.get(SITE_ROUTES[lang].trust, (req, res) => res.type('html').send(renderTrustIndex(lang)));
    for (const key of LEGAL_KEYS) app.get(SITE_ROUTES[lang][key], (req, res) => res.type('html').send(renderLegal(lang, key)));
  }
  app.get('/sr', (req, res) => res.redirect(308, '/'));
  const allKeys = ['home', ...PUBLIC_KEYS, 'activation', 'trust', ...LEGAL_KEYS];
  app.get('/robots.txt', (req, res) => res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`));
  app.get('/sitemap.xml', (req, res) => { const urls = ['de', 'sr', 'en'].flatMap(lang => allKeys.map(key => `${SITE_URL}${SITE_ROUTES[lang][key]}`)); res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${url}</loc></url>`).join('')}</urlset>`); });
  app.get('/api/public-layer', (req, res) => res.json({ ok: true, product: 'die-ki-fragt-nach', price: 12, currency: 'EUR', languages: ['de', 'sr', 'en'], routes: SITE_ROUTES }));
}

module.exports = { mountPublicRuntime, renderLegal, renderMarketing, renderTrustIndex };
