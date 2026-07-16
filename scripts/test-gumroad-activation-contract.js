'use strict';

const assert = require('assert');

process.env.GUMROAD_PING_SECRET = 'gumroad-test-secret';
process.env.GUMROAD_PRODUCT_PERMALINK = 'die-ki-fragt-nach';
process.env.DANINI_SESSION_SECRET = 'test-secret-which-is-longer-than-thirty-two-characters';

const {
  authorized,
  renderAccessEmail,
  saleKey,
  validateProduct
} = require('../server-gumroad-runtime');

function request({ header, query } = {}) {
  return {
    headers: { 'x-danini-gumroad-secret': header || '' },
    query: query || {},
    protocol: 'https',
    get: () => 'daninihub.com'
  };
}

function main() {
  assert.strictEqual(authorized(request({ header: 'gumroad-test-secret' })), true);
  assert.strictEqual(authorized(request({ query: { secret: 'gumroad-test-secret' } })), true);
  assert.strictEqual(authorized(request({ header: 'wrong' })), false);

  assert.strictEqual(validateProduct({ product_permalink: 'die-ki-fragt-nach' }), true);
  assert.strictEqual(validateProduct({ product_permalink: 'other-product' }), false);

  assert.strictEqual(saleKey({ sale_id: 'sale-123' }), 'sale-123');
  assert.strictEqual(saleKey({ order_number: 'A/123' }), 'A_123');
  assert.strictEqual(saleKey({}), '');

  const html = renderAccessEmail('https://daninihub.com/analyse#token=test');
  assert.ok(html.includes('Die KI fragt nach'));
  assert.ok(html.includes('https://daninihub.com/analyse#token=test'));
  assert.ok(html.includes('Analyse starten'));

  console.log('Danini OS Gumroad activation contract: OK');
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}