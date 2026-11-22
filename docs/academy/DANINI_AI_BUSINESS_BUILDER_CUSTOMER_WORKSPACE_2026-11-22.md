# DANINI AI Business Builder — osnova za sopstveno online preduzeće svakog korisnika
**Datum:** 22.11.2026. · **Status:** DRAFT PR #267 / feature-gated API i DE/SR UI; bez aktivacije ili produkcione D1 migracije. **Bez naplate.**

## Potvrđen korisnički zahtev
Svaki korisnik može da kreira i razvija **svoj** online poslovni projekat na postojećoj DANINI platformi, na srpskom ili nemačkom, uz kontrolisanu AI pomoć. To nije samo jednokratni upitnik ili PDF. Korisnik mora imati privatni projekat koji nastavlja tokom više sesija.

## Minimalan korisnički tok
1. Sigurno prijavljivanje jednokratnim e-mail kodom (implementirano u kodu, testirano sa simuliranim Brevo-om; nije produkciono aktivirano).
2. Kreiranje projekta: ime i jezik; više projekata po nalogu.
3. Šest faza: `niche → market → offer → online_presence → operations → validation`.
4. AI postavlja najviše tri pitanja po ciklusu; odvaja navode korisnika, spolja potvrđene dokaze i pretpostavke. AI ne izmišlja tržišnu potražnju, kupce ili prihode.
5. Izlaz: poslovni dosije, prodajni opis, kalkulacija, predlog sadržaja početnog sajta i kontrolna lista provere. Svaki rezultat ima status DRAFT/REVIEW/APPROVED.
6. Pregled i dozvoljeno objavljivanje tek uz izričitu radnju korisnika, odgovarajuća prava i proverene uslove. Ne registruje pravno lice, ne podnosi poreske prijave, ne kupuje domen, ne šalje poruke i ne naplaćuje autonomno.

## Već postojeće komponente za ponovno korišćenje
Astro DE/SR Akademija, Cloudflare Worker `autodanini`, D1 baza, R2 privatno skladište, Workers AI uz prethodnu kontrolu poziva, postojeća poslovna metodologija i testovi. Ne graditi novi CMS, novu platformu ili nezavisne naplatne agente.

## Izvršena bezbedna osnova
- Additivna D1 migracija sa odvojenim tabelama `academy_users`, `academy_projects`, `academy_project_steps`; bez menjanja postojećih tabela.
- Server-side CRUD jezgro koje u svakom SELECT/UPDATE/DELETE proverava `owner_user_id`.
- Bilingvalni korisnički jezici `de` / `sr` i šest strogo validiranih koraka.
- Ograničenja dužine ulaznih podataka, odbijanje nedozvoljenih stanja i brisanje pripadajućih koraka pri brisanju projekta.
- Testovi izolacije dva korisnika, šest faza i odbijanja nevalidiranog identiteta.

## Bezbednosno ograničenje
`actor.authenticated` je isključivo **interni argument sloja** i nikada se ne prihvata iz JSON zahteva. Implementirani su OTP izazov, HMAC identifikator, HttpOnly/Secure/SameSite=Strict cookie, opoziv sesije, Origin provera za izmene, ograničenja pokušaja i IDOR testovi dva korisnika. Ruter pod `/api/academy/*` je fail-closed; bez svih potrebnih vezivanja vraća 404. Pre aktivacije još treba proveriti GDPR pravila, zadržavanje i automatsko čišćenje sesija/challenge zapisa, opciju izvoza/brisanja podataka, stvarnu Brevo isporuku i Cloudflare Turnstile u kontrolisanom staging-u, spoljne pen-test scenarije i ograničenja kvota. Cloudflare Access ostaje samo za vlasnički portal. Cloudflare Access trenutno štiti vlasnički portal i nije autentifikacija za javne kupce.

## Granice monetizacije
Postojeći Starter Pack je statičan digitalni proizvod sa internom cenovnom hipotezom, **nije** završena SaaS usluga sa sajt-generatorom i trajnom AI podrškom. Predlog cene za AI Business Builder mora zasebno da se validira, sa troškom AI upita, saobraćaja i podrške. Bez javnih cena, PayPal/Stripe Live, domena ili automatskih kupovina dok vlasnik ne odobri.

