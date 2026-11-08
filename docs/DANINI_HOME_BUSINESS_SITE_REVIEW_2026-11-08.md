# DANINI — pregled predkomercijalne spremnosti (08.11.2026)

**Status: RADNI PREDLOG; nijedna izmena na ovoj grani nije produkciona.** Bez izmene pravnog statusa, DNS/MX, procesora plaćanja, Jobcenter dokumentacije ili poreskih podataka.

## Odobren poslovni koncept
- Rad od kuće u Duisburgu; ne iznajmljivati fiktivnu kancelariju samo zbog sajta.
- DANINI / AutoDanini: digitalna podrška kupcima i B2B partnerima za pronalaženje i poređenje vozila iz DACH regiona, pregled raspoložive dokumentacije, komunikaciju sa prodavcima, organizaciju nezavisnih pregleda i koordinaciju upita.
- Posredovanje za ponude nezavisnih prevoznika je **dopunska usluga**; DANINI nije prevoznik i na sajtu ne treba nuditi zapošljavanje za transportnu firmu ili usluge spoljnog dispečera kao osnovnu delatnost.
- Ne navoditi registraciju, broj firme, poreski identitet, ovlašćenja, partnerstva i adrese bez dokaza.

## Provera produkcije
- Glavni domen trenutno prikazuje AutoDanini statičke stranice povezane sa Cloudflare Worker-om; izvor je `autodanini/staging-v12` i build `scripts/build-autodanini-auto-release.cjs`.
- `/de/` jezički funkcioniše u browseru nakon izvršenja skripte; isporučeni HTML sadrži primarno SR sadržaj, pa je potrebno pripremati nemačku verziju unapred zbog SEO/pristupačnosti.
- `/impressum.html`, `/privacy.html`, `/terms.html`, `/cookies.html` postoje, ali su eksplicitno označene kao **radni tekstovi**. Njihovo postojanje ne znači pravnu usklađenost.
- `/cenovnik.html` označava cene kao pilot; nema naplate preko sajta. `/auctions.html` navodi da aukcije nisu aktivne.
- `sitemap.xml` ima 15 unosa; `robots.txt` ograničava privatne API/payment/owner putanje. Pre lansiranja uraditi indeksiranje i pravni audit.

## E-mail — bez promena DNS-a u ovom PR-u
- Zadržati postojeće naloge GitHub, Cloudflare, Stripe, PayPal, Brevo.
- Postojeći javni `kontakt@daninihub.com` ne proglašavati aktivnim bez provere prijema.
- Predlog aliasa: `info@`, `office@`, `rechnung@`, `support@` sa jednim glavnim potvrđenim prijemnim sandučetom (opciono, bez duplih MX).
- Pre aktivacije proveriti MX, SPF, DKIM, DMARC, pravilno odgovaranje sa domena i testni prijem s nezavisne adrese. Brevo za slanje tek nakon verifikacije domena.
- Istorija detaljnog plana: `docs/DANINI_EMAIL_JOBCENTER_PRELAUNCH_2026-11-08.md`.

## Fotografije — izmene pripremljene za pregled na ovoj grani
- Početna: hero `danini-auto-uvoz.webp`, deo o usluzi `danini-pregled-auta.webp`.
- Kontakt: hero `danini-pregled-auta.webp`, umesto malog portreta logo `autodanini-mark.svg`.
- O nama: jedan postojeći portret za lični kontakt; dodatna scena zamenjena ilustracijom pregleda vozila.
- Open Graph za glavnu i kontakt stranicu koristi temu vozila, `/about` lični portret. Ne brišu se originali i ne izmišlja poslovni događaj.
- Prilagođen CI tekst provera da prepozna novu strukturu. Nije potvrđen vizuelni rezultat dok ne prođu build/QA i ručni pregled mobilnog izgleda.

## Pravne stranice — DRAFT, još se ne objavljuju nove tvrdnje
**Impressum:** proveriti puno pravno ime operatora, *ladungsfähige Anschrift*, komunikacione kanale, poreske identifikatore samo ako postoje i po zakonu se navode, eventualnu nadležnu službu. Rad iz doma može biti stvarna poslovna adresa, ali običan postfach/virtuelna adresa bez stvarne poslovne osnove nisu bezuslovna zamena. Ne izmišljati Gewerbeanmeldung.

