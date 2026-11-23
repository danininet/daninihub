# AUTODANINI | Dovoz, ponude trećih prodavaca i višejezični ugovori
Datum: 2026-11-07. Status: specifikacija za proveru; BEZ aktiviranja prodaje/licitacija/naplate.

## Poslovna odluka
DaniniHub / AutoDanini ne poseduje, ne prodaje i ne licitira sopstveni lager. Tri odvojene funkcije:
1. Buyer's Desk: analiza konkretnog oglasa, pitanja prodavcu, procena troškova (trenutna javna cena jednog oglasa: 39 EUR; predlog pilot cene 29 EUR NIJE odobrena promena).
2. Seller Offers: vlasnik/prodavac sam prijavljuje svoje vozilo i odobrava njegovu ponudu; posetioci šalju neobavezujuće indikativne ponude uz rok. Prva verzija nije automatska pravno obavezujuća aukcija.
3. Delivery Desk: koordinacija preuzimanja, provere papira, izvoza, vožnje ili šlepera sa partnerima; sve usluge zavise od dostupnosti, obima i zasebne ponude.

Posebna ponuda za E-Commerce Shield ne meša se sa tržištem vozila.

## Dovoz na registrovanim, važećim DE tablicama
Mogući IZUZETAK, ne standardna opcija koja se kupuje jednim klikom. Ponuditi kao "Na postojećim važećim tablicama — samo uz pojedinačnu proveru" pored "Ausfuhrkennzeichen (crveni rub)" i "Šleper".
Pre ugovaranja: saglasnost vlasnika / nosioca registracije; vozačka i identitet vozača; uredan Kupoprodajni ugovor i ovlašćenje; Zulassungsbescheinigung Teil I/II, važeća registracija, tehnički pregled, polisa i izričita potvrda osiguravača za teritoriju i KOMERCIJALNU vožnju, carinske formalnosti izvoza i uvoza, kontrolni popis štete, potvrda rute i graničnog prelaza, ovlašćenje za odjavu i vraćanje originalnih tablica. Sve potvrđeno pre preuzimanja.
Posle dovoza: potvrda predaje, izvozni/carinski dokumenti, dostavljanje originalnih tablica i potrebnih dokumenata ovlašćenom licu / Zulassungsstelle, dokaz o odjavi, zatvaranje poreske/registracione evidencije. Ne obećavati da je odjava automatska ni da srpska registracija odjavljuje nemačku.
Kfz-Steuer: eventualni povraćaj neiskorišćenog dela nakon odjave obračunava Zoll; po pravilu ide registriranom poreskom obvezniku i često automatski na bankovni račun sa SEPA mandata. Nije prihod AutoDanini niti automatski povraćaj kupcu.
Ne mešati nemačku Kfz-Steuer sa eventualnim povraćajem DE MwSt. Ausfuhrkennzeichen ne treba vraćati po isteku, nasuprot postojećim redovnim registarskim tablicama u procesu odjave. ADAC članstvo nije osiguranje za izvozne tablice.
Za svakog klijenta dati zasebnu ponudu: vozač/vreme i povratni put, gorivo i putarine, eventualne vinjete, osiguranje, dokumenta i izvoz, tablice ako potrebne, špediter i uvozni porezi odvojeno, hitne rezerve i naknada DANINI. Bez fiksnih 650/700 EUR bez ponude.
Zvanični izvori: https://verwaltung.bund.de/leistungsverzeichnis/DE/leistung/99036040069000/herausgeber/RP-8939168/region/070000000000 ; https://www.adac.de/rund-ums-fahrzeug/auto-kaufen-verkaufen/import-export/ausfuhrkennzeichen-zollkennzeichen/ ; https://www.duisburg.de/vv/produkte/pro_du/dez_vii/32/verkauf_zugelassenen_fahrzeug ; https://www.help.zoll-portal.de/DE/Hilfe/Dienstleistungen/kraftfahrzeugsteuer/Kraftfahrzeugsteuer/Bankdaten/bankverbindung-zur-erstattung-mitteilen/bankverbindung-zur-erstattung-mitteilen.html .
OPREZ: ADAC preporučuje izvozne tablice pri trajnom izvozu; državni portal navodi izuzetak kad je vozilo još propisno registrovano. Konačnu prihvatljivost konkretne relacije proveriti sa Zulassungsstelle, osiguravačem, špediterom i nadležnom carinom.

