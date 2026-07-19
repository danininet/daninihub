import { useState } from 'react'
import './PilotCheck.css'
import './PilotDeliverables.css'

const copy = {
  de: {
    back: 'Zurück zum Operations Desk', title: 'Pilot-Check', subtitle: 'In wenigen Schritten prüfen, ob ein klar begrenzter DaniniHub-Pilot zu Ihrem Betrieb passt.',
    notice: 'Keine automatische Entscheidung. Die Angaben dienen nur zur Vorbereitung einer persönlichen, unverbindlichen Prüfung.',
    fields: {
      company:'Unternehmen / Name', country:'Sitz des Unternehmens', fleet:'Fahrzeuge im relevanten Bereich', transportType:'Schwerpunkt im Transport', routes:'Wichtige DACH-Relationen', dachFrequency:'Wie häufig fahren Sie DACH-Relationen?', tasks:'Welche Aufgaben binden aktuell Zeit?', availability:'Wann wird Unterstützung benötigt?', systems:'Welche Systeme werden genutzt?', pilotScope:'Welcher kleine Pilotumfang wäre realistisch?', decision:'Wer darf operative Freigaben erteilen?'
    },
    placeholders: {
      company:'Beispiel Spedition GmbH', fleet:'z. B. 8', routes:'z. B. Serbien–Deutschland und Kroatien–Österreich', tasks:'Statusabfragen, ETA, Fahrerkommunikation, Dokumente …', availability:'z. B. werktags 16–22 Uhr', systems:'TMS, E-Mail, WhatsApp, Telefon …', pilotScope:'z. B. eine Relation, drei Fahrzeuge oder klar definierte Fälle', decision:'Funktion oder verantwortliche Rolle'
    },
    options: {
      country:['Bitte auswählen','Serbien','Kroatien','Bosnien und Herzegowina','Slowenien','Montenegro','Nordmazedonien','Bulgarien','Rumänien','Deutschland','Österreich','Schweiz','Anderes Land'],
      transportType:['Bitte auswählen','FTL','LTL / Sammelgut','Intermodal','Container','Spedition ohne eigenen Fuhrpark','Gemischtes Modell'],
      dachFrequency:['Bitte auswählen','Täglich','Mehrmals pro Woche','Wöchentlich','Mehrmals pro Monat','Gelegentlich']
    },
    create:'Pilot-Zusammenfassung erstellen', summary:'Vorläufige Pilot-Zusammenfassung', fit:'Bereit für persönliche Prüfung', contact:'Strukturierte Anfrage senden', reset:'Angaben ändern',
    labels:['Unternehmen','Land','Flotte','Transportart','Relationen','DACH-Frequenz','Zeitfresser','Zeitfenster','Systeme','Pilotumfang','Freigaben'],
    missingText:'Nicht angegeben', boundary:'Der endgültige Leistungsrahmen, Erreichbarkeit, Vergütung und die Befugnisse werden ausschließlich schriftlich vereinbart.',
    email:'E-Mail', phone:'Telefon (optional)', privacyBefore:'Ich habe die', privacyLabel:'Datenschutzerklärung', privacyAfter:'zur Kenntnis genommen. Meine Angaben werden zur Bearbeitung meiner Anfrage verarbeitet.', send:'Pilot-Anfrage senden', success:'Vielen Dank. Die strukturierte Pilot-Anfrage wurde gesendet; eine Bestätigung folgt per E-Mail.', error:'Die Anfrage konnte nicht gesendet werden. Schreiben Sie bitte an info@daninihub.com.',
    payloadLabels:{ country:'Land', transportType:'Transportart', dachFrequency:'DACH-Frequenz', pilotScope:'Pilotumfang' },
    deliverableTitle:'Was ein begrenzter Pilot konkret prüft', deliverables:[['Umfang','Eine Relation oder kleine Fahrzeuggruppe, definierte Aufgaben und feste Zeitfenster.'],['Arbeitsnachweis','Status- und ETA-Protokoll, dokumentierte Abweichungen, Eskalationen und Übergaben.'],['Auswertung','Gemeinsame Bewertung anhand vorab vereinbarter Kriterien – ohne automatische Verlängerung.']]
  },
  sr: {
    back: 'Nazad na DACH Operations Desk', title: 'Provera pilota', subtitle: 'U nekoliko koraka proverite da li ograničeni DaniniHub pilot-projekat odgovara vašoj operativi.',
    notice: 'Nema automatske odluke. Podaci služe samo za ličnu i neobavezujuću proveru mogućeg pilota.',
    fields: {
      company:'Firma / ime', country:'Sedište firme', fleet:'Vozila u relevantnom delu poslovanja', transportType:'Glavni tip transporta', routes:'Važne DACH relacije', dachFrequency:'Koliko često vozite DACH relacije?', tasks:'Koji zadaci trenutno oduzimaju vreme?', availability:'Kada je podrška potrebna?', systems:'Koje sisteme koristite?', pilotScope:'Koji mali obim pilota bi bio realan?', decision:'Ko može da odobri operativne korake?'
    },
    placeholders: {
      company:'Primer Transport d.o.o.', fleet:'npr. 8', routes:'npr. Srbija–Nemačka i Hrvatska–Austrija', tasks:'Statusi, ETA, komunikacija sa vozačima, dokumenta …', availability:'npr. radnim danima 16–22 h', systems:'TMS, e-mail, WhatsApp, telefon …', pilotScope:'npr. jedna relacija, tri vozila ili jasno definisani slučajevi', decision:'Funkcija ili odgovorna uloga'
    },
    options: {
      country:['Izaberite','Srbija','Hrvatska','Bosna i Hercegovina','Slovenija','Crna Gora','Severna Makedonija','Bugarska','Rumunija','Nemačka','Austrija','Švajcarska','Druga država'],
      transportType:['Izaberite','FTL','LTL / zbirni transport','Intermodal','Kontejnerski transport','Špedicija bez sopstvenog voznog parka','Mešoviti model'],
      dachFrequency:['Izaberite','Svakodnevno','Više puta nedeljno','Jednom nedeljno','Više puta mesečno','Povremeno']
    },
    create:'Kreiraj rezime pilota', summary:'Preliminarni rezime pilota', fit:'Spremno za ličnu proveru', contact:'Pošaljite strukturisan upit', reset:'Izmeni podatke',
    labels:['Firma','Država','Flota','Tip transporta','Relacije','DACH učestalost','Zadaci','Vreme podrške','Sistemi','Obim pilota','Odobrenja'],
    missingText:'Nije navedeno', boundary:'Konačan obim usluge, dostupnost, naknada i ovlašćenja dogovaraju se isključivo pisanim putem.',
    email:'E-mail', phone:'Telefon (opciono)', privacyBefore:'Pročitao/la sam', privacyLabel:'obaveštenje o privatnosti', privacyAfter:'Moji podaci se obrađuju radi odgovora na upit.', send:'Pošaljite upit za pilot-projekat', success:'Hvala. Strukturisan upit za pilot-projekat je poslat, a potvrda stiže na vašu e-mail adresu.', error:'Upit nije mogao da bude poslat. Pišite direktno na info@daninihub.com.',
    payloadLabels:{ country:'Država', transportType:'Tip transporta', dachFrequency:'DACH učestalost', pilotScope:'Obim pilota' },
    deliverableTitle:'Šta konkretno proverava ograničeni pilot', deliverables:[['Obim','Jedna relacija ili mala grupa vozila, definisani zadaci i određeni vremenski period.'],['Dokaz rada','Evidencija statusa i ETA, dokumentovana odstupanja, eskalacije i predaje.'],['Evaluacija','Zajednička procena prema unapred dogovorenim kriterijumima – bez automatskog produženja.']]
  }
}

