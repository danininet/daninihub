import './SiteFooter.css'

const copy = {
  de: {
    text: 'Operative Unterstützung für Balkan–DACH-Transporte – klar begrenzt, dokumentiert und mehrsprachig.',
    services: 'Leistungen', knowledge: 'Praxis & Wissen', legal: 'Rechtliches', contactTitle: 'Kontakt',
    scope: 'Leistungsrahmen', continuity: 'Continuity Support', drivers: 'Fahrerkommunikation', pilot: 'Pilot-Check', practice: 'Fachartikel', glossary: 'Glossar', example: 'Pilot-Beispiel', contact: 'Kontakt', imprint: 'Impressum', privacy: 'Datenschutz', cookies: 'Cookies', liability: 'Haftungsausschluss',
    principles: ['DSGVO-orientiert','Datensparsam','Menschliche Entscheidung','Dokumentierte Prozesse']
  },
  sr: {
    text: 'Operativna podrška za Balkan–DACH transport – jasno ograničena, dokumentovana i višejezička.',
    services: 'Usluge', knowledge: 'Praksa i znanje', legal: 'Pravne informacije', contactTitle: 'Kontakt',
    scope: 'Obim usluge', continuity: 'Podrška kontinuitetu', drivers: 'Komunikacija sa vozačima', pilot: 'Provera pilota', practice: 'Stručni članci', glossary: 'Rečnik', example: 'Primer pilota', contact: 'Kontakt', imprint: 'Impresum', privacy: 'Privatnost', cookies: 'Kolačići', liability: 'Odricanje odgovornosti',
    principles: ['GDPR-orijentisano','Minimalna obrada podataka','Ljudska odluka','Dokumentovani procesi']
  }
}

export default function SiteFooter({ lang }) {
  const t = copy[lang]
  const sr = lang === 'sr'
  const home = sr ? '/sr/' : '/de/'
  const pilot = sr ? '/sr/provera-pilota' : '/de/pilot-check'
  return <footer className="site-footer-pro">
    <div className="site-footer-grid">
      <section className="site-footer-brand">
        <a href={home} className="site-footer-logo"><img src="/logo-mark.svg" alt="" width="46" height="46"/><span><strong>DaniniHub</strong><small>TRANSPORT &amp; LOGISTICS</small></span></a>
        <p>{t.text}</p>
        <div className="site-footer-contact"><span>Duisburg · Nordrhein-Westfalen</span><a href="mailto:info@daninihub.com">info@daninihub.com</a><a href="tel:+4915730916621">+49 1573 0916621</a></div>
      </section>
      <nav><h2>{t.services}</h2><a href={sr?'/sr/obim-usluge':'/de/leistungsrahmen'}>{t.scope}</a><a href={sr?'/sr/kontinuitet-podrska':'/de/continuity-support'}>{t.continuity}</a><a href={sr?'/sr/komunikacija-vozaci':'/de/fahrerkommunikation'}>{t.drivers}</a><a href={pilot}>{t.pilot}</a></nav>
      <nav><h2>{t.knowledge}</h2><a href={sr?'/sr/praksa-znanje':'/de/praxis-wissen'}>{t.practice}</a><a href={sr?'/sr/recnik':'/de/glossar'}>{t.glossary}</a><a href={sr?'/sr/primer-pilota':'/de/pilot-beispiel'}>{t.example}</a></nav>
      <nav><h2>{t.legal}</h2><a href={sr?'/sr/impressum':'/de/impressum'}>{t.imprint}</a><a href={sr?'/sr/privatnost':'/de/datenschutz'}>{t.privacy}</a><a href={sr?'/sr/kolacici':'/de/cookies'}>{t.cookies}</a><a href={sr?'/sr/odricanje-odgovornosti':'/de/haftungsausschluss'}>{t.liability}</a></nav>
    </div>
    <div className="site-footer-principles">{t.principles.map(x=><span key={x}>✓ {x}</span>)}</div>
    <div className="site-footer-bottom"><span>© 2026 DaniniHub Transport &amp; Logistics</span><a href={home+'#contact'}>{t.contact} →</a></div>
  </footer>
}