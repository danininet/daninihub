# Stripe Sandbox za DANINI PDF

Worker koristi Stripe Checkout samo za vodič od 49 €. Test kupovinu pokreće operator. POST na `/api/danini/digital/stripe/checkout` prima tajnu iz zaglavlja `X-Danini-Sandbox-Access` i vraća Stripe URL. Korisnički interfejs prodavnice ne objavljuje ovo dugme. Test potvrda sa privremenim linkom ide isključivo na adresu iz konfiguracije.

Pre Sandbox aktivacije primeniti D1 migraciju `2026-11-12-danini-stripe-sandbox.sql`. U postojeći Worker upisati `STRIPE_SECRET_KEY` (test ključ sa dozvolom za čitanje naloga i kreiranje/čitanje Checkout sesija), `STRIPE_WEBHOOK_SECRET`, `DANINI_STRIPE_ACCOUNT_ID` (potvrđeni DANINI nalog), `DANINI_STRIPE_SANDBOX_ACCESS` (nasumična vrednost, najmanje 32 znaka) i `DANINI_STRIPE_SANDBOX_EMAIL` (kontrolisano DANINI sanduče). Postojeći D1, Brevo i tajna za potpis preuzimanja ostaju isti. Aktivacija u Worker-u zahteva `DANINI_STRIPE_SANDBOX_ENABLED=true`. Stripe webhook prima `checkout.session.completed` na `https://daninihub.com/api/danini/digital/stripe/webhook`.

Lokalna provera: `node scripts/test-stripe-sandbox-worker.mjs` (Node 24). SQLite izvršava stvarnu šemu, a Stripe i Brevo odgovori su simulirani. Provera pokriva odbijanje Live ključa i pogrešnog naloga, nedostajuću pristupnu tajnu, pogrešan potpis i iznos, evidentiranje uplate, ponovnu dostavu potvrde, ponovljeni webhook, potpisano PDF preuzimanje i neispravan token.

Stvarni Sandbox test ostaje otvoren dok se ne potvrdi pristup DANINI Stripe nalogu i dok se Sandbox ključevi ne postave u Worker. Povezani Buymeacoffee nalog nije korišćen. PayPal Sandbox webhook je registrovan, a PayPal test čeka upis ključeva i verifikaciju isporuke.
