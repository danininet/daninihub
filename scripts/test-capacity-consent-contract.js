'use strict';

const assert = require('assert');
const { createCase, caseStatus, canConnect } = require('../server-capacity-consent-runtime');

const record = createCase('TRUCK-1', 'FREIGHT-1', 88);
assert.strictEqual(record.status, 'WAITING_CONSENT');
assert.strictEqual(caseStatus(record), 'WAITING_CONSENT');
assert.strictEqual(canConnect(record), false);

record.truckConsent.status = 'GRANTED';
assert.strictEqual(caseStatus(record), 'WAITING_CONSENT');
assert.strictEqual(canConnect(record), false);

record.freightConsent.status = 'GRANTED';
assert.strictEqual(caseStatus(record), 'READY_TO_CONNECT');
assert.strictEqual(canConnect(record), true);

record.connection = {
  confirmedAt: new Date().toISOString(),
  confirmedBy: 'Dragan Zdravkovic',
  method: 'PHONE',
  note: 'Contacts shared after both consents.'
};
assert.strictEqual(caseStatus(record), 'CONTACTS_CONNECTED');
assert.strictEqual(canConnect(record), false);

const declined = createCase('TRUCK-2', 'FREIGHT-2', 70);
declined.truckConsent.status = 'GRANTED';
declined.freightConsent.status = 'WITHDRAWN';
assert.strictEqual(caseStatus(declined), 'DECLINED');
assert.strictEqual(canConnect(declined), false);

declined.freightConsent.status = 'DECLINED';
assert.strictEqual(caseStatus(declined), 'DECLINED');

console.log('Capacity consent and connection contract OK');