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
assert.match(de,/Prüfe das Auto, bevor du zahlst/);
assert.match(sr,/Proveri auto pre nego što pošalješ novac/);
assert.match(sr,/Pošalji oglas za pregled/);
assert.match(sr,/danini-auto-uvoz.webp/);
assert.match(sr,/id="quickcheck"/);
assert.match(sr,/id="service-form"/);
assert.match(sr,/id="quote-checkout"/);
assert.doesNotMatch(sr,/Import Base|Payment Protection|Model DNA/);
for(const page of [de,sr,ownerPage()])for(const [,script] of page.matchAll(/<script>([\s\S]*?)<\/script>/g))new Function(script);
assert.match(ownerPage(),/KREIRAJ SIGURNU PONUDU/);
assert.match(server,/mountImportOSRuntime/);
assert.doesNotMatch(server,/AI Office|Dispatch|Revenue OS/);
assert.doesNotMatch(publicRuntime,/React|Vite/);
assert.match(payments,/capture_method:'manual'/);
assert.match(payments,/intent:'AUTHORIZE'/);
assert.equal(pkg.scripts['build:front'],'node scripts/build-hostinger.js');
assert.equal(pkg.scripts.postinstall,undefined);
assert.ok(fs.existsSync(path.join(root,'public','importos-mark.svg')));
assert.ok(fs.existsSync(path.join(root,'public','favicon.svg')));
assert.ok(fs.existsSync(path.join(root,'public','visual-uvoz.svg')));
assert.ok(fs.existsSync(path.join(root,'public','visual-pregled.svg')));
assert.ok(fs.existsSync(path.join(root,'public','visual-logistika.svg')));
assert.match(sr,/UVOZ AUTA/);
assert.match(sr,/danini-auto-uvoz.webp/);
console.log('DANINI clean product contract: OK');
