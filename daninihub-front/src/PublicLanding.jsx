import './App.css'

const copy = {
  de: {
    nav: ['Leistungen', 'Arbeitsweise', 'Einstieg', 'Kontakt'],
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
    entryTitle: 'Transportorganisation kennenlernen.',
    entryText: 'Für Menschen mit Deutsch oder weiteren Sprachen, die realistisch verstehen möchten, wie Disposition und Transportkommunikation funktionieren. Praktische Orientierung – keine zertifizierte Ausbildung und keine Jobgarantie.',
    aboutTitle: 'Erfahrung aus Transport und Unternehmertum.',
    aboutText: 'Dragan Zdravković arbeitete im internationalen Transport als Disponent und führte anschließend ein Unternehmen für Export, Import, Handel und Transport. Heute verbindet er diese Erfahrung mit langjähriger Kundenkommunikation in Deutschland.',
    contactTitle: 'Was fehlt heute in Ihrer Transportorganisation?',
    contactText: 'Nennen Sie Relationen, Fahrzeugzahl und die Aufgaben, die intern zu viel Zeit binden. Sie erhalten eine ehrliche Einschätzung, ob der begrenzte Leistungsrahmen passt.',
    company: 'Unternehmen / Name', interest: 'Interesse', message: 'Kurze Beschreibung', send: 'Anfrage per E-Mail senden',
    options: ['Operations Support für ein Unternehmen', 'Einstieg in die Transportorganisation'],
    legal: ['Impressum', 'Datenschutz']
  },
  sr: {
    nav: ['Usluge', 'Način rada', 'Uvod', 'Kontakt'],
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
    entryTitle: 'Upoznajte organizaciju transporta.',
    entryText: 'Za ljude koji znaju nemački ili druge jezike i žele realno da upoznaju dispečing i transportnu komunikaciju. Praktična orijentacija – nije sertifikovana obuka niti garancija posla.',
    aboutTitle: 'Iskustvo iz transporta i preduzetništva.',
    aboutText: 'Dragan Zdravković radio je kao disponent u međunarodnom transportu, a zatim vodio firmu za izvoz, uvoz, trgovinu i transport. Danas to iskustvo povezuje sa dugogodišnjom komunikacijom sa klijentima u Nemačkoj.',
    contactTitle: 'Šta trenutno nedostaje vašoj transportnoj operativi?',
    contactText: 'Napišite relacije, broj vozila i zadatke koji vam oduzimaju najviše vremena. Dobićete realnu procenu da li se potreba uklapa u ograničeni obim podrške.',
    company: 'Firma / ime', interest: 'Interesovanje', message: 'Kratak opis', send: 'Pošaljite upit e-mailom',
    options: ['Operativna podrška za firmu', 'Upoznavanje sa organizacijom transporta'],
    legal: ['Impresum', 'Privatnost']
  }
}

function Logo() {
  return <a className="brand" href="#top" aria-label="DaniniHub"><span className="mark">D<span>•</span></span><strong>DaniniHub<small>TRANSPORT & LOGISTICS</small></strong></a>
}

