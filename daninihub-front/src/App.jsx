import { useEffect, useState } from 'react'
import PublicLanding from './PublicLanding'
import './App.css'

export default function App() {
  const [lang, setLang] = useState(() => location.pathname.startsWith('/sr') ? 'sr' : 'de')
  useEffect(() => {
    const sr = lang === 'sr'
    document.documentElement.lang = lang
    document.title = sr ? 'DaniniHub Transport & Logistics | Balkan–DACH operativna podrška' : 'DaniniHub Transport & Logistics | Balkan–DACH Operations Support'
    document.querySelector('meta[name="description"]')?.setAttribute('content', sr ? 'Operativna podrška transportnim firmama između Balkana i DACH regiona: komunikacija, statusi, termini i dokumentacija.' : 'Operative Transport-Unterstützung zwischen Balkan und DACH: Kommunikation, Status, Termine, Dokumente und klar begrenzte Zuständigkeiten.')
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', sr ? 'https://daninihub.com/sr/' : 'https://daninihub.com/de/')
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', sr ? 'https://daninihub.com/sr/' : 'https://daninihub.com/de/')
  }, [lang])
  return <PublicLanding lang={lang} setLang={setLang} />
}
