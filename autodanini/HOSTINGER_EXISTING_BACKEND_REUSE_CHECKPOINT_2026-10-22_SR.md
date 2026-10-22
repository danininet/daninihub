# AutoDanini — Hostinger migration implementation checkpoint (2026-10-22)

## Locked domain/brand decisions
- https://daninihub.com → **AutoDanini** automotive platform.
- https://calije.daninihub.com → **Čalije** parking and business lot rental, no changes as part of AutoDanini migration.
- Preserve exact deployed AppDeploy v12 AutoDanini presentation, layout, links, assets and 22 existing pages, SR/DE. No redesign.
- Remain on existing Hostinger Business, owner renews subscription. No VPS/domain/new hosting purchase.
- Do NOT change live DNS, overwrite existing site, or touch database until backup + tests + approval.

## Newly verified repository facts
Default branch `danininet/daninihub` already contains a functioning *separate* Node.js/Express automotive codebase:
- `package.json` scripts include `npm run build`, `npm run build:front`, syntax tests, site, funnel, buyer-plan, purchase and cases tests.
- `scripts/build-hostinger.js` generates `dist/` and `daninihub-front/dist/`, copies assets including `danini-auto-uvoz.webp` and `danini-pregled-auta.webp`.
- `server.js` mounts `server-importos-runtime` and `server-public-runtime`, has /health endpoint, ImportOS products and runtime version, uses .env.
- Dependencies already include `express`, `mysql2`, `stripe`, `@getbrevo/brevo`, `openai` and `@google/generative-ai`.
These are code presences only, NOT proof of enabled Stripe live payments or completed migrations. AppDeploy v12 uses a different auth/database/AI SDK, so merger must be intentional.

## Work plan grounded in verified code
1. Preserve backup of currently deployed `daninihub.com` including DB/config/assets, DNS records and SEO routes. No live overwrite until backup restore test.
2. Create exact feature parity inventory comparing AppDeploy v12 route-by-route with Hostinger code. Prefer reusing the existing proven MySQL/Stripe/Brevo backend rather than implementing the same business function twice.
3. Build a *staging-only* new frontend layer matching the AppDeploy v12 HTML/CSS, while adapting API calls and auth to vetted Node backend. Do not copy AppDeploy proprietary SDK client as-is.
4. Validate `npm run build` of the current main code and run all regression tests; then add integration + access-control tests, admin/support and AI budgets.
5. Keep Calije subdomain and MX/SPF/DKIM/DMARC records untouched. Test two sites independently.
6. Review legal, logs, backup/restore, customer privacy, fraud and Stripe live account before live payment. Existing Stripe connector 'Buymeacoffee' is TEST MODE.
7. Cutover daninihub.com only after staging matches the visual reference, functional security tests pass, and rollback is available.

## Existing project references
- AppDeploy AutoDanini: `auto-danini-import-b2b-p8swk5`, v12 snapshot `1792610683309`, https://auto-danini-import-b2b-p8swk5.v2.appdeploy.ai/
- AppDeploy Calije: `daninihub-calije-zakup-placeva-n1v9xy`, reference only; DO NOT swap in place of live Calije.
- GitHub admin PR #59 branch `feat/autodanini-admin-desk-20261021`, development admin/support not live; security NO-GO remains until E2E and auth fixed.
- Existing Hostinger subdomain calije.daninihub.com is separate from root.
