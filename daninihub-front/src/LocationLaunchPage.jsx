import './LocationLaunchPage.css'

const content = {
  de: {
    eyebrow: 'DIGITAL LOCATION LAUNCH · MARKTTEST VOR INVESTITION',
    title: 'Standort-Nachfrage prüfen, bevor Geld in Ausbau und Technik fließt.',
    lead: 'DaniniHub macht aus einer ungenutzten Fläche einen messbaren Markttest: klare Positionierung, eigene Landingpage, strukturierte Interessenten und ein belastbarer Entscheidungsbericht.',
    cta: 'Standort unverbindlich prüfen',
    proof: ['Kein klassisches Immobilienmarketing', 'Keine erfundene Nachfrage', 'Ein klar begrenzter Pilot'],
    problemTitle: 'Die Fläche allein beweist noch kein Geschäft.',
    problemText: 'Eigentümer investieren oft zuerst in Ausbau, Ausstattung oder eine App und suchen erst danach Nutzer. Digital Location Launch dreht diese Reihenfolge um. Wir testen, wer die Fläche wirklich braucht, für welchen Zweck und unter welchen Bedingungen.',
    fitTitle: 'Geeignet für reale, lokal gebundene Angebote',
    fits: ['Private Parkflächen und Garagen', 'Ungenutzte Grundstücke mit Zwischen­nutzung', 'Firmenflächen und Stellplatzkontingente', 'Lokale Werbe- und Standortpartnerschaften'],
    processTitle: 'Vier Schritte vom Grundstück zum belegbaren Business Case',
    steps: [
      ['01', 'Angebot schärfen', 'Nutzung, Zielgruppen, Einzugsgebiet und der kleinste realistische Start werden festgelegt.'],
      ['02', 'Nachfrage erfassen', 'Eine lokale Landingpage trennt private Nutzer, Firmenkunden, Werbepartner und sonstige Anfragen.'],
      ['03', 'Markt direkt ansprechen', 'Relevante Firmen, Anwohner und Partner werden gezielt angesprochen; Suchmaschinen ergänzen den Test.'],
      ['04', 'Entscheidung dokumentieren', 'Interesse, Preissignale, Einwände und nächste Schritte werden zu einem nachvollziehbaren Bericht verdichtet.']
    ],
    deliverTitle: 'Was der Pilot tatsächlich liefert',
    delivers: ['Zweisprachige oder lokale Landingpage', 'Getrennte Kontaktwege nach Interessententyp', 'Lokale Suchstruktur und Indexierung', 'Direkte B2B-Ansprache im relevanten Umfeld', 'Auswertung von Interesse und Einwänden', 'Demand Validation Report mit Empfehlung'],
    caseTitle: 'Praxisfall: Čalije Parking in Niš',
    caseText: 'Auf zwei privaten Flächen wird die Nachfrage nach Monatsparken, Firmenkontingenten, Werbung und Partnerschaften erfasst, bevor über den Umfang der Investition entschieden wird. Das Projekt zeigt offen, wie aus einer realen Fläche verwertbare Marktdaten entstehen.',
    caseCta: 'Praxisprojekt ansehen',
    finalTitle: 'Sie haben eine Fläche, aber noch keine belastbare Nachfrage?',
    finalText: 'Beschreiben Sie Lage, heutige Nutzung und die geplante Idee. Sie erhalten einen Vorschlag für den kleinsten sinnvollen Test – nicht automatisch ein großes Paket.'
  },
  sr: {
    eyebrow: 'DIGITAL LOCATION LAUNCH · PROVERA TRŽIŠTA PRE ULAGANJA',
    title: 'Proverite potražnju za lokacijom pre ulaganja u uređenje i opremu.',
    lead: 'DaniniHub pretvara neiskorišćenu lokaciju u merljiv tržišni test: jasno pozicioniranje, posebna prodajna stranica, razvrstani zainteresovani i izveštaj za poslovnu odluku.',
    cta: 'Proverite lokaciju bez obaveze',
    proof: ['Nije klasično oglašavanje nekretnina', 'Bez izmišljene potražnje', 'Jasno ograničen pilot'],
    problemTitle: 'Sama parcela još nije dokaz da postoji posao.',
    problemText: 'Vlasnici često prvo ulože u uređenje, opremu ili aplikaciju, a tek zatim traže korisnike. Digital Location Launch menja redosled: prvo proveravamo kome je prostor stvarno potreban, za koju namenu i pod kojim uslovima.',
    fitTitle: 'Za realne ponude vezane za konkretnu lokaciju',
    fits: ['Privatni parking i garaže', 'Neiskorišćene parcele za privremenu namenu', 'Poslovne površine i paketi parking mesta', 'Lokalna reklama i partnerstva'],
    processTitle: 'Četiri koraka od parcele do argumentovanog poslovnog slučaja',
    steps: [
      ['01', 'Preciziramo ponudu', 'Određujemo namenu, ciljne grupe, zonu potražnje i najmanji realan početak.'],
      ['02', 'Merimo interesovanje', 'Lokalna stranica odvaja privatne korisnike, firme, oglašivače i druge upite.'],
      ['03', 'Direktno izlazimo na tržište', 'Ciljano kontaktiramo relevantne firme, stanare i partnere, dok pretraga dopunjuje test.'],
      ['04', 'Dokumentujemo odluku', 'Interesovanje, cenovni signali, primedbe i sledeći koraci ulaze u jasan izveštaj.']
    ],
    deliverTitle: 'Šta pilot stvarno isporučuje',
    delivers: ['Lokalna ili dvojezična prodajna stranica', 'Odvojeni upiti prema tipu interesenta', 'Lokalna SEO struktura i indeksiranje', 'Direktan B2B kontakt u relevantnom okruženju', 'Analiza interesovanja i prepreka', 'Demand Validation izveštaj sa preporukom'],
    caseTitle: 'Primer iz prakse: Čalije Parking u Nišu',
    caseText: 'Na dve privatne parcele prikuplja se interesovanje za mesečni parking, mesta za firme, reklame i partnerstva pre odluke o obimu ulaganja. Projekat javno pokazuje kako se od realne lokacije dolazi do upotrebljivih tržišnih podataka.',
    caseCta: 'Pogledajte projekat iz prakse',
    finalTitle: 'Imate lokaciju, ali još nemate dokazanu potražnju?',
    finalText: 'Opišite lokaciju, sadašnje stanje i ideju. Dobićete predlog najmanjeg smislenog testa, a ne automatski veliki paket.'
  }
}

