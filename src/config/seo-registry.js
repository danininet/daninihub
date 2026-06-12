const SEO_REGISTRY = Object.freeze({
  market: 'DACH',
  defaultLocale: 'de',
  supportedLocales: ['de', 'sr', 'en'],
  rules: {
    hreflangRequired: true,
    canonicalRequired: true,
    structuredDataRequired: true,
    legalPagesIndexed: true,
    noGuaranteeClaims: true,
    noFakeMetrics: true,
    aiTransparencyVisible: true,
    humanReviewVisible: true
  },
  pageTypes: {
    public: ['home', 'method', 'project-mode', 'pricing', 'analyse-starten', 'artifacts', 'faq', 'partner'],
    legal: ['impressum', 'datenschutz', 'ki-transparenz', 'haftungsausschluss', 'affiliate-offenlegung'],
    protected: ['dashboard', 'project-mode-gates', 'usage'],
    artifacts: ['operatives-protokoll-der-klarheit', 'digitale-standortvermarktung-dpl', 'calije-park-residence']
  },
  canonicalRoutes: [
    '/',
    '/methode',
    '/projektmodus',
    '/preise',
    '/analyse-starten',
    '/artifacts',
    '/artifacts/operatives-protokoll-der-klarheit',
    '/artifacts/digitale-standortvermarktung',
    '/artifacts/calije-park-residence',
    '/ki-transparenz',
    '/haftungsausschluss',
    '/affiliate-offenlegung'
  ],
  structuredData: ['Organization', 'WebSite', 'FAQPage', 'BreadcrumbList', 'Product', 'CreativeWork', 'Course'],
  indexationAllowedWhen: [
    'public_content_has_no_fake_metrics',
    'legal_trust_pages_are_visible',
    'ai_transparency_is_visible',
    'entry_checkout_status_is_honest',
    'private_calije_data_is_excluded'
  ],
  blockedUntilContentApproved: ['reviewbook', 'news-recht']
});

function getSeoRegistry() {
  return SEO_REGISTRY;
}

module.exports = { getSeoRegistry };
