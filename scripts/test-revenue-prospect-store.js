'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const runtimeFile = path.join(process.cwd(),'runtime','revenue-prospects.json');
try { if (fs.existsSync(runtimeFile)) fs.unlinkSync(runtimeFile); } catch {}

const store = require('../revenue-prospect-store');

const p = store.upsert({
  company:'Test Gebäudeservice GmbH',
  website:'https://example.test',
  city:'Duisburg',
  segment:'Gebäudereinigung',
  painSignal:'Mehrere Anfragekanäle und keine sichtbare strukturierte Vorqualifikation.',
  fitReason:'Owner-managed local service workflow.',
  sourceUrl:'https://example.test/kontakt',
  status:'RESEARCHED',
  priority:'TEST',
  auditSummary:'test audit',
  pilotProposal:'test pilot',
  proofMetrics:'test metrics',
  draftOpener:'test opener',
  outreachDecision:'HOLD'
});

assert.ok(/^P-/.test(p.id));
assert.equal(p.status,'RESEARCHED');
assert.equal(p.outreachDecision,'HOLD');
assert.equal(p.priority,'TEST');
assert.ok(store.list().length >= 6);

const fit = store.update(p.id,{status:'FIT',note:'research-only'});
assert.equal(fit.status,'FIT');
assert.equal(fit.ownerApproved,false);

const allowed = store.update(p.id,{status:'CONTACT_ALLOWED',contactBasis:'explicit-service-request'});
assert.equal(allowed.status,'CONTACT_ALLOWED');

const approved = store.update(p.id,{status:'APPROVED_TO_CONTACT',ownerApproved:true});
assert.equal(approved.ownerApproved,true);

const contacted = store.update(p.id,{status:'CONTACTED'});
assert.equal(contacted.status,'CONTACTED');

const summary = store.summarize(store.list());
assert.ok(summary.total >= 6);
assert.equal(summary.contacted,1);

assert.throws(()=>store.update(p.id,{status:'INVALID'}),/INVALID_PROSPECT_STATUS/);

try { if (fs.existsSync(runtimeFile)) fs.unlinkSync(runtimeFile); } catch {}
console.log('Revenue prospect store contract: OK');
