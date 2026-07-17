import { useState } from 'react'
import './OperationsDemo.css'

const content = {
  de: {
    back: 'Zurück zur Pilot-Erklärung', title: 'DaniniHub Operations Desk', subtitle: 'Interaktive Simulation einer fiktiven Tour', notice: 'DEMO-MODUS · Keine realen Unternehmens-, Fahrer- oder Transportdaten · Keine automatische Entscheidung',
    tour: 'Tour', route: 'Novi Sad → Duisburg', cargo: '24 Paletten · Industrieware', client: 'BalkanCargo (fiktiv)', slot: 'Entladeslot', planned: 'Plan-ETA', current: 'Aktuelle ETA', decision: 'Entscheider', decisionPerson: 'Herr Marković', documents: 'Dokumente', complete: 'operativ vollständig', onPlan: 'Im Plan', deviation: '+ 90 Min. Abweichung',
    timeline: 'Status-Zeitlinie', next: 'Nächsten Schritt anzeigen', reset: 'Simulation neu starten', active: 'Aktueller Vorgang', open: 'Offene Entscheidung', noDecision: 'Keine offene Entscheidung', summary: 'Pilot-Zusammenfassung', evaluation: 'Auswertung', cta: 'Pilot besprechen', language: 'Sprache',
    steps: [
      ['13:45', 'Auftrag geprüft', 'Adressen, Referenzen, Fahrzeug und Ansprechpartner operativ vollständig.'],
      ['15:05', 'Beladung abgeschlossen', 'CMR liegt vor. Abfahrt bestätigt. ETA Duisburg: 09:20 Uhr.'],
      ['20:00', 'Regelstatus', 'Transit planmäßig. Nächste Prüfung um 22:00 Uhr vorgesehen.'],
      ['21:10', 'Abweichung erkannt', 'Verkehrsstillstand gemeldet. Vorläufige ETA: 10:50 Uhr. Slot gefährdet.'],
      ['21:14', 'Entscheidung eskaliert', 'Auftraggeber muss Freigabe zur Kontaktaufnahme mit der Entladestelle erteilen.'],
      ['21:18', 'Freigabe dokumentiert', 'Auftraggeber erlaubt Information der Entladestelle und Nachfrage zum Zeitfenster.'],
      ['21:32', 'Entladestelle informiert', 'Operative Annahme bis 11:15 Uhr möglich. Keine rechtsverbindliche Terminänderung durch DaniniHub.'],
      ['21:38', 'Beteiligte aktualisiert', 'Auftraggeber informiert. Fahrer erhielt die freigegebene Information. Nächste Prüfung: 07:00 Uhr.']
    ],
    decisions: ['Freigabe zur Kontaktaufnahme erforderlich', 'Freigabe erteilt und dokumentiert'],
    metrics: [['8', 'Statusereignisse'], ['28 Min.', 'Störung bis Rückmeldung'], ['1', 'eskalierte Entscheidung'], ['0', 'unbefugte Zusagen']],
    boundary: 'DaniniHub dokumentiert und kommuniziert. Transportauftrag, Preis, Fahrerweisung, Verkehrsleitung und finale Entscheidungen bleiben beim Auftraggeber.'
  },
  sr: {
    back: 'Nazad na objašnjenje pilota', title: 'DaniniHub operativni pult', subtitle: 'Interaktivna simulacija fiktivne ture', notice: 'DEMO REŽIM · Nema stvarnih podataka firme, vozača ili transporta · Nema automatskog odlučivanja',
    tour: 'Tura', route: 'Novi Sad → Duisburg', cargo: '24 palete · industrijska roba', client: 'BalkanCargo (fiktivno)', slot: 'Termin istovara', planned: 'Planirana ETA', current: 'Aktuelna ETA', decision: 'Odgovorna osoba', decisionPerson: 'g. Marković', documents: 'Dokumenti', complete: 'operativno kompletni', onPlan: 'Prema planu', deviation: '+ 90 min. odstupanja',
    timeline: 'Vremenska linija statusa', next: 'Prikaži sledeći korak', reset: 'Pokreni simulaciju ponovo', active: 'Aktuelni događaj', open: 'Otvorena odluka', noDecision: 'Nema otvorene odluke', summary: 'Rezime pilota', evaluation: 'Evaluacija', cta: 'Razgovor o pilotu', language: 'Jezik',
    steps: [
      ['13:45', 'Nalog proveren', 'Adrese, reference, vozilo i odgovorna osoba su operativno kompletni.'],
      ['15:05', 'Utovar završen', 'CMR postoji. Polazak potvrđen. ETA Duisburg: 09:20.'],
      ['20:00', 'Redovni status', 'Tranzit prema planu. Sledeća provera predviđena za 22:00.'],
      ['21:10', 'Uočeno odstupanje', 'Prijavljen zastoj. Privremena ETA: 10:50. Termin je ugrožen.'],
      ['21:14', 'Odluka eskalirana', 'Naručilac mora odobriti kontaktiranje mesta istovara.'],
      ['21:18', 'Odobrenje dokumentovano', 'Naručilac dozvoljava obaveštavanje i pitanje o vremenskom prozoru.'],
      ['21:32', 'Istovar obavešten', 'Operativni prijem moguć do 11:15. DaniniHub ne menja pravno obavezujući termin.'],
      ['21:38', 'Učesnici ažurirani', 'Naručilac je obavešten. Vozač je dobio odobrenu informaciju. Sledeća provera: 07:00.']
    ],
    decisions: ['Potrebno odobrenje za kontaktiranje', 'Odobrenje dato i dokumentovano'],
    metrics: [['8', 'statusnih događaja'], ['28 min.', 'od smetnje do odgovora'], ['1', 'eskalirana odluka'], ['0', 'neovlašćenih obećanja']],
    boundary: 'DaniniHub dokumentuje i komunicira. Transportni nalog, cena, instrukcije vozaču, Verkehrsleitung i konačne odluke ostaju kod naručioca.'
  }
}

