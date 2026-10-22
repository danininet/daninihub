# AutoDanini — Hostinger Business kupci / bezbedna prijava (22.10.2026)

## Zaključana odluka
- daninihub.com → AutoDanini kada potpuno testirana Hostinger verzija prođe javne uslove.
- calije.daninihub.com → postojeći Čalije Parking i zakup. Ne dirati ni DNS ni aplikaciju.
- Hostinger Business, bez novih domena ili VPS, bez redizajna: v12 AppDeploy HTML/CSS ostaje izvor vizuelnog izgleda.
- Trenutni v12 AppDeploy je i dalje jedini prikaz; NOVI KOD NIJE OBJAVLJEN NA HOSTINGERU.

## Šta je napisano
- `core/autodanini-auth-security.js`: bezbedno generisanje šestocifrenih jednokratnih kodova, 256-bitnih nasumičnih sesija, HMAC hash tokena, provera tačnog Origin-a, host-only HttpOnly Secure SameSite=Lax cookie.
- `core/autodanini-customer-auth.js`: opt-in MySQL/Brevo logovanje e-mail kodom (10 min, max 5 pokušaja; max 3 koda/email/sat i 20/IP/sat); nalog kreiran tek po validnoj proveri, jednokratni kod postaje upotrebljen, sesija 7 dana; GET profil, POST odjava; GET/POST/DELETE privatni dosije (ID korisnika ISKLJUČIVO iz server-side cookie sesije, SQL ima `WHERE customer_id=?`). Do 20 sačuvanih dosijea, striktna validacija, zahtev za predaju administratoru namerno 503 dok admin inbox nije završen.
- `server.js`: API se montira samo kada su OBA prekidača `AUTODANINI_PREVIEW_ENABLED=true` i `AUTODANINI_AUTH_ENABLED=true`. Admin i plaćanja i dalje zaključani.
- `autodanini/staging-v12/src/hostinger-client.ts`: buduća hostinger-only prilagođavanja originalnom AutoDanini nalog ekranu: kod se traži putem pristupačnog dialoga, ne u URL-u. Preview feature flag `VITE_AUTODANINI_AUTH_ENABLED=true`; default false. Bez imitiranih ulogovanih korisnika.
- `autodanini/staging-v12/src/account-submission.ts`: sakriva neaktivni dugmić predaje administraciji u Hostinger buildu dok dodatna saglasnost i admin QA nisu gotovi.
- `tests/test-autodanini-auth-security.cjs` i `tests/test-autodanini-customer-auth.cjs`: testovi sigurnog kolačića, HMAC, Origin, OTP single-use, login, logout, međukorisničke izolacije, zabrane tuđeg brisanja i zabrane neaktivne predaje.
- CI: `.github/workflows/autodanini-hostinger-startup-tests.yml` i `.github/workflows/autodanini-hostinger-build.yml`.

## Status testova
Commit 31e3273d5d1f4f06542b37b5b05d86a4fe103a29: GitHub Actions 5/5 green (preflight, v12 audit, ImportOS core, Hostinger startup incl security/HTTP tests, Hostinger visual parity build). These are code and simulated SQL integration tests, NOT a test of a REAL MySQL/Hostinger/Brevo integration.
All secret/API keys MUST stay in Hostinger private environment, never GitHub repository.

## Bezbedno probno okruženje — nije korak obavezan za korisnika pre nego što preuzmemo rad
1. Sačuvati stvarni backup aktivnog daninihub.com i MySQL baze, proveriti restore. Očuvati calije.daninihub.com i sve MX/SPF/DKIM/DMARC zapise.
2. Privremena zasebna Hostinger Node.js aplikacija na staging poddomenu SA HTTPS, bez izlaganja root domena.
3. Privatan `.env` na Hostinger panelu (NE KOPIRATI stvarne lozinke u chat/repo):
   NODE_ENV=production
   AUTODANINI_PREVIEW_ENABLED=true
   AUTODANINI_AUTH_ENABLED=false
   VITE_AUTODANINI_AUTH_ENABLED=false   # postavlja se u build okruženju
   VITE_AUTODANINI_HOSTINGER_BUILD=true
   DANINI_PUBLIC_URL=https://<staging-host>
   DB_HOST/DB_USER/DB_NAME/DB_PASSWORD=<private verified Hostinger MySQL>
   DANINI_IMPORTOS_CHECKOUT_ENABLED=false
   DANINI_IMPORTOS_SERVICE_PAYMENTS_ENABLED=false
   BREVO_API_KEY=<private preexisting secret>
   BREVO_SENDER_EMAIL=<verified sender>
   DANINI_AUTH_HMAC_SECRET=<new 32+ character private random secret>
   # Avoid assuming a template is ready production configuration.
4. `npm run build:autodanini-hostinger` and `npm start`; first verify all public pages, graphics, forms, 2 languages and robots noindex.
5. Then separately run actual MySQL+Brevo OTP smoke tests (two distinct test buyer accounts; check replay, cookie, expiry, CSRF, data isolation). Enable server + Vite flags only with owner review. No live admins and no payments yet.

## Blocking future requirements
- Verification on real Hostinger MySQL/production-compatible HTTPS and Brevo deliverability; DB cleanup job and retention/deletion GDPR workflow.
- Email ownership, account takeover prevention monitoring, shared IP/rate-limit abuse, cross-site cookie handling in real browsers.
- Owner admin roles + MFA and Support Center integrated, not shared secret.
- Customer submission + notifications; Stripe linked connector 'Buymeacoffee' test mode only.
- Full business legal pages, photo rights, mobile screenshot parity, SEO. Stage noindex removed ONLY at go-live root cutover after complete security approval.
- Automatic offsite backups, test restoration and uptime monitoring.
- No Live/DNS change executed by this branch.

## Next development checkpoint
Real SQL/Brevo staging smoke tests; role-safe admin owner login and 2FA, verified explicit case submissions; AI adviser guarded against unbounded spend; deployment acceptance checklist; DNS cutover only after GO.
