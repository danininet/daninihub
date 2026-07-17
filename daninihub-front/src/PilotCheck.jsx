import { useState } from 'react'
import './PilotCheck.css'

const copy = {
  de: {
    back: 'Zurück zum Operations Desk', title: 'Pilot-Check', subtitle: 'In wenigen Schritten prüfen, ob ein klar begrenzter DaniniHub-Pilot zu Ihrem Betrieb passt.',
    notice: 'Keine automatische Entscheidung. Die Angaben dienen nur zur Vorbereitung eines unverbindlichen Gesprächs.',
    fields: { company:'Unternehmen / Name', fleet:'Fahrzeuge im relevanten Bereich', routes:'Wichtige Relationen', tasks:'Welche Aufgaben binden aktuell Zeit?', availability:'Wann wird Unterstützung benötigt?', systems:'Welche Systeme werden genutzt?', decision:'Wer darf operative Freigaben erteilen?' },
    placeholders: { company:'Beispiel Spedition GmbH', fleet:'z. B. 8', routes:'z. B. Serbien–Deutschland', tasks:'Statusabfragen, ETA, Fahrerkommunikation, Dokumente …', availability:'z. B. werktags 16–22 Uhr', systems:'TMS, E-Mail, WhatsApp, Telefon …', decision:'Name oder Funktion' },
    create:'Pilot-Zusammenfassung erstellen', summary:'Vorläufige Pilot-Zusammenfassung', fit:'Grundsätzlich prüfbar', missing:'Vor einem Gespräch ergänzen', contact:'Gespräch anfragen', reset:'Angaben ändern', labels:['Unternehmen','Flotte','Relationen','Zeitfresser','Zeitfenster','Systeme','Freigaben'],
    missingText:'Nicht angegeben', boundary:'Der endgültige Leistungsrahmen, Erreichbarkeit, Vergütung und die Befugnisse werden ausschließlich schriftlich vereinbart.'
  },
  sr: {
    back: 'Nazad na operativni pult', title: 'Provera pilota', subtitle: 'U nekoliko koraka proverite da li ograničeni DaniniHub pilot odgovara vašoj operativi.',
    notice: 'Nema automatske odluke. Podaci služe samo za pripremu neobavezujućeg razgovora.',
    fields: { company:'Firma / ime', fleet:'Vozila u relevantnom delu poslovanja', routes:'Važne relacije', tasks:'Koji zadaci trenutno oduzimaju vreme?', availability:'Kada je podrška potrebna?', systems:'Koje sisteme koristite?', decision:'Ko može da odobri operativne korake?' },
    placeholders: { company:'Primer Transport d.o.o.', fleet:'npr. 8', routes:'npr. Srbija–Nemačka', tasks:'Statusi, ETA, komunikacija sa vozačima, dokumenta …', availability:'npr. radnim danima 16–22 h', systems:'TMS, e-mail, WhatsApp, telefon …', decision:'Ime ili funkcija' },
    create:'Kreiraj rezime pilota', summary:'Preliminarni rezime pilota', fit:'Moguće za dalju proveru', missing:'Dopuniti pre razgovora', contact:'Pošalji upit', reset:'Izmeni podatke', labels:['Firma','Flota','Relacije','Zadaci','Vreme podrške','Sistemi','Odobrenja'],
    missingText:'Nije navedeno', boundary:'Konačan obim usluge, dostupnost, naknada i ovlašćenja dogovaraju se isključivo pisanim putem.'
  }
}

const keys = ['company','fleet','routes','tasks','availability','systems','decision']

export default function PilotCheck({ lang }) {
  const t = copy[lang]
  const [result, setResult] = useState(null)
  const submit = event => {
    event.preventDefault()
    setResult(Object.fromEntries(new FormData(event.currentTarget)))
    requestAnimationFrame(() => document.getElementById('pilot-check-result')?.scrollIntoView({behavior:'smooth'}))
  }
  const home = lang === 'sr' ? '/sr/operativni-pult-demo' : '/de/operations-desk-demo'
  const contact = lang === 'sr' ? '/sr/?interest=pilot#contact' : '/de/?interest=pilot#contact'
  return <main className="check-shell">
    <header className="check-header"><a href={home}>← {t.back}</a><strong>DaniniHub · PILOT</strong></header>
    <section className="check-page">
      <p className="kicker">PILOT READINESS CHECK</p><h1>{t.title}</h1><p className="check-lead">{t.subtitle}</p><p className="check-notice">{t.notice}</p>
      <form className="check-form" onSubmit={submit}>
        {keys.map((key,index)=><label key={key} className={key==='tasks'?'wide':''}><span>{t.fields[key]}</span>{key==='tasks'?<textarea name={key} placeholder={t.placeholders[key]} required/>:<input name={key} type={key==='fleet'?'number':'text'} min={key==='fleet'?'1':undefined} placeholder={t.placeholders[key]} required={index<4}/>}</label>)}
        <button className="btn" type="submit">{t.create} →</button>
      </form>
      {result&&<section className="check-result" id="pilot-check-result"><p className="kicker">{t.fit}</p><h2>{t.summary}</h2><div className="check-summary">{keys.map((key,index)=><article key={key}><small>{t.labels[index]}</small><strong>{result[key] || t.missingText}</strong></article>)}</div><p>{t.boundary}</p><div className="check-actions"><a className="btn" href={contact}>{t.contact} →</a><button className="check-reset" type="button" onClick={()=>{setResult(null);scrollTo({top:0,behavior:'smooth'})}}>{t.reset}</button></div></section>}
    </section>
  </main>
}
