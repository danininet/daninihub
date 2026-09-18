import { useEffect, useState } from 'react'
import './RevenueOSLanding.css'

const COPY = {
  de: {
    nav: ['System','AI Office','Case 01','Kontakt'],
    eyebrow: 'DANINI · HUMAN + AI REVENUE OS',
    title: 'Wir bauen keine KI-Demo. Wir bauen den kürzesten Weg vom echten Problem zur bezahlten Lösung.',
    lead: 'DaniniHub findet einen messbaren Engpass, baut ein kleines Angebot, testet es mit echten Käufern und automatisiert erst das, was bezahlt wird. KI führt die digitale Arbeit. Der Mensch kontrolliert Geld, Recht und wichtige Entscheidungen.',
    primary: 'Problem prüfen lassen',
    secondary: 'Case 01 ansehen',
    rule: 'Betriebsregel: Kein Erfolg ohne Marktsignal. Traffic ist kein Umsatz. Automatisierung ist kein Ergebnis.',
    flowTitle: 'So arbeitet das System',
    flow: [
      ['SIGNAL','Problem mit echtem Zeit-, Geld- oder Reibungsverlust identifizieren.'],
      ['OFFER','Kleinstes verkaufbares Angebot formulieren.'],
      ['SELL','Mit echten Käufern testen, bevor eine große Plattform gebaut wird.'],
      ['EXECUTE','Recherche, Vorbereitung, Follow-up und operative Schritte durch KI-Agenten ausführen.'],
      ['APPROVE','Geld, Verträge und rechtlich relevante Aktionen vom Menschen freigeben lassen.'],
      ['EVIDENCE','Anfrage, Termin, Zahlung und Wiederholung messen. Danach: SCALE, CHANGE oder KILL.']
    ],
    unitEyebrow: 'REVENUE UNIT #1',
    unitTitle: 'AI Office 24/7 für lokale DACH-Betriebe',
    unitLead: 'Für kleine Dienstleistungsbetriebe, die Anfragen verlieren, weil Telefon, WhatsApp, E-Mail, Terminabstimmung und Follow-up zwischen Tagesgeschäft und Feierabend hängen bleiben.',
    unitItems: ['Anfragen aufnehmen und vorsortieren','Kontaktdaten, Bedarf, Ort, Fotos und Wunschzeit erfassen','Termine vorbereiten oder buchen','Offene Angebote nachfassen','Nach erledigter Leistung Feedback anstoßen','Unklare Fälle an einen Menschen eskalieren'],
    priceTitle: 'Kommerzieller Test erst nach Fit-Prüfung',
    price1: 'Pilotpreis wird im konkreten Angebot festgelegt',
    price2: 'Monatlicher Betrieb erst nach messbarem Pilot-Signal',
    priceNote: 'Öffentliche Preisangaben sind noch kein verbindliches Angebot. Endpreis und steuerliche Behandlung werden vor Auftragserteilung eindeutig ausgewiesen.',
    caseTitle: 'Case 01 · Čalije',
    caseText: 'Ein reales Grundstück in Niš wird nach demselben Prinzip behandelt: Verfahren klären, Nachfrage testen, Minimal-MVP definieren, erste Transaktion messen und erst danach investieren.',
    caseCta: 'Case 01 öffnen',
    contactTitle: 'Wo verliert Ihr Betrieb heute Zeit oder Anfragen?',
    contactText: 'Schreiben Sie den Engpass in eigenen Worten. Wir prüfen nicht, ob „KI interessant“ ist, sondern ob ein kleiner bezahlbarer Test einen realen Nutzen zeigen kann.',
    name: 'Unternehmen / Name', email: 'E-Mail', phone: 'Telefon / WhatsApp (optional)', message: 'Was läuft heute schlecht oder kostet unnötig Zeit?', consent: 'Ich habe die Datenschutzerklärung zur Kenntnis genommen. Diese Bestätigung ist keine Marketing-Einwilligung.', send: 'Markttest anfragen', success: 'Anfrage erhalten. Der nächste Schritt ist die Fit-Prüfung und ein kleiner, klar abgegrenzter Test.', error: 'Senden fehlgeschlagen. Bitte schreiben Sie an info@daninihub.com.',
    footer: 'DaniniHub · Revenue OS · Duisburg · B2B',
    b2b: 'Angebot ausschließlich für Unternehmer und Unternehmen. Kein automatischer Vertragsschluss über das Formular.',
    sensitive: 'Bitte keine Passwörter, Ausweisdaten, Gesundheitsdaten oder Geschäftsgeheimnisse über das öffentliche Formular senden.',
    frictionEyebrow: 'PROCESS FRICTION CHECK', frictionTitle: 'Wie viel Reibung steckt heute im Anfrageprozess?', frictionLead: 'Vier Betriebswerte reichen für eine erste Orientierung. Die Berechnung bleibt lokal im Browser und ist keine Umsatzprognose.', adminHours: 'Admin-Stunden pro Woche', missedCalls: 'Verpasste oder unbeantwortete Anfragen pro Woche', responseHours: 'Typische Antwortzeit in Stunden', channels: 'Aktive Anfragekanäle', frictionScore: 'Friction Score', monthlyHours: 'Admin-Zeit pro Monat', frictionLow: 'niedrig', frictionMed: 'mittel', frictionHigh: 'hoch', frictionNote: 'Orientierungswert, keine Garantie für Einsparung oder Mehrumsatz.', useResult: 'Ergebnis wird dem Fit-Check beigefügt.',
    privacy: 'Datenschutz', imprint: 'Impressum', cookies: 'Cookies', terms: 'B2B-Rahmen', ai: 'KI-Transparenz'
  },
  sr: {
    nav: ['Sistem','AI Office','Case 01','Kontakt'],
    eyebrow: 'DANINI · HUMAN + AI REVENUE OS',
    title: 'Ne pravimo AI demonstraciju. Pravimo najkraći put od stvarnog problema do plaćenog rešenja.',
    lead: 'DaniniHub pronalazi merljivo usko grlo, pravi malu ponudu, testira je sa stvarnim kupcima i automatizuje tek ono što ljudi plaćaju. AI vodi digitalni rad. Čovek kontroliše novac, pravo i važne odluke.',
    primary: 'Pošalji problem na proveru',
    secondary: 'Pogledaj Case 01',
    rule: 'Operativno pravilo: nema uspeha bez tržišnog signala. Poseta nije prihod. Automatizacija nije rezultat.',
    flowTitle: 'Kako sistem radi',
    flow: [
      ['SIGNAL','Pronađi problem koji već troši vreme, novac ili stvara ozbiljnu frikciju.'],
      ['OFFER','Napravi najmanju ponudu koju ima smisla prodati.'],
      ['SELL','Testiraj sa stvarnim kupcima pre izgradnje velike platforme.'],
      ['EXECUTE','AI agenti izvršavaju istraživanje, pripremu, follow-up i operativne korake.'],
      ['APPROVE','Čovek potvrđuje novac, ugovore i pravno važne radnje.'],
      ['EVIDENCE','Meri upit, termin, uplatu i ponovljenu uplatu. Zatim: SCALE, CHANGE ili KILL.']
    ],
    unitEyebrow: 'REVENUE UNIT #1',
    unitTitle: 'AI Office 24/7 za lokalne DACH firme',
    unitLead: 'Za male uslužne firme koje gube upite zato što telefon, WhatsApp, email, termini i follow-up ostaju između dnevnog posla i večernje administracije.',
    unitItems: ['Prijem i osnovna kvalifikacija upita','Prikupljanje kontakta, potrebe, lokacije, fotografija i željenog termina','Priprema ili rezervacija termina','Praćenje otvorenih ponuda','Traženje povratne informacije posle usluge','Prosleđivanje nejasnih slučajeva čoveku'],
    priceTitle: 'Komercijalni test tek posle provere fit-a',
    price1: 'Cena pilota se definiše u konkretnoj ponudi',
    price2: 'Mesečni rad tek nakon merljivog signala iz pilota',
    priceNote: 'Javni navodi nisu obavezujuća ponuda. Konačna cena i poreski tretman biće jasno navedeni pre prihvatanja posla.',
    caseTitle: 'Case 01 · Čalije',
    caseText: 'Stvarni plac u Nišu tretiramo istim principom: prvo procedura, zatim test potražnje, minimalni MVP, prva transakcija i tek onda veće ulaganje.',
    caseCta: 'Otvori Case 01',
    contactTitle: 'Gde vaša firma danas gubi vreme ili upite?',
    contactText: 'Napišite problem svojim rečima. Ne proveravamo da li je „AI zanimljiv“, nego da li mali plaćeni test može da pokaže stvarnu korist.',
    name: 'Firma / ime', email: 'E-mail', phone: 'Telefon / WhatsApp (opciono)', message: 'Šta danas ne radi kako treba ili bespotrebno troši vreme?', consent: 'Pročitao/la sam obaveštenje o privatnosti. Ova potvrda nije saglasnost za marketing.', send: 'Zatraži tržišni test', success: 'Upit je primljen. Sledeći korak je provera fit-a i mali jasno ograničen test.', error: 'Slanje nije uspelo. Pišite na info@daninihub.com.',
    footer: 'DaniniHub · Revenue OS · Duisburg · B2B',
    b2b: 'Ponuda je namenjena isključivo preduzetnicima i kompanijama. Kontakt forma sama ne zaključuje ugovor.',
    sensitive: 'Ne šaljite lozinke, podatke iz ličnih dokumenata, zdravstvene podatke ni poslovne tajne kroz javnu formu.',
    frictionEyebrow: 'PROCESS FRICTION CHECK', frictionTitle: 'Koliko trenja danas postoji u prijemu upita?', frictionLead: 'Četiri operativna podatka daju početnu orijentaciju. Račun ostaje lokalno u pregledaču i nije prognoza prihoda.', adminHours: 'Sati administracije nedeljno', missedCalls: 'Propušteni ili neobrađeni upiti nedeljno', responseHours: 'Tipično vreme odgovora u satima', channels: 'Aktivni kanali za upite', frictionScore: 'Friction Score', monthlyHours: 'Administracija mesečno', frictionLow: 'nisko', frictionMed: 'srednje', frictionHigh: 'visoko', frictionNote: 'Orijentacioni rezultat, bez garancije uštede ili dodatnog prihoda.', useResult: 'Rezultat se dodaje fit-check upitu.',
    privacy: 'Privatnost', imprint: 'Impresum', cookies: 'Kolačići', terms: 'B2B okvir', ai: 'AI transparentnost'
  }
}

