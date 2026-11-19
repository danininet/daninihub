import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync('src/pages/operator/sandbox-checkout.astro','utf8');
test('sandbox operator route exists, noindex, and does not store operator access',()=>{
 assert.match(page,/name="robots" content="noindex,nofollow,noarchive"/);
 assert.match(page,/type="password"/);
 assert.match(page,/autocomplete="off"/);
 assert.match(page,/input\.value=''/);
 assert.doesNotMatch(page,/localStorage|sessionStorage|document\.cookie/);
 assert.match(page,/X-Danini-Sandbox-Access/);
});
test('operator checkout uses existing protected sandbox API and exact PayPal origin',()=>{
 assert.match(page,/\/api\/danini\/digital\/paypal\/sandbox\/checkout/);
 assert.match(page,/www\.sandbox\.paypal\.com/);
 assert.match(page,/method:'POST'/);
 assert.match(page,/sku:'guide'/);
 assert.match(page,/termsAccepted:/);
 assert.match(page,/instantDeliveryConsent:/);
 assert.match(page,/state\.mode==='sandbox'/);
 assert.doesNotMatch(page,/PAYPAL_CLIENT_SECRET|PAYPAL_CLIENT_ID/);
});
