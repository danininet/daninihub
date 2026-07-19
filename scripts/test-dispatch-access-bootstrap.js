'use strict';

const assert = require('node:assert/strict');
const { bootstrapDispatchAccess } = require('../dispatch-access-bootstrap');

async function run() {
  const env = {
    BREVO_API_KEY: 'test-brevo-key',
    BREVO_SENDER_EMAIL: 'info@daninihub.com',
    DANINI_PUBLIC_URL: 'https://daninihub.com'
  };
  let sent = null;
  const result = await bootstrapDispatchAccess({
    env,
    generatedSecret: 'TEST_DISPATCH_SECRET_1234567890',
    sendEmail: async message => { sent = message; }
  });

  assert.equal(result.ok, true);
  assert.equal(result.mode, 'email-bootstrap');
  assert.equal(result.emailSent, true);
  assert.equal(env.DANINI_DISPATCH_ADMIN_SECRET, 'TEST_DISPATCH_SECRET_1234567890');
  assert.equal(env.DANINI_DISPATCH_ACCESS_MODE, 'email-bootstrap');
  assert(sent);
  assert.equal(sent.to[0].email, 'info@daninihub.com');
  assert(sent.htmlContent.includes('/internal/dispatch-pilot-workspace?key='));
  assert(sent.htmlContent.includes(encodeURIComponent(env.DANINI_DISPATCH_ADMIN_SECRET)));

  const configuredEnv = { DANINI_DISPATCH_ADMIN_SECRET: 'existing' };
  const configured = await bootstrapDispatchAccess({
    env: configuredEnv,
    sendEmail: async () => { throw new Error('must not send'); }
  });
  assert.equal(configured.mode, 'configured-secret');
  assert.equal(configured.emailSent, false);

  const missingEnv = {};
  const missing = await bootstrapDispatchAccess({ env: missingEnv });
  assert.equal(missing.ok, false);
  assert.equal(missing.mode, 'unconfigured');

  console.log('Dispatch access bootstrap contract OK');
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
