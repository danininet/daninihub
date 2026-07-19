import { useEffect, useMemo, useReducer, useState } from 'react'
import './DispatchPilotWorkspace.css'
import './DispatchPilotWorkspaceV2.css'
import './DispatchPilotWorkspaceV4.css'

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
    { time: '15:12', event: 'Fiktivni slučaj otvoren. / Fiktiver Fall geöffnet.' }
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
      audit: [...state.audit, {
        time: now(),
        event: 'AI je pripremio strukturu; potrebna je ljudska provera. / KI hat die Struktur vorbereitet; menschliche Prüfung ist erforderlich.'
      }]
    }
  }
  if (action.type === 'APPROVE') {
    return {
      ...state,
      approval: 'APPROVED',
      caseStatus: 'IN_REVIEW',
      audit: [...state.audit, {
        time: now(),
        event: 'Nacrt je ručno odobren; slanje ostaje onemogućeno. / Entwurf manuell freigegeben; Versand bleibt deaktiviert.'
      }]
    }
  }
  if (action.type === 'REJECT') {
    return {
      ...state,
      approval: 'REJECTED',
      caseStatus: 'DRAFT',
      audit: [...state.audit, {
        time: now(),
        event: 'Nacrt je vraćen na doradu. / Entwurf zur Überarbeitung zurückgegeben.'
      }]
    }
  }
  if (action.type === 'ADD_NOTE') {
    if (!action.note.trim()) return state
    return { ...state, audit: [...state.audit, { time: now(), event: action.note.trim() }] }
  }
  if (action.type === 'RESET') return initialState
  return state
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  })
  const data = await response.json().catch(() => ({}))
  if (response.status === 401) {
    location.reload()
    throw new Error('Sesija je istekla. / Sitzung ist abgelaufen.')
  }
  if (!response.ok) throw new Error(data.error || 'DISPATCH_REQUEST_FAILED')
  return data
}

function ListEditor({ title, items, onChange }) {
  return <section className="dpw-card">
    <h3>{title}</h3>
    <textarea
      value={items.join('\n')}
      onChange={event => onChange(event.target.value.split('\n').filter(Boolean))}
      aria-label={title}
      rows="7"
    />
  </section>
}

