import './App.css'
import './Enhancements.css'
import ProductSystemSection from './ProductSystemSection'

const firstTalk = 'mailto:info@daninihub.com?subject=Kratak%20razgovor%20%E2%80%93%20DACH%20%E2%86%94%20Balkan%20operativa'

const services = [
  ['01', 'Eksterna dispozicija', 'Fleksibilno rasterećenje za status, ETA, komunikaciju sa vozačima, otvorene tačke i odstupanja.', '/sr/eksterna-dispozicija'],
  ['02', 'Balkan Desk', 'Za DACH špedicije koje imaju redovne Balkan relacije i ponavljajuću komunikaciju sa vozačima i partnerima.', '/sr/balkan-desk'],
  ['03', 'DACH Desk', 'Nemačka operativna kontakt tačka iz Duisburga za balkanske transportne firme sa DACH relacijama.', '/sr/dach-desk']
]

const problems = [
  ['Status nedostaje', 'Klijent pita, vozač je na putu, a dispozicija mora da skuplja informacije iz više izvora.'],
  ['ETA ostaje nejasna', 'Procene, obećanja i poslednja potvrda se u dnevnom radu često pomešaju.'],
  ['DACH komunikacija troši vreme', 'Pozivi, poruke i jezička pitanja prekidaju osnovni rad dispozicije.'],
  ['Predaja nije radno sposobna', 'Otvorene tačke se ponovo istražuju umesto da budu jasno predate sledećoj osobi.']
]

export default function SerbianB2BLanding() {
  return <main id="top">
    <section className="hero">
      <div className="hero-copy">
        <p className="kicker">EKSTERNA DISPOZICIJA · DACH DESK · DUISBURG</p>
        <h1>Rasterećujem dispoziciju na DACH ↔ Balkan transportima.</h1>
        <p className="lead">DaniniHub preuzima jasno definisane operativne zadatke oko statusa, ETA, komunikacije sa vozačima i partnerima, dokumentacije i odstupanja. Ne kao zamena vašoj dispoziciji, već kao dodatni kapacitet kada u svakodnevnom radu nedostaje vreme.</p>
        <p><a className="btn" href={firstTalk}>Zatražite razgovor od 10 minuta →</a></p>
        <a className="entry-demo-link" href="#services">Prvo pogledajte usluge →</a>
        <div className="proof"><span>✓ Duisburg</span><span>✓ DACH ↔ Balkan fokus</span><span>✓ Čovek odlučuje, AI podržava</span></div>
      </div>
      <div className="route-art" aria-hidden="true"><div className="globe"/><div className="route r1"/><div className="route r2"/><div className="truck">▰</div><span className="city c1">DUISBURG</span><span className="city c2">DACH</span><span className="city c3">BALKAN</span></div>
    </section>

    <section id="services" className="section">
      <p className="kicker">TRI JASNA ULAZA</p>
      <h2>Izaberite podršku prema problemu koji želite da rasteretite.</h2>
      <div className="start-grid interest-grid">{services.map(([n, title, text, href]) => <article key={href}><span>{n}</span><h3>{title}</h3><p>{text}</p><a href={href}>Saznajte više →</a></article>)}</div>
    </section>

    <section className="section">
      <p className="kicker">TIPIČNA USKA GRLA</p>
      <h2>Šta u svakodnevnom radu nepotrebno troši pažnju dispozicije.</h2>
      <div className="grid">{problems.map(([title, text], index) => <article key={title}><div className="service-card-head"><span className="num">0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <ProductSystemSection lang="sr"/>

    <section className="section split">
      <div>
        <p className="kicker">KAKO POČINJEMO</p>
        <h2>Bez velikog outsourcing projekta.</h2>
        <p className="big">Počinjemo sa jednom relacijom, nekoliko vozila ili jednim jasno ograničenim procesom.</p>
      </div>
      <div>
        <p>Pre početka se definiše šta DaniniHub preuzima, koje informacije su potrebne, ko kod naručioca donosi odluke i kako se vode status i predaja.</p>
        <p><a className="btn" href={firstTalk}>Zatražite kratak razgovor →</a></p>
      </div>
    </section>

    <section className="section scope">
      <p className="kicker">JASNE GRANICE</p>
      <h2>Operativna podrška bez preuzimanja vaše odgovornosti.</h2>
      <div className="scope-grid">
        <article><span>DaniniHub</span><p>Strukturira informacije, prati status i kontrolne tačke, podržava višejezičku komunikaciju, dokumentuje otvorene tačke i eskalira prema dogovorenom postupku.</p></article>
        <article><span>Naručilac</span><p>Zadržava transportne naloge, cene, pravno obavezujuća obećanja, konačnu dispoziciju, instrukcije vozačima i operativna odobrenja.</p></article>
      </div>
    </section>

    <section className="section">
      <p className="kicker">PRAKSA UMESTO OBEĆANJA</p>
      <h2>Prvo pogledajte kako DaniniHub radi.</h2>
      <div className="start-grid interest-grid">
        <article><span>01</span><h3>Praksa i znanje</h3><p>ETA, komunikacija sa vozačima, predaja, eskalacija i transportna dokumenta.</p><a href="/sr/praksa-znanje">Otvori sadržaj →</a></article>
        <article><span>02</span><h3>Transportna soba</h3><p>Konkretan transportni slučaj sa statusom, ETA, dokumentima, incidentom i predajom.</p><a href="/sr/transportna-soba-demo?case=DH-TR-0001">Otvori demo →</a></article>
        <article><span>03</span><h3>DispoLab</h3><p>Praktični slučajevi i besplatni Dispo-Check.</p><a href="/sr/dispo-lab">Otvori DispoLab →</a></article>
      </div>
    </section>

    <section id="contact" className="section contact">
      <div><p className="kicker">SLEDEĆI KORAK</p><h2>Gde vaša dispozicija danas gubi najviše vremena?</h2><p>Kratak razgovor je dovoljan da utvrdimo da li i koji jasno ograničen deo DaniniHub može smisleno da preuzme.</p></div>
      <div><a className="btn" href={firstTalk}>Razgovor od 10 minuta →</a></div>
    </section>
  </main>
}
