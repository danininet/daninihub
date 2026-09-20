import { useEffect, useState } from 'react'
import './ImportOSLanding.css'

const COPY = {
  de: {
    eyebrow:'DANINI IMPORTOS · DE/CH → RS',
    title:'Nicht nur wissen, was ein Auto kostet. Wissen, ob man es überhaupt kaufen sollte.',
    lead:'ImportOS verbindet Einfuhrfähigkeit, Herkunftsnachweis, Zoll/PDV, Betrugsrisiko, Modell-Langzeitdaten und realistische Gesamtkosten in einem Import Passport.',
    action:'Import Passport starten',
    decision:'Entscheidung',
    corridor:'Kostenkorridor',
    fraud:'Fraud Shield',
    importability:'Importability Gate',
    dna:'Model DNA',
    diy:'DIY Route',
    broker:'Vermittler Route',
    sources:'Verifizierte Quellen',
    dealer:'Dealer Radar Pro',
    dealerText:'Für Händler: realen Serbia-Marktwert eingeben und die risikoadjustierte Bruttospanne je Herkunftsszenario sehen.',
    privacy:'Datenschutz'
  },
  sr: {
    eyebrow:'DANINI IMPORTOS · DE/CH → RS',
    title:'Ne samo koliko auto košta. Nego da li uopšte treba da ga kupiš.',
    lead:'ImportOS spaja mogućnost uvoza, poreklo/EUR.1, carinu i PDV, rizik prevare, dugoročnu istoriju modela i realnu ukupnu cenu u jedan Import Passport.',
    action:'Pokreni Import Passport',
    decision:'Odluka',
    corridor:'Raspon troška',
    fraud:'Fraud Shield',
    importability:'Importability Gate',
    dna:'Model DNA',
    diy:'Samostalni uvoz',
    broker:'Preko posrednika',
    sources:'Provereni izvori',
    dealer:'Dealer Radar Pro',
    dealerText:'Za uvoznike: unesi realnu tržišnu vrednost u Srbiji i vidi rizikom korigovanu bruto razliku po scenariju porekla.',
    privacy:'Privatnost'
  }
}

const MODELS = [
  ['', '—'],
  ['mercedes-w204-petrol','Mercedes C-Klasse W204 · Benzin'],
  ['bmw-f10-petrol','BMW 5er F10/F11 · Benzin'],
  ['audi-a4-b8-petrol','Audi A4 B8 · Benzin'],
  ['vw-golf-vii','VW Golf VII']
]

function money(value) {
  return new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(value || 0))
}

function verdict(value, lang) {
  const map = {
    DO_NOT_BUY_YET: lang === 'sr' ? 'NE PLAĆAJ JOŠ' : 'NOCH NICHT KAUFEN',
    VERIFY_BEFORE_PAYMENT: lang === 'sr' ? 'PROVERI PRE UPLATE' : 'VOR ZAHLUNG PRÜFEN',
    CALCULATED_CANDIDATE: lang === 'sr' ? 'KANDIDAT ZA DALJU PROVERU' : 'KANDIDAT FÜR WEITERE PRÜFUNG'
  }
  return map[value] || value
}

