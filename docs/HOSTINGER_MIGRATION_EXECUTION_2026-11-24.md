# DANINI Hostinger migration — operational record, 24 November 2026

Status: **CODE / LOCAL TEST; production cutover NOT performed.**

## Verified starting state

- Source branch: `hostinger/audit-fixes-20261124`, head `b3fe0184b2b8871d4ce4520209e0fba6ef33304a`.
- Main: `dff07de9ce95e4e12d89f5347a9d186c8f41c533` (PR #299, staging R2 isolation).
- Hostinger `/de/` renders the current DANINI preview in the actual Cloud Browser.
- Hostinger `/health` returns HTTP 503, HTML, `platform: hostinger`, rather than the expected Express JSON. This proves the expected route is not reached; it does not establish the server-side cause.
- hPanel redirects to Hostinger login. Cloud Browser has a documented Hostinger sign-in restriction. No login attempts, credential changes, or hPanel settings changes were made. The available Hostinger connector handles mail, not website deployments.
- Production `autodanini`: deployment `be5fb3bc-0c94-495d-9d33-6fd795fb44a0`, version `e84d0f4b-81eb-4034-8a85-014cb9a118d9`, 100%, captured 24 Nov 2026.
- Staging: deployment `bbddfd4b-7673-4eec-a8c8-dae039db5472`, version `0a0b6a5b-4609-4a7b-8d07-5e0182442a77`, 100%.
- Staging D1, KV, R2 (`danini-b2b-staging-private`) and Workflow are separate. The live staging has 17 bindings. `AI_ENABLED=false`, `B2B_ACTIVE=false`.
- Staging lacks BREVO_API_KEY, MAIL_TEST_RECIPIENTS, ACADEMY_AUTH_SECRET, PayPal settings and digital signing secret. Its Access application exists, but the Worker settings do not include ACCESS_AUD/ACCESS_TEAM_DOMAIN. Presence of a Turnstile secret is not proof of its hostname/action configuration.
- Production Academy authentication and AI are enabled and invitation-only. This supersedes older Drive notes that said Academy authentication was disabled.
- Web DNS currently uses the two Cloudflare Worker custom domains (apex and www); the read-only AAAA records are managed by Workers. There are 60 legacy routes to `danini-master-page`. These must be preserved or explicitly reconciled before any web cutover; an apex A-record alone is not a complete migration.

## Changes

1. Cherry-picked the exact PR #299 R2 fix into the Hostinger work branch.
2. Preview asset resolver supports both repository `dist/` and Hostinger's documented sibling `nodejs/` + `public_html/` layout, without serving the working directory or arbitrary folders.
3. Missing assets return a JSON health 503 rather than crashing before the listener starts. Runtime identity header and metadata-only startup logging distinguish application health from Hostinger's error page.
4. Preserve the 11 existing redirects and historical `/auto/name/` static HTML paths.
5. Reject encoded API/private routes, dotfiles and source routing manifests in the preview. API, POST, portal, operator and customer-data functionality stay blocked there.
6. Static preview HTML also carries CSP restrictions; Express/Cloudflare headers alone do not protect a static Hostinger export.
7. Separate preview and production static builds. The production build retains intended private-page noindex directives and functional form code, and fails if any preview marker leaks into the artifact.
8. Add an explicit Node 22 engine and a nonsecret build marker with revision and mode at `/_danini/build.json`.
9. Extend the existing Hostinger CI and add a repeatable, read-only public migration probe.

The split-directory change repairs a reproduced local deployment-layout failure; **it is not claimed to be the confirmed cause of Hostinger's current 503 without its logs**. `npm start` remains the isolated preview server. `build:hostinger-production` produces a static artifact; it does not enable production backend access or perform a cutover.

## Validation

- Original baseline preview tests: 4 passed.
- Updated preview runtime/layout tests: 6 passed, including Node 22.23.5.
- Static preview safety and affiliate tests: passed.
- Production static artifact guard: passed.
- Astro check: zero errors, zero warnings (existing informational hints remain).
- B2B/AutoDanini tests: 109 passed; Academy tests: 29 passed.
- Existing full regression chain: passed, including simulated PayPal capture and signed delivery. These are local tests, not a real PayPal Sandbox purchase.
- Local Wrangler started with explicit inspector port 9231, avoiding an environment interface-enumeration error. Local D1 migrations succeeded.
- Local Chromium launch is blocked by the execution environment (`socket() failed: Operation not permitted`). GitHub's existing browser workflows are the next verification surface; this is not a DANINI application failure.
- No real OTP, AI inference, PayPal approval/capture, Brevo delivery or account deletion has been performed in this migration run.

## Deployment and cutover gates

Hostinger runtime logs, active branch/commit, framework preset, entrypoint, static output directory, PORT and environment remain unverified because hPanel is inaccessible. The browser-visible preview does not prove a working Node runtime.

Do not deploy the preview artifact to production. Production functional QA requires an approved production static build on Hostinger, same-origin routing that keeps the integrated `src/index.ts` backend on Cloudflare, the existing Access applications, and the isolated staging prerequisites above. Do not copy production secrets or production datasets into staging to clear the gate.

## Concrete rollback

No production routing or DNS change was made, so no production rollback is currently needed.

- For these preview code changes: restore the last verified Hostinger branch/build at `b3fe0184b2b8871d4ce4520209e0fba6ef33304a`, but retain the R2 isolation fix from PR #299 before any staging Worker deployment. Hostinger's prior successful deployment ID must be obtained before changing hPanel.
- For a later Worker cutover: restore the captured production Worker version `e84d0f4b-81eb-4034-8a85-014cb9a118d9` at 100%, recheck current deployment immediately before execution to avoid overwriting parallel work, then verify APIs and protected routes.
- Preserve custom domains `daninihub.com` and `www.daninihub.com`, all recorded legacy routes, and their Worker mapping. Restore only web records/routes changed by the cutover from the exact pre-change snapshot.
- Never overwrite MX, SPF, DKIM, DMARC or Brevo records during rollback. Never roll back D1/R2/KV data as part of a frontend rollback.
- A later migration is accepted only after genuine DE/SR frontend, forms, OTP/session/project privacy, controlled mail receipt and PayPal Sandbox purchase/private delivery E2E pass.

## References

- Existing manifest: https://docs.google.com/document/d/1mKRKqRMYfjcJKg58agVCnHdU_29uaR8gjt6oXrliJrg/edit
- Hostinger structure: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- Hostinger runtime/503 guidance: https://www.hostinger.com/support/how-to-fix-503-and-too-many-processes-errors-on-node-js-websites-at-hostinger/
- Cloudflare routing: https://developers.cloudflare.com/workers/static-assets/routing/worker-script/
- PR #299: https://github.com/danininet/daninihub/pull/299

This is the single operational record for this run. Append concrete CI/deployment evidence below as obtained; do not mark migration complete from HTTP 200, a build or a merge alone.
