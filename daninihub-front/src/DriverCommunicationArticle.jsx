import './KnowledgeArticle.css'
import { etaArticlePaths, shiftHandoverArticlePaths, tmsArticlePaths } from './KnowledgePaths'

const article = {
  de: {
    eyebrow: 'PRAXIS & WISSEN · FAHRERKOMMUNIKATION',
    title: 'Fahrerkommunikation Balkan–DACH: Wo Informationsfehler Kosten verursachen',
    lead: 'Nicht die Fremdsprache allein ist das Risiko. Kosten entstehen, wenn Tourbezug, Handlung, Frist, Bestätigung oder Dokumentation fehlen – unabhängig davon, in welcher Sprache die Nachricht gesendet wurde.',
    meta: '10 Min. Lesezeit · 19. Juli 2026 · Dragan Zdravković',
    summaryTitle: 'Executive Summary',
    summary: 'Belastbare Fahrerkommunikation ist ein geschlossener operativer Ablauf: eindeutiger Bezug, bestätigter Fakt, eine klare Handlung, definierter Zeitpunkt, Rückbestätigung und dokumentiertes Ergebnis. Übersetzung unterstützt diesen Ablauf, ersetzt ihn aber nicht. Eine sprachlich korrekte Nachricht bleibt gefährlich, wenn der Fahrer nicht weiß, welche Tour gemeint ist, was genau zu tun ist oder ob seine Rückmeldung angekommen ist.',
    risksTitle: 'Vier Informationsfehler, die aus einer Nachricht ein Kostenrisiko machen',
    risksIntro: 'Der Fehler zeigt sich häufig erst an Rampe, Slot oder Schichtwechsel. Seine Ursache liegt jedoch früher in einer unvollständigen Kommunikationskette.',
    risks: [
      ['01', 'Unklarer Bezug', 'Tour, Fahrzeug, Ladeort oder Auftrag sind nicht eindeutig genannt. Die richtige Information kann dadurch dem falschen Vorgang zugeordnet werden.'],
      ['02', 'Mehrdeutige Handlung', 'Formulierungen wie „später“, „andere Adresse“ oder „bitte schnell klären“ lassen offen, was konkret erwartet wird.'],
      ['03', 'Keine Rückbestätigung', 'Die Nachricht wurde gesendet, aber Verständnis und Ausführung wurden nicht bestätigt. „Zugestellt“ bedeutet nicht „verstanden“.'],
      ['04', 'Verteilte Dokumentation', 'Ein Teil steht im TMS, ein Teil im Chat und ein weiterer nur im Telefongespräch. Die nächste Schicht sieht keine vollständige Version.'],
    ],
    sections: [
      ['Sprache ist nur eine Ebene der Verständlichkeit', 'Eine gute Übersetzung hilft, aber operative Eindeutigkeit entsteht erst durch Kontext und Struktur. Tourreferenz, Ort, bestätigter Status, erwartete Handlung und Frist sollten in jeder Sprachversion dieselbe Bedeutung behalten. Interne Kürzel oder lokale Begriffe gehören erklärt, wenn nicht sicher ist, dass der Fahrer sie kennt.'],
      ['Eine Nachricht sollte nur eine Hauptaktion enthalten', 'Mehrere Anweisungen in einem Absatz erhöhen das Risiko, dass nur ein Teil bestätigt wird. Bei einer geänderten Zufahrt genügt zunächst die klare neue Anfahrt mit Bestätigung. Dokumente, ETA oder weitere Fragen können anschließend als getrennte Punkte folgen. So bleibt sichtbar, was bereits verstanden und was noch offen ist.'],
      ['Sicherheit steht vor Antwortgeschwindigkeit', 'Ein Fahrer darf nicht durch Nachrichten zum Lesen oder Tippen während der Fahrt gedrängt werden. Die Kommunikation muss ausdrücklich vorsehen, dass Rückmeldung erst an einem sicheren und zulässigen Ort erfolgt. Dringlichkeit ändert diese Grenze nicht; für akute Situationen gelten die vereinbarten sicheren Eskalationswege.'],
      ['Die operative Version gehört in den gemeinsamen Datensatz', 'Messenger und Telefon können schnelle Kanäle sein. Für die Übergabe zählt jedoch der dokumentierte Kern: Was wurde wann von wem gemeldet, welche Anweisung war freigegeben, was bestätigte der Fahrer und welcher Punkt ist noch offen? Ohne diesen Eintrag beginnt die nächste Schicht erneut mit Rückfragen.'],
    ],
    protocolTitle: 'Der 6-Schritte-Standard für geschlossene Fahrerkommunikation',
    protocolIntro: 'Die Kommunikation ist erst abgeschlossen, wenn nicht nur das Senden, sondern auch Verständnis, Ergebnis und Dokumentation nachvollziehbar sind.',
    protocol: [
      ['01', 'Vorgang benennen', 'Tour, Fahrzeug und relevanten Ort eindeutig nennen.'],
      ['02', 'Fakt mit Zeit nennen', 'Bestätigten Status und Zeitpunkt von Annahmen trennen.'],
      ['03', 'Eine Handlung formulieren', 'Einfacher Satz, aktives Verb, keine mehrdeutigen Kürzel.'],
      ['04', 'Zeit & Grenze setzen', 'Frist, verantwortliche Rolle und notwendige Freigabe angeben.'],
      ['05', 'Verständnis zurückspiegeln', 'Fahrer bestätigt den Kern in eigenen Worten – erst im sicheren Stillstand.'],
      ['06', 'Ergebnis dokumentieren', 'Bestätigung, Abweichung und nächsten Prüfpunkt im gemeinsamen Datensatz festhalten.'],
    ],
    loopTitle: 'Nicht „gesendet“, sondern geschlossen',
    loop: ['Auftrag', 'Verstanden', 'Ausgeführt', 'Dokumentiert'],
    exampleTitle: 'Beispiel: geänderte Zufahrt zum Entladeort',
    badLabel: 'Unklar und nicht prüfbar',
    bad: '„Bitte die neue Adresse nehmen und schnell Bescheid geben.“',
    badReason: 'Tour, alte und neue Adresse, Tor, Zeitpunkt, sichere Rückmeldung und gewünschte Bestätigung fehlen.',
    goodLabel: 'Eindeutig und geschlossen',
    good: '„Tour DH-204, Fahrzeug 17: Nicht zur bisherigen Einfahrt Tor 2 fahren. Neue Anfahrt: Industriestraße 8, Tor 5. Bitte erst im sicheren Stillstand mit ‚Tor 5 verstanden‘ bestätigen. Wenn die Navigation eine andere Einfahrt zeigt: nicht raten, sondern Disposition anrufen. Stand der Information: 14:20 Uhr.“',
    goodReason: 'Der Vorgang ist identifizierbar, die Handlung eindeutig, die sichere Rückbestätigung definiert und der Informationsstand datiert.',
    checklistTitle: 'Schnellcheck vor einer Fahrernachricht',
    checklistIntro: 'Diese Punkte prüfen nicht die Grammatik, sondern ob die Nachricht operativ ausführbar, sicher und später nachvollziehbar ist.',
    checks: [
      'Sind Tour, Fahrzeug oder Auftrag eindeutig identifiziert?',
      'Sind bestätigter Fakt und neue Anweisung sichtbar getrennt?',
      'Enthält die Nachricht nur eine klar priorisierte Hauptaktion?',
      'Ist angegeben, wann und durch wen die Information bestätigt wurde?',
      'Ist die Rückmeldung ausdrücklich erst im sicheren Stillstand vorgesehen?',
      'Ist formuliert, welche konkrete Bestätigung erwartet wird?',
      'Sind Abweichungsweg, verantwortliche Rolle und nächster Prüfpunkt klar?',
      'Wird das Ergebnis anschließend im gemeinsamen Datensatz dokumentiert?',
    ],
    noteTitle: 'Wichtige Grenze',
    note: 'Mehrsprachige Unterstützung darf nur freigegebene Informationen strukturieren und übertragen. Fahreranweisungen, sicherheitsrelevante Entscheidungen, Vertragszusagen und finale Freigaben bleiben bei der autorisierten Stelle des Auftraggebers.',
    faqTitle: 'Häufige Fragen',
    faq: [
      ['Reicht WhatsApp für die Fahrerkommunikation?', 'Als vereinbarter Kontaktkanal kann ein Messenger praktisch sein. Operativ relevante Fakten, Freigaben und Bestätigungen sollten anschließend jedoch im vorgesehenen System oder Übergabeprotokoll dokumentiert werden.'],
      ['Kann automatische Übersetzung den Prozess übernehmen?', 'Sie kann Entwürfe beschleunigen. Bei mehrdeutigen, sicherheitsrelevanten oder verbindlichen Aussagen braucht es weiterhin menschliche Prüfung, freigegebene Begriffe und eine Rückbestätigung des Fahrers.'],
      ['Was passiert, wenn der Fahrer nicht bestätigt?', 'Dann ist die Kommunikationsschleife offen. Es gilt der vorher definierte Eskalationsweg mit Wartezeit, erneutem Kontaktversuch und verantwortlicher Stelle – ohne Verständnis einfach anzunehmen.'],
      ['Muss jede Nachricht zweisprachig sein?', 'Nicht zwingend. Entscheidend ist, dass der Fahrer die verwendete Sprache zuverlässig versteht und zentrale Begriffe konsistent bleiben. Eine zweite Sprachversion kann bei kritischen oder ungewohnten Anweisungen zusätzliche Klarheit schaffen.'],
    ],
    relatedTitle: 'Weiterlesen',
    related: [
      ['ETA ist keine Zusage', 'Wie Prognose, Kundentermin und nächster Prüfpunkt sauber getrennt werden.', 'ETA-Artikel lesen', etaArticlePaths.de],
      ['Schichtübergabe in der Disposition', 'Die zehn Pflichtinformationen für einen kontrollierten Wechsel der operativen Verantwortung.', 'Artikel zur Schichtübergabe lesen', shiftHandoverArticlePaths.de],
      ['Warum TMS-Systeme Disponenten nicht ersetzen', 'Wie Daten durch Prüfung, Entscheidung und Übergabe operativ nutzbar werden.', 'Grundlagenartikel lesen', tmsArticlePaths.de],
    ],
    back: 'Praxis & Wissen',
    ctaEyebrow: 'PILOT FIRST',
    ctaTitle: 'Mehrsprachige Fahrerkommunikation in einem klar begrenzten Ablauf testen.',
    ctaText: 'Der Pilot definiert Kanäle, erlaubte Aussagen, Bestätigung, Eskalation und Dokumentation – bevor operative Unterstützung startet.',
    cta: 'Pilot-Check starten',
    pilotLink: '/de/pilot-check',
  },
  sr: {
    eyebrow: 'PRAKSA I ZNANJE · KOMUNIKACIJA SA VOZAČIMA',
    title: 'Balkan–DACH komunikacija sa vozačima: gde greške stvaraju troškove',
    lead: 'Rizik nije samo strani jezik. Troškovi nastaju kada nedostaju oznaka ture, jasna radnja, rok, potvrda razumevanja ili dokumentacija – bez obzira na kom jeziku je poruka poslata.',
    meta: '10 min. čitanja · 19. jul 2026. · Dragan Zdravković',
    summaryTitle: 'Sažetak za rukovodioce',
    summary: 'Pouzdana komunikacija sa vozačem je zatvoren operativni proces: jasan kontekst, potvrđena činjenica, jedna precizna radnja, određeno vreme, povratna potvrda i dokumentovan rezultat. Prevod podržava taj proces, ali ga ne zamenjuje. Jezički ispravna poruka ostaje rizična ako vozač ne zna na koju turu se odnosi, šta tačno treba da uradi ili da li je njegova potvrda primljena.',
    risksTitle: 'Četiri informacione greške koje poruku pretvaraju u trošak',
    risksIntro: 'Greška često postaje vidljiva tek na rampi, propuštenom slotu ili pri predaji smene. Uzrok je ipak ranije nastao u nepotpunom lancu komunikacije.',
    risks: [
      ['01', 'Nejasan kontekst', 'Tura, vozilo, mesto utovara ili nalog nisu jasno navedeni. Ispravna informacija zato može biti vezana za pogrešan slučaj.'],
      ['02', 'Dvosmislena radnja', 'Izrazi poput „kasnije“, „druga adresa“ ili „brzo proveri“ ne govore šta se konkretno očekuje.'],
      ['03', 'Nema povratne potvrde', 'Poruka je poslata, ali razumevanje i izvršenje nisu potvrđeni. „Isporučeno“ ne znači „razumljeno“.'],
      ['04', 'Rasuta dokumentacija', 'Jedan deo je u TMS-u, drugi u razmeni poruka, a treći samo u telefonskom razgovoru. Sledeća smena nema potpunu verziju.'],
    ],
    sections: [
      ['Jezik je samo jedan nivo razumevanja', 'Dobar prevod pomaže, ali operativna jasnoća nastaje tek iz konteksta i strukture. Oznaka ture, mesto, potvrđen status, očekivana radnja i rok moraju zadržati isto značenje u svakoj jezičkoj verziji. Interne skraćenice i lokalni izrazi treba da budu objašnjeni ako nije sigurno da ih vozač poznaje.'],
      ['Jedna poruka treba da sadrži jednu glavnu radnju', 'Više instrukcija u istom pasusu povećava rizik da samo jedan deo bude potvrđen. Kod promenjenog prilaza prvo je dovoljna jasna nova ruta sa zahtevom za potvrdu. Dokumenta, ETA i dodatna pitanja mogu zatim biti odvojene stavke. Tako se vidi šta je razumljeno, a šta još nije rešeno.'],
      ['Bezbednost je važnija od brzine odgovora', 'Vozač ne sme biti podstaknut da čita ili kuca tokom vožnje. Poruka treba izričito da predvidi odgovor tek kada se vozilo nalazi na bezbednom i dozvoljenom mestu. Hitnost ne menja ovu granicu; za akutne situacije koriste se unapred dogovoreni bezbedni putevi eskalacije.'],
      ['Operativna verzija pripada zajedničkom zapisu', 'Messenger i telefon mogu biti brzi kanali. Za predaju je važna dokumentovana suština: šta je, kada i ko javio, koja instrukcija je bila odobrena, šta je vozač potvrdio i šta je ostalo otvoreno. Bez tog zapisa sledeća smena ponovo počinje pitanjima.'],
    ],
    protocolTitle: 'Standard od 6 koraka za zatvorenu komunikaciju',
    protocolIntro: 'Komunikacija je završena tek kada se, pored slanja, mogu proveriti razumevanje, rezultat i dokumentacija.',
    protocol: [
      ['01', 'Označi slučaj', 'Jasno navedi turu, vozilo i relevantno mesto.'],
      ['02', 'Navedi činjenicu i vreme', 'Odvoji potvrđen status od pretpostavke.'],
      ['03', 'Formuliši jednu radnju', 'Jednostavna rečenica, aktivan glagol i bez dvosmislenih skraćenica.'],
      ['04', 'Odredi vreme i granicu', 'Navedi rok, odgovornu ulogu i potrebno odobrenje.'],
      ['05', 'Traži povratnu potvrdu', 'Vozač svojim rečima potvrđuje suštinu – tek u bezbednom mirovanju.'],
      ['06', 'Dokumentuj rezultat', 'Potvrdu, odstupanje i sledeću proveru zabeleži u zajedničkom sistemu.'],
    ],
    loopTitle: 'Nije dovoljno „poslato“ – krug mora biti zatvoren',
    loop: ['Instrukcija', 'Razumljeno', 'Izvršeno', 'Dokumentovano'],
    exampleTitle: 'Primer: promenjen prilaz mestu istovara',
    badLabel: 'Nejasno i neproverljivo',
    bad: '„Idi na novu adresu i brzo javi.“',
    badReason: 'Nedostaju oznaka ture, stara i nova adresa, kapija, vreme informacije, bezbedan odgovor i tražena potvrda.',
    goodLabel: 'Jasno i zatvoreno',
    good: '„Tura DH-204, vozilo 17: nemoj ići na dosadašnji ulaz, kapija 2. Novi prilaz: Industriestraße 8, kapija 5. Tek kada bezbedno zaustaviš vozilo, potvrdi: ‘Razumeo, kapija 5’. Ako navigacija pokazuje drugi ulaz, nemoj nagađati – pozovi dispoziciju. Stanje informacije: 14:20.“',
    goodReason: 'Slučaj se može identifikovati, radnja je jasna, bezbedna povratna potvrda definisana, a vreme informacije zabeleženo.',
    checklistTitle: 'Brza provera pre poruke vozaču',
    checklistIntro: 'Ove tačke ne proveravaju gramatiku, već da li se poruka može bezbedno izvršiti i kasnije jasno pratiti.',
    checks: [
      'Da li su tura, vozilo ili nalog nedvosmisleno označeni?',
      'Da li su potvrđena činjenica i nova instrukcija jasno razdvojene?',
      'Da li poruka sadrži samo jednu prioritetnu glavnu radnju?',
      'Da li piše kada i ko je potvrdio informaciju?',
      'Da li je odgovor predviđen tek kada je vozilo bezbedno zaustavljeno?',
      'Da li je jasno napisano kakva konkretna potvrda se očekuje?',
      'Da li su put za odstupanje, odgovorna uloga i sledeća provera jasni?',
      'Da li će rezultat zatim biti dokumentovan u zajedničkom zapisu?',
    ],
    noteTitle: 'Važna granica',
    note: 'Višejezička podrška sme da strukturira i prenosi samo odobrene informacije. Instrukcije vozaču, bezbednosne odluke, ugovorna obećanja i konačna odobrenja ostaju kod ovlašćenog lica naručioca.',
    faqTitle: 'Česta pitanja',
    faq: [
      ['Da li je WhatsApp dovoljan za komunikaciju sa vozačem?', 'Kao dogovoreni kontaktni kanal može biti praktičan. Operativno važne činjenice, odobrenja i potvrde ipak treba zatim zabeležiti u predviđenom sistemu ili protokolu predaje.'],
      ['Može li automatski prevod preuzeti ceo proces?', 'Može ubrzati nacrt. Kod dvosmislenih, bezbednosno važnih ili obavezujućih poruka i dalje su potrebni ljudska provera, odobreni izrazi i povratna potvrda vozača.'],
      ['Šta ako vozač ne potvrdi poruku?', 'Komunikacioni krug tada nije zatvoren. Primenjuje se unapred definisan put eskalacije: vreme čekanja, novi pokušaj kontakta i odgovorna strana – bez pretpostavke da je poruka razumljena.'],
      ['Da li svaka poruka mora biti dvojezična?', 'Ne mora. Važno je da vozač pouzdano razume korišćeni jezik i da ključni pojmovi ostanu dosledni. Druga jezička verzija može povećati jasnoću kod kritičnih ili neuobičajenih instrukcija.'],
    ],
    relatedTitle: 'Povezani članci',
    related: [
      ['ETA nije obećanje', 'Kako razdvojiti procenu, termin potvrđen klijentu i sledeću proveru.', 'Pročitaj ETA članak', etaArticlePaths.sr],
      ['Predaja smene u dispoziciji', 'Deset obaveznih informacija za kontrolisan prenos operativne odgovornosti.', 'Pročitaj članak o predaji smene', shiftHandoverArticlePaths.sr],
      ['Zašto TMS ne menja disponente', 'Kako podaci kroz proveru, odluku i predaju postaju operativno upotrebljivi.', 'Pročitaj osnovni članak', tmsArticlePaths.sr],
    ],
    back: 'Praksa i znanje',
    ctaEyebrow: 'PILOT FIRST',
    ctaTitle: 'Testirajte višejezičku komunikaciju na jasno ograničenom procesu.',
    ctaText: 'Pilot definiše kanale, dozvoljene poruke, potvrdu, eskalaciju i dokumentaciju pre početka operativne podrške.',
    cta: 'Pokreni proveru pilota',
    pilotLink: '/sr/provera-pilota',
  },
}

export default function DriverCommunicationArticle({ lang }) {
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

      <section className="driver-risk-section">
        <h2>{t.risksTitle}</h2>
        <p>{t.risksIntro}</p>
        <div className="driver-risk-grid">
          {t.risks.map(([number, title, description]) => <article key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>)}
        </div>
      </section>

      {t.sections.map(([heading, paragraph]) => <section key={heading}>
        <h2>{heading}</h2>
        <p>{paragraph}</p>
      </section>)}

      <section className="driver-protocol-section">
        <h2>{t.protocolTitle}</h2>
        <p>{t.protocolIntro}</p>
        <ol className="driver-protocol-grid">
          {t.protocol.map(([number, title, description]) => <li key={number}>
            <span>{number}</span>
            <div><strong>{title}</strong><p>{description}</p></div>
          </li>)}
        </ol>
      </section>

      <figure className="driver-loop" aria-labelledby="driver-loop-title">
        <figcaption id="driver-loop-title">{t.loopTitle}</figcaption>
        <div>{t.loop.map((item, index) => <span key={item}>
          <b>{String(index + 1).padStart(2, '0')}</b>
          <strong>{item}</strong>
        </span>)}</div>
      </figure>

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