export default function ImportOSLanding({ lang='de', onLanguage }) {
  const t = COPY[lang] || COPY.de
  const [form,setForm] = useState({
    sourceCountry:'DE',
    currency:'EUR',
    purchasePrice:10000,
    fxToEur:1.04,
    transportToSerbia:700,
    exportCosts:250,
    inspectionCost:150,
    brokerCost:0,
    complianceCost:0,
    registrationCost:0,
    initialService:500,
    otherCosts:0,
    year:2014,
    euroClass:5,
    originProof:'unknown',
    registrationDoc:true,
    ownershipDoc:true,
    vinProvided:true,
    serbiaMarketValue:14500,
    modelDnaKey:'mercedes-w204-petrol',
    prepaymentRequested:false,
    thirdPartyAccount:false,
    priceAnomaly:false,
    sellerMismatch:false,
    nonEuSpec:false
  })
  const [result,setResult] = useState(null)
  const [state,setState] = useState('idle')

  const set = (key,value) => setForm(prev => ({...prev,[key]:value}))

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = lang === 'sr'
      ? 'Danini ImportOS | Pametna odluka pre uvoza automobila'
      : 'Danini ImportOS | Fahrzeugimport intelligent prüfen'
  }, [lang])

  useEffect(() => {
    set('currency', form.sourceCountry === 'CH' ? 'CHF' : 'EUR')
  }, [form.sourceCountry])

  async function calculate(e) {
    e.preventDefault()
    setState('loading')
    try {
      const response = await fetch('/api/importos/evaluate',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(form)
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'IMPORTOS_FAILED')
      setResult(payload.result)
      setState('done')
      setTimeout(() => document.getElementById('passport-result')?.scrollIntoView({behavior:'smooth'}), 60)
    } catch {
      setState('error')
    }
  }

  return <div className="ios">
    <header className="ios-header">
      <a className="ios-brand" href={'/'+lang+'/'}><strong>Danini</strong><span>ImportOS</span></a>
      <nav><a href="#passport">Import Passport</a><a href="#dna">Model DNA</a><a href="#safebuy">SafeBuy</a><a href="#dealer">Dealer Radar</a></nav>
      <div className="ios-lang"><button className={lang==='de'?'on':''} onClick={() => onLanguage?.('de')}>DE</button><button className={lang==='sr'?'on':''} onClick={() => onLanguage?.('sr')}>SR</button></div>
    </header>

    <main>
      <section className="ios-hero">
        <div>
          <p className="ios-eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="ios-lead">{t.lead}</p>
          <a className="ios-primary" href="#passport">{t.action}</a>
          <div className="ios-pills">
            <span>DE + CH → RS</span><span>Best / Worst Cost</span><span>Origin Risk</span><span>Fraud Shield</span><span>Model DNA</span>
          </div>
        </div>
        <aside className="ios-hero-card">
          <div><span>IMPORTABILITY</span><strong>CHECK</strong></div>
          <div><span>ORIGIN / EUR.1</span><strong>RISK</strong></div>
          <div><span>FRAUD SHIELD</span><strong>SCAN</strong></div>
          <div><span>MODEL DNA</span><strong>EVIDENCE</strong></div>
          <div><span>LANDED COST</span><strong>CORRIDOR</strong></div>
        </aside>
      </section>

      <section className="ios-strip">
        <strong>DECIDE · VERIFY · EXECUTE</strong>
        <p>{lang==='sr'
          ? 'ImportOS ne ocenjuje auto samo po ceni. Odvaja dokumentacioni rizik, poreklo, prevaru, istoriju modela i cenu do tablica — i pokazuje šta mora da se proveri pre uplate.'
          : 'ImportOS bewertet ein Fahrzeug nicht nur nach Preis. Dokumente, Herkunft, Betrugsrisiko, Modellhistorie und Landed Cost werden getrennt bewertet – bevor Geld fließt.'}</p>
      </section>

      <section className="ios-section" id="passport">
        <div className="ios-heading"><p className="ios-eyebrow">IMPORT PASSPORT</p><h2>Jedan auto. Jedna odluka. Svi ključni rizici na jednom mestu.</h2></div>
        <form className="ios-form" onSubmit={calculate}>
          <label>Zemlja<select value={form.sourceCountry} onChange={e=>set('sourceCountry',e.target.value)}><option value="DE">Deutschland</option><option value="CH">Schweiz</option></select></label>
          <label>Kupovna cena<input type="number" min="0" value={form.purchasePrice} onChange={e=>set('purchasePrice',e.target.value)}/></label>
          {form.sourceCountry==='CH' && <label>CHF→EUR kurs<input type="number" step="0.0001" min="0" value={form.fxToEur} onChange={e=>set('fxToEur',e.target.value)}/></label>}
          <label>Transport do Srbije<input type="number" min="0" value={form.transportToSerbia} onChange={e=>set('transportToSerbia',e.target.value)}/></label>
          <label>Izvoz/tablice/dokumenti<input type="number" min="0" value={form.exportCosts} onChange={e=>set('exportCosts',e.target.value)}/></label>
          <label>Pregled vozila<input type="number" min="0" value={form.inspectionCost} onChange={e=>set('inspectionCost',e.target.value)}/></label>
          <label>Godište<input type="number" min="1900" max="2027" value={form.year} onChange={e=>set('year',e.target.value)}/></label>
          <label>Euro norma<input type="number" min="0" max="7" value={form.euroClass} onChange={e=>set('euroClass',e.target.value)}/></label>
          <label>Dokaz porekla<select value={form.originProof} onChange={e=>set('originProof',e.target.value)}><option value="unknown">Nepoznato</option><option value="verified">Proveren</option><option value="missing">Nedostaje</option><option value="promised">Samo obećan</option></select></label>
          <label>Vrednost u Srbiji<input type="number" min="0" value={form.serbiaMarketValue} onChange={e=>set('serbiaMarketValue',e.target.value)}/></label>
          <label className="wide">Model DNA<select value={form.modelDnaKey} onChange={e=>set('modelDnaKey',e.target.value)}>{MODELS.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>

          <div className="ios-checks wide">
            <label><input type="checkbox" checked={form.vinProvided} onChange={e=>set('vinProvided',e.target.checked)}/> VIN dostavljen</label>
            <label><input type="checkbox" checked={form.registrationDoc} onChange={e=>set('registrationDoc',e.target.checked)}/> Saobraćajni dokument</label>
            <label><input type="checkbox" checked={form.ownershipDoc} onChange={e=>set('ownershipDoc',e.target.checked)}/> Ugovor / račun</label>
            <label><input type="checkbox" checked={form.prepaymentRequested} onChange={e=>set('prepaymentRequested',e.target.checked)}/> Traži avans unapred</label>
            <label><input type="checkbox" checked={form.thirdPartyAccount} onChange={e=>set('thirdPartyAccount',e.target.checked)}/> Račun trećeg lica</label>
            <label><input type="checkbox" checked={form.priceAnomaly} onChange={e=>set('priceAnomaly',e.target.checked)}/> Cena sumnjivo niska</label>
            <label><input type="checkbox" checked={form.sellerMismatch} onChange={e=>set('sellerMismatch',e.target.checked)}/> Prodavac ≠ dokument</label>
            <label><input type="checkbox" checked={form.nonEuSpec} onChange={e=>set('nonEuSpec',e.target.checked)}/> Non-EU specifikacija</label>
          </div>

          <button className="ios-primary wide">{state==='loading'?'…':t.action}</button>
          {state==='error' && <p className="ios-error wide">Analiza trenutno nije uspela.</p>}
        </form>
      </section>

      {result && <section className="ios-section" id="passport-result">
        <div className="ios-decision"><span>{t.decision}</span><strong>{verdict(result.decision,lang)}</strong><small>{result.route}</small></div>

        <div className="ios-metrics">
          <article><span>{t.corridor}</span><strong>{money(result.corridor.best)} – {money(result.corridor.worst)}</strong><small>Scenario delta: {money(result.corridor.delta)}</small></article>
          <article><span>{t.importability}</span><strong>{result.importability.status}</strong><small>{result.importability.issues[0]}</small></article>
          <article><span>{t.fraud}</span><strong>{result.fraud.score}/100</strong><small>{result.fraud.verdict}</small></article>
          <article><span>Customs basis</span><strong>{money(result.customsBasis)}</strong><small>Procena, nije carinsko rešenje</small></article>
        </div>

        <div className="ios-scenarios">
          {result.scenarios.map(s => <article key={s.name}><div><span>{s.name==='preferential'?'0% origin scenario':'12.5% standard scenario'}</span><strong>{money(s.total)}</strong></div><p>Carina {money(s.duty)} · PDV {money(s.vat)} {s.grossSpread!==null ? '· bruto razlika '+money(s.grossSpread)+' ('+s.marginPct+'%)' : ''}</p></article>)}
        </div>

        <div className="ios-columns" id="safebuy">
          <div><p className="ios-eyebrow">{t.fraud}</p><h3>Šta zaustavlja uplatu</h3>{result.fraud.flags.length ? result.fraud.flags.map(f=><p className="ios-flag" key={f.code}><strong>{f.code}</strong>{f.text}</p>) : <p className="ios-ok">Nema aktiviranih osnovnih crvenih zastavica u unetim podacima.</p>}</div>
          <div><p className="ios-eyebrow">ORIGIN / EUR.1</p><h3>Ne krijemo fiskalni rizik u jednoj cifri.</h3><p>Ako poreklo nije potvrđeno, ImportOS prikazuje i preferencijalni i standardni scenario umesto lažno precizne ukupne cene.</p></div>
        </div>

        <div className="ios-columns" id="dna">
          <div><p className="ios-eyebrow">{t.dna}</p>{result.modelDna ? <><h3>{result.modelDna.label}</h3><h4>Dokazane prednosti</h4>{result.modelDna.strengths.map(x=><p key={x}>+ {x}</p>)}<h4>Šta proveriti</h4>{result.modelDna.watch.map(x=><p key={x}>→ {x}</p>)}</> : <p>Za ovaj izbor još nema Model DNA profila.</p>}</div>
          <div><p className="ios-eyebrow">LIFETIME SIGNAL</p>{result.modelDna?.timeline.map(x=><div className="ios-timeline" key={x.period}><strong>{x.period}</strong><span>{x.signal}</span><p>{x.note}</p></div>)}</div>
        </div>

        <div className="ios-columns">
          <div><p className="ios-eyebrow">{t.diy}</p>{result.checklists.diy.map((x,i)=><p key={x}><strong>{i+1}.</strong> {x}</p>)}</div>
          <div><p className="ios-eyebrow">{t.broker}</p>{result.checklists.broker.map((x,i)=><p key={x}><strong>{i+1}.</strong> {x}</p>)}</div>
        </div>

        <div className="ios-sources"><p className="ios-eyebrow">{t.sources}</p>{result.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.title} · {s.verifiedAt}</a>)}</div>
      </section>}

      <section className="ios-section" id="dealer">
        <div className="ios-heading"><p className="ios-eyebrow">{t.dealer}</p><h2>Ne traži najjeftiniji auto. Traži najveću maržu posle rizika.</h2><p>{t.dealerText}</p></div>
        <div className="ios-flow"><span>SEARCH</span><span>IMPORTABILITY</span><span>ORIGIN</span><span>MODEL DNA</span><span>FRAUD</span><span>LANDED COST</span><span>RS VALUE</span><strong>RISK-ADJUSTED MARGIN</strong></div>
      </section>
    </main>

    <footer className="ios-footer"><span>Danini ImportOS · DE/CH → RS</span><div><a href={'/'+lang+(lang==='sr'?'/privatnost':'/datenschutz')}>{t.privacy}</a><a href={'/'+lang+'/impressum'}>Impressum</a></div></footer>
  </div>
}
