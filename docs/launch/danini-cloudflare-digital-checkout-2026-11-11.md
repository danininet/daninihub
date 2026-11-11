# DANINI — Digitalni checkout na Cloudflare (11.11.2026)

## Rezultat implementacije

U postojećem `autodanini` Worker-u dodati su:
- `GET /api/danini/digital/status`
- `POST /api/danini/digital/checkout` (49 € PayPal; SR/DE, Turnstile, obavezne saglasnosti)
- `GET /api/danini/digital/paypal/return`
- `POST /api/danini/digital/paypal/webhook` (PayPal server-side signature verification)
- `GET /api/danini/digital/download/:reference` (HMAC 72h, samo potvrđeno plaćanje, bez javnog PDF-a).

Podaci o kupovini idu u postojeću Cloudflare D1 bazu `danini-commerce`. Postojeće Brevo i kontaktne rute nisu ponovo konfigurirane. Digitalna isporuka se dešava putem privatnih PDF segmenata u D1 (ne kroz javno dostupne `ASSETS`). Uspešna stranica i email prikazuju potpisani link samo kada je PayPal uplata server-side verifikovana, a primaoc, cena, valuta i ID narudžbine odgovaraju. Automatizovani testovi simuliraju kompletan ciklus bez stvarne naplate.

## Stanje na 11.11.2026.

- Cloudflare D1 tabele: `danini_digital_orders`, `danini_digital_files`, `danini_digital_pdf_chunks` — **KREIRANE**.
- PDF original: `DANINI_Auto_Biznis_Master_Vodic_2026_FINAL_CLEAN_UTF8.pdf` **UVEZEN JE U PRIVATNU CLOUDFARE D1 BAZU I VERIFIKOVAN** 11.11.2026. Stanje: `ready=1`, 99/99 blokova, 3.241.961 bajt, SHA-256 `b74e1f21d19ac60a38bc79c185d26fae79e490b2bafc4cff10e2f7665e6164db`. Original ostaje i u Google Drive-u.
- Aktivni Cloudflare Worker ranije je imao Brevo i Turnstile tajne, ali **NEMA verifikovane PayPal tajne**, a R2 nije aktiviran. Zbog toga checkout ostaje namerno disabled.
- 149 € softverski paket ne otključavati dok nije spremna stvarna automatska isporuka softvera; korisnik dobija samo opis proizvoda.

## Jedine preostale tehničke operacije za produkcionu prodaju

1. **Privatni PDF import u D1 — ZAVRŠENO I VERIFIKOVANO**: 99 segmenata uspešno upisano kroz Cloudflare D1 API. Nakon ponovnog čitanja kompletne baze, nezavisno izračunati SHA-256 identičan je originalu. D1 `danini_digital_files.ready=1`. Nije korišćen javni URL ni dodatni hosting.
2. **PayPal kredencijali u postojećem Cloudflare Worker-u** (unose se isključivo kao secrets, ne u GitHub ni u chat): `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `DANINI_PAYPAL_RECEIVER_EMAIL`, `DANINI_DIGITAL_SIGNING_SECRET` (min. 32 znakova), `PAYPAL_ENV` (`sandbox` ili `live`). Prijaviti PayPal webhook URL `https://daninihub.com/api/danini/digital/paypal/webhook`. Sačuvati Brevo i Turnstile tajne.
3. **Sandbox test** s realnim PayPal sandbox nalogom: zasebna uplata samo testnim novcem → proveriti D1 `PAID`, PayPal capture, e-mail, preuzimanje, odbijanje nevalidnog tokena, duplicirani webhook. Isključivo nakon odobrenja poslovnog i pravnog statusa može `PAYPAL_ENV=live`, `DANINI_DIGITAL_LIVE_APPROVED=true`, `DANINI_DIGITAL_CHECKOUT_ENABLED=true`.

Privatni PDF i D1 sloj su završeni. Produkciona prodaja ostaje **isključena** jer PayPal API kredencijali i pravo na live aktivaciju još nisu verifikovani; potrebno je sprovesti stvarni PayPal sandbox test. Implementacija ne izmišlja uspešnu naplatu.

## Nezavisna provera

`node --test tests/test-danini-cloudflare-commerce.mjs` pokriva pozitivan tok bez realnih API poziva i odbijanje nepotvrđenog plaćanja, pogrešne cene, primaoca, nevažećeg tokena i nepotpisanog webhook-a.

D1 migracija: `migrations/2026-11-11-danini-digital-d1.sql`. Produkciona D1 šema već je kreirana; migracija je ponovljiva bez brisanja podataka.
