'use strict';

const site = 'https://daninihub.com';
const languages = ['sr', 'de', 'en'];
const routes = {
  sr: { home: '/', method: '/sr/metoda', project: '/sr/projektni-mod', levels: '/sr/nivoi', activation: '/sr/aktivacija', artifacts: '/sr/artefakti', trust: '/sr/centar-poverenja', cookies: '/sr/kolacici', ai: '/sr/ai-transparentnost', affiliate: '/sr/affiliate-napomena', imprint: '/sr/impressum', privacy: '/sr/privatnost', terms: '/sr/uslovi-koriscenja', disclaimer: '/sr/odricanje-odgovornosti' },
  de: { home: '/de', method: '/de/methode', project: '/de/projektmodus', levels: '/de/preise', activation: '/de/analyse-starten', artifacts: '/de/artifacts', trust: '/de/trust-center', cookies: '/de/cookies', ai: '/de/ki-transparenz', affiliate: '/de/affiliate-hinweis', imprint: '/de/impressum', privacy: '/de/datenschutz', terms: '/de/nutzungsbedingungen', disclaimer: '/de/haftungsausschluss' },
  en: { home: '/en', method: '/en/method', project: '/en/project-mode', levels: '/en/levels', activation: '/en/activation', artifacts: '/en/artifacts', trust: '/en/trust-center', cookies: '/en/cookies', ai: '/en/ai-transparency', affiliate: '/en/affiliate-disclosure', imprint: '/en/imprint', privacy: '/en/privacy', terms: '/en/terms', disclaimer: '/en/disclaimer' }
};

