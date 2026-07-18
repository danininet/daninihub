import { useEffect, useState } from 'react'
import PublicLanding from './PublicLanding'
import PilotCheck from './PilotCheck'
import BusinessPages from './BusinessPages'
import ServiceQuickNav from './ServiceQuickNav'
import SiteNavigation from './SiteNavigation'
import SiteFooter from './SiteFooter'
import KnowledgeCenter from './KnowledgeCenter'
import './App.css'

export default function App() {
  const [lang, setLang] = useState(() => location.pathname.startsWith('/sr') ? 'sr' : 'de')

  useEffect(() => {
    const sr = lang === 'sr'
    const path = location.pathname
    const pilot = /pilot-beispiel|primer-pilota/.test(path)
    const operationsDemo = /operations-desk-demo|operativni-pult-demo/.test(path)
    const pilotCheck = /pilot-check|provera-pilota/.test(path)
    const knowledgeCenter = /praxis-wissen|praksa-znanje/.test(path)
    const businessPage = /leistungsrahmen|obim-usluge|continuity-support|kontinuitet-podrska|fahrerkommunikation|komunikacija-vozaci/.test(path)
    const businessTitle = /leistungsrahmen|obim-usluge/.test(path) ? (sr ? 'Obim usluge | DaniniHub' : 'Leistungsrahmen | DaniniHub') : /continuity-support|kontinuitet-podrska/.test(path) ? (sr ? 'Podrška kontinuitetu | DaniniHub' : 'Continuity Support | DaniniHub') : (sr ? 'Komunikacija sa vozačima | DaniniHub' : 'Fahrerkommunikation | DaniniHub')
    document.documentElement.lang = lang
    document.title = knowledgeCenter ? (sr ? 'Praksa i znanje | DaniniHub' : 'Praxis & Wissen | DaniniHub') : businessPage ? businessTitle : pilotCheck ? (sr ? 'Provera pilota | DaniniHub' : 'Pilot-Check | DaniniHub') : operationsDemo ? (sr ? 'Interaktivni operativni pult | DaniniHub' : 'Interaktiver Operations Desk | DaniniHub') : pilot ? (sr ? 'Kako izgleda pilot | DaniniHub' : 'So funktioniert ein Pilot | DaniniHub') : (sr ? 'DaniniHub Transport & Logistics | Balkan–DACH operativna podrška' : 'DaniniHub Transport & Logistics | Balkan–DACH Operations Support')
    document.querySelector('meta[name="description"]')?.setAttribute('content', knowledgeCenter ? (sr ? 'Stručni operativni sadržaji o odstupanjima, ETA, komunikaciji sa vozačima i kontinuitetu Balkan–DACH transporta.' : 'Operative Fachinhalte zu Abweichungen, ETA, Fahrerkommunikation und Kontinuität in Balkan–DACH-Transporten.') : businessPage ? (sr ? 'Jasno ograničena operativna podrška, kontinuitet i višejezička komunikacija za Balkan–DACH transport.' : 'Klar begrenzte operative Unterstützung, Kontinuität und mehrsprachige Kommunikation für Balkan–DACH-Transporte.') : pilotCheck ? (sr ? 'Strukturisana provera da li ograničeni DaniniHub pilot odgovara potrebama transportne firme.' : 'Strukturierte Prüfung, ob ein begrenzter DaniniHub-Pilot zum Bedarf eines Transportunternehmens passt.') : operationsDemo ? (sr ? 'Interaktivna simulacija fiktivne transportne ture sa statusima, ETA, odstupanjem i eskalacijom.' : 'Interaktive Simulation einer fiktiven Transporttour mit Status, ETA, Abweichung und Eskalation.') : pilot ? (sr ? 'Fiktivna simulacija ograničene operativne podrške: status, ETA, odstupanje i dokumentovana eskalacija.' : 'Fiktive Simulation eines begrenzten Operations Supports: Status, ETA, Abweichung und dokumentierte Eskalation.') : (sr ? 'Operativna podrška transportnim firmama između Balkana i DACH regiona: komunikacija, statusi, termini i dokumentacija.' : 'Operative Transport-Unterstützung zwischen Balkan und DACH: Kommunikation, Status, Termine, Dokumente und klar begrenzte Zuständigkeiten.'))
    const canonical = `https://daninihub.com${path}`
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical)
  }, [lang])

  let page
  if (/pilot-check|provera-pilota/.test(location.pathname)) page = <PilotCheck lang={lang}/>
  else if (/praxis-wissen|praksa-znanje/.test(location.pathname)) page = <KnowledgeCenter lang={lang}/>
  else if (/leistungsrahmen|obim-usluge|continuity-support|kontinuitet-podrska|fahrerkommunikation|komunikacija-vozaci/.test(location.pathname)) page = <BusinessPages lang={lang}/>
  else page = <PublicLanding lang={lang} setLang={setLang}/>

  const isHome = /^\/(de|sr)\/?$/.test(location.pathname) || location.pathname === '/'

  return <div className="public-app">
    <SiteNavigation lang={lang}/>
    {page}
    {isHome && <ServiceQuickNav lang={lang}/>} 
    <SiteFooter lang={lang}/>
  </div>
}