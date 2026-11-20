# DANINI — DVA PARALELNA PILOTA: CNC + AUTO
**Datum:** 6. novembar 2026.  
**Status:** Interna operativna specifikacija za proveru potražnje. **Nije produkciona funkcija.**  
**Odluka:** Jedan zajednički DANINI AI OS, dva odvojena prodajna toka. Bez izmene DNS-a, produkcionog sajta, plaćanja ili pravnih tekstova bez odobrenja.

## 0. Princip rada
- Najpre potvrditi **konkretne kupce i spremnost za plaćanje**, ne graditi dve aplikacije unapred.
- Svaki kontakt mora imati izvor, datum, dokaz namere i dozvoljen način komunikacije. Ne tvrditi da neko želi da kupi bez verifikacije.
- DANINI agenti mogu istraživati i pripremati, ali cene, troškove, tehničke tvrdnje, poruke i sve obavezujuće radnje mora proveriti i odobriti čovek.
- Ustav v10: najviše 3 pitanja po ciklusu, STOP kada nema dovoljno pouzdanih podataka, audit trag.

## A. AUTO — jedna veoma uska ponuda
**Ciljna grupa:** stanovnik Srbije koji je **već odabrao konkretan oglas** na nemačkoj platformi i razmatra kupovinu/uvoz, okvirna vrednost auta 15.000–35.000 €.

**Problem:** pre kapare ne zna da li oglas zaslužuje dalje troškove provere, da li su podaci o prodavcu i dokumenti za izvoz dovoljni i kolika je realna, neobavezujuća procena uvoza.

**Pilot ponuda:** `DANINI Auto PreCheck — 49 €` po jednom oglasu, **predlog za test; cena nije tržišno potvrđena**. Rezultat: sažetak oglasa, ključne crvene zastavice, spisak pitanja za prodavca, transparentni scenariji uvoza, poređenje sa dostupnim alternativama u Srbiji i konačna preporuka *vredi stručni pregled / nije opravdan / potrebni podaci*. 
**Ne uključuje:** VIN bazu bez licence, garanciju kilometraže, fizički pregled, nepogrešivu procenu uvozne dažbine, carinsko ili pravno mišljenje, organizaciju transporta, povraćaj nemačkog PDV-a ili kontaktiranje prodavca bez odobrenja.

**Postojeći resursi u `main`:** `public/danini-quickcheck.js` (računski scenariji i unos linka oglasa) i `public/danini-sales.js` (WhatsApp kontakt). Postojanje koda **nije dokaz da je produkcioni tok proveren**.

**Prvo pitanje kupcu:** "Imate li link konkretnog oglasa i šta vas pre kapare najviše brine — stanje, dokumentacija ili ukupan trošak?" Najviše tri pitanja u jednom ciklusu.
**Neutralna poruka za test (SR, samo gde su komercijalni komentari dozvoljeni):**
> Pronašli ste konkretan auto u Nemačkoj? Pre kapare proverite dokumentaciju prodavca, mogući dokaz o poreklu i ukupni trošak do registracije. Pripremamo DANINI Auto PreCheck izveštaj za jedan oglas (probna cena 49 €), bez tvrdnje da on zamenjuje fizički pregled. Ako vam ovo treba, pošaljite link oglasa i navedite šta vam je najnejasnije.

**Pokazatelji:** 10 razgovora sa kupcima koji imaju stvaran oglas; najmanje 3 eksplicitna prihvatanja vrednosti/cene ili 1 plaćen i kvalitetno isporučen pilot (tek nakon provere platnog i pravnog toka); evidentirati vreme utrošeno po predmetu i žalbe. Bez distribucije nije validan negativan test.

## B. CNC — jedna veoma uska ponuda
**Ciljna grupa:** mala/srednja nemačka industrijska firma sa konkretnim RFQ-om za **CNC strugane metalne delove po crtežu, u malim serijama**, i mala srpska CNC radionica sa dokazivim kapacitetom.

**Problem:** pronalaženje odgovarajućeg proizvodnog kapaciteta, komunikacija DE–SR, tehnička pitanja, uporedive ponude i pouzdani rokovi.

**Pilot ponuda:** `DANINI CNC Partner Finder`: identifikacija 2–3 odgovarajuća dobavljača, provera osnovnih kapaciteta i priprema uporedivih ponuda. **Predlog naplate:** provizija samo uz pisani dogovor i stvarnu realizaciju, hipotetički 3%; nije potvrđena tarifa niti ugovorena provizija.

