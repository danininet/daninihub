# AutoDanini — security implementation checkpoint 2026-10-22

## Completed on development branch
- Preserved v12 AppDeploy design source, all landing pages and assets, and existing Calije subdomain.
- Removed two obsolete VPS-only planning docs (only docs, Git history retains them).
- Confirmed duplicated admin.ts/admin.html/src/admin.ts are identical but retained pending script dependency review.
- Updated `server-importos-runtime.js` on development branch, commit `ca959e9accb350c406ff7bd8e16e60af9dae191b`:
  - customer tracking URLs, payment success URLs and site public origin now come from `DANINI_PUBLIC_URL`.
  - `DANINI_PUBLIC_URL` must be a well-formed absolute HTTPS origin with no embedded credentials, paths, query or fragment.
  - Development without a configured URL falls back only to local 127.0.0.1/localhost deployment origin by configured local PORT, not to arbitrary caller headers.
  - Production without proper origin fails closed with `DANINI_PUBLIC_URL_MUST_BE_TRUSTED_HTTPS_ORIGIN` error.
  - DO NOT put secrets into this variable. For production use `DANINI_PUBLIC_URL=https://daninihub.com`.
- The static release gate exists at `autodanini/security/hostinger-release-gate.cjs`, but passing heuristic checks is not proof of end-to-end safety or production readiness.

## Outstanding blocking security issues
1. `adminAllowed` still uses a shared secret from X-Danini-Admin / bearer; replace with authenticated user identity and server-side role checks; admin 2FA; audit and deny-by-default.
2. Require database in production; remove local-file fallback for PII/payments; restore-test offsite encrypted backups.
3. Validate case authorization, no IDOR, bounded file attachments, anti-spam and server-side rate limits.
4. Stripe connected 'Buymeacoffee' test-only; keep checkout and payment caps disabled until verified appropriate merchant and callback/webhook integrity + idempotent transactions.
5. Build and integration tests and AppDeploy design parity checks with Hostinger Business Node environment still to be performed.
6. Legal notice/privacy/cookie/retention rules, Brevo sender verification, SPF/DKIM/DMARC, SEO redirect mapping and domain settings must be verified.
7. No live DNS/application deployment has been changed.

## Locked addresses
daninihub.com = AutoDanini design from https://auto-danini-import-b2b-p8swk5.v2.appdeploy.ai/ after parity and secure migration.
calije.daninihub.com = Čalije parking + lot rental, untouched.
