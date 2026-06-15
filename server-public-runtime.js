const site = 'https://daninihub.com';

const languages = ['de', 'sr', 'en'];

const routes = {
  de: { home: '/', method: '/methode', project: '/projektmodus', levels: '/preise', activation: '/analyse-starten', artifacts: '/artifacts', trust: '/trust-center', cookies: '/cookies', ai: '/ki-transparenz', affiliate: '/affiliate-hinweis', imprint: '/impressum', privacy: '/datenschutz', terms: '/nutzungsbedingungen', disclaimer: '/haftungsausschluss' },
  sr: { home: '/sr', method: '/sr/metoda', project: '/sr/projektni-mod', levels: '/sr/nivoi', activation: '/sr/aktivacija', artifacts: '/sr/artefakti', trust: '/sr/centar-poverenja', cookies: '/sr/kolacici', ai: '/sr/ai-transparentnost', affiliate: '/sr/affiliate-napomena', imprint: '/sr/impressum', privacy: '/sr/privatnost', terms: '/sr/uslovi-koriscenja', disclaimer: '/sr/odricanje-odgovornosti' },
  en: { home: '/en', method: '/en/method', project: '/en/project-mode', levels: '/en/levels', activation: '/en/activation', artifacts: '/en/artifacts', trust: '/en/trust-center', cookies: '/en/cookies', ai: '/en/ai-transparency', affiliate: '/en/affiliate-disclosure', imprint: '/en/imprint', privacy: '/en/privacy', terms: '/en/terms', disclaimer: '/en/disclaimer' }
};

