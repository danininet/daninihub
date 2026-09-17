import './OpportunityMapPage.css'

const copy = {
  de: {
    eyebrow: 'DANINIHUB · VON EINEM REALEN PROBLEM ZUM MARKTTEST',
    title: 'Wir bauen einen kleinen, messbaren Weg zum ersten Kunden.',
    lead: 'Sie bringen ein reales Problem, vorhandenes Wissen, eine Fläche, eine Website oder eine Geschäftsidee mit. DaniniHub prüft die Nachfrage, formuliert ein verkaufbares Angebot und baut den kleinsten professionellen Test, bevor Sie unnötig Geld investieren.',
    primary: 'Fall kostenlos prüfen',
    whatsapp: 'Per WhatsApp besprechen',
    promise: 'Kein Kurs. Kein leeres PDF. Ein konkretes Ergebnis für Ihren Fall.',
    offerTitle: 'Was Sie tatsächlich kaufen können',
    offers: [
      {tag:'KOSTENLOS', title:'Erster Opportunity Check', price:'0 €', text:'Kurze Einschätzung, ob der Fall ein realistisches Problem, einen erreichbaren Käufer und einen sinnvollen nächsten Schritt hat.', items:['Ausgangslage und Ziel klären','größte Annahme erkennen','nächsten Prüfschritt festlegen'], action:'Fall einreichen', href:'/de/opportunity-check'},
      {tag:'ANALYSE', title:'Persönliche Opportunity Map', price:'149 €', text:'Keine Vorlage, sondern eine individuelle Analyse Ihres konkreten Falls mit Entscheidungsvorlage und 30-Tage-Plan.', items:['Markt- und Problemprüfung','drei realistische Erlöswege','klare Empfehlung mit Priorität','Angebot, Zielkunde und Preislogik','30-Tage-Aktionsplan'], action:'Analyse anfragen', whatsapp:true},
      {tag:'UMSETZUNG', title:'DaniniHub Markt-Pilot', price:'ab 590 €', text:'Wir setzen den kleinsten verkaufbaren Test um, damit echte Reaktionen statt Meinungen entscheiden.', items:['Angebot und Verkaufstext','Landingpage oder bestehende Seite','Kontaktweg und Anfrageformular','Google-/YouTube-/Social-Grundpaket','Messplan und Auswertung'], action:'Pilot besprechen', whatsapp:true}
    ],
    outputTitle:'Das Ergebnis ist kein „AI-Konzept“',
    outputText:'Am Ende steht ein veröffentlichter Test mit einem klaren Käufer, einem verständlichen Angebot, einem Preis, einem Kontaktweg und messbaren Signalen: Anfragen, Gespräche, Reservierungen oder Verkäufe.',
    processTitle:'So läuft die Zusammenarbeit',
    steps:[['01','Fall senden','Sie beschreiben Problem, Ressourcen, Ziel und Grenzen.'],['02','Machbarkeit prüfen','Wir prüfen Käufer, Nachfrage, Wettbewerb und den kleinsten sinnvollen Test.'],['03','Umfang bestätigen','Sie erhalten Ergebnis, Festpreis und Lieferumfang. Erst danach beginnt bezahlte Arbeit.'],['04','Pilot veröffentlichen','Wir bauen, veröffentlichen und messen den Test.']],
    proofTitle:'Der erste öffentliche Beweis: Čalije',
    proofText:'Eine eigene, ungenutzte Fläche in Niš wird nicht theoretisch „bewertet“. Angebot, Website, Video, lokale Nachfrage und Interessenten werden aufgebaut und öffentlich dokumentiert – vom Ausgangswert 0 € bis zum ersten nachweisbaren Umsatz.',
    proofCta:'Čalije Case ansehen',
    boundary:'DaniniHub garantiert keinen Umsatz. Wir garantieren einen klar vereinbarten, professionell umgesetzten Markttest und nachvollziehbare Messung.',
    finalTitle:'Haben Sie einen konkreten Fall?',
    finalText:'Senden Sie ihn kostenlos. Wenn wir keinen sinnvollen Test erkennen, empfehlen wir keinen bezahlten Auftrag.'
  },
  sr: {
    eyebrow: 'DANINIHUB · OD STVARNOG PROBLEMA DO TRŽIŠNOG TESTA',
    title: 'Pravimo mali, merljiv put do prvog kupca.',
    lead: 'Vi donosite stvarni problem, znanje, plac, postojeći sajt ili poslovnu ideju. DaniniHub proverava potražnju, oblikuje ponudu koja se može prodati i pravi najmanji profesionalni test pre nepotrebnog ulaganja novca.',
    primary: 'Besplatno proverite slučaj',
    whatsapp: 'Razgovor preko WhatsApp-a',
    promise: 'Nije kurs. Nije prazan PDF. Dobijate konkretan rezultat za svoj slučaj.',
    offerTitle: 'Šta zaista možete da kupite',
    offers: [
      {tag:'BESPLATNO', title:'Početni Opportunity Check', price:'0 €', text:'Kratka procena da li slučaj ima stvaran problem, dostupnog kupca i smislen sledeći korak.', items:['razjašnjavanje početnog stanja i cilja','otkrivanje najveće pretpostavke','određivanje prvog koraka provere'], action:'Pošaljite slučaj', href:'/sr/opportunity-check'},
      {tag:'ANALIZA', title:'Lična Opportunity Map', price:'149 €', text:'Ne dobijate šablon, već individualnu analizu svog slučaja, odluku šta prvo raditi i plan za 30 dana.', items:['provera tržišta i problema','tri realna puta do prihoda','jasna preporuka i prioritet','ponuda, ciljni kupac i logika cene','akcioni plan za 30 dana'], action:'Zatražite analizu', whatsapp:true},
      {tag:'REALIZACIJA', title:'DaniniHub tržišni pilot', price:'od 590 €', text:'Pravimo najmanji prodajni test kako bi stvarne reakcije tržišta odlučile da li posao treba razvijati.', items:['ponuda i prodajni tekst','landing stranica ili dorada sajta','kontakt i formular za upite','početni Google/YouTube/social paket','plan merenja i analiza rezultata'], action:'Dogovorite pilot', whatsapp:true}
    ],
    outputTitle:'Rezultat nije „AI koncept“',
    outputText:'Na kraju postoji objavljen test sa jasnim kupcem, razumljivom ponudom, cenom, kontaktom i merljivim signalima: upitima, razgovorima, rezervacijama ili prodajom.',
    processTitle:'Kako izgleda saradnja',
    steps:[['01','Pošaljete slučaj','Opišete problem, resurse, cilj i ograničenja.'],['02','Proveravamo izvodljivost','Proveravamo kupca, potražnju, konkurenciju i najmanji smislen test.'],['03','Potvrđujete obim','Dobijate rezultat, fiksnu cenu i tačno šta se isporučuje. Tek tada počinje plaćeni rad.'],['04','Objavljujemo pilot','Pravimo, objavljujemo i merimo test.']],
    proofTitle:'Prvi javni dokaz: Čalije',
    proofText:'Sopstveni neiskorišćeni plac u Nišu ne „analiziramo“ samo u teoriji. Gradimo ponudu, sajt, video, lokalnu potražnju i bazu zainteresovanih i javno pratimo put od 0 € do prvog dokazivog prihoda.',
    proofCta:'Pogledajte projekat Čalije',
    boundary:'DaniniHub ne garantuje zaradu. Garantujemo jasno ugovoren, profesionalno izveden tržišni test i razumljivo merenje rezultata.',
    finalTitle:'Imate konkretan slučaj?',
    finalText:'Pošaljite ga besplatno. Ako ne vidimo smislen test, nećemo vam preporučiti plaćenu uslugu.'
  }
}