## Vozila trećih lica — minimalna pravila
Prodavac se registruje i potvrđuje identitet, status privatni/trgovac, vlasništvo ili dokazano ovlašćenje za prodaju, pravo korišćenja fotografija i dozvolu objavljivanja. AutoDanini ručno odobrava prvo oglašavanje.
ZABRANJENO: automatsko preuzimanje (scraping), preslikavanje fotografija/opisa drugih portala ili kopiranje oglasa bez dozvole/licence. mobile.de uslovi ograničavaju i izvlačenje podataka i ponovnu upotrebu.
Minimalna polja prodavca: kontakt, država, pravni status, identitet/verifikacija (privatno čuvano), dozvola marketinga i prava za foto.
Minimalna polja automobila: marka, model, varijanta, godište/prva registracija, tip motora, gorivo, menjač, km, zemlja/lokacija, registracija/HU status, cena i status PDV-a, COC, dokumentacija o poreklu (ako postoji), servisna istorija, broj vlasnika po tvrdnji prodavca, poznati kvarovi i udesi, drugi ključ/Felgenschloss, originalne fotografije/video, prodavčeva izjava i datum osvežavanja.
Napredna opcija: VIN na sigurnom serveru (javno prikazati samo nepotpun, po dogovoru), oprema, battery SOH za EV, profesionalne dijagnostike sa identifikacijom izvora, upozorenja, podvozje/korozija, fotografije oštećenja, fakture/radni nalozi, izvoz i carina.
Oznake poverenja: "Podaci prodavca — nisu nezavisno potvrđeni"; "Dokument dostavljen, nije potvrđena autentičnost"; "Nezavisni fizički pregled izveden dana ... od ..." samo ako postoje stvarni dokazi i obim pregleda. Izbegavati "garantovano", "proveren prodavac" bez kvalifikacije.
Opis dužnosti: prodavac odgovara za svoje izjave i prodaju, ali to NE ISKLJUČUJE vlastite zakonske obaveze platforme, marketinga, GDPR, potrošačkih propisa i postupanja po prijavi zloupotreba.

## Tender / Offers umesto automatske Aukcije — prvi MVP
Statusi:
LISTING_DRAFT -> IDENTITY_REVIEW -> MANUAL_APPROVED -> PUBLIC -> OFFERS_OPEN -> OFFERS_CLOSED -> SELLER_DECISION -> SELLER_ACCEPTED -> CONTRACT_PENDING -> SOLD_CONFIRMED -> CASE_CLOSED
Bočni izlazi: SUSPENDED, WITHDRAWN, EXPIRED, DISPUTED, NO_SALE.
Ponuda: iznos EUR, datum isteka, uslovna/neobavezujuća oznaka, tip kupca, zahtev za dodatnim dokumentima, buyer ID i rate limit. Kupac ne "kupuje" automobil klikom; najviša ponuda nije automatski pobednik. Prodavac ljudski odlučuje, potvrđuje raspoloživost i tek onda šalje kupoprodajni ugovor. Obezbediti audit log svake promene, anti-shill mehanizme i deaktiviranje pri prodaji izvan platforme.
POSLE PRAVNE PROVERE: moguće stvarne vremenski ograničene aukcije sa unapred objavljenim pravilima ponude, obaveznosti, povlačenja, nadmetanja, potrošačkih prava i odgovornosti. Online auctions su često izuzete od nemačke aukcionarske dozvole iz §34b, ali to NE ukida potrošačka pravila. IHK Mittlerer Niederrhein: https://mittlerer-niederrhein.ihk.de/themen/recht-steuern/recht-von-a-bis-z/versteigerer ; https://www.vis.bayern.de/recht/kaufen_ausserhalb_laden/internetauktion_verbraucher_unternehmer.htm .
Start: 3–5 stvarnih dobrovoljnih auto-kuća; bez lažnih unosa. Objave se ne prikazuju kao žive ako nema prodavaca.

