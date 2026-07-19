'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'daninihub-front/src/App.jsx'), 'utf8');
const workspace = fs.readFileSync(path.join(root, 'daninihub-front/src/DispatchPilotWorkspaceV4.jsx'), 'utf8');
const accessRuntime = fs.readFileSync(path.join(root, 'server-dispatch-runtime.js'), 'utf8');
const accessEmail = fs.readFileSync(path.join(root, 'dispatch-access-bootstrap.js'), 'utf8');

const requiredWorkspaceText = [
  'INTERNA PILOT VERZIJA / INTERNE PILOTVERSION',
  'Unesi poruku',
  'Rohmeldung eingeben',
  'Pregledaj AI strukturu',
  'KI-Struktur prüfen',
  'Ručno odobri ili odbij',
  'Manuell freigeben oder ablehnen',
  'AI STRUKTURIRAJ / MIT KI STRUKTURIEREN',
  'Potvrđene činjenice / Bestätigte Fakten',
  'Nepoznato / Offene Punkte',
  'Potrebna odluka / Erforderliche Entscheidung',
  'ODOBRI NACRT / ENTWURF FREIGEBEN',
  'VRATI NA DORADU / ZUR ÜBERARBEITUNG',
  'SAČUVAJ OVAJ SLUČAJ / DIESEN FALL SPEICHERN',
  'Sačuvani fiktivni slučajevi / Gespeicherte fiktive Fälle',
  'Radno sposobna predaja / Arbeitsfähige Übergabe',
  'Rezultat ostaje PENDING',
  'Es wird nichts versendet'
];

for (const text of requiredWorkspaceText) {
  assert(workspace.includes(text), `Required bilingual Dispatch text missing: ${text}`);
}

for (const text of [
  "from './DispatchPilotWorkspaceV4'",
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
  '/api/v1/dispatch/structure',
  "type: 'AI_STRUCTURE'",
  "approval: 'PENDING'",
  "caseStatus: 'DRAFT'",
  'fictitious: true',
  'realData: false'
]) {
  assert(workspace.includes(text), `Required protected Dispatch behavior missing: ${text}`);
}

for (const text of [
  'INTERNI PRISTUP / INTERNER ZUGANG',
  'OTVORI / ÖFFNEN',
  'Administratorski ključ / Administratorschlüssel'
]) {
  assert(accessRuntime.includes(text), `Required bilingual access page text missing: ${text}`);
}

for (const text of [
  'interni pristup / interner Zugang',
  'OTVORI WORKSPACE / WORKSPACE ÖFFNEN'
]) {
  assert(accessEmail.includes(text), `Required bilingual access email text missing: ${text}`);
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
assert(!workspace.includes('autoApprove'));
assert(!workspace.includes('autoSend'));

console.log('Dispatch Pilot Workspace v4 bilingual guided contract OK');
