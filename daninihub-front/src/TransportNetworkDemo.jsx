import { useEffect, useState } from 'react'
import './TransportNetworkDemo.css'

const text = {
  de: {
    title: 'DaniniHub Transport Network', sub: 'Fiktiver Unternehmensbereich mit Firmenprofil, Team und mehreren Transport Rooms.', choose: 'Demo-Unternehmen wählen', dach: 'DACH Auftraggeber', balkan: 'Balkan Frachtführer',
    company: 'Unternehmensprofil', members: 'Team & Partner', rooms: 'Meine Transport Rooms', administration: 'Administration', newMember: 'Mitglied hinzufügen', newRoom: 'Neuen Transport Room erstellen',
    name: 'Name', email: 'E-Mail', role: 'Rolle', route: 'Relation', partner: 'Partnerunternehmen', create: 'Erstellen', logout: 'Unternehmen wechseln', status: 'Status', risk: 'Risiko', eta: 'ETA', storage: 'Speicher',
    openRoom: 'Transport Room öffnen', opening: 'Wird geöffnet…', openError: 'Dieser Transport Room konnte nicht geöffnet werden.', existingHelp: 'Bestehende Fälle werden direkt über die jeweilige Karte geöffnet. Kein Formular ist erforderlich.',
    memberHelp: 'Hier verwalten Sie nur fiktive Teammitglieder der Demo-Firma. Diese Angaben sind für das Öffnen eines Transport Rooms nicht erforderlich.', roomHelp: 'Hier wird ausschließlich ein neuer fiktiver Transportfall angelegt. Bestehende Räume bleiben unverändert.',
    errorCode: 'Fehlercode', addMember: 'Neues Teammitglied', companyInfo: 'Firmendaten', roomCount: 'Transport Rooms', teamCount: 'Teammitglieder', ownerOnly: 'Nur Demo-Administration',
    sessionExpired: 'Die vorherige Demo-Sitzung ist abgelaufen. Bitte wählen Sie das Unternehmen erneut.'
  },
  sr: {
    title: 'DaniniHub Transport Network', sub: 'Fiktivni kompanijski prostor sa profilom firme, timom i više transportnih soba.', choose: 'Izaberite demo kompaniju', dach: 'DACH naručilac', balkan: 'Balkan prevoznik',
    company: 'Profil kompanije', members: 'Tim i partneri', rooms: 'Moje transportne sobe', administration: 'Administracija', newMember: 'Dodaj člana', newRoom: 'Kreiraj novu transportnu sobu',
    name: 'Ime', email: 'E-mail', role: 'Uloga', route: 'Relacija', partner: 'Partnerska firma', create: 'Kreiraj', logout: 'Promeni kompaniju', status: 'Status', risk: 'Rizik', eta: 'ETA', storage: 'Skladište',
    openRoom: 'Otvori transportnu sobu', opening: 'Otvaram…', openError: 'Ova transportna soba nije mogla da se otvori.', existingHelp: 'Postojeći slučaj se otvara direktno preko njegove kartice. Ne popunjava se nijedna forma.',
    memberHelp: 'Ovde se upravlja samo fiktivnim članovima demo firme. Ovi podaci nisu potrebni za otvaranje transportne sobe.', roomHelp: 'Ovde se kreira isključivo novi fiktivni transportni slučaj. Postojeće sobe se ne menjaju.',
    errorCode: 'Kod greške', addMember: 'Novi član tima', companyInfo: 'Podaci firme', roomCount: 'Transportne sobe', teamCount: 'Članovi tima', ownerOnly: 'Samo demo administracija',
    sessionExpired: 'Prethodna demo sesija je istekla. Ponovo izaberite kompaniju.'
  }
}

const clearNetworkSession = () => {
  sessionStorage.removeItem('tn-token')
}

