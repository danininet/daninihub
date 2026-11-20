# DANINI — Viral-to-Buyer pilot | 6. novembar 2026.

Status: MARKETINŠKI PILOT, nije objavljeno. Promena je samo dokumentacija u posebnoj grani. Ne menjati domen, DNS, proizvode, pravne tekstove ili plaćanja bez zasebne kontrole.

## Poslovna odluka

Primarna niša: kupci iz Srbije/Balkana koji su već pronašli oglas za polovni automobil u DE/DACH i žele proveru PRE KAPARE. Primarni cilj: kvalifikovan plaćeni zahtev, NE viralni pregled. Rezervna ideja: B2B automatizacija prijema upita za nemačke auto-servise; ne graditi je pre razgovora sa kupcima.

DANINI pozicioniranje: "Našao si auto u Nemačkoj? Pošalji oglas. Pre uplate proveri šta se iz oglasa može potvrditi, šta nije poznato i koji su sledeći bezbedni koraci." Bez obećanja da analiza oglasa zamenjuje fizički pregled, istoriju vozila, originalnu dokumentaciju ili pravni/tehnički savet. Nikad ne tvrditi da je automobil 100% ispravan.

## Konkretni uzori — vidIQ 6.11.2026. (brojevi pregleda su promenljivi)

1. On Wheels Rise — "5 Used Car Checks That Expose a Wrecked Car", 11.10.2026, 59 s, oko 1.6M pregleda:
   https://www.youtube.com/shorts/VXqMpbnkCyg
   Struktura na osnovu analize klipa: prvih 3 s upozorenje i veliki tekst; zatim 5 konkretnih provera sa montažnim rezovima ~1-2 s, demonstracije i oznake koraka; kraj "save". Nema direktnog plaćenog CTA. Adaptacija: tri PROVERLJIVA pitanja uz link do DANINI usluge, a ne prepisivanje tuđih snimaka ili tvrdnji.
2. Mr.Glazer — "This Tool Can Detect Repainted Cars", 11.10.2026, 23 s, oko 2M pregleda:
   https://www.youtube.com/shorts/aAT4wA1Xva4
   Struktura: pitanje "šta to proveravaju?" u prve 3 s; zatim očigledna demonstracija merača debljine laka, dinamični titlovi; kraju like CTA bez direktne prodaje. Važno: očitavanje alata NIJE samo po sebi konačni dokaz da je vozilo bilo u udesu.
3. Learn and Earn with Pavan Agrawal — "AI Automation Business", 2.10.2025, 54 s, oko 18.2M pregleda:
   https://www.youtube.com/shorts/16B1x9vRT30
   Struktura: pitanje o visokoj zaradi na početku, split-screen intervju, zatim preusmeravanje na drugi YouTube video. Tvrdnja gosta o zaradi nije nezavisno proverena; ovakve tvrdnje i clickbait NE kopirati kao dokaz našeg poslovanja.

## Potvrđeni primeri poslovnih tokova

- carVertical affiliate: https://www.carvertical.com/affiliate-program — partner aplikacija, 90 dana atribucije, procenat provizije individualan, plaćanje po ostvarenom izveštaju; na njihovoj stranici navedenih 5.5% konverzije odnosi se na njihov saobraćaj, NE na očekivanje za DANINI.
- Carwow DE: https://www.carwow.de/auto-verkaufen — kratka procena, prijava vozila, ponude trgovaca, izbor; vrednost je u kvalifikovanoj ponudi, ne u katalogu.
- Toyota Germany case study: https://ads.tiktok.com/business/en-US/inspiration/toyota-auto-ads-case-study — TikTok katalog + jasna akcija na landing stranici + pixel, objavljeno 38% niži trošak po KONFIGURACIJI vozila u odnosu na njihov kontrolni format, nije dokaz prodaje automobila.
- ADAC checklista: https://www.adac.de/rund-ums-fahrzeug/auto-kaufen-verkaufen/gebrauchtwagenkauf/ — bezbednosni minimum pre kupovine, ne obećavati konačne nalaze iz samog oglasa.

## Jedan DANINI tok, bez pravljenja nove aplikacije

Short/TikTok/IG/YT → jedna potvrđena SR/DE odredišna stranica na postojećem domenu → besplatan kalkulator i jasan CTA "Pošalji oglas" → tri kvalifikaciona podatka → procena i ljudska kontrola → pisana ponuda sa konkretnom cenom/opsegom → tek zatim Stripe/PayPal preko već postojećeg quote mehanizma → isporuka dogovorenog izveštaja/usluge → opciono, uz izričitu saglasnost, follow-up u Brevo.

Podaci za kvalifikaciju: 1. URL oglasa, 2. planirani ukupni budžet u EUR, 3. kada korisnik planira kupovinu/kaparu. Email i ime uz obaveštenje o privatnosti i nužnu svrhu kontakta. Ne zahtevati osetljive podatke bez potrebe. Posebna saglasnost za marketing; nije uslov za naručivanje usluge.

