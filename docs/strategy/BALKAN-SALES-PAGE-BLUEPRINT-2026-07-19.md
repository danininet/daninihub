# DaniniHub Balkan Sales Page Blueprint

**Datum:** 19. jul 2026.  
**Osnova:** Balkan Market Audit + pregled trenutnog `PublicLanding.jsx` i `PilotCheck.jsx`

## 1. Nalaz trenutnog stanja

Postojeća srpska početna stranica ima kvalitetnu osnovu:

- jasno navodi Balkan–DACH operativnu podršku;
- odvaja DaniniHub podršku od odgovornosti naručioca;
- koristi ograničeni pilot umesto nejasne trajne obaveze;
- ima kontaktni tok, privatnost i ručnu kvalifikaciju;
- javni demo i Pilot-Check već postoje.

Glavni prodajni problem nije dizajn nego fokus. Ista stranica trenutno istovremeno obraća pažnju na:

1. transportne kompanije;
2. osobe zainteresovane za praktičan uvod u transport;
3. buduće operativne saradnike.

Za Balkan B2B outreach ovo razvodnjava poruku. Kupac mora odmah da vidi da je stranica namenjena prevozniku ili špediteru koji radi prema DACH tržištu.

## 2. Odluka o arhitekturi

Srpska komercijalna stranica mora postati primarno B2B prodajna stranica za:

- međunarodne drumske prevoznike;
- špeditere;
- transportne firme sa nemačkim klijentima;
- firme sa preopterećenom ili nedovoljno pokrivenom dispozicijom.

Sekcije „Praktičan uvod“ i „Buduća saradnja“ ne brišu se, ali se sklanjaju iz glavnog prodajnog toka i vode na odvojene stranice ili u sekundarnu navigaciju.

## 3. Radni naziv ponude

**DaniniHub DACH Operations Desk**

Podnaslov:

> Operativna komunikaciona i dokumentaciona podrška za transportne firme sa relacijama Balkan–Nemačka, Austrija i Švajcarska.

## 4. Predložena struktura stranice

### Sekcija 1 — Hero

**Kicker:** DACH OPERATIONS DESK ZA BALKANSKE PREVOZNIKE I ŠPEDITERE

**Naslov:**

> Vaša firma vodi transport. DaniniHub sređuje informacije, komunikaciju i predaju prema DACH klijentima.

**Podnaslov:**

> Podrška za statuse, ETA, nemačku komunikaciju, dokumenta i odstupanja — u unapred dogovorenim granicama i bez preuzimanja vaših obavezujućih odluka.

**Primarni CTA:** Proverite da li pilot odgovara vašoj firmi  
Link: `/sr/provera-pilota`

**Sekundarni CTA:** Pogledajte operativni demo  
Link: `/sr/operativni-pult-demo`

Dokazi ispod CTA:

- AI priprema — čovek odobrava;
- nemački + jezici regiona;
- pilot bez automatskog produženja;
- pisano definisane odgovornosti.

### Sekcija 2 — Četiri realna problema

1. **Status nije dovoljno jasan za klijenta**  
   Vozač je poslao poruku, ali nije jasno šta je potvrđeno, koja je ETA i šta sme da se obeća.

2. **Nemačka komunikacija troši vreme**  
   Disponent mora da prevodi, proverava ton poruke i ponavlja iste informacije različitim učesnicima.

3. **Dokument postoji, ali status nije zatvoren**  
   CMR ili POD je poslat, ali nije provereno kome pripada, da li je čitljiv i ko još čeka potvrdu.

4. **Sledeća smena počinje ispočetka**  
   Otvorene odluke, rok i odgovorna osoba nisu dovoljno jasno predati.

### Sekcija 3 — Šta DaniniHub radi

- prima tekstualnu ili glasovnu informaciju;
- odvaja potvrđene činjenice od pretpostavki;
- označava šta nedostaje i ko mora da odobri sledeći korak;
- priprema nemačku i regionalnu komunikaciju;
- dokumentuje status, odluku, vreme i predaju;
- priprema osnovni pilot izveštaj.

### Sekcija 4 — Šta DaniniHub ne radi

- ne ugovara cenu prevoza bez pisanog ovlašćenja;
- ne menja rutu ili termin na svoju ruku;
- ne daje obavezujuće instrukcije vozaču;
- ne preuzima ulogu prevoznika, špeditera, Verkehrsleitera ili upravitelja prevoza;
- ne zamenjuje TMS;
- ne obećava uštedu ili prihod.

### Sekcija 5 — Kako izgleda Pilot Workspace