export default function LocationLaunchPage({ lang }) {
  const t = content[lang]
  const contact = `mailto:info@daninihub.com?subject=${lang === 'sr' ? 'Provera%20trzista%20za%20lokaciju' : 'Markttest%20fuer%20einen%20Standort'}`
  const calije = lang === 'sr' ? 'https://calije.daninihub.com/sr' : 'https://calije.daninihub.com/de'

  return <main className="location-launch">
    <section className="location-hero">
      <div><p className="location-eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p className="location-lead">{t.lead}</p><a className="location-btn" href={contact}>{t.cta} →</a><div className="location-proof">{t.proof.map(item => <span key={item}>{item}</span>)}</div></div>
      <figure><img src="/assets/daninihub-business-operations.webp" width="1920" height="1080" alt={lang === 'sr' ? 'Operativni sto i jednostavan parking sa rizlom kao primer provere lokacije' : 'Operationsarbeitsplatz und einfacher Schotterparkplatz als Beispiel einer Standortvalidierung'}/><figcaption>{lang === 'sr' ? 'Operativa + stvarna lokacija + merljiva potražnja' : 'Operations + realer Standort + messbare Nachfrage'}</figcaption></figure>
    </section>

    <section className="location-section location-intro"><div><p className="location-eyebrow">{lang === 'sr' ? 'ZAŠTO PRVO TEST' : 'WARUM ZUERST TESTEN'}</p><h2>{t.problemTitle}</h2></div><p>{t.problemText}</p></section>

    <section className="location-section"><p className="location-eyebrow">{lang === 'sr' ? 'PRIMENA' : 'EINSATZ'}</p><h2>{t.fitTitle}</h2><div className="location-fit-grid">{t.fits.map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3></article>)}</div></section>

    <section className="location-section location-process"><p className="location-eyebrow">{lang === 'sr' ? 'METOD' : 'METHODE'}</p><h2>{t.processTitle}</h2><div>{t.steps.map(([number, title, text]) => <article key={number}><strong>{number}</strong><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className="location-section location-delivery"><div><p className="location-eyebrow">{lang === 'sr' ? 'REZULTAT' : 'ERGEBNIS'}</p><h2>{t.deliverTitle}</h2></div><ul>{t.delivers.map(item => <li key={item}>{item}</li>)}</ul></section>

    <section className="location-section location-case"><div><p className="location-eyebrow">CAL-01 · NIŠ</p><h2>{t.caseTitle}</h2><p>{t.caseText}</p><a href={calije} target="_blank" rel="noreferrer">{t.caseCta} ↗</a></div><div className="location-case-stamp"><small>{lang === 'sr' ? 'VLASNIK PARCELA' : 'EIGENTÜMER DER FLÄCHEN'}</small><strong>Dragan Zdravković</strong><span>{lang === 'sr' ? 'Prikupljanje interesovanja je aktivno' : 'Interessenerfassung ist aktiv'}</span></div></section>

    <section className="location-section location-final"><div><h2>{t.finalTitle}</h2><p>{t.finalText}</p></div><a className="location-btn" href={contact}>{t.cta} →</a></section>
  </main>
}
