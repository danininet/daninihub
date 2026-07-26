import './DispoLabPage.css'

const copy = {
  de: {
    kicker: 'DANINIHUB DISPOLAB',
    title: 'Wenn der Transportplan nicht mehr stimmt, entscheidet nicht das TMS.',
    lead: 'Praxis- und Entscheidungstraining für Disponenten, Bewerber und Transportteams im Balkan–DACH-Verkehr.',
    primary: 'Kostenlosen Dispo-Check starten',
    secondary: 'Company Pilot anfragen',
    trust: 'Der Mensch entscheidet. DaniniHub strukturiert den Denkprozess.',
    introTitle: 'Keine Videokurse. Keine automatischen Entscheidungen.',
    intro: 'Sie bearbeiten realistische Transportsituationen mit unvollständigen Informationen, Zeitdruck, Sprachbarrieren und mehreren Beteiligten. Bewertet wird nicht nur Ihre endgültige Antwort, sondern der gesamte Lösungsweg.',
    checks: ['Welche Informationen haben Sie geprüft?', 'Welche Risiken haben Sie erkannt?', 'Wen haben Sie wann informiert?', 'Wie klar war Ihre Kommunikation?', 'Was wurde dokumentiert und übergeben?', 'Haben Sie innerhalb Ihrer Befugnisse gehandelt?'],
    howTitle: 'So funktioniert eine Simulation',
    steps: [
      ['1', 'Unvollständige Lage', 'Sie erhalten eine realistische Meldung, zum Beispiel eine unklare ETA, einen fehlenden CMR oder eine gefährdete Entladung.'],
      ['2', 'Rückfragen und Prioritäten', 'Sie entscheiden, welche Fakten fehlen, wen Sie zuerst kontaktieren und welche Risiken sofort geprüft werden müssen.'],
      ['3', 'Kommunikation', 'Sie formulieren Fahrer-, Kunden- und interne Statusmeldungen auf Deutsch oder BKS.'],
      ['4', 'Strukturierte Auswertung', 'DaniniHub bewertet Informationsprüfung, Risiko, Kommunikation, Dokumentation, Eskalation und Verantwortungsgrenzen.']
    ],
    scoreTitle: 'Dispatch Readiness Score',
    scoreText: 'Die Auswertung umfasst bis zu 100 Punkte in acht Kompetenzfeldern. Der Score ist eine interne DaniniHub-Einschätzung aus simulierten Fällen und keine staatlich anerkannte Qualifikation.',
    scoreItems: ['Operatives Denken und Prioritäten', 'Fehlende Informationen erkennen', 'Zeit- und Risikoeinschätzung', 'Fahrer- und Kundenkommunikation', 'Dokumentation und Schichtübergabe', 'Eskalation und Befugnisgrenzen'],
    productsTitle: 'Geplante Produktstufen',
    products: [
      ['Kostenloser Dispo-Check', '3 Fallsimulationen', '0 €', 'Einstieg, erste Auswertung und Produkttest.'],
      ['Dispatch Readiness Check', '10 Fallsimulationen', '29 €', 'Individueller Score, Analyse und PDF-Bericht.'],
      ['DispoLab Practice Pack', '20–30 Simulationen', '79 €', 'Training, Vorlagen und dokumentierter Lernfortschritt.'],
      ['Company Pilot', 'Bis zu 5 Teilnehmer', '490 €', 'Team-Auswertung und ein anonymisierter Unternehmensfall.']
    ],
    companyTitle: 'Für Transportunternehmen',
    companyText: 'Nutzen Sie DispoLab für Bewerberauswahl, Einarbeitung, interne Weiterbildung und Standardisierung. Eigene anonymisierte Praxisfälle können später in unternehmensspezifische Simulationen überführt werden.',
    companyList: ['Bewerber strukturiert vergleichen', 'Neue Disponenten sicherer einarbeiten', 'Kommunikations- und Eskalationswege prüfen', 'Wissen erfahrener Mitarbeiter dokumentierbar machen'],
    statusTitle: 'Der erste Check ist verfügbar',
    statusText: 'Testen Sie jetzt drei simulierte Fälle zu ETA, CMR und Schichtübergabe. Die Auswertung arbeitet bewusst transparent mit festen Kriterien; Freitext- und KI-Analyse folgen nach der Validierung.',
    legal: 'DispoLab ersetzt weder Disponenten noch TMS-Systeme und erteilt keine bindenden operativen, rechtlichen, zollbezogenen oder sicherheitsrelevanten Weisungen.'
  },
  sr: {
    kicker: 'DANINIHUB DISPOLAB',
    title: 'Kada transportni plan više ne važi, TMS ne donosi odluku.',
    lead: 'Praktični trening razmišljanja i odlučivanja za disponente, kandidate i transportne timove na Balkan–DACH relacijama.',
    primary: 'Pokreni besplatni Dispo-Check',
    secondary: 'Pošalji upit za Company Pilot',
    trust: 'Čovek donosi odluku. DaniniHub strukturira proces razmišljanja.',
    introTitle: 'Bez video-kursa. Bez automatskih odluka.',
    intro: 'Obrađujete realistične transportne situacije sa nepotpunim informacijama, vremenskim pritiskom, jezičkim barijerama i više učesnika. Ne ocenjuje se samo završni odgovor, već ceo put do rešenja.',
    checks: ['Koje informacije ste proverili?', 'Koje rizike ste prepoznali?', 'Koga ste i kada obavestili?', 'Koliko je komunikacija bila jasna?', 'Šta je dokumentovano i predato?', 'Da li ste ostali u granicama ovlašćenja?'],
    howTitle: 'Kako izgleda jedna simulacija',
    steps: [
      ['1', 'Nepotpuna situacija', 'Dobijate realističnu poruku, na primer nejasan ETA, nedostajući CMR ili ugrožen termin istovara.'],
      ['2', 'Pitanja i prioriteti', 'Određujete koje činjenice nedostaju, koga prvo kontaktirate i koje rizike odmah proveravate.'],
      ['3', 'Komunikacija', 'Pišete poruke vozaču, klijentu i internom timu na nemačkom ili BKS jeziku.'],
      ['4', 'Strukturisana analiza', 'DaniniHub ocenjuje proveru informacija, rizik, komunikaciju, dokumentovanje, eskalaciju i granice odgovornosti.']
    ],
    scoreTitle: 'Dispatch Readiness Score',
    scoreText: 'Analiza obuhvata do 100 poena u osam oblasti kompetencije. Rezultat je interna DaniniHub procena na osnovu simuliranih slučajeva, a ne zvanična stručna kvalifikacija.',
    scoreItems: ['Operativno razmišljanje i prioriteti', 'Prepoznavanje nedostajućih informacija', 'Procena vremena i rizika', 'Komunikacija sa vozačem i klijentom', 'Dokumentovanje i predaja smene', 'Eskalacija i granice ovlašćenja'],
    productsTitle: 'Planirani nivoi proizvoda',
    products: [
      ['Besplatni Dispo-Check', '3 simulacije', '0 €', 'Ulazna procena i upoznavanje metode.'],
      ['Dispatch Readiness Check', '10 simulacija', '29 €', 'Lični rezultat, analiza i PDF izveštaj.'],
      ['DispoLab Practice Pack', '20–30 simulacija', '79 €', 'Trening, šabloni i dokumentovan napredak.'],
      ['Company Pilot', 'Do 5 učesnika', '490 €', 'Timska analiza i jedan anonimizovan slučaj firme.']
    ],
    companyTitle: 'Za transportne kompanije',
    companyText: 'Koristite DispoLab za izbor kandidata, onboarding, internu obuku i standardizaciju. Sopstveni anonimizovani slučajevi kasnije se mogu pretvoriti u simulacije prilagođene kompaniji.',
    companyList: ['Strukturisano poređenje kandidata', 'Bezbednije uvođenje novih disponenta', 'Provera komunikacije i eskalacije', 'Pretvaranje iskustva zaposlenih u prenosivo znanje'],
    statusTitle: 'Prva provera je dostupna',
    statusText: 'Odmah možete testirati tri simulirana slučaja: ETA, CMR i predaju smene. Procena namerno koristi jasne fiksne kriterijume; slobodni tekst i AI analiza dolaze nakon validacije.',
    legal: 'DispoLab ne zamenjuje disponente ni TMS i ne izdaje obavezujuće operativne, pravne, carinske ili bezbednosne naloge.'
  }
}