export default function DispatchPilotWorkspaceV4() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [note, setNote] = useState('')
  const [savedCases, setSavedCases] = useState([])
  const [storageMode, setStorageMode] = useState('—')
  const [syncState, setSyncState] = useState('idle')
  const [syncMessage, setSyncMessage] = useState('Interna sesija aktivna. / Interne Sitzung aktiv.')

  const busy = syncState !== 'idle'

  const handover = useMemo(() => [
    `Slučaj / Fall: ${state.caseId}`,
    `Relacija / Relation: ${state.route}`,
    `Vozilo / Fahrzeug: ${state.vehicle}`,
    `Potvrđeno / Bestätigt: ${state.facts.join(' | ')}`,
    `Otvoreno / Offen: ${state.unknowns.join(' | ')}`,
    `Rizik / Risiko: ${state.risk}`,
    `Potrebna odluka / Erforderliche Entscheidung: ${state.decisionRequired}`,
    `Odgovorna osoba / Verantwortliche Person: ${state.decisionOwner}`,
    `Sledeća provera / Nächste Prüfung: ${state.nextCheck}`,
    `Status nacrta / Entwurfsstatus: ${state.approval}`
  ].join('\n'), [state])

  const refreshCases = async () => {
    const data = await request('/api/v1/dispatch/cases?limit=50')
    setSavedCases(data.cases || [])
    setStorageMode(data.storageMode || '—')
  }

  useEffect(() => {
    refreshCases().catch(error => setSyncMessage(error.message))
  }, [])

  const structureCase = async () => {
    setSyncState('structuring')
    setSyncMessage('AI strukturira… / KI strukturiert…')
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
      setSyncMessage('AI struktura je spremna; status ostaje PENDING. / KI-Struktur ist bereit; Status bleibt PENDING.')
    } catch (error) {
      setSyncMessage(error.message)
    } finally {
      setSyncState('idle')
    }
  }

  const saveCase = async () => {
    setSyncState('saving')
    setSyncMessage('Čuvam… / Speichern…')
    try {
      const payload = {
        ...state,
        fictitious: true,
        realData: false,
        savedBy: 'DaniniHub internal operator'
      }
      const data = await request(`/api/v1/dispatch/cases/${encodeURIComponent(state.caseId)}`, {
        method: 'PUT',
        body: JSON.stringify({ status: state.caseStatus, approval: state.approval, payload })
      })
      setStorageMode(data.storageMode || '—')
      setSyncMessage(`Sačuvano / Gespeichert: ${new Date(data.case.updatedAt).toLocaleString('de-DE')}`)
      await refreshCases()
    } catch (error) {
      setSyncMessage(error.message)
    } finally {
      setSyncState('idle')
    }
  }

  const loadCase = async caseId => {
    setSyncState('loading')
    setSyncMessage('Učitavam… / Laden…')
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
      setSyncMessage(`Učitan / Geladen: ${data.case.caseId}`)
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

  const addNote = () => {
    dispatch({ type: 'ADD_NOTE', note })
    setNote('')
  }

  return <main className="dpw-shell dpw-v4">
    <header className="dpw-header">
      <div>
        <p className="dpw-kicker">INTERNA PILOT VERZIJA / INTERNE PILOTVERSION · SAMO FIKTIVNI PODACI / NUR FIKTIVE DATEN</p>
        <h1>DaniniHub Dispatch Pilot Workspace</h1>
        <p>AI priprema strukturu. Čovek proverava i odlučuje. / KI bereitet die Struktur vor. Der Mensch prüft und entscheidet.</p>
      </div>
      <div className="dpw-header-actions">
        <button type="button" onClick={saveCase} disabled={busy}>Sačuvaj / Speichern</button>
        <button className="dpw-secondary" type="button" onClick={() => dispatch({ type: 'RESET' })}>Novi slučaj / Neuer Fall</button>
        <button className="dpw-secondary" type="button" onClick={logout}>Odjava / Abmelden</button>
      </div>
    </header>

    <section className="dpw-card dpw-status-bar">
      <div><strong>Storage:</strong> {storageMode}</div>
      <div><strong>Status:</strong> {syncMessage}</div>
    </section>

    <section className="dpw-v4-steps" aria-label="Radni tok / Arbeitsablauf">
      <article><strong>1</strong><span>Unesi poruku<br/>Rohmeldung eingeben</span></article>
      <article><strong>2</strong><span>Pregledaj AI strukturu<br/>KI-Struktur prüfen</span></article>
      <article><strong>3</strong><span>Ručno odobri ili odbij<br/>Manuell freigeben oder ablehnen</span></article>
    </section>

    <section className="dpw-card dpw-v4-step dpw-v4-primary-step">
      <div className="dpw-v4-step-title"><span>1</span><div><h2>Unesi sirovu poruku / Rohmeldung eingeben</h2><p>Ovde počinje test. / Hier beginnt der Test.</p></div></div>
      <div className="dpw-case-controls">
        <label>Fiktivni ID / Fiktive ID<input value={state.caseId} onChange={event => dispatch({ type: 'UPDATE', field: 'caseId', value: event.target.value.toUpperCase() })}/></label>
        <label>Relacija / Relation<input value={state.route} onChange={event => dispatch({ type: 'UPDATE', field: 'route', value: event.target.value })}/></label>
        <label>Vozilo / Fahrzeug<input value={state.vehicle} onChange={event => dispatch({ type: 'UPDATE', field: 'vehicle', value: event.target.value })}/></label>
        <label>Status slučaja / Fallstatus<select value={state.caseStatus} onChange={event => dispatch({ type: 'UPDATE', field: 'caseStatus', value: event.target.value })}><option>DRAFT</option><option>IN_REVIEW</option><option>CLOSED</option></select></label>
      </div>
      <label className="dpw-v4-wide-label">Sirova operativna poruka / Operative Rohmeldung<textarea value={state.rawMessage} onChange={event => dispatch({ type: 'UPDATE', field: 'rawMessage', value: event.target.value })} rows="5"/></label>
      <button className="dpw-v4-main-action" type="button" onClick={structureCase} disabled={busy}>{syncState === 'structuring' ? 'AI strukturira… / KI strukturiert…' : 'AI STRUKTURIRAJ / MIT KI STRUKTURIEREN'}</button>
      <p className="dpw-lock">Rezultat ostaje PENDING. Ništa se ne šalje. / Ergebnis bleibt PENDING. Es wird nichts versendet.</p>
    </section>

    <section className="dpw-card dpw-v4-step">
      <div className="dpw-v4-step-title"><span>2</span><div><h2>Pregledaj rezultat / Ergebnis prüfen</h2><p>Ispravi svaku netačnost pre odluke. / Jede Ungenauigkeit vor der Entscheidung korrigieren.</p></div></div>
      <section className="dpw-grid">
        <ListEditor title="Potvrđene činjenice / Bestätigte Fakten" items={state.facts} onChange={value => dispatch({ type: 'UPDATE', field: 'facts', value })}/>
        <ListEditor title="Nepoznato / Offene Punkte" items={state.unknowns} onChange={value => dispatch({ type: 'UPDATE', field: 'unknowns', value })}/>
        <section className="dpw-card">
          <h3>Rizik i kontrola / Risiko und Kontrolle</h3>
          <label>Rizik / Risiko<select value={state.risk} onChange={event => dispatch({ type: 'UPDATE', field: 'risk', value: event.target.value })}><option>NIZAK</option><option>SREDNJI</option><option>VISOK</option><option>KRITIČAN</option></select></label>
          <label>Sledeća provera / Nächste Prüfung<input value={state.nextCheck} onChange={event => dispatch({ type: 'UPDATE', field: 'nextCheck', value: event.target.value })}/></label>
        </section>
      </section>
      <section className="dpw-grid dpw-grid-two">
        <section className="dpw-card">
          <h3>Potrebna odluka / Erforderliche Entscheidung</h3>
          <label>Odluka / Entscheidung<textarea value={state.decisionRequired} onChange={event => dispatch({ type: 'UPDATE', field: 'decisionRequired', value: event.target.value })} rows="4"/></label>
          <label>Odgovorna osoba / Verantwortliche Person<input value={state.decisionOwner} onChange={event => dispatch({ type: 'UPDATE', field: 'decisionOwner', value: event.target.value })}/></label>
        </section>
        <section className="dpw-card">
          <h3>Nacrt nemačke poruke / Deutscher Nachrichtenentwurf</h3>
          <textarea value={state.draftMessage} onChange={event => dispatch({ type: 'UPDATE', field: 'draftMessage', value: event.target.value })} rows="9"/>
        </section>
      </section>
    </section>

    <section className="dpw-card dpw-v4-step dpw-v4-decision-step">
      <div className="dpw-v4-step-title"><span>3</span><div><h2>Ručno odluči / Manuell entscheiden</h2><p>Ova odluka menja samo interni status. / Diese Entscheidung ändert nur den internen Status.</p></div></div>
      <div className="dpw-v4-decision-grid">
        <button className="dpw-v4-approve" type="button" onClick={() => dispatch({ type: 'APPROVE' })}>ODOBRI NACRT / ENTWURF FREIGEBEN</button>
        <button className="dpw-v4-reject" type="button" onClick={() => dispatch({ type: 'REJECT' })}>VRATI NA DORADU / ZUR ÜBERARBEITUNG</button>
      </div>
      <div className="dpw-v4-status-card"><span>Status / Status</span><strong>{state.approval}</strong></div>
      <button className="dpw-v4-main-action" type="button" onClick={saveCase} disabled={busy}>{syncState === 'saving' ? 'Čuvam… / Speichern…' : 'SAČUVAJ OVAJ SLUČAJ / DIESEN FALL SPEICHERN'}</button>
      <p className="dpw-lock">Automatsko slanje je deaktivirano. / Automatischer Versand ist deaktiviert.</p>
    </section>

    <section className="dpw-grid dpw-grid-two">
      <section className="dpw-card">
        <h2>Sačuvani fiktivni slučajevi / Gespeicherte fiktive Fälle</h2>
        {savedCases.length ? <div className="dpw-saved-list">{savedCases.map(item => <button type="button" key={item.caseId} onClick={() => loadCase(item.caseId)} disabled={busy}><strong>{item.caseId}</strong><span>{item.status} · {item.approval}</span></button>)}</div> : <p>Nema sačuvanih slučajeva. / Keine gespeicherten Fälle.</p>}
      </section>
      <section className="dpw-card">
        <h2>Audit / Audit-Protokoll</h2>
        <ol className="dpw-audit">{state.audit.map((entry, index) => <li key={`${entry.time}-${index}`}><time>{entry.time}</time><span>{entry.event}</span></li>)}</ol>
        <div className="dpw-note"><input value={note} onChange={event => setNote(event.target.value)} placeholder="Interna beleška / Interne Notiz"/><button type="button" onClick={addNote}>Dodaj / Hinzufügen</button></div>
      </section>
    </section>

    <section className="dpw-card">
      <h2>Radno sposobna predaja / Arbeitsfähige Übergabe</h2>
      <textarea readOnly value={handover} rows="15"/>
      <p>Interni rezime, ne instrukcija vozaču niti potvrda klijentu. / Interne Zusammenfassung, keine Fahreranweisung und keine Kundenzusage.</p>
    </section>
  </main>
}