export default function OperationsDemo({lang}) {
  const t = content[lang]
  const [visible, setVisible] = useState(1)
  const finished = visible === t.steps.length
  const current = t.steps[visible - 1]
  const issue = visible >= 4
  const waiting = visible === 4 || visible === 5
  const eta = issue ? '10:50' : '09:20'
  const switchPath = lang === 'sr' ? '/de/operations-desk-demo' : '/sr/operativni-pult-demo'
  return <main className="ops-shell">
    <header className="ops-header">
      <a href={lang==='sr'?'/sr/primer-pilota':'/de/pilot-beispiel'}>← {t.back}</a>
      <div className="ops-header-tools"><strong>DaniniHub · DEMO</strong><a className="ops-language" href={switchPath} aria-label={t.language}>{lang==='sr'?'DE':'SR'}</a></div>
    </header>
    <section className="ops-page">
      <div className="ops-title"><div><p className="kicker">OPERATIONS DESK</p><h1>{t.title}</h1><p>{t.subtitle}</p></div><span className="ops-mode">SIM-2026-017</span></div>
      <p className="ops-notice">{t.notice}</p>
      <div className="ops-overview">
        <article><small>{t.tour}</small><strong>{t.route}</strong><span>{t.cargo}</span></article>
        <article><small>{t.client}</small><strong>{t.slot}: 10:00</strong><span>{t.planned}: 09:20</span></article>
        <article className={issue?'is-alert':''}><small>{t.current}</small><strong>{eta}</strong><span>{issue?t.deviation:t.onPlan}</span></article>
        <article><small>{t.decision}</small><strong>{t.decisionPerson}</strong><span>{t.documents}: {t.complete}</span></article>
      </div>
      <div className="ops-grid">
        <section className="ops-panel"><div className="panel-head"><h2>{t.timeline}</h2><span role="progressbar" aria-valuemin="1" aria-valuemax={t.steps.length} aria-valuenow={visible}>{visible}/{t.steps.length}</span></div><div className="ops-timeline">{t.steps.map(([time,title,text],index)=><article key={time+title} className={index<visible?'shown':''}><span className="time">{time}</span><div><strong>{title}</strong><p>{index<visible?text:'••••••••••••••••••••'}</p></div></article>)}</div></section>
        <aside className="ops-side" aria-live="polite">
          <section className={`ops-panel current ${issue?'is-alert':''}`}><small>{t.active}</small><h2>{current[1]}</h2><p>{current[2]}</p></section>
          <section className={`ops-panel decision ${waiting?'waiting':''}`}><small>{t.open}</small><h3>{waiting?t.decisions[0]:(visible>5?t.decisions[1]:t.noDecision)}</h3><p>{t.boundary}</p></section>
          <button className="ops-next" onClick={()=>setVisible(value=>Math.min(value+1,t.steps.length))} disabled={finished}>{finished?t.summary:t.next} →</button>
          <button className="ops-reset" onClick={()=>setVisible(1)}>{t.reset}</button>
        </aside>
      </div>
      {finished&&<section className="ops-result"><p className="kicker">{t.evaluation}</p><h2>{t.summary}</h2><div>{t.metrics.map(([value,label])=><article key={label}><strong>{value}</strong><span>{label}</span></article>)}</div><p>{t.boundary}</p><a className="btn" href={lang==='sr'?'/sr/?interest=pilot#contact':'/de/?interest=pilot#contact'}>{t.cta} →</a></section>}
    </section>
  </main>
}
