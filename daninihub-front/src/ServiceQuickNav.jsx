import './ServiceQuickNav.css'

const items = {
  de: [
    ['/de/leistungsrahmen', 'Leistungsrahmen', 'Aufgaben, Freigaben und klare Grenzen'],
    ['/de/continuity-support', 'Continuity Support', 'Urlaub, Krankheit und Spitzenlast'],
    ['/de/fahrerkommunikation', 'Fahrerkommunikation', 'Balkan–DACH Tour- und Sprachbegleitung'],
    ['/de/pilot-check', 'Pilot-Check', 'Bedarf strukturiert prüfen']
  ],
  sr: [
    ['/sr/obim-usluge', 'Obim usluge', 'Zadaci, ovlašćenja i jasne granice'],
    ['/sr/kontinuitet-podrska', 'Podrška kontinuitetu', 'Odmori, bolovanja i povećan obim'],
    ['/sr/komunikacija-vozaci', 'Komunikacija sa vozačima', 'Balkan–DACH praćenje ture i jezika'],
    ['/sr/provera-pilota', 'Provera pilota', 'Strukturisana provera potrebe']
  ]
}

export default function ServiceQuickNav({ lang }) {
  return <section className="service-quick" aria-label={lang === 'sr' ? 'DaniniHub usluge' : 'DaniniHub Leistungen'}>
    <div className="service-quick-head">
      <p>{lang === 'sr' ? 'KONKRETNA PODRŠKA' : 'KONKRETE UNTERSTÜTZUNG'}</p>
      <h2>{lang === 'sr' ? 'Izaberite problem koji danas treba rešiti.' : 'Wählen Sie den Engpass, der heute gelöst werden soll.'}</h2>
    </div>
    <div className="service-quick-grid">
      {items[lang].map(([href,title,text], index) => <a href={href} key={href}>
        <span>0{index + 1}</span><strong>{title}</strong><small>{text}</small><b>→</b>
      </a>)}
    </div>
  </section>
}
