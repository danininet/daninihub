import './App.css'

const pages = {
  '/de/externe-disposition': {
    kicker: 'EXTERNE DISPOSITIONSUNTERSTÜTZUNG',
    title: 'Wenn Ihre Disposition zu viel gleichzeitig tragen muss.',
    lead: 'DaniniHub übernimmt klar definierte operative Aufgaben rund um Status, ETA, Fahrer- und Partnerkommunikation sowie Abweichungen – flexibel aus Duisburg und ohne Ihre Disposition zu ersetzen.',
    bullets: ['Status- und ETA-Nachverfolgung', 'Fahrer- und Partnerkommunikation', 'Abweichungen und Eskalationen strukturieren', 'Übergaben und offene Punkte dokumentieren'],
    fitTitle: 'Wann das sinnvoll ist',
    fit: 'Wenn Engpässe, Urlaub, Spitzenzeiten oder wiederkehrende Balkan-Verkehre Ihre bestehende Disposition binden, aber eine zusätzliche Vollzeitstelle nicht die erste Lösung sein soll.',
    cta: '10-Minuten-Gespräch anfragen',
    link: '/de/pilot-check',
    secondary: ['/de/balkan-desk', 'Balkan Desk ansehen →']
  },
  '/de/balkan-desk': {
    kicker: 'BALKAN DESK FÜR DACH-SPEDITIONEN',
    title: 'Ein operativer Ansprechpartner für Ihre Balkan-Verkehre.',
    lead: 'Für DACH-Speditionen mit regelmäßigen Relationen nach Serbien, Kroatien, Bosnien und Herzegowina, Slowenien, Montenegro, Nordmazedonien, Bulgarien oder Rumänien.',
    bullets: ['Kommunikation mit Fahrern und Balkan-Partnern', 'Status, ETA und nächste Kontrollpunkte', 'CMR/POD-Nachverfolgung und offene Dokumente', 'Probleme unterwegs strukturiert an die richtige Stelle eskalieren'],
    fitTitle: 'Was Sie davon haben',
    fit: 'Weniger Rückfragen in Ihrer Kern-Disposition, klarere Statuslage und eine definierte Schnittstelle zwischen DACH-Auftraggebern und Balkan-Fahrern oder Partnern.',
    cta: 'Balkan-Engpass kurz besprechen',
    link: '/de/pilot-check',
    secondary: ['/de/externe-disposition', 'Externe Disposition ansehen →']
  },
  '/de/dach-desk': {
    kicker: 'DACH DESK FÜR BALKAN-TRANSPORTUNTERNEHMEN',
    title: 'Ihre operative Schnittstelle zum deutschen Markt.',
    lead: 'DaniniHub unterstützt Balkan-Transportunternehmen bei der laufenden Kommunikation mit deutschen und österreichischen Kunden, Speditionen und Partnern – aus Duisburg und auf Deutsch.',
    bullets: ['Kommunikation mit DACH-Kunden und Speditionen', 'Status- und ETA-Rückmeldungen auf Deutsch', 'Reklamationen, Rückfragen und Problemfälle strukturieren', 'Partner- und Kundenkontakt im Tagesgeschäft unterstützen'],
    fitTitle: 'Für wen das gedacht ist',
    fit: 'Für Balkan-Frachtführer, die regelmäßig in Deutschland oder Österreich fahren und eine verlässliche deutschsprachige operative Schnittstelle brauchen, ohne direkt eine eigene Niederlassung aufzubauen.',
    cta: 'DACH Desk besprechen',
    link: '/de/pilot-check',
    secondary: ['/de/balkan-desk', 'Balkan Desk für DACH ansehen →']
  },
  '/sr/eksterna-dispozicija': {
    kicker: 'EKSTERNA PODRŠKA DISPOZICIJI',
    title: 'Kada vaša dispozicija nosi previše stvari odjednom.',
    lead: 'DaniniHub preuzima jasno definisane operativne zadatke oko statusa, ETA, komunikacije sa vozačima i partnerima i odstupanja – fleksibilno iz Duisburga, bez preuzimanja vaše odgovornosti.',
    bullets: ['Praćenje statusa i ETA', 'Komunikacija sa vozačima i partnerima', 'Strukturisanje odstupanja i eskalacija', 'Dokumentovana primopredaja i otvorene tačke'],
    fitTitle: 'Kada ima smisla',
    fit: 'Kada gužve, odmori, vršni periodi ili ponavljajući DACH–Balkan transporti opterećuju postojeću dispoziciju, a dodatni zaposleni nije prvo rešenje.',
    cta: 'Zatraži razgovor od 10 minuta',
    link: '/sr/provera-pilota',
    secondary: ['/sr/balkan-desk', 'Pogledaj Balkan Desk →']
  },
  '/sr/balkan-desk': {
    kicker: 'BALKAN DESK ZA DACH ŠPEDICIJE',
    title: 'Operativna kontakt tačka za vaše Balkan transporte.',
    lead: 'Za DACH špedicije koje redovno rade relacije prema Srbiji, Hrvatskoj, BiH, Sloveniji, Crnoj Gori, Severnoj Makedoniji, Bugarskoj ili Rumuniji.',
    bullets: ['Komunikacija sa vozačima i Balkan partnerima', 'Status, ETA i sledeće kontrolne tačke', 'Praćenje CMR/POD i otvorene dokumentacije', 'Strukturisana eskalacija problema'],
    fitTitle: 'Šta dobijate',
    fit: 'Manje prekida u centralnoj dispoziciji, jasniji status i definisanu vezu između DACH naručioca i Balkan vozača ili partnera.',
    cta: 'Razgovaraj o Balkan problemu',
    link: '/sr/provera-pilota',
    secondary: ['/sr/eksterna-dispozicija', 'Pogledaj eksternu dispoziciju →']
  },
  '/sr/dach-desk': {
    kicker: 'DACH DESK ZA BALKANSKE PREVOZNIKE',
    title: 'Vaša operativna veza sa nemačkim tržištem.',
    lead: 'DaniniHub pomaže balkanskim transportnim firmama u svakodnevnoj komunikaciji sa nemačkim i austrijskim klijentima, špedicijama i partnerima – iz Duisburga i na nemačkom jeziku.',
    bullets: ['Komunikacija sa DACH klijentima i špedicijama', 'Status i ETA odgovori na nemačkom', 'Reklamacije, upiti i problemi u transportu', 'Podrška u svakodnevnom kontaktu sa partnerima'],
    fitTitle: 'Za koga je ovo',
    fit: 'Za Balkan prevoznike koji redovno voze Nemačku ili Austriju i žele pouzdanu nemačku operativnu kontakt tačku bez otvaranja sopstvene poslovnice.',
    cta: 'Razgovaraj o DACH Desk-u',
    link: '/sr/provera-pilota',
    secondary: ['/sr/balkan-desk', 'Pogledaj Balkan Desk za DACH →']
  }
}

