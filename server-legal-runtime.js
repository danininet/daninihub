'use strict';

function mountLegalRuntime(app) {
  const redirects = {
    '/cookies': '/de/cookies',
    '/ki-transparenz': '/de/ki-transparenz',
    '/affiliate-hinweis': '/de/affiliate-hinweis',
    '/impressum': '/de/impressum',
    '/datenschutz': '/de/datenschutz',
    '/nutzungsbedingungen': '/de/nutzungsbedingungen',
    '/widerruf': '/de/widerruf',
    '/haftungsausschluss': '/de/haftungsausschluss'
  };

  Object.entries(redirects).forEach(([route, target]) => {
    app.get(route, (req, res) => res.redirect(308, target));
  });
}

module.exports = { mountLegalRuntime };
