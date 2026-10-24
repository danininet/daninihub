'use strict';
// Evidence-based editorial modules. No fabricated orders, prices or expert certifications.
// Source URLs are official providers/regulators and retain attribution.

const SOURCES={
  adac:'https://www.adac.de/rund-ums-fahrzeug/auto-kaufen-verkaufen/gebrauchtwagenkauf/gebrauchtwagen-kaufen/',
  contract:'https://www.adac.de/rund-ums-fahrzeug/auto-kaufen-verkaufen/gebrauchtwagenkauf/kfz-kaufvertrag/',
  fraud:'https://www.adac.de/rund-ums-fahrzeug/auto-kaufen-verkaufen/gebrauchtwagenkauf/betrug/',
  customs:'https://carina.rs/putnici/pitanja-i-odgovori/uvoz-polovnih-vozila.html',
  origin:'https://www.carina.rs/putnici/uvoz-motornih-vozila/sporazumi.html',
  vin:'https://support.autodna.de/'
};
const DATA={
  'safebuy-vor-kaution':{
    sr:{
      title:'Pre kapare: kako proveriti polovan auto iz Nemačke',
      intro:'Najskuplja greška pri kupovini iz inostranstva nije pogrešno izračunata putarina, već novac poslat pogrešnom prodavcu ili vozilo čija dokumenta i stanje niko nije proverio. Ovo je redosled koji bih primenio za svaki konkretan oglas.',
      sections:[
        {h:'1. Ko zapravo prodaje automobil?',p:'Proverite pun naziv auto-kuće ili ime privatnog prodavca, adresu, telefon i ko će biti naveden kao prodavac u ugovoru. Oglas može stajati kod trgovca, a pravni prodavac biti treće lice („im Kundenauftrag“). To menja ugovornu situaciju i odgovornosti. Ne oslanjajte se samo na profil platforme.',points:['Tražite punu oznaku prodavca i predlog ugovora bez potpisivanja.','Ako prodaje posrednik, tražite dokaz ovlašćenja i kontakt stvarnog vlasnika.','Ako se račun za uplatu ne poklapa sa ugovornom stranom, nemojte uplaćivati.']},
        {h:'2. VIN, papiri i istorija — tri odvojena dokaza',p:'Uporedite VIN iz oglasa sa fotografijom identifikacione oznake na vozilu i registracionim dokumentima (Zulassungsbescheinigung Teil I i II). Zatražite HU/TÜV izveštaje, račune servisa i podatke o većim oštećenjima. Komercijalni VIN izveštaj može pokazati samo podatke koji postoje u njegovim izvorima — čist izveštaj nije potvrda da automobil nije udaran.',points:['Fotografije relevantnih dokumenata koristite samo za proveru; osetljive podatke ne postavljajte javno.','Tražite istoriju velikih popravki i napismeno zabeležene odgovore.','Kod neusaglašenog VIN-a ili vlasništva zaustavite postupak.']},
        {h:'3. Video nije stručni mehanički pregled',p:'WhatsApp video-obilazak može otkriti vidljiva oštećenja, stanje enterijera, instrument-tablu i prisustvo dokumentacije. Ne može pouzdano dokazati stanje turbine, automatskog menjača, šasije ispod vozila ili skrivene havarijske popravke. Za tehnički zaključak potreban je stručni pregled po dogovorenom obimu, odgovarajuća oprema i pristup vozilu.',points:['Prvo daljinska provera oglasa i saglasnost prodavca.','Potom obilazak sa fotografijama i listom onoga što nije moglo biti provereno.','Tek za odgovarajući auto posebno ugovoriti mehaničara, dijagnostiku i probnu vožnju.']},
        {h:'4. Primer odluke pre putovanja iz Srbije',p:'Hipotetičan slučaj: nađete karavan za 10.000 €. Prodavac ima dobar oglas, ali ne šalje fotografiju nemačke saobraćajne dozvole i odbija pregled. Ne donosite zaključak da je prevara, ali je rizik otvoren: prvo tražite objašnjenje i dokaze, pa tek onda odlučujete da li uopšte opravdava put, rezervaciju ili plaćeni obilazak.',points:['Sačuvajte originalni URL, cenu i datum kada je oglas viđen.','Uporedite makar dva druga kandidata i konačan budžet sa rezervom.','Bez jasnog ugovora i prihvaćene provere — bez kapare.']},
        {h:'5. Šta treba da dobijete od AutoDaninija',p:'Za dogovorenu analizu tražite pisan odgovor: podaci iz oglasa, provereni dokumenti, otvorena pitanja, izvor svakog važnog zaključka i sledeći korak. Za fizički obilazak posebno navedite lokaciju, fotografije, video i granice pregleda. Niko ne treba da vam obeća tehničku garanciju ili da je automobil sigurno dobar samo na osnovu telefonskog razgovora.',points:['Jasna cena i obim pre narudžbine.','Dokumentovano: potvrđeno / izjava prodavca / nije provereno.','Preporuka naredne provere, ali kupac sam donosi odluku.']}
      ],
      links:[['ADAC — kupovina polovnog vozila',SOURCES.adac],['ADAC — ugovor i odgovornost',SOURCES.contract],['autoDNA — ograničenja i cene VIN podataka',SOURCES.vin]]
    },
    de:{
      title:'Vor der Anzahlung: Gebrauchtwagen in Deutschland prüfen',
      intro:'Das größte Risiko beim Kauf aus dem Ausland ist oft nicht der Weg zum Verkäufer, sondern eine voreilige Zahlung oder ein Fahrzeug, dessen Unterlagen und Zustand nicht unabhängig geprüft wurden. Dieser Ablauf trennt belegte Fakten von Verkäuferangaben.',
      sections:[
        {h:'1. Wer ist tatsächlich Vertragspartner?',p:'Prüfen Sie Firmenname bzw. Identität der Privatperson, Adresse und den Verkäufer im Kaufvertrag. Ein Fahrzeug kann bei einem Händler stehen und trotzdem „im Kundenauftrag“ verkauft werden. Das ist für Vertragsgestaltung und Verantwortlichkeiten relevant; ein Inserat ist keine Eigentumsbestätigung.',points:['Vertragsentwurf und Verkäuferdaten vor Unterschrift anfordern.','Bei Verkauf durch Bevollmächtigte die Vollmacht prüfen.','Bei abweichendem Zahlungsempfänger keine Überweisung ohne Klärung.']},
        {h:'2. FIN, Dokumente, Historie getrennt prüfen',p:'Vergleichen Sie die FIN aus dem Inserat mit der Fahrzeugkennzeichnung und Zulassungsbescheinigung Teil I und II. Fordern Sie HU-Berichte, Werkstattbelege und Angaben zu Unfallschäden an. Ein Datenbankbericht kann lediglich vorhandene Einträge zeigen. Fehlende Treffer beweisen keine Unfallfreiheit.',points:['Persönliche Dokumentdaten nicht öffentlich weitergeben.','Wesentliche Aussagen schriftlich festhalten.','Bei Unstimmigkeiten von FIN oder Eigentümer den Kauf stoppen.']},
        {h:'3. Live-Video ersetzt keine fachliche Untersuchung',p:'Ein Video kann Karosserie, Innenraum, Anzeigen und sichtbare Papiere zeigen, nicht jedoch zuverlässig den technischen Zustand von Getriebe, Turbolader oder verdeckten Reparaturen bestätigen. Für eine technische Aussage braucht es eine unabhängige Fachprüfung mit geeignetem Untersuchungsumfang.',points:['Zuerst Inserat, Verfügbarkeit und Zugang prüfen.','Dann sichtbare Befunde und Grenzen dokumentieren.','Bei Bedarf Werkstatt, Diagnose und Probefahrt gesondert vereinbaren.']},
        {h:'4. Beispiel: Inserat für 10.000 Euro',p:'Hypothetisches Szenario: Der Kombi kostet 10.000 Euro, doch der Verkäufer zeigt keine Zulassungspapiere und lehnt eine Besichtigung ab. Das beweist keinen Betrug, ist aber ein ungeklärtes Risiko. Statt sofort anzureisen: Unterlagen und Erklärung anfordern, Alternativen vergleichen und erst dann entscheiden.',points:['Inserat, Preis und Abrufdatum sichern.','Gesamtbudget inklusive Import und Reserve vergleichen.','Keine Anzahlung unter Zeitdruck.']},
        {h:'5. Ein belastbares Ergebnis statt Verkaufsversprechen',p:'Eine seriöse Auftragsprüfung sollte ausweisen, welche Angaben aus dem Inserat stammen, welche Dokumente vorlagen, was vor Ort gesehen wurde und welche Fragen offen bleiben. AutoDanini kann Recherche und Organisation anbieten; eine technische Gewährleistung oder amtliche Importfreigabe ist damit nicht verbunden.',points:['Leistungsumfang und Gesamtpreis vor Bestellung.','Kategorien: belegt / Verkäuferangabe / ungeprüft.','Empfohlener nächster Prüfschritt vor der eigenen Kaufentscheidung.']}
      ],
      links:[['ADAC — Gebrauchtwagen kaufen',SOURCES.adac],['ADAC — Kaufvertrag',SOURCES.contract],['autoDNA — Datenverfügbarkeit',SOURCES.vin]]
    }
  },
  'transport-entscheidung':{
    sr:{
      title:'Dovoz auta iz Nemačke: na točkovima, prikolicom ili šleperom?',
      intro:'Najjeftinija prevozna ponuda nije nužno najjeftiniji dovoz. Prvo treba razjasniti ispravnost automobila, dokumenta, tablice, rutu, odgovornost i mesto predaje.',
      sections:[
        {h:'1. Samostalni dovoz na točkovima',p:'Ova opcija ima smisla samo kada je vozilo tehnički sposobno za put, registrovano odgovarajućim izvoznim tablicama, a osiguranje važi za sve tranzitne države. Zavisno od situacije, potrebni su postupci za izvoz, kupoprodajni račun ili ugovor i dogovor sa špediterom o ulazu u Srbiju.',points:['Proveriti važenje tablica, polise i tehničkog pregleda.','Računati gorivo, putarine, put, noćenja, vreme i rizik kvara.','Nema garancije da polisa izvozne registracije plaća šlep ili popravku.']},
        {h:'2. Vozač preuzima i vozi automobil',p:'Profesionalni vozač može biti koristan kada kupac ne može sam u Nemačku. Ali pre polaska moraju biti jasni ovlašćenje za preuzimanje, odgovornost, dokumentacija, osiguranje, pregled stanja i mesto predaje. Ta usluga nije isto što i garantovano mehaničko stanje vozila.',points:['Definisati cenu vozača, trošak puta i postupak kod kvara.','Sačiniti fotografije i zapisnik pri preuzimanju.','Kupac mora znati ko ugovara transport i ko odgovara za šta.']},
        {h:'3. Prikolica ili autotransporter',p:'Kod neispravnih, neregistrovanih, skupocenih ili više vozila ponuda za prikolicu odnosno autotransporter često je praktičnija. Potrebno je uporediti stvarnu cenu, termin utovara, osiguranje i pokriće odgovornosti prevoznika, potreban CMR dokument gde je primenljiv i uslove pretovara.',points:['Zatražiti pisanu ponudu sa početnom i krajnjom lokacijom.','Proveriti nosivost, pristup za utovar i stanje vozila.','CMR odgovornost nije automatski potpuno kasko osiguranje tereta.']},
        {h:'4. Uporedni primer — bez izmišljene fiksne cene',p:'Hipotetično vozilo nalazi se u Duisburgu, a odredište je Niš. Za vožnju na točkovima traže se validne tablice, tranzitno osiguranje, gorivo i osoba koja će ga dovesti. Za autotransporter traže se tip vozila, adresa, datum, dostupnost utovara i ponuda. Bez tih podataka nije profesionalno objaviti konačnu cenu prevoza.',points:['Razdvojiti trošak prevoza od carine, PDV-a i registracije.','Zabeležiti šta je uključeno, a šta se plaća posebno.','Rezervu za nepredviđeni kvar ne prikazivati kao nulu.']},
        {h:'5. Kako naručiti AutoDanini ponudu',p:'Pošaljite model, godinu, približnu masu ako je poznata, mesto preuzimanja, odredište, da li se auto može kretati, da li ima tablice i željeni termin. Tek tada ima smisla uporediti vozača, prikolicu i šleper. Mi ne treba da obećavamo dostupnog prevoznika ili pokriće osiguranja pre potvrde partnera.',points:['Pisano potvrđen obim organizacije.','Jasno imenovan izvršilac prevoza i uslovi.','Bez uplate samo na osnovu inicijalnog klika ili procene.']}
      ],
      links:[['Uprava carina Srbije — uvoz polovnih vozila',SOURCES.customs],['ADAC — ugovor i kupovina',SOURCES.contract]]
    },
    de:{
      title:'Auto nach Serbien bringen: selbst fahren, Fahrer oder Autotransporter?',
      intro:'Der niedrigste Angebotspreis bedeutet nicht die niedrigsten Gesamtkosten. Entscheidend sind Fahrbereitschaft, Papiere, Kennzeichen, Route, Haftung und Übergabe.',
      sections:[
        {h:'1. Selbst auf eigener Achse überführen',p:'Diese Variante passt nur zu einem fahrbereiten und ordnungsgemäß zugelassenen Fahrzeug mit für alle Transitländer gültigem Versicherungsschutz. Klären Sie Ausfuhrkennzeichen, technische Voraussetzungen und die erforderlichen Unterlagen sowie die Einfuhrformalitäten mit zuständigen Stellen.',points:['Kennzeichen, Geltungsdauer und Versicherung schriftlich prüfen.','Kraftstoff, Maut, Anreise, Zeit, Übernachtung und Pannenrisiko kalkulieren.','Kfz-Haftpflicht ist nicht automatisch Pannenhilfe oder Vollkasko.']},
        {h:'2. Überführung durch beauftragten Fahrer',p:'Ein Fahrer kann das Auto übernehmen, wenn der Käufer nicht anreisen möchte. Vor Fahrtbeginn müssen Vollmacht, Übergabezustand, Haftung, Versicherung und Zielort feststehen. Eine Fahrt ersetzt keine umfassende technische Untersuchung.',points:['Fahrerkosten, Nebenkosten und Pannenfall schriftlich klären.','Foto-Protokoll bei Übernahme und Übergabe.','Rollen von Käufer, Vermittler und ausführender Person eindeutig festlegen.']},
        {h:'3. Anhänger und Fahrzeugtransporter',p:'Für nicht zugelassene, nicht fahrbereite, hochwertige oder mehrere Fahrzeuge kann ein Fahrzeugtransporter sinnvoll sein. Vergleichen Sie Frachtpreis, Termin, Beladebedingungen, Spediteurhaftung, erforderliche Frachtpapiere und zusätzlichen Versicherungsschutz.',points:['Start- und Zieladresse sowie Fahrzeugzustand nennen.','Zuladung und Ladungsmöglichkeiten prüfen.','CMR-Haftung ist nicht automatisch Vollkasko für das Fahrzeug.']},
        {h:'4. Duisburg–Niš als Beispiel',p:'Hypothetischer Fall: Ein Fahrzeug steht in Duisburg und soll nach Niš. Bei Selbstüberführung fallen Kennzeichen, Versicherung, Kraftstoff und Fahrerreise an. Für einen Transporter sind Fahrzeugdaten, genauer Abholort, Termin und Beladung nötig. Ohne diese Angaben ist ein fester Transportpreis unseriös.',points:['Fracht von Einfuhrabgaben und Zulassung trennen.','Alle enthaltenen und ausgeschlossenen Kosten schriftlich ausweisen.','Eine realistische Reserve für Unvorhergesehenes berücksichtigen.']},
        {h:'5. Angaben für ein brauchbares Angebot',p:'Bitte Fahrzeugtyp, Baujahr, Abhol- und Zielort, Fahrbereitschaft, Kennzeichenstatus sowie Wunschtermin übermitteln. Danach lassen sich Fahrerlösung, Trailer und Autotransporter vergleichen. Verfügbarkeit und Versicherung des konkreten Partners müssen zuerst bestätigt werden.',points:['Leistungsumfang und Preis vor Bestellung klären.','Ausführenden Beförderer und Zuständigkeiten benennen.','Keine Zahlung aufgrund einer bloßen unverbindlichen Schätzung.']}
      ],
      links:[['Serbische Zollverwaltung — Gebrauchtwagenimport',SOURCES.customs],['ADAC — Kaufvertrag und Übergabe',SOURCES.contract]]
    }
  }
};

