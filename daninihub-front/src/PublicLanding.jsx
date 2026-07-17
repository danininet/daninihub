import './App.css'

const languageLabels = { de: 'DE', sr: 'SR', en: 'EN' }

export default function PublicLanding({ lang, setLang, t }) {
  return (
    <main className="dh-page">
      <header className="dh-nav">
        <a className="dh-brand" href="/">
          <span className="dh-mark">DH</span>
          <span>DaniniHub</span>
        </a>
        <nav aria-label={t.languageNavigation}>
          {Object.entries(languageLabels).map(([code, label]) => (
            <button
              key={code}
              className={lang === code ? 'nav-link active' : 'nav-link'}
              onClick={() => setLang(code)}
              aria-pressed={lang === code}
            >
              {label}
            </button>
          ))}
          <a className="nav-cta" href="/api/entry/12-eur/checkout">{t.ctaShort}</a>
        </nav>
      </header>

      <section className="dh-hero">
        <div className="eyebrow">{t.eyebrow}</div>
        <h1>{t.title}</h1>
        <p className="hero-lead">{t.lead}</p>
        <div className="hero-actions">
          <a className="btn-primary" href="/api/entry/12-eur/checkout">{t.cta}</a>
          <a className="btn-secondary" href="#ablauf">{t.howItWorks}</a>
        </div>
        <div className="trust-row">
          {t.facts.map((fact) => <span key={fact}>{fact}</span>)}
        </div>
      </section>

      <section className="dh-section" id="ablauf">
        <p className="section-kicker">{t.processLabel}</p>
        <h2>{t.processTitle}</h2>
        <div className="card-grid three">
          {t.steps.map((step, index) => (
            <article className="dh-card" key={step.title}>
              <span className="section-kicker">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dh-section dark-block">
        <p className="section-kicker">{t.resultLabel}</p>
        <h2>{t.resultTitle}</h2>
        <div className="stack-list">
          {t.resultItems.map((item) => <div key={item}>{item}</div>)}
        </div>
      </section>

      <section className="dh-section entry">
        <div>
          <p className="section-kicker">{t.priceLabel}</p>
          <h2>{t.priceTitle}</h2>
          <p>{t.priceText}</p>
        </div>
        <div className="price-box">
          <span className="price">12 €</span>
          <p>{t.oneTime}</p>
          <a className="btn-primary full" href="/api/entry/12-eur/checkout">{t.cta}</a>
        </div>
      </section>

      <section className="dh-section disclaimer">
        <p className="section-kicker">{t.transparencyLabel}</p>
        <h2>{t.transparencyTitle}</h2>
        <p>{t.transparencyText}</p>
      </section>

      <footer className="dh-footer">
        <div className="footer-brand">
          <span className="dh-mark">DH</span>
          <div><strong>DaniniHub</strong><p>{t.footer}</p></div>
        </div>
      </footer>
    </main>
  )
}
