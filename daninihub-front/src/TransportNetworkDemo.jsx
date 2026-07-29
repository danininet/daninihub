import { useEffect, useState } from 'react'
import './TransportNetworkDemo.css'

const text={
 de:{title:'DaniniHub Transport Network',sub:'Fiktiver Unternehmensbereich mit Firmenprofil, Team und mehreren Transport Rooms.',choose:'Demo-Unternehmen wählen',dach:'DACH Auftraggeber',balkan:'Balkan Frachtführer',company:'Unternehmensprofil',members:'Teammitglieder',rooms:'Transport Rooms',newMember:'Mitglied hinzufügen',newRoom:'Transport Room erstellen',name:'Name',email:'E-Mail',role:'Rolle',route:'Relation',partner:'Partnerunternehmen',create:'Erstellen',logout:'Unternehmen wechseln',status:'Status',risk:'Risiko',eta:'ETA',storage:'Speicher',openRoom:'Transport Room öffnen',opening:'Wird geöffnet…',openError:'Dieser Transport Room konnte nicht geöffnet werden.',existingHelp:'Zum Öffnen eines bestehenden Falls ist kein Formular nötig. Klicken Sie nur auf „Transport Room öffnen“.',memberHelp:'Nur für den Demo-Firmeninhaber: fügt ein fiktives Teammitglied hinzu.',roomHelp:'Nur für neue fiktive Fälle: Relation und Partner wählen. Bestehende Räume bleiben unverändert.',errorCode:'Fehlercode'},
 sr:{title:'DaniniHub Transport Network',sub:'Fiktivni kompanijski prostor sa profilom firme, timom i više transportnih soba.',choose:'Izaberite demo kompaniju',dach:'DACH naručilac',balkan:'Balkan prevoznik',company:'Profil kompanije',members:'Članovi tima',rooms:'Transportne sobe',newMember:'Dodaj člana',newRoom:'Kreiraj transportnu sobu',name:'Ime',email:'E-mail',role:'Uloga',route:'Relacija',partner:'Partnerska firma',create:'Kreiraj',logout:'Promeni kompaniju',status:'Status',risk:'Rizik',eta:'ETA',storage:'Skladište',openRoom:'Otvori transportnu sobu',opening:'Otvaram…',openError:'Ova transportna soba nije mogla da se otvori.',existingHelp:'Za otvaranje postojeće sobe ne popunjava se nijedna forma. Kliknite samo na „Otvori transportnu sobu“.',memberHelp:'Samo za vlasnika demo firme: dodaje fiktivnog člana tima.',roomHelp:'Samo za novi fiktivni slučaj: unesite relaciju i izaberite partnera. Postojeće sobe se ne menjaju.',errorCode:'Kod greške'}
}

