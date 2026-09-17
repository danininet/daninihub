import { useEffect, useState } from 'react'
import './SiteNavigation.css'

const links = {
  de: { start:'Start', people:'Für Menschen', companies:'Für Unternehmen', cases:'Praxisfälle', methods:'Methoden', transport:'Transport-Archiv', location:'Location Launch', calije:'Čalije Case', knowledge:'Praxis & Wissen', dispoLab:'DispoLab', contact:'Opportunity Check', menu:'Menü', close:'Schließen' },
  sr: { start:'Početna', people:'Za ljude', companies:'Za firme', cases:'Praktični slučajevi', methods:'Metode', transport:'Transport arhiva', location:'Location Launch', calije:'Čalije Case', knowledge:'Praksa i znanje', dispoLab:'DispoLab', contact:'Opportunity Check', menu:'Meni', close:'Zatvori' }
}

const routePairs = [
  ['/de/', '/sr/'], ['/de/opportunity-check', '/sr/opportunity-check'], ['/de/location-launch', '/sr/location-launch'], ['/de/externe-disposition', '/sr/eksterna-dispozicija'],
  ['/de/balkan-desk', '/sr/balkan-desk'], ['/de/dach-desk', '/sr/dach-desk'], ['/de/dispolab', '/sr/dispo-lab'],
  ['/de/praxis-wissen', '/sr/praksa-znanje'], ['/de/impressum', '/sr/impressum'], ['/de/datenschutz', '/sr/privatnost']
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
  const home = sr ? '/sr/' : '/de/'
  const opportunity = sr ? 'https://danininet.com/sr/pocni' : 'https://danininet.com/de/start'
  const companyContact = sr ? 'mailto:info@daninihub.com?subject=DaniniHub%20problem%20firme' : 'mailto:info@daninihub.com?subject=DaniniHub%20Firmenproblem'
  const contact = sr ? '/sr/opportunity-check' : '/de/opportunity-check'
  const locationLaunch = sr ? '/sr/location-launch' : '/de/location-launch'
  const calije = sr ? 'https://calije.daninihub.com/sr' : 'https://calije.daninihub.com/de'
  const knowledge = sr ? '/sr/praksa-znanje' : '/de/praxis-wissen'
  const dispoLab = sr ? '/sr/dispo-lab' : '/de/dispolab'
  const transport = sr ? '/sr/eksterna-dispozicija' : '/de/externe-disposition'
  const deHref = translatedPath('de')
  const srHref = translatedPath('sr')

  useEffect(() => {
    const onEscape = event => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onEscape)
    document.body.classList.toggle('mobile-nav-open', open)
    return () => { document.removeEventListener('keydown', onEscape); document.body.classList.remove('mobile-nav-open') }
  }, [open])

  const close = () => setOpen(false)

  return <>
    <header className="site-nav">
      <a className="site-nav-brand" href={home} aria-label="DaniniHub">
        <img src="/logo-mark.svg" alt="" width="52" height="52"/>
        <strong>DaniniHub<small>HUMAN + AI OPPORTUNITY ENGINE</small></strong>
      </a>
      <nav className="site-nav-desktop" aria-label={sr ? 'Glavna navigacija' : 'Hauptnavigation'}>
        <a href={home}>{t.start}</a>
        <a href={opportunity} target="_blank" rel="noreferrer">{t.people}</a>
        <a href={companyContact}>{t.companies}</a>
        <details className="site-nav-dropdown"><summary>{t.cases}</summary><div><a href={calije} target="_blank" rel="noreferrer">{t.calije} ↗</a><a href={locationLaunch}>{t.location}</a><a href={transport}>{t.transport}</a></div></details>
        <details className="site-nav-dropdown"><summary>{t.methods}</summary><div><a href={knowledge}>{t.knowledge}</a><a href={dispoLab}>{t.dispoLab}</a></div></details>
        <a href={contact}>{t.contact}</a>
      </nav>
      <div className="site-nav-actions"><div className="site-nav-langs" aria-label="Language"><a className={lang === 'de' ? 'active' : ''} href={deHref}>DE</a><a className={lang === 'sr' ? 'active' : ''} href={srHref}>SR</a></div><a className="site-nav-cta" href={contact}>{t.contact}</a></div>
      <button className={`site-nav-toggle ${open ? 'is-open' : ''}`} type="button" aria-expanded={open} aria-controls="site-mobile-menu" aria-label={open ? t.close : t.menu} onClick={() => setOpen(value => !value)}><span></span><span></span><span></span></button>
    </header>
    <button className={`site-nav-overlay ${open ? 'is-open' : ''}`} type="button" aria-label={t.close} onClick={close}/>
    <aside id="site-mobile-menu" className={`site-nav-mobile-panel ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="site-nav-mobile-head"><strong>{t.menu}</strong><button type="button" onClick={close} aria-label={t.close}>×</button></div>
      <nav aria-label={sr ? 'Mobilna navigacija' : 'Mobile Navigation'}>
        <a href={home} onClick={close}>{t.start}</a>
        <a href={opportunity} target="_blank" rel="noreferrer" onClick={close}>{t.people}</a>
        <a href={companyContact} onClick={close}>{t.companies}</a>
        <a href={calije} target="_blank" rel="noreferrer" onClick={close}>{t.calije} ↗</a>
        <a href={locationLaunch} onClick={close}>{t.location}</a>
        <a href={knowledge} onClick={close}>{t.knowledge}</a>
        <a href={dispoLab} onClick={close}>{t.dispoLab}</a>
        <a href={transport} onClick={close}>{t.transport}</a>
        <a href={contact} onClick={close}>{t.contact}</a>
      </nav>
      <div className="site-nav-mobile-langs"><a href={deHref}>DE</a><a href={srHref}>SR</a></div>
    </aside>
  </>
}
