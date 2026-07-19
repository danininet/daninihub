import './KnowledgeArticle.css'
import { deviationEscalationArticlePaths, driverCommunicationArticlePaths, etaArticlePaths, tmsArticlePaths } from './KnowledgePaths'

const article = {
  de: {
    eyebrow: 'PRAXIS & WISSEN · SCHICHTÜBERGABE',
    title: 'Schichtübergabe in der Disposition: 10 Pflichtinformationen',
    lead: 'Eine Übergabe ist kein Rückblick auf die vergangene Schicht. Sie ist der dokumentierte Wechsel operativer Kontrolle – mit bestätigtem Status, offenen Entscheidungen, klarer Verantwortung und festem nächsten Prüfpunkt.',
    meta: '11 Min. Lesezeit · 19. Juli 2026 · Dragan Zdravković',
    summaryTitle: 'Executive Summary',
    summary: 'Eine belastbare Schichtübergabe ermöglicht der übernehmenden Person, ohne zusätzliche Rekonstruktion weiterzuarbeiten. Dafür müssen nicht alle Ereignisse wiederholt werden. Entscheidend sind zehn Pflichtinformationen: eindeutiger Vorgang, bestätigter Status, Plan und aktuelle Prognose, Abweichung, Kommunikation, erledigte Schritte, offene Aufgaben, Entscheidungen, Verantwortung und nächste Prüfung. Die Übergabe ist erst geschlossen, wenn die nächste Schicht sie verstanden und übernommen hat.',
    principleTitle: 'Übergabe bedeutet Kontrollwechsel',
    principleText: 'Eine Notiz dokumentiert, was passiert ist. Eine Übergabe dokumentiert zusätzlich, was jetzt gilt, was als Nächstes passieren muss und wer dafür verantwortlich ist. Genau dieser Unterschied entscheidet, ob die nächste Schicht handeln kann oder zuerst Kollegen, Fahrer und Kunden anrufen muss.',
    failureTitle: 'Warum ausführliche Übergaben trotzdem unbrauchbar sein können',
    failures: [
      ['Viele Details, keine Priorität', 'Eine lange Chronologie verdeckt den aktuell entscheidenden Punkt. Die nächste Schicht braucht zuerst Status, Risiko, offene Entscheidung und nächsten Termin.'],
      ['Status ohne Zeit und Quelle', '„Fahrer verspätet“ ist nicht prüfbar. Ohne Zeitpunkt und Quelle bleibt offen, ob die Information aktuell, bestätigt oder nur weitergeleitet ist.'],
      ['Aufgabe ohne Verantwortlichkeit', '„Muss noch geklärt werden“ erzeugt keine Handlung. Es fehlen Rolle, Frist, Eskalationsweg und die Bedingung, unter der entschieden werden muss.'],
    ],
    mandatoryTitle: 'Die 10 Pflichtinformationen einer belastbaren Schichtübergabe',
    mandatoryIntro: 'Die Reihenfolge führt von der Identifikation des Vorgangs bis zum nächsten kontrollierten Handlungspunkt.',
    mandatory: [
      ['01', 'Vorgang eindeutig identifizieren', 'Tour- oder Auftragsnummer, Fahrzeug, Fahrer und relevante Lade- oder Entladestelle nennen.'],
      ['02', 'Letzten bestätigten Status festhalten', 'Status, Zeitpunkt und Quelle dokumentieren – einschließlich Hinweis, wenn etwas noch unbestätigt ist.'],
      ['03', 'Plan und aktuelle Prognose trennen', 'Plantermin, operative ETA und bereits bestätigten Kundentermin als unterschiedliche Angaben führen.'],
      ['04', 'Abweichung und Auswirkung beschreiben', 'Benennen, was vom Plan abweicht und welches Risiko für Slot, Folgeauftrag, Dokumente oder Kundenprozess entsteht.'],
      ['05', 'Kommunikation und Zusagen dokumentieren', 'Festhalten, wer Fahrer, Kunde oder Partner wann informiert hat und welche Aussage tatsächlich bestätigt wurde.'],
      ['06', 'Erledigte Schritte mit Ergebnis nennen', 'Nicht nur „angerufen“, sondern Ergebnis, Nachweis und gegebenenfalls erfolglosen Versuch dokumentieren.'],
      ['07', 'Offene Aufgaben und Rückfragen auflisten', 'Jede offene Aufgabe konkret formulieren und von bereits erledigten Punkten sichtbar trennen.'],
      ['08', 'Entscheidungen und Freigaben markieren', 'Benennen, welche Entscheidung noch fehlt, wer sie geben darf und welche Handlungen bis dahin nicht erfolgen dürfen.'],
      ['09', 'Verantwortung und Eskalationsweg bestimmen', 'Für den nächsten Schritt eine Rolle benennen und festlegen, wann an welche Stelle eskaliert wird.'],
      ['10', 'Nächsten Prüfpunkt terminieren', 'Konkrete Uhrzeit, zu prüfenden Sachverhalt und Auslöser für die nächste Aktion festlegen.'],
    ],
    flowTitle: 'Die Übergabe ist erst nach der Übernahme geschlossen',
    flow: ['Vorbereiten', 'Gemeinsam prüfen', 'Rückfragen klären', 'Übernahme bestätigen'],
    exampleTitle: 'Beispiel: vom unklaren Hinweis zum arbeitsfähigen Übergabeprotokoll',
    badLabel: 'Nicht ausreichend',
    bad: '„Fahrzeug 17 verspätet. Fahrer weiß Bescheid. Bitte später prüfen.“',
    badReason: 'Tour, Statuszeit, Quelle, aktuelle ETA, Kundeninformation, offene Aufgabe, Verantwortlichkeit und Prüftermin fehlen.',
    goodLabel: 'Arbeitsfähiger Übergabedatensatz',
    record: [
      ['Vorgang', 'Tour DH-204 · Fahrzeug 17 · Entladung Linz'],
      ['Bestätigter Status', '21:40 Uhr · Fahrer meldet Stau; Position 21:43 Uhr per Telematik geprüft'],
      ['Zeitangaben', 'Plan 22:00 Uhr · operative ETA 22:35–22:50 Uhr · neuer Kundentermin noch nicht bestätigt'],
      ['Auswirkung', 'Entladeslot gefährdet; mögliche Wartezeit und Verschiebung der Folgetour'],
      ['Erledigt', 'Fahrer über Abweichungsweg informiert; Entladestelle um 21:47 Uhr schriftlich kontaktiert'],
      ['Offen / Entscheidung', 'Antwort der Entladestelle fehlt; keine neue Uhrzeit zusagen, bevor Freigabe vorliegt'],
      ['Verantwortung', 'Nachtschicht Disposition; bei fehlender Antwort bis 22:15 Uhr über vereinbarten Eskalationskontakt nachfassen'],
      ['Nächste Prüfung', '22:10 Uhr: Fahrerstatus und Rückmeldung der Entladestelle prüfen; Ergebnis im TMS ergänzen'],
    ],
    goodReason: 'Die nächste Schicht erkennt ohne Zusatzanruf den Informationsstand, die Grenze ihrer Handlung, die offene Entscheidung und den nächsten kontrollierten Schritt.',
    acceptanceTitle: 'Übernahmeprüfung für die nächste Schicht',
    acceptanceIntro: 'Kann die übernehmende Person diese Fragen ausschließlich anhand des Datensatzes beantworten, ist die Übergabe in der Regel arbeitsfähig.',
    checks: [
      'Welcher Vorgang benötigt als Erstes Aufmerksamkeit?',
      'Welche Information ist bestätigt und wie aktuell ist sie?',
      'Welche Zusage gilt – und was ist nur operative Prognose?',
      'Welche Aufgabe oder Entscheidung ist noch offen?',
      'Was darf ohne zusätzliche Freigabe nicht getan oder zugesagt werden?',
      'Wer prüft welchen Punkt zu welcher Uhrzeit erneut?',
      'Wann und an wen muss eskaliert werden?',
      'Wo sind Kommunikation, Dokumente und Nachweise vollständig abgelegt?',
    ],
    noteTitle: 'Annahmeregel',
    note: 'Wenn die übernehmende Schicht zuerst anrufen muss, nur um den aktuellen Vorgang zu verstehen, ist die Übergabe noch nicht vollständig. Ein Telefonat darf Details ergänzen, ersetzt aber nicht den gemeinsamen Datensatz.',
    sections: [
      ['Mündliche Übergabe ergänzt – sie ersetzt nicht', 'Bei komplexen Fällen ist ein kurzes gemeinsames Gespräch sinnvoll. Der dokumentierte Datensatz bleibt trotzdem maßgeblich, weil Erinnerung, Reihenfolge und Erreichbarkeit wechseln können. Nach dem Gespräch werden Korrekturen und die Übernahmezeit im selben System ergänzt.'],
      ['Priorität gehört sichtbar an den Vorgang', 'Nicht jeder offene Fall ist gleich dringend. Eine einfache Einordnung wie „sofort“, „bis 22:15 Uhr“ oder „bei Rückmeldung“ ist hilfreicher als ein allgemeines Warnsymbol. Priorität sollte immer mit einer konkreten Bedingung und Handlung verbunden sein.'],
      ['Freigabegrenzen müssen die Schicht überleben', 'Eine offene Entscheidung darf bei der Übergabe nicht unbemerkt zur angenommenen Zustimmung werden. Deshalb muss klar stehen, wer verbindliche Termine, Kosten, Routenänderungen oder andere unternehmerische Entscheidungen freigeben darf.'],
    ],
    faqTitle: 'Häufige Fragen',
    faq: [
      ['Wie lang sollte eine Schichtübergabe sein?', 'So kurz wie möglich und so vollständig wie nötig. Ein strukturierter Datensatz mit zehn klaren Feldern ist meist hilfreicher als eine lange unpriorisierte Chronologie.'],
      ['Muss jeder Transport übergeben werden?', 'Nicht jeder abgeschlossene Standardfall braucht dieselbe Tiefe. Aktiv laufende, abweichende, entscheidungsbedürftige oder noch nicht belegte Vorgänge müssen jedoch eindeutig übergeben oder bewusst geschlossen werden.'],
      ['Wer bestätigt die Übernahme?', 'Die übernehmende Rolle oder Person. Die Bestätigung zeigt, ab welchem Zeitpunkt die operative Nachverfolgung gewechselt hat; sie ersetzt keine fachliche oder vertragliche Freigabe.'],
      ['Kann ein TMS die Übergabe automatisch erzeugen?', 'Ein System kann Felder und Ereignisse zusammenstellen. Ob Status bestätigt, Priorität richtig, eine Zusage verbindlich und eine Entscheidung offen ist, muss weiterhin nach den vereinbarten Verantwortlichkeiten geprüft werden.'],
    ],
    relatedTitle: 'Passende Fachbeiträge',
    related: [
      ['Transportabweichungen richtig eskalieren', 'Messbare Schwellen, Entscheidungsfrage und Eskalationsfrist eindeutig dokumentieren.', 'Artikel zur Eskalation lesen', deviationEscalationArticlePaths.de],
      ['ETA ist keine Zusage', 'Plantermin, Prognose und bestätigten Kundentermin sauber trennen.', 'ETA-Artikel lesen', etaArticlePaths.de],
      ['Fahrerkommunikation Balkan–DACH', 'Verständnis, sichere Rückbestätigung und Ergebnis dokumentieren.', 'Artikel zur Fahrerkommunikation lesen', driverCommunicationArticlePaths.de],
      ['Warum TMS-Systeme Disponenten nicht ersetzen', 'Die operative Lücke zwischen Daten, Entscheidung und Verantwortung.', 'Grundlagenartikel lesen', tmsArticlePaths.de],
    ],
    back: 'Praxis & Wissen',
    ctaEyebrow: 'CONTINUITY PILOT',
    ctaTitle: 'Schichtübergabe an einem klar begrenzten Prozess testen.',
    ctaText: 'Ein Pilot definiert Pflichtfelder, Prioritäten, Freigabegrenzen, Eskalation und Übernahmebestätigung, bevor zusätzliche Unterstützung operative Fälle übernimmt.',
    cta: 'Pilot-Check starten',
    pilotLink: '/de/pilot-check',
  },
  sr: {
    eyebrow: 'PRAKSA I ZNANJE · PREDAJA SMENE',
    title: 'Predaja smene u dispoziciji: 10 obaveznih informacija',
    lead: 'Predaja nije prepričavanje prethodne smene. Ona je dokumentovan prenos operativne kontrole – sa potvrđenim statusom, otvorenim odlukama, jasnom odgovornošću i određenom sledećom proverom.',
    meta: '11 min. čitanja · 19. jul 2026. · Dragan Zdravković',
    summaryTitle: 'Sažetak za rukovodioce',
    summary: 'Pouzdana predaja smene omogućava osobi koja preuzima rad da nastavi bez dodatnog rekonstruisanja događaja. Nije potrebno ponoviti svaku poruku. Potrebno je deset obaveznih informacija: jasan slučaj, potvrđen status, plan i aktuelna procena, odstupanje, komunikacija, završeni koraci, otvoreni zadaci, odluke, odgovornost i sledeća provera. Predaja je zatvorena tek kada je naredna smena razumela i prihvatila slučaj.',
    principleTitle: 'Predaja znači promenu operativne kontrole',
    principleText: 'Beleška govori šta se dogodilo. Predaja dodatno govori šta sada važi, šta sledeće mora da se uradi i ko je odgovoran. Ta razlika određuje da li nova smena može odmah da radi ili najpre mora da zove kolegu, vozača i klijenta.',
    failureTitle: 'Zašto i detaljna predaja može biti neupotrebljiva',
    failures: [
      ['Mnogo detalja, bez prioriteta', 'Duga hronologija sakriva trenutno najvažniju tačku. Novoj smeni prvo trebaju status, rizik, otvorena odluka i sledeći termin.'],
      ['Status bez vremena i izvora', '„Vozač kasni“ nije proverljiva informacija. Bez vremena i izvora nije jasno da li je podatak aktuelan, potvrđen ili samo prosleđen.'],
      ['Zadatak bez odgovornosti', '„Treba još proveriti“ ne stvara radnju. Nedostaju uloga, rok, put eskalacije i uslov pod kojim mora biti doneta odluka.'],
    ],
    mandatoryTitle: 'Deset obaveznih informacija pouzdane predaje smene',
    mandatoryIntro: 'Redosled vodi od jasnog prepoznavanja slučaja do sledeće kontrolisane radnje.',
    mandatory: [
      ['01', 'Jasno označiti slučaj', 'Navesti broj ture ili naloga, vozilo, vozača i relevantno mesto utovara ili istovara.'],
      ['02', 'Zabeležiti poslednji potvrđen status', 'Upisati status, vreme i izvor, uz napomenu ako neki podatak još nije potvrđen.'],
      ['03', 'Razdvojiti plan i aktuelnu procenu', 'Planirani termin, operativnu ETA i termin potvrđen klijentu voditi kao različite podatke.'],
      ['04', 'Opisati odstupanje i posledicu', 'Navesti šta odstupa od plana i kakav rizik nastaje za slot, narednu turu, dokumenta ili klijenta.'],
      ['05', 'Dokumentovati komunikaciju i obećanja', 'Zabeležiti ko je, kada i šta javio vozaču, klijentu ili partneru i koja izjava je zaista potvrđena.'],
      ['06', 'Navesti završene korake i rezultat', 'Ne samo „pozvano“, već rezultat, dokaz i eventualni neuspešan pokušaj kontakta.'],
      ['07', 'Izdvojiti otvorene zadatke i pitanja', 'Svaki otvoren zadatak konkretno napisati i jasno odvojiti od već završenih tačaka.'],
      ['08', 'Označiti odluke i odobrenja', 'Navesti koja odluka nedostaje, ko sme da je donese i šta do tada nije dozvoljeno uraditi.'],
      ['09', 'Odrediti odgovornost i eskalaciju', 'Imenovati ulogu za sledeći korak i definisati kada i kome se slučaj eskalira.'],
      ['10', 'Zakazati sledeću proveru', 'Odrediti tačno vreme, podatak koji se proverava i okidač za narednu radnju.'],
    ],
    flowTitle: 'Predaja je zatvorena tek nakon potvrđenog preuzimanja',
    flow: ['Priprema', 'Zajednička provera', 'Razjašnjenje pitanja', 'Potvrda preuzimanja'],
    exampleTitle: 'Primer: od nejasne beleške do upotrebljivog zapisa predaje',
    badLabel: 'Nedovoljno',
    bad: '„Vozilo 17 kasni. Vozač zna. Proverite kasnije.“',
    badReason: 'Nedostaju tura, vreme i izvor statusa, aktuelna ETA, informacija klijentu, otvoren zadatak, odgovornost i vreme provere.',
    goodLabel: 'Upotrebljiv zapis predaje',
    record: [
      ['Slučaj', 'Tura DH-204 · vozilo 17 · istovar Linc'],
      ['Potvrđen status', '21:40 · vozač javlja zastoj; pozicija proverena telematikom u 21:43'],
      ['Vremenski podaci', 'Plan 22:00 · operativna ETA 22:35–22:50 · novi termin još nije potvrđen sa klijentom'],
      ['Posledica', 'Termin istovara je ugrožen; moguće je čekanje i pomeranje naredne ture'],
      ['Završeno', 'Vozač upoznat sa putem za odstupanje; mesto istovara kontaktirano pisanim putem u 21:47'],
      ['Otvoreno / odluka', 'Nema odgovora mesta istovara; ne obećavati novi termin pre dobijenog odobrenja'],
      ['Odgovornost', 'Noćna smena dispozicije; bez odgovora do 22:15 ponoviti kontakt kroz dogovoreni put eskalacije'],
      ['Sledeća provera', '22:10: proveriti status vozača i odgovor mesta istovara; rezultat dopuniti u TMS-u'],
    ],
    goodReason: 'Nova smena bez dodatnog poziva vidi stanje informacije, granicu postupanja, otvorenu odluku i sledeći kontrolisani korak.',
    acceptanceTitle: 'Provera pri preuzimanju sledeće smene',
    acceptanceIntro: 'Ako osoba koja preuzima može da odgovori na ova pitanja samo na osnovu zapisa, predaja je uglavnom operativno upotrebljiva.',
    checks: [
      'Koji slučaj prvi zahteva pažnju?',
      'Koja informacija je potvrđena i koliko je aktuelna?',
      'Koje obećanje važi, a šta je samo operativna procena?',
      'Koji zadatak ili odluka još nisu završeni?',
      'Šta se ne sme uraditi ili obećati bez dodatnog odobrenja?',
      'Ko ponovo proverava koji podatak i u koje vreme?',
      'Kada i kome slučaj mora biti eskaliran?',
      'Gde su potpuno i pregledno sačuvani komunikacija, dokumenta i dokazi?',
    ],
    noteTitle: 'Pravilo prihvatanja',
    note: 'Ako nova smena najpre mora da zove nekoga samo da bi razumela aktuelni slučaj, predaja još nije potpuna. Razgovor može dopuniti detalje, ali ne zamenjuje zajednički zapis.',
    sections: [
      ['Usmena predaja dopunjuje – ne zamenjuje', 'Kod složenih slučajeva kratak zajednički razgovor ima smisla. Dokumentovan zapis ipak ostaje merodavan, jer se pamćenje, redosled i dostupnost ljudi menjaju. Posle razgovora, ispravke i vreme preuzimanja dopunjuju se u istom sistemu.'],
      ['Prioritet mora biti vidljiv na samom slučaju', 'Nije svaki otvoren slučaj jednako hitan. Oznake „odmah“, „do 22:15“ ili „nakon odgovora“ korisnije su od opšteg upozorenja. Prioritet uvek treba povezati sa konkretnim uslovom i radnjom.'],
      ['Granice odobrenja moraju preživeti promenu smene', 'Otvorena odluka pri predaji ne sme neprimetno postati pretpostavljena saglasnost. Zato mora biti jasno ko sme da odobri obavezujući termin, trošak, promenu rute ili drugu poslovnu odluku.'],
    ],
    faqTitle: 'Česta pitanja',
    faq: [
      ['Koliko duga treba da bude predaja smene?', 'Što kraća, ali dovoljno potpuna. Strukturisan zapis sa deset jasnih polja obično je korisniji od duge hronologije bez prioriteta.'],
      ['Da li svaka tura mora biti predata?', 'Svaki završen standardni slučaj ne zahteva istu dubinu. Aktivne ture, odstupanja, slučajevi sa otvorenom odlukom ili bez potrebnog dokaza moraju biti jasno predati ili svesno zatvoreni.'],
      ['Ko potvrđuje preuzimanje?', 'Uloga ili osoba koja preuzima rad. Potvrda pokazuje od kog trenutka je promenjena odgovornost za praćenje; ona nije zamena za stručno ili ugovorno odobrenje.'],
      ['Može li TMS automatski napraviti predaju?', 'Sistem može da prikupi polja i događaje. Da li je status potvrđen, prioritet tačan, obećanje obavezujuće i odluka otvorena i dalje mora biti provereno prema dogovorenim odgovornostima.'],
    ],
    relatedTitle: 'Povezani stručni članci',
    related: [
      ['Eskalacija odstupanja u transportu', 'Jasno dokumentujte merljiv prag, pitanje za odluku i rok eskalacije.', 'Pročitaj članak o eskalaciji', deviationEscalationArticlePaths.sr],
      ['ETA nije obećanje', 'Jasno razdvojite planirani termin, procenu i termin potvrđen klijentu.', 'Pročitaj ETA članak', etaArticlePaths.sr],
      ['Balkan–DACH komunikacija sa vozačima', 'Dokumentujte razumevanje, bezbednu povratnu potvrdu i rezultat.', 'Pročitaj članak o komunikaciji', driverCommunicationArticlePaths.sr],
      ['Zašto TMS ne menja disponente', 'Operativna praznina između podataka, odluke i odgovornosti.', 'Pročitaj osnovni članak', tmsArticlePaths.sr],
    ],
    back: 'Praksa i znanje',
    ctaEyebrow: 'CONTINUITY PILOT',
    ctaTitle: 'Testirajte predaju smene na jasno ograničenom procesu.',
    ctaText: 'Pilot definiše obavezna polja, prioritete, granice odobrenja, eskalaciju i potvrdu preuzimanja pre nego što dodatna podrška preuzme operativne slučajeve.',
    cta: 'Pokreni proveru pilota',
    pilotLink: '/sr/provera-pilota',
  },
}