**Datenschutz (Art. 13 GDPR):** popis rukovaoca, svake stvarno aktivne funkcije, servera/hostinga, WhatsApp-a, AI servisa, analitike, pravnog osnova, primaoca, prenosa podataka, rokova čuvanja i prava korisnika. Proveriti da li forma zaista samo otvara WhatsApp ili je i čuva lokalno/server-side. Potvrditi AV ugovore sa obrađivačima.

**Cookies/TDDDG:** tehnički audit skripti, lokalnog skladišta, eksternih fontova i svih trećih strana pre tvrdnje da saglasnost nije potrebna.

**AGB, Widerruf, odgovornost:** razlikovati kupca automobila, posredničku uslugu, koordinaciju pregleda, transport nezavisnog partnera i digitalne sadržaje. Potrošačka prava i uslovi komercijalnog checkout-a ne mogu se rešiti opštim disclaimerom. Dodati zakonski potrebna obaveštenja i postupke tek kada se odredi stvarni ugovorni model.

## Blokatori za puštanje u prodaju
1. Odluka o realnom početku samostalne delatnosti i komunikacija sa Jobcenter.
2. Stvarna pravna i poreska identifikacija operatora, uključujući adresu rada od kuće ako je dozvoljeno.
3. Potvrđen primajući i šaljući e-mail kanal.
4. Pravno provereni Impressum, Datenschutz, AGB, Widerruf i ugovorni tok.
5. Test build, QA, mobilni prikaz i bezbednost. Stripe/PayPal isključivo sandbox do posebnog odobrenja.

**Nijedna od navedenih stavki nije automatski rešena samim otvaranjem PR-a.**

---

## DOPUNA 08.11.2026 — proširenje obuhvata Gewerbe po odluci vlasnika

**Ova dopuna je poslovno-pravni NACRT, nije potvrda da je Gewerbe registrovan, niti da su posebne dozvole dobijene.** Primarna lokacija rada: Homeoffice, Duisburg. Brend: DANINI; AutoDanini je prva poslovna oblast. Ne osnivati fiktivnu poslovnu adresu.

### Operativni opseg (postepeno pokretanje, ne izmišljati postojeću prodaju)

| Modul | Šta obuhvata | Naplata / status | Posebna provera |
|---|---|---|---|
| Fahrzeugrecherche / B2B sourcing | Pretraga, upoređivanje oglasa, pregled dostavljenih dokumenata i komunikacija sa prodavcima; izveštaji i ponude | Pilot, prodaja nije aktivirana | Jasna razlika između informacija i stručnog pregleda, ne garantovati stanje auta |
| Pregledi i posredovanje | Organizacija nezavisnog stručnog pregleda (ADAC/DEKRA/TÜV samo ako postoji konkretna mogućnost), koordinacija video-obilaska, dovoza i upita za OE delove | Posebna usluga po ponudi | Ne predstavljati DANINI kao servis, prevoznika, osiguravača ili zvaničnog partnera bez stvarnog ugovora |
| Online ponude, marketplace, online aukcije | Verifikovani prodavci, objavljivanje ponuda, zahtev za rezervaciju i elektronsko nadmetanje, bez automatske kupovine do pravne provere | U fazi projektovanja; NEMA licitiranja ni klijentskih depozita | IHK: čiste internet-aukcije uglavnom izuzete iz §34b GewO; klasične aukcije tuđe robe mogu zahtevati dozvolu; DSA, DAC7/PStTG, prodavci, uslovi i sporovi |
| Digitalni proizvodi | PDF, digitalni izveštaji, kursevi, online šabloni, digitalne licence | Planirana naplata sopstvenih proizvoda | Digitalna isporuka, ugovor, zakonski Widerruf, EU porez/OSS u zavisnosti od kupca |
| KI / AI proizvodi | KI savetnik, AI agenti, izrada i pružanje aplikacija, korisničkih automatizacija, softver-as-a-service i eventualne licence | Planirano bez aktivne pretplate | AI Act transparentnost, korisnički podaci, uslovi upotrebe, ljudski nadzor, ograničenja odgovornosti |
| Digitalni marketing/affiliate | Sadržaj, online oglašavanje, affiliate i digitalna podrška prodaji | Planirano | Označavanje reklamnih/affiliate linkova, GDPR, UWG, e-mail marketing pristanci |
| Dodatni budući modeli | Direktna trgovina vozilima, osiguranja, aukcije u sali, usluge podložne dozvolama | NE obećavati kao aktivne | Posebno proveriti i po potrebi proširiti prijavu; ne simulirati ovlašćenja |

