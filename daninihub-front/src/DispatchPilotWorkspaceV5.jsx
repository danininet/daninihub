import { useEffect, useMemo, useReducer, useState } from 'react'
import './DispatchPilotWorkspace.css'
import './DispatchPilotWorkspaceV2.css'
import './DispatchPilotWorkspaceV4.css'
import './DispatchPilotWorkspaceV5.css'

const copy = {
  sr: {
    kicker: 'INTERNA PILOT VERZIJA · SAMO FIKTIVNI PODACI',
    intro: 'AI priprema strukturu. Čovek proverava, menja i odlučuje.',
    save: 'Sačuvaj', newCase: 'Novi slučaj', logout: 'Odjava', storage: 'Skladište', status: 'Status',
    session: 'Interna sesija je aktivna.', structuring: 'AI strukturira…', structured: 'AI struktura je spremna. Status ostaje PENDING.',
    saving: 'Čuvam…', loading: 'Učitavam…', saved: 'Sačuvano', loaded: 'Učitan', expired: 'Sesija je istekla.',
    step1: 'Unesi poruku', step1Sub: 'Ovde počinje test.', step2: 'Pregledaj AI strukturu', step2Sub: 'Ispravi svaku netačnost pre odluke.',
    step3: 'Ručno odobri ili odbij', step3Sub: 'Odluka menja samo interni status.',
    caseId: 'Fiktivni ID', route: 'Relacija', vehicle: 'Vozilo', caseStatus: 'Status slučaja', raw: 'Sirova operativna poruka',
    structure: 'AI STRUKTURIRAJ', pending: 'Rezultat ostaje PENDING. Ništa se ne šalje.',
    facts: 'Potvrđene činjenice', unknowns: 'Nepoznato / mora se proveriti', riskControl: 'Rizik i kontrolna tačka',
    risk: 'Rizik', nextCheck: 'Sledeća provera', decision: 'Potrebna odluka', decisionLabel: 'Odluka', owner: 'Odgovorna osoba',
    draft: 'Nacrt nemačke poruke', approve: 'ODOBRI NACRT', reject: 'VRATI NA DORADU',
    approvalStatus: 'Status nacrta', saveCase: 'SAČUVAJ OVAJ SLUČAJ', noSend: 'Automatsko slanje je deaktivirano.',
    savedCases: 'Sačuvani fiktivni slučajevi', noCases: 'Nema sačuvanih slučajeva.', audit: 'Audit događaja',
    note: 'Interna beleška', add: 'Dodaj', handover: 'Radno sposobna predaja',
    handoverNote: 'Interni rezime, ne instrukcija vozaču niti potvrda klijentu.',
    approvedEvent: 'Nacrt je ručno odobren; slanje ostaje onemogućeno.', rejectedEvent: 'Nacrt je vraćen na doradu.',
    aiEvent: 'AI je pripremio strukturu; potrebna je ljudska provera.', openedEvent: 'Fiktivni slučaj je otvoren.'
  },
  de: {
    kicker: 'INTERNE PILOTVERSION · NUR FIKTIVE DATEN',
    intro: 'KI bereitet die Struktur vor. Der Mensch prüft, ändert und entscheidet.',
    save: 'Speichern', newCase: 'Neuer Fall', logout: 'Abmelden', storage: 'Speicher', status: 'Status',
    session: 'Interne Sitzung ist aktiv.', structuring: 'KI strukturiert…', structured: 'KI-Struktur ist bereit. Status bleibt PENDING.',
    saving: 'Speichern…', loading: 'Laden…', saved: 'Gespeichert', loaded: 'Geladen', expired: 'Sitzung ist abgelaufen.',
    step1: 'Rohmeldung eingeben', step1Sub: 'Hier beginnt der Test.', step2: 'KI-Struktur prüfen', step2Sub: 'Jede Ungenauigkeit vor der Entscheidung korrigieren.',
    step3: 'Manuell freigeben oder ablehnen', step3Sub: 'Die Entscheidung ändert nur den internen Status.',
    caseId: 'Fiktive ID', route: 'Relation', vehicle: 'Fahrzeug', caseStatus: 'Fallstatus', raw: 'Operative Rohmeldung',
    structure: 'MIT KI STRUKTURIEREN', pending: 'Ergebnis bleibt PENDING. Es wird nichts versendet.',
    facts: 'Bestätigte Fakten', unknowns: 'Offene Punkte / zu prüfen', riskControl: 'Risiko und Kontrollpunkt',
    risk: 'Risiko', nextCheck: 'Nächste Prüfung', decision: 'Erforderliche Entscheidung', decisionLabel: 'Entscheidung', owner: 'Verantwortliche Person',
    draft: 'Deutscher Nachrichtenentwurf', approve: 'ENTWURF FREIGEBEN', reject: 'ZUR ÜBERARBEITUNG',
    approvalStatus: 'Entwurfsstatus', saveCase: 'DIESEN FALL SPEICHERN', noSend: 'Automatischer Versand ist deaktiviert.',
    savedCases: 'Gespeicherte fiktive Fälle', noCases: 'Keine gespeicherten Fälle.', audit: 'Audit-Protokoll',
    note: 'Interne Notiz', add: 'Hinzufügen', handover: 'Arbeitsfähige Übergabe',
    handoverNote: 'Interne Zusammenfassung, keine Fahreranweisung und keine Kundenzusage.',
    approvedEvent: 'Entwurf wurde manuell freigegeben; Versand bleibt deaktiviert.', rejectedEvent: 'Entwurf wurde zur Überarbeitung zurückgegeben.',
    aiEvent: 'KI hat die Struktur vorbereitet; menschliche Prüfung ist erforderlich.', openedEvent: 'Fiktiver Fall wurde geöffnet.'
  }
}

