import './SiteFooter.css'

const copy = {
  de: {
    text: 'Klar begrenzte operative Unterstützung für Balkan–DACH-Transporte – mit dokumentierten Zuständigkeiten, nachvollziehbaren Übergaben und menschlicher Entscheidung.',
    kicker: 'OPERATIVE KLARHEIT STATT GENERISCHER VERSPRECHEN',
    ctaTitle: 'Wenn der Transport vom Plan abweicht, braucht Ihr Team einen klaren nächsten Schritt.',
    ctaText: 'Prüfen Sie in wenigen Minuten, ob ein begrenzter DaniniHub-Pilot zu Ihrem operativen Bedarf passt.',
    cta: 'Pilot-Check starten',
    services: 'Leistungen', knowledge: 'Praxis & Wissen', legal: 'Rechtliches', contactTitle: 'Direkter Kontakt',
    scope: 'Leistungsrahmen', continuity: 'Continuity Support', drivers: 'Fahrerkommunikation', pilot: 'Pilot-Check', practice: 'Fachartikel & Standards', glossary: 'Glossar', example: 'Pilot-Beispiel', contact: 'Kontakt', imprint: 'Impressum', privacy: 'Datenschutz', cookies: 'Cookies', liability: 'Haftungsausschluss',
    trustTitle: 'Arbeitsprinzipien',
    trust: [
      ['Dokumentierte Prozesse','Status, Freigaben und Übergaben bleiben nachvollziehbar.','01'],
      ['Mehrsprachige Kommunikation','Deutsch und Serbisch als operative Brücke zu Balkan-Routen.','02'],
      ['Menschliche Entscheidung','AI strukturiert; der Auftraggeber prüft und entscheidet.','03'],
      ['Begrenzter Pilot','Klarer Umfang, definierte Dauer und gemeinsame Auswertung.','04'],
      ['Balkan–DACH-Fokus','Kein allgemeines Callcenter, sondern regionale Transportpraxis.','05'],
      ['Datensparsamkeit','Nur notwendige Daten im vereinbarten operativen Umfang.','06']
    ],
    status: ['Keine autonome Disposition','Keine Preis- oder Vertragsentscheidung','Keine ISO- oder Sicherheitsbehauptung ohne Nachweis']
  },
  sr: {
    text: 'Jasno ograničena operativna podrška za Balkan–DACH transport – sa dokumentovanim odgovornostima, proverljivom predajom i odlukama koje ostaju kod čoveka.',
    kicker: 'OPERATIVNA JASNOĆA UMESTO GENERIČKIH OBEĆANJA',
    ctaTitle: 'Kada transport odstupi od plana, timu je potreban jasan sledeći korak.',
    ctaText: 'Za nekoliko minuta proverite da li ograničeni DaniniHub pilot odgovara vašem operativnom problemu.',
    cta: 'Pokreni proveru pilota',
    services: 'Usluge', knowledge: 'Praksa i znanje', legal: 'Pravne informacije', contactTitle: 'Direktan kontakt',
    scope: 'Obim usluge', continuity: 'Podrška kontinuitetu', drivers: 'Komunikacija sa vozačima', pilot: 'Provera pilota', practice: 'Članci i standardi', glossary: 'Rečnik', example: 'Primer pilota', contact: 'Kontakt', imprint: 'Impresum', privacy: 'Privatnost', cookies: 'Kolačići', liability: 'Odricanje odgovornosti',
    trustTitle: 'Principi rada',
    trust: [
      ['Dokumentovani procesi','Statusi, odobrenja i predaje ostaju proverljivi.','01'],
      ['Višejezička komunikacija','Nemački i srpski kao operativni most ka balkanskim rutama.','02'],
      ['Ljudska odluka','AI strukturira; naručilac proverava i odlučuje.','03'],
      ['Ograničen pilot','Jasan obim, definisano trajanje i zajednička procena.','04'],
      ['Balkan–DACH fokus','Nije opšti call-centar, već podrška zasnovana na transportnoj praksi.','05'],
      ['Svedena obrada podataka','Koriste se samo podaci potrebni za dogovoreni obim.','06']
    ],
    status: ['Bez autonomne dispozicije','Bez odluka o cenama i ugovorima','Bez ISO i sigurnosnih tvrdnji bez dokaza']
  }
}

export default function SiteFooter({ lang }) {
  const t = copy[lang]
  const sr = lang === 'sr'
  const home = sr ? '/sr/' : '/de/'
  const pilot = sr ? '/sr/provera-pilota' : '/de/pilot-check'
  return <footer className="site-footer-pro">
    <section className="site-footer-cta">
      <div><span>{t.kicker}</span><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p></div>
      <a href={pilot}>{t.cta} →</a>
    </section>

    <section className="site-footer-trust-wrap" aria-label={t.trustTitle}>
      <div className="site-footer-section-head"><span>TRUST LAYER</span><h2>{t.trustTitle}</h2></div>
      <div className="site-footer-trust">{t.trust.map(([title,text,no])=><article key={title}><span>{no}</span><div><strong>{title}</strong><small>{text}</small></div></article>)}</div>
    </section>

    <div className="site-footer-grid">
      <section className="site-footer-brand">
        <a href={home} className="site-footer-logo"><img src="/logo-mark.svg" alt="" width="48" height="48"/><span><strong>DaniniHub</strong><small>TRANSPORT &amp; LOGISTICS</small></span></a>
        <p>{t.text}</p>
        <div className="site-footer-contact"><span>Duisburg · Nordrhein-Westfalen</span><a href="mailto:info@daninihub.com">info@daninihub.com</a><a href="tel:+4915730916621">+49 1573 0916621</a></div>
      </section>

      <nav aria-label={t.services}><h2>{t.services}</h2><a href={sr?'/sr/obim-usluge':'/de/leistungsrahmen'}>{t.scope}</a><a href={sr?'/sr/kontinuitet-podrska':'/de/continuity-support'}>{t.continuity}</a><a href={sr?'/sr/komunikacija-vozaci':'/de/fahrerkommunikation'}>{t.drivers}</a><a href={pilot}>{t.pilot}</a></nav>

      <nav aria-label={t.knowledge}><h2>{t.knowledge}</h2><a href={sr?'/sr/praksa-znanje':'/de/praxis-wissen'}>{t.practice}</a><a href={sr?'/sr/recnik':'/de/glossar'}>{t.glossary}</a><a href={sr?'/sr/primer-pilota':'/de/pilot-beispiel'}>{t.example}</a><a href={home+'#contact'}>{t.contact}</a></nav>

      <nav aria-label={t.legal}><h2>{t.legal}</h2><a href={sr?'/sr/impressum':'/de/impressum'}>{t.imprint}</a><a href={sr?'/sr/privatnost':'/de/datenschutz'}>{t.privacy}</a><a href={sr?'/sr/kolacici':'/de/cookies'}>{t.cookies}</a><a href={sr?'/sr/odricanje-odgovornosti':'/de/haftungsausschluss'}>{t.liability}</a></nav>
    </div>

    <section className="site-footer-boundaries"><strong>{sr?'Granice odgovornosti':'Verantwortungsgrenzen'}</strong><div>{t.status.map(x=><span key={x}>✓ {x}</span>)}</div></section>
    <div className="site-footer-bottom"><span>© 2026 DaniniHub Transport &amp; Logistics</span><span>Human decision · documented process · Balkan–DACH</span></div>
  </footer>
}
