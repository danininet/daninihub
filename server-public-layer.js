function getPublicWebLayerPayload(activeRoute = '/') {
  return {
    status: 'public_web_layer_ready_for_review',
    project: 'DaniniHub',
    architecture: 'Express / Node.js',
    governance: 'USTAV-first',
    method: 'Frage KI - KI fragt dich / Pitaj AI - AI pita tebe / Ask AI - AI asks you',
    activeRoute,
    indexation: {
      allowed: true,
      requiresCanonical: true,
      requiresHreflang: true,
      requiresStructuredData: true,
      noFakeMetrics: true,
      noGuaranteeClaims: true,
      aiTransparencyVisible: true
    },
    entry: {
      price: { amount: 7, currency: 'EUR' },
      mode: 'payment_first_before_analysis',
      checkoutProvider: 'gumroad_mvp_preferred_until_stripe_pipeline_validated',
      checkoutUrl: process.env.GUMROAD_ENTRY_URL || 'not_configured',
      fulfillment: 'manual_or_semiautomatic_until_pdf_email_auth_validated'
    },
    pages: [
      { route: '/', key: 'home', status: 'indexable_public_entry' },
      { route: '/methode', key: 'method', status: 'indexable_public_method' },
      { route: '/projektmodus', key: 'mode', status: 'indexable_public_system_overview' },
      { route: '/preise', key: 'prices', status: 'indexable_pricing_overview_not_full_checkout' },
      { route: '/analyse-starten', key: 'entry', status: 'external_checkout_manual_activation_mvp' },
      { route: '/artifacts', key: 'artifacts', status: 'indexable_artifact_overview' }
    ],
    artifacts: [
      { id: 'operatives-protokoll-der-klarheit', key: 'operatives', status: 'existing_asset_review_required', route: '/artifacts#operatives-protokoll-der-klarheit' },
      { id: 'digitale-standortvermarktung-dpl', key: 'dpl', status: 'existing_product_delivery_validation_required', route: '/artifacts#digitale-standortvermarktung-dpl' },
      { id: 'calije-park-residence', key: 'calije', status: 'public_artifact_private_boundary_required', route: '/artifacts#calije-park-residence' }
    ],
    blockedAutomation: [
      'stripe_full_automation_until_webhook_validated',
      'brevo_delivery_until_email_pipeline_validated',
      'pdf_download_until_artifact_pipeline_validated',
      'member_dashboard_until_auth_validated'
    ]
  };
}

