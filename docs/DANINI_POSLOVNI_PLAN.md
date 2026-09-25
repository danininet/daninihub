# DANINI: poslovni i operativni plan

Ažurirano: 25. septembar 2026. Fokus: kupac iz Srbije/Balkana koji je pronašao polovan auto u Nemačkoj ili Švajcarskoj. Ovaj dokument je interni plan, ne tvrdnja o trenutnoj zaradi.

## Šta prodajemo

1. Besplatna početna procena: okvirna računica uvoza za Nemačku i praktični vodiči. Služi da kupac razume troškove i pošalje konkretan oglas. Nije carinski obračun.
2. Obilazak vozila: fotografije, video, zapažanja o vidljivom stanju i dostupnim dokumentima. Početna javna cena od 79 €; konačna cena zavisi od razdaljine i obima. Usluga se potvrđuje pisanom ponudom.
3. Pregled mehaničara: posebna ponuda kad stručni saradnik potvrdi dostupnost, obim i termin. Ne prodavati kao već garantovanu uslugu.
4. Dovoz vozila: ponuda vozača ili transportnog partnera po vozilu, dokumentima i relaciji. Cena po upitu; bez objavljivanja fiksne marže koja nije ugovorena.
5. Nabavka delova: tek po identifikaciji tačnog dela i potvrdi cene, dobavljača i dostupnosti.

## Put kupca i odgovornost

Oglas ili pretraga → zasebna stranica usluge → kalkulator ili vodič → formular sa oglasom → sačuvan upit sa referencom → obaveštenje vlasniku ako je Brevo podešen → ručna provera izvodljivosti i cene → pisana ponuda sa rokom → korisnik prihvata → opcionalna autorizacija plaćanja kada je uključena → izvršenje → naplata po dogovorenim uslovima.

Administratorski pregled `/owner/importos` čuva upite i omogućava kreiranje ponude. Nije zamena za ljudsku proveru oglasa i saradnika. Bez podešenih `DB_HOST`, `DB_USER`, `DB_NAME` podaci se čuvaju u lokalnom skladištu procesa, pa trajnost upita na produkciji mora biti proverena pre plaćenog marketinga. Bez `DANINI_ADMIN_SECRET` vlasnik ne može da pristupi konzoli. Bez `BREVO_API_KEY` i adrese pošiljaoca upit može biti sačuvan bez mejla; korisnik vidi referencu i rezervni email. Plaćanje je dostupno tek uz potrebne Stripe/PayPal ključeve i `DANINI_IMPORTOS_CHECKOUT_ENABLED=true`.

## Jedinična ekonomika: primer, ne prognoza

Za obilazak od 79 € primer raspodele: 79 € prihod − 30 € put i vreme − 4 € naknade i administracija = 45 € pre poreza i opštih troškova. Ako je put duži ili angažovan mehaničar, treba poslati višu pojedinačnu ponudu. Nemojte obećavati mehanički pregled po 79 €.

| Scenario mesečno | Naplaćeni obilasci | Prihod od obilazaka | Primer doprinosa pre fiksnih troškova i poreza |
| --- | ---: | ---: | ---: |
| Početni | 2 | 158 € | 90 € |
| Radni | 8 | 632 € | 360 € |
| Razvijen | 20 | 1.580 € | 900 € |

Pretpostavka u tabeli je 79 € po obilasku i 45 € doprinosa po naplaćenom obilasku. Stvarna marža zavisi od kilometraže, radnog vremena, poreza, reklamacija, naknada i saradnika. Prihod od dovoza i delova nije uključen jer nema potvrđenih cena ni ugovora. Ovo nije garantovana zarada.

## Akvizicija i sadržaj

- SEO: svaka usluga ima svoju stranicu, osam vodiča imaju odvojene adrese, meta opis i ulaz u kalkulator ili upit. Svaki vodič treba dopuniti proverljivim izvorima i datumom provere pre agresivne promocije.
- Video: konkretni primeri računice i pregleda sa jasnom napomenom šta je procena, a šta plaćena usluga. CTA vodi ka `/sr/kalkulator` ili `/sr/upit`.
- Grupe i preporuke: pokazati primer nalaza uz dozvolu vlasnika i bez podataka vozila/klijenta. Prvo potvrditi kapacitet za odgovore.
- Saradnici: za pregled, transport i delove voditi zapis o dostupnosti, dogovorenoj ceni i odgovornosti pre nego što se usluga obeća kupcu.

## Merila koja treba pratiti svake nedelje

Posete po stranici; otvoreni i uspešno sačuvani upiti; dostavljeni mejlovi; vreme do odgovora; upit→ponuda; ponuda→plaćena usluga; prosečna cena, kilometri i doprinos po poslu; broj reklamacija. Bez stvarnih podataka ne računati očekivani profit iz saobraćaja.

## Redosled puštanja u rad

1. Potvrditi da javni domen prikazuje novu verziju, fotografiju, stranice usluga i da API radi na produkciji.
2. Potvrditi trajno skladište i slanje mejla testnim upitom, pa pogledati isti upit u administratorskoj konzoli.
3. Proveriti slanje ponude, prikaz korisniku i plaćanje samo ako su ključevi i pravni/operativni uslovi spremni.
4. Tek zatim objaviti i meriti kanale promocije. Širiti usluge posle prvih stvarnih konverzija i potvrde saradnika.
