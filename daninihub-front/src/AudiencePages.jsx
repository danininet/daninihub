import './AudiencePages.css'

const content = {
  de: {
    kicker:'FÜR DACH-SPEDITIONEN UND TRANSPORTUNTERNEHMEN',
    title:'Balkan-Partner besser steuern, ohne Ihr TMS oder Ihre Disposition zu ersetzen.',
    lead:'DaniniHub schafft einen gemeinsamen operativen Arbeitsraum für DACH-Auftraggeber und Balkan-Frachtführer. Status, ETA, offene Punkte, Dokumente, Incidents und Freigaben bleiben für beide Seiten nachvollziehbar.',
    audience:'Diese Seite ist für DACH-Unternehmen mit regelmäßigen Balkan-Verkehren, mehrsprachigen Fahrern oder externen Frachtführern.',
    problems:['Unvollständige Statusmeldungen aus mehreren Kanälen','ETA-Angaben ohne klare Trennung zwischen Schätzung und Zusage','Fehlende arbeitsfähige Übergaben zwischen Schichten','Unklare Zuständigkeit bei Verzögerung, Dokumentenlücke oder Slot-Risiko'],
    benefits:['Ein gemeinsamer Stand statt paralleler WhatsApp-, Telefon- und E-Mail-Versionen','Klare Rollen: Auftraggeber entscheidet, Frachtführer bestätigt operative Fakten','Dokumentierte nächste Prüfung, Eskalation und Verantwortlichkeit','Auditierbarer Verlauf für Status, Nachrichten, Dokumente und Freigaben'],
    not:['keine Transportvermittlung','keine Preisverhandlung oder Auftragsannahme','keine autonome Fahreranweisung','kein Ersatz für Ihr TMS oder Ihre interne Disposition'],
    demoTitle:'Vom unklaren Fahrerhinweis zum arbeitsfähigen Fall',
    before:'„Stau Budapest. ETA unklar. Kunde wartet.“',
    after:['bestätigte Fakten','offene Informationen','operatives ETA-Fenster','nächster Prüfzeitpunkt','verantwortliche Rolle','freizugebende Kundennachricht'],
    cta:'Transport Network ansehen',
    secondary:'Transport Room öffnen',
    proof:'Vorher / Nachher ansehen',
    problemLabel:'PROBLEM', resultLabel:'ERGEBNIS', demoLabel:'DEMONSTRATION', boundariesLabel:'KLARE GRENZEN',
    next:'Ein sinnvoller Pilot beginnt mit einer Relation, einem Balkan-Partner und klar benannten Freigaben.'
  },
  sr: {
    kicker:'ZA TRANSPORTNE FIRME SA BALKANA',
    title:'Profesionalniji DACH interfejs bez zamene vašeg disponenta.',
    lead:'DaniniHub povezuje vašu firmu i nemačkog ili austrijskog partnera u zajedničkom operativnom prostoru. Status, ETA, otvorena pitanja, dokumenti, incidenti i odobrenja ostaju jasni za obe strane.',
    audience:'Ova stranica je namenjena firmama koje redovno voze ka Nemačkoj, Austriji, Švajcarskoj ili Beneluksu i žele pouzdaniju komunikaciju sa DACH klijentima.',
    problems:['Klijent dobija informaciju tek kada je kašnjenje već ozbiljno','Vozač, disponent i klijent imaju različite verzije statusa','ETA se prenese kao obećanje umesto kao operativna procena','CMR, POD ili sledeća kontrola ostaju bez jasnog vlasnika'],
    benefits:['Jasnija nemačka komunikacija prema klijentu, utovaru i istovaru','Jedan zajednički zapis umesto rasutih poziva i poruka','Odvojene uloge prevoznika, DACH naručioca i DaniniHub podrške','Dokumentovan incident, sledeća provera i završni izveštaj'],
    not:['ne tražimo terete','ne pregovaramo cenu prevoza','ne menjamo vašeg disponenta','ne dajemo vozaču obavezujuće naloge bez ovlašćenja'],
    demoTitle:'Od nejasne poruke do radno sposobnog slučaja',
    before:'„Stau Budapest. ETA unklar. Kunde wartet.“',
    after:['potvrđene činjenice','informacije koje nedostaju','operativni ETA okvir','vreme sledeće provere','odgovorna uloga','nacrt nemačke poruke za odobrenje'],
    cta:'Pogledaj Transport Network',
    secondary:'Otvori Transport Room',
    proof:'Pogledaj pre / posle',
    problemLabel:'PROBLEM', resultLabel:'REZULTAT', demoLabel:'DEMONSTRACIJA', boundariesLabel:'JASNE GRANICE',
    next:'Dobar pilot počinje jednom relacijom, jednim DACH partnerom i jasno određenim ovlašćenjima.'
  }
}

export default function AudiencePages({lang}) {
  const t = content[lang]
  const sr = lang === 'sr'
  const network = sr ? '/sr/transportna-mreza-demo' : '/de/transport-network-demo'
  const room = sr ? '/sr/transportna-soba-demo?case=DH-TR-0001' : '/de/transport-room-demo?case=DH-TR-0001'
  const proof = sr ? '/sr/pre-posle' : '/de/vorher-nachher'
  return <main className="audience-page">
    <section className="audience-hero">
      <div><p className="audience-kicker">{t.kicker}</p><h1>{t.title}</h1><p className="audience-lead">{t.lead}</p><p className="audience-note">{t.audience}</p><div className="audience-actions"><a className="audience-primary" href={network}>{t.cta}</a><a href={proof}>{t.proof}</a><a href={room}>{t.secondary}</a></div></div>
      <aside><span>BALKAN</span><b>↔</b><span>DACH</span><small>STATUS · ETA · DOCUMENTS · INCIDENTS</small></aside>
    </section>

    <section className="audience-grid">
      <article><p className="audience-kicker">{t.problemLabel}</p><h2>{sr?'Gde se gubi kontrola nad informacijom.':'Wo operative Information verloren geht.'}</h2><ul>{t.problems.map(item=><li key={item}>{item}</li>)}</ul></article>
      <article><p className="audience-kicker">{t.resultLabel}</p><h2>{sr?'Šta firma dobija.':'Was das Unternehmen erhält.'}</h2><ul>{t.benefits.map(item=><li key={item}>{item}</li>)}</ul></article>
    </section>

    <section className="audience-demo">
      <div><p className="audience-kicker">{t.demoLabel}</p><h2>{t.demoTitle}</h2><blockquote>{t.before}</blockquote></div>
      <div className="audience-after">{t.after.map((item,index)=><span key={item}><b>{String(index+1).padStart(2,'0')}</b>{item}</span>)}</div>
    </section>

    <section className="audience-boundaries">
      <div><p className="audience-kicker">{t.boundariesLabel}</p><h2>{sr?'Šta DaniniHub ne preuzima.':'Was DaniniHub nicht übernimmt.'}</h2></div>
      <ul>{t.not.map(item=><li key={item}>{item}</li>)}</ul>
    </section>

    <section className="audience-next"><h2>{t.next}</h2><div className="audience-actions"><a className="audience-primary" href={network}>{t.cta}</a><a href={proof}>{t.proof}</a><a href={sr?'/sr/provera-pilota':'/de/pilot-check'}>{sr?'Opiši operativni problem':'Operativen Bedarf beschreiben'}</a></div></section>
  </main>
}
