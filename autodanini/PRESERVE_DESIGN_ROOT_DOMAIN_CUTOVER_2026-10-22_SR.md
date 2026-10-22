# AutoDanini: zahtev za preslikavanje na glavni domen — 2026-10-22
Korisnik izričito traži: trenutni AutoDanini AppDeploy sajt mora zadržati POSTOJEĆI dizajn, izgled, sadržaj, raspored stranica, SR/DE, cenu i WhatsApp; ništa ne redizajnirati. Krajnji javni URL je https://daninihub.com i treba zameniti STARI ROOT SAJT na tom domenu istim AutoDanini iskustvom. Čalije mora ostati zasebno na https://calije.daninihub.com bez izmene.

Izvor AutoDanini: AppDeploy app_id auto-danini-import-b2b-p8swk5; live https://auto-danini-import-b2b-p8swk5.v2.appdeploy.ai; snapshot 1792610683309 (v12). GitHub developmental copy danininet/daninihub branch feat/autodanini-admin-desk-20261021 in autodanini/staging-v12, NOT production. User chooses existing Hostinger Business as long-term host, no VPS/new domains, Business renewal user-managed.

TEHNIČKA GRANICA: AppDeploy Free custom domain requires Plus, otherwise mapped host returns 404. Therefore cannot simply attach daninihub.com to current AppDeploy Free without subscription. Hostinger Business can host a ported equivalent but @appdeploy/client and @appdeploy/sdk (auth/db/ai) require replacing with supported backend/auth/db/AI integrations. Do NOT overwrite existing Hostinger wwwroot or DNS before backups, data mapping, migrations and site QA.

Pre-cutover:
1. Capture current root daninihub.com full backup including .env securely (not GitHub), files, DB, URLs, SEO/301 mappings, DNS and email MX SPF DKIM DMARC; verify restore. Inventory current Hostinger root server and Calije subdomain records.
2. Make parity test checklist screenshot/pixel+navigation mobile DE/SR for AppDeploy v12 vs Hostinger staging; preserve all 22 original pages, styling, imagery, WhatsApp, login UX; no fake/placeholder data.
3. Make portable backend for Hostinger Business, including auth, per-user access, support, admin email owner allowlist, AI spend cap and Stripe sandbox if needed. Note AppDeploy proprietary DB auth not one-click export.
4. Deploy on Hostinger staging separate website, run build, security E2E, performance, backup/restore; verify Calije remains accessible. Handle existing SEO and 301 redirects; do not expose unfinished auctions.
5. After GO and user-approved cutover, point daninihub.com and www to new AutoDanini, leave calije.daninihub.com/MX/TXT unchanged; check HTTPS, caching, login, forms, WhatsApp, SEO. Have rollback.
Current security prelaunch audit autodanini/staging-v12/SECURITY_GO_NO_GO_2026-10-22.md says NO-GO for admin/support. Do not advertise them live.
