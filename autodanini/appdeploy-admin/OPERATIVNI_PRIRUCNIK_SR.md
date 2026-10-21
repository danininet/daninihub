# AUTO DANINI — OPERATIVNI PRIRUČNIK ZA VLASNIKA
**Datum:** 21.10.2026 • **Status:** dokument pripremljen, nadzor još nije automatski aktiviran.

Ovaj priručnik je pisan za vlasnika koji **nije programer**. Nije zamena za ugovorenu tehničku podršku ili pravnu proveru.

## Kontrolna tabla projekta

- **AutoDanini — postojeći sajt:** https://auto-danini-import-b2b-p8swk5.v2.appdeploy.ai/
- **Korisnički prostor:** https://auto-danini-import-b2b-p8swk5.v2.appdeploy.ai/nalog.html
- **AI savetnik:** https://auto-danini-import-b2b-p8swk5.v2.appdeploy.ai/ai-advisor.html
- **DaniniHub, Čalije pregled:** https://daninihub-calije-zakup-placeva-n1v9xy.v2.appdeploy.ai/
- **AppDeploy kontrola:** https://dashboard.appdeploy.ai
- **Kod Administratorskog panela (NIJE OBJAVLJEN):** https://github.com/danininet/daninihub/pull/59
- **Domen autodanini.com:** nije registrovan, nema aktivnih poštanskih adresa `dragan@autodanini.com` i `kontakt@autodanini.com`.
- **AI pilot kvota:** server ima zajedničko ograničenje 20 poziva dnevno i 400 mesečno; **nema potvrđene dolarske blokade po korisniku ili provajderu**.

## Ako nešto prestane da radi: tri koraka bez programiranja

1. **Zabeleži stranicu i problem.** Otvori stranicu, napravi snimak ekrana i zapiši kada je problem nastao, šta si pritisnuo i kakva se poruka pojavila. Nemoj slati lozinke, kodove za prijavu, kartice, pasoše, VIN ili tuđe lične podatke u običan chat.
2. **Proveri da li je problem samo kod tebe.** Osveži stranicu, probaj drugi pregledač ili mobilnu mrežu; ako je problem sa prijavom, proveri da li je prozor za prijavu blokiran. **Ne briši korisničke podatke i ne kupuj novi hosting zbog prve greške.**
3. **Pošalji zahtev za tehničku proveru:** „AutoDanini — problem“, link, screenshot, vreme, kratak opis, da li i drugi korisnici imaju isto. Kada su konektori dostupni, ChatGPT može pregledati AppDeploy status/logove/verzije i GitHub kod, pripremiti ispravku i zatražiti odobrenje za rizičan oporavak. To nije 24/7 dežurna podrška niti garantovan automatski popravak.

### Prioriteti

| Problem | Prioritet | Šta prvo raditi |
|---|---|---|
| Neko vidi tuđe podatke, sumnja na upad ili neovlašćeni admin pristup | **KRITIČNO** | Prekinuti problematičnu funkciju/kredencijale preko administracije pružaoca, sačuvati dokaze/logove, ne objavljivati nove lične podatke, stručna bezbednosna/GDPR procena. |
| Sajt potpuno nedostupan ili prijava svih korisnika ne radi | **VISOK** | Proveriti provajdera/status i poslednju objavu. Ako je nova verzija uzrok i povratak je bezbedan, odabrati prethodnu ispravnu verziju. |
| AI blokiran ili prevelika potrošnja | **VISOK** | Zaustaviti AI pristup preko provider postavki/limita; proveriti kvote i zloupotrebe. Ne uklanjati ograničenja da bi „proradilo“. |
| Jedan korisnik ne može da sačuva zahtev | SREDNJI | Proveriti prijavu, istekao token, podatke formulara, kontrolu pristupa i logove. |
| Slika, prevod ili dizajn nisu ispravni | NIZAK | Zabeležiti URL/snimak, popraviti u razvojnoj verziji i objaviti posle testiranja. |

## Povratak na prethodnu verziju (rollback)

