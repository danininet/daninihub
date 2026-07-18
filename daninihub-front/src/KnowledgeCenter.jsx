import './KnowledgeCenter.css'

const content = {
  de: {
    hubTitle: 'Praxis & Wissen',
    hubLead: 'Operative Fachinhalte für Transportteams: Abweichungen, Fahrerkommunikation, ETA, Übergaben und klar begrenzte Verantwortlichkeiten.',
    categories: ['Exception Management', 'ETA & Status', 'Fahrerkommunikation', 'Continuity', 'Operational Standards', 'Balkan–DACH'],
    articleTitle: 'Warum suchen Transportunternehmen trotz moderner TMS-Systeme weiterhin Disponenten?',
    articleLead: 'Die Herausforderung liegt heute nicht mehr nur im Planen von Transporten, sondern im kontrollierten Umgang mit Abweichungen, Informationslücken und Zuständigkeitswechseln.',
    summary: 'Moderne TMS-, Telematik- und Tracking-Systeme liefern Daten. Sobald eine Tour vom Plan abweicht, müssen Menschen jedoch Informationen prüfen, priorisieren, weitergeben und dokumentieren. Genau an dieser Schnittstelle entstehen Rückfragen, Verzögerungen und unnötige Risiken.',
    read: '7 Min. Lesezeit',
    author: 'Dragan Zdravković',
    date: '18. Juli 2026',
    problemTitle: 'Planung funktioniert – bis der Plan nicht mehr funktioniert.',
    problemText: 'Verspätung, Stau, Fahrzeugausfall, fehlende Dokumente oder ein Sprachproblem lassen sich nicht durch einen Statuspunkt allein lösen. Ein operativer Fall braucht eine bestätigte Informationslage, einen Verantwortlichen, eine nächste Aktion und eine dokumentierte Übergabe.',
    causesTitle: 'Warum Software allein nicht genügt',
    causes: ['Informationen liegen in mehreren Kanälen.', 'ETA wird zu schnell als Zusage verstanden.', 'Ein Incident hat keinen klaren Eigentümer.', 'Entscheidungen und Freigaben bleiben undokumentiert.', 'Schichtübergaben verlieren Kontext.'],
    flow: ['Plan', 'Abweichung', 'Prüfung', 'Entscheidung', 'Kommunikation', 'Dokumentation'],
    checklistTitle: 'Operativer Selbstcheck',
    checklist: ['Ist der letzte Status bestätigt?', 'Ist ETA klar von einer Zusage getrennt?', 'Hat jeder Incident einen Eigentümer?', 'Ist die nächste Prüfung terminiert?', 'Sind Freigaben und Übergaben dokumentiert?'],
    faqTitle: 'Häufige Fragen',
    faqs: [
      ['Ersetzt DaniniHub ein TMS?', 'Nein. DaniniHub ergänzt bestehende Systeme durch strukturierte Kommunikation, Nachverfolgung und dokumentierte Übergaben.'],
      ['Entscheidet DaniniHub über Preise oder Transporte?', 'Nein. Preise, Partnerwahl und rechtsverbindliche Entscheidungen bleiben beim Auftraggeber.'],
      ['Wann ist ein Pilot sinnvoll?', 'Wenn ein klar abgrenzbarer Engpass bei Status, Fahrerkommunikation, Abweichungen oder Schichtübergabe besteht.'],
      ['Kann KI die Disposition vollständig übernehmen?', 'Nicht verantwortungsvoll. KI kann strukturieren und Lücken sichtbar machen; Menschen prüfen und entscheiden.']
    ],
    ctaTitle: 'Prüfen Sie einen begrenzten Pilot für Ihr Team.',
    cta: 'Pilot-Check starten'
  },
  sr: {
    hubTitle: 'Praksa i znanje',
    hubLead: 'Stručni operativni sadržaji za transportne timove: odstupanja, komunikacija sa vozačima, ETA, predaja smene i jasno ograničene odgovornosti.',
    categories: ['Upravljanje odstupanjima', 'ETA i status', 'Komunikacija sa vozačima', 'Kontinuitet', 'Operativni standardi', 'Balkan–DACH'],
    articleTitle: 'Zašto transportne kompanije i pored savremenih TMS sistema i dalje traže disponente?',
    articleLead: 'Izazov više nije samo planiranje transporta, već kontrolisano upravljanje odstupanjima, nedostajućim informacijama i promenama odgovornosti.',
    summary: 'Savremeni TMS, telematika i sistemi praćenja daju podatke. Kada tura odstupi od plana, ljudi i dalje moraju da provere, odrede prioritet, prenesu i dokumentuju informacije. Upravo na toj tački nastaju dodatni pozivi, kašnjenja i nepotrebni rizici.',
    read: '7 min. čitanja',
    author: 'Dragan Zdravković',
    date: '18. jul 2026.',
    problemTitle: 'Plan funkcioniše – dok stvarnost ne odstupi od plana.',
    problemText: 'Kašnjenje, zastoj, kvar vozila, nedostajući dokument ili jezički problem ne mogu se rešiti samo jednim statusom u sistemu. Operativni slučaj zahteva potvrđene činjenice, odgovornu osobu, sledeću akciju i dokumentovanu predaju.',
    causesTitle: 'Zašto softver sam nije dovoljan',
    causes: ['Informacije su raspoređene kroz više kanala.', 'ETA se prebrzo pretvara u obećanje.', 'Incident nema jasno određenog vlasnika.', 'Odluke i odobrenja ostaju bez traga.', 'Predaja smene gubi kontekst.'],
    flow: ['Plan', 'Odstupanje', 'Provera', 'Odluka', 'Komunikacija', 'Dokumentacija'],
    checklistTitle: 'Operativna kontrolna lista',
    checklist: ['Da li je poslednji status potvrđen?', 'Da li je ETA odvojena od obećanja?', 'Da li svaki incident ima vlasnika?', 'Da li je sledeća provera zakazana?', 'Da li su odobrenja i predaja dokumentovani?'],
    faqTitle: 'Česta pitanja',
    faqs: [
      ['Da li DaniniHub menja TMS?', 'Ne. DaniniHub dopunjuje postojeće sisteme strukturisanom komunikacijom, praćenjem i dokumentovanom predajom.'],
      ['Da li DaniniHub odlučuje o cenama ili transportu?', 'Ne. Cene, izbor partnera i pravno obavezujuće odluke ostaju kod naručioca.'],
      ['Kada pilot ima smisla?', 'Kada postoji jasno ograničeno usko grlo u statusima, komunikaciji sa vozačima, odstupanjima ili predaji smene.'],
      ['Može li AI potpuno preuzeti dispoziciju?', 'Ne odgovorno. AI može da strukturira i pokaže nedostatke, dok čovek proverava i odlučuje.']
    ],
    ctaTitle: 'Proverite ograničeni pilot za svoj tim.',
    cta: 'Pokreni proveru pilota'
  }
}

