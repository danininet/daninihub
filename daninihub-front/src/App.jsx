import {useEffect,useState} from 'react'
import ImportOSLanding from './ImportOSLanding'
import ImportOSLegal from './ImportOSLegal'
import ImportOSKnowledge from './ImportOSKnowledge'
import ImportOSOwner from './ImportOSOwner'

function languageFromPath(){return location.pathname.startsWith('/sr')?'sr':'de'}
function legalType(path){
  if(/datenschutz|privatnost/.test(path))return 'privacy'
  if(/cookies|kolacici/.test(path))return 'cookies'
  if(/bedingungen|uslovi/.test(path))return 'terms'
  if(/impressum/.test(path))return 'imprint'
  return null
}
function knowledgeSlug(path){
  const m=path.match(/^\/(?:de\/wissen|sr\/vodic)\/([^/]+)$/)
  return m?.[1]||null
}

export default function App(){
  const [lang,setLang]=useState(languageFromPath)
  const [path,setPath]=useState(()=>location.pathname.replace(/\/$/,'')||'/')
  const type=legalType(path)
  const slug=knowledgeSlug(path)
  const owner=path==='/owner/importos'

  useEffect(()=>{
    document.documentElement.lang=lang
    document.querySelector('meta[name="robots"]')?.setAttribute('content','index,follow,max-image-preview:large')
  },[lang,path])
  useEffect(()=>{const sync=()=>{setPath(location.pathname.replace(/\/$/,'')||'/');setLang(languageFromPath())};addEventListener('popstate',sync);return()=>removeEventListener('popstate',sync)},[])

  function changeLanguage(next){
    setLang(next)
    const suffix=type==='privacy'?(next==='sr'?'/privatnost':'/datenschutz')
      :type==='cookies'?(next==='sr'?'/kolacici':'/cookies')
      :type==='terms'?(next==='sr'?'/uslovi':'/bedingungen')
      :type==='imprint'?'/impressum'
      :slug?(next==='sr'?'/vodic/':'/wissen/')+slug
      :'/'
    history.pushState({},'',`/${next}${suffix}`)
    setPath(`/${next}${suffix}`)
  }

  if(owner)return <ImportOSOwner/>
  if(type)return <ImportOSLegal lang={lang} type={type}/>
  if(slug)return <ImportOSKnowledge lang={lang} slug={slug}/>
  return <ImportOSLanding lang={lang} onLanguage={changeLanguage}/>
}
