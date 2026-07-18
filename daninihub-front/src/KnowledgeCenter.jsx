import { useState } from 'react'
import './KnowledgeCenter.css'
import './KnowledgeArticle.css'
import EtaArticle from './EtaArticle'
import { etaArticlePaths, tmsArticlePaths } from './KnowledgePaths'

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
    checkTitle: 'Schnellcheck vor der Übergabe',
    checkIntro: 'Vor Schichtende oder der Übergabe an einen Kollegen zeigen diese sechs Fragen, ob ein laufender Transport wirklich kontrolliert und nachvollziehbar dokumentiert ist.',
    checks: ['Ist der letzte Fahrer- oder Transportstatus durch eine verlässliche Quelle bestätigt?', 'Sind die aktuelle ETA und der dem Kunden bestätigte Termin getrennt dokumentiert?', 'Ist festgelegt, wer den nächsten Schritt verantwortet?', 'Sind Entscheidungen, Freigaben und offene Rückfragen nachvollziehbar dokumentiert?', 'Ist festgelegt, wer den Status wann erneut prüft?', 'Kann die nächste Schicht ausschließlich anhand des Eintrags weiterarbeiten, ohne Fahrer oder Kunden erneut anzurufen?'],
    checkNoteTitle: 'Wofür diese Liste da ist',
    checkNote: 'Sie prüft die Qualität der operativen Übergabe. Muss die nächste Schicht zuerst Kollegen, Fahrer oder Kunden anrufen, nur um den Vorgang zu verstehen, ist die Dokumentation noch nicht vollständig.',
    faqTitle: 'Häufige Fragen',
    faq: [
      ['Ersetzt DaniniHub ein TMS?', 'Nein. DaniniHub ergänzt bestehende Systeme durch strukturierte Kommunikation, Statusnachverfolgung und dokumentierte Übergaben.'],
      ['Braucht jedes Unternehmen einen zusätzlichen Disponenten?', 'Nicht zwingend. Häufig fehlt keine volle Stelle, sondern klar begrenzte Unterstützung in Zeiten hoher Belastung oder bei mehrsprachigen Relationen.'],
      ['Kann KI die Disposition vollständig übernehmen?', 'KI kann strukturieren, Lücken markieren und Optionen vorbereiten. Freigaben und verbindliche Entscheidungen bleiben bei Menschen.'],
      ['Wann ist ein Pilot sinnvoll?', 'Wenn ein klar abgrenzbarer operativer Engpass besteht und Erfolg anhand weniger Kriterien gemessen werden kann.'],
    ],
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
    checkTitle: 'Brza provera pre predaje transportnog slučaja',
    checkIntro: 'Pre završetka smene ili predaje kolegi, ovih šest pitanja pokazuje da li je aktivan transport zaista pod kontrolom i dovoljno jasno dokumentovan.',
    checks: ['Da li je poslednji status vozača ili transporta potvrđen pouzdanim izvorom?', 'Da li su aktuelna ETA i termin potvrđen klijentu odvojeno dokumentovani?', 'Da li je određeno ko je odgovoran za sledeći korak?', 'Da li su odluke, odobrenja i otvorena pitanja jasno zabeleženi?', 'Da li je određeno ko i kada ponovo proverava status?', 'Može li sledeća smena nastaviti rad samo na osnovu zapisa, bez ponovnog pozivanja vozača ili klijenta?'],
    checkNoteTitle: 'Čemu služi ova lista',
    checkNote: 'Ona proverava kvalitet operativne primopredaje. Ako sledeća smena prvo mora da pozove kolegu, vozača ili klijenta samo da bi razumela slučaj, dokumentacija još nije potpuna.',
    faqTitle: 'Česta pitanja',
    faq: [
      ['Da li DaniniHub menja TMS?', 'Ne. DaniniHub dopunjuje postojeće sisteme strukturisanom komunikacijom, praćenjem statusa i dokumentovanom predajom.'],
      ['Da li je svakoj firmi potreban dodatni disponent?', 'Ne nužno. Često nije potrebna puna pozicija, već jasno ograničena podrška tokom opterećenja ili na višejezičkim relacijama.'],
      ['Može li AI potpuno preuzeti dispoziciju?', 'AI može strukturisati informacije, označiti praznine i pripremiti opcije. Odobrenja i obavezujuće odluke ostaju kod ljudi.'],
      ['Kada pilot ima smisla?', 'Kada postoji jasno ograničeno operativno usko grlo i rezultat može da se meri kroz nekoliko kriterijuma.'],
    ],
    categories: ['Za disponente', 'Za vozače', 'Zakoni i propisi', 'Promene pravila i novosti', 'Balkan–DACH praksa', 'DaniniHub standardi'],
    cta: 'Pokreni proveru pilota',
  },
}

