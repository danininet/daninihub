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
import LeadLandingPages from './LeadLandingPages'
import './App.css'
import './Polish.css'

const leadMeta = {
  '/de/externe-disposition': ['Externe Disposition für Speditionen | DaniniHub Duisburg', 'Flexible externe Dispositionsunterstützung für Speditionen: Status, ETA, Fahrerkommunikation, Partnerkommunikation und operative Engpässe – aus Duisburg.'],
  '/de/balkan-desk': ['Balkan Desk für DACH-Speditionen | DaniniHub', 'Operative Unterstützung für DACH-Speditionen mit Balkan-Verkehren: Fahrerkommunikation, Status, ETA, CMR/POD und strukturierte Eskalation.'],
  '/de/dach-desk': ['DACH Desk für Balkan-Transportunternehmen | DaniniHub', 'Deutschsprachige operative Schnittstelle in Duisburg für Balkan-Transportunternehmen mit Verkehren nach Deutschland und Österreich.'],
  '/sr/eksterna-dispozicija': ['Eksterna podrška dispoziciji | DaniniHub Duisburg', 'Eksterna operativna podrška transportnim firmama: status, ETA, komunikacija sa vozačima i partnerima i kontrolisane eskalacije.'],
  '/sr/balkan-desk': ['Balkan Desk za DACH špedicije | DaniniHub', 'Operativna podrška DACH špedicijama na Balkan relacijama: vozači, status, ETA, CMR/POD i eskalacije.'],
  '/sr/dach-desk': ['DACH Desk za balkanske prevoznike | DaniniHub', 'Nemačka operativna kontakt tačka iz Duisburga za balkanske transportne firme koje rade Nemačku i Austriju.']
}

