import { useState } from 'react'
import './CapacitySignalPage.css'

const text={
 de:{title:'Freien Lkw oder wartende Ladung melden',lead:'Nicht öffentlich. Jede Meldung wird manuell geprüft.',truck:'Freien Lkw melden',freight:'Wartende Ladung melden',company:'Unternehmen',name:'Kontaktperson',email:'E-Mail',phone:'Telefon',location:'Standort / Ladeort',destination:'Richtung / Ziel',available:'Verfügbar ab / Ladefenster',vehicle:'Fahrzeugtyp',weight:'Kapazität / Gewicht',details:'Weitere Angaben',send:'Zur Prüfung senden',sending:'Wird gesendet…',ok:'Meldung empfangen',ref:'Referenz',error:'Senden fehlgeschlagen',consent:'Ich stimme der manuellen Prüfung und einer möglichen Kontaktvermittlung zu.',note:'Kein Transportauftrag. DaniniHub bestimmt keinen Preis, schließt keinen Vertrag und garantiert keine Durchführung.'},
 sr:{title:'Prijavite slobodan kamion ili teret koji čeka',lead:'Nije javno. Svaka prijava se ručno proverava.',truck:'Prijavi slobodan kamion',freight:'Prijavi teret koji čeka',company:'Kompanija',name:'Kontakt osoba',email:'E-mail',phone:'Telefon',location:'Lokacija / mesto utovara',destination:'Pravac / odredište',available:'Dostupan od / termin utovara',vehicle:'Tip vozila',weight:'Nosivost / težina',details:'Dodatni podaci',send:'Pošalji na proveru',sending:'Šaljem…',ok:'Prijava je primljena',ref:'Referenca',error:'Slanje nije uspelo',consent:'Saglasan sam sa ručnom proverom i mogućim povezivanjem sa drugom firmom.',note:'Ovo nije transportni nalog. DaniniHub ne određuje cenu, ne zaključuje ugovor i ne garantuje izvršenje.'}
}

function Form({kind,lang}){
 const t=text[lang]
 const [state,setState]=useState('idle'),[ref,setRef]=useState('')
 const submit=async e=>{
  e.preventDefault();setState('sending')
  const f=Object.fromEntries(new FormData(e.currentTarget))
  const interest=kind==='truck'?t.truck:t.freight
  const message=[interest,`Kontakt: ${f.name}`,`Lokacija: ${f.location}`,`Pravac: ${f.destination}`,`Termin: ${f.available}`,`Vozilo: ${f.vehicle||'—'}`,`Kapacitet: ${f.weight||'—'}`,`Dodatno: ${f.details||'—'}`].join('\n')
  try{
   const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({company:f.company,email:f.email,phone:f.phone,routes:`${f.location} → ${f.destination}`,fleet:f.vehicle||f.weight||'',interest,language:lang,source:kind==='truck'?'capacity-truck':'capacity-freight',message})})
   const data=await r.json().catch(()=>({}))
   if(!r.ok)throw new Error()
   setRef(data.reference||'');setState('ok');e.currentTarget.reset()
  }catch{setState('error')}
 }
 return <article className="cs-card"><h2>{kind==='truck'?t.truck:t.freight}</h2><form onSubmit={submit}>
  <label>{t.company}<input name="company" required/></label><label>{t.name}<input name="name" required/></label>
  <label>{t.email}<input name="email" type="email" required/></label><label>{t.phone}<input name="phone" required/></label>
  <label>{t.location}<input name="location" required/></label><label>{t.destination}<input name="destination" required/></label>
  <label>{t.available}<input name="available" required/></label><label>{t.vehicle}<input name="vehicle"/></label>
  <label>{t.weight}<input name="weight"/></label><label className="cs-wide">{t.details}<textarea name="details" rows="4"/></label>
  <label className="cs-consent"><input type="checkbox" required/><span>{t.consent}</span></label>
  <button disabled={state==='sending'}>{state==='sending'?t.sending:t.send}</button>
 </form>{state==='ok'&&<p className="cs-success">{t.ok}. {ref&&<><b>{t.ref}:</b> {ref}</>}</p>}{state==='error'&&<p className="cs-error">{t.error}.</p>}</article>
}

export default function CapacitySignalPage({lang}){
 const t=text[lang]
 return <main className="cs-page"><section className="cs-hero"><p>DANINIHUB CAPACITY SIGNAL</p><h1>{t.title}</h1><span>{t.lead}</span></section><section className="cs-grid"><Form kind="truck" lang={lang}/><Form kind="freight" lang={lang}/></section><section className="cs-note"><strong>{t.note}</strong></section></main>
}
