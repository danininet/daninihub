import { useState } from 'react'
import './PilotCheck.css'
import './PilotDeliverables.css'

const copy = {
  de: {
    back: 'Zurück zum Operations Desk', title: 'Pilot-Check', subtitle: 'In wenigen Schritten prüfen, ob ein klar begrenzter DaniniHub-Pilot zu Ihrem Betrieb passt.',
    notice: 'Keine automatische Entscheidung. Die Angaben dienen nur zur Vorbereitung eines unverbindlichen Gesprächs.',
    fields: { company:'Unternehmen / Name', fleet:'Fahrzeuge im relevanten Bereich', routes:'Wichtige Relationen', tasks:'Welche Aufgaben binden aktuell Zeit?', availability:'Wann wird Unterstützung benötigt?', systems:'Welche Systeme werden genutzt?', decision:'Wer darf operative Freigaben erteilen?' },
    placeholders: { company:'Beispiel Spedition GmbH', fleet:'z. B. 8', routes:'z. B. Serbien–Deutschland', tasks:'Statusabfragen, ETA, Fahrerkommunikation, Dokumente …', availability:'z. B. werktags 16–22 Uhr', systems:'TMS, E-Mail, WhatsApp, Telefon …', decision:'Name oder Funktion' },
    create:'Pilot-Zusammenfassung erstellen', summary:'Vorläufige Pilot-Zusammenfassung', fit:'Grundsätzlich prüfbar', contact:'Strukturierte Anfrage senden', reset:'Angaben ändern', labels:['Unternehmen','Flotte','Relationen','Zeitfresser','Zeitfenster','Systeme','Freigaben'],
    missingText:'Nicht angegeben', boundary:'Der endgültige Leistungsrahmen, Erreichbarkeit, Vergütung und die Befugnisse werden ausschließlich schriftlich vereinbart.',
    email:'E-Mail', phone:'Telefon (optional)', privacyBefore:'Ich habe die', privacyLabel:'Datenschutzerklärung', privacyAfter:'zur Kenntnis genommen. Meine Angaben werden zur Bearbeitung meiner Anfrage verarbeitet.', send:'Pilot-Anfrage senden', success:'Vielen Dank. Die strukturierte Pilot-Anfrage wurde gesendet; eine Bestätigung folgt per E-Mail.', error:'Die Anfrage konnte nicht gesendet werden. Schreiben Sie bitte an info@daninihub.com.',
    deliverableTitle:'Was ein begrenzter Pilot konkret prüft', deliverables:[['Umfang','Eine Relation oder kleine Fahrzeuggruppe, definierte Aufgaben und feste Zeitfenster.'],['Arbeitsnachweis','Status- und ETA-Protokoll, dokumentierte Abweichungen, Eskalationen und Übergaben.'],['Auswertung','Gemeinsame Bewertung anhand vorab vereinbarter Kriterien – ohne automatische Verlängerung.']]
  },
  sr: {
    back: 'Nazad na operativni pult', title: 'Provera pilota', subtitle: 'U nekoliko koraka proverite da li ograničeni DaniniHub pilot-projekat odgovara vašoj operativi.',
    notice: 'Nema automatske odluke. Podaci služe samo za pripremu neobavezujućeg razgovora.',
    fields: { company:'Firma / ime', fleet:'Vozila u relevantnom delu poslovanja', routes:'Važne relacije', tasks:'Koji zadaci trenutno oduzimaju vreme?', availability:'Kada je podrška potrebna?', systems:'Koje sisteme koristite?', decision:'Ko može da odobri operativne korake?' },
    placeholders: { company:'Primer Transport d.o.o.', fleet:'npr. 8', routes:'npr. Srbija–Nemačka', tasks:'Statusi, ETA, komunikacija sa vozačima, dokumenta …', availability:'npr. radnim danima 16–22 h', systems:'TMS, e-mail, WhatsApp, telefon …', decision:'Ime ili funkcija' },
    create:'Kreiraj rezime pilota', summary:'Preliminarni rezime pilota', fit:'Moguće za dalju proveru', contact:'Pošaljite strukturisan upit', reset:'Izmeni podatke', labels:['Firma','Flota','Relacije','Zadaci','Vreme podrške','Sistemi','Odobrenja'],
    missingText:'Nije navedeno', boundary:'Konačan obim usluge, dostupnost, naknada i ovlašćenja dogovaraju se isključivo pisanim putem.',
    email:'E-mail', phone:'Telefon (opciono)', privacyBefore:'Pročitao/la sam', privacyLabel:'obaveštenje o privatnosti', privacyAfter:'Moji podaci se obrađuju radi odgovora na upit.', send:'Pošaljite upit za pilot-projekat', success:'Hvala. Strukturisan upit za pilot-projekat je poslat, a potvrda stiže na vašu e-mail adresu.', error:'Upit nije mogao da bude poslat. Pišite direktno na info@daninihub.com.',
    deliverableTitle:'Šta konkretno proverava ograničeni pilot', deliverables:[['Obim','Jedna relacija ili mala grupa vozila, definisani zadaci i određeni vremenski period.'],['Dokaz rada','Evidencija statusa i ETA, dokumentovana odstupanja, eskalacije i predaje.'],['Evaluacija','Zajednička procena prema unapred dogovorenim kriterijumima – bez automatskog produženja.']]
  }
}

