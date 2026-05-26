const LOCALES = Object.freeze({
  de: {
    code: 'de',
    label: 'Deutsch',
    market: 'DACH',
    priority: 1,
    role: 'Public authority, legal and SEO language',
    hreflang: 'de-DE',
    dir: 'ltr'
  },
  sr: {
    code: 'sr',
    label: 'Srpski',
    market: 'Owner working language',
    priority: 2,
    role: 'Owner operations and internal alignment',
    hreflang: 'sr',
    dir: 'ltr'
  },
  en: {
    code: 'en',
    label: 'English',
    market: 'Technical and international support',
    priority: 3,
    role: 'Technical documentation and integration language',
    hreflang: 'en',
    dir: 'ltr'
  }
});

const DEFAULT_LOCALE = 'de';

function getLocales() {
  return LOCALES;
}

function getLocale(locale = DEFAULT_LOCALE) {
  return LOCALES[locale] || LOCALES[DEFAULT_LOCALE];
}

module.exports = {
  LOCALES,
  DEFAULT_LOCALE,
  getLocales,
  getLocale
};
