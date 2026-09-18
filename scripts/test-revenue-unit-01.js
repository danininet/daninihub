'use strict';

const assert = require('node:assert/strict');
const { REVENUE_UNIT_01 } = require('../core/revenue-unit-01');

assert.equal(REVENUE_UNIT_01.id, 'RU-001-AI-OFFICE-DACH');
assert.equal(REVENUE_UNIT_01.phase1Region, 'NRW');
assert.equal(REVENUE_UNIT_01.outreachPolicy.status, 'OWNER_APPROVAL_REQUIRED');
assert.equal(REVENUE_UNIT_01.commercialHypothesis.publicPriceBinding, false);
assert.equal(REVENUE_UNIT_01.marketTest.minPaidCustomers, 1);
assert(REVENUE_UNIT_01.excludedUntilSeparatelyApproved.includes('cold bulk email'));
assert(REVENUE_UNIT_01.outreachPolicy.prohibitedBeforeCampaignApproval.includes('send external sales messages'));

console.log('Revenue Unit 01 contract: OK');
