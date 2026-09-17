import { useState } from 'react'
import './PilotCheck.css'
import './PilotDeliverables.css'

const copy = {
  de: {
    back:'Zurück zu DaniniHub', kicker:'HUMAN + AI OPPORTUNITY CHECK', title:'Was kann aus Ihrem Problem, Wissen oder vorhandenen Wert entstehen?',
    subtitle:'Beschreiben Sie Ihre reale Ausgangslage. DaniniHub strukturiert den Fall, trennt Fakten von Annahmen und prüft, welcher kleine Markttest als Nächstes sinnvoll ist.',
    notice:'Der Check verspricht keinen Umsatz und ersetzt keine Rechts-, Steuer-, Finanz- oder Fachberatung. Er bereitet eine persönliche Prüfung und einen realistischen nächsten Test vor.',
    deliverableTitle:'Was Sie nach dem Check erhalten können',
    deliverables:[['Ausgangslage','Was bereits vorhanden ist: Wissen, Erfahrung, Standort, Publikum, Werkzeug oder Idee.'],['Chancenkarte','Mögliche Nutzer, zahlbare Probleme, offene Annahmen und die stärkste erste Richtung.'],['Erster Test','Ein kleiner nächster Schritt, der Interesse prüft, bevor mehr Zeit oder Geld investiert wird.']],
    fields:{ name:'Name oder Unternehmen', email:'E-Mail', phone:'Telefon / WhatsApp (optional)', situation:'Was haben Sie bereits?', problem:'Welches konkrete Problem möchten Sie lösen?', audience:'Für wen könnte das Ergebnis nützlich sein?', evidence:'Welche Belege oder Rückmeldungen gibt es bereits?', goal:'Was soll in den nächsten 30 Tagen konkret entstehen?', time:'Wie viel Zeit können Sie pro Woche einsetzen?', budget:'Welches Testbudget ist realistisch?', aiUse:'Wie nutzen Sie AI heute?', permission:'Dürfen wir den Fall später anonymisiert als Beispiel verwenden?' },
    placeholders:{ name:'Ihr Name oder Unternehmen', situation:'Erfahrung, Grundstück, Wissen, bestehende Website, Kontakte, Idee …', problem:'Beschreiben Sie nicht nur die Lösungsidee, sondern das reale Problem.', audience:'Menschen, Unternehmen, lokale Nutzer, eine bestimmte Berufsgruppe …', evidence:'Gespräche, Suchanfragen, bestehende Kunden, Beobachtungen – oder noch keine.', goal:'z. B. erste Anfrage, erster Verkauf, Landingpage oder geprüfte Entscheidung' },
    options:{ time:['Bitte auswählen','Unter 2 Stunden','2–5 Stunden','5–10 Stunden','Mehr als 10 Stunden'], budget:['Bitte auswählen','0–50 €','50–200 €','200–500 €','Mehr als 500 €'], aiUse:['Bitte auswählen','Noch gar nicht','Gelegentlich für Fragen','Regelmäßig, aber ohne System','Bereits in einem konkreten Prozess'], permission:['Bitte auswählen','Ja, anonymisiert','Nur nach erneuter Freigabe','Nein'] },
    create:'Opportunity-Zusammenfassung erstellen', resultKicker:'BEREIT FÜR DIE PERSÖNLICHE PRÜFUNG', resultTitle:'Ihre Ausgangslage in einer klaren Struktur',
    summaryLabels:['Ausgangslage','Problem','Nutzer','Belege','30-Tage-Ziel','Zeit','Testbudget','AI-Nutzung','Case-Freigabe'],
    boundary:'Wir prüfen persönlich, ob ein kostenloser nächster Hinweis ausreicht oder ob eine bezahlte Opportunity Map sinnvoll ist. Es entsteht keine automatische Verpflichtung.',
    consentBefore:'Ich habe die', consentLabel:'Datenschutzerklärung', consentAfter:'gelesen und stimme der Verarbeitung zur Beantwortung meiner Anfrage zu.',
    send:'Check zur persönlichen Prüfung senden', sending:'Wird gesendet …', success:'Vielen Dank. Ihr Opportunity Check wurde empfangen. Sie erhalten nach der persönlichen Prüfung eine klare Rückmeldung zum nächsten sinnvollen Schritt.', error:'Der Check konnte nicht gesendet werden. Schreiben Sie bitte an info@daninihub.com.', reset:'Angaben ändern'
  },
  sr: {
    back:'Nazad na DaniniHub', kicker:'HUMAN + AI OPPORTUNITY CHECK', title:'Šta može nastati iz vašeg problema, znanja ili onoga što već posedujete?',
    subtitle:'Opišite stvarnu početnu situaciju. DaniniHub strukturira slučaj, odvaja činjenice od pretpostavki i proverava koji mali tržišni test ima najviše smisla.',
    notice:'Check ne obećava zaradu i ne zamenjuje pravni, poreski, finansijski ili stručni savet. Priprema ličnu procenu i realan sledeći test.',
    deliverableTitle:'Šta možete dobiti posle Checka',
    deliverables:[['Početno stanje','Šta već postoji: znanje, iskustvo, lokacija, publika, alat ili ideja.'],['Mapa prilike','Mogući korisnici, problem za koji bi platili, otvorene pretpostavke i najjači pravac.'],['Prvi test','Mali sledeći korak koji proverava interesovanje pre većeg ulaganja vremena ili novca.']],
    fields:{ name:'Ime ili firma', email:'E-mail', phone:'Telefon / WhatsApp (opciono)', situation:'Šta već imate?', problem:'Koji konkretan problem želite da rešite?', audience:'Kome bi rezultat mogao koristiti?', evidence:'Koji dokazi ili reakcije već postoje?', goal:'Šta konkretno treba da nastane u narednih 30 dana?', time:'Koliko vremena nedeljno možete da uložite?', budget:'Koliki budžet za test je realan?', aiUse:'Kako danas koristite AI?', permission:'Da li kasnije smemo anonimno prikazati slučaj kao primer?' },
    placeholders:{ name:'Vaše ime ili firma', situation:'Iskustvo, plac, znanje, postojeći sajt, kontakti, ideja …', problem:'Opišite stvarni problem, ne samo zamišljeno rešenje.', audience:'Ljudi, firme, lokalni korisnici ili određena profesija …', evidence:'Razgovori, pretrage, postojeći kupci, zapažanja – ili još ništa.', goal:'npr. prvi upit, prva prodaja, landing stranica ili proverena odluka' },
    options:{ time:['Izaberite','Manje od 2 sata','2–5 sati','5–10 sati','Više od 10 sati'], budget:['Izaberite','0–50 €','50–200 €','200–500 €','Više od 500 €'], aiUse:['Izaberite','Još ne koristim','Povremeno postavljam pitanja','Redovno, ali bez sistema','Već koristim u konkretnom procesu'], permission:['Izaberite','Da, anonimno','Samo uz novu saglasnost','Ne'] },
    create:'Napravi Opportunity rezime', resultKicker:'SPREMNO ZA LIČNU PROVERU', resultTitle:'Vaša početna situacija u jasnoj strukturi',
    summaryLabels:['Početno stanje','Problem','Korisnici','Dokazi','Cilj za 30 dana','Vreme','Budžet testa','AI korišćenje','Dozvola za primer'],
    boundary:'Lično proveravamo da li je dovoljan besplatan sledeći savet ili ima smisla plaćena Opportunity Map. Ne nastaje automatska obaveza.',
    consentBefore:'Pročitao/la sam', consentLabel:'obaveštenje o privatnosti', consentAfter:'i saglasan/na sam da se podaci koriste za odgovor na moj upit.',
    send:'Pošalji Check na ličnu proveru', sending:'Šalje se …', success:'Hvala. Opportunity Check je primljen. Posle lične provere dobićete jasan odgovor o sledećem smislenom koraku.', error:'Check nije mogao da bude poslat. Pišite na info@daninihub.com.', reset:'Izmeni podatke'
  }
}

