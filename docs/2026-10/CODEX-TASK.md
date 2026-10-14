# CODEX MASTER EXECUTION PROMPT v2 — DANINIHUB 2026

VAŽNO: OVAJ ZADATAK ZAHTEVA PRAVE IZMENE KODA, NE JOŠ JEDAN PLAN.
Repo: danininet/daninihub
Ciljna razvojna grana već postoji: design/business-automotive-2026-10
Početni main SHA: eee98ea9d0ed247f27acda770234fc6c4778a9cb
NE MERGE, NE DEPLOY, NE DNS, NE REALNA NAPLATA BEZ NAKNADNOG ODOBRENJA VLASNIKA.

Uloga: senior full-stack engineer, UX/art director, sigurnosni reviewer i DE/SR conversion copywriter. Radi po postojećem kodu, ne počinji rewrite u Next.js. Izvor je Express 5 CommonJS i statički Hostinger build.

PROČITAJ PRE KODA:
- docs/2026-10/SITE-AUDIT.md
- docs/2026-10/UX-REBRAND.md
- README.md, package.json, server.js, server-public-runtime.js, site-experience.js, server-importos-runtime.js, importos-store.js, core/importos-payments.js, scripts/build-hostinger.js i postojeće testove.
- Proveri /health, /api/runtime-version, live routing, CDN/cache. Ako live nije dostupno označi UNKNOWN, ne izmišljaj. Novi branch kreiran iz main, ali deployed production artefakt možda nije isti.

ZADATAK, SADA IMPLEMENTIRAJ:
1) Napravi kvalitetan profesionalni dizajn opisan u UX-REBRAND.md: svetla premium neutralna paleta, realne automotive fotografije iz public/, pregledan hero, jasne CTAs, odzivne i pristupačne komponente, dobar mobile header i footer, sadržaj razumljiv već na prvom ekranu.
2) Na /sr/ i /de/ očuvaj B2C Automotive put: kalkulator → rezultat → Passport 9,90€ → validno plaćanje/isporuka (tek nakon testa) i konkretan upit. Ne menjaj naslepo payment logiku, čuvaj postojeće URL-ove. Preoblikuj vizuelno, sadržajno i strukturalno.
3) Implementiraj sve SR/DE poslovne rute u UX specifikaciji i dodaj ih u Express routing, statički build Hostinger, Sitemap, canonical/hreflang, header/footer. Draganova biografija i CV samo verifikovane činjenice. Ne izmišljaj rezultate ili poslodavce. Izvorna vlasnikova fotografija se nalazi u privatnom Google Drive folderu projekta i sme se koristiti kao javna portfolio slika kada je ispravno pribavljena, ali ne sme se javno objaviti privatni Google Drive token/link ili predstavljanje AI slika kao stvarni događaji.
4) B2B ponuda: jednostavan pilot za nemačke auto-kuće koje rade sa Balkan kupcima. Odvojeno Business Support, portfolio i kontakt. CTA i forme kategorišu upit. Server-side validacija, zaštita od spam-a, saglasnost i stvarni rezultat; bez dekorativnih nedelotvornih formi.
5) Dinamički UX: interaktivni koraci, detalji/FAQ, stabilan mobile menu, opcioni dinamični kontekst iz oglasa, poštovanje prefers-reduced-motion. Ne troši na teške JS biblioteke.
6) P0 sigurnost: testiraj payment sandbox + webhook/idempotent delivery + email, tajne server-only, fail-closed store, admin auth, redirection, rate-limit. Kada integracija nije moguća, napiši tačan BLOCKER i spreči pogrešnu tvrdnju da je naplata aktivna. Ne koristite realne kartice.
7) Performanse: cilj LCP < 2.5s i CLS < 0.1, ali samo prijavi stvarno izmereno. Responsivna dostupnost 360, 390, 768, 1280 i 1440.
8) Napravi ili ažuriraj testove za nove rute, DE/SR copy, form validation, links, checkout no-regression, static export i SEO.
9) Pripremi i priloži BEFORE/AFTER screenshotove desktop i mobile ako browser u Codex okruženju postoji; ako nema, prijavi da screenshot audit nije izvršen.
10) Vodi status u docs/2026-10/IMPLEMENTATION-STATUS.md. Na kraju napravi DRAFT pull request prema main sa promenama i QA izveštajem. Nemoj ga spajati. Ne diraj produkcioni Hostinger i postojeći DNS.

PODACI I KONTROLA:
- Ne kupuj dodatni hosting, domen, pretplatu, model ili licence.
- Bez prepisivanja starog koda koji radi samo radi estetike.
- Ne mešaj DACH dispečerski raniji sajt i Automotive u nejasnu poruku.
- Nema nedokazanih prihoda, partnera, recenzija ili kapaciteta za fizičku proveru automobila.
- Tržišni GTM treba da bude proces koji meri qualified_lead, razgovor, ponudu i naplatu, ne automatizovani spam.
- Ne tvrdi da su naplata, e-mail i admin sigurni bez testova.
- Rezultat: profesionalno dizajniran STVARAN sajt i draft PR, ne generička prezentacija.

OBAVEZAN IZVEŠTAJ U PR:
Izmenjene datoteke, rute, test komande i stvarni rezultati, screenshotovi ili zašto nisu dostupni, javno/privatno razdvajanje, SEO, responsive, payment status, live vs repo mismatch, plan deploy-a i rollback-a. Potreban je pregled vlasnika pre merge/deploy.
