import { useMemo, useState } from 'react'
import './App.css'

const pages = [
  ['home', 'Start'],
  ['method', 'Methode'],
  ['project', 'Projektmodus'],
  ['knowledge', 'Wissen'],
  ['regulation', 'News & Recht'],
  ['reviewbook', 'Reviewbook'],
  ['partner', 'Partner'],
  ['legal', 'Legal'],
]

const gates = [
  ['Gate 0', 'Fit Check', 'Fokus, kapacitet, realna očekivanja i jedan aktivan projekat.'],
  ['Gate 1', 'Problem Definition', 'Ko ima problem, koji je problem i šta je merljiv ishod.'],
  ['Gate 2', 'Market Reality', 'DACH realnost, konkurencija, cenovni okvir i rizici.'],
  ['Gate 3', 'Offer Blueprint', 'Struktura ponude, deliverables, granice i cena.'],
  ['Gate 4', 'Build Protocol', 'Minimalna infrastruktura: landing, legal, email, payment, tracking.'],
  ['Gate 5', 'Launch & Feedback', 'Jedan kanal, jedan CTA, prvi tržišni signal i odluka.'],
]

const pillars = [
  ['Health', 'Bez burnout logike, bez lažnih medicinskih tvrdnji, sa fokusom na jasnoću i održiv tempo.'],
  ['Income', 'Legalna, etična i transparentna monetizacija bez quick-money obećanja.'],
  ['Intelligence', 'Razumevanje AI, kritičko mišljenje, samostalno odlučivanje i izlazak iz pasivne upotrebe alata.'],
]

const regulationItems = [
  ['GDPR / DSGVO', 'Prava korisnika, obrada podataka, brisanje, eksport, consent i privacy-by-design.'],
  ['EU AI Act', 'Praćenje AI regulative i posledica za AI-assisted procese, sadržaje i proizvode.'],
  ['Affiliate & Disclosure', 'Jasno označavanje affiliate linkova, bez prikrivenih interesa i lažnih preporuka.'],
  ['Platform Rules', 'Google, YouTube, LinkedIn, payment i search promene koje utiču na digitalne projekte.'],
]

const legalItems = [
  'Impressum',
  'Datenschutz',
  'Cookies',
  'Nutzungsbedingungen',
  'Widerruf',
  'KI-Transparenz',
  'Affiliate-Hinweis',
  'Disclaimer',
  'Data Rights',
]

const footerGroups = [
  ['System', ['Was ist DaniniHub', 'Methode', 'Systemverfassung', 'Roadmap', 'Transparenz', 'Audit']],
  ['Projektmodus', ['ENTRY 7€', 'Gate 0–5', 'Project Mode', 'Preise', 'Dashboard']],
  ['Wissen & Recht', ['Wissen', 'News', 'Regulierung', 'GDPR / DSGVO', 'EU AI Act']],
  ['Community', ['Reviewbook', 'Erfahrungen', 'Community', 'Support', 'Feedback']],
  ['Partner', ['Saradnici', 'Partner werden', 'Affiliate Programm', 'Affiliate Hinweis']],
  ['Legal', legalItems.slice(0, 6)],
]

