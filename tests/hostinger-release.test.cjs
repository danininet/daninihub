'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const net = require('node:net');
const {spawn} = require('node:child_process');

test('the packaged Hostinger entry serves the functional frontend in isolation', async t => {
  const release = fs.mkdtempSync(path.join(os.tmpdir(), 'danini-hostinger-release-'));
  fs.cpSync('hostinger-release', release, {recursive: true});
  const port = await new Promise((resolve, reject) => {
    const server = net.createServer().on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const value = server.address().port;
      server.close(() => resolve(value));
    });
  });
  const child = spawn(process.execPath, [path.join(release, 'hostinger-preview.cjs')], {
    cwd: os.tmpdir(), env: {...process.env, PORT: String(port)}, stdio: 'inherit',
  });
  t.after(() => { child.kill(); fs.rmSync(release, {recursive: true, force: true}); });
  const base = 'http://127.0.0.1:' + port;
  let health;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { health = await fetch(base + '/health'); break; } catch {}
    if (child.exitCode !== null) break;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  assert.ok(health?.ok, 'the isolated runtime must start');
  assert.equal((await health.json()).assets, 'release-root');
  assert.equal(health.headers.get('x-danini-runtime'), 'hostinger-frontend');
  assert.match(health.headers.get('x-robots-tag'), /noindex/);
  const marker = await (await fetch(base + '/_danini/build.json')).json();
  assert.equal(marker.mode, 'production');
  assert.equal((await fetch(base + '/', {redirect: 'manual'})).status, 200);
  for (const lang of ['de', 'sr']) {
    const page = await fetch(base + '/' + lang + '/business/');
    assert.equal(page.status, 200);
    assert.match(page.headers.get('content-security-policy'), /form-action 'self'/);
    assert.match(page.headers.get('content-security-policy'), /https:\/\/challenges\.cloudflare\.com/);
    assert.match(await page.text(), /data-business-submit/);
  }
  for (const route of ['/api/health', '/portal/', '/operator/sandbox-checkout/', '/auto/admin.html', '/downloads/private.pdf', '/hostinger-preview.cjs']) {
    assert.equal((await fetch(base + route)).status, 404, route);
  }
  assert.equal((await fetch(base + '/api/intake', {method: 'POST'})).status, 405);
  assert.equal(fs.existsSync(path.join(release, 'operator')), false);
});
