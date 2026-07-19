'use strict';

const assert = require('node:assert/strict');
const {
  bootstrapDispatchAccess,
  createAccessToken,
  sendDispatchAccessLink,
  verifyAccessToken
} = require('../dispatch-access-bootstrap');

async function run() {
  const env = {
    BREVO_API_KEY: 'test-brevo-key',
    BREVO_SENDER_EMAIL: 'info@daninihub.com',
    DANINI_PUBLIC_URL: 'https://daninihub.com'
  };
  const now = 1_800_000_000_000;

  const srToken = createAccessToken({ env, lang: 'sr', now, ttlMs: 60_000 });
  assert.equal(verifyAccessToken(srToken, { env, now: now + 30_000 }).lang, 'sr');
  assert.equal(verifyAccessToken(srToken, { env, now: now + 61_000 }), null);
  assert.equal(verifyAccessToken(`${srToken}x`, { env, now: now + 1_000 }), null);

  let sent = null;
  const srResult = await sendDispatchAccessLink({
    env,
    lang: 'sr',
    now,
    sendEmail: async message => { sent = message; }
  });
  assert.equal(srResult.mode, 'signed-email-link');
  assert.equal(srResult.lang, 'sr');
  assert.equal(sent.subject, 'DaniniHub Dispatch Workspace – pristup');
  assert(sent.htmlContent.includes('OTVORI WORKSPACE'));
  assert(!sent.htmlContent.includes('WORKSPACE ÖFFNEN'));
  assert(sent.htmlContent.includes('?access='));
  assert(sent.htmlContent.includes('&lang=sr'));
  assert(!sent.htmlContent.includes('?key='));

  sent = null;
  const deResult = await sendDispatchAccessLink({
    env,
    lang: 'de',
    now,
    sendEmail: async message => { sent = message; }
  });
  assert.equal(deResult.lang, 'de');
  assert.equal(sent.subject, 'DaniniHub Dispatch Workspace – Zugang');
  assert(sent.htmlContent.includes('WORKSPACE ÖFFNEN'));
  assert(!sent.htmlContent.includes('OTVORI WORKSPACE'));
  assert(sent.htmlContent.includes('&lang=de'));

  const boot = await bootstrapDispatchAccess({ env, now, sendEmail: async () => {} });
  assert.equal(boot.ok, true);
  assert.equal(boot.mode, 'signed-email-link');

  const missing = await bootstrapDispatchAccess({ env: {} });
  assert.equal(missing.ok, false);
  assert.equal(missing.mode, 'unconfigured');

  console.log('Dispatch signed access contract OK');
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});