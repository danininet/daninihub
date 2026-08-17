import './App.css'
import './Enhancements.css'
import ProductSystemSection from './ProductSystemSection'

const firstTalk = 'mailto:info@daninihub.com?subject=10-Minuten-Gespr%C3%A4ch%20%E2%80%93%20DACH%20%E2%86%94%20Balkan%20Disposition'

const services = [
  ['01', 'Externe Disposition', 'Flexible operative Entlastung bei Status, ETA, Fahrerkommunikation, offenen Punkten und Abweichungen.', '/de/externe-disposition'],
  ['02', 'Balkan Desk', 'Für DACH-Speditionen mit regelmäßigen Balkan-Verkehren und wiederkehrender Fahrer- oder Partnerkommunikation.', '/de/balkan-desk'],
  ['03', 'DACH Desk', 'Deutschsprachige operative Schnittstelle aus Duisburg für Balkan-Transportunternehmen mit DACH-Verkehren.', '/de/dach-desk']
]

const problems = [
  ['Status fehlt', 'Kunde fragt nach, Fahrer ist unterwegs, die Disposition muss Informationen zusammensuchen.'],
  ['ETA bleibt unklar', 'Schätzungen, Zusagen und letzte Bestätigung werden im Tagesgeschäft vermischt.'],
  ['Balkan-Kommunikation bindet Zeit', 'Sprachliche und operative Rückfragen unterbrechen die Kern-Disposition.'],
  ['Übergaben funktionieren nicht', 'Offene Punkte werden erneut recherchiert statt arbeitsfähig übergeben.']
]

export default function GermanB2BLanding() {
  return <main id="top">
    <section className="hero">
      <div className="hero-copy">
        <p className="kicker">EXTERNE DISPOSITION · BALKAN DESK · DUISBURG</p>
        <h1>Ich entlaste Ihre Disposition bei DACH ↔ Balkan-Verkehren.</h1>
        <p className="lead">DaniniHub übernimmt klar definierte operative Aufgaben rund um Status, ETA, Fahrer- und Partnerkommunikation, Dokumente und Abweichungen. Nicht als Ersatz Ihrer Disposition, sondern als zusätzliche Kapazität, wenn im Tagesgeschäft Zeit fehlt.</p>
        <p><a className="btn" href={firstTalk}>10-Minuten-Gespräch anfragen →</a></p>
        <a className="entry-demo-link" href="#services">Leistungen zuerst ansehen →</a>
        <div className="proof"><span>✓ Standort Duisburg</span><span>✓ DACH ↔ Balkan Fokus</span><span>✓ Mensch entscheidet, KI unterstützt</span></div>
      </div>
      <div className="route-art" aria-hidden="true"><div className="globe"/><div className="route r1"/><div className="route r2"/><div className="truck">▰</div><span className="city c1">DUISBURG</span><span className="city c2">DACH</span><span className="city c3">BALKAN</span></div>
    </section>

    <section id="services" className="section">
      <p className="kicker">DREI KLARE EINSTIEGE</p>
      <h2>Finden Sie direkt die Unterstützung, die zu Ihrem Engpass passt.</h2>
      <div className="start-grid interest-grid">{services.map(([n, title, text, href]) => <article key={href}><span>{n}</span><h3>{title}</h3><p>{text}</p><a href={href}>Mehr erfahren →</a></article>)}</div>
    </section>

    <section className="section">
      <p className="kicker">TYPISCHE ENGPÄSSE</p>
      <h2>Was im Tagesgeschäft unnötig Aufmerksamkeit bindet.</h2>
      <div className="grid">{problems.map(([title, text], index) => <article key={title}><div className="service-card-head"><span className="num">0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <ProductSystemSection lang="de"/>

    <section className="section split">
      <div>
        <p className="kicker">SO STARTEN WIR</p>
        <h2>Kein großes Outsourcing-Projekt.</h2>
        <p className="big">Wir beginnen mit einer Relation, wenigen Fahrzeugen oder einem klar abgegrenzten Prozess.</p>
      </div>
      <div>
        <p>Vor dem Start wird schriftlich festgelegt, welche Aufgaben DaniniHub übernimmt, welche Informationen benötigt werden, wer beim Auftraggeber entscheidet und wie Status und Übergabe dokumentiert werden.</p>
        <p><a className="btn" href={firstTalk}>Kurzes Erstgespräch anfragen →</a></p>
      </div>
    </section>

    <section className="section scope">
      <p className="kicker">KLARE GRENZEN</p>
      <h2>Operative Unterstützung ohne Übernahme Ihrer Verantwortung.</h2>
      <div className="scope-grid">
        <article><span>DaniniHub</span><p>Strukturiert Informationen, verfolgt Status und Kontrollpunkte, unterstützt mehrsprachige Kommunikation, dokumentiert offene Punkte und eskaliert nach vereinbartem Ablauf.</p></article>
        <article><span>Auftraggeber</span><p>Behält Transportaufträge, Preise, rechtsverbindliche Zusagen, finale Disposition, Fahreranweisungen und operative Freigaben.</p></article>
      </div>
    </section>

    <section className="section">
      <p className="kicker">PRAXIS STATT VERSPRECHEN</p>
      <h2>Sehen Sie zuerst, wie DaniniHub arbeitet.</h2>
      <div className="start-grid interest-grid">
        <article><span>01</span><h3>Praxis & Wissen</h3><p>ETA, Fahrerkommunikation, Übergaben, Eskalation und Transportdokumente.</p><a href="/de/praxis-wissen">Praxiswissen öffnen →</a></article>
        <article><span>02</span><h3>Transport Room</h3><p>Ein konkreter Transportfall mit Status, ETA, Dokumenten, Incident und Übergabe.</p><a href="/de/transport-room-demo?case=DH-TR-0001">Demo öffnen →</a></article>
        <article><span>03</span><h3>DispoLab</h3><p>Praktische Fälle und kostenloser Dispo-Check.</p><a href="/de/dispolab">DispoLab öffnen →</a></article>
      </div>
    </section>

    <section id="contact" className="section contact">
      <div><p className="kicker">NÄCHSTER SCHRITT</p><h2>Wo verliert Ihre Disposition heute am meisten Zeit?</h2><p>Ein kurzes Gespräch reicht, um festzustellen, ob und welchen klar begrenzten Teil DaniniHub sinnvoll übernehmen kann.</p></div>
      <div><a className="btn" href={firstTalk}>10-Minuten-Gespräch anfragen →</a></div>
    </section>
  </main>
}
