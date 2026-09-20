import {useEffect,useState} from 'react'
import {ARTICLES} from './ImportOSKnowledge'
import './ImportOSLanding.css'

const C={
  de:{
    hero:'Vom Inserat bis zur sicheren Import-Entscheidung.',
    lead:'DANINI verbindet Importkosten, Herkunft/EUR.1, Betrugsrisiko, Model DNA, reale Fahrzeugprüfung, Teilebeschaffung, Überführung und eine optionale Import-Basis in Niš.',
    quick:'Kostenlosen QuickCheck starten',
    proof:'Nicht nur rechnen. Prüfen, absichern und ausführen.',
    field:'Fahrzeugprüfung in Deutschland',
    parts:'Originalteile beschaffen statt raten',
    transport:'Drei Wege zum Ziel',
    base:'Import Base Čalije · Niš',
    dealer:'Dealer Radar Pro',
    request:'Service anfragen',
    requestLead:'Prüfung, Teile, Fahrerleistung, Trailer/Lkw-Transport oder Import Base. Erst nach Prüfung erhalten Sie ein konkretes Angebot.',
    sent:'Anfrage gespeichert. Referenz:',
    privacy:'Ich habe die Datenschutzhinweise gelesen.',
    payTitle:'Payment Protection',
    payLead:'Für bestätigte Serviceangebote wird der Betrag zuerst autorisiert. Erst nach ausgeführter Leistung wird er eingezogen; fällt die Leistung aus, wird die Autorisierung freigegeben.',
    guides:'Ratgeber, die konkrete Importfehler verhindern'
  },
  sr:{
    hero:'Od oglasa do sigurne odluke o uvozu.',
    lead:'DANINI spaja troškove uvoza, poreklo/EUR.1, rizik prevare, Model DNA, stvarni pregled vozila, nabavku delova, dovoz i opcionu Import Base lokaciju u Nišu.',
    quick:'Pokreni besplatan QuickCheck',
    proof:'Ne samo računanje. Provera, zaštita i izvršenje.',
    field:'Pregled vozila u Nemačkoj',
    parts:'Originalni delovi bez nagađanja',
    transport:'Tri načina do odredišta',
    base:'Import Base Čalije · Niš',
    dealer:'Dealer Radar Pro',
    request:'Pošalji upit za uslugu',
    requestLead:'Pregled, delovi, vozač, prikolica/kamion ili Import Base. Konkretna ponuda ide tek posle provere.',
    sent:'Upit je sačuvan. Referenca:',
    privacy:'Pročitao/la sam obaveštenje o privatnosti.',
    payTitle:'Zaštićena rezervacija plaćanja',
    payLead:'Za potvrđenu uslugu iznos se prvo autorizuje i rezerviše. Naplata ide tek posle izvršene usluge; ako se usluga ne izvrši, rezervacija se oslobađa.',
    guides:'Vodiči koji sprečavaju konkretne greške pri uvozu'
  }
}

const MODELS=[
  ['','—'],
  ['mercedes-w204-petrol','Mercedes C-Klasse W204 · Benzin'],
  ['bmw-f10-petrol','BMW 5er F10/F11 · Benzin'],
  ['audi-a4-b8-petrol','Audi A4 B8 · Benzin'],
  ['vw-golf-vii','VW Golf VII']
]
const SERVICES=[
  ['FIELD_CHECK_LIVE','FieldCheck Live'],
  ['PRO_MECHANIC_CHECK','Pro Mechanic Check'],
  ['ORIGINAL_PARTS','Original / OEM Parts'],
  ['DRIVER_ONLY','Drive2Destination · Fahrer'],
  ['TRAILER_TRANSPORT','Trailer Transport'],
  ['TRUCK_TRANSPORT','Truck / Autotransporter'],
  ['IMPORT_BASE','Import Base Čalije']
]
const NAV=[
  ['#passport','Passport'],
  ['#inspection','Inspection'],
  ['#parts','Parts'],
  ['#transport','Transport'],
  ['#payment-protection','Payment Safe'],
  ['#base','Import Base'],
  ['#wissen','Knowledge'],
  ['#service-request','Service Desk']
]

function money(v){return new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(v||0))}
function verdict(v,lang){return ({DO_NOT_BUY_YET:lang==='sr'?'NE PLAĆAJ JOŠ':'NOCH NICHT KAUFEN',VERIFY_BEFORE_PAYMENT:lang==='sr'?'PROVERI PRE UPLATE':'VOR ZAHLUNG PRÜFEN',CALCULATED_CANDIDATE:lang==='sr'?'KANDIDAT ZA DALJU PROVERU':'KANDIDAT FÜR WEITERE PRÜFUNG'})[v]||v}