const analysisKeys=['situation','problem','audience','evidence','goal','time','budget','aiUse','permission']
const longKeys=new Set(['situation','problem','audience','evidence','goal'])

export default function AiOpportunityCheck({ lang }) {
  const t=copy[lang]
  const [result,setResult]=useState(null)
  const [state,setState]=useState('idle')

  const createSummary=event=>{
    event.preventDefault()
    setResult(Object.fromEntries(new FormData(event.currentTarget)))
    setState('idle')
    requestAnimationFrame(()=>document.getElementById('opportunity-result')?.scrollIntoView({behavior:'smooth'}))
  }

  const send=async event=>{
    event.preventDefault()
    const form=event.currentTarget
    const contact=Object.fromEntries(new FormData(form))
    const details=analysisKeys.map((key,index)=>`${t.summaryLabels[index]}: ${result[key]}`).join('\n\n')
    const payload={
      source:'ai-opportunity-check', language:lang, company:result.name, email:result.email, phone:result.phone,
      fleet:'', routes:'', tasks:result.problem, availability:result.time, systems:result.aiUse, decision:result.goal,
      interest:lang==='sr'?'AI Opportunity Check – lična procena':'AI Opportunity Check – persönliche Prüfung',
      message:`${details}\n\nKontakt potvrđen: ${contact.consent}`, consent:contact.consent, website:''
    }
    setState('sending')
    try {
      const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      if(!response.ok) throw new Error('send_failed')
      setState('success')
    } catch {
      setState('error')
    }
  }

  const home=lang==='sr'?'/sr/':'/de/'
  return <main className="check-shell">
    <header className="check-header"><a href={home}>← {t.back}</a><strong>DaniniHub · OPPORTUNITY</strong></header>
    <section className="check-page">
      <p className="kicker">{t.kicker}</p><h1>{t.title}</h1><p className="check-lead">{t.subtitle}</p><p className="check-notice">{t.notice}</p>
      <section className="pilot-deliverables"><h2>{t.deliverableTitle}</h2><div>{t.deliverables.map(([title,text],index)=><article key={title}><span>{String(index+1).padStart(2,'0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <form className="check-form" onSubmit={createSummary}>
        <label><span>{t.fields.name}</span><input name="name" required maxLength="180" placeholder={t.placeholders.name}/></label>
        <label><span>{t.fields.email}</span><input name="email" type="email" required maxLength="180"/></label>
        <label className="wide"><span>{t.fields.phone}</span><input name="phone" type="tel" maxLength="60"/></label>
        {analysisKeys.map(key=><label key={key} className={longKeys.has(key)?'wide':''}><span>{t.fields[key]}</span>{t.options[key]?<select name={key} required defaultValue=""><option value="" disabled>{t.options[key][0]}</option>{t.options[key].slice(1).map(option=><option key={option}>{option}</option>)}</select>:<textarea name={key} required placeholder={t.placeholders[key]} maxLength="2000"/>}</label>)}
        <button className="btn" type="submit">{t.create} →</button>
      </form>
      {result&&<section className="check-result" id="opportunity-result"><p className="kicker">{t.resultKicker}</p><h2>{t.resultTitle}</h2><div className="check-summary">{analysisKeys.map((key,index)=><article key={key} className={longKeys.has(key)?'wide':''}><small>{t.summaryLabels[index]}</small><strong>{result[key]}</strong></article>)}</div><p>{t.boundary}</p><form className="check-contact" onSubmit={send}><label className="check-consent"><input name="consent" type="checkbox" value="yes" required/><span>{t.consentBefore} <a href={lang==='sr'?'/sr/privatnost':'/de/datenschutz'} target="_blank" rel="noopener noreferrer">{t.consentLabel}</a> {t.consentAfter}</span></label><button className="btn" type="submit" disabled={state==='sending'||state==='success'}>{state==='sending'?t.sending:t.send+' →'}</button>{state==='success'&&<p className="check-success" role="status">{t.success}</p>}{state==='error'&&<p className="check-error" role="alert">{t.error}</p>}</form><button className="check-reset" type="button" onClick={()=>{setResult(null);setState('idle');scrollTo({top:0,behavior:'smooth'})}}>{t.reset}</button></section>}
    </section>
  </main>
}
