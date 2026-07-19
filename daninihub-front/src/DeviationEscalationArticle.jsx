import './KnowledgeArticle.css'
import { driverCommunicationArticlePaths, etaArticlePaths, shiftHandoverArticlePaths, tmsArticlePaths, transportDocumentsArticlePaths } from './KnowledgePaths'

const article = {
  de: {
    eyebrow: 'PRAXIS & WISSEN · ABWEICHUNG & ESKALATION',
    title: 'Transportabweichungen richtig eskalieren: Schwellen, Verantwortung und Entscheidung',
    lead: 'Nicht jede Abweichung braucht Management-Aufmerksamkeit. Aber jede Abweichung braucht eine Einordnung: beobachten, operativ warnen, eine Entscheidung anfordern oder sofort den festgelegten kritischen Weg aktivieren.',
    meta: '11 Min. Lesezeit · 19. Juli 2026 · Dragan Zdravković',
    summaryTitle: 'Executive Summary',
    summary: 'Eine Eskalation ist keine Weiterleitung eines Problems und kein Ersatz für Verantwortung. Sie ist eine strukturierte Anforderung an die richtige autorisierte Stelle: bestätigter Fakt, messbare Schwelle, betriebliche Auswirkung, bereits ausgeführte Schritte, mögliche Optionen, konkrete Entscheidung und spätester Entscheidungszeitpunkt. Unternehmen sollten diese Schwellen, Rollen und Ersatzkontakte vor dem operativen Einsatz definieren – nicht erst während einer Störung.',
    principleTitle: 'Eine Meldung informiert. Eine Eskalation fordert eine Handlung oder Entscheidung.',
    principleText: '„Fahrzeug verspätet“ ist eine Statusmeldung. „Die bestätigte Abweichung überschreitet um 20 Minuten unsere Slot-Schwelle; bitte bis 15:10 Uhr freigeben, ob ein neues Zeitfenster angefragt werden darf“ ist eine Eskalation. Der Unterschied liegt in Schwelle, Auswirkung, Entscheidungsbedarf, Zuständigkeit und Frist.',
    levelsTitle: 'Vier Eskalationsstufen für den operativen Alltag',
    levelsIntro: 'Die Bezeichnungen sind ein Arbeitsmodell. Zeitgrenzen, Verantwortliche und Kommunikationswege müssen zum Unternehmen, Auftrag und Risiko passen.',
    levels: [
      ['STUFE 0', 'Beobachten', 'Der Vorgang liegt innerhalb der vereinbarten Toleranz. Status und nächster Prüfpunkt werden dokumentiert; es ist noch keine zusätzliche Freigabe erforderlich.', 'status'],
      ['STUFE 1', 'Operativ warnen', 'Eine Schwelle könnte überschritten werden. Die verantwortliche operative Rolle erhält Frühwarnung, aktuelle Prognose und nächsten Prüfzeitpunkt.', 'warning'],
      ['STUFE 2', 'Entscheidung anfordern', 'Auswirkung oder Schwelle ist bestätigt und eine Handlung liegt außerhalb der vorhandenen Freigabe. Optionen, Entscheidungsfrage und Frist werden eskaliert.', 'decision'],
      ['STUFE 3', 'Kritischen Weg aktivieren', 'Sicherheitsereignis, Schaden, Kontrollverlust oder ein anderer definierter kritischer Auslöser erfordert sofort den internen Notfall-, Sicherheits- oder Behördenweg.', 'critical'],
    ],
    levelNoteTitle: 'Keine universellen Minutenwerte',
    levelNote: 'Eine Verspätung von 15 Minuten kann bei einem flexiblen Termin unkritisch und bei einem festen Slot entscheidend sein. Deshalb gehören Schwellen immer zu einem konkreten Prozess, Kundenversprechen und Entscheidungsrecht.',
    triggersTitle: 'Sechs Arten messbarer Eskalationsauslöser',
    triggers: [
      ['Zeit', 'ETA, Slot-Puffer oder vereinbarte Meldefrist überschreitet einen definierten Wert.'],
      ['Informationsqualität', 'Status ist widersprüchlich, veraltet oder kann nicht über die vereinbarte Quelle bestätigt werden.'],
      ['Betriebliche Auswirkung', 'Rampe, Folgeauftrag, Fahrerzeit, Kundenprozess oder Kapazitätsplanung sind konkret gefährdet.'],
      ['Freigabegrenze', 'Kosten, neue Zusage, Routenänderung oder andere Handlung liegt außerhalb der erteilten Befugnis.'],
      ['Dokumente & Nachweise', 'Ein fehlendes, falsches oder nicht bestätigtes Dokument blockiert den vereinbarten nächsten Prozessschritt.'],
      ['Sicherheit & Vorfall', 'Personen-, Fahrzeug-, Ladungs- oder Sicherheitsereignis aktiviert unmittelbar den dafür vorgesehenen kritischen Meldeweg.'],
    ],
    sections: [
      ['Frühwarnung ist noch keine Dramatisierung', 'Eine gute Stufe-1-Meldung schafft Vorbereitungszeit, ohne eine unbestätigte Auswirkung als Tatsache darzustellen. Sie nennt den aktuellen Informationsstand, das mögliche Risiko und den nächsten Prüfpunkt. So kann die verantwortliche Stelle Kapazität oder Optionen vorbereiten, bevor eine Entscheidung tatsächlich nötig wird.'],
      ['Eine Eskalation ohne Entscheidungsfrage bleibt nur ein Problembericht', 'Die empfangende Person muss erkennen, was genau von ihr erwartet wird: Information bestätigen, neues Zeitfenster freigeben, Kostenlimit genehmigen, Kundenkontakt übernehmen oder eine andere Option wählen. Je konkreter die Frage, desto schneller kann verantwortungsvoll entschieden werden.'],
      ['Kritische Ereignisse warten nicht auf perfekte Dokumentation', 'Bei einem definierten Sicherheits- oder Notfallauslöser gilt zuerst der vorgesehene unmittelbare Melde- und Schutzweg. Dokumentation wird parallel oder anschließend vervollständigt. Dieser Artikel ersetzt weder betriebliche Notfallregeln noch gesetzliche Meldepflichten.'],
    ],
    packetTitle: 'Die 7 Bestandteile eines entscheidungsfähigen Eskalationspakets',
    packetIntro: 'Die Eskalation soll die autorisierte Person in die Lage versetzen, ohne erneute Rekonstruktion zu entscheiden.',
    packet: [
      ['01', 'Vorgang', 'Tour, Fahrzeug, Auftrag und relevanter Ort.'],
      ['02', 'Bestätigter Fakt', 'Was ist passiert, wann und durch welche Quelle bestätigt?'],
      ['03', 'Auswirkung', 'Welche Schwelle ist betroffen und welches operative Risiko entsteht?'],
      ['04', 'Bereits erledigt', 'Welche Kontakte, Prüfungen oder Sicherungsmaßnahmen wurden ausgeführt – mit Ergebnis?'],
      ['05', 'Optionen', 'Welche realistischen Handlungswege bestehen und welche Grenze hat jede Option?'],
      ['06', 'Entscheidungsfrage', 'Welche konkrete Freigabe wird von welcher autorisierten Rolle benötigt?'],
      ['07', 'Frist & nächste Meldung', 'Bis wann ist die Entscheidung nötig und wann folgt das nächste Update?'],
    ],
    flowTitle: 'Vom Signal zur kontrollierten Entscheidung',
    flow: ['Erkennen', 'Bestätigen', 'Einstufen', 'Entscheiden', 'Dokumentieren'],
    exampleTitle: 'Beispiel: eine bestätigte Verspätung gefährdet den Entladeslot',
    badLabel: 'Problem weitergeleitet',
    bad: '„Fahrer kommt zu spät und der Kunde ist unzufrieden. Was sollen wir machen?“',
    badReason: 'Es fehlen bestätigter Status, Schwelle, aktuelle ETA, bereits ausgeführte Schritte, Entscheidungsoptionen, zuständige Rolle und Frist.',
    goodLabel: 'Entscheidungsfähige Eskalation',
    record: [
      ['Vorgang', 'Tour DH-318 · Fahrzeug 22 · Entladung Nürnberg'],
      ['Fakt / Quelle', '14:42 Uhr: Fahrer meldet Vollsperrung; Position und Stillstand um 14:46 Uhr per Telematik geprüft'],
      ['Schwelle / Auswirkung', 'Operative ETA 16:25–16:45 Uhr; bestätigter Slot 16:00 Uhr; interne Eskalationsschwelle von 20 Minuten überschritten'],
      ['Erledigt', 'Fahrer bestätigt sicheren Stillstand; keine neue Kundenzeit zugesagt; Entladestelle noch nicht kontaktiert'],
      ['Option A', 'Freigabe, sofort ein neues Zeitfenster anzufragen'],
      ['Option B', 'Kundenkontakt durch zuständige interne Stelle übernehmen lassen'],
      ['Benötigte Entscheidung', 'Bitte bis 15:05 Uhr festlegen, wer den Kunden kontaktiert und ob ein neues Zeitfenster angefragt werden darf'],
      ['Nächste Meldung', 'Disposition prüft Fahrerstatus um 15:00 Uhr erneut und ergänzt ETA sowie Kundenreaktion im TMS'],
    ],
    goodReason: 'Die verantwortliche Stelle sieht Fakt, Schwelle, Auswirkung, Grenzen, Optionen und Entscheidungsfrist in einem Datensatz.',
    checklistTitle: 'Schnellcheck vor einer Eskalation',
    checklistIntro: 'Diese zehn Fragen verhindern, dass nur Dringlichkeit weitergegeben wird, aber die Grundlage für eine Entscheidung fehlt.',
    checks: [
      'Ist der relevante Fakt bestätigt oder klar als unbestätigt markiert?',
      'Sind Zeitpunkt und Quelle des letzten Status genannt?',
      'Ist die betroffene Schwelle oder Freigabegrenze konkret benannt?',
      'Ist die betriebliche Auswirkung nachvollziehbar beschrieben?',
      'Sind bereits ausgeführte Schritte und ihre Ergebnisse dokumentiert?',
      'Sind nur realistische und zulässige Optionen aufgeführt?',
      'Ist die benötigte Entscheidung als eindeutige Frage formuliert?',
      'Ist klar, welche autorisierte Rolle entscheiden darf?',
      'Stehen Entscheidungsfrist und nächster Prüfzeitpunkt fest?',
      'Ist ein Ersatz- oder kritischer Weg definiert, falls niemand erreichbar ist?',
    ],
    noteTitle: 'Verantwortungsgrenze',
    note: 'Operative Unterstützung darf Fakten prüfen, Optionen strukturieren und die Eskalation nachhalten. Sie ersetzt nicht die autorisierte Entscheidung über Kosten, verbindliche Zusagen, Sicherheitsmaßnahmen, Vertragsänderungen oder unternehmerisches Risiko.',
    faqTitle: 'Häufige Fragen',
    faq: [
      ['Wann sollte eine Abweichung nicht eskaliert werden?', 'Wenn sie innerhalb der vereinbarten Toleranz liegt, keine zusätzliche Entscheidung erfordert und der nächste Prüfpunkt kontrolliert ist. Sie wird trotzdem dokumentiert und beobachtet.'],
      ['Muss bei jeder Verspätung der Kunde informiert werden?', 'Nein, sondern nach den vereinbarten Meldegrenzen, Verantwortlichkeiten und Kundenprozessen. Diese Regeln sollten vorab festgelegt sein.'],
      ['Was ist der Unterschied zwischen Warnung und Eskalation?', 'Eine Warnung schafft Aufmerksamkeit und Vorbereitungszeit. Eine Eskalation fordert eine konkrete Entscheidung, Freigabe oder Aktivierung eines festgelegten Weges.'],
      ['Was passiert, wenn die entscheidungsberechtigte Person nicht erreichbar ist?', 'Dafür braucht es vorab einen Ersatzkontakt, eine zeitliche Schwelle und klare Grenzen für zulässige Zwischenmaßnahmen. Ohne solchen Weg darf operative Unterstützung keine Befugnis erfinden.'],
    ],
    relatedTitle: 'Passende Fachbeiträge',
    related: [
      ['Schichtübergabe in der Disposition', 'Offene Entscheidungen, Verantwortung und nächste Prüfung kontrolliert übergeben.', 'Artikel zur Schichtübergabe lesen', shiftHandoverArticlePaths.de],
      ['ETA ist keine Zusage', 'Prognose und bestätigten Kundentermin vor der Eskalation sauber trennen.', 'ETA-Artikel lesen', etaArticlePaths.de],
      ['Fahrerkommunikation Balkan–DACH', 'Bestätigten Fahrerstatus und sichere Rückmeldung strukturiert dokumentieren.', 'Artikel zur Fahrerkommunikation lesen', driverCommunicationArticlePaths.de],
      ['CMR, POD und offene Nachweise', 'Fehlende oder nicht akzeptierte Dokumente mit eindeutigem Status und nächstem Schritt steuern.', 'Artikel zu Transportdokumenten lesen', transportDocumentsArticlePaths.de],
      ['Warum TMS-Systeme Disponenten nicht ersetzen', 'Warum Systemdaten allein noch keine operative Entscheidung ergeben.', 'Grundlagenartikel lesen', tmsArticlePaths.de],
    ],
    back: 'Praxis & Wissen',
    ctaEyebrow: 'ESCALATION PILOT',
    ctaTitle: 'Eskalationsschwellen an einem klar begrenzten Ablauf testen.',
    ctaText: 'Der Pilot definiert Schwellen, Rollen, Ersatzkontakte, zulässige Optionen, Freigabegrenzen und Dokumentation, bevor operative Unterstützung Abweichungen nachhält.',
    cta: 'Pilot-Check starten',
    pilotLink: '/de/pilot-check',
  },
  sr: {
    eyebrow: 'PRAKSA I ZNANJE · ODSTUPANJE I ESKALACIJA',
    title: 'Eskalacija odstupanja u transportu: pragovi, odgovornost i potrebna odluka',
    lead: 'Ne zahteva svako odstupanje pažnju menadžmenta. Ali svako mora biti klasifikovano: pratiti, operativno upozoriti, zatražiti odluku ili odmah aktivirati definisani kritični put.',
    meta: '11 min. čitanja · 19. jul 2026. · Dragan Zdravković',
    summaryTitle: 'Sažetak za rukovodioce',
    summary: 'Eskalacija nije samo prosleđivanje problema niti zamena za odgovornost. Ona je strukturisan zahtev pravoj ovlašćenoj strani: potvrđena činjenica, merljiv prag, operativna posledica, već izvedeni koraci, moguće opcije, konkretna odluka i poslednji rok za odlučivanje. Firma treba da definiše pragove, uloge i zamenske kontakte pre operativnog rada, a ne tek kada problem nastane.',
    principleTitle: 'Obaveštenje prenosi informaciju. Eskalacija zahteva radnju ili odluku.',
    principleText: '„Vozilo kasni“ je statusna poruka. „Potvrđeno odstupanje je 20 minuta iznad našeg praga za slot; potrebno je do 15:10 odobriti da li smemo da tražimo novi termin“ jeste eskalacija. Razlika je u pragu, posledici, potrebnoj odluci, odgovornosti i roku.',
    levelsTitle: 'Četiri nivoa eskalacije za operativni rad',
    levelsIntro: 'Ovi nazivi su radni model. Vremenske granice, odgovorne osobe i komunikacioni putevi moraju odgovarati konkretnoj firmi, nalogu i riziku.',
    levels: [
      ['NIVO 0', 'Praćenje', 'Slučaj je unutar dogovorene tolerancije. Status i sledeća provera se dokumentuju; dodatno odobrenje još nije potrebno.', 'status'],
      ['NIVO 1', 'Operativno upozorenje', 'Postoji mogućnost prekoračenja praga. Odgovorna operativna uloga dobija rano upozorenje, aktuelnu procenu i sledeću proveru.', 'warning'],
      ['NIVO 2', 'Zahtev za odluku', 'Posledica ili prag su potvrđeni, a potrebna radnja je izvan postojećeg ovlašćenja. Eskaliraju se opcije, pitanje i rok.', 'decision'],
      ['NIVO 3', 'Aktiviranje kritičnog puta', 'Bezbednosni događaj, šteta, gubitak kontrole ili drugi definisan kritični okidač odmah aktivira interni hitni, bezbednosni ili službeni put.', 'critical'],
    ],
    levelNoteTitle: 'Ne postoji univerzalan broj minuta',
    levelNote: 'Kašnjenje od 15 minuta može biti nevažno kod fleksibilnog termina, a presudno kod fiksnog slota. Zato svaki prag mora biti vezan za konkretan proces, obećanje klijentu i pravo odlučivanja.',
    triggersTitle: 'Šest vrsta merljivih okidača za eskalaciju',
    triggers: [
      ['Vreme', 'ETA, rezerva do slota ili dogovoreni rok za javljanje prelaze definisanu vrednost.'],
      ['Kvalitet informacije', 'Status je protivrečan, zastareo ili ga nije moguće potvrditi dogovorenim izvorom.'],
      ['Operativna posledica', 'Rampa, naredna tura, vreme vozača, proces klijenta ili kapacitet su konkretno ugroženi.'],
      ['Granica ovlašćenja', 'Trošak, novo obećanje, promena rute ili druga radnja prelaze dato ovlašćenje.'],
      ['Dokumenta i dokazi', 'Nedostajući, pogrešan ili nepotvrđen dokument blokira dogovoreni sledeći korak.'],
      ['Bezbednost i incident', 'Događaj sa ljudima, vozilom, teretom ili bezbednošću odmah aktivira predviđen kritični put prijave.'],
    ],
    sections: [
      ['Rano upozorenje nije dramatizovanje', 'Dobra poruka nivoa 1 stvara vreme za pripremu bez predstavljanja nepotvrđene posledice kao činjenice. Navodi aktuelni nivo informacije, mogući rizik i sledeću proveru. Odgovorna strana tako može pripremiti kapacitet ili opcije pre nego što odluka postane neophodna.'],
      ['Eskalacija bez pitanja za odluku ostaje samo izveštaj o problemu', 'Osoba koja prima poruku mora da zna šta se tačno od nje očekuje: potvrda informacije, odobrenje novog termina, odobrenje troška, preuzimanje kontakta sa klijentom ili izbor druge opcije. Što je pitanje preciznije, odluka može biti brža i odgovornija.'],
      ['Kritični događaj ne čeka savršenu dokumentaciju', 'Kod definisanog bezbednosnog ili hitnog okidača prvo se primenjuje predviđen neposredan put zaštite i prijave. Dokumentacija se dopunjava paralelno ili naknadno. Ovaj članak ne zamenjuje interne planove za hitne slučajeve niti zakonske obaveze prijavljivanja.'],
    ],
    packetTitle: 'Sedam elemenata paketa za donošenje odluke',
    packetIntro: 'Eskalacija treba da omogući ovlašćenoj osobi da donese odluku bez ponovne rekonstrukcije slučaja.',
    packet: [
      ['01', 'Slučaj', 'Tura, vozilo, nalog i relevantno mesto.'],
      ['02', 'Potvrđena činjenica', 'Šta se dogodilo, kada i kojim izvorom je potvrđeno?'],
      ['03', 'Posledica', 'Koji prag je pogođen i kakav operativni rizik nastaje?'],
      ['04', 'Već završeno', 'Koji kontakti, provere ili zaštitne mere su izvedeni i sa kakvim rezultatom?'],
      ['05', 'Opcije', 'Koji realni putevi postoje i koja je granica svake opcije?'],
      ['06', 'Pitanje za odluku', 'Koje konkretno odobrenje je potrebno od koje ovlašćene uloge?'],
      ['07', 'Rok i sledeća poruka', 'Do kada je odluka potrebna i kada sledi novo ažuriranje?'],
    ],
    flowTitle: 'Od signala do kontrolisane odluke',
    flow: ['Prepoznati', 'Potvrditi', 'Klasifikovati', 'Odlučiti', 'Dokumentovati'],
    exampleTitle: 'Primer: potvrđeno kašnjenje ugrožava termin istovara',
    badLabel: 'Problem je samo prosleđen',
    bad: '„Vozač kasni i klijent je nezadovoljan. Šta da radimo?“',
    badReason: 'Nedostaju potvrđen status, prag, aktuelna ETA, izvedeni koraci, opcije, odgovorna uloga i rok za odluku.',
    goodLabel: 'Eskalacija spremna za odluku',
    record: [
      ['Slučaj', 'Tura DH-318 · vozilo 22 · istovar Nirnberg'],
      ['Činjenica / izvor', '14:42: vozač javlja potpunu obustavu saobraćaja; pozicija i zastoj provereni telematikom u 14:46'],
      ['Prag / posledica', 'Operativna ETA 16:25–16:45; potvrđen slot 16:00; interni prag eskalacije od 20 minuta je prekoračen'],
      ['Završeno', 'Vozač potvrđuje bezbedno mirovanje; klijentu nije obećano novo vreme; mesto istovara još nije kontaktirano'],
      ['Opcija A', 'Odobriti da se odmah zatraži novi vremenski prozor'],
      ['Opcija B', 'Kontakt sa klijentom preuzima odgovorna interna strana'],
      ['Potrebna odluka', 'Do 15:05 odrediti ko kontaktira klijenta i da li sme da se traži novi termin'],
      ['Sledeća poruka', 'Dispozicija ponovo proverava vozača u 15:00 i dopunjuje ETA i reakciju klijenta u TMS-u'],
    ],
    goodReason: 'Odgovorna strana u jednom zapisu vidi činjenicu, prag, posledicu, granice, opcije i rok za odluku.',
    checklistTitle: 'Brza provera pre eskalacije',
    checklistIntro: 'Ovih deset pitanja sprečava da se prosledi samo hitnost, a izostavi osnova potrebna za odluku.',
    checks: [
      'Da li je relevantna činjenica potvrđena ili jasno označena kao nepotvrđena?',
      'Da li su navedeni vreme i izvor poslednjeg statusa?',
      'Da li je konkretno naveden pogođeni prag ili granica ovlašćenja?',
      'Da li je operativna posledica jasno objašnjena?',
      'Da li su dokumentovani već izvedeni koraci i njihovi rezultati?',
      'Da li su navedene samo realne i dozvoljene opcije?',
      'Da li je potrebna odluka formulisana kao jasno pitanje?',
      'Da li je poznato koja ovlašćena uloga sme da odluči?',
      'Da li su određeni rok za odluku i sledeća provera?',
      'Da li postoji zamenski ili kritični put ako niko nije dostupan?',
    ],
    noteTitle: 'Granica odgovornosti',
    note: 'Operativna podrška sme da proveri činjenice, strukturira opcije i prati eskalaciju. Ona ne zamenjuje ovlašćenu odluku o troškovima, obavezujućim obećanjima, bezbednosnim merama, promeni ugovora ili poslovnom riziku.',
    faqTitle: 'Česta pitanja',
    faq: [
      ['Kada odstupanje ne treba eskalirati?', 'Kada je unutar dogovorene tolerancije, ne zahteva dodatnu odluku i sledeća provera je pod kontrolom. Ipak se dokumentuje i prati.'],
      ['Da li klijent mora biti obavešten kod svakog kašnjenja?', 'Ne, već prema dogovorenim pragovima, odgovornostima i procesu klijenta. Ta pravila treba unapred definisati.'],
      ['Koja je razlika između upozorenja i eskalacije?', 'Upozorenje stvara pažnju i vreme za pripremu. Eskalacija zahteva konkretnu odluku, odobrenje ili aktiviranje definisanog puta.'],
      ['Šta ako ovlašćena osoba nije dostupna?', 'Potreban je unapred definisan zamenski kontakt, vremenski prag i jasne granice dozvoljenih privremenih mera. Bez tog puta operativna podrška ne sme sama da izmisli ovlašćenje.'],
    ],
    relatedTitle: 'Povezani stručni članci',
    related: [
      ['Predaja smene u dispoziciji', 'Kontrolisano predajte otvorene odluke, odgovornost i sledeću proveru.', 'Pročitaj članak o predaji', shiftHandoverArticlePaths.sr],
      ['ETA nije obećanje', 'Razdvojite procenu i termin potvrđen klijentu pre eskalacije.', 'Pročitaj ETA članak', etaArticlePaths.sr],
      ['Balkan–DACH komunikacija sa vozačima', 'Strukturisano dokumentujte potvrđen status i bezbedan odgovor vozača.', 'Pročitaj članak o komunikaciji', driverCommunicationArticlePaths.sr],
      ['CMR, POD i otvoreni dokazi', 'Vodite nedostajuća ili neprihvaćena dokumenta uz jasan status i sledeći korak.', 'Pročitaj članak o dokumentima', transportDocumentsArticlePaths.sr],
      ['Zašto TMS ne menja disponente', 'Zašto sistemski podatak sam po sebi još nije operativna odluka.', 'Pročitaj osnovni članak', tmsArticlePaths.sr],
    ],
    back: 'Praksa i znanje',
    ctaEyebrow: 'ESCALATION PILOT',
    ctaTitle: 'Testirajte pragove eskalacije na jasno ograničenom procesu.',
    ctaText: 'Pilot definiše pragove, uloge, zamenske kontakte, dozvoljene opcije, granice odobrenja i dokumentaciju pre nego što operativna podrška počne da prati odstupanja.',
    cta: 'Pokreni proveru pilota',
    pilotLink: '/sr/provera-pilota',
  },
}