Sadašnje tačke u repozitorijumu:
- public/danini-quickcheck.js — kalkulator sa poljem URL oglasa i WhatsApp CTA.
- public/danini-sales.js — plutajući WhatsApp CTA na javnim SR/DE stranama.
- scripts/test-service-funnel.js — testira POST /api/importos/service-request, /api/importos/event, admin metrike i proces zahtev → ponuda → link.
- README.md — već navodi SR/DE web, SafeBuy/Import Passport, Stripe+PayPal authorization/capture, zaštićen owner quote desk.
Ovo dokazuje da kod postoji u repozitorijumu, ali NE potvrđuje da produkciona isporuka, CRM i checkout trenutno rade.

### Obavezni uslovi pre oglašavanja

- Otvoriti živu SR i DE stranicu i potvrditi odgovarajuću URL putanju (ne nagađati).
- Testirati stvarni zahtev od anonimnog kupca i da li vlasnik dobija obaveštenje.
- Testirati da admin vidi izvor kampanje i status; ako nema UTM, dodati ga i testirati.
- Testirati plaćanje u sandbox/test režimu i potpunu isporuku pre prodaje.
- Odvojiti kalkulator (informativna procena) od plaćenog ručnog/potpomognutog pregleda; bez automatskog naplaćivanja pre prihvaćene ponude.
- Postaviti jasne uslove, kontakt, privatnost i transparentnu affiliate oznaku gde postoji partnerstvo.

## Minimalna pilot ponuda (predlog, nije aktivan cenovnik)

Naziv: DANINI Oglas Risk Check (SR) / DANINI Inserat-Risiko-Check (DE).
Rezultat: sažeti PDF ili email pregled SAMOG OGLASA, transparentni nepoznati podaci, uporedni indikatori cene ako su dostupni, dokumenta koja treba tražiti, mogući sledeći koraci ka nezavisnom pregledu.
Cena za A/B proveru: testirati 39 € i 49 € po slučaju; ponuda se potvrđuje pre plaćanja i zavisi od obima. Ovaj pilot nije postojeći PDF vodič od 49 €; ne mešati proizvode.
Upgrade: po individualnoj ponudi realan video uvid, nezavisni pregled (npr. ADAC/partner gde je dostupno), B2B nabavka. Ne nuditi nešto što nije operativno provereno.

## Tri ORIGINALNA scenarija za faceless video (SR)

### Video A — "Ovaj podatak može da te košta hiljade" (25–35 s)
- 0–3 s: tekst preko originalnog/zakupljenog B-roll-a vozila: "Šalješ kaparu za auto iz Nemačke?"
- 3–9 s: ekran anonimnog simuliranog oglasa: "Ne gledaj samo kilometražu i cenu."
- 9–20 s: animirana kontrolna lista: "1) VIN i istorija koju je moguće potvrditi; 2) servisna dokumenta; 3) ko je stvarni prodavac."
- 20–28 s: "Nijedna online provera ne menja pregled uživo."
- 28–35 s: "Pošalji link oglasa DANINI-ju pre kapare. Prvo proveravamo šta uopšte možemo da utvrdimo."
Opis: "Kupovina automobila iz DE? Ne šalji novac na slepo. Pošalji oglas preko linka u profilu. #polovniautomobili #uvozautomobila #nemacka"

### Video B — "Zašto mere debljinu laka?" (20–30 s)
- 0–3 s: kadar sopstvenog merača / licenciran kadar; tekst: "Zašto majstor meri debljinu laka?"
- 3–12 s: kratka neutralna demonstracija i objašnjenje šta odstupanja mogu, a šta NE mogu, da sugerišu.
- 12–22 s: "Bez tehničkog pregleda i dokumentacije — nema sigurnog zaključka."
- 22–30 s: "Kupuješ auto na daljinu? Pošalji oglas. DANINI procena rizika pre nego što putuješ."
Opis: "Uređaj je signal za dalje provere, ne garancija. #proveraauta #gebrauchtwagen #danini"

### Video C — "Uvoz od 10.000 €: gde nastaje razlika?" (30–40 s)
- 0–3 s: "Auto košta 10.000 €. Koliko stvarno košta do Srbije?"
- 3–12 s: scena sa grafikom: nabavna cena → transport → potencijalne dažbine → dokumenta.
- 12–25 s: "Poreklo, vrsta vozila i važeća pravila menjaju račun. Ne postoji jedna univerzalna cifra."
- 25–35 s: snimak DANINI kalkulatora sa jasno označenim primerom (ne lažirati rezultat).
- 35–40 s: "Izračunaj okvirnu cenu, pa pošalji oglas pre kupovine."
Opis: "Orijentaciona računica nije carinska odluka. #uvoziznemacke #automobili #danini"

