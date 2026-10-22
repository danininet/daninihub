# AutoDanini — final hosting/migration/Stripe/feature comparison (2026-10-22)
## Current assets (verified vs user-described)
- Hostinger Business Web Hosting, renewal offer ~140 EUR, ~04.11.2026 as user previously reported. domain daninihub.com remains registered there.
- Connected Hostinger email API account contains mailbox kontakt@calije.daninihub.com (checked 2026-10-22). This is not necessarily AutoDanini's outgoing email.
- User says Brevo + API exist: reuse for transactional/marketing sending; SPF/DKIM/DMARC required. Brevo outbound is NOT same as inbound mailbox.
- Stripe connector available account name 'Buymeacoffee', livemode=false. It is not a verified, ready-to-charge AutoDanini Stripe account. Do not activate public checkout without validated account, settlement and legal seller identity.
- Existing AutoDanini AppDeploy preview: app_id auto-danini-import-b2b-p8swk5, version 1792610683309. PR #59 branch feat/autodanini-admin-desk-20261021 is development only. Admin/support not yet live, owner allowlist empty, security NO-GO at autodanini/staging-v12/SECURITY_GO_NO_GO_2026-10-22.md.

## Hosting actual options and limits
A. Renew existing Hostinger Business (reported ~140 EUR/yr) for daninihub.com; Hostinger supports Node.js apps via GitHub on Business (max 5 Node apps); no incoming WebSocket, no always-running workers, no Docker/Redis, 120-second request cap. Thus OK for staged brochure, forms, simple service requests, but poor fit for a single sophisticated real-time auction+agents stack. Source https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/ and https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
B. Hostinger self-managed VPS KVM2 (2 vCPU, 8 GB RAM, 100 GB NVMe), enough to pilot two sites, an API, PostgreSQL and Redis/worker when maintained. Additional complexity: firewall, Docker, patching, monitoring, off-server backup, recovery, secrets. Check exact initial period and renewal at checkout (promo quoted previously from hostinger country locale; not binding). Source https://www.hostinger.com/support/6976044-parameters-and-limits-of-hosting-plans-in-hostinger/ .
C. External provider Hetzner possible; compare support, VAT, transfer burden. No automatic choice based solely on CPU price.
Hostinger confirms Business->VPS cannot be directly upgraded: must buy separate VPS and manually migrate; old hosting overlaps during cutover. Source https://www.hostinger.com/support/1583459-how-to-upgrade-a-hosting-plan-at-hostinger/ .
Internal migrations do NOT qualify for free assisted migration. Source https://www.hostinger.com/support/4455931-how-to-migrate-a-website-to-hostinger/ .
New 12+ month VPS purchases may offer one year FREE for selected extensions .io/.tech/.cloud/.digital/.network/.systems, not .com. Existing Business renewal/upgrade does not grant new free .com. Confirm availability on account. Source https://www.hostinger.com/support/8317599-what-free-domains-are-available-at-hostinger/ .
Register desired autodanini.com independently after availability/checkout confirmation. Keep daninihub.com registration independent of its website hosting.

## Indicative scenario (NOT quotations)
- Business keep: ~140 EUR/YR reported + new .com ~10-20 EUR/YR + AI API usage + Brevo tier if needed; no separate server bill. But support for complex workers/auction requires other service later.
- KVM2 replace: advertised intro prices vary, use provisional 8 EUR x12=96 EUR/YR and renewal maybe 15 EUR x12=180 EUR/YR; PLUS .com 10-20 EUR/yr, backups/storage 3-10 EUR/mo, AI usage, paid operator/incident maintenance and migration engineering. In parallel transition, overlap existing Business and VPS until validated.
- Stripe standard German EEA card rate 1.5% + 0.25 EUR per transaction; e.g. 29 EUR payment charge ~0.685 EUR. Actual conditions depend on merchant account, local country and methods. Source https://stripe.com/de/pricing .
- Fixed upfront migration labor is UNKNOWN until inspecting DaniniHub app architecture, its DB/backups and AppDeploy auth/data export. Do not claim zero-cost migration, one-click replacement or guaranteed benefit.
- AI caps: per-user quota, global cost ceilings, server-side keys, job queue with max retries and observability. Auction transactional data integrity and legal rules are separate from basic site.

## Migration for both sites
1. Inventory exact daninihub.com hosting technology (WordPress/custom PHP/Next/Hostinger Builder etc), DB, .env secrets, GitHub, files, backup. Do not assume everything accessible from GitHub.
2. Make verifiable offsite encrypted backups of code, DB, images and mail settings. Separate restore test.
3. Provision trial VPS using locked-down SSH keys, TLS, firewall, automatic security patching, Docker compose, reverse proxy, DB data volume, backup+restore, uptime alerts.
4. Migrate DaniniHub to temporary staging host, restore DB/files, test mobile/SEO/forms/WhatsApp and email deliverability; preserve original daninihub.com until complete.
5. AutoDanini: AppDeploy SDK auth/DB/AI are proprietary integrations; replace adapters using standard PostgreSQL + chosen auth + AI API. Plan users migration only when AppDeploy export confirmed; no unapproved copying of personal data.
6. Test admin/customer ownership, tickets, Stripe webhook signature and idempotency, payment sandbox and refunds, bid concurrency + anti-sniping if auctions enabled, rate limits and logging; production safety GO criteria.
7. Change only DNS A/CNAME records AFTER tests, preserve MX/TXT SPF/DKIM/DMARC and domain registration; rollback plan. Run old/new overlap briefly and only cancel old Business once migration validated.
8. No automatic DNS switch, purchase, or public feature claim.

## Differentiating business feature to build
Recommend **AutoDanini Verified Buyer Mandate / Secure Deal Room**:
- Buyer saves URL, chosen car, target landed-cost ceiling, seller data.
- AI checks missing info and builds a checklist but no invented claims.
- Seller sent structured bilingual document/question request, buyer sees status, evidence and refusal flags.
- Independent mechanic available on demand, separate quote and real invoice; no fake ADAC partnership.
- Standardized report: disclosed, verified with evidence, unknown, deal blockers, estimated landed costs with explicit assumptions.
- Milestone payment for SERVICE only via verified Stripe; do not hold car purchase deposits/escrow without licensed partner and legal compliance.
- Paid readiness report + deal coordination upsell; optional listing/auctions later. Potential advantages across DE↔Balkan: language, logistics, trust, risk ledger. Test conversions and actual purchase.
- Stronger than generic AI chatbot or listing directory; user learns value before committing to car. Reference competitor physical check https://www.autokaufcheck.de/preise (99 EUR basis/139 EUR plus).
- Later verified seller inventory/auction: seller verification, vehicle evidence, bid timestamps/concurrency, dispute process, legal terms and refunds.

## Operating resume
Next: verify exact renewal invoice and any Hostinger account coupon/Stripe eligibility WITHOUT asking user to resend already shared info; audit repo backend and migration dependencies; build secure staging; keep no public production deploy until Security GO. User explicitly requested to save project status and future work. No domain/hosting purchase nor production migration performed today.
