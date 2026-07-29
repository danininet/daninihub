import './App.css'
import './Enhancements.css'
import ProductSystemSection from './ProductSystemSection'

const problems = [
  ['Nepotpuni statusi', 'Vozač, disponent i klijent nemaju istu potvrđenu verziju događaja.'],
  ['ETA postaje obećanje', 'Operativna procena se prenese kao potvrđen termin bez jasnog odobrenja.'],
  ['Nemačka komunikacija kasni', 'Klijent, utovar ili istovar dobijaju informaciju tek kada je problem već eskalirao.'],
  ['Predaja nije radno sposobna', 'Sledeća smena mora ponovo da zove vozača ili klijenta da bi razumela slučaj.']
]

const solution = [
  ['01', 'Prijem i struktura', 'Informacije se razdvajaju na potvrđene činjenice, pretpostavke i otvorena pitanja.'],
  ['02', 'Status i kontrolna tačka', 'Vode se aktuelna ETA, poslednja potvrda i vreme sledeće provere.'],
  ['03', 'Komunikacija', 'Priprema se jasna poruka na nemačkom ili jeziku regiona.'],
  ['04', 'Odobrenje', 'Kada je potrebna odluka, slučaj ide ovlašćenoj osobi naručioca.'],
  ['05', 'Eskalacija', 'Rizik, rok, potreban odgovor i odgovornost ostaju dokumentovani.'],
  ['06', 'Predaja', 'Sledeća smena dobija radno sposoban zapis bez ponovnog prikupljanja podataka.']
]

const pilotSteps = [
  ['01', 'Jedna relacija ili mala grupa slučajeva', 'Pilot se ne otvara na celo poslovanje.'],
  ['02', 'Pisano definisani zadaci', 'Tačno se određuje šta DaniniHub prati, priprema, prenosi ili eskalira.'],
  ['03', 'Dokaz rada', 'Status, ETA, odstupanja, komunikacija, odluke i predaja ostaju dokumentovani.'],
  ['04', 'Završna evaluacija', 'Rezultat se meri prema dogovorenim kriterijumima, bez automatskog produženja.']
]