export default function TransportNetworkDemo({ lang }) {
  const t = text[lang]
  const [token, setToken] = useState(sessionStorage.getItem('tn-token') || '')
  const [data, setData] = useState(null)
  const [state, setState] = useState('idle')
  const [opening, setOpening] = useState('')
  const [errorCode, setErrorCode] = useState('')
  const [notice, setNotice] = useState('')
  const [view, setView] = useState('rooms')

  const auth = active => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${active || token}` })

  const resetAccess = (message = '') => {
    clearNetworkSession()
    setToken('')
    setData(null)
    setState('idle')
    setErrorCode('')
    setOpening('')
    setView('rooms')
    setNotice(message)
  }

  const load = async active => {
    const accessToken = active || token
    if (!accessToken) return
    setState('loading')
    try {
      const response = await fetch('/api/v1/transport-network/workspace', { headers: { Authorization: `Bearer ${accessToken}` } })
      const payload = await response.json().catch(() => ({}))
      if (response.status === 401 || payload.error === 'NETWORK_ACCESS_REQUIRED') {
        resetAccess(t.sessionExpired)
        return
      }
      if (!response.ok) throw new Error(payload.error || `HTTP_${response.status}`)
      if (!payload.company || !Array.isArray(payload.rooms) || !Array.isArray(payload.members)) throw new Error('INVALID_NETWORK_WORKSPACE')
      setData(payload)
      setState('idle')
      setErrorCode('')
      setNotice('')
    } catch (error) {
      setErrorCode(error.message)
      setState('error')
    }
  }

  useEffect(() => { if (token) load(token) }, [])

  const enter = async companyId => {
    setState('loading')
    setNotice('')
    try {
      const response = await fetch('/api/v1/transport-network/access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ companyId }) })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok || !payload.token) throw new Error(payload.error || `HTTP_${response.status}`)
      sessionStorage.setItem('tn-token', payload.token)
      setToken(payload.token)
      await load(payload.token)
    } catch (error) {
      clearNetworkSession()
      setToken('')
      setErrorCode(error.message)
      setState('error')
    }
  }

  const logout = () => resetAccess()

  const addMember = async event => {
    event.preventDefault()
    const body = Object.fromEntries(new FormData(event.currentTarget))
    const response = await fetch('/api/v1/transport-network/members', { method: 'POST', headers: auth(), body: JSON.stringify(body) })
    if (response.status === 401 || response.status === 403) return resetAccess(t.sessionExpired)
    if (response.ok) {
      event.currentTarget.reset()
      load()
    } else {
      const payload = await response.json().catch(() => ({}))
      setErrorCode(payload.error || `HTTP_${response.status}`)
    }
  }

  const addRoom = async event => {
    event.preventDefault()
    const body = Object.fromEntries(new FormData(event.currentTarget))
    const response = await fetch('/api/v1/transport-network/rooms', { method: 'POST', headers: auth(), body: JSON.stringify(body) })
    if (response.status === 401 || response.status === 403) return resetAccess(t.sessionExpired)
    if (response.ok) {
      event.currentTarget.reset()
      await load()
      setView('rooms')
    } else {
      const payload = await response.json().catch(() => ({}))
      setErrorCode(payload.error || `HTTP_${response.status}`)
    }
  }

  const openRoom = async caseId => {
    setOpening(caseId)
    setState('idle')
    setErrorCode('')
    for (const key of ['tr-token', 'tr-role', 'tr-identity', 'tr-case']) sessionStorage.removeItem(key)
    const target = lang === 'sr' ? '/sr/transportna-soba-demo' : '/de/transport-room-demo'
    const fallbackRole = data?.company?.type === 'BALKAN_CARRIER' ? 'BALKAN_CARRIER' : 'DACH_CUSTOMER'
    try {
      const response = await fetch(`/api/v1/transport-network/rooms/${encodeURIComponent(caseId)}/open`, { method: 'POST', headers: auth() })
      const payload = await response.json().catch(() => ({}))
      if (response.status === 401 || payload.error === 'NETWORK_ACCESS_REQUIRED') return resetAccess(t.sessionExpired)
      if (!response.ok || !payload.token || payload.caseId !== caseId) throw new Error(payload.error || `HTTP_${response.status}`)
      sessionStorage.setItem('tr-token', payload.token)
      sessionStorage.setItem('tr-role', payload.role)
      sessionStorage.setItem('tr-identity', payload.identity)
      sessionStorage.setItem('tr-case', payload.caseId)
      window.location.assign(`${target}?case=${encodeURIComponent(payload.caseId)}&role=${encodeURIComponent(payload.role)}`)
    } catch (error) {
      console.error('Transport Room open failed:', error)
      setErrorCode(error.message || 'ROOM_OPEN_FAILED')
      setOpening('')
      setState('open-error')
      window.location.assign(`${target}?case=${encodeURIComponent(caseId)}&role=${encodeURIComponent(fallbackRole)}&fallback=1`)
    }
  }

  if (!token) return <main className="tn-shell"><section className="tn-card tn-access"><h1>{t.title}</h1><p>{t.sub}</p>{notice && <p className="tn-help">{notice}</p>}{state === 'error' && errorCode && <p className="tn-error">{t.errorCode}: {errorCode}</p>}<h2>{t.choose}</h2><div className="tn-choice"><button onClick={() => enter('CMP-DACH-001')}>{t.dach}</button><button onClick={() => enter('CMP-BALKAN-001')}>{t.balkan}</button></div></section></main>
  if (!data) return <main className="tn-shell"><section className="tn-card"><p>{state === 'loading' ? 'Loading…' : 'Workspace unavailable.'}</p>{errorCode && <p className="tn-error">{t.errorCode}: {errorCode}</p>}<button onClick={logout}>{t.logout}</button></section></main>

  const company = data.company || {}
  const members = Array.isArray(data.members) ? data.members : []
  const rooms = Array.isArray(data.rooms) ? data.rooms : []
  const routes = Array.isArray(company.routes) ? company.routes : []
  const partners = company.companyId === 'CMP-DACH-001'
    ? [{ id: 'CMP-BALKAN-001', name: 'Danube Logistics Demo d.o.o.' }]
    : [{ id: 'CMP-DACH-001', name: 'RheinCargo Demo GmbH' }]

  return <main className="tn-shell">
    <header className="tn-head"><div><p className="tn-kicker">DANINIHUB · COMPANY WORKSPACE</p><h1>{t.title}</h1><p>{company.name || 'Demo company'} · {company.city || '—'}, {company.country || '—'}</p></div><div><span>{data.memberRole || 'VIEWER'} · {data.identity || 'demo'}</span><button onClick={logout}>{t.logout}</button></div></header>

    <section className="tn-overview"><article><small>{t.roomCount}</small><strong>{rooms.length}</strong></article><article><small>{t.teamCount}</small><strong>{members.length}</strong></article><article><small>{t.status}</small><strong>{company.status || 'DEMO'}</strong></article></section>

    <nav className="tn-workspace-nav" aria-label={lang === 'sr' ? 'Sekcije kompanijskog prostora' : 'Bereiche des Unternehmensraums'}><button className={view === 'rooms' ? 'active' : ''} onClick={() => setView('rooms')}>{t.rooms}</button><button className={view === 'team' ? 'active' : ''} onClick={() => setView('team')}>{t.members}</button><button className={view === 'admin' ? 'active' : ''} onClick={() => setView('admin')}>{t.administration}</button></nav>

    {view === 'rooms' && <section className="tn-card"><h2>{t.rooms}</h2><p className="tn-help">{t.existingHelp}</p>{state === 'open-error' && <p className="tn-error">{t.openError} {errorCode && <>· {t.errorCode}: {errorCode}</>}</p>}<div className="tn-rooms">{rooms.map(room => <article key={room.caseId}><small>{room.caseId}</small><h3>{room.route || '—'}</h3><p>{t.status}: <b>{room.status || '—'}</b></p><p>{t.eta}: <b>{room.eta || '—'}</b> · {t.risk}: <b>{room.risk || '—'}</b></p><button onClick={() => openRoom(room.caseId)} disabled={opening === room.caseId}>{opening === room.caseId ? t.opening : t.openRoom} →</button></article>)}</div></section>}

    {view === 'team' && <section className="tn-grid"><article className="tn-card"><h2>{t.companyInfo}</h2><dl><div><dt>ID</dt><dd>{company.companyId || '—'}</dd></div><div><dt>Type</dt><dd>{company.type || '—'}</dd></div><div><dt>Status</dt><dd>{company.status || '—'}</dd></div><div><dt>Documents</dt><dd>{company.documentStatus || '—'}</dd></div><div><dt>Routes</dt><dd>{routes.length ? routes.join(' · ') : '—'}</dd></div><div><dt>{t.storage}</dt><dd>{data.storageMode || '—'}</dd></div></dl></article><article className="tn-card"><h2>{t.members}</h2><p className="tn-help">{t.memberHelp}</p><div className="tn-list">{members.map(member => <div key={member.memberId}><strong>{member.name}</strong><span>{member.email}</span><b>{member.role}</b></div>)}</div><details className="tn-admin-details"><summary>{t.addMember}</summary><form onSubmit={addMember}><input name="name" placeholder={t.name} required/><input name="email" type="email" placeholder={t.email} required/><select name="role"><option>DISPATCHER</option><option>VIEWER</option></select><button>{t.create}</button></form></details></article></section>}

    {view === 'admin' && <section className="tn-card tn-admin-panel"><span className="tn-admin-badge">{t.ownerOnly}</span><h2>{t.newRoom}</h2><p className="tn-help">{t.roomHelp}</p><form className="tn-room-form" onSubmit={addRoom}><label>{t.route}<input name="route" placeholder="Duisburg → Novi Sad" required/></label><label>{t.partner}<select name="partnerCompanyId">{partners.map(partner => <option key={partner.id} value={partner.id}>{partner.name}</option>)}</select></label><button>{t.newRoom}</button></form></section>}
  </main>
}
