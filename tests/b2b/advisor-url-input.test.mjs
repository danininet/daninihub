import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Execute the exact browser input normalizer, not a duplicate implementation.
const source=readFileSync('public/danini-advisor-client.js','utf8');
const from=source.indexOf('  const normalizedSource = raw => {');
const to=source.indexOf('  const listingSource = () =>',from);
assert.ok(from>=0&&to>from,'normalizer must be present');
const normalize=vm.runInNewContext(source.slice(from,to).replace('const normalizedSource =','globalThis.normalizedSource =')+'\nnormalizedSource', {URL});

test('accepts copy/pasted mobile.de, AutoScout24 and Kleinanzeigen links',()=>{
 for (const url of [
  'www.mobile.de/fahrzeuge/details.html?id=12345&utm_source=share',
  'suchen.mobile.de/fahrzeuge/details.html?id=12345',
  'www.autoscout24.de/angebote/auto-123',
  'www.kleinanzeigen.de/s-anzeige/auto/123456',
 ]) assert.match(normalize(url),/^https:\/\//);
});
test('upgrades shared HTTP links without altering ad ID or query',()=>{
 const actual=normalize('http://www.mobile.de/fahrzeuge/details.html?id=12345');
 assert.equal(new URL(actual).protocol,'https:');
 assert.equal(new URL(actual).searchParams.get('id'),'12345');
});
test('keeps VIN and pasted descriptive text intact',()=>{
 assert.equal(normalize('WVWZZZ1JZXW000001'),'WVWZZZ1JZXW000001');
 const text='Volkswagen Golf Baujahr 2018 und 100000 km';
 assert.equal(normalize(text),text);
});
test('never silently converts credentials or non-web schemes to links',()=>{
 assert.equal(normalize('https://user:secret@mobile.de/car'),'https://user:secret@mobile.de/car');
 assert.equal(normalize('javascript:alert(1)'),'javascript:alert(1)');
});
test('link preview explicitly says the listing has not been fetched',()=>{
 assert.match(source,/Link prihvaćen/);
 assert.match(source,/Sadržaj oglasa nije preuzet/);
 assert.match(source,/Link erkannt/);
 assert.match(source,/Das Inserat wurde nicht ausgelesen/);
});