const videoCopy = {
  de: {
    eyebrow: 'VIDEO · 03:09 MIN.',
    title: 'Wenn ein TMS allein nicht reicht',
    text: 'Das Video zeigt, wo Systemdaten enden und warum Faktenprüfung, Freigabe, Kommunikation und dokumentierte Übergabe weiterhin organisiert werden müssen.',
    language: 'Videosprache: Deutsch',
    load: 'YouTube-Video laden',
    loadLabel: 'Video von YouTube laden und abspielen',
    notice: 'Erst nach Ihrem Klick wird eine Verbindung zu YouTube hergestellt. Dabei können Daten an Google/YouTube übertragen und auf Ihrem Endgerät gespeichert werden.',
    activeNotice: 'YouTube ist für dieses Video aktiviert. Mit „Video deaktivieren“ wird die eingebettete Verbindung wieder beendet.',
    disable: 'Video deaktivieren',
    external: 'Direkt auf YouTube ansehen',
    privacy: 'Datenschutzhinweise',
  },
  sr: {
    eyebrow: 'VIDEO · 03:09 MIN.',
    title: 'Kada TMS sam nije dovoljan',
    text: 'Video pokazuje gde se završavaju sistemski podaci i zašto provera činjenica, odobrenje, komunikacija i dokumentovana predaja i dalje moraju biti organizovani.',
    language: 'Jezik videa: nemački',
    load: 'Učitaj YouTube video',
    loadLabel: 'Učitaj i pokreni video sa YouTube-a',
    notice: 'Veza sa YouTube-om uspostavlja se tek nakon vašeg klika. Tada podaci mogu biti prosleđeni Google-u/YouTube-u i sačuvani na vašem uređaju.',
    activeNotice: 'YouTube je aktiviran za ovaj video. Dugme „Isključi video“ ponovo prekida ugrađenu vezu.',
    disable: 'Isključi video',
    external: 'Pogledaj direktno na YouTube-u',
    privacy: 'Obaveštenje o privatnosti',
  },
}

function ArticleVideo({ lang }) {
  const [enabled, setEnabled] = useState(false)
  const t = videoCopy[lang]
  const sr = lang === 'sr'

  return <section className="article-video" aria-labelledby="article-video-title">
    <div className="article-video-copy">
      <span>{t.eyebrow}</span>
      <h2 id="article-video-title">{t.title}</h2>
      <p>{t.text}</p>
      <small>{t.language}</small>
    </div>
    <div className="privacy-video-shell">
      <div className="article-video-viewport">
        {enabled ? <iframe
          src="https://www.youtube-nocookie.com/embed/FTMCWxUGcig?autoplay=1&rel=0"
          title="Balkan–DACH Transport: Wenn TMS allein nicht reicht | DaniniHub"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        /> : <button className="video-consent-trigger" type="button" onClick={() => setEnabled(true)} aria-label={t.loadLabel}>
          <img src="/assets/daninihub-tms-video-poster.webp" alt="" width="1280" height="720" loading="lazy" />
          <span className="video-poster-shade" />
          <span className="video-play-label"><b aria-hidden="true">▶</b><strong>{t.load}</strong></span>
        </button>}
      </div>
      <div className="video-privacy-note">
        <p>{enabled ? t.activeNotice : t.notice}</p>
        <div>
          {enabled && <button type="button" onClick={() => setEnabled(false)}>{t.disable}</button>}
          <a href={sr ? '/sr/privatnost' : '/de/datenschutz'}>{t.privacy}</a>
          <a href="https://youtu.be/FTMCWxUGcig" target="_blank" rel="noreferrer">{t.external} ↗</a>
        </div>
      </div>
    </div>
  </section>
}

