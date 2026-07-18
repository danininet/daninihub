import './KnowledgeArticle.css'
import { driverCommunicationArticlePaths } from './KnowledgePaths'

const article = {
  de: {
    eyebrow: 'PRAXIS & WISSEN · ETA & STATUS',
    title: 'ETA ist keine Zusage: So kommunizieren Transportteams belastbare Statusmeldungen',
    lead: 'Eine ETA ist eine aktuelle Prognose. Erst eine ausdrücklich bestätigte Abstimmung wird zum belastbaren Kundentermin. Wer beides trennt, verhindert falsche Erwartungen und unnötige Eskalationen.',
    meta: '9 Min. Lesezeit · 18. Juli 2026 · Dragan Zdravković',
    summaryTitle: 'Executive Summary',
    summary: 'Eine gute Statusmeldung beantwortet nicht nur die Frage „Wann kommt der Lkw?“. Sie trennt bestätigte Fakten von Annahmen, nennt Quelle und Zeitpunkt, beschreibt die Auswirkung, kennzeichnet die ETA als Prognose und legt die nächste Prüfung fest. So wissen Fahrer, Disposition und Kunde, was sicher ist, was sich noch ändern kann und wer als Nächstes handelt.',
    definitionsTitle: 'Vier Zeitangaben, vier unterschiedliche Bedeutungen',
    definitionsIntro: 'Die häufigsten Missverständnisse entstehen, wenn diese Angaben im Chat, TMS oder Kundengespräch wie Synonyme verwendet werden.',
    definitions: [
      ['Plantermin', 'Ursprünglich vorgesehene Ankunfts-, Lade- oder Entladezeit. Er beschreibt den Plan, nicht den aktuellen Verlauf.'],
      ['Operative ETA', 'Aktuelle Prognose auf Basis der momentan verfügbaren Informationen. Sie kann sich mit Verkehr, Pause, Abfertigung oder neuen Fahrerdaten ändern.'],
      ['Bestätigter Kundentermin', 'Zeitfenster, das mit der zuständigen Stelle ausdrücklich abgestimmt wurde. Erst diese Bestätigung darf als Vereinbarung kommuniziert werden.'],
      ['Nächster Prüfpunkt', 'Festgelegter Zeitpunkt, zu dem Status und ETA erneut geprüft werden. Ohne Prüfpunkt bleibt eine Prognose schnell veraltet.'],
    ],
    sections: [
      ['Warum eine präzise ETA trotzdem wichtig ist', 'Die Lösung ist nicht, auf Prognosen zu verzichten. Disposition und Kunde brauchen eine möglichst frühe Einschätzung, um Rampen, Personal und Anschlusstouren zu planen. Entscheidend ist, die Prognose sichtbar als Prognose zu kennzeichnen und ihren Informationsstand nachvollziehbar zu machen.'],
      ['Bestätigter Status vor berechneter Genauigkeit', 'Eine minutengenaue ETA wirkt verlässlich, ist aber wertlos, wenn der zugrunde liegende Status nicht stimmt. Vor der Weitergabe sollten Position, Stillstand, Reststrecke, Pause, Dokumente oder Abfertigung anhand einer geeigneten Quelle geprüft werden. Ist ein Punkt nicht bestätigt, gehört genau dieser Hinweis in die Meldung.'],
      ['Jede Statusmeldung braucht einen nächsten Schritt', 'Eine Information ohne Verantwortlichkeit erzeugt Rückfragen. Deshalb endet ein belastbares Update mit dem nächsten Prüfzeitpunkt, der verantwortlichen Person und – falls nötig – einer klaren Entscheidungsfrage. Damit wird aus einer Nachricht ein steuerbarer Vorgang.'],
    ],
    formatTitle: 'Die 6-Bausteine-Formel für ein belastbares Update',
    formatIntro: 'Die Reihenfolge hält kurze Nachrichten vollständig und verhindert, dass Annahmen unbemerkt zu Zusagen werden.',
    format: [
      ['01', 'Fakt', 'Was ist tatsächlich passiert oder bestätigt?'],
      ['02', 'Zeit & Quelle', 'Wann wurde der Status erhoben und von wem oder wodurch bestätigt?'],
      ['03', 'Auswirkung', 'Welche Abweichung entsteht für Termin, Slot oder Folgetour?'],
      ['04', 'ETA mit Kennzeichnung', 'Welche aktuelle Prognose gilt – und ist sie bereits abgestimmt?'],
      ['05', 'Nächste Prüfung', 'Wer kontrolliert den Status zu welchem Zeitpunkt erneut?'],
      ['06', 'Entscheidung', 'Welche Freigabe oder Rückmeldung wird jetzt benötigt?'],
    ],
    exampleTitle: 'Beispiel: dieselbe Lage, zwei völlig unterschiedliche Meldungen',
    badLabel: 'Unklar',
    bad: '„Der Fahrer kommt wahrscheinlich gegen 15 Uhr.“',
    badReason: 'Quelle, Informationszeit, Auswirkung, Verbindlichkeit und nächste Prüfung fehlen. „Wahrscheinlich“ kann trotzdem als Zusage verstanden werden.',
    goodLabel: 'Belastbar',
    good: '„14:05 Uhr: Fahrer meldet ca. 35 km Stau vor Linz; Position um 14:10 Uhr per Telematik geprüft. Aktuelle ETA 15:20–15:40 Uhr, noch nicht mit der Entladestelle bestätigt. Nächste Prüfung durch Disposition um 14:30 Uhr. Bitte Freigabe: neues Zeitfenster anfragen?“',
    goodReason: 'Fakt, Quelle, Prognose, offener Bestätigungsstatus, Verantwortlichkeit und Entscheidungsbedarf sind getrennt erkennbar.',
    checkTitle: 'Schnellcheck vor dem Senden',
    checkIntro: 'Diese sechs Fragen dauern weniger als eine Minute und reduzieren Rückfragen, Fehlzusagen und unterschiedliche Informationsstände.',
    checks: [
      'Ist klar, welche Aussage bestätigt und welche nur geschätzt ist?',
      'Stehen Zeitpunkt und Quelle des letzten Status in der Meldung?',
      'Ist die ETA ausdrücklich als aktuelle Prognose gekennzeichnet?',
      'Ist ein bestätigter Kundentermin getrennt von der ETA dokumentiert?',
      'Sind nächste Prüfung, Zeitpunkt und verantwortliche Person genannt?',
      'Ist eine benötigte Freigabe als konkrete Frage formuliert?',
    ],
    ruleTitle: 'Operative Grundregel',
    rule: 'Eine ETA darf aktualisiert werden. Eine Zusage darf nur geändert werden, wenn die zuständigen Parteien die Änderung bestätigt haben.',
    faqTitle: 'Häufige Fragen',
    faq: [
      ['Soll eine ETA als genaue Uhrzeit oder als Zeitfenster angegeben werden?', 'Ein realistisches Zeitfenster ist häufig belastbarer. Eine genaue Uhrzeit ist nur sinnvoll, wenn Datenlage und operative Situation diese Genauigkeit tatsächlich tragen.'],
      ['Reicht die ETA aus dem TMS oder Tracking?', 'Sie ist eine wichtige Grundlage, sollte bei relevanten Abweichungen aber mit dem aktuellen operativen Status abgeglichen werden. Systemdaten können Pause, Abfertigung oder ungeklärte Hindernisse unvollständig abbilden.'],
      ['Wann muss der Kunde informiert werden?', 'Nach den vereinbarten Meldewegen und Eskalationsgrenzen. Fehlen solche Regeln, sollten sie vor dem operativen Einsatz definiert werden – einschließlich Verantwortlichkeit und zulässiger Aussagen.'],
      ['Wer darf einen neuen Termin zusagen?', 'Nur die dafür autorisierte Person oder Stelle. Operative Unterstützung kann Informationen vorbereiten und nachhalten, ersetzt aber keine vertragliche oder unternehmerische Freigabe.'],
    ],
    relatedLabel: 'Passender Grundlagenartikel',
    relatedTitle: 'Warum TMS-Systeme Disponenten nicht ersetzen',
    relatedText: 'Wie aus Systemdaten durch Faktenprüfung, Entscheidung, Kommunikation und Übergabe ein belastbarer operativer Vorgang wird.',
    relatedLink: '/de/praxis-wissen/warum-tms-disponenten-nicht-ersetzen',
    relatedCta: 'Grundlagenartikel lesen',
    nextLabel: 'Nächster Praxisartikel',
    nextTitle: 'Fahrerkommunikation Balkan–DACH: Wo Informationsfehler Kosten verursachen',
    nextText: 'Wie klarer Tourbezug, sichere Rückbestätigung und Dokumentation eine Nachricht zu einem geschlossenen operativen Vorgang machen.',
    nextLink: driverCommunicationArticlePaths.de,
    nextCta: 'Artikel zur Fahrerkommunikation lesen',
    back: 'Praxis & Wissen',
    ctaEyebrow: 'PILOT FIRST',
    ctaTitle: 'Statuskommunikation an einem klar begrenzten Ablauf testen.',
    cta: 'Pilot-Check starten',
    pilotLink: '/de/pilot-check',
  },
  sr: {
    eyebrow: 'PRAKSA I ZNANJE · ETA I STATUS',
    title: 'ETA nije obećanje: kako transportni timovi pravilno komuniciraju status',
    lead: 'ETA je trenutna procena. Tek izričito potvrđen dogovor postaje pouzdan termin za klijenta. Razdvajanjem ta dva podatka sprečavaju se pogrešna očekivanja i nepotrebne eskalacije.',
    meta: '9 min. čitanja · 18. jul 2026. · Dragan Zdravković',
    summaryTitle: 'Sažetak za rukovodioce',
    summary: 'Dobra statusna poruka ne odgovara samo na pitanje „Kada stiže kamion?“. Ona odvaja potvrđene činjenice od procene, navodi izvor i vreme podatka, objašnjava posledicu, označava ETA kao prognozu i određuje sledeću proveru. Tako vozač, dispozicija i klijent znaju šta je sigurno, šta se još može promeniti i ko preuzima sledeći korak.',
    definitionsTitle: 'Četiri vremenska podatka, četiri različita značenja',
    definitionsIntro: 'Najčešći nesporazumi nastaju kada se sledeći podaci u poruci, TMS-u ili razgovoru sa klijentom koriste kao da znače isto.',
    definitions: [
      ['Planirani termin', 'Prvobitno predviđeno vreme dolaska, utovara ili istovara. Opisuje plan, a ne nužno trenutno stanje ture.'],
      ['Operativna ETA', 'Trenutna procena na osnovu sada dostupnih informacija. Može se promeniti zbog saobraćaja, pauze, obrade na rampi ili novog podatka vozača.'],
      ['Termin potvrđen klijentu', 'Vremenski okvir koji je izričito usaglašen sa odgovornom stranom. Tek takva potvrda sme da se komunicira kao dogovor.'],
      ['Sledeća provera', 'Određeno vreme kada se status i ETA ponovo proveravaju. Bez toga procena brzo postaje zastarela.'],
    ],
    sections: [
      ['Zašto je precizna ETA ipak važna', 'Rešenje nije odustajanje od procene. Dispoziciji i klijentu je potrebna rana informacija da bi planirali rampu, ljude i narednu turu. Važno je da se procena jasno označi kao procena i da se vidi na kom podatku se zasniva.'],
      ['Potvrđen status je važniji od prividne preciznosti', 'ETA izražena u minut deluje pouzdano, ali ne vredi ako početni status nije tačan. Pre slanja treba proveriti poziciju, zastoj, preostalu rutu, pauzu, dokumenta ili obradu na rampi odgovarajućim izvorom. Ako podatak nije potvrđen, to mora jasno da piše.'],
      ['Svaka statusna poruka mora imati sledeći korak', 'Informacija bez odgovornosti stvara nova pitanja. Zato se pouzdan status završava terminom sledeće provere, imenom odgovorne osobe i, kada je potrebno, konkretnim pitanjem za odluku. Tada poruka postaje upravljiv operativni slučaj.'],
    ],
    formatTitle: 'Formula od 6 elemenata za pouzdan status',
    formatIntro: 'Ovaj redosled održava poruku kratkom i potpunom i sprečava da procena neprimetno postane obećanje.',
    format: [
      ['01', 'Činjenica', 'Šta se zaista dogodilo ili je potvrđeno?'],
      ['02', 'Vreme i izvor', 'Kada je status zabeležen i ko ili šta ga potvrđuje?'],
      ['03', 'Posledica', 'Kakvo odstupanje nastaje za termin, slot ili narednu turu?'],
      ['04', 'Jasno označena ETA', 'Koja je trenutna procena i da li je već usaglašena?'],
      ['05', 'Sledeća provera', 'Ko ponovo proverava status i u koje vreme?'],
      ['06', 'Odluka', 'Koje odobrenje ili odgovor je sada potreban?'],
    ],
    exampleTitle: 'Primer: ista situacija, dve potpuno različite poruke',
    badLabel: 'Nejasno',
    bad: '„Vozač će verovatno stići oko 15 časova.“',
    badReason: 'Nedostaju izvor, vreme informacije, posledica, nivo potvrde i sledeća provera. „Verovatno“ ipak može biti protumačeno kao obećanje.',
    goodLabel: 'Pouzdano',
    good: '„14:05: vozač javlja zastoj dug oko 35 km ispred Linca; pozicija proverena telematikom u 14:10. Trenutna ETA 15:20–15:40, još nije potvrđena sa mestom istovara. Sledeća provera dispozicije u 14:30. Potrebno odobrenje: da li da zatražimo novi vremenski prozor?“',
    goodReason: 'Činjenica, izvor, procena, status potvrde, odgovornost i potrebna odluka jasno su razdvojeni.',
    checkTitle: 'Brza provera pre slanja statusa',
    checkIntro: 'Ovih šest pitanja zahteva manje od jednog minuta, a smanjuje dodatna pitanja, pogrešna obećanja i različite verzije informacije.',
    checks: [
      'Da li je jasno šta je potvrđeno, a šta je samo procenjeno?',
      'Da li poruka sadrži vreme i izvor poslednjeg statusa?',
      'Da li je ETA izričito označena kao trenutna procena?',
      'Da li je termin potvrđen klijentu odvojeno dokumentovan od ETA?',
      'Da li su navedeni sledeća provera, vreme i odgovorna osoba?',
      'Da li je potrebno odobrenje postavljeno kao konkretno pitanje?',
    ],
    ruleTitle: 'Osnovno operativno pravilo',
    rule: 'ETA može da se ažurira. Obećanje može da se promeni tek kada su odgovorne strane potvrdile promenu.',
    faqTitle: 'Česta pitanja',
    faq: [
      ['Da li ETA treba da bude tačno vreme ili vremenski raspon?', 'Realan vremenski raspon je često pouzdaniji. Tačno vreme ima smisla samo kada kvalitet podataka i operativna situacija zaista podržavaju takvu preciznost.'],
      ['Da li je dovoljna ETA iz TMS-a ili sistema za praćenje?', 'Ona je važna osnova, ali kod značajnog odstupanja treba je uporediti sa aktuelnim operativnim statusom. Sistem možda ne prikazuje potpuno pauzu, zadržavanje na rampi ili još nerazjašnjenu prepreku.'],
      ['Kada klijent mora biti obavešten?', 'Prema dogovorenim pravilima obaveštavanja i eskalacije. Ako takva pravila ne postoje, treba ih definisati pre operativnog rada, uključujući odgovornost i dozvoljeni sadržaj poruke.'],
      ['Ko sme da obeća novi termin?', 'Samo za to ovlašćena osoba ili strana. Operativna podrška može da pripremi i prati informaciju, ali ne zamenjuje ugovorno ili poslovno odobrenje.'],
    ],
    relatedLabel: 'Povezani osnovni članak',
    relatedTitle: 'Zašto TMS sistemi ne menjaju disponente',
    relatedText: 'Kako se od sistemskih podataka, kroz proveru činjenica, odluku, komunikaciju i predaju, stvara pouzdan operativni slučaj.',
    relatedLink: '/sr/praksa-znanje/zasto-tms-ne-menja-disponente',
    relatedCta: 'Pročitaj osnovni članak',
    nextLabel: 'Sledeći praktični članak',
    nextTitle: 'Balkan–DACH komunikacija sa vozačima: gde greške stvaraju troškove',
    nextText: 'Kako jasan kontekst ture, bezbedna povratna potvrda i dokumentacija pretvaraju poruku u zatvoren operativni proces.',
    nextLink: driverCommunicationArticlePaths.sr,
    nextCta: 'Pročitaj članak o komunikaciji',
    back: 'Praksa i znanje',
    ctaEyebrow: 'PILOT FIRST',
    ctaTitle: 'Testirajte statusnu komunikaciju na jasno ograničenom procesu.',
    cta: 'Pokreni proveru pilota',
    pilotLink: '/sr/provera-pilota',
  },
}

