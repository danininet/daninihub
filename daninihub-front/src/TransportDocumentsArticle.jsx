import './KnowledgeArticle.css'
import { deviationEscalationArticlePaths, driverCommunicationArticlePaths, shiftHandoverArticlePaths, tmsArticlePaths } from './KnowledgePaths'

const article = {
  de: {
    eyebrow: 'PRAXIS & WISSEN · TRANSPORTDOKUMENTE',
    title: 'Transportdokumente übergeben: CMR, POD und offene Nachweise',
    lead: 'Ein Foto oder eine PDF im Postfach ist noch kein abgeschlossener Dokumentenprozess. Erst Identifikation, Qualitätsprüfung, Status, berechtigter Empfänger, Ablage und offener nächster Schritt machen einen Nachweis operativ nutzbar.',
    meta: '12 Min. Lesezeit · 19. Juli 2026 · Dragan Zdravković',
    summaryTitle: 'Executive Summary',
    summary: 'Transportdokumente sollten nicht nur gesammelt, sondern durch einen definierten Statusfluss geführt werden: erwartet, eingegangen, geprüft, Abweichung geklärt, übergeben und archiviert. Dabei müssen Tourbezug, Dokumentart, Quelle, Vollständigkeit, Lesbarkeit, Vorbehalte, Empfänger, Ablage sowie Verantwortung und Frist nachvollziehbar bleiben. „Eingegangen“, „geprüft“ und „vom vorgesehenen Empfänger akzeptiert“ sind drei unterschiedliche Aussagen.',
    principleTitle: 'Ein Dokument ist nicht erledigt, nur weil eine Datei vorhanden ist.',
    principleText: 'Ein Scan kann zur falschen Tour gehören, Seiten können fehlen, Stempel oder Unterschrift können unlesbar sein und der Kunde kann einen anderen Nachweis verlangen. Deshalb braucht jedes Dokument einen überprüfbaren Status – ohne fehlende Angaben nachträglich zu erfinden oder die Annahme durch einen Empfänger vorwegzunehmen.',
    rolesTitle: 'CMR, POD und offener Nachweis: drei verschiedene Rollen',
    rolesIntro: 'Die genaue Anforderung ergibt sich aus anwendbarem Recht, Vertrag und Kundenprozess. Das folgende Modell dient der operativen Einordnung und ist keine Rechts- oder Zollberatung.',
    roles: [
      ['CMR-Frachtbrief', 'Ein zentraler Beförderungsnachweis im Anwendungsbereich des CMR-Übereinkommens. Er strukturiert Angaben zum Transport und kann Vermerke oder Vorbehalte enthalten. Welche Ausfertigung benötigt wird, muss der konkrete Prozess festlegen.', 'CMR'],
      ['POD / Abliefernachweis', 'Der vom Vertrag oder Kundenprozess geforderte Nachweis der Ablieferung. Das kann beispielsweise eine unterzeichnete Seite, ein Lieferschein oder eine digitale Bestätigung sein – aber nur, wenn diese Form vorher als ausreichend definiert wurde.', 'POD'],
      ['Offener Nachweis', 'Ein erwartetes Dokument oder Merkmal ist noch nicht verwendbar: Seite, Datum, Unterschrift, Vermerk, Lesbarkeit, Zuordnung, Bestätigung oder vereinbarte Empfängerannahme fehlen.', 'OFFEN'],
    ],
    statusTitle: 'Vom erwarteten Dokument bis zur kontrollierten Ablage',
    flow: ['Erwartet', 'Eingegangen', 'Geprüft', 'Abweichung geklärt', 'Übergeben', 'Archiviert'],
    statusNote: 'Ein Status darf nur gesetzt werden, wenn seine Prüfkriterien erfüllt sind. „Geprüft“ bedeutet nicht automatisch „akzeptiert“; „übergeben“ bedeutet nicht automatisch „archiviert“.',
    risksTitle: 'Vier typische Fehler mit vermeidbaren Folgekosten',
    risks: [
      ['FALSCHER VORGANG', 'Dokument und Tour werden nur über Dateinamen oder Chatverlauf zugeordnet; Referenz, Fahrzeug oder Lieferort sind nicht geprüft.'],
      ['UNVOLLSTÄNDIG', 'Die Datei ist vorhanden, aber Seiten, Unterschrift, Datum, Vorbehalt oder Lesbarkeit wurden nicht gegen die Erwartung geprüft.'],
      ['FALSCHER EMPFÄNGER', 'Ein vollständiger Nachweis wird über einen nicht freigegebenen Kanal oder an eine nicht berechtigte Person weitergegeben.'],
      ['STATUS ZU FRÜH GESCHLOSSEN', '„Eingegangen“ wird als „akzeptiert“ behandelt, obwohl Rückfrage, Kundenprüfung oder Freigabe noch offen ist.'],
    ],
    recordTitle: 'Die 9 Pflichtinformationen einer Dokumentenübergabe',
    recordIntro: 'Mit diesen Feldern kann die nächste Person den Vorgang prüfen und fortsetzen, ohne Nachrichtenverläufe neu zu rekonstruieren.',
    recordFields: [
      ['01', 'Vorgangsbezug', 'Tour, Auftrag, Fahrzeug, Lade- oder Lieferstelle und eindeutige Referenz.'],
      ['02', 'Erwarteter Nachweis', 'Dokumentart, erforderliche Ausfertigung, Seiten oder vereinbarte Merkmale.'],
      ['03', 'Quelle', 'Von wem und über welchen freigegebenen Kanal das Dokument einging.'],
      ['04', 'Eingangszeit', 'Datum und Uhrzeit des tatsächlichen Eingangs.'],
      ['05', 'Qualitätsprüfung', 'Vollständigkeit, Lesbarkeit, Zuordnung und erkennbare Änderungen.'],
      ['06', 'Vermerke & Abweichungen', 'Fehlende Angaben, Vorbehalte, Schäden, Widersprüche oder offene Bestätigung.'],
      ['07', 'Empfänger & Kanal', 'Welche berechtigte Rolle den Nachweis wann und wie erhalten soll oder erhalten hat.'],
      ['08', 'Ablage & Version', 'Eindeutiger Speicherort, Dateiname, Version und Schutz vor parallelen Kopien.'],
      ['09', 'Verantwortung & Frist', 'Wer den offenen Schritt erledigt und bis wann erneut geprüft oder eskaliert wird.'],
    ],
    exampleTitle: 'Fiktives Beispiel: CMR eingegangen, POD-Anforderung noch offen',
    badLabel: 'Zu frühe Abschlussmeldung',
    bad: '„CMR ist angehängt. Dokumente erledigt.“',
    badReason: 'Es fehlen Tourbezug, erwartete Seiten, Qualitätsprüfung, Kundenanforderung, Empfänger, Ablage, Status und nächster Schritt.',
    goodLabel: 'Arbeitsfähiger Dokumentenstatus',
    example: [
      ['Vorgang', 'Tour DH-412 · Fahrzeug 31 · Ablieferung München · Referenz 84721'],
      ['Erwartung', 'CMR Seiten 1–4; vereinbarter POD: lesbare Abschlussseite mit Datum und Empfängerbestätigung'],
      ['Eingang', '18:22 Uhr · Fahrerscan über den freigegebenen Tourkanal'],
      ['Prüfung', 'Seiten 1–4 zugeordnet und lesbar; Unterschrift und Datum erkennbar; Empfängerstempel unklar'],
      ['Status', 'CMR eingegangen und geprüft · POD-Anforderung noch nicht bestätigt'],
      ['Ablage', 'TMS · Tour DH-412 · Dokumenttyp CMR · Version 1'],
      ['Offener Schritt', 'Bis 18:45 Uhr klären, ob die Empfängerbestätigung für diesen Kunden ausreicht; fehlende Bestätigung nicht selbst ergänzen'],
      ['Verantwortung', 'Abenddisposition prüft Kundenregel; bei Ablehnung Eskalation an die festgelegte interne Rolle'],
    ],
    goodReason: 'Der Datensatz trennt vorhandene Datei, Prüfergebnis, vertragliche POD-Anforderung und offene Entscheidung.',
    digitalTitle: 'e-CMR: digital bedeutet nicht automatisch überall akzeptiert',
    digitalText: 'Das Zusatzprotokoll ermöglicht den elektronischen Frachtbrief im entsprechenden Anwendungsrahmen. Ob ein e-CMR im konkreten Transport eingesetzt und akzeptiert werden kann, hängt jedoch unter anderem von beteiligten Staaten, Parteien, anwendbarem Prozess, Vertrag und technischer Lösung ab. Deshalb muss die aktuelle Anwendbarkeit vorab geprüft werden; ein Foto eines Papierdokuments ist nicht allein deshalb ein e-CMR.',
    privacyTitle: 'Dokumente enthalten häufig personenbezogene Daten',
    privacyText: 'Namen, Unterschriften, Telefonnummern, Kennzeichen oder Fahrerdaten dürfen nicht wahllos verteilt werden. Für jede Verarbeitung braucht der Verantwortliche eine passende Rechtsgrundlage; eine Einwilligung ist weder automatisch erforderlich noch stets die passende Grundlage. Operativ gelten insbesondere Zweckbindung, Datenminimierung, begrenzter Zugriff, sicherer Übertragungsweg, festgelegte Aufbewahrung und nachvollziehbare Löschung. Persönliche Chats und unkontrollierte Dateikopien sollten nicht zum Dokumentenarchiv werden.',
    sourcesTitle: 'Offizielle Grundlagen zur eigenen Prüfung',
    sourcesIntro: 'Die Links führen zu Primärquellen. Sie ersetzen nicht die Prüfung des konkreten Vertrags, Transportfalls oder nationalen Rechts.',
    sources: [
      ['UNECE: Executive Guide on e-CMR', 'CMR-Grundlage, elektronischer Frachtbrief und Umsetzungsrahmen.', 'https://unece.org/trade/documents/2023/10/executive-guide-e-cmr'],
      ['EUR-Lex: Datenschutz-Grundverordnung', 'Offizieller Text, insbesondere Grundsätze nach Artikel 5 und Rechtsgrundlagen nach Artikel 6.', 'https://eur-lex.europa.eu/eli/reg/2016/679/oj/deu'],
    ],
    checklistTitle: 'Schnellcheck vor dem Status „Dokument vollständig“',
    checklistIntro: 'Diese zehn Fragen prüfen den operativen Abschluss. Die vertragliche oder rechtliche Anerkennung muss zusätzlich nach dem konkreten Prozess beurteilt werden.',
    checks: [
      'Ist das Dokument eindeutig der richtigen Tour und Referenz zugeordnet?',
      'Entspricht die Dokumentart der vorher definierten Anforderung?',
      'Sind alle erwarteten Seiten und Ausfertigungen vorhanden?',
      'Sind relevante Angaben, Datum, Unterschrift und Vermerke lesbar?',
      'Sind Schäden, Vorbehalte, Widersprüche oder fehlende Angaben markiert?',
      'Wurde nichts ergänzt, verändert oder als bestätigt dargestellt, was nicht belegt ist?',
      'Ist der vorgesehene Empfänger berechtigt und der Übertragungskanal freigegeben?',
      'Sind Eingang, Prüfung, Versand und aktueller Status nachvollziehbar protokolliert?',
      'Existiert eine eindeutige Ablage mit kontrollierter Version?',
      'Sind für jeden offenen Punkt verantwortliche Person, Frist und Eskalationsweg benannt?',
    ],
    noteTitle: 'Verantwortungsgrenze',
    note: 'Operative Unterstützung kann Dokumente zuordnen, auf vereinbarte formale Merkmale und Lesbarkeit prüfen, Status dokumentieren und offene Punkte nachhalten. Sie bestätigt nicht eigenständig Echtheit, rechtliche Wirksamkeit, Zollfreigabe, Haftung, Schadenregulierung oder endgültige Kundenakzeptanz.',
    faqTitle: 'Häufige Fragen',
    faq: [
      ['Reicht ein Foto des CMR als POD?', 'Nur wenn der konkrete Vertrag und Kundenprozess diese Form akzeptieren und alle geforderten Angaben vollständig und lesbar sind. Ein Foto sollte deshalb nicht pauschal als ausreichender POD bezeichnet werden.'],
      ['Was ist der Unterschied zwischen eingegangen, geprüft und akzeptiert?', 'Eingegangen bestätigt den Erhalt. Geprüft dokumentiert die festgelegte Qualitätskontrolle. Akzeptiert bedeutet, dass die dafür vorgesehene berechtigte Stelle den Nachweis nach ihrem Prozess angenommen hat.'],
      ['Kann ein digitales Dokument Papier immer ersetzen?', 'Nein. Beim e-CMR müssen der anwendbare rechtliche Rahmen, die beteiligten Staaten und Parteien sowie Vertrag, Prozess und technische Lösung geprüft werden.'],
      ['Was tun, wenn Unterschrift, Datum oder Seite fehlt?', 'Nicht selbst ergänzen und den Vorgang nicht schließen. Fehlstelle exakt dokumentieren, verantwortliche Rolle informieren und den vereinbarten Korrektur- oder Eskalationsweg mit Frist starten.'],
    ],
    relatedTitle: 'Passende Fachbeiträge',
    related: [
      ['Schichtübergabe in der Disposition', 'Dokumentenstatus, offene Verantwortung und nächste Prüfung kontrolliert weitergeben.', 'Artikel zur Schichtübergabe lesen', shiftHandoverArticlePaths.de],
      ['Transportabweichungen richtig eskalieren', 'Fehlende oder abgelehnte Nachweise mit Schwelle, Auswirkung und Entscheidungsfrage eskalieren.', 'Eskalationsartikel lesen', deviationEscalationArticlePaths.de],
      ['Fahrerkommunikation Balkan–DACH', 'Dokumentenanfrage und Rückbestätigung mit eindeutigem Tourbezug formulieren.', 'Artikel zur Fahrerkommunikation lesen', driverCommunicationArticlePaths.de],
      ['Warum TMS-Systeme Disponenten nicht ersetzen', 'Warum eine gespeicherte Datei noch keine geprüfte operative Information ist.', 'Grundlagenartikel lesen', tmsArticlePaths.de],
    ],
    back: 'Praxis & Wissen',
    ctaEyebrow: 'DOCUMENT WORKFLOW PILOT',
    ctaTitle: 'Einen kontrollierten Dokumentenfluss an einem begrenzten Prozess testen.',
    ctaText: 'Der Pilot definiert Dokumentarten, Status, Prüfkriterien, Empfänger, freigegebene Kanäle, Ablage, Datenschutzgrenzen und Eskalation für einen klar abgegrenzten Ablauf.',
    cta: 'Pilot-Check starten',
    pilotLink: '/de/pilot-check',
  },
  sr: {
    eyebrow: 'PRAKSA I ZNANJE · TRANSPORTNA DOKUMENTA',
    title: 'Predaja transportnih dokumenata: CMR, POD i otvoreni dokazi',
    lead: 'Fotografija ili PDF u prijemnom sandučetu još ne znače da je dokumentacioni proces završen. Tek identifikacija, provera kvaliteta, status, ovlašćeni primalac, mesto čuvanja i otvoren sledeći korak čine dokaz operativno upotrebljivim.',
    meta: '12 min. čitanja · 19. jul 2026. · Dragan Zdravković',
    summaryTitle: 'Sažetak za rukovodioce',
    summary: 'Transportna dokumenta ne treba samo sakupljati, već voditi kroz definisan tok statusa: očekivano, primljeno, provereno, odstupanje razjašnjeno, predato i arhivirano. Veza sa turom, vrsta dokumenta, izvor, potpunost, čitljivost, primedbe, primalac, mesto čuvanja, odgovornost i rok moraju ostati proverljivi. „Primljeno“, „provereno“ i „prihvaćeno od predviđenog primaoca“ predstavljaju tri različite tvrdnje.',
    principleTitle: 'Dokumentacioni proces nije završen samo zato što datoteka postoji.',
    principleText: 'Sken može pripadati pogrešnoj turi, stranice mogu nedostajati, pečat ili potpis mogu biti nečitljivi, a klijent može zahtevati drugi dokaz. Zato je svakom dokumentu potreban proverljiv status, bez naknadnog izmišljanja podataka ili unapred pretpostavljenog prihvatanja od strane primaoca.',
    rolesTitle: 'CMR, POD i otvoreni dokaz: tri različite uloge',
    rolesIntro: 'Tačan zahtev proizlazi iz primenjivog prava, ugovora i procesa klijenta. Sledeći model služi operativnoj klasifikaciji i nije pravni ili carinski savet.',
    roles: [
      ['CMR tovarni list', 'Važan transportni dokument u okviru primene CMR konvencije. Strukturira podatke o prevozu i može sadržati napomene ili rezerve. Konkretan proces mora odrediti koja kopija ili verzija je potrebna.', 'CMR'],
      ['POD / dokaz isporuke', 'Dokaz isporuke zahtevan ugovorom ili procesom klijenta. To može biti potpisana stranica, otpremnica ili digitalna potvrda, ali samo ako je ta forma unapred definisana kao dovoljna.', 'POD'],
      ['Otvoreni dokaz', 'Očekivani dokument ili obavezno svojstvo još nije upotrebljivo: nedostaju stranica, datum, potpis, napomena, čitljivost, povezivanje, potvrda ili dogovoreni prijem.', 'OTVORENO'],
    ],
    statusTitle: 'Od očekivanog dokumenta do kontrolisane arhive',
    flow: ['Očekivano', 'Primljeno', 'Provereno', 'Odstupanje rešeno', 'Predato', 'Arhivirano'],
    statusNote: 'Status se postavlja tek kada su ispunjeni njegovi kriterijumi. „Provereno“ ne znači automatski „prihvaćeno“, a „predato“ ne znači automatski „arhivirano“.',
    risksTitle: 'Četiri česte greške koje stvaraju nepotrebne posledice',
    risks: [
      ['POGREŠAN SLUČAJ', 'Dokument se povezuje sa turom samo preko naziva datoteke ili istorije poruka; referenca, vozilo ili mesto isporuke nisu provereni.'],
      ['NEPOTPUNO', 'Fajl postoji, ali stranice, potpis, datum, rezerva ili čitljivost nisu provereni prema očekivanom zahtevu.'],
      ['POGREŠAN PRIMALAC', 'Potpun dokaz se šalje neodobrenim kanalom ili osobi koja nije ovlašćena da ga primi.'],
      ['STATUS PRERANO ZATVOREN', '„Primljeno“ se tretira kao „prihvaćeno“, iako su pitanje, provera klijenta ili odobrenje još otvoreni.'],
    ],
    recordTitle: 'Devet obaveznih informacija za predaju dokumenta',
    recordIntro: 'Sa ovim poljima sledeća osoba može da proveri i nastavi slučaj bez ponovne rekonstrukcije istorije poruka.',
    recordFields: [
      ['01', 'Veza sa slučajem', 'Tura, nalog, vozilo, mesto utovara ili isporuke i jedinstvena referenca.'],
      ['02', 'Očekivani dokaz', 'Vrsta dokumenta, potrebna verzija, stranice ili dogovorena svojstva.'],
      ['03', 'Izvor', 'Od koga i kojim odobrenim kanalom je dokument primljen.'],
      ['04', 'Vreme prijema', 'Datum i vreme stvarnog prijema.'],
      ['05', 'Provera kvaliteta', 'Potpunost, čitljivost, tačno povezivanje i vidljive izmene.'],
      ['06', 'Napomene i odstupanja', 'Nedostajući podaci, rezerve, šteta, protivrečnosti ili nepotvrđen prijem.'],
      ['07', 'Primalac i kanal', 'Koja ovlašćena uloga treba da primi ili je primila dokaz, kada i kako.'],
      ['08', 'Mesto i verzija', 'Jedinstveno mesto čuvanja, naziv datoteke, verzija i kontrola paralelnih kopija.'],
      ['09', 'Odgovornost i rok', 'Ko završava otvoreni korak i do kada se ponovo proverava ili eskalira.'],
    ],
    exampleTitle: 'Fiktivni primer: CMR je primljen, POD zahtev je još otvoren',
    badLabel: 'Prerano označen završetak',
    bad: '„CMR je u prilogu. Dokumenta završena.“',
    badReason: 'Nedostaju veza sa turom, očekivane stranice, provera kvaliteta, zahtev klijenta, primalac, mesto čuvanja, status i sledeći korak.',
    goodLabel: 'Upotrebljiv status dokumenta',
    example: [
      ['Slučaj', 'Tura DH-412 · vozilo 31 · isporuka Minhen · referenca 84721'],
      ['Očekivanje', 'CMR stranice 1–4; ugovoreni POD: čitljiva završna stranica sa datumom i potvrdom primaoca'],
      ['Prijem', '18:22 · sken koji je vozač poslao preko odobrenog kanala ture'],
      ['Provera', 'Stranice 1–4 povezane i čitljive; potpis i datum vidljivi; pečat primaoca nejasan'],
      ['Status', 'CMR primljen i proveren · POD zahtev još nije potvrđen'],
      ['Mesto', 'TMS · tura DH-412 · vrsta dokumenta CMR · verzija 1'],
      ['Otvoren korak', 'Do 18:45 proveriti da li potvrda primaoca odgovara pravilu ovog klijenta; podatak koji nedostaje ne dopunjavati samostalno'],
      ['Odgovornost', 'Večernja dispozicija proverava dokumentacioni zahtev klijenta; ako dokaz nije prihvaćen, slučaj prosleđuje unapred određenoj internoj ulozi'],
    ],
    goodReason: 'Zapis jasno razdvaja primljenu datoteku, rezultat provere, ugovoreni zahtev za POD i otvorenu odluku.',
    digitalTitle: 'e-CMR: digitalno ne znači automatski prihvaćeno svuda',
    digitalText: 'Dodatni protokol omogućava elektronski tovarni list u odgovarajućem okviru primene. Da li e-CMR može da se koristi i prihvati u konkretnom transportu zavisi, između ostalog, od država i strana koje učestvuju, primenjivog procesa, ugovora i tehničkog rešenja. Zato aktuelnu primenu treba unapred proveriti; fotografija papirnog dokumenta nije samo zbog toga e-CMR.',
    privacyTitle: 'Dokumenta često sadrže podatke o ličnosti',
    privacyText: 'Imena, potpisi, brojevi telefona, registarske oznake ili podaci o vozaču ne smeju se nekontrolisano deliti. Za svaku obradu rukovalac mora imati odgovarajući pravni osnov; saglasnost nije automatski neophodna niti je uvek odgovarajući osnov. Operativno su važni ograničenje svrhe, minimizacija podataka, ograničen pristup, bezbedan prenos, definisano čuvanje i proverljivo brisanje. Privatne razmene poruka i nekontrolisane kopije ne treba da postanu arhiva dokumenata.',
    sourcesTitle: 'Zvanični izvori za sopstvenu proveru',
    sourcesIntro: 'Linkovi vode ka primarnim izvorima. Ne zamenjuju proveru konkretnog ugovora, transportnog slučaja ili nacionalnog prava.',
    sources: [
      ['UNECE: vodič za e-CMR', 'Osnova CMR-a, elektronski tovarni list i okvir primene.', 'https://unece.org/trade/documents/2023/10/executive-guide-e-cmr'],
      ['EUR-Lex: Opšta uredba o zaštiti podataka', 'Zvanični tekst, posebno načela iz člana 5 i pravni osnovi iz člana 6.', 'https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng'],
    ],
    checklistTitle: 'Brza provera pre statusa „dokument je potpun“',
    checklistIntro: 'Ovih deset pitanja proverava operativni završetak. Ugovorno ili pravno priznavanje dodatno se procenjuje prema konkretnom procesu.',
    checks: [
      'Da li je dokument nedvosmisleno povezan sa pravom turom i referencom?',
      'Da li vrsta dokumenta odgovara unapred definisanom zahtevu?',
      'Da li su prisutne sve očekivane stranice i verzije?',
      'Da li su relevantni podaci, datum, potpis i napomene čitljivi?',
      'Da li su šteta, rezerve, protivrečnosti ili podaci koji nedostaju označeni?',
      'Da li ništa nije dopunjeno, izmenjeno ili predstavljeno kao potvrđeno bez dokaza?',
      'Da li je primalac ovlašćen, a kanal za prenos odobren?',
      'Da li su prijem, provera, slanje i aktuelni status proverljivo zabeleženi?',
      'Da li postoji jedinstveno mesto čuvanja sa kontrolisanom verzijom?',
      'Da li svaki otvoreni korak ima odgovornu osobu, rok i put eskalacije?',
    ],
    noteTitle: 'Granica odgovornosti',
    note: 'Operativna podrška može da poveže dokument sa turom, proveri dogovorena formalna svojstva i čitljivost, zabeleži status i prati otvorene stavke. Ona ne potvrđuje samostalno autentičnost, pravno dejstvo, carinsko puštanje, odgovornost, rešavanje štete ili konačno prihvatanje klijenta.',
    faqTitle: 'Česta pitanja',
    faq: [
      ['Da li je fotografija CMR-a dovoljna kao POD?', 'Samo ako konkretan ugovor i proces klijenta prihvataju tu formu i svi zahtevani podaci su potpuni i čitljivi. Fotografiju zato ne treba unapred označiti kao dovoljan POD.'],
      ['Koja je razlika između primljeno, provereno i prihvaćeno?', 'Primljeno potvrđuje prijem. Provereno dokumentuje definisanu kontrolu kvaliteta. Prihvaćeno znači da je za to predviđena ovlašćena strana prihvatila dokaz prema svom procesu.'],
      ['Može li digitalni dokument uvek da zameni papir?', 'Ne. Kod e-CMR-a treba proveriti primenjivi pravni okvir, države i strane koje učestvuju, kao i ugovor, proces i tehničko rešenje.'],
      ['Šta uraditi ako nedostaju potpis, datum ili stranica?', 'Ne dopunjavati samostalno i ne zatvarati slučaj. Tačno zabeležiti šta nedostaje, obavestiti odgovornu ulogu i pokrenuti dogovoreni put korekcije ili eskalacije sa rokom.'],
    ],
    relatedTitle: 'Povezani stručni članci',
    related: [
      ['Predaja smene u dispoziciji', 'Kontrolisano predajte status dokumenta, otvorenu odgovornost i sledeću proveru.', 'Pročitaj članak o predaji', shiftHandoverArticlePaths.sr],
      ['Eskalacija odstupanja u transportu', 'Nedostajući ili odbijen dokaz eskalirajte uz prag, posledicu i pitanje za odluku.', 'Pročitaj članak o eskalaciji', deviationEscalationArticlePaths.sr],
      ['Balkan–DACH komunikacija sa vozačima', 'Zahtev za dokument i povratnu potvrdu formulišite sa jasnom vezom prema turi.', 'Pročitaj članak o komunikaciji', driverCommunicationArticlePaths.sr],
      ['Zašto TMS ne menja disponente', 'Zašto sačuvana datoteka još nije proverena operativna informacija.', 'Pročitaj osnovni članak', tmsArticlePaths.sr],
    ],
    back: 'Praksa i znanje',
    ctaEyebrow: 'DOCUMENT WORKFLOW PILOT',
    ctaTitle: 'Testirajte kontrolisan tok dokumenata na ograničenom procesu.',
    ctaText: 'Pilot definiše vrste dokumenata, statuse, kriterijume provere, primaoce, odobrene kanale, mesto čuvanja, granice zaštite podataka i eskalaciju za jasno ograničen tok.',
    cta: 'Pokreni proveru pilota',
    pilotLink: '/sr/provera-pilota',
  },
}

