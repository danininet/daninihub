import { useMemo, useState } from 'react'
import './App.css'

const pages = [
  ['home', 'Početna'],
  ['method', 'Metoda'],
  ['project', 'Projektni režim'],
  ['knowledge', 'Znanje'],
  ['regulation', 'Novosti i regulativa'],
  ['reviewbook', 'Knjiga utisaka'],
  ['partner', 'Partneri'],
  ['legal', 'Pravni okvir'],
]

const gates = [
  ['Gate 0', 'Provera uklapanja', 'Fokus, kapacitet, realna očekivanja i jedan aktivan projekat.'],
  ['Gate 1', 'Definisanje problema', 'Ko ima problem, koji je problem i šta je merljiv ishod.'],
  ['Gate 2', 'Tržišna realnost', 'DACH realnost, konkurencija, cenovni okvir i rizici.'],
  ['Gate 3', 'Struktura ponude', 'Struktura ponude, isporuke, granice i cena.'],
  ['Gate 4', 'Protokol izgradnje', 'Minimalna infrastruktura: landing, legal, email, plaćanje i praćenje.'],
  ['Gate 5', 'Lansiranje i povratna informacija', 'Jedan kanal, jedan CTA, prvi tržišni signal i odluka.'],
]

const pillars = [
  ['Zdrav tempo', 'Bez burnout logike, bez lažnih medicinskih tvrdnji, sa fokusom na jasnoću i održiv tempo.'],
  ['Prihod', 'Legalna, etična i transparentna monetizacija bez quick-money obećanja.'],
  ['Inteligencija', 'Razumevanje AI, kritičko mišljenje, samostalno odlučivanje i izlazak iz pasivne upotrebe alata.'],
]

const regulationItems = [
  ['GDPR / DSGVO', 'Prava korisnika, obrada podataka, brisanje, eksport, saglasnost i privacy-by-design.'],
  ['EU AI Act', 'Praćenje AI regulative i posledica za AI-assisted procese, sadržaje i proizvode.'],
  ['Affiliate i disclosure', 'Jasno označavanje affiliate linkova, bez prikrivenih interesa i lažnih preporuka.'],
  ['Pravila platformi', 'Google, YouTube, LinkedIn, payment i search promene koje utiču na digitalne projekte.'],
]

const legalItems = [
  'Impressum',
  'Zaštita podataka',
  'Kolačići',
  'Uslovi korišćenja',
  'Pravo odustanka',
  'AI transparentnost',
  'Affiliate napomena',
  'Disclaimer',
  'Prava nad podacima',
]

const footerGroups = [
  ['Sistem', ['Šta je DaniniHub', 'Metoda', 'Ustav sistema', 'Roadmap', 'Transparentnost', 'Audit']],
  ['Projektni režim', ['ENTRY 7€', 'Gate 0–5', 'Projektni režim', 'Cene', 'Dashboard']],
  ['Znanje i regulativa', ['Znanje', 'Novosti', 'Regulativa', 'GDPR / DSGVO', 'EU AI Act']],
  ['Zajednica', ['Knjiga utisaka', 'Iskustva', 'Zajednica', 'Podrška', 'Feedback']],
  ['Partneri', ['Saradnici', 'Postani partner', 'Affiliate program', 'Affiliate napomena']],
  ['Pravni okvir', legalItems.slice(0, 6)],
]

function Shell({ activePage, setActivePage, children }) {
  return (
    <main className="dh-page">
      <header className="dh-nav">
        <button className="dh-brand reset-button" onClick={() => setActivePage('home')}>
          <span className="dh-mark">DH</span>
          <span>DaniniHub</span>
        </button>

        <nav aria-label="Glavna navigacija">
          {pages.map(([id, label]) => (
            <button
              key={id}
              className={activePage === id ? 'nav-link active' : 'nav-link'}
              onClick={() => setActivePage(id)}
            >
              {label}
            </button>
          ))}
          <button className="nav-cta" onClick={() => setActivePage('project')}>ENTRY 7€</button>
        </nav>
      </header>

      {children}

      <Footer />
    </main>
  )
}

