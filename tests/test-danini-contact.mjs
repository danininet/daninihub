import test from 'node:test';
import assert from 'node:assert/strict';
import {daniniContact} from '../workers/danini-contact.mjs';
import {daniniHome} from '../workers/danini-home.mjs';

for(const lang of ['sr','de']){
  test('Bilingual contact '+lang+' protects the lead flow',async()=>{
    const url=new URL('https://daninihub.com/contact.html?lang='+lang);
    const result=daniniContact(new Request(url),url);
    assert.equal(result.status,200);
    const html=await result.text();
    assert.ok(html.includes('<html lang="'+lang+'">'));
    assert.ok(html.includes('/api/lead/status'));
    assert.ok(html.includes("fetch('/api/lead'"));
    assert.ok(html.includes('turnstile'));
    assert.ok(html.includes('mailto:auto@daninihub.com'));
    assert.ok(html.includes('r.status!==202'));
    assert.ok(html.includes('noindex,follow'));
  });
  test('Homepage CTA selects '+lang+' contact',async()=>{
    const url=new URL('https://daninihub.com/'+lang+'/');
    const html=await daniniHome(new Request(url),url).text();
    assert.ok(html.includes('href="/contact.html?lang='+lang+'"'));
  });
}

test('Contact HEAD has no body',async()=>{
 const url=new URL('https://daninihub.com/contact.html?lang=de');
 const res=daniniContact(new Request(url,{method:'HEAD'}),url);
 assert.equal(res.status,200);
 assert.equal(await res.text(),'');
});
