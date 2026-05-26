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
    aiTransparencyVisible: true
  },
  pageTypes: {
    public: ['home', 'method', 'project-mode', 'pricing', 'faq', 'partner'],
    legal: ['impressum', 'datenschutz', 'ki-transparenz', 'haftungsausschluss', 'affiliate-offenlegung'],
    protected: ['dashboard', 'project-mode-gates', 'artifacts', 'usage']
  },
  structuredData: ['Organization', 'WebSite', 'FAQPage', 'BreadcrumbList'],
  blockedUntilContentApproved: ['pricing', 'reviewbook', 'news-recht']
});

function getSeoRegistry() {
  return SEO_REGISTRY;
}

module.exports = { getSeoRegistry };
