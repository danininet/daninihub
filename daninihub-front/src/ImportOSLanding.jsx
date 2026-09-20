import { useEffect, useState } from 'react'
import './ImportOSLanding.css'

const COPY={
  de:{
    eyebrow:'DANINI IMPORTOS · DE/CH → RS',
    title:'Nicht nur wissen, was ein Auto kostet. Wissen, ob man es überhaupt kaufen sollte.',
    lead:'ImportOS verbindet Einfuhrfähigkeit, Herkunft/EUR.1, Zoll und PDV, Betrugsrisiko, Model DNA, Vor-Ort-Prüfung, Fahrer-Service und realistische Gesamtkosten in einem System.',
    start:'Kostenlosen QuickCheck starten',
    decision:'Entscheidung',corridor:'Kostenkorridor',fraud:'Fraud Shield',importability:'Importability Gate',dna:'Model DNA',
    dealer:'Dealer Radar Pro',privacy:'Datenschutz',
    paidTitle:'Vollständiger Import Passport',
    paidText:'Der QuickCheck zeigt die Richtung. Der bezahlte Passport schaltet vollständige Fraud-Flags, Model-DNA-Stärken/Schwächen, DIY-/Vermittler-Route und Quellen frei.',
    buy:'Import Passport für 9,90 € kaufen',
    email:'E-Mail für Kauf und Report',
    terms:'Ich akzeptiere den Nutzungsrahmen und verstehe, dass ImportOS eine Entscheidungshilfe und keine verbindliche Zoll-, Steuer-, Zulassungs- oder technische Entscheidung ist.',
    fieldTitle:'Vom Bildschirm bis zum echten Auto',
    fieldLead:'ImportOS endet nicht beim Rechner. Auf Wunsch folgt ein realer Vor-Ort-Termin ab Duisburg oder eine Fahrer-Überführung auf eigener Achse.',
    visitTitle:'FieldCheck Live · Besichtigung vor Ort',
    visitText:'Live-Video, Fotos, sichtbarer Zustand, Papiere und Verkäuferfragen. Keine Kfz-Sachverständigenprüfung und keine mechanische Garantie.',
    visitKm:'Entfernung vom Duisburger Startpunkt, einfache Strecke (km)',
    driveTitle:'Drive2Destination · nur Fahrerleistung',
    driveText:'Fahrerleistung auf eigener Achse. Fahrzeug, Zulassung/Exportkennzeichen, Versicherung, Kraftstoff, Maut, Rückreise und Grenz-/Zollkosten bleiben separat und werden vor Auftrag schriftlich geklärt.',
    driveKm:'Fahrstrecke vom Abholort bis Ziel (km)',
    estimate:'Preisrahmen berechnen',
    baseTitle:'Import Base Čalije · Niš',
    baseText:'Für Importeure kann zusätzlich eine physische Verkaufs-/Abstell-/Übergabebasis auf den Eigentümerflächen in Čalije angeboten werden: Block A, Block B oder Teilfläche. Kapazität, Zufahrt, Mietpreis und zulässige Nutzung werden vor Vertrag technisch und rechtlich bestätigt.',
    baseCta:'Import Base Čalije ansehen',
    dealerText:'Für professionelle Importeure: Serbia-Marktwert eintragen und je Herkunftsszenario die risikoadjustierte Bruttospanne sehen. Nächste Stufe: automatischer Deal-Radar statt manueller Einzelrechnung.'
  },
  sr:{
    eyebrow:'DANINI IMPORTOS · DE/CH → RS',
    title:'Ne samo koliko auto košta. Nego da li uopšte treba da ga kupiš.',
    lead:'ImportOS spaja mogućnost uvoza, poreklo/EUR.1, carinu i PDV, rizik prevare, Model DNA, obilazak vozila, uslugu vozača i realnu ukupnu cenu u jedan sistem.',
    start:'Pokreni besplatan QuickCheck',
    decision:'Odluka',corridor:'Raspon troška',fraud:'Fraud Shield',importability:'Importability Gate',dna:'Model DNA',
    dealer:'Dealer Radar Pro',privacy:'Privatnost',
    paidTitle:'Kompletan Import Passport',
    paidText:'QuickCheck pokazuje pravac. Plaćeni Passport otključava sve Fraud zastavice, Model DNA prednosti/mane, DIY i posrednički tok i proverene izvore.',
    buy:'Kupi Import Passport za 9,90 €',
    email:'Email za kupovinu i izveštaj',
    terms:'Prihvatam okvir korišćenja i razumem da je ImportOS pomoć pri odluci, a ne zvanična carinska, poreska, registraciona ili tehnička odluka.',
    fieldTitle:'Od ekrana do stvarnog automobila',
    fieldLead:'ImportOS se ne završava kalkulatorom. Po želji sledi stvarni obilazak vozila iz Duisburga ili usluga vozača do dogovorenog odredišta.',
    visitTitle:'FieldCheck Live · obilazak vozila',
    visitText:'Live video, fotografije, vidljivo stanje, dokumenti i pitanja prodavcu. Nije Kfz-Gutachten, nije stručna mehanička garancija.',
    visitKm:'Udaljenost od Duisburga do vozila, jedan smer (km)',
    driveTitle:'Drive2Destination · samo usluga vozača',
    driveText:'Usluga vožnje auta na sopstvenoj osovini. Vozilo, legalne tablice/izvozne tablice, osiguranje, gorivo, putarine, povrat vozača i granični/carinski troškovi računaju se odvojeno i potvrđuju pre naloga.',
    driveKm:'Kilometraža od mesta preuzimanja do odredišta',
    estimate:'Izračunaj okvir',
    baseTitle:'Import Base Čalije · Niš',
    baseText:'Za uvoznike možemo ponuditi i fizičku prodajnu/parking/primopredajnu bazu na vlasničkim parcelama u Čalijama: Blok A, Blok B ili deo površine. Kapacitet, prilaz, zakupnina i dozvoljena namena potvrđuju se tehnički i pravno pre ugovora.',
    baseCta:'Pogledaj Import Base Čalije',
    dealerText:'Za profesionalne uvoznike: unesi realnu tržišnu vrednost u Srbiji i vidi rizikom korigovanu bruto razliku za svaki scenario porekla. Sledeći nivo je automatski Deal Radar, ne ručni kalkulator.'
  }
}