export default function KnowledgeCenter({ lang }) {
  const t = content[lang]
  const sr = lang === 'sr'
  const pilot = sr ? '/sr/provera-pilota' : '/de/pilot-check'
  return <main className="knowledge-page">
    <header className="knowledge-header">
      <a href={sr?'/sr/':'/de/'} className="knowledge-brand"><img src="/logo-mark.svg" alt="" width="44" height="44"/><strong>DaniniHub<small>TRANSPORT &amp; LOGISTICS</small></strong></a>
      <nav><a href={sr?'/sr/':'/de/'}>{sr?'Početna':'Start'}</a><a href={pilot}>{t.cta}</a></nav>
    </header>
    <section className="knowledge-hero"><span>PRAXIS &amp; WISSEN</span><h1>{t.hubTitle}</h1><p>{t.hubLead}</p><div className="knowledge-categories">{t.categories.map(x=><span key={x}>{x}</span>)}</div></section>
    <article className="knowledge-article">
      <div className="article-meta"><span>OPERATIONAL STANDARD</span><span>{t.read}</span><span>{t.date}</span><span>{t.author}</span></div>
      <h2>{t.articleTitle}</h2><p className="article-lead">{t.articleLead}</p>
      <aside className="executive-summary"><strong>Executive Summary</strong><p>{t.summary}</p></aside>
      <section><h3>{t.problemTitle}</h3><p>{t.problemText}</p></section>
      <section><h3>{t.causesTitle}</h3><ul>{t.causes.map(x=><li key={x}>{x}</li>)}</ul></section>
      <div className="article-flow">{t.flow.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><strong>{x}</strong>{i<t.flow.length-1&&<b>→</b>}</div>)}</div>
      <section className="article-checklist"><h3>{t.checklistTitle}</h3>{t.checklist.map(x=><label key={x}><input type="checkbox"/> <span>{x}</span></label>)}</section>
      <section className="article-faq"><h3>{t.faqTitle}</h3>{t.faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
      <section className="article-cta"><h3>{t.ctaTitle}</h3><a href={pilot}>{t.cta} →</a></section>
    </article>
  </main>
}