### Nacrt formulacije za Gewerbeanmeldung (DE)

**Kraća verzija (za polje sa ograničenim brojem karaktera):**

Betrieb digitaler Informations-, Vermittlungs- und Online-Marktplatzplattformen, insbesondere zur Fahrzeugrecherche und zur Vermittlung fahrzeugbezogener Dienstleistungen; internetbasierte Angebots- und Auktionsplattformen; Entwicklung, Bereitstellung und Vertrieb von Software, KI-Anwendungen und Automatisierungslösungen; Vertrieb digitaler Produkte sowie Online-Marketing und Affiliate-Marketing, jeweils im erlaubnisfreien Umfang.

**Detaljnija verzija za prilog/poslovni plan:**

Entwicklung und Betrieb einer digitalen Informations-, Vermittlungs- und Online-Marktplatzplattform für private und gewerbliche Kunden mit Schwerpunkt Fahrzeugrecherche, Angebotsvergleich, Käuferunterstützung, Dokumenten- und Informationsanalysen, B2B-Fahrzeugvermittlung und Koordination von Anfragen an unabhängige Fahrzeugprüfer und Transportunternehmen; Betrieb internetbasierter Angebots-, Bieter- und Auktionsfunktionen, soweit erlaubnisfrei; Entwicklung, Bereitstellung, Lizenzierung und Vertrieb von Software, KI-basierten Anwendungen, KI-Agenten, digitalen Automatisierungen und digitalen Produkten (insbesondere E-Books, PDF-Berichte, Online-Kurse, Vorlagen und digitale Lizenzen); Online-Marketing, Affiliate-Marketing und digitale Vertriebsunterstützung. Keine eigenen Fahrzeugtransporte, kein Betrieb einer Werkstatt und keine erlaubnispflichtigen Tätigkeiten ohne gesonderte Genehmigung.

**Napomena:** Konačna formularna verzija zavisi od stvarno planirane delatnosti, procene Gewerbeamt-a i pravnog saveta. Izraz `internetbasierte Auktionsplattformen` u tekstu NE predstavlja dozvolu za klasične fizičke aukcije. Pri eventualnoj direktnoj prodaji vozila u sopstveno ime ponovo proveriti obuhvat Gewerbe, osiguranje i trgovinske obaveze.

### PayPal naspram Stripe — predlog odluke, bez aktivacije

- Koristiti **jedan centralni checkout za sopstvene digitalne proizvode i naplative usluge**, prioritet Stripe, uz kartice i podržane lokalne načine plaćanja.
- **PayPal kao metod unutar Stripe-a** poželjan je za nemačke B2C kupce ako konkretni Stripe nalog i poslovni model ispune uslove. Ne uvoditi zaseban paralelni PayPal checkout bez merljive potrebe i jasne podrške za refundacije.
- **B2B fakture i SEPA transferi** važni su za veće iznose i partnerske usluge.
- **Za kupoprodajnu cenu vozila ne koristiti DANINI privatni ili sopstveni poslovni PayPal kao depozitni/escrow račun.** Ugovor i plaćanje za vozilo obavljaju odgovorne strane ili provereno licencirani pružalac tržišnih uplata; PayPal zaštita u pravilu isključuje motorna vozila.
- Ako marketplace naplaćuje kupcu u korist trećih prodavaca, potreban je poseban dizajn odgovornosti, KYC/onboarding, ugovorni i regulisani tok plaćanja (npr. kvalifikovani marketplace PSP) pre puštanja te funkcije.
- Nijedan live ključ, webshop checkout, PayPal prijem ili Stripe isplata nije aktiviran ovim dokumentom.

### Pravne kontrole za buduću platformu

