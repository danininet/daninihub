import './BusinessHubLanding.css'

const copy = {
  de: {
    eyebrow: 'DANINIHUB · HUMAN + AI OPPORTUNITY ENGINE',
    title: 'Von Ihrem realen Problem zum ersten messbaren Markttest.',
    lead: 'DaniniHub prüft eine konkrete Geschäftsidee, Fähigkeit, Website, Fläche oder ein Firmenproblem. Sie erhalten kein allgemeines KI-Gerede, sondern ein klares Angebot, einen erreichbaren Käufer und auf Wunsch einen veröffentlichten Pilot.',
    primary: 'Angebot und Preise ansehen',
    secondary: 'Fall kostenlos prüfen',
    proof: ['Kostenlose Erstprüfung', 'Persönliche Analyse · 149 €', 'Umgesetzter Marktpilot · ab 590 €'],
    systemEyebrow: 'DREI KLARE STUFEN',
    systemTitle: 'Erst kostenlos prüfen. Dann gezielt analysieren. Nur sinnvolle Fälle werden umgesetzt.',
    pillars: [
      { code: '01', tag: 'KOSTENLOS · 0 €', title: 'Opportunity Check', text: 'Wir prüfen kurz, ob Ihr Fall einen realen Käufer, ein bezahltes Problem und einen sinnvollen nächsten Schritt hat.', action: 'Fall kostenlos senden', href: '/de/opportunity-check', accent: 'cyan' },
      { code: '02', tag: 'PERSÖNLICHE ANALYSE · 149 €', title: 'Opportunity Map für Ihren Fall', text: 'Marktprüfung, drei Erlöswege, klare Empfehlung, Preislogik und ein konkreter 30-Tage-Plan.', action: 'Leistung ansehen', href: '/de/opportunity-map', accent: 'amber' },
      { code: '03', tag: 'UMSETZUNG · AB 590 €', title: 'DaniniHub Markt-Pilot', text: 'Wir bauen Angebot, Landingpage, Kontaktweg und erstes Vertriebspaket und messen echte Marktreaktionen.', action: 'Pilot und Lieferumfang ansehen', href: '/de/opportunity-map', accent: 'lime' }
    ],
    modelEyebrow: 'DIE DANINIHUB-METHODE',
    modelTitle: 'Nicht zuerst ein Produkt bauen. Zuerst vorhandene Ressourcen, ein echtes Problem und den kleinsten zahlenden Schritt finden.',
    steps: [
      ['01', 'Inventar statt Wunschdenken', 'Was kann die Person oder Firma bereits: Erfahrung, Fähigkeiten, Zeit, Besitz, Beziehungen, Daten, Prozesse?'],
      ['02', 'Problem und Käufer finden', 'Wir suchen nicht nach 50 Ideen, sondern nach wenigen Problemen, für deren Lösung heute bereits Geld ausgegeben wird.'],
      ['03', 'Kleinen Markttest bauen', 'Landingpage, direkte Ansprache, Angebot oder Pilot prüfen Nachfrage, bevor viel Geld und Zeit investiert werden.'],
      ['04', 'Ergebnis messen und wiederholen', 'Kontakt, Anfrage, Kauf, Zeitersparnis oder messbarer Nutzen entscheiden, ob die Richtung ausgebaut oder verworfen wird.']
    ],
    caseEyebrow: 'ERSTER ÖFFENTLICHER PRAXISFALL',
    caseTitle: 'Čalije zeigt die Methode an echtem Eigentum – nicht an einer erfundenen Online-Challenge.',
    caseText: 'Dragan Zdravković nutzt die eigene Fläche in Niš als nachvollziehbaren Test: Welche Nutzung erzeugt Nachfrage? Was kostet der kleinste Start? Wie viele Interessenten kommen über Website, lokale Ansprache und Video? Welche Variante erzeugt tatsächlich Umsatz?',
    caseItems: ['Monatsparken und Firmenkontingente testen', 'Werbe- und Standortpartnerschaften prüfen', 'Investition erst nach messbarer Nachfrage', 'Ergebnisse als öffentlicher DaniniNet Case dokumentieren'],
    caseCta: 'Zum Čalije Projekt',
    audienceEyebrow: 'WELCHER EINSTIEG PASST?',
    audienceTitle: 'Nicht jeder muss online Geld verdienen. Jeder Fall beginnt mit dem, was real vorhanden ist.',
    audiences: [
      ['Ich suche meinen Weg', 'Ich habe Erfahrung oder Ressourcen, weiß aber nicht, welches Angebot und welcher Markt realistisch sind.', '/de/opportunity-map', 'Opportunity Map starten'],
      ['Wir haben ein Firmenproblem', 'Uns fehlt Kapazität, Kompetenz, ein besserer Ablauf oder eine sinnvolle KI-Unterstützung.', 'mailto:info@daninihub.com?subject=DaniniHub%20Firmenproblem', 'Problem beschreiben'],
      ['Ich besitze eine Fläche / Ressource', 'Ich möchte Nachfrage und Erlösmodell prüfen, bevor ich größer investiere.', '/de/location-launch', 'Markttest ansehen']
    ],
    founderEyebrow: 'INITIATOR UND ERSTER TESTFALL',
    founderTitle: 'Dragan Zdravković',
    founderText: 'Nach Jahren mit verschiedenen Online- und Offline-Ideen wird DaniniHub bewusst anders aufgebaut: weniger Theorie, weniger Guru-Stil, mehr reale Tests. Eigene Projekte, eigene Ressourcen und echte Marktreaktionen werden zum Lernmaterial für andere.',
    contactEyebrow: 'NÄCHSTER SCHRITT',
    contactTitle: 'Welches reale Problem oder welche ungenutzte Ressource sollen wir zuerst prüfen?',
    contactText: 'Beschreiben Sie kurz Person, Firma, Fähigkeit, Fläche oder Problem. Der erste Vorschlag soll kein großes Projekt sein, sondern der kleinste sinnvolle Test, der echte Marktreaktion erzeugen kann.',
    contactCta: 'Fall beschreiben'
  },
  sr: {
    eyebrow: 'DANINIHUB · HUMAN + AI OPPORTUNITY ENGINE',
    title: 'Od vašeg stvarnog problema do prvog merljivog tržišnog testa.',
    lead: 'DaniniHub proverava konkretnu poslovnu ideju, znanje, sajt, plac ili problem firme. Ne dobijate opštu AI priču, već jasnu ponudu, dostupnog kupca i, kada ima smisla, objavljen tržišni pilot.',
    primary: 'Pogledajte ponudu i cene',
    secondary: 'Besplatno proverite slučaj',
    proof: ['Besplatna početna provera', 'Lična analiza · 149 €', 'Izveden tržišni pilot · od 590 €'],
    systemEyebrow: 'TRI JASNA KORAKA',
    systemTitle: 'Prvo besplatno proveravamo. Zatim analiziramo. Realizujemo samo slučajeve koji imaju smisla.',
    pillars: [
      { code: '01', tag: 'BESPLATNO · 0 €', title: 'Opportunity Check', text: 'Kratko proveravamo da li vaš slučaj ima stvarnog kupca, plaćeni problem i smislen sledeći korak.', action: 'Pošaljite slučaj', href: '/sr/opportunity-check', accent: 'cyan' },
      { code: '02', tag: 'LIČNA ANALIZA · 149 €', title: 'Opportunity Map za vaš slučaj', text: 'Provera tržišta, tri puta do prihoda, jasna preporuka, logika cene i akcioni plan za 30 dana.', action: 'Pogledajte isporuku', href: '/sr/opportunity-map', accent: 'amber' },
      { code: '03', tag: 'REALIZACIJA · OD 590 €', title: 'DaniniHub tržišni pilot', text: 'Pravimo ponudu, landing stranicu, kontakt i početni prodajni paket i merimo stvarne reakcije tržišta.', action: 'Pogledajte pilot i isporuku', href: '/sr/opportunity-map', accent: 'lime' }
    ],
    modelEyebrow: 'DANINIHUB METOD',
    modelTitle: 'Ne pravimo prvo proizvod. Prvo nalazimo ono što već postoji, stvarni problem i najmanji korak za koji je neko spreman da plati.',
    steps: [
      ['01', 'Inventar umesto maštanja', 'Šta osoba ili firma već ima: iskustvo, znanje, vreme, imovinu, kontakte, podatke, procese?'],
      ['02', 'Problem i kupac', 'Ne tražimo 50 ideja. Tražimo nekoliko problema za čije rešavanje tržište već izdvaja novac.'],
      ['03', 'Mali tržišni test', 'Landing stranica, direktan kontakt, ponuda ili pilot proveravaju interesovanje pre većeg ulaganja novca i vremena.'],
      ['04', 'Merimo i ponavljamo', 'Kontakt, upit, kupovina, ušteda vremena ili druga merljiva korist odlučuju da li pravac razvijamo ili odbacujemo.']
    ],
    caseEyebrow: 'PRVI JAVNI PRAKTIČNI SLUČAJ',
    caseTitle: 'Čalije pokazuje metod na stvarnoj imovini – ne na izmišljenom online izazovu.',
    caseText: 'Dragan Zdravković koristi sopstvenu parcelu u Nišu kao proverljiv test: koja namena stvara tražnju, koliko košta minimalni početak, koliko interesenata dolazi preko sajta, lokalnog kontakta i videa i koja varijanta zaista pravi prihod.',
    caseItems: ['Test mesečnog parkinga i poslovnih paketa', 'Provera reklamnih i lokacijskih partnerstava', 'Ulaganje tek posle merljive potražnje', 'Rezultati kao javni DaniniNet case study'],
    caseCta: 'Otvorite projekat Čalije',
    audienceEyebrow: 'ODAKLE VI KREĆETE?',
    audienceTitle: 'Ne mora svako da zarađuje online. Svaki slučaj kreće od onoga što realno postoji.',
    audiences: [
      ['Tražim svoj pravac', 'Imam iskustvo ili resurse, ali ne znam koja ponuda i koje tržište su realni.', '/sr/opportunity-map', 'Pokrenite Opportunity Map'],
      ['Imamo problem u firmi', 'Nedostaje nam kapacitet, veština, bolji proces ili smislena AI podrška.', 'mailto:info@daninihub.com?subject=DaniniHub%20problem%20firme', 'Opišite problem'],
      ['Imam plac ili drugi resurs', 'Želim da proverim potražnju i model prihoda pre većeg ulaganja.', '/sr/location-launch', 'Pogledajte tržišni test']
    ],
    founderEyebrow: 'INICIJATOR I PRVI TEST SLUČAJ',
    founderTitle: 'Dragan Zdravković',
    founderText: 'Posle godina različitih online i offline ideja, DaniniHub se namerno gradi drugačije: manje teorije i guru stila, više stvarnih testova. Sopstveni projekti, resursi i reakcije tržišta postaju materijal iz kojeg drugi mogu da uče.',
    contactEyebrow: 'SLEDEĆI KORAK',
    contactTitle: 'Koji stvarni problem ili neiskorišćen resurs prvo proveravamo?',
    contactText: 'Ukratko opišite osobu, firmu, veštinu, plac ili problem. Prvi predlog neće biti veliki projekat, već najmanji smislen test koji može da proizvede stvarnu reakciju tržišta.',
    contactCta: 'Opišite slučaj'
  }
}