export default function RevenueOSLanding({ lang='de', onLanguage }) {
  const t = COPY[lang] || COPY.de
  const [state,setState] = useState('idle')
  const [friction,setFriction] = useState({adminHours:6,missedCalls:3,responseHours:4,channels:3})
  const frictionScore = Math.min(100,
    Math.max(0,Number(friction.adminHours)||0)*4 +
    Math.max(0,Number(friction.missedCalls)||0)*8 +
    Math.max(0,Number(friction.responseHours)||0)*3 +
    Math.max(0,(Number(friction.channels)||1)-1)*5
  )
  const frictionBand = frictionScore >= 60 ? t.frictionHigh : frictionScore >= 30 ? t.frictionMed : t.frictionLow
  const monthlyHours = Math.round((Math.max(0,Number(friction.adminHours)||0)*4.33)*10)/10
  const frictionSummary = `${t.frictionScore}: ${frictionScore}/100 (${frictionBand}); ${t.monthlyHours}: ${monthlyHours}h; ${t.adminHours}: ${friction.adminHours}; ${t.missedCalls}: ${friction.missedCalls}; ${t.responseHours}: ${friction.responseHours}; ${t.channels}: ${friction.channels}.`

  useEffect(()=>{
    document.documentElement.lang = lang
    document.title = lang === 'sr' ? 'DaniniHub Revenue OS | Od problema do plaćenog testa' : 'DaniniHub Revenue OS | Vom Problem zum bezahlten Markttest'
    const d = lang === 'sr'
      ? 'Human + AI sistem koji pronalazi problem, testira ponudu i meri stvarne tržišne signale pre skaliranja.'
      : 'Human+AI-System, das reale Probleme findet, Angebote testet und messbare Marktsignale vor der Skalierung verlangt.'
    document.querySelector('meta[name="description"]')?.setAttribute('content',d)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href',`https://daninihub.com/${lang}/`)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content',d)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content',`https://daninihub.com/${lang}/`)
  },[lang])

  async function send(e){
    e.preventDefault()
    setState('sending')
    const form=e.currentTarget
    const d=new FormData(form)
    const payload={
      company:String(d.get('company')||''),
      email:String(d.get('email')||''),
      phone:String(d.get('phone')||''),
      interest:'Danini Revenue OS / AI Office 24/7',
      message:[String(d.get('message')||''),frictionSummary].filter(Boolean).join('\n\n'),
      language:lang,
      source:'revenue-os-intake',
      privacy_acknowledged:d.get('privacy_ack')==='yes',
      website:String(d.get('website')||'')
    }
    try{
      const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      if(!r.ok) throw new Error('send_failed')
      form.reset();setState('success')
    }catch{setState('error')}
  }

  return <div className="ros">
    <header className="ros-header">
      <a className="ros-brand" href={`/${lang}/`}><span className="ros-mark">D</span><span><strong>DaniniHub</strong><small>Human + AI Revenue OS</small></span></a>
      <nav>{t.nav.map((x,i)=><a key={x} href={['#system','#office','https://calije.daninihub.com/','#contact'][i]}>{x}</a>)}<div className="ros-lang"><button className={lang==='de'?'active':''} onClick={()=>onLanguage?.('de')}>DE</button><button className={lang==='sr'?'active':''} onClick={()=>onLanguage?.('sr')}>SR</button></div></nav>
    </header>

    <main>
      <section className="ros-hero" id="system">
        <p className="ros-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="ros-lead">{t.lead}</p>
        <div className="ros-actions"><a className="ros-btn primary" href="#contact">{t.primary}</a><a className="ros-btn secondary" href="https://calije.daninihub.com/">{t.secondary}</a></div>
        <p className="ros-rule">{t.rule}</p><p className="ros-muted">{t.b2b}</p>
      </section>

      <section className="ros-section">
        <div className="ros-section-head"><span>01</span><h2>{t.flowTitle}</h2></div>
        <div className="ros-flow">{t.flow.map(([k,d],i)=><div className="ros-flow-row" key={k}><span>{String(i+1).padStart(2,'0')}</span><strong>{k}</strong><p>{d}</p></div>)}</div>
      </section>

      <section className="ros-office" id="office">
        <div className="ros-office-copy"><p className="ros-eyebrow">{t.unitEyebrow}</p><h2>{t.unitTitle}</h2><p>{t.unitLead}</p></div>
        <div className="ros-office-list">{t.unitItems.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><p>{x}</p></div>)}</div>
      </section>

      <section className="ros-section ros-friction" id="friction-check">
        <div className="ros-friction-copy"><p className="ros-eyebrow">{t.frictionEyebrow}</p><h2>{t.frictionTitle}</h2><p className="ros-muted">{t.frictionLead}</p></div>
        <div className="ros-friction-grid">
          <label>{t.adminHours}<input type="number" min="0" max="80" value={friction.adminHours} onChange={e=>setFriction({...friction,adminHours:e.target.value})}/></label>
          <label>{t.missedCalls}<input type="number" min="0" max="100" value={friction.missedCalls} onChange={e=>setFriction({...friction,missedCalls:e.target.value})}/></label>
          <label>{t.responseHours}<input type="number" min="0" max="168" value={friction.responseHours} onChange={e=>setFriction({...friction,responseHours:e.target.value})}/></label>
          <label>{t.channels}<input type="number" min="1" max="10" value={friction.channels} onChange={e=>setFriction({...friction,channels:e.target.value})}/></label>
        </div>
        <div className="ros-friction-result"><div><span>{t.frictionScore}</span><strong>{frictionScore}/100 · {frictionBand}</strong></div><div><span>{t.monthlyHours}</span><strong>{monthlyHours} h</strong></div><p>{t.frictionNote}</p><a href="#contact">{t.useResult} →</a></div>
      </section>

      <section className="ros-section ros-pricing">
        <div><p className="ros-eyebrow">MARKET TEST</p><h2>{t.priceTitle}</h2><p className="ros-price">{t.price1}</p><p className="ros-price">{t.price2}</p><p className="ros-muted">{t.priceNote}</p></div>
        <div className="ros-case"><p className="ros-eyebrow">REAL ASSET</p><h2>{t.caseTitle}</h2><p>{t.caseText}</p><a href="https://calije.daninihub.com/">{t.caseCta} →</a></div>
      </section>

      <section className="ros-contact" id="contact">
        <div><p className="ros-eyebrow">START</p><h2>{t.contactTitle}</h2><p>{t.contactText}</p><p><a href="mailto:info@daninihub.com">info@daninihub.com</a></p></div>
        <form onSubmit={send}>
          <label>{t.name}<input name="company" required maxLength="120"/></label>
          <label>{t.email}<input name="email" type="email" required maxLength="180"/></label>
          <label>{t.phone}<input name="phone" maxLength="80"/></label>
          <label>{t.message}<textarea name="message" required minLength="20" maxLength="3000"/></label>
          <label style={{display:'none'}} aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off"/></label>
          <p className="ros-muted" style={{margin:0}}>{t.sensitive}</p>
          <label className="ros-consent"><input name="privacy_ack" type="checkbox" value="yes" required/><span>{t.consent} <a href={lang==='sr'?'/sr/privatnost':'/de/datenschutz'}>{t.privacy}</a></span></label>
          <button className="ros-btn primary" disabled={state==='sending'}>{state==='sending'?'…':t.send}</button>
          {state==='success'&&<p className="ros-success">{t.success}</p>}
          {state==='error'&&<p className="ros-error">{t.error}</p>}
        </form>
      </section>
    </main>

    <footer className="ros-footer"><span>{t.footer}</span><div><a href={lang==='sr'?'/sr/impressum':'/de/impressum'}>{t.imprint}</a><a href={lang==='sr'?'/sr/privatnost':'/de/datenschutz'}>{t.privacy}</a><a href={lang==='sr'?'/sr/kolacici':'/de/cookies'}>{t.cookies}</a><a href={lang==='sr'?'/sr/uslovi':'/de/bedingungen'}>{t.terms}</a><a href={lang==='sr'?'/sr/ai-transparentnost':'/de/ai-transparenz'}>{t.ai}</a></div></footer>
  </div>
}
