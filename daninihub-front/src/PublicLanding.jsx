import { useState } from 'react'
import './App.css'
import './Enhancements.css'

const copy = {
  de: {
    nav: ['Leistungen', 'Zusammenarbeit', 'Einstieg', 'Kontakt'],
    kicker: 'BALKAN–DACH TRANSPORT OPERATIONS SUPPORT',
    title: 'Weniger Rückfragen. Klare Informationen. Ruhigere Abläufe.',
    lead: 'Externe operative Unterstützung für Transportunternehmen zwischen dem Balkan und dem deutschsprachigen Raum – auf Deutsch und in den Sprachen der Region.',
    cta: 'Leistungsrahmen besprechen',
    proof: ['Duisburg · Homeoffice', 'Deutsch + Balkan-Sprachen', 'Klare Zuständigkeiten'],
    servicesTitle: 'Unterstützung dort, wo im Tagesgeschäft Zeit verloren geht.',
    services: [
      ['Kommunikation', 'Abstimmung mit Fahrern, Kunden und Be-/Entladestellen in verständlicher Sprache.'],
      ['Status & ETA', 'Statusmeldungen, voraussichtliche Ankunftszeiten und proaktive Information bei Abweichungen.'],
      ['Dokumente', 'Operative Prüfung, ob Transportangaben und benötigte Unterlagen vollständig vorliegen.'],
      ['Terminabstimmung', 'Koordination von Lade- und Entladefenstern innerhalb vereinbarter Befugnisse.'],
      ['Störungsmeldung', 'Probleme strukturiert aufnehmen, Beteiligte informieren und Entscheidungen eskalieren.'],
      ['Routenunterstützung', 'Operative Hinweise zu Relationen Balkan–DACH; finale Disposition bleibt beim Auftraggeber.']
    ],
    scopeTitle: 'Unterstützung ohne unklare Haftung.',
    support: 'DaniniHub übernimmt Kommunikation, Statuspflege, Terminabstimmung, Informationsweitergabe und dokumentierte Eskalation.',
    retain: 'Das Unternehmen behält Transportaufträge, Preise, rechtsverbindliche Zusagen, Fahrerweisung, Verkehrsleitung und finale Entscheidungen.',
    startTitle: 'So kann die Zusammenarbeit beginnen.',
    startSteps: [['01', '20 Minuten Erstgespräch', 'Relationen, Fahrzeugzahl und tatsächlichen Engpass klären.'], ['02', 'Aufgaben und Befugnisse', 'Schriftlich festlegen, was übernommen, gemeldet oder eskaliert wird.'], ['03', '14 Tage Testphase', 'Mit begrenztem Umfang starten und anhand klarer Abläufe auswerten.']],
    entryTitle: 'Transportorganisation kennenlernen.',
    entryText: 'Für Menschen mit Deutsch oder weiteren Sprachen, die realistisch verstehen möchten, wie Disposition und Transportkommunikation funktionieren. Praktische Orientierung – keine zertifizierte Ausbildung und keine Jobgarantie.',
    aboutTitle: 'Erfahrung aus Transport und Unternehmertum.',
    aboutText: 'Dragan Zdravković arbeitete im internationalen Transport als Disponent und führte anschließend ein Unternehmen für Export, Import, Handel und Transport. Heute verbindet er diese Erfahrung mit langjähriger Kundenkommunikation in Deutschland.',
    aboutFacts: ['Internationale Disposition und Routenplanung', 'FTL/LTL, Fahrer- und Kundenkommunikation', 'Deutsch und Sprachen des Balkans', 'Duisburg · Teilzeit/Homeoffice bevorzugt'],
    contactTitle: 'Was fehlt heute in Ihrer Transportorganisation?',
    contactText: 'Nennen Sie Relationen, Fahrzeugzahl und die Aufgaben, die intern zu viel Zeit binden. Sie erhalten eine ehrliche Einschätzung, ob der begrenzte Leistungsrahmen passt.',
    company: 'Unternehmen / Name', email: 'E-Mail', phone: 'Telefon (optional)', fleet: 'Fahrzeuge (optional)', routes: 'Relationen (optional)', interest: 'Interesse', message: 'Kurze Beschreibung', send: 'Anfrage sicher senden', consent: 'Ich bin mit der Verarbeitung meiner Angaben zur Beantwortung der Anfrage einverstanden.', success: 'Vielen Dank. Ihre Anfrage wurde gesendet; eine Bestätigung folgt per E-Mail.', error: 'Die Anfrage konnte nicht gesendet werden. Schreiben Sie bitte an info@daninihub.com.',
    options: ['Operations Support für ein Unternehmen', 'Einstieg in die Transportorganisation'],
    legal: ['Impressum', 'Datenschutz']
  },
  sr: {
    nav: ['Usluge', 'Saradnja', 'Uvod', 'Kontakt'],
    kicker: 'BALKAN–DACH OPERATIVNA PODRŠKA U TRANSPORTU',
    title: 'Manje poziva. Jasne informacije. Mirnija operativa.',
    lead: 'Spoljna operativna podrška transportnim firmama između Balkana i nemačkog govornog područja – na nemačkom i jezicima regiona.',
    cta: 'Razgovor o obimu usluge',
    proof: ['Duisburg · rad od kuće', 'Nemački + balkanski jezici', 'Jasne odgovornosti'],
    servicesTitle: 'Podrška tamo gde se u svakodnevnom radu gubi vreme.',
    services: [
      ['Komunikacija', 'Dogovor sa vozačima, klijentima i mestima utovara/istovara na razumljivom jeziku.'],
      ['Status i ETA', 'Statusne informacije, očekivano vreme dolaska i pravovremena prijava odstupanja.'],
      ['Dokumentacija', 'Operativna provera da li su podaci i potrebna dokumenta kompletni.'],
      ['Termini', 'Koordinacija termina utovara i istovara u okviru unapred dogovorenih ovlašćenja.'],
      ['Prijava problema', 'Strukturisano evidentiranje problema, obaveštavanje i eskalacija odluke.'],
      ['Podrška rutama', 'Operativne informacije za Balkan–DACH; konačna dispozicija ostaje kod firme.']
    ],
    scopeTitle: 'Podrška bez nejasne odgovornosti.',
    support: 'DaniniHub preuzima komunikaciju, ažuriranje statusa, dogovor termina, prenos informacija i dokumentovanu eskalaciju.',
    retain: 'Firma zadržava transportne naloge, cene, pravno obavezujuća obećanja, upravljanje vozačima, Verkehrsleitung i konačne odluke.',
    startTitle: 'Kako saradnja može da počne.',
    startSteps: [['01', 'Uvodni razgovor od 20 minuta', 'Razjašnjavamo relacije, broj vozila i stvarni operativni problem.'], ['02', 'Zadaci i ovlašćenja', 'Pismeno definišemo šta se preuzima, prijavljuje ili prosleđuje na odluku.'], ['03', 'Probni period od 14 dana', 'Početak sa ograničenim obimom i procena na osnovu jasnog toka rada.']],
    entryTitle: 'Upoznajte organizaciju transporta.',
    entryText: 'Za ljude koji znaju nemački ili druge jezike i žele realno da upoznaju dispečing i transportnu komunikaciju. Praktična orijentacija – nije sertifikovana obuka niti garancija posla.',
    aboutTitle: 'Iskustvo iz transporta i preduzetništva.',
    aboutText: 'Dragan Zdravković radio je kao disponent u međunarodnom transportu, a zatim vodio firmu za izvoz, uvoz, trgovinu i transport. Danas to iskustvo povezuje sa dugogodišnjom komunikacijom sa klijentima u Nemačkoj.',
    aboutFacts: ['Međunarodna dispozicija i planiranje ruta', 'FTL/LTL, komunikacija sa vozačima i klijentima', 'Nemački i jezici Balkana', 'Duisburg · prvenstveno Teilzeit/Homeoffice'],
    contactTitle: 'Šta trenutno nedostaje vašoj transportnoj operativi?',
    contactText: 'Napišite relacije, broj vozila i zadatke koji vam oduzimaju najviše vremena. Dobićete realnu procenu da li se potreba uklapa u ograničeni obim podrške.',
    company: 'Firma / ime', email: 'E-mail', phone: 'Telefon (opciono)', fleet: 'Broj vozila (opciono)', routes: 'Relacije (opciono)', interest: 'Interesovanje', message: 'Kratak opis', send: 'Pošaljite siguran upit', consent: 'Saglasan sam da se moji podaci obrade radi odgovora na upit.', success: 'Hvala. Upit je poslat, a potvrda stiže na vašu e-mail adresu.', error: 'Upit nije mogao da bude poslat. Pišite direktno na info@daninihub.com.',
    options: ['Operativna podrška za firmu', 'Upoznavanje sa organizacijom transporta'],
    legal: ['Impresum', 'Privatnost']
  }
}