function Footer() {
  return (
    <footer className="dh-footer">
      <div className="footer-brand">
        <span className="dh-mark">DH</span>
        <div>
          <strong>DaniniHub</strong>
          <p>Inicijator: Danini Net · AI kao ko-kreator · Metoda: Pitaj AI — AI pita tebe</p>
          <p className="footer-note">Donacije nisu deo DaniniHub strukture.</p>
        </div>
      </div>

      <div className="footer-grid">
        {footerGroups.map(([group, links]) => (
          <div key={group}>
            <h4>{group}</h4>
            {links.map((link) => <span key={link}>{link}</span>)}
          </div>
        ))}
      </div>
    </footer>
  )
}

function HomePage({ setActivePage }) {
  return (
    <>
      <section className="dh-hero">
        <div className="eyebrow">DACH-orijentisana AI arhitektura za odlučivanje</div>
        <h1>DaniniHub je sistem. DaniniNet je javni kanal. Čalije su dokaz metode.</h1>
        <p className="hero-lead">
          DaniniHub nije chatbot, kurs ni prompt paket. To je strukturisani projektni režim koji vodi korisnika
          od ideje, preko tržišne realnosti, do jasne ponude i prvog signala sa tržišta.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setActivePage('project')}>ENTRY 7€ / Projektni režim</button>
          <button className="btn-secondary" onClick={() => setActivePage('method')}>Pogledaj metodu</button>
        </div>

        <div className="trust-row">
          <span>Bez quick-money obećanja</span>
          <span>Čovek odlučuje prvi</span>
          <span>GDPR / DSGVO sloj</span>
          <span>Bez donacija</span>
          <span>DACH-first pristup</span>
        </div>
      </section>

      <section className="dh-section split">
        <div>
          <p className="section-kicker">Odnos sistema</p>
          <h2>DaniniNet, DaniniHub i Čalije ne smeju da se mešaju — moraju da se povežu.</h2>
        </div>
        <div className="stack-list">
          <div><strong>DaniniHub:</strong> sistem, metoda, agenti, Gate 0–5 i infrastruktura za odluke.</div>
          <div><strong>DaniniNet:</strong> javni marketing, affiliate i prodajni kanal za edukativne i digitalne proizvode.</div>
          <div><strong>Čalije Park Residence:</strong> DPL Case Study — dokaz kako lokacija postaje digitalni gateway.</div>
        </div>
      </section>

      <section className="dh-section">
        <p className="section-kicker">Tri glavna principa</p>
        <h2>Svaka funkcija mora služiti: zdravom tempu, prihodu i inteligenciji.</h2>
        <div className="card-grid three">
          {pillars.map(([title, text]) => (
            <article className="dh-card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dh-section dark-block">
        <p className="section-kicker">DPL Case Study</p>
        <h2>Čalije Park Residence kao dokaz metode, ne kao zamena za DaniniHub.</h2>
        <div className="case-panel">
          <div>
            <h3>Digitalni gateway za realnu lokaciju</h3>
            <p>
              Čalije pokazuju kako se realna lokacija pretvara u javni prezentacioni sloj,
              privatni brief, lead tok, višejezični pristup, legal disclaimere i tržišni signal.
            </p>
          </div>
          <div className="case-points">
            <span>Javni sajt</span>
            <span>Privatni brief</span>
            <span>Lead tok</span>
            <span>SR / DE / EN</span>
            <span>Vizuelni dokaz</span>
            <span>Pravna granica</span>
          </div>
        </div>
      </section>
    </>
  )
}

function MethodPage() {
  return (
    <>
      <section className="dh-hero compact">
        <div className="eyebrow">Metoda</div>
        <h1>Pitaj AI — AI pita tebe.</h1>
        <p className="hero-lead">
          Metoda ne postoji da produži razgovor. Postoji da smanji maglu, natera fokus i dovede do odluke.
        </p>
      </section>

      <section className="dh-section split">
        <div>
          <p className="section-kicker">Protokol</p>
          <h2>Čovek pokreće dijalog. AI sme da razjasni. Odluka ostaje ljudska.</h2>
        </div>
        <div>
          <p>
            AI postavlja najviše tri razjašnjavajuća podpitanja. Ako je kontekst dovoljan, ne mora postaviti sva tri.
            Posle toga sledi analiza, plan, odluka ili STOP.
          </p>
          <p>
            Cilj je autonomija korisnika, ne zavisnost od sistema i ne beskonačno generisanje teksta.
          </p>
        </div>
      </section>

      <section className="dh-section">
        <p className="section-kicker">Status odluke</p>
        <div className="card-grid three">
          <article className="dh-card"><h3>GO</h3><p>Dovoljno jasno za sledeći operativni korak.</p></article>
          <article className="dh-card"><h3>REDEFINE</h3><p>Pravac ima smisla, ali parametri nisu dovoljno čisti.</p></article>
          <article className="dh-card"><h3>STOP</h3><p>Rizik je previsok ili nema dovoljno dokaza za nastavak.</p></article>
        </div>
      </section>
    </>
  )
}

function ProjectPage() {
  return (
    <>
      <section className="dh-hero compact">
        <div className="eyebrow">Projektni režim</div>
        <h1>Jedan aktivni projekat. Šest Gate-ova. Jedan decision report.</h1>
        <p className="hero-lead">
          ENTRY od 7€ aktivira ograničen, jasan i proverljiv projektni ciklus: Gate 0→5,
          Project Activation Pack PDF, email isporuku i pristup Project Mode UI-u.
        </p>
      </section>

      <section className="dh-section entry">
        <div>
          <p className="section-kicker">ENTRY</p>
          <h2>7€ jednokratni ulaz u projektni režim.</h2>
          <p>
            Nije pretplata, nije donacija i nije obećanje zarade. To je ulaz u strukturisani proces
            za jedan aktivni projekat.
          </p>
        </div>
        <div className="price-box">
          <span className="price">7€</span>
          <p>jednokratno</p>
          <button className="btn-primary full">Checkout se povezuje u sledećoj fazi</button>
        </div>
      </section>

      <section className="dh-section dark-block">
        <p className="section-kicker">Gate sistem</p>
        <h2>Gate 0–5</h2>
        <div className="gate-grid">
          {gates.map(([gate, title, text]) => (
            <article className="gate-card" key={gate}>
              <span>{gate}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

function KnowledgePage() {
  return (
    <>
      <section className="dh-hero compact">
        <div className="eyebrow">Znanje</div>
        <h1>Znanje koje vodi ka primeni, ne ka preopterećenju.</h1>
        <p className="hero-lead">
          DaniniHub centar znanja spaja AI, digitalne projekte, zdrav fokus, monetizaciju i DACH realnost.
        </p>
      </section>

      <section className="dh-section">
        <div className="card-grid three">
          {[
            ['AI i odluke', 'Kako koristiti AI za odluke, ne za pasivno generisanje teksta.'],
            ['Jasnoća projekta', 'Kako definisati problem, publiku, ponudu i sledeći korak.'],
            ['Digitalni biznis', 'Realistična digitalna ponuda, bez guru marketinga.'],
            ['Affiliate i monetizacija', 'Etička monetizacija, disclosure i partner vetting.'],
            ['Zdrav fokus', 'Održiva radna disciplina bez lažnih medicinskih tvrdnji.'],
            ['DPL Case Studies', 'Čalije i drugi projekti kao dokaz metode.'],
          ].map(([title, text]) => <article className="dh-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>
    </>
  )
}

function RegulationPage() {
  return (
    <>
      <section className="dh-hero compact">
        <div className="eyebrow">Novosti i regulativa</div>
        <h1>Regulativa nije fusnota. Ona je deo sistema.</h1>
        <p className="hero-lead">
          Ovaj deo prati promene koje utiču na AI, affiliate, digitalne proizvode, podatke, platforme i DACH tržište.
        </p>
      </section>

      <section className="dh-section">
        <div className="card-grid two">
          {regulationItems.map(([title, text]) => (
            <article className="dh-card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dh-section disclaimer">
        <p className="section-kicker">Pravna granica</p>
        <h2>Monitoring nije pravni savet.</h2>
        <p>
          Sadržaj o zakonima i regulativi služi za orijentaciju i strukturisanje pitanja.
          Finalnu pravnu proveru mora uraditi kvalifikovan stručnjak.
        </p>
      </section>
    </>
  )
}

function ReviewbookPage() {
  return (
    <>
      <section className="dh-hero compact">
        <div className="eyebrow">Knjiga utisaka</div>
        <h1>Knjiga utisaka je trust layer, ne marketing trik.</h1>
        <p className="hero-lead">
          Knjiga utisaka služi za iskustva korisnika, studije slučaja i feedback. Lažni review-i i manipulacija su zabranjeni.
        </p>
      </section>

      <section className="dh-section split">
        <div>
          <p className="section-kicker">Status</p>
          <h2>U V1.1 knjiga utisaka je struktura. Forma ide tek kada backend bude spreman.</h2>
        </div>
        <div className="stack-list">
          <div><strong>Moderacija:</strong> svaki unos mora proći proveru.</div>
          <div><strong>Transparentnost:</strong> nema skrivenog editovanja smisla izjave.</div>
          <div><strong>Feedback loop:</strong> kritika se koristi za poboljšanje sistema.</div>
          <div><strong>DPL Case Studies:</strong> samo uz dozvolu i jasno označen kontekst.</div>
        </div>
      </section>
    </>
  )
}

function PartnerPage() {
  return (
    <>
      <section className="dh-hero compact">
        <div className="eyebrow">Partneri</div>
        <h1>Saradnici, affiliate i alati ulaze samo kroz proveru.</h1>
        <p className="hero-lead">
          DaniniHub ne promoviše nasumične alate. Partner mora imati vrednost, reputaciju, stabilnost i legalnu čistoću.
        </p>
        <div className="hero-actions">
          <a className="btn-primary" href="https://danininet.daninihub.com/sr/blog/poziv-za-saradnike-proizvode-i-partnere">Poziv za saradnike</a>
        </div>
      </section>

      <section className="dh-section">
        <div className="card-grid three">
          <article className="dh-card"><h3>Saradnici</h3><p>Eksperti, mentori, kreatori, tehnički i content partneri.</p></article>
          <article className="dh-card"><h3>Affiliate</h3><p>Transparentan sistem preporuka, bez prikrivenih interesa.</p></article>
          <article className="dh-card"><h3>Provera partnera</h3><p>Kvalitet, support, reputacija, refund politika, etika i region.</p></article>
        </div>
      </section>
    </>
  )
}

function LegalPage() {
  return (
    <>
      <section className="dh-hero compact">
        <div className="eyebrow">Pravni centar</div>
        <h1>Pravni okvir, AI transparentnost i prava nad podacima moraju biti vidljivi od početka.</h1>
        <p className="hero-lead">
          Finalni pravni tekstovi se validiraju odvojeno. V1.1 postavlja strukturu i granice odgovornosti.
        </p>
      </section>

      <section className="dh-section">
        <div className="legal-list">
          {legalItems.map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      <section className="dh-section disclaimer">
        <p className="section-kicker">Disclaimer</p>
        <h2>Bez lažnih obećanja.</h2>
        <p>
          DaniniHub ne pruža pravni, poreski, finansijski, medicinski ili investicioni savet.
          Ne garantuje prihod, prodaju, rangiranje, investitore, zdravstveni ishod ili poslovni uspeh.
          AI je podrška za strukturu i analizu; konačna odluka ostaje kod čoveka.
        </p>
      </section>
    </>
  )
}

function PublicLanding() {
  const [activePage, setActivePage] = useState('home')

  const page = useMemo(() => {
    switch (activePage) {
      case 'method':
        return <MethodPage />
      case 'project':
        return <ProjectPage />
      case 'knowledge':
        return <KnowledgePage />
      case 'regulation':
        return <RegulationPage />
      case 'reviewbook':
        return <ReviewbookPage />
      case 'partner':
        return <PartnerPage />
      case 'legal':
        return <LegalPage />
      default:
        return <HomePage setActivePage={setActivePage} />
    }
  }, [activePage])

  return (
    <Shell activePage={activePage} setActivePage={setActivePage}>
      {page}
    </Shell>
  )
}

export default PublicLanding
