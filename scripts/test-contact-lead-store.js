'use strict';

const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createContactLeadStore } = require('../contact-lead-store');

(async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'danini-lead-store-'));
  const storageFile = path.join(directory, 'leads.json');
  try {
    const store = createContactLeadStore({ env: {}, storageFile });
    const reference = 'DH-LEAD-20260719-TEST01';
    await store.create({
      reference,
      source: 'contact',
      language: 'sr',
      email: 'test@example.com',
      company: 'Primer d.o.o.',
      payload: { message: 'Test upit', consent: 'yes' },
      recommendation: 'manual-review'
    });
    const received = await store.get(reference);
    assert.equal(received.status, 'received');
    assert.equal(received.payload.message, 'Test upit');
    assert.equal(received.confirmationSent, false);

    const reviewedAt = new Date().toISOString();
    const claimed = await store.beginReview(reference, reviewedAt, 'Lično provereno');
    assert.equal(claimed.status, 'followup-sending');
    await assert.rejects(() => store.beginReview(reference, reviewedAt), /LEAD_ALREADY_REVIEWED/);
    const updated = await store.update(reference, {
      status: 'followup-sent',
      confirmationSent: true,
      adminSent: true,
      followupKind: 'pilot-check-invitation',
      followupSentAt: reviewedAt,
      reviewedAt,
      reviewNote: 'Lično provereno'
    });
    assert.equal(updated.status, 'followup-sent');
    assert.equal(updated.followupKind, 'pilot-check-invitation');
    assert.equal(updated.reviewNote, 'Lično provereno');
    assert.equal(updated.confirmationSent, true);

    await assert.rejects(() => store.create({ ...received, reference }), /LEAD_ALREADY_EXISTS/);
    console.log('DaniniHub contact lead store contract: OK');
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
