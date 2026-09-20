'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {evaluateImport,estimateFieldServices}=require('../core/importos-engine');
const {getModelDna}=require('../core/importos-model-dna');

const root=path.join(__dirname,'..');
const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
const landing=fs.readFileSync(path.join(root,'daninihub-front','src','ImportOSLanding.jsx'),'utf8');
const legal=fs.readFileSync(path.join(root,'daninihub-front','src','ImportOSLegal.jsx'),'utf8');
const payments=fs.readFileSync(path.join(root,'core','importos-payments.js'),'utf8');
const knowledge=fs.readFileSync(path.join(root,'daninihub-front','src','ImportOSKnowledge.jsx'),'utf8');

const base={sourceCountry:'DE',currency:'EUR',purchasePrice:10000,transportToSerbia:700,exportCosts:250,inspectionCost:150,year:2014,euroClass:5,originProof:'unknown',registrationDoc:true,ownershipDoc:true,vinProvided:true,initialService:500,serbiaMarketValue:15000,modelDnaKey:'mercedes-w204-petrol'};
const result=evaluateImport(base);
assert.equal(result.route,'DE→RS');
assert.equal(result.scenarios.length,2);
assert.ok(result.corridor.worst>result.corridor.best);
assert.ok(getModelDna('mercedes-w204-petrol'));

const risky=evaluateImport({...base,prepaymentRequested:true,thirdPartyAccount:true,sellerMismatch:true,vinProvided:false});
assert.equal(risky.decision,'DO_NOT_BUY_YET');

const field=estimateFieldServices({visitOneWayKm:100,driveKm:500});
assert.equal(field.liveVisit.estimatedServiceFee,149);
assert.equal(field.driverOnly.estimatedDriverFee,374);

assert.match(server,/mountImportOSRuntime/);
assert.doesNotMatch(server,/AI Office|Dispatch|Revenue OS/);
assert.match(landing,/Pro Mechanic Check/);
assert.match(landing,/BRABUS/);
assert.match(landing,/Original \/ OEM Parts/);
assert.match(landing,/TRAILER_TRANSPORT/);
assert.match(landing,/TRUCK_TRANSPORT/);
assert.match(landing,/IMPORT_BASE/);
assert.match(legal,/keine BRABUS-Leistung/);
assert.match(landing,/PAYMENT PROTECTION/);
assert.match(landing,/PayPal/);
assert.match(landing,/ios-navstrip/);
assert.match(landing,/KNOWLEDGE GARAGE/);
assert.match(payments,/capture_method:'manual'/);
assert.match(payments,/intent:'AUTHORIZE'/);
assert.match(knowledge,/oldtimer-30-plus/);
assert.match(knowledge,/deutschland-selbstimport/);

console.log('Danini ImportOS clean product contract: OK');
