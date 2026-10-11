# DaniniHub — razvojni pregled 11.10.2026

Status: audit izvornog koda. Aktuelan live screenshot i aktivni Hostinger deployment NISU potvrđeni.

## Šta kod zaista sadrži
- Node.js + Express CommonJS, NE Next.js.
- server.js: Express backend, /health, /api/runtime-version, mountPublicRuntime i mountImportOSRuntime.
- site-experience.js: dvojezični SR/DE Automotive sajt: početna, kalkulator, upit, poređenje oglasa, kupovina i vodiči.
- server-public-runtime.js: HTML shell sa velikim inline CSS, tamna paleta #080b0e i akcent #ff6d2d; više kartica, mala navigacija na mobilnom uređaju, stariji HTML generator.
- public/: već postoje fotografije danini-auto-uvoz.webp, danini-pregled-auta.webp i pregled-polovnog-automobila.webp; nije tačno da projekat nema slike. Foto-kompoziciju je potrebno pregledati preko screenshot QA.
- scripts/build-hostinger.js proizvodi statičke putanje u dist i daninihub-front/dist; nove rute moraju postojati i na Express serveru i u statičkom buildu.
- server-importos-runtime.js ima Import Passport 9,90 EUR, Stripe/PayPal, Brevo i kupovne dosijee u kodu; kod NIJE dokaz uspešne produkcione naplate.
- Trenutni main SHA: eee98ea9d0ed247f27acda770234fc6c4778a9cb (05.10.2026).

## P0/P1 dijagnostika
P0: Javna web indeksacija pokazuje starije Transport & Logistics stranice. Trenutni live vs main i Hostinger deploy ne znamo. Ne menjati produkciju bez validacije /health, /api/runtime-version i rollback-a.
P0: E2E naplata / izveštaj / email / baza testirati u sandboxu.
P1: Posetiocu treba jasna podela B2C Automotive, B2B Auto-kuće, Poslovna podrška, Portfolio. Bez mešanja svih proizvoda na istoj početnoj strani.
P1: Urediti mobile navigaciju koja sada koristi horizontalni overflow, tipografske hijerarhije, CTA prioritet, realne fotografie, pristupačnost i verodostojnost.
P1: Javni agent dashboard nije istovremeno dokaz sistema i prodaje, ne koristiti lažne statuse.
P2: GTM događaji, segmentacija upita, proverljiv CRM i SEO.

## Granica dozvole
Vlasnik je dozvolio redizajn i izmene sadržaja, ali produkcioni main, DNS, naplata i povratne baze se ne menjaju dok staging i vlasnik ne odobre rezultat. Ne pokretati masovni email.
