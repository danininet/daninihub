import { useState } from 'react'
import PublicLanding from './PublicLanding'
import InternalDashboard from './InternalDashboard'
import { content, detectInitialLanguage } from './i18n/content'
import './App.css'

const INTERNAL_MODE = false

function App() {
  const [lang, setLang] = useState(detectInitialLanguage)

  if (INTERNAL_MODE) {
    return <InternalDashboard />
  }

  return (
    <PublicLanding
      lang={lang}
      setLang={setLang}
      t={content[lang] || content.en}
    />
  )
}

export default App
