import test from 'node:test';
import assert from 'node:assert/strict';
import { daniniHome } from '../workers/danini-home.mjs';

function page(path, method = 'GET') {
  const url = new URL('https://daninihub.com' + path);
  return daniniHome(new Request(url, { method }), url);
}

test('SR and DE homepage: editorial conversion layout, not card grid', async () => {
  for (const [path, lang, title, cta] of [
    ['/sr/', 'sr', 'Automobil iz Nemačke.', 'Pošaljite oglas na proveru'],
    ['/de/', 'de', 'Ein Auto aus Deutschland.', 'Fahrzeuginserat prüfen lassen'],
  ]) {
    const response = page(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    const html = await response.text();
    assert.ok(html.includes('<html lang="' + lang + '">'));
    assert.ok(html.includes('<link rel="canonical" href="https://daninihub.com' + path + '">'));
    assert.ok(html.includes('href="/sr/"'));
    assert.ok(html.includes('href="/de/"'));
    assert.ok(html.includes(title));
    assert.ok(html.includes(cta));
    assert.ok(html.includes('href="/contact.html"'));
    assert.equal((html.match(/class="flow-stage"/g) || []).length, 4);
    assert.equal((html.match(/class="card"/g) || []).length, 0);
    assert.ok(html.includes('DANINI_Kartica_01_Salon_Auto_Bez_Osobe.jpg'));
    assert.ok(html.includes('DANINI_Kartica_02_Uvoz_Dokumentacija_EUR1.jpg'));
    assert.ok(html.includes('DANINI_Kartica_05_Originalni_OE_Delovi_Servis.jpg'));
    assert.ok(!html.includes('${'));
    assert.ok(!html.includes('Gumroad'));
    assert.ok(!html.includes('16%'));
  }
});

test('HEAD returns only headers', async () => {
  const response = page('/de/', 'HEAD');
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '');
});

test('root preserves SR presentation with /sr/ canonical', async () => {
  const html = await page('/').text();
  assert.ok(html.includes('<html lang="sr">'));
  assert.ok(html.includes('<link rel="canonical" href="https://daninihub.com/sr/">'));
});
