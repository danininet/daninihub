import { useEffect, useState } from 'react'
import DispatchPilotWorkspace from './DispatchPilotWorkspaceV5'
import RevenueOSLanding from './RevenueOSLanding'
import RevenueLegal from './RevenueLegal'

function languageFromPath(){
  return location.pathname.startsWith('/sr') ? 'sr' : 'de'
}

function legalType(path){
  if (/datenschutz|privatnost/.test(path)) return 'privacy'
  if (/haftungsausschluss|odricanje-odgovornosti/.test(path)) return 'disclaimer'
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
      :type==='disclaimer'?(next==='sr'?'/odricanje-odgovornosti':'/haftungsausschluss')
      :type==='imprint'?'/impressum':'/'
    history.pushState({},'',`/${next}${suffix}`)
  }

  if(dispatchWorkspace) return <DispatchPilotWorkspace/>
  if(type) return <RevenueLegal lang={lang} type={type}/>
  return <RevenueOSLanding lang={lang} onLanguage={changeLanguage}/>
}
