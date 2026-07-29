import { useEffect, useState } from 'react'
import './SiteNavigation.css'

const links = {
  de: { start:'Start', services:'Leistungen', dispoLab:'DispoLab', dach:'Für DACH-Speditionen', balkan:'Für Balkan-Transportunternehmen', scope:'Leistungsrahmen', continuity:'Continuity Support', drivers:'Fahrerkommunikation', pilot:'Pilot-Check', knowledge:'Praxis & Wissen', contact:'Kontakt', menu:'Menü', close:'Schließen' },
  sr: { start:'Početna', services:'Usluge', dispoLab:'DispoLab', dach:'Za DACH špedicije', balkan:'Za balkanske transportne firme', scope:'Obim usluge', continuity:'Podrška kontinuitetu', drivers:'Komunikacija sa vozačima', pilot:'Provera pilota', knowledge:'Praksa i znanje', contact:'Kontakt', menu:'Meni', close:'Zatvori' }
}

const routePairs = [
  ['/de/', '/sr/'],
  ['/de/fuer-dach-speditionen', '/sr/za-balkanske-transportne-firme'],
  ['/de/dispolab', '/sr/dispo-lab'],
  ['/de/transport-network-demo', '/sr/transportna-mreza-demo'],
  ['/de/transport-room-demo', '/sr/transportna-soba-demo'],
  ['/de/leistungsrahmen', '/sr/obim-usluge'],
  ['/de/continuity-support', '/sr/kontinuitet-podrska'],
  ['/de/fahrerkommunikation', '/sr/komunikacija-vozaci'],
  ['/de/pilot-check', '/sr/provera-pilota'],
  ['/de/praxis-wissen', '/sr/praksa-znanje'],
  ['/de/praxis-wissen/warum-tms-disponenten-nicht-ersetzen', '/sr/praksa-znanje/zasto-tms-ne-menja-disponente'],
  ['/de/praxis-wissen/eta-ist-keine-zusage', '/sr/praksa-znanje/eta-nije-obecanje'],
  ['/de/praxis-wissen/fahrerkommunikation-balkan-dach', '/sr/praksa-znanje/komunikacija-sa-vozacima-balkan-dach'],
  ['/de/praxis-wissen/schichtuebergabe-disposition', '/sr/praksa-znanje/predaja-smene-dispozicija'],
  ['/de/praxis-wissen/abweichungen-eskalieren', '/sr/praksa-znanje/eskalacija-odstupanja'],
  ['/de/praxis-wissen/transportdokumente-cmr-pod', '/sr/praksa-znanje/transportna-dokumenta-cmr-pod'],
  ['/de/pilot-beispiel', '/sr/primer-pilota'],
  ['/de/operations-desk-demo', '/sr/operativni-pult-demo'],
  ['/de/impressum', '/sr/impressum'],
  ['/de/datenschutz', '/sr/privatnost'],
  ['/de/cookies', '/sr/kolacici'],
  ['/de/haftungsausschluss', '/sr/odricanje-odgovornosti'],
  ['/de/glossar', '/sr/recnik']
]

function translatedPath(targetLang) {
  const current = location.pathname.replace(/\/$/, '') || '/'
  for (const [de, sr] of routePairs) {
    const dePath = de.replace(/\/$/, '') || '/'
    const srPath = sr.replace(/\/$/, '') || '/'
    if (current === dePath || current === srPath) {
      const target = targetLang === 'sr' ? sr : de
      return `${target}${location.search}${location.hash}`
    }
  }
  return targetLang === 'sr' ? '/sr/' : '/de/'
}

export default function SiteNavigation({ lang }) {
  const [open, setOpen] = useState(false)
  const t = links[lang]
  const sr = lang === 'sr'
  const audience = sr ? '/sr/za-balkanske-transportne-firme' : '/de/fuer-dach-speditionen'
  const serviceLinks = [
    [sr ? t.balkan : t.dach, audience],
    [t.scope, sr ? '/sr/obim-usluge' : '/de/leistungsrahmen'],
    [t.continuity, sr ? '/sr/kontinuitet-podrska' : '/de/continuity-support'],
    [t.drivers, sr ? '/sr/komunikacija-vozaci' : '/de/fahrerkommunikation']
  ]
  const dispoLab = sr ? '/sr/dispo-lab' : '/de/dispolab'
  const pilot = sr ? '/sr/provera-pilota' : '/de/pilot-check'
  const knowledge = sr ? '/sr/praksa-znanje' : '/de/praxis-wissen'
  const home = sr ? '/sr/' : '/de/'
  const deHref = translatedPath('de')
  const srHref = translatedPath('sr')

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
        <img src="/logo-mark.svg" alt="" width="52" height="52"/>
        <strong>DaniniHub<small>TRANSPORT &amp; LOGISTICS</small></strong>
      </a>
      <nav className="site-nav-desktop" aria-label={sr ? 'Glavna navigacija' : 'Hauptnavigation'}>
        <a href={home}>{t.start}</a>
        <a href={dispoLab}>{t.dispoLab}</a>
        <details className="site-nav-dropdown"><summary>{t.services}</summary><div>{serviceLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div></details>
        <a href={knowledge}>{t.knowledge}</a>
        <a href={pilot}>{t.pilot}</a>
        <a href={`${home}#contact`}>{t.contact}</a>
      </nav>
      <div className="site-nav-actions"><div className="site-nav-langs" aria-label="Language"><a className={lang === 'de' ? 'active' : ''} href={deHref}>DE</a><a className={lang === 'sr' ? 'active' : ''} href={srHref}>SR</a></div><a className="site-nav-cta" href={audience}>{sr?t.balkan:t.dach}</a></div>
      <button className={`site-nav-toggle ${open ? 'is-open' : ''}`} type="button" aria-expanded={open} aria-controls="site-mobile-menu" aria-label={open ? t.close : t.menu} onClick={() => setOpen(value => !value)}><span></span><span></span><span></span></button>
    </header>
    <button className={`site-nav-overlay ${open ? 'is-open' : ''}`} type="button" aria-label={t.close} onClick={close}/>
    <aside id="site-mobile-menu" className={`site-nav-mobile-panel ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="site-nav-mobile-head"><strong>{t.menu}</strong><button type="button" onClick={close} aria-label={t.close}>×</button></div>
      <nav aria-label={sr ? 'Mobilna navigacija' : 'Mobile Navigation'}>
        <a href={home} onClick={close}>{t.start}</a><a href={dispoLab} onClick={close}>{t.dispoLab}</a><a className="mobile-services-main" href={audience} onClick={close}>{t.services}</a><div className="mobile-services-list">{serviceLinks.map(([label, href]) => <a key={href} href={href} onClick={close}>{label}</a>)}</div><a href={knowledge} onClick={close}>{t.knowledge}</a><a href={pilot} onClick={close}>{t.pilot}</a><a href={`${home}#contact`} onClick={close}>{t.contact}</a>
      </nav>
      <div className="site-nav-mobile-langs"><a href={deHref}>DE</a><a href={srHref}>SR</a></div>
    </aside>
  </>
}
