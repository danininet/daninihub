'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'daninihub-front/src/App.jsx'), 'utf8');
const workspace = fs.readFileSync(path.join(root, 'daninihub-front/src/DispatchPilotWorkspace.jsx'), 'utf8');

const requiredWorkspaceText = [
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
  'Ne predstavlja instrukciju vozaču',
  'Sačuvaj slučaj',
  'Sačuvani fiktivni slučajevi',
  'Novi fiktivni slučaj',
  'Odjava'
];

for (const text of requiredWorkspaceText) {
  assert(workspace.includes(text), `Required Dispatch workspace text missing: ${text}`);
}

for (const text of [
  'dispatch-pilot-workspace',
  'noindex,nofollow',
  'return <DispatchPilotWorkspace/>'
]) {
  assert(app.includes(text), `Required Dispatch route boundary missing: ${text}`);
}

for (const text of [
  "credentials: 'same-origin'",
  '/api/v1/dispatch/cases',
  '/api/v1/dispatch/logout',
  'fictitious: true',
  'realData: false'
]) {
  assert(workspace.includes(text), `Required protected Dispatch behavior missing: ${text}`);
}

for (const forbidden of [
  'axios',
  'localStorage',
  'sessionStorage',
  'navigator.sendBeacon',
  'window.open(',
  'mailto:',
  'http://',
  'https://'
]) {
  assert(!workspace.includes(forbidden), `Forbidden external or browser persistence action found: ${forbidden}`);
}

for (const state of ["approval: 'PENDING'", "approval: 'APPROVED'", "approval: 'REJECTED'"]) {
  assert(workspace.includes(state), `Required manual approval state missing: ${state}`);
}

assert(!workspace.includes('Pošalji poruku'));
assert(!workspace.includes('Send message'));
assert(!workspace.includes('Nachricht senden'));

console.log('Dispatch Pilot Workspace contract OK');
