import test from 'node:test';
import assert from 'node:assert/strict';
import { daniniHome } from '../workers/danini-home.mjs';

function page(path) {
  const url = new URL('https://daninihub.com' + path);
  return daniniHome(new Request(url), url);
}

test('SR and DE homepages preserve locale links, canonical and buyer CTA', async () => {
  for (const [path, lang, canonical, headline, action] of [
    ['/sr/', 'sr', '/sr/', 'Proverite automobil pre nego što platite kaparu.', 'Zatražite proveru vozila'],
    ['/de/', 'de', '/de/', 'Prüfen Sie Ihr Wunschauto, bevor Sie eine Anzahlung leisten.', 'Fahrzeugprüfung anfragen'],
  ]) {
    const response = page(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    const html = await response.text();
    assert.ok(html.includes('<html lang="' + lang + '">'));
    assert.ok(html.includes('<link rel="canonical" href="https://daninihub.com' + canonical + '">'));
    assert.ok(html.includes('href="/sr/" lang="sr"'));
    assert.ok(html.includes('href="/de/" lang="de"'));
    assert.ok(html.includes(headline));
    assert.ok(html.includes(action));
    assert.ok(html.includes('href="/contact.html"'));
    assert.ok(html.includes('DANINI_Kartica_01_Salon_Auto_Bez_Osobe.jpg'));
    assert.ok(html.includes('DANINI_Kartica_02_Uvoz_Dokumentacija_EUR1.jpg'));
    assert.ok(html.includes('listing-demo'));
    assert.ok(html.includes('process-grid'));
    assert.ok(!html.includes('Gumroad'));
    assert.ok(!html.includes('16%'));
  }
});

test('home page supports HEAD without a body', async () => {
  const url = new URL('https://daninihub.com/de/');
  const response = daniniHome(new Request(url, {method: 'HEAD'}), url);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '');
});

test('root remains SR and declares /sr/ canonical', async () => {
  const html = await page('/').text();
  assert.ok(html.includes('<html lang="sr">'));
  assert.ok(html.includes('<link rel="canonical" href="https://daninihub.com/sr/">'));
});
