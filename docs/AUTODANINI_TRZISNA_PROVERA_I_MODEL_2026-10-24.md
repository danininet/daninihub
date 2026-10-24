# AutoDanini — poslovna odluka i proverljiv operativni model
Datum: 24. oktobar 2026. Jedini produkcioni domen: daninihub.com. Status: upoređena konkurencija i poslovne hipoteze, ne dokazana prodaja.

## Odluka
**Vredi testirati jednu usku nišu:** kupac iz Srbije ili balkanska auto-kuća već ima konkretan oglas u Nemačkoj i želi da pre puta/kapare razjasni stanje dostupnih dokaza, mogućnost pregleda, verovatne troškove do Srbije i tri modela dovoza. **Ne vredi graditi još jedan VIN-sajt ili generičku aukciju.** Ne obećavati sopstveni servis, ADAC status, garancije tehničke ispravnosti, gotov transport, već dogovorene partnere niti postojeće kupce bez dokaza.

## Konkurencija koja već ima cene
| Konkurent / izvor | Provereni javni okvir | Naša diferencijacija ili rizik |
|---|---|---|
| autoDNA | VIN istorija 24,99 €; tri provere 49,99 € | AI prepričavanje istorije i generički PDF nisu dovoljni za prodaju. |
| AutoScout24 vodič 2026 | Tipični stručni polovni-automobil pregledi približno 80–170 €, zavisno od obima | Naš video obilazak NIJE pregled na dizalici. |
| CarAudit | Mobilni tehnički pregled 289 €, sa dolaskom, navodi do 270 kontrolnih tačaka | Nikada ne predstavljati osnovni pregled kao stručnu mehaničku ekspertizu. |
| Carvago B2B | Prikazuje 10 € za proveru dostupnosti i 2% cene (min. 400 €) za punu uslugu kupovine; indikativno ~0,50 €/km za logistiku | B2B tržište nije prazno; cene su prema sajtu indikativne. |

Izvori, provereni 24.10.2026:
- https://support.autodna.com/contact-form
- https://www.autoscout24.de/informieren/ratgeber/sicherer-fahrzeugkauf/sicherer-autokauf-von-privat-der-leitfaden-fuer-gebrauchtwagenkaeufer/
- https://caraudit.dk/en/faq
- https://carvago.com/b2b

## Kako bih ja prodavao — PROBNI okvir, ne važeći cenovnik

**A. Provera oglasa i dokumenata: testna cena 59 €.** Kupac šalje URL, mesto i budžet. Rezultat: dokumentovana tabela činjenica, izjava prodavca, nedostajućih dokumenata, okvirnog ukupnog troška i sledećeg koraka. Ciljani obim 45–60 minuta. Bez kupljenog VIN izveštaja osim uz odobrenje kupca. Potrebno dokazati da je cena prihvatljiva, ne tvrditi da je tržišno potvrđena.

**B. Obilazak i live video u NRW: testna osnovna cena 149 € do 20 km od Duisburga**, samo kada prodavac odobri dolazak, a izvršilac potvrdi termin. Vidljivo stanje, fotografije, video, instrument-tabla i raspoloživa dokumenta. Ne podrazumeva probnu vožnju, dizalicu, skrivene kvarove, mehaničara ili garanciju. Za put izvan uključene povratne razdaljine 40 km testna formula 0,60 € po dodatnom povratnom kilometru, unapred u ponudi. Cenu revidirati na osnovu pravih vremena i troškova.

**C. Dovoz i logistika: isključivo individualna ponuda.** Uporediti samostalno na točkovima, angažovanog vozača i transporter. Potrebni: adresa, ispravnost auta, dokumenti, prevoznik, osiguranje i datum. Cenu transporta, posredovanja, dažbina i registracije prikazivati odvojeno.

**D. B2B sourcing:** pilot za 3 stvarna kandidata prema upitu jednog auto-placa, pisani izvori i dostupnost. Fiksnu naknadu/proviziju utvrditi tek uz definisan obim i prvog kupca. Platforma za aukcije, escrow i automatsku kupovinu tek posle potvrđenih partnera i pravnog modela.

