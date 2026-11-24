'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('production static artifact has functional forms and preserves indexing and private-page exclusions',()=>{
 const marker=JSON.parse(fs.readFileSync('dist/_danini/build.json','utf8'));
 assert.equal(marker.mode,'production');
 assert.match(marker.revision,/^[a-f0-9]{40}$/);
 for(const lang of ['de','sr']){
  for(const route of ['', 'auto-check/', 'business/', 'akademija/', 'akademija/builder/', 'wissen/email-formular-crm/']){
   const html=fs.readFileSync(`dist/${lang}/${route}index.html`,'utf8');
   assert.doesNotMatch(html,/data-hostinger-preview|data-hostinger-preview-csp|noindex,nofollow,noarchive/);
   assert.match(html,/name="robots" content="index,follow"/);
   assert.ok(html.includes('https://daninihub.com/'+lang+'/'));
  }
  const business=fs.readFileSync(`dist/${lang}/business/index.html`,'utf8');
  assert.match(business,/data-business-submit/);
 }
 const operator=fs.readFileSync('dist/operator/sandbox-checkout/index.html','utf8');
 assert.match(operator,/noindex/,'private operator remains nonindexable');
 assert.doesNotMatch(fs.readFileSync('dist/robots.txt','utf8'),/Disallow: \/\s*$/m,'production not globally disallowed');
 assert.equal(fs.readFileSync('dist/_redirects','utf8'),fs.readFileSync('public/_redirects','utf8'));
});
