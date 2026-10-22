# AutoDanini — objedinjena tehnička, bezbednosna i poslovna provera
**Datum:** 22.10.2026  
**Radna grana:** `feat/autodanini-admin-desk-20261021` / PR #59  
**Referentni izvor dizajna:** AutoDanini AppDeploy v12, `1792610683309`  
**Poslednji potvrđen testirani kod:** `fec544d8c104108e3635ad5a184b2f0fecf3998b`

## Zaključak: GO za pregled lokalnog staging paketa; NO-GO za zamenu daninihub.com
Nijedan produkcioni DNS, Hostinger hPanel, javni sajt, aktivni e-mail sandučić, korisnički podaci ili Stripe podešavanje nisu menjani u ovoj seriji provera. Ne kupovati hosting ili dodatni e-mail.

## 1. Potvrđeno u stvarnim servisima
- AppDeploy `auto-danini-import-b2b-p8swk5`: deployment READY v12, ali u QA logu **tri neuspešna učitavanja slika**, uključujući `danini-auto-uvoz.webp`, `danini-pregled-auta.webp` i jednu Unsplash fotografiju. AppDeploy produkcija i dalje koristi staru verziju, nije popravljena direktno.
- AppDeploy `daninihub-calije-zakup-placeva-n1v9xy`: READY, ranije validaciono upozorenje o CSS @import.
- Hostinger Mail konektor vidi `kontakt@calije.daninihub.com`, ne prikazuje celo Hostinger hPanel okruženje ili sve adrese. Korisnik potvrđuje da **`kontakt@daninihub.com` postoji** i da je **Brevo radio**; ne tražiti ponovno kreiranje ili kupovinu.
- Javni `daninihub.com` i `calije.daninihub.com` nisu zamenjeni ovim razvojnim poslom. Web pretraga je vraćala keširani sadržaj, a ne pouzdanu real-time potvrdu pravog Hostinger aplikacionog stanja.

## 2. Šta je stvarno popravljeno u razvojnoj grani
- Ispravan `daninihub.com` poslovni domen za Brevo slanje i odgovor; podržani postojeći `BREVO_SENDER_EMAIL`, `DANINIHUB_SENDER_EMAIL`, `MAIL_FROM`, `EMAIL_FROM`. Ne koristiti Calije adresu kao AutoDanini pošiljaoca. Nisu menjani MX/SPF/DKIM/DMARC.
- Hostinger Vite build sada **pakuje postojeće dve poslovne slike** iz glavnog GitHub `public/` u `dist/`, zamenjuje nestabilne raw.githubusercontent.com linkove lokalnim, a dekorativnu nepostojeću GitHub branch sliku lokalnim izvorom. Kod browser adaptera rezervno prikazuje lokalnu sliku kad Unsplash učitavanje otkaže. Nije menjan raspored stranica, boje, kontakti ili tekstovi.
- Potvrđen ZIP sa 23 HTML stranice; 23/23 imaju naslov i `noindex` za staging; dva lokalna .webp fajla 187696 i 193208 bajtova; ZIP nema neispravne unose; nema fragilnih raw GitHub URL-ova na tih 23 stranice; CSS više ne pominje nedostupnu fotografsku grid datoteku. Preostali Unsplash linkovi zavise od spoljnog servisa i imaju fallback, ali nisu svi zamenjeni pravnim/originalnim poslovnim fotografijama.
- Dodat `core/autodanini-public-throttle.js`: memorijski ograničava masovne javne zahteve za upite, događaje, checkout, login i AI; prolaze automatski testovi. Nije višeserverski/durable globalni limit: dodati WAF/CDN ili DB globalni limit pre velikog prometa.
- Express više ne veruje proizvoljnom proxy zaglavlju samo zato što je `trust proxy=1`; za Hostinger neophodno je podesiti *proverene* proxy CIDR adrese, inače svi posetioci iza istog reverznog proxy-ja mogu deliti IP kvotu. Zaštita testirana na sintetičkim adresama, ne na stvarnom Hostinger edge-u.
- Hostinger preview sada ODBIJA javno pokretanje ako `AUTODANINI_PREVIEW_ENABLED=true` bez `NODE_ENV=production`.
- Trajna MySQL baza i javna HTTPS adresa su obavezne za produkciono pokretanje; servis odbija startup ako baza radi u lokalnom file režimu. Legacy admin API i /owner su zatvoreni za produkciju; stvarna naplata je zabranjena u trenutnoj release konfiguraciji.
- Privatni kupci: HMAC OTP, HttpOnly Secure SameSite cookie, kontrola vlasništva nad SQL dosijeima i testovi sprečavaju drugog korisnika da čita/briše tuđe podatke u simuliranom HTTP+SQL okruženju. Backend i frontend nalog su feature-gated i isključeni pre verifikacije na stvarnoj bazi i preko Brevo-a.

