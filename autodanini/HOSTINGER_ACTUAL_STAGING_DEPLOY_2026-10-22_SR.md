# AutoDanini — Hostinger Business probno pokretanje, BEZ promene glavnog domena
**Izdanje:** 22.10.2026 · `danininet/daninihub`, grana `feat/autodanini-admin-desk-20261021` · **Status: pripremljena uputstva, NE objavljeno.**

## Važna odluka
`daninihub.com` i `calije.daninihub.com` su AKTIVNI i NE SMEJU se uklanjati, menjati niti prevezivati na test. Čuvaju se postojeći sandučić `kontakt@daninihub.com`, `kontakt@calije.daninihub.com` i Brevo; ništa ne kupovati.

Prema zvaničnoj dokumentaciji Hostinger Business Web Hosting podržava Node.js/Express Web Apps, Github import i privremenu Hostinger adresu, do 5 Node.js aplikacija u okviru paketa. Korisnik mora potvrditi da je na njegovom nalogu slobodno mesto; ne zahtevati nadogradnju ako nije dostupno.
- https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/
- https://www.hostinger.com/support/how-to-add-environment-variables-during-node-js-application-deployment/

## Koraci kroz hPanel (samo vlasnik u svom nalogu)
1. Hostinger → **Websites → Create Website → Web App** (Node.js). Odabrati **temporary domain** umesto bilo kog aktivnog korisnikovog domena; ako sistem ne nudi privremeni domen ili traži uklanjanje postojećeg sajta, STOP.
2. **GitHub Integration → Import Git Repository**, izabrati postojeći `danininet/daninihub`, granu **`feat/autodanini-admin-desk-20261021`** (ne `main`). Ne menjati ranije povezane produkcione aplikacije/repozitorijume.
3. Framework: **Express / Other Node.js**. **Project root**: repozitorijumski koren (`.`). **Build command**: `npm run build:autodanini-hostinger`. **Entry file**: `server.js`. Node.js **22.x**. Očekivani statički rezultat builda: `autodanini/staging-v12/dist`, koji Express služi kroz `core/hostinger-autodanini-preview.js`. Standardni `npm run build` je STARI DaniniHub build i ne sme se izabrati za ovaj staging.
4. Napraviti zasebnu **testnu MySQL/MariaDB bazu i korisnika** u postojećem paketu; **NE upisivati produkcioni DB_HOST/DB_NAME**, jer backend pravi nove tabele. Backup produkcije pre bilo kakvog prebacivanja. Hostinger port obično 3306, ali pratiti konkretne podatke iz hPanela, ne nagađati.
5. U **Environment variables** uneti samo nazive i odgovarajuće vrednosti u privatni hPanel. Nikada ih ne šalji u chat/GitHub:
   `NODE_ENV=production`
   `AUTODANINI_PREVIEW_ENABLED=true`
   `DANINI_PUBLIC_URL=https://<tačan privremeni Hostinger domen>`
   `DB_HOST=<iz Hostinger baze>`
   `DB_PORT=3306` (samo ako je to stvarni DB port u hPanelu)
   `DB_USER=<test DB user>`
   `DB_PASSWORD=<test DB password>`
   `DB_NAME=<test DB name>`
   `DANINI_IMPORTOS_CHECKOUT_ENABLED=false`
   `DANINI_IMPORTOS_SERVICE_PAYMENTS_ENABLED=false`
   `AUTODANINI_AUTH_ENABLED=false`
   `AUTODANINI_ADMIN_ENABLED=false`
   `AUTODANINI_SUBMISSIONS_ENABLED=false`
   `AUTODANINI_AI_ENABLED=false`
   `VITE_AUTODANINI_AUTH_ENABLED=false`
   `VITE_AUTODANINI_ADMIN_ENABLED=false`
   `VITE_AUTODANINI_SUBMISSIONS_ENABLED=false`
   `VITE_AUTODANINI_AI_ENABLED=false`
   **Javni/senzitivni podaci:** Ne unositi OpenAI API ključ u prvom probnom pokretanju; Brevo se ne testira dok nalozi nisu dodatno odobreni. Nije potrebno kreirati novi mailbox.
