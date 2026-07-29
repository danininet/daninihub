import './SiteFooter.css'

const copy = {
  de: {
    about: 'Operative Unterstützung für Balkan–DACH: Status, Fahrerkommunikation und dokumentierte Übergaben.',
    services: 'Leistungen', knowledge: 'Praxis & Wissen', legal: 'Rechtliches',
    audience: 'Für DACH-Speditionen', scope: 'Leistungsrahmen', continuity: 'Continuity Support', drivers: 'Fahrerkommunikation', pilot: 'Pilot-Check', dispoLab: 'DispoLab', dispoCheck: 'Kostenloser Dispo-Check', network: 'Transport Network', room: 'Transport Room', practice: 'Fachartikel', dispatch: 'TMS & Disposition', eta: 'ETA & Status', driver: 'Fahrerkommunikation', handover: 'Schichtübergabe', escalation: 'Abweichung & Eskalation', documents: 'CMR, POD & Nachweise', law: 'Transport-Glossar', imprint: 'Impressum', privacy: 'Datenschutz', cookies: 'Cookies', liability: 'Haftungsausschluss', contact: 'Kontakt'
  },
  sr: {
    about: 'Operativna podrška za Balkan–DACH: statusi, komunikacija sa vozačima i dokumentovana predaja.',
    services: 'Usluge', knowledge: 'Praksa i znanje', legal: 'Pravne informacije',
    audience: 'Za balkanske transportne firme', scope: 'Obim usluge', continuity: 'Podrška kontinuitetu', drivers: 'Komunikacija sa vozačima', pilot: 'Provera pilota', dispoLab: 'DispoLab', dispoCheck: 'Besplatni Dispo-Check', network: 'Transportna mreža', room: 'Transportna soba', practice: 'Stručni članci', dispatch: 'TMS i dispozicija', eta: 'ETA i status', driver: 'Komunikacija sa vozačima', handover: 'Predaja smene', escalation: 'Odstupanje i eskalacija', documents: 'CMR, POD i dokazi', law: 'Transportni rečnik', imprint: 'Impresum', privacy: 'Privatnost', cookies: 'Kolačići', liability: 'Odricanje odgovornosti', contact: 'Kontakt'
  }
}

export default function SiteFooter({ lang }) {
  const t = copy[lang]
  const sr = lang === 'sr'
  const home = sr ? '/sr/' : '/de/'
  const href = (de, srPath) => (sr ? srPath : de)

  return <footer className="site-footer-pro">
    <div className="footer-rule" />
    <div className="site-footer-grid">
      <section className="site-footer-brand"><a className="site-footer-logo" href={home}><img src="/logo-mark.svg" alt=""/><span><strong>DaniniHub</strong><small>TRANSPORT &amp; LOGISTICS</small></span></a><p>{t.about}</p><div className="footer-contact"><a href="mailto:info@daninihub.com">info@daninihub.com</a><a href="tel:+4915730916621">+49 1573 0916621</a><span>Duisburg · Deutschland</span></div></section>
      <nav aria-label={t.services}><h2><a href={href('/de/fuer-dach-speditionen','/sr/za-balkanske-transportne-firme')}>{t.services}</a></h2><a href={href('/de/fuer-dach-speditionen','/sr/za-balkanske-transportne-firme')}>{t.audience}</a><a href={href('/de/leistungsrahmen','/sr/obim-usluge')}>{t.scope}</a><a href={href('/de/continuity-support','/sr/kontinuitet-podrska')}>{t.continuity}</a><a href={href('/de/fahrerkommunikation','/sr/komunikacija-vozaci')}>{t.drivers}</a><a href={href('/de/pilot-check','/sr/provera-pilota')}>{t.pilot}</a><a href={href('/de/dispolab','/sr/dispo-lab')}>{t.dispoLab}</a><a href={href('/de/dispolab/check','/sr/dispo-lab/provera')}>{t.dispoCheck}</a><a href={href('/de/transport-network-demo','/sr/transportna-mreza-demo')}>{t.network}</a><a href={href('/de/transport-room-demo?case=DH-TR-0001','/sr/transportna-soba-demo?case=DH-TR-0001')}>{t.room}</a></nav>
      <nav aria-label={t.knowledge}><h2><a href={href('/de/praxis-wissen','/sr/praksa-znanje')}>{t.knowledge}</a></h2><a href={href('/de/praxis-wissen','/sr/praksa-znanje')}>{t.practice}</a><a href={href('/de/praxis-wissen/warum-tms-disponenten-nicht-ersetzen','/sr/praksa-znanje/zasto-tms-ne-menja-disponente')}>{t.dispatch}</a><a href={href('/de/praxis-wissen/eta-ist-keine-zusage','/sr/praksa-znanje/eta-nije-obecanje')}>{t.eta}</a><a href={href('/de/praxis-wissen/fahrerkommunikation-balkan-dach','/sr/praksa-znanje/komunikacija-sa-vozacima-balkan-dach')}>{t.driver}</a><a href={href('/de/praxis-wissen/schichtuebergabe-disposition','/sr/praksa-znanje/predaja-smene-dispozicija')}>{t.handover}</a><a href={href('/de/praxis-wissen/abweichungen-eskalieren','/sr/praksa-znanje/eskalacija-odstupanja')}>{t.escalation}</a><a href={href('/de/praxis-wissen/transportdokumente-cmr-pod','/sr/praksa-znanje/transportna-dokumenta-cmr-pod')}>{t.documents}</a><a href={href('/de/glossar','/sr/recnik')}>{t.law}</a></nav>
      <nav aria-label={t.legal}><h2><a href={href('/de/impressum','/sr/impressum')}>{t.legal}</a></h2><a href={href('/de/impressum','/sr/impressum')}>{t.imprint}</a><a href={href('/de/datenschutz','/sr/privatnost')}>{t.privacy}</a><a href={href('/de/cookies','/sr/kolacici')}>{t.cookies}</a><a href={href('/de/haftungsausschluss','/sr/odricanje-odgovornosti')}>{t.liability}</a><a href={`${home}#contact`}>{t.contact}</a></nav>
    </div>
    <div className="footer-meta"><span>© 2026 DaniniHub</span><span>DE · SR</span></div>
  </footer>
}