const LANGUAGE = {
  de: {
    code: 'de', label: 'DE', method: 'Frage KI - KI fragt dich',
    nav: { method: 'Methode', mode: 'Projektmodus', prices: 'Preise', artifacts: 'Artefakte', entry: 'ENTRY' },
    ui: { artifact: 'Artefakt', status: 'Status', more: 'Details ansehen', webLayer: 'Oeffentliche Ebene', navigation: 'Systemnavigation', transparency: 'Transparenz' },
    badge: 'USTAV-first - DACH-ready - KI-Transparenz',
    hero: 'DaniniHub ist kein Chatbot. DaniniHub ist ein strukturierter Projektmodus.',
    lead: 'Ein Decision Engine fuer Menschen, die mit KI nicht nur Antworten sammeln, sondern bessere Fragen stellen, Projekte klaeren und belastbare Artefakte erzeugen wollen.',
    cta: 'ENTRY fuer 7 EUR aktivieren', secondary: 'Methode verstehen',
    cards: [
      ['Methode', 'Frage KI - KI fragt dich', 'Der Prozess folgt nicht dem Prompt-Hype, sondern einem kontrollierten Dialog: Frage, Gegenfrage, Reflexion, Aktion.'],
      ['Projektmodus', 'Gate 0-5', 'Ein aktives Projekt wird durch strukturierte Gates gefuehrt, mit Status, Review-Logik und Artefakt-Fokus.'],
      ['ENTRY', '7 EUR vor Analyse', 'Die Aktivierung erfolgt vor ressourcenintensiver Analyse. MVP-Checkout ueber Gumroad, Automation erst nach Validierung.']
    ],
    pages: {
      home: ['DaniniHub - Strukturierter KI-Projektmodus', 'DACH-first Einstieg in Methode, Projektmodus und oeffentliche Artefakt-Ebene.'],
      method: ['Frage KI - KI fragt dich', 'Erklaert die DaniniHub Dialogmethode ohne Aenderung des Ustav.'],
      mode: ['DaniniHub Projektmodus', 'Erklaert Gate 0-5, ein aktives Projekt, Validierung und Artefakt-Logik.'],
      prices: ['Niveaus, System Power und Add-ons', 'Zeigt Niveaus und Credits als Nutzungseinheiten der Plattform, nicht als Finanz-Token.'],
      entry: ['ENTRY 7 EUR - Projektaktivierung', 'Payment-first Aktivierung vor ressourcenintensiver Analyse. Gumroad MVP vor Stripe-Automation.'],
      artifacts: ['DaniniHub Artefakte', 'Oeffentliche Uebersicht freigegebener Artefakte wie Operatives Protokoll, DPL und Calije Case Study.']
    },
    artifacts: {
      operatives: ['DaniniHub - Operatives Protokoll der Klarheit', 'Kernartefakt fuer strukturiertes Entscheiden, Klarheit und USTAV-first Arbeitsweise.'],
      dpl: ['Digitale Standortvermarktung / DPL', 'Produkt-Artefakt zur digitalen Aufbereitung einer Lage als investitionsfaehiger Argumentationsraum.'],
      calije: ['Calije Park Residence', 'Oeffentliche Case Study. Private Verhandlungen, vertrauliche Daten und Garantien bleiben ausgeschlossen.']
    },
    transparency: 'DaniniHub garantiert kein Einkommen, keinen Investment-Erfolg und ersetzt keine rechtliche, medizinische oder finanzielle Beratung. KI unterstuetzt den Prozess; Entscheidungen bleiben beim Nutzer.'
  },
  sr: {
    code: 'sr', label: 'SR', method: 'Pitaj AI - AI pita tebe',
    nav: { method: 'Metoda', mode: 'Projektni mod', prices: 'Nivoi', artifacts: 'Artefakti', entry: 'ENTRY' },
    ui: { artifact: 'Artefakt', status: 'Status', more: 'Vidi detalje', webLayer: 'Javni sloj', navigation: 'Sistemska navigacija', transparency: 'Transparentnost' },
    badge: 'USTAV-first - SR radni jezik - AI transparentnost',
    hero: 'DaniniHub nije chatbot. DaniniHub je strukturisani projektni mod.',
    lead: 'Decision Engine za ljude koji sa AI ne skupljaju samo odgovore, nego postavljaju bolja pitanja, razjasnjavaju projekte i stvaraju proverljive artefakte.',
    cta: 'Aktiviraj ENTRY za 7 EUR', secondary: 'Razumi metodu',
    cards: [
      ['Metoda', 'Pitaj AI - AI pita tebe', 'Proces ne prati prompt hype, nego kontrolisani dijalog: pitanje, kontrapitanje, refleksija, akcija.'],
      ['Projektni mod', 'Gate 0-5', 'Jedan aktivan projekat prolazi kroz strukturisane gate faze, status, review logiku i fokus na artefakt.'],
      ['ENTRY', '7 EUR pre analize', 'Aktivacija ide pre potrosnje System Power-a. MVP checkout ide preko Gumroad-a, automatizacija tek posle validacije.']
    ],
    pages: {
      home: ['DaniniHub - Strukturisani AI projektni mod', 'Ulaz u DaniniHub metodu, Project Mode i javni sloj artefakata.'],
      method: ['Pitaj AI - AI pita tebe', 'Objašnjava DaniniHub metod dijaloga bez menjanja Ustava.'],
      mode: ['DaniniHub projektni mod', 'Objašnjava Gate 0-5, jedan aktivan projekat, validaciju i logiku artefakata.'],
      prices: ['Nivoi, System Power i dodaci', 'Prikazuje nivoe i kredite kao jedinice korišćenja platforme, ne kao finansijski token.'],
      entry: ['ENTRY 7 EUR - aktivacija projekta', 'Plaćanje pre analize da se ne troši System Power pre aktivacije. Gumroad MVP pre Stripe automatizacije.'],
      artifacts: ['DaniniHub artefakti', 'Javni pregled odobrenih artefakata: Operativni protokol, DPL i Čalije case study.']
    },
    artifacts: {
      operatives: ['DaniniHub - Operativni protokol jasnoće', 'Osnovni artefakt za strukturisano odlučivanje, jasnoću i USTAV-first rad.'],
      dpl: ['Digitalna prodaja lokacije / DPL', 'Produkt-artefakt za pretvaranje lokacije u digitalno predstavljen investitorski argument.'],
      calije: ['Čalije Park Residence', 'Javni case study. Privatni pregovori, poverljivi podaci i garancije ostaju isključeni.']
    },
    transparency: 'DaniniHub ne garantuje zaradu, investicioni uspeh i ne zamenjuje pravni, medicinski ili finansijski savet. AI podrzava proces; odluke ostaju kod korisnika.'
  },
  en: {
    code: 'en', label: 'EN', method: 'Ask AI - AI asks you',
    nav: { method: 'Method', mode: 'Project Mode', prices: 'Levels', artifacts: 'Artifacts', entry: 'ENTRY' },
    ui: { artifact: 'Artifact', status: 'Status', more: 'View details', webLayer: 'Public layer', navigation: 'System navigation', transparency: 'Transparency' },
    badge: 'USTAV-first - International layer - AI transparency',
    hero: 'DaniniHub is not a chatbot. DaniniHub is a structured project mode.',
    lead: 'A Decision Engine for people who do not only collect AI answers, but ask better questions, clarify projects and create verifiable artifacts.',
    cta: 'Activate ENTRY for 7 EUR', secondary: 'Understand the method',
    cards: [
      ['Method', 'Ask AI - AI asks you', 'The process does not follow prompt hype. It follows a controlled dialogue: question, counter-question, reflection, action.'],
      ['Project Mode', 'Gate 0-5', 'One active project moves through structured gates, status, review logic and artifact focus.'],
      ['ENTRY', '7 EUR before analysis', 'Activation happens before resource-intensive analysis. MVP checkout runs through Gumroad; automation only after validation.']
    ],
    pages: {
      home: ['DaniniHub - Structured AI Project Mode', 'Entry into the DaniniHub method, Project Mode and public artifact layer.'],
      method: ['Ask AI - AI asks you', 'Explains the DaniniHub dialogue method without changing the Ustav.'],
      mode: ['DaniniHub Project Mode', 'Explains Gate 0-5, one active project, validation and artifact logic.'],
      prices: ['Levels, System Power and Add-ons', 'Shows levels and credits as platform usage units, not financial tokens.'],
      entry: ['ENTRY 7 EUR - Project activation', 'Payment-first activation before resource-intensive analysis. Gumroad MVP before Stripe automation.'],
      artifacts: ['DaniniHub Artifacts', 'Public overview of approved artifacts such as Operatives Protocol, DPL and Calije case study.']
    },
    artifacts: {
      operatives: ['DaniniHub - Operative Protocol of Clarity', 'Core artifact for structured decision-making, clarity and USTAV-first work.'],
      dpl: ['Digital Location Marketing / DPL', 'Product artifact for turning a location into a digitally structured investment argument.'],
      calije: ['Calije Park Residence', 'Public case study. Private negotiations, confidential data and guarantees remain excluded.']
    },
    transparency: 'DaniniHub does not guarantee income, investment success and does not replace legal, medical or financial advice. AI supports the process; decisions remain with the user.'
  }
};

