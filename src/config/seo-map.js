const SEO_MAP = Object.freeze({
  ROOT: {
    route: '/',
    primaryKeyword: 'DaniniHub Project Mode',
    linkedModules: ['/projektmodus', '/preise', '/faq', '/reviewbook']
  },
  METHOD: {
    route: '/methode',
    primaryKeyword: 'Pitaj AI AI pita tebe',
    linkedModules: ['/projektmodus', '/news-recht', '/partner']
  },
  PROJECT_MODE: {
    route: '/projektmodus',
    primaryKeyword: 'Project Mode System',
    linkedModules: ['/preise', '/reviewbook', '/faq']
  },
  DIGITAL_LOCATION_SALES: {
    route: '/digitale-standortvermarktung',
    primaryKeyword: 'Digitale prodaja lokacije',
    linkedModules: ['/reviewbook', '/partner', '/projektmodus']
  },
  CALIJE_CASE: {
    route: '/case-study/calije-park-residence',
    primaryKeyword: 'Calije Park Residence',
    linkedModules: ['/digitale-standortvermarktung', '/projektmodus']
  },
  SUPPORT: {
    route: '/support',
    primaryKeyword: 'AI Support Infrastruktur',
    linkedModules: ['/faq', '/partner']
  },
  INTERNATIONAL_CONTRACTS: {
    route: '/internationale-vertragsanalyse',
    primaryKeyword: 'Internationale Vertragsanalyse',
    linkedModules: ['/support', '/faq']
  }
});

module.exports = {
  SEO_MAP
};
