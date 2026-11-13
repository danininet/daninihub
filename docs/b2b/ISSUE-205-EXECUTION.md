# Issue 205 execution — 13 November 2026

Status: **TESTED locally/CI; deployed to staging; not approved for live customer intake.**
PR: https://github.com/danininet/daninihub/pull/206

## Delivered

- `/portal/`: owner-only inbox and case detail, original enquiry, company/contact, language/category/time, next action, draft, questions, missing information, limits, delivery attempts and decision history. Maximum 50 active cases; no full-text search or pagination yet.
- Cloudflare Access signature/issuer/audience/expiry checks plus exact owner email; CSRF origin check on writes. HMAC credentials never appear in browser code. CSP, no-store and noindex responses.
- Approve / reject / return for revision update real D1 records. Edits archive the previous draft in private R2, invalidate its hash, and require separate approval. Three revisions maximum. Original 72-hour deadline does not extend. Partial storage failures stop release for reconciliation.
- Rule-based draft includes three questions, explicit unverified customer assertions and unknowns. AURI filter returns STOP / NEEDS_REVIEW / PASS for schema, cycle limit and recorded approval. PASS is not regulatory clearance. DE/SR report headings corrected.
- Staging-only mail recipient restriction rejects other addresses before storage/sending, including cc/bcc. No campaign or real purchase executed.
- Existing lead regression expectations corrected for the already-adopted info@ sender. Legacy public audit updated for the verified Astro master header, business workflow illustration, canonical method/about pages and AutoDanini redirects; safeguards retained.

## Remote changes

Account: c7c8ad399f1e851d1c3a8be34e66f822. Production Worker, DNS, production secrets and production data untouched.

- Added unique staging TOKEN_SECRET, RATE_SECRET, DIRECTOR_HMAC_SECRET; generated inside Cloudflare execution, never printed or committed.
- Dedicated real Turnstile widget restricted to the staging hostname; credentials stored in staging secrets.
- Staging sender/reply-to: info@daninihub.com; notification/test recipient: owner's existing approved Gmail.
- Access application `fa691a4e-db77-4c8a-8027-5154bf113b5d`, domain `danini-b2b-staging.dragangaganet.workers.dev/portal`, one-hour session, only owner email allowed. Worker validates Access independently.
- Staging B2B_ACTIVE=false and AI_ENABLED=false remain. Existing assets retained during Worker code upload.
- Pre-change staging rollback version: `569d7fb8-aa9d-4ac2-bd9e-b9f830992138`; code-only portal upload: `ab0d2bf6-ae1f-46d5-9331-a61882fafb9b`. Subsequent secret updates create further versions. Consult deployment history for current version.

## Evidence

- 21 local security/workflow/portal tests pass, including JWT owner/audience/expiry, wrong origin, stale hashes, three-revision cap, replay, provider ambiguity, tampering, no-send rejection and staging recipient restrictions.
- Astro check: 0 errors/warnings/hints. TypeScript noEmit passed on initial portal implementation; repeat on final revision recorded in PR validation.
- Full legacy regression suite, platform build, Worker bundle and static SEO/link checks passed.
- GitHub B2B QA run 43462445409 passed on first portal commit: DE/SR desktop/mobile browser checks, 390/1440-pixel portal fixture revision/approval, local migrations and Lighthouse. Fixture tests use synthetic API responses: they do not prove a real Access login, live D1/R2 or mailbox delivery.
- Live public audit: 36 pages, 34 sitemap URLs, 0 errors. One warning accurately says existing legacy intake is enabled and its historical delivery evidence is separate from this task. Existing confirmed delivery was not needlessly repeated.
- Unauthenticated staging /portal/ returned 302 to the configured Access login. Actual authenticated owner session remains unverified. Cloud browser service timed out; local Chromium could not start under its socket policy. CI Chromium did run successfully.
- Read-only remote schema queries: staging has B2B tables; production has only commerce tables. No migration was applied to production.

## Remaining blockers and limits

1. Staging has no BREVO_API_KEY. Production secret is write-only and was not extracted or overwritten. Brevo connector timed out twice. Provider credential configuration must happen through secure account/provider settings, never in chat or committed files.
2. Need actual owner Access login, then a staging synthetic DE/SR enquiry through real Turnstile, D1/R2, Workflow, receipt, review/revision/approval and confirmed receipt in the authorized mailbox. No live end-to-end success is claimed.
3. Enable staging only after the credential, template variables, provider processing/retention settings and restricted recipient are verified. No confidential customer documents in tests.
4. Production B2B schema migration, production security secrets and new release activation remain separately subject to the task's authorization limits and verified staging. Existing contact/payment paths continue unchanged.
5. Generative AI remains off: no approved provider/data-processing configuration or budget. Research/evidence is transparent about unverified inputs; no autonomous external research or regulatory assessment was performed.
6. Customer clarification round trips, broader digital-services vertical, message-content history, automatic inbox delivery reconciliation and multi-user role management are not implemented by this PR. It does not fulfill the whole AI enterprise specification.
7. P1 public site was audited; no new public redesign, legal changes, new price or purchased resource was introduced.

Do not close #205, merge for live intake, or label the new workflow LIVE/PAID based solely on these code and fixture results.
