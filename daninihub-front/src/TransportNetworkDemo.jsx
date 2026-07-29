import { useEffect, useState } from 'react'
import './TransportNetworkDemo.css'

const text={
 de:{title:'DaniniHub Transport Network',sub:'Fiktiver Unternehmensbereich mit Firmenprofil, Team und mehreren Transport Rooms.',choose:'Demo-Unternehmen wählen',dach:'DACH Auftraggeber',balkan:'Balkan Frachtführer',open:'Workspace öffnen',company:'Unternehmensprofil',members:'Teammitglieder',rooms:'Transport Rooms',newMember:'Mitglied hinzufügen',newRoom:'Transport Room erstellen',name:'Name',email:'E-Mail',role:'Rolle',route:'Relation',partner:'Partnerunternehmen',create:'Erstellen',logout:'Unternehmen wechseln',status:'Status',risk:'Risiko',eta:'ETA',empty:'Keine Einträge.',storage:'Speicher'},
 sr:{title:'DaniniHub Transport Network',sub:'Fiktivni kompanijski prostor sa profilom firme, timom i više transportnih soba.',choose:'Izaberite demo kompaniju',dach:'DACH naručilac',balkan:'Balkan prevoznik',open:'Otvori radni prostor',company:'Profil kompanije',members:'Članovi tima',rooms:'Transportne sobe',newMember:'Dodaj člana',newRoom:'Kreiraj transportnu sobu',name:'Ime',email:'E-mail',role:'Uloga',route:'Relacija',partner:'Partnerska firma',create:'Kreiraj',logout:'Promeni kompaniju',status:'Status',risk:'Rizik',eta:'ETA',empty:'Nema podataka.',storage:'Skladište'}
}

export default function TransportNetworkDemo({lang}){
 const t=text[lang], [token,setToken]=useState(sessionStorage.getItem('tn-token')||''), [data,setData]=useState(null), [state,setState]=useState('idle')
 const auth=()=>({'Content-Type':'application/json','Authorization':`Bearer ${token}`})
 const load=async active=>{setState('loading');try{const r=await fetch('/api/v1/transport-network/workspace',{headers:{Authorization:`Bearer ${active||token}`}});if(!r.ok)throw new Error();setData(await r.json());setState('idle')}catch{setState('error')}}
 useEffect(()=>{if(token)load(token)},[])
 const enter=async companyId=>{setState('loading');try{const r=await fetch('/api/v1/transport-network/access',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({companyId})});if(!r.ok)throw new Error();const x=await r.json();sessionStorage.setItem('tn-token',x.token);setToken(x.token);await load(x.token)}catch{setState('error')}}
 const logout=()=>{sessionStorage.removeItem('tn-token');setToken('');setData(null);setState('idle')}
 const addMember=async e=>{e.preventDefault();const body=Object.fromEntries(new FormData(e.currentTarget));const r=await fetch('/api/v1/transport-network/members',{method:'POST',headers:auth(),body:JSON.stringify(body)});if(r.ok){e.currentTarget.reset();load()}}
 const addRoom=async e=>{e.preventDefault();const body=Object.fromEntries(new FormData(e.currentTarget));const r=await fetch('/api/v1/transport-network/rooms',{method:'POST',headers:auth(),body:JSON.stringify(body)});if(r.ok){e.currentTarget.reset();load()}}
 if(!token)return <main className="tn-shell"><section className="tn-card tn-access"><h1>{t.title}</h1><p>{t.sub}</p><h2>{t.choose}</h2><div className="tn-choice"><button onClick={()=>enter('CMP-DACH-001')}>{t.dach}</button><button onClick={()=>enter('CMP-BALKAN-001')}>{t.balkan}</button></div></section></main>
 if(!data)return <main className="tn-shell"><section className="tn-card"><p>{state==='loading'?'Loading…':'Workspace unavailable.'}</p><button onClick={logout}>{t.logout}</button></section></main>
 const partners=data.company.companyId==='CMP-DACH-001'?[{id:'CMP-BALKAN-001',name:'Danube Logistics Demo d.o.o.'}]:[{id:'CMP-DACH-001',name:'RheinCargo Demo GmbH'}]
 return <main className="tn-shell">
  <header className="tn-head"><div><p className="tn-kicker">DANINIHUB · COMPANY WORKSPACE</p><h1>{t.title}</h1><p>{data.company.name} · {data.company.city}, {data.company.country}</p></div><div><span>{data.memberRole} · {data.identity}</span><button onClick={logout}>{t.logout}</button></div></header>
  <section className="tn-grid">
   <article className="tn-card"><h2>{t.company}</h2><dl><div><dt>ID</dt><dd>{data.company.companyId}</dd></div><div><dt>Type</dt><dd>{data.company.type}</dd></div><div><dt>Status</dt><dd>{data.company.status}</dd></div><div><dt>Documents</dt><dd>{data.company.documentStatus}</dd></div><div><dt>Routes</dt><dd>{data.company.routes.join(' · ')}</dd></div><div><dt>{t.storage}</dt><dd>{data.storageMode}</dd></div></dl></article>
   <article className="tn-card"><h2>{t.members}</h2><div className="tn-list">{data.members.map(m=><div key={m.memberId}><strong>{m.name}</strong><span>{m.email}</span><b>{m.role}</b></div>)}</div><form onSubmit={addMember}><input name="name" placeholder={t.name} required/><input name="email" type="email" placeholder={t.email} required/><select name="role"><option>DISPATCHER</option><option>VIEWER</option></select><button>{t.create}</button></form></article>
  </section>
  <section className="tn-card"><h2>{t.rooms}</h2><div className="tn-rooms">{data.rooms.map(r=><article key={r.caseId}><small>{r.caseId}</small><h3>{r.route}</h3><p>{t.status}: <b>{r.status}</b></p><p>{t.eta}: <b>{r.eta}</b> · {t.risk}: <b>{r.risk}</b></p><a href={lang==='sr'?'/sr/transportna-soba-demo':'/de/transport-room-demo'}>Open Transport Room →</a></article>)}</div><form className="tn-room-form" onSubmit={addRoom}><input name="route" placeholder={t.route} required/><select name="partnerCompanyId">{partners.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select><button>{t.newRoom}</button></form></section>
 </main>
}
