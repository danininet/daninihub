import './KnowledgeCenter.css'

const content = {
  de: {
    hubTitle:'Praxis & Wissen', hubLead:'Operative Fachinhalte für Transportteams: Abweichungen, Fahrerkommunikation, ETA, Übergaben und klar begrenzte Verantwortlichkeiten.',
    categories:['Exception Management','ETA & Status','Fahrerkommunikation','Continuity','Operational Standards','Balkan–DACH'], badge:'PRAXIS & WISSEN',
    articleTitle:'Warum suchen Transportunternehmen trotz moderner TMS-Systeme weiterhin Disponenten?',
    articleLead:'Weil Software Daten liefert – operative Verantwortung, Bewertung und Kommunikation aber weiterhin organisiert werden müssen.',
    summaryTitle:'Executive Summary', summary:'Moderne TMS-, Telematik- und Tracking-Systeme schaffen Transparenz. Sobald eine Tour vom Plan abweicht, müssen Informationen jedoch geprüft, priorisiert, weitergegeben und dokumentiert werden. Der Engpass ist deshalb häufig nicht fehlende Software, sondern fehlende operative Kontinuität zwischen Fahrer, Disposition, Kunde und nächster Schicht.',
    read:'7 Min. Lesezeit', author:'Dragan Zdravković', date:'18. Juli 2026',
    sections:[
      ['Planung funktioniert – bis der Plan nicht mehr funktioniert.','Solange eine Tour planmäßig läuft, erfüllen TMS, Telematik und automatische Statusmeldungen ihren Zweck. Die eigentliche operative Arbeit beginnt bei Verspätung, Stau, Fahrzeugausfall, fehlenden Dokumenten, geänderten Zeitfenstern oder Sprachproblemen.'],
      ['Wo entstehen die eigentlichen Kosten?','Nicht jede Verspätung lässt sich verhindern. Vermeidbar sind jedoch Folgekosten durch verspätete Information, widersprüchliche Aussagen, unklare Zuständigkeiten und fehlende Dokumentation.'],
      ['Warum Software allein nicht genügt','Informationen liegen oft gleichzeitig in TMS, Telefon, Messenger und E-Mail. ETA wird mit einer Zusage verwechselt, Freigaben bleiben undokumentiert und bei Schichtwechseln geht Kontext verloren.'],
      ['Ein belastbarer operativer Ablauf','Jede Abweichung sollte nach demselben Muster bearbeitet werden: Fakten bestätigen, Risiko einordnen, Entscheidung beim Auftraggeber belassen, Kommunikation dokumentieren und den nächsten Prüfzeitpunkt festlegen.']
    ],
    flow:['Plan','Abweichung','Faktenprüfung','Entscheidung','Kommunikation','Dokumentation','Recovery'],
    checklistTitle:'Operativer Selbstcheck', checklist:['Ist der letzte Status bestätigt?','Ist ETA klar von einer Zusage getrennt?','Hat jeder Incident einen Verantwortlichen?','Ist die nächste Prüfung terminiert?','Sind Freigaben und Übergaben dokumentiert?'],
    faqTitle:'Häufige Fragen', faqs:[['Ersetzt DaniniHub ein TMS?','Nein. DaniniHub ergänzt bestehende Systeme durch strukturierte Kommunikation, Nachverfolgung und dokumentierte Übergaben.'],['Braucht ein Unternehmen einen zusätzlichen Disponenten?','Nicht zwingend. Oft fehlt keine volle Stelle, sondern klar begrenzte Unterstützung für Status, Fahrerkommunikation, Abweichungen oder Übergaben.'],['Entscheidet DaniniHub über Preise oder Transporte?','Nein. Preise, Partnerwahl, Freigaben und rechtsverbindliche Entscheidungen bleiben beim Auftraggeber.'],['Kann KI die Disposition vollständig übernehmen?','Nein. KI kann strukturieren und vorbereiten; Menschen prüfen und entscheiden.']],
    relatedTitle:'Weiterführende Inhalte', related:[['Leistungsrahmen','/de/leistungsrahmen'],['Continuity Support','/de/continuity-support'],['Fahrerkommunikation','/de/fahrerkommunikation']],
    ctaTitle:'Prüfen Sie, ob ein klar begrenzter Pilot zu Ihrem Team passt.', cta:'Pilot-Check starten', print:'Drucken / als PDF speichern', copy:'Link kopieren', copied:'Link kopiert'
  },
  sr: {
    hubTitle:'Praksa i znanje', hubLead:'Stručni operativni sadržaji za transportne timove: odstupanja, komunikacija sa vozačima, ETA, predaja smene i jasno ograničene odgovornosti.',
    categories:['Upravljanje odstupanjima','ETA i status','Komunikacija sa vozačima','Kontinuitet','Operativni standardi','Balkan–DACH'], badge:'PRAKSA I ZNANJE',
    articleTitle:'Zašto transportne kompanije i pored savremenih TMS sistema i dalje traže disponente?',
    articleLead:'Zato što softver daje podatke, ali operativna odgovornost, procena i komunikacija i dalje moraju biti organizovane.',
    summaryTitle:'Sažetak za rukovodioce', summary:'Savremeni TMS, telematika i sistemi praćenja stvaraju pregled. Kada tura odstupi od plana, informacije ipak moraju biti proverene, rangirane po prioritetu, prenete i dokumentovane. Usko grlo zato često nije nedostatak softvera, već prekid operativnog kontinuiteta između vozača, dispečera, klijenta i sledeće smene.',
    read:'7 min. čitanja', author:'Dragan Zdravković', date:'18. jul 2026.',
    sections:[
      ['Plan funkcioniše – dok stvarnost ne odstupi od plana.','Dok tura ide po planu, TMS, telematika i automatske statusne poruke rade svoj posao. Pravi operativni rad počinje kod kašnjenja, zastoja, kvara vozila, nedostajućeg dokumenta, promenjenog termina ili jezičkog problema.'],
      ['Gde nastaju stvarni troškovi?','Nije svako kašnjenje moguće sprečiti. Mogu se, međutim, smanjiti posledice zakašnjele informacije, različitih verzija događaja, nejasne odgovornosti i nedokumentovanih odluka.'],
      ['Zašto softver sam nije dovoljan','Informacije su često istovremeno u TMS-u, telefonu, porukama i e-pošti. ETA se meša sa obećanjem, odobrenja ostaju bez zapisa, a pri predaji smene gubi se kontekst.'],
      ['Pouzdan operativni tok','Svako odstupanje treba obraditi po istom obrascu: potvrditi činjenice, proceniti rizik, odluku ostaviti naručiocu, dokumentovati komunikaciju i odrediti sledeću proveru.']
    ],
    flow:['Plan','Odstupanje','Provera činjenica','Odluka','Komunikacija','Dokumentacija','Oporavak'],
    checklistTitle:'Operativna kontrolna lista', checklist:['Da li je poslednji status potvrđen?','Da li je ETA odvojena od obećanja?','Da li svaki incident ima odgovornu osobu?','Da li je sledeća provera zakazana?','Da li su odobrenja i predaja dokumentovani?'],
    faqTitle:'Česta pitanja', faqs:[['Da li DaniniHub menja TMS?','Ne. DaniniHub dopunjuje postojeće sisteme strukturisanom komunikacijom, praćenjem i dokumentovanom predajom.'],['Da li je potreban još jedan disponent?','Ne nužno. Često nije potrebna puna pozicija, već jasno ograničena podrška za statuse, komunikaciju sa vozačima, odstupanja ili predaju smene.'],['Da li DaniniHub odlučuje o cenama ili transportu?','Ne. Cene, izbor partnera, odobrenja i pravno obavezujuće odluke ostaju kod naručioca.'],['Može li AI potpuno preuzeti dispoziciju?','Ne. AI može strukturisati i pripremiti; čovek proverava i odlučuje.']],
    relatedTitle:'Povezani sadržaji', related:[['Obim usluge','/sr/obim-usluge'],['Podrška kontinuitetu','/sr/kontinuitet-podrska'],['Komunikacija sa vozačima','/sr/komunikacija-vozaci']],
    ctaTitle:'Proverite da li jasno ograničen pilot odgovara vašem timu.', cta:'Pokreni proveru pilota', print:'Odštampaj / sačuvaj kao PDF', copy:'Kopiraj link', copied:'Link je kopiran'
  }
}