function escapeHtml(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function render(lang,slug){
 const a=DATA[slug]?.[lang];
 if(!a)return '';
 const sr=lang==='sr';
 const sections=a.sections.map(s=>'<section class="card" style="margin:18px 0"><h3>'+escapeHtml(s.h)+'</h3><p>'+escapeHtml(s.p)+'</p><ul>'+s.points.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ul></section>').join('');
 return '<section class="section danini-expert-article" aria-label="'+escapeHtml(a.title)+'"><p class="eyebrow">AUTODANINI · '+(sr?'STRUČNI VODIČ':'PRAXISLEITFADEN')+' · 24.10.2026</p><h2>'+escapeHtml(a.title)+'</h2><p class="lead">'+escapeHtml(a.intro)+'</p>'+sections+
 '<h3>'+(sr?'Proverljivi izvori':'Nachprüfbare Quellen')+'</h3><ul>'+a.links.map(([t,u])=>'<li><a href="'+escapeHtml(u)+'" rel="noopener noreferrer" target="_blank">'+escapeHtml(t)+'</a></li>').join('')+'</ul>'+
 '<p class="muted">'+(sr?'Informacije su kontrolna lista, ne tehnički nalaz, garantovana cena ni pravni ili carinski savet. Stanje vozila i važeća pravila proveravaju se pojedinačno.':'Die Informationen sind eine Checkliste, kein technisches Gutachten, verbindlicher Preis oder Rechts- bzw. Zollberatung. Fahrzeuge und Regeln sind einzeln zu prüfen.')+'</p>'+
 '<p><a class="btn" href="/'+lang+'/'+(sr?'upit':'anfrage')+'">'+(sr?'Zatraži ponudu za konkretno vozilo':'Angebot für ein konkretes Fahrzeug anfordern')+' →</a></p></section>';
}
module.exports={render,SOURCES};