# AutoDanini — cleanup checkpoint 2026-10-22

## Completed
- Deleted only two obsolete VPS recommendation markdown documents from development branch (recoverable via Git history): VPS_PROVIDER_COMPARISON_2026-10-22_SR.md, VPS_DOMAIN_MIGRATION_STRIPE_FEATURE_2026-10-22_SR.md. No runtime code or active websites touched.
- Audited changed file list in PR #59; core AutoDanini visual snapshot and backend files preserved.
- Found 3 sets of identical SHA files:
  - appdeploy-admin/backend/admin.ts == staging-v12/backend/admin.ts
  - appdeploy-admin/admin.html == staging-v12/admin.html
  - appdeploy-admin/src/admin.ts == staging-v12/src/admin.ts
  Do not delete until references in apply/build scripts are checked: duplication alone does not prove dispensability.
- Hostinger existing automotive code already has ImportOS/Stripe/PayPal/Brevo/Node/MySQL; preserve until integration tests.
- Public root daninihub.com MUST eventually show unchanged AppDeploy AutoDanini v12 design; Calije stays on calije.daninihub.com. Hostinger Business, no new VPS or domain.
- Previous security NO-GO: static admin header secret, untrusted host-based origin, DB local-file fallback, Stripe production unverified, no tested backup/restore, AppDeploy admin allowlist empty.
- Existing Hostinger security gate in autodanini/security/hostinger-release-gate.cjs is static heuristic, not verified E2E or secure production. Do not present deployment as ready.
## Next
1. Inspect scripts that use two duplicate sets; consolidate only after tests and references updated.
2. Secure URL generation: configured allowed origin only; use explicit env setting in production, not request Host/X-Forwarded-Proto. Regenerate origin-dependent payment URLs server side.
3. Migrate to authenticated owner roles, no browser-held permanent admin shared key; retain fail-closed mode pending identity.
4. Enforce production durable DB + verify backups/restoration + authenticate each case, prevent IDOR.
5. Payment off until validated merchant, webhooks+idempotency+capture authorization.
6. Run regression and E2E in a reproducible Hostinger-compatible runtime, check design parity SR/DE.
7. After user review, cutover daninihub.com; never touch calije and mail DNS.
