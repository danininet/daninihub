import { useEffect, useState } from 'react'
import DispatchPilotWorkspace from './DispatchPilotWorkspaceV5'
import ImportOSLanding from './ImportOSLanding'
import RevenueLegal from './RevenueLegal'

function languageFromPath(){
  return location.pathname.startsWith('/sr') ? 'sr' : 'de'
}

function legalType(path){
  if (/datenschutz|privatnost/.test(path)) return 'privacy'
  if (/cookies|kolacici/.test(path)) return 'cookies'
  if (/ai-transparenz|ai-transparentnost|haftungsausschluss|odricanje-odgovornosti/.test(path)) return 'ai'
  if (/bedingungen|uslovi/.test(path)) return 'terms'
  if (/impressum/.test(path)) return 'imprint'
  return null
}

export default function App(){
  const [lang,setLang]=useState(languageFromPath)
  const path=location.pathname.replace(/\/$/,'') || '/'
  const dispatchWorkspace=/^\/internal\/dispatch-pilot-workspace\/?$/.test(location.pathname)
  const type=legalType(path)

  useEffect(()=>{
    if(dispatchWorkspace){
      document.documentElement.lang=new URLSearchParams(location.search).get('lang')==='de'?'de':'sr'
      document.title='DaniniHub Internal Workspace'
      document.querySelector('meta[name="robots"]')?.setAttribute('content','noindex,nofollow')
      return
    }
    document.querySelector('meta[name="robots"]')?.setAttribute('content','index,follow,max-image-preview:large')
  },[dispatchWorkspace,path])

  function changeLanguage(next){
    setLang(next)
    const suffix=type==='privacy'?(next==='sr'?'/privatnost':'/datenschutz')
      :type==='cookies'?(next==='sr'?'/kolacici':'/cookies')
      :type==='ai'?(next==='sr'?'/ai-transparentnost':'/ai-transparenz')
      :type==='terms'?(next==='sr'?'/uslovi':'/bedingungen')
      :type==='imprint'?'/impressum':'/'
    history.pushState({},'',`/${next}${suffix}`)
  }

  if(dispatchWorkspace) return <DispatchPilotWorkspace/>
  if(type) return <RevenueLegal lang={lang} type={type}/>
  return <ImportOSLanding lang={lang} onLanguage={changeLanguage}/>
}