function escapeHtml(value) {
  return String(value).replace(/[&<>\"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;'
  }[char]));
}

function stripLang(route) {
  return route.replace(/^\/(sr|en)(?=\/|$)/, '') || '/';
}

function langFromRoute(route) {
  if (route === '/sr' || route.startsWith('/sr/')) return 'sr';
  if (route === '/en' || route.startsWith('/en/')) return 'en';
  return 'de';
}

function localizedPath(lang, route) {
  const clean = stripLang(route);
  if (lang === 'de') return clean;
  return clean === '/' ? `/${lang}` : `/${lang}${clean}`;
}

function localizedAnchor(lang, route) {
  const [path, hash = ''] = route.split('#');
  return `${localizedPath(lang, path)}${hash ? `#${hash}` : ''}`;
}

function localPage(lang, item) {
  const t = LANGUAGE[lang];
  const text = t.pages[item.key] || t.pages.home;
  return { route: item.route, title: text[0], purpose: text[1], status: item.status };
}

function renderPublicHtml(activeRoute = '/') {
  const lang = langFromRoute(activeRoute);
  const t = LANGUAGE[lang];
  const cleanRoute = stripLang(activeRoute);
  const payload = getPublicWebLayerPayload(cleanRoute);
  const pageItem = payload.pages.find((page) => page.route === cleanRoute) || payload.pages[0];
  const page = localPage(lang, pageItem);
  const checkoutConfigured = payload.entry.checkoutUrl !== 'not_configured';
  const checkoutHref = checkoutConfigured ? '/api/entry/7-eur/checkout' : '#entry-not-configured';

  const navHref = (path) => localizedPath(lang, path);
  const artifactsHtml = payload.artifacts.map((artifact) => {
    const text = t.artifacts[artifact.key] || [artifact.key, artifact.status];
    return `
    <article class="card" id="${escapeHtml(artifact.id)}">
      <p class="eyebrow">${escapeHtml(t.ui.artifact)}</p>
      <h3>${escapeHtml(text[0])}</h3>
      <p>${escapeHtml(text[1])}</p>
      <p>${escapeHtml(t.ui.status)}: ${escapeHtml(artifact.status)}</p>
      <a href="${escapeHtml(localizedAnchor(lang, artifact.route))}">${escapeHtml(t.ui.more)}</a>
    </article>`;
  }).join('');

  const pagesHtml = payload.pages.map((item) => {
    const p = localPage(lang, item);
    return `
    <a class="nav-card" href="${escapeHtml(navHref(item.route))}">
      <strong>${escapeHtml(p.title)}</strong>
      <span>${escapeHtml(p.purpose)}</span>
    </a>`;
  }).join('');

  const cardsHtml = t.cards.map((card) => `
    <article class="card"><p class="eyebrow">${escapeHtml(card[0])}</p><h3>${escapeHtml(card[1])}</h3><p>${escapeHtml(card[2])}</p></article>
  `).join('');

  return `<!doctype html>
<html lang="${escapeHtml(t.code)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.purpose)}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="https://daninihub.com${escapeHtml(localizedPath(lang, cleanRoute))}" />
  <link rel="alternate" hreflang="de" href="https://daninihub.com${escapeHtml(localizedPath('de', cleanRoute))}" />
  <link rel="alternate" hreflang="sr" href="https://daninihub.com${escapeHtml(localizedPath('sr', cleanRoute))}" />
  <link rel="alternate" hreflang="en" href="https://daninihub.com${escapeHtml(localizedPath('en', cleanRoute))}" />
  <style>
    :root { color-scheme: dark; --bg:#070b14; --panel:#101827; --line:#243044; --text:#eef4ff; --muted:#aeb9cc; --gold:#d7b56d; --blue:#72d6ff; }
    * { box-sizing: border-box; } body { margin:0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif; background: radial-gradient(circle at top left, rgba(114,214,255,.16), transparent 34%), var(--bg); color:var(--text); } a { color: inherit; }
    .wrap { width:min(1120px, calc(100% - 32px)); margin:0 auto; } header { border-bottom:1px solid var(--line); background:rgba(7,11,20,.78); backdrop-filter: blur(16px); position:sticky; top:0; z-index:2; }
    .top { display:flex; align-items:center; justify-content:space-between; min-height:72px; gap:24px; } .brand { font-weight:800; letter-spacing:.03em; color:var(--gold); text-decoration:none; } nav { display:flex; gap:18px; flex-wrap:wrap; font-size:14px; color:var(--muted); } nav a { text-decoration:none; }
    .hero { padding:86px 0 56px; } .badge { display:inline-flex; gap:10px; align-items:center; border:1px solid var(--line); border-radius:999px; padding:8px 12px; color:var(--muted); background:rgba(16,24,39,.72); }
    h1 { font-size: clamp(42px, 7vw, 82px); line-height:.96; margin:24px 0; letter-spacing:-.06em; max-width:920px; } .lead { font-size: clamp(18px, 2vw, 24px); line-height:1.55; color:var(--muted); max-width:840px; }
    .actions { display:flex; gap:14px; flex-wrap:wrap; margin-top:34px; } .btn { display:inline-flex; align-items:center; justify-content:center; min-height:48px; padding:0 20px; border-radius:14px; text-decoration:none; font-weight:700; border:1px solid var(--line); } .btn.primary { background:linear-gradient(135deg, var(--gold), #f3d990); color:#111827; border:0; } .btn.secondary { background:rgba(16,24,39,.82); color:var(--text); }
    section { padding:34px 0; } .grid { display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:18px; } .card, .nav-card { display:block; background:rgba(16,24,39,.78); border:1px solid var(--line); border-radius:24px; padding:24px; text-decoration:none; min-height:170px; } .card h3, .nav-card strong { display:block; margin:0 0 12px; font-size:20px; } .card p, .nav-card span { color:var(--muted); line-height:1.55; margin:0 0 10px; } .eyebrow { color:var(--blue)!important; font-size:12px; text-transform:uppercase; letter-spacing:.14em; font-weight:800; margin-bottom:10px!important; }
    .panel { background:rgba(16,24,39,.78); border:1px solid var(--line); border-radius:28px; padding:28px; } .trust { color:var(--muted); font-size:14px; line-height:1.7; } footer { border-top:1px solid var(--line); margin-top:48px; padding:32px 0; color:var(--muted); font-size:14px; }
    .lang { display:flex; gap:10px; } .lang a { color:var(--muted); text-decoration:none; }
    @media (max-width:820px) { .grid { grid-template-columns:1fr; } .top { align-items:flex-start; flex-direction:column; padding:18px 0; } }
  </style>
</head>
<body>
  <header><div class="wrap top"><a class="brand" href="${escapeHtml(localizedPath(lang, '/'))}">DaniniHub</a><nav><a href="${escapeHtml(navHref('/methode'))}">${escapeHtml(t.nav.method)}</a><a href="${escapeHtml(navHref('/projektmodus'))}">${escapeHtml(t.nav.mode)}</a><a href="${escapeHtml(navHref('/preise'))}">${escapeHtml(t.nav.prices)}</a><a href="${escapeHtml(navHref('/artifacts'))}">${escapeHtml(t.nav.artifacts)}</a><a href="${escapeHtml(navHref('/analyse-starten'))}">${escapeHtml(t.nav.entry)}</a></nav><div class="lang"><a href="${escapeHtml(localizedPath('de', cleanRoute))}">DE</a><a href="${escapeHtml(localizedPath('sr', cleanRoute))}">SR</a><a href="${escapeHtml(localizedPath('en', cleanRoute))}">EN</a></div></div></header>
  <main>
    <div class="wrap hero"><span class="badge">${escapeHtml(t.badge)}</span><h1>${escapeHtml(t.hero)}</h1><p class="lead">${escapeHtml(t.lead)}</p><div class="actions"><a class="btn primary" href="${checkoutHref}">${escapeHtml(t.cta)}</a><a class="btn secondary" href="${escapeHtml(navHref('/methode'))}">${escapeHtml(t.secondary)}</a></div></div>
    <section class="wrap"><div class="grid">${cardsHtml}</div></section>
    <section class="wrap"><div class="panel"><p class="eyebrow">${escapeHtml(t.ui.webLayer)}</p><h2>${escapeHtml(page.title)}</h2><p class="trust">${escapeHtml(page.purpose)}</p></div></section>
    <section class="wrap"><p class="eyebrow">${escapeHtml(t.nav.artifacts)}</p><div class="grid">${artifactsHtml}</div></section>
    <section class="wrap"><p class="eyebrow">${escapeHtml(t.ui.navigation)}</p><div class="grid">${pagesHtml}</div></section>
    <section class="wrap"><div class="panel trust" id="entry-not-configured"><strong>${escapeHtml(t.ui.transparency)}:</strong> ${escapeHtml(t.transparency)}</div></section>
  </main>
  <footer><div class="wrap">© DaniniHub - AI Transparency - Affiliate Disclosure - Datenschutz - Impressum</div></footer>
</body>
</html>`;
}

