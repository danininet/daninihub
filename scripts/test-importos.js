'use strict';

const assert=require('node:assert/strict');
const {evaluateImport,estimateFieldServices}=require('../core/importos-engine');
const {getModelDna}=require('../core/importos-model-dna');

const base={
  sourceCountry:'DE',
  currency:'EUR',
  purchasePrice:10000,
  transportToSerbia:700,
  exportCosts:250,
  inspectionCost:150,
  year:2014,
  euroClass:5,
  originProof:'unknown',
  registrationDoc:true,
  ownershipDoc:true,
  vinProvided:true,
  initialService:500,
  serbiaMarketValue:15000,
  modelDnaKey:'mercedes-w204-petrol'
};

const result=evaluateImport(base);
assert.equal(result.route,'DE→RS');
assert.equal(result.scenarios.length,2);
assert.ok(result.corridor.worst>result.corridor.best);
assert.equal(result.importability.status,'PASS_BASELINE');
assert.ok(result.modelDna);
assert.match(result.modelDna.label,/W204/);

const risky=evaluateImport({...base,prepaymentRequested:true,thirdPartyAccount:true,sellerMismatch:true,vinProvided:false});
assert.equal(risky.decision,'DO_NOT_BUY_YET');
assert.ok(risky.fraud.score>=60);

const historic=evaluateImport({...base,year:1990,euroClass:0,historicClaim:true});
assert.equal(historic.importability.status,'HISTORIC_REVIEW');

assert.ok(getModelDna('audi-a4-b8-petrol'));

const field=estimateFieldServices({visitOneWayKm:100,driveKm:500});
assert.equal(field.liveVisit.estimatedServiceFee,149);
assert.equal(field.driverOnly.estimatedDriverFee,374);
assert.match(field.driverOnly.extras.join(' '),/insurance/);

console.log('Danini ImportOS MVP contract: OK');
