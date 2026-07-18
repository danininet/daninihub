import './SiteNavigation.css'

const links = {
  de: {
    services: 'Leistungen',
    scope: 'Leistungsrahmen',
    continuity: 'Continuity Support',
    drivers: 'Fahrerkommunikation',
    pilot: 'Pilot-Check',
    knowledge: 'Praxis & Recht',
    contact: 'Kontakt',
    menu: 'Menü'
  },
  sr: {
    services: 'Usluge',
    scope: 'Obim usluge',
    continuity: 'Podrška kontinuitetu',
    drivers: 'Komunikacija sa vozačima',
    pilot: 'Provera pilota',
    knowledge: 'Procedure i propisi',
    contact: 'Kontakt',
    menu: 'Meni'
  }
}

export default function SiteNavigation({ lang }) {
  const t = links[lang]
  const sr = lang === 'sr'
  const serviceLinks = [
    [t.scope, sr ? '/sr/obim-usluge' : '/de/leistungsrahmen'],
    [t.continuity, sr ? '/sr/kontinuitet-podrska' : '/de/continuity-support'],
    [t.drivers, sr ? '/sr/komunikacija-vozaci' : '/de/fahrerkommunikation']
  ]
  const pilot = sr ? '/sr/provera-pilota' : '/de/pilot-check'
  const knowledge = sr ? '/sr/praksa-propisi' : '/de/praxis-wissen'
  const home = sr ? '/sr/' : '/de/'

  return <header className="site-nav">
    <a className="site-nav-brand" href={home} aria-label="DaniniHub">
      <img src="/logo-mark.svg" alt="" width="44" height="44"/>
      <strong>DaniniHub<small>TRANSPORT &amp; LOGISTICS</small></strong>
    </a>

    <nav className="site-nav-desktop" aria-label={sr ? 'Glavna navigacija' : 'Hauptnavigation'}>
      <details className="site-nav-dropdown">
        <summary>{t.services}</summary>
        <div>{serviceLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div>
      </details>
      <a href={pilot}>{t.pilot}</a>
      <a href={knowledge}>{t.knowledge}</a>
      <a href="#contact">{t.contact}</a>
    </nav>

    <div className="site-nav-actions">
      <div className="site-nav-langs" aria-label="Language">
        <a className={lang === 'de' ? 'active' : ''} href="/de/">DE</a>
        <a className={lang === 'sr' ? 'active' : ''} href="/sr/">SR</a>
      </div>
      <a className="site-nav-cta" href={pilot}>{t.pilot}</a>
    </div>

    <details className="site-nav-mobile">
      <summary>{t.menu}</summary>
      <nav>
        <strong>{t.services}</strong>
        {serviceLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        <a href={pilot}>{t.pilot}</a>
        <a href={knowledge}>{t.knowledge}</a>
        <a href="#contact">{t.contact}</a>
        <div className="site-nav-mobile-langs"><a href="/de/">DE</a><a href="/sr/">SR</a></div>
      </nav>
    </details>
  </header>
}