const content = {
  de: {
    claim: 'Strukturierter KI-Projektmodus',
    methodLine: 'Frage KI - KI fragt dich',
    cta: 'ENTRY fuer 7 EUR aktivieren',
    nav: { method: 'Methode', project: 'Project Mode', levels: 'Niveaus', activation: 'ENTRY 7 EUR', artifacts: 'Artefakte', trust: 'Trust Center' },
    pages: {
      home: ['DaniniHub strukturiert Projekte, Entscheidungen und digitale Artefakte.', 'DaniniHub ist kein Chatbot, kein Prompt-Pack und kein Guru-System. Der Nutzer startet mit einem Ziel; das System fuehrt ueber gezielte Teilfragen, Kontrollrollen und klare Grenzen zu einem pruefbaren naechsten Schritt.'],
      method: ['Die Methode', 'Der Kern lautet: Der Mensch fragt, die KI stellt gezielte Teilfragen, der Nutzer praezisiert, erst danach entsteht ein Ergebnis. Das schuetzt vor oberflaechlichen Antworten, falschen Versprechen und unnoetigem Verbrauch von System Power.'],
      project: ['Project Mode', 'Project Mode ist der operative Arbeitsmodus. ENTRY aktiviert den Einstieg, danach werden Ziel, Kontext und Risiko strukturiert. Dashboard, Login und automatische Artefakt-Auslieferung werden erst als aktiv dargestellt, wenn sie technisch validiert sind.'],
      levels: ['Niveaus und System Power', 'Free erklaert die Methode. ENTRY aktiviert den Start. START, BUILDER, PRO und ULTIMATE bleiben Ausbaupfade fuer validierte Projektarbeit, zusaetzliche Analysen, Reviews und Artefakte. Credits sind Nutzungslogik, keine Finanz- oder Krypto-Token.'],
      activation: ['ENTRY 7 EUR', 'Die Zahlung erfolgt vor der ressourcenintensiven Analyse. Der Gumroad-MVP schuetzt das System vor kostenloser Ausnutzung und gibt dem Nutzer einen klaren, bezahlten Einstieg in die erste Projektklaerung.'],
      artifacts: ['Artefakte', 'Artefakte sind pruefbare Ergebnisse des Systems: Operatives Protokoll der Klarheit, Digitale Standortvermarktung / DPL und Calije Park Residence als oeffentliche Fallstudie ohne private Verhandlungsdaten.'],
      trust: ['Trust Center', 'Alle rechtlichen und Transparenzseiten erklaeren MVP-Status, externe Zahlungsabwicklung, KI-Unterstuetzung, Cookies, Datenschutz, Haftungsgrenzen und Affiliate-Hinweise.']
    },
    legal: {
      cookies: ['Cookies', 'DaniniHub verwendet im MVP nur technisch notwendige Cookies und serverseitige Informationen fuer Navigation, Aktivierung, Sicherheit und Basisbetrieb. Externe Zahlungsabwicklung erfolgt ueber Gumroad; dort gelten zusaetzlich die Bedingungen des Zahlungsanbieters. Tracking, Marketing-Cookies oder Profiling werden nicht als aktiv behauptet, solange sie nicht real implementiert und transparent gekennzeichnet sind.'],
      ai: ['KI-Transparenz', 'KI unterstuetzt Strukturierung, Teilfragen, Analyse, Zusammenfassung und Artefakt-Vorbereitung. KI entscheidet nicht fuer den Nutzer. Jede Ausgabe bleibt ein Arbeitsvorschlag und muss vom Nutzer geprueft werden. DaniniHub ersetzt keine professionelle Rechts-, Finanz-, Steuer-, Medizin- oder Investmentberatung.'],
      affiliate: ['Affiliate-Hinweis', 'DaniniHub kann externe Werkzeuge, Plattformen oder Produkte erwaehnen. Wenn Affiliate-Links eingesetzt werden, muessen sie sichtbar gekennzeichnet sein. Empfehlungen duerfen nur im Kontext des Systems stehen und nicht als objektive Garantie fuer Erfolg, Einkommen oder technische Eignung erscheinen.'],
      imprint: ['Impressum', 'Diese Seite ist der Betreiber- und Kontaktbereich des DaniniHub MVP. Betreiberangaben, Kontaktweg und zustaendige Angaben werden vom Owner final gepflegt. Bis zur finalen Veroeffentlichung wird kein erfundener Betreiber, keine erfundene Adresse und keine fingierte Gesellschaft angezeigt.'],
      privacy: ['Datenschutz', 'Im MVP werden nur Daten verarbeitet, die fuer Kontakt, Aktivierung, Support, Gumroad-Abgleich, technische Sicherheit und Projektklaerung erforderlich sind. Dazu koennen Name, E-Mail, Kaufreferenz, freiwillige Projektangaben und technische Serverdaten gehoeren. Private Calije-Verhandlungsdaten gehoeren nicht in den oeffentlichen DaniniHub-Bereich.'],
      terms: ['Nutzungsbedingungen', 'ENTRY oeffnet den Zugang zu einem strukturierten Klaerungsprozess. Es wird kein Erfolg, kein Einkommen, kein Investmentabschluss und keine automatische Lieferung garantiert. Digitale Artefakte koennen manuell oder halbautomatisch validiert werden, solange vollstaendige Automatisierung nicht freigegeben ist.'],
      disclaimer: ['Haftungsausschluss', 'DaniniHub liefert strukturierte Orientierung, keine bindende Beratung. Aussagen zu Projekten, Standorten, digitalen Produkten oder Geschaeftsmodellen sind Arbeitsgrundlagen. Nutzer bleiben fuer Pruefung, Umsetzung, Rechtskonformitaet, finanzielle Entscheidungen und externe Beratung verantwortlich.']
    }
  },
  sr: {
    claim: 'Strukturisani AI projektni mod',
    methodLine: 'Pitaj AI - AI pita tebe',
    cta: 'Aktiviraj ENTRY za 7 EUR',
    nav: { method: 'Metoda', project: 'Projektni mod', levels: 'Nivoi', activation: 'ENTRY 7 EUR', artifacts: 'Artefakti', trust: 'Centar poverenja' },
    pages: {
      home: ['DaniniHub strukturiše projekte, odluke i digitalne artefakte.', 'DaniniHub nije chatbot, prompt paket niti guru sistem. Korisnik ulazi sa ciljem; sistem vodi kroz parcijalna pitanja, kontrolne uloge i jasne granice do proverljivog sledećeg koraka.'],
      method: ['Metoda', 'Osnova je jednostavna: čovek pita, AI postavlja ciljano parcijalno pitanje, korisnik precizira, tek onda nastaje rezultat. Time se sprečavaju površni odgovori, lažna obećanja i nepotrebna potrošnja System Power-a.'],
      project: ['Projektni mod', 'Projektni mod je operativni radni režim. ENTRY aktivira ulaz, zatim se cilj, kontekst i rizik strukturiraju. Kontrolna tabla, logovanje i automatska isporuka artefakata prikazuju se kao aktivni tek kada su tehnički validirani.'],
      levels: ['Nivoi i System Power', 'Free objašnjava metodu. ENTRY aktivira početak. START, BUILDER, PRO i ULTIMATE ostaju razvojni put za validiran rad na projektu, dodatne analize, revizije i artefakte. Krediti su logika korišćenja sistema, ne finansijski ili kripto instrument.'],
      activation: ['ENTRY 7 EUR', 'Plaćanje ide pre resursno intenzivne analize. Gumroad MVP štiti sistem od besplatne zloupotrebe i korisniku daje jasan plaćeni ulaz u prvo razjašnjenje projekta.'],
      artifacts: ['Artefakti', 'Artefakti su proverljivi rezultati sistema: Operativni protokol jasnoće, Digitalna prodaja lokacije / DPL i Čalije Park Residence kao javna studija slučaja bez privatnih pregovaračkih podataka.'],
      trust: ['Centar poverenja', 'Pravne i transparentne stranice objašnjavaju MVP status, eksterno plaćanje, AI podršku, kolačiće, privatnost, granice odgovornosti i affiliate napomene.']
    },
    legal: {
      cookies: ['Kolačići', 'DaniniHub u MVP fazi koristi samo tehnički neophodne kolačiće i serverske informacije za navigaciju, aktivaciju, sigurnost i osnovni rad. Eksterno plaćanje ide preko Gumroad-a; tamo važe i uslovi tog provajdera. Tracking, marketinški kolačići ili profilisanje ne prikazuju se kao aktivni dok nisu stvarno implementirani i jasno označeni.'],
      ai: ['AI transparentnost', 'AI pomaže u strukturiranju, parcijalnim pitanjima, analizi, sažimanju i pripremi artefakata. AI ne odlučuje umesto korisnika. Svaki izlaz je radni predlog i korisnik mora da ga proveri. DaniniHub ne zamenjuje pravni, finansijski, poreski, medicinski ili investicioni savet.'],
      affiliate: ['Affiliate napomena', 'DaniniHub može pominjati spoljne alate, platforme ili proizvode. Ako se koriste affiliate linkovi, moraju biti jasno označeni. Preporuke smeju stajati samo u kontekstu sistema i ne smeju izgledati kao garancija uspeha, zarade ili tehničke podobnosti.'],
      imprint: ['Impressum', 'Ova stranica je operatorski i kontakt deo DaniniHub MVP-a. Podatke o operatoru, kontaktu i nadležnim informacijama finalno uređuje Owner. Do finalne objave ne prikazuje se izmišljeni operator, izmišljena adresa ili fingirana firma.'],
      privacy: ['Privatnost', 'U MVP fazi obrađuju se samo podaci potrebni za kontakt, aktivaciju, support, Gumroad proveru, tehničku sigurnost i razjašnjenje projekta. To mogu biti ime, email, referenca kupovine, dobrovoljni podaci o projektu i tehnički serverski podaci. Privatni Čalije pregovarački podaci ne pripadaju javnom DaniniHub sloju.'],
      terms: ['Uslovi korišćenja', 'ENTRY otvara pristup strukturisanom procesu razjašnjenja. Ne garantuje se uspeh, zarada, investicioni dogovor ni automatska isporuka. Digitalni artefakti mogu biti validirani ručno ili poluautomatski dok puna automatizacija nije odobrena.'],
      disclaimer: ['Odricanje odgovornosti', 'DaniniHub daje strukturisanu orijentaciju, ne obavezujući savet. Izjave o projektima, lokacijama, digitalnim proizvodima ili poslovnim modelima su radne osnove. Korisnik ostaje odgovoran za proveru, primenu, zakonitost, finansijske odluke i eksterno savetovanje.']
    }
  },
  en: {
    claim: 'Structured AI Project Mode',
    methodLine: 'Ask AI - AI asks you',
    cta: 'Activate ENTRY for 7 EUR',
    nav: { method: 'Method', project: 'Project Mode', levels: 'Levels', activation: 'ENTRY 7 EUR', artifacts: 'Artifacts', trust: 'Trust Center' },
    pages: {
      home: ['DaniniHub structures projects, decisions and digital artifacts.', 'DaniniHub is not a chatbot, prompt pack or guru system. The user starts with a goal; the system guides through partial questions, control roles and clear boundaries toward a verifiable next step.'],
      method: ['Method', 'The principle is simple: the human asks, AI asks a targeted partial question, the user clarifies, and only then an output is created. This prevents shallow answers, false promises and unnecessary System Power consumption.'],
      project: ['Project Mode', 'Project Mode is the operational working mode. ENTRY activates the start, then goal, context and risk are structured. Dashboard, login and automatic artifact delivery are shown as active only after technical validation.'],
      levels: ['Levels and System Power', 'Free explains the method. ENTRY activates the start. START, BUILDER, PRO and ULTIMATE remain the expansion path for validated project work, additional analyses, reviews and artifacts. Credits are platform usage logic, not financial or crypto instruments.'],
      activation: ['ENTRY 7 EUR', 'Payment happens before resource-intensive analysis. The Gumroad MVP protects the system from free abuse and gives the user a clear paid entry into first project clarification.'],
      artifacts: ['Artifacts', 'Artifacts are verifiable system outputs: Operative Protocol of Clarity, Digital Location Marketing / DPL and Calije Park Residence as public case study without private negotiation data.'],
      trust: ['Trust Center', 'Legal and transparency pages explain MVP status, external payment, AI assistance, cookies, privacy, liability boundaries and affiliate disclosure.']
    },
    legal: {
      cookies: ['Cookies', 'During MVP DaniniHub uses only technically necessary cookies and server-side information for navigation, activation, security and basic operation. External payments are handled by Gumroad; Gumroad terms apply there as well. Tracking, marketing cookies or profiling are not presented as active unless truly implemented and clearly disclosed.'],
      ai: ['AI transparency', 'AI supports structuring, partial questions, analysis, summaries and artifact preparation. AI does not decide for the user. Every output remains a working proposal and must be checked by the user. DaniniHub does not replace legal, financial, tax, medical or investment advice.'],
      affiliate: ['Affiliate disclosure', 'DaniniHub may mention external tools, platforms or products. If affiliate links are used, they must be clearly marked. Recommendations must stay within system context and must not appear as guarantees of success, income or technical suitability.'],
      imprint: ['Imprint', 'This page is the operator and contact area of the DaniniHub MVP. Operator details, contact channel and responsible information are finalized by the Owner. Until final publication, no invented operator, address or company is displayed.'],
      privacy: ['Privacy', 'During MVP only data required for contact, activation, support, Gumroad verification, technical security and project clarification is processed. This may include name, email, purchase reference, voluntary project input and technical server data. Private Calije negotiation data does not belong in the public DaniniHub layer.'],
      terms: ['Terms', 'ENTRY opens access to a structured clarification process. No success, income, investment deal or automatic delivery is guaranteed. Digital artifacts may be manually or semi-automatically validated until full automation is approved.'],
      disclaimer: ['Disclaimer', 'DaniniHub provides structured orientation, not binding advice. Statements about projects, locations, digital products or business models are working materials. Users remain responsible for verification, execution, legal compliance, financial decisions and external advice.']
    }
  }
};