export default function LeadLandingPages() {
  const page = pages[location.pathname] || pages['/de/externe-disposition']
  return <main id="top">
    <section className="hero">
      <div className="hero-copy">
        <p className="kicker">{page.kicker}</p>
        <h1>{page.title}</h1>
        <p className="lead">{page.lead}</p>
        <p><a className="btn" href={page.link}>{page.cta} →</a></p>
        <a className="entry-demo-link" href={page.secondary[0]}>{page.secondary[1]}</a>
      </div>
    </section>

    <section className="section">
      <p className="kicker">OPERATIVNI FOKUS</p>
      <h2>{page.fitTitle}</h2>
      <p className="big">{page.fit}</p>
      <div className="start-grid">
        {page.bullets.map((item, i) => <article key={item}><span>0{i + 1}</span><h3>{item}</h3></article>)}
      </div>
    </section>

    <section className="section split">
      <div>
        <p className="kicker">KONKRETAN POČETAK</p>
        <h2>Ne menjamo vaš sistem. Preuzimamo jasno ograničen deo posla.</h2>
      </div>
      <div>
        <p>Početak može biti jedna relacija, nekoliko vozila ili jedan ponavljajući proces. Prvo definišemo šta preuzimam, ko donosi odluke i kako izgleda izveštavanje.</p>
        <p><a className="btn" href={page.link}>{page.cta} →</a></p>
      </div>
    </section>

    <section className="section scope">
      <p className="kicker">DANINIHUB · DUISBURG</p>
      <h2>DACH ↔ Balkan Logistics Operations Support</h2>
      <div className="scope-grid">
        <article><span>Operativa</span><p>Status, ETA, vozači, partneri, dokumenti, otvorene tačke i kontrolisane eskalacije.</p></article>
        <article><span>Odgovornost</span><p>Transportni nalozi, cene, pravno obavezujuće odluke i završna dispozicija ostaju kod naručioca.</p></article>
      </div>
    </section>
  </main>
}
