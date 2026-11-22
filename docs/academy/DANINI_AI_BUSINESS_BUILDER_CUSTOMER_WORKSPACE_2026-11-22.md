# DANINI AI Business Builder — osnova za sopstveno online preduzeće svakog korisnika
**Datum:** 22.11.2026. · **Status:** KOD U IZOLACIJI / BEZ PRODUKCIONOG RUTA · **Bez aktivacije naplate**

## Potvrđen korisnički zahtev
Svaki korisnik može da kreira i razvija **svoj** online poslovni projekat na postojećoj DANINI platformi, na srpskom ili nemačkom, uz kontrolisanu AI pomoć. To nije samo jednokratni upitnik ili PDF. Korisnik mora imati privatni projekat koji nastavlja tokom više sesija.

## Minimalan korisnički tok
1. Sigurno prijavljivanje i vlasnički identitet (još NIJE implementirano).
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
`actor.authenticated` je isključivo **interni argument sloja** i ne sme nikada doći iz JSON zahteva, cookie-ja bez verifikacije ili URL-a. Ne postoji javni API ruter koji poziva ove funkcije. Pre aktivacije potrebni su potvrđen identitet korisnika (npr. bezbedan e-mail login), sesije, revokacija, CSRF zaštita, realni rate limit, politika čuvanja i brisanja, test IDOR među nalozima i politika dozvole AI obrade. Cloudflare Access trenutno štiti vlasnički portal i nije autentifikacija za javne kupce.

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
Nema registracije, javnog pristupa, produkcione migracije, AI konekcije za Builder, personalizovanog sajt-generatora, naplate, automatskog deploy-a ni javne objave. To nisu PASS stavke.