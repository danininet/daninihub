'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {evaluateImport,estimateFieldServices}=require('../core/importos-engine');
const {getModelDna}=require('../core/importos-model-dna');
const {home,ownerPage}=require('../server-public-runtime');

const root=path.join(__dirname,'..');
const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
const publicRuntime=fs.readFileSync(path.join(root,'server-public-runtime.js'),'utf8');
const payments=fs.readFileSync(path.join(root,'core','importos-payments.js'),'utf8');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));

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

const de=home('de');
const sr=home('sr');
assert.match(de,/DANINI/);
assert.match(de,/AUTOMOTIVE IMPORT INTELLIGENCE/);
assert.match(de,/Pro Mechanic Check/);
assert.match(de,/BRABUS/);
assert.match(de,/ORIGINAL PARTS DESK/);
assert.match(de,/PAYMENT PROTECTION/);
assert.match(de,/KNOWLEDGE GARAGE/);
assert.match(sr,/Import Base Čalije/);
assert.match(sr,/Service Desk/);
assert.match(ownerPage(),/CREATE SECURE QUOTE/);
assert.match(server,/mountImportOSRuntime/);
assert.doesNotMatch(server,/AI Office|Dispatch|Revenue OS/);
assert.doesNotMatch(publicRuntime,/daninihub-front|React|Vite/);
assert.match(payments,/capture_method:'manual'/);
assert.match(payments,/intent:'AUTHORIZE'/);
assert.equal(pkg.scripts['build:front'],undefined);
assert.equal(pkg.scripts.postinstall,undefined);
assert.ok(fs.existsSync(path.join(root,'public','importos-mark.svg')));
assert.ok(fs.existsSync(path.join(root,'public','favicon.svg')));
console.log('DANINI clean product contract: OK');
