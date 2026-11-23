import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const redirects=readFileSync('public/_redirects','utf8');
const merger=readFileSync('scripts/merge-platform-assets.cjs','utf8');
const business=readFileSync('src/components/BusinessContact.astro','utf8');

test('obsolete top-level customer entry points resolve to current platform, not legacy',()=>{
  assert.match(redirects,/^\/buyers\.html \/sr\/auto-check\/ 301$/m);
  assert.match(redirects,/^\/business\.html \/de\/business\/ 301$/m);
});
test('existing legacy utility pages show a clear link to current DE/SR platform',()=>{
  assert.match(merger,/danini-current-platform-bridge/);
  assert.match(merger,/\/de\/auto-check\//);
  assert.match(merger,/\/sr\/auto-check\//);
  assert.match(merger,/\/de\/business\//);
});
test('business contact offers user-controlled email fallback if secure endpoint is down',()=>{
  assert.match(business,/E-Mail-Entwurf öffnen/);
  assert.match(business,/mailto:info@daninihub\.com\?subject=/);
  assert.match(business,/if \(fallback\)/);
  assert.doesNotMatch(business,/<button type="submit" data-business-submit disabled>/);
});
