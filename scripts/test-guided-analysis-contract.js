'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

process.env.DANINI_SESSION_SECRET = 'test-secret-which-is-longer-than-thirty-two-characters';

const { getProduct, listProducts } = require('../core/product-registry');
const { createSession, getSession, verifyToken } = require('../core/guided-analysis-service');

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
