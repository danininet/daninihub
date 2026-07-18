import './SiteFooter.css'

const copy = {
  de: {
    about: 'Klar begrenzte operative Unterstützung für Balkan–DACH-Transporte. Kommunikation, Status, Übergaben und dokumentierte Eskalation – ohne Übernahme der finalen Disposition.',
    services: 'Leistungen',
    knowledge: 'Praxis & Wissen',
    legal: 'Rechtliches',
    scope: 'Leistungsrahmen',
    continuity: 'Continuity Support',
    drivers: 'Fahrerkommunikation',
    pilot: 'Pilot-Check',
    practice: 'Fachartikel',
    dispatch: 'Für Disponenten',
    driver: 'Für Fahrer',
    law: 'Gesetze & Vorschriften',
    updates: 'Regeländerungen',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    cookies: 'Cookies',
    liability: 'Haftungsausschluss',
    contact: 'Kontakt',
    note: 'Keine autonome Disposition · keine Preisentscheidung · menschliche Freigabe',
  },
  sr: {
    about: 'Jasno ograničena operativna podrška za Balkan–DACH transport. Komunikacija, statusi, predaja i dokumentovana eskalacija – bez preuzimanja konačne dispozicije.',
    services: 'Usluge',
    knowledge: 'Praksa i znanje',
    legal: 'Pravne informacije',
    scope: 'Obim usluge',
    continuity: 'Podrška kontinuitetu',
    drivers: 'Komunikacija sa vozačima',
    pilot: 'Provera pilota',
    practice: 'Stručni članci',
    dispatch: 'Za disponente',
    driver: 'Za vozače',
    law: 'Zakoni i propisi',
    updates: 'Promene pravila',
    imprint: 'Impresum',
    privacy: 'Privatnost',
    cookies: 'Kolačići',
    liability: 'Odricanje odgovornosti',
    contact: 'Kontakt',
    note: 'Bez autonomne dispozicije · bez odluka o cenama · ljudsko odobrenje',
  },
}

export default function SiteFooter({ lang }) {
  const t = copy[lang]
  const sr = lang === 'sr'
  const home = sr ? '/sr/' : '/de/'

  return (
    <footer className="site-footer-pro">
      <div className="footer-rule" />
      <div className="site-footer-grid">
        <section className="site-footer-brand">
          <a className="site-footer-logo" href={home}>
            <img src="/logo-mark.svg" alt="" />
            <span>
              <strong>DaniniHub</strong>
              <small>TRANSPORT &amp; LOGISTICS</small>
            </span>
          </a>
          <p>{t.about}</p>
          <div className="footer-contact">
            <a href="mailto:info@daninihub.com">info@daninihub.com</a>
            <a href="tel:+4915730916621">+49 1573 0916621</a>
            <span>Duisburg · Deutschland</span>
          </div>
        </section>

        <nav>
          <h2>{t.services}</h2>
          <a href={sr ? '/sr/obim-usluge' : '/de/leistungsrahmen'}>{t.scope}</a>
          <a href={sr ? '/sr/kontinuitet-podrska' : '/de/continuity-support'}>{t.continuity}</a>
          <a href={sr ? '/sr/komunikacija-vozaci' : '/de/fahrerkommunikation'}>{t.drivers}</a>
          <a href={sr ? '/sr/provera-pilota' : '/de/pilot-check'}>{t.pilot}</a>
        </nav>

        <nav>
          <h2>{t.knowledge}</h2>
          <a href={sr ? '/sr/praksa-znanje' : '/de/praxis-wissen'}>{t.practice}</a>
          <a href={`${sr ? '/sr/praksa-znanje' : '/de/praxis-wissen'}#dispatch`}>{t.dispatch}</a>
          <a href={`${sr ? '/sr/praksa-znanje' : '/de/praxis-wissen'}#drivers`}>{t.driver}</a>
          <a href={`${sr ? '/sr/praksa-znanje' : '/de/praxis-wissen'}#law`}>{t.law}</a>
          <a href={`${sr ? '/sr/praksa-znanje' : '/de/praxis-wissen'}#updates`}>{t.updates}</a>
        </nav>

        <nav>
          <h2>{t.legal}</h2>
          <a href={sr ? '/sr/impressum' : '/de/impressum'}>{t.imprint}</a>
          <a href={sr ? '/sr/privatnost' : '/de/datenschutz'}>{t.privacy}</a>
          <a href={sr ? '/sr/kolacici' : '/de/cookies'}>{t.cookies}</a>
          <a href={sr ? '/sr/odricanje-odgovornosti' : '/de/haftungsausschluss'}>{t.liability}</a>
          <a href={`${home}#contact`}>{t.contact}</a>
        </nav>
      </div>

      <div className="footer-meta">
        <span>© 2026 DaniniHub</span>
        <span>{t.note}</span>
        <span>DE · SR</span>
      </div>
    </footer>
  )
}