export default function DispoLabPage({ lang }) {
  const t = copy[lang]
  const home = lang === 'sr' ? '/sr/' : '/de/'
  const contact = `${home}#contact`
  const check = lang === 'sr' ? '/sr/dispo-lab/provera' : '/de/dispolab/check'

  return <main className="dl-page">
    <section className="dl-hero">
      <div className="dl-hero-copy">
        <p className="dl-kicker">{t.kicker}</p>
        <h1>{t.title}</h1>
        <p className="dl-lead">{t.lead}</p>
        <div className="dl-actions">
          <a className="dl-btn dl-btn-primary" href={check}>{t.primary}</a>
          <a className="dl-btn dl-btn-secondary" href={contact}>{t.secondary}</a>
        </div>
        <p className="dl-trust">{t.trust}</p>
      </div>
      <aside className="dl-hero-card">
        <span>DISPOLAB METHOD</span>
        <strong>Fakten → Risiko → Kommunikation → Dokumentation</strong>
        <div className="dl-score-ring"><b>100</b><small>Readiness<br/>Punkte</small></div>
      </aside>
    </section>

    <section className="dl-section dl-intro">
      <div><p className="dl-kicker">PRAXIS STATT THEORIE</p><h2>{t.introTitle}</h2><p>{t.intro}</p></div>
      <ul>{t.checks.map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    <section className="dl-section">
      <p className="dl-kicker">WORKFLOW</p>
      <h2>{t.howTitle}</h2>
      <div className="dl-step-grid">{t.steps.map(([n, title, body]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
    </section>

    <section className="dl-section dl-score">
      <div><p className="dl-kicker">KOMPETENZMODELL</p><h2>{t.scoreTitle}</h2><p>{t.scoreText}</p></div>
      <ul>{t.scoreItems.map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    <section className="dl-section">
      <p className="dl-kicker">ANGEBOT</p>
      <h2>{t.productsTitle}</h2>
      <div className="dl-product-grid">{t.products.map(([name, scope, price, body]) => <article key={name}><div><h3>{name}</h3><span>{scope}</span></div><strong>{price}</strong><p>{body}</p></article>)}</div>
    </section>

    <section className="dl-section dl-company">
      <div><p className="dl-kicker">B2B</p><h2>{t.companyTitle}</h2><p>{t.companyText}</p><a className="dl-btn dl-btn-primary" href={contact}>{t.secondary}</a></div>
      <ul>{t.companyList.map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    <section className="dl-section dl-status">
      <div><p className="dl-kicker">LIVE MVP</p><h2>{t.statusTitle}</h2><p>{t.statusText}</p></div>
      <a className="dl-btn dl-btn-primary" href={check}>{t.primary}</a>
    </section>

    <p className="dl-legal">{t.legal}</p>
  </main>
}
