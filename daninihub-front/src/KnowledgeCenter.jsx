import './KnowledgeCenter.css'

const copy = {
  de: {
    eyebrow: 'PRAXIS & WISSEN · DISPOSITION',
    title: 'Warum suchen Transportunternehmen trotz moderner TMS-Systeme weiterhin Disponenten?',
    lead: 'Weil Software Daten liefert – operative Verantwortung, Bewertung, Kommunikation und Übergabe aber weiterhin organisiert werden müssen.',
    meta: '8 Min. Lesezeit · 18. Juli 2026 · Dragan Zdravković',
    summaryTitle: 'Executive Summary',
    summary: 'TMS, Telematik und Tracking schaffen Transparenz. Sobald eine Tour vom Plan abweicht, müssen Informationen jedoch geprüft, priorisiert, bestätigt, weitergegeben und dokumentiert werden. Der Engpass liegt deshalb häufig nicht im System, sondern zwischen Fahrer, Disposition, Kunde und nächster Schicht.',
    sections: [
      ['Planung endet dort, wo die Abweichung beginnt', 'Solange eine Tour planmäßig läuft, funktionieren automatische Statusmeldungen, ETA-Berechnung und Dokumentation zuverlässig. Die eigentliche operative Belastung entsteht bei Verspätung, Fahrzeugausfall, fehlenden Unterlagen, geänderten Zeitfenstern oder widersprüchlichen Informationen.'],
      ['Was moderne Systeme gut können', 'Ein TMS bündelt Aufträge, Termine, Statusdaten und Dokumente. Telematik zeigt Positionen und Bewegungen. Diese Systeme liefern eine belastbare Datengrundlage – sie bewerten aber nicht automatisch, welche Information bestätigt ist, welche Zusage verbindlich ist und wer jetzt entscheiden muss.'],
      ['Die Lücke zwischen Daten und Entscheidung', 'Ein GPS-Signal ist noch kein bestätigter Status. Eine ETA ist noch keine Zusage. Eine Fahrerangabe ist noch keine freigegebene Kundeninformation. Genau diese Trennung muss im operativen Alltag sauber organisiert werden.'],
      ['Warum der Disponent weiterhin zentral bleibt', 'Der Disponent verbindet Informationen mit Kontext. Er prüft Plausibilität, setzt Prioritäten, klärt Rückfragen, eskaliert Entscheidungen, dokumentiert Freigaben und sorgt dafür, dass der Fall bei einem Schichtwechsel nicht wieder bei null beginnt.'],
      ['Wo Kosten tatsächlich entstehen', 'Nicht jede Verspätung ist vermeidbar. Vermeidbar sind jedoch Folgekosten durch späte Meldungen, unterschiedliche Versionen eines Ereignisses, fehlende Zuständigkeit oder eine unvollständige Übergabe. Kleine Informationsbrüche lösen Wartezeit, Reklamationen, Sonderfahrten oder verlorene Anschlussplanung aus.'],
    ],
    flow: ['Plan', 'Abweichung', 'Fakten prüfen', 'Risiko bewerten', 'Entscheidung', 'Kommunikation', 'Übergabe'],
    checkTitle: 'Operativer Selbstcheck',
    checks: ['Ist der letzte Status bestätigt?', 'Ist ETA klar von einer verbindlichen Zusage getrennt?', 'Ist eine verantwortliche Person benannt?', 'Sind Freigaben und Rückfragen dokumentiert?', 'Ist der nächste Prüfzeitpunkt festgelegt?', 'Kann die nächste Schicht ohne Zusatzanruf übernehmen?'],
    faqTitle: 'Häufige Fragen',
    faq: [
      ['Ersetzt DaniniHub ein TMS?', 'Nein. DaniniHub ergänzt bestehende Systeme durch strukturierte Kommunikation, Statusnachverfolgung und dokumentierte Übergaben.'],
      ['Braucht jedes Unternehmen einen zusätzlichen Disponenten?', 'Nicht zwingend. Häufig fehlt keine volle Stelle, sondern klar begrenzte Unterstützung in Zeiten hoher Belastung oder bei mehrsprachigen Relationen.'],
      ['Kann KI die Disposition vollständig übernehmen?', 'KI kann strukturieren, Lücken markieren und Optionen vorbereiten. Freigaben und verbindliche Entscheidungen bleiben bei Menschen.'],
      ['Wann ist ein Pilot sinnvoll?', 'Wenn ein klar abgrenzbarer operativer Engpass besteht und Erfolg anhand weniger Kriterien gemessen werden kann.'],
    ],
    videoTitle: 'Video zum Beitrag',
    videoText: 'Balkan–DACH Operations Support in kompakter Form.',
    categories: ['Für Disponenten', 'Für Fahrer', 'Gesetze & Vorschriften', 'Regeländerungen & Updates', 'Balkan–DACH Praxis', 'DaniniHub Standards'],
    cta: 'Pilot-Check starten',
  },
  sr: {
    eyebrow: 'PRAKSA I ZNANJE · DISPOZICIJA',
    title: 'Zašto transportne kompanije i pored savremenih TMS sistema i dalje traže disponente?',
    lead: 'Zato što softver daje podatke, ali operativna odgovornost, procena, komunikacija i predaja i dalje moraju biti organizovane.',
    meta: '8 min. čitanja · 18. jul 2026. · Dragan Zdravković',
    summaryTitle: 'Sažetak za rukovodioce',
    summary: 'TMS, telematika i praćenje stvaraju pregled. Kada tura odstupi od plana, informacije ipak moraju biti proverene, rangirane po prioritetu, potvrđene, prenete i dokumentovane. Usko grlo zato često nije u sistemu, već između vozača, disponenta, klijenta i sledeće smene.',
    sections: [
      ['Planiranje se završava tamo gde odstupanje počinje', 'Dok tura ide po planu, automatski statusi, ETA i dokumentacija funkcionišu pouzdano. Pravo operativno opterećenje nastaje kod kašnjenja, kvara vozila, nedostajućih dokumenata, promenjenog termina ili različitih verzija događaja.'],
      ['Šta savremeni sistemi rade dobro', 'TMS povezuje naloge, termine, statuse i dokumenta. Telematika pokazuje poziciju i kretanje. Sistemi daju dobru osnovu, ali ne procenjuju sami koja je informacija potvrđena, koje obećanje je obavezujuće i ko sada mora da odluči.'],
      ['Praznina između podatka i odluke', 'GPS signal nije isto što i potvrđen status. ETA nije isto što i obećanje. Informacija vozača nije automatski odobrena informacija za klijenta. Upravo ovo razdvajanje mora biti uređeno.'],
      ['Zašto disponent ostaje ključan', 'Disponent povezuje informacije sa kontekstom. Proverava verodostojnost, postavlja prioritete, razjašnjava pitanja, prosleđuje odluke, dokumentuje odobrenja i obezbeđuje da se pri predaji smene ne počinje ispočetka.'],
      ['Gde stvarno nastaju troškovi', 'Nije svako kašnjenje moguće sprečiti. Mogu se sprečiti posledice kasne prijave, različitih verzija događaja, nejasne odgovornosti i loše predaje. Mali prekidi u informacijama izazivaju čekanje, reklamacije, vanredne vožnje ili gubitak naredne ture.'],
    ],
    flow: ['Plan', 'Odstupanje', 'Provera činjenica', 'Procena rizika', 'Odluka', 'Komunikacija', 'Predaja'],
    checkTitle: 'Operativna kontrolna lista',
    checks: ['Da li je poslednji status potvrđen?', 'Da li je ETA odvojena od obećanja?', 'Da li je imenovana odgovorna osoba?', 'Da li su odobrenja i pitanja dokumentovani?', 'Da li je sledeća provera zakazana?', 'Može li sledeća smena preuzeti slučaj bez dodatnog poziva?'],
    faqTitle: 'Česta pitanja',
    faq: [
      ['Da li DaniniHub menja TMS?', 'Ne. DaniniHub dopunjuje postojeće sisteme strukturisanom komunikacijom, praćenjem statusa i dokumentovanom predajom.'],
      ['Da li je svakoj firmi potreban dodatni disponent?', 'Ne nužno. Često nije potrebna puna pozicija, već jasno ograničena podrška tokom opterećenja ili na višejezičkim relacijama.'],
      ['Može li AI potpuno preuzeti dispoziciju?', 'AI može strukturisati informacije, označiti praznine i pripremiti opcije. Odobrenja i obavezujuće odluke ostaju kod ljudi.'],
      ['Kada pilot ima smisla?', 'Kada postoji jasno ograničeno operativno usko grlo i rezultat može da se meri kroz nekoliko kriterijuma.'],
    ],
    videoTitle: 'Video uz članak',
    videoText: 'Balkan–DACH operativna podrška u sažetom obliku.',
    categories: ['Za disponente', 'Za vozače', 'Zakoni i propisi', 'Promene pravila i novosti', 'Balkan–DACH praksa', 'DaniniHub standardi'],
    cta: 'Pokreni proveru pilota',
  },
}

