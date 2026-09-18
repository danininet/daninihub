'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const serverSource = fs.readFileSync(path.join(root, 'server-public-runtime.js'), 'utf8');
const appSource = fs.readFileSync(path.join(root, 'daninihub-front', 'src', 'App.jsx'), 'utf8');
const landingSource = fs.readFileSync(path.join(root, 'daninihub-front', 'src', 'RevenueOSLanding.jsx'), 'utf8');

// The current DaniniHub offer must not promise an automatic fixed-duration trial
// or preserve transport products as active public offers.
const obsoleteFixedPilotClaims = [
  '30-dnevnog pilot-projekta',
  '30-dnevnom pilot-projektu',
  '30-Tage-Pilotprojekt',
  '30-Tage-Pilotvorschlag',
  '14-dnevnog Founding Pilota',
  '14-dnevnom DaniniHub Founding Pilotu',
  '14-tägigen Founding Pilot',
  '14-tägigen DaniniHub Founding Pilot',
  '14-Tage-Founding-Pilot vorschlagen',
  '7-dnevnog pilot',
  '7-Tage-Pilot'
];

for (const phrase of obsoleteFixedPilotClaims) {
  assert(!landingSource.includes(phrase), 'Obsolete fixed-duration pilot wording found: ' + phrase);
}

// Current public product direction.
assert.match(appSource, /RevenueOSLanding/);
assert.match(appSource, /RevenueLegal/);
assert.doesNotMatch(appSource, /DispoLabPage/);
assert.doesNotMatch(appSource, /TransportRoomDemo/);
assert.doesNotMatch(appSource, /TransportNetworkDemo/);
assert.match(landingSource, /AI Office 24\/7/);
assert.match(landingSource, /SCALE, CHANGE oder KILL|SCALE, CHANGE ili KILL/);

// Retired transport URLs must be explicitly discontinued instead of remaining
// active sales pages. Internal workspace may remain protected for technical use.
assert.match(serverSource, /discontinuedRoutes/);
assert.match(serverSource, /status\(410\)/);
assert.match(appSource, /DispatchPilotWorkspace/);

console.log('DaniniHub Revenue OS pilot policy contract: OK');