const editorial = {
  de: {
    eyebrow: 'PRAXIS & WISSEN · BALKAN–DACH', title: 'Operatives Wissen für Transportteams.',
    lead: 'Fachbeiträge, Checklisten und Praxisbeispiele über Status, ETA, Fahrerkommunikation, Eskalation und belastbare Schichtübergaben.',
    featured: 'Grundlagenartikel', read: 'Artikel lesen', more: 'Neu veröffentlicht', categories: 'Themenfelder', upcoming: 'In redaktioneller Vorbereitung',
    etaMeta: '9 Min. Lesezeit · ETA & Status',
    etaTitle: 'ETA ist keine Zusage: Transportstatus richtig kommunizieren',
    etaLead: 'Plantermin, operative ETA, bestätigten Kundentermin und nächsten Prüfpunkt sauber trennen – mit einer sofort nutzbaren 6-Bausteine-Formel.',
    topics: [['DISPOSITION','TMS & menschliche Entscheidung','Wo Systemdaten enden und operative Bewertung beginnt.'],['FAHRER','Balkan–DACH Kommunikation','Wie Status, Anweisungen und Abweichungen eindeutig bestätigt werden.'],['KONTINUITÄT','Spitzenlast & Übergabe','Wie definierte Unterstützung interne Engpässe abfedern kann.']],
    planned: ['Fahrerkommunikation Balkan–DACH: Wo Informationsfehler Kosten verursachen','Schichtübergabe in der Disposition: 10 Pflichtinformationen'],
  },
  sr: {
    eyebrow: 'PRAKSA I ZNANJE · BALKAN–DACH', title: 'Operativno znanje za transportne timove.',
    lead: 'Stručni članci, kontrolne liste i praktični primeri o statusu, ETA, komunikaciji sa vozačima, eskalaciji i pouzdanoj predaji smene.',
    featured: 'Osnovni stručni članak', read: 'Pročitaj članak', more: 'Novo objavljeno', categories: 'Tematske oblasti', upcoming: 'U uredničkoj pripremi',
    etaMeta: '9 min. čitanja · ETA i status',
    etaTitle: 'ETA nije obećanje: pravilna komunikacija statusa',
    etaLead: 'Jasno razdvojite planirani termin, operativnu ETA, termin potvrđen klijentu i sledeću proveru uz odmah primenljivu formulu od šest elemenata.',
    topics: [['DISPOZICIJA','TMS i ljudska odluka','Gde se završavaju sistemski podaci, a počinje operativna procena.'],['VOZAČI','Balkan–DACH komunikacija','Kako se status, instrukcije i odstupanja jasno potvrđuju.'],['KONTINUITET','Opterećenje i predaja','Kako ograničena podrška može da pokrije interni manjak kapaciteta.']],
    planned: ['Balkan–DACH komunikacija: gde greške stvaraju troškove','Predaja smene u dispoziciji: 10 obaveznih informacija'],
  },
}