function Shell({ activePage, setActivePage, children }) {
  return (
    <main className="dh-page">
      <header className="dh-nav">
        <button className="dh-brand reset-button" onClick={() => setActivePage('home')}>
          <span className="dh-mark">DH</span>
          <span>DaniniHub</span>
        </button>

        <nav aria-label="Main navigation">
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
          <p>Initiator: Danini Net · Co-Creator: AI System · Method: Pitaj AI — AI pita tebe</p>
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
        <div className="eyebrow">DACH-orientierte KI-Entscheidungsarchitektur</div>
        <h1>DaniniHub je sistem. DaniniNet je javni kanal. Calije je dokaz metode.</h1>
        <p className="hero-lead">
          DaniniHub nije chatbot, kurs ni prompt paket. To je strukturirani projektni režim koji vodi korisnika
          od ideje, preko tržišne realnosti, do jasne ponude i prvog launch signala.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setActivePage('project')}>ENTRY 7€ / Project Mode</button>
          <button className="btn-secondary" onClick={() => setActivePage('method')}>Pogledaj metodu</button>
        </div>

        <div className="trust-row">
          <span>No quick-money</span>
          <span>Human decision first</span>
          <span>GDPR / DSGVO layer</span>
          <span>No donations</span>
          <span>DACH-first</span>
        </div>
      </section>

      <section className="dh-section split">
        <div>
          <p className="section-kicker">System Relation</p>
          <h2>DaniniNet, DaniniHub i Calije ne smeju da se mešaju — moraju da se povežu.</h2>
        </div>
        <div className="stack-list">
          <div><strong>DaniniHub:</strong> sistem, metoda, agenti, Gate 0–5, decision infrastructure.</div>
          <div><strong>DaniniNet:</strong> javni marketing, affiliate i prodajni kanal za edukativne/digitalne proizvode.</div>
          <div><strong>Calije Park Residence:</strong> case study — dokaz kako lokacija postaje digitalni gateway.</div>
        </div>
      </section>

      <section className="dh-section">
        <p className="section-kicker">Triad Principle</p>
        <h2>Svaka funkcija mora služiti: Health, Income, Intelligence.</h2>
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
        <p className="section-kicker">Case Study</p>
        <h2>Calije Park Residence kao dokaz metode, ne kao zamena za DaniniHub.</h2>
        <div className="case-panel">
          <div>
            <h3>Digital Gateway za realnu lokaciju</h3>
            <p>
              Calije pokazuje kako se realna lokacija pretvara u javni prezentacioni sloj,
              privatni brief, lead tok, multi-language pristup, legal disclaimere i tržišni signal.
            </p>
          </div>
          <div className="case-points">
            <span>Public site</span>
            <span>Private brief</span>
            <span>Lead flow</span>
            <span>SR / DE / EN</span>
            <span>Visual evidence</span>
            <span>Legal boundary</span>
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
        <div className="eyebrow">Method</div>
        <h1>Pitaj AI — AI pita tebe.</h1>
        <p className="hero-lead">
          Metoda ne postoji da produži razgovor. Postoji da smanji maglu, natera fokus i dovede do odluke.
        </p>
      </section>

      <section className="dh-section split">
        <div>
          <p className="section-kicker">Protocol</p>
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
        <p className="section-kicker">Decision status</p>
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
        <div className="eyebrow">Project Mode</div>
        <h1>Jedan aktivni projekat. Šest Gate-ova. Jedan decision report.</h1>
        <p className="hero-lead">
          ENTRY od 7€ aktivira ograničen, jasan i proverljiv projektni ciklus: Gate 0→5,
          Project Activation Pack PDF, email isporuku i pristup Project Mode UI-u.
        </p>
      </section>

      <section className="dh-section entry">
        <div>
          <p className="section-kicker">ENTRY</p>
          <h2>7€ jednokratni ulaz u Project Mode.</h2>
          <p>
            Nije pretplata, nije donacija i nije obećanje zarade. To je ulaz u strukturirani proces
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
        <p className="section-kicker">Gate System</p>
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
        <div className="eyebrow">Wissen</div>
        <h1>Znanje koje vodi ka primeni, ne ka preopterećenju.</h1>
        <p className="hero-lead">
          DaniniHub Wissen centar spaja AI, digitalne projekte, zdrav fokus, monetizaciju i DACH realnost.
        </p>
      </section>

      <section className="dh-section">
        <div className="card-grid three">
          {[
            ['KI & Entscheidungen', 'Kako koristiti AI za odluke, ne za pasivno generisanje teksta.'],
            ['Projektklarheit', 'Kako definisati problem, publiku, ponudu i sledeći korak.'],
            ['Digital Business', 'Realistična digitalna ponuda, bez guru marketinga.'],
            ['Affiliate & Monetarisierung', 'Etička monetizacija, disclosure i partner vetting.'],
            ['Health & Fokus', 'Održiva radna disciplina bez lažnih medicinskih tvrdnji.'],
            ['Case Studies', 'Calije i drugi projekti kao dokaz metode.'],
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
        <div className="eyebrow">News & Recht</div>
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
        <p className="section-kicker">Legal boundary</p>
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
        <div className="eyebrow">Reviewbook</div>
        <h1>Knjiga utisaka je trust layer, ne marketing trik.</h1>
        <p className="hero-lead">
          Reviewbook služi za iskustva korisnika, studije slučaja i feedback. Lažni review-i i manipulacija su zabranjeni.
        </p>
      </section>

      <section className="dh-section split">
        <div>
          <p className="section-kicker">Status</p>
          <h2>U V1.1 reviewbook je struktura. Forma ide tek kada backend bude spreman.</h2>
        </div>
        <div className="stack-list">
          <div><strong>Moderacija:</strong> svaki unos mora proći proveru.</div>
          <div><strong>Transparentnost:</strong> nema skrivenog editovanja smisla izjave.</div>
          <div><strong>Feedback loop:</strong> kritika se koristi za poboljšanje sistema.</div>
          <div><strong>Case studies:</strong> samo uz dozvolu i jasno označen kontekst.</div>
        </div>
      </section>
    </>
  )
}

function PartnerPage() {
  return (
    <>
      <section className="dh-hero compact">
        <div className="eyebrow">Partner</div>
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
          <article className="dh-card"><h3>Vetting</h3><p>Kvalitet, support, reputacija, refund politika, etika i region.</p></article>
        </div>
      </section>
    </>
  )
}

function LegalPage() {
  return (
    <>
      <section className="dh-hero compact">
        <div className="eyebrow">Legal Center</div>
        <h1>Legal, AI transparency i data rights moraju biti vidljivi od početka.</h1>
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
