import { useEffect, useState } from 'react'
import './SiteNavigation.css'

const links = {
  de: { start:'Start', services:'Leistungen', scope:'Leistungsrahmen', continuity:'Continuity Support', drivers:'Fahrerkommunikation', pilot:'Pilot-Check', knowledge:'Praxis & Wissen', contact:'Kontakt', menu:'Menü', close:'Schließen' },
  sr: { start:'Početna', services:'Usluge', scope:'Obim usluge', continuity:'Podrška kontinuitetu', drivers:'Komunikacija sa vozačima', pilot:'Provera pilota', knowledge:'Praksa i znanje', contact:'Kontakt', menu:'Meni', close:'Zatvori' }
}

export default function SiteNavigation({ lang }) {
  const [open, setOpen] = useState(false)
  const t = links[lang]
  const sr = lang === 'sr'
  const serviceLinks = [
    [t.scope, sr ? '/sr/obim-usluge' : '/de/leistungsrahmen'],
    [t.continuity, sr ? '/sr/kontinuitet-podrska' : '/de/continuity-support'],
    [t.drivers, sr ? '/sr/komunikacija-vozaci' : '/de/fahrerkommunikation']
  ]
  const pilot = sr ? '/sr/provera-pilota' : '/de/pilot-check'
  const knowledge = sr ? '/sr/praksa-znanje' : '/de/praxis-wissen'
  const home = sr ? '/sr/' : '/de/'

  useEffect(() => {
    const onEscape = event => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onEscape)
    document.body.classList.toggle('mobile-nav-open', open)
    return () => {
      document.removeEventListener('keydown', onEscape)
      document.body.classList.remove('mobile-nav-open')
    }
  }, [open])

  const close = () => setOpen(false)

  return <>
    <header className="site-nav">
      <a className="site-nav-brand" href={home} aria-label="DaniniHub">
        <img src="/logo-mark.svg" alt="" width="44" height="44"/>
        <strong>DaniniHub<small>TRANSPORT &amp; LOGISTICS</small></strong>
      </a>

      <nav className="site-nav-desktop" aria-label={sr ? 'Glavna navigacija' : 'Hauptnavigation'}>
        <a href={home}>{t.start}</a>
        <details className="site-nav-dropdown">
          <summary>{t.services}</summary>
          <div>{serviceLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div>
        </details>
        <a href={knowledge}>{t.knowledge}</a>
        <a href={pilot}>{t.pilot}</a>
        <a href={`${home}#contact`}>{t.contact}</a>
      </nav>

      <div className="site-nav-actions">
        <div className="site-nav-langs" aria-label="Language">
          <a className={lang === 'de' ? 'active' : ''} href="/de/">DE</a>
          <a className={lang === 'sr' ? 'active' : ''} href="/sr/">SR</a>
        </div>
        <a className="site-nav-cta" href={pilot}>{t.pilot}</a>
      </div>

      <button className={`site-nav-toggle ${open ? 'is-open' : ''}`} type="button" aria-expanded={open} aria-controls="site-mobile-menu" aria-label={open ? t.close : t.menu} onClick={() => setOpen(value => !value)}>
        <span></span><span></span><span></span>
      </button>
    </header>

    <button className={`site-nav-overlay ${open ? 'is-open' : ''}`} type="button" aria-label={t.close} onClick={close}/>

    <aside id="site-mobile-menu" className={`site-nav-mobile-panel ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="site-nav-mobile-head">
        <strong>{t.menu}</strong>
        <button type="button" onClick={close} aria-label={t.close}>×</button>
      </div>
      <nav aria-label={sr ? 'Mobilna navigacija' : 'Mobile Navigation'}>
        <a href={home} onClick={close}>{t.start}</a>
        <a className="mobile-services-main" href={serviceLinks[0][1]} onClick={close}>{t.services}</a>
        <div className="mobile-services-list">
          {serviceLinks.map(([label, href]) => <a key={href} href={href} onClick={close}>{label}</a>)}
        </div>
        <a href={knowledge} onClick={close}>{t.knowledge}</a>
        <a href={pilot} onClick={close}>{t.pilot}</a>
        <a href={`${home}#contact`} onClick={close}>{t.contact}</a>
      </nav>
      <div className="site-nav-mobile-langs"><a href="/de/">DE</a><a href="/sr/">SR</a></div>
    </aside>
  </>
}