## Monetizacija — HIPOTEZE za pilot, ne validirane cene
- Objavljivanje za partnera: 0 EUR tokom pilota.
- Samo dokumentovano uspešan promet (kupoprodajni ugovor/ostvarena prodaja): predlog fiksne seller-side provizije 99–199 EUR po ugovoru, tek nakon potpisanog dogovora sa prodavcem i dokazivog statusa. Alternativa B2B naplata verifikovanog upita po eksplicitnim pravilima; ne kombinovati bez dogovora.
- Kupac: zasebno ugovara izveštaj (postojeća javna pilot cena 39 EUR), opcioni DE kontakt i koordinaciju transporta po ponudi.
- Kupovna cena automobila ide direktno pravom prodavcu; DANINI ne preuzima ulogu escrow-a/finansijskog posrednika. Bez Stripe Connect marketplace payout implementacije dok nisu proverene države i uslovi stranaka. Srbija nije prikazana kao standardno podržana država za domaći Stripe nalog na https://stripe.com/global.
- Jasno otkriti kome se plaća provizija, za šta, kada dospeva, porez i uslove otkaza. Nijedna strana ne sme biti uverena da je auto rezervisan ili plaćen preko DANINI bez pismene potvrde stvarnog prodavca.

## Ugovorni centar / višejezični AI dokumenti
Vrste dokumenata: nalog za proveru oglasa; saglasnost za kontakt prodavca; neobavezujuća kupčeva ponuda; nalog/potvrda rezervacije od strane stvarnog prodavca; posrednički/komisioni ugovor sa prodavcem; ugovor o kupoprodaji između stvarnih stranaka; punomoć za preuzimanje/odjavu (Vollmacht); primopredajni protokol; ugovor za transport, izdavanje i povrat tablica; privacy/retention notice.
Svaki dokument: templateId, verzija, datum, izvorni jezik, važeći original, prevedene informativne verzije sr/de/en i kasnije dodatni jezici, identitet stvarnih stranaka, polja i prilozi, istorija izmene, status DRAFT -> HUMAN_REVIEW -> COUNTERPARTY_REVIEW -> APPROVED -> SIGNED -> ARCHIVED, PDF download kontrolisan autorizacijom; ne praviti javni URL za dokumenta ili pasoše.
AI sme: popuniti nacrt iz potvrđenih polja, uporediti verzije, prevesti i izdvojiti sporna pitanja, objasniti dokument na jeziku posetioca.
AI ne sme: izmišljati prava/poreze, potvrditi identitet ili naslov vlasništva bez dokaza, pravno odobriti dokument, primeniti elektronski potpis u tuđe ime, poslati ugovor ili obaviti uplatu bez eksplicitne autorizacije. Dokumente za carinu/sud mogu zahtevati overenog prevodioca; AI prevod nije sertifikovan.
eIDAS: elektronski potpisi imaju priznatu dokaznu vrednost i kvalifikovani elektronski potpis je ekvivalent rukom pisanom; forma specifičnog dokumenta i pravnog poretka mora se proveriti: https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/880312429/eSignature%2BFAQ .
Potrebna GDPR kontrola: ograničenje zadržavanja, pristup po ulozi, minimizacija, brisanje po rokovima, kontrola van-EU prenosa AI pružaocu, sigurni PDF linkovi, audit log bez objave osetljivih dokumenata.