function KnowledgeIndex({ lang }) {
  const t = copy[lang]
  const e = editorial[lang]
  return <main className="knowledge-page">
    <section className="knowledge-hero knowledge-index-hero"><div className="knowledge-eyebrow">{e.eyebrow}</div><h1>{e.title}</h1><p>{e.lead}</p></section>
    <section className="knowledge-article knowledge-index">
      <div className="knowledge-section-head"><span>01</span><h2>{e.featured}</h2></div>
      <article className="featured-article"><div><span>{t.meta}</span><h2>{t.title}</h2><p>{t.lead}</p><a href={tmsArticlePaths[lang]}>{e.read} →</a></div><aside><strong>{t.summaryTitle}</strong><p>{t.summary}</p></aside></article>
      <div className="knowledge-section-head section-space"><span>02</span><h2>{e.more}</h2></div>
      <article className="published-article-card">
        <div><span>{e.etaMeta}</span><h2>{e.etaTitle}</h2><p>{e.etaLead}</p></div>
        <a href={etaArticlePaths[lang]}>{e.read} →</a>
      </article>
      <div className="knowledge-section-head section-space"><span>03</span><h2>{e.categories}</h2></div>
      <div className="knowledge-category-grid">{e.topics.map(([tag,title,text])=><article key={tag}><span>{tag}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      <div className="knowledge-section-head section-space"><span>04</span><h2>{e.upcoming}</h2></div>
      <ol className="editorial-queue">{e.planned.map((title,index)=><li key={title}><span>{String(index+1).padStart(2,'0')}</span><strong>{title}</strong></li>)}</ol>
    </section>
  </main>
}

export default function KnowledgeCenter({ lang }) {
  const t = copy[lang]
  const sr = lang === 'sr'
  if (location.pathname === (sr ? '/sr/praksa-znanje' : '/de/praxis-wissen')) return <KnowledgeIndex lang={lang}/>
  if (location.pathname === etaArticlePaths[lang]) return <EtaArticle lang={lang}/>

  const videoStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'Balkan–DACH Transport: Wenn TMS allein nicht reicht | DaniniHub',
    description: 'Warum TMS-Daten allein operative Abweichungen nicht lösen und wie Faktenprüfung, Entscheidung, Kommunikation, Dokumentation und Recovery zusammenspielen.',
    thumbnailUrl: ['https://daninihub.com/assets/daninihub-tms-video-poster.webp'],
    uploadDate: '2026-07-18',
    duration: 'PT3M9S',
    inLanguage: 'de',
    embedUrl: 'https://www.youtube-nocookie.com/embed/FTMCWxUGcig',
    url: 'https://youtu.be/FTMCWxUGcig',
    isAccessibleForFree: true,
  }

  return (
    <main className="knowledge-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoStructuredData) }} />
      <section className="knowledge-hero">
        <a className="article-back" href={sr?'/sr/praksa-znanje':'/de/praxis-wissen'}>← {sr?'Praksa i znanje':'Praxis & Wissen'}</a>
        <div className="knowledge-eyebrow">{t.eyebrow}</div>
        <h1>{t.title}</h1>
        <p>{t.lead}</p>
        <div className="article-meta">{t.meta}</div>
        <div className="knowledge-categories">
          {t.categories.map((x, i) => (
            <span key={x} data-index={i}>{x}</span>
          ))}
        </div>
      </section>

      <article className="knowledge-article">
        <aside className="executive-summary">
          <strong>{t.summaryTitle}</strong>
          <p>{t.summary}</p>
        </aside>

        <ArticleVideo lang={lang} />

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
          <p className="checklist-intro">{t.checkIntro}</p>
          {t.checks.map((item) => (
            <label key={item}>
              <input type="checkbox" />
              <span>{item}</span>
            </label>
          ))}
          <div className="checklist-note">
            <strong>{t.checkNoteTitle}</strong>
            <p>{t.checkNote}</p>
          </div>
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

        <aside className="related-article-card">
          <span>{sr ? 'SLEDEĆI PRAKTIČNI ČLANAK' : 'NÄCHSTER PRAXISARTIKEL'}</span>
          <h2>{sr ? 'ETA nije obećanje: pravilna komunikacija statusa' : 'ETA ist keine Zusage: Transportstatus richtig kommunizieren'}</h2>
          <p>{sr ? 'Razdvojite planirani termin, operativnu ETA, termin potvrđen klijentu i sledeću proveru uz obrazac od šest elemenata.' : 'Trennen Sie Plantermin, operative ETA, bestätigten Kundentermin und nächsten Prüfpunkt mit einer vollständigen 6-Bausteine-Formel.'}</p>
          <a href={etaArticlePaths[lang]}>{sr ? 'Pročitaj sledeći članak' : 'Nächsten Artikel lesen'} →</a>
        </aside>

        <section className="article-cta">
          <span>PILOT FIRST</span>
          <h2>{sr ? 'Jasno ograničena podrška umesto nejasnog outsourcinga.' : 'Klar begrenzte Unterstützung statt unklarem Outsourcing.'}</h2>
          <a href={sr ? '/sr/provera-pilota' : '/de/pilot-check'}>{t.cta} →</a>
        </section>
      </article>
    </main>
  )
}
