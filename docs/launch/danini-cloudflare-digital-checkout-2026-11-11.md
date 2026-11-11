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
- PDF original: postoji u privatnom DANINI Google Drive-u: `DANINI_Auto_Biznis_Master_Vodic_2026_FINAL_CLEAN_UTF8.pdf` (3.24 MB). **NIJE UVEZEN u D1**.
- Aktivni Cloudflare Worker ranije je imao Brevo i Turnstile tajne, ali **NEMA verifikovane PayPal tajne**, a R2 nije aktiviran. Zbog toga checkout ostaje namerno disabled.
- 149 € softverski paket ne otključavati dok nije spremna stvarna automatska isporuka softvera; korisnik dobija samo opis proizvoda.

## Jedine preostale tehničke operacije za produkcionu prodaju

1. **Privatni PDF import u D1**: preuzeti već postojeći FINAL_CLEAN_UTF8.pdf sa povezanog Drive-a u lokalni privatni folder. Bez objavljivanja PDF-a u GitHub. Lokalno: `node scripts/prepare-danini-pdf-d1.cjs /private/FINAL.pdf /private/danini-private-import.sql`. Zatim kroz postojeći Wrangler pristup: `npx wrangler d1 execute danini-commerce --remote --file=/private/danini-private-import.sql`. Proveriti `SELECT byte_length,chunk_count,ready FROM danini_digital_files WHERE sku='guide'` i SHA256. Bez ovog koraka nema checkout-a.
2. **PayPal kredencijali u postojećem Cloudflare Worker-u** (unose se isključivo kao secrets, ne u GitHub ni u chat): `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `DANINI_PAYPAL_RECEIVER_EMAIL`, `DANINI_DIGITAL_SIGNING_SECRET` (min. 32 znakova), `PAYPAL_ENV` (`sandbox` ili `live`). Prijaviti PayPal webhook URL `https://daninihub.com/api/danini/digital/paypal/webhook`. Sačuvati Brevo i Turnstile tajne.
3. **Sandbox test** s realnim PayPal sandbox nalogom: zasebna uplata samo testnim novcem → proveriti D1 `PAID`, PayPal capture, e-mail, preuzimanje, odbijanje nevalidnog tokena, duplicirani webhook. Isključivo nakon odobrenja poslovnog i pravnog statusa može `PAYPAL_ENV=live`, `DANINI_DIGITAL_LIVE_APPROVED=true`, `DANINI_DIGITAL_CHECKOUT_ENABLED=true`.

Sva podešavanja prodaje ostaju **isključena po zadatku** dok izvorni privatni PDF i kredencijali nisu bezbedno instalirani i testirani; implementacija ne izmišlja uspešnu naplatu.

## Nezavisna provera

`node --test tests/test-danini-cloudflare-commerce.mjs` pokriva pozitivan tok bez realnih API poziva i odbijanje nepotvrđenog plaćanja, pogrešne cene, primaoca, nevažećeg tokena i nepotpisanog webhook-a.

D1 migracija: `migrations/2026-11-11-danini-digital-d1.sql`. Produkciona D1 šema već je kreirana; migracija je ponovljiva bez brisanja podataka.
