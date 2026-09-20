import { useEffect, useState } from 'react'
import './RevenueOSLanding.css'

const COPY = {
  de: {
    nav: ['AI Office','Für wen','Pilot','Check','Case 01','Kontakt'],
    eyebrow: 'DANINIHUB · AI OFFICE 24/7',
    title: 'Mehr Anfragen sauber bearbeiten. Weniger Bürochaos zwischen Telefon, E-Mail und Rückruf.',
    lead: 'AI Office 24/7 ist ein betreuter Human+AI-Workflow für lokale Dienstleister. Er strukturiert neue Anfragen, bereitet Rückrufe und Termine vor, hält offene Vorgänge sichtbar und eskaliert unklare Fälle an einen Menschen.',
    primary: 'Kostenlosen Fit-Check starten',
    secondary: 'So funktioniert der Pilot',
    trust: ['B2B für lokale Dienstleister','Mensch kontrolliert Preis, Vertrag & Risiko','Start als kleiner messbarer Pilot'],
    problemEyebrow:'DAS PROBLEM',
    problemTitle:'Gute Anfragen gehen nicht nur wegen fehlender Nachfrage verloren – sondern wegen Reibung im Alltag.',
    problemItems:[
      ['Verpasste Anfragen','Telefon, Formular, WhatsApp und E-Mail landen in verschiedenen Kanälen.'],
      ['Zu viele Rückfragen','Ort, Objekt, Dringlichkeit, Fotos oder Wunschtermin fehlen beim ersten Kontakt.'],
      ['Kein sauberer Follow-up','Rückruf, Angebot oder Termin bleibt offen, während das Tagesgeschäft weiterläuft.']
    ],
    officeEyebrow:'DAS PRODUKT',
    officeTitle:'AI Office 24/7 übernimmt die digitale Vorarbeit – nicht die Verantwortung.',
    officeLead:'Der Ablauf wird an Ihren Betrieb angepasst. Wir ersetzen nicht Ihre Fachentscheidung, sondern reduzieren unnötige Büroarbeit rund um den ersten Kundenkontakt.',
    unitItems:[
      'Anfragen aus Web und E-Mail strukturiert erfassen',
      'Leistung, Ort, Objekt, Dringlichkeit, Fotos und Wunschzeit sammeln',
      'Rückruf oder Termin für einen Menschen vorbereiten',
      'Offene Anfragen und Angebote in einer Follow-up-Queue halten',
      'Nach erledigter Leistung Feedback oder Review anstoßen',
      'Unklare, sensible oder kommerziell wichtige Fälle eskalieren'
    ],
    fitEyebrow:'FÜR WEN',
    fitTitle:'Für Betriebe, bei denen Außendienst und Büro um dieselbe Zeit konkurrieren.',
    fitLead:'Der erste Markt-Test fokussiert lokale Dienstleister in Deutschland, besonders in NRW.',
    fitItems:[
      ['Gebäudereinigung','Viele wiederkehrende Anfragen, Objektinfos und Besichtigungstermine.'],
      ['Hausmeisterservice','Breites Leistungsspektrum, Rückrufe, Dringlichkeit und Terminabstimmung.'],
      ['Garten- & Objektservice','Fotos, Adresse, Umfang und Wunschtermin müssen oft vorab geklärt werden.']
    ],
    pilotEyebrow:'MESSBARER PILOT',
    pilotTitle:'Kein Plattformprojekt. Erst ein kleiner Workflow mit klaren Messpunkten.',
    pilotSteps:[
      ['01 · Prozess ansehen','Wir prüfen den heutigen Anfrageweg und wählen genau einen Engpass.'],
      ['02 · Mini-Workflow einrichten','Nur die Schritte, die für diesen Engpass nötig sind – ohne unnötige Systemmigration.'],
      ['03 · Ergebnis messen','Reaktionszeit, Vollständigkeit, offene Follow-ups und Admin-Aufwand werden verglichen.']
    ],
    pilotIncludes:'Typischer Pilotumfang',
    pilotItems:['Intake-Formular oder bestehender Eingang','strukturierte Zusammenfassung','Rückruf-/Terminqueue','Follow-up-Status','Human escalation','kurzer Ergebnisbericht'],
    priceTitle:'Kommerzieller Test erst nach Fit-Prüfung',
    price1:'Pilotpreis wird im konkreten Angebot festgelegt',
    price2:'Monatlicher Betrieb nur nach messbarem Pilot-Signal',
    priceNote:'Öffentliche Angaben sind kein verbindliches Angebot. Preis, Umfang, Laufzeit und steuerliche Behandlung werden vor Auftragserteilung eindeutig bestätigt.',
    frictionEyebrow:'PROCESS FRICTION CHECK',
    frictionTitle:'Wie viel Reibung steckt heute im Anfrageprozess?',
    frictionLead:'Vier Betriebswerte reichen für eine erste Orientierung. Die Berechnung bleibt lokal im Browser und ist keine Umsatzprognose.',
    adminHours:'Admin-Stunden pro Woche', missedCalls:'Unbeantwortete Anfragen pro Woche', responseHours:'Typische Antwortzeit in Stunden', channels:'Aktive Anfragekanäle',
    frictionScore:'Friction Score', monthlyHours:'Admin-Zeit pro Monat', frictionLow:'niedrig', frictionMed:'mittel', frictionHigh:'hoch',
    frictionNote:'Orientierungswert, keine Garantie für Einsparung, Conversion oder Mehrumsatz.', useResult:'Ergebnis dem Fit-Check beifügen',
    caseEyebrow:'CASE 01',
    caseTitle:'Čalije: derselbe Revenue-OS-Ansatz an einem realen physischen Projekt.',
    caseText:'Verfahren klären, Nachfrage testen, Minimal-MVP definieren, echte Signale messen und erst danach investieren. Case 01 bleibt getrennt vom AI-Office-Angebot und dient als reales Arbeitsbeispiel.',
    caseCta:'Case 01 öffnen',
    faqTitle:'Häufige Fragen',
    faqs:[
      ['Ist das ein Chatbot?','Nein. Ein Chat kann Teil des Workflows sein, aber das Produkt ist ein betreuter Prozess für Intake, Rückruf, Termin, Follow-up und Eskalation.'],
      ['Muss ich meine Website oder Software wechseln?','Nein. Der Pilot soll vorhandene Kanäle möglichst nutzen. Ein Systemwechsel wird nur vorgeschlagen, wenn er wirklich nötig ist.'],
      ['Entscheidet die KI über Preise oder Verträge?','Nein. Preis, Vertrag, rechtlich relevante Zusagen und unklare Fälle bleiben unter menschlicher Kontrolle.'],
      ['Garantiert der Pilot mehr Umsatz?','Nein. Gemessen werden operative Signale wie Reaktionszeit, Vollständigkeit, offene Vorgänge und Admin-Aufwand. Umsatz wird nicht garantiert.'],
      ['Was passiert nach dem Pilot?','Nur wenn der Test einen sinnvollen messbaren Nutzen zeigt, wird über dauerhaften Betrieb oder weitere Automatisierung entschieden.']
    ],
    contactEyebrow:'FIT-CHECK',
    contactTitle:'Wo verliert Ihr Betrieb heute Zeit oder Anfragen?',
    contactText:'Beschreiben Sie den Engpass in eigenen Worten. Wir prüfen, ob ein kleiner, klar abgegrenzter Pilot sinnvoll ist. Keine automatische Bestellung.',
    name:'Unternehmen / Name', email:'E-Mail', phone:'Telefon / WhatsApp (optional)', message:'Was läuft heute schlecht oder kostet unnötig Zeit?',
    consent:'Ich habe die Datenschutzerklärung zur Kenntnis genommen. Diese Bestätigung ist keine Marketing-Einwilligung.',
    send:'Fit-Check anfragen', success:'Anfrage erhalten. Der nächste Schritt ist die manuelle Fit-Prüfung.', error:'Senden fehlgeschlagen. Bitte schreiben Sie an info@daninihub.com.',
    footer:'DaniniHub · Duisburg · B2B',
    b2b:'Angebot ausschließlich für Unternehmer und Unternehmen. Kein automatischer Vertragsschluss über das Formular.',
    sensitive:'Bitte keine Passwörter, Ausweisdaten, Gesundheitsdaten oder Geschäftsgeheimnisse über das öffentliche Formular senden.',
    privacy:'Datenschutz', imprint:'Impressum', cookies:'Cookies', terms:'B2B-Rahmen', ai:'KI-Transparenz'
  },
  sr: {
    nav: ['AI Office','Za koga','Pilot','Provera','Case 01','Kontakt'],
    eyebrow: 'DANINIHUB · AI OFFICE 24/7',
    title: 'Više upita obrađeno kako treba. Manje kancelarijskog haosa između telefona, emaila i povratnog poziva.',
    lead: 'AI Office 24/7 je vođeni Human+AI workflow za lokalne uslužne firme. Strukturira nove upite, priprema povratne pozive i termine, drži otvorene slučajeve vidljivim i prosleđuje nejasne situacije čoveku.',
    primary: 'Pokreni besplatnu proveru fit-a',
    secondary: 'Kako radi pilot',
    trust: ['B2B za lokalne uslužne firme','Čovek kontroliše cenu, ugovor i rizik','Početak kroz mali merljiv pilot'],
    problemEyebrow:'PROBLEM',
    problemTitle:'Dobri upiti ne propadaju samo zbog manjka tražnje – već i zbog trenja u svakodnevnom radu.',
    problemItems:[
      ['Propušteni upiti','Telefon, formular, WhatsApp i email ostaju razbacani po različitim kanalima.'],
      ['Previše dodatnih pitanja','Lokacija, objekat, hitnost, fotografije ili željeni termin nisu poznati odmah.'],
      ['Nema čistog follow-upa','Povratni poziv, ponuda ili termin ostanu otvoreni dok dnevni posao ide dalje.']
    ],
    officeEyebrow:'PROIZVOD',
    officeTitle:'AI Office 24/7 preuzima digitalnu pripremu – ne odgovornost.',
    officeLead:'Tok se prilagođava konkretnoj firmi. Ne zamenjujemo stručnu odluku, već smanjujemo nepotreban administrativni posao oko prvog kontakta sa klijentom.',
    unitItems:[
      'Strukturisan prijem web i email upita',
      'Prikupljanje usluge, lokacije, objekta, hitnosti, fotografija i termina',
      'Priprema povratnog poziva ili termina za čoveka',
      'Praćenje otvorenih upita i ponuda kroz follow-up red',
      'Pokretanje feedback/review zahteva posle usluge',
      'Prosleđivanje nejasnih, osetljivih i komercijalno važnih slučajeva'
    ],
    fitEyebrow:'ZA KOGA',
    fitTitle:'Za firme u kojima teren i kancelarija troše isto vreme vlasnika ili malog tima.',
    fitLead:'Prvi tržišni test je fokusiran na lokalne uslužne firme u Nemačkoj, posebno NRW.',
    fitItems:[
      ['Čišćenje objekata','Ponavljajući upiti, podaci o objektu i termini obilaska.'],
      ['Hausmeister servis','Širok spektar usluga, hitnost, povratni pozivi i termini.'],
      ['Bašte i održavanje objekata','Fotografije, adresa, obim i željeni termin često moraju unapred da se razjasne.']
    ],
    pilotEyebrow:'MERLJIV PILOT',
    pilotTitle:'Ne gradimo veliku platformu. Prvo mali workflow sa jasnim merama.',
    pilotSteps:[
      ['01 · Pregled procesa','Gledamo sadašnji tok upita i biramo samo jedno usko grlo.'],
      ['02 · Mini-workflow','Postavljamo samo korake potrebne za taj problem, bez nepotrebne migracije sistema.'],
      ['03 · Merenje','Poredimo vreme odgovora, kompletnost upita, otvorene follow-upove i administrativni rad.']
    ],
    pilotIncludes:'Tipičan sadržaj pilota',
    pilotItems:['intake formular ili postojeći ulaz','strukturisan sažetak','red za poziv/termin','follow-up status','human escalation','kratak izveštaj rezultata'],
    priceTitle:'Komercijalni test tek posle provere fit-a',
    price1:'Cena pilota se definiše u konkretnoj ponudi',
    price2:'Mesečni rad tek nakon merljivog signala iz pilota',
    priceNote:'Javni navodi nisu obavezujuća ponuda. Cena, obim, trajanje i poreski tretman potvrđuju se pre prihvatanja posla.',
    frictionEyebrow:'PROCESS FRICTION CHECK',
    frictionTitle:'Koliko trenja danas postoji u prijemu upita?',
    frictionLead:'Četiri operativna podatka daju početnu orijentaciju. Račun ostaje lokalno u pregledaču i nije prognoza prihoda.',
    adminHours:'Sati administracije nedeljno', missedCalls:'Neobrađeni upiti nedeljno', responseHours:'Tipično vreme odgovora u satima', channels:'Aktivni kanali za upite',
    frictionScore:'Friction Score', monthlyHours:'Administracija mesečno', frictionLow:'nisko', frictionMed:'srednje', frictionHigh:'visoko',
    frictionNote:'Orijentacioni rezultat, bez garancije uštede, konverzije ili dodatnog prihoda.', useResult:'Dodaj rezultat fit-check upitu',
    caseEyebrow:'CASE 01',
    caseTitle:'Čalije: isti Revenue OS princip na stvarnom fizičkom projektu.',
    caseText:'Prvo procedura, zatim test potražnje, minimalni MVP, stvarni signali i tek onda ulaganje. Case 01 je odvojen od AI Office ponude i služi kao realan radni primer.',
    caseCta:'Otvori Case 01',
    faqTitle:'Česta pitanja',
    faqs:[
      ['Da li je ovo chatbot?','Ne. Chat može biti deo toka, ali proizvod je vođeni proces za prijem upita, poziv, termin, follow-up i eskalaciju.'],
      ['Moram li menjati sajt ili softver?','Ne. Pilot pokušava da koristi postojeće kanale. Promena sistema se predlaže samo ako je stvarno potrebna.'],
      ['Da li AI odlučuje o cenama ili ugovorima?','Ne. Cena, ugovor, pravno važne izjave i nejasni slučajevi ostaju pod ljudskom kontrolom.'],
      ['Da li pilot garantuje više prihoda?','Ne. Mere se operativni signali kao brzina odgovora, kompletnost, otvoreni slučajevi i administrativno vreme.'],
      ['Šta posle pilota?','Samo ako test pokaže smislen merljiv rezultat, odlučuje se o stalnom radu ili dodatnoj automatizaciji.']
    ],
    contactEyebrow:'FIT-CHECK',
    contactTitle:'Gde vaša firma danas gubi vreme ili upite?',
    contactText:'Opišite problem svojim rečima. Proverićemo da li mali i jasno ograničen pilot ima smisla. Nema automatske kupovine.',
    name:'Firma / ime', email:'E-mail', phone:'Telefon / WhatsApp (opciono)', message:'Šta danas ne radi kako treba ili bespotrebno troši vreme?',
    consent:'Pročitao/la sam obaveštenje o privatnosti. Ova potvrda nije saglasnost za marketing.',
    send:'Zatraži proveru fit-a', success:'Upit je primljen. Sledeći korak je ručna provera fit-a.', error:'Slanje nije uspelo. Pišite na info@daninihub.com.',
    footer:'DaniniHub · Duisburg · B2B',
    b2b:'Ponuda je namenjena isključivo preduzetnicima i kompanijama. Kontakt forma sama ne zaključuje ugovor.',
    sensitive:'Ne šaljite lozinke, podatke iz ličnih dokumenata, zdravstvene podatke ni poslovne tajne kroz javnu formu.',
    privacy:'Privatnost', imprint:'Impresum', cookies:'Kolačići', terms:'B2B okvir', ai:'AI transparentnost'
  }
}

