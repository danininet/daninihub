import { useEffect, useState } from 'react'
import PublicLanding from './PublicLanding'
import './App.css'

export default function App() {
  const [lang, setLang] = useState(() => location.pathname.startsWith('/sr') ? 'sr' : 'de')
  useEffect(() => {
    const sr = lang === 'sr'
    const path = location.pathname
    const pilot = /pilot-beispiel|primer-pilota/.test(path)
    const operationsDemo = /operations-desk-demo|operativni-pult-demo/.test(path)
    document.documentElement.lang = lang
    document.title = operationsDemo ? (sr ? 'Interaktivni operativni pult | DaniniHub' : 'Interaktiver Operations Desk | DaniniHub') : pilot ? (sr ? 'Kako izgleda pilot | DaniniHub' : 'So funktioniert ein Pilot | DaniniHub') : (sr ? 'DaniniHub Transport & Logistics | Balkan–DACH operativna podrška' : 'DaniniHub Transport & Logistics | Balkan–DACH Operations Support')
    document.querySelector('meta[name="description"]')?.setAttribute('content', operationsDemo ? (sr ? 'Interaktivna simulacija fiktivne transportne ture sa statusima, ETA, odstupanjem i eskalacijom.' : 'Interaktive Simulation einer fiktiven Transporttour mit Status, ETA, Abweichung und Eskalation.') : pilot ? (sr ? 'Fiktivna simulacija ograničene operativne podrške: status, ETA, odstupanje i dokumentovana eskalacija.' : 'Fiktive Simulation eines begrenzten Operations Supports: Status, ETA, Abweichung und dokumentierte Eskalation.') : (sr ? 'Operativna podrška transportnim firmama između Balkana i DACH regiona: komunikacija, statusi, termini i dokumentacija.' : 'Operative Transport-Unterstützung zwischen Balkan und DACH: Kommunikation, Status, Termine, Dokumente und klar begrenzte Zuständigkeiten.'))
    const canonical = `https://daninihub.com${path}`
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical)
  }, [lang])
  return <PublicLanding lang={lang} setLang={setLang} />
}
