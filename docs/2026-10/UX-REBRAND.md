# DANINIHUB — PRO VIZUELNI I UX STANDARD v2

Vizija: ozbiljan evropski automotive i poslovni brend sa stvarnim osnivačem. Prvi pogled u 5 sekundi odgovara: kome se obraćamo, šta rešavamo i kako poslati konkretan zahtev. Nema generičkih AI robota, lažnog tima, izmišljenih recenzija ni gomile nepovezanih proizvoda.

## Struktura, ne jedan beskrajni homepage
Auto B2C početna ostaje /sr/ i /de/ — primarna konverzija.
Nove jasno odvojene stranice:
- /sr/za-auto-kuce i /de/fuer-autohaeuser — B2B usluga, pilot, dokumentacija i komunikacija.
- /sr/dragan-zdravkovic i /de/dragan-zdravkovic — lice, istinita biografija, radno iskustvo, projekti, poziv na zapošljavanje/saradnju.
- /sr/poslovna-podrska i /de/business-support — konkretne aktivnosti, ishod, granice.
- /sr/cv i /de/lebenslauf — profesionalni CV i PDF samo na osnovu proverenih podataka.
- /sr/placevi-nis i /de/gewerbeflaechen-nis — veza sa Čalije; površine ne navoditi dok se ne razreši 945/993 m².
- /sr/kontakt i /de/kontakt — segmentirani upiti; bez mrtvih formi.
SR/DE prebacivanje u istom kontekstu. Navigacija 5 primarnih izbora: Automobili, Za auto-kuće, Poslovna podrška, O meni, Kontakt. Placevi kao suptilan link, ne velika hero ponuda.

## Dizajn tokeni
Pozadina topla svetla #F6F7F5; površine bela #FFFFFF; naslovi #112B3A (midnight); tekst #334B57; muted #62737A; primarni CTA #126C6B; sekundarni akcent #B86D43; border #DDE5E3.
Fontovi: moderan čist sans font sa sistemskim fallback-om, 16-18px body, responsive H1 clamp(2.25rem, 4.6vw, 4.5rem), maksimalno 65-75 znakova po redu u dugom tekstu. Hero 60% copy / 40% fotografija; whitespace; sekcije ritam 56-96px desktop, 36-64px mobile. Kartice maksimalno po 3, mobilni jedna kolona. Raditi fokus state, 4.5:1 contrast, reduced motion, bez teških biblioteka.

## Prvi pogled — Automotive SR
Eyebrow: Kupovina i uvoz automobila iz Nemačke
H1: Proveri auto i ukupne troškove pre nego što uplatiš kaparu.
Opis: Unesi podatke iz oglasa ili izračunaj troškove uvoza. Saznaj šta je poznato, šta treba proveriti i kako da doneseš odluku.
Primarni CTA: Izračunaj trošak uvoza → /sr/kalkulator.
Sekundarni CTA: Pošalji oglas na proveru → /sr/upit.
Pod CTA: Informativna procena · Pisani obim pre usluge · Odluka je tvoja.
Desno jedna autentična foto-kompozicija automobila; ne generisane lažne istorije/prodajni rezultati.
DE: Fahrzeug und Gesamtkosten prüfen, bevor Sie eine Anzahlung leisten. Dugme Importkosten berechnen / Inserat senden.
Ispod: QuickCheck (0€) → Passport (9,90€) → terenska provera samo kada postoji potvrđeni partner/termin. Koraci Oglas→Procena→Odluka. Razlika besplatno/plaćeno. FAQs sa details/summary. Trust blok sa Draganovim stvarnim imenom, fotografijom i jasnim profesionalnim granicama. Bez dupliranih formulara.

## Za auto-kuće / Für Autohäuser
SR H1: Upiti kupaca sa Balkana — jasna komunikacija i sledeći koraci.
DE H1: Balkan-Anfragen strukturiert bearbeiten statt Verkaufschancen zu verlieren.
Prikazati 7-dnevni pilot: dvojezična kvalifikacija, predlošci odgovora, evidencija statusa, checklist dokumenata i izveštaj. Bez obećanja prodaje. CTA Zatraži pilot / Pilot anfragen. Pilot cena 290–490€ hipoteza; ne objavljivati kao garantovani cenovnik.

## Dragan portfolio
SR: Dragan Zdravković — poslovna koordinacija, komunikacija i digitalni procesi DACH–Balkan.
DE prirodna verzija iste poruke. Realna fotografija (odobrena od vlasnika) sačuvana privatno na Google Drive; Codex ne sme da upisuje Drive-private URL u javni HTML. Napraviti optimizovan WebP preko dozvoljenog pristupa; ako transfer nije dostupan, vidljiv TODO sa jednom tačnom instrukcijom za dodavanje fotografije, bez zamene izmišljenom osobom. Dva dokaziva case studyja, DE/SR CV, CTA za zaposlenje i saradnju. Bez lažnih sertifikata i titula senior AI inženjera. Rad nije ograničen na 20 sati nedeljno.

## Tehnička implementacija
Postojeće javne slike u public: danini-auto-uvoz.webp, danini-pregled-auta.webp, pregled-polovnog-automobila.webp. Koristiti odgovarajući aspect ratio i object-position, alt i srcset. Slike renderovati prema nameni, ne dekorativno. AI 3x3 ilustracije ne predstavljati kao stvarne sastanke.
Izvući shell stilove u ponovo upotrebljiv CSS gde je bezbedno. Svesti HTML dupliranje na minimum. Sekundarne interakcije bez izmišljene animacije: mobile menu, FAQ, proces, validne forme i jasno stanje naplate.
Očuvati server-rendering i scripts/build-hostinger.js statički export, sitemap, hreflang, canonical, mobilne rute, alt, skraćeni menu, SEO. Ispitati compliance za GA4/kolačiće pre uključivanja.
KPI eventi samo stvarni: page_view, calculator_started, calculator_completed, lead_submitted, pilot_requested, checkout_started, paid_confirmed, report_delivered; nikad brojači bez podataka.

## Prijemni kriterijumi
E2E SR i DE rute, proverene mobile 360/390px i desktop 1280/1440px, screenshot Before/After, običan i keyboard user journey, sve CTAs rade ili jasno kažu zašto ne, nema mrtvih linkova ni mixed language, nema regresije kalkulatora / privatnih dosijea / API / checkout. U PR precizan spisak testova, ne tvrdnja bez izvođenja. Bez promene produkcije.