function NumberedCards({ items }) {
  return <div className="start-grid">{items.map(([number, title, text]) => <article key={`${number}-${title}`}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
}

export default function SerbianB2BLanding() {
  return <main id="top">
    <section className="hero">
      <div className="hero-copy">
        <p className="kicker">DACH OPERATIONS DESK ZA TRANSPORTNE FIRME SA BALKANA</p>
        <h1>Jasnija komunikacija sa DACH klijentima. Manje prekida u dispoziciji.</h1>
        <p className="lead">DaniniHub povezuje balkansku transportnu firmu i njenog DACH partnera kroz zajednički operativni prostor za status, ETA, dokumente, incidente i odgovornost — bez preuzimanja konačnih odluka vaše firme.</p>
        <p><a className="btn" href="/sr/transportna-mreza-demo">Pogledajte Transport Network →</a></p>
        <a className="entry-demo-link" href="/sr/dispo-lab/provera">Pokrenite besplatni Dispo-Check →</a>
        <div className="proof"><span>✓ Zajednički radni prostor bez nametanja novog TMS-a</span><span>✓ Nemački + jezici Balkana</span><span>✓ Jasno razdvojena ovlašćenja</span></div>
      </div>
      <div className="route-art" aria-hidden="true"><div className="globe"/><div className="route r1"/><div className="route r2"/><div className="truck">▰</div><span className="city c1">DUISBURG</span><span className="city c2">WIEN</span><span className="city c3">BALKAN</span></div>
    </section>

    <ProductSystemSection lang="sr"/>

    <section id="services" className="section">
      <p className="kicker">OPERATIVNI PROBLEM</p>
      <h2>Gde se u DACH transportu najčešće gubi vreme.</h2>
      <div className="grid">{problems.map(([title, text], index) => <article key={title}><div className="service-card-head"><span className="num">0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section className="section">
      <p className="kicker">DANINIHUB RADNI OKVIR</p>
      <h2>Podaci, komunikacija i odgovornost u jednom kontrolisanom toku.</h2>
      <NumberedCards items={solution}/>
      <p className="big">AI podržava strukturiranje i pripremu. Obavezujuće odluke, cene, transportni nalozi, instrukcije vozačima i pravna odgovornost ostaju kod naručioca.</p>
    </section>

    <section className="section split">
      <div><p className="kicker">PRIMER SITUACIJE</p><h2>Zastoj kod Budimpešte.</h2><p className="big">„Stau Budapest. ETA unklar. Kunde wartet. Entladung bis 10:00.“</p></div>
      <div><p>DaniniHub odvaja potvrđene činjenice od otvorenih pitanja, označava rizik, određuje ko mora da odobri sledeći korak, priprema nemačku poruku i ostavlja proverljiv trag za predaju.</p><a className="entry-demo-link" href="/sr/transportna-soba-demo?case=DH-TR-0001">Otvorite Transport Room →</a></div>
    </section>

    <section id="scope" className="section scope">
      <p className="kicker">JASNE GRANICE</p>
      <h2>Operativna podrška bez preuzimanja vaše odgovornosti.</h2>
      <div className="scope-grid"><article><span>DaniniHub</span><p>Strukturira informacije, prati status i kontrolne tačke, priprema komunikaciju, označava potrebu za odlukom i dokumentuje eskalaciju i predaju.</p></article><article><span>Naručilac</span><p>Zadržava transportne naloge, cene, pravno obavezujuća obećanja, konačnu dispoziciju, instrukcije vozačima, Verkehrsleitung i sva operativna odobrenja.</p></article></div>
    </section>

    <section className="section">
      <p className="kicker">OGRANIČENI PILOT</p>
      <h2>Mali, merljiv pilot umesto nejasnog outsourcinga.</h2>
      <NumberedCards items={pilotSteps}/>
    </section>

    <section className="section scope">
      <p className="kicker">PROVERA PODOBNOSTI</p>
      <h2>Za koga pilot ima smisla.</h2>
      <div className="scope-grid"><article><span>Odgovara</span><p>Firmama koje redovno voze prema Nemačkoj, Austriji ili Švajcarskoj, imaju višejezičku komunikaciju, gube vreme na statuse, ETA, termine, dokumente ili odstupanja i imaju jasnu osobu za operativna odobrenja.</p></article><article><span>Ne odgovara</span><p>Firmama koje očekuju da DaniniHub samostalno preuzme transportne naloge, cene, konačnu dispoziciju, Verkehrsleitung ili pravno obavezujuće odluke.</p></article></div>
    </section>

    <section className="section">
      <p className="kicker">DOKAZI I JAVNI UVID</p>
      <h2>Pre razgovora možete proveriti metod i način rada.</h2>
      <div className="start-grid interest-grid">
        <article><span>01</span><h3>DispoLab</h3><p>Praktični slučajevi i besplatni Dispo-Check za operativno razmišljanje i eskalaciju.</p><a href="/sr/dispo-lab">Otvori DispoLab →</a></article>
        <article><span>02</span><h3>Transport Network</h3><p>Kompanijski prostor sa partnerima, timom i više transportnih soba.</p><a href="/sr/transportna-mreza-demo">Pogledaj Network →</a></article>
        <article><span>03</span><h3>Transport Room</h3><p>Konkretan slučaj sa statusom, ETA, dokumentima, incidentom i predajom.</p><a href="/sr/transportna-soba-demo?case=DH-TR-0001">Otvori Transport Room →</a></article>
      </div>
    </section>

    <section id="contact" className="section contact">
      <div><p className="kicker">SLEDEĆI KORAK</p><h2>Da li vaša firma ima jasno ograničen operativni problem koji možemo da testiramo?</h2><p>Opišite relaciju, partnera, komunikacioni problem i osobu koja odobrava operativne korake. Dobićete ličnu procenu da li ograničen pilot ima smisla.</p></div>
      <div><a className="btn" href="/sr/provera-pilota">Pokrenite proveru pilota →</a></div>
    </section>
  </main>
}
