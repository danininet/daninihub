# AutoDanini — administracija: puštanje u rad i rešavanje problema
Datum: 2026-10-23. Status: **STAGING / NIJE AKTIVIRANO U PRODUKCIJI**.

## Šta je stvarno implementirano
- Kupac: prijava mejlom i jednokratnim kodom, privatne skice zahteva, izričita potvrda za slanje zahteva.
- Vlasnik: odvojena TOTP provera nakon prijave, kratka administratorska sesija (20 minuta), pregled pristiglih zahteva, izmena statusa, nacrt cene i evidencija izmene.
- Zahtevi se **ne šalju automatski** kada kupac sačuva skicu. Kupac mora potvrditi slanje. Nacrt cene **nije naplata**.
- Stari /owner i /api/importos/admin ostaju blokirani u produkciji. Checkout i automatska naplata nisu aktivirani.

## Pre uključivanja: obavezne kontrole
1. Na zasebnom Hostinger staging okruženju obezbediti HTTPS, produkcionu MySQL bazu sa ograničenim privilegijama i pravilno podešen DANINI_PUBLIC_URL (samo origin sajta, sa završnim /).
2. Proveriti da BREVO_API_KEY šalje jednokratni kod sa već postojećeg, potvrđenog naloga domena daninihub.com. Ne unositi tajne u GitHub niti u javni Vite env.
3. Generisati jak DANINI_AUTH_HMAC_SECRET (najmanje 32 karaktera) i privatni AUTODANINI_OWNER_TOTP_SECRET. TOTP upisati u autentifikator vlasnika; sačuvati rezervni pristup van sajta. Tajnu ne slati mejlom ni WhatsApp-om.
4. AUTODANINI_OWNER_EMAIL postaviti na **stvarnu privatno potvrđenu adresu vlasnika**, ne na javni kontakt mejl. Proveriti ownerConfigured pravila pre izbora adrese.
5. U staging-u, nakon kontrole koraka 1–4, aktivirati redom AUTODANINI_PREVIEW_ENABLED=true, AUTODANINI_AUTH_ENABLED=true i AUTODANINI_ADMIN_ENABLED=true. AUTODANINI_SUBMISSIONS_ENABLED=true tek nakon E2E testa kupčevog pristanka.
6. Testirati: vlasnik dobija kod, pogrešan TOTP odbijen, kupac ne vidi tuđe zahteve, skica nije u inbox-u, potvrđena prijava jeste, izmena statusa pravi audit zapis, odjava poništava admin pristup.
7. Izvesti backup baze i proveriti vraćanje. Uključiti nadzor 5xx grešaka, logove bez ličnih podataka i plan rotacije tajni. Tek zatim odobriti produkciju i DNS promene zasebno.

## Ako nešto ne radi
| Simptom | Bezbedan postupak |
| --- | --- |
| Kupac ne dobija kod | Proveriti Brevo status, sender domen, API key i spam; ne zaobilaziti OTP |
| ADMIN_MFA_REQUIRED | Ponoviti prijavu i TOTP; ne koristiti stari header-secret admin |
| MFA_LIMIT_REACHED | Sačekati istek zaštitnog prozora; ne gasiti ograničenje pokušaja |
| AUTH_DATABASE_UNAVAILABLE / ADMIN_UNAVAILABLE | Proveriti MySQL i migracije u logovima; ne prebacivati na lokalni fajl |
| ORIGIN_DENIED | Proveriti DANINI_PUBLIC_URL i HTTPS; ne dopustiti sve origin-e |
| SUBMISSION_NOT_ACTIVE | Proveriti testove i tek onda aktivirati prekidač; sačuvane skice ostaju privatne |
| CASE_VERSION_CONFLICT | Osvežiti zahtev, pregledati tuđu izmenu, pa tek onda ponoviti |
| Sumnja na upad | Isključiti AUTODANINI_ADMIN_ENABLED i AUTODANINI_SUBMISSIONS_ENABLED, opozvati/rotirati tajne, sačuvati audit i logove; ne brisati tragove |

## Nova funkcija: odgovor kupcu u privatnom nalogu (23.10.2026)

- Vlasnik u `admin.html` otvara poslati zahtev, piše **poruku kupcu** od 2 do 2000 znakova i zasebno potvrđuje objavu.
- Poruka je sačuvana u tabeli `ad_buyer_replies`, sa ID-em autora i vremenom. Interna administratorska napomena `admin_note` se **nikada** ne prikazuje kupcu.
- Kupac u `nalog.html` vidi poruke samo uz svoj prethodno potvrđeni zahtev, kada otvori ili osveži nalog. Drugi kupac ne može videti tuđe poruke.
- **Ne šalje se automatski e-mail, SMS niti WhatsApp**. Po objavi poruke kupac ne dobija obaveštenje. Za brz kontakt tim mora koristiti postojeće komunikacione kanale, bez deljenja tuđih podataka.
- Sačuvana skica koja je već poslata u obradu ne može se jednostavno obrisati iz naloga, jer bi kupac izgubio pristup odgovoru. Za otkazivanje i zahteve za brisanje podataka treba razviti zaseban proverljiv postupak podrške i obrade prema primenljivim pravilima privatnosti.
- Funkcija je vezana za postojeće staging prekidače `AUTODANINI_SUBMISSIONS_ENABLED` i `VITE_AUTODANINI_SUBMISSIONS_ENABLED`, te vlasničku TOTP prijavu; **sve ostaje isključeno na javnom sajtu**.

### Kriterijumi testa

1. Kupac A se prijavi i sačuva skicu; inbox vlasnika je prazan.
2. Kupac B ne može videti niti predati skicu kupca A.
3. Tek kupac A potvrđuje slanje, vlasnik prolazi prijavu + zasebni TOTP, i u inbox-u vidi prijavu.
4. Vlasnik potvrđuje slanje poruke kupcu A; kupac A vidi poruku u nalogu, a kupac B ne.
5. Potvrđen zahtev kupca A ne može se obrisati kao obična skica; provera vraća HTTP 409.
6. Proveriti da nije poslat mejl niti izvršena naplata; status i interna napomena ostaju odvojeni.
7. Testni fajl: `tests/test-autodanini-buyer-owner-journey.cjs`. Njegov simulirani MySQL/Brevo prolaz ne dokazuje integraciju na Hostingeru.

## Ograničenja
Nisu provereni stvarni Hostinger reverse proxy, MySQL i Brevo u produkciji. Testovi sa lažnom bazom nisu zamena za stvarni E2E test. Admin UI i operativna podrška zahtevaju posebno potvrđivanje pre javnog lansiranja. Ovaj dokument ne predstavlja potvrdu objave sajta.
