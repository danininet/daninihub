# AutoDanini — Hostinger e-mail plan i Brevo integracija (2026-10-22)

## Konačna podela
- Glavni sajt: daninihub.com = AutoDanini
- Poseban sajt: calije.daninihub.com = Čalije / parking i zakup
- Provereno putem Hostinger Mail konektora 22.10.2026: pristupačan postojeći mailbox `kontakt@calije.daninihub.com`. NE BRISATI, NE MENJATI njegovo usmeravanje, DNS ili podatke. Konektor ne nudi opciju kreiranja novih mailboxova; samo hPanel korisnik.

## Uređivanje AutoDanini pošte bez nepotrebne pretplate
**1 stvarni sandučić, ako postojeći plan dopušta**:
- `kontakt@daninihub.com` — glavna javna adresa, ulazni upiti, reply-to za Brevo.
**Alias / preusmeravanje samo ako je dostupno i bez dodatne naknade**:
- `info@daninihub.com` — PRIORITET ako se već koristi na starom DaniniHub sajtu i u backend kodu; proveriti da li je to stvaran mailbox pre odlučivanja, nikako ga ne obrisati.
- `auto@daninihub.com` — namenski auto alias, sledeći prioritet.
- `support@daninihub.com` — otvara se nakon funkcionalnog Support Center-a.
- `partner@daninihub.com` — opciono nakon prvih B2B klijenata.
- Nema potrebe za plaćenim `no-reply` mailboxom. Kodovi i potvrde treba da imaju stvarnu Reply-To adresu.
- Admin/owner login mora biti privatno verifikovan i zaštićen MFA, ne pretpostavljati javni kontakt mailbox kao bezbedni owner identitet.
- Može se pokazati i email korisnicima kao `kontakt@daninihub.com` (uz WhatsApp). Ako je alias ograničen, prvo sačuvati `info@` radi kompatibilnosti sa postojećim sajtom, pa tek onda `auto@`.

## hPanel, bez menjanja postojećih DNS i Calije
1. Hostinger hPanel → Emails → Mailboxes → odabrati `daninihub.com` (ne `calije.daninihub.com`).
2. Proveriti da li već postoji `info@daninihub.com`, koji Email plan je prikazan i da li je uključeno Free Email / trial. Ako postoji funkcionalan `info@`, racionalnije je koristiti njega kao postojeći glavni inbox i napraviti `kontakt@` kao alias; ne kreirati novi mailbox samo radi estetike.
3. Ako ne postoji nijedan glavni inbox, napravi `kontakt@daninihub.com` i jaku jedinstvenu lozinku; uključi 2FA naloga, proveri prijem i odgovor.
4. U Email Alias odeljku dodavati samo dozvoljene adrese uz ograničenje plana. Alias nije drugi mailbox.
5. Ne prepisivati MX/SPF/DKIM/DMARC naslepo i ne dirati subdomain Calije. Test sa stvarnim pošiljaocem: primanje na glavnu adresu i na alias.
Zvanično: https://www.hostinger.com/support/1583217-how-to-create-and-manage-mailboxes-for-hostinger-email/
https://www.hostinger.com/support/5240877-how-to-set-up-an-email-alias-with-hostinger-email/
https://www.hostinger.com/support/4625828-parameters-and-limits-of-hostinger-email/

## Brevo transaction mail (already available API, no additional paid SMTP)
1. U Brevo Settings → Senders, Domains, IPs potvrditi/autentifikovati `daninihub.com`; proveriti DKIM i DMARC; proveriti saglasnost sa postojećim Hostinger DNS kako MX i postojeći SPF ne bi bili oštećeni. NIKAD slepo duplirati SPF/DMARC zapise.
2. Posle verifikacije podesiti u privatnom Hostinger env:
   `BREVO_API_KEY` = postojeći tajni ključ (nikad commit)
   `BREVO_SENDER_EMAIL=kontakt@daninihub.com` (ili proverena `info@daninihub.com`)
   `AUTODANINI_CONTACT_EMAIL=kontakt@daninihub.com` (ili `info@` ako je to jedini stvarni inbox)
   `AUTODANINI_OPERATIONS_EMAIL=kontakt@daninihub.com` (kasnije zaseban realan inbox)
   `DANINI_ADMIN_EMAIL=<postojeća i potvrđena primaoca operativnih poruka>`
3. Proveriti e-mail test: SR i DE kodovi za prijavu, potvrda zahteva, reply-to, spam i vraćene poruke (bez slanja na stvarne kupce).
4. Funkcionalnost ostaje isključena do testiranja pravog Hostinger MySQL-a i Brevo-a. `AUTODANINI_AUTH_ENABLED=false`, `VITE_AUTODANINI_AUTH_ENABLED=false` do GO.

## Provera u kodu 22.10.2026
- `core/autodanini-mail-policy.js`: štiti da sender, reply-to, operations budu samo @daninihub.com, bez Calije domena i spoljašnjih domena; izdaje samo javne adrese u rezultatu.
- `core/autodanini-customer-auth.js`: OTP šalje kroz Brevo sa pošiljaocem i Reply-To potvrđenim mail policy-jem; integracija ostaje opt-in.
- `tests/test-autodanini-mail-policy.cjs`: proverava normalizaciju, brend domen, zabranu Calije i nedostajućeg Brevo ključa.
- CI u `.github/workflows/autodanini-hostinger-startup-tests.yml` uključuje mail policy.
- Ovo samo proverava sintaksu i lokalnu politiku, ne stvarnu Hostinger e-mail kvotu, Brevo domensku autentifikaciju ni isporuku mailova.

## Sledeći programerski posao
- Bezbednost Brevo dvosmernog slanja, per-IP/per-email rate limits u javnim login rutama.
- Test sa Hostinger staging poštom i bazom, integrisati AI uz troškovni plafon, dovršiti Support Center sa vlasničkim MFA.
- Objavljivanje samo posle GO, bez promene trenutnog AutoDanini v12 dizajna.