**Proverljivi početni izvori (ponovo proveriti aktivnost i usklađenost zahteva):**
- EEN BRDE20250519003 — nemački kupac traži CNC dobavljače (među ciljnim zemljama Srbija), https://een.ec.europa.eu/partnering-opportunities/german-manufacturer-long-time-experience-cnc-machining-looking-suppliers
- EEN BORS20260105003 — srpska radionica otvorena za EU saradnju, https://een.ec.europa.eu/partnering-opportunities/serbian-company-field-mechanical-metal-processing-seeking-connections
**Napomena:** ovo nisu potvrđeni identifikovani kupci DANINI-ja ni potvrđeno tehničko poklapanje; EEN zahteva zvaničan postupak povezivanja.

**Tri osnovne kvalifikacije industrijskog RFQ-a:** nacrt i tolerancije; materijal/količina/rok; obavezni standardi kvaliteta. Bez tih podataka agent ne potvrđuje podudaranje.

**Upit na nemačkom za javno otvoren kontakt (ne slati bez potvrde dopuštenosti kanala):**
> Guten Tag, wir prüfen derzeit konkrete Beschaffungsanfragen für CNC-Drehteile in Kleinserien und passende Fertigungskapazitäten in Serbien. Wir vermitteln nur nach Prüfung von Zeichnung, Werkstoff, Toleranzen, Losgröße und Qualitätsanforderungen. Falls Sie aktuell einen offenen Bedarf haben, können wir Ihnen unverbindlich erläutern, welche Angaben für einen seriösen Lieferantenabgleich notwendig sind. Es erfolgt kein Angebot ohne Ihre Zustimmung.

**Pokazatelji:** 5 trenutno otvorenih, proverljivih RFQ-ova; 3 realno kvalifikovane radionice; najmanje 1 obostrano potvrđen kvalifikovani poslovni razgovor; najmanje 1 pisana izjava o prihvatljivom modelu naknade. Bez dogovora ne prikazivati zamišljenu proviziju kao prihod.

## C. Zajednički oslonac — DANINI AI OS
Jedan sistem za: izvor/lead evidenciju, istraživanje, kvalifikaciju, prevod DE/SR, pripremu ponuda, kontrolu rizika, audit i merenje. **Odvojeni tokovi i metrike**:
- AUTO: broj upita s oglasom → kvalifikovani → eksplicitna spremnost za 49 € → narudžbina → isporuka → vreme i neto doprinos.
- CNC: javni aktivni RFQ → tehnički potvrđen → dobavljač kvalifikovan → poslovni razgovor → dogovorena provizija → realizovana i naplaćena provizija.

Zabranjeno automatsko masovno kontaktiranje, lažni testemonijali, izmišljeni partneri, tvrdnje o sertifikaciji i obrada dokumentacije kupaca bez dozvole.

## D. Raspored 14-dnevnog testa
- **Dani 1–2:** proveriti aktuelnost zahteva; u AUTO isprobati QuickCheck kroz tri ilustrativna scenarija; u CNC potvrditi EEN put komunikacije i tehničke kriterijume; otvoriti evidenciju.
- **Dani 3–5:** AUTO — 5 kvalifikovanih razgovora sa ljudima koji već imaju oglas; CNC — 2 proverena RFQ-a i 2 radionice. Bez spam poruka.
- **Dani 6–10:** AUTO — još 5 kvalifikovanih razgovora; CNC — ukupno 5 RFQ-a i 3 radionice, provera podudaranja. Kod plaćanja proveriti i poresko-pravne uslove.
- **Dani 11–14:** meriti prihvaćenu cenu, naplatu (ako je dopuštena i funkcionalna), zadovoljstvo i troškove; CNC evidentirati interesovanje i dogovore o naknadi. **Nastaviti samo granu sa potvrđenim komercijalnim signalom**, obe ako obe prođu, niti jednu ako nijedna ne prođe.

## E. Jednostavna evidencija (jedan red = jedan upit)
`vertical,id,source_url,source_date,country,customer_type,buying_signal,problem,consent_contact,qualification,status,next_action,offered_eur,willingness_to_pay,paid_eur,hours_cost,partner_verified,notes`

Za početak **bez dodatne aplikacije** — evidencija može biti lokalna tabela. Ne unositi privatne podatke u javni GitHub repozitorijum.

## F. Ne menjati bez posebnog odobrenja
Produkcioni DNS i sajt, postojeći checkout, pravni dokumenti, javne cene, slanje kupcima, javne objave, troškovi reklama i spajanje PR-a u main. Dokument je spreman za reviziju, a ne aktivirano komercijalno lansiranje.
