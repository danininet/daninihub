import { useState } from 'react'
import PublicLanding from './PublicLanding'
import './App.css'

export default function App() {
  const [lang, setLang] = useState(() => location.pathname.startsWith('/sr') ? 'sr' : 'de')
  return <PublicLanding lang={lang} setLang={setLang} />
}