export default function TransportDocumentsArticle({ lang }) {
  const t = article[lang]
  const sr = lang === 'sr'

  return <main className="knowledge-page">
    <section className="knowledge-hero">
      <a className="article-back" href={sr ? '/sr/praksa-znanje' : '/de/praxis-wissen'}>← {t.back}</a>
      <div className="knowledge-eyebrow">{t.eyebrow}</div>
      <h1>{t.title}</h1>
      <p>{t.lead}</p>
      <div className="article-meta">{t.meta}</div>
    </section>

    <article className="knowledge-article">
      <aside className="executive-summary">
        <strong>{t.summaryTitle}</strong>
        <p>{t.summary}</p>
      </aside>

      <section>
        <h2>{t.principleTitle}</h2>
        <p>{t.principleText}</p>
      </section>

      <section className="document-roles-section">
        <h2>{t.rolesTitle}</h2>
        <p>{t.rolesIntro}</p>
        <div className="document-role-grid">
          {t.roles.map(([title, description, tag]) => <article key={tag}>
            <span>{tag}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>)}
        </div>
      </section>

      <figure className="driver-loop document-flow" aria-labelledby="document-flow-title">
        <figcaption id="document-flow-title">{t.statusTitle}</figcaption>
        <div>{t.flow.map((item, index) => <span key={item}>
          <b>{String(index + 1).padStart(2, '0')}</b>
          <strong>{item}</strong>
        </span>)}</div>
        <p>{t.statusNote}</p>
      </figure>

      <section className="document-risks-section">
        <h2>{t.risksTitle}</h2>
        <div className="driver-risk-grid document-risk-grid">
          {t.risks.map(([tag, description]) => <article key={tag}>
            <span>{tag}</span>
            <p>{description}</p>
          </article>)}
        </div>
      </section>

      <section className="document-record-section">
        <h2>{t.recordTitle}</h2>
        <p>{t.recordIntro}</p>
        <ol className="driver-protocol-grid document-record-grid">
          {t.recordFields.map(([number, title, description]) => <li key={number}>
            <span>{number}</span>
            <div><strong>{title}</strong><p>{description}</p></div>
          </li>)}
        </ol>
      </section>

      <section className="handover-example-section document-example-section">
        <h2>{t.exampleTitle}</h2>
        <article className="handover-bad-example">
          <span>{t.badLabel}</span>
          <blockquote>{t.bad}</blockquote>
          <p>{t.badReason}</p>
        </article>
        <article className="handover-good-example">
          <span>{t.goodLabel}</span>
          <dl>{t.example.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>
          <p>{t.goodReason}</p>
        </article>
      </section>

      <section className="document-boundary-grid">
        <article>
          <span>E-CMR</span>
          <h2>{t.digitalTitle}</h2>
          <p>{t.digitalText}</p>
        </article>
        <article>
          <span>GDPR / DSGVO</span>
          <h2>{t.privacyTitle}</h2>
          <p>{t.privacyText}</p>
        </article>
      </section>

      <section className="article-sources-section">
        <h2>{t.sourcesTitle}</h2>
        <p>{t.sourcesIntro}</p>
        <div className="article-source-grid">
          {t.sources.map(([title, description, href]) => <a href={href} target="_blank" rel="noopener noreferrer" key={href}>
            <strong>{title}</strong>
            <span>{description}</span>
            <b aria-hidden="true">↗</b>
          </a>)}
        </div>
      </section>

      <section className="article-checklist">
        <h2>{t.checklistTitle}</h2>
        <p className="checklist-intro">{t.checklistIntro}</p>
        {t.checks.map(item => <label key={item}>
          <input type="checkbox" />
          <span>{item}</span>
        </label>)}
        <div className="checklist-note">
          <strong>{t.noteTitle}</strong>
          <p>{t.note}</p>
        </div>
      </section>

      <section className="article-faq">
        <h2>{t.faqTitle}</h2>
        {t.faq.map(([question, answer]) => <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>)}
      </section>

      <section className="related-articles-section">
        <h2>{t.relatedTitle}</h2>
        <div className="related-articles-grid">
          {t.related.map(([title, description, cta, href]) => <article key={href}>
            <h3>{title}</h3>
            <p>{description}</p>
            <a href={href}>{cta} →</a>
          </article>)}
        </div>
      </section>

      <section className="article-cta">
        <span>{t.ctaEyebrow}</span>
        <h2>{t.ctaTitle}</h2>
        <p>{t.ctaText}</p>
        <a href={t.pilotLink}>{t.cta} →</a>
      </section>
    </article>
  </main>
}