export default function KnowledgeCenter({ lang }) {
  const t=content[lang], sr=lang==='sr', pilot=sr?'/sr/provera-pilota':'/de/pilot-check'
  const copyLink=async e=>{try{await navigator.clipboard.writeText(location.href);e.currentTarget.textContent=t.copied;setTimeout(()=>e.currentTarget.textContent=t.copy,1600)}catch{}}
  return <main className="knowledge-page">
    <section className="knowledge-hero"><div className="knowledge-eyebrow">DANINIHUB · {t.badge}</div><h1>{t.articleTitle}</h1><p>{t.articleLead}</p><div className="article-meta"><span>{t.read}</span><span>{t.author}</span><span>{t.date}</span></div><div className="knowledge-categories">{t.categories.map(x=><span key={x}>{x}</span>)}</div></section>
    <article className="knowledge-article">
      <div className="article-tools"><button onClick={()=>window.print()}>{t.print}</button><button onClick={copyLink}>{t.copy}</button></div>
      <aside className="executive-summary"><strong>{t.summaryTitle}</strong><p>{t.summary}</p></aside>
      {t.sections.map(([h,p])=><section key={h}><h2>{h}</h2><p>{p}</p></section>)}
      <figure className="article-diagram"><div className="article-flow">{t.flow.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><strong>{x}</strong>{i<t.flow.length-1&&<b>→</b>}</div>)}</div></figure>
      <section className="article-checklist"><h2>{t.checklistTitle}</h2>{t.checklist.map(x=><label key={x}><input type="checkbox"/><span>{x}</span></label>)}</section>
      <section className="article-faq"><h2>{t.faqTitle}</h2>{t.faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
      <section className="article-related"><h2>{t.relatedTitle}</h2><div>{t.related.map(([label,href])=><a key={href} href={href}>{label}<span>→</span></a>)}</div></section>
      <section className="article-cta"><span>PILOT FIRST</span><h2>{t.ctaTitle}</h2><a href={pilot}>{t.cta} →</a></section>
    </article>
  </main>
}