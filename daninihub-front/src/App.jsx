import {useEffect,useState} from 'react'
import ImportOSLanding from './ImportOSLanding'
import ImportOSLegal from './ImportOSLegal'

function languageFromPath(){return location.pathname.startsWith('/sr')?'sr':'de'}
function legalType(path){
  if(/datenschutz|privatnost/.test(path))return 'privacy'
  if(/cookies|kolacici/.test(path))return 'cookies'
  if(/bedingungen|uslovi/.test(path))return 'terms'
  if(/impressum/.test(path))return 'imprint'
  return null
}

export default function App(){
  const [lang,setLang]=useState(languageFromPath)
  const path=location.pathname.replace(/\/$/,'')||'/'
  const type=legalType(path)

  useEffect(()=>{
    document.documentElement.lang=lang
    document.querySelector('meta[name="robots"]')?.setAttribute('content','index,follow,max-image-preview:large')
  },[lang,path])

  function changeLanguage(next){
    setLang(next)
    const suffix=type==='privacy'?(next==='sr'?'/privatnost':'/datenschutz')
      :type==='cookies'?(next==='sr'?'/kolacici':'/cookies')
      :type==='terms'?(next==='sr'?'/uslovi':'/bedingungen')
      :type==='imprint'?'/impressum':'/'
    history.pushState({},'',`/${next}${suffix}`)
  }

  if(type)return <ImportOSLegal lang={lang} type={type}/>
  return <ImportOSLanding lang={lang} onLanguage={changeLanguage}/>
}
