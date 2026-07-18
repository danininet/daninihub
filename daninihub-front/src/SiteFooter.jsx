import './SiteFooter.css'

const copy = {
  de: {
    about: 'Operative Unterstützung für Balkan–DACH: Status, Fahrerkommunikation und dokumentierte Übergaben.',
    services: 'Leistungen',
    knowledge: 'Praxis & Wissen',
    legal: 'Rechtliches',
    scope: 'Leistungsrahmen',
    continuity: 'Continuity Support',
    drivers: 'Fahrerkommunikation',
    pilot: 'Pilot-Check',
    practice: 'Fachartikel',
    dispatch: 'TMS & Disposition',
    eta: 'ETA & Status',
    driver: 'Fahrerkommunikation',
    handover: 'Schichtübergabe',
    escalation: 'Abweichung & Eskalation',
    documents: 'CMR, POD & Nachweise',
    law: 'Transport-Glossar',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    cookies: 'Cookies',
    liability: 'Haftungsausschluss',
    contact: 'Kontakt',
  },
  sr: {
    about: 'Operativna podrška za Balkan–DACH: statusi, komunikacija sa vozačima i dokumentovana predaja.',
    services: 'Usluge',
    knowledge: 'Praksa i znanje',
    legal: 'Pravne informacije',
    scope: 'Obim usluge',
    continuity: 'Podrška kontinuitetu',
    drivers: 'Komunikacija sa vozačima',
    pilot: 'Provera pilota',
    practice: 'Stručni članci',
    dispatch: 'TMS i dispozicija',
    eta: 'ETA i status',
    driver: 'Komunikacija sa vozačima',
    handover: 'Predaja smene',
    escalation: 'Odstupanje i eskalacija',
    documents: 'CMR, POD i dokazi',
    law: 'Transportni rečnik',
    imprint: 'Impresum',
    privacy: 'Privatnost',
    cookies: 'Kolačići',
    liability: 'Odricanje odgovornosti',
    contact: 'Kontakt',
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
          <a href={sr ? '/sr/praksa-znanje/zasto-tms-ne-menja-disponente' : '/de/praxis-wissen/warum-tms-disponenten-nicht-ersetzen'}>{t.dispatch}</a>
          <a href={sr ? '/sr/praksa-znanje/eta-nije-obecanje' : '/de/praxis-wissen/eta-ist-keine-zusage'}>{t.eta}</a>
          <a href={sr ? '/sr/praksa-znanje/komunikacija-sa-vozacima-balkan-dach' : '/de/praxis-wissen/fahrerkommunikation-balkan-dach'}>{t.driver}</a>
          <a href={sr ? '/sr/praksa-znanje/predaja-smene-dispozicija' : '/de/praxis-wissen/schichtuebergabe-disposition'}>{t.handover}</a>
          <a href={sr ? '/sr/praksa-znanje/eskalacija-odstupanja' : '/de/praxis-wissen/abweichungen-eskalieren'}>{t.escalation}</a>
          <a href={sr ? '/sr/praksa-znanje/transportna-dokumenta-cmr-pod' : '/de/praxis-wissen/transportdokumente-cmr-pod'}>{t.documents}</a>
          <a href={sr ? '/sr/recnik' : '/de/glossar'}>{t.law}</a>
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
        <span>DE · SR</span>
      </div>
    </footer>
  )
}