function createInitialState(lang) {
  const t = copy[lang]
  return {
    caseId: 'TEST-DH-001', caseStatus: 'DRAFT', route: 'Duisburg → Beograd', vehicle: 'TEST-TRUCK-01',
    rawMessage: 'Stau Budapest. ETA unklar. Kunde wartet. Entladung bis 10:00.', facts: [], unknowns: [], risk: 'VISOK',
    nextCheck: '15:30', decisionRequired: '', decisionOwner: '', draftMessage: '', approval: 'PENDING',
    audit: [{ time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }), event: t.openedEvent }]
  }
}

function now() { return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) }

function reducer(state, action) {
  if (action.type === 'UPDATE') return { ...state, [action.field]: action.value }
  if (action.type === 'LOAD') return { ...action.payload, caseId: action.caseId, caseStatus: action.status, approval: action.approval }
  if (action.type === 'AI_STRUCTURE') return { ...state, ...action.structure, approval: 'PENDING', caseStatus: 'DRAFT', audit: [...state.audit, { time: now(), event: action.event }] }
  if (action.type === 'APPROVE') return { ...state, approval: 'APPROVED', caseStatus: 'IN_REVIEW', audit: [...state.audit, { time: now(), event: action.event }] }
  if (action.type === 'REJECT') return { ...state, approval: 'REJECTED', caseStatus: 'DRAFT', audit: [...state.audit, { time: now(), event: action.event }] }
  if (action.type === 'ADD_NOTE' && action.note.trim()) return { ...state, audit: [...state.audit, { time: now(), event: action.note.trim() }] }
  if (action.type === 'RESET') return action.payload
  return state
}

async function request(path, options = {}) {
  const response = await fetch(path, { credentials: 'same-origin', ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } })
  const data = await response.json().catch(() => ({}))
  if (response.status === 401) { location.reload(); throw new Error('SESSION_EXPIRED') }
  if (!response.ok) throw new Error(data.error || 'DISPATCH_REQUEST_FAILED')
  return data
}

function ListEditor({ title, items, onChange }) {
  return <section className="dpw-card"><h3>{title}</h3><textarea value={items.join('\n')} onChange={event => onChange(event.target.value.split('\n').filter(Boolean))} aria-label={title} rows="7"/></section>
}

