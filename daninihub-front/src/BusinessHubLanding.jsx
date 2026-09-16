import './BusinessHubLanding.css'

const copy = {
  de: {
    eyebrow: 'DANINIHUB · BUSINESS & OPERATIONS · DUISBURG / NIŠ',
    title: 'Aus realen Engpässen entstehen klare, verkaufbare Lösungen.',
    lead: 'DaniniHub verbindet operative DACH–Balkan-Unterstützung, digitale Marktvalidierung und eigene Standortprojekte. Wir entwickeln keine Konzepte für die Schublade – wir prüfen Nachfrage, strukturieren Abläufe und führen Interessenten zum nächsten konkreten Schritt.',
    primary: 'Geschäftsbereiche ansehen',
    secondary: 'Projekt besprechen',
    proof: ['Eigene Projekte als Praxisnachweis', 'DACH ↔ Balkan Erfahrung', 'Mensch entscheidet, KI unterstützt'],
    systemEyebrow: 'EIN SYSTEM · DREI GESCHÄFTSBEREICHE',
    systemTitle: 'DaniniHub baut Geschäft dort, wo operative Erfahrung auf überprüfbare Nachfrage trifft.',
    pillars: [
      { code: '01', tag: 'B2B SERVICE', title: 'DACH–Balkan Operations', text: 'Externe Dispositionsunterstützung, Fahrerkommunikation, Status, ETA, Dokumente und klare Übergaben für Transportteams.', action: 'Operations-Angebot öffnen', href: '/de/externe-disposition', accent: 'cyan' },
      { code: '02', tag: 'DIGITALER MARKTTEST', title: 'Digital Location Launch', text: 'Standorte und ungenutzte Flächen werden vor größeren Investitionen digital positioniert, mit Interessenten validiert und als belastbarer Business Case dokumentiert.', action: 'Methode und Angebot ansehen', href: '/de/location-launch', accent: 'amber' },
      { code: '03', tag: 'EIGENES PROJEKT', title: 'Čalije Parking · Niš', text: 'Unser eigenes Standortprojekt auf zwei privaten Grundstücksflächen: Nachfrage nach Monatsparkplätzen, Firmenkontingenten, Werbung und Partnerschaften wird bereits digital erfasst.', action: 'Čalije Parking ansehen', href: 'https://calije.daninihub.com/de', accent: 'lime', external: true }
    ],
    modelEyebrow: 'DAS DANINIHUB-MODELL',
    modelTitle: 'Nicht zuerst investieren. Zuerst das Problem, die Nachfrage und den nächsten zahlenden Schritt klären.',
    steps: [
      ['01', 'Engpass erkennen', 'Wir beginnen mit einem realen operativen oder lokalen Problem – nicht mit einer erfundenen Produktidee.'],
      ['02', 'Nachfrage sichtbar machen', 'Landingpage, direkte Ansprache und strukturierte Formulare zeigen, wer wirklich Interesse hat und wofür.'],
      ['03', 'Kleinen Pilot verkaufen', 'Ein klar begrenzter Pilot liefert schneller Beweise, Referenzen und Umsatz als ein großes, unfertiges System.'],
      ['04', 'Wiederholbar machen', 'Erst nach der Validierung werden Ablauf, Angebot und digitale Werkzeuge zu einem skalierbaren Produkt.']
    ],
    caseEyebrow: 'EIGENER PRAXISFALL',
    caseTitle: 'Čalije Parking ist mehr als eine Unterseite. Es ist der erste Beweis für Digital Location Launch.',
    caseText: 'Dragan Zdravković ist Eigentümer der Flächen hinter dem Projekt. Dadurch kann DaniniHub den vollständigen Weg öffentlich und nachvollziehbar erproben: von Standort und Nachfrage über Interessenten und Firmenpartner bis zur wirtschaftlichen Entscheidung über die Umsetzung.',
    caseItems: ['Monatsparken für Privatpersonen', 'Kontingente für Firmenfahrzeuge', 'Werbe- und Standortpartnerschaften', 'Datengrundlage für Ausbau und Finanzierung'],
    caseCta: 'Zum Projekt Čalije Parking',
    audienceEyebrow: 'WOMIT KÖNNEN WIR HELFEN?',
    audienceTitle: 'Ein Einstieg pro konkretem Ziel.',
    audiences: [
      ['Transportfirma', 'Sie brauchen Entlastung bei Fahrerkommunikation, Status, ETA oder Dokumenten.', '/de/balkan-desk', 'Balkan Desk prüfen'],
      ['Eigentümer einer Fläche', 'Sie möchten Nachfrage und Erlösmodell prüfen, bevor Sie größer investieren.', '/de/location-launch', 'Methode und Angebot ansehen'],
      ['Firma in Niš', 'Sie benötigen planbare Stellplätze oder möchten als lokaler Partner sichtbar werden.', 'https://calije.daninihub.com/de', 'Čalije-Angebot ansehen']
    ],
    founderEyebrow: 'VERANTWORTLICH',
    founderTitle: 'Dragan Zdravković',
    founderText: 'Initiator von DaniniHub, operativer Ansprechpartner in Duisburg und Eigentümer der Flächen des Projekts Čalije Parking in Niš. DaniniHub verbindet praktische Transporterfahrung, digitale Vermarktung und KI-gestützte Analyse – Entscheidungen und Verantwortung bleiben beim Menschen.',
    contactEyebrow: 'NÄCHSTER SCHRITT',
    contactTitle: 'Welches konkrete Problem soll zuerst Umsatz erzeugen?',
    contactText: 'Schreiben Sie kurz, ob es um Transport Operations, die Validierung eines Standorts oder eine Zusammenarbeit rund um Čalije Parking geht. Sie erhalten keine allgemeine Präsentation, sondern einen Vorschlag für den kleinsten sinnvollen Pilot.',
    contactCta: 'Projekt kurz beschreiben'
  },
  sr: {
    eyebrow: 'DANINIHUB · BIZNIS I OPERATIVA · DUISBURG / NIŠ',
    title: 'Od stvarnih problema pravimo jasna i prodajna rešenja.',
    lead: 'DaniniHub povezuje operativnu DACH–Balkan podršku, digitalnu proveru tržišta i sopstvene lokacijske projekte. Ne pravimo planove za fioku – proveravamo potražnju, uređujemo proces i vodimo zainteresovane do sledećeg konkretnog koraka.',
    primary: 'Pogledajte poslovne oblasti',
    secondary: 'Predložite projekat',
    proof: ['Sopstveni projekti kao dokaz', 'DACH ↔ Balkan iskustvo', 'Čovek odlučuje, AI podržava'],
    systemEyebrow: 'JEDAN SISTEM · TRI POSLOVNE OBLASTI',
    systemTitle: 'DaniniHub razvija posao tamo gde se praktično iskustvo susreće sa merljivom potražnjom.',
    pillars: [
      { code: '01', tag: 'B2B USLUGA', title: 'DACH–Balkan Operations', text: 'Eksterna podrška dispoziciji, komunikacija sa vozačima, status, ETA, dokumentacija i jasna predaja za transportne timove.', action: 'Pogledajte operativnu ponudu', href: '/sr/eksterna-dispozicija', accent: 'cyan' },
      { code: '02', tag: 'DIGITALNA PROVERA TRŽIŠTA', title: 'Digital Location Launch', text: 'Lokaciju ili neiskorišćen prostor prvo pozicioniramo online, proveravamo interesovanje i pretvaramo rezultate u argumentovan poslovni slučaj.', action: 'Pogledajte metod i ponudu', href: '/sr/location-launch', accent: 'amber' },
      { code: '03', tag: 'SOPSTVENI PROJEKAT', title: 'Čalije Parking · Niš', text: 'Naš projekat na dve privatne parcele: već se prikuplja interesovanje za mesečna mesta, poslovna vozila, oglašavanje i lokalna partnerstva.', action: 'Pogledajte Čalije Parking', href: 'https://calije.daninihub.com/sr', accent: 'lime', external: true }
    ],
    modelEyebrow: 'DANINIHUB MODEL',
    modelTitle: 'Ne ulažemo prvo veliki novac. Prvo razjasnimo problem, potražnju i sledeći korak koji neko želi da plati.',
    steps: [
      ['01', 'Prepoznajemo usko grlo', 'Počinjemo od stvarnog operativnog ili lokalnog problema, a ne od izmišljene ideje za proizvod.'],
      ['02', 'Potražnju činimo vidljivom', 'Prodajna stranica, direktan kontakt i strukturisani formulari pokazuju ko je zainteresovan i za šta.'],
      ['03', 'Prodajemo mali pilot', 'Jasno ograničen pilot brže donosi dokaz, preporuku i prihod nego veliki nedovršen sistem.'],
      ['04', 'Pretvaramo ga u sistem', 'Tek nakon potvrde tržišta standardizujemo ponudu, proces i digitalne alate za ponovljivu prodaju.']
    ],
    caseEyebrow: 'SOPSTVENI PRIMER IZ PRAKSE',
    caseTitle: 'Čalije Parking nije samo poddomen. To je prvi dokaz kako radi Digital Location Launch.',
    caseText: 'Dragan Zdravković je vlasnik parcela obuhvaćenih projektom. Zato DaniniHub može javno i proverljivo da testira ceo put: od lokacije i interesovanja, preko privatnih korisnika i firmi, do ekonomske odluke o uređenju i razvoju.',
    caseItems: ['Mesečni parking za privatne korisnike', 'Paketi mesta za službena vozila', 'Reklamni i lokacijski partneri', 'Podaci za ulaganje i finansiranje'],
    caseCta: 'Otvorite projekat Čalije Parking',
    audienceEyebrow: 'GDE MOŽEMO DA POMOGNEMO?',
    audienceTitle: 'Jedan jasan ulaz za svaki konkretan cilj.',
    audiences: [
      ['Transportna firma', 'Treba vam rasterećenje za komunikaciju sa vozačima, status, ETA ili dokumentaciju.', '/sr/balkan-desk', 'Proverite Balkan Desk'],
      ['Vlasnik placa ili lokacije', 'Želite da proverite potražnju i model prihoda pre većeg ulaganja.', '/sr/location-launch', 'Pogledajte metod i ponudu'],
      ['Firma ili korisnik u Nišu', 'Potrebna su vam planirana parking mesta ili želite lokalno partnerstvo.', 'https://calije.daninihub.com/sr', 'Pogledajte Čalije ponudu']
    ],
    founderEyebrow: 'ODGOVORNO LICE',
    founderTitle: 'Dragan Zdravković',
    founderText: 'Osnivač DaniniHuba, operativni kontakt u Duisburgu i vlasnik parcela projekta Čalije Parking u Nišu. DaniniHub spaja praktično iskustvo u transportu, digitalni marketing i AI analizu – ali odluke i odgovornost ostaju kod čoveka.',
    contactEyebrow: 'SLEDEĆI KORAK',
    contactTitle: 'Koji konkretan problem prvo treba da pretvorimo u prihod?',
    contactText: 'Napišite ukratko da li se radi o transportnoj operativi, proveri tržišta za lokaciju ili saradnji oko Čalije Parkinga. Ne šaljemo generičku prezentaciju, već predlog najmanjeg smislenog pilota.',
    contactCta: 'Ukratko opišite projekat'
  }
}

