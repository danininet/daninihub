'use strict';

const assert = require('assert');
const { scorePair, buildMatches } = require('../server-capacity-signal-runtime');

const truck = {
  reference:'DH-TRUCK-TEST', kind:'TRUCK', company:'Carrier Test', status:'VERIFIED', route:'Dortmund → Kroatien',
  payload:{ city:'Dortmund', postal:'44135', availableFrom:'2026-07-30T08:00', availableUntil:'2026-07-30T18:00', destinationCountry:'Kroatien', destination:'Zagreb', vehicle:'Curtainsider', payload:'24000', loadingMeters:'13.6', adr:'NO', temperature:'', customs:'NO' }
};
const freight = {
  reference:'DH-FREIGHT-TEST', kind:'FREIGHT', company:'Shipper Test', status:'VERIFIED', route:'Dortmund → Zagreb',
  payload:{ city:'Dortmund', postal:'44135', loadDate:'2026-07-30', loadFrom:'10:00', destinationCountry:'Kroatien', unloadCity:'Zagreb', vehicleRequired:'Curtainsider', weight:'12000', loadingMeters:'8', adr:'NO', temperature:'', customsStatus:'NO' }
};

const result = scorePair(truck, freight);
assert(result.score >= 85, `Expected strong match, received ${result.score}`);
assert.strictEqual(result.level, 'STRONG');
assert.strictEqual(result.checks.length, 6);

const matches = buildMatches([truck, freight]);
assert.strictEqual(matches.length, 1);
assert.strictEqual(matches[0].truck.reference, truck.reference);
assert.strictEqual(matches[0].freight.reference, freight.reference);

const closedFreight = { ...freight, status:'CLOSED' };
assert.strictEqual(buildMatches([truck, closedFreight]).length, 0);

console.log('Capacity matching contract OK');
