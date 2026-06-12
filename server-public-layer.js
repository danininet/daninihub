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

function mountPublicWebLayer(app) {
  app.get('/', (req, res) => res.json(getPublicWebLayerPayload('/')));
  app.get(['/methode', '/projektmodus', '/preise', '/analyse-starten', '/artifacts'], (req, res) => {
    res.json(getPublicWebLayerPayload(req.path));
  });
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

module.exports = { mountPublicWebLayer, getPublicWebLayerPayload };