export default function BusinessHubLanding({ lang }) {
  const t = copy[lang]
  const calije = lang === 'sr' ? 'https://calije.daninihub.com/sr' : 'https://calije.daninihub.com/de'
  const contact = lang === 'sr' ? '/sr/opportunity-check' : '/de/opportunity-check'

  return <main className="business-hub" id="top">
    <section className="hub-hero">
      <div className="hub-hero-copy">
        <p className="hub-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="hub-lead">{t.lead}</p>
        <div className="hub-actions"><a className="hub-btn hub-btn-primary" href="#business-system">{t.primary}</a><a className="hub-btn hub-btn-quiet" href={contact}>{t.secondary}</a></div>
        <div className="hub-proof">{t.proof.map(item => <span key={item}>{item}</span>)}</div>
      </div>
      <div className="hub-map" aria-label={lang === 'sr' ? 'DaniniHub sistem mogućnosti' : 'DaniniHub Opportunity System'}>
        <div className="hub-map-core"><small>DANINI</small><strong>HUB</strong><span>Opportunity Engine</span></div>
        <a className="hub-orbit orbit-one" href={lang === 'sr' ? '/sr/opportunity-map' : '/de/opportunity-map'}><b>01</b><span>PEOPLE</span></a>
        <a className="hub-orbit orbit-two" href={contact}><b>02</b><span>COMPANIES</span></a>
        <a className="hub-orbit orbit-three" href={calije}><b>03</b><span>CASES</span></a>
      </div>
    </section>

    <section className="hub-section" id="business-system">
      <p className="hub-eyebrow">{t.systemEyebrow}</p><h2>{t.systemTitle}</h2>
      <div className="hub-pillar-grid">{t.pillars.map(p => <article className={`hub-pillar hub-${p.accent}`} key={p.code}><div><span className="hub-code">{p.code}</span><span className="hub-tag">{p.tag}</span></div><h3>{p.title}</h3><p>{p.text}</p><a href={p.href} target={p.external ? '_blank' : undefined} rel={p.external ? 'noreferrer' : undefined}>{p.action} <span>↗</span></a></article>)}</div>
    </section>

    <section className="hub-section hub-model">
      <div className="hub-model-intro"><p className="hub-eyebrow">{t.modelEyebrow}</p><h2>{t.modelTitle}</h2></div>
      <div className="hub-step-list">{t.steps.map(([number, title, text]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
    </section>

    <section className="hub-section hub-case">
      <div className="hub-case-copy"><p className="hub-eyebrow">{t.caseEyebrow}</p><h2>{t.caseTitle}</h2><p>{t.caseText}</p><a className="hub-btn hub-btn-primary" href={calije} target="_blank" rel="noreferrer">{t.caseCta} ↗</a></div>
      <div className="hub-case-card"><div className="hub-case-card-top"><span>CASE-01</span><strong>NIŠ · ČALIJE</strong></div><div className="hub-case-status"><i></i><span>{lang === 'sr' ? 'TRŽIŠNI TEST U TOKU' : 'MARKTTEST LÄUFT'}</span></div><ul>{t.caseItems.map(item => <li key={item}>{item}</li>)}</ul><div className="hub-case-owner"><small>{lang === 'sr' ? 'VLASNIK / ODGOVORNO LICE' : 'EIGENTÜMER / VERANTWORTLICH'}</small><strong>Dragan Zdravković</strong></div></div>
    </section>

    <section className="hub-section">
      <p className="hub-eyebrow">{t.audienceEyebrow}</p><h2>{t.audienceTitle}</h2>
      <div className="hub-audience-grid">{t.audiences.map(([title, text, href, label]) => <article key={title}><h3>{title}</h3><p>{text}</p><a href={href}>{label} →</a></article>)}</div>
    </section>

    <section className="hub-section hub-founder"><div><p className="hub-eyebrow">{t.founderEyebrow}</p><h2>{t.founderTitle}</h2></div><p>{t.founderText}</p></section>

    <section className="hub-section hub-contact"><div><p className="hub-eyebrow">{t.contactEyebrow}</p><h2>{t.contactTitle}</h2><p>{t.contactText}</p></div><a className="hub-btn hub-btn-primary" href={contact}>{t.contactCta} →</a></section>
  </main>
}
