'use strict';
/* DANINI commercial ecosystem: EUR-only illustrative pricing, no insurance sales or guaranteed customs outcomes. */
const P='/images/';
const storefront=require('./danini-business-store');
const IMG={
  driving:'DANINI_Kartica_04_Zoll_Tablice_Dovoz_Na_Tockovima.jpg',
  service:'DANINI_Kartica_05_Originalni_OE_Delovi_Servis.jpg',
  b2b:'DANINI_Kartica_06_B2B_Sourcing_I_Preuzimanje.jpg',
  truck:'DANINI_Kartica_03_Dovoz_Transport_Srbija.jpg'
};
const PATHS={
  sr:{parts:'/sr/oe-delovi-i-servis',b2b:'/sr/b2b-pretraga-vozila',place:'/sr/auto-plac-calije',article1:'/sr/vodic/provera-oglasa-pre-kapare',article2:'/sr/vodic/uvoz-zoll-eur1-i-dovoz'},
  de:{parts:'/de/oe-teile-und-service',b2b:'/de/b2b-fahrzeugsuche',place:'/de/autoplatz-nis-calije',article1:'/de/wissen/provera-oglasa-pre-kapare',article2:'/de/wissen/uvoz-zoll-eur1-i-dovoz'}
};
const TITLES={
 sr:{parts:'Originalni OE delovi i servis | DANINI',b2b:'B2B pretraga vozila po narudžbini | DANINI',place:'Auto-plac Čalije Niš za zakup | DANINI',article1:'Provera oglasa pre kapare: 7 koraka | DANINI',article2:'Uvoz automobila: EUR.1, Zoll, PDV i dovoz | DANINI'},
 de:{parts:'OE-Teile und Wartung | DANINI',b2b:'B2B Fahrzeugsuche auf Auftrag | DANINI',place:'Autoplatz Niš Čalije zur Miete | DANINI',article1:'Gebrauchtwagenanzeige vor Anzahlung prüfen | DANINI',article2:'Serbien-Import: EUR.1, Zoll und Transport | DANINI'}
};
const routeMeta={};
for(const lang of ['sr','de'])for(const [key,path] of Object.entries(PATHS[lang]))routeMeta[path]={lang,key:'eco_'+key,title:TITLES[lang][key],description:lang==='sr'?'Praktična DANINI usluga uz proveru dostupnosti i jasno objašnjene troškove u evrima.':'Praktischer DANINI Service mit Verfügbarkeitsprüfung und transparenten Euro-Kosten.'};
const route=(lang,key)=>PATHS[lang][key.replace(/^eco_/,'')]||null;
const media=(file,alt)=>'<img src="'+P+file+'" alt="'+alt+'" width="1376" height="768" loading="lazy" style="display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:8px">';
const header=(small,title,lead)=>'<p class="eyebrow">'+small+'</p><h2>'+title+'</h2><p class="lead">'+lead+'</p>';
const section=inner=>'<section class="section danini-eco">'+inner+'</section>';
const card=(title,text)=>'<article class="card"><h3>'+title+'</h3><p>'+text+'</p></article>';
const button=(link,title)=>'<a class="btn secondary" href="'+link+'">'+title+' →</a>';
const order=(service)=>'<div class="danini-order-slot" data-service="'+service+'"></div>';
const wa='https://wa.me/4915730916621';
const DISCLAIMER={
sr:'Sve navedene servisne i transportne cene predstavljaju ilustrativne raspone u € (EUR), ne obavezujuću ponudu ili potvrđenu uštedu. Kvarovi, vrsta vozila, poreklo, osiguranje i uvozne dažbine proveravaju se pojedinačno. DANINI ne prodaje osiguranje, ne izdaje EUR.1 i ne donosi carinska rešenja.',
de:'Alle genannten Service- und Transportpreise sind unverbindliche Beispielspannen in € (EUR), keine Garantie für Ersparnisse. Fahrzeug, Ursprung, Versicherung und Zollabgaben müssen im Einzelfall geprüft werden. DANINI verkauft keine Versicherungen, stellt kein EUR.1 aus und trifft keine Zollentscheidungen.'
};
function home(lang){
 const sr=lang==='sr', paths=PATHS[lang];
 const cards=[
 {file:IMG.driving,num:'04',title:sr?'Dovoz na točkovima i Zoll tablice':'Überführung auf eigener Achse & Ausfuhrkennzeichen',lead:sr?'Kupac vozi sam ili koordiniramo vozača, tablice, osiguranje i rutu.':'Selbst fahren oder Fahrer, Kennzeichen, Versicherung und Route koordinieren.',link:sr?'/sr/dovoz-auta':'/de/ueberfuehrung'},
 {file:IMG.service,num:'05',title:sr?'OE delovi i servis po VIN-u':'OE-Teile und Service nach VIN',lead:sr?'Provera delova, mali/veliki servis i uporedni rasponi DE vs Srbija.':'Teileabgleich, Wartungsplan und Kostenspannen DE vs Serbien.',link:paths.parts},
 {file:IMG.b2b,num:'06',title:sr?'B2B nabavka vozila + Čalije':'B2B Fahrzeugsuche + Niš',lead:sr?'Do tri kandidata za firmu, opcija pojedinačne nabavke i poslovni plac u Nišu.':'Bis drei Kandidaten für Unternehmen, Sourcing und Gewerbefläche in Niš.',link:paths.b2b}
 ];
 const plans=sr?[
 ['IMPORT PASSPORT','9,90 €','Skener oglasa, sedam pitanja prodavcu, status EUR.1 / porekla i PDF dosije (na osnovu dostupnih podataka).'],
 ['OE SERVIS & DELOVI','19,00 €','VIN + HSN/TSN kada postoje; lista kompatibilnih OE/OEM delova i plan održavanja.'],
 ['SVE PRE KUPOVINE · COMBO','29,90 €','Import Passport + OE plan + kontrolna lista izvozne tablice, osiguranje i ruta.'],
 ['TRANSPORT KOORDINACIJA','59,00 €','Zahtev za ponude CMR prevoznika ili procena dovoza na točkovima; cena samog dovoza nije uključena.'],
 ['FIELD CHECK NRW','od 79 €','Pregled vidljivog stanja uživo, dostupnost i putni trošak po ponudi.'],
 ['B2B · DO 3 VOZILA','99,00 €','Ciljana pretraga do tri kandidata sa proverom dostupnih podataka.']
 ]:[
 ['IMPORT PASSPORT','9,90 €','Inserat-Check, sieben Verkäuferfragen, Ursprungs-/EUR.1-Status und PDF-Dossier aus verfügbaren Angaben.'],
 ['OE SERVICE & TEILE','19,00 €','VIN + HSN/TSN soweit vorhanden; OE/OEM-Teileliste und Wartungsplan.'],
 ['ALLES VOR DEM KAUF · COMBO','29,90 €','Import Passport + Teileplan + Checkliste für Ausfuhrkennzeichen, Versicherung und Strecke.'],
 ['TRANSPORTKOORDINATION','59,00 €','CMR-Transportangebote oder Überführungsplanung; reine Frachtkosten nicht enthalten.'],
 ['FIELD CHECK NRW','ab 79 €','Sichtprüfung vor Ort; Verfügbarkeit und Anfahrt nach Angebot.'],
 ['B2B · BIS 3 FAHRZEUGE','99,00 €','Gezielte Suche nach bis zu drei Kandidaten und Prüfung verfügbarer Daten.']
 ];
 return section(header('DANINI · 04 / 05 / 06',sr?'Transport · OE delovi · B2B':'Überführung · OE-Teile · B2B',sr?'Tri dodatna pravca usluge, sa zasebnim stranama i uslovima.':'Drei zusätzliche Leistungen mit eigenen Seiten und Leistungsgrenzen.')+
 '<div class="grid">'+cards.map(c=>'<a class="card feature" href="'+c.link+'">'+media(c.file,c.title)+'<span class="eyebrow">'+c.num+'</span><h3>'+c.title+'</h3><p>'+c.lead+'</p><strong>'+(sr?'Detalji':'Details')+' →</strong></a>').join('')+'</div>')+
 section(header('DANINI · EUR',sr?'Cenovnik pre narudžbine':'Preise vor Beauftragung',sr?'Prvo pošaljite oglas ili specifikaciju na WhatsApp. Potvrdite raspoloživost i obim, zatim platite odgovarajući PayPal iznos.':'Erst Inserat oder Spezifikation per WhatsApp senden, Leistungsumfang klären, danach den richtigen PayPal-Betrag bezahlen.')+
 storefront.pricing(lang)+'<p class="muted">'+DISCLAIMER[lang]+'</p>'+button(paths.b2b,sr?'B2B upit':'B2B-Anfrage'));
}
const SERVICE_ROWS=[
 ['Mali servis / Kleine Inspektion','95–165 €','290–550 €','140–240 €','150–300 €'],
 ['Veliki servis / Zahnriemen & Wasserpumpe','220–480 €','850–1.800 €','380–750 €','450–1.000 €'],
 ['Automatski menjač / Automatikgetriebe','160–290 €','480–850 €','240–420 €','240–430 €'],
 ['Kočnice / Bremsen','180–380 €','550–1.100 €','240–480 €','300–600 €']
];
function parts(lang){
 const sr=lang==='sr';
 return section(header('DANINI · OE/OEM',sr?'Originalni delovi i servis po šasiji':'Originalteile und Wartung nach Fahrgestellnummer',
 sr?'Tražimo odgovarajuće kataloške brojeve po VIN-u, nemačkim HSN (2.1) / TSN (2.2) i stvarnoj opremi vozila.':'Teilenummernabgleich mit VIN, HSN (2.1) / TSN (2.2) und tatsächlicher Fahrzeugausstattung.')+
 media(IMG.service,sr?'OE delovi i radionica bez ljudi':'OE-Teile und Werkstatt ohne Personen')+
 '<p class="muted">'+(sr?'Marke Continental, INA, ZF, Bosch, MANN, MAHLE ili ATE mogu biti OE/OEM dobavljači za određene komponente; naziv brenda sam po sebi nije dokaz da je svaki deo originalan za konkretno vozilo.':'Continental, INA, ZF, Bosch, MANN, MAHLE oder ATE können OE/OEM-Zulieferer sein. Ein Markenname allein beweist keine Originalteil-Eigenschaft für jedes Fahrzeug.')+'</p>'+
 '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;min-width:690px"><caption style="text-align:left;padding:12px 0">'+(sr?'Informativni rasponi u EUR, nisu potvrđene tržišne ponude':'Orientierungswerte in EUR, keine geprüften Marktangebote')+'</caption><thead><tr>'+[
 sr?'Usluga':'Leistung',sr?'Delovi DE':'Teile DE',sr?'DE sa radom':'DE inkl. Arbeit',sr?'SR sa radom':'RS inkl. Arbeit',sr?'Razlika':'Beispiel-Differenz'
 ].map(x=>'<th style="padding:12px;text-align:left;border-bottom:1px solid #4b5b66">'+x+'</th>').join('')+'</tr></thead><tbody>'+SERVICE_ROWS.map(r=>'<tr>'+r.map(x=>'<td style="padding:12px;border-bottom:1px solid #37424c">'+x+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'+
 '<p class="muted">'+(sr?'Pretpostavljene satnice: DE 110–180 €/h, Srbija 25–45 €/h. Intervale održavanja od 10.000–15.000 km, 60.000–80.000 km ili 150.000–210.000 km nije moguće primeniti na svaki model: merodavan je plan proizvođača i stanje vozila. Cena carine, slanja delova i garancija nisu uračunate.':'Angenommene Stundensätze: DE 110–180 €/h, Serbien 25–45 €/h. Wartungsintervalle wie 10.000–15.000 km, 60.000–80.000 km oder 150.000–210.000 km gelten nicht pauschal: Herstellerplan und Zustand sind maßgeblich. Zoll, Teileversand und Garantie sind nicht eingerechnet.')+'</p>'+
 order('oe'));
}
function delivery(lang){
 const sr=lang==='sr';
 const cases=sr?[
 ['01 · Kupac sam vozi','Zakazivanje u Zulassungsstelle; nemačke crvene izvozne tablice (Ausfuhrkennzeichen), registracioni dokumenti, polisa za sve tranzitne države, proverena ruta i ulazna špedicija. Trajanje tablica i polise (npr. 9, 15 ili 30 dana) proverava se prema ponudi i tehničkom pregledu. Žute Kurzzeitkennzeichen nisu pouzdan izvozni plan do Srbije.'],
 ['02 · Naš dovoz na točkovima','DANINI dogovara preuzimanje vozila u NRW, izvozne tablice / dokaz o izvozu (ABD kada je potreban), vozača, dokumenta i predaju na dogovorenoj carinskoj lokaciji u Srbiji. Cena zavisi od rute, kilometara, vozila i raspoloživosti.'],
 ['03 · Šleper / autotransporter','Koordinacija ponuda prevoznika za 59,00 €; ugovoreni prevoznik, važeće osiguranje odgovornosti po CMR-u i foto-zapisnik iz osam uglova pre primopredaje. Proveriti limite i izuzetke pokrića. Prevoz i osiguranje robe nisu uključeni u 59,00 €.']
 ]:[
 ['01 · Käufer fährt selbst','Termin bei Zulassungsstelle, rote Ausfuhrkennzeichen, Zulassungsunterlagen, Deckung in allen Transitstaaten, Strecke und Einfuhrspedition. Gültigkeit von Kennzeichen und Versicherung (z. B. 9, 15, 30 Tage) individuell prüfen. Gelbe Kurzzeitkennzeichen sind keine sichere Exportlösung nach Serbien.'],
 ['02 · Fahrerüberführung','DANINI koordiniert Übernahme in NRW, Exportkennzeichen und ggf. Ausfuhrbegleitdokument (ABD), Fahrer, Dokumente und Übergabe an der vereinbarten serbischen Zollstelle. Preis nur nach Strecke und Verfügbarkeit.'],
 ['03 · Lkw / Autotransporter','Für 59,00 € Angebote von Transportpartnern koordinieren, CMR-Haftungsdeckung und Foto-Protokoll aus acht Blickwinkeln anfragen. Haftungsgrenzen beachten. Fracht und Ladungsversicherung nicht im Koordinationsentgelt enthalten.']
 ];
 return section(header('DANINI · TRANSPORT',sr?'Tri načina da auto stigne do Srbije':'Drei Wege nach Serbien',sr?'Izbor prema stanju automobila, dokumentima i budžetu.':'Auswahl nach Fahrzeugzustand, Papieren und Budget.')+
 '<div class="grid">'+cases.map(x=>card(x[0],x[1])).join('')+'</div><div class="two">'+media(IMG.driving,sr?'Izvozna registracija i dovoz na točkovima':'Ausfuhrkennzeichen und Überführung')+media(IMG.truck,sr?'Transport vozila na kamionu':'Fahrzeugtransport per Lkw')+'</div>'+
 '<div class="card"><h3>'+(sr?'Osiguranje nije pomoć na putu':'Haftpflicht ist keine Pannenhilfe')+'</h3><p>'+(sr?'Osiguranje uz izvozne tablice je uglavnom obavezno osiguranje od autoodgovornosti (Haftpflicht): ne plaća automatski kvar, popravku, šlepanje ni povrat vozila. Proveriti stvarni dokument osiguranja, međunarodnu kartu osiguranja i pokriće tranzitnih zemalja.':'Die Versicherung zum Ausfuhrkennzeichen ist meist Kfz-Haftpflicht; Panne, Reparatur, Abschleppen oder Fahrzeugrücktransport sind nicht automatisch versichert. Police, internationale Versicherungskarte und Transitländer vor Fahrt prüfen.')+'</p><p>'+(sr?'Za posebnu pomoć na putu uporediti ADAC Plus, Atlas Evropa, Vozzi i AMSS Evropa, naročito ko sme da vozi, teritoriju pokrića, karencu, limite šlepa i uslove za vozilo sa izvoznim tablicama. Aktivirajte pokriće blagovremeno, ali ne pretpostavljajte univerzalno pravilo od 48 sati ili fiksnu cenu šlepa. DANINI ne prodaje polise osiguranja.':'Separaten Pannenschutz von ADAC Plus, Atlas Evropa, Vozzi und AMSS Evropa auf Fahrer, Gebiet, Wartezeit, Abschlepplimits und exportzugelassene Autos prüfen. Schutz rechtzeitig abschließen; eine allgemeine 48-Stunden-Frist oder ein fixer Abschlepppreis wird nicht zugesichert. DANINI verkauft keine Versicherungen.')+'</p><p class="muted">'+(sr?'Kod granice dogovoriti carinski postupak i tranzitni dokument (T1 kada je primenljiv) sa špediterom; rok završetka zavisi od konkretnog odobrenog postupka, nije univerzalno 72 sata. Zimi proverite 3PMSF i nacionalna pravila svih zemalja rute.':'An der Grenze Zollverfahren und ggf. T1 mit Spediteur klären; Fristen richten sich nach dem konkreten Verfahren, nicht pauschal 72 Stunden. Im Winter 3PMSF sowie Vorschriften aller Transitländer prüfen.')+'</p></div>'+
 '<p class="muted">'+DISCLAIMER[lang]+'</p>'+order('transport'));
}
const OFFICIAL={
origin:'https://www.carina.rs/putnici/uvoz-motornih-vozila/sporazumi.html',
customs:'https://carina.rs/putnici/pitanja-i-odgovori/uvoz-polovnih-vozila.html',
export:'https://www.zoll.de/DE/Privatpersonen/Reisen/Reisen-nach-Deutschland-aus-einem-nicht-eu-Staat/Zoll-und-Steuern/Kauf-von-Kraftfahrzeugen/kauf-von-kraftfahrzeugen.html',
amss:'https://www.amss.org.rs/usluge/sve-za-vozila/atesti-i-uvoz',
fee:'https://www.carina.rs/dokumenti/carinski-propisi/objasnjenjaupravecarina.html',
gwg:'https://www.gesetze-im-internet.de/gwg_2017/BJNR182210017.html'
};
function rules(lang){
 const sr=lang==='sr';
 const points=sr?[
 ['1 · Poreklo i prag 6.000 €','Poreklo iz EU mora biti dokazano. Za vozila do 6.000 € moguć je validan tekst izjave na računu; iznad tog praga primenjuje se EUR.1 ili izjava ovlašćenog izvoznika kada su uslovi ispunjeni. Kupovina u EU nije dokaz porekla. Stopa 0% nije automatska.',OFFICIAL.origin],
 ['2 · MwSt, ABD i izlaz iz EU','Povrat nemačkog 19% MwSt ne sledi kod svake polovne kupovine: proverite račun (npr. ne Differenzbesteuerung), prodavca, kupca i izvozni status. Ako se podnosi elektronska deklaracija, obezbediti MRN/ABD i potvrdu izlaza na poslednjoj EU carinskoj tački. Refundacija zavisi od priznate potvrde i ugovora sa prodavcem.',OFFICIAL.export],
 ['3 · Gotovina i prenos novca','Prag od 10.000 € u nemačkom GwG povezan je sa obavezama provere i kontrole prodavaca; nije opšta zabrana svake kupovine vozila gotovinom od tog iznosa. Prenos gotovine preko EU granice od 10.000 € ili više povlači pravila prijave. SEPA i provera IBAN-a su uglavnom sigurniji izbor.',OFFICIAL.gwg],
 ['4 · Originalni COC','Zatražite original Certificate of Conformity (COC) kada postoji. Može ubrzati postupak provere podataka u Srbiji; konkretna ušteda nije garantovana. Uporedite VIN i podatke iz COC sa vozilom i dokumentima.',OFFICIAL.amss],
 ['5 · Ključevi i Felgenschloss','Pre predaje prebrojite oba ključa, proverite daljinske funkcije i adapter sigurnosnog šrafa (Felgenschloss). Naknadna zamena može biti skupa, ali nije univerzalni trošak.',OFFICIAL.amss],
 ['6 · Ekološka naknada i carinska vrednost','Naknada za posebne tokove otpada za relevantne kategorije vozila računa se na osnovu mase po važećoj tarifi na dan carinjenja. Prikaz u EUR je procena; konačni iznos utvrđuje carina po propisu. Carina može proveriti prijavljenu vrednost i zatražiti dokaze; potcenjivanje računa nije rešenje.',OFFICIAL.fee],
 ['7 · Kontrola tehničkog stanja','Pre kupovine proveriti Check Engine / Airbag lampice, VIN, vetrobran, prepravke i homologacioni status. Problemi mogu odložiti ili onemogućiti kontrolisanje polovnog vozila; konačan ishod utvrđuje ovlašćena organizacija.',OFFICIAL.amss]
 ]:[
 ['1 · Herkunft und 6.000 €','Präferenzieller EU-Ursprung muss nachgewiesen werden. Bis 6.000 € kann eine ordnungsgemäße Ursprungserklärung auf der Rechnung zulässig sein; darüber EUR.1 oder Erklärung eines ermächtigten Ausführers unter den geltenden Bedingungen. EU-Kaufort ist kein Ursprungsnachweis; 0% Zoll ist nicht garantiert.',OFFICIAL.origin],
 ['2 · MwSt, ABD und EU-Ausgang','19% deutsche Umsatzsteuer werden nicht bei jedem Gebrauchtwagenkauf erstattet, insbesondere nicht pauschal bei Differenzbesteuerung. Rechnung, Händler, Käuferstatus und Ausfuhr nachweisen. Bei elektronischer Ausfuhr MRN/ABD und Ausgangsbestätigung der letzten EU-Zollstelle sichern; Rückzahlung richtet sich nach Nachweisen und Kaufabrede.',OFFICIAL.export],
 ['3 · Bargeld und Geldwäsche','10.000 € im GwG ist eine Schwelle für besondere Pflichten bei betroffenen Händlertransaktionen, kein allgemeines Bargeldkaufverbot. Für Bargeldbewegungen über EU-Grenzen bestehen gesonderte Anmeldevorschriften ab 10.000 €. SEPA mit geprüftem Zahlungsempfänger bevorzugen.',OFFICIAL.gwg],
 ['4 · Originales COC','Originales Certificate of Conformity anfordern, soweit vorhanden. Es kann die Datenprüfung für die Zulassung in Serbien vereinfachen; eine feste Ersparnis wird nicht versprochen. VIN abgleichen.',OFFICIAL.amss],
 ['5 · Zweitschlüssel und Felgenschloss','Bei Übergabe beide Schlüssel, Fernbedienung und Felgenschloss-Adapter prüfen. Ersatz kann teuer sein; pauschale Ersparnisse sind nicht seriös.',OFFICIAL.amss],
 ['6 · Umweltgebühr und Zollwert','Serbische Produkt-/Altlastengebühr für bestimmte Fahrzeugklassen richtet sich nach Masse und tagesaktuellem Satz. EUR-Beträge sind nur Schätzungen. Zoll kann den Warenwert prüfen; falsche Rechnungen vermeiden.',OFFICIAL.fee],
 ['7 · Technische Zulassungsfähigkeit','Check Engine, Airbag, Windschutzscheibe, VIN und Umbauten vor Kauf prüfen. Mängel können die serbische Fahrzeugprüfung verhindern oder verzögern. Eine zugelassene Prüfstelle entscheidet.',OFFICIAL.amss]
 ];
 return section(header('DANINI · COMPLIANCE',sr?'Sedam pravila pre kapare i carine':'Sieben Regeln vor Anzahlung und Verzollung',sr?'Otvorite svako pravilo i proverite zvanični izvor.':'Regeln öffnen und die amtlichen Quellen nachlesen.')+
 points.map(p=>'<details class="card" style="margin-bottom:9px"><summary style="font-weight:800;cursor:pointer">'+p[0]+'</summary><p>'+p[1]+'</p><a href="'+p[2]+'" target="_blank" rel="noopener noreferrer">'+(sr?'Zvanični izvor':'Amtliche Quelle')+' ↗</a></details>').join('')+
 '<p class="muted">'+DISCLAIMER[lang]+'</p>');
}
function b2b(lang){
 const sr=lang==='sr';
 return section(header('B2B · NRW → SRB',sr?'Tražimo do tri vozila po zahtevu firme':'Bis zu drei Fahrzeuge nach Firmenauftrag',
 sr?'Putnička i N1 vozila, tačna specifikacija, proverljive informacije i kontakt prodavca.':'Pkw und N1-Nutzfahrzeuge, konkrete Anforderungen, nachvollziehbare Angaben und Verkäuferkontakt.')+
 media(IMG.b2b,sr?'B2B nabavka vozila za firme':'B2B Fahrzeugsuche')+
 '<div class="grid">'+(sr?[
 ['B2B shortlist · 99,00 €','Do 3 kandidata prema marki, modelu, godištu, kilometraži, budžetu, lokaciji i zahtevima firme. Provera javnih i dostupnih podataka; ne znači tri fizička pregleda.'],
 ['B2B sourcing po vozilu · 290,00 €','Detaljnija koordinacija jednog odabranog vozila, pregovora, dokumentacije i opcija preuzimanja prema pisanoj specifikaciji. Troškovi automobila, puta i prevoza posebno.'],
 ['19% MwSt ausweisbar','Tražimo oglase sa iskazanim PDV-om kada je relevantno. Iskazani PDV ne znači automatski povrat; transakcija, pravo na odbitak i dokaz izvoza moraju zadovoljiti poreske uslove.']
 ]:[
 ['B2B Shortlist · 99,00 €','Bis drei Kandidaten nach Marke, Modell, Laufleistung, Budget und Anforderungen; verfügbare Daten prüfen. Keine drei physischen Fahrzeugchecks.'],
 ['B2B Sourcing je Fahrzeug · 290,00 €','Erweiterte Koordination eines Fahrzeugs, Verhandlungen, Dokumente und Übergabe nach schriftlicher Spezifikation. Kaufpreis, Fahrt und Fracht extra.'],
 ['19% MwSt ausweisbar','Nur sofern in der Anzeige und Rechnung tatsächlich ausweisbar. Ausgewiesene MwSt bedeutet keinen automatischen Vorsteuerabzug oder Rückerstattung; steuerliche Einzelfallprüfung ist erforderlich.']
 ]).map(p=>card(p[0],p[1])).join('')+'</div>'+button(PATHS[lang].place,sr?'Poslovni plac u Nišu':'Gewerbeflächen in Niš')+order('b2b'));
}
function place(lang){
 const sr=lang==='sr';
 return section(header('DANINI · NIŠ · ČALIJE',sr?'Auto-plac / showroom u Čalijama':'Autoplatz / Showroom in Niš Čalije',
 sr?'Dve zasebne radne površine, približno 345 m² i 648 m² (ukupno oko 993 m²), GO Pantelej, Niš. Ponuda za dugoročni komercijalni zakup: parking flote, prodajni plac ili prezentacioni prostor za modularne objekte.':'Zwei getrennte Nutzflächen von ca. 345 m² und 648 m² (zusammen rund 993 m²) in Niš, Stadtbezirk Pantelej. Langfristige Gewerbemiete für Fahrzeugbestand, Flottenparkplatz oder Ausstellung modularer Objekte.')+
 '<div class="grid">'+card('345 m²',sr?'Prva lokacija, kapacitet orijentaciono do 12 vozila; cena i uslovi na upit.':'Erste Fläche, vorläufig bis zu 12 Fahrzeuge; Mietpreis und Bedingungen auf Anfrage.')+
 card('648 m²',sr?'Druga lokacija, kapacitet orijentaciono do 25 vozila; cena i uslovi na upit.':'Zweite Fläche, vorläufig bis zu 25 Fahrzeuge; Preis und Bedingungen auf Anfrage.')+
 card('993 m²',sr?'Zbir dve odvojene radne površine: procena do 37 vozila uz odgovarajući raspored. Nisu jedinstvena katastarska parcela; namena i dozvole proveravaju se.':'Zusammen zwei getrennte Flächen: vorläufig bis zu 37 Fahrzeuge bei geeigneter Belegung. Keine einheitliche Katasterparzelle; Nutzung und Genehmigungen prüfen.')+'</div>'+
 '<p class="muted">'+(sr?'Ne tvrdimo da postoje građevinske dozvole, odobren showroom ili aktivni zakupci. Zakup i dozvoljenu namenu potrebno je pravno proveriti.':'Keine Behauptung über Baugenehmigungen, genehmigten Showroom oder bestehende Mieter. Nutzung und Mietvertrag sind rechtlich zu prüfen.')+'</p><p>'+button(wa,sr?'WhatsApp — zakup':'WhatsApp — Gewerbemiete')+'</p>');
}
const CHAPTERS={
sr:{
article1:[
 ['1. Zašto lep oglas nije dokaz ispravnosti','Profesionalne fotografije i povoljna cena ne potvrđuju vlasništvo, bezbednost ni servisnu istoriju. Sačuvajte URL, identifikator oglasa, cenu i fotografije. Tražite VIN i mesto gde se auto stvarno nalazi. Uporedite oglas sa dokumentima i ne šaljite kaparu samo zato što prodavac tvrdi da ima više kupaca.'],
 ['2. Sedam pitanja koja postavljamo prodavcu','Pitajte ko je ugovorna strana; da li se prodaje im Kundenauftrag; postoji li uredan račun ili ugovor; šta pokazuje servisna istorija; da li je vozilo imalo sudar ili poznat kvar; da li je VIN dostupan; može li se dokumentovati preferencijalno poreklo. Odgovore beležimo kao izjave, ne kao nezavisno dokazane činjenice.'],
 ['3. Ne mešajte vizuelni pregled i tehničku garanciju','Video poziv i terenski obilazak prikazuju vidljivo stanje, razmake karoserije, gume, signalne lampice i dokumente. Mehaničar ili nezavisan tehnički pregled ima drugačiji obim. Ni jedan obilazak ne garantuje da nema skrivenih kvarova. Predvidite rezervu u budžetu.'],
 ['4. Finansijska bezbednost pre uplate','Proverite identitet prodavca i vlasnika računa. Za ozbiljnu kupovinu prednost dajte proverljivom bankarskom transferu prema ugovoru, a ne uplati trećoj osobi. Ako se račun, VIN ili cena iznenada promene, zaustavite postupak dok se ne objasni odstupanje.'],
 ['5. Koji paket ima smisla','Import Passport 9,90 € odgovara osnovnoj telefonskoj proveri i zapisu. Za OE plan po šasiji postoji paket 19,00 €, kombinacija 29,90 €, a vidljivi Field Check u NRW od 79 € uz odobrenu lokaciju. Prvo šaljete oglas na WhatsApp i dobijate potvrdu dostupnosti. PayPal uplata se ručno povezuje sa zahtevom.']
],
article2:[
 ['1. Prvo proverite poreklo, ne lokaciju prodaje','Auto kupljen u Nemačkoj ne mora imati EU preferencijalno poreklo. Stopa carine od 0% zavisi od prihvaćenog dokaza. Za vrednost do 6.000 € može važiti propisana izjava na računu; iznad toga prema pravilima EUR.1 ili ovlašćeni izvoznik. Bez dokaza kalkulišite i scenario sa uobičajenom carinskom stopom do 12,5%.'],
 ['2. Račun i PDV nisu isto što i povrat PDV-a','Kod vozila fakturisanog uz nemačku Differenzbesteuerung obično nema posebno iskazanog 19% MwSt za povrat. Kod drugih računa izvoz i status kupca moraju biti pravilno dokumentovani. Izvozni ABD/MRN i izlazna potvrda su značajni, ali povrat nije automatsko pravo nakon skeniranja barkoda.'],
 ['3. Tri realna modela transporta','Samostalni dovoz podrazumeva crvene Ausfuhrkennzeichen, osiguranje za tranzit, ispravnost vozila i granicu. Profesionalni vozač preuzima na točkovima po dogovorenoj ruti. Šleper / kamion se ugovara kroz prevoznika sa odgovarajućom CMR odgovornošću i zapisnikom. Koordinacija ponuda 59,00 € nije sama cena šlepa.'],
 ['4. Izvozna polisa ne plaća automatski šlep','Haftpflicht uz tablice prvenstveno štiti treća lica. Posebno proverite pomoć na putu, uslove prethodnog aktiviranja, pokriće vozača i vozila, kao i zemlje trase. Zimska oprema i 3PMSF zavise od zemlje i uslova. Špediter potvrđuje T1 i rok završetka carinskog postupka ako se primenjuje.'],
 ['5. Kada auto uđe u Srbiju','Uvoznu vrednost i dažbine proverava carina; može tražiti dodatne dokaze vrednosti. Za relevantne kategorije postoji naknada po masi vozila, prema važećim pravilima. Za kontrolisanje polovnog vozila proverite saobraćajnu dokumentaciju, COC kad postoji, VIN, greške bezbednosnih sistema i stanje vetrobrana.'],
 ['6. Izračunajte sve pre kupovine','Zbir nije samo cena vozila. Dodajte izvozne dokumente, put ili šlep, moguću carinu, PDV u Srbiji, ekološku naknadu, špediciju, kontrolisanje, registraciju i rezervu za servis. Kalkulator je početna procena u evrima, ne carinsko rešenje.']
]
},
de:{
article1:[
 ['1. Inserat ist kein Zustandsnachweis','Schöne Bilder und niedriger Preis belegen weder Eigentum noch Wartung oder Fahrsicherheit. Inseratslink, Kennung und Angebot sichern. VIN, Standort und Originalpapiere erfragen, bevor eine Anzahlung erfolgt.'],
 ['2. Sieben Fragen an den Verkäufer','Wer ist Vertragspartner? Verkauf im Kundenauftrag? Rechnung oder Vertrag? Wartungsbelege? Bekannte Schäden oder Unfälle? VIN verfügbar? Präferenzursprung belegbar? Antworten als Aussagen dokumentieren und nicht mit einer Garantie verwechseln.'],
 ['3. Foto, Vor-Ort-Check und Werkstatt unterscheiden','Live-Video und Sichtprüfung können Karosserie, Reifen, Kontrolllampen und Unterlagen erfassen. Diagnose beim Sachverständigen oder Mechaniker ist ein anderer Auftrag. Versteckte Mängel sind nicht ausgeschlossen; Budgetreserve vorsehen.'],
 ['4. Zahlung absichern','Empfänger und Verkäuferdaten abgleichen. Verifizierbare Überweisung an den Vertragspartner bevorzugen; weder auf unklare Dritt-Konten noch auf plötzliche Zahlungsänderungen reagieren. Abweichungen zuerst klären.'],
 ['5. Passender Leistungsumfang','Import Passport 9,90 €: Verkäuferkontakt und Dossier; OE-Serviceplan 19,00 €; Kombi 29,90 €; Field Check NRW ab 79 € nach Standort. Inserat zuerst per WhatsApp senden. PayPal.Me-Zahlungen werden manuell einem Auftrag zugeordnet.']
],
article2:[
 ['1. Ursprung statt Verkaufsort','Ein in Deutschland verkauftes Fahrzeug hat nicht automatisch EU-Präferenzursprung. Bis 6.000 € ist gegebenenfalls eine formgerechte Erklärung möglich; darüber gelten Nachweise wie EUR.1 oder Erklärung des ermächtigten Ausführers. Ohne Nachweis auch eine Verzollung bis 12,5% kalkulieren.'],
 ['2. MwSt und Ausfuhr belegen','Bei Differenzbesteuerung wird regelmäßig keine gesonderte Umsatzsteuer für eine Rückerstattung ausgewiesen. Exportstatus und Rechnung vor Kauf klären. ABD/MRN sowie Ausgangsbestätigung der EU-Ausgangszollstelle beachten. Barcode allein begründet keine Erstattung.'],
 ['3. Drei Transportwege','Selbst fahren mit gültigem Ausfuhrkennzeichen und internationaler Versicherung; professionelle Fahrerüberführung auf Auftrag; oder Lkw mit überprüfter CMR-Haftungsdeckung und Übergabeprotokoll. Die DANINI-Koordinationsgebühr von 59,00 € enthält nicht den Transportpreis.'],
 ['4. Kfz-Haftpflicht ist keine Pannenhilfe','Abschleppen und Pannenhilfe sind meist nicht in der Pflichtversicherung enthalten. Externe Schutzbriefe nach Fahrer, Staat, Kennzeichen, Wartezeit und Leistungsgrenzen vergleichen. Transit- und Winterreifenpflichten sowie Zoll-Transitfristen für die Strecke individuell prüfen.'],
 ['5. Serbische Zoll- und Fahrzeugkontrolle','Zollwert kann behördlich überprüft werden. Abgaben und massenabhängige Umweltgebühren richten sich nach dem geltenden Tarif. VIN, Sicherheitsmängel, COC falls vorhanden und gegebenenfalls Umbauten vor Abreise prüfen.'],
 ['6. Gesamtbudget in Euro','Fahrzeugpreis, Ausfuhr, Kennzeichen, Fahrt oder Spedition, Zoll, serbische Mehrwertsteuer, technische Prüfung, Anmeldung und Reparaturreserve berücksichtigen. Online-Rechner ist eine Schätzung, keine amtliche Auskunft.']
]
}
};
function article(lang,key){
 const sr=lang==='sr',name=key==='article1'?(sr?'Provera oglasa pre kapare':'Gebrauchtwagen vor Anzahlung prüfen'):(sr?'Kompletan vodič za uvoz i dovoz':'Kompletter Leitfaden für Import und Überführung');
 const lead=key==='article1'?(sr?'Proverite sedam informacija koje prave razliku između odluke i kupovine na slepo.':'Sieben Informationen, die vor einer Anzahlung helfen.'):(sr?'EUR.1, MwSt, izvozne tablice, carina, COC i transport bez prečica.':'EUR.1, MwSt, Ausfuhrkennzeichen, Zoll, COC und Transport ohne Abkürzungen.');
 const body=CHAPTERS[lang][key];
 return section('<p class="eyebrow">DANINI · '+(sr?'EVERGREEN VODIČ':'EVERGREEN RATGEBER')+'</p><h1 style="font-size:clamp(34px,5vw,62px)">'+name+'</h1><p class="lead">'+lead+'</p><p class="muted">'+(sr?'Ažurirano: 24.10.2026. · Izvori u okviru pravila ispod.':'Aktualisiert: 24.10.2026 · Quellen in den Hinweisen unten.')+'</p>'+
 body.map(([h,p])=>'<article style="max-width:900px;margin:24px 0"><h2 style="font-size:27px">'+h+'</h2><p style="line-height:1.85">'+p+'</p></article>').join('')+
 '<p>'+button(PATHS[lang].parts,sr?'OE servisni plan':'OE-Wartungsplan')+' '+button(sr?'/sr/kalkulator':'/de/rechner',sr?'Kalkulator':'Rechner')+'</p>')+rules(lang);
}
function guides(lang){
 const sr=lang==='sr';
 return section(header('DANINI · '+(sr?'DVA NOVA VODIČA':'ZWEI NEUE RATGEBER'),sr?'Pre uplate, pre granice':'Vor der Zahlung, vor der Grenze',sr?'Dva detaljna članka sa proverljivim izvorima i praktičnim koracima.':'Zwei ausführliche Artikel mit amtlichen Quellen und praktischen Schritten.')+
 '<div class="grid">'+card('<a href="'+PATHS[lang].article1+'">'+(sr?'Provera oglasa pre kapare':'Inseratprüfung vor Anzahlung')+'</a>',sr?'Prodavac, VIN, ugovor, pregled, uplata i sedam pitanja.':'Verkäufer, VIN, Vertrag, Prüfung und Zahlung.')+
 card('<a href="'+PATHS[lang].article2+'">'+(sr?'Uvoz, EUR.1, Zoll i dovoz':'Import, EUR.1, Zoll und Transport')+'</a>',sr?'Poreklo, povrat PDV-a, Zoll tablice i tri vrste transporta.':'Ursprung, MwSt, Ausfuhrkennzeichen und Transport.')+'</div>');
}
function render(lang,key){
 if(key==='eco_parts')return parts(lang);
 if(key==='eco_b2b')return b2b(lang);
 if(key==='eco_place')return place(lang);
 if(key==='eco_article1'||key==='eco_article2')return article(lang,key.replace('eco_',''));
 return '';
}
module.exports={routeMeta,route,render,home,parts,delivery,rules,b2b,place,guides};
