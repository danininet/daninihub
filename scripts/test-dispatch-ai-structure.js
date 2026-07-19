'use strict';

const assert = require('node:assert/strict');
const {
  buildDispatchInput,
  dispatchInstructions,
  dispatchStructureSchema,
  normalizeResult,
  structureDispatchMessage
} = require('../core/dispatch-ai-structure');

(async () => {
  const calls = [];
  const fakeClient = {
    responses: {
      create: async request => {
        calls.push(request);
        return {
          output_text: JSON.stringify({
            facts: ['Zastoj kod Budimpešte je prijavljen.', 'Istovar je planiran do 10:00.'],
            unknowns: ['Tačna lokacija nije potvrđena.', 'Nova ETA nije potvrđena.'],
            risk: 'VISOK',
            nextCheck: 'Interna provera za 15 minuta — nije potvrđen termin.',
            decisionRequired: 'Potrebna je ljudska odluka da li zatražiti novi slot.',
            decisionOwner: 'NIJE NAVEDENO',
            draftMessage: 'Guten Tag, unser Fahrzeug befindet sich laut aktueller Meldung im Stau. Eine belastbare ETA liegt noch nicht vor. Wir prüfen den Status erneut und melden uns anschließend.'
          })
        };
      }
    }
  };

  const result = await structureDispatchMessage({
    fictitious: true,
    route: 'Duisburg → Beograd',
    vehicle: 'TEST-TRUCK-01',
    rawMessage: 'Stau Budapest. ETA unklar. Kunde wartet. Entladung bis 10:00.'
  }, { client: fakeClient, model: 'test-model' });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].model, 'test-model');
  assert.equal(calls[0].text.format.type, 'json_schema');
  assert.equal(calls[0].text.format.strict, true);
  assert.equal(calls[0].text.format.name, 'dispatch_case_structure');
  assert.deepEqual(calls[0].text.format.schema, dispatchStructureSchema());
  assert.match(calls[0].input[0].content[0].text, /Do not make operational decisions/);
  assert.match(calls[0].input[1].content[0].text, /FICTITIOUS: YES/);
  assert.equal(result.risk, 'VISOK');
  assert.equal(result.decisionOwner, 'NIJE NAVEDENO');
  assert.equal(result.facts.length, 2);
  assert.equal(result.unknowns.length, 2);

  const normalized = normalizeResult({
    facts: [' činjenica '],
    unknowns: [' nepoznato '],
    risk: 'NEPOSTOJEĆI',
    nextCheck: '',
    decisionRequired: '',
    decisionOwner: '',
    draftMessage: ''
  });
  assert.deepEqual(normalized.facts, ['činjenica']);
  assert.deepEqual(normalized.unknowns, ['nepoznato']);
  assert.equal(normalized.risk, 'SREDNJI');
  assert.equal(normalized.decisionOwner, 'NIJE NAVEDENO');

  assert.match(buildDispatchInput({ fictitious: true, route: 'Demo', vehicle: 'TEST-1', rawMessage: 'Poruka' }), /Raw message:\nPoruka/);
  assert.match(dispatchInstructions(), /must not confirm a new slot/);

  await assert.rejects(
    () => structureDispatchMessage({ fictitious: false, rawMessage: 'Test' }, { client: fakeClient }),
    error => error.code === 'FICTITIOUS_CASE_REQUIRED'
  );
  await assert.rejects(
    () => structureDispatchMessage({ fictitious: true, rawMessage: '' }, { client: fakeClient }),
    error => error.code === 'RAW_MESSAGE_REQUIRED'
  );

  console.log('Dispatch AI structuring contract OK');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
