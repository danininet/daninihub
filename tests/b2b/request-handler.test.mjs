import test from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest } from '../../src/request-handler.ts';

const request = (path, init) => new Request('https://danini.test' + path, init);

test('the integrated handler loads in Node and keeps intake disabled without its bindings', async () => {
  const health = await handleRequest(request('/api/health'), {});
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: 'ok' });

  const config = await handleRequest(request('/api/tenant-config'), {});
  assert.equal(config.status, 200);
  assert.equal((await config.json()).enabled, false);

  const intake = await handleRequest(request('/api/intake'), {});
  assert.equal(intake.status, 405);
});
