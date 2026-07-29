import { useState } from 'react'
import './CapacitySignalPage.css'

const text={
 de:{
  title:'Freien Lkw oder wartende Ladung melden',lead:'Nicht öffentlich. Jede Meldung wird manuell auf Vollständigkeit und mögliche Übereinstimmungen geprüft.',truck:'Freien Lkw melden',freight:'Wartende Ladung melden',
  contact:'Kontakt und Unternehmen',route:'Ort, Zeit und Richtung',equipment:'Fahrzeug und Kapazität',cargo:'Ware und Anforderungen',documents:'Dokumente und Bedingungen',
  company:'Unternehmen',name:'Kontaktperson',email:'E-Mail',phone:'Telefon',country:'Land',postal:'PLZ',city:'Ort',destinationCountry:'Zielland / bevorzugte Länder',destination:'Richtung / Zielregion',availableFrom:'Verfügbar ab',availableUntil:'Verfügbar bis',loadDate:'Ladedatum',loadFrom:'Ladefenster von',loadUntil:'Ladefenster bis',unloadDate:'Gewünschte Zustellung',unloadCity:'Entladeort',
  vehicle:'Fahrzeugaufbau',trailer:'Anhänger / Besonderheit',payload:'Freie Nutzlast (kg)',pallets:'Freie Palettenplätze',loadingMeters:'Freie Lademeter',dimensions:'Nutzbare Maße / Größenbegrenzung',deadhead:'Maximaler Leeranfahrtsradius (km)',driverHours:'Lenk- und Ruhezeit geprüft?',adr:'ADR möglich / erforderlich?',temperature:'Temperaturbereich',loadingType:'Beladung',customs:'Zollstatus / Drittland',
  goods:'Warenbezeichnung',packaging:'Verpackungsart',pieces:'Anzahl Packstücke',weight:'Bruttogewicht (kg)',volume:'Volumen (m³)',goodsLength:'Benötigte Lademeter',special:'Besondere Behandlung / Sicherung',
  cmr:'CMR-Daten vorhanden?',invoice:'Handelsrechnung vorhanden?',packingList:'Packliste vorhanden?',price:'Preisvorstellung / Budget (optional)',payment:'Zahlungsziel (optional)',reference:'Interne Referenz (optional)',details:'Weitere Angaben',
  yes:'Ja',no:'Nein',unknown:'Noch offen',rear:'Hinten',side:'Seitlich',top:'Oben',send:'Zur manuellen Prüfung senden',sending:'Wird gesendet…',ok:'Meldung empfangen',ref:'Referenz',error:'Senden fehlgeschlagen',
  consent:'Ich bestätige, dass die Angaben für eine manuelle Prüfung verwendet werden dürfen. Kontaktdaten dürfen erst nach meiner erneuten Zustimmung an eine mögliche Gegenpartei weitergegeben werden.',
  note:'Kein Transportauftrag und keine öffentliche Frachtenbörse. DaniniHub bestimmt keinen Preis, wählt keinen Vertragspartner, schließt keinen Vertrag und garantiert keine Durchführung.'
 },
 sr:{
  title:'Prijavite slobodan kamion ili teret koji čeka',lead:'Prijava nije javna. Svaki signal se ručno proverava po potpunosti i mogućem podudaranju.',truck:'Prijavi slobodan kamion',freight:'Prijavi teret koji čeka',
  contact:'Kontakt i kompanija',route:'Mesto, vreme i pravac',equipment:'Vozilo i kapacitet',cargo:'Roba i zahtevi',documents:'Dokumenti i uslovi',
  company:'Kompanija',name:'Kontakt osoba',email:'E-mail',phone:'Telefon',country:'Država',postal:'Poštanski broj',city:'Grad / mesto',destinationCountry:'Odredišna država / poželjne države',destination:'Pravac / ciljna oblast',availableFrom:'Dostupan od',availableUntil:'Dostupan do',loadDate:'Datum utovara',loadFrom:'Utovar od',loadUntil:'Utovar do',unloadDate:'Željeni datum istovara',unloadCity:'Mesto istovara',
  vehicle:'Vrsta vozila / karoserije',trailer:'Prikolica / posebna oprema',payload:'Slobodna nosivost (kg)',pallets:'Slobodna paletna mesta',loadingMeters:'Slobodni utovarni metri',dimensions:'Korisne dimenzije / ograničenja',deadhead:'Maksimalni prazan prilaz (km)',driverHours:'Provereno radno vreme vozača?',adr:'ADR moguć / potreban?',temperature:'Temperaturni režim',loadingType:'Način utovara',customs:'Carinski status / treća zemlja',
  goods:'Tačan naziv robe',packaging:'Vrsta pakovanja',pieces:'Broj koleta / komada',weight:'Bruto težina (kg)',volume:'Zapremina (m³)',goodsLength:'Potrebni utovarni metri',special:'Posebno rukovanje / obezbeđenje',
  cmr:'CMR podaci spremni?',invoice:'Komercijalna faktura spremna?',packingList:'Packing lista spremna?',price:'Očekivana cena / budžet (opciono)',payment:'Rok plaćanja (opciono)',reference:'Interna referenca (opciono)',details:'Dodatne informacije',
  yes:'Da',no:'Ne',unknown:'Još nije poznato',rear:'Pozadi',side:'Sa strane',top:'Odozgo',send:'Pošalji na ručnu proveru',sending:'Šaljem…',ok:'Prijava je primljena',ref:'Referenca',error:'Slanje nije uspelo',
  consent:'Potvrđujem da se podaci mogu koristiti za ručnu proveru. Kontakt podaci se mogućoj drugoj strani mogu proslediti tek nakon moje dodatne saglasnosti.',
  note:'Ovo nije transportni nalog niti javna berza tereta. DaniniHub ne određuje cenu, ne bira ugovornog partnera, ne zaključuje ugovor i ne garantuje izvršenje.'
 }
}

