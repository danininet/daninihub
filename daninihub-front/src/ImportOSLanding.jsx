import {useEffect,useState} from 'react'
import './ImportOSLanding.css'

const C={
  de:{
    hero:'Vom Inserat bis zur sicheren Import-Entscheidung.',
    lead:'Danini ImportOS verbindet Importkosten, Herkunft/EUR.1, Betrugsrisiko, Model DNA, reale Fahrzeugprüfung, Teilebeschaffung, Überführung und eine optionale Import-Basis in Niš.',
    quick:'Kostenlosen QuickCheck starten',
    menu:'Menü',
    nav:['Passport','Prüfung','Teile','Transport','Import Base','Dealer'],
    proof:'Nicht nur rechnen. Prüfen, absichern und ausführen.',
    paid:'Vollständiger Import Passport',
    paidText:'QuickCheck zeigt die Richtung. Der 9,90-€-Passport schaltet vollständige Risikofaktoren, Model DNA, DIY-/Vermittler-Route und Quellen frei.',
    field:'Fahrzeugprüfung in Deutschland',
    liveTitle:'FieldCheck Live',
    liveText:'Live-Video, Foto-Set, sichtbarer Zustand, Fahrzeugpapiere und strukturierte Verkäuferfragen. Startpunkt Duisburg; Preis nach Entfernung.',
    proTitle:'Pro Mechanic Check',
    proText:'Unabhängige professionelle Prüfung durch einen Mechaniker mit mehrjähriger Berufserfahrung bei BRABUS, soweit verfügbar. Keine BRABUS-Leistung und keine BRABUS-Partnerschaft.',
    parts:'Originalteile beschaffen statt raten',
    partsText:'Original-/Genuine-/OEM-Teile für praktisch alle Marken nach VIN oder exakter Teilenummer, abhängig von Verfügbarkeit. Versand per Paket/Kurier oder gebündelt mit Fahrzeugtransport.',
    transport:'Drei Wege zum Ziel',
    base:'Import Base Čalije · Niš',
    baseText:'Optionale physische Basis für Fahrzeughandel, Zwischenabstellung, Besichtigung und Übergabe: Block A, Block B oder Teilfläche. Kapazität, Zufahrt, zulässige Nutzung und Miete werden vor Vertrag bestätigt.',
    dealer:'Dealer Radar Pro',
    request:'Service anfragen',
    requestLead:'Eine Anfrage für Prüfung, Teile, Fahrerleistung, Trailer/Lkw-Transport oder Import Base. Erst nach Prüfung erhalten Sie ein konkretes Angebot.',
    sent:'Anfrage gespeichert. Referenz:',
    privacy:'Ich habe die Datenschutzhinweise gelesen.',
    buy:'Import Passport für 9,90 € kaufen'
  },
  sr:{
    hero:'Od oglasa do sigurne odluke o uvozu.',
    lead:'Danini ImportOS spaja troškove uvoza, poreklo/EUR.1, rizik prevare, Model DNA, stvarni pregled vozila, nabavku delova, dovoz i opcionu Import Base lokaciju u Nišu.',
    quick:'Pokreni besplatan QuickCheck',
    menu:'Meni',
    nav:['Passport','Pregled','Delovi','Transport','Import Base','Dealer'],
    proof:'Ne samo računanje. Provera, zaštita i izvršenje.',
    paid:'Kompletan Import Passport',
    paidText:'QuickCheck pokazuje pravac. Passport od 9,90 € otključava pune rizike, Model DNA, DIY/posrednički tok i izvore.',
    field:'Pregled vozila u Nemačkoj',
    liveTitle:'FieldCheck Live',
    liveText:'Live video, fotografije, vidljivo stanje, dokumenti i strukturisana pitanja prodavcu. Polazna tačka Duisburg; cena zavisi od udaljenosti.',
    proTitle:'Pro Mechanic Check',
    proText:'Nezavisni profesionalni pregled od strane mehaničara sa višegodišnjim radnim iskustvom u BRABUS-u, kada je termin dostupan. Nije BRABUS usluga niti BRABUS partnerstvo.',
    parts:'Originalni delovi bez nagađanja',
    partsText:'Originalni/Genuine/OEM delovi za praktično sve marke po VIN-u ili tačnom broju dela, zavisno od dostupnosti. Slanje paketom/kurirom ili zajedno sa transportom vozila.',
    transport:'Tri načina do odredišta',
    base:'Import Base Čalije · Niš',
    baseText:'Opciona fizička baza za prodajni plac, privremeno držanje vozila, pregled kupaca i primopredaju: Blok A, Blok B ili deo površine. Kapacitet, prilaz, dozvoljena namena i zakup potvrđuju se pre ugovora.',
    dealer:'Dealer Radar Pro',
    request:'Pošalji upit za uslugu',
    requestLead:'Jedan upit za pregled, delove, vozača, prikolicu/kamion ili Import Base. Konkretna ponuda ide tek posle provere.',
    sent:'Upit je sačuvan. Referenca:',
    privacy:'Pročitao/la sam obaveštenje o privatnosti.',
    buy:'Kupi Import Passport za 9,90 €'
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

function money(v){return new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(v||0))}
function verdict(v,lang){return ({DO_NOT_BUY_YET:lang==='sr'?'NE PLAĆAJ JOŠ':'NOCH NICHT KAUFEN',VERIFY_BEFORE_PAYMENT:lang==='sr'?'PROVERI PRE UPLATE':'VOR ZAHLUNG PRÜFEN',CALCULATED_CANDIDATE:lang==='sr'?'KANDIDAT ZA DALJU PROVERU':'KANDIDAT FÜR WEITERE PRÜFUNG'})[v]||v}

export default function ImportOSLanding({lang='de',onLanguage}){
  const t=C[lang]||C.de
  const [menu,setMenu]=useState(false)
  const [form,setForm]=useState({sourceCountry:'DE',currency:'EUR',purchasePrice:10000,fxToEur:1.04,transportToSerbia:700,exportCosts:250,inspectionCost:150,brokerCost:0,complianceCost:0,registrationCost:0,initialService:500,otherCosts:0,year:2014,euroClass:5,originProof:'unknown',registrationDoc:true,ownershipDoc:true,vinProvided:true,serbiaMarketValue:14500,modelDnaKey:'mercedes-w204-petrol',prepaymentRequested:false,thirdPartyAccount:false,priceAnomaly:false,sellerMismatch:false,nonEuSpec:false})
  const [result,setResult]=useState(null)
  const [calcState,setCalcState]=useState('')
  const [buyer,setBuyer]=useState({email:'',termsAccepted:false})
  const [checkoutState,setCheckoutState]=useState('')
  const [field,setField]=useState({visitOneWayKm:50,driveKm:500})
  const [fieldResult,setFieldResult]=useState(null)
  const [req,setReq]=useState({serviceType:'PRO_MECHANIC_CHECK',name:'',email:'',phone:'',vehicle:'',vin:'',partNumber:'',pickupLocation:'',destination:'',message:'',privacyAcknowledged:false})
  const [requestState,setRequestState]=useState('')

  const set=(k,v)=>setForm(x=>({...x,[k]:v}))
  const setR=(k,v)=>setReq(x=>({...x,[k]:v}))

  useEffect(()=>{
    document.documentElement.lang=lang
    document.title=lang==='sr'?'Danini ImportOS | Uvoz automobila DE/CH → Srbija':'Danini ImportOS | Fahrzeugimport DE/CH → Serbien'
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

  async function buy(){
    setCheckoutState('loading')
    try{
      const r=await fetch('/api/importos/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:buyer.email,termsAccepted:buyer.termsAccepted,language:lang,vehicle:form})})
      const p=await r.json();if(!r.ok)throw new Error(p.error)
      location.href=p.checkoutUrl
    }catch(e){setCheckoutState(e.message||'CHECKOUT_FAILED')}
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
      <a className="ios-brand" href={`/${lang}/`}><img src="/importos-mark.svg" alt="Danini ImportOS"/><span><strong>DANINI</strong><b>IMPORTOS</b><small>Automotive Decision & Field Network</small></span></a>
      <nav className={menu?'open':''}>{t.nav.map((x,i)=><a key={x} onClick={()=>setMenu(false)} href={['#passport','#inspection','#parts','#transport','#base','#dealer'][i]}>{x}</a>)}</nav>
      <div className="ios-actions"><div className="ios-lang"><button className={lang==='de'?'on':''} onClick={()=>onLanguage?.('de')}>DE</button><button className={lang==='sr'?'on':''} onClick={()=>onLanguage?.('sr')}>SR</button></div><button className="ios-menu" aria-expanded={menu} onClick={()=>setMenu(x=>!x)}>{t.menu}</button></div>
    </header>

    <main>
      <section className="ios-hero">
        <div className="ios-hero-copy"><p className="ios-eyebrow">DANINI IMPORTOS · DE / CH → RS</p><h1>{t.hero}</h1><p className="ios-lead">{t.lead}</p><a className="ios-primary" href="#passport">{t.quick}</a><div className="ios-pills"><span>Import Passport</span><span>SafeBuy</span><span>Model DNA</span><span>FieldCheck</span><span>Original Parts</span><span>Transport</span><span>Import Base</span></div></div>
        <aside className="ios-machine"><div className="ios-machine-top"><span>IMPORTOS / 01</span><b>LIVE SYSTEM</b></div>{[['IMPORTABILITY','CHECK'],['ORIGIN / EUR.1','VERIFY'],['FRAUD SHIELD','SCAN'],['MODEL DNA','EVIDENCE'],['FIELD OPS','EXECUTE']].map(([a,b])=><div className="ios-machine-row" key={a}><span>{a}</span><strong>{b}</strong></div>)}<div className="ios-machine-foot">DECIDE · VERIFY · EXECUTE</div></aside>
      </section>

      <section className="ios-statement"><strong>{t.proof}</strong><p>{lang==='sr'?'ImportOS kombinuje digitalni decision engine sa stvarnim ljudima i fizičkim izvršenjem. Sistem jasno odvaja podatke, procenu, stručni pregled i logistiku.':'ImportOS verbindet einen digitalen Decision Engine mit realen Menschen und physischer Ausführung. Daten, Einschätzung, Fachprüfung und Logistik bleiben klar getrennt.'}</p></section>

      <section className="ios-section" id="passport">
        <div className="ios-heading"><p className="ios-eyebrow">IMPORT PASSPORT · QUICKCHECK</p><h2>{lang==='sr'?'Prvo izračunaj gde je rizik. Tek onda troši novac.':'Erst sehen, wo das Risiko liegt. Dann Geld ausgeben.'}</h2></div>
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
            <label><input type="checkbox" checked={form.registrationDoc} onChange={e=>set('registrationDoc',e.target.checked)}/> {lang==='sr'?'Dokumenti vozila':'Fahrzeugpapiere'}</label>
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
        <div className="ios-paywall"><div><p className="ios-eyebrow">FULL PASSPORT · 9,90 €</p><h2>{t.paid}</h2><p>{t.paidText}</p></div><div className="ios-buy"><input type="email" placeholder="email@example.com" value={buyer.email} onChange={e=>setBuyer(x=>({...x,email:e.target.value}))}/><label><input type="checkbox" checked={buyer.termsAccepted} onChange={e=>setBuyer(x=>({...x,termsAccepted:e.target.checked}))}/><span>{lang==='sr'?'Prihvatam okvir korišćenja.':'Ich akzeptiere den Nutzungsrahmen.'}</span></label><button className="ios-primary" onClick={buy}>{checkoutState==='loading'?'…':t.buy}</button>{checkoutState&&checkoutState!=='loading'&&<small>{checkoutState==='CHECKOUT_PENDING_LEGAL_ACTIVATION'?(lang==='sr'?'Checkout je spreman, ali naplata je još zaključana do završne poslovno-poreske aktivacije.':'Checkout ist fertig, aber bis zur finalen Geschäfts-/Steueraktivierung gesperrt.'):checkoutState}</small>}</div></div>
      </section>}

      <section className="ios-section" id="inspection">
        <div className="ios-heading"><p className="ios-eyebrow">FIELD OPS · DUISBURG</p><h2>{t.field}</h2></div>
        <div className="ios-services two">
          <article><div className="ios-service-code">01 / VISUAL + DOCUMENTS</div><h3>{t.liveTitle}</h3><p>{t.liveText}</p><label>{lang==='sr'?'Udaljenost od Duisburga, jedan smer (km)':'Entfernung ab Duisburg, einfache Strecke (km)'}<input type="number" min="0" value={field.visitOneWayKm} onChange={e=>setField(x=>({...x,visitOneWayKm:e.target.value}))}/></label>{fieldResult&&<div className="ios-price"><strong>{money(fieldResult.liveVisit.estimatedServiceFee)}</strong><small>59 € + 0,45 €/povratni km · min. 79 €</small></div>}<button onClick={()=>chooseService('FIELD_CHECK_LIVE')}>{lang==='sr'?'Zatraži termin':'Termin anfragen'}</button></article>
          <article><div className="ios-service-code">02 / MECHANICAL EXPERTISE</div><h3>{t.proTitle}</h3><p>{t.proText}</p><div className="ios-tech-list"><span>✓ {lang==='sr'?'mehaničko stanje':'Mechanischer Zustand'}</span><span>✓ {lang==='sr'?'motor / menjač / trap':'Motor / Getriebe / Fahrwerk'}</span><span>✓ {lang==='sr'?'stručna procena pre kupovine':'Fachliche Kaufprüfung'}</span></div><button onClick={()=>chooseService('PRO_MECHANIC_CHECK')}>{lang==='sr'?'Zatraži profesionalni pregled':'Profi-Prüfung anfragen'}</button></article>
        </div>
        <button className="ios-secondary" onClick={estimateField}>{lang==='sr'?'Izračunaj FieldCheck okvir':'FieldCheck-Preisrahmen berechnen'}</button>
      </section>

      <section className="ios-section" id="parts">
        <div className="ios-heading"><p className="ios-eyebrow">ORIGINAL PARTS DESK</p><h2>{t.parts}</h2><p>{t.partsText}</p></div>
        <div className="ios-parts-flow"><article><span>01</span><strong>VIN / OEM PART NO.</strong><p>{lang==='sr'?'Identifikujemo tačan deo, ne kupujemo po pretpostavci.':'Teil wird über VIN / exakte Teilenummer identifiziert.'}</p></article><article><span>02</span><strong>SOURCE</strong><p>{lang==='sr'?'Provera dostupnosti i ponuda originalnog/Genuine/OEM dela.':'Lieferbarkeit und Angebot für Original/Genuine/OEM.'}</p></article><article><span>03</span><strong>DELIVERY</strong><p>{lang==='sr'?'Paket/kurir ili kombinovanje sa vozilom, prikolicom ili kamionom.':'Paket/Kurier oder gebündelt mit Fahrzeug, Trailer oder Lkw.'}</p></article></div>
        <button className="ios-primary" onClick={()=>chooseService('ORIGINAL_PARTS')}>{lang==='sr'?'Pošalji VIN / broj dela':'VIN / Teilenummer senden'}</button>
      </section>

      <section className="ios-section" id="transport">
        <div className="ios-heading"><p className="ios-eyebrow">VEHICLE DELIVERY</p><h2>{t.transport}</h2></div>
        <div className="ios-services three">
          <article><div className="ios-service-code">OWN WHEELS</div><h3>Drive2Destination</h3><p>{lang==='sr'?'Danini je samo vozač. Vozilo mora imati legalne tablice/registraciju za rutu, osiguranje i ovlašćenje. Gorivo, putarine, dolazak/povrat vozača i granica računaju se odvojeno.':'Danini erbringt nur die Fahrerleistung. Legale Kennzeichen/Zulassung, Versicherung und Vollmacht sind Voraussetzung; Kraftstoff, Maut, An-/Rückreise und Grenze separat.'}</p><label>km<input type="number" min="0" value={field.driveKm} onChange={e=>setField(x=>({...x,driveKm:e.target.value}))}/></label>{fieldResult&&<div className="ios-price"><strong>{money(fieldResult.driverOnly.estimatedDriverFee)}</strong><small>99 € + 0,55 €/km · min. 149 €</small></div>}<button onClick={()=>chooseService('DRIVER_ONLY')}>{lang==='sr'?'Traži ponudu':'Angebot anfragen'}</button></article>
          <article><div className="ios-service-code">TRAILER</div><h3>{lang==='sr'?'Prevoz prikolicom':'Trailer-Transport'}</h3><p>{lang==='sr'?'Za neispravna, neregistrovana ili vrednija vozila organizujemo ponudu odgovarajućeg transportnog partnera.':'Für nicht fahrbereite, nicht zugelassene oder wertvollere Fahrzeuge wird ein geeigneter Transportpartner angeboten.'}</p><button onClick={()=>chooseService('TRAILER_TRANSPORT')}>{lang==='sr'?'Traži ponudu':'Angebot anfragen'}</button></article>
          <article><div className="ios-service-code">TRUCK / CARRIER</div><h3>{lang==='sr'?'Kamion / autotransporter':'Lkw / Autotransporter'}</h3><p>{lang==='sr'?'Za veće relacije, više vozila ili profesionalne uvoznike: ponuda partnera sa jasno razdvojenim transportnim troškom.':'Für längere Strecken, mehrere Fahrzeuge oder professionelle Importeure: Partnerangebot mit separat ausgewiesenem Transportpreis.'}</p><button onClick={()=>chooseService('TRUCK_TRANSPORT')}>{lang==='sr'?'Traži ponudu':'Angebot anfragen'}</button></article>
        </div>
      </section>

      <section className="ios-section" id="base">
        <div className="ios-heading"><p className="ios-eyebrow">PHYSICAL NODE · NIŠ</p><h2>{t.base}</h2><p>{t.baseText}</p></div>
        <div className="ios-base"><article><span>BLOCK A</span><strong>{lang==='sr'?'Zakup cele ili dela površine':'Gesamt- oder Teilfläche'}</strong></article><article><span>BLOCK B</span><strong>{lang==='sr'?'Zasebno ili kombinovano':'Separat oder kombiniert'}</strong></article><article><span>IMPORTOS NODE</span><strong>{lang==='sr'?'Prodaja · parkiranje · pregled · primopredaja':'Verkauf · Abstellung · Besichtigung · Übergabe'}</strong></article></div>
        <div className="ios-row"><a className="ios-primary" href="https://calije.daninihub.com/" target="_blank" rel="noreferrer">{lang==='sr'?'Otvori Čalije lokaciju':'Čalije Standort öffnen'}</a><button className="ios-secondary" onClick={()=>chooseService('IMPORT_BASE')}>{lang==='sr'?'Upit za zakup':'Mietanfrage'}</button></div>
      </section>

      <section className="ios-section" id="dealer">
        <div className="ios-heading"><p className="ios-eyebrow">{t.dealer}</p><h2>{lang==='sr'?'Profesionalac ne traži najjeftiniji auto. Traži najbolju maržu posle rizika.':'Profis suchen nicht den billigsten Wagen, sondern die beste Marge nach Risiko.'}</h2><p>{lang==='sr'?'Importability + Origin + Model DNA + Fraud + FieldCheck + landed cost + vrednost u Srbiji = risk-adjusted margin.':'Importability + Origin + Model DNA + Fraud + FieldCheck + Landed Cost + Serbia-Marktwert = risk-adjusted margin.'}</p></div><div className="ios-flow"><span>SEARCH</span><span>VERIFY</span><span>CHECK</span><span>IMPORT</span><span>BASE</span><strong>SELL / MARGIN</strong></div>
      </section>

      <section className="ios-section" id="service-request">
        <div className="ios-heading"><p className="ios-eyebrow">SERVICE DESK</p><h2>{t.request}</h2><p>{t.requestLead}</p></div>
        <form className="ios-request" onSubmit={sendRequest}>
          <label>{lang==='sr'?'Usluga':'Service'}<select value={req.serviceType} onChange={e=>setR('serviceType',e.target.value)}>{SERVICES.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
          <label>{lang==='sr'?'Ime / firma':'Name / Firma'}<input required value={req.name} onChange={e=>setR('name',e.target.value)}/></label>
          <label>Email<input required type="email" value={req.email} onChange={e=>setR('email',e.target.value)}/></label>
          <label>{lang==='sr'?'Telefon':'Telefon'}<input value={req.phone} onChange={e=>setR('phone',e.target.value)}/></label>
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

    <footer className="ios-footer"><div className="ios-footer-brand"><img src="/importos-mark.svg" alt=""/><span><strong>DANINI IMPORTOS</strong><small>Duisburg · Niš</small></span></div><div><a href={`/${lang}/impressum`}>Impressum</a><a href={`/${lang}${lang==='sr'?'/privatnost':'/datenschutz'}`}>{lang==='sr'?'Privatnost':'Datenschutz'}</a><a href={`/${lang}${lang==='sr'?'/uslovi':'/bedingungen'}`}>{lang==='sr'?'Uslovi':'Nutzungsrahmen'}</a></div></footer>
  </div>
}
