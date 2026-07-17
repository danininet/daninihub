'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

process.env.DANINI_SESSION_SECRET = 'test-secret-which-is-longer-than-thirty-two-characters';

const { getProduct, listProducts } = require('../core/product-registry');
const { createSession, getSession, verifyToken } = require('../core/guided-analysis-service');
const { buildAccessUrl, renderGuidedPage } = require('../server-guided-analysis-runtime');
const { buildActivationPack } = require('../core/contracts/activation-pack-contract');

function main() {
  const product = getProduct('die-ki-fragt-nach');
  assert.strictEqual(product.price, 12);
  assert.strictEqual(product.maxFollowUps, 3);
  assert.strictEqual(listProducts().length >= 1, true);

  const created = createSession({
    productId: product.id,
    email: 'buyer@example.com',
    locale: 'de',
    orderId: 'test-order'
  });

  assert.ok(created.accessToken);
  assert.ok(verifyToken(created.accessToken));
  assert.strictEqual(created.session.status, 'awaiting_initial_answer');
  assert.strictEqual(created.session.followUpsAsked, 0);
  assert.strictEqual(created.session.maxFollowUps, 3);

  const loaded = getSession(created.accessToken);
  assert.strictEqual(loaded.id, created.session.id);
  assert.strictEqual(loaded.productId, product.id);

  const accessUrl = buildAccessUrl('https://daninihub.com/', created.accessToken);
  assert.ok(accessUrl.startsWith('https://daninihub.com/analyse#token='));
  assert.ok(accessUrl.includes(encodeURIComponent(created.accessToken)));

  const page = renderGuidedPage();
  assert.ok(page.includes('Die KI fragt nach'));
  assert.ok(page.includes('/api/v1/guided-analysis/session'));
  assert.ok(page.includes('/api/v1/guided-analysis/answer'));
  assert.ok(page.includes('sessionStorage'));

  const pack = buildActivationPack({
    run_id: 'personalization-test',
    timestamp: '2026-07-17T12:00:00.000Z',
    input: { locale: 'de', raw: 'Ich muss bis Freitag entscheiden, ob ich das Café in Leipzig eröffne.' },
    result: {
      summary: 'Die Entscheidung betrifft ein Café in Leipzig.',
      decision: 'REDEFINE',
      decision_reason: 'Die Mietnebenkosten sind noch nicht bestätigt.',
      insights: ['Der Standort ist Leipzig und die Entscheidungsfrist ist Freitag.'],
      assumptions: ['Die angenommene Laufkundschaft wurde noch nicht gemessen.'],
      sections: {
        A_problem: 'Bis Freitag über die Eröffnung eines Cafés in Leipzig entscheiden.',
        B_evidence: 'Standort und Frist wurden im Dialog genannt.',
        C_plan: 'Bis Mittwoch die vollständigen Mietnebenkosten schriftlich anfordern.',
        D_execution: 'Persönliche Analyse',
        E_next: 'Mietnebenkosten anfordern.'
      }
    },
    risks: ['Unvollständige Mietkosten können die Kalkulation verfälschen.'],
    next_step: 'Bis Mittwoch die vollständigen Mietnebenkosten schriftlich anfordern.'
  });
  const customerOutput = JSON.stringify(pack.content);
  assert.ok(customerOutput.includes('Cafés in Leipzig'));
  assert.ok(customerOutput.includes('Mietnebenkosten'));
  assert.ok(!customerOutput.includes('7 €'));
  assert.ok(!customerOutput.includes('SYSTEM VERIFIED'));

  const file = path.join(process.cwd(), 'runtime', 'guided-sessions', `${loaded.id}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);

  console.log('Danini OS guided analysis contract: OK');
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
