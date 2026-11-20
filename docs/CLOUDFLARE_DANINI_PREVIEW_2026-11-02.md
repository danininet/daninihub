# DANINI Auto — Cloudflare Pages preview (not production)

This is an isolated SR/DE brochure / lead-generation preview from existing repo assets and original legal page source. It **does not** enable Express, database, admin, AI, Stripe, PayPal, Brevo, or automatic PDF delivery. No affiliate relationship is implied.

## Build / QA

- Repository: `danininet/daninihub`
- Preview branch: `cloudflare-danini-auto-preview-20261102`
- Framework preset: **None**
- Build command: `node scripts/build-cloudflare-preview.cjs && node scripts/test-cloudflare-preview.cjs`
- Build output directory: `cloudflare-preview-dist`
- Root directory: repository root
- Node version: 22
- GitHub / Pages automatic branch previews enabled if desired

The build copies `public/` unchanged (including original pictures), builds separate service, process, B2B, contact, SR/DE pages, and reuses the existing legal page renderer without editing its text.

## Preview-only safeguards

- Site-wide noindex HTTP header and robots.txt Disallow-all.
- No domain change or DNS edit in this pull request.
- No transactions, account logins, API dependencies, private credentials or vehicle listings.
- No published AUTO1 or wirkaufendeinauto affiliate URLs without prior approval.

## Must resolve before **daninihub.com** production

1. Review the legal pages with the business operator/qualified adviser: existing terms still describe older 9.90 / 79 € products and are NOT aligned to proposed 59 / 189 / 349 € prices; verify business identity, consumer withdrawal rights, pricing including VAT where applicable, and DE/SR privacy.
2. Agree whether prices, service radius, travel cost, offer scope and buyer consent are final. Verify whether cross-border services and insurance permissions are needed.
3. Audit existing DNS records (MX, SPF, DKIM, DMARC, verification records, old api / staging hostnames) and email delivery **before** any nameserver or A/CNAME change.
4. Test the actual Pages URL and WhatsApp links; ensure originals are correctly sized. Remove noindex and enable sitemap/canonical only after review.
5. Keep Cloudflare project disconnected from the main apex domain until explicit owner approval.

This package is staging-ready in GitHub, but cannot create or connect the Cloudflare account without access/authorization via the Cloudflare dashboard.
