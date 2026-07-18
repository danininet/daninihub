import './SiteFooter.css'

const copy = {
  de: {
    text: 'Klar begrenzte operative Unterstützung für Balkan–DACH-Transporte – mit dokumentierten Zuständigkeiten und menschlicher Entscheidung.',
    services: 'Leistungen',
    company: 'DaniniHub',
    legal: 'Rechtliches',
    scope: 'Leistungsrahmen',
    continuity: 'Continuity Support',
    drivers: 'Fahrerkommunikation',
    pilot: 'Pilot-Check',
    practice: 'Praxis & Wissen',
    law: 'Praxis & Recht',
    glossary: 'Glossar',
    contact: 'Kontakt',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    cookies: 'Cookies',
    liability: 'Haftungsausschluss',
    trust: ['Dokumentierte Prozesse','Mehrsprachige Kommunikation','Entscheidungen beim Auftraggeber','Pilot statt Dauerbindung','Balkan–DACH-Fokus','DSGVO-orientiert']
  },
  sr: {
    text: 'Jasno ograničena operativna podrška za Balkan–DACH transport – sa dokumentovanim odgovornostima i odlukama koje ostaju kod čoveka.',
    services: 'Usluge',
    company: 'DaniniHub',
    legal: 'Pravne informacije',
    scope: 'Obim usluge',
    continuity: 'Podrška kontinuitetu',
    drivers: 'Komunikacija sa vozačima',
    pilot: 'Provera pilota',
    practice: 'Praksa i znanje',
    law: 'Procedure i propisi',
    glossary: 'Rečnik',
    contact: 'Kontakt',
    imprint: 'Impresum',
    privacy: 'Privatnost',
    cookies: 'Kolačići',
    liability: 'Odricanje odgovornosti',
    trust: ['Dokumentovani procesi','Višejezička komunikacija','Odluke ostaju kod naručioca','Pilot bez trajne obaveze','Balkan–DACH fokus','DSGVO orijentisano']
  }
}

export default function SiteFooter({ lang }) {
  const t = copy[lang]
  const sr = lang === 'sr'
  return <footer className="site-footer-pro">
    <div className="site-footer-trust">{t.trust.map(x=><span key={x}>✓ {x}</span>)}</div>
    <div className="site-footer-grid">
      <section className="site-footer-brand">
        <a href={sr?'/sr/':'/de/'} className="site-footer-logo"><img src="/logo-mark.svg" alt="" width="44" height="44"/><span><strong>DaniniHub</strong><small>TRANSPORT &amp; LOGISTICS</small></span></a>
        <p>{t.text}</p>
        <a href="mailto:info@daninihub.com">info@daninihub.com</a>
        <a href="tel:+4915730916621">+49 1573 0916621</a>
      </section>
      <nav aria-label={t.services}><h2>{t.services}</h2>
        <a href={sr?'/sr/obim-usluge':'/de/leistungsrahmen'}>{t.scope}</a>
        <a href={sr?'/sr/kontinuitet-podrska':'/de/continuity-support'}>{t.continuity}</a>
        <a href={sr?'/sr/komunikacija-vozaci':'/de/fahrerkommunikation'}>{t.drivers}</a>
        <a href={sr?'/sr/provera-pilota':'/de/pilot-check'}>{t.pilot}</a>
      </nav>
      <nav aria-label={t.company}><h2>{t.company}</h2>
        <a href={sr?'/sr/praksa-znanje':'/de/praxis-wissen'}>{t.practice}</a>
        <a href={sr?'/sr/praksa-propisi':'/de/praxis-wissen'}>{t.law}</a>
        <a href={sr?'/sr/recnik':'/de/glossar'}>{t.glossary}</a>
        <a href={(sr?'/sr/':'/de/')+'#contact'}>{t.contact}</a>
        <a href={sr?'/sr/primer-pilota':'/de/pilot-beispiel'}>{sr?'Primer pilota':'Pilot-Beispiel'}</a>
      </nav>
      <nav aria-label={t.legal}><h2>{t.legal}</h2>
        <a href={sr?'/sr/impressum':'/de/impressum'}>{t.imprint}</a>
        <a href={sr?'/sr/privatnost':'/de/datenschutz'}>{t.privacy}</a>
        <a href={sr?'/sr/kolacici':'/de/cookies'}>{t.cookies}</a>
        <a href={sr?'/sr/odricanje-odgovornosti':'/de/haftungsausschluss'}>{t.liability}</a>
      </nav>
    </div>
    <div className="site-footer-bottom"><span>© 2026 DaniniHub</span><span>Duisburg · Nordrhein-Westfalen</span></div>
  </footer>
}