const keys = ['company','country','fleet','transportType','routes','dachFrequency','tasks','availability','systems','pilotScope','decision']
const wideKeys = new Set(['routes','tasks','pilotScope'])
const optionalKeys = new Set(['systems'])

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
    const routes = `${result.routes}\n${t.payloadLabels.country}: ${result.country}\n${t.payloadLabels.dachFrequency}: ${result.dachFrequency}`
    const tasks = `${result.tasks}\n${t.payloadLabels.transportType}: ${result.transportType}\n${t.payloadLabels.pilotScope}: ${result.pilotScope}`
    const payload = {
      source: 'pilot-check', language: lang, company: result.company, email: contact.email, phone: contact.phone,
      fleet: result.fleet, routes, tasks, availability: result.availability, systems: result.systems, decision: result.decision,
      country: result.country, transportType: result.transportType, dachFrequency: result.dachFrequency, pilotScope: result.pilotScope,
      interest: lang === 'sr' ? 'Pilot-projekat za transportnu firmu' : 'Pilotprojekt für ein Transportunternehmen',
      message: lang === 'sr' ? 'Strukturisan upit poslat putem DaniniHub provere pilota.' : 'Strukturierte Anfrage über den DaniniHub Pilot-Check.',
      consent: contact.consent, website: ''
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

  const home = lang === 'sr' ? '/sr/' : '/de/'
  return <main className="check-shell">
    <header className="check-header"><a href={home}>← {t.back}</a><strong>DaniniHub · PILOT</strong></header>
    <section className="check-page">
      <p className="kicker">PILOT READINESS CHECK</p><h1>{t.title}</h1><p className="check-lead">{t.subtitle}</p><p className="check-notice">{t.notice}</p>
      <section className="pilot-deliverables"><h2>{t.deliverableTitle}</h2><div>{t.deliverables.map(([title,text],index)=><article key={title}><span>{String(index+1).padStart(2,'0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <form className="check-form" onSubmit={submit}>
        {keys.map(key => <label key={key} className={wideKeys.has(key)?'wide':''}>
          <span>{t.fields[key]}</span>
          {t.options[key]
            ? <select name={key} required defaultValue=""><option value="" disabled>{t.options[key][0]}</option>{t.options[key].slice(1).map(option=><option key={option} value={option}>{option}</option>)}</select>
            : (key==='tasks'||key==='pilotScope')
              ? <textarea name={key} placeholder={t.placeholders[key]} required={!optionalKeys.has(key)}/>
              : <input name={key} type={key==='fleet'?'number':'text'} min={key==='fleet'?'1':undefined} placeholder={t.placeholders[key]} required={!optionalKeys.has(key)}/>
          }
        </label>)}
        <button className="btn" type="submit">{t.create} →</button>
      </form>
      {result&&<section className="check-result" id="pilot-check-result"><p className="kicker">{t.fit}</p><h2>{t.summary}</h2><div className="check-summary">{keys.map((key,index)=><article key={key} className={wideKeys.has(key)?'wide':''}><small>{t.labels[index]}</small><strong>{result[key] || t.missingText}</strong></article>)}</div><p>{t.boundary}</p><h3>{t.contact}</h3><form className="check-contact" onSubmit={send}><label><span>{t.email}</span><input name="email" type="email" required maxLength="180"/></label><label><span>{t.phone}</span><input name="phone" type="tel" maxLength="60"/></label><label className="check-consent"><input name="consent" type="checkbox" value="yes" required/><span>{t.privacyBefore} <a href={lang==='sr'?'/sr/privatnost':'/de/datenschutz'} target="_blank" rel="noopener noreferrer">{t.privacyLabel}</a> {t.privacyAfter}</span></label><button className="btn" type="submit" disabled={formState==='sending'}>{formState==='sending'?'…':t.send+' →'}</button>{formState==='success'&&<p className="check-success" role="status">{t.success}</p>}{formState==='error'&&<p className="check-error" role="alert">{t.error}</p>}</form><button className="check-reset" type="button" onClick={()=>{setResult(null);setFormState('idle');scrollTo({top:0,behavior:'smooth'})}}>{t.reset}</button></section>}
    </section>
  </main>
}