## AI i ljudske uloge
AI automatski uz reviziju: normalizacija dobrovoljno unetih oglasa, duplikati, klasifikacija rizika, checkliste, kalkulator sa varijantama, prevodi, priprema DE upita, pregled statusa, podsetnici, nacrti ugovora, obaveštenja.
AI uz eksplicitno ljudsko odobrenje: objavljivanje listinga, kontakt prodavca, pokretanje plaćene usluge, slanje ugovora, finalna ponuda troškova, rezervacija, provizija, otkazivanje.
Čovek/partner: utvrđivanje identiteta i prava raspolaganja, vizuelni i nezavisni tehnički pregled, autorizacija ugovora, odgovornost za vožnju i osiguranje, organizacija i potvrda prevoza, carinski postupci kroz odgovarajuće ovlašćene učesnike, reklamacije i sporovi.
NIKADA automatska kupovina vozila, isplata prodavcu ili licitiranje bez sopstvenih zasebnih bezbednosnih i pravnih procedura.

## Sistemska arhitektura — postojeći projekat
Sačuvati postojeće statičke Vite stranice, SR/DE jezike, DOMENE i postojeći Cloudflare Worker. Ne dodavati novi VPS niti menjati DNS.
Nove UI sekcije: /delivery (uslovi i 3 načina transporta); /offers (nema fiktivnih ponuda); /seller-submit (samo pravi prodavci); /case/:id (prijavljen i autorizovan), /contracts (privatni PDF i istorija).
Server: Cloudflare Worker routes za API, D1 baza relacija (users, sellers, seller_verifications, listings, bids_indicative, reservations, cases, quotes, contracts, translations, events, payment_intents). R2 privatni dokumenti, KV samo nekritični cache, red/cron samo gde treba. Ništa ne skupljati u browser localStorage osim bezbednih UI preferencija.
Integracije: Brevo samo za potvrde naloga i transakcione statuse, odvojeno opt-in za marketing; Stripe Hosted Checkout samo za DANINI sopstvene odobrene usluge uz pravi merchant, serverski obračun, webhook potpis i idempotenciju; car purchase funds NE primati na isti nalog. Privatni AI API ključ držati u server secret.
PRAVNI CHECKPOINT pre produkcije: nemačka poslovna registracija/poreski status, §34b model ako se menja tip aukcije, DSA opšta pravila i prijave, procena da li se primenjuje čl. 30/31 uz izuzetak za mikro/mala preduzeća iz čl.29, GDPR, PStTG/DAC7 analiza statusa platforme, potrošačko pravo (B2C vs C2C; online "auction" ne podrazumeva automatski isključenje prava odustanka), osiguranje za vožnju i transport, carina/uvoz, pravila međunarodnih ugovora i status komisije.

### Prioriteti implementacije
P0: kupac može zatražiti besplatan preliminarni pregled, plaćeni izveštaj po postojećem cenovniku i ponudu preuzimanja; bez novog naplatnog dugmeta dok pravi Stripe merchant nije povezan.
P1: seller onboarding + manual approval i prikaz stvarnih listings/indicative offers, audit log, moderacija, zabrana scraping-a.
P2: ugovorni centar, višestruki jezici i potpisivanje, pod uslovom pravnog pregleda.
P3: prava aukcija i automatski statusi/provizije tek nakon stvarnog poslovnog pilota.

## Izvori (provereno 2026-11-07)
- IHK Auktionen: https://mittlerer-niederrhein.ihk.de/themen/recht-steuern/recht-von-a-bis-z/versteigerer
- DSA: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2065
- PStTG/DAC7: https://online.portal.bzst.de/SharedDocs/Leistungsbeschreibung/DE/meldung_dac7_massendaten.html
- mobile.de terms: https://www.mobile.de/service/agbPublic
- ADAC export and plates: https://www.adac.de/rund-ums-fahrzeug/auto-kaufen-verkaufen/import-export/ausfuhrkennzeichen-zollkennzeichen/
- Vehicle tax refund: https://www.help.zoll-portal.de/DE/Hilfe/Dienstleistungen/kraftfahrzeugsteuer/Kraftfahrzeugsteuer/Bankdaten/bankverbindung-zur-erstattung-mitteilen/bankverbindung-zur-erstattung-mitteilen.html
- Stripe availability: https://stripe.com/global
- Consumer internet auctions: https://www.vis.bayern.de/recht/kaufen_ausserhalb_laden/internetauktion_verbraucher_unternehmer.htm
