import { useMemo, useReducer, useState } from 'react'
import './DispatchPilotWorkspace.css'

const initialState = {
  caseId: 'TEST-DH-001',
  route: 'Duisburg → Beograd',
  vehicle: 'TEST-TRUCK-01',
  customer: 'Demo Kunde GmbH',
  rawMessage: 'Stau Budapest. ETA unklar. Kunde wartet. Entladung bis 10:00.',
  facts: [
    'Vozilo je na relaciji Duisburg–Beograd.',
    'Vozač je prijavio zastoj kod Budimpešte.',
    'Planirani istovar je do 10:00.',
    'Klijent čeka potvrđenu informaciju.'
  ],
  unknowns: [
    'Tačna lokacija i dužina zastoja nisu potvrđene.',
    'Nova operativna ETA još nije potvrđena.',
    'Nije potvrđeno da li istovar prihvata kasniji dolazak.'
  ],
  risk: 'VISOK',
  nextCheck: '15:30',
  decisionRequired: 'Odobrenje da se od klijenta zatraži novi termin istovara.',
  decisionOwner: 'Demo Operations Lead',
  draftMessage: 'Guten Tag, unser Fahrzeug befindet sich aktuell im Stau bei Budapest. Eine belastbare ETA liegt noch nicht vor. Wir prüfen den Status erneut um 15:30 Uhr und melden uns unmittelbar danach. Bitte bestätigen Sie, ob bei einer verspäteten Ankunft ein neuer Entladeslot erforderlich ist.',
  approval: 'PENDING',
  audit: [
    { time: '15:12', event: 'Fiktivni slučaj otvoren.' },
    { time: '15:14', event: 'Sirova poruka strukturisana na činjenice, nepoznato i rizik.' },
    { time: '15:16', event: 'Nacrt nemačke poruke pripremljen. Automatsko slanje je deaktivirano.' }
  ]
}

