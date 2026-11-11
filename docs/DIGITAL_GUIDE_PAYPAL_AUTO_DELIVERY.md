# DANINI — automatska PDF isporuka posle PayPal uplate (SR/DE)

**Status:** Kod postoji, ali ostaje namerno ISKLJUČEN dok se ne konfiguriše produkcija i ne izvrši sandbox/live test. PayPal e-mail adresa vlasnika je `draganganet@gmail.com`. Ne poistovećivati ovaj e-mail sa postojećim PayPal.Me identifikatorom `dragangaganet` — vlasništvo nad tim PayPal.Me linkom nije potvrđeno.

## Implementirano

- Cena **49,00 €**: kupac putem sigurne PayPal Orders v2 naplate kupuje Master Vodič.
- Cena **149,00 €**: isti PDF dobija gratis (**0 € doplate**) uz softverski paket. Pristup softveru *nije automatski* i ponuda od 149 € je onemogućena dok `DANINI_SOFTWARE_READY=true` ne potvrdi proverenu isporuku.
- Server sam kreira porudžbinu i iz PayPal API-ja proverava `COMPLETED`, tačan iznos, EUR, `custom_id` porudžbine i PayPal primaoca. PayPal.Me link ili snimak potvrde nisu dokaz koji otključava PDF.
- Nakon potvrde server šalje **privatan potpisan link koji važi 72 sata od potvrde uplate**. Direktno preuzimanje sa stranice potvrde je dostupno posle PayPal povratka, a PayPal webhook služi i za dostavu kada kupac zatvori stranicu.
- Ako je Brevo podešen, šalje e-mail sa privatnim linkom. Ako e-mail nije podešen ili isporuka e-maila zakaže, kupac i dalje može da preuzme vodič sa uspešne stranice. Za 100% automatizovanu e-mail isporuku obavezan je ispravno konfigurisan Brevo i funkcionalni test.
- Datoteka se **nikada** ne stavlja u `public/`, `dist/`, statični Hostinger build, javni GitHub niti u repository root.

## STVARNO STANJE — 11.11.2026 (Cloudflare produkcija)

- Javni `daninihub.com` trenutno služi Cloudflare Worker `workers/danini-intake.mjs` sa statičkim asset-ima. On implementira `/api/lead` i `/api/lead/status`, ali **ne izvršava** Node `digital-commerce.js` i **nema** aktivne `/api/danini/digital/*`, `/digital/paypal/return` i `/digital/download/*` rute. Zato nije dozvoljeno uključiti javno PayPal dugme samo na osnovu postojanja ovog modula.
- Hostinger nije aktivni hosting i **ne koristiti ga** za produkciju. Uputstvo ispod je **arhivski opis Node podešavanja**, a ne nalog za povratak na Hostinger.
- Jedini vidljivi povezani Stripe račun je TEST `Buymeacoffee` i nije DANINI live merchant. Ne koristiti ga za plaćanje.
- Postojeći PayPal kod za proveru uplate i PDF link je ponovo pregledan; ne postoje pristupačne PayPal merchant API akreditacije kroz povezane alate. Cloudflare API trenutno prikazuje da nema D1 baza; R2 listanje vraća 403 za dostupne naloge, pa privatna isporuka nije dokazana.
- Originalni PDF postoji na privatnom Google Drive-u, ID `1uPbL8LIY1zo9FgNUkkGs2Wm14fTThFoC`; nije javni fajl za besplatno preuzimanje.

### Obavezni produkcioni koraci na postojećoj Cloudflare infrastrukturi
1. Odabrati bez dodatne pretplate odobrenu Cloudflare Worker arhitekturu za PayPal Orders v2 i potvrditi prava na **D1** (privatna evidencija i idempotencija) i **R2** (privatni PDF). Proveriti ograničenja besplatnog plana pre kreiranja resursa.
2. Konfigurisati PayPal **business** live client ID, tajni ključ, tačnog verifikovanog primaoca i webhook ID kao šifrovane Worker secrets. Ne prepisivati podatke iz testnog Stripe naloga; ne unositi tajne u GitHub.
3. Napraviti bezbednu rutu za checkout (server kreira PayPal order), povratak i verifikaciju capture-a, webhook potpis, čuvanje statusa i kratkotrajni privatni download URL. Kupac mora da dobije kontrolisan link i transakcioni Brevo e-mail bez otkrivanja PDF-a ili naplate u slučaju greške.
4. Uraditi celokupan sandbox E2E: kupovina 49 €, neuspešno/otkazano plaćanje, replay i ponovljeni webhook, PDF download, istekao link, DE/SR mejl. Test sa live novcem i javna aktivacija traže posebnu potvrdu.
5. Dok uslovi nisu zadovoljeni, zadržati pošten status **nema automatske online naplate**. Proizvod od 149 € ostaje zaključan dok zasebna isporuka softvera nije proverena.

