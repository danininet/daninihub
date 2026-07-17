'use strict';

const assert = require('node:assert/strict');
const { SITE_ROUTES } = require('../core/site-ui');
const { renderLegal, renderMarketing, renderTrustIndex } = require('../server-public-runtime');
const { renderEntry } = require('../server-entry-flow-layer');
const { renderSuccessHtml } = require('../server-success-layer');
const { renderGuidedPage } = require('../server-guided-analysis-runtime');

const imprint = renderLegal('de', 'imprint');
assert.match(imprint, /Dragan Zdravkovic/);
assert.match(imprint, /Fischerstraße 54/);
assert.match(imprint, /47055 Duisburg/);
assert.match(imprint, /dragangaganet@gmail\.com/);
assert.match(imprint, /§ 5 DDG/);
assert.match(imprint, /legal-layout/);
assert.match(imprint, /legal-document/);

const privacy = renderLegal('de', 'privacy');
for (const provider of ['Hostinger', 'Gumroad', 'Brevo', 'Google Gemini API']) assert.match(privacy, new RegExp(provider));
assert.match(privacy, /Art\. 13 DSGVO/);

const withdrawal = renderLegal('de', 'withdrawal');
assert.match(withdrawal, /vierzehn Tagen/);
assert.match(withdrawal, /Kein.*pauschale Verkürzung|Keine pauschale Verkürzung/);
assert.equal(SITE_ROUTES.de.withdrawal, '/de/widerruf');

const srPrivacy = renderLegal('sr', 'privacy');
const enPrivacy = renderLegal('en', 'privacy');
assert.doesNotMatch(srPrivacy, /Verantwortlicher|Welche Daten|Ihre Rechte/);
assert.doesNotMatch(enPrivacy, /Verantwortlicher|Welche Daten|Ihre Rechte/);
assert.match(srPrivacy, /Informativni prevod/);
assert.match(enPrivacy, /Informational translation/);

for (const html of [renderMarketing('de','home'), renderTrustIndex('de'), renderEntry('de'), renderSuccessHtml('de'), renderGuidedPage()]) {
  assert.match(html, /site-header/);
  assert.match(html, /site-footer/);
  assert.match(html, /viewport/);
}

assert.match(renderEntry('de'), /12 €/);
assert.match(renderGuidedPage(), /noindex,nofollow/);
assert.match(renderSuccessHtml('de'), /noindex,follow/);

console.log('DaniniHub public content and legal layout contract: OK');
