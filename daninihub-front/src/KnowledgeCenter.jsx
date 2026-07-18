import './KnowledgeCenter.css'

const content = {
  de: {
    hubTitle: 'Praxis & Wissen',
    hubLead: 'Operative Fachinhalte für Transportteams: Abweichungen, Fahrerkommunikation, ETA, Übergaben und klar begrenzte Verantwortlichkeiten.',
    categories: ['Exception Management', 'ETA & Status', 'Fahrerkommunikation', 'Continuity', 'Operational Standards', 'Balkan–DACH'],
    badge: 'OPERATIONAL STANDARD',
    articleTitle: 'Warum suchen Transportunternehmen trotz moderner TMS-Systeme weiterhin Disponenten?',
    articleLead: 'Die Herausforderung liegt heute nicht mehr nur im Planen von Transporten, sondern im kontrollierten Umgang mit Abweichungen, Informationslücken und Zuständigkeitswechseln.',
    summaryTitle: 'Executive Summary',
    summary: 'Moderne TMS-, Telematik- und Tracking-Systeme liefern Daten. Sobald eine Tour vom Plan abweicht, müssen Menschen Informationen prüfen, priorisieren, weitergeben und dokumentieren. Genau an dieser Schnittstelle entstehen Rückfragen, Verzögerungen und unnötige Risiken. Der Engpass ist deshalb häufig nicht fehlende Software, sondern fehlende operative Kontinuität zwischen Fahrer, Disposition, Kunde und nächster Schicht.',
    read: '9 Min. Lesezeit', author: 'Dragan Zdravković', date: '18. Juli 2026', updated: 'Stand: Juli 2026',
    problemTitle: 'Planung funktioniert – bis der Plan nicht mehr funktioniert.',
    problemText: 'Solange eine Tour nach Plan läuft, erfüllen TMS, Telematik und automatische Statusmeldungen ihren Zweck. Die operative Arbeit beginnt jedoch dort, wo ein Status nicht mehr eindeutig ist: Verspätung, Stau, Fahrzeugausfall, fehlende Dokumente, geänderte Zeitfenster oder ein Sprachproblem zwischen Fahrer und Disposition.',
    costTitle: 'Wo entstehen die eigentlichen Kosten?',
    costText: 'Nicht jede Verspätung lässt sich verhindern. Vermeidbar sind jedoch Folgekosten durch verspätete Information, widersprüchliche Aussagen, unklare Zuständigkeiten und fehlende Dokumentation. Ein kleiner Informationsbruch kann Wartezeit, Sonderfahrten, Reklamationen oder verlorene Anschlussplanung auslösen.',
    causesTitle: 'Warum Software allein nicht genügt',
    causes: ['Informationen liegen gleichzeitig in TMS, Telefon, Messenger und E-Mail.', 'ETA wird mit einer verbindlichen Zusage verwechselt.', 'Ein Incident hat keinen klar benannten Verantwortlichen.', 'Freigaben, Rückfragen und Zusagen bleiben undokumentiert.', 'Bei Schichtwechseln geht Kontext verloren.', 'Sprachliche Missverständnisse verlängern Reaktionszeiten.'],
    approachTitle: 'Ein belastbarer operativer Ablauf',
    approachText: 'Der Prozess muss nicht kompliziert sein. Entscheidend ist, dass jede Abweichung nach demselben Muster bearbeitet wird: Fakten bestätigen, Risiko einordnen, Entscheidung beim Auftraggeber belassen, Kommunikation dokumentieren und den nächsten Prüfzeitpunkt festlegen.',
    flow: ['Plan', 'Abweichung', 'Faktenprüfung', 'Entscheidung', 'Kommunikation', 'Dokumentation', 'Recovery'],
    diagramCaption: 'DaniniHub Incident-to-Recovery Flow',
    infographicTitle: 'Drei Ebenen, die getrennt bleiben müssen',
    infographic: [
      ['Daten','TMS, GPS, Dokumente und Nachrichten liefern Rohinformationen.'],
      ['Bewertung','Menschen prüfen Plausibilität, Risiko und Priorität.'],
      ['Entscheidung','Freigaben und rechtsverbindliche Entscheidungen bleiben beim Auftraggeber.']
    ],
    checklistTitle: 'Operativer Selbstcheck',
    checklist: ['Ist der letzte Status bestätigt?', 'Ist ETA klar von einer Zusage getrennt?', 'Hat jeder Incident einen benannten Verantwortlichen?', 'Ist die nächste Prüfung terminiert?', 'Sind Freigaben und Übergaben dokumentiert?', 'Kann die nächste Schicht den Fall ohne Rückfrage übernehmen?'],
    takeawaysTitle: 'Die wichtigsten Erkenntnisse',
    takeaways: ['TMS ersetzt keine operative Verantwortung.', 'Die teuersten Fehler entstehen oft zwischen den Systemen.', 'ETA, Zusage und Freigabe müssen getrennt dokumentiert werden.', 'Mehrsprachige Kommunikation braucht klare Rückbestätigung.', 'Ein begrenzter Pilot ist sinnvoller als ein großes Transformationsprojekt.'],
    faqTitle: 'Häufige Fragen',
    faqs: [
      ['Ersetzt DaniniHub ein TMS?', 'Nein. DaniniHub ergänzt bestehende Systeme durch strukturierte Kommunikation, Nachverfolgung und dokumentierte Übergaben.'],
      ['Braucht ein Unternehmen dafür einen zusätzlichen Disponenten?', 'Nicht zwingend. Oft fehlt keine volle Stelle, sondern eine klar begrenzte Unterstützung für Status, Fahrerkommunikation, Abweichungen oder Übergaben.'],
      ['Entscheidet DaniniHub über Preise oder Transporte?', 'Nein. Preise, Partnerwahl, Freigaben und rechtsverbindliche Entscheidungen bleiben beim Auftraggeber.'],
      ['Kann KI die Disposition vollständig übernehmen?', 'Nicht verantwortungsvoll. KI kann Informationen strukturieren, Lücken markieren und Optionen vorbereiten. Menschen prüfen und entscheiden.'],
      ['Wann ist ein Pilot sinnvoll?', 'Wenn ein klar abgrenzbarer Engpass besteht und Erfolg anhand weniger Kriterien gemessen werden kann.'],
      ['Welche Daten werden benötigt?', 'Nur die Daten, die für den vereinbarten operativen Umfang notwendig sind. Der Umfang wird vor dem Pilot schriftlich begrenzt.']
    ],
    videoTitle: 'Video-Zusammenfassung',
    videoText: 'Für diesen Beitrag ist eine 60–90 Sekunden lange, sachliche Video-Zusammenfassung vorgesehen. Sie verwendet nur Prozessgrafiken, Kernbegriffe und den Incident-to-Recovery Flow – keine generischen KI-Avatare.',
    videoPrompt: 'Erstelle ein professionelles 75-Sekunden-B2B-Erklärvideo auf Deutsch. Zielgruppe: Geschäftsführer, Transportleiter und Disponenten in DACH. Thema: Warum Transportunternehmen trotz moderner TMS-Systeme weiterhin Disponenten benötigen. Kernaussage: Software liefert Daten; Menschen prüfen, entscheiden und dokumentieren. Visualisiere den Ablauf Plan → Abweichung → Faktenprüfung → Entscheidung → Kommunikation → Dokumentation → Recovery. Nutze dunkles Navy, Weiß, Cyan und dezentes Orange. Keine Avatare, keine Stock-Fahrer, keine übertriebenen Versprechen. Abschluss: DaniniHub – strukturierte operative Unterstützung zwischen Balkan und DACH. Entscheidungen bleiben beim Auftraggeber.',
    sourcesTitle: 'Hinweise & Quellenstandard',
    sourcesText: 'Dieser Beitrag enthält keine unbelegten Marktstatistiken. Fachliche Aussagen werden als operative Einordnung dargestellt. Sobald Zahlen, Gesetze oder externe Studien verwendet werden, werden Primärquellen direkt am jeweiligen Abschnitt verlinkt.',
    relatedTitle: 'Weiterführende Inhalte',
    related: [['Leistungsrahmen','/de/leistungsrahmen'],['Continuity Support','/de/continuity-support'],['Fahrerkommunikation','/de/fahrerkommunikation']],
    ctaTitle: 'Prüfen Sie, ob ein klar begrenzter Pilot zu Ihrem Team passt.', cta: 'Pilot-Check starten', print: 'Artikel drucken / als PDF speichern', copy: 'Link kopieren', copied: 'Link kopiert'
  },
  sr: {
    hubTitle: 'Praksa i znanje',
    hubLead: 'Stručni operativni sadržaji za transportne timove: odstupanja, komunikacija sa vozačima, ETA, predaja smene i jasno ograničene odgovornosti.',
    categories: ['Upravljanje odstupanjima', 'ETA i status', 'Komunikacija sa vozačima', 'Kontinuitet', 'Operativni standardi', 'Balkan–DACH'],
    badge: 'OPERATIVNI STANDARD',
    articleTitle: 'Zašto transportne kompanije i pored savremenih TMS sistema i dalje traže disponente?',
    articleLead: 'Izazov više nije samo planiranje transporta, već kontrolisano upravljanje odstupanjima, nedostajućim informacijama i promenama odgovornosti.',
    summaryTitle: 'Sažetak za rukovodioce',
    summary: 'Savremeni TMS, telematika i sistemi praćenja daju podatke. Kada tura odstupi od plana, ljudi i dalje moraju da provere, odrede prioritet, prenesu i dokumentuju informacije. Upravo na toj tački nastaju dodatni pozivi, kašnjenja i nepotrebni rizici. Usko grlo zato često nije nedostatak softvera, već prekid operativnog kontinuiteta između vozača, dispečera, klijenta i sledeće smene.',
    read: '9 min. čitanja', author: 'Dragan Zdravković', date: '18. jul 2026.', updated: 'Ažurirano: jul 2026.',
    problemTitle: 'Plan funkcioniše – dok stvarnost ne odstupi od plana.',
    problemText: 'Dok tura ide po planu, TMS, telematika i automatske statusne poruke rade svoj posao. Operativni rad počinje kada status više nije jasan: kašnjenje, zastoj, kvar vozila, nedostajući dokument, promenjen termin ili jezički problem između vozača i dispečera.',
    costTitle: 'Gde nastaju stvarni troškovi?',
    costText: 'Nije svako kašnjenje moguće sprečiti. Mogu se, međutim, smanjiti posledice zakašnjele informacije, različitih verzija događaja, nejasne odgovornosti i nedokumentovanih odluka. Jedan mali prekid u komunikaciji može izazvati čekanje, vanrednu vožnju, reklamaciju ili gubitak naredne ture.',
    causesTitle: 'Zašto softver sam nije dovoljan',
    causes: ['Informacije su istovremeno u TMS-u, telefonu, porukama i e-pošti.', 'ETA se meša sa obavezujućim obećanjem.', 'Incident nema jasno imenovanu odgovornu osobu.', 'Odobrenja, pitanja i obećanja ostaju bez zapisa.', 'Pri predaji smene gubi se kontekst.', 'Jezički nesporazumi produžavaju reakciju.'],
    approachTitle: 'Pouzdan operativni tok',
    approachText: 'Proces ne mora biti komplikovan. Važno je da se svako odstupanje obrađuje po istom obrascu: potvrditi činjenice, proceniti rizik, odluku ostaviti naručiocu, dokumentovati komunikaciju i odrediti vreme sledeće provere.',
    flow: ['Plan', 'Odstupanje', 'Provera činjenica', 'Odluka', 'Komunikacija', 'Dokumentacija', 'Oporavak'],
    diagramCaption: 'DaniniHub tok od incidenta do oporavka',
    infographicTitle: 'Tri nivoa koja moraju ostati odvojena',
    infographic: [
      ['Podaci','TMS, GPS, dokumenti i poruke daju sirove informacije.'],
      ['Procena','Čovek proverava verodostojnost, rizik i prioritet.'],
      ['Odluka','Odobrenja i pravno obavezujuće odluke ostaju kod naručioca.']
    ],
    checklistTitle: 'Operativna kontrolna lista',
    checklist: ['Da li je poslednji status potvrđen?', 'Da li je ETA odvojena od obećanja?', 'Da li svaki incident ima odgovornu osobu?', 'Da li je sledeća provera zakazana?', 'Da li su odobrenja i predaja dokumentovani?', 'Može li sledeća smena preuzeti slučaj bez dodatnog poziva?'],
    takeawaysTitle: 'Najvažniji zaključci',
    takeaways: ['TMS ne menja operativnu odgovornost.', 'Najskuplje greške često nastaju između sistema.', 'ETA, obećanje i odobrenje moraju biti odvojeno zabeleženi.', 'Višejezička komunikacija zahteva jasnu povratnu potvrdu.', 'Ograničen pilot je bolji početak od velikog projekta transformacije.'],
    faqTitle: 'Česta pitanja',
    faqs: [
      ['Da li DaniniHub menja TMS?', 'Ne. DaniniHub dopunjuje postojeće sisteme strukturisanom komunikacijom, praćenjem i dokumentovanom predajom.'],
      ['Da li je potreban još jedan disponent?', 'Ne nužno. Često nije potrebna puna pozicija, već jasno ograničena podrška za statuse, komunikaciju sa vozačima, odstupanja ili predaju smene.'],
      ['Da li DaniniHub odlučuje o cenama ili transportu?', 'Ne. Cene, izbor partnera, odobrenja i pravno obavezujuće odluke ostaju kod naručioca.'],
      ['Može li AI potpuno preuzeti dispoziciju?', 'Ne odgovorno. AI može strukturisati informacije, označiti praznine i pripremiti opcije. Čovek proverava i odlučuje.'],
      ['Kada pilot ima smisla?', 'Kada postoji jasno ograničeno usko grlo i kada se rezultat može meriti kroz nekoliko dogovorenih kriterijuma.'],
      ['Koji podaci su potrebni?', 'Samo podaci potrebni za dogovoreni operativni obim. Obim se pre pilota ograničava u pisanom obliku.']
    ],
    videoTitle: 'Video sažetak',
    videoText: 'Za ovaj članak predviđen je stručni video od 60–90 sekundi. Koristi samo procesne grafike, ključne pojmove i tok od incidenta do oporavka – bez generičkih AI avatara.',
    videoPrompt: 'Kreiraj profesionalni B2B video od 75 sekundi na srpskom jeziku. Ciljna grupa: vlasnici transportnih firmi, rukovodioci logistike i disponenti. Tema: Zašto transportne firme i pored savremenih TMS sistema i dalje traže disponente. Glavna poruka: softver daje podatke; čovek proverava, odlučuje i dokumentuje. Prikaži tok Plan → Odstupanje → Provera činjenica → Odluka → Komunikacija → Dokumentacija → Oporavak. Vizuelni stil: tamnoplava, bela, cijan i diskretna narandžasta. Bez avatara, bez generičkih snimaka vozača i bez nerealnih obećanja. Završetak: DaniniHub – strukturisana operativna podrška između Balkana i DACH regiona. Odluke ostaju kod naručioca.',
    sourcesTitle: 'Napomena o izvorima',
    sourcesText: 'Članak ne koristi neproverene tržišne statistike. Stručne tvrdnje predstavljene su kao operativna analiza. Kada budemo koristili brojke, propise ili spoljne studije, primarni izvori biće navedeni neposredno uz odgovarajući deo.',
    relatedTitle: 'Povezani sadržaji',
    related: [['Obim usluge','/sr/obim-usluge'],['Podrška kontinuitetu','/sr/kontinuitet-podrska'],['Komunikacija sa vozačima','/sr/komunikacija-vozaci']],
    ctaTitle: 'Proverite da li jasno ograničen pilot odgovara vašem timu.', cta: 'Pokreni proveru pilota', print: 'Odštampaj / sačuvaj kao PDF', copy: 'Kopiraj link', copied: 'Link je kopiran'
  }
}

