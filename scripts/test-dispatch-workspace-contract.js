'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'daninihub-front/src/App.jsx'), 'utf8');
const workspace = fs.readFileSync(path.join(root, 'daninihub-front/src/DispatchPilotWorkspace.jsx'), 'utf8');

for (const required of [
  'INTERNE PILOTVERSION · NUR FIKTIVE DATEN',
  'Potvrđene činjenice',
  'Nepoznato / mora se proveriti',
  'Potrebna odluka',
  'Odgovorna osoba',
  'Ručno odobri nacrt',
  'Odbij i vrati na doradu',
  'Automatsko slanje je deaktivirano',
  'Audit događaja',
  'Radno sposobna predaja',
  'Ne predstavlja instrukciju vozaču'
]) {
  assert.match(workspace, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

assert.match(app, /internal\/dispatch-pilot-workspace/);
assert.match(app, /noindex,nofollow/);
assert.match(app, /return <DispatchPilotWorkspace\/>/);

for (const forbidden of [
  'fetch(',
  'axios',
  'localStorage',
  'sessionStorage',
  'navigator.sendBeacon',
  'window.open(',
  'mailto:'
]) {
  assert(!workspace.includes(forbidden), `Forbidden external or persistent action found: ${forbidden}`);
}

assert(!/onClick=.*send/i.test(workspace), 'Workspace must not expose a send action');
assert.match(workspace, /approval:\s*'PENDING'/);
assert.match(workspace, /approval:\s*'APPROVED'/);
assert.match(workspace, /approval:\s*'REJECTED'/);

console.log('Dispatch Pilot Workspace contract OK');
