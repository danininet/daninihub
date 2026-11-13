import test from 'node:test';
import assert from 'node:assert/strict';
import { handleAiIntake, handleApi } from '../../workers/danini-intake.mjs';

const env = {
  DANINI_CONTACT_ACTIVE: 'true',
  BREVO_API_KEY: 'test-only-secret-not-for-production',
  DANINI_BREVO_SENDER: 'info@daninihub.com',
  DANINI_NOTIFY_TO: 'info@daninihub.com',
  DANINI_TURNSTILE_SECRET: 'test-only-turnstile-secret',
  DANINI_TURNSTILE_SITEKEY: 'test-only-sitekey'
};
const payload = {
  language: 'sr',
  source: 'https://www.mobile.de/auto-inserat/12345',
  name: 'Test Korisnik',
  email: 'test@example.org',
  consent: true,
  answers: [
    { question: 1, status: 'confirmed' },
    { question: 2, status: 'critical' },
    { question: 3, status: 'missing' }
  ],
  'cf-turnstile-response': 'mock-turnstile-token'
};
const request = (body, origin = 'https://daninihub.com') => new Request('https://daninihub.com/api/ai-intake', {
  method: 'POST',
  headers: { 'content-type': 'application/json', origin },
  body: JSON.stringify(body)
});
test('AI intake rejects missing configuration without exposing keys', async () => {
  const response = await handleAiIntake(request(payload), {});
  assert.equal(response.status, 503);
  assert.equal((await response.text()).includes('test-only-secret'), false);
});
test('AI intake rejects untrusted origin', async () => {
  const response = await handleAiIntake(request(payload, 'https://untrusted.example'), env);
  assert.equal(response.status, 403);
});
test('AI intake rejects Turnstile failure before any Brevo send', async () => {
  const before = globalThis.fetch;
  let count = 0;
  globalThis.fetch = async url => {
    count++;
    assert.match(String(url), /siteverify/);
    return Response.json({ success: false, hostname: 'daninihub.com' });
  };
  try {
    const response = await handleAiIntake(request(payload), env);
    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), { error: 'human_verification_failed' });
    assert.equal(count, 1);
  } finally { globalThis.fetch = before; }
});
test('AI intake routes three validated answers to contact mailbox only after Turnstile', async () => {
  const before = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('siteverify'))
      return Response.json({ success: true, hostname: 'daninihub.com' });
    if (String(url).includes('api.brevo.com'))
      return Response.json({ messageId: 'mock-brevo-accepted' });
    throw Error('Unexpected URL ' + url);
  };
  try {
    const response = await handleApi(request(payload), env);
    assert.equal(response.status, 202);
    const result = await response.json();
    assert.equal(result.accepted, true);
    assert.match(result.reference, /^DN-AI-/);
    assert.equal(calls.length, 2);
    const email = JSON.parse(calls[1].options.body);
    assert.equal(email.to[0].email, env.DANINI_NOTIFY_TO);
    assert.match(email.textContent, /mobile.de/);
    assert.match(email.textContent, /RED \/ REQUIRES HUMAN REVIEW/);
    assert.doesNotMatch(JSON.stringify(result), /test-only-secret/);
  } finally { globalThis.fetch = before; }
});
test('AI intake rejects incomplete matrix after passing captcha', async () => {
  const before = globalThis.fetch;
  let sends = 0;
  globalThis.fetch = async url => {
    if (String(url).includes('siteverify'))
      return Response.json({ success: true, hostname: 'daninihub.com' });
    sends++;
    throw Error('Should not send');
  };
  try {
    const bad = { ...payload, answers: payload.answers.slice(0, 2) };
    const response = await handleAiIntake(request(bad), env);
    assert.equal(response.status, 400);
    assert.equal(sends, 0);
  } finally { globalThis.fetch = before; }
});
