# AutoDanini Support Center — specifikacija v1 (21.10.2026)
Status: planirano, NIJE implementirano niti objavljeno.

## Načelo
Dogradnja postojećeg AutoDanini AppDeploy sajta, ne nova aplikacija. Podrška kupcima i incidenti sajta su odvojeni kanali. Prva verzija bez generativnog AI u obradi tiketa i bez automatskog slanja e-pošte dok slanje, privole i isporuka nisu provereni.

## Tok korisnika
Prijavljeni korisnik bira Pomoć → Novi zahtev; kategorije: pristup nalogu, AI analiza, oglas, zahtev za proveru vozila, naplata (tek kada postoji), ostalo. Obavezno kratak naslov i opis (max 2000 znakova), opciono URL bez kredencijala, kategorija. Prikaz potvrde sa ID-jem i statusom; lista isključivo sopstvenih tiketa. Korisnik može dodati poruku; ne može menjati admin status ili čitati tuđe tikete. Javni FAQ bez prijave. Javni kontakt za korisnike bez naloga ostaje postojeći WhatsApp, bez lažne tvrdnje da tiket postoji.

## Admin
Server-side allowlist kao u admin modulu, bez izmišljanja vlasničkog e-maila. Inbox tiketa sa statusima new / in_progress / waiting_on_user / resolved / closed, prioritetima normal / high / critical, dodeljivanjem i internim napomenama. Odgovor kupcu razlikovati od interne beleške. Audit promena sa identitetom operatora bez suvišnih ličnih podataka. Filtriranje, paginacija, izvozi uz dozvolu, pravila brisanja.

## Pravila zaštite
requireAuth + stroga provera userId za svaku korisničku rutu; admin check server-side; rate limiting; validacija dužine i URL-a; escapovanje tekstova; CSRF zaštita prema SDK mehanizmu. Ne prihvatati lozinke, bankovne kartice, zdravstvene podatke ili pasoše u slobodnim opisima; uklanjanje/eskalacija ako ih korisnik pošalje. Ograničen retention, pristup i pravo brisanja po usvojenoj GDPR politici. Bez priloga u v1 pre malware kontrole i politika skladištenja.

## Monitoring (zasebno)
Uptime provera javnih stranica preko GitHub Actions svaka dva sata tek kad workflow bude u default grani; neuspeh nije automatska SMS/e-mail garancija. Kritični runtime incidenti kroz AppDeploy i zaseban operativni postupak, bez izlaganja podataka kupaca. Proveriti stvaran mehanizam notifikacija i incident response pre lansiranja.

## Prihvatni testovi
1. Neprijavljen korisnik nema pristup tiketu.
2. Korisnik A ne može da pročita/menja tiket korisnika B čak ni sa ručno promenjenim ID-jem.
3. Samo admin može promeniti status i internu belešku.
4. Dva uzastopna slanja iste forme ne dupliraju tiket (idempotency key).
5. 400/429 za neispravne ili prečeste zahteve; bez curenja PII.
6. Operaterov odgovor nije prikazan dok nije eksplicitno objavljen korisniku.
7. FAQ nema AI trošak.
8. Error monitoring i korisnički tiketi se ne mešaju.

## Redosled
1. Objaviti i verifikovati već pripremljeni admin modul; potvrditi pravi administratorski e-mail.
2. Implementirati bazne tiket API-je i korisničku stranicu; bez AI.
3. Admin inbox tiketa + test autentifikacije i GDPR.
4. Aktivirati i testirati obaveštenja, merenje troškova.
5. Tek kasnije AI FAQ uz ograničenja i eskalaciju čoveku.

Bez menjanja domena, DNS-a, hostinga, plaćanja ili aukcija u ovoj fazi.
