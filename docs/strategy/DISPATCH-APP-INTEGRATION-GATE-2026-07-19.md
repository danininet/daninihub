# DaniniHub Dispatch aplikacija — integration gate

Status: INTERNO / NE SPAJATI BEZ ZAJEDNIČKOG AUDITA
Datum: 19.07.2026.

## Potvrđeno stanje

U repozitorijumu `danininet/daninihub` na `main` postoji raniji guided-analysis MVP za proizvod „Die KI fragt nach“.

On sadrži tehničke obrasce za:

- zaštićenu aktivaciju sesije;
- potpisani pristup sesiji;
- sekvencijalna pitanja i odgovore;
- audit događaje;
- finalnu analizu;
- moguću PDF i email isporuku.

To nije Dispatch Pilot Workspace.

Stara grana/PR `ustav-runtime-core` zatvorena je bez merge-a. Ranije `danini-os/*` grane bile su spojene kroz PR-ove, ali trenutno nisu aktivne kao odvojene grane dostupne za direktno spajanje.

## Potvrđeno stanje iz aplikacionog razgovora

Owner je potvrdio sledeći status za granu `feature/dispatch-module-integration`:

- Integration Blueprint: završen;
- Dispatch produkcioni kod: nije dodat;
- grana nema produkcione izmene;
- `main` nije menjan iz tog razgovora;
- Hostinger deployment nije pokrenut;
- MySQL produkciona baza nije menjana;
- Brevo, forme i Stripe nisu dirani;
- dalji rad je zaustavljen do završetka javnog sajta, dubinske analize finalnog `main` stanja i prelaska na jedan centralni razgovor.

Ovo znači da trenutno nema aplikacionog koda za audit ili merge. Postoji samo blueprint i bezbedna razvojna izolacija.

## Centralni razgovor

Od ovog trenutka ovaj razgovor je centralna operativna tačka za:

- završetak javnog sajta;
- finalni audit `main` grane;
- definisanje minimalnog Dispatch Pilot Workspace-a;
- pregled Integration Blueprint-a;
- odluku da li se grana nastavlja, rekreira ili zamenjuje novom čistom granom;
- kontrolisani PR i tek potom eventualni deployment.

Drugi razgovor ostaje arhiva prethodnog rada. Iz njega se ne izvršavaju nove GitHub izmene bez eksplicitne odluke u ovom razgovoru.

## Šta se može ponovo koristiti kao obrazac

- HMAC potpisane sesije;
- server-side kontrola pristupa;
- statusni tok sesije;
- audit događaji;
- eksplicitno fail-closed ponašanje kada nedostaje konfiguracija;
- odvojeni activation endpoint;
- kontrolisana email/PDF isporuka nakon završetka.

Ponovno korišćenje znači adaptaciju obrasca, ne kopiranje poslovne logike.

## Šta se ne sme preneti direktno

- proizvod `die-ki-fragt-nach`;
- opšta inicijalna pitanja i tri AI podpitanja;
- Gemini promptovi i model-zavisna logika;
- file-system sesije kao trajna produkciona baza za transportne slučajeve;
- automatska finalizacija bez operativnog odobrenja;
- sadržaj i PDF format namenjen starom proizvodu;
- bilo kakva pretpostavka da aplikacija samostalno raspoređuje vozila ili izdaje instrukcije vozačima.

## Minimalni Dispatch Pilot Workspace

Prva verzija potrebna za ograničeni pilot mora da podrži samo:

1. ručno otvaranje fiktivnog ili odobrenog operativnog slučaja;
2. unos sirove poruke ili statusa;
3. strukturisanje na činjenice, nepoznato, rizik i sledeću proveru;
4. označavanje odgovorne osobe i potrebnog odobrenja;
5. pripremu nacrta poruke bez automatskog slanja;
6. ručno odobrenje ili odbijanje nacrta;
7. zapis događaja i odluka;
8. radno sposobnu predaju;
9. završni pilot izveštaj.

## Zabranjeno u prvoj verziji

- samostalno prihvatanje transportnog naloga;
- pregovaranje ili potvrđivanje cene;
- automatska instrukcija vozaču;
- automatsko slanje klijentu bez ljudske potvrde;
- pravljenje ruta kao konačna dispozicija;
- 24/7 automatska krizna reakcija;
- obrada realnih podataka vozača ili klijenata pre pravnog i bezbednosnog gate-a;
- oglašavanje aplikacije kao gotovog SaaS proizvoda.

## Redosled nastavka

1. završiti javni sajt i Pilot-Check;
2. izvršiti dubinski audit finalnog `main` stanja;
3. otvoriti Integration Blueprint iz grane `feature/dispatch-module-integration`;
4. uporediti blueprint sa stvarnim stanjem `main` grane;
5. zaključati minimalni data model, statuse, uloge i approval gate;
6. tek tada dodati prvi Dispatch kod na novu ili očišćenu feature granu;
7. pokrenuti build, lint i testove;
8. otvoriti PR prema `main`;
9. bez merge-a dok nema pregleda i zelenih statusnih provera;
10. Hostinger deployment tek nakon merge-a i produkcionog checklist-a.

## Tehnički gate pre integracije

Aplikaciona grana mora biti dostavljena sa:

- tačnim nazivom grane i HEAD commitom;
- listom promenjenih fajlova;
- README-om sa pokretanjem;
- build i lint rezultatom;
- testovima ključnih statusnih prelaza;
- spiskom environment promenljivih bez tajnih vrednosti;
- opisom skladištenja podataka;
- opisom autentifikacije i uloga;
- dokazom da AI ne šalje i ne odobrava obavezujuće korake;
- planom migracije bez prekida produkcionog sajta.

## Operativni gate pre realnih podataka

Pre unosa podataka stvarnih firmi, vozača ili klijenata moraju postojati:

- ugovoreni obim obrade;
- pravni model poslovanja i fakturisanja;
- pravila privatnosti i zadržavanja podataka;
- po potrebi AVV/DPA;
- kontrola pristupa;
- audit i mogućnost brisanja/izvoza;
- recovery i backup postupak;
- jedan završen test sa isključivo fiktivnim podacima.

## Odluka

Sajt i Pilot-Check završavamo pre aplikacije.

Grana `feature/dispatch-module-integration` ostaje zamrznuta kao blueprint-only radna tačka. Ne spaja se i ne deployuje.

Aplikacija postaje klijentski deo ponude tek kada prođe tehnički i operativni gate. Do tada se predstavlja samo kao interni radni sistem u razvoju, a ne kao gotov proizvod.