export default function PublicLanding({ lang, setLang }) {
  const t = copy[lang]
  const path = location.pathname
  const switchLang = code => { setLang(code); history.replaceState({}, '', code === 'sr' ? '/sr/' : '/de/') }
  const send = event => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    location.href = `mailto:info@daninihub.com?subject=${encodeURIComponent('DaniniHub – ' + data.get('interest'))}&body=${encodeURIComponent(data.get('company') + '\n\n' + data.get('message'))}`
  }
  if (/impressum|datenschutz|privatnost/.test(path)) {
    const privacy = /datenschutz|privatnost/.test(path)
    return <main id="top"><header><Logo/><nav><button className="legal-back" onClick={()=>location.href=lang==='sr'?'/sr/':'/de/'}>← {lang==='sr'?'Nazad':'Zurück'}</button></nav></header><section className="section legal-page"><p className="kicker">{lang==='sr'?'PRAVNE INFORMACIJE':'RECHTLICHES'}</p><h2>{privacy?(lang==='sr'?'Zaštita privatnosti':'Datenschutz'):(lang==='sr'?'Impresum':'Impressum')}</h2>{privacy?<><h3>{lang==='sr'?'Odgovorno lice':'Verantwortlicher'}</h3><p>Dragan Zdravković · Fischerstraße 54 · 47055 Duisburg<br/><a href="mailto:info@daninihub.com">info@daninihub.com</a></p><h3>{lang==='sr'?'Kontakt i hosting':'Kontakt und Hosting'}</h3><p>{lang==='sr'?'Kontakt obrazac otvara e-mail program i sajt ne čuva unos. Hosting provajder može obrađivati tehnički neophodne serverske zapise. Možete tražiti pristup, ispravku, brisanje, ograničenje obrade i uložiti prigovor.':'Das Kontaktformular öffnet das E-Mail-Programm; die Website speichert die Eingaben nicht. Der Hosting-Anbieter kann technisch notwendige Serverprotokolle verarbeiten. Im gesetzlichen Rahmen bestehen Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung und Widerspruch.'}</p></>:<><h3>{lang==='sr'?'Pružalac usluge':'Anbieter'}</h3><p>Dragan Zdravković<br/>DaniniHub Transport &amp; Logistics<br/>Fischerstraße 54<br/>47055 Duisburg · Deutschland<br/>+49 157 30916621<br/><a href="mailto:info@daninihub.com">info@daninihub.com</a></p><h3>{lang==='sr'?'Granice usluge':'Leistungsumfang'}</h3><p>{lang==='sr'?'Organizaciona i komunikaciona podrška u transportu. DaniniHub nije prevoznik, špedicija, Verkehrsleiter niti pravno, poresko ili carinsko savetovanje. Pravne odluke ostaju kod naručioca.':'Organisatorische und kommunikative Unterstützung im Transport. DaniniHub ist kein Frachtführer, keine Spedition, kein Verkehrsleiter und keine Rechts-, Steuer- oder Zollberatung. Rechtsverbindliche Entscheidungen verbleiben beim Auftraggeber.'}</p></>}</section></main>
  }
  return <main id="top">
    <header><Logo/><nav>{t.nav.map((n,i)=><a key={n} href={['#services','#scope','#entry','#contact'][i]}>{n}</a>)}<div className="langs"><button className={lang==='de'?'active':''} onClick={()=>switchLang('de')}>DE</button><button className={lang==='sr'?'active':''} onClick={()=>switchLang('sr')}>SR</button></div></nav></header>
    <section className="hero"><div className="hero-copy"><p className="kicker">{t.kicker}</p><h1>{t.title}</h1><p className="lead">{t.lead}</p><a className="btn" href="#contact">{t.cta} →</a><div className="proof">{t.proof.map(x=><span key={x}>✓ {x}</span>)}</div></div><div className="route-art" aria-hidden="true"><div className="globe"/><div className="route r1"/><div className="route r2"/><div className="truck">▰</div><span className="city c1">DUISBURG</span><span className="city c2">WIEN</span><span className="city c3">BEOGRAD</span></div></section>
    <section id="services" className="section"><p className="kicker">OPERATIONS DESK</p><h2>{t.servicesTitle}</h2><div className="grid">{t.services.map(([a,b],i)=><article key={a}><span className="num">0{i+1}</span><h3>{a}</h3><p>{b}</p></article>)}</div></section>
    <section id="scope" className="section scope"><p className="kicker">KLARE GRENZEN · JASNE GRANICE</p><h2>{t.scopeTitle}</h2><div className="scope-grid"><article><span>DaniniHub</span><p>{t.support}</p></article><article><span>Auftraggeber · Naručilac</span><p>{t.retain}</p></article></div></section>
    <section id="entry" className="section split"><div><p className="kicker">PRAXISEINSTIEG · PRAKTIČAN UVOD</p><h2>{t.entryTitle}</h2></div><div><p className="big">{t.entryText}</p></div></section>
    <section className="section about"><p className="kicker">ERFAHRUNG · ISKUSTVO</p><h2>{t.aboutTitle}</h2><p className="big">{t.aboutText}</p></section>
    <section id="contact" className="section contact"><div><p className="kicker">DIREKTER KONTAKT</p><h2>{t.contactTitle}</h2><p>{t.contactText}</p><a className="mail" href="mailto:info@daninihub.com">info@daninihub.com</a><p>Duisburg · Nordrhein-Westfalen<br/>+49 157 30916621</p></div><form onSubmit={send}><label>{t.company}<input name="company" required/></label><label>{t.interest}<select name="interest">{t.options.map(x=><option key={x}>{x}</option>)}</select></label><label>{t.message}<textarea name="message" required/></label><button className="btn" type="submit">{t.send} →</button></form></section>
    <footer><Logo/><p>© 2026 DaniniHub</p><div><a href={lang==='sr'?'/sr/impressum':'/de/impressum'}>{t.legal[0]}</a><a href={lang==='sr'?'/sr/privatnost':'/de/datenschutz'}>{t.legal[1]}</a></div></footer>
  </main>
}