function Logo() {
  return <a className="brand" href="#top" aria-label="DaniniHub"><span className="mark">D<span>•</span></span><strong>DaniniHub<small>TRANSPORT & LOGISTICS</small></strong></a>
}

export default function PublicLanding({ lang, setLang }) {
  const t = copy[lang]
  const [formState, setFormState] = useState('idle')
  const path = location.pathname
  const switchLang = code => { setLang(code); history.replaceState({}, '', code === 'sr' ? '/sr/' : '/de/') }
  const send = async event => {
    event.preventDefault()
    setFormState('sending')
    const data = new FormData(event.currentTarget)
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(data)) })
      if (!response.ok) throw new Error('send_failed')
      event.currentTarget.reset()
      setFormState('success')
    } catch {
      setFormState('error')
    }
  }
  if (/impressum|datenschutz|privatnost/.test(path)) {
    const privacy = /datenschutz|privatnost/.test(path)
    return <main id="top"><header><Logo/><nav><button className="legal-back" onClick={()=>location.href=lang==='sr'?'/sr/':'/de/'}>← {lang==='sr'?'Nazad':'Zurück'}</button></nav></header><section className="section legal-page"><p className="kicker">{lang==='sr'?'PRAVNE INFORMACIJE':'RECHTLICHES'}</p><h2>{privacy?(lang==='sr'?'Zaštita privatnosti':'Datenschutz'):(lang==='sr'?'Impresum':'Impressum')}</h2>{privacy?<><h3>{lang==='sr'?'Odgovorno lice':'Verantwortlicher'}</h3><p>Dragan Zdravković · Fischerstraße 54 · 47055 Duisburg<br/><a href="mailto:info@daninihub.com">info@daninihub.com</a></p><h3>{lang==='sr'?'Kontakt i hosting':'Kontakt und Hosting'}</h3><p>{lang==='sr'?'Podaci iz obrasca koriste se isključivo za obradu upita. Preko servisa Brevo šalju se obaveštenje DaniniHub-u i automatska potvrda pošiljaocu. Podaci se ne koriste za newsletter bez posebne saglasnosti. Hosting provajder može obrađivati tehnički neophodne serverske zapise. Možete tražiti pristup, ispravku, brisanje, ograničenje obrade i uložiti prigovor.':'Die Formulardaten werden ausschließlich zur Bearbeitung der Anfrage verwendet. Über Brevo werden eine Benachrichtigung an DaniniHub und eine automatische Eingangsbestätigung versendet. Ohne gesonderte Einwilligung erfolgt keine Newsletter-Nutzung. Der Hosting-Anbieter kann technisch notwendige Serverprotokolle verarbeiten. Im gesetzlichen Rahmen bestehen Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung und Widerspruch.'}</p></>:<><h3>{lang==='sr'?'Pružalac usluge':'Anbieter'}</h3><p>Dragan Zdravković<br/>DaniniHub Transport &amp; Logistics<br/>Fischerstraße 54<br/>47055 Duisburg · Deutschland<br/>+49 157 30916621<br/><a href="mailto:info@daninihub.com">info@daninihub.com</a></p><h3>{lang==='sr'?'Granice usluge':'Leistungsumfang'}</h3><p>{lang==='sr'?'Organizaciona i komunikaciona podrška u transportu. DaniniHub nije prevoznik, špedicija, Verkehrsleiter niti pravno, poresko ili carinsko savetovanje. Pravne odluke ostaju kod naručioca.':'Organisatorische und kommunikative Unterstützung im Transport. DaniniHub ist kein Frachtführer, keine Spedition, kein Verkehrsleiter und keine Rechts-, Steuer- oder Zollberatung. Rechtsverbindliche Entscheidungen verbleiben beim Auftraggeber.'}</p></>}</section></main>
  }
  return <main id="top">
    <header><Logo/><nav>{t.nav.map((n,i)=><a key={n} href={['#services','#scope','#entry','#contact'][i]}>{n}</a>)}<div className="langs"><button className={lang==='de'?'active':''} onClick={()=>switchLang('de')}>DE</button><button className={lang==='sr'?'active':''} onClick={()=>switchLang('sr')}>SR</button></div></nav></header>
    <section className="hero"><div className="hero-copy"><p className="kicker">{t.kicker}</p><h1>{t.title}</h1><p className="lead">{t.lead}</p><a className="btn" href="#contact">{t.cta} →</a><div className="proof">{t.proof.map(x=><span key={x}>✓ {x}</span>)}</div></div><div className="route-art" aria-hidden="true"><div className="globe"/><div className="route r1"/><div className="route r2"/><div className="truck">▰</div><span className="city c1">DUISBURG</span><span className="city c2">WIEN</span><span className="city c3">BEOGRAD</span></div></section>
    <section id="services" className="section"><p className="kicker">OPERATIONS DESK</p><h2>{t.servicesTitle}</h2><div className="grid">{t.services.map(([a,b],i)=><article key={a}><span className="num">0{i+1}</span><h3>{a}</h3><p>{b}</p></article>)}</div></section>
    <section id="scope" className="section scope"><p className="kicker">KLARE GRENZEN · JASNE GRANICE</p><h2>{t.scopeTitle}</h2><div className="scope-grid"><article><span>DaniniHub</span><p>{t.support}</p></article><article><span>Auftraggeber · Naručilac</span><p>{t.retain}</p></article></div></section>
    <section className="section"><p className="kicker">START</p><h2>{t.startTitle}</h2><div className="start-grid">{t.startSteps.map(([n,a,b])=><article key={n}><span>{n}</span><h3>{a}</h3><p>{b}</p></article>)}</div></section>
    <section id="entry" className="section split"><div><p className="kicker">PRAXISEINSTIEG · PRAKTIČAN UVOD</p><h2>{t.entryTitle}</h2></div><div><p className="big">{t.entryText}</p></div></section>
    <section className="section about"><p className="kicker">ERFAHRUNG · ISKUSTVO</p><h2>{t.aboutTitle}</h2><p className="big">{t.aboutText}</p><div className="fact-row">{t.aboutFacts.map(x=><span key={x}>✓ {x}</span>)}</div></section>
    <section id="contact" className="section contact"><div><p className="kicker">DIREKTER KONTAKT</p><h2>{t.contactTitle}</h2><p>{t.contactText}</p><a className="mail" href="mailto:info@daninihub.com">info@daninihub.com</a><p>Duisburg · Nordrhein-Westfalen<br/>+49 157 30916621</p></div><form onSubmit={send}><div className="form-pair"><label>{t.company}<input name="company" required maxLength="120"/></label><label>{t.email}<input name="email" type="email" required maxLength="180"/></label></div><div className="form-pair"><label>{t.phone}<input name="phone" type="tel" maxLength="60"/></label><label>{t.fleet}<input name="fleet" maxLength="60"/></label></div><label>{t.routes}<input name="routes" maxLength="180"/></label><label>{t.interest}<select name="interest">{t.options.map(x=><option key={x}>{x}</option>)}</select></label><label>{t.message}<textarea name="message" required minLength="20" maxLength="3000"/></label><label className="honey" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off"/></label><label className="consent"><input name="consent" type="checkbox" value="yes" required/>{t.consent}</label><button className="btn" type="submit" disabled={formState==='sending'}>{formState==='sending'?'…':t.send+' →'}</button>{formState==='success'&&<p className="form-success" role="status">{t.success}</p>}{formState==='error'&&<p className="form-error" role="alert">{t.error}</p>}</form></section>
    <footer><Logo/><p>© 2026 DaniniHub</p><div><a href={lang==='sr'?'/sr/impressum':'/de/impressum'}>{t.legal[0]}</a><a href={lang==='sr'?'/sr/privatnost':'/de/datenschutz'}>{t.legal[1]}</a></div></footer>
  </main>
}
