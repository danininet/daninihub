function getPublicWebLayerPayload(activeRoute = '/') {
  return {
    status: 'public_web_layer_ready_for_review',
    project: 'DaniniHub',
    architecture: 'Express / Node.js',
    governance: 'USTAV-first',
    method: 'Frage KI – KI fragt dich',
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
      { route: '/', title: 'DaniniHub – Strukturierter KI-Projektmodus', status: 'indexable_public_entry', purpose: 'DACH-first entry into the DaniniHub method, Project Mode and public artifact layer.' },
      { route: '/methode', title: 'Frage KI – KI fragt dich', status: 'indexable_public_method', purpose: 'Explains the DaniniHub dialogue method without changing the Ustav.' },
      { route: '/projektmodus', title: 'DaniniHub Project Mode', status: 'indexable_public_system_overview', purpose: 'Explains Gate 0–5, one active project, validation and artifact logic.' },
      { route: '/preise', title: 'Niveaus, System Power und Add-ons', status: 'indexable_pricing_overview_not_full_checkout', purpose: 'Shows tiers and credits as platform usage units, not financial tokens.' },
      { route: '/analyse-starten', title: 'ENTRY 7 EUR – Projektaktivierung', status: 'external_checkout_manual_activation_mvp', purpose: 'Payment-first activation before resource-intensive analysis. Gumroad MVP may be used before Stripe automation.' },
      { route: '/artifacts', title: 'DaniniHub Artifacts', status: 'indexable_artifact_overview', purpose: 'Public overview of approved artifacts such as Operatives Protokoll, DPL and Calije case study.' }
    ],
    artifacts: [
      { id: 'operatives-protokoll-der-klarheit', title: 'DaniniHub – Operatives Protokoll der Klarheit', status: 'existing_asset_review_required', route: '/artifacts/operatives-protokoll-der-klarheit' },
      { id: 'digitale-standortvermarktung-dpl', title: 'Digitale Standortvermarktung / Digitalna prodaja lokacije', status: 'existing_product_delivery_validation_required', route: '/artifacts/digitale-standortvermarktung' },
      { id: 'calije-park-residence', title: 'Čalije Park Residence', status: 'public_artifact_private_boundary_required', route: '/artifacts/calije-park-residence' }
    ],
    blockedAutomation: [
      'stripe_full_automation_until_webhook_validated',
      'brevo_delivery_until_email_pipeline_validated',
      'pdf_download_until_artifact_pipeline_validated',
      'member_dashboard_until_auth_validated'
    ]
  };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>\"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '\"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function getPageMeta(activeRoute) {
  const payload = getPublicWebLayerPayload(activeRoute);
  return payload.pages.find((page) => page.route === activeRoute) || payload.pages[0];
}

