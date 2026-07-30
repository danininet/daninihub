'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

const serverRuntime = read('server-public-runtime.js');
const appSource = read('daninihub-front/src/App.jsx');
const dispoLabSource = read('daninihub-front/src/DispoLabPage.jsx');
const dispoCheckSource = read('daninihub-front/src/DispoCheck.jsx');
const transportRoomSource = read('daninihub-front/src/TransportRoomDemo.jsx');
const transportNetworkSource = read('daninihub-front/src/TransportNetworkDemo.jsx');

// Public runtime and contact workflow.
assert.match(serverRuntime, /mountPublicRuntime/);
assert.match(serverRuntime, /app\.post\('\/api\/contact'/);
assert.match(serverRuntime, /isPilot \? 'PILOT' : 'LEAD'/);
assert.match(serverRuntime, /Neue strukturierte Pilot-Anfrage/);
assert.match(serverRuntime, /lead-review/);
assert.match(serverRuntime, /DANINI_ADMIN_SECRET/);
assert.match(serverRuntime, /DANINI_SESSION_SECRET/);
assert.match(serverRuntime, /daninihub-lead-review-v1/);
assert.match(serverRuntime, /legacyGoneRoutes/);
assert.match(serverRuntime, /status\(410\)/);
assert.match(serverRuntime, /X-Robots-Tag/);

// Current public routes must be served by the SPA runtime.
for (const route of [
  '/de/', '/sr/',
  '/de/dispolab', '/sr/dispo-lab',
  '/de/dispolab/check', '/sr/dispo-lab/provera',
  '/de/transport-room-demo', '/sr/transportna-soba-demo',
  '/de/transport-network-demo', '/sr/transportna-mreza-demo',
  '/de/impressum', '/de/datenschutz', '/de/cookies', '/de/haftungsausschluss',
  '/sr/impressum', '/sr/privatnost', '/sr/kolacici', '/sr/odricanje-odgovornosti',
  '/de/pilot-check', '/sr/provera-pilota',
  '/de/leistungsrahmen', '/sr/obim-usluge',
  '/de/continuity-support', '/sr/kontinuitet-podrska',
  '/de/fahrerkommunikation', '/sr/komunikacija-vozaci',
  '/de/praxis-wissen', '/sr/praksa-znanje'
]) {
  assert.match(serverRuntime, new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

assert.match(serverRuntime, /renderSeoPage/);
assert.match(serverRuntime, /hreflang="x-default"/);

// React routing and current products.
assert.match(appSource, /DispoLabPage/);
assert.match(appSource, /DispoCheck/);
assert.match(appSource, /TransportRoomDemo/);
assert.match(appSource, /TransportNetworkDemo/);
assert.match(appSource, /transport-network-demo/);
assert.match(appSource, /transport-room-demo/);

// Product components must contain their core interaction contracts.
assert.match(dispoLabSource, /DispoLab/);
assert.match(dispoCheckSource, /questions/);
assert.match(dispoCheckSource, /Dispatch Readiness/);
assert.match(transportRoomSource, /transport-room/);
assert.match(transportNetworkSource, /transport-network/);

console.log('DaniniHub public content contract: OK');
