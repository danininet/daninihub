function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

const copy = {
  de: {
    path: '/analyse-starten', title: 'ENTRY 7 EUR - Projektaktivierung', method: 'Frage KI - KI fragt dich',
    badge: 'Zahlung zuerst · gefuehrter Projektstart · keine Erfolgsgarantie',
    lead: 'Aktiviere den strukturierten DaniniHub Einstieg. Nach der Zahlung beginnt der gefuehrte Intake mit Methodik, Kontrollrollen, Trust-Pruefung und Artefakt-Vorbereitung.',
    cta: 'ENTRY fuer 7 EUR aktivieren', back: 'Zur Startseite',
    steps: ['Gumroad Zahlung bestaetigen', 'Projektziel und Kontext erfassen', 'Method Engine fuehrt Gegenfragen', 'Kontrollrollen pruefen Klarheit und Risiken', 'Artifact Pack wird vorbereitet'],
    agents: ['Method Engine', 'Zero Hallucination Guard', 'Trust & Compliance', 'Artifact Layer'],
    legal: ['KI-Transparenz sichtbar', 'Affiliate-Hinweis vorhanden', 'Datenschutz und Cookies beachten', 'Keine Rechts-, Finanz-, Gesundheits- oder Einkommensgarantie'],
    cookies: 'Cookies: DaniniHub nutzt im MVP nur technisch notwendige Session-/Aktivierungsinformationen. Externe Zahlungen laufen ueber Gumroad.'
  },
  sr: {
    path: '/sr/aktivacija', title: 'ENTRY 7 EUR - aktivacija projekta', method: 'Pitaj AI - AI pita tebe',
    badge: 'Prvo plaćanje · vođeni projektni ulaz · bez garancije uspeha',
    lead: 'Aktiviraj strukturisani DaniniHub ulaz. Posle plaćanja kreće vođeni intake sa metodom, kontrolnim ulogama, trust proverom i pripremom artefakta.',
    cta: 'Aktiviraj ENTRY za 7 EUR', back: 'Nazad na početnu',
    steps: ['Potvrda Gumroad plaćanja', 'Unos cilja i konteksta projekta', 'Method Engine vodi kontrapitanja', 'Kontrolne uloge proveravaju jasnoću i rizike', 'Priprema se Artifact Pack'],
    agents: ['Method Engine', 'Zero Hallucination Guard', 'Trust & Compliance', 'Artifact Layer'],
    legal: ['AI transparentnost je vidljiva', 'Affiliate napomena postoji', 'Privatnost i kolačići su objašnjeni', 'Nema pravne, finansijske, medicinske ili garancije zarade'],
    cookies: 'Kolačići: DaniniHub u MVP fazi koristi samo tehnički neophodne informacije za sesiju/aktivaciju. Eksterna plaćanja idu preko Gumroad-a.'
  },
  en: {
    path: '/en/activation', title: 'ENTRY 7 EUR - project activation', method: 'Ask AI - AI asks you',
    badge: 'Payment first · guided project entry · no success guarantee',
    lead: 'Activate the structured DaniniHub entry. After payment, the guided intake starts with method, control roles, trust checks and artifact preparation.',
    cta: 'Activate ENTRY for 7 EUR', back: 'Back to home',
    steps: ['Confirm Gumroad payment', 'Capture project goal and context', 'Method Engine guides counter-questions', 'Control roles check clarity and risks', 'Artifact Pack is prepared'],
    agents: ['Method Engine', 'Zero Hallucination Guard', 'Trust & Compliance', 'Artifact Layer'],
    legal: ['AI transparency visible', 'Affiliate disclosure present', 'Privacy and cookies explained', 'No legal, financial, medical or income guarantee'],
    cookies: 'Cookies: In MVP, DaniniHub uses only technically necessary session/activation information. External payments are processed by Gumroad.'
  }
};

function langFromPath(path) {
  if (path.startsWith('/sr')) return 'sr';
  if (path.startsWith('/en')) return 'en';
  return 'de';
}

function renderEntry(lang) {
  const t = copy[lang] || copy.de;
  const checkout = '/api/entry/7-eur/checkout';
  const steps = t.steps.map((s, i) => `<li><b>${i + 1}.</b> ${escapeHtml(s)}</li>`).join('');
  const agents = t.agents.map((a) => `<span class="pill">${escapeHtml(a)}</span>`).join('');
  const legal = t.legal.map((l) => `<li>${escapeHtml(l)}</li>`).join('');
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(t.title)} | DaniniHub</title><meta name="description" content="${escapeHtml(t.lead)}"><meta name="robots" content="index,follow"><style>body{margin:0;font-family:Inter,Arial,sans-serif;background:#0b1220;color:#edf2f7}.wrap{max-width:1080px;margin:auto;padding:42px 22px}.logo{font-weight:800;letter-spacing:.04em}.badge,.pill{display:inline-block;border:1px solid rgba(212,175,55,.45);border-radius:999px;padding:8px 12px;color:#f5d477;margin:8px 8px 8px 0}.hero{padding:44px 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}.card{background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:22px}.cta{display:inline-block;background:#d4af37;color:#111827;padding:14px 18px;border-radius:12px;text-decoration:none;font-weight:800}.secondary{color:#cbd5e1}.muted{color:#aeb8c7;line-height:1.7}li{margin:10px 0}a{color:#f5d477}</style></head><body><main class="wrap"><div class="logo">DaniniHub · ENTRY</div><section class="hero"><span class="badge">${escapeHtml(t.badge)}</span><h1>${escapeHtml(t.title)}</h1><h2>${escapeHtml(t.method)}</h2><p class="muted">${escapeHtml(t.lead)}</p><p><a class="cta" href="${checkout}">${escapeHtml(t.cta)}</a> <a class="secondary" href="${lang==='sr'?'/sr':lang==='en'?'/en':'/'}">${escapeHtml(t.back)}</a></p></section><section class="grid"><div class="card"><h3>Flow</h3><ol>${steps}</ol></div><div class="card"><h3>Agent Layer</h3><p class="muted">${agents}</p></div><div class="card"><h3>Trust / Legal</h3><ul>${legal}</ul></div><div class="card"><h3>Cookies</h3><p class="muted">${escapeHtml(t.cookies)}</p></div></section></main></body></html>`;
}

function mountEntryFlowLayer(app) {
  ['/analyse-starten', '/sr/aktivacija', '/en/activation'].forEach((path) => {
    app.get(path, (req, res) => res.type('html').send(renderEntry(langFromPath(path))));
  });
  app.get('/api/entry/7-eur', (req, res) => res.json({ project:'DaniniHub', entry:{ amount:7, currency:'EUR', provider:'gumroad_mvp', checkoutUrl:process.env.GUMROAD_ENTRY_URL || 'not_configured', mode:'payment_first_before_analysis' }, agentFlow:['Method Engine','Zero Hallucination Guard','Trust & Compliance','Artifact Layer'], cookies:'technical_required_only_mvp', legal:['ai_transparency','affiliate_disclosure','privacy','cookies','disclaimer'] }));
  app.get('/api/entry/7-eur/checkout', (req, res) => { const url = process.env.GUMROAD_ENTRY_URL; if (!url) return res.status(503).json({ error:'checkout_not_configured' }); return res.redirect(302, url); });
}

module.exports = { mountEntryFlowLayer };
