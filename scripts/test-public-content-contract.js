'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

const serverRuntime = read('server-public-runtime.js');
const appSource = read('daninihub-front/src/App.jsx');
const landingSource = read('daninihub-front/src/RevenueOSLanding.jsx');
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
assert.match(serverRuntime, /hreflang="x-default"/);

assert.match(appSource, /RevenueOSLanding/);
assert.match(appSource, /RevenueLegal/);
assert.match(appSource, /DispatchPilotWorkspace/);
assert.doesNotMatch(appSource, /DispoLabPage/);
assert.doesNotMatch(appSource, /TransportRoomDemo/);
assert.doesNotMatch(appSource, /TransportNetworkDemo/);

assert.match(landingSource, /B2B/);
assert.match(landingSource, /privacy_ack/);
assert.match(landingSource, /name="website"/);
assert.match(landingSource, /kein verbindliches Angebot|nije obavezujuća ponuda/i);
assert.match(legalSource, /§ 5 DDG/);
assert.match(legalSource, /Art\. 6 Abs\. 1 lit\. b DSGVO/);
assert.match(legalSource, /§ 25 Abs\. 2 TDDDG/);
assert.match(legalSource, /KI-System/);
assert.match(legalSource, /Kein automatischer Vertragsschluss/i);

console.log('DaniniHub Revenue OS public/legal contract: OK');
