# DANINI: poslovni i operativni plan

Ažurirano: 25. septembar 2026. Fokus: kupac iz Srbije/Balkana koji je pronašao polovan auto u Nemačkoj ili Švajcarskoj. Ovaj dokument je interni plan, ne tvrdnja o trenutnoj zaradi.

## Šta prodajemo

### Novi ulaz: plan kupovine pre puta — 30.09.2026.

Kupac ne kupuje samo izveštaj: želi da zna koji od do tri oglasa ima smisla dalje proveravati u njegovom ukupnom budžetu. Besplatni alat `/sr/uporedi-oglase` poredi unete troškove sa rezervom, označava nepoznate stavke i sastavlja pitanja prodavcu. Nema rangiranja mehaničkog stanja iz teksta oglasa. Neprocenjen trošak nije automatski nula u stvarnom životu.

Ručna usluga `AD_REVIEW` je pregled izbora pre putovanja. Pre narudžbine se potvrđuju obim, cena i termin. Isporuka: tabela do tri kandidata, spisak dostupnih dokaza i nedostajućih podataka, pitanja prodavcu i preporučeni sledeći korak. Kontaktiranje prodavca, VIN izveštaj, carinski obračun i stručni pregled mogu biti posebno ugovoreni; nisu automatski deo usluge. Podaci bez izvora ne predstavljaju se kao potvrđene činjenice.

Operativni obrazac za svaku isporuku: budžet i namena kupca; izvor i datum podataka po oglasu; troškovi sa jasno označenim pretpostavkama; dokumenta koja nedostaju; šta je zaustavljajući problem; šta se može proveriti daljinski; kome i sa kojim pitanjem uputiti narednu proveru. Cilj je sprečiti nepotreban put i nejasnu kupovinu, ne garantovati ispravnost vozila.

Komercijalna validacija: prvo meriti vreme po analizi, broj zahteva za ponudu i broj prihvaćenih ponuda. Minimalna cena mora pokriti stvarno vreme, spoljne izveštaje ako su ugovoreni, naknade i administraciju. Još nema potvrđene tržišne cene ni dobiti za ovaj proizvod; ne uvoditi fiksnu cenu koja se zasniva na pretpostavljenih 15 minuta rada. Skupi terenski pregled ponuditi tek kada daljinska provera opravda sledeći korak.

Konkurencija je stvarna: carVertical navodi da istorijski izveštaj nije konačan dokaz kvaliteta vozila, a DEKRA već nudi stručne preglede. Diferencijacija DANINI-ja koju testiramo je objedinjena odluka na srpskom: izbor oglasa + ukupan budžet + otvorene dokumentarne tačke + naredna provera. Nije dokazano da takvu kombinaciju niko drugi ne nudi.

Izvori pregledani 30.09.2026:
- https://www.carvertical.com/help/about-the-service/does-the-carvertical-report-provide-definitive-proof
- https://www.dekra.de/de/fahrzeugbewertung/

Tehnički blokatori ostaju: produkciona baza trenutno prelazi na lokalni fajl; email, administratorski pristup i naplata nisu potvrđeni. Novi alat može da pomogne kupcu bez kreiranja zapisa, ali ručnu uslugu ne promovisati kao automatski završenu kupovinu dok se ti blokatori ne otklone.

1. Besplatna početna procena: okvirna računica uvoza za Nemačku i praktični vodiči. Služi da kupac razume troškove i pošalje konkretan oglas. Nije carinski obračun.
2. Obilazak vozila: fotografije, video, zapažanja o vidljivom stanju i dostupnim dokumentima. Početna javna cena od 79 €; konačna cena zavisi od razdaljine i obima. Usluga se potvrđuje pisanom ponudom.
3. Pregled mehaničara: posebna ponuda kad stručni saradnik potvrdi dostupnost, obim i termin. Ne prodavati kao već garantovanu uslugu.
4. Dovoz vozila: ponuda vozača ili transportnog partnera po vozilu, dokumentima i relaciji. Cena po upitu; bez objavljivanja fiksne marže koja nije ugovorena.
5. Nabavka delova: tek po identifikaciji tačnog dela i potvrdi cene, dobavljača i dostupnosti.

## Put kupca i odgovornost

Oglas ili pretraga → zasebna stranica usluge → kalkulator ili vodič → formular sa oglasom → sačuvan upit sa referencom → obaveštenje vlasniku ako je Brevo podešen → ručna provera izvodljivosti i cene → ponuda povezana sa brojem upita i poslata kupcu mejlom ako je Brevo podešen → korisnik prihvata → opcionalna autorizacija plaćanja kada je uključena → izvršenje → naplata po dogovorenim uslovima.

Administratorski pregled `/owner/importos` prikazuje upite i omogućava da se iz konkretnog upita pripremi ponuda, sačuva veza među njima i prati status. Nije zamena za ljudsku proveru oglasa i saradnika. Bez podešenih `DB_HOST`, `DB_USER`, `DB_NAME` podaci se čuvaju u lokalnom fajlu `runtime/importos-records.json`, pa trajnost tog fajla posle ponovnog pokretanja i objave na produkciji mora biti proverena pre plaćenog marketinga. Bez `DANINI_ADMIN_SECRET` vlasnik ne može da pristupi konzoli. Bez `BREVO_API_KEY` i adrese pošiljaoca upit može biti sačuvan bez mejla; korisnik vidi referencu i rezervni email. Plaćanje je dostupno tek uz potrebne Stripe/PayPal ključeve i `DANINI_IMPORTOS_CHECKOUT_ENABLED=true`.

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

1. Pokrenuti `npm run check:live` posle objave. Provera čita `/health`, `/sr/upit`, `/sr/kalkulator` i API bez kreiranja upita. Ako prijavi staru verziju ili nedostupan API, Hostinger mora da pokreće Node aplikaciju iz korena repozitorijuma (`npm start`), a ne samo da poslužuje `dist` ili `daninihub-front/dist`. Statički izlaz sadrži stranice, ali nema upis upita, kalkulator ni administratorski API.
2. Potvrditi trajno skladište i slanje mejla testnim upitom, pa pogledati isti upit u administratorskoj konzoli.
3. Proveriti slanje ponude, prikaz korisniku i plaćanje samo ako su ključevi i pravni/operativni uslovi spremni.
4. Tek zatim objaviti i meriti kanale promocije. Širiti usluge posle prvih stvarnih konverzija i potvrde saradnika.