6. Hostinger **Deploy** SAMO na privremenu aplikaciju. Proveriti prikaz svih 23 stranice, lokalne originalne fotografije, SR/DE, WhatsApp. U GitHub razvojnoj grani postoje smoke komanda i ručni workflow (kada GitHub prepozna workflow): `npm run check:autodanini-hostinger-staging -- https://<privremeni-host>`.
7. Ručno u pregledaču otvoriti: `https://<privremeni-host>/health`; očekivano `ok:true`, `durableStore:true`, `checkoutEnabled:false`. `/admin.html` samo izgled i zatvorena prijava; bez korisničkih podataka. `/robots.txt`: `Disallow: /`. Nema stvarnog slanja pošte, AI tokena ili naplate.
8. Proveriti **Deployments → Build logs / Runtime logs** (u Hostinger). Ako se pojavi `PRODUCTION_DATABASE_UNAVAILABLE`, `PRODUCTION_LOCAL_STORAGE_FORBIDDEN` ili `AUTODANINI_PREVIEW_MUST_NOT_USE_LIVE_DOMAIN`, NE isključivati zaštitu; proveriti DB i privremenu adresu.

## Bezbednosna zaštita u kodu
- Backend se **ne pokreće** u produkciji bez ispravne DB konfiguracije i stvarne MySQL veze. MySQL otkaz **više ne prelazi na lokalni JSON** u produkciji.
- U preview modu odbijaju se `DANINI_PUBLIC_URL=https://daninihub.com`, `www.daninihub.com` i `calije.daninihub.com` kao dodatna zaštita. Ovo proverava KONFIGURISANI URL, ne zamena za proveru domena koji vlasnik bira u hPanelu.
- Admin, korisnički nalozi, predaja zahteva i AI ostaju isključeni, dok stvarna SQL/Brevo/2FA testiranja ne prođu. Bez zapisa novih kupaca tokom početnog smoke testa.

## Nakon prvog zelenog smoke testa
1. Sačuvati stvarni URL probne aplikacije i Hostinger build log status (bez tajni).
2. Proveriti bazu, backup/restore i prava korisnika.
3. Tek tada zasebno uključiti `AUTODANINI_AUTH_ENABLED` u privatnom env i odgovarajući frontend build flag, potvrditi Brevo OTP (postojeći sender).
4. Odrediti postojeću privatnu vlasničku adresu i podesiti TOTP samo na serveru, bez deljenja tajne; testirati audit log, logout, tuđe pristupe u dva pregledača.
5. Stripe, PayPal, prava administracija na javnom domenu, aukcije i AI naplata ostaju OFF do zasebnog GO.

## Status
Dokument daje realna hPanel polja i granu; **ne dokazuje da Hostinger aplikacija postoji**. Povezani Hostinger Mail konektor ne može da kreira Node.js aplikaciju. Ako Hostinger nema `Create Website → Web App`, tražiti samo potvrdu plan/slot stanja, ne kupovati alternativni VPS niti menjati domen.

## Dopuna poslednje zaštite
- Od commit-a `95a3e49eb2539008ae1412b865ee282164be3eab` svaki nasleđeni javni `/api/importos/*` poziv u izolovanoj AutoDanini preview aplikaciji vraća `503 LEGACY_API_NOT_ACTIVE_IN_PREVIEW`. Time probna aplikacija ne prima stare service request zapise, ne pokušava stare checkout i webhook tokove i ne šalje nasleđene notifikacije. U postojećoj DaniniHub javnoj produkciji ponašanje API-ja ostaje nepromenjeno.
- Test `scripts/check-autodanini-hostinger-staging.cjs` sada proverava i taj 503 odgovor.
- Staging je spreman za test samo kad GitHub CI postane zelen na trenutnom commitu; sama dokumentacija i Vite build ne potvrđuju Hostinger release.
