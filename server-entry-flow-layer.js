'use strict';

const { SITE_ROUTES, UI_COPY, escapeHtml, renderPage } = require('./core/site-ui');

const copy = {
  de: { title:'Ihre persönliche Analyse starten', lead:'Ein klarer Ablauf: einmal bezahlen, vier Fragen beantworten und eine persönliche Analyse als PDF erhalten.', steps:['Sicher über Gumroad bezahlen','Persönlichen Zugangslink per E-Mail erhalten','Ausgangsfrage und genau drei Rückfragen beantworten','Analyse und PDF per E-Mail erhalten'], benefits:['Direkt auf Ihre Antworten bezogen','Annahmen klar gekennzeichnet','Priorisierte nächste Schritte','PDF und E-Mail inklusive'], limits:'Die Analyse ist eine KI-gestützte Orientierung. Sie ersetzt keine Rechts-, Finanz-, Steuer- oder medizinische Beratung.', privacy:'Verarbeitet werden nur die für Kauf, Sitzung, Analyse und Zustellung erforderlichen Daten. Bitte geben Sie keine sensiblen Daten ein.', back:'Zur Startseite', process:'Der Ablauf', receive:'Im Preis enthalten', clarity:'Klare Grenzen' },
  sr: { title:'Pokrenite ličnu analizu', lead:'Jasan proces: platite jednom, odgovorite na četiri pitanja i dobijate ličnu analizu u PDF-u.', steps:['Sigurno platite preko Gumroad-a','Lični pristupni link stiže emailom','Odgovorite na početno pitanje i tačno tri podpitanja','Analiza i PDF stižu emailom'], benefits:['Direktno zasnovano na vašim odgovorima','Pretpostavke su jasno označene','Prioritetni sledeći koraci','PDF i email su uključeni'], limits:'Analiza je AI pomoć za orijentaciju. Ne zamenjuje pravni, finansijski, poreski ili medicinski savet.', privacy:'Obrađuju se samo podaci neophodni za kupovinu, sesiju, analizu i isporuku. Ne unosite osetljive podatke.', back:'Nazad na početnu', process:'Proces', receive:'Uključeno u cenu', clarity:'Jasne granice' },
  en: { title:'Start your personal analysis', lead:'A clear process: pay once, answer four questions and receive a personal analysis as a PDF.', steps:['Pay securely through Gumroad','Receive a personal access link by email','Answer the opening question and exactly three follow-ups','Receive the analysis and PDF by email'], benefits:['Tied directly to your answers','Assumptions clearly identified','Prioritized next steps','PDF and email included'], limits:'The analysis is AI-assisted guidance. It is not legal, financial, tax or medical advice.', privacy:'Only data required for purchase, session, analysis and delivery is processed. Do not enter sensitive information.', back:'Back to home', process:'The process', receive:'Included in the price', clarity:'Clear limits' }
};

function renderEntry(lang) {
  const t = copy[lang] || copy.de;
  const body = `<section class="hero compact"><span class="badge">${escapeHtml(UI_COPY[lang].claim)} · 12 EUR</span><h1>${escapeHtml(t.title)}</h1><p class="lead">${escapeHtml(t.lead)}</p><div class="actions"><a class="button-primary" href="/api/entry/12-eur/checkout">${escapeHtml(UI_COPY[lang].start)}</a><a class="button-secondary" href="${SITE_ROUTES[lang].home}">${escapeHtml(t.back)}</a></div></section>
  <section class="section"><div class="section-head"><span class="eyebrow">${escapeHtml(t.process)}</span><h2>${escapeHtml(t.title)}</h2></div><div class="grid">${t.steps.map((step,index)=>`<article class="card"><span class="card-number">0${index+1}</span><h3>${escapeHtml(step)}</h3></article>`).join('')}</div></section>
  <section class="price-panel"><div><span class="eyebrow">${escapeHtml(t.receive)}</span><h2>${escapeHtml(t.benefits[0])}</h2><div class="feature-list">${t.benefits.map(item=>`<div class="feature"><strong>${escapeHtml(item)}</strong></div>`).join('')}</div></div><div class="price-box"><span class="price">12 €</span><small>${lang==='de'?'einmalig · kein Abo':lang==='sr'?'jednokratno · bez pretplate':'one-time · no subscription'}</small><a class="button-primary" href="/api/entry/12-eur/checkout">${escapeHtml(UI_COPY[lang].start)}</a></div></section>
  <section class="section"><div class="card"><span class="eyebrow">${escapeHtml(t.clarity)}</span><h2>${escapeHtml(t.limits)}</h2><p>${escapeHtml(t.privacy)}</p><div class="actions"><a class="button-secondary" href="${SITE_ROUTES[lang].privacy}">${lang==='de'?'Datenschutz':lang==='sr'?'Privatnost':'Privacy'}</a><a class="button-secondary" href="${SITE_ROUTES[lang].terms}">${lang==='de'?'Nutzungsbedingungen':lang==='sr'?'Uslovi korišćenja':'Terms'}</a><a class="button-secondary" href="${SITE_ROUTES[lang].withdrawal}">${lang==='de'?'Widerruf':lang==='sr'?'Odustanak':'Withdrawal'}</a></div></div></section>`;
  return renderPage({ lang, pageKey:'activation', title:t.title, description:t.lead, body });
}

function mountEntryFlowLayer(app) {
  for (const lang of ['de','sr','en']) app.get(SITE_ROUTES[lang].activation, (req,res)=>res.type('html').send(renderEntry(lang)));
  app.get('/analyse-starten', (req,res)=>res.redirect(308, SITE_ROUTES.de.activation));
  app.get('/api/entry/12-eur', (req,res)=>res.json({ project:'Danini OS', product:{ id:'die-ki-fragt-nach', amount:12, currency:'EUR', provider:'gumroad_mvp', checkoutUrl:process.env.GUMROAD_ENTRY_URL || 'not_configured', flow:'initial_question_plus_three_followups_then_pdf' } }));
  app.get('/api/entry/12-eur/checkout', (req,res)=>{ const url=process.env.GUMROAD_ENTRY_URL; if(!url) return res.status(503).json({error:'checkout_not_configured'}); return res.redirect(302,url); });
  app.get('/api/entry/7-eur', (req,res)=>res.redirect(308,'/api/entry/12-eur'));
  app.get('/api/entry/7-eur/checkout', (req,res)=>res.redirect(308,'/api/entry/12-eur/checkout'));
}

module.exports = { mountEntryFlowLayer, renderEntry };
