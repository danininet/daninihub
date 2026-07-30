import { useEffect, useState } from 'react'
import PublicLanding from './PublicLanding'
import GermanB2BLanding from './GermanB2BLanding'
import SerbianB2BLanding from './SerbianB2BLanding'
import DispatchPilotWorkspace from './DispatchPilotWorkspaceV5'
import PilotCheck from './PilotCheck'
import BusinessPages from './BusinessPages'
import AudiencePages from './AudiencePages'
import BeforeAfterPage from './BeforeAfterPage'
import CapacitySignalPage from './CapacitySignalPage'
import DispoLabPage from './DispoLabPage'
import DispoCheck from './DispoCheck'
import TransportRoomDemo from './TransportRoomDemo'
import TransportNetworkDemo from './TransportNetworkDemo'
import ServiceQuickNav from './ServiceQuickNav'
import SiteNavigation from './SiteNavigation'
import SiteFooter from './SiteFooter'
import KnowledgeCenter from './KnowledgeCenter'
import './App.css'
import './Polish.css'

export default function App() {
  const [lang, setLang] = useState(() => location.pathname.startsWith('/sr') ? 'sr' : 'de')
  const path = location.pathname
  const dispatchWorkspace = /^\/internal\/dispatch-pilot-workspace\/?$/.test(path)

  useEffect(() => {
    if (dispatchWorkspace) {
      const dispatchLang = new URLSearchParams(location.search).get('lang') === 'de' ? 'de' : 'sr'
      document.documentElement.lang = dispatchLang
      document.title = 'DaniniHub Dispatch Pilot Workspace'
      document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex,nofollow')
      return
    }
    const sr = lang === 'sr'
    const audiencePage = /fuer-dach-speditionen|za-balkanske-transportne-firme/.test(path)
    const beforeAfterPage = /vorher-nachher|pre-posle/.test(path)
    const capacityPage = /capacity-signal|signal-kapaciteta/.test(path)
    const transportNetwork = /transport-network-demo|transportna-mreza-demo/.test(path)
    const transportRoom = /transport-room-demo|transportna-soba-demo/.test(path)
    const freeDispoCheck = /dispolab\/check|dispo-lab\/provera/.test(path)
    const dispoLab = /dispolab|dispo-lab/.test(path)
    const pilotCheck = /pilot-check|provera-pilota/.test(path)
    const knowledgeCenter = /praxis-wissen|praksa-znanje/.test(path)
    const businessPage = /leistungsrahmen|obim-usluge|continuity-support|kontinuitet-podrska|fahrerkommunikation|komunikacija-vozaci/.test(path)
    document.documentElement.lang = lang
    document.querySelector('meta[name="robots"]')?.setAttribute('content', 'index,follow')
    document.title = audiencePage ? (sr ? 'Za balkanske transportne firme | DaniniHub' : 'Für DACH-Speditionen | DaniniHub')
      : beforeAfterPage ? (sr ? 'Pre i posle DaniniHuba | Operativni dokaz' : 'Vorher und nachher | DaniniHub Operations')
      : capacityPage ? (sr ? 'Prijavi slobodan kamion ili teret | DaniniHub' : 'Freien Lkw oder Ladung melden | DaniniHub')
      : transportNetwork ? (sr ? 'DaniniHub Transport Network | Kompanijski pilot' : 'DaniniHub Transport Network | Unternehmenspilot')
      : transportRoom ? (sr ? 'DaniniHub Transport Room | Interaktivni pilot MVP' : 'DaniniHub Transport Room | Interaktiver Pilot MVP')
      : freeDispoCheck ? (sr ? 'Besplatni Dispo-Check | DaniniHub' : 'Kostenloser Dispo-Check | DaniniHub')
      : dispoLab ? (sr ? 'DaniniHub DispoLab | Praktični trening' : 'DaniniHub DispoLab | Praxistraining')
      : pilotCheck ? (sr ? 'Provera pilota | DaniniHub' : 'Pilot-Check | DaniniHub')
      : knowledgeCenter ? (sr ? 'Praksa i znanje | DaniniHub' : 'Praxis & Wissen | DaniniHub')
      : businessPage ? (sr ? 'Operativne usluge | DaniniHub' : 'Operative Leistungen | DaniniHub')
      : (sr ? 'DaniniHub DACH Operations Desk' : 'DaniniHub Balkan Continuity Support')
    const description = capacityPage
      ? (sr ? 'Ručna prijava slobodnog kamiona ili tereta koji čeka, bez javne objave i bez automatskog ugovaranja.' : 'Manuelle Meldung eines freien Lkw oder wartender Ladung, ohne öffentliche Veröffentlichung oder automatische Vermittlung.')
      : audiencePage
      ? (sr ? 'Zajednički operativni prostor za balkanske transportne firme i njihove DACH klijente: status, ETA, dokumenti, incidenti i odgovornost.' : 'Gemeinsamer operativer Arbeitsraum für DACH-Auftraggeber und Balkan-Frachtführer: Status, ETA, Dokumente, Incidents und Verantwortung.')
      : beforeAfterPage
        ? (sr ? 'Dva praktična primera: strukturisanje nejasnog statusa i kontrolisano podudaranje slobodnog kamiona sa robom koja čeka.' : 'Zwei Praxisbeispiele: unklare Statusinformation strukturieren und freien Lkw kontrolliert mit wartender Ladung abgleichen.')
        : transportNetwork
          ? (sr ? 'Fiktivni kompanijski prostor sa profilima firmi, članovima tima i više privatnih transportnih soba.' : 'Fiktiver Unternehmensbereich mit Firmenprofilen, Teammitgliedern und mehreren privaten Transport Rooms.')
          : transportRoom
          ? (sr ? 'Interaktivni pilot zajedničke transportne sobe sa statusima, ETA, komunikacijom, dokumentima i incidentima.' : 'Interaktiver Pilot eines gemeinsamen Transport Room mit Status, ETA, Kommunikation, Dokumenten und Incidents.')
          : (sr ? 'DaniniHub operativna podrška i praktični alati za Balkan–DACH transport.' : 'DaniniHub operative Unterstützung und Praxiswerkzeuge für Balkan–DACH Transporte.')
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    const canonical = `https://daninihub.com${path}`
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:url"]')?.setAttribute('href', canonical)
    const pairs = [
      ['/de/','/sr/'],
      ['/de/fuer-dach-speditionen','/sr/za-balkanske-transportne-firme'],
      ['/de/vorher-nachher','/sr/pre-posle'],
      ['/de/capacity-signal','/sr/signal-kapaciteta'],
      ['/de/transport-network-demo','/sr/transportna-mreza-demo'],
      ['/de/transport-room-demo','/sr/transportna-soba-demo'],
      ['/de/dispolab','/sr/dispo-lab'],
      ['/de/dispolab/check','/sr/dispo-lab/provera'],
      ['/de/leistungsrahmen','/sr/obim-usluge'],
      ['/de/continuity-support','/sr/kontinuitet-podrska'],
      ['/de/fahrerkommunikation','/sr/komunikacija-vozaci'],
      ['/de/pilot-check','/sr/provera-pilota'],
      ['/de/praxis-wissen','/sr/praksa-znanje'],
      ['/de/pilot-beispiel','/sr/primer-pilota'],
      ['/de/operations-desk-demo','/sr/operativni-pult-demo'],
      ['/de/impressum','/sr/impressum'],
      ['/de/datenschutz','/sr/privatnost'],
      ['/de/cookies','/sr/kolacici'],
      ['/de/haftungsausschluss','/sr/odricanje-odgovornosti'],
      ['/de/glossar','/sr/recnik']
    ]
    const normalizedPath = path === '/de' ? '/de/' : path === '/sr' ? '/sr/' : path
    const pair = pairs.find(([de, srPath]) => de === normalizedPath || srPath === normalizedPath) || pairs[0]
    document.querySelector('link[hreflang="de"]')?.setAttribute('href', `https://daninihub.com${pair[0]}`)
    document.querySelector('link[hreflang="sr"]')?.setAttribute('href', `https://daninihub.com${pair[1]}`)
    document.querySelector('link[hreflang="x-default"]')?.setAttribute('href', `https://daninihub.com${pair[0]}`)
  }, [dispatchWorkspace, lang, path])

  if (dispatchWorkspace) return <DispatchPilotWorkspace/>

  let page
  if (/fuer-dach-speditionen|za-balkanske-transportne-firme/.test(path)) page = <AudiencePages lang={lang}/>
  else if (/vorher-nachher|pre-posle/.test(path)) page = <BeforeAfterPage lang={lang}/>
  else if (/capacity-signal|signal-kapaciteta/.test(path)) page = <CapacitySignalPage lang={lang}/>
  else if (/transport-network-demo|transportna-mreza-demo/.test(path)) page = <TransportNetworkDemo lang={lang}/>
  else if (/transport-room-demo|transportna-soba-demo/.test(path)) page = <TransportRoomDemo lang={lang}/>
  else if (/dispolab\/check|dispo-lab\/provera/.test(path)) page = <DispoCheck lang={lang}/>
  else if (/dispolab|dispo-lab/.test(path)) page = <DispoLabPage lang={lang}/>
  else if (/pilot-check|provera-pilota/.test(path)) page = <PilotCheck lang={lang}/>
  else if (/praxis-wissen|praksa-znanje/.test(path)) page = <KnowledgeCenter lang={lang}/>
  else if (/leistungsrahmen|obim-usluge|continuity-support|kontinuitet-podrska|fahrerkommunikation|komunikacija-vozaci/.test(path)) page = <BusinessPages lang={lang}/>
  else if (/^\/de\/?$/.test(path) || path === '/') page = <GermanB2BLanding/>
  else if (/^\/sr\/?$/.test(path)) page = <SerbianB2BLanding/>
  else page = <PublicLanding lang={lang} setLang={setLang}/>

  const isHome = /^\/(de|sr)\/?$/.test(path) || path === '/'
  return <div className="public-app"><SiteNavigation lang={lang}/>{page}{isHome && <ServiceQuickNav lang={lang}/>}<SiteFooter lang={lang}/></div>
}