export default function KnowledgeCenter({ lang }) {
  const t = copy[lang]
  const sr = lang === 'sr'

  return (
    <main className="knowledge-page">
      <section className="knowledge-hero">
        <div className="knowledge-eyebrow">{t.eyebrow}</div>
        <h1>{t.title}</h1>
        <p>{t.lead}</p>
        <div className="article-meta">{t.meta}</div>
        <div className="knowledge-categories">
          {t.categories.map((x, i) => (
            <a key={x} href={`#cat-${i}`}>{x}</a>
          ))}
        </div>
      </section>

      <article className="knowledge-article">
        <aside className="executive-summary">
          <strong>{t.summaryTitle}</strong>
          <p>{t.summary}</p>
        </aside>

        <section className="article-video">
          <div>
            <span>VIDEO</span>
            <h2>{t.videoTitle}</h2>
            <p>{t.videoText}</p>
          </div>
          <video controls preload="metadata">
            <source src="/DaniniHub_Balkan-DACH.mp4" type="video/mp4" />
          </video>
        </section>

        {t.sections.map(([heading, paragraph]) => (
          <section key={heading}>
            <h2>{heading}</h2>
            <p>{paragraph}</p>
          </section>
        ))}

        <figure className="article-diagram">
          <div className="article-flow">
            {t.flow.map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item}</strong>
                {index < t.flow.length - 1 && <b>→</b>}
              </div>
            ))}
          </div>
        </figure>

        <section className="article-checklist">
          <h2>{t.checkTitle}</h2>
          {t.checks.map((item) => (
            <label key={item}>
              <input type="checkbox" />
              <span>{item}</span>
            </label>
          ))}
        </section>

        <section className="article-faq">
          <h2>{t.faqTitle}</h2>
          {t.faq.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </section>

        <section className="article-cta">
          <span>PILOT FIRST</span>
          <h2>{sr ? 'Jasno ograničena podrška umesto nejasnog outsourcinga.' : 'Klar begrenzte Unterstützung statt unklarem Outsourcing.'}</h2>
          <a href={sr ? '/sr/provera-pilota' : '/de/pilot-check'}>{t.cta} →</a>
        </section>
      </article>
    </main>
  )
}
