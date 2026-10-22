# AutoDanini — Hostinger security code and test checkpoint (2026-10-22)

## Implemented on development branch feat/autodanini-admin-desk-20261021 (PR #59)
- core/hostinger-release-readiness.js (commit 1aa5ea06c9cbefb8807a61a65dc913b082a917d9): in NODE_ENV=production, require DB_HOST, DB_USER, DB_NAME, DB_PASSWORD, trusted clean HTTPS DANINI_PUBLIC_URL; reject enabling checkout or service payments before dedicated release. Await store.init(), require store.mode==='mysql' and refuse to start if fallback is active.
- server.js (commit 3746f2802bbf5297e7afd66586b1e2175ca25ee1): calls checkProductionStorage before app.listen, sets baseline X-Content-Type-Options, X-Frame-Options, Referrer-Policy and suppresses X-Powered-By; legacy /api/importos/admin endpoints return 503 in production until session-based owner authentication replaces static header secret.
- tests/test-hostinger-release-readiness.cjs (commit cb7e2fb75f991b6e0c81b5c42d4839c587456022): 7 Node tests for missing DB, invalid URL, payment disabled, file fallback and db init error.
- .github/workflows/autodanini-hostinger-startup-tests.yml (commit 341597811c57e8bc518391d808a3eea7d184824a): CI for Node 22 tests + syntax + npm ci + npm run build.
- Independently replayed the module behavior and 7 tests in local Node v22 in temporary container files; 7/7 passed. This confirms the new module logic, NOT GitHub CI, production DB, full app regression or actual Hostinger deployment. GitHub PR-triggered workflow result was not available from API query at checkpoint.

## Outstanding blockers
- Actual admin login, roles and MFA; the old admin API is deliberately unusable in production.
- User-owned secure session and case ownership tests.
- AppDeploy v12 frontend SDK references @appdeploy/client; no portable Hostinger Vite build ready yet. Need replace with authenticated compatible API to preserve exact design.
- Run actual repo full npm run build in CI and inspect logs; required GitHub workflow results not confirmed.
- DNS and backup/restoration for existing daninihub.com; do not touch calije subdomain.
- Prod Stripe linked account only TEST MODE; checkout and capture remain off.
- AppDeploy v12 index.html contains robots noindex,follow and third-party images.unsplash.com OG photo. SEO robots must be intentionally changed for new indexed root only after secure cutover. User requested original photos in content where available.
- Visual page audit is incomplete because GitHub connector bulk-call limit was reached.

## Operating decision
daninihub.com → existing AutoDanini v12 design, after safe migration.
calije.daninihub.com → preserve existing parking/lot rental.
Hostinger Business; no new domain/VPS; no live site changes this turn.