const keys = ['company','fleet','routes','tasks','availability','systems','decision']

export default function PilotCheck({ lang }) {
  const t = copy[lang]
  const [result, setResult] = useState(null)
  const [formState, setFormState] = useState('idle')
  const submit = event => {
    event.preventDefault()
    setResult(Object.fromEntries(new FormData(event.currentTarget)))
    setFormState('idle')
    requestAnimationFrame(() => document.getElementById('pilot-check-result')?.scrollIntoView({behavior:'smooth'}))
  }
  const send = async event => {
    event.preventDefault()
    const form = event.currentTarget
    const contact = Object.fromEntries(new FormData(form))
    const payload = {
      source: 'pilot-check',
      language: lang,
      company: result.company,
      email: contact.email,
      phone: contact.phone,
      fleet: result.fleet,
      routes: result.routes,
      tasks: result.tasks,
      availability: result.availability,
      systems: result.systems,
      decision: result.decision,
      interest: lang === 'sr' ? 'Pilot-projekat za transportnu firmu' : 'Pilotprojekt für ein Transportunternehmen',
      message: lang === 'sr' ? 'Strukturisan upit poslat putem DaniniHub provere pilota.' : 'Strukturierte Anfrage über den DaniniHub Pilot-Check.',
      consent: contact.consent,
      website: ''
    }
    setFormState('sending')
    try {
      const response = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
      if (!response.ok) throw new Error('send_failed')
      form.reset()
      setFormState('success')
    } catch {
      setFormState('error')
    }
  }
  const home = lang === 'sr' ? '/sr/operativni-pult-demo' : '/de/operations-desk-demo'
  return <main className="check-shell">
    <header className="check-header"><a href={home}>← {t.back}</a><strong>DaniniHub · PILOT</strong></header>
    <section className="check-page">
      <p className="kicker">PILOT READINESS CHECK</p><h1>{t.title}</h1><p className="check-lead">{t.subtitle}</p><p className="check-notice">{t.notice}</p>
      <section className="pilot-deliverables"><h2>{t.deliverableTitle}</h2><div>{t.deliverables.map(([title,text],index)=><article key={title}><span>{String(index+1).padStart(2,'0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <form className="check-form" onSubmit={submit}>
        {keys.map((key,index)=><label key={key} className={key==='tasks'?'wide':''}><span>{t.fields[key]}</span>{key==='tasks'?<textarea name={key} placeholder={t.placeholders[key]} required/>:<input name={key} type={key==='fleet'?'number':'text'} min={key==='fleet'?'1':undefined} placeholder={t.placeholders[key]} required={index<4}/>}</label>)}
        <button className="btn" type="submit">{t.create} →</button>
      </form>
      {result&&<section className="check-result" id="pilot-check-result"><p className="kicker">{t.fit}</p><h2>{t.summary}</h2><div className="check-summary">{keys.map((key,index)=><article key={key}><small>{t.labels[index]}</small><strong>{result[key] || t.missingText}</strong></article>)}</div><p>{t.boundary}</p><h3>{t.contact}</h3><form className="check-contact" onSubmit={send}><label><span>{t.email}</span><input name="email" type="email" required maxLength="180"/></label><label><span>{t.phone}</span><input name="phone" type="tel" maxLength="60"/></label><label className="check-consent"><input name="consent" type="checkbox" value="yes" required/><span>{t.privacyBefore} <a href={lang==='sr'?'/sr/privatnost':'/de/datenschutz'} target="_blank" rel="noopener noreferrer">{t.privacyLabel}</a> {t.privacyAfter}</span></label><button className="btn" type="submit" disabled={formState==='sending'}>{formState==='sending'?'…':t.send+' →'}</button>{formState==='success'&&<p className="check-success" role="status">{t.success}</p>}{formState==='error'&&<p className="check-error" role="alert">{t.error}</p>}</form><button className="check-reset" type="button" onClick={()=>{setResult(null);setFormState('idle');scrollTo({top:0,behavior:'smooth'})}}>{t.reset}</button></section>}
    </section>
  </main>
}
