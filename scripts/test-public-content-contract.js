'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

const serverRuntime = read('server-public-runtime.js');
const appSource = read('daninihub-front/src/App.jsx');
const landingSource = read('daninihub-front/src/ImportOSLanding.jsx');
const legalSource = read('daninihub-front/src/RevenueLegal.jsx');

assert.match(serverRuntime, /mountPublicRuntime/);
assert.match(serverRuntime, /app\.post\('\/api\/contact'/);
assert.match(serverRuntime, /revenue-os-intake/);
assert.match(serverRuntime, /privacy_acknowledged/);
assert.match(serverRuntime, /SPAM_REJECTED/);
assert.match(serverRuntime, /lead-review/);
assert.match(serverRuntime, /DANINI_ADMIN_SECRET/);
assert.match(serverRuntime, /DANINI_SESSION_SECRET/);
assert.match(serverRuntime, /daninihub-lead-review-v1/);
assert.match(serverRuntime, /discontinuedRoutes/);
assert.match(serverRuntime, /status\(410\)/);
assert.match(serverRuntime, /X-Robots-Tag/);

for (const route of [
  '/de/', '/sr/',
  '/de/impressum', '/sr/impressum',
  '/de/datenschutz', '/sr/privatnost',
  '/de/cookies', '/sr/kolacici',
  '/de/ai-transparenz', '/sr/ai-transparentnost',
  '/de/bedingungen', '/sr/uslovi'
]) {
  assert.equal(serverRuntime.includes(route), true, 'missing current route: ' + route);
}

for (const route of [
  '/de/externe-disposition',
  '/sr/eksterna-dispozicija',
  '/de/dispolab',
  '/sr/dispo-lab',
  '/de/transport-room-demo',
  '/sr/transportna-soba-demo'
]) {
  assert.equal(serverRuntime.includes(route), true, 'missing discontinued route: ' + route);
}
assert.match(serverRuntime, /Dieses frühere Angebot wurde eingestellt/);
assert.match(serverRuntime, /Ova ranija ponuda je ugašena/);

assert.match(serverRuntime, /renderSeoPage/);
assert.match(serverRuntime, /rootSnapshot/);
assert.match(serverRuntime, /Danini ImportOS/);
assert.match(serverRuntime, /FAQPage/);
assert.match(serverRuntime, /Disallow: \/admin/);
assert.match(serverRuntime, /hreflang="x-default"/);

assert.match(appSource, /ImportOSLanding/);
assert.match(appSource, /RevenueLegal/);
assert.match(appSource, /DispatchPilotWorkspace/);
assert.doesNotMatch(appSource, /DispoLabPage/);
assert.doesNotMatch(appSource, /TransportRoomDemo/);
assert.doesNotMatch(appSource, /TransportNetworkDemo/);

assert.match(landingSource, /Import Passport/);
assert.match(landingSource, /Model DNA/);
assert.match(landingSource, /Fraud Shield/);
assert.match(landingSource, /Dealer Radar/);
assert.match(landingSource, /originProof/);
assert.match(landingSource, /serbiaMarketValue/);
assert.match(legalSource, /§ 5 DDG/);
assert.match(legalSource, /Art\. 6 Abs\. 1 lit\. b DSGVO/);
assert.match(legalSource, /§ 25 Abs\. 2 TDDDG/);
assert.match(legalSource, /KI-System/);
assert.match(legalSource, /Kein automatischer Vertragsschluss/i);

console.log('DaniniHub ImportOS public/legal contract: OK');
