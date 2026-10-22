# DaniniHub — konačna podela na 2 sajta (2026-10-22)

ODLUKA ZA RAZVOJ: dve javne adrese, jedan Hostinger Business paket:
1. https://daninihub.com → AUTOMOBILI: brend AutoDanini. Usluge: buyer protection, provera oglasa, koordinacija pregleda, uvoz DE–Balkan, Secure Deal Room, kupci/prodavci, kasnije oglasi i aukcije. Ne izmišljati aktivne partnere, vozila, licencirano posredovanje.
2. https://calije.daninihub.com → ČALIJE: zakup 345 i 648 m², parking u pripremi, B2B zakup celih placeva, firme/flote, sponsor. Ne predstavljati parking kao otvoren ili promet/provere kao završene.

PROVERENO:
- web javni koren daninihub.com trenutno indeksiran kao DaniniHub Transport & Logistics, DE verzija, nije automatski AutoDanini; korisnik navodi stariji sadržaj uvoza auta u postojećem sajtu. To zahteva zamenu naslovne strane i navigacije, ne samo URL promenu.
- calije.daninihub.com/sr indeksiran sa Čalije Parking / dve lokacije / projekat u pripremi. Kontakt kontakt@calije.daninihub.com. Uz parking, poslovni zakup parcele mora biti istaknut zasebno.
- AppDeploy dva aktivna prototipa: auto-danini-import-b2b-p8swk5, daninihub-calije-zakup-placeva-n1v9xy, oba već live samo na *.appdeploy.ai.
- AppDeploy AutoDanini je v12, admin/support u PR #59 GitHub samo staging, bez proverenog E2E; prazna ADMIN_EMAILS allowlist, nezavršen Support. SECURITY_GO_NO_GO_2026-10-22.md kaže NO-GO.
- Hosting: Hostinger Business korisnika, u planu produženje do isteka ~04.11.2026, bez kupovine VPS, AppDeploy Plus ili autodanini.com u ovoj fazi.
- Brevo API postoji, Hostinger mailbox kontakt@calije.daninihub.com. Stripe prikazan Buymeacoffee livemode=false; plaćanje isključeno dok se ne verifikuje.

OBAVEZNI KORACI PRE DNS / LIVE PREBACIVANJA:
A. Backup postojeće root site datoteke, DB, sadržaj i SEO URL mapu; zadržati postojeće logistik članke vredne prenosa ili 301 preusmerenje, bez gubitka sadržaja.
B. Odrediti trenutno tehnološko okruženje na Hostingeru za daninihub.com i calije poddomen; zaštititi postojeći calije site i DNS/MX/SPF/DKIM/DMARC.
C. Napraviti AutoDanini portabilan Node.js backend za Hostinger Business, jer AppDeploy auth/db/ai SDK nije jednostavno kopirati; odvojiti auth, podaci, AI, admin, support i Brevo, dokaza o uspesnom buildu.
D. Na privremenoj adresi test: SR/DE mobilni, SEO, kupac/nalog, cross-user auth, zahtvi, admin owner allowlist, support status/answer, backup restore, rate limits, AI budget; no true auctions, no Stripe live unless verified.
E. Ako GO, prebaciti daninihub.com na auto app i 301 mapirati stari koren/putanje. calije.daninihub.com ostaje za Čalije, dopuniti ponudu zakupa 345 i 648 m². Testirati certifikate, DNS, indeksiranje i email.
F. Objavljivanje 'coming soon' najave može ranije na postojećem automobilskom kanalu bez tvrdnji da su funkcije već dostupne.

NE TVRDITI DA JE DNS PROMENJEN ILI NOVI AUTO SAJT OBJAVLJEN. OVO JE ARHITEKTURNA ODLUKA I MIGRACIONI PLAN.