const articleCommercialCtas = {
  '/de/praxis-wissen/warum-tms-disponenten-nicht-ersetzen': {
    eyebrow: 'OPERATIVE UNTERSTÜTZUNG',
    title: 'Kostet genau diese operative Lücke Ihrer Disposition regelmäßig Zeit?',
    text: 'DaniniHub kann einen klar abgegrenzten Teil rund um Status, Nachverfolgung, Kommunikation und dokumentierte Übergabe übernehmen.',
    label: 'Externe Disposition ansehen',
    href: '/de/externe-disposition'
  },
  '/de/praxis-wissen/eta-ist-keine-zusage': {
    eyebrow: 'OPERATIVE UNTERSTÜTZUNG',
    title: 'Binden Status, ETA und Rückfragen regelmäßig Zeit in Ihrer Disposition?',
    text: 'DaniniHub unterstützt bei Status- und ETA-Nachverfolgung, klarer Kommunikation und dokumentierten nächsten Schritten.',
    label: 'Externe Disposition ansehen',
    href: '/de/externe-disposition'
  },
  '/de/praxis-wissen/fahrerkommunikation-balkan-dach': {
    eyebrow: 'BALKAN DESK',
    title: 'Bindet die Kommunikation mit Fahrern und Balkan-Partnern regelmäßig Ihre Kern-Disposition?',
    text: 'Der DaniniHub Balkan Desk unterstützt bei Fahrer- und Partnerkommunikation, Status, ETA, Dokumenten und strukturierten Eskalationen.',
    label: 'Balkan Desk ansehen',
    href: '/de/balkan-desk'
  },
  '/de/praxis-wissen/schichtuebergabe-disposition': {
    eyebrow: 'EXTERNE DISPOSITION',
    title: 'Fehlen im Tagesgeschäft Zeit und Kapazität für saubere Nachverfolgung und Übergaben?',
    text: 'DaniniHub kann klar definierte operative Aufgaben übernehmen und offene Punkte arbeitsfähig dokumentieren.',
    label: 'Externe Disposition ansehen',
    href: '/de/externe-disposition'
  },
  '/de/praxis-wissen/abweichungen-eskalieren': {
    eyebrow: 'EXTERNE DISPOSITION',
    title: 'Kosten Abweichungen, Rückfragen und Eskalationen Ihrer Disposition regelmäßig Zeit?',
    text: 'DaniniHub unterstützt bei Faktenprüfung, Nachverfolgung, strukturierter Eskalation und dokumentierter Übergabe – innerhalb klarer Freigabegrenzen.',
    label: 'Externe Disposition ansehen',
    href: '/de/externe-disposition'
  },
  '/de/praxis-wissen/transportdokumente-cmr-pod': {
    eyebrow: 'BALKAN DESK',
    title: 'Binden CMR, POD und offene Nachweise bei Balkan-Verkehren unnötig Dispositionszeit?',
    text: 'Der DaniniHub Balkan Desk unterstützt bei Dokumenten-Nachverfolgung, Status, Fahrerkommunikation und offenen Punkten.',
    label: 'Balkan Desk ansehen',
    href: '/de/balkan-desk'
  },
  '/sr/praksa-znanje/zasto-tms-ne-menja-disponente': {
    eyebrow: 'OPERATIVNA PODRŠKA',
    title: 'Da li upravo ovaj operativni jaz redovno oduzima vreme vašoj dispoziciji?',
    text: 'DaniniHub može preuzeti jasno ograničen deo posla oko statusa, praćenja, komunikacije i dokumentovane predaje.',
    label: 'Pogledaj eksternu dispoziciju',
    href: '/sr/eksterna-dispozicija'
  },
  '/sr/praksa-znanje/eta-nije-obecanje': {
    eyebrow: 'OPERATIVNA PODRŠKA',
    title: 'Da li statusi, ETA i dodatna pitanja redovno vezuju vreme vaše dispozicije?',
    text: 'DaniniHub podržava praćenje statusa i ETA, jasnu komunikaciju i dokumentovanje sledećih koraka.',
    label: 'Pogledaj eksternu dispoziciju',
    href: '/sr/eksterna-dispozicija'
  },
  '/sr/praksa-znanje/komunikacija-sa-vozacima-balkan-dach': {
    eyebrow: 'DACH DESK',
    title: 'Da li komunikacija sa DACH klijentima i partnerima redovno opterećuje vašu dispoziciju?',
    text: 'DaniniHub DACH Desk pomaže balkanskim prevoznicima u nemačkoj operativnoj komunikaciji, statusima, ETA i otvorenim pitanjima.',
    label: 'Pogledaj DACH Desk',
    href: '/sr/dach-desk'
  },
  '/sr/praksa-znanje/predaja-smene-dispozicija': {
    eyebrow: 'EKSTERNA DISPOZICIJA',
    title: 'Nedostaju li vreme i kapacitet za uredno praćenje i predaju otvorenih slučajeva?',
    text: 'DaniniHub može preuzeti jasno definisane operativne zadatke i dokumentovati otvorene tačke tako da se rad nastavlja bez ponovnog prikupljanja podataka.',
    label: 'Pogledaj eksternu dispoziciju',
    href: '/sr/eksterna-dispozicija'
  },
  '/sr/praksa-znanje/eskalacija-odstupanja': {
    eyebrow: 'EKSTERNA DISPOZICIJA',
    title: 'Da li odstupanja, dodatna pitanja i eskalacije redovno oduzimaju vreme dispoziciji?',
    text: 'DaniniHub podržava proveru činjenica, praćenje, strukturisanu eskalaciju i dokumentovanu predaju u jasno definisanim granicama.',
    label: 'Pogledaj eksternu dispoziciju',
    href: '/sr/eksterna-dispozicija'
  },
  '/sr/praksa-znanje/transportna-dokumenta-cmr-pod': {
    eyebrow: 'DACH DESK',
    title: 'Da li CMR, POD i otvoreni dokazi redovno vezuju vreme vaše dispozicije na DACH relacijama?',
    text: 'DaniniHub DACH Desk može pomoći u praćenju dokumentacije, statusa i komunikaciji sa nemačkim i austrijskim partnerima.',
    label: 'Pogledaj DACH Desk',
    href: '/sr/dach-desk'
  }
}