export default function KnowledgeCenter({ lang }) {
  const t = content[lang]
  const sr = lang === 'sr'
  const pilot = sr ? '/sr/provera-pilota' : '/de/pilot-check'
  const copyLink = async (event) => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      event.currentTarget.textContent = t.copied
      setTimeout(() => { event.currentTarget.textContent = t.copy }, 1800)
    } catch { window.prompt(t.copy, window.location.href) }
  }

  return <main className="knowledge-page">
    <section className="knowledge-hero">
      <div className="knowledge-eyebrow">DANINIHUB · {t.hubTitle}</div>
      <h1>{t.hubTitle}</h1>
      <p>{t.hubLead}</p>
      <div className="knowledge-categories">{t.categories.map(x=><span key={x}>{x}</span>)}</div>
    </section>

    <article className="knowledge-article">
      <header className="article-hero">
        <div className="article-meta"><span>{t.badge}</span><span>{t.read}</span><span>{t.updated}</span></div>
        <h2>{t.articleTitle}</h2>
        <p className="article-lead">{t.articleLead}</p>
        <div className="article-byline"><span>{t.author}</span><span>{t.date}</span></div>
        <div className="article-tools"><button type="button" onClick={() => window.print()}>{t.print}</button><button type="button" onClick={copyLink}>{t.copy}</button></div>
      </header>

      <aside className="executive-summary"><strong>{t.summaryTitle}</strong><p>{t.summary}</p></aside>

      <section><h3>{t.problemTitle}</h3><p>{t.problemText}</p></section>
      <section><h3>{t.costTitle}</h3><p>{t.costText}</p></section>
      <section><h3>{t.causesTitle}</h3><ul>{t.causes.map(x=><li key={x}>{x}</li>)}</ul></section>
      <section><h3>{t.approachTitle}</h3><p>{t.approachText}</p></section>

      <figure className="article-diagram">
        <div className="article-flow">{t.flow.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><strong>{x}</strong>{i<t.flow.length-1&&<b>→</b>}</div>)}</div>
        <figcaption>{t.diagramCaption}</figcaption>
      </figure>

      <section className="article-infographic"><h3>{t.infographicTitle}</h3><div>{t.infographic.map(([title,text],i)=><article key={title}><span>0{i+1}</span><h4>{title}</h4><p>{text}</p></article>)}</div></section>

      <section className="article-checklist"><h3>{t.checklistTitle}</h3>{t.checklist.map(x=><label key={x}><input type="checkbox"/><span>{x}</span></label>)}</section>

      <section className="article-takeaways"><h3>{t.takeawaysTitle}</h3><ol>{t.takeaways.map(x=><li key={x}>{x}</li>)}</ol></section>

      <section className="article-faq"><h3>{t.faqTitle}</h3>{t.faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>

      <section className="article-video"><div><span>VIDEO BRIEF</span><h3>{t.videoTitle}</h3><p>{t.videoText}</p></div><details><summary>Gemini / NotebookLM Prompt</summary><p>{t.videoPrompt}</p></details></section>

      <section className="article-sources"><h3>{t.sourcesTitle}</h3><p>{t.sourcesText}</p></section>

      <section className="article-author"><div className="article-author-mark">DZ</div><div><span>AUTOR</span><h3>{t.author}</h3><p>DaniniHub Transport &amp; Logistics · Duisburg</p></div></section>

      <section className="article-related"><h3>{t.relatedTitle}</h3><div>{t.related.map(([label,href])=><a key={href} href={href}>{label}<span>→</span></a>)}</div></section>

      <section className="article-cta"><span>PILOT FIRST</span><h3>{t.ctaTitle}</h3><a href={pilot}>{t.cta} →</a></section>
    </article>
  </main>
}
