function renderSuccessHtml(lang = 'de') {
  const isSr = lang === 'sr';
  const isEn = lang === 'en';
  const route = isSr ? '/sr/aktivacija' : isEn ? '/en/activation' : '/analyse-starten';
  const text = isSr ? {
    title: 'DaniniHub - kupovina je potvrđena',
    label: 'Die KI fragt nach · 12 EUR',
    h1: 'Hvala. Vaš pristup je spreman.',
    p1: 'Lični pristupni link poslali smo na email adresu korišćenu pri kupovini.',
    p2: 'Otvorite link, odgovorite na početno pitanje i tri podpitanja, a zatim ćete dobiti ličnu analizu i PDF.',
    cta: 'Pokreni analizu',
    disclaimer: 'Bez garancije zarade, investicionog uspeha, pravnog, finansijskog ili medicinskog saveta.'
  } : isEn ? {
    title: 'DaniniHub - purchase confirmed',
    label: 'AI asks further · 12 EUR',
    h1: 'Thank you. Your access is ready.',
    p1: 'We sent your personal access link to the email address used for the purchase.',
    p2: 'Open the link, answer the opening question and three follow-ups, then receive your personal analysis and PDF.',
    cta: 'Start analysis',
    disclaimer: 'No income, investment, legal, financial or medical guarantee.'
  } : {
    title: 'DaniniHub - Kauf bestätigt',
    label: 'Die KI fragt nach · 12 EUR',
    h1: 'Vielen Dank. Ihr Zugang ist bereit.',
    p1: 'Den persönlichen Zugangslink haben wir an die beim Kauf verwendete E-Mail-Adresse gesendet.',
    p2: 'Öffnen Sie den Link, beantworten Sie die Ausgangsfrage und drei Rückfragen. Danach erhalten Sie Ihre persönliche Analyse und das PDF.',
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
