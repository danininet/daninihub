'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

process.env.DANINI_ADMIN_SECRET = 'test-admin-key';

const { adminAuthorized, readSessions, summarizeSessions } = require('../server-admin-runtime');

function main() {
  assert.strictEqual(adminAuthorized({ headers: { 'x-danini-admin-secret': 'test-admin-key' }, query: {} }), true);
  assert.strictEqual(adminAuthorized({ headers: {}, query: { key: 'wrong' } }), false);

  const dir = path.join(process.cwd(), 'runtime', 'guided-sessions');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'admin-test-session.json');
  fs.writeFileSync(file, JSON.stringify({
    id: 'admin-test-session',
    email: 'buyer@example.com',
    status: 'completed',
    followUpsAsked: 3,
    result: { delivery: { sent: true } },
    updatedAt: new Date().toISOString()
  }), 'utf8');

  const sessions = readSessions(10);
  const counts = summarizeSessions(sessions);
  assert.ok(sessions.some(session => session.id === 'admin-test-session'));
  assert.ok(counts.completed >= 1);
  assert.ok(counts.delivered >= 1);

  fs.unlinkSync(file);
  console.log('Danini OS admin runtime contract: OK');
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
