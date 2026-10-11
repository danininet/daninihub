# DANINIHUB — OPENAI SITES RELEASE CANDIDATE (11.10.2026)

## Exact target
ONE site and domain: `daninihub.com`, under the identity **Dragan Zdravković — DaniniHub**. Serbian and German. No new domain, no duplicate production site.

## What has been implemented
- The existing Express application is extended on the branch `design/business-automotive-2026-10`.
- New bilingual owner-led home, six pairs of professional pages: profile, business support, dealer support, CV, rental enquiries, contact.
- Real owner portrait at `public/dragan-original-2026.jpg`; 3×3 AI visual at `public/dragan-business-grid-3x3.png`. Clear AI label.
- Business contact: WhatsApp +49 1573 0916621; email info@daninihub.com. No dead contact form.
- Existing automotive calculator, inspection, quote and purchasing routes remain in the Express app; this change does not activate or verify any payments.
- SEO routes are included automatically in sitemap/canonical/hreflang through existing Express integration and static Hostinger export.

## OpenAI Sites constraint — production blocker
ChatGPT Sites is a distinct hosting runtime. It does not currently allow enabling financial transactions, and the existing Express + MySQL + Stripe/PayPal/Brevo backend has not been migrated or E2E validated there. Do NOT point daninihub.com at Sites yet. The static design in `openai-sites-preview/index.html` is a **preview** only, not a substitute for the working Automotive backend.

Docs: https://learn.chatgpt.com/docs/sites

## Safe release procedure
1. Run `npm ci && npm run build` in an environment with the full repo. Run `npm run test:founder`, screenshot responsive checks, verify all 12 new routes, SR/DE language switching and asset delivery.
2. On staging, test automotive calculator → quote → payment sandbox → webhook → report/email and admin security. Never use live cards or secrets in Git.
3. In ChatGPT **Work > Sites**, choose an existing-compatible project or import the approved static design. Save a **private candidate** (not public). Ask Sites to assess backend compatibility before any deployment.
4. If migration is possible with supported, legally compliant payment architecture and preservation of existing user flows, test full parity. Otherwise retain Express backend hosting and postpone the DNS switch.
5. After explicit owner approval, connect only `daninihub.com` in Sites settings, copy the exact DNS values supplied by Sites into the registrar and verify HTTPS, redirects, SEO and rollback.

## Status
- Code and visual assets prepared in GitHub branch: DONE.
- Release-level tests, staging audit, production checkout and data migration: NOT VERIFIED.
- OpenAI Site provisioning, custom domain, DNS and public publishing: NOT DONE.
- Current production: UNCHANGED.
