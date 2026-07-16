'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

process.env.DANINI_ADMIN_SECRET = 'test-admin-key';

const { adminAuthorized, publicAdminSession, readSessions, summarizeSessions } = require('../server-admin-runtime');
const { retryFailedSession, resendSessionDelivery } = require('../core/guided-analysis-service');

async function main() {
  assert.strictEqual(adminAuthorized({ headers: { 'x-danini-admin-secret': 'test-admin-key' }, query: {} }), true);
  assert.strictEqual(adminAuthorized({ headers: {}, query: { key: 'wrong' } }), false);

  const dir = path.join(process.cwd(), 'runtime', 'guided-sessions');
  fs.mkdirSync(dir, { recursive: true });
  const completedFile = path.join(dir, 'admin-test-session.json');
  const failedFile = path.join(dir, 'admin-failed-session.json');

  fs.writeFileSync(completedFile, JSON.stringify({
    id: 'admin-test-session',
    productId: 'die-ki-fragt-nach',
    email: 'buyer@example.com',
    status: 'completed',
    followUpsAsked: 3,
    result: {
      delivery: { sent: true },
      artifacts: { emailHtmlPath: 'missing-test-file.html', pdfPath: null, runId: 'test-run' }
    },
    updatedAt: new Date().toISOString()
  }), 'utf8');

  fs.writeFileSync(failedFile, JSON.stringify({
    id: 'admin-failed-session',
    productId: 'die-ki-fragt-nach',
    email: 'buyer@example.com',
    status: 'failed',
    followUpsAsked: 1,
    maxFollowUps: 3,
    answers: [],
    failure: { message: 'test failure' },
    updatedAt: new Date().toISOString()
  }), 'utf8');

  const sessions = readSessions(10);
  const counts = summarizeSessions(sessions);
  assert.ok(sessions.some(session => session.id === 'admin-test-session'));
  assert.ok(counts.completed >= 1);
  assert.ok(counts.failed >= 1);
  assert.ok(counts.delivered >= 1);

  const completed = publicAdminSession(sessions.find(session => session.id === 'admin-test-session'));
  const failed = publicAdminSession(sessions.find(session => session.id === 'admin-failed-session'));
  assert.strictEqual(completed.canResend, true);
  assert.strictEqual(completed.canRetry, false);
  assert.strictEqual(failed.canRetry, true);

  await assert.rejects(() => retryFailedSession('admin-failed-session'), /SESSION_ANSWERS_INCOMPLETE/);
  const resent = await resendSessionDelivery('admin-test-session');
  assert.strictEqual(resent.status, 'completed');
  assert.strictEqual(resent.result.delivery.sent, false);

  fs.unlinkSync(completedFile);
  fs.unlinkSync(failedFile);
  console.log('Danini OS admin recovery contract: OK');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});