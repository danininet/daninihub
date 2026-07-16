function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

const copy = {
  de: {
    path: '/analyse-starten', title: 'Die KI fragt nach - persönliche Analyse für 12 EUR', method: 'Die KI stellt die richtigen Rückfragen',
    badge: 'Einmalzahlung · drei gezielte Rückfragen · persönlicher PDF-Bericht',
    lead: 'Beschreibe dein Problem oder deine Entscheidung. Die KI stellt dir drei aufeinander aufbauende Rückfragen und erstellt danach eine persönliche, strukturierte Analyse mit konkreten nächsten Schritten.',
    cta: 'Analyse für 12 EUR starten', back: 'Zur Startseite',
    steps: ['Sichere Zahlung über Gumroad', 'Persönlichen Zugangslink erhalten', 'Ausgangsfrage beantworten', 'Drei gezielte KI-Rückfragen beantworten', 'Analyse und PDF-Bericht per E-Mail erhalten'],
    agents: ['Guided Question Engine', 'Analysis Controller', 'PDF Artifact Layer', 'Delivery Audit'],
    legal: ['KI-Transparenz sichtbar', 'Datenschutz und notwendige Sitzungsdaten', 'Keine Rechts-, Finanz-, Gesundheits- oder Einkommensgarantie'],
    cookies: 'Im MVP werden nur technisch notwendige Sitzungs- und Aktivierungsinformationen verarbeitet. Die Zahlung erfolgt extern über Gumroad.'
  },
  sr: {
    path: '/sr/aktivacija', title: 'AI pita dalje - lična analiza za 12 EUR', method: 'AI postavlja prava podpitanja',
    badge: 'Jednokratno plaćanje · tri ciljana podpitanja · lični PDF izveštaj',
    lead: 'Opiši problem ili odluku. AI ti zatim postavlja tri povezana podpitanja i na kraju priprema ličnu, strukturisanu analizu sa konkretnim sledećim koracima.',
    cta: 'Pokreni analizu za 12 EUR', back: 'Nazad na početnu',
    steps: ['Sigurno plaćanje preko Gumroad-a', 'Dobijanje ličnog pristupnog linka', 'Odgovor na početno pitanje', 'Odgovor na tri AI podpitanja', 'Analiza i PDF izveštaj na email'],
    agents: ['Guided Question Engine', 'Analysis Controller', 'PDF Artifact Layer', 'Delivery Audit'],
    legal: ['AI transparentnost je vidljiva', 'Privatnost i neophodni podaci sesije', 'Nema pravne, finansijske, medicinske ili garancije zarade'],
    cookies: 'U MVP verziji obrađuju se samo tehnički neophodni podaci za sesiju i aktivaciju. Plaćanje se obavlja preko Gumroad-a.'
  },
  en: {
    path: '/en/activation', title: 'AI asks further - personal analysis for 12 EUR', method: 'AI asks the questions that matter',
    badge: 'One-time payment · three targeted follow-ups · personal PDF report',
    lead: 'Describe your problem or decision. AI asks three sequential follow-up questions and then creates a personal structured analysis with concrete next steps.',
    cta: 'Start analysis for 12 EUR', back: 'Back to home',
    steps: ['Secure Gumroad payment', 'Receive a personal access link', 'Answer the opening question', 'Answer three AI follow-up questions', 'Receive the analysis and PDF by email'],
    agents: ['Guided Question Engine', 'Analysis Controller', 'PDF Artifact Layer', 'Delivery Audit'],
    legal: ['Visible AI transparency', 'Privacy and required session data', 'No legal, financial, medical or income guarantee'],
    cookies: 'The MVP processes only technically required session and activation information. Payment is handled externally by Gumroad.'
  }
};

function langFromPath(path) {
  if (path.startsWith('/sr')) return 'sr';
  if (path.startsWith('/en')) return 'en';
  return 'de';
}

function renderEntry(lang) {
  const t = copy[lang] || copy.de;
  const checkout = '/api/entry/12-eur/checkout';
  const steps = t.steps.map((s, i) => `<li><b>${i + 1}.</b> ${escapeHtml(s)}</li>`).join('');
  const agents = t.agents.map((a) => `<span class="pill">${escapeHtml(a)}</span>`).join('');
  const legal = t.legal.map((l) => `<li>${escapeHtml(l)}</li>`).join('');
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(t.title)} | DaniniHub</title><meta name="description" content="${escapeHtml(t.lead)}"><meta name="robots" content="index,follow"><style>body{margin:0;font-family:Inter,Arial,sans-serif;background:#0b1220;color:#edf2f7}.wrap{max-width:1080px;margin:auto;padding:42px 22px}.logo{font-weight:800;letter-spacing:.04em}.badge,.pill{display:inline-block;border:1px solid rgba(212,175,55,.45);border-radius:999px;padding:8px 12px;color:#f5d477;margin:8px 8px 8px 0}.hero{padding:44px 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}.card{background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:22px}.cta{display:inline-block;background:#d4af37;color:#111827;padding:14px 18px;border-radius:12px;text-decoration:none;font-weight:800}.secondary{color:#cbd5e1}.muted{color:#aeb8c7;line-height:1.7}li{margin:10px 0}a{color:#f5d477}</style></head><body><main class="wrap"><div class="logo">Danini OS · Die KI fragt nach</div><section class="hero"><span class="badge">${escapeHtml(t.badge)}</span><h1>${escapeHtml(t.title)}</h1><h2>${escapeHtml(t.method)}</h2><p class="muted">${escapeHtml(t.lead)}</p><p><a class="cta" href="${checkout}">${escapeHtml(t.cta)}</a> <a class="secondary" href="${lang==='sr'?'/sr':lang==='en'?'/en':'/'}">${escapeHtml(t.back)}</a></p></section><section class="grid"><div class="card"><h3>Flow</h3><ol>${steps}</ol></div><div class="card"><h3>Danini OS</h3><p class="muted">${agents}</p></div><div class="card"><h3>Trust / Legal</h3><ul>${legal}</ul></div><div class="card"><h3>Datenschutz</h3><p class="muted">${escapeHtml(t.cookies)}</p></div></section></main></body></html>`;
}

function mountEntryFlowLayer(app) {
  ['/analyse-starten', '/sr/aktivacija', '/en/activation'].forEach((path) => {
    app.get(path, (req, res) => res.type('html').send(renderEntry(langFromPath(path))));
  });
  app.get('/api/entry/12-eur', (req, res) => res.json({ project:'Danini OS', product:{ id:'die-ki-fragt-nach', amount:12, currency:'EUR', provider:'gumroad_mvp', checkoutUrl:process.env.GUMROAD_ENTRY_URL || 'not_configured', flow:'initial_question_plus_three_followups_then_pdf' } }));
  app.get('/api/entry/12-eur/checkout', (req, res) => { const url = process.env.GUMROAD_ENTRY_URL; if (!url) return res.status(503).json({ error:'checkout_not_configured' }); return res.redirect(302, url); });
  app.get('/api/entry/7-eur', (req, res) => res.redirect(308, '/api/entry/12-eur'));
  app.get('/api/entry/7-eur/checkout', (req, res) => res.redirect(308, '/api/entry/12-eur/checkout'));
}

module.exports = { mountEntryFlowLayer };