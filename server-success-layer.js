function renderSuccessHtml(lang = 'de') {
  const isSr = lang === 'sr';
  const isEn = lang === 'en';
  const route = isSr ? '/sr/analyse-starten' : isEn ? '/en/analyse-starten' : '/analyse-starten';
  const text = isSr ? {
    title: 'DaniniHub ENTRY aktivacija',
    label: 'DaniniHub - ENTRY 7 EUR',
    h1: 'ENTRY je aktiviran za sledeci korak.',
    p1: 'Ako si dosao preko Gumroad kupovine, koristi isti email u nastavku procesa.',
    p2: 'MVP faza: validacija pristupa i isporuka artifact-a moze biti rucna ili poluautomatska.',
    cta: 'Pokreni analizu',
    disclaimer: 'Bez garancije zarade, investicionog uspeha, pravnog, finansijskog ili medicinskog saveta.'
  } : isEn ? {
    title: 'DaniniHub ENTRY activation',
    label: 'DaniniHub - ENTRY 7 EUR',
    h1: 'ENTRY has been activated for the next step.',
    p1: 'If you arrived after a Gumroad purchase, use the same email in the next process step.',
    p2: 'MVP phase: access validation and artifact delivery may be manual or semi-automatic.',
    cta: 'Start analysis',
    disclaimer: 'No income, investment, legal, financial or medical guarantee.'
  } : {
    title: 'DaniniHub ENTRY Aktivierung',
    label: 'DaniniHub - ENTRY 7 EUR',
    h1: 'ENTRY ist fuer den naechsten Schritt aktiviert.',
    p1: 'Wenn du ueber einen Gumroad-Kauf kommst, nutze im weiteren Prozess dieselbe E-Mail-Adresse.',
    p2: 'MVP-Phase: Zugangsvalidierung und Artefakt-Lieferung koennen manuell oder halbautomatisch erfolgen.',
    cta: 'Analyse starten',
    disclaimer: 'Keine Einkommens-, Investment-, Rechts-, Finanz- oder Gesundheitsgarantie.'
  };

  return `<!doctype html><html lang="${isSr ? 'sr' : isEn ? 'en' : 'de'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${text.title}</title></head><body style="font-family:Arial,sans-serif;margin:0;background:#0b1220;color:#f8fafc"><main style="max-width:760px;margin:0 auto;padding:64px 24px"><p style="color:#93c5fd">${text.label}</p><h1>${text.h1}</h1><p>${text.p1}</p><p>${text.p2}</p><p><a href="${route}" style="display:inline-block;background:#d6b25e;color:#111827;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:bold">${text.cta}</a></p><hr style="border-color:#1f2937"><p style="color:#cbd5e1">${text.disclaimer}</p></main></body></html>`;
}

function mountSuccessLayer(app) {
  app.get('/gumroad-success', (req, res) => {
    const lang = String(req.query.lang || 'de').toLowerCase();
    res.type('html').send(renderSuccessHtml(lang));
  });
}

module.exports = { mountSuccessLayer };