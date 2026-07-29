'use strict';

const assert = require('assert');
const { createCase, caseStatus } = require('../server-capacity-consent-runtime');

const record = createCase('TRUCK-1', 'FREIGHT-1', 88);
assert.strictEqual(record.status, 'WAITING_CONSENT');
assert.strictEqual(caseStatus(record), 'WAITING_CONSENT');

record.truckConsent.status = 'GRANTED';
assert.strictEqual(caseStatus(record), 'WAITING_CONSENT');

record.freightConsent.status = 'GRANTED';
assert.strictEqual(caseStatus(record), 'READY_TO_CONNECT');

record.freightConsent.status = 'WITHDRAWN';
assert.strictEqual(caseStatus(record), 'DECLINED');

record.freightConsent.status = 'DECLINED';
assert.strictEqual(caseStatus(record), 'DECLINED');

console.log('Capacity consent contract OK');