Tok:

`Sirova poruka → potvrđene činjenice → otvorena pitanja → rizik → odgovorna osoba → nacrt poruke → ljudsko odobrenje → zapis → predaja`

Obavezno prikazati screenshot ili interaktivni demo, ali ga nazvati radnim prostorom pilota, ne autonomnim AI disponentom.

### Sekcija 6 — Jedan konkretan scenario

Primer:

> „Stau kod Budimpešte. ETA nije jasna. Klijent očekuje istovar do 10:00. Vozač čeka odgovor.“

DaniniHub izlaz:

- potvrđeno: lokacija i zastoj;
- nepotvrđeno: nova ETA i prihvatanje kasnijeg termina;
- rizik: propušten slot i čekanje;
- odluka potrebna od: odgovorne osobe klijenta/prevoznika;
- pripremljeno: poruka vozaču, poruka klijentu i zapis za sledeću smenu.

### Sekcija 7 — Ograničeni pilot

1. bira se jedna relacija, proces ili mala grupa vozila;
2. pismeno se definišu zadaci, komunikacioni kanali i ovlašćenja;
3. dogovaraju se vreme podrške, odgovorne osobe i kriterijumi;
4. pilot se prati kroz radne zapise;
5. posle 30 dana radi se zajednička evaluacija;
6. nema automatskog nastavka.

### Sekcija 8 — Dokaz i poverenje

Uključiti:

- srpski video „Dispečeri vs. softver“;
- stručni TMS članak;
- javni Operations Desk demo;
- kratku biografiju Dragana relevantnu za transport i DACH komunikaciju;
- jasne pravne granice i privatnost.

### Sekcija 9 — Za koga pilot ima smisla

Pilot ima smisla ako firma:

- redovno vozi prema Nemačkoj, Austriji ili Švajcarskoj;
- ima najmanje jedan jasno definisan operativni problem;
- može imenovati osobu koja odobrava odluke;
- spremna je da unapred definiše obim i kanale komunikacije;
- želi dokaz rada, a ne neograničeni outsourcing.

Pilot verovatno nema smisla ako firma:

- traži da DaniniHub potpuno preuzme dispoziciju bez nadzora;
- ne može da definiše odgovornu osobu;
- očekuje garantovanu uštedu ili prodaju;
- nema stabilan poslovni proces ni osnovnu dokumentaciju.

### Sekcija 10 — Završni CTA

**Naslov:**

> Počnimo od jednog stvarnog procesa, ne od velike prezentacije.

**CTA:** Pokrenite proveru pilota  
Link: `/sr/provera-pilota`

## 5. Izmene postojećeg Pilot-Check-a

Postojeći Pilot-Check je funkcionalno dobar. Dodati samo polja koja direktno utiču na kvalifikaciju:

- zemlje DACH regiona sa kojima firma radi;
- tip prevoza: FTL, LTL, hladnjača, kontejner, intermodal, drugo;
- trenutna pokrivenost dispozicije: radno vreme i smene;
- najčešći incident ili informativni prekid;
- jezik komunikacije sa klijentima;
- da li postoji imenovana odgovorna osoba za odobrenje;
- da li firma želi komunikacionu, dokumentacionu ili continuity podršku.

Ne uvoditi automatsko odobrenje, cenu ili obećanje usluge.

## 6. Prodajni tok

1. Personalizovana email/LinkedIn/telefonska poruka.
2. Link ka odgovarajućem dokazu: video, članak ili demo.
3. Balkan prodajna stranica.
4. Pilot-Check.
5. Automatska potvrda samo prijema.
6. Dragan ručno pregleda firmu i potrebu.
7. Kvalifikovanom leadu se šalje Pilot Brief.
8. Fit razgovor.
9. Individualni pisani obim i cena.
10. Pilot Workspace se aktivira tek posle prihvatanja.

## 7. Prioritet implementacije

1. Preusmeriti glavni srpski CTA sa `#contact` na `/sr/provera-pilota`.
2. Dodati sekundarni CTA za demo.
3. Preoblikovati hero prema DACH Operations Desk poziciji.
4. Skloniti edukaciju i buduće saradnike iz glavnog B2B toka.
5. Dodati četiri realna problema i scenario „Stau Budimpešta“.
6. Dodati Pilot Workspace sekciju.
7. Ugraditi video i stručni članak kao dokaz.
8. Proširiti Pilot-Check minimalnim kvalifikacionim poljima.
9. Pokrenuti test sa prvih deset personalizovanih kontakata.
