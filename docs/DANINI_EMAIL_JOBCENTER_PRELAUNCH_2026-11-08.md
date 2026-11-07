# DANINI | Aktivacija besplatnih email adresa, Brevo i bezbedan prelaz na komercijalni rad
Datum: 2026-11-08. STATUS: PLAN / NIJE AKTIVIRANO. Provera sa stvarnim nalozima je obavezna.

## Odluka
Hostinger hosting i sandučići su otkazani. DNS MX na daninihub.com i dalje pokazuje na mx1.hostinger.com i mx2.hostinger.com, ali sam MX nije dokaz da prijem radi.
Izbor bez novog hostinga: Cloudflare Email Routing (besplatno prosleđivanje) + postojeći Gmail kao inbox + Brevo (do 300 poruka/dan na Free planu) za transakcione poruke i marketing uz pristanak.
Alternativa ako je neophodan zaseban webmail sandučić koji može direktno slati i primati: Zoho Mail Forever Free u EU data centru (do 5 korisnika / 5GB, bez IMAP/POP/ActiveSync); tada ne koristiti Cloudflare Routing istovremeno za isti domen. Nikad ne uključiti dva različita MX provajdera nasumično.

## Adrese
- kontakt@daninihub.com — javni kontakt, odgovori i Impressum (VEĆ JAVNO OBJAVLJEN; treba ga aktivirati).
- reports@daninihub.com — Brevo transakcioni sender, porudžbine i PDF potvrde kada je prodaja legalno aktivna.
- support@daninihub.com — podrška (opciona ruta).
- Nijedna adresa NIJE potvrđena kao aktivna dok se ne primi odgovarajuća test poruka.
- Odredišno sanduče mora biti prethodno potvrđeno u Cloudflare Email Routing; korisnik ima postojeći Gmail koji želi koristiti kao inbox, a da se identitet ne objavljuje na sajtu.

## Cloudflare Email Routing — koraci u Dashboard-u (potrebna korisnička autentifikacija)
1. Cloudflare → Compute → Email Service → Email Routing → Onboard Domain → daninihub.com.
2. Cloudflare predlaže ZAMENU starih Hostinger MX i prilagođavanje SPF. Ne dorađivati nasumično zapis; koristiti DNS preporuke prikazane za taj nalog. Sačuvati postojeće DNS A/AAAA/CNAME i Workers custom domains — nema potrebe za promenom sajta.
3. Dodati i verifikovati destination Gmail; otvoriti i potvrditi email za verifikaciju.
4. Napraviti tri Routing Rules (kontakt, reports, support) ka verifikovanom destination Gmail. Nema catch-all ako nije potreban zbog spama.
5. Poslati test poruku sa DRUGE adrese na svaku novu adresu i proveriti inbox + spam. Tek nakon pozitivnih testova nazivati ih aktivnim.
6. Routing služi samo za PRIJEM/prosleđivanje; nije SMTP sanduče i ne šalje email sa domena. Direktno odgovaranje iz privatnog Gmaila prikazaće Gmail pošiljaoca dok se ne uspostavi odobren sender/SMTP.
Cloudflare docs: https://developers.cloudflare.com/email-service/get-started/route-emails/

## Brevo — odvojeno slanje, bez prepravke MX
1. U postojećem Brevo nalogu otvoriti Settings → Senders, Domains, IPs → Domains → autentifikovati daninihub.com.
2. Autentifikovati koristeći Brevo domen token i DKIM zapise koje KONKRETNI Brevo nalog generiše; ne izmišljati DNS vrednosti.
3. Usaglasiti SPF i DMARC (JEDAN SPF i JEDAN DMARC), posebno posle uključivanja Cloudflare Routing. Nepotpuni SPF ne menjati napamet.
4. Brevo sender 'AUTODANINI <reports@daninihub.com>' i reply-to 'kontakt@daninihub.com' mogu se uključiti tek kada su domen, pošiljalac i prijem testirani. Za newsletter tražiti zaseban marketinški opt-in.
5. Proveriti test transakcione poruke koristeći Brevo API/SMTP iz bezbednog serverskog okruženja; API ključ samo Cloudflare Worker secret i nikad u GitHub/frontend.
6. Ne slati lažne potvrde uspešne Stripe uplate ili izveštaje kao dostavljene.
Brevo docs: https://help.brevo.com/hc/en-us/articles/12163873383186-Authenticate-your-domain-with-Brevo-Brevo-code-DKIM-DMARC
Brevo free limits: https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan

## Poslovni/Jobcenter uslov
Korisnik navodi da trenutno nema Gewerbeanmeldung i prima podršku Jobcentera. Ne povezivati live Stripe niti naplaćivati pre usklađenja poslovne registracije i prijave relevantnih promena.
Ne tvrditi da prijava Gewerbe automatski gasi pomoć — BMAS navodi dopunsko Grundsicherungsgeld ako primanja ne pokrivaju potrebu, a Jobcenter Duisburg savetovanje/finansiranje osnivanja. Za Einstiegsgeld zahtev se podnosi PRE početka hauptberuflich samostalnog rada; odluka je pojedinačna, bez zakonskog prava.
Izvori: https://www.bmas.de/DE/Arbeit/Grundsicherung-fuer-Arbeitsuchende/Anspruchsvoraussetzungen/anspruchsvoraussetzungen-art.html ; https://jobcenter-du.de/faq/ ; https://www.arbeitsagentur.de/grundsicherung/arbeit-finden/einstiegsgeld-selbststaendigkeit ; https://service.wirtschaft.nrw/unternehmensgruendung/gewerbe-anmelden-online/
Zakonodavne izmene u 2026: Bürgergeld je preimenovan u Grundsicherungsgeld od 1.7.2026.

## Bezbedna aktivacija funkcija
- Javno: čiste informativne stranice, kalkulator sa pretpostavkama, logo, WhatsApp upit bez komercijalnog naloga, postojećih javnih podataka.
- Nepotpuno: integracija Brevo bez sender/domain statusa, Stripe nalog (povezan samo Buymeacoffee testmode), Cloudflare D1/R2 backend, pravni ugovor i refund/consumer rights.
- Pre live plaćanja: proveriti Business / Stripe merchant identitet, Gewerbe i Jobcenter obaveze, AGB, Impressum, Widerruf/consent, konkretne poreze, server webhook verifikaciju, idempotenciju, izvore podataka, AI transparentnost, GDPR i QA test.
- Direktan online scraping Mobile.de / AutoScout24 i automatski kontakt prodavca nisu uključeni; raditi samo sa dobrovoljno dostavljenim podacima ili odobrenim izvorom.

## Hitni prioritet
(1) Cloudflare sign-in za Email Routing i test prijema, (2) Brevo sender + DNS autentifikacija i test, (3) Jobcenter savetovanje / status pre prvog poslovnog ugovora, (4) povezivanje PRAVOG Stripe naloga u test režimu, (5) test narudžbina, (6) produkcioni launch kada legalno.