function now() {
  return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

function reducer(state, action) {
  if (action.type === 'UPDATE') {
    return { ...state, [action.field]: action.value }
  }
  if (action.type === 'APPROVE') {
    return {
      ...state,
      approval: 'APPROVED',
      audit: [...state.audit, { time: now(), event: 'Nacrt je ručno odobren. Slanje ostaje onemogućeno u pilot verziji.' }]
    }
  }
  if (action.type === 'REJECT') {
    return {
      ...state,
      approval: 'REJECTED',
      audit: [...state.audit, { time: now(), event: 'Nacrt je ručno odbijen i vraćen na doradu.' }]
    }
  }
  if (action.type === 'ADD_NOTE') {
    if (!action.note.trim()) return state
    return {
      ...state,
      audit: [...state.audit, { time: now(), event: action.note.trim() }]
    }
  }
  if (action.type === 'RESET') return initialState
  return state
}

function ListEditor({ title, items, onChange }) {
  return <section className="dpw-card">
    <h2>{title}</h2>
    <textarea
      value={items.join('\n')}
      onChange={event => onChange(event.target.value.split('\n').filter(Boolean))}
      aria-label={title}
      rows="7"
    />
  </section>
}

export default function DispatchPilotWorkspace() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [note, setNote] = useState('')

  const handover = useMemo(() => [
    `Slučaj: ${state.caseId}`,
    `Relacija: ${state.route}`,
    `Vozilo: ${state.vehicle}`,
    `Potvrđeno: ${state.facts.join(' | ')}`,
    `Otvoreno: ${state.unknowns.join(' | ')}`,
    `Rizik: ${state.risk}`,
    `Potrebna odluka: ${state.decisionRequired}`,
    `Odgovorna osoba: ${state.decisionOwner}`,
    `Sledeća provera: ${state.nextCheck}`,
    `Status nacrta: ${state.approval}`
  ].join('\n'), [state])

  const addNote = () => {
    dispatch({ type: 'ADD_NOTE', note })
    setNote('')
  }

  return <main className="dpw-shell">
    <header className="dpw-header">
      <div>
        <p className="dpw-kicker">INTERNE PILOTVERSION · NUR FIKTIVE DATEN</p>
        <h1>DaniniHub Dispatch Pilot Workspace</h1>
        <p>Strukturiranje slučaja, ljudsko odobrenje, audit i radno sposobna predaja. Bez stvarnih podataka i bez automatskog slanja.</p>
      </div>
      <button className="dpw-secondary" type="button" onClick={() => dispatch({ type: 'RESET' })}>Resetuj fiktivni slučaj</button>
    </header>

    <section className="dpw-overview" aria-label="Pregled slučaja">
      <article><span>Slučaj</span><strong>{state.caseId}</strong></article>
      <article><span>Relacija</span><strong>{state.route}</strong></article>
      <article><span>Vozilo</span><strong>{state.vehicle}</strong></article>
      <article><span>Rizik</span><strong>{state.risk}</strong></article>
      <article><span>Nacrt</span><strong>{state.approval}</strong></article>
    </section>

    <section className="dpw-card dpw-raw">
      <h2>Sirova operativna poruka</h2>
      <textarea value={state.rawMessage} onChange={event => dispatch({ type: 'UPDATE', field: 'rawMessage', value: event.target.value })} rows="4" />
      <p>AI ili operater sme da strukturira sadržaj, ali ne sme da izmisli činjenice niti da pošalje poruku bez odobrenja.</p>
    </section>

    <section className="dpw-grid">
      <ListEditor title="Potvrđene činjenice" items={state.facts} onChange={value => dispatch({ type: 'UPDATE', field: 'facts', value })} />
      <ListEditor title="Nepoznato / mora se proveriti" items={state.unknowns} onChange={value => dispatch({ type: 'UPDATE', field: 'unknowns', value })} />
      <section className="dpw-card">
        <h2>Rizik i kontrolna tačka</h2>
        <label>Rizik<select value={state.risk} onChange={event => dispatch({ type: 'UPDATE', field: 'risk', value: event.target.value })}><option>NIZAK</option><option>SREDNJI</option><option>VISOK</option><option>KRITIČAN</option></select></label>
        <label>Sledeća provera<input value={state.nextCheck} onChange={event => dispatch({ type: 'UPDATE', field: 'nextCheck', value: event.target.value })} /></label>
      </section>
    </section>

    <section className="dpw-grid dpw-grid-two">
      <section className="dpw-card">
        <h2>Potrebna odluka</h2>
        <label>Odluka<textarea value={state.decisionRequired} onChange={event => dispatch({ type: 'UPDATE', field: 'decisionRequired', value: event.target.value })} rows="4" /></label>
        <label>Odgovorna osoba<input value={state.decisionOwner} onChange={event => dispatch({ type: 'UPDATE', field: 'decisionOwner', value: event.target.value })} /></label>
      </section>

      <section className="dpw-card">
        <h2>Nacrt poruke — bez automatskog slanja</h2>
        <textarea value={state.draftMessage} onChange={event => dispatch({ type: 'UPDATE', field: 'draftMessage', value: event.target.value })} rows="9" />
        <div className="dpw-actions">
          <button type="button" onClick={() => dispatch({ type: 'APPROVE' })}>Ručno odobri nacrt</button>
          <button className="dpw-danger" type="button" onClick={() => dispatch({ type: 'REJECT' })}>Odbij i vrati na doradu</button>
        </div>
        <p className="dpw-lock">Automatsko slanje je deaktivirano. Odobrenje menja samo interni status.</p>
      </section>
    </section>

    <section className="dpw-grid dpw-grid-two">
      <section className="dpw-card">
        <h2>Audit događaja</h2>
        <ol className="dpw-audit">{state.audit.map((entry, index) => <li key={`${entry.time}-${index}`}><time>{entry.time}</time><span>{entry.event}</span></li>)}</ol>
        <div className="dpw-note"><input value={note} onChange={event => setNote(event.target.value)} placeholder="Dodaj internu audit belešku" /><button type="button" onClick={addNote}>Dodaj</button></div>
      </section>

      <section className="dpw-card">
        <h2>Radno sposobna predaja</h2>
        <textarea readOnly value={handover} rows="16" />
        <p>Predaja je interni rezime. Ne predstavlja instrukciju vozaču, potvrdu klijentu niti pravno obavezujuću odluku.</p>
      </section>
    </section>
  </main>
}
