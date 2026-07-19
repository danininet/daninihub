'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'daninihub-front/src/App.jsx'), 'utf8');
const workspace = fs.readFileSync(path.join(root, 'daninihub-front/src/DispatchPilotWorkspaceV5.jsx'), 'utf8');
const accessRuntime = fs.readFileSync(path.join(root, 'server-dispatch-runtime.js'), 'utf8');
const accessEmail = fs.readFileSync(path.join(root, 'dispatch-access-bootstrap.js'), 'utf8');

for (const text of [
  'INTERNA PILOT VERZIJA · SAMO FIKTIVNI PODACI',
  'INTERNE PILOTVERSION · NUR FIKTIVE DATEN',
  'Unesi poruku',
  'Rohmeldung eingeben',
  'Pregledaj AI strukturu',
  'KI-Struktur prüfen',
  'Ručno odobri ili odbij',
  'Manuell freigeben oder ablehnen',
  'AI STRUKTURIRAJ',
  'MIT KI STRUKTURIEREN',
  'ODOBRI NACRT',
  'ENTWURF FREIGEBEN',
  'VRATI NA DORADU',
  'ZUR ÜBERARBEITUNG',
  'SAČUVAJ OVAJ SLUČAJ',
  'DIESEN FALL SPEICHERN',
  "setLang(next)",
  "url.searchParams.set('lang', next)"
]) {
  assert(workspace.includes(text), `Required single-language Dispatch copy missing: ${text}`);
}

for (const text of [
  "from './DispatchPilotWorkspaceV5'",
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
  'POŠALJI NOVI PRISTUPNI LINK',
  'NEUEN ZUGANGSLINK SENDEN',
  'request-access',
  '?lang=sr',
  '?lang=de'
]) {
  assert(accessRuntime.includes(text), `Required language-switch access behavior missing: ${text}`);
}

for (const text of [
  'OTVORI WORKSPACE',
  'WORKSPACE ÖFFNEN',
  '?access=',
  '&lang='
]) {
  assert(accessEmail.includes(text), `Required signed access email behavior missing: ${text}`);
}

for (const forbidden of [
  'Administratorski ključ',
  'Administratorschlüssel',
  'name="key"',
  '?key=',
  'INTERNA PILOT VERZIJA / INTERNE PILOTVERSION',
  'AI STRUKTURIRAJ / MIT KI STRUKTURIEREN',
  'ODOBRI NACRT / ENTWURF FREIGEBEN'
]) {
  assert(!accessRuntime.includes(forbidden) && !workspace.includes(forbidden) && !accessEmail.includes(forbidden), `Forbidden mixed-language or manual-key UI found: ${forbidden}`);
}

for (const forbidden of ['axios', 'localStorage', 'sessionStorage', 'navigator.sendBeacon', 'window.open(', 'mailto:', 'http://', 'https://']) {
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

console.log('Dispatch Pilot Workspace v5 language-switch contract OK');