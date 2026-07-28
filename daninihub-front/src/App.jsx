import { useEffect, useState } from 'react'
import PublicLanding from './PublicLanding'
import GermanB2BLanding from './GermanB2BLanding'
import SerbianB2BLanding from './SerbianB2BLanding'
import DispatchPilotWorkspace from './DispatchPilotWorkspaceV5'
import PilotCheck from './PilotCheck'
import BusinessPages from './BusinessPages'
import DispoLabPage from './DispoLabPage'
import DispoCheck from './DispoCheck'
import TransportRoomDemo from './TransportRoomDemo'
import ServiceQuickNav from './ServiceQuickNav'
import SiteNavigation from './SiteNavigation'
import SiteFooter from './SiteFooter'
import KnowledgeCenter from './KnowledgeCenter'
import './App.css'
import './Polish.css'

export default function App() {
  const [lang, setLang] = useState(() => location.pathname.startsWith('/sr') ? 'sr' : 'de')
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
    const path = location.pathname
    const transportRoom = /transport-room-demo|transportna-soba-demo/.test(path)
    const freeDispoCheck = /dispolab\/check|dispo-lab\/provera/.test(path)
    const dispoLab = /dispolab|dispo-lab/.test(path)
    const pilot = /pilot-beispiel|primer-pilota/.test(path)
    const operationsDemo = /operations-desk-demo|operativni-pult-demo/.test(path)
    const pilotCheck = /pilot-check|provera-pilota/.test(path)
    const knowledgeCenter = /praxis-wissen|praksa-znanje/.test(path)
    const knowledgeArticle = /warum-tms-disponenten-nicht-ersetzen|zasto-tms-ne-menja-disponente/.test(path)
    const etaArticle = /eta-ist-keine-zusage|eta-nije-obecanje/.test(path)
    const driverArticle = /fahrerkommunikation-balkan-dach|komunikacija-sa-vozacima-balkan-dach/.test(path)
    const handoverArticle = /schichtuebergabe-disposition|predaja-smene-dispozicija/.test(path)
    const escalationArticle = /abweichungen-eskalieren|eskalacija-odstupanja/.test(path)
    const documentsArticle = /transportdokumente-cmr-pod|transportna-dokumenta-cmr-pod/.test(path)
    const businessPage = /leistungsrahmen|obim-usluge|continuity-support|kontinuitet-podrska|fahrerkommunikation|komunikacija-vozaci/.test(path)
    const contentTitle = /impressum/.test(path) ? (sr ? 'Impresum | DaniniHub Transport & Logistics' : 'Impressum | DaniniHub Transport & Logistics') : /datenschutz|privatnost/.test(path) ? (sr ? 'Zaštita podataka | DaniniHub' : 'Datenschutzerklärung | DaniniHub') : /cookies|kolacici/.test(path) ? (sr ? 'Kolačići i spoljni sadržaji | DaniniHub' : 'Cookies und externe Inhalte | DaniniHub') : /haftungsausschluss|odricanje-odgovornosti/.test(path) ? (sr ? 'Odricanje odgovornosti | DaniniHub' : 'Haftungsausschluss | DaniniHub') : /glossar|recnik/.test(path) ? (sr ? 'Nemačko-srpski rečnik transporta | DaniniHub' : 'Transport-Glossar Deutsch–Serbisch | DaniniHub') : null
    const businessTitle = /leistungsrahmen|obim-usluge/.test(path) ? (sr ? 'Obim usluge | DaniniHub' : 'Leistungsrahmen | DaniniHub') : /continuity-support|kontinuitet-podrska/.test(path) ? (sr ? 'Podrška kontinuitetu | DaniniHub' : 'Continuity Support | DaniniHub') : (sr ? 'Komunikacija sa vozačima | DaniniHub' : 'Fahrerkommunikation | DaniniHub')
    document.documentElement.lang = lang
    document.title = contentTitle || (transportRoom ? (sr ? 'DaniniHub Transport Room | Interaktivni pilot MVP' : 'DaniniHub Transport Room | Interaktiver Pilot MVP') : freeDispoCheck ? (sr ? 'Besplatni Dispo-Check | DaniniHub' : 'Kostenloser Dispo-Check | DaniniHub') : dispoLab ? (sr ? 'DaniniHub DispoLab | Praktični trening za disponente' : 'DaniniHub DispoLab | Praxistraining für Disponenten') : documentsArticle ? (sr ? 'Transportna dokumenta: CMR, POD i otvoreni dokazi | DaniniHub' : 'Transportdokumente: CMR, POD und offene Nachweise | DaniniHub') : escalationArticle ? (sr ? 'Eskalacija odstupanja: pragovi i odgovornost | DaniniHub' : 'Transportabweichungen eskalieren: Schwellen und Verantwortung | DaniniHub') : handoverArticle ? (sr ? 'Predaja smene u dispoziciji: 10 obaveznih informacija | DaniniHub' : 'Schichtübergabe Disposition: 10 Pflichtinformationen | DaniniHub') : driverArticle ? (sr ? 'Balkan–DACH komunikacija sa vozačima: gde greške stvaraju troškove | DaniniHub' : 'Fahrerkommunikation Balkan–DACH: Wo Informationsfehler Kosten verursachen | DaniniHub') : etaArticle ? (sr ? 'ETA nije obećanje: pravilna komunikacija statusa | DaniniHub' : 'ETA ist keine Zusage: Transportstatus richtig kommunizieren | DaniniHub') : knowledgeArticle ? (sr ? 'Zašto TMS sistemi ne menjaju disponente | DaniniHub' : 'Warum TMS-Systeme Disponenten nicht ersetzen | DaniniHub') : knowledgeCenter ? (sr ? 'Praksa i znanje | DaniniHub' : 'Praxis & Wissen | DaniniHub') : businessPage ? businessTitle : pilotCheck ? (sr ? 'Provera pilota | DaniniHub' : 'Pilot-Check | DaniniHub') : operationsDemo ? (sr ? 'Interaktivni operativni pult | DaniniHub' : 'Interaktiver Operations Desk | DaniniHub') : pilot ? (sr ? 'Kako izgleda pilot | DaniniHub' : 'So funktioniert ein Pilot | DaniniHub') : (sr ? 'DaniniHub DACH Operations Desk | Operativna podrška za transportne firme' : 'DaniniHub Balkan Continuity Support | Balkan–DACH Transport Operations'))
    const description = transportRoom ? (sr ? 'Interaktivni pilot prototip zajedničke transportne sobe sa statusima, ETA, komunikacijom, dokumentima, incidentima i završnim izveštajem.' : 'Interaktiver Pilot-Prototyp eines gemeinsamen Transport Room mit Status, ETA, Kommunikation, Dokumenten, Incidents und Abschlussbericht.') : freeDispoCheck ? (sr ? 'Besplatna interaktivna provera kroz tri simulirana transportna slučaja: ETA, CMR i predaja smene.' : 'Kostenloser interaktiver Praxischeck mit drei simulierten Transportfällen zu ETA, CMR und Schichtübergabe.') : dispoLab ? (sr ? 'Interaktivne Balkan–DACH simulacije za procenu operativnog razmišljanja, komunikacije, rizika, dokumentovanja i eskalacije disponenta.' : 'Interaktive Balkan–DACH-Fallsimulationen für operatives Denken, Kommunikation, Risiko, Dokumentation und Eskalation in der Disposition.') : documentsArticle ? (sr ? 'Praktičan vodič za status, proveru, bezbednu predaju i praćenje CMR-a, POD-a i otvorenih transportnih dokaza.' : 'Praxisleitfaden für Status, Prüfung, sichere Übergabe und Nachverfolgung von CMR, POD und offenen Transportnachweisen.') : escalationArticle ? (sr ? 'Operativni vodič za merljive pragove eskalacije, odgovornu ulogu, potrebnu odluku, rok i dokumentovan sledeći korak.' : 'Operativer Leitfaden für messbare Eskalationsschwellen, verantwortliche Rollen, Entscheidungsbedarf, Frist und dokumentierten nächsten Schritt.') : handoverArticle ? (sr ? 'Deset obaveznih informacija za pouzdanu predaju smene, otvorene odluke, odgovornost, eskalaciju i sledeću proveru.' : 'Zehn Pflichtinformationen für eine belastbare Schichtübergabe mit offenen Entscheidungen, Verantwortung, Eskalation und nächster Prüfung.') : driverArticle ? (sr ? 'Praktičan standard za jasnu, bezbednu i dokumentovanu komunikaciju sa vozačima na Balkan–DACH transportnim relacijama.' : 'Praxisstandard für eindeutige, sichere und dokumentierte Fahrerkommunikation auf Balkan–DACH-Transportrelationen.') : etaArticle ? (sr ? 'Kako jasno razdvojiti planirani termin, operativnu ETA, termin potvrđen klijentu i sledeću proveru u transportnoj komunikaciji.' : 'Plantermin, operative ETA, bestätigten Kundentermin und nächsten Prüfpunkt in der Transportkommunikation klar trennen.') : knowledgeCenter ? (sr ? 'Stručni sadržaji o statusu, ETA, dokumentima, komunikaciji, eskalaciji i kontinuitetu Balkan–DACH transporta.' : 'Fachinhalte zu Status, ETA, Dokumenten, Kommunikation, Eskalation und Kontinuität im Balkan–DACH-Transport.') : businessPage ? (sr ? 'Jasno ograničena operativna podrška, kontinuitet i višejezička komunikacija za Balkan–DACH transport.' : 'Klar begrenzte operative Unterstützung, Kontinuität und mehrsprachige Kommunikation für Balkan–DACH-Transporte.') : pilotCheck ? (sr ? 'Strukturisana provera da li ograničeni DaniniHub pilot odgovara potrebama transportne firme.' : 'Strukturierte Prüfung, ob ein begrenzter DaniniHub-Pilot zum Bedarf eines Transportunternehmens passt.') : operationsDemo ? (sr ? 'Interaktivna simulacija fiktivne transportne ture sa statusima, ETA, odstupanjem i eskalacijom.' : 'Interaktive Simulation einer fiktiven Transporttour mit Status, ETA, Abweichung und Eskalation.') : pilot ? (sr ? 'Fiktivna simulacija ograničene operativne podrške: status, ETA, odstupanje i dokumentovana eskalacija.' : 'Fiktive Simulation eines begrenzten Operations Supports: Status, ETA, Abweichung und dokumentierte Eskalation.') : (sr ? 'DACH Operations Desk za transportne firme sa Balkana: nemačka komunikacija, statusi, ETA, dokumentacija, eskalacija i predaja u jasno ograničenom pilotu.' : 'Balkan Continuity Support für DACH-Transportunternehmen: Status, ETA, Dokumentation, Eskalation und mehrsprachige Kommunikation mit Fahrern und Partnern im Balkanraum.')
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    const canonical = `https://daninihub.com${path}`
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:url"]')?.setAttribute('href', canonical)
    const pairs = [['/de/','/sr/'],['/de/transport-room-demo','/sr/transportna-soba-demo'],['/de/dispolab','/sr/dispo-lab'],['/de/dispolab/check','/sr/dispo-lab/provera'],['/de/leistungsrahmen','/sr/obim-usluge'],['/de/continuity-support','/sr/kontinuitet-podrska'],['/de/fahrerkommunikation','/sr/komunikacija-vozaci'],['/de/pilot-check','/sr/provera-pilota'],['/de/praxis-wissen','/sr/praksa-znanje'],['/de/praxis-wissen/warum-tms-disponenten-nicht-ersetzen','/sr/praksa-znanje/zasto-tms-ne-menja-disponente'],['/de/praxis-wissen/eta-ist-keine-zusage','/sr/praksa-znanje/eta-nije-obecanje'],['/de/praxis-wissen/fahrerkommunikation-balkan-dach','/sr/praksa-znanje/komunikacija-sa-vozacima-balkan-dach'],['/de/praxis-wissen/schichtuebergabe-disposition','/sr/praksa-znanje/predaja-smene-dispozicija'],['/de/praxis-wissen/abweichungen-eskalieren','/sr/praksa-znanje/eskalacija-odstupanja'],['/de/praxis-wissen/transportdokumente-cmr-pod','/sr/praksa-znanje/transportna-dokumenta-cmr-pod'],['/de/pilot-beispiel','/sr/primer-pilota'],['/de/operations-desk-demo','/sr/operativni-pult-demo'],['/de/impressum','/sr/impressum'],['/de/datenschutz','/sr/privatnost'],['/de/cookies','/sr/kolacici'],['/de/haftungsausschluss','/sr/odricanje-odgovornosti'],['/de/glossar','/sr/recnik']]
    const normalizedPath = path === '/de' ? '/de/' : path === '/sr' ? '/sr/' : path
    const pair = pairs.find(([de, srPath]) => de === normalizedPath || srPath === normalizedPath) || pairs[0]
    document.querySelector('link[hreflang="de"]')?.setAttribute('href', `https://daninihub.com${pair[0]}`)
    document.querySelector('link[hreflang="sr"]')?.setAttribute('href', `https://daninihub.com${pair[1]}`)
    document.querySelector('link[hreflang="x-default"]')?.setAttribute('href', `https://daninihub.com${pair[0]}`)
  }, [dispatchWorkspace, lang])

  if (dispatchWorkspace) return <DispatchPilotWorkspace/>

  let page
  if (/transport-room-demo|transportna-soba-demo/.test(location.pathname)) page = <TransportRoomDemo lang={lang}/>
  else if (/dispolab\/check|dispo-lab\/provera/.test(location.pathname)) page = <DispoCheck lang={lang}/>
  else if (/dispolab|dispo-lab/.test(location.pathname)) page = <DispoLabPage lang={lang}/>
  else if (/pilot-check|provera-pilota/.test(location.pathname)) page = <PilotCheck lang={lang}/>
  else if (/praxis-wissen|praksa-znanje/.test(location.pathname)) page = <KnowledgeCenter lang={lang}/>
  else if (/leistungsrahmen|obim-usluge|continuity-support|kontinuitet-podrska|fahrerkommunikation|komunikacija-vozaci/.test(location.pathname)) page = <BusinessPages lang={lang}/>
  else if (/^\/de\/?$/.test(location.pathname) || location.pathname === '/') page = <GermanB2BLanding/>
  else if (/^\/sr\/?$/.test(location.pathname)) page = <SerbianB2BLanding/>
  else page = <PublicLanding lang={lang} setLang={setLang}/>

  const isHome = /^\/(de|sr)\/?$/.test(location.pathname) || location.pathname === '/'

  return <div className="public-app">
    <SiteNavigation lang={lang}/>
    {page}
    {isHome && <ServiceQuickNav lang={lang}/>} 
    <SiteFooter lang={lang}/>
  </div>
}