export default function TransportNetworkDemo({lang}){
 const t=text[lang], [token,setToken]=useState(sessionStorage.getItem('tn-token')||''), [data,setData]=useState(null), [state,setState]=useState('idle'), [opening,setOpening]=useState(''), [errorCode,setErrorCode]=useState('')
 const auth=active=>({'Content-Type':'application/json','Authorization':`Bearer ${active||token}`})
 const load=async active=>{setState('loading');try{const r=await fetch('/api/v1/transport-network/workspace',{headers:{Authorization:`Bearer ${active||token}`}});const x=await r.json().catch(()=>({}));if(!r.ok)throw new Error(x.error||`HTTP_${r.status}`);setData(x);setState('idle');setErrorCode('')}catch(error){setErrorCode(error.message);setState('error')}}
 useEffect(()=>{if(token)load(token)},[])
 const enter=async companyId=>{setState('loading');try{const r=await fetch('/api/v1/transport-network/access',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({companyId})});const x=await r.json().catch(()=>({}));if(!r.ok)throw new Error(x.error||`HTTP_${r.status}`);sessionStorage.setItem('tn-token',x.token);setToken(x.token);await load(x.token)}catch(error){setErrorCode(error.message);setState('error')}}
 const logout=()=>{sessionStorage.removeItem('tn-token');setToken('');setData(null);setState('idle');setErrorCode('')}
 const addMember=async e=>{e.preventDefault();const body=Object.fromEntries(new FormData(e.currentTarget));const r=await fetch('/api/v1/transport-network/members',{method:'POST',headers:auth(),body:JSON.stringify(body)});if(r.ok){e.currentTarget.reset();load()}else{const x=await r.json().catch(()=>({}));setErrorCode(x.error||`HTTP_${r.status}`)}}
 const addRoom=async e=>{e.preventDefault();const body=Object.fromEntries(new FormData(e.currentTarget));const r=await fetch('/api/v1/transport-network/rooms',{method:'POST',headers:auth(),body:JSON.stringify(body)});if(r.ok){e.currentTarget.reset();load()}else{const x=await r.json().catch(()=>({}));setErrorCode(x.error||`HTTP_${r.status}`)}}
 const openRoom=async caseId=>{
  setOpening(caseId);setState('idle');setErrorCode('')
  ;['tr-token','tr-role','tr-identity','tr-case'].forEach(key=>sessionStorage.removeItem(key))
  const target=lang==='sr'?'/sr/transportna-soba-demo':'/de/transport-room-demo'
  const fallbackRole=data?.company?.type==='BALKAN_CARRIER'?'BALKAN_CARRIER':'DACH_CUSTOMER'
  try{
   const r=await fetch(`/api/v1/transport-network/rooms/${encodeURIComponent(caseId)}/open`,{method:'POST',headers:auth()})
   const x=await r.json().catch(()=>({}))
   if(!r.ok||!x.token||x.caseId!==caseId)throw new Error(x.error||`HTTP_${r.status}`)
   sessionStorage.setItem('tr-token',x.token);sessionStorage.setItem('tr-role',x.role);sessionStorage.setItem('tr-identity',x.identity);sessionStorage.setItem('tr-case',x.caseId)
   window.location.assign(`${target}?case=${encodeURIComponent(x.caseId)}&role=${encodeURIComponent(x.role)}`)
  }catch(error){
   console.error('Transport Room open failed:',error)
   setErrorCode(error.message||'ROOM_OPEN_FAILED')
   setOpening('');setState('open-error')
   window.location.assign(`${target}?case=${encodeURIComponent(caseId)}&role=${encodeURIComponent(fallbackRole)}&fallback=1`)
  }
 }
 if(!token)return <main className="tn-shell"><section className="tn-card tn-access"><h1>{t.title}</h1><p>{t.sub}</p><h2>{t.choose}</h2><div className="tn-choice"><button onClick={()=>enter('CMP-DACH-001')}>{t.dach}</button><button onClick={()=>enter('CMP-BALKAN-001')}>{t.balkan}</button></div></section></main>
 if(!data)return <main className="tn-shell"><section className="tn-card"><p>{state==='loading'?'Loading…':'Workspace unavailable.'}</p>{errorCode&&<p className="tn-error">{t.errorCode}: {errorCode}</p>}<button onClick={logout}>{t.logout}</button></section></main>
 const partners=data.company.companyId==='CMP-DACH-001'?[{id:'CMP-BALKAN-001',name:'Danube Logistics Demo d.o.o.'}]:[{id:'CMP-DACH-001',name:'RheinCargo Demo GmbH'}]
 return <main className="tn-shell">
  <header className="tn-head"><div><p className="tn-kicker">DANINIHUB · COMPANY WORKSPACE</p><h1>{t.title}</h1><p>{data.company.name} · {data.company.city}, {data.company.country}</p></div><div><span>{data.memberRole} · {data.identity}</span><button onClick={logout}>{t.logout}</button></div></header>
  <section className="tn-card"><h2>{t.rooms}</h2><p className="tn-help">{t.existingHelp}</p>{state==='open-error'&&<p className="tn-error">{t.openError} {errorCode&&<>· {t.errorCode}: {errorCode}</>}</p>}<div className="tn-rooms">{data.rooms.map(r=><article key={r.caseId}><small>{r.caseId}</small><h3>{r.route}</h3><p>{t.status}: <b>{r.status}</b></p><p>{t.eta}: <b>{r.eta}</b> · {t.risk}: <b>{r.risk}</b></p><button onClick={()=>openRoom(r.caseId)} disabled={opening===r.caseId}>{opening===r.caseId?t.opening:t.openRoom} →</button></article>)}</div></section>
  <section className="tn-grid">
   <article className="tn-card"><h2>{t.company}</h2><dl><div><dt>ID</dt><dd>{data.company.companyId}</dd></div><div><dt>Type</dt><dd>{data.company.type}</dd></div><div><dt>Status</dt><dd>{data.company.status}</dd></div><div><dt>Documents</dt><dd>{data.company.documentStatus}</dd></div><div><dt>Routes</dt><dd>{data.company.routes.join(' · ')}</dd></div><div><dt>{t.storage}</dt><dd>{data.storageMode}</dd></div></dl></article>
   <article className="tn-card"><h2>{t.members}</h2><p className="tn-help">{t.memberHelp}</p><div className="tn-list">{data.members.map(m=><div key={m.memberId}><strong>{m.name}</strong><span>{m.email}</span><b>{m.role}</b></div>)}</div><form onSubmit={addMember}><input name="name" placeholder={t.name} required/><input name="email" type="email" placeholder={t.email} required/><select name="role"><option>DISPATCHER</option><option>VIEWER</option></select><button>{t.create}</button></form></article>
  </section>
  <section className="tn-card"><h2>{t.newRoom}</h2><p className="tn-help">{t.roomHelp}</p><form className="tn-room-form" onSubmit={addRoom}><input name="route" placeholder={t.route} required/><select name="partnerCompanyId">{partners.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select><button>{t.newRoom}</button></form></section>
 </main>
}