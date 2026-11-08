# DANINI — jedinstven brend, stvarna B2B potražnja i SEO kontinuitet
**Datum:** 8. novembar 2026.
**Status:** dokumentovana poslovna odluka i tehnički pilot, bez prijave Gewerbe, trgovine, naplate i aukcija.

## 1. Poslovna odluka
DANINI je glavni poslovni brend i budući digitalizovani sistem. **DANINI Business** obuhvata međunarodno B2B posredovanje, kvalifikaciju RFQ upita, istraživanje dobavljača, CNC kooperaciju i druge industrijske nabavke. **AutoDanini / DANINI Auto** čuva postojeću funkcionalnost i SEO teme (kupovina, uvoz, kalkulator, provera vozila). **DANINI Digital** = informativna demonstracija PDF proizvoda, šablona i softvera; **DANINI AI** = demonstracioni alati, buduće automatizacije i agenti. Aukcije su **buduća funkcija**, nikada predstavljati kao trenutno aktivne. Nemati "transportnu dispečersku službu" u glavnoj ponudi.

**Prvi dokaz monetizacije** treba tražiti u jednoj detaljno definisanoj usluzi, ne lansiranjem 5 paralelnih biznisa:
- A: B2B DE–Balkan *RFQ Qualification & Supplier Research* za industrijske komponente; npr. CNC, a kasnije modularni objekti samo uz stručnog partnera. Dokumentovan izvor, datum, količina, tolerancije i potrebne potvrde. Ne nuditi klasifikaciju ili sertifikaciju proizvođača.
- B: AutoDanini uporedni pregled oglasa i informativni uvozni dosije; opisati ponudu i čekati pravni status i dokaz naplativosti.
- C: AI automatizacija je *sredstvo isporuke* za A i B, ne opšte obećanje "agenti za sve".
- Plaćeni PDF vodiči, pretplate i aukcije tek uz posebnu pravnu i transakcionu proveru.

CNC proizvodnju, proizvodne kapacitete, tehničko projektovanje i kontrolu kvaliteta isporučuju stvarne stručne firme, a ne DANINI bez njihovog ugovora. Ne tvrditi da su firme partnerske ili verifikovane.

## 2. Drive — pregled relevantnih ranijih istraživanja
- **Global Buyer Acquisition (17.10)**: postoji javno oglašena namera kupovine kvalifikovanih B2B upita; oglasi i predložene stope NISU dokaz ugovorene prodaje niti našeg prihoda.
- **DaniniHub Buyer Match (19.10)**: 4 modularna tendera i 3 potencijalna proizvođača za kontejnerske sisteme. Prethodni datumi/rokovi ne važe kao sada aktivni kupci, i nijedan ugovor nije potvrđen.
- **FinishFlow, DemandPilot, CatalogProof (oktobar)**: potražnja za završenim digitalnim isporukama je realna, ali postoje jaki direktni konkurenti; rešenja nisu potvrđeno isplativija.
- **AutoDanini SEO mapa (23.10)**: korisni nacrti uvoznih i kupovnih vodiča, ne dokaz objave. Novi guide mora koristiti službene izvore i posebne SR/DE URL-ove.
- **Master Business Plan 11.10**: preporučivao B2B DE–Balkan podršku i AutoDanini kao paralelan kanal, dok Čalije ostaje posebno.
- **Jobcenter/Gewerbe operativni plan (8.11)** je nacrt sa pojedinim netačnim pretpostavkama; nikada ga ne smatrati automatskim odobrenjem, izuzećem ili bespovratnim finansiranjem. Nastaviti samo sa preduzetničkim planom koji opisuje stvarne korake.

Google Drive:
- https://docs.google.com/document/d/1xJ6jXfokIRYHTcHq6muwaO5mJTqsbv32EjEjQQpZaJk/edit
- https://docs.google.com/document/d/1Ob8pWSEHVCL4jg1O8oJO-45DKm_WG9rcbZm9ZMsXHR8/edit
- https://docs.google.com/document/d/1FzF7p7bUzLzaHYda8GMvbjE__UM5LN8csyfx_EJ75gk/edit
- https://docs.google.com/document/d/1seCx1bIEP8oJZ4HJCSzRpCENibHRWdtc4EPS9VsMIpY/edit

## 3. Tržišna provera i diferencijacija
Dobavljačke i industrijske mreže već postoje (Techpilot, wlw, Europages). DANINI nije nova "besplatna berza"; eventualna korist je **nemačko-srpski jezički most + precizna RFQ dokumentacija + praćenje rokova i kvalifikacije**, uz jasnu odgovornost kupca i stvarnog dobavljača. Tražiti 3 nezavisne firme koje potvrđuju problem, dozvoljen put komunikacije i uslovnu cenu **pre** izrade server marketplace-a. Za svaku potencijalnu ponudu: identifikovan javni izvor, datum, status, izvorni RFQ, proces, odgovorna osoba i prava pristupa.