Za DE adaptaciju ista obrazovna vrednost i posebni DE titlovi:
- A: "Gebrauchtwagen in Deutschland gefunden? Vor der Anzahlung diese 3 Dinge prüfen."
- B: "Warum messen Profis die Lackdicke? Ein Hinweis ist noch kein Beweis."
- C: "Was kostet dein Auto bis nach Serbien wirklich? Der Kaufpreis ist nur der Anfang."
CTA DE: "Inserat senden – Risiken vor der Entscheidung klären."

Zabranjeno: reupload tuđih snimaka bez prava, lažna iskustva korisnika, lažna dijagnostika, lažne uštede, imitiranje stranih brendova ili skrivena sponzorstva.

## Landing / jedna odluka

SR naslov: "Našao si automobil u Nemačkoj? Proveri oglas pre kapare."
Podnaslov: "Dobij jasan spisak rizika, podataka koji nedostaju i sledećih koraka. Bez obećanja da online analiza može zameniti nezavisni fizički pregled."
Primarno dugme: "Pošalji link oglasa"
Sekundarno: "Izračunaj okvirni uvoz"
Tri koraka: "1. Pošalji oglas" → "2. Dobij obim i cenu provere" → "3. Odluči da li želiš plaćenu analizu".
SR/DE prikaz odvojeno, bez nove platforme.

DE naslov: "Gebrauchtwagen gefunden? Prüfe das Inserat vor der Anzahlung."
DE podnaslov: "Wir zeigen überprüfbare Angaben, offene Fragen und sinnvolle nächste Schritte. Keine Ferndiagnose und kein Ersatz für eine unabhängige Fahrzeugprüfung."
DE CTA: "Inserat zur Prüfung senden".

## Distribucija 14 dana

Dan 1–2: QA postojeće stranice, linka, formulara, odgovora, pravila privatnosti, test plaćanja i isporuke.
Dan 3–5: 3 originalna kratka videa (SR), isti vertikalni master 9:16 sa platformskim titlovima; YouTube Shorts, TikTok, Instagram Reels ako su nalozi dostupni. Objaviti i dve nemačke adaptacije ako DE putanja radi.
Dan 6–10: ponavljati teme koje proizvode kvalifikovane poruke, ne samo preglede. Pripremiti jedno iskustvo sa stvarnim dopuštenim test primerom; bez fabrikovanja recenzije.
Dan 11–14: pregled atribucije i odluka: nastaviti, promeniti ponudu ili zaustaviti.

Pored algoritma: 20 ručno odabranih relevantnih kontakata (auto-placevi, uvoznici, auto-grupe uz pravila zajednice), personalizovano, bez masovnog spama. Tržište: SR kupci DE automobila; DE poslovni partneri samo uz posebno definisanu B2B ponudu.

## KPI, ne lažni ciljevi pregleda

Pratiti po kampanji: prikazi, gledanje 3 s/50%, posete, započeti zahtevi, kvalifikovani zahtevi, poslate ponude, prihvaćene ponude, naplaćene isporučene usluge, refundacije, vreme rada i troškovi.
Primer računice, a NE prognoza: 10.000 pregleda × 1% dolazaka na sajt = 100 poseta; × 5% zahteva = 5 upita; × 20% kupovina = 1 kupac; 1 × 49 € = 49 € bruto prihoda pre troškova i poreza. Ovo pokazuje zašto milioni pregleda nisu nužni, ali i zašto viralnost sama ne znači zaradu.
Jedini odlučujući signal: plaćen, zakonito isporučen posao uz pozitivan doprinos marži. Stop uslov nakon 14 dana: 0 kvalifikovanih leadova → menjati kanal/poruku; leadovi bez kupovine → promeniti vrednost/ponudu/cenu; prodaje sa negativnom maržom → stop i korekcija.

## Alternativa tek nakon testa

B2B usluga za nemačke auto-servise: odgovaranje na propuštene upite, kvalifikacija i termin — putem gotovih kompatibilnih servisa, ne razvoj vlastite telefonije. Konkurencija sa vidljivom naplatom: HalloPetra od 149 €/mesec (https://www.hallopetra.de/) i Agentino od 49 €/mesec plus PDV (https://agentino.de/preise/). To dokazuje da POSTOJI komercijalna ponuda, a ne našu diferencijaciju niti tražnju za nama. Izvesti 10 razgovora sa servisima i pronaći merljiv nerešen problem pre bilo kakve izrade. Pozivi, transkripti i AI obrada zahtevaju GDPR/proveru pravnog osnova i lokalnih pravila.

## Završni princip

Ne kupovati domen, ne praviti aplikaciju, ne menjati produkciju. Prvi dokaz: kupac + stvarna uplata + stvarna isporuka. Tek zatim automatizovati ono što se ponavlja.
