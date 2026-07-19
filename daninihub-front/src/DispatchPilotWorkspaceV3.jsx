import { useEffect, useMemo, useReducer, useState } from 'react'
import './DispatchPilotWorkspace.css'
import './DispatchPilotWorkspaceV2.css'

const initialState = {
  caseId: 'TEST-DH-001',
  caseStatus: 'DRAFT',
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
  if (action.type === 'UPDATE') return { ...state, [action.field]: action.value }
  if (action.type === 'LOAD') {
    return {
      ...initialState,
      ...action.payload,
      caseId: action.caseId,
      caseStatus: action.status,
      approval: action.approval
    }
  }
  if (action.type === 'AI_STRUCTURE') {
    return {
      ...state,
      ...action.structure,
      approval: 'PENDING',
      caseStatus: 'DRAFT',
      audit: [
        ...state.audit,
        {
          time: now(),
          event: 'AI je pripremio strukturu i nemački nacrt. Potrebna je ljudska provera; ništa nije odobreno niti poslato.'
        }
      ]
    }
  }
  if (action.type === 'APPROVE') {
    return {
      ...state,
      approval: 'APPROVED',
      caseStatus: 'IN_REVIEW',
      audit: [...state.audit, { time: now(), event: 'Nacrt je ručno odobren. Slanje ostaje onemogućeno u pilot verziji.' }]
    }
  }
  if (action.type === 'REJECT') {
    return {
      ...state,
      approval: 'REJECTED',
      caseStatus: 'DRAFT',
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

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })
  const data = await response.json().catch(() => ({}))
  if (response.status === 401) {
    location.reload()
    throw new Error('Interna sesija je istekla.')
  }
  if (!response.ok) throw new Error(data.error || 'DISPATCH_REQUEST_FAILED')
  return data
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

export default function DispatchPilotWorkspaceV3() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [note, setNote] = useState('')
  const [savedCases, setSavedCases] = useState([])
  const [storageMode, setStorageMode] = useState('—')
  const [syncState, setSyncState] = useState('idle')
  const [syncMessage, setSyncMessage] = useState('')

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

  const refreshCases = async () => {
    const data = await request('/api/v1/dispatch/cases?limit=50')
    setSavedCases(data.cases || [])
    setStorageMode(data.storageMode || '—')
  }

  useEffect(() => {
    refreshCases().catch(error => setSyncMessage(error.message))
  }, [])

  const addNote = () => {
    dispatch({ type: 'ADD_NOTE', note })
    setNote('')
  }

  const structureCase = async () => {
    setSyncState('structuring')
    setSyncMessage('')
    try {
      const data = await request('/api/v1/dispatch/structure', {
        method: 'POST',
        body: JSON.stringify({
          fictitious: true,
          rawMessage: state.rawMessage,
          route: state.route,
          vehicle: state.vehicle
        })
      })
      dispatch({ type: 'AI_STRUCTURE', structure: data.structure })
      setSyncMessage('AI struktura je pripremljena. Status je PENDING — potrebna je ljudska provera.')
    } catch (error) {
      setSyncMessage(error.message)
    } finally {
      setSyncState('idle')
    }
  }

  const saveCase = async () => {
    setSyncState('saving')
    setSyncMessage('')
    try {
      const payload = {
        ...state,
        fictitious: true,
        realData: false,
        savedBy: 'DaniniHub internal operator'
      }
      const data = await request(`/api/v1/dispatch/cases/${encodeURIComponent(state.caseId)}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: state.caseStatus,
          approval: state.approval,
          payload
        })
      })
      setStorageMode(data.storageMode || '—')
      setSyncMessage(`Sačuvano ${new Date(data.case.updatedAt).toLocaleString('de-DE')}`)
      await refreshCases()
    } catch (error) {
      setSyncMessage(error.message)
    } finally {
      setSyncState('idle')
    }
  }

  const loadCase = async caseId => {
    setSyncState('loading')
    setSyncMessage('')
    try {
      const data = await request(`/api/v1/dispatch/cases/${encodeURIComponent(caseId)}`)
      dispatch({
        type: 'LOAD',
        caseId: data.case.caseId,
        status: data.case.status,
        approval: data.case.approval,
        payload: data.case.payload
      })
      setStorageMode(data.storageMode || '—')
      setSyncMessage(`Učitan ${data.case.caseId}`)
    } catch (error) {
      setSyncMessage(error.message)
    } finally {
      setSyncState('idle')
    }
  }

  const logout = async () => {
    await request('/api/v1/dispatch/logout', { method: 'POST', body: '{}' }).catch(() => {})
    location.reload()
  }

  return <main className="dpw-shell">
    <header className="dpw-header">
      <div>
        <p className="dpw-kicker">INTERNE PILOTVERSION · NUR FIKTIVE DATEN</p>
        <h1>DaniniHub Dispatch Pilot Workspace</h1>
        <p>AI strukturira informacije i priprema nacrt. Čovek proverava, menja i odobrava. Bez stvarnih podataka i bez automatskog slanja.</p>
      </div>
      <div className="dpw-header-actions">
        <button type="button" onClick={saveCase} disabled={syncState !== 'idle'}>{syncState === 'saving' ? 'Čuvam…' : 'Sačuvaj slučaj'}</button>
        <button className="dpw-secondary" type="button" onClick={() => dispatch({ type: 'RESET' })}>Novi fiktivni slučaj</button>
        <button className="dpw-secondary" type="button" onClick={logout}>Odjava</button>
      </div>
    </header>

    <section className="dpw-card dpw-sync-panel">
      <div><strong>Storage:</strong> {storageMode}</div>
      <div><strong>Status:</strong> {syncMessage || 'Interna sesija aktivna.'}</div>
    </section>

    <section className="dpw-card dpw-case-controls">
      <label>Fiktivni ID slučaja<input value={state.caseId} onChange={event => dispatch({ type: 'UPDATE', field: 'caseId', value: event.target.value.toUpperCase() })} /></label>
      <label>Status slučaja<select value={state.caseStatus} onChange={event => dispatch({ type: 'UPDATE', field: 'caseStatus', value: event.target.value })}><option>DRAFT</option><option>IN_REVIEW</option><option>CLOSED</option></select></label>
      <label>Relacija<input value={state.route} onChange={event => dispatch({ type: 'UPDATE', field: 'route', value: event.target.value })} /></label>
      <label>Vozilo<input value={state.vehicle} onChange={event => dispatch({ type: 'UPDATE', field: 'vehicle', value: event.target.value })} /></label>
    </section>

    <section className="dpw-overview" aria-label="Pregled slučaja">
      <article><span>Slučaj</span><strong>{state.caseId}</strong></article>
      <article><span>Relacija</span><strong>{state.route}</strong></article>
      <article><span>Vozilo</span><strong>{state.vehicle}</strong></article>
      <article><span>Rizik</span><strong>{state.risk}</strong></article>
      <article><span>Nacrt</span><strong>{state.approval}</strong></article>
    </section>

    <section className="dpw-card dpw-saved">
      <h2>Sačuvani fiktivni slučajevi</h2>
      {savedCases.length ? <div className="dpw-saved-list">{savedCases.map(item => <button type="button" key={item.caseId} onClick={() => loadCase(item.caseId)} disabled={syncState !== 'idle'}><strong>{item.caseId}</strong><span>{item.status} · {item.approval}</span></button>)}</div> : <p>Još nema sačuvanih slučajeva.</p>}
    </section>

    <section className="dpw-card dpw-raw">
      <h2>Sirova operativna poruka</h2>
      <textarea value={state.rawMessage} onChange={event => dispatch({ type: 'UPDATE', field: 'rawMessage', value: event.target.value })} rows="4" />
      <div className="dpw-actions">
        <button type="button" onClick={structureCase} disabled={syncState !== 'idle'}>{syncState === 'structuring' ? 'Strukturiram…' : 'AI strukturiraj nacrt'}</button>
      </div>
      <p className="dpw-lock">AI ne donosi odluku. Rezultat se vraća kao PENDING i ništa se ne šalje bez ljudske provere.</p>
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