export default function RevenueOSLanding({ lang='de', onLanguage }) {
  const t = COPY[lang] || COPY.de
  const [state,setState] = useState('idle')
  const [menuOpen,setMenuOpen] = useState(false)
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
    document.title = lang === 'sr' ? 'AI Office 24/7 za uslužne firme | DaniniHub' : 'AI Office 24/7 für Dienstleister | DaniniHub'
    const d = lang === 'sr'
      ? 'AI Office 24/7 za lokalne uslužne firme: strukturisan prijem upita, priprema poziva i termina, follow-up i ljudska kontrola važnih odluka.'
      : 'AI Office 24/7 für lokale Dienstleister: Anfragen strukturieren, Rückrufe und Termine vorbereiten, Follow-up sichtbar halten – mit menschlicher Kontrolle.'
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
      interest:'Danini AI Office 24/7',
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
      <a className="ros-brand" href={`/${lang}/`} aria-label="DaniniHub">
        <span className="ros-mark">D</span><span><strong>DaniniHub</strong><small>AI Office 24/7 · Human + AI</small></span>
      </a>
      <button className="ros-menu-toggle" aria-expanded={menuOpen} aria-controls="ros-main-nav" aria-label={menuOpen?'Close menu':'Open menu'} onClick={()=>setMenuOpen(v=>!v)}>
        <span></span><span></span><span></span>
      </button>
      <nav id="ros-main-nav" className={menuOpen?'open':''} aria-label="Main navigation">
        {t.nav.map((x,i)=><a key={x} onClick={()=>setMenuOpen(false)} href={['#office','#fit','#pilot','#friction-check','https://calije.daninihub.com/','#contact'][i]}>{x}</a>)}
        <div className="ros-lang"><button className={lang==='de'?'active':''} onClick={()=>{setMenuOpen(false);onLanguage?.('de')}}>DE</button><button className={lang==='sr'?'active':''} onClick={()=>{setMenuOpen(false);onLanguage?.('sr')}}>SR</button></div>
      </nav>
    </header>

    <main>
      <section className="ros-hero">
        <div className="ros-hero-copy">
          <p className="ros-eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="ros-lead">{t.lead}</p>
          <div className="ros-actions"><a className="ros-btn primary" href="#contact">{t.primary}</a><a className="ros-btn secondary" href="#pilot">{t.secondary}</a></div>
          <div className="ros-trust">{t.trust.map(x=><span key={x}>{x}</span>)}</div>
        </div>
        <aside className="ros-hero-panel" aria-label="AI Office workflow">
          <div className="ros-panel-head"><span>LIVE WORKFLOW</span><strong>Neue Anfrage</strong></div>
          <ol>
            <li><span>01</span><div><strong>Erfassen</strong><small>Kontakt · Leistung · Ort</small></div></li>
            <li><span>02</span><div><strong>Qualifizieren</strong><small>Dringlichkeit · Fotos · Termin</small></div></li>
            <li><span>03</span><div><strong>Vorbereiten</strong><small>Rückruf · Termin · Follow-up</small></div></li>
            <li><span>04</span><div><strong>Eskalieren</strong><small>Preis · Vertrag · Risiko → Mensch</small></div></li>
          </ol>
        </aside>
      </section>

      <section className="ros-section" id="problem">
        <div className="ros-kicker"><p className="ros-eyebrow">{t.problemEyebrow}</p><h2>{t.problemTitle}</h2></div>
        <div className="ros-three">{t.problemItems.map(([h,p])=><article key={h}><h3>{h}</h3><p>{p}</p></article>)}</div>
      </section>

      <section className="ros-office" id="office">
        <div className="ros-office-copy"><p className="ros-eyebrow">{t.officeEyebrow}</p><h2>{t.officeTitle}</h2><p>{t.officeLead}</p></div>
        <div className="ros-office-list">{t.unitItems.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><p>{x}</p></div>)}</div>
      </section>

      <section className="ros-section" id="fit">
        <div className="ros-kicker"><p className="ros-eyebrow">{t.fitEyebrow}</p><h2>{t.fitTitle}</h2><p className="ros-muted">{t.fitLead}</p></div>
        <div className="ros-three fit">{t.fitItems.map(([h,p])=><article key={h}><h3>{h}</h3><p>{p}</p></article>)}</div>
      </section>

      <section className="ros-section" id="pilot">
        <div className="ros-kicker"><p className="ros-eyebrow">{t.pilotEyebrow}</p><h2>{t.pilotTitle}</h2></div>
        <div className="ros-pilot-grid">
          <div className="ros-pilot-steps">{t.pilotSteps.map(([h,p])=><article key={h}><strong>{h}</strong><p>{p}</p></article>)}</div>
          <aside className="ros-pilot-box"><h3>{t.pilotIncludes}</h3><ul>{t.pilotItems.map(x=><li key={x}>{x}</li>)}</ul><hr/><h3>{t.priceTitle}</h3><p><strong>{t.price1}</strong></p><p><strong>{t.price2}</strong></p><small>{t.priceNote}</small></aside>
        </div>
      </section>

      <section className="ros-section ros-friction" id="friction-check">
        <div className="ros-friction-copy"><p className="ros-eyebrow">{t.frictionEyebrow}</p><h2>{t.frictionTitle}</h2><p className="ros-muted">{t.frictionLead}</p></div>
        <div>
          <div className="ros-friction-grid">
            <label>{t.adminHours}<input type="number" min="0" max="80" value={friction.adminHours} onChange={e=>setFriction({...friction,adminHours:e.target.value})}/></label>
            <label>{t.missedCalls}<input type="number" min="0" max="100" value={friction.missedCalls} onChange={e=>setFriction({...friction,missedCalls:e.target.value})}/></label>
            <label>{t.responseHours}<input type="number" min="0" max="168" value={friction.responseHours} onChange={e=>setFriction({...friction,responseHours:e.target.value})}/></label>
            <label>{t.channels}<input type="number" min="1" max="10" value={friction.channels} onChange={e=>setFriction({...friction,channels:e.target.value})}/></label>
          </div>
          <div className="ros-friction-result"><div><span>{t.frictionScore}</span><strong>{frictionScore}/100 · {frictionBand}</strong></div><div><span>{t.monthlyHours}</span><strong>{monthlyHours} h</strong></div><p>{t.frictionNote}</p><a href="#contact">{t.useResult} →</a></div>
        </div>
      </section>

      <section className="ros-section ros-case" id="case">
        <div><p className="ros-eyebrow">{t.caseEyebrow}</p><h2>{t.caseTitle}</h2></div>
        <div><p>{t.caseText}</p><a className="ros-text-link" href="https://calije.daninihub.com/">{t.caseCta} →</a></div>
      </section>

      <section className="ros-section" id="faq">
        <div className="ros-kicker"><p className="ros-eyebrow">FAQ</p><h2>{t.faqTitle}</h2></div>
        <div className="ros-faq">{t.faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
      </section>

      <section className="ros-contact" id="contact">
        <div><p className="ros-eyebrow">{t.contactEyebrow}</p><h2>{t.contactTitle}</h2><p>{t.contactText}</p><p><a href="mailto:info@daninihub.com">info@daninihub.com</a><br/><a href="tel:+4915730916621">+49 1573 0916621</a></p><p className="ros-muted">{t.b2b}</p></div>
        <form onSubmit={send}>
          <label>{t.name}<input name="company" required maxLength="120"/></label>
          <label>{t.email}<input name="email" type="email" required maxLength="180"/></label>
          <label>{t.phone}<input name="phone" maxLength="80"/></label>
          <label>{t.message}<textarea name="message" required minLength="20" maxLength="3000"/></label>
          <label className="ros-hp" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off"/></label>
          <p className="ros-muted ros-small">{t.sensitive}</p>
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