export default function DispatchPilotWorkspaceV5() {
  const initialLang = new URLSearchParams(location.search).get('lang') === 'de' ? 'de' : 'sr'
  const [lang, setLang] = useState(initialLang)
  const t = copy[lang]
  const [state, dispatch] = useReducer(reducer, createInitialState(initialLang))
  const [note, setNote] = useState('')
  const [savedCases, setSavedCases] = useState([])
  const [storageMode, setStorageMode] = useState('—')
  const [syncState, setSyncState] = useState('idle')
  const [syncMessage, setSyncMessage] = useState(t.session)
  const busy = syncState !== 'idle'

  const changeLanguage = next => {
    setLang(next)
    const url = new URL(location.href)
    url.searchParams.set('lang', next)
    history.replaceState({}, '', url)
    setSyncMessage(copy[next].session)
  }

  const handover = useMemo(() => [
    `${t.caseId}: ${state.caseId}`, `${t.route}: ${state.route}`, `${t.vehicle}: ${state.vehicle}`,
    `${t.facts}: ${state.facts.join(' | ') || '—'}`, `${t.unknowns}: ${state.unknowns.join(' | ') || '—'}`,
    `${t.risk}: ${state.risk}`, `${t.decision}: ${state.decisionRequired || '—'}`, `${t.owner}: ${state.decisionOwner || '—'}`,
    `${t.nextCheck}: ${state.nextCheck}`, `${t.approvalStatus}: ${state.approval}`
  ].join('\n'), [lang, state])

  const refreshCases = async () => {
    const data = await request('/api/v1/dispatch/cases?limit=50')
    setSavedCases(data.cases || [])
    setStorageMode(data.storageMode || '—')
  }

  useEffect(() => { refreshCases().catch(error => setSyncMessage(error.message === 'SESSION_EXPIRED' ? t.expired : error.message)) }, [])

  const structureCase = async () => {
    setSyncState('structuring'); setSyncMessage(t.structuring)
    try {
      const data = await request('/api/v1/dispatch/structure', { method: 'POST', body: JSON.stringify({ fictitious: true, rawMessage: state.rawMessage, route: state.route, vehicle: state.vehicle }) })
      dispatch({ type: 'AI_STRUCTURE', structure: data.structure, event: t.aiEvent }); setSyncMessage(t.structured)
    } catch (error) { setSyncMessage(error.message === 'SESSION_EXPIRED' ? t.expired : error.message) }
    finally { setSyncState('idle') }
  }

  const saveCase = async () => {
    setSyncState('saving'); setSyncMessage(t.saving)
    try {
      const payload = { ...state, fictitious: true, realData: false, savedBy: 'DaniniHub internal operator' }
      const data = await request(`/api/v1/dispatch/cases/${encodeURIComponent(state.caseId)}`, { method: 'PUT', body: JSON.stringify({ status: state.caseStatus, approval: state.approval, payload }) })
      setStorageMode(data.storageMode || '—'); setSyncMessage(`${t.saved}: ${new Date(data.case.updatedAt).toLocaleString(lang === 'de' ? 'de-DE' : 'sr-RS')}`); await refreshCases()
    } catch (error) { setSyncMessage(error.message === 'SESSION_EXPIRED' ? t.expired : error.message) }
    finally { setSyncState('idle') }
  }

  const loadCase = async caseId => {
    setSyncState('loading'); setSyncMessage(t.loading)
    try {
      const data = await request(`/api/v1/dispatch/cases/${encodeURIComponent(caseId)}`)
      dispatch({ type: 'LOAD', caseId: data.case.caseId, status: data.case.status, approval: data.case.approval, payload: data.case.payload })
      setStorageMode(data.storageMode || '—'); setSyncMessage(`${t.loaded}: ${data.case.caseId}`)
    } catch (error) { setSyncMessage(error.message === 'SESSION_EXPIRED' ? t.expired : error.message) }
    finally { setSyncState('idle') }
  }

  const logout = async () => { await request('/api/v1/dispatch/logout', { method: 'POST', body: '{}' }).catch(() => {}); location.reload() }
  const addNote = () => { dispatch({ type: 'ADD_NOTE', note }); setNote('') }

  return <main className="dpw-shell dpw-v4 dpw-v5">
    <header className="dpw-header">
      <div><p className="dpw-kicker">{t.kicker}</p><h1>DaniniHub Dispatch Pilot Workspace</h1><p>{t.intro}</p></div>
      <div className="dpw-v5-top"><div className="dpw-v5-lang"><button className={lang === 'sr' ? 'active' : ''} onClick={() => changeLanguage('sr')}>SR</button><button className={lang === 'de' ? 'active' : ''} onClick={() => changeLanguage('de')}>DE</button></div><div className="dpw-header-actions"><button type="button" onClick={saveCase} disabled={busy}>{t.save}</button><button className="dpw-secondary" onClick={() => dispatch({ type: 'RESET', payload: createInitialState(lang) })}>{t.newCase}</button><button className="dpw-secondary" onClick={logout}>{t.logout}</button></div></div>
    </header>

    <section className="dpw-card dpw-status-bar"><div><strong>{t.storage}:</strong> {storageMode}</div><div><strong>{t.status}:</strong> {syncMessage}</div></section>
    <section className="dpw-v4-steps"><article><strong>1</strong><span>{t.step1}</span></article><article><strong>2</strong><span>{t.step2}</span></article><article><strong>3</strong><span>{t.step3}</span></article></section>

    <section className="dpw-card dpw-v4-step dpw-v4-primary-step"><div className="dpw-v4-step-title"><span>1</span><div><h2>{t.step1}</h2><p>{t.step1Sub}</p></div></div><div className="dpw-case-controls"><label>{t.caseId}<input value={state.caseId} onChange={e => dispatch({ type: 'UPDATE', field: 'caseId', value: e.target.value.toUpperCase() })}/></label><label>{t.route}<input value={state.route} onChange={e => dispatch({ type: 'UPDATE', field: 'route', value: e.target.value })}/></label><label>{t.vehicle}<input value={state.vehicle} onChange={e => dispatch({ type: 'UPDATE', field: 'vehicle', value: e.target.value })}/></label><label>{t.caseStatus}<select value={state.caseStatus} onChange={e => dispatch({ type: 'UPDATE', field: 'caseStatus', value: e.target.value })}><option>DRAFT</option><option>IN_REVIEW</option><option>CLOSED</option></select></label></div><label className="dpw-v4-wide-label">{t.raw}<textarea value={state.rawMessage} onChange={e => dispatch({ type: 'UPDATE', field: 'rawMessage', value: e.target.value })} rows="5"/></label><button className="dpw-v4-main-action" onClick={structureCase} disabled={busy}>{syncState === 'structuring' ? t.structuring : t.structure}</button><p className="dpw-lock">{t.pending}</p></section>

    <section className="dpw-card dpw-v4-step"><div className="dpw-v4-step-title"><span>2</span><div><h2>{t.step2}</h2><p>{t.step2Sub}</p></div></div><section className="dpw-grid"><ListEditor title={t.facts} items={state.facts} onChange={value => dispatch({ type: 'UPDATE', field: 'facts', value })}/><ListEditor title={t.unknowns} items={state.unknowns} onChange={value => dispatch({ type: 'UPDATE', field: 'unknowns', value })}/><section className="dpw-card"><h3>{t.riskControl}</h3><label>{t.risk}<select value={state.risk} onChange={e => dispatch({ type: 'UPDATE', field: 'risk', value: e.target.value })}><option>NIZAK</option><option>SREDNJI</option><option>VISOK</option><option>KRITIČAN</option></select></label><label>{t.nextCheck}<input value={state.nextCheck} onChange={e => dispatch({ type: 'UPDATE', field: 'nextCheck', value: e.target.value })}/></label></section></section><section className="dpw-grid dpw-grid-two"><section className="dpw-card"><h3>{t.decision}</h3><label>{t.decisionLabel}<textarea value={state.decisionRequired} onChange={e => dispatch({ type: 'UPDATE', field: 'decisionRequired', value: e.target.value })} rows="4"/></label><label>{t.owner}<input value={state.decisionOwner} onChange={e => dispatch({ type: 'UPDATE', field: 'decisionOwner', value: e.target.value })}/></label></section><section className="dpw-card"><h3>{t.draft}</h3><textarea value={state.draftMessage} onChange={e => dispatch({ type: 'UPDATE', field: 'draftMessage', value: e.target.value })} rows="9"/></section></section></section>

    <section className="dpw-card dpw-v4-step"><div className="dpw-v4-step-title"><span>3</span><div><h2>{t.step3}</h2><p>{t.step3Sub}</p></div></div><div className="dpw-v4-decision-grid"><button className="dpw-v4-approve" onClick={() => dispatch({ type: 'APPROVE', event: t.approvedEvent })}>{t.approve}</button><button className="dpw-v4-reject" onClick={() => dispatch({ type: 'REJECT', event: t.rejectedEvent })}>{t.reject}</button></div><div className="dpw-v4-status-card"><span>{t.approvalStatus}</span><strong>{state.approval}</strong></div><button className="dpw-v4-main-action" onClick={saveCase} disabled={busy}>{syncState === 'saving' ? t.saving : t.saveCase}</button><p className="dpw-lock">{t.noSend}</p></section>

    <section className="dpw-grid dpw-grid-two"><section className="dpw-card"><h2>{t.savedCases}</h2>{savedCases.length ? <div className="dpw-saved-list">{savedCases.map(item => <button key={item.caseId} onClick={() => loadCase(item.caseId)} disabled={busy}><strong>{item.caseId}</strong><span>{item.status} · {item.approval}</span></button>)}</div> : <p>{t.noCases}</p>}</section><section className="dpw-card"><h2>{t.audit}</h2><ol className="dpw-audit">{state.audit.map((entry, index) => <li key={`${entry.time}-${index}`}><time>{entry.time}</time><span>{entry.event}</span></li>)}</ol><div className="dpw-note"><input value={note} onChange={e => setNote(e.target.value)} placeholder={t.note}/><button onClick={addNote}>{t.add}</button></div></section></section>
    <section className="dpw-card"><h2>{t.handover}</h2><textarea readOnly value={handover} rows="15"/><p>{t.handoverNote}</p></section>
  </main>
}
