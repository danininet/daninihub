const ORIGIN='https://daninihub.com'

function meta(selector,attrs){
  let el=document.head.querySelector(selector)
  if(!el){el=document.createElement('meta');document.head.appendChild(el)}
  Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v))
}
function link(hreflang,href){
  let el=document.head.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`)
  if(!el){el=document.createElement('link');el.rel='alternate';el.hreflang=hreflang;document.head.appendChild(el)}
  el.href=ORIGIN+href
}

export function applySeo({lang='de',title,description,path,dePath,srPath,type='website',schema=[]}){
  document.documentElement.lang=lang
  document.title=title
  meta('meta[name="description"]',{name:'description',content:description})
  meta('meta[name="robots"]',{name:'robots',content:'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'})
  meta('meta[property="og:title"]',{property:'og:title',content:title})
  meta('meta[property="og:description"]',{property:'og:description',content:description})
  meta('meta[property="og:type"]',{property:'og:type',content:type})
  meta('meta[property="og:url"]',{property:'og:url',content:ORIGIN+path})
  meta('meta[name="twitter:title"]',{name:'twitter:title',content:title})
  meta('meta[name="twitter:description"]',{name:'twitter:description',content:description})
  let canonical=document.head.querySelector('link[rel="canonical"]')
  if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical)}
  canonical.href=ORIGIN+path
  link('de',dePath);link('sr',srPath);link('x-default',dePath)
  document.querySelectorAll('script[data-danini-schema]').forEach(x=>x.remove())
  if(schema.length){const el=document.createElement('script');el.type='application/ld+json';el.dataset.daniniSchema='1';el.textContent=JSON.stringify({'@context':'https://schema.org','@graph':schema});document.head.appendChild(el)}
}

export const organization={
  '@type':['Organization','LocalBusiness'],'@id':ORIGIN+'/#organization',name:'DANINI',url:ORIGIN,
  email:'info@daninihub.com',telephone:'+49 1573 0916621',logo:ORIGIN+'/importos-mark.svg',
  address:{'@type':'PostalAddress',streetAddress:'Fischerstraße 54',postalCode:'47055',addressLocality:'Duisburg',addressCountry:'DE'},
  areaServed:['DE','CH','RS']
}