const publicKeys = ['method', 'project', 'levels', 'artifacts', 'activation'];
const legalKeys = ['cookies', 'ai', 'affiliate', 'imprint', 'privacy', 'terms', 'disclaimer'];

function esc(value) { return String(value).replace(/[&<>\"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function canonical(lang, key) { return site + routes[lang][key]; }
function allRows() { const keys = ['home', ...publicKeys, 'trust', ...legalKeys]; return languages.flatMap(lang => keys.map(key => ({ lang, key, path: routes[lang][key] }))); }
function jsonLd(lang, key) { return JSON.stringify({ '@context': 'https://schema.org', '@type': key === 'activation' ? 'Product' : 'WebSite', name: key === 'activation' ? 'DaniniHub ENTRY' : 'DaniniHub', url: canonical(lang, key), inLanguage: lang, offers: key === 'activation' ? { '@type': 'Offer', price: '7', priceCurrency: 'EUR' } : undefined }).replace(/</g, '\\u003c'); }

function layout(lang, key, title, description, body) {
  const t = content[lang];
  const nav = publicKeys.map(k => `<a data-force-reload href="${routes[lang][k]}">${esc(t.nav[k])}</a>`).join('') + `<a data-force-reload href="${routes[lang].trust}">${esc(t.nav.trust)}</a>`;
  const legal = legalKeys.map(k => `<a data-force-reload href="${routes[lang][k]}">${esc(t.legal[k][0])}</a>`).join('');
  const switcher = languages.map(l => `<a data-force-reload href="${routes[l][key] || routes[l].home}">${l.toUpperCase()}</a>`).join('');
  const alt = languages.map(l => `<link rel="alternate" hreflang="${l}" href="${canonical(l, key)}">`).join('');
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} - DaniniHub</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${canonical(lang, key)}">${alt}<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230b1220'/%3E%3Ctext x='32' y='40' font-size='22' text-anchor='middle' fill='%23d6b56d' font-family='Arial'%3EDH%3C/text%3E%3C/svg%3E"><script type="application/ld+json">${jsonLd(lang, key)}</script><style>body{margin:0;background:#0b1220;color:#eef2f7;font-family:Inter,Arial,sans-serif;line-height:1.6}a{color:#d6b56d;text-decoration:none}.wrap{max-width:1180px;margin:auto;padding:28px}.top{display:flex;align-items:center;justify-content:space-between;gap:18px;border-bottom:1px solid #263247;padding-bottom:18px}.logo{font-weight:900;letter-spacing:.04em}.nav,.legal,.lang,.cards{display:flex;gap:14px;flex-wrap:wrap}.hero{padding:68px 0 36px}.badge{color:#d6b56d;text-transform:uppercase;font-size:12px}h1{font-size:clamp(34px,6vw,68px);line-height:1.05;margin:14px 0}.lead{font-size:20px;color:#cbd5e1;max-width:860px}.btn{display:inline-block;background:#d6b56d;color:#101827;padding:14px 20px;border-radius:12px;font-weight:900;margin:10px 10px 0 0}.btn.secondary{background:transparent;color:#d6b56d;border:1px solid #d6b56d}.card,.legalbox{background:#111b2e;border:1px solid #263247;border-radius:18px;padding:22px;flex:1;min-width:250px}.section{border-top:1px solid #263247;padding:30px 0}.muted{color:#94a3b8}footer{border-top:1px solid #263247;margin-top:40px;padding-top:22px}</style></head><body><main class="wrap"><header class="top"><a class="logo" data-force-reload href="${routes[lang].home}">◆ DaniniHub<br><small>${esc(t.claim)}</small></a><nav class="nav">${nav}</nav><div class="lang">${switcher}</div></header>${body}<footer><div class="legal">${legal}</div><p class="muted">DaniniHub MVP · ${esc(t.methodLine)} · Gumroad ENTRY 7 EUR · bez lažne automatike.</p></footer></main><script>document.addEventListener('click',function(e){var a=e.target.closest('a[data-force-reload]');if(!a)return;var h=a.getAttribute('href');if(!h||h[0]==='#'||h.indexOf('http')===0)return;e.preventDefault();window.location.assign(h);});</script></body></html>`;
}

function renderPublic(lang, key) {
  const t = content[lang];
  const page = key === 'home' ? t.pages.home : t.pages[key];
  const cards = [['method', t.pages.method], ['project', t.pages.project], ['artifacts', t.pages.artifacts]].map(([k, p]) => `<div class="card"><h2>${esc(p[0])}</h2><p class="muted">${esc(p[1])}</p><a data-force-reload href="${routes[lang][k]}">${esc(p[0])}</a></div>`).join('');
  const agentFlow = (key === 'project' || key === 'activation') ? `<section class="section"><h2>${lang === 'sr' ? 'Operativne uloge' : lang === 'de' ? 'Operative Rollen' : 'Operational roles'}</h2><div class="cards"><div class="card"><h3>Method Engine</h3><p>Partial questions, context, decision structure.</p></div><div class="card"><h3>Zero Hallucination Guard</h3><p>No fake automation, no invented claims, STOP when evidence is missing.</p></div><div class="card"><h3>Trust & Compliance</h3><p>Cookies, privacy, AI transparency and disclaimer boundaries.</p></div><div class="card"><h3>Artifact Layer</h3><p>DPL, Operative Protocol and public case studies.</p></div></div></section>` : '';
  const artifactLayer = key === 'artifacts' ? `<section class="section"><h2>Artifact Layer</h2><div class="cards"><div class="card" id="operatives-protokoll-der-klarheit"><h3>${lang==='sr'?'Operativni protokol jasnoće':lang==='de'?'Operatives Protokoll der Klarheit':'Operative Protocol of Clarity'}</h3><p>${lang==='sr'?'Manifest jasnoće, kontrole i strukturisanog odlučivanja.':lang==='de'?'Manifest fuer Klarheit, Kontrolle und strukturierte Entscheidungen.':'Manifest for clarity, control and structured decisions.'}</p></div><div class="card" id="digitale-standortvermarktung-dpl"><h3>${lang==='sr'?'Digitalna prodaja lokacije / DPL':lang==='de'?'Digitale Standortvermarktung / DPL':'Digital Location Marketing / DPL'}</h3><p>${lang==='sr'?'PDF proizvod zasnovan na pretvaranju lokacije u investitorski argument.':lang==='de'?'PDF-Produkt fuer die Umwandlung eines Standorts in ein Investorenargument.':'PDF product turning a location into an investor argument.'}</p></div><div class="card" id="calije-park-residence"><h3>Čalije Park Residence</h3><p>${lang==='sr'?'Javna studija slučaja bez privatnih pregovaračkih podataka.':lang==='de'?'Oeffentliche Fallstudie ohne private Verhandlungsdaten.':'Public case study without private negotiation data.'}</p></div></div></section>` : '';
  const trustCards = legalKeys.map(k => `<a class="card" data-force-reload href="${routes[lang][k]}"><h3>${esc(t.legal[k][0])}</h3><p class="muted">${esc(t.legal[k][1].slice(0,180))}...</p></a>`).join('');
  const body = `<section class="hero"><div class="badge">${esc(t.methodLine)}</div><h1>${esc(page[0])}</h1><p class="lead">${esc(page[1])}</p><a class="btn" data-force-reload href="/api/entry/7-eur/checkout">${esc(t.cta)}</a><a class="btn secondary" data-force-reload href="${routes[lang].method}">${esc(t.nav.method)}</a></section><section class="cards">${cards}</section>${agentFlow}${artifactLayer}<section class="section"><h2>${esc(t.pages.trust[0])}</h2><p class="lead">${esc(t.pages.trust[1])}</p><div class="cards">${trustCards}</div></section>`;
  return layout(lang, key, page[0], page[1], body);
}

function renderLegal(lang, key) {
  const t = content[lang];
  const page = t.legal[key];
  const body = `<section class="hero"><div class="badge">DaniniHub Trust Layer</div><h1>${esc(page[0])}</h1><p class="lead">${esc(page[1])}</p></section><section class="legalbox"><h2>${lang==='sr'?'DaniniHub kontekst':lang==='de'?'DaniniHub Kontext':'DaniniHub context'}</h2><p>${esc(page[1])}</p></section><section class="legalbox"><h2>${lang==='sr'?'Granice sistema':lang==='de'?'Systemgrenzen':'System boundaries'}</h2><p>${esc(lang==='sr'?'DaniniHub je MVP Project Mode sistem. ENTRY, Gumroad, AI podrška, System Power i artefakti moraju biti jasno označeni. Ne prikazujemo nevalidiranu automatiku, ne obećavamo zaradu i ne objavljujemo privatne podatke artifact projekata.':lang==='de'?'DaniniHub ist ein MVP Project Mode System. ENTRY, Gumroad, KI-Unterstuetzung, System Power und Artefakte muessen klar gekennzeichnet sein. Nicht validierte Automatisierung, Einkommensversprechen und private Projektdaten werden nicht oeffentlich dargestellt.':'DaniniHub is an MVP Project Mode system. ENTRY, Gumroad, AI assistance, System Power and artifacts must be clearly marked. Non-validated automation, income promises and private project data are not presented publicly.')}</p></section><section class="legalbox"><h2>${lang==='sr'?'Povezane stranice':lang==='de'?'Verbundene Seiten':'Related pages'}</h2><div class="legal">${legalKeys.filter(k=>k!==key).map(k=>`<a data-force-reload href="${routes[lang][k]}">${esc(t.legal[k][0])}</a>`).join('')}</div></section><a class="btn" data-force-reload href="/api/entry/7-eur/checkout">${esc(t.cta)}</a>`;
  return layout(lang, key, page[0], page[1], body);
}

function mountPublicRuntime(app) {
  for (const row of allRows()) app.get(row.path, (req, res) => res.type('html').send(legalKeys.includes(row.key) ? renderLegal(row.lang, row.key) : renderPublic(row.lang, row.key)));
  app.get('/robots.txt', (req, res) => res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: https://daninihub.com/sitemap.xml\n'));
  app.get('/sitemap.xml', (req, res) => { const urls = allRows().map(r => `<url><loc>${site}${r.path}</loc></url>`).join(''); res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`); });
  app.get('/api/public-layer', (req, res) => res.json({ ok: true, layer: 'daninihub_full_public_runtime', languages, routes: allRows() }));
}

module.exports = { mountPublicRuntime };