export default function BusinessHubLanding({ lang }) {
  const t = copy[lang]
  const calije = lang === 'sr' ? 'https://calije.daninihub.com/sr' : 'https://calije.daninihub.com/de'
  const contact = `mailto:info@daninihub.com?subject=${lang === 'sr' ? 'DaniniHub%20biznis%20upit' : 'DaniniHub%20Business-Anfrage'}`
  const locationLaunch = lang === 'sr' ? '/sr/location-launch' : '/de/location-launch'

  return <main className="business-hub" id="top">
    <section className="hub-hero">
      <div className="hub-hero-copy">
        <p className="hub-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="hub-lead">{t.lead}</p>
        <div className="hub-actions"><a className="hub-btn hub-btn-primary" href="#business-system">{t.primary}</a><a className="hub-btn hub-btn-quiet" href={contact}>{t.secondary}</a></div>
        <div className="hub-proof">{t.proof.map(item => <span key={item}>{item}</span>)}</div>
      </div>
      <div className="hub-map" aria-label={lang === 'sr' ? 'DaniniHub poslovni sistem' : 'DaniniHub Geschäftssystem'}>
        <div className="hub-map-core"><small>DANINI</small><strong>HUB</strong><span>Business Engine</span></div>
        <a className="hub-orbit orbit-one" href={lang === 'sr' ? '/sr/eksterna-dispozicija' : '/de/externe-disposition'}><b>01</b><span>OPERATIONS</span></a>
        <a className="hub-orbit orbit-two" href={locationLaunch}><b>02</b><span>LOCATION</span></a>
        <a className="hub-orbit orbit-three" href={calije}><b>03</b><span>ČALIJE</span></a>
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
      <div className="hub-case-card"><div className="hub-case-card-top"><span>CAL-01</span><strong>NIŠ · ČALIJE</strong></div><div className="hub-case-status"><i></i><span>{lang === 'sr' ? 'PRIKUPLJANJE INTERESOVANJA' : 'INTERESSE WIRD ERFASST'}</span></div><ul>{t.caseItems.map(item => <li key={item}>{item}</li>)}</ul><div className="hub-case-owner"><small>{lang === 'sr' ? 'VLASNIK / ODGOVORNO LICE' : 'EIGENTÜMER / VERANTWORTLICH'}</small><strong>Dragan Zdravković</strong></div></div>
    </section>

    <section className="hub-section">
      <p className="hub-eyebrow">{t.audienceEyebrow}</p><h2>{t.audienceTitle}</h2>
      <div className="hub-audience-grid">{t.audiences.map(([title, text, href, label]) => <article key={title}><h3>{title}</h3><p>{text}</p><a href={href}>{label} →</a></article>)}</div>
    </section>

    <section className="hub-section hub-founder"><div><p className="hub-eyebrow">{t.founderEyebrow}</p><h2>{t.founderTitle}</h2></div><p>{t.founderText}</p></section>

    <section className="hub-section hub-contact"><div><p className="hub-eyebrow">{t.contactEyebrow}</p><h2>{t.contactTitle}</h2><p>{t.contactText}</p></div><a className="hub-btn hub-btn-primary" href={contact}>{t.contactCta} →</a></section>
  </main>
}
