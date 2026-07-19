'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const runtimePath = path.join(__dirname, '..', 'server-public-runtime.js');
const source = fs.readFileSync(runtimePath, 'utf8');

const forbidden = [
  '30-dnevnog pilot-projekta',
  '30-dnevnom pilot-projektu',
  '30-Tage-Pilotprojekt',
  '30-Tage-Pilotvorschlag',
  '7-dnevnog pilot',
  '7-Tage-Pilot'
];

for (const phrase of forbidden) {
  assert(!source.includes(phrase), `Forbidden pilot wording found: ${phrase}`);
}

const required = [
  '14-dnevnog Founding Pilota',
  '14-dnevnom DaniniHub Founding Pilotu',
  '14-tägigen Founding Pilot',
  '14-tägigen DaniniHub Founding Pilot',
  '14-Tage-Founding-Pilot vorschlagen',
  'najviše osam operativnih sati ukupno',
  'höchstens acht operative Stunden insgesamt',
  'bez automatskog produženja',
  'ohne automatische Verlängerung'
];

for (const phrase of required) {
  assert(source.includes(phrase), `Required pilot wording missing: ${phrase}`);
}

console.log('Pilot policy contract OK');
