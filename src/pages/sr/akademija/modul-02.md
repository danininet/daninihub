---
layout: ../../../layouts/AcademyLessonLayout.astro
---

**Status:** kompletan redakcijski materijal, još nije javno implementiran. **Jezik:** SR. **Trajanje vežbe:** okvirno 60–90 minuta (procena).

### Šta polaznik dobija
Na kraju izrađuje početni istraživački dosije: jednu jasno definisanu ciljnu grupu; tri dokumentovana signala problema; uporedni pregled najmanje tri alternative; tri hipoteze za proveru; jedan mali validacioni test. Odsustvo dokaza je prihvatljiv rezultat. AI odgovor nije tržišni dokaz.

### Korak 1 — Odredi problem i kupca
Napiši: „[Konkretna grupa] ima problem [opis] u situaciji [kada], a sada ga rešava [postojeće rešenje].” Izbegni „svi“, „male firme“ bez podgrupe i „treba im AI“. Primer A: male firme koje primaju višejezične B2B upite putem e-maila, a nemaju evidenciju odgovora. Primer B: kupci polovnih vozila iz regiona koji razmatraju konkretan nemački oglas pre puta i kapare. Ovo su **hipoteze segmentacije**, ne potvrđena potražnja.

### Korak 2 — Prikupi tri nezavisna signala
Za svaki signal zapiši **URL ili naziv izvora, datum pristupa, tačan navod/opažanje, kome se problem odnosi i koliko je pouzdan**.
1. Javno postavljeno pitanje ili zahtev u relevantnoj zajednici / forumu.
2. Postojeća naplativa konkurentska ponuda ili javna lista usluga, sa datumom i eventualno javnom cenom.
3. Ponavljajući problem u recenzijama, javnim komentarima ili formalnim vodičima (zvanični vodič potvrđuje proceduru, ali ne dokazuje spremnost da se plati).

Ako izvor ne možeš da otvoriš ili ne sadrži tvrdnju, označi **NEPOTVRĐENO**. Ne koristi AI-generisane citate i ne zaključuj da troje ljudi predstavlja celo tržište.

### Korak 3 — Uporedi konkurente i alternative
Upiši tri alternative, uključujući ručno rešavanje bez kupovine: **za koga**, **šta isporučuju**, **javna cena / cena nije objavljena**, **šta nije uključeno**, **izvor i datum**. Nemoj rangirati bez definisanog kriterijuma. Posebno uporedi **sopstvenu prednost kao proverljiv izlaz**, a ne „koristimo AI“.

### Korak 4 — Tri AI prompta za stvaran rad
**Prompt A — plan pretrage**
> Želim da istražim problem [PROBLEM] kod [USKA GRUPA] u [TRŽIŠTE]. Postavi mi najviše tri pitanja za preciziranje. Zatim sastavi plan javne pretrage: tipovi izvora, konkretni nemački/srpski izrazi za pretragu, koje informacije unosim u tabelu. Ne tvrdi da si pronašao izvore ako ih nisi otvorio.

**Prompt B — matrica konkurencije**
> Evo isključivo izvora koje sam proverio: [URL, datum, citat/opis]. Napravi tabelu za 3 konkurenta/alternative: ciljna grupa, ponuda, granice, javna cena ili „nije potvrđena“, prednosti i slabosti u odnosu na definisani problem. Za svaku tvrdnju veži izvor. Nemoj dopunjavati praznine pretpostavkama.

**Prompt C — odluka i test**
> Na osnovu moje matrice razdvoji POTVRĐENO, PRETPOSTAVKA i NEPOZNATO. Predloži najviše tri načina da bez dodatne kupovine proverim interesovanje, uz jedan etičan test sa merljivim kriterijumom i pravilom STOP. Ne izmišljaj kupce, prihode, konverzije ili citate.

### Korak 5 — Dva DANINI primera (metoda, ne dokaz prodaje)
**DANINI Business:** Hipoteza: firmi koja prima upite na nemačkom i srpskom koristi organizovan pregled nedostajućih podataka i nacrt odgovora. Traži javne B2B ponude za Anfragebearbeitung i primere problema sa zakašnjelim odgovorima. Proveri da li mala firma uopšte želi spoljnog pružaoca i koje podatke sme da deli. Potencijalni mikro-izlaz: jedna demonstraciona matrica upita, bez pravljenja stvarnog klijentskog slučaja.

**AutoDanini:** Hipoteza: kupcu vozila pre puta koristi strukturisana lista nedostajućih dokumenata i pitanja prodavcu. Poredi javne usluge oglasne analize, TÜV/DEKRA/ADAC pregled i samostalnu proveru. Jasno razdvoji digitalni dosije od mehaničkog pregleda. Potencijalni mikro-izlaz: jedna anonimna kontrolna lista za konkretan javni oglas, bez tvrdnje da je auto tehnički provereno.

### Korak 6 — Radna sveska (popuni samostalno)
| Polje | Moj unos |
|---|---|
| Ciljna grupa, zemlja, situacija | |
| Jedan problem i sadašnji način rešavanja | |
| Signal 1 — izvor, datum, dokaz | |
| Signal 2 — izvor, datum, dokaz | |
| Signal 3 — izvor, datum, dokaz | |
| Alternativa/konkurent A — ponuda, izvor, cena/status | |
| Alternativa/konkurent B — ponuda, izvor, cena/status | |
| Alternativa/konkurent C — ponuda, izvor, cena/status | |
| Potvrđene činjenice | |
| Pretpostavke i nepoznati podaci | |
| Jedan naredni test, datum, merilo, STOP | |

### Kriterijum završetka
**PASS:** definisana uska publika + tri proverljiva signala sa datumima (ili označeno koji nedostaju) + tri alternative + odvojene pretpostavke + jedno merljivo testiranje. **NEEDS_REVIEW:** izvori postoje, ali je pouzdanost ograničena. **STOP:** nema dokaza potrebe, isporuka je rizična ili bi zahtevala neodobrene troškove / pristupe.

**Privatnost:** Ne unosi u javne AI alate imena, mejlove, brojeve telefona kupaca, poslovne tajne ili poverljive dokumente. Ne šalji promotivne poruke bez odgovarajućeg pravnog osnova. Ovo nije garancija potražnje niti poslovnog uspeha.