export default function OpportunityMapPage({ lang }) {
  const t = copy[lang]
  const check = lang === 'sr' ? '/sr/opportunity-check' : '/de/opportunity-check'
  const calije = lang === 'sr' ? 'https://calije.daninihub.com/sr' : 'https://calije.daninihub.com/de'
  const message = lang === 'sr' ? 'Zdravo, želim da proverimo moj konkretan slučaj i mogućnost tržišnog pilota.' : 'Hallo, ich möchte meinen konkreten Fall und einen möglichen Marktpiloten prüfen.'
  const whatsapp = `https://wa.me/4915730916621?text=${encodeURIComponent(message)}`

  return <main className="opmap">
    <section className="opmap-hero">
      <div>
        <p className="kicker">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="opmap-lead">{t.lead}</p>
        <p className="opmap-note"><strong>{t.promise}</strong></p>
        <div className="opmap-actions">
          <a className="btn" href={check}>{t.primary} →</a>
          <a className="opmap-link" href={whatsapp} target="_blank" rel="noreferrer">{t.whatsapp}</a>
        </div>
      </div>
      <div className="opmap-cover"><small>PROBLEM</small><b>+ MARKET</b><strong>+ PILOT</strong><h2>DaniniHub</h2><p>SR · DE</p></div>
    </section>

    <section className="opmap-process">
      <h2>{t.offerTitle}</h2>
      <div>{t.offers.map(offer => <article key={offer.title}>
        <span>{offer.tag}</span>
        <h3>{offer.title}</h3>
        <div className="opmap-price">{offer.price}</div>
        <p>{offer.text}</p>
        <ul>{offer.items.map(item => <li key={item}>{item}</li>)}</ul>
        <a className="opmap-link" href={offer.whatsapp ? whatsapp : offer.href} target={offer.whatsapp ? '_blank' : undefined} rel={offer.whatsapp ? 'noreferrer' : undefined}>{offer.action} →</a>
      </article>)}</div>
    </section>

    <section className="opmap-grid">
      <article><h2>{t.outputTitle}</h2><p>{t.outputText}</p><div className="opmap-boundary"><p>{t.boundary}</p></div></article>
      <article><h2>{t.proofTitle}</h2><p>{t.proofText}</p><a className="opmap-link" href={calije} target="_blank" rel="noreferrer">{t.proofCta} →</a></article>
    </section>

    <section className="opmap-process"><h2>{t.processTitle}</h2><div>{t.steps.map(([n,title,text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className="opmap-final">
      <h2>{t.finalTitle}</h2><p>{t.finalText}</p>
      <div className="opmap-actions"><a className="btn" href={check}>{t.primary} →</a><a className="opmap-link" href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></div>
    </section>
  </main>
}