export default function EtaArticle({ lang }) {
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
        <h2>{t.definitionsTitle}</h2>
        <p>{t.definitionsIntro}</p>
        <dl className="eta-definition-grid">
          {t.definitions.map(([term, description]) => <div key={term}>
            <dt>{term}</dt>
            <dd>{description}</dd>
          </div>)}
        </dl>
      </section>

      {t.sections.map(([heading, paragraph]) => <section key={heading}>
        <h2>{heading}</h2>
        <p>{paragraph}</p>
      </section>)}

      <section className="eta-format-section">
        <h2>{t.formatTitle}</h2>
        <p>{t.formatIntro}</p>
        <ol className="eta-format-grid">
          {t.format.map(([number, title, description]) => <li key={number}>
            <span>{number}</span>
            <div><strong>{title}</strong><p>{description}</p></div>
          </li>)}
        </ol>
      </section>

      <section className="eta-example-section">
        <h2>{t.exampleTitle}</h2>
        <div className="eta-example-grid">
          <article className="eta-example-bad">
            <span>{t.badLabel}</span>
            <blockquote>{t.bad}</blockquote>
            <p>{t.badReason}</p>
          </article>
          <article className="eta-example-good">
            <span>{t.goodLabel}</span>
            <blockquote>{t.good}</blockquote>
            <p>{t.goodReason}</p>
          </article>
        </div>
      </section>

      <section className="article-checklist">
        <h2>{t.checkTitle}</h2>
        <p className="checklist-intro">{t.checkIntro}</p>
        {t.checks.map(item => <label key={item}>
          <input type="checkbox" />
          <span>{item}</span>
        </label>)}
        <div className="checklist-note">
          <strong>{t.ruleTitle}</strong>
          <p>{t.rule}</p>
        </div>
      </section>

      <section className="article-faq">
        <h2>{t.faqTitle}</h2>
        {t.faq.map(([question, answer]) => <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>)}
      </section>

      <aside className="related-article-card related-article-next">
        <span>{t.nextLabel}</span>
        <h2>{t.nextTitle}</h2>
        <p>{t.nextText}</p>
        <a href={t.nextLink}>{t.nextCta} →</a>
      </aside>

      <aside className="related-article-card">
        <span>{t.relatedLabel}</span>
        <h2>{t.relatedTitle}</h2>
        <p>{t.relatedText}</p>
        <a href={t.relatedLink}>{t.relatedCta} →</a>
      </aside>

      <section className="article-cta">
        <span>{t.ctaEyebrow}</span>
        <h2>{t.ctaTitle}</h2>
        <a href={t.pilotLink}>{t.cta} →</a>
      </section>
    </article>
  </main>
}
