# DANINI — PRODUKCIONA PROVERA AUTOMATSKE PDF PRODAJE
**Datum:** 2026-10-24 (14:09 lokalno, provereno sa GitHub Actions servera u 12:09 UTC)  
**Repo:** `danininet/daninihub` — `main`, integracija PR #82  
**PayPal Business nalog, prema potvrdi vlasnika:** `draganganet@gmail.com`  
**Proizvod:** privatni PDF od 49,00 €; softver od 149,00 € ostaje zaključan.

## Činjenični nalaz

GitHub-hosted runner je bez prijavljivanja i bez transakcije pozvao isključivo javne HTTP GET rute:

| End-point | Stanje 2026-10-24 | Značenje |
|---|---|---|
| `/health` | **PASS** HTTP 200, `storage=local-file` | Node backend radi, ali javlja skladištenje u lokalnoj datoteci, ne MySQL |
| `/api/runtime-version` | **PASS** `daninihub-sales-20260924` | API radi, marker je stariji statični identifikator, nije dokaz SHA verzije |
| `/api/danini/digital/status` | **BLOCKED**, `enabled=false` | Digitalna automatska naplata **nije aktivna** |
| `/sr/auto-biznis-vodic-i-softver` | **PASS** HTTP 200 | Nova SR forma se javno prikazuje |
| `/de/auto-business-guide-software` | **PASS** HTTP 200 | Nova DE forma se javno prikazuje |
| `/digital/download/DGD-000...?...token=INVALID` | **PASS** HTTP 503 | Neautorizovan pristup nije omogućio PDF; 503 jer je checkout deaktiviran |

**Dokaz:** https://github.com/danininet/daninihub/actions/runs/40092747529

Original `DANINI_Auto_Biznis_Master_Vodic_2026_FINAL.pdf` postoji u Google Drive-u pod ID `1uPbL8LIY1zo9FgNUkkGs2Wm14fTThFoC`, 3.295.809 bajtova. Drive dozvole su vlasničke, `shared=false`. **Ne treba menjati vidljivost PDF-a na „anyone with link“.** Privatna kopija na Hostinger Node serveru **nije proverena**.

## Produkcioni blokatori

1. **Durable MySQL:** web health pokazuje `local-file`. Potrebno pregledati DB promenljive, prava korisnika, konekciju i server logove. Backend fail-closed odbija digitalnu naplatu dok skladište nije MySQL.
2. **PayPal REST app:** nije bilo pristupa vlasnikovom PayPal Developer nalogu. Nisu provereni Live/Sandbox `Client ID`, `Client Secret`, merchant email koji PayPal zaista vraća kao payee, niti `PAYPAL_WEBHOOK_ID`. E-mail adresa **nije** API kredencijal. Konfiguracija zahteva prijavu vlasnika.
3. **Privatan PDF:** original postoji na privatnom Drive-u, ali apsolutna putanja `DANINI_GUIDE_PDF_PATH` na web serveru i permisije nisu proverene. PDF sme biti samo izvan statičkog web korena i repozitorijuma.
4. **Brevo e-mail:** nema produkcione potvrde `BREVO_API_KEY` i validnog/verifikovanog sendera. Nije izvršena probna isporuka u inbox.
5. **Legalna spremnost, NEPOTPUNA:** U `server-public-runtime.js` (`legalPage`) aktuelni uslovi ne opisuju konkretno 49 € digitalni PDF, pred-ugovorne informacije, realni trgovinski/poreski status, porez prikazan u ceni, obaveštenje o 14-dnevnom pravu odustanka i posebne uslove za njegovo ranije gašenje pri početku digitalne isporuke. Sadašnje polje `instantDeliveryConsent` na prodavnici ne kaže jasno da se pravo odustanka može izgubiti sa početkom isporuke. E-mail `notify()` ne sadrži potvrdu izričite saglasnosti i svesti o gubitku prava niti kompletnu potvrdu ugovora na trajnom nosaču. U `importos-store.js` transakcija trenutno ne čuva vremenski označen tekst/snapshot tih saglasnosti. Trenutna stranica privatnosti je samo kratak pasus; GDPR čl. 13 obično zahteva osnove obrade, rokove čuvanja, primaoce podataka i informacije o pravima. Usklađenost se ne sme pretpostaviti.
6. **Softver 149 €:** ostaviti `DANINI_SOFTWARE_READY=false` dok stvarni software pristup, licenca, obim i podrška ne budu potvrđeni.
7. **Dodatni dokazi nedostaju:** bez PayPal Sandbox aplikacije i produkcionog host pristupa nije moguće uraditi stvarnu test uplatu, webhook potvrdu, email isporuku niti proveriti PayPal payee pod stvarnim nalogom.

## Potrebno izvršiti redom

1. Preko vlasnikove zaštićene prijave u **PayPal Developer** napraviti/proveriti Sandbox Merchant REST aplikaciju (a potom Live), upisati webhook listener `https://daninihub.com/api/danini/digital/paypal/webhook`, prijaviti `CHECKOUT.ORDER.APPROVED` i `PAYMENT.CAPTURE.COMPLETED`. Čuvati Client Secret samo u Hostinger tajnom okruženju.
2. Preko **Hostinger hPanel** utvrditi stvarni Node server i putanju procesa, dijagnostikovati MySQL režim, postaviti privatnu PDF kopiju i tajne promenljive po `docs/DIGITAL_GUIDE_PAYPAL_AUTO_DELIVERY.md`. Nikada ne postavljati PDF u `public/`, build dist ili javni GitHub. Dok test nije završen, `DANINI_DIGITAL_CHECKOUT_ENABLED=false`.
3. Urediti i stručno proveriti Impressum, AGB, Widerruf belešku, informacijе o digitalnom sadržaju, dokumentovanje saglasnosti i potvrdu ugovora e-mailom, kao i GDPR obaveštenje. Ne izmišljati `USt-IdNr`, `Gewerbe` i druge statusne činjenice.
4. Sandbox test: kreiranje porudžbine 49 €, plaćanje, `COMPLETED` capture, tačan payee/EUR/SKU/custom_id, potpis webhook-a, jedinstven idempotentni capture, povratna stranica, privatni download, isticanje linka, pogrešan token, pogrešan iznos/primalac, odbijena uplata, zatvoren prozor kupca, automatski e-mail.
5. Potvrditi račun/fakturu i reklamacije/refund proces. Tek potom, uz izričito odobrenje vlasnika, podesiti Live i prebaciti `DANINI_DIGITAL_CHECKOUT_ENABLED=true`. Probnu **stvarnu novčanu uplatu** ne vršiti bez izričitog odobrenja vlasnika.
6. Produkcioni read-only smoke ponoviti preko GitHub Actions i zahtevati `enabled=true`, ali **ne izjednačavati to sa potvrđenom pravom transakcijom**.

## Pravne/reference veze

- PayPal developer: https://developer.paypal.com/api/rest/webhooks/rest/
- Orders v2: https://developer.paypal.com/api/rest/integration/orders-api
- § 356(6) BGB (digitale Inhalte): https://www.gesetze-im-internet.de/bgb/__356.html
- § 312f BGB (Vertragsbestätigung): https://www.gesetze-im-internet.de/bgb/__312f.html
- GDPR čl. 13: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng/

**Konačni status: `GO-LIVE = NE`** dok se gore navedeni blokatori ne zatvore. Test je neinvazivan: nije menjana produkcija, nisu izložene tajne, nisu izvršene stvarne transakcije.