export default function DeviationEscalationArticle({ lang }) {
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

      <section className="escalation-levels-section">
        <h2>{t.levelsTitle}</h2>
        <p>{t.levelsIntro}</p>
        <div className="escalation-level-grid">
          {t.levels.map(([level, title, description, tone]) => <article className={`escalation-level-${tone}`} key={level}>
            <span>{level}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>)}
        </div>
        <aside className="escalation-threshold-note"><strong>{t.levelNoteTitle}</strong><p>{t.levelNote}</p></aside>
      </section>

      <section className="escalation-triggers-section">
        <h2>{t.triggersTitle}</h2>
        <div className="escalation-trigger-grid">
          {t.triggers.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </section>

      {t.sections.map(([heading, paragraph]) => <section key={heading}>
        <h2>{heading}</h2>
        <p>{paragraph}</p>
      </section>)}

      <section className="escalation-packet-section">
        <h2>{t.packetTitle}</h2>
        <p>{t.packetIntro}</p>
        <ol className="driver-protocol-grid escalation-packet-grid">
          {t.packet.map(([number, title, description]) => <li key={number}>
            <span>{number}</span>
            <div><strong>{title}</strong><p>{description}</p></div>
          </li>)}
        </ol>
      </section>

      <figure className="driver-loop escalation-loop" aria-labelledby="escalation-loop-title">
        <figcaption id="escalation-loop-title">{t.flowTitle}</figcaption>
        <div>{t.flow.map((item, index) => <span key={item}>
          <b>{String(index + 1).padStart(2, '0')}</b>
          <strong>{item}</strong>
        </span>)}</div>
      </figure>

      <section className="handover-example-section escalation-example-section">
        <h2>{t.exampleTitle}</h2>
        <article className="handover-bad-example">
          <span>{t.badLabel}</span>
          <blockquote>{t.bad}</blockquote>
          <p>{t.badReason}</p>
        </article>
        <article className="handover-good-example">
          <span>{t.goodLabel}</span>
          <dl>{t.record.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>
          <p>{t.goodReason}</p>
        </article>
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