## Obavezno produkciono podešavanje — samo na serveru (Hostinger Node.js) — arhivski opis, ne koristiti kao aktivno hosting uputstvo

1. Proveriti da se **Node proces `server.js`** stvarno izvršava iza `https://daninihub.com`. Statički hosting nema PayPal backend i dugmad će ostati bezbedno deaktivirana.
2. Preuzeti originalni privatni PDF iz Google Drive-a: `DANINI_Auto_Biznis_Master_Vodic_2026_FINAL.pdf` (File ID `1uPbL8LIY1zo9FgNUkkGs2Wm14fTThFoC`); **ne menjati Drive vidljivost na „anyone with link”**.
3. Postaviti original u **privatni direktorijum van GitHub klona i van svakog public web-roota**. Primer: `/home/<hosting-user>/danini-private/DANINI_Auto_Biznis_Master_Vodic_2026_FINAL.pdf`. Koristiti stroge file permisije (npr. 600), pristup samo Node korisniku.
4. U Hostinger Environment Variables / privatni `.env` postaviti vrednosti:

```dotenv
DANINI_PUBLIC_URL=https://daninihub.com
PAYPAL_ENV=live
PAYPAL_CLIENT_ID=<iz PayPal Developer dashboarda, LIVE aplikacija>
PAYPAL_CLIENT_SECRET=<TAJNI LIVE ključ, ne unositi u GitHub>
PAYPAL_WEBHOOK_ID=<id verifikovanog PayPal webhooks listenera>
DANINI_PAYPAL_RECEIVER_EMAIL=draganganet@gmail.com
DANINI_GUIDE_PDF_PATH=/home/<hosting-user>/danini-private/DANINI_Auto_Biznis_Master_Vodic_2026_FINAL.pdf
DANINI_DIGITAL_SIGNING_SECRET=<slučajna vrednost duža od 32 znaka, strogo privatna>
DANINI_DIGITAL_CHECKOUT_ENABLED=false
DANINI_SOFTWARE_READY=false
DB_HOST=<produkcioni MySQL host>
DB_USER=<produkcioni MySQL user>
DB_PASSWORD=<tajna>
DB_NAME=<produkcioni MySQL database>
# Opcionalno za slanje PDF linka na e-mail (za automatski email obavezno):
BREVO_API_KEY=<tajna>
BREVO_SENDER_EMAIL=info@daninihub.com
```

**Važno:** PayPal Developer REST aplikacija mora da pripada odgovarajućem **PayPal Business** nalogu i da omogući Orders v2 API. Sama adresa e-pošte ne služi kao API ključ. Webhook endpoint u PayPal Developer Dashboard-u: `https://daninihub.com/api/danini/digital/paypal/webhook`. Prijaviti najmanje događaje `CHECKOUT.ORDER.APPROVED` i `PAYMENT.CAPTURE.COMPLETED`. Potpis događaja verifikuje server preko PayPal API-ja.

5. Za test koristiti PayPal **sandbox** nalog i `PAYPAL_ENV=sandbox` uz sandbox merchant email u `DANINI_PAYPAL_RECEIVER_EMAIL`. Posle proverenih pozitivnih i negativnih testova, promeniti kredencijale na live i postaviti `DANINI_DIGITAL_CHECKOUT_ENABLED=true`.
6. **Ne uključivati** `DANINI_SOFTWARE_READY=true` dok se stvarni softverski paket, način pristupa, licenca, podrška i rok isporuke ne potvrde. Bonus PDF se isporučuje kroz isti tok bez dodatne cene.
7. Pre javne naplate pravno proveriti **Impressum, ugovorne uslove, Widerruf za digitalni sadržaj, obavezne informacije pre kupovine, fakture i poreze**.

## Testovi / monitoring

```bash
npm ci
npm run check:syntax
npm run test:digital
npm run test:regression
npm run build
```

- `GET /api/danini/digital/status` treba da vrati `enabled:true` samo ako je sve podešeno, MySQL zaista radi i PDF je dostupan privatno.
- `POST /api/danini/digital/checkout` prihvata samo `guide` 49,00 € ili `software` 149,00 € sa eksplicitnim prihvatanjem uslova.
- Proveriti povratak iz PayPal-a, potpisan 72h link, preuzimanje PDF-a, negativne testove za pogrešnu cenu/merchant/capture status, slanje e-maila i neovlašćene linkove.
- Proveriti refund/widerruf rutinu, postupanje sa osporenim transakcijama, i oporavak u slučaju prekida servera.
- Kada je API isključen, stranice i dalje prikazuju katalog sa WhatsApp upitom, a **ne prikazuju direktno PayPal.Me plaćanje za digitalna dva proizvoda**.

Izvor: PayPal Orders v2 / webhooks dokumentacija: https://developer.paypal.com/api/rest/integration/orders-api i https://developer.paypal.com/payment-methods/webhooks/