**Potvrđeno:** AppDeploy za AutoDanini čuva v1–v12; na dan 21.10.2026 aktivna je **v12 (ID `1792610683309`)**, prethodna je **v11 (`1792609435578`)**. Postoji poseban alat za listu verzija i primenu izabrane verzije.

Postupak:
1. Napraviti belešku o poslednjoj verziji, vremenu i simptomu.
2. Pre vraćanja proveriti da problem stvarno potiče od koda, a ne od interneta, domena, identiteta ili spoljne usluge.
3. Proveriti da povratak stare verzije **neće izgubiti nove podatke ili pokvariti nove zapise**; rollback aplikacije nije isto što i vraćanje baze.
4. Tek uz izričitu saglasnost vlasnika primeniti poznatu ispravnu verziju preko AppDeploy version-management alata.
5. Proveriti početnu stranicu, korisničku prijavu, čuvanje zahteva, ograničenje AI i pravne stranice. Zabeležiti koja verzija je vraćena.

Ne pokretati rollback automatski pri prvom neuspelom zahtevu; uzrok može biti kratkotrajan kvar mreže ili pogrešan URL.

## Čuvanje podataka

**Trenutni rizik: nezavisni backup baze i vežba vraćanja NISU potvrđeni.**

Pre stvarnih kupaca i plaćanja mora postojati:
- Dnevni backup važnih korisničkih i operativnih podataka u odvojeno, ograničeno skladište.
- Politika šifrovanja, pristupa, rokova zadržavanja i brisanja.
- Izvoz/uvoz podataka, bar jedan test restauracije u izolovanom okruženju, i pisani plan oporavka.
- Ne koristiti običan GitHub repozitorijum za kopije podataka o klijentima.
- Sačuvati verziju koda, konfiguracione podatke BEZ tajni, hosting i DNS istoriju promena.

## Prijava vlasnika i e-mail

- Predloženi budući administrator: `dragan@autodanini.com`. **Još ne postoji dok domen i poštanska usluga ne budu kupljeni/podešeni.**
- Admin server ima podrazumevano `ADMIN_EMAILS=[]` i ostaje nedostupan do potvrde konkretnog stvarno korišćenog naloga.
- Privatni vlasnički nalog: jaka jedinstvena lozinka kod identitetskog provajdera, **2FA/passkey kada provajder podržava**, recovery kodovi offline; nema deljenja naloga.
- `kontakt@autodanini.com` koristiti javno, ali **nikad** kao administratorsku listu.
- Registrator i hosting: odvojena snažna prijava i dodatna zaštita, zaključavanje domena, kontrola DNS promena.

## Bezbednosni kriterijumi pre komercijalnog puštanja

**ZABRANITI javne aukcije i novčane transakcije dok nije ispunjeno:**
- Proverena administracija i pristup tuđim podacima 403; testiranjе običnog korisnika, sign-out i pristup posle isteka tokena.
- Proverena zaštita od botova i zloupotrebe registracije i AI-ja.
- Merenje *stvarnog* troška AI (ne samo broja poziva) sa hard cap / upozorenjima i ručnim emergency-off.
- Verifikovan backup+restore, monitoring dostupnosti i grešaka; test povratka na prethodnu verziju.
- Produženi pravni podaci `Impressum`, `Datenschutz`, `AGB`, operator, poreski status, kontakt, saglasnosti.
- Registracija pružaoca plaćanja; bez čuvanja kartičnih podataka. Evidencija refundacija/chargeback-a. Nema aukcijske licitacije bez fiksnih pravila i nezavisnog audita.
- Produkcioni SEO i domen tek posle provere kanonskih adresa i da li je `noindex` namerno uklonjen.

## Kako prijavljuješ problem ChatGPT-u

**Kopiraj ovaj tekst i dopuni:**

> „PROBLEM AUTODANINI / DANINIHUB. URL: … Kada: … Šta sam radio: … Greška na ekranu: … Da li radi drugim korisnicima: … Proveri status aplikacije i poslednje verzije, ne menjaj podatke ni DNS bez mog odobrenja. Predloži i, kada je bezbedno i dozvoljeno, sprovedi ispravku uz proveru.“

Ne moraš da znaš GitHub, React, TypeScript ili SQL da bi ovaj postupak koristio.