export default function ShiftHandoverArticle({ lang }) {
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

      <section className="handover-failures-section">
        <h2>{t.failureTitle}</h2>
        <div className="handover-failure-grid">
          {t.failures.map(([title, description]) => <article key={title}>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>)}
        </div>
      </section>

      <section className="handover-mandatory-section">
        <h2>{t.mandatoryTitle}</h2>
        <p>{t.mandatoryIntro}</p>
        <ol className="handover-mandatory-list">
          {t.mandatory.map(([number, title, description]) => <li key={number}>
            <span>{number}</span>
            <div><strong>{title}</strong><p>{description}</p></div>
          </li>)}
        </ol>
      </section>

      <figure className="driver-loop handover-loop" aria-labelledby="handover-loop-title">
        <figcaption id="handover-loop-title">{t.flowTitle}</figcaption>
        <div>{t.flow.map((item, index) => <span key={item}>
          <b>{String(index + 1).padStart(2, '0')}</b>
          <strong>{item}</strong>
        </span>)}</div>
      </figure>

      <section className="handover-example-section">
        <h2>{t.exampleTitle}</h2>
        <article className="handover-bad-example">
          <span>{t.badLabel}</span>
          <blockquote>{t.bad}</blockquote>
          <p>{t.badReason}</p>
        </article>
        <article className="handover-good-example">
          <span>{t.goodLabel}</span>
          <dl>
            {t.record.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}
          </dl>
          <p>{t.goodReason}</p>
        </article>
      </section>

      <section className="article-checklist">
        <h2>{t.acceptanceTitle}</h2>
        <p className="checklist-intro">{t.acceptanceIntro}</p>
        {t.checks.map(item => <label key={item}>
          <input type="checkbox" />
          <span>{item}</span>
        </label>)}
        <div className="checklist-note">
          <strong>{t.noteTitle}</strong>
          <p>{t.note}</p>
        </div>
      </section>

      {t.sections.map(([heading, paragraph]) => <section key={heading}>
        <h2>{heading}</h2>
        <p>{paragraph}</p>
      </section>)}

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