## QA uslovi za prvu javnu beta verziju
- Korisnik A se prijavi, otvori svoj projekat, sačuva svih šest koraka i nastavi sa drugog uređaja.
- Korisnik B nikada ne može da vidi, izveze ili promeni projekat A, uključujući direktno pogađanje ID-a.
- Zaboravljen/istekao token ne otvara privatni projekat.
- AI greška/nepostojanje budžeta daje transparentan odgovor bez dodatnog naplativog poziva ili lažnog istraživanja.
- Korisnik može da izveze i obriše svoje podatke; obrisani projekat nije dostupan posle brisanja.
- Nepotvrđena tržišna analiza se ne označava kao dokaz.
- Provera čitljivosti i funkcionalnosti na mobilnom i desktopu DE/SR.
- Ne otvara se kupovina, ne šalje se promotivna poruka, ne objavljuje se sajt bez posebne autorizacije.

## Ne urađeno u ovom PR-u
Postoji kod za registraciju preko OTP, sesije, korisnički API i DE/SR uređivač, ali nisu aktivirani. Nisu urađeni produkciona D1 migracija, stvarna Brevo prijava, AI konekcija za Builder, personalizovani sajt-generator, plaćanje, javna beta niti deploy. To nisu PASS stavke.

## Sigurna integracija, PR #267
- **Samo na branch-u:** `src/index.ts` ima `/api/academy/*` ruter; ostale `/api/*` rute ostaju na postojećim handlerima.
- **Zatvoren po pravilu:** `ACADEMY_AUTH_ENABLED` mora biti eksplicitno `true`, a pre javnog testa moraju postojati odvojeni `ACADEMY_AUTH_SECRET` (najmanje 48 karaktera), postojeći `DANINI_DB`, `SITE_ORIGIN`, `DANINI_TURNSTILE_SITEKEY`, `DANINI_TURNSTILE_SECRET`, `BREVO_API_KEY`, `DANINI_BREVO_SENDER`. Ne unositi tajne u repozitorijum.
- **Nema javne kupovine:** stranice `/de/akademija/builder/` i `/sr/akademija/builder/` su `noindex`, i dok je funkcija isključena prikazuju samo da je pilot nedostupan. Nema menija, CTA i promene javne ponude.
- **Staging redosled:** prvo lokalna/staging D1 migracija, zatim probni prijem koda na odobreni interni e-mail `MAIL_TEST_RECIPIENT` uz Turnstile, višesesijsko čuvanje projekta, A/B izolacija, logout, export/delete, mobilni QA; tek nakon sveukupne bezbednosne i pravne provere predlog za javnu beta aktivaciju.
- **QA:** komanda `npm run test:b2b` proširena je sa `node --test tests/academy/*.test.mjs`; lokalno 9/9 PASS sa simuliranim API servisima. CI i Astro build su zasebni obavezni dokazi.

## Bezbednosno pooštravanje — 22.11.2026. (staging preflight)
- Maksimalno **3 projekta po korisniku** dok nisu potvrđeni troškovi, skladište i planovi. Četvrti pokušaj vraća HTTP 409 `project_limit_reached`; SQL kvota je atomarna.
- Brisanje Academy naloga briše i preostale OTP izazove i e-mail rate-limit zapis, pored korisničkih projekata i sesija.
- Na `*.workers.dev` i drugim staging domenima nova prijava ne može biti uključena bez izričite liste testnih primalaca. `MAIL_TEST_RECIPIENTS` dozvoljava najviše odabrane interne e-mail adrese, odvojene zarezom; podržan je i postojeći `MAIL_TEST_RECIPIENT`. Ni jedan primaoc nije automatski dodat.
- Staging D1 već ima 5 Academy tabela iz prethodne isključivo aditivne migracije. To **nije** dokaz HTTP/OTP prijave. Staging Worker još treba da dobije validiran branch build, zaseban session secret, staging Turnstile domen i testnu Brevo konfiguraciju.
- Lokalne Node/SQLite provere posle izmena: **13/13 PASS**. CI na PR-u ostaje obavezan. Nema produkcionog merge/deploy-a, naplate, AI poziva ili slanja e-mailova u ovom koraku.
