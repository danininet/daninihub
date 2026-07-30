import './App.css'
import './Enhancements.css'
import ProductSystemSection from './ProductSystemSection'

const problems = [
  ['Unvollständige Statusmeldungen', 'Fahrer, Disposition und Kunde arbeiten nicht mit derselben bestätigten Sachlage.'],
  ['ETA wird zur Zusage', 'Eine operative Schätzung wird ohne klare Freigabe als bestätigter Kundentermin weitergegeben.'],
  ['Balkan-Kommunikation kommt zu spät', 'Fahrer, Frachtführer, Niederlassung oder Partner liefern entscheidende Informationen erst nach der Eskalation.'],
  ['Übergaben sind nicht arbeitsfähig', 'Die nächste Schicht muss Fahrer oder Partner erneut anrufen, um den Fall überhaupt zu verstehen.']
]

const solution = [
  ['01', 'Eingang und Struktur', 'Informationen werden in bestätigte Fakten, Annahmen und offene Fragen getrennt.'],
  ['02', 'Status und Kontrollpunkt', 'Aktuelle ETA, letzte Bestätigung und nächster Prüfzeitpunkt bleiben sichtbar.'],
  ['03', 'Kommunikation', 'Eine klare Nachricht auf Deutsch oder in einer Sprache des Balkanraums wird vorbereitet.'],
  ['04', 'Freigabe', 'Entscheidungsbedarf geht an die benannte verantwortliche Person des Auftraggebers.'],
  ['05', 'Eskalation', 'Risiko, Frist, benötigte Entscheidung und Verantwortung bleiben dokumentiert.'],
  ['06', 'Übergabe', 'Die nächste Schicht erhält einen arbeitsfähigen Stand ohne erneute Informationssuche.']
]

const pilotSteps = [
  ['01', 'Eine Relation oder kleine Fallgruppe', 'Der Pilot wird nicht auf die gesamte Flotte oder Organisation geöffnet.'],
  ['02', 'Schriftlich definierte Aufgaben', 'Es wird festgelegt, was DaniniHub aufnimmt, strukturiert, vorbereitet oder eskaliert.'],
  ['03', 'Nachweisbarer Arbeitsablauf', 'Status, ETA, Abweichungen, Kommunikation, Entscheidungen und Übergabe bleiben dokumentiert.'],
  ['04', 'Gemeinsame Auswertung', 'Die Wirkung wird nach vereinbarten Kriterien geprüft, ohne automatische Verlängerung.']
]

