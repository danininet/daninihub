import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const slug='/sr/wissen/javne-nabavke-nemacka-balkan-vodic/';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('public Serbian procurement guide and demo are connected',()=>{
const html=read('public'+slug+'index.html');
assert.match(html,/<html lang="sr-Latn">/);
assert.ok(html.includes('href="https://daninihub.com'+slug+'"'));
assert.ok(html.includes('href="'+slug+'demo.pdf"'));
assert.ok(html.includes('href="/sr/business/"'));
assert.ok(html.includes('72/100')||html.includes('72 / 100'));
assert.ok(read('src/pages/[locale]/wissen/index.astro').includes(slug));
assert.ok(read('src/pages/sitemap.xml.ts').includes('https://daninihub.com'+slug));
const pdf=readFileSync(new URL('../../public'+slug+'demo.pdf',import.meta.url));
assert.equal(pdf.subarray(0,5).toString(),'%PDF-');
assert.ok(pdf.length>10000);
});