**E. PDF vodič 49 €:** postojeći proizvod je zaseban i neaktiviran. Ako sadrži samo 10 strana, komercijalno je vrlo rizično da za 49 € bude glavna ponuda. Testirati stvarni uzorak kod najmanje 10 relevantnih potencijalnih kupaca; ne menjati cenu niti uključivati naplatu bez dokaza o isporuci i odgovarajućih uslova.

## Jedinična ekonomika (primer, ne stvarna zarada)
- Daljinski dosije 59 €: 45 minuta rada po 20 €/h = 15 €, administracija 5 €, naknade 2 €, pa ostaje 37 € pre fiksnih troškova i poreza.
- Terenski obilazak 149 €: 3 sata rada po 20 €/h = 60 €, 40 km po 0,35 €/km = 14 €, administracija/naknade 6 €, pa ostaje 69 € pre fiksnih troškova i poreza.
- 10 daljinskih + 5 terenskih poslova mesečno značilo bi 1.335 € prihoda i ilustrativnih 715 € doprinosa. Nema dokaza da će taj obim biti ostvaren. Rizik su neplaćeni upiti, propali obilasci, kilometraža, reklamacije i marketing.

## Put stvarnog kupca
Članak iz stvarnog izvora → besplatna početna provera → URL vozila → sačuvan upit sa referencom → provera dostupnosti i izvodljivosti → pisana ponuda sa obimom, rokom, cenom i ograničenjima → potvrda kupca → verifikovana uplata kroz vlasnički poslovni Stripe/PayPal nalog → stvarni pregled/transport → dokumentovani rezultat i račun ako je primenjivo.

Potvrda otvaranja WhatsApp-a nije dostavljena poruka. Transakcija nije plaćena zato što je preglednik otišao na success URL. AI nije stručni mehaničar. Rad sa kupcem mora biti vođen kroz stvarni predmet.

## Provera ranije podešene infrastrukture (bez destruktivnih izmena)
Postojali su Hostinger MySQL, .env, Brevo, Stripe i OpenAI podešavanja. Produkciono javno zdravlje nedavno je pokazivalo lokalni fajl, što NE dokazuje brisanje stare baze ili promenljivih. Proveriti aktivni Node release direktorijum, radni direktorijum procesa, postojeće environment settings, DB_HOST/DB_USER/DB_NAME i stariji DATABASE_URL, zatim dozvole i konekciju u logovima. Postojeći MySQL sadržaj i rezervna kopija imaju prednost. Ne resetovati korisnika, ne objavljivati ili prenositi ključeve, ne brisati tabelu. Tek kada baza proradi, testirati upit i Brevo u bezbednom probnom toku. OpenAI ključ se ne izlaže frontend-u; koristiti jasne kvote i ograničenja.

## Prodajni pilot: 14 dana, merljivo
1. Razgovarati sa 20 kupaca koji traže auto iz Nemačke i 5 srpskih auto-kuća o poslednjim stvarnim transakcijama.
2. Analizirati 10 realnih aktuelnih oglasa; svaki primer obeležiti kao oglednu analizu, bez privatnih podataka i bez tvrdnje da je vozilo kupljeno.
3. Poslati do 5 individualnih ponuda za stvarno izvodljive usluge.
4. Pokušati postići najmanje 2 naplaćena pilot-posla i zabeležiti vreme, troškove, izvore upita i reklamacije.
5. Bez naplaćenih pilot-poslova ne povećavati trošak reklama niti graditi novu aplikaciju; prvo revidirati kome i šta nudimo.

**Zaključak:** pravi biznis može biti dvojezični operativni posrednik za konkretno vozilo, dokumentovanu proveru i organizaciju prevoza. Konkurentsku prednost moramo tek dokazati stvarnim kupcima, dostupnim izvršiocima i kvalitetom nalaza — ne sloganom ili brojem AI agenata.
