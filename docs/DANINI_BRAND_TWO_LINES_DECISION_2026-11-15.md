# DANINI — poslovna arhitektura i katalog ponude

Datum odluke: 15.11.2026  
Izvor odobrenja: vlasnik potvrdio nastavak postojećeg DANINI Master plana.  
Status: **USVOJENA POSLOVNA STRUKTURA / IMPLEMENTACIJA U PR-U — NIJE OBJAVLJENO**.

## Jedan brend, dve komercijalne oblasti

- **DANINI** je krovni brend, `daninihub.com` centralni sajt. Primarni jezici nemački i srpski; primarno tržište DACH, paralelni fokus Balkan.
- **DANINI Business**: digitalizacija administrativnih upita, jedan kontrolisan proces od prijema upita do nacrta odgovora, dokumentaciona i DACH–Balkan B2B podrška.
- **AutoDanini**: samoprocena oglasa i pratećih troškova, dosije kupovne odluke, opciona koordinacija nezavisne provere; transport sporedna koordinacija, ne glavna delatnost.
- **DANINI OS / AI Office**: *interna zajednička infrastruktura* za upravljanje upitima, zadacima, kvalitetom, odobravanjima, dokumentima i CRM. Kasnija komercijalizacija tek nakon interne validacije. Nije treći aktivan javni biznis.
- **Digitalni proizvodi** predstavljaju proizvode odgovarajuće oblasti, ne treću firmu ili samostalnu navigacionu oblast.
- **ONLYOFFICE**: opcionalna buduća komponenta, bez kupovine, implementacije ili javnih partner/licencnih tvrdnji.

## Proizvodi i statusi

### DANINI Business
1. **Business Check** — pregled jednog poslovnog procesa + prioritetne korekcije. Testna hipoteza cene 190 EUR. Ne objavljivati fiksnu cenu bez pravne/finansijske provere.
2. **Anfragebüro** — definisanje i uvođenje jednog toka upit → kvalifikacija → CRM → nacrt odgovora → odobrenje. Hipoteza cene od 690 EUR, zavisi od obima; bez obećanja aktivne automatizacije.
3. **Office Betreuung** — ograničeno mesečno održavanje *tek nakon uspešnih pilot-primeraka*. Hipoteza 249 EUR/mes. Nije javno aktivirana pretplata.
4. **DACH–Balkan B2B podrška** — RFQ/dobavljači, priprema CBAM i podizvođačke dokumentacije po pojedinačnoj ponudi, bez pravnih/poreskih/certifikacionih garancija.

### AutoDanini
1. Besplatna preliminarna kontrolna lista i poznati troškovi (samoprocena, bez preuzimanja oglasa i garancije).
2. **Entscheidungsdossier** — proverljiv dosije pre kapare; testna hipoteza 79 EUR, nakon stvarne potvrde kapaciteta i pravnog statusa.
3. Nezavisna terenska/video provera, samo uz potvrđene partnere i obim, po zasebnoj ponudi.
4. Postojeći Master PDF 49 EUR: sačuvati postojeći tok; produkciona prodaja/isporuka zahteva novu proveru.
5. Softverski paket 149 EUR, PDV usluga, delovi/transport: ne prikazivati kao gotove ili automatski dostupne dok se pojedinačno ne potvrde.

## Navigacija i korisničko iskustvo

- `/de/` i `/sr/`: DANINI brend i dve poslovne opcije.
- `/de/business/` i `/sr/business/`: jasno ograničena B2B ponuda, direktan poslovni e-mail kontakt.
- `/de/auto-check/` i `/sr/auto-check/`: očuvani postojeći automobilski savetnik sa tri pitanja, plus /de/ai-savetnik/ i /sr/ai-savetnik/.
- `/auto/`: zadržati postojeći AutoDanini legacy/SEO katalog i validna preusmerenja.
- Krovni header: DANINI, Business, AutoDanini, metod, o nama, kontakt. Bez WhatsApp primarnog CTA.
- Bez reči „live AI“, referenci, brojeva klijenata ili gotovih partnerstava bez dokaza.

## Pravila release-a

- Ne spajati ovaj PR i ne objavljivati produkciju dok ne prođu Astro build, B2B static, browser QA, provereni SEO/redirekti, responsivni kontrast, i pregled vlasnika.
- Otvoreni **PR #211** za Vehicle AI ostaje zasebna funkcionalna linija; proveriti kompatibilnost i bezbedan fallback pre merge-a. Workers AI ne aktivirati bez potvrđene finansijske zaštite.
- Centralni B2B formular se ne smatra aktivnim dok stvarni Turnstile → Workflow/D1 → Brevo → Gmail → potvrda ne prođe E2E. Do tada poslovni e-mail je vidljiv fallback.
- Pravni/Jobcenter/Gewerbe/PDV status proveriti pre prihvatanja narudžbina i aktivne naplate.
- Nema novih pretplata, domena, licenca, stvarnih AI poziva ili izmena produkcionih tajni bez zasebnog odobrenja.

## Sled prioritetnih zadataka

1. Završiti i QA testirati dvojezične stranice i nav bez gubitka AutoDanini funkcije.
2. Dokazati B2B prijem i e-mail isporuku od kraja do kraja.
3. Rešiti PR #211 i AI troškovna ograničenja.
4. Interni AI Office: predmeti, statusi, odobravanje, evidencija troškova.
5. Tek potom pravno dozvoljena pilot prodaja i merenje stvarnih upita/prihoda.

**Strategija 60% Business / 30% AutoDanini / 10% QA/merenje** predstavlja raspodelu fokusa, ne novca niti prognozu prihoda.

Reference:
- DANINI Master (Drive): https://docs.google.com/document/d/1mKRKqRMYfjcJKg58agVCnHdU_29uaR8gjt6oXrliJrg/edit
- Plan 2027–2029: https://docs.google.com/document/d/1iKdvD4VZ5ezUxdTzOUVr0fD0fObSkDcX9Hd7tBpKG1Q/edit
- Dokumentacija B2B: docs/b2b/READINESS.md
- Vehicle AI: https://github.com/danininet/daninihub/pull/211