function NumberedCards({ items }) {
  return <div className="start-grid">{items.map(([number, title, text]) => <article key={`${number}-${title}`}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
}

export default function GermanB2BLanding() {
  return <main id="top">
    <section className="hero">
      <div className="hero-copy">
        <p className="kicker">BALKAN CONTINUITY SUPPORT FÜR DACH-TRANSPORTUNTERNEHMEN</p>
        <h1>Klarere Balkan-Kommunikation. Weniger Unterbrechungen in der Disposition.</h1>
        <p className="lead">DaniniHub unterstützt Transportunternehmen im DACH-Raum bei Status, ETA, Dokumentation, Abweichungen und mehrsprachiger Kommunikation mit Fahrern, Frachtführern, Niederlassungen oder Partnern im Balkanraum — in einem vorab vereinbarten Umfang und ohne Übernahme verbindlicher Entscheidungen.</p>
        <p><a className="btn" href="/de/pilot-check">Begrenzten Pilot für 490 € netto anfragen →</a></p>
        <a className="entry-demo-link" href="/de/transport-network-demo">Arbeitsweise zuerst im Demo prüfen →</a>
        <p><strong>Klarer Einstieg:</strong> eine Relation oder kleine Fallgruppe, schriftlich definierter Leistungsrahmen, dokumentierte Auswertung und keine automatische Verlängerung.</p>
        <div className="proof"><span>✓ Gemeinsamer Arbeitsraum statt zusätzlichem TMS-Zwang</span><span>✓ Deutsch + Sprachen des Balkans</span><span>✓ Klar getrennte Befugnisse</span></div>
      </div>
      <div className="route-art" aria-hidden="true"><div className="globe"/><div className="route r1"/><div className="route r2"/><div className="truck">▰</div><span className="city c1">DUISBURG</span><span className="city c2">WIEN</span><span className="city c3">BALKAN</span></div>
    </section>

    <ProductSystemSection lang="de"/>

    <section id="services" className="section">
      <p className="kicker">OPERATIVER ENGPASS</p>
      <h2>Wo Balkan–DACH-Verkehre unnötig Zeit und Aufmerksamkeit binden.</h2>
      <div className="grid">{problems.map(([title, text], index) => <article key={title}><div className="service-card-head"><span className="num">0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section className="section">
      <p className="kicker">DANINIHUB ARBEITSRAHMEN</p>
      <h2>Information, Kommunikation und Verantwortung in einem kontrollierten Ablauf.</h2>
      <NumberedCards items={solution}/>
      <p className="big">KI unterstützt Strukturierung und Vorbereitung. Verbindliche Entscheidungen, Preise, Transportaufträge, Fahreranweisungen und rechtliche Verantwortung verbleiben beim Auftraggeber.</p>
    </section>

    <section className="section split">
      <div><p className="kicker">BEISPIELSITUATION</p><h2>Stau bei Budapest.</h2><p className="big">„Stau Budapest. ETA unklar. Kunde wartet. Entladung bis 10:00.“</p></div>
      <div><p>Der DaniniHub-Arbeitsrahmen trennt bestätigte Fakten von offenen Punkten, bewertet den operativen Handlungsbedarf, benennt die zuständige Freigabestelle, bereitet Nachrichten vor und definiert den nächsten Prüfzeitpunkt sowie eine arbeitsfähige Übergabe.</p><a className="entry-demo-link" href="/de/transport-room-demo?case=DH-TR-0001">Transport Room öffnen →</a></div>
    </section>

    <section id="scope" className="section scope">
      <p className="kicker">KLARE GRENZEN</p>
      <h2>Operative Unterstützung ohne Übernahme Ihrer Verantwortung.</h2>
      <div className="scope-grid"><article><span>DaniniHub</span><p>Strukturiert Informationen, führt Status und Kontrollpunkte, bereitet mehrsprachige Kommunikation vor, markiert Entscheidungsbedarf und dokumentiert Eskalation und Übergabe.</p></article><article><span>Auftraggeber</span><p>Behält Transportaufträge, Preise, rechtsverbindliche Zusagen, abschließende Disposition, Fahreranweisungen, Verkehrsleitung und alle operativen Freigaben.</p></article></div>
    </section>

    <section className="section">
      <p className="kicker">BEGRENZTER PILOT</p>
      <h2>Ein kleiner, messbarer Pilot statt unklarem Outsourcing.</h2>
      <NumberedCards items={pilotSteps}/>
    </section>

    <section className="section split">
      <div>
        <p className="kicker">ERSTER BEZAHLTER AUFTRAG</p>
        <h2>Begrenzter Einstiegspilot: 490 € netto.</h2>
        <p className="big">Für die ersten drei bezahlten Pilotaufträge gilt ein transparenter Einführungspreis — ohne automatische Verlängerung und ohne versteckte Folgekosten.</p>
      </div>
      <div>
        <p><strong>Enthalten:</strong> eine Relation oder kleine Fallgruppe, bis zu drei Fahrzeuge oder operative Fälle, ein schriftlich vereinbartes Kommunikationsfenster, bis zu acht operative Arbeitsstunden sowie eine abschließende Auswertung.</p>
        <p><strong>Nicht enthalten:</strong> vollständige Flottendisposition, Transportaufträge, Preisverhandlungen im Namen des Auftraggebers, rechtsverbindliche Zusagen oder unbegrenzte Erreichbarkeit.</p>
        <p><a className="btn" href="/de/pilot-check">Pilot verbindlich anfragen →</a></p>
        <p>Eine Beauftragung entsteht erst nach schriftlicher Bestätigung von Leistungsrahmen, Zeitraum, Zuständigkeiten und Zahlungsbedingungen.</p>
      </div>
    </section>

    <section className="section scope">
      <p className="kicker">PASSUNG PRÜFEN</p>
      <h2>Für welche Unternehmen der Pilot sinnvoll sein kann.</h2>
      <div className="scope-grid"><article><span>Geeignet</span><p>Für DACH-Unternehmen mit regelmäßigen Balkan-Verkehren, mehrsprachiger Fahrer- oder Partnerkommunikation, wiederkehrenden Status-, ETA-, Dokumentations- oder Übergabeproblemen und einer klar benannten Freigabestelle.</p></article><article><span>Nicht geeignet</span><p>Für Unternehmen, die erwarten, dass DaniniHub Transportaufträge, Preise, vollständige Flottendisposition, Verkehrsleitung oder rechtsverbindliche Entscheidungen selbstständig übernimmt.</p></article></div>
    </section>

    <section className="section">
      <p className="kicker">NACHWEISE UND ÖFFENTLICHER EINBLICK</p>
      <h2>Prüfen Sie Methode und Arbeitsweise vor einem Gespräch.</h2>
      <div className="start-grid interest-grid">
        <article><span>01</span><h3>DispoLab</h3><p>Praxisfälle und kostenloser Dispo-Check für operatives Denken und Eskalation.</p><a href="/de/dispolab">DispoLab öffnen →</a></article>
        <article><span>02</span><h3>Transport Network</h3><p>Unternehmensbereich mit Partnern, Team und mehreren Transport Rooms.</p><a href="/de/transport-network-demo">Network ansehen →</a></article>
        <article><span>03</span><h3>Transport Room</h3><p>Konkreter Fall mit Status, ETA, Dokumenten, Incident und Übergabe.</p><a href="/de/transport-room-demo?case=DH-TR-0001">Transport Room öffnen →</a></article>
      </div>
    </section>

    <section id="contact" className="section contact">
      <div><p className="kicker">NÄCHSTER SCHRITT</p><h2>Gibt es einen klar begrenzten operativen Engpass, den wir kontrolliert prüfen können?</h2><p>Beschreiben Sie Relation, Partner, Kommunikationsproblem und die verantwortliche Freigabestelle. Sie erhalten eine persönliche Einschätzung, ob der bezahlte Einstiegspilot fachlich sinnvoll und sauber abgrenzbar ist.</p></div>
      <div><a className="btn" href="/de/pilot-check">Pilot für 490 € netto anfragen →</a></div>
    </section>
  </main>
}