const copy = {
  de: {
    claim: 'Persönliche KI-Analyse', method: 'Die KI fragt nach', price: '12 EUR einmalig', start: 'Analyse für 12 EUR starten',
    nav: { method: 'So funktioniert es', project: 'Ihre Analyse', levels: 'Preis', artifacts: 'Ergebnis', activation: 'Starten', trust: 'Vertrauen' },
    home: ['Eine bessere Antwort beginnt mit den richtigen Rückfragen.', 'Beschreiben Sie Ihr konkretes Problem oder Ihre Entscheidung. Die KI stellt genau drei aufeinander aufbauende Rückfragen. Danach erhalten Sie eine persönliche Analyse mit klarer Entscheidung, Risiken und priorisierten nächsten Schritten.'],
    pages: {
      method: ['Drei Rückfragen. Eine belastbare Analyse.', 'Jede Rückfrage bezieht sich auf Ihre vorherige Antwort und klärt eine offene Annahme. Es gibt keine austauschbare Sofortantwort und kein allgemeines Coaching.'],
      project: ['Ihre Angaben bestimmen das Ergebnis.', 'Die Analyse trennt belegte Informationen von Annahmen, benennt fehlende Daten und leitet daraus eine klare Einordnung als GO, REDEFINE oder STOP ab.'],
      levels: ['12 EUR. Einmalig. Ohne Abo.', 'Enthalten sind die Ausgangsfrage, genau drei persönliche Rückfragen, die Abschlussanalyse, ein PDF-Dokument und die Zustellung per E-Mail.'],
      activation: ['Starten Sie Ihre persönliche Analyse.', 'Nach der sicheren Zahlung über Gumroad erhalten Sie Ihren persönlichen Zugangslink per E-Mail. Der Link führt direkt zum geführten Dialog.'],
      artifacts: ['Ein Ergebnis, mit dem Sie weiterarbeiten können.', 'Ihr PDF enthält Ausgangslage, Kernerkenntnisse, offene Annahmen, Entscheidung, konkrete Risiken und priorisierte Schritte für die nächsten 72 Stunden und sieben Tage.'],
      trust: ['Klar über Leistung und Grenzen.', 'Die Analyse basiert ausschließlich auf Ihren Antworten. KI unterstützt die Auswertung; die endgültige Entscheidung bleibt bei Ihnen. Sensible Daten sollten nicht eingegeben werden.']
    },
    steps: [['1', 'Ausgangslage beschreiben'], ['2', 'Drei präzise Rückfragen beantworten'], ['3', 'Persönliche Analyse und PDF erhalten']],
    legal: {
      cookies: ['Cookies', 'DaniniHub verwendet technisch notwendige Speicherungen für Sitzung, Sicherheit und Zugangsverwaltung. Die Zahlung erfolgt bei Gumroad; dort gelten die Datenschutz- und Cookie-Regeln des Anbieters.'],
      ai: ['KI-Transparenz', 'Rückfragen und Analyse werden mit KI-Unterstützung erstellt. Das Ergebnis stützt sich auf Ihre Eingaben, kann Fehler enthalten und ersetzt keine Prüfung durch qualifizierte Fachpersonen.'],
      affiliate: ['Affiliate-Hinweis', 'Aktuell werden im Analyseangebot keine Affiliate-Empfehlungen versprochen. Falls später kommerzielle Partnerlinks eingesetzt werden, werden sie unmittelbar am Link gekennzeichnet.'],
      imprint: ['Impressum', 'Diensteanbieter: Dragan Zdravkovic, Fischerstraße 54, 47055 Duisburg, Deutschland. Kontakt: dragangaganet@gmail.com.'],
      privacy: ['Datenschutz', 'Verarbeitet werden E-Mail-Adresse, Kaufreferenz, Sitzungsdaten und Ihre Antworten, soweit dies für Zugang, Analyse, PDF-Erstellung, Zustellung, Sicherheit und Fehlerbehebung erforderlich ist. Zahlungsdaten verarbeitet Gumroad. Geben Sie keine besonderen Kategorien personenbezogener Daten ein.'],
      terms: ['Nutzungsbedingungen', 'Der einmalige Preis beträgt 12 EUR. Enthalten sind ein geführter Dialog mit einer Ausgangsfrage und drei Rückfragen sowie eine persönliche Analyse als PDF und per E-Mail. Die Leistung ist eine Entscheidungshilfe, kein garantierter fachlicher oder wirtschaftlicher Erfolg.'],
      disclaimer: ['Haftungsausschluss', 'DaniniHub bietet keine Rechts-, Finanz-, Steuer- oder medizinische Beratung und keine Einkommensgarantie. Prüfen Sie Entscheidungen mit erheblicher Tragweite durch eine entsprechend qualifizierte Fachperson.']
    }
  },
  sr: {
    claim: 'Lična AI analiza', method: 'AI pita dalje', price: '12 EUR jednokratno', start: 'Pokreni analizu za 12 EUR',
    nav: { method: 'Kako radi', project: 'Vaša analiza', levels: 'Cena', artifacts: 'Rezultat', activation: 'Pokreni', trust: 'Poverenje' },
    home: ['Bolji odgovor počinje pravim podpitanjima.', 'Opišite konkretan problem ili odluku. AI postavlja tačno tri povezana podpitanja. Zatim dobijate ličnu analizu sa jasnom odlukom, rizicima i prioritetnim sledećim koracima.'],
    pages: {
      method: ['Tri podpitanja. Jedna ozbiljna analiza.', 'Svako podpitanje se direktno oslanja na prethodni odgovor i razjašnjava jednu otvorenu pretpostavku. Nema instant šablonskog odgovora ni opšteg coachinga.'],
      project: ['Vaši odgovori određuju rezultat.', 'Analiza odvaja potvrđene informacije od pretpostavki, označava šta nedostaje i daje jasnu procenu: GO, REDEFINE ili STOP.'],
      levels: ['12 EUR. Jednokratno. Bez pretplate.', 'U cenu ulaze početno pitanje, tačno tri lična podpitanja, završna analiza, PDF dokument i isporuka emailom.'],
      activation: ['Pokrenite ličnu analizu.', 'Nakon sigurnog plaćanja preko Gumroad-a, lični pristupni link stiže emailom i vodi direktno u vođeni razgovor.'],
      artifacts: ['Rezultat koji možete odmah da koristite.', 'PDF sadrži polaznu situaciju, ključne uvide, otvorene pretpostavke, odluku, konkretne rizike i prioritetne korake za naredna 72 sata i sedam dana.'],
      trust: ['Jasno o usluzi i njenim granicama.', 'Analiza se zasniva isključivo na vašim odgovorima. AI pomaže u obradi, ali konačnu odluku donosite vi. Ne unosite osetljive podatke.']
    },
    steps: [['1', 'Opišite polaznu situaciju'], ['2', 'Odgovorite na tri precizna podpitanja'], ['3', 'Preuzmite ličnu analizu i PDF']],
    legal: {
      cookies: ['Kolačići', 'DaniniHub koristi tehnički neophodno čuvanje podataka za sesiju, sigurnost i pristup. Plaćanje se obavlja kod Gumroad-a, gde važe pravila tog provajdera.'],
      ai: ['AI transparentnost', 'Podpitanja i analiza nastaju uz AI pomoć. Rezultat se zasniva na vašem unosu, može sadržati greške i ne zamenjuje proveru kvalifikovanog stručnog lica.'],
      affiliate: ['Affiliate napomena', 'U aktuelnoj analizi nema obećanih partnerskih preporuka. Ako kasnije budu uvedeni komercijalni partnerski linkovi, biće jasno označeni uz sam link.'],
      imprint: ['Impressum', 'Pružalac usluge: Dragan Zdravkovic, Fischerstraße 54, 47055 Duisburg, Nemačka. Kontakt: dragangaganet@gmail.com.'],
      privacy: ['Privatnost', 'Obrađuju se email adresa, referenca kupovine, podaci sesije i odgovori, samo koliko je potrebno za pristup, analizu, PDF, isporuku, sigurnost i otklanjanje grešaka. Podatke o plaćanju obrađuje Gumroad. Ne unosite posebno osetljive lične podatke.'],
      terms: ['Uslovi korišćenja', 'Jednokratna cena je 12 EUR. Usluga obuhvata početno pitanje, tri podpitanja i ličnu analizu u PDF-u i emailu. To je pomoć pri odlučivanju, bez garancije stručnog ili ekonomskog rezultata.'],
      disclaimer: ['Odricanje odgovornosti', 'DaniniHub ne pruža pravni, finansijski, poreski ili medicinski savet i ne garantuje zaradu. Odluke sa ozbiljnim posledicama proverite sa kvalifikovanim stručnim licem.']
    }
  },
  en: {
    claim: 'Personal AI analysis', method: 'AI asks further', price: '12 EUR one-time', start: 'Start for 12 EUR',
    nav: { method: 'How it works', project: 'Your analysis', levels: 'Price', artifacts: 'Result', activation: 'Start', trust: 'Trust' },
    home: ['A better answer starts with the right follow-up questions.', 'Describe your specific problem or decision. AI asks exactly three connected follow-up questions, then delivers a personal analysis with a clear decision, risks and prioritized next steps.'],
    pages: {
      method: ['Three follow-ups. One substantial analysis.', 'Each question refers to your previous answer and resolves one open assumption. There is no interchangeable instant answer or generic coaching.'],
      project: ['Your answers determine the result.', 'The analysis separates supported information from assumptions, identifies missing facts and provides a clear GO, REDEFINE or STOP assessment.'],
      levels: ['12 EUR. One-time. No subscription.', 'Includes the opening question, exactly three personal follow-ups, final analysis, PDF document and email delivery.'],
      activation: ['Start your personal analysis.', 'After secure payment through Gumroad, your personal access link is sent by email and opens the guided dialogue.'],
      artifacts: ['A result you can act on.', 'Your PDF includes the starting point, key insights, open assumptions, decision, specific risks and prioritized actions for the next 72 hours and seven days.'],
      trust: ['Clear about the service and its limits.', 'The analysis is based solely on your answers. AI supports the evaluation; the final decision remains yours. Do not enter sensitive data.']
    },
    steps: [['1', 'Describe your starting point'], ['2', 'Answer three precise follow-ups'], ['3', 'Receive your personal analysis and PDF']],
    legal: {
      cookies: ['Cookies', 'DaniniHub uses technically necessary storage for session, security and access management. Payment is handled by Gumroad under its own privacy and cookie rules.'],
      ai: ['AI transparency', 'Follow-up questions and analysis are generated with AI assistance. The result relies on your input, may contain errors and does not replace review by a qualified professional.'],
      affiliate: ['Affiliate disclosure', 'The current analysis offer includes no promised affiliate recommendations. Any future commercial partner links will be disclosed directly beside the link.'],
      imprint: ['Imprint', 'Service provider: Dragan Zdravkovic, Fischerstraße 54, 47055 Duisburg, Germany. Contact: dragangaganet@gmail.com.'],
      privacy: ['Privacy', 'We process your email, purchase reference, session data and answers only as needed for access, analysis, PDF creation, delivery, security and troubleshooting. Gumroad processes payment data. Do not submit special categories of personal data.'],
      terms: ['Terms', 'The one-time price is 12 EUR. It includes one opening question, three follow-ups and a personal analysis delivered as PDF and email. It is decision support, not a guaranteed professional or commercial outcome.'],
      disclaimer: ['Disclaimer', 'DaniniHub does not provide legal, financial, tax or medical advice and does not guarantee income. Have decisions with significant consequences reviewed by an appropriately qualified professional.']
    }
  }
};