## 4. Search Console — 09.10–05.11.2026
Izvoz "daninihub.com-Performance-on-Search-2026-11-08" sačuvan u Google Drive:
https://drive.google.com/file/d/1PDWV-nmkCvJ6o192l9_t3gZxTNiVqSiCKIRhn92PslM/view

Ukupno 17 klikova, 523 prikaza, približno 3,25% CTR. Brojevi obuhvataju povezane DANINI URL-ove/subdomene, a ne broj upita/kupaca. Kolona prosečne pozicije ima pogrešno formatirane datume; ne koristiti je bez oporavka originalnih vrednosti. Najvažnije stare stranice uključuju /de/wissen/deutschland-selbstimport (6 klikova, 112 prikaza) i /sr/kalkulator (0 klikova, 126 prikaza). Samo na osnovu tih podataka ne znamo konverzije niti prihod.

**SEO oporavak**: postojećim relevantnim starim URL-ovima dodati 301 ka istovetno korisnim novim sadržajima (uvozni vodič, kalkulator, relevantne stranice). Nikada preusmeravati sve na homepage. Nove informativne stranice /selbstimport.html i /uvoz-vodic.html imaju posebne kanonikale, recipročni hreflang i službene carinske izvore. Novi pilot Business i CNC su **noindex** do pravno-poslovne verifikacije. Google indeksaciju nakon objave treba posebno proveriti kroz Search Console; API pristup GSC Wizard trenutno blokira pretplata i ne treba izmišljati indeksaciju.

## 5. Funkcionalna arhitektura koja je smislena
**Javni web:** DANINI početna, Business, CNC, Auto, Digital, AI, kontakt, vodiči, pravne stranice. Sve oznake statusa iskrene. SR i DE.

**Pilot prikupljanje RFQ-a:** formular je *lokalni generator nacrta*, sa poljima tehnologija, materijal, količina, zemlja, rok i opšte napomene. Nema upload-a CAD nacrta, nema baze, nema automatskog slanja. Dugme kopira tekst ili otvara korisnikov WhatsApp nacrt za ručnu potvrdu.

**Budući server CRM:** tek nakon dozvola i politike privatnosti.
1. Jedinstven intake ID, vreme, kanal, geografsko tržište i saglasnost; antispam/rate limit.
2. AI klasifikuje zahtev i sprema nacrt odgovora (ne šalje automatski).
3. Status: zaprimljen → kvalifikovan → potrebna provera → ponuda (ako zakonski moguće) → prihvaćen/odbijen.
4. Pozadinski posao pronalaska izvora uz dozvolu, dnevnik vremena i cenu tokena.
5. Korisnik i operator odobravaju izlaz, slanje, kupovinu ili objavu.
6. Podaci i pristupi šifrovani, pravo brisanja, backup, audit log, kratki rokovi, bez tajnih podataka u klijentskom kodu.
7. U pravnom tekstu opisati stvarni obrađivač podataka i proces i proveriti pravne osnove, prava kupca, DSA ako se otvori marketplace, kao i eventualne posebne dozvole.
8. Nakon razvoja: e-mail, Brevo/CRM, faktura, Stripe/PayPal samo uz pismenu potvrdu aktivacije.

## 6. Akvizicija i SEO — put do kupca
Za DANINI Business: jedna vrlo konkretna DE stranica i primer RFQ dosijea **bez tuđih poverljivih podataka**; provera 3 aktualna javna RFQ-a ili buyer-initiated upita preko dozvoljenih kanala; partnerske preporuke i direktno prihvaćene platforme, a ne masovni unsolicited email.

Za AutoDanini: korisne informativne SEO stranice (uvoz, dokumentacija, pre-kapara), jasan CTA za pregled upita i stvarni follow-up. Stari SEO URL sa dokazanim prikazima mora ostati funkcionalan putem 301.

**Metrike**: GSC klikovi i non-brand upiti, CTA klikovi uz zakonitu analitiku, broj stvarno pristiglih upita, kvalifikovani upiti sa dozvolom, potvrđene ponude, stvarno plaćeni prihodi i efektivni sati. URL/UTM, datumi, poreklo. Nije pošteno upisivati "konverziju" ako nije potvrđen kontakt.

## 7. Granice izvršenja
Nije izvršena Gewerbeanmeldung, nije garantovana Jobcenter podrška, nisu aktivirani dugoročni nalozi, AI API, naplata, pretplate, aukcije ili escrow vozila. Ne prikazivati fiktivne zaposlene, partnerstva, kapacitete ili reference. Pravni tekstovi (Impressum, Datenschutz, AGB, Widerruf) zahtevaju dodatnu finalizaciju prema stvarnoj delatnosti pre lansiranja.

**Prioritet za sledeći komercijalni ciklus**: izabrati jedan definisan industrijski RFQ sa dozvoljenim pristupom, uporediti najmanje 2 stvarna dobavljača, testirati 3 intervjua sa potencijalnim B2B kupcima i izračunati radne sate, a ne graditi drugu aplikaciju u mraku.