const Choice=({name,t,required=false})=><select name={name} required={required}><option value="">—</option><option value="YES">{t.yes}</option><option value="NO">{t.no}</option><option value="UNKNOWN">{t.unknown}</option></select>
const Fieldset=({title,children})=><fieldset><legend>{title}</legend><div className="cs-fields">{children}</div></fieldset>
const L=({label,children,wide=false})=><label className={wide?'cs-wide':''}>{label}{children}</label>

function Form({kind,lang}){
 const t=text[lang]
 const [state,setState]=useState('idle'),[ref,setRef]=useState('')
 const submit=async e=>{
  e.preventDefault();setState('sending')
  const f=Object.fromEntries(new FormData(e.currentTarget))
  const interest=kind==='truck'?t.truck:t.freight
  const lines=Object.entries(f).filter(([key])=>key!=='consent').map(([key,value])=>`${key}: ${value||'—'}`)
  const message=[interest,...lines].join('\n')
  try{
   const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({company:f.company,email:f.email,phone:f.phone,routes:`${f.country||''} ${f.postal||''} ${f.city||''} → ${f.destinationCountry||''} ${f.unloadCity||f.destination||''}`.trim(),fleet:kind==='truck'?[f.vehicle,f.payload&&`${f.payload} kg`,f.pallets&&`${f.pallets} EP`,f.loadingMeters&&`${f.loadingMeters} LDM`].filter(Boolean).join(' · '):'',interest,language:lang,source:kind==='truck'?'capacity-truck':'capacity-freight',message})})
   const data=await r.json().catch(()=>({}))
   if(!r.ok)throw new Error(data.error||`HTTP_${r.status}`)
   setRef(data.reference||'');setState('ok');e.currentTarget.reset()
  }catch{setState('error')}
 }
 return <article className="cs-card"><h2>{kind==='truck'?t.truck:t.freight}</h2><form onSubmit={submit}>
  <Fieldset title={t.contact}>
   <L label={t.company}><input name="company" required maxLength="180"/></L><L label={t.name}><input name="name" required maxLength="120"/></L>
   <L label={t.email}><input name="email" type="email" required maxLength="180"/></L><L label={t.phone}><input name="phone" type="tel" required maxLength="60"/></L>
   <L label={t.reference}><input name="internalReference" maxLength="100"/></L>
  </Fieldset>
  <Fieldset title={t.route}>
   <L label={t.country}><input name="country" required maxLength="80"/></L><L label={t.postal}><input name="postal" required maxLength="20"/></L><L label={t.city}><input name="city" required maxLength="120"/></L>
   {kind==='truck'?<><L label={t.availableFrom}><input name="availableFrom" type="datetime-local" required/></L><L label={t.availableUntil}><input name="availableUntil" type="datetime-local" required/></L><L label={t.destinationCountry}><input name="destinationCountry" required maxLength="120"/></L><L label={t.destination} wide><input name="destination" required maxLength="240"/></L><L label={t.deadhead}><input name="deadheadKm" type="number" min="0" max="2000" required/></L></>:<><L label={t.loadDate}><input name="loadDate" type="date" required/></L><L label={t.loadFrom}><input name="loadFrom" type="time" required/></L><L label={t.loadUntil}><input name="loadUntil" type="time" required/></L><L label={t.destinationCountry}><input name="destinationCountry" required maxLength="80"/></L><L label={t.unloadCity}><input name="unloadCity" required maxLength="160"/></L><L label={t.unloadDate}><input name="unloadDate" type="date" required/></L></>}
  </Fieldset>
  {kind==='truck'?<Fieldset title={t.equipment}>
   <L label={t.vehicle}><input name="vehicle" required placeholder="Curtainsider / Mega / Frigo / Koffer"/></L><L label={t.trailer}><input name="trailer" maxLength="160"/></L>
   <L label={t.payload}><input name="payload" type="number" min="0" max="100000" required/></L><L label={t.pallets}><input name="pallets" type="number" min="0" max="100"/></L><L label={t.loadingMeters}><input name="loadingMeters" type="number" min="0" max="30" step="0.1"/></L><L label={t.dimensions}><input name="dimensions" placeholder="L × B × H"/></L>
   <L label={t.driverHours}><Choice name="driverHours" t={t} required/></L><L label={t.adr}><Choice name="adr" t={t}/></L><L label={t.temperature}><input name="temperature" placeholder="z. B. +2 bis +8 °C"/></L><L label={t.customs}><Choice name="customs" t={t}/></L>
  </Fieldset>:<Fieldset title={t.cargo}>
   <L label={t.goods} wide><input name="goods" required maxLength="240"/></L><L label={t.packaging}><input name="packaging" required placeholder="Paletten / Kartons / Big Bags"/></L><L label={t.pieces}><input name="pieces" type="number" min="1" required/></L>
   <L label={t.weight}><input name="weight" type="number" min="1" max="100000" required/></L><L label={t.volume}><input name="volume" type="number" min="0" max="500" step="0.1"/></L><L label={t.goodsLength}><input name="loadingMeters" type="number" min="0" max="30" step="0.1"/></L><L label={t.dimensions}><input name="dimensions" placeholder="L × B × H"/></L>
   <L label={t.vehicle}><input name="vehicleRequired" required placeholder="Curtainsider / Mega / Frigo / Koffer"/></L><L label={t.loadingType}><select name="loadingType" required><option value="">—</option><option value="REAR">{t.rear}</option><option value="SIDE">{t.side}</option><option value="TOP">{t.top}</option></select></L><L label={t.adr}><Choice name="adr" t={t} required/></L><L label={t.temperature}><input name="temperature"/></L><L label={t.special} wide><textarea name="special" rows="3"/></L>
  </Fieldset>}
  <Fieldset title={t.documents}>
   <L label={t.cmr}><Choice name="cmr" t={t} required/></L><L label={t.invoice}><Choice name="invoice" t={t}/></L><L label={t.packingList}><Choice name="packingList" t={t}/></L><L label={t.customs}><Choice name="customsStatus" t={t}/></L>
   <L label={t.price}><input name="priceExpectation" maxLength="100"/></L><L label={t.payment}><input name="paymentTerms" maxLength="100"/></L><L label={t.details} wide><textarea name="details" rows="5" maxLength="3000"/></L>
  </Fieldset>
  <label className="cs-consent"><input name="consent" value="YES" type="checkbox" required/><span>{t.consent}</span></label>
  <button disabled={state==='sending'}>{state==='sending'?t.sending:t.send}</button>
 </form>{state==='ok'&&<p className="cs-success">{t.ok}. {ref&&<><b>{t.ref}:</b> {ref}</>}</p>}{state==='error'&&<p className="cs-error">{t.error}.</p>}</article>
}

export default function CapacitySignalPage({lang}){
 const t=text[lang]
 return <main className="cs-page"><section className="cs-hero"><p>DANINIHUB CAPACITY SIGNAL</p><h1>{t.title}</h1><span>{t.lead}</span></section><section className="cs-grid"><Form kind="truck" lang={lang}/><Form kind="freight" lang={lang}/></section><section className="cs-note"><strong>{t.note}</strong></section></main>
}