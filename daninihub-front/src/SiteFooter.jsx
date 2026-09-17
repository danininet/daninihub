import './SiteFooter.css'

const copy={
  de:{about:'DaniniHub verbindet reale Ressourcen, konkrete Probleme und AI mit kleinen, messbaren Markttests.',offer:'Start',map:'AI Opportunity Map · 19 €',check:'Kostenloser Opportunity Check',location:'Location Launch',cases:'Praxisfälle',calije:'Čalije · öffentlicher Fall',archive:'Wissensarchiv',knowledge:'Transportwissen',dispolab:'DispoLab',legal:'Rechtliches',imprint:'Impressum',privacy:'Datenschutz',cookies:'Cookies',liability:'Haftungsausschluss',whatsapp:'WhatsApp-Kontakt'},
  sr:{about:'DaniniHub povezuje stvarne resurse, konkretne probleme i AI sa malim i merljivim tržišnim testovima.',offer:'Početak',map:'AI Opportunity Map · 19 €',check:'Besplatni Opportunity Check',location:'Location Launch',cases:'Praktični slučajevi',calije:'Čalije · javni slučaj',archive:'Arhiva znanja',knowledge:'Transportno znanje',dispolab:'DispoLab',legal:'Pravne informacije',imprint:'Impresum',privacy:'Privatnost',cookies:'Kolačići',liability:'Odricanje odgovornosti',whatsapp:'WhatsApp kontakt'}
}

export default function SiteFooter({lang}){
  const t=copy[lang],sr=lang==='sr'
  const home=sr?'/sr/':'/de/'
  const href=(de,srPath)=>sr?srPath:de
  const message=sr?'Pozdrav, javljam se preko DaniniHub sajta i želeo/la bih više informacija.':'Guten Tag, ich komme über die DaniniHub-Website und möchte weitere Informationen.'
  const whatsapp=`https://wa.me/4915730916621?text=${encodeURIComponent(message)}`
  return <footer className="site-footer-pro">
    <div className="footer-rule"/>
    <div className="site-footer-grid">
      <section className="site-footer-brand"><a className="site-footer-logo" href={home}><img src="/logo-mark.svg" alt=""/><span><strong>DaniniHub</strong><small>HUMAN + AI OPPORTUNITY ENGINE</small></span></a><p>{t.about}</p><div className="footer-contact"><a href="mailto:info@daninihub.com">info@daninihub.com</a><a href="tel:+4915730916621">+49 1573 0916621</a><a className="footer-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp · +49 1573 0916621 ↗</a><span>Duisburg · Deutschland</span></div></section>
      <nav aria-label={t.offer}><h2>{t.offer}</h2><a href={href('/de/opportunity-map','/sr/opportunity-map')}>{t.map}</a><a href={href('/de/opportunity-check','/sr/opportunity-check')}>{t.check}</a><a href={href('/de/location-launch','/sr/location-launch')}>{t.location}</a></nav>
      <nav aria-label={t.cases}><h2>{t.cases}</h2><a href={sr?'https://calije.daninihub.com/sr':'https://calije.daninihub.com/de'}>{t.calije} ↗</a><h2>{t.archive}</h2><a href={href('/de/praxis-wissen','/sr/praksa-znanje')}>{t.knowledge}</a><a href={href('/de/dispolab','/sr/dispo-lab')}>{t.dispolab}</a></nav>
      <nav aria-label={t.legal}><h2>{t.legal}</h2><a href={href('/de/impressum','/sr/impressum')}>{t.imprint}</a><a href={href('/de/datenschutz','/sr/privatnost')}>{t.privacy}</a><a href={href('/de/cookies','/sr/kolacici')}>{t.cookies}</a><a href={href('/de/haftungsausschluss','/sr/odricanje-odgovornosti')}>{t.liability}</a></nav>
    </div>
    <div className="footer-meta"><span>© 2026 DaniniHub</span><span>DE · SR</span></div>
    <a className="site-whatsapp-float" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label={`${t.whatsapp}: +49 1573 0916621`}><span aria-hidden="true">WA</span><strong>{t.whatsapp}</strong></a>
  </footer>
}
