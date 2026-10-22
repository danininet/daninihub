# AutoDanini — izmenjen Hostinger build (22.10.2026)

## Prijavljena Hostinger greška
- Web App: `auto.daninihub.com`
- Trenutni Hostinger izvor, pre sledećeg redeploy-a: `danininet/daninihub` na `main`, commit `eee98ea9`
- Hostinger build poziva `npm run build`, u kojem su na `main` legacy Express HTTP testovi `test:site`, `test:funnel`, itd.
- U Hostinger dijagnostici pojavio se `ECONNREFUSED 127.0.0.1:17153` tokom `test:site`.
- Proverom izvora utvrđeno je da `scripts/test-site-experience.js` **pokreće sopstveni lokalni Express server** (`app.listen(0)`), ali nije čekao događaj `listening`. Dijagnoza „nema nikakvog servera u testu“ zato nije doslovno tačna. Test ne treba tiho preskakati ako veza ne uspe.

## Stvarna ispravka na AutoDanini razvojnoj grani
**Grana:** `feat/autodanini-admin-desk-20261021`  
**Testiran commit:** `08a880258f4aa401f0d7795f966b5a68301d4c1b`

`package.json` sada jasno razdvaja:
- `npm run build` = `npm run check:syntax && npm run build:autodanini-hostinger` (bez HTTP poziva)
- `npm run test:regression` = raniji testovi ImportOS + sajt + funnel + kupovina + cases
- `npm run build:legacy` = kontrola sintakse + sva regresiona testiranja + stari `build:front`
- `npm start` = `node server.js`

`scripts/test-site-experience.js` čeka `listening` event pre prvog GET-a. Svi testovi su sačuvani.

`.github/workflows/autodanini-hostinger-startup-tests.yml` izvodi prvo `npm run build:legacy` a zatim i stvarni Hostinger default `npm run build` i proverava `autodanini/staging-v12/dist/index.html` i `admin.html`.

## GitHub Actions potvrda
Za commit `08a880258f4aa401f0d7795f966b5a68301d4c1b` **5/5 uspešno**:
- AutoDanini preflight — SUCCESS
- v12 staging audit — SUCCESS
- ImportOS Core — SUCCESS
- Hostinger visual-parity build — SUCCESS
- Hostinger startup regression tests — SUCCESS. U poslednjem workflow-u eksplicitno su zeleni koraci `Run original site and ImportOS test suite separately from build`, `Verify Hostinger's default npm run build builds AutoDanini without network tests`, `Verify all 23 pages in default Hostinger build`.

CI nije stvarni Hostinger runtime. Build greška rešena na razvojnoj grani; **nema dokaza da Hostinger već koristi tu granu**.

## Šta vlasnik treba da uradi u hPanel-u
1. `Websites → auto.daninihub.com → Einsätze → Einstellungen und erneut bereitstellen` (ili `Dashboard → GitHub / Change repository` ako selektor grane nije dostupan).
2. Ostaviti repozitorijum `danininet/daninihub`, promeniti `Zweig: main` u `feat/autodanini-admin-desk-20261021`.
3. Node.js 22, root `.`; **Build command** `npm run build` (sada ispravno izgrađuje AutoDanini bez HTTP testova); **Start command** `npm start` (ili `node server.js`).
4. Samo na **auto.daninihub.com**, `Umgebungsvariablen`: `NODE_ENV=production`, `AUTODANINI_PREVIEW_ENABLED=true`, `DANINI_PUBLIC_URL=https://auto.daninihub.com`, privatni `DB_HOST`, `DB_USER`, `DB_NAME`, `DB_PASSWORD` iz zasebne testne MySQL baze. `AUTODANINI_AUTH_ENABLED=false`, `AUTODANINI_ADMIN_ENABLED=false`, `AUTODANINI_SUBMISSIONS_ENABLED=false`, `AUTODANINI_AI_ENABLED=false`, `DANINI_IMPORTOS_CHECKOUT_ENABLED=false`, `DANINI_IMPORTOS_SERVICE_PAYMENTS_ENABLED=false` i odgovarajući `VITE_AUTODANINI_*_ENABLED=false`. Ne slati vrednosti tajni u chat.
5. Deploy, pogledati nov build status i `Laufzeitprotokolle`. Ako build uspe a runtime ne radi, ne isključivati bezbednosne guard-ove: proveriti MySQL i `/health`.
6. Nikako ne brisati `daninihub.com`, `calije.daninihub.com`, `kontakt@daninihub.com`, `kontakt@calije.daninihub.com`, ni postojeći Brevo i DNS. Ne praviti novi hosting.
7. Kad stranica proradi, pokrenuti pripremljenu **read-only staging smoke** proveru za `https://auto.daninihub.com`: `npm run check:autodanini-hostinger-staging -- https://auto.daninihub.com`.

**Ako Hostinger pri narednom pokušaju i dalje prikazuje granu `main` ili commit `eee98ea9`, promena izvora nije primenjena; novo ponavljanje istog builda neće postaviti AutoDanini.**
