# DANINI B2B implementation — 13 November 2026

**Decision: NOT READY for production.** Isolated implementation for review. No production deployment, DNS change, payment or live database migration has been performed.

## Baseline verified

- Main commit: `e0e0cecf611952dd0ec621968132c575c1a791e2`.
- Production account: `c7c8ad399f1e851d1c3a8be34e66f822`; Worker `autodanini` and route-overlay Worker `danini-master-page`. The other account named Danini has no Workers or D1 databases.
- Existing D1 `danini-commerce` is in EU jurisdiction. Read-only schema inspection found `danini_digital_files`, `danini_digital_orders`, `danini_digital_pdf_chunks`; new migration does not modify those tables.
- R2 API returned error 10042: enable R2 through the dashboard. R2 was not activated; billing approval was not assumed.
- No existing Workflows found in the production account.
- Brevo: domain authenticated and verified; eight active senders, including `info@daninihub.com`. Sender verification is not proof of mailbox reception or delivery.
- Connected mail provider does not expose the `info@daninihub.com` mailbox. No unrelated mailbox was opened.

## Implemented

- Astro/TypeScript DE/SR homepage, three service detail pages, local Inter font, responsive layout, existing AutoDanini packaged under `/auto/`.
- Existing Node app, payment worker, lead handler, digital files and source pages retained. Default production `wrangler.jsonc` unchanged deliberately.
- Additive D1 schema for tenants, cases, files, referrals, audit, workflow events, rate limits, replay protection and mail outbox.
- Intake validation, exact-origin check, Turnstile hostname/action validation, bounded streamed body, keyed IP rate buckets, unique request key, private R2 storage and deterministic Workflow start.
- Case status requires bearer capability. Director review/approve uses a separate HMAC key, timestamp, single-use nonce and document hash; no cookie auth.
- Workflow prepares an administrative draft and waits up to 72h for a director decision. No final report without an authenticated persisted approval of that exact hash. Timeout, rejection and tampering covered by tests.
- Rule-based triage by default. Optional AI Gateway client checks explicit processing approval, validates JSON, marks provenance and caps questions at three. No iterative question loop.
- Brevo receipt reuses template 48/49. At-most-once outbox submissions avoid duplicate messages after an ambiguous response. Provider acceptance is never labelled delivery confirmation.
- Weekly bounded expiry cleanup for R2/D1. Audit cleanup 90 days. Provider and Workflow retention require separate verification.
- Eight separate legal/AI pages are clearly marked drafts and noindex. No incomplete legal page was published.
- Nine reviewed legacy redirects, locale/canonical metadata, sitemap and security headers.
- Dependency remediation: body-parser 2.4.0 and qs 6.17.1 after confirmed advisories. Cookie 2.0.2 is a direct development dependency to prevent Astro build resolving Express's older cookie API.

## Validation

| Check | Status | Evidence/limit |
|---|---|---|
| Existing AutoDanini build | PASS | 30 legacy pages build; source intact |
| Astro build | PASS | 19 generated pages before legacy merge |
| Astro/TypeScript | PASS | 0 errors, warnings or hints |
| B2B security and Workflow logic | PASS | 13 automated tests; SQLite-backed adapter and mocked provider/runtime boundary |
| Existing regression suite | PASS | importos, site, funnel, buyer plan, purchase, cases, calculator, ecosystem, digital |
| Digital regression | PASS | PayPal capture, expiry, signature, PDF access; no real payment |
| Wrangler bundle dry-run | PASS | Bound Worker and Workflow compile, no upload |
| Local D1 migrations | PASS | Existing commerce + additive B2B schema, no remote writes |
| Query plans | PASS | Expiry, case-file and request-key lookups use indexes |
| Static SEO/link audit | PASS | 16 B2B pages; 9 redirect targets; isolated legal drafts |
| Browser/Lighthouse | PASS in GitHub CI | Run 43413231102 passed desktop/mobile DE/SR. Initial scores: performance 100, SEO 100, accessibility 96, best practices 96. Contrast/label findings subsequently fixed and recheck pending. Local container socket restrictions remain. |
| Real Cloudflare Workflow | BLOCKED | R2 inactive and no isolated staging bindings/secrets |
| End-to-end B2B Turnstile/Brevo | BLOCKED | Requires staging host and configured Turnstile; previous legacy delivery not repeated |
| Paid AI | BLOCKED | EU endpoint, DPA, provider, model and budget unapproved |
| Legal release | BLOCKED | Current identity/business status, service address and processor contracts need verification |

A separate GitHub Actions workflow builds and performs browser/Lighthouse QA without production secrets. Its actual run result must be checked; defining CI is not a PASS.

## Remaining implementation limits

1. Upload support deliberately accepts only up to two UTF-8 plain-text documents (32 KB each). A browser upload input is provided; PDF/Office parsing and malware scanning are not implemented; binary uploads are rejected.
2. Domain agents currently provide structured triage/checklists and an optional constrained AI draft. They are not independently validated CBAM/TARIC, A1, PEM, chemical compliance or certification engines. No regulatory conclusions are generated by deterministic rules.
3. Director interaction is through `scripts/director-review.mjs`; a browser portal and role-managed individual director identities are not implemented. The signing key identifies a dedicated director role, not multiple named users.
4. KV binding is prepared; tenant/referral tables exist, but partner onboarding and partner-specific branding/routing are not activated.
5. No claim of fully completed DSGVO/AI Act compliance, machine-readable interoperability, mailbox testing, live Stripe/PayPal E2E or production readiness.
6. AutoDanini's old root URLs remain for compatibility. Full locale-specific AutoDanini SEO and overlay cutover need a deployment review; this branch does not silently remove production overlay routes.
7. New service pricing is by written agreement. No fabricated rates or regulatory guarantees were added.

## Release requirements

- Confirm R2 activation/billing terms; provision private EU bucket and separate staging D1/KV/Workflow, with no production data copied into staging.
- Supply staging secrets via secure provider settings: Turnstile, Brevo sender/reply-to, dedicated HMAC and token/rate secrets. Never commit secrets.
- Generate the reviewed config using `scripts/prepare-b2b-config.mjs`; it rejects the production D1 for staging. Keep `B2B_ACTIVE=false` until checks pass.
- Confirm business identity/address, appropriate service boundaries and processing contracts. Resolve legal placeholders before release.
- Verify real `info@daninihub.com` reception and reply route. An automatic redirect to a web form is insufficient.
- Perform real staging Workflow/Turnstile/receipt/approval/final-delivery tests with owner test addresses, including retry and timeout paths.
- Take a production D1 backup and review all `danini-master-page` overlay routes for an atomic cutover. Merge, domain/route changes and production migration require the owner's explicit approval.

## Reproduce

```sh
npm ci
npm run check:b2b
npm run test:b2b
npm run test:regression
npm run build:platform
node scripts/test-b2b-static.cjs
npx wrangler deploy --dry-run --config wrangler.b2b.jsonc
npx wrangler d1 migrations apply DANINI_DB --local --config wrangler.b2b.jsonc
```

`wrangler.b2b.jsonc` has placeholder resource IDs for **local use only**. Do not deploy it. Use the config generator with real environment-specific IDs after provisioning is authorized. Do not reuse the local persisted database after changing an already-applied migration; recreate the disposable local state or apply a new additive migration.

## Repository-history scan

2,098 blobs across all locally fetched refs were scanned for high-confidence Brevo, GitHub, OpenAI, Stripe-live and private-key patterns. No matches. This is a scoped pattern scan, not proof that no secrets ever existed; entropy detection and provider-side credential validation were not performed.