function mountPublicWebLayer(app) {
  const routes = ['/', '/methode', '/projektmodus', '/preise', '/analyse-starten', '/artifacts'];
  for (const route of routes) app.get(route, (req, res) => res.type('html').send(renderPublicHtml(route)));
  for (const lang of ['sr', 'en']) for (const route of routes) {
    const localized = route === '/' ? `/${lang}` : `/${lang}${route}`;
    app.get(localized, (req, res) => res.type('html').send(renderPublicHtml(localized)));
  }
  app.get('/api/public-layer', (req, res) => res.json(getPublicWebLayerPayload('/')));
  app.get('/api/entry/7-eur', (req, res) => res.json({ status: 'external_checkout_manual_activation_mvp', project: 'DaniniHub', entry: { price: { amount: 7, currency: 'EUR' }, mode: 'payment_first_before_analysis', checkoutProvider: 'gumroad', gumroadProductUrl: process.env.GUMROAD_ENTRY_URL || 'not_configured', fulfillment: 'manual_or_semiautomatic_until_pdf_email_auth_validated' }, blockedAutomation: getPublicWebLayerPayload('/').blockedAutomation }));
  app.get('/api/entry/7-eur/checkout', (req, res) => {
    const checkoutUrl = process.env.GUMROAD_ENTRY_URL;
    if (!checkoutUrl) return res.status(503).json({ status: 'checkout_not_configured', requiredEnv: 'GUMROAD_ENTRY_URL' });
    return res.redirect(302, checkoutUrl);
  });
}

module.exports = { mountPublicWebLayer, getPublicWebLayerPayload };