function renderPublicHtml(activeRoute = '/') {
  const payload = getPublicWebLayerPayload(activeRoute);
  const page = getPageMeta(activeRoute);
  const checkoutConfigured = payload.entry.checkoutUrl !== 'not_configured';
  const checkoutHref = checkoutConfigured ? '/api/entry/7-eur/checkout' : '#entry-not-configured';

  const artifactsHtml = payload.artifacts.map((artifact) => `
    <article class="card">
      <p class="eyebrow">Artifact</p>
      <h3>${escapeHtml(artifact.title)}</h3>
      <p>Status: ${escapeHtml(artifact.status)}</p>
      <a href="${escapeHtml(artifact.route)}">Mehr anzeigen</a>
    </article>
  `).join('');

  const pagesHtml = payload.pages.map((item) => `
    <a class="nav-card" href="${escapeHtml(item.route)}">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.purpose)}</span>
    </a>
  `).join('');

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="DaniniHub ist ein USTAV-first Decision Engine und Project Mode System nach der Methode Frage KI – KI fragt dich." />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="https://daninihub.com${escapeHtml(activeRoute === '/' ? '/' : activeRoute)}" />
  <style>
    :root { color-scheme: dark; --bg:#070b14; --panel:#101827; --line:#243044; --text:#eef4ff; --muted:#aeb9cc; --gold:#d7b56d; --blue:#72d6ff; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif; background: radial-gradient(circle at top left, rgba(114,214,255,.16), transparent 34%), var(--bg); color:var(--text); }
    a { color: inherit; }
    .wrap { width:min(1120px, calc(100% - 32px)); margin:0 auto; }
    header { border-bottom:1px solid var(--line); background:rgba(7,11,20,.78); backdrop-filter: blur(16px); position:sticky; top:0; z-index:2; }
    .top { display:flex; align-items:center; justify-content:space-between; min-height:72px; gap:24px; }
    .brand { font-weight:800; letter-spacing:.03em; color:var(--gold); text-decoration:none; }
    nav { display:flex; gap:18px; flex-wrap:wrap; font-size:14px; color:var(--muted); }
    nav a { text-decoration:none; }
    .hero { padding:86px 0 56px; }
    .badge { display:inline-flex; gap:10px; align-items:center; border:1px solid var(--line); border-radius:999px; padding:8px 12px; color:var(--muted); background:rgba(16,24,39,.72); }
    h1 { font-size: clamp(42px, 7vw, 82px); line-height:.96; margin:24px 0; letter-spacing:-.06em; max-width:920px; }
    .lead { font-size: clamp(18px, 2vw, 24px); line-height:1.55; color:var(--muted); max-width:840px; }
    .actions { display:flex; gap:14px; flex-wrap:wrap; margin-top:34px; }
    .btn { display:inline-flex; align-items:center; justify-content:center; min-height:48px; padding:0 20px; border-radius:14px; text-decoration:none; font-weight:700; border:1px solid var(--line); }
    .btn.primary { background:linear-gradient(135deg, var(--gold), #f3d990); color:#111827; border:0; }
    .btn.secondary { background:rgba(16,24,39,.82); color:var(--text); }
    section { padding:34px 0; }
    .grid { display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:18px; }
    .card, .nav-card { display:block; background:rgba(16,24,39,.78); border:1px solid var(--line); border-radius:24px; padding:24px; text-decoration:none; min-height:170px; }
    .card h3, .nav-card strong { display:block; margin:0 0 12px; font-size:20px; }
    .card p, .nav-card span { color:var(--muted); line-height:1.55; margin:0; }
    .eyebrow { color:var(--blue)!important; font-size:12px; text-transform:uppercase; letter-spacing:.14em; font-weight:800; margin-bottom:10px!important; }
    .panel { background:rgba(16,24,39,.78); border:1px solid var(--line); border-radius:28px; padding:28px; }
    .trust { color:var(--muted); font-size:14px; line-height:1.7; }
    footer { border-top:1px solid var(--line); margin-top:48px; padding:32px 0; color:var(--muted); font-size:14px; }
    @media (max-width:820px) { .grid { grid-template-columns:1fr; } .top { align-items:flex-start; flex-direction:column; padding:18px 0; } }
  </style>
</head>
<body>
  <header>
    <div class="wrap top">
      <a class="brand" href="/">DaniniHub</a>
      <nav>
        <a href="/methode">Methode</a>
        <a href="/projektmodus">Projektmodus</a>
        <a href="/preise">Preise</a>
        <a href="/artifacts">Artifacts</a>
        <a href="/analyse-starten">ENTRY</a>
      </nav>
    </div>
  </header>
  <main>
    <div class="wrap hero">
      <span class="badge">USTAV-first · DACH-ready · AI Transparency</span>
      <h1>DaniniHub ist kein Chatbot. DaniniHub ist ein strukturierter Projektmodus.</h1>
      <p class="lead">Ein Decision Engine für Menschen, die mit KI nicht nur Antworten sammeln, sondern bessere Fragen stellen, Projekte klären und belastbare Artifacts erzeugen wollen.</p>
      <div class="actions">
        <a class="btn primary" href="${checkoutHref}">ENTRY für 7 € aktivieren</a>
        <a class="btn secondary" href="/methode">Methode verstehen</a>
      </div>
    </div>

    <section class="wrap">
      <div class="grid">
        <article class="card"><p class="eyebrow">Methode</p><h3>Frage KI – KI fragt dich</h3><p>Der Prozess folgt nicht dem Prompt-Hype, sondern einem kontrollierten Dialog: Frage, Gegenfrage, Reflexion, Aktion.</p></article>
        <article class="card"><p class="eyebrow">Project Mode</p><h3>Gate 0–5</h3><p>Ein aktives Projekt wird durch strukturierte Gates geführt, mit Status, Review-Logik und Artifact-Fokus.</p></article>
        <article class="card"><p class="eyebrow">ENTRY</p><h3>7 € vor Analyse</h3><p>Die Aktivierung erfolgt vor ressourcenintensiver Analyse. MVP-Checkout über Gumroad, Automation erst nach Validierung.</p></article>
      </div>
    </section>

    <section class="wrap">
      <div class="panel">
        <p class="eyebrow">Public Web Layer</p>
        <h2>${escapeHtml(page.title)}</h2>
        <p class="trust">${escapeHtml(page.purpose)}</p>
      </div>
    </section>

    <section class="wrap">
      <p class="eyebrow">Artifacts</p>
      <div class="grid">${artifactsHtml}</div>
    </section>

    <section class="wrap">
      <p class="eyebrow">System Navigation</p>
      <div class="grid">${pagesHtml}</div>
    </section>

    <section class="wrap">
      <div class="panel trust" id="entry-not-configured">
        <strong>Transparenz:</strong> DaniniHub garantiert kein Einkommen, keinen Investment-Erfolg und ersetzt keine rechtliche, medizinische oder finanzielle Beratung. KI unterstützt den Prozess; Entscheidungen bleiben beim Nutzer. Stripe-, Brevo-, PDF- und Member-Automation bleiben blockiert, bis sie vollständig validiert sind.
      </div>
    </section>
  </main>
  <footer>
    <div class="wrap">© DaniniHub · AI Transparency · Affiliate Disclosure · Datenschutz · Impressum</div>
  </footer>
</body>
</html>`;
}

function mountPublicWebLayer(app) {
  app.get('/', (req, res) => res.type('html').send(renderPublicHtml('/')));

  const publicRoutes = ['/methode', '/projektmodus', '/preise', '/analyse-starten', '/artifacts'];
  for (const route of publicRoutes) {
    app.get(route, (req, res) => res.type('html').send(renderPublicHtml(route)));
  }

  app.get('/api/public-layer', (req, res) => res.json(getPublicWebLayerPayload('/')));

  app.get('/api/entry/7-eur', (req, res) => {
    res.json({
      status: 'external_checkout_manual_activation_mvp',
      project: 'DaniniHub',
      entry: {
        price: { amount: 7, currency: 'EUR' },
        mode: 'payment_first_before_analysis',
        checkoutProvider: 'gumroad',
        gumroadProductUrl: process.env.GUMROAD_ENTRY_URL || 'not_configured',
        fulfillment: 'manual_or_semiautomatic_until_pdf_email_auth_validated'
      },
      blockedAutomation: [
        'stripe_full_automation_until_webhook_validated',
        'brevo_delivery_until_email_pipeline_validated',
        'pdf_download_until_artifact_pipeline_validated',
        'member_dashboard_until_auth_validated'
      ]
    });
  });

  app.get('/api/entry/7-eur/checkout', (req, res) => {
    const checkoutUrl = process.env.GUMROAD_ENTRY_URL;
    if (!checkoutUrl) {
      return res.status(503).json({
        status: 'checkout_not_configured',
        requiredEnv: 'GUMROAD_ENTRY_URL'
      });
    }
    return res.redirect(302, checkoutUrl);
  });
}

module.exports = { mountPublicWebLayer, getPublicWebLayerPayload, renderPublicHtml };