const MODELS=[
  ['','—'],
  ['mercedes-w204-petrol','Mercedes C-Klasse W204 · Benzin'],
  ['bmw-f10-petrol','BMW 5er F10/F11 · Benzin'],
  ['audi-a4-b8-petrol','Audi A4 B8 · Benzin'],
  ['vw-golf-vii','VW Golf VII']
]

function money(value){return new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(value||0))}
function verdict(value,lang){
  const map={
    DO_NOT_BUY_YET:lang==='sr'?'NE PLAĆAJ JOŠ':'NOCH NICHT KAUFEN',
    VERIFY_BEFORE_PAYMENT:lang==='sr'?'PROVERI PRE UPLATE':'VOR ZAHLUNG PRÜFEN',
    CALCULATED_CANDIDATE:lang==='sr'?'KANDIDAT ZA DALJU PROVERU':'KANDIDAT FÜR WEITERE PRÜFUNG'
  }
  return map[value]||value
}

export default function ImportOSLanding({lang='de',onLanguage}){
  const t=COPY[lang]||COPY.de
  const [form,setForm]=useState({
    sourceCountry:'DE',currency:'EUR',purchasePrice:10000,fxToEur:1.04,transportToSerbia:700,exportCosts:250,inspectionCost:150,
    brokerCost:0,complianceCost:0,registrationCost:0,initialService:500,otherCosts:0,year:2014,euroClass:5,originProof:'unknown',
    registrationDoc:true,ownershipDoc:true,vinProvided:true,serbiaMarketValue:14500,modelDnaKey:'mercedes-w204-petrol',
    prepaymentRequested:false,thirdPartyAccount:false,priceAnomaly:false,sellerMismatch:false,nonEuSpec:false
  })
  const [result,setResult]=useState(null)
  const [state,setState]=useState('idle')
  const [buyer,setBuyer]=useState({email:'',termsAccepted:false})
  const [checkoutState,setCheckoutState]=useState('')
  const [field,setField]=useState({visitOneWayKm:50,driveKm:0})
  const [fieldResult,setFieldResult]=useState(null)

  const set=(key,value)=>setForm(prev=>({...prev,[key]:value}))

  useEffect(()=>{
    document.documentElement.lang=lang
    document.title=lang==='sr'?'Danini ImportOS | Uvoz automobila DE/CH → Srbija':'Danini ImportOS | Fahrzeugimport DE/CH → Serbien'
  },[lang])

  useEffect(()=>{set('currency',form.sourceCountry==='CH'?'CHF':'EUR')},[form.sourceCountry])

  async function calculate(e){
    e?.preventDefault();setState('loading')
    try{
      const r=await fetch('/api/importos/evaluate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
      const p=await r.json();if(!r.ok)throw new Error(p.error||'IMPORTOS_FAILED')
      setResult(p.result);setState('done')
      setTimeout(()=>document.getElementById('passport-result')?.scrollIntoView({behavior:'smooth'}),60)
    }catch{setState('error')}
  }

  async function buyPassport(){
    setCheckoutState('loading')
    try{
      const r=await fetch('/api/importos/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:buyer.email,termsAccepted:buyer.termsAccepted,language:lang,vehicle:form})})
      const p=await r.json()
      if(!r.ok)throw new Error(p.error||'CHECKOUT_FAILED')
      location.href=p.checkoutUrl
    }catch(err){setCheckoutState(err.message||'CHECKOUT_FAILED')}
  }

  async function estimateField(){
    try{
      const r=await fetch('/api/importos/services/estimate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(field)})
      const p=await r.json();if(!r.ok)throw new Error(p.error)
      setFieldResult(p.estimate)
    }catch{setFieldResult(null)}
  }

  return <div className="ios">
    <header className="ios-header">
      <a className="ios-brand" href={'/'+lang+'/'}><strong>Danini</strong><span>ImportOS</span></a>
      <nav><a href="#passport">Import Passport</a><a href="#safebuy">SafeBuy</a><a href="#fieldops">FieldOps</a><a href="#base">Import Base</a><a href="#dealer">Dealer Radar</a></nav>
      <div className="ios-lang"><button className={lang==='de'?'on':''} onClick={()=>onLanguage?.('de')}>DE</button><button className={lang==='sr'?'on':''} onClick={()=>onLanguage?.('sr')}>SR</button></div>
    </header>

    <main>
      <section className="ios-hero">
        <div>
          <p className="ios-eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="ios-lead">{t.lead}</p>
          <a className="ios-primary" href="#passport">{t.start}</a>
          <div className="ios-pills"><span>Import Passport</span><span>SafeBuy</span><span>Model DNA</span><span>FieldCheck Live</span><span>Drive2Destination</span><span>Import Base Čalije</span></div>
        </div>
        <aside className="ios-hero-card">
          <div><span>IMPORTABILITY</span><strong>CHECK</strong></div>
          <div><span>ORIGIN / EUR.1</span><strong>RISK</strong></div>
          <div><span>FRAUD SHIELD</span><strong>SCAN</strong></div>
          <div><span>MODEL DNA</span><strong>EVIDENCE</strong></div>
          <div><span>FIELD OPS</span><strong>EXECUTE</strong></div>
        </aside>
      </section>

      <section className="ios-strip"><strong>DECIDE · VERIFY · EXECUTE</strong><p>{lang==='sr'?'Digitalna odluka + fizička provera + logistički koraci + opcionalna baza za uvoznika. Cilj nije još jedan kalkulator nego ceo tok od oglasa do odluke i preuzimanja.':'Digitale Entscheidung + physische Prüfung + Ausführung + optionale Import-Basis. Kein weiterer Zollrechner, sondern ein Weg vom Inserat bis zur abgesicherten Kaufentscheidung.'}</p></section>

      <section className="ios-section" id="passport">
        <div className="ios-heading"><p className="ios-eyebrow">FREE QUICKCHECK</p><h2>{lang==='sr'?'Prvo proveri da li auto uopšte zaslužuje dalji novac.':'Erst prüfen, ob das Fahrzeug weiteres Geld verdient.'}</h2></div>
        <form className="ios-form" onSubmit={calculate}>
          <label>{lang==='sr'?'Zemlja':'Quelle'}<select value={form.sourceCountry} onChange={e=>set('sourceCountry',e.target.value)}><option value="DE">Deutschland</option><option value="CH">Schweiz</option></select></label>
          <label>{lang==='sr'?'Kupovna cena':'Kaufpreis'}<input type="number" min="0" value={form.purchasePrice} onChange={e=>set('purchasePrice',e.target.value)}/></label>
          {form.sourceCountry==='CH'&&<label>CHF→EUR<input type="number" step="0.0001" min="0" value={form.fxToEur} onChange={e=>set('fxToEur',e.target.value)}/></label>}
          <label>{lang==='sr'?'Transport do Srbije':'Transport bis Serbien'}<input type="number" min="0" value={form.transportToSerbia} onChange={e=>set('transportToSerbia',e.target.value)}/></label>
          <label>{lang==='sr'?'Izvoz/tablice/dokumenti':'Export/Kennzeichen/Dokumente'}<input type="number" min="0" value={form.exportCosts} onChange={e=>set('exportCosts',e.target.value)}/></label>
          <label>{lang==='sr'?'Pregled vozila':'Fahrzeugcheck'}<input type="number" min="0" value={form.inspectionCost} onChange={e=>set('inspectionCost',e.target.value)}/></label>
          <label>{lang==='sr'?'Godište':'Baujahr'}<input type="number" min="1900" max="2027" value={form.year} onChange={e=>set('year',e.target.value)}/></label>
          <label>Euro<input type="number" min="0" max="7" value={form.euroClass} onChange={e=>set('euroClass',e.target.value)}/></label>
          <label>Origin / EUR.1<select value={form.originProof} onChange={e=>set('originProof',e.target.value)}><option value="unknown">{lang==='sr'?'Nepoznato':'Unklar'}</option><option value="verified">{lang==='sr'?'Proveren':'Verifiziert'}</option><option value="missing">{lang==='sr'?'Nedostaje':'Fehlt'}</option><option value="promised">{lang==='sr'?'Samo obećan':'Nur versprochen'}</option></select></label>
          <label>{lang==='sr'?'Vrednost u Srbiji':'Marktwert Serbien'}<input type="number" min="0" value={form.serbiaMarketValue} onChange={e=>set('serbiaMarketValue',e.target.value)}/></label>
          <label className="wide">Model DNA<select value={form.modelDnaKey} onChange={e=>set('modelDnaKey',e.target.value)}>{MODELS.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
          <div className="ios-checks wide">
            <label><input type="checkbox" checked={form.vinProvided} onChange={e=>set('vinProvided',e.target.checked)}/> VIN</label>
            <label><input type="checkbox" checked={form.registrationDoc} onChange={e=>set('registrationDoc',e.target.checked)}/> {lang==='sr'?'Saobraćajni dokument':'Fahrzeugpapiere'}</label>
            <label><input type="checkbox" checked={form.ownershipDoc} onChange={e=>set('ownershipDoc',e.target.checked)}/> {lang==='sr'?'Račun / ugovor':'Rechnung / Vertrag'}</label>
            <label><input type="checkbox" checked={form.prepaymentRequested} onChange={e=>set('prepaymentRequested',e.target.checked)}/> {lang==='sr'?'Traži avans':'Vorkasse verlangt'}</label>
            <label><input type="checkbox" checked={form.thirdPartyAccount} onChange={e=>set('thirdPartyAccount',e.target.checked)}/> {lang==='sr'?'Račun trećeg lica':'Dritt-Konto'}</label>
            <label><input type="checkbox" checked={form.priceAnomaly} onChange={e=>set('priceAnomaly',e.target.checked)}/> {lang==='sr'?'Sumnjivo niska cena':'Preis auffällig niedrig'}</label>
            <label><input type="checkbox" checked={form.sellerMismatch} onChange={e=>set('sellerMismatch',e.target.checked)}/> {lang==='sr'?'Prodavac ≠ dokument':'Verkäufer ≠ Dokument'}</label>
            <label><input type="checkbox" checked={form.nonEuSpec} onChange={e=>set('nonEuSpec',e.target.checked)}/> Non-EU spec</label>
          </div>
          <button className="ios-primary wide">{state==='loading'?'…':t.start}</button>
        </form>
      </section>

      {result&&<section className="ios-section" id="passport-result">
        <div className="ios-decision"><span>{t.decision}</span><strong>{verdict(result.decision,lang)}</strong><small>{result.route}</small></div>
        <div className="ios-metrics">
          <article><span>{t.corridor}</span><strong>{money(result.corridor.best)} – {money(result.corridor.worst)}</strong><small>Delta {money(result.corridor.delta)}</small></article>
          <article><span>{t.importability}</span><strong>{result.importability.status}</strong><small>{result.importability.issues[0]}</small></article>
          <article><span>{t.fraud}</span><strong>{result.fraud.score}/100</strong><small>{result.fraud.flagCount} {lang==='sr'?'aktivnih signala':'aktive Signale'}</small></article>
          <article><span>Model DNA</span><strong>{result.modelDna?.sourceQuality||'—'}</strong><small>{result.modelDna?.label||'No profile'}</small></article>
        </div>
        <div className="ios-scenarios">{result.scenarios.map(s=><article key={s.name}><div><span>{s.name==='preferential'?'0% origin scenario':'12.5% standard scenario'}</span><strong>{money(s.total)}</strong></div><p>Carina {money(s.duty)} · PDV {money(s.vat)} {s.grossSpread!==null?'· spread '+money(s.grossSpread):''}</p></article>)}</div>

        <section className="ios-paywall" id="safebuy">
          <div><p className="ios-eyebrow">FULL REPORT · 9,90 €</p><h2>{t.paidTitle}</h2><p>{t.paidText}</p><div className="ios-pills"><span>Full Fraud Flags</span><span>Model DNA Timeline</span><span>DIY Route</span><span>Broker Route</span><span>Source Links</span></div></div>
          <div className="ios-buybox"><label>{t.email}<input type="email" value={buyer.email} onChange={e=>setBuyer(x=>({...x,email:e.target.value}))}/></label><label className="ios-terms"><input type="checkbox" checked={buyer.termsAccepted} onChange={e=>setBuyer(x=>({...x,termsAccepted:e.target.checked}))}/><span>{t.terms}</span></label><button className="ios-primary" onClick={buyPassport}>{checkoutState==='loading'?'…':t.buy}</button>{checkoutState&&checkoutState!=='loading'&&<small className="ios-error">{checkoutState==='CHECKOUT_PENDING_LEGAL_ACTIVATION'?(lang==='sr'?'Checkout je tehnički spreman, ali javno plaćanje još čeka finalnu poslovno-poresku aktivaciju.':'Checkout ist technisch fertig; die öffentliche Zahlung wartet noch auf die finale Geschäfts-/Steueraktivierung.'):checkoutState}</small>}</div>
        </section>
      </section>}

      <section className="ios-section" id="fieldops">
        <div className="ios-heading"><p className="ios-eyebrow">FIELD OPS · DUISBURG</p><h2>{t.fieldTitle}</h2><p>{t.fieldLead}</p></div>
        <div className="ios-columns">
          <article className="ios-service"><p className="ios-eyebrow">FIELD CHECK LIVE</p><h3>{t.visitTitle}</h3><p>{t.visitText}</p><label>{t.visitKm}<input type="number" min="0" value={field.visitOneWayKm} onChange={e=>setField(x=>({...x,visitOneWayKm:e.target.value}))}/></label>{fieldResult&&<div className="ios-service-price"><span>{lang==='sr'?'Procena usluge':'Leistungsrahmen'}</span><strong>{money(fieldResult.liveVisit.estimatedServiceFee)}</strong><small>59 € + 0,45 €/km povratne kilometraže · minimum 79 €</small></div>}</article>
          <article className="ios-service"><p className="ios-eyebrow">DRIVE2DESTINATION</p><h3>{t.driveTitle}</h3><p>{t.driveText}</p><label>{t.driveKm}<input type="number" min="0" value={field.driveKm} onChange={e=>setField(x=>({...x,driveKm:e.target.value}))}/></label>{fieldResult&&<div className="ios-service-price"><span>{lang==='sr'?'Samo naknada vozaču':'Nur Fahrerleistung'}</span><strong>{money(fieldResult.driverOnly.estimatedDriverFee)}</strong><small>99 € + 0,55 €/km · minimum 149 € · realni prateći troškovi odvojeno</small></div>}</article>
        </div>
        <button className="ios-primary" onClick={estimateField}>{t.estimate}</button>
        <p className="ios-note">{lang==='sr'?'Pre prihvatanja vožnje moraju biti potvrđeni tehnička ispravnost, legalne tablice/registracija za rutu, osiguranje i pisano ovlašćenje. Za stručni pregled vozila po potrebi angažuje se nezavisni Kfz stručnjak.':'Vor Annahme einer Überführungsfahrt müssen Fahrbereitschaft, legale Kennzeichen/Zulassung für die Route, Versicherung und schriftliche Vollmacht bestätigt sein. Für ein technisches Gutachten wird bei Bedarf ein unabhängiger Kfz-Sachverständiger beauftragt.'}</p>
      </section>

      <section className="ios-section" id="base">
        <div className="ios-heading"><p className="ios-eyebrow">PHYSICAL IMPORT BASE</p><h2>{t.baseTitle}</h2><p>{t.baseText}</p></div>
        <div className="ios-base-grid">
          <article><span>BLOCK A</span><strong>{lang==='sr'?'Zakup cele ili dela površine':'Gesamt- oder Teilflächenmiete'}</strong><p>{lang==='sr'?'Za uvoznika, prodajni plac, privremeno držanje vozila ili primopredaju — tek nakon potvrde uslova.':'Für Importeur, Verkaufsfläche, Zwischenabstellung oder Übergabe – nach Bestätigung der Rahmenbedingungen.'}</p></article>
          <article><span>BLOCK B</span><strong>{lang==='sr'?'Skalabilna B2B baza':'Skalierbare B2B-Basis'}</strong><p>{lang==='sr'?'Moguć zaseban zakup ili kombinacija sa drugim blokom. Bez unapred izmišljene kapacitivnosti.':'Separat oder kombiniert nutzbar. Keine erfundene Fahrzeugkapazität vor Vermessung und Freigabe.'}</p></article>
          <article><span>IMPORTOS + BASE</span><strong>{lang==='sr'?'Digitalni sistem + fizička lokacija':'Digitales System + physischer Standort'}</strong><p>{lang==='sr'?'Dealer Radar, Import Passport, pregled vozila, dovoz, dokumentacioni tok i opcionalna baza u Nišu kao jedan ekosistem.':'Dealer Radar, Import Passport, Fahrzeugcheck, Überführung, Dokumentenfluss und optionale Basis in Niš als ein Ökosystem.'}</p></article>
        </div>
        <a className="ios-primary" href="https://calije.daninihub.com/" target="_blank" rel="noreferrer">{t.baseCta}</a>
      </section>

      <section className="ios-section" id="dealer">
        <div className="ios-heading"><p className="ios-eyebrow">{t.dealer}</p><h2>{lang==='sr'?'Za uvoznika nije cilj najjeftiniji auto, već najbolja marža posle rizika.':'Für Importeure zählt nicht der billigste Wagen, sondern die beste Marge nach Risiko.'}</h2><p>{t.dealerText}</p></div>
        <div className="ios-flow"><span>SEARCH</span><span>IMPORTABILITY</span><span>ORIGIN</span><span>MODEL DNA</span><span>FRAUD</span><span>FIELD CHECK</span><span>LANDED COST</span><span>RS VALUE</span><strong>RISK-ADJUSTED MARGIN</strong></div>
      </section>
    </main>

    <footer className="ios-footer"><span>Danini ImportOS · DE/CH → RS · Digital + FieldOps + Import Base</span><div><a href={'/'+lang+(lang==='sr'?'/privatnost':'/datenschutz')}>{t.privacy}</a><a href={'/'+lang+'/impressum'}>Impressum</a></div></footer>
  </div>
}
