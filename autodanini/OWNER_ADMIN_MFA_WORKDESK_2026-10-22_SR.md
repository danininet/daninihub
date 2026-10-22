# AutoDanini — bezbedni administratorski panel za Hostinger Business
**Datum:** 22.10.2026 · **Grana:** `feat/autodanini-admin-desk-20261021` · **Produkcija NIJE menjana.**

## Iskorišćen postojeći v12 dizajn
Postojeća stranica `autodanini/staging-v12/admin.html` i UI `src/admin.ts` nisu redizajnirani. Postojeća navigacija, dvojezične oznake i pregled zahteva ostaju isti. Hostinger klijent `src/hostinger-client.ts` je povezan sa novim server-side endpointima.

## Šta je dodato u kod
- `core/autodanini-admin-security.js`: privatna e-mail adresa vlasnika mora biti eksplicitno konfigurisana i prethodno potvrđena preko Brevo e-mail OTP; `kontakt@daninihub.com` i `info@daninihub.com` ne prihvataju se kao vlasnički admin identitet. Dodatni Authenticator TOTP kod od 6 cifara, verifikacija TOTP secret-a na serveru, zaštita od replay-a, 20-minutni `__Host-` HttpOnly Secure SameSite=Strict administrativni cookie.
- `core/autodanini-owner-desk.js`: odvojena MySQL šema za MFA kontrolu pokušaja, vlasničke sesije, primljene zahteve i minimalni audit log. Ključni statusi: NEW, reviewing, waiting_on_buyer, quote_draft, closed. Ograničeno listanje 30 zahteva po strani. Promene statusa/ponude u jednoj transakciji sa audit zapisom; predlog ponude nije račun i ne naplaćuje se automatski.
- Kupac zasebno čuva nacrt, bez automatske predaje. `POST /api/case-submissions` zahteva eksplicitni `submitConsent=true` i server-side potvrdu vlasništva; jedno stabilno HMAC id po kupcu/predmetu sprečava duple prijave. `GET /api/my-submission/:caseId` pokazuje status SAMO vlasniku. Snimak prosleđenog predmeta ostaje u MySQL čak i ako kupac kasnije obriše privatni nacrt.
- Administrator nije u mogućnosti da vidi privatne nacrte; vidi samo podatke koje je kupac svesno poslao u obradu. Kupac ne može uređivati tuđi predmet; server odbija admin promene iz stranog Origin-a ili bez admin MFA sesije.
- Nije uvedeno novo automatsko slanje e-mailova, stvarna aukcija niti obrada uplata.

## Svi prekidači su OFF dok se ne završi stvarni staging
*Server-side, privatni Hostinger environment — NE unositi tajne vrednosti u GitHub, chat ili javni dizajn*:
- `NODE_ENV=production`
- `AUTODANINI_PREVIEW_ENABLED=true` (samo na zasebnom staging domenu)
- `AUTODANINI_AUTH_ENABLED=true` tek posle probne MySQL i Brevo verifikacije
- `AUTODANINI_ADMIN_ENABLED=true` tek posle obezbeđenog drugog faktora
- `AUTODANINI_SUBMISSIONS_ENABLED=true` tek posle testiranja oba prethodna modula, obaveštenja i GDPR procedura
- `AUTODANINI_OWNER_EMAIL`: **postojeći privatni e-mail nalog vlasnika**, npr. lični koji korisnik već kontroliše; NE navoditi niti izmišljati adresu, NE koristiti javni `kontakt@` kao admin identitet.
- `AUTODANINI_OWNER_TOTP_SECRET`: 32+ znakova velike Base32 tajne, odabrane bezbednim generatorom, provisioniranim preko privatnog kanala u mobilnu TOTP aplikaciju. NIKADA ne stavljati u repozitorijum, privatne poruke ili screenshot.
- `DANINI_AUTH_HMAC_SECRET`: postojeći 32+ znakova privatni tajni ključ
- `DANINI_PUBLIC_URL`: celovita HTTPS adresa izolovanog staging domena
- `DB_*`: već postojeći *verifikovani* Hostinger MySQL podaci, uz rezervnu kopiju i proveru vraćanja.
- `BREVO_API_KEY` i postojeći `kontakt@daninihub.com` ostaju, bez novih adresa.
- `DANINI_IMPORTOS_CHECKOUT_ENABLED=false` i `DANINI_IMPORTOS_SERVICE_PAYMENTS_ENABLED=false`.

*Frontend Vite build flagovi (samo probna verzija)*:
- `VITE_AUTODANINI_AUTH_ENABLED=true`
- `VITE_AUTODANINI_ADMIN_ENABLED=true`
- `VITE_AUTODANINI_SUBMISSIONS_ENABLED=true` tek po zasebnoj proveri korisničke saglasnosti i radnog toka.
- Admin dugme ostaje onemogućeno kada ne postoje svi potrebni uslovi.
- `VITE_AUTODANINI_AI_ENABLED` nije vezan za otključavanje administratora; AI kontrolisani troškovi ostaju odvojeni.

## Dnevni rad vlasnika kada QA bude odobren
1. Otvori AutoDanini admin stranicu na zaštićenom Hostinger staging domenu.
2. Prijava privatnom e-mail adresom i jednokratnim kodom preko Brevo.
3. Drugi Authenticator kod od 6 cifara.
4. Otvori listu zahteva koji su **izričito poslati timu**, pregledaj automobil i kontakt kupca, status, predlog cene i internu napomenu.
5. Sačuvaj izmene — backend snima audit; nema naplate ni automatskog računa.
6. Odjava briše admin MFA cookie i osnovnu sesiju.

## Pre javnog otvaranja — stvarni kriterijumi
- Stvarni Hostinger MySQL: migracija šeme i ograničene privilegije, create/list/update/consent/replay/rollback, backup+restore test, GDPR retention i brisanje.
- Stvarni Brevo: prva faktorska prijava i isporuka pošte na privatni owner e-mail; MFA TOTP test sa fizičkom mobilnom aplikacijom.
- Test dva odvojena korisnika u browserima, pokušaj pristupa tuđem zahtevu, duplo slanje, odbijanje stare ponude i brisanje privatnog nacrta nakon predaje.
- Rate limit 12 IP/sat na MFA i server-side 5 loših TOTP u satu za vlasnički nalog.
- Proverena Hostinger proxy podešavanja i HTTPS sesija; XSS, CSRF i e-mail data minimization pregled.
- Nema javne aktivacije, nema promena DNS, Čalije, kontakt@daninihub.com, Brevo-a, Stripe-a ili naplate dok se uslovi ne ispune.

## Testovi
`tests/test-autodanini-admin-security.cjs` — TOTP RFC vektor, vlasnički identitet, host-only cookie.  
`tests/test-autodanini-owner-desk.cjs` — pravi HTTP route testovi sa simuliranom MySQL bazom za MFA, zabranu drugog korisnika, eksplicitnu predaju, idempotenciju, audit, optimistic locking, odjavu.  
`.github/workflows/autodanini-hostinger-startup-tests.yml` izvršava oba testa, backend sintaksu, standardne testove i osnovni build.
**CI green status treba posebno potvrditi; sam commit nije dokaz da je sve uspešno.**
