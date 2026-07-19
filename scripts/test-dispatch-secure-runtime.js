'use strict';

const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

process.env.DANINI_ADMIN_SECRET = 'dispatch-test-secret-2026';

const { DispatchCaseStore } = require('../dispatch-case-store');
const { createSessionToken, validSessionToken, validateCaseInput } = require('../server-dispatch-runtime');

(async () => {
  const token = createSessionToken();
  assert(token.includes('.'));
  assert.equal(validSessionToken(token), true);
  assert.equal(validSessionToken('0.invalid'), false);

  const valid = validateCaseInput({
    caseId: 'TEST-DH-001',
    status: 'DRAFT',
    approval: 'PENDING',
    payload: { fictitious: true, realData: false, route: 'Demo route' }
  });
  assert.equal(valid.error, undefined);
  assert.equal(valid.caseId, 'TEST-DH-001');

  assert.equal(validateCaseInput({
    caseId: 'REAL-001',
    status: 'DRAFT',
    approval: 'PENDING',
    payload: { fictitious: true }
  }).error, 'FICTITIOUS_CASE_ID_REQUIRED');

  assert.equal(validateCaseInput({
    caseId: 'DEMO-001',
    status: 'DRAFT',
    approval: 'PENDING',
    payload: { fictitious: true, realData: true }
  }).error, 'REAL_DATA_NOT_ALLOWED');

  assert.equal(validateCaseInput({
    caseId: 'DEMO-002',
    status: 'DRAFT',
    approval: 'PENDING',
    payload: { fictitious: false }
  }).error, 'FICTITIOUS_CASE_REQUIRED');

  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'danini-dispatch-'));
  const storageFile = path.join(directory, 'cases.json');
  const store = new DispatchCaseStore({ env: {}, storageFile });

  const first = await store.upsert({
    caseId: 'TEST-DH-001',
    status: 'DRAFT',
    approval: 'PENDING',
    payload: { fictitious: true, route: 'Duisburg → Beograd' }
  });
  assert.equal(first.caseId, 'TEST-DH-001');
  assert.equal(store.mode, 'file');

  const loaded = await store.get('TEST-DH-001');
  assert.equal(loaded.payload.fictitious, true);
  assert.equal(loaded.approval, 'PENDING');

  const updated = await store.upsert({
    caseId: 'TEST-DH-001',
    status: 'IN_REVIEW',
    approval: 'APPROVED',
    payload: { fictitious: true, route: 'Updated demo route' }
  });
  assert.equal(updated.status, 'IN_REVIEW');
  assert.equal((await store.get('TEST-DH-001')).approval, 'APPROVED');

  const list = await store.list(10);
  assert.equal(list.length, 1);
  assert.equal(list[0].caseId, 'TEST-DH-001');

  fs.rmSync(directory, { recursive: true, force: true });
  console.log('Dispatch secure runtime and store contract OK');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
