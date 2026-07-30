'use strict';

const assert = require('assert');
const { seedWorkspace, normalizeWorkspace, sign, verify } = require('../server-transport-network-runtime');

const seed = seedWorkspace();
assert.strictEqual(seed.companies.length, 2);
assert.strictEqual(seed.rooms.length, 2);

const repaired = normalizeWorkspace({
  companies:[{ companyId:'CMP-DACH-001', name:'Old demo record', routes:null }],
  members:[],
  rooms:[{ caseId:'DH-TR-0001', route:'', customerCompanyId:'CMP-DACH-001', carrierCompanyId:'CMP-BALKAN-001' }]
});

assert.strictEqual(repaired.companies.length, 2, 'Both demo companies must exist');
assert.ok(Array.isArray(repaired.companies[0].routes), 'Routes must always be an array');
assert.ok(repaired.members.some(member => member.companyId === 'CMP-DACH-001' && member.role === 'OWNER'), 'DACH owner must be repaired');
assert.ok(repaired.members.some(member => member.companyId === 'CMP-BALKAN-001' && member.role === 'OWNER'), 'Balkan owner must be repaired');
assert.ok(repaired.rooms.some(room => room.caseId === 'DH-TR-0002'), 'Missing seed room must be restored');
assert.ok(repaired.rooms.every(room => room.route && room.status && room.risk), 'Rooms must be render-safe');

const token = sign({ companyId:'CMP-DACH-001', identity:'owner@example.test', memberRole:'OWNER', companyType:'DACH_CUSTOMER', exp:Date.now()+60000 });
assert.strictEqual(verify(token).companyId, 'CMP-DACH-001');
assert.strictEqual(verify('invalid-token'), null);

console.log('Transport Network contract OK');
