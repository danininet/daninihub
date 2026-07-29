'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const serverSource = fs.readFileSync(path.join(root, 'server-public-runtime.js'), 'utf8');
const appSource = fs.readFileSync(path.join(root, 'daninihub-front', 'src', 'App.jsx'), 'utf8');

// The current DaniniHub offer must not promise an automatic fixed-duration trial.
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
  assert(!serverSource.includes(phrase), `Obsolete fixed-duration pilot wording found: ${phrase}`);
  assert(!appSource.includes(phrase), `Obsolete fixed-duration pilot wording found in frontend: ${phrase}`);
}

// Current product direction must remain present.
assert.match(appSource, /DispoLab/);
assert.match(appSource, /TransportRoomDemo/);
assert.match(appSource, /TransportNetworkDemo/);
assert.match(serverSource, /Keine reale Transportsteuerung|fiktiv|Fiktiv|FICTITIOUS/);

console.log('DaniniHub current pilot policy contract: OK');
