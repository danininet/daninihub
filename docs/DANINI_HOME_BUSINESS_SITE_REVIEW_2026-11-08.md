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
