'use strict';
/**
 * AutoDanini prelaunch security release gate (read-only).
 * Run: node autodanini/security/hostinger-release-gate.cjs
 * No secrets are logged, no external network or production change.
 */
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../..');
const read = p => fs.readFileSync(path.join(ROOT,p),'utf8');
const checks = [];
function test(id,pass,reason){checks.push({id,pass:Boolean(pass),reason});}
const server=read('server-importos-runtime.js');
const app=read('server.js');
const payments=read('core/importos-payments.js');
const publicRt=read('server-public-runtime.js');
const pkg=JSON.parse(read('package.json'));
const admin=read('autodanini/staging-v12/backend/admin.ts');
const src=read('autodanini/staging-v12/backend/index.ts');
test('NO-UNTRUSTED-ORIGIN', !/return proto\s*\+\s*':\/\/'\s*\+\s*req\.get\(['"]host['"]\)/.test(server), 'Payment and tracking URLs must use validated allowlisted origin, not arbitrary Host / X-Forwarded-Proto headers.');
test('ADMIN-STRONG-AUTH', !/function adminAllowed\(req\)\s*\{[\s\S]{0,650}?x-danini-admin/.test(server), 'Shared static admin secret in client-supplied header is inadequate for a public admin dashboard. Require individual login + server-enforced role + MFA.');
test('APPDEPLOY-OWNER-IDENTITY-SET', !/ADMIN_EMAILS:\s*string\[\]\s*=\s*\[\s*\]/.test(admin), 'Owner email allowlist remains intentionally empty: admin cannot go live until explicitly verified.');
test('STORE-DURABLE-CONFIG', !/storage:store\.mode==='mysql'\?'database':'local-file'/.test(app), 'Production must fail closed without durable DB; local-file fallback is unsuitable for multiuser payments and records.');
test('BREVO-SERVER-KEY', /process\.env\.BREVO_API_KEY/.test(server), 'Brevo key should be server-side.');
test('STRIPE-SERVER-KEY', /process\.env\.STRIPE_SECRET_KEY/.test(payments), 'Stripe secret should be server-side.');
test('PAYMENT-DISABLED-UNLESS-EXPLICIT', /DANINI_IMPORTOS_CHECKOUT_ENABLED\s*!==\s*['"]true['"]/.test(server), 'Checkout must be opt-in, after merchant verification.');
test('SERVICE-PAYMENTS-DISABLED-UNLESS-EXPLICIT', /DANINI_IMPORTOS_SERVICE_PAYMENTS_ENABLED\s*!==\s*['"]true['"]/.test(server), 'Service payment must be opt-in.');
test('SOURCE-DESIGN-PRESENT', fs.existsSync(path.join(ROOT,'autodanini/staging-v12/src')),'AppDeploy visual source must remain available for parity.');
test('SITE-SEO-SITEMAP', /\/sitemap\.xml/.test(publicRt),'Site must expose sitemap.');
test('HAS-TEST-SCRIPTS', Boolean(pkg.scripts?.['test:site'] && pkg.scripts?.['test:purchase']),'Build regression scripts exist, but do not replace integration tests.');
for(const c of checks)console.log(`${c.pass?'PASS':'BLOCK'} ${c.id} — ${c.reason}`);
const blockers=checks.filter(c=>!c.pass);
console.log(`AutoDanini release gate: ${checks.length-blockers.length} passed, ${blockers.length} blockers. ${blockers.length?'NO-GO':'Static gate passed; E2E, backup restore and manual approval still required.'}`);
if(blockers.length)process.exitCode=1;