## 3. CI dokazi
Commit `fec544d8c104108e3635ad5a184b2f0fecf3998b`: **5/5 GitHub Actions workflows SUCCESS**:
1. AutoDanini preflight (no deployment)
2. AutoDanini v12 staging audit (no deploy)
3. DANINI ImportOS Core
4. AutoDanini Hostinger startup regression tests (MySQL/HTTPS release guard, mail policy, OTP/session and ownership tests, public throttling)
5. AutoDanini Hostinger visual-parity build (staging only)

**Tumačenje:** uspešan statički/CI build i simulirani testovi nisu dokaz stvarne Brevo dostave, stvarne Hostinger MySQL šeme/privilegija, rezervne kopije, sigurnog admin panela ili funkcionalnosti na javnom domenu. Poseban stroži security GO/NO-GO ostaje **NO-GO**.

## 4. Nedovršeno / kritični uslovi za javno pokretanje
- Hostinger hPanel Node.js staging okruženje nije dostupno preko trenutnog povezanog Hostinger Mail konektora; **nijedna nova aplikacija još nije razmeštena na Hostinger**. Prvo sačuvati backup i testirati vraćanje.
- Realni MySQL i Brevo test (pošiljalac je korisnikov postojeći kontakt), test dva kupca i OTP kodova, provera sesija iza realnog HTTPS proxy-ja, povratnih poruka/spama i izbrisanih podataka. Tajni ključevi samo u Hostinger environment-u, nikada chat/GitHub.
- Potpuno individualno prijavljivanje administratora uz MFA, role & audit log; stari `x-danini-admin` mehanizam se ne sme javno otvoriti.
- Administratorski Support Center, saglasnost i predaja predmeta, pravila zadržavanja i GDPR brisanja.
- AI savetnik /api/advice još nema završenu bezbednu Hostinger backend integraciju sa globalnom dnevnom kvotom u bazi; ne uključivati AI/tokene bez plafona troškova.
- Stripe connector koji je proveravan ranije bio je testni "Buymeacoffee"; nikakav novac se ne sme naplaćivati bez pravno odgovarajućeg verifikovanog merchant naloga, webhook/idempotency i zasebnog GO.
- Pun pregled fotografija/licenci, finalna mobilna QA, pravne stranice, robots/indexing i SEO 301 preslikavanje starih URL-ova; ne skidati `noindex` dok nije stvarni produkcioni AutoDanini.
- Proveriti instalirani Hostinger proxy CIDR konfiguraciju da limiter ne grupiše sve korisnike u jedan IP.
- Ne dirati `calije.daninihub.com`, njegov e-mail i DNS.

## 5. Sledeći konkretni operativni potezi
1. Ostaviti trenutni `daninihub.com` nepromenjen; proveriti vlasnički backup/kopiju SQL i DNS, ne menjati MX/alias.
2. U postojećem Hostinger Business hPanel kreirati **privremenu zasebnu Node.js staging aplikaciju** sa HTTPS, bez dodatne pretplate, kad postojeći paket i domenski uslovi dozvoljavaju; pre produkcije validirati SSH/GitHub deploy dostupnost.
3. Konfiguracija u privatnom Hostinger environment: `NODE_ENV=production`, `DANINI_PUBLIC_URL=https://<staging-domain>`, Hostinger MySQL vars, `BREVO_API_KEY` i postojeći potvrđeni sender, `AUTODANINI_PREVIEW_ENABLED=true`, `AUTODANINI_AUTH_ENABLED=false`, `DANINI_IMPORTOS_CHECKOUT_ENABLED=false`, `DANINI_IMPORTOS_SERVICE_PAYMENTS_ENABLED=false`. NIKADA ne štampati tajne vrednosti.
4. Podesiti trust-proxy samo za potvrđene Hostinger proxy IP/CIDR adrese. Proveriti /health, sve stranice, slike, srpski/nemački i WhatsApp. Staging mora ostati noindex.
5. Uključiti i E2E-testirati kupce/AI/admin samo uz odvojeno odobrenu QA listu; backup-restore, Stripe off. Tek nakon potpunog GO preći na root `daninihub.com`.

## Kontakt i domeni
AutoDanini: postojeći `kontakt@daninihub.com` i WhatsApp +49 1573 0916621. Brevo integracija postojeća.  
Čalije: `kontakt@calije.daninihub.com` i `calije.daninihub.com` ostaju odvojeni.
