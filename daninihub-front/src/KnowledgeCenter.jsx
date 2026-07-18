import './KnowledgeCenter.css'

const content = {
  de: {
    eyebrow: 'DANINIHUB · PRAXIS & WISSEN',
    title: 'Wissen für Disposition, Fahrer und Transportpraxis.',
    lead: 'Getrennte Themenbereiche für operative Arbeit, Fahreralltag, Gesetze, Vorschriften und aktuelle Regeländerungen im Balkan–DACH-Transport.',
    categoriesTitle: 'Themenbereiche',
    categories: [
      ['Für Disponenten','Störungen, ETA, Status, Übergaben, Kommunikation, Dokumentation und operative Standards.','DISPOSITION'],
      ['Für Fahrer','Abläufe an Lade- und Entladestellen, Dokumente, Kommunikation, Wartezeiten und praktische Orientierung.','FAHRER'],
      ['Gesetze & Vorschriften','Relevante gesetzliche Grundlagen, Pflichten, Verordnungen und offizielle Hinweise – mit Quellen.','RECHT'],
      ['Regeländerungen & Updates','Änderungen bei Maut, Lenk- und Ruhezeiten, Dokumenten, Grenzverfahren und Transportregeln.','UPDATES'],
      ['Balkan–DACH Praxis','Sprachliche, operative und organisatorische Besonderheiten auf Relationen zwischen Balkan und DACH.','BALKAN–DACH'],
      ['DaniniHub Standards','Checklisten, Incident Cards, Statuslogik, Handover und klar begrenzte Verantwortlichkeiten.','STANDARDS']
    ],
    outlineEyebrow: 'ARTIKEL-OUTLINE · NOCH NICHT VERÖFFENTLICHT',
    outlineTitle: 'Warum suchen Transportunternehmen trotz moderner TMS-Systeme weiterhin Disponenten?',
    outlineLead: 'Der Artikel wird erst nach fachlicher Prüfung, Quellenkontrolle und Freigabe veröffentlicht.',
    outlineSections: [
      ['01','Problemstellung','Warum moderne Systeme Transparenz schaffen, operative Abweichungen aber nicht selbst lösen.'],
      ['02','Executive Summary','Kernaussage für Geschäftsführer, Transportleiter und Disponenten in 30 Sekunden.'],
      ['03','Was TMS gut kann','Planung, Tracking, Statusdaten, Dokumentation und Prozesssicht.'],
      ['04','Wo die Lücke entsteht','Verspätung, Ausfall, fehlende Information, Sprachproblem, unklare Zuständigkeit und Schichtwechsel.'],
      ['05','Rolle des Disponenten','Prüfen, priorisieren, kommunizieren, eskalieren, dokumentieren und Übergaben sichern.'],
      ['06','Daten – Bewertung – Entscheidung','Klare Trennung zwischen Systemdaten, menschlicher Bewertung und verbindlicher Entscheidung.'],
      ['07','Praxisbeispiel','Fiktiver Incident vom ersten Status bis zur dokumentierten Recovery.'],
      ['08','Operativer Selbstcheck','Kontrollfragen für Status, ETA, Verantwortlichkeit, Freigabe und Übergabe.'],
      ['09','FAQ','TMS, KI, zusätzliche Disposition, Outsourcing, Verantwortung und Pilotumfang.'],
      ['10','Quellen & Aktualität','Primärquellen, Veröffentlichungsdatum, Änderungsstand und klare Kennzeichnung von Einschätzungen.'],
      ['11','Fazit','Warum Software und operative Verantwortung zusammengehören.'],
      ['12','Nächster Schritt','Zurückhaltender Verweis auf den klar begrenzten Pilot-Check.']
    ]
  },
  sr: {
    eyebrow: 'DANINIHUB · PRAKSA I ZNANJE',
    title: 'Znanje za disponente, vozače i transportnu praksu.',
    lead: 'Odvojene oblasti za operativni rad, svakodnevicu vozača, zakone, propise i aktuelne promene pravila u Balkan–DACH transportu.',
    categoriesTitle: 'Kategorije sadržaja',
    categories: [
      ['Za disponente','Odstupanja, ETA, statusi, predaja smene, komunikacija, dokumentovanje i operativni standardi.','DISPOZICIJA'],
      ['Za vozače','Procedure na utovaru i istovaru, dokumentacija, komunikacija, čekanja i praktična orijentacija.','VOZAČI'],
      ['Zakoni i propisi','Relevantne zakonske osnove, obaveze, uredbe i zvanična obaveštenja – uz izvore.','PRAVO'],
      ['Promene pravila i novosti','Promene putarina, vremena vožnje i odmora, dokumenata, graničnih procedura i transportnih pravila.','NOVOSTI'],
      ['Balkan–DACH praksa','Jezičke, operativne i organizacione posebnosti na relacijama Balkan–DACH.','BALKAN–DACH'],
      ['DaniniHub standardi','Kontrolne liste, Incident Card, statusna logika, predaja i jasno ograničene odgovornosti.','STANDARDI']
    ],
    outlineEyebrow: 'OUTLINE ČLANKA · JOŠ NIJE OBJAVLJEN',
    outlineTitle: 'Zašto transportne kompanije i pored savremenih TMS sistema i dalje traže disponente?',
    outlineLead: 'Članak se objavljuje tek nakon stručne provere, kontrole izvora i konačnog odobrenja.',
    outlineSections: [
      ['01','Postavljanje problema','Zašto moderni sistemi daju pregled, ali sami ne rešavaju operativna odstupanja.'],
      ['02','Sažetak za rukovodioce','Glavna poruka za vlasnika firme, rukovodioca transporta i disponenta u 30 sekundi.'],
      ['03','Šta TMS radi dobro','Planiranje, praćenje, statusni podaci, dokumentacija i pregled procesa.'],
      ['04','Gde nastaje praznina','Kašnjenje, kvar, nedostajuća informacija, jezički problem, nejasna odgovornost i predaja smene.'],
      ['05','Uloga disponenta','Provera, određivanje prioriteta, komunikacija, eskalacija, dokumentovanje i sigurna predaja.'],
      ['06','Podaci – procena – odluka','Jasno razdvajanje sistemskih podataka, ljudske procene i obavezujuće odluke.'],
      ['07','Praktičan primer','Fiktivni incident od prvog statusa do dokumentovanog oporavka.'],
      ['08','Operativna kontrolna lista','Pitanja za status, ETA, odgovornu osobu, odobrenje i predaju.'],
      ['09','Česta pitanja','TMS, AI, dodatni disponent, outsourcing, odgovornost i obim pilota.'],
      ['10','Izvori i ažurnost','Primarni izvori, datum objave, stanje izmena i jasno označena stručna procena.'],
      ['11','Zaključak','Zašto softver i operativna odgovornost moraju raditi zajedno.'],
      ['12','Sledeći korak','Nenametljiv prelaz ka jasno ograničenoj proveri pilota.']
    ]
  }
}

export default function KnowledgeCenter({ lang }) {
  const t = content[lang]
  return <main className="knowledge-page">
    <section className="knowledge-hero knowledge-hero-index">
      <div className="knowledge-eyebrow">{t.eyebrow}</div>
      <h1>{t.title}</h1>
      <p>{t.lead}</p>
    </section>

    <section className="knowledge-article knowledge-index">
      <header className="knowledge-section-head">
        <span>01</span>
        <h2>{t.categoriesTitle}</h2>
      </header>
      <div className="knowledge-category-grid">
        {t.categories.map(([title,text,badge]) => <article key={title}>
          <span>{badge}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>)}
      </div>

      <section className="article-outline">
        <div className="article-outline-head">
          <span>{t.outlineEyebrow}</span>
          <h2>{t.outlineTitle}</h2>
          <p>{t.outlineLead}</p>
        </div>
        <div className="article-outline-list">
          {t.outlineSections.map(([no,title,text]) => <article key={no}>
            <span>{no}</span>
            <div><h3>{title}</h3><p>{text}</p></div>
          </article>)}
        </div>
      </section>
    </section>
  </main>
}