export default function ImportOSLanding({lang='de',onLanguage}){
  const t=C[lang]||C.de
  const [form,setForm]=useState({sourceCountry:'DE',currency:'EUR',purchasePrice:10000,fxToEur:1.04,transportToSerbia:700,exportCosts:250,inspectionCost:150,brokerCost:0,complianceCost:0,registrationCost:0,initialService:500,otherCosts:0,year:2014,euroClass:5,originProof:'unknown',registrationDoc:true,ownershipDoc:true,vinProvided:true,serbiaMarketValue:14500,modelDnaKey:'mercedes-w204-petrol',prepaymentRequested:false,thirdPartyAccount:false,priceAnomaly:false,sellerMismatch:false,nonEuSpec:false})
  const [result,setResult]=useState(null)
  const [calcState,setCalcState]=useState('')
  const [buyer,setBuyer]=useState({email:'',termsAccepted:false})
  const [checkoutState,setCheckoutState]=useState('')
  const [field,setField]=useState({visitOneWayKm:50,driveKm:500})
  const [fieldResult,setFieldResult]=useState(null)
  const [req,setReq]=useState({serviceType:'PRO_MECHANIC_CHECK',name:'',email:'',phone:'',vehicle:'',vin:'',partNumber:'',pickupLocation:'',destination:'',message:'',privacyAcknowledged:false})
  const [requestState,setRequestState]=useState('')
  const [quote,setQuote]=useState(null)
  const [quoteState,setQuoteState]=useState('')
  const [quotePayState,setQuotePayState]=useState('')

  const set=(k,v)=>setForm(x=>({...x,[k]:v}))
  const setR=(k,v)=>setReq(x=>({...x,[k]:v}))

  useEffect(()=>{
    document.documentElement.lang=lang
    document.title=lang==='sr'?'DANINI | Automotive Import Intelligence':'DANINI | Automotive Import Intelligence'
    const q=new URLSearchParams(location.search).get('quote')
    if(q){
      setQuoteState('loading')
      fetch('/api/importos/quotes/'+encodeURIComponent(q)).then(r=>r.json().then(p=>({r,p}))).then(({r,p})=>{
        if(!r.ok)throw new Error(p.error||'QUOTE_FAILED')
        setQuote(p);setQuoteState('done')
        setTimeout(()=>document.getElementById('payment-protection')?.scrollIntoView({behavior:'smooth'}),80)
      }).catch(e=>setQuoteState(e.message))
    }
  },[lang])
  useEffect(()=>set('currency',form.sourceCountry==='CH'?'CHF':'EUR'),[form.sourceCountry])

  async function calculate(e){
    e.preventDefault();setCalcState('loading')
    try{
      const r=await fetch('/api/importos/evaluate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
      const p=await r.json();if(!r.ok)throw new Error(p.error)
      setResult(p.result);setCalcState('done')
      setTimeout(()=>document.getElementById('result')?.scrollIntoView({behavior:'smooth'}),50)
    }catch{setCalcState('error')}
  }

  async function estimateField(){
    const r=await fetch('/api/importos/services/estimate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(field)})
    const p=await r.json();if(r.ok)setFieldResult(p.estimate)
  }

  async function buy(provider){
    setCheckoutState('loading:'+provider)
    try{
      const endpoint=provider==='paypal'?'/api/importos/checkout/paypal':'/api/importos/checkout'
      const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:buyer.email,termsAccepted:buyer.termsAccepted,language:lang,vehicle:form})})
      const p=await r.json();if(!r.ok)throw new Error(p.error)
      location.href=p.checkoutUrl
    }catch(e){setCheckoutState(e.message||'CHECKOUT_FAILED')}
  }

  async function authorizeQuote(provider){
    if(!quote?.quote?.reference)return
    setQuotePayState('loading:'+provider)
    try{
      const r=await fetch('/api/importos/quotes/'+encodeURIComponent(quote.quote.reference)+'/authorize/'+provider,{method:'POST'})
      const p=await r.json();if(!r.ok)throw new Error(p.error)
      location.href=p.checkoutUrl
    }catch(e){setQuotePayState(e.message||'AUTHORIZATION_FAILED')}
  }

  async function sendRequest(e){
    e.preventDefault();setRequestState('loading')
    try{
      const r=await fetch('/api/importos/service-request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...req,language:lang})})
      const p=await r.json();if(!r.ok)throw new Error(p.error)
      setRequestState(p.reference)
    }catch(e){setRequestState(e.message||'REQUEST_FAILED')}
  }

  function chooseService(code){
    setR('serviceType',code)
    setTimeout(()=>document.getElementById('service-request')?.scrollIntoView({behavior:'smooth'}),30)
  }

  return <div className="ios">
    <header className="ios-header">
      <div className="ios-topline">
        <a className="ios-brand" href={`/${lang}/`}><img src="/importos-mark.svg" alt="DANINI"/><span><strong>DANINI</strong><small>AUTOMOTIVE IMPORT INTELLIGENCE</small></span></a>
        <div className="ios-lang"><button className={lang==='de'?'on':''} onClick={()=>onLanguage?.('de')}>DE</button><button className={lang==='sr'?'on':''} onClick={()=>onLanguage?.('sr')}>SR</button></div>
      </div>
      <nav className="ios-navstrip" aria-label="Main navigation">{NAV.map(([href,label])=><a key={href} href={href}>{label}</a>)}</nav>
    </header>

    <main>
      <section className="ios-hero">
        <div className="ios-hero-copy"><p className="ios-eyebrow">IMPORTOS · DE / CH → RS</p><h1>{t.hero}</h1><p className="ios-lead">{t.lead}</p><a className="ios-primary" href="#passport">{t.quick}</a><div className="ios-pills"><span>Import Passport</span><span>SafeBuy</span><span>Model DNA</span><span>FieldCheck</span><span>Original Parts</span><span>Payment Safe</span><span>Import Base</span></div></div>
        <aside className="ios-machine">
          <div className="ios-machine-top"><span>DANINI / SYSTEM 01</span><b>LIVE</b></div>
          {['SEARCH','VERIFY','IMPORTABILITY','INSPECT','PAYMENT HOLD','EXECUTE'].map((x,i)=><div className="ios-machine-row" key={x}><span>{String(i+1).padStart(2,'0')}</span><strong>{x}</strong></div>)}
          <div className="ios-machine-foot">DECIDE · VERIFY · EXECUTE</div>
        </aside>
      </section>

      <section className="ios-statement"><strong>{t.proof}</strong><p>{lang==='sr'?'Jedan sistem vodi korisnika od oglasa i računice do pregleda, rezervacije plaćanja, delova, dovoza i fizičke baze u Srbiji.':'Ein System führt vom Inserat und der Kalkulation über Prüfung und Zahlungsautorisierung bis zu Teilen, Überführung und physischer Basis in Serbien.'}</p></section>

      <section className="ios-section" id="passport">
        <div className="ios-heading"><p className="ios-eyebrow">IMPORT PASSPORT · FREE QUICKCHECK</p><h2>{lang==='sr'?'Prvo pronađi rizik. Tek onda troši novac.':'Erst das Risiko finden. Dann Geld ausgeben.'}</h2></div>
        <form className="ios-form" onSubmit={calculate}>
          <label>{lang==='sr'?'Zemlja':'Quelle'}<select value={form.sourceCountry} onChange={e=>set('sourceCountry',e.target.value)}><option value="DE">Deutschland</option><option value="CH">Schweiz</option></select></label>
          <label>{lang==='sr'?'Kupovna cena':'Kaufpreis'}<input type="number" min="0" value={form.purchasePrice} onChange={e=>set('purchasePrice',e.target.value)}/></label>
          {form.sourceCountry==='CH'&&<label>CHF→EUR<input type="number" step="0.0001" min="0" value={form.fxToEur} onChange={e=>set('fxToEur',e.target.value)}/></label>}
          <label>{lang==='sr'?'Transport do Srbije':'Transport bis Serbien'}<input type="number" min="0" value={form.transportToSerbia} onChange={e=>set('transportToSerbia',e.target.value)}/></label>
          <label>{lang==='sr'?'Izvoz/tablice':'Export/Kennzeichen'}<input type="number" min="0" value={form.exportCosts} onChange={e=>set('exportCosts',e.target.value)}/></label>
          <label>{lang==='sr'?'Pregled':'Prüfung'}<input type="number" min="0" value={form.inspectionCost} onChange={e=>set('inspectionCost',e.target.value)}/></label>
          <label>{lang==='sr'?'Godište':'Baujahr'}<input type="number" min="1900" max="2027" value={form.year} onChange={e=>set('year',e.target.value)}/></label>
          <label>Euro<input type="number" min="0" max="7" value={form.euroClass} onChange={e=>set('euroClass',e.target.value)}/></label>
          <label>Origin / EUR.1<select value={form.originProof} onChange={e=>set('originProof',e.target.value)}><option value="unknown">{lang==='sr'?'Nepoznato':'Unklar'}</option><option value="verified">{lang==='sr'?'Proveren':'Verifiziert'}</option><option value="missing">{lang==='sr'?'Nedostaje':'Fehlt'}</option><option value="promised">{lang==='sr'?'Samo obećan':'Nur versprochen'}</option></select></label>
          <label>{lang==='sr'?'Vrednost u Srbiji':'Marktwert Serbien'}<input type="number" min="0" value={form.serbiaMarketValue} onChange={e=>set('serbiaMarketValue',e.target.value)}/></label>
          <label className="wide">Model DNA<select value={form.modelDnaKey} onChange={e=>set('modelDnaKey',e.target.value)}>{MODELS.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
          <div className="ios-checks wide">
            <label><input type="checkbox" checked={form.vinProvided} onChange={e=>set('vinProvided',e.target.checked)}/> VIN</label>
            <label><input type="checkbox" checked={form.registrationDoc} onChange={e=>set('registrationDoc',e.target.checked)}/> {lang==='sr'?'Dokumenti':'Fahrzeugpapiere'}</label>
            <label><input type="checkbox" checked={form.ownershipDoc} onChange={e=>set('ownershipDoc',e.target.checked)}/> {lang==='sr'?'Račun/ugovor':'Rechnung/Vertrag'}</label>
            <label><input type="checkbox" checked={form.prepaymentRequested} onChange={e=>set('prepaymentRequested',e.target.checked)}/> {lang==='sr'?'Traži avans':'Vorkasse'}</label>
            <label><input type="checkbox" checked={form.thirdPartyAccount} onChange={e=>set('thirdPartyAccount',e.target.checked)}/> {lang==='sr'?'Treći račun':'Dritt-Konto'}</label>
            <label><input type="checkbox" checked={form.priceAnomaly} onChange={e=>set('priceAnomaly',e.target.checked)}/> {lang==='sr'?'Sumnjiva cena':'Preis-Anomalie'}</label>
            <label><input type="checkbox" checked={form.sellerMismatch} onChange={e=>set('sellerMismatch',e.target.checked)}/> {lang==='sr'?'Prodavac ≠ dokument':'Verkäufer ≠ Dokument'}</label>
            <label><input type="checkbox" checked={form.nonEuSpec} onChange={e=>set('nonEuSpec',e.target.checked)}/> Non-EU spec</label>
          </div>
          <button className="ios-primary wide">{calcState==='loading'?'…':t.quick}</button>
        </form>
      </section>

      {result&&<section className="ios-section" id="result">
        <div className="ios-verdict"><span>{lang==='sr'?'ODLUKA QUICKCHECK-a':'QUICKCHECK ENTSCHEIDUNG'}</span><strong>{verdict(result.decision,lang)}</strong><small>{result.route}</small></div>
        <div className="ios-metrics">
          <article><span>{lang==='sr'?'Raspon troška':'Kostenkorridor'}</span><strong>{money(result.corridor.best)} – {money(result.corridor.worst)}</strong><small>Delta {money(result.corridor.delta)}</small></article>
          <article><span>IMPORTABILITY</span><strong>{result.importability.status}</strong><small>{result.importability.issues[0]}</small></article>
          <article><span>FRAUD SHIELD</span><strong>{result.fraud.score}/100</strong><small>{result.fraud.flagCount} signals</small></article>
          <article><span>MODEL DNA</span><strong>{result.modelDna?.sourceQuality||'—'}</strong><small>{result.modelDna?.label||'No profile'}</small></article>
        </div>
        <div className="ios-scenarios">{result.scenarios.map(s=><article key={s.name}><span>{s.name==='preferential'?'0% origin scenario':'12.5% standard scenario'}</span><strong>{money(s.total)}</strong><p>Carina {money(s.duty)} · PDV {money(s.vat)} {s.grossSpread!==null?'· spread '+money(s.grossSpread):''}</p></article>)}</div>
        <div className="ios-paywall"><div><p className="ios-eyebrow">FULL PASSPORT · 9,90 €</p><h2>Import Passport</h2><p>{lang==='sr'?'Otključava pune Fraud zastavice, Model DNA, DIY/posrednički tok i izvore.':'Schaltet vollständige Fraud-Flags, Model DNA, DIY-/Vermittler-Route und Quellen frei.'}</p></div><div className="ios-buy"><input type="email" placeholder="email@example.com" value={buyer.email} onChange={e=>setBuyer(x=>({...x,email:e.target.value}))}/><label><input type="checkbox" checked={buyer.termsAccepted} onChange={e=>setBuyer(x=>({...x,termsAccepted:e.target.checked}))}/><span>{lang==='sr'?'Prihvatam okvir korišćenja.':'Ich akzeptiere den Nutzungsrahmen.'}</span></label><div className="ios-pay-buttons"><button className="ios-primary" type="button" onClick={()=>buy('card')}>{checkoutState==='loading:card'?'…':'Karte · Stripe'}</button><button className="ios-paypal" type="button" onClick={()=>buy('paypal')}>{checkoutState==='loading:paypal'?'…':'PayPal'}</button></div>{checkoutState&&!checkoutState.startsWith('loading:')&&<small>{checkoutState==='CHECKOUT_PENDING_LEGAL_ACTIVATION'?(lang==='sr'?'Checkout je tehnički spreman, ali naplata ostaje zaključana do završne poslovno-poreske aktivacije.':'Checkout ist technisch fertig, bleibt aber bis zur finalen Geschäfts-/Steueraktivierung gesperrt.'):checkoutState}</small>}</div></div>
      </section>}

      <section className="ios-section" id="inspection">
        <div className="ios-heading"><p className="ios-eyebrow">FIELD OPS · DUISBURG</p><h2>{t.field}</h2></div>
        <div className="ios-services two">
          <article><div className="ios-service-code">01 / VISUAL + DOCUMENTS</div><h3>FieldCheck Live</h3><p>{lang==='sr'?'Live video, fotografije, vidljivo stanje, dokumenti i strukturisana pitanja prodavcu. Polazna tačka Duisburg; cena zavisi od udaljenosti.':'Live-Video, Fotos, sichtbarer Zustand, Fahrzeugpapiere und strukturierte Verkäuferfragen. Startpunkt Duisburg; Preis nach Entfernung.'}</p><label>{lang==='sr'?'Udaljenost od Duisburga, jedan smer (km)':'Entfernung ab Duisburg, einfache Strecke (km)'}<input type="number" min="0" value={field.visitOneWayKm} onChange={e=>setField(x=>({...x,visitOneWayKm:e.target.value}))}/></label>{fieldResult&&<div className="ios-price"><strong>{money(fieldResult.liveVisit.estimatedServiceFee)}</strong><small>59 € + 0,45 €/povratni km · min. 79 €</small></div>}<button onClick={()=>chooseService('FIELD_CHECK_LIVE')}>{lang==='sr'?'Zatraži termin':'Termin anfragen'}</button></article>
          <article><div className="ios-service-code">02 / PROFESSIONAL MECHANIC</div><h3>Pro Mechanic Check</h3><p>{lang==='sr'?'Nezavisni profesionalni pregled od strane mehaničara sa višegodišnjim radnim iskustvom u BRABUS-u, kada je termin dostupan. Nije BRABUS usluga niti partnerstvo.':'Unabhängige professionelle Prüfung durch einen Mechaniker mit mehrjähriger Berufserfahrung bei BRABUS, soweit verfügbar. Keine BRABUS-Leistung und keine Partnerschaft.'}</p><div className="ios-tech-list"><span>✓ Motor / Getriebe</span><span>✓ Fahrwerk / Bremsen</span><span>✓ {lang==='sr'?'procena pre kupovine':'Kaufprüfung'}</span></div><button onClick={()=>chooseService('PRO_MECHANIC_CHECK')}>{lang==='sr'?'Zatraži profesionalni pregled':'Profi-Prüfung anfragen'}</button></article>
        </div>
        <button className="ios-secondary" onClick={estimateField}>{lang==='sr'?'Izračunaj FieldCheck okvir':'FieldCheck-Preisrahmen berechnen'}</button>
      </section>

      <section className="ios-section" id="parts">
        <div className="ios-heading"><p className="ios-eyebrow">ORIGINAL PARTS DESK</p><h2>{t.parts}</h2><p>{lang==='sr'?'Originalni/Genuine/OEM delovi za praktično sve marke po VIN-u ili tačnom broju dela, zavisno od dostupnosti. Slanje paketom/kurirom ili zajedno sa transportom vozila.':'Original-/Genuine-/OEM-Teile für praktisch alle Marken nach VIN oder exakter Teilenummer, abhängig von Verfügbarkeit. Versand per Paket/Kurier oder gebündelt mit Fahrzeugtransport.'}</p></div>
        <div className="ios-parts-flow"><article><span>01</span><strong>VIN / OEM PART NO.</strong><p>{lang==='sr'?'Identifikujemo tačan deo.':'Exaktes Teil identifizieren.'}</p></article><article><span>02</span><strong>SOURCE</strong><p>{lang==='sr'?'Provera dostupnosti i nabavke.':'Lieferbarkeit und Beschaffung prüfen.'}</p></article><article><span>03</span><strong>DELIVERY</strong><p>{lang==='sr'?'Paket, kurir ili zajedno sa vozilom.':'Paket, Kurier oder mit Fahrzeugtransport.'}</p></article></div>
        <button className="ios-primary" onClick={()=>chooseService('ORIGINAL_PARTS')}>{lang==='sr'?'Pošalji VIN / broj dela':'VIN / Teilenummer senden'}</button>
      </section>

      <section className="ios-section" id="transport">
        <div className="ios-heading"><p className="ios-eyebrow">VEHICLE DELIVERY</p><h2>{t.transport}</h2></div>
        <div className="ios-services three">
          <article><div className="ios-service-code">OWN WHEELS</div><h3>Drive2Destination</h3><p>{lang==='sr'?'DANINI je samo vozač. Vozilo mora imati legalne tablice/registraciju za rutu, osiguranje i ovlašćenje. Ostali troškovi su odvojeni.':'DANINI erbringt nur die Fahrerleistung. Legale Kennzeichen/Zulassung, Versicherung und Vollmacht sind Voraussetzung; Nebenkosten separat.'}</p><label>km<input type="number" min="0" value={field.driveKm} onChange={e=>setField(x=>({...x,driveKm:e.target.value}))}/></label>{fieldResult&&<div className="ios-price"><strong>{money(fieldResult.driverOnly.estimatedDriverFee)}</strong><small>99 € + 0,55 €/km · min. 149 €</small></div>}<button onClick={()=>chooseService('DRIVER_ONLY')}>{lang==='sr'?'Traži ponudu':'Angebot anfragen'}</button></article>
          <article><div className="ios-service-code">TRAILER</div><h3>{lang==='sr'?'Prevoz prikolicom':'Trailer-Transport'}</h3><p>{lang==='sr'?'Za neispravna, neregistrovana ili vrednija vozila organizuje se ponuda odgovarajućeg transportnog partnera.':'Für nicht fahrbereite, nicht zugelassene oder wertvollere Fahrzeuge wird ein geeigneter Transportpartner angeboten.'}</p><button onClick={()=>chooseService('TRAILER_TRANSPORT')}>{lang==='sr'?'Traži ponudu':'Angebot anfragen'}</button></article>
          <article><div className="ios-service-code">TRUCK / CARRIER</div><h3>{lang==='sr'?'Kamion / autotransporter':'Lkw / Autotransporter'}</h3><p>{lang==='sr'?'Za veće relacije ili više vozila: transport partner sa jasno odvojenom cenom.':'Für längere Strecken oder mehrere Fahrzeuge: Transportpartner mit separat ausgewiesenem Preis.'}</p><button onClick={()=>chooseService('TRUCK_TRANSPORT')}>{lang==='sr'?'Traži ponudu':'Angebot anfragen'}</button></article>
        </div>
      </section>

      <section className="ios-section" id="payment-protection">
        <div className="ios-heading"><p className="ios-eyebrow">PAYMENT PROTECTION · CARD + PAYPAL</p><h2>{t.payTitle}</h2><p>{t.payLead}</p></div>
        <div className="ios-payment-rail"><div><span>01</span><strong>QUOTE</strong><small>{lang==='sr'?'Potvrđena cena':'Bestätigter Preis'}</small></div><i>→</i><div><span>02</span><strong>AUTHORIZE</strong><small>{lang==='sr'?'Kartica ili PayPal':'Karte oder PayPal'}</small></div><i>→</i><div><span>03</span><strong>HOLD</strong><small>{lang==='sr'?'Bez naplate':'Noch keine Abbuchung'}</small></div><i>→</i><div><span>04</span><strong>SERVICE</strong><small>{lang==='sr'?'Izvršenje':'Leistung'}</small></div><i>→</i><div><span>05</span><strong>CAPTURE / RELEASE</strong><small>{lang==='sr'?'Naplati ili oslobodi':'Einziehen oder freigeben'}</small></div></div>
        <p className="ios-note">{lang==='sr'?'Autorizacije nisu beskonačne: PayPal navodi rok do 29 dana uz najbolju pouzdanost naplate u prva 3 dana; kod kartica rok zavisi od mreže i izdavaoca. Zato sistem mora proveriti datum usluge pre kreiranja rezervacije i po potrebi tražiti novu autorizaciju.':'Autorisierungen gelten nicht unbegrenzt: PayPal nennt bis zu 29 Tage, mit der höchsten Capture-Sicherheit in den ersten 3 Tagen; Kartenfristen hängen von Netzwerk und Issuer ab. Daher prüft das System den Leistungstermin und kann bei Bedarf eine neue Autorisierung verlangen.'}</p>
        {quoteState==='loading'&&<p>{lang==='sr'?'Učitavam ponudu…':'Angebot wird geladen…'}</p>}
        {quote?.quote&&<div className="ios-quote">
          <div><span>{quote.quote.reference}</span><strong>{(quote.quote.amountCents/100).toFixed(2)} €</strong><p>{quote.quote.description||quote.quote.serviceType}</p>{quote.quote.serviceDate&&<small>{lang==='sr'?'Termin':'Termin'}: {quote.quote.serviceDate}</small>}</div>
          <div className="ios-pay-buttons"><button className="ios-primary" onClick={()=>authorizeQuote('stripe')}>{quotePayState==='loading:stripe'?'…':'Karte autorisieren'}</button><button className="ios-paypal" onClick={()=>authorizeQuote('paypal')}>{quotePayState==='loading:paypal'?'…':'PayPal autorisieren'}</button></div>
          {quotePayState&&!quotePayState.startsWith('loading:')&&<small>{quotePayState}</small>}
        </div>}
        {!quote?.quote&&quoteState&&quoteState!=='loading'&&<p className="ios-error">{quoteState}</p>}
      </section>

      <section className="ios-section" id="base">
        <div className="ios-heading"><p className="ios-eyebrow">PHYSICAL NODE · NIŠ</p><h2>{t.base}</h2><p>{lang==='sr'?'Opciona fizička baza za prodajni plac, privremeno držanje vozila, pregled kupaca i primopredaju: Blok A, Blok B ili deo površine. Kapacitet, prilaz, dozvoljena namena i zakup potvrđuju se pre ugovora.':'Optionale physische Basis für Fahrzeughandel, Zwischenabstellung, Besichtigung und Übergabe: Block A, Block B oder Teilfläche. Kapazität, Zufahrt, zulässige Nutzung und Miete werden vor Vertrag bestätigt.'}</p></div>
        <div className="ios-base"><article><span>BLOCK A</span><strong>{lang==='sr'?'Cela ili deo površine':'Gesamt- oder Teilfläche'}</strong></article><article><span>BLOCK B</span><strong>{lang==='sr'?'Zasebno ili kombinovano':'Separat oder kombiniert'}</strong></article><article><span>DANINI NODE</span><strong>{lang==='sr'?'Prodaja · parkiranje · pregled · primopredaja':'Verkauf · Abstellung · Besichtigung · Übergabe'}</strong></article></div>
        <div className="ios-row"><a className="ios-primary" href="https://calije.daninihub.com/" target="_blank" rel="noreferrer">{lang==='sr'?'Otvori Čalije lokaciju':'Čalije Standort öffnen'}</a><button className="ios-secondary" onClick={()=>chooseService('IMPORT_BASE')}>{lang==='sr'?'Upit za zakup':'Mietanfrage'}</button></div>
      </section>

      <section className="ios-section" id="dealer">
        <div className="ios-heading"><p className="ios-eyebrow">{t.dealer}</p><h2>{lang==='sr'?'Profesionalac ne traži najjeftiniji auto. Traži najbolju maržu posle rizika.':'Profis suchen nicht den billigsten Wagen, sondern die beste Marge nach Risiko.'}</h2><p>{lang==='sr'?'Importability + Origin + Model DNA + Fraud + pregled + landed cost + vrednost u Srbiji = risk-adjusted margin.':'Importability + Origin + Model DNA + Fraud + Prüfung + Landed Cost + Serbia-Marktwert = risk-adjusted margin.'}</p></div>
        <div className="ios-flow"><span>SEARCH</span><span>VERIFY</span><span>CHECK</span><span>AUTHORIZE</span><span>IMPORT</span><span>BASE</span><strong>SELL / MARGIN</strong></div>
      </section>

      <section className="ios-section" id="wissen">
        <div className="ios-heading"><p className="ios-eyebrow">KNOWLEDGE GARAGE</p><h2>{t.guides}</h2><p>{lang==='sr'?'Članci nisu SEO punjenje. Svaki rešava konkretnu tačku na kojoj kupac ili uvoznik može da izgubi novac.':'Keine SEO-Fülltexte. Jeder Artikel behandelt einen Punkt, an dem Käufer oder Importeure real Geld verlieren können.'}</p></div>
        <div className="ios-articles">{ARTICLES.map(a=>{const x=a[lang]||a.de;const href=lang==='sr'?'/sr/vodic/'+a.slug:'/de/wissen/'+a.slug;return <a key={a.slug} href={href}><span>{x.kicker}</span><strong>{x.title}</strong><p>{x.lead}</p><b>READ →</b></a>})}</div>
      </section>

      <section className="ios-section" id="service-request">
        <div className="ios-heading"><p className="ios-eyebrow">SERVICE DESK</p><h2>{t.request}</h2><p>{t.requestLead}</p></div>
        <form className="ios-request" onSubmit={sendRequest}>
          <label>{lang==='sr'?'Usluga':'Service'}<select value={req.serviceType} onChange={e=>setR('serviceType',e.target.value)}>{SERVICES.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
          <label>{lang==='sr'?'Ime / firma':'Name / Firma'}<input required value={req.name} onChange={e=>setR('name',e.target.value)}/></label>
          <label>Email<input required type="email" value={req.email} onChange={e=>setR('email',e.target.value)}/></label>
          <label>Telefon<input value={req.phone} onChange={e=>setR('phone',e.target.value)}/></label>
          <label>{lang==='sr'?'Vozilo':'Fahrzeug'}<input placeholder="Mercedes C220d 2019..." value={req.vehicle} onChange={e=>setR('vehicle',e.target.value)}/></label>
          <label>VIN<input value={req.vin} onChange={e=>setR('vin',e.target.value)}/></label>
          <label>{lang==='sr'?'OEM / broj dela':'OEM / Teilenummer'}<input value={req.partNumber} onChange={e=>setR('partNumber',e.target.value)}/></label>
          <label>{lang==='sr'?'Mesto vozila / preuzimanja':'Standort / Abholung'}<input value={req.pickupLocation} onChange={e=>setR('pickupLocation',e.target.value)}/></label>
          <label>{lang==='sr'?'Odredište':'Ziel'}<input value={req.destination} onChange={e=>setR('destination',e.target.value)}/></label>
          <label className="wide">{lang==='sr'?'Detalji':'Details'}<textarea value={req.message} onChange={e=>setR('message',e.target.value)}/></label>
          <label className="ios-consent wide"><input type="checkbox" required checked={req.privacyAcknowledged} onChange={e=>setR('privacyAcknowledged',e.target.checked)}/><span>{t.privacy}</span></label>
          <button className="ios-primary wide">{requestState==='loading'?'…':t.request}</button>
          {requestState&&requestState!=='loading'&&<p className="ios-request-result wide">{requestState.startsWith('SRV-')?t.sent+' '+requestState:requestState}</p>}
        </form>
      </section>
    </main>

    <footer className="ios-footer"><div className="ios-footer-brand"><img src="/importos-mark.svg" alt=""/><span><strong>DANINI</strong><small>AUTOMOTIVE IMPORT INTELLIGENCE · DUISBURG / NIŠ</small></span></div><div><a href={`/${lang}/impressum`}>Impressum</a><a href={`/${lang}${lang==='sr'?'/privatnost':'/datenschutz'}`}>{lang==='sr'?'Privatnost':'Datenschutz'}</a><a href={`/${lang}${lang==='sr'?'/uslovi':'/bedingungen'}`}>{lang==='sr'?'Uslovi':'Nutzungsrahmen'}</a></div></footer>
  </div>
}