1. **DSA:** utvrditi da li konkretni servis predstavlja online platformu/marketplace, obezbediti identifikaciju prodavaca, prijavu nedozvoljenog sadržaja, uslove korišćenja, moderaciju i kontakt tačku prema primenljivim pravilima.
2. **PStTG / DAC7:** ispitati da li sistem omogućava prodaju robe i usluga prodavaca na platformi, da li nastaje obaveza evidentiranja i izveštavanja BZSt, i koji izuzeci važe. Nije isto kao puko informativno oglašavanje.
3. **AI Act čl. 50:** korisnik mora jasno znati da komunicira sa AI agentom, uz odgovarajuće obeležavanje sadržaja kada je obavezno; pregledati druge AI rizike prema stvarnoj funkciji.
4. **GDPR/DSGVO:** evidencija svrha, primaoca podataka, rokova, pravnog osnova, prenos podataka, DPA/AVV, prava korisnika, brisanje naloga, obrada VIN i ličnih podataka; ne opisivati isključivo WhatsApp tok ako se koriste nalozi.
5. **Potrošačka i ugovorna prava:** Impressum/DDG; AGB i posebno B2C/B2B i aukcijski uslovi; Widerruf za usluge i digitalne proizvode; refundacije, dokumentovanje pristanka i automatske isporuke; privatnost i identitet prodavca.
6. **Porez/računovodstvo:** poseban poslovni račun, stvarni poslovni troškovi, EKS za Jobcenter i EÜR za Finanzamt; proveriti §19 UStG i EU digitalnu prodaju/OSS prema stvarnim državama kupaca; GoBD, E-Rechnung i računi.
7. **Zaštita sistema:** 2FA, prava pristupa, admin audit log, zaštita korisničkih dosijea, testno okruženje, API rate limits i budžeti tokena, backup, obnova, monitoring, sigurnosni i refund testovi.
8. **Realnost usluga:** marketinški tekstovi ne smeju implicirati da postoje zaposleni, autoplac, sopstvena vozila, partnerstva, aktivne aukcije ili odobrene dozvole kada nisu potvrđeni.

### Redosled izvršenja — bez naplate

**FAZA A, odmah:** poslovni opis, kontakt e-mail verifikacija, kompletan pravni inventar, jednoznačni DE/SR sadržaji, validacija vizuala i ponude u pilot režimu.

**FAZA B, pre početka samostalne delatnosti:** provera stvarne Homeoffice adrese, razgovor sa Jobcenter-om o samostalnoj delatnosti i eventualnim zahtevima za Einstiegsgeld / §16c, preciziranje Gewerbe aktivnosti i poreskog statusa, izbor banke.

**FAZA C, nakon zakonitog početka poslovanja i individualnog odobrenja naplate:** prvo sopstveni digitalni proizvodi i usluge, fakturisanje, legalni checkout, automatska isporuka, refund i testovi.

**FAZA D, odvojeno i tek nakon tržišne/propisne verifikacije:** javna platforma sa prodavcima, online aukcije, prava pristupa, transparentne provizije, DSA/PStTG ocena, partner PSP i poravnanje između strana.

### Izvori za dodatnu pravnu/prodajnu proveru (08.11.2026)

- NRW Gewerbeanmeldung i proširenje delatnosti: https://service.wirtschaft.nrw/unternehmensgruendung/gewerbe-anmelden-online/
- Duisburg Gewerbeamt: https://service.duisburg.de/suche/-/vr-bis-detail/dienstleistung/72781/show
- IHK internet aukcije / §34b: https://mittlerer-niederrhein.ihk.de/themen/recht-steuern/recht-von-a-bis-z/versteigerer
- DSA: https://digital-strategy.ec.europa.eu/en/faqs/digital-services-act-questions-and-answers
- DAC7/PStTG: https://online.portal.bzst.de/SharedDocs/Leistungsbeschreibung/DE/meldung_dac7_massendaten.html
- AI Act Art. 50: https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act
- Stripe PayPal: https://support.stripe.com/questions/paypal-payment-method-availability?locale=de-DE
- PayPal motorna vozila / Verkäuferschutz: https://www.paypal.com/de/legalhub/paypal/seller-protection
- EHI Online-Payment 2026: https://www.ehi.org/presse/smartphone-statt-portemonnaie-mobile-payment-boomt/
- Jobcenter §16b: https://www.arbeitsagentur.de/grundsicherung/arbeit-finden/einstiegsgeld-selbststaendigkeit