const publicKeys = ['method', 'project', 'levels', 'artifacts', 'activation'];
const legalKeys = ['cookies', 'ai', 'affiliate', 'imprint', 'privacy', 'terms', 'disclaimer'];
function langLinks(key) { return languages.map(lang => `<a href="${routes[lang][key] || routes[lang].home}">${lang.toUpperCase()}</a>`).join(''); }
function nav(lang) { const t = copy[lang]; return publicKeys.map(key => `<a href="${routes[lang][key]}">${t.nav[key]}</a>`).join('') + `<a href="${routes[lang].trust}">${t.nav.trust}</a>`; }
function legalLinks(lang) { return legalKeys.map(key => `<a href="${routes[lang][key]}">${copy[lang].legal[key][0]}</a>`).join(''); }
function cards(lang) { return copy[lang].steps.map(item => `<article class="card"><b>${item[0]}</b><h3>${item[1]}</h3></article>`).join(''); }
function trustCards(lang) { return legalKeys.map(key => `<a class="card" href="${routes[lang][key]}"><h3>${copy[lang].legal[key][0]}</h3><p>${copy[lang].legal[key][1]}</p></a>`).join(''); }

function render(lang, key) {
  const t = copy[lang];
  const legal = legalKeys.includes(key);
  const pair = legal ? t.legal[key] : key === 'home' ? t.home : t.pages[key];
  const title = pair[0];
  const description = pair[1];
  const body = legal
    ? `<section class="hero"><span class="badge">${t.nav.trust}</span><h1>${title}</h1><p class="lead">${description}</p></section><section class="grid">${trustCards(lang)}</section>`
    : `<section class="hero"><span class="badge">${t.method} · ${t.price}</span><h1>${title}</h1><p class="lead">${description}</p><div class="actions"><a class="btn" href="/api/entry/12-eur/checkout">${t.start}</a><a class="btn ghost" href="${routes[lang].method}">${t.nav.method}</a></div></section><section class="grid steps">${cards(lang)}</section><section class="panel"><h2>${t.pages.artifacts[0]}</h2><p>${t.pages.artifacts[1]}</p></section>`;
  const canonical = site + (routes[lang][key] || routes[lang].home);
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | DaniniHub</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><style>*{box-sizing:border-box}body{margin:0;background:#07111f;color:#f7f2e8;font-family:Inter,Arial,sans-serif;line-height:1.65}.wrap{max-width:1120px;margin:auto;padding:24px}header{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;border-bottom:1px solid #243247;padding-bottom:18px}.brand{font-size:20px;font-weight:850;color:#f7f2e8}.brand small{display:block;color:#d6b25e;font-size:12px}nav,.langs,.legal{display:flex;gap:14px;flex-wrap:wrap}a{color:#d6b25e;text-decoration:none}.hero{padding:76px 0 42px}.badge{border:1px solid #46607e;border-radius:999px;padding:8px 13px;color:#a9cdf5;display:inline-block}h1{font-size:clamp(40px,7vw,76px);line-height:1.02;max-width:920px;margin:24px 0}.lead{font-size:21px;max-width:860px;color:#cbd5e1}.actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:30px}.btn{padding:14px 19px;border-radius:12px;background:#d6b25e;color:#07111f;font-weight:850}.ghost{background:transparent;color:#d6b25e;border:1px solid #d6b25e}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}.card,.panel{display:block;background:#101c2f;border:1px solid #283a52;border-radius:20px;padding:24px;color:#dce5ef}.card b{font-size:32px;color:#d6b25e}.card h3{color:#fff}.panel{margin:28px 0}.panel h2{color:#fff}footer{border-top:1px solid #243247;margin-top:48px;padding:26px 0;color:#9aabc0}</style></head><body><div class="wrap"><header><a class="brand" href="${routes[lang].home}">DaniniHub<small>${t.claim}</small></a><nav>${nav(lang)}</nav><div class="langs">${langLinks(key)}</div></header><main>${body}</main><footer><div class="legal">${legalLinks(lang)}</div><p>${t.method} · ${t.price} · Zahlung über Gumroad</p></footer></div></body></html>`;
}

function mountPublicRuntime(app) {
  const keys = ['home', ...publicKeys, 'trust', ...legalKeys];
  for (const lang of languages) for (const key of keys) app.get(routes[lang][key], (req, res) => res.type('html').send(render(lang, key)));
  app.get('/sr', (req, res) => res.type('html').send(render('sr', 'home')));
  app.get('/robots.txt', (req, res) => res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`));
  app.get('/sitemap.xml', (req, res) => { const urls = languages.flatMap(lang => keys.map(key => `${site}${routes[lang][key]}`)); res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${url}</loc></url>`).join('')}</urlset>`); });
  app.get('/api/public-layer', (req, res) => res.json({ ok: true, product: 'die-ki-fragt-nach', price: 12, currency: 'EUR', languages, routes }));
}

module.exports = { mountPublicRuntime };