export default function App() {
  const [lang, setLang] = useState(() => location.pathname.startsWith('/sr') ? 'sr' : 'de')
  const path = location.pathname.replace(/\/$/, '') || '/'
  const dispatchWorkspace = /^\/internal\/dispatch-pilot-workspace\/?$/.test(location.pathname)

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
    const meta = leadMeta[path]

    document.documentElement.lang = lang
    document.querySelector('meta[name="robots"]')?.setAttribute('content', 'index,follow,max-image-preview:large')
    document.title = meta?.[0] || (audiencePage ? (sr ? 'Za balkanske transportne firme | DaniniHub' : 'Für DACH-Speditionen | DaniniHub')
      : beforeAfterPage ? (sr ? 'Pre i posle DaniniHuba | Operativni dokaz' : 'Vorher und nachher | DaniniHub Operations')
      : capacityPage ? (sr ? 'Prijavi slobodan kamion ili teret | DaniniHub' : 'Freien Lkw oder Ladung melden | DaniniHub')
      : transportNetwork ? (sr ? 'DaniniHub Transport Network | Kompanijski pilot' : 'DaniniHub Transport Network | Unternehmenspilot')
      : transportRoom ? (sr ? 'DaniniHub Transport Room | Interaktivni pilot MVP' : 'DaniniHub Transport Room | Interaktiver Pilot MVP')
      : freeDispoCheck ? (sr ? 'Besplatni Dispo-Check | DaniniHub' : 'Kostenloser Dispo-Check | DaniniHub')
      : dispoLab ? (sr ? 'DaniniHub DispoLab | Praktični trening' : 'DaniniHub DispoLab | Praxistraining')
      : pilotCheck ? (sr ? 'Provera pilota | DaniniHub' : 'Pilot-Check | DaniniHub')
      : knowledgeCenter ? (sr ? 'Praksa i znanje | DaniniHub' : 'Praxis & Wissen | DaniniHub')
      : businessPage ? (sr ? 'Operativne usluge | DaniniHub' : 'Operative Leistungen | DaniniHub')
      : (sr ? 'DaniniHub DACH Operations Desk' : 'Externe Disposition & Balkan Desk | DaniniHub Duisburg'))

    const description = meta?.[1] || (capacityPage
      ? (sr ? 'Ručna prijava slobodnog kamiona ili tereta koji čeka, bez javne objave i bez automatskog ugovaranja.' : 'Manuelle Meldung eines freien Lkw oder wartender Ladung, ohne öffentliche Veröffentlichung oder automatische Vermittlung.')
      : audiencePage
      ? (sr ? 'Zajednički operativni prostor za balkanske transportne firme i njihove DACH klijente: status, ETA, dokumenti, incidenti i odgovornost.' : 'Gemeinsamer operativer Arbeitsraum für DACH-Auftraggeber und Balkan-Frachtführer: Status, ETA, Dokumente, Incidents und Verantwortung.')
      : beforeAfterPage
        ? (sr ? 'Dva praktična primera: strukturisanje nejasnog statusa i kontrolisano podudaranje slobodnog kamiona sa robom koja čeka.' : 'Zwei Praxisbeispiele: unklare Statusinformation strukturieren und freien Lkw kontrolliert mit wartender Ladung abgleichen.')
        : transportNetwork
          ? (sr ? 'Fiktivni kompanijski prostor sa profilima firmi, članovima tima i više privatnih transportnih soba.' : 'Fiktiver Unternehmensbereich mit Firmenprofilen, Teammitgliedern und mehreren privaten Transport Rooms.')
          : transportRoom
          ? (sr ? 'Interaktivni pilot zajedničke transportne sobe sa statusima, ETA, komunikacijom, dokumentima i incidentima.' : 'Interaktiver Pilot eines gemeinsamen Transport Room mit Status, ETA, Kommunikation, Dokumenten und Incidents.')
          : (sr ? 'DaniniHub operativna podrška i praktični alati za Balkan–DACH transport.' : 'Externe Dispositionsunterstützung und Balkan–DACH Operations Support aus Duisburg.'))

    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    const canonicalPath = location.pathname === '/' ? '/de/' : location.pathname
    const canonical = `https://daninihub.com${canonicalPath}`
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical)

    const pairs = [
      ['/de/','/sr/'],
      ['/de/externe-disposition','/sr/eksterna-dispozicija'],
      ['/de/balkan-desk','/sr/balkan-desk'],
      ['/de/dach-desk','/sr/dach-desk'],
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
      ['/de/praxis-wissen/warum-tms-disponenten-nicht-ersetzen','/sr/praksa-znanje/zasto-tms-ne-menja-disponente'],
      ['/de/praxis-wissen/eta-ist-keine-zusage','/sr/praksa-znanje/eta-nije-obecanje'],
      ['/de/praxis-wissen/fahrerkommunikation-balkan-dach','/sr/praksa-znanje/komunikacija-sa-vozacima-balkan-dach'],
      ['/de/praxis-wissen/schichtuebergabe-disposition','/sr/praksa-znanje/predaja-smene-dispozicija'],
      ['/de/praxis-wissen/abweichungen-eskalieren','/sr/praksa-znanje/eskalacija-odstupanja'],
      ['/de/praxis-wissen/transportdokumente-cmr-pod','/sr/praksa-znanje/transportna-dokumenta-cmr-pod'],
      ['/de/pilot-beispiel','/sr/primer-pilota'],
      ['/de/operations-desk-demo','/sr/operativni-pult-demo'],
      ['/de/impressum','/sr/impressum'],
      ['/de/datenschutz','/sr/privatnost'],
      ['/de/cookies','/sr/kolacici'],
      ['/de/haftungsausschluss','/sr/odricanje-odgovornosti'],
      ['/de/glossar','/sr/recnik']
    ]
    const normalizedPath = location.pathname === '/de' ? '/de/' : location.pathname === '/sr' ? '/sr/' : location.pathname.replace(/\/$/, '')
    const pair = pairs.find(([de, srPath]) => de.replace(/\/$/, '') === normalizedPath.replace(/\/$/, '') || srPath.replace(/\/$/, '') === normalizedPath.replace(/\/$/, '')) || pairs[0]
    document.querySelector('link[hreflang="de"]')?.setAttribute('href', `https://daninihub.com${pair[0]}`)
    document.querySelector('link[hreflang="sr"]')?.setAttribute('href', `https://daninihub.com${pair[1]}`)
    document.querySelector('link[hreflang="x-default"]')?.setAttribute('href', `https://daninihub.com${pair[0]}`)
  }, [dispatchWorkspace, lang, path])

  useEffect(() => {
    const commercial = articleCommercialCtas[path]
    if (!commercial) return

    const cta = document.querySelector('.article-cta')
    if (!cta) return

    const eyebrow = cta.querySelector('span')
    const title = cta.querySelector('h2')
    const link = cta.querySelector('a')
    let text = cta.querySelector('p')

    if (eyebrow) eyebrow.textContent = commercial.eyebrow
    if (title) title.textContent = commercial.title
    if (link) {
      link.textContent = `${commercial.label} →`
      link.setAttribute('href', commercial.href)
    }
    if (text) {
      text.textContent = commercial.text
    } else if (title && commercial.text) {
      text = document.createElement('p')
      text.textContent = commercial.text
      title.insertAdjacentElement('afterend', text)
    }
  }, [path, lang])

  if (dispatchWorkspace) return <DispatchPilotWorkspace/>

  let page
  if (leadMeta[path]) page = <LeadLandingPages lang={lang}/>
  else if (/fuer-dach-speditionen|za-balkanske-transportne-firme/.test(path)) page = <AudiencePages lang={lang}/>
  else if (/vorher-nachher|pre-posle/.test(path)) page = <BeforeAfterPage lang={lang}/>
  else if (/capacity-signal|signal-kapaciteta/.test(path)) page = <CapacitySignalPage lang={lang}/>
  else if (/transport-network-demo|transportna-mreza-demo/.test(path)) page = <TransportNetworkDemo lang={lang}/>
  else if (/transport-room-demo|transportna-soba-demo/.test(path)) page = <TransportRoomDemo lang={lang}/>
  else if (/dispolab\/check|dispo-lab\/provera/.test(path)) page = <DispoCheck lang={lang}/>
  else if (/dispolab|dispo-lab/.test(path)) page = <DispoLabPage lang={lang}/>
  else if (/pilot-check|provera-pilota/.test(path)) page = <PilotCheck lang={lang}/>
  else if (/praxis-wissen|praksa-znanje/.test(path)) page = <KnowledgeCenter lang={lang}/>
  else if (/leistungsrahmen|obim-usluge|continuity-support|kontinuitet-podrska|fahrerkommunikation|komunikacija-vozaci/.test(path)) page = <BusinessPages lang={lang}/>
  else if (/^\/de\/?$/.test(location.pathname) || location.pathname === '/') page = <GermanB2BLanding/>
  else if (/^\/sr\/?$/.test(location.pathname)) page = <SerbianB2BLanding/>
  else page = <PublicLanding lang={lang} setLang={setLang}/>

  const isHome = /^\/(de|sr)\/?$/.test(location.pathname) || location.pathname === '/'
  return <div className="public-app"><SiteNavigation lang={lang}/>{page}{isHome && <ServiceQuickNav lang={lang}/>}<SiteFooter lang={lang}/></div>
}
