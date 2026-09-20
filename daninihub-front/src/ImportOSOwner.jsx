import {useState} from 'react'
import './ImportOSOwner.css'

const SERVICES=['FIELD_CHECK_LIVE','PRO_MECHANIC_CHECK','DRIVER_ONLY','TRAILER_TRANSPORT','TRUCK_TRANSPORT','ORIGINAL_PARTS','IMPORT_BASE']

export default function ImportOSOwner(){
  const [secret,setSecret]=useState('')
  const [form,setForm]=useState({email:'',name:'',serviceType:'FIELD_CHECK_LIVE',amountEur:'',description:'',serviceDate:'',language:'de',expiresInHours:72})
  const [quote,setQuote]=useState(null)
  const [ref,setRef]=useState('')
  const [actionState,setActionState]=useState('')
  const set=(k,v)=>setForm(x=>({...x,[k]:v}))

  async function createQuote(e){
    e.preventDefault();setActionState('loading')
    try{
      const r=await fetch('/api/importos/admin/quotes',{method:'POST',headers:{'Content-Type':'application/json','X-Danini-Admin':secret},body:JSON.stringify(form)})
      const p=await r.json();if(!r.ok)throw new Error(p.error||'QUOTE_FAILED')
      setQuote(p);setRef(p.quote.reference);setActionState('created')
    }catch(e){setActionState(e.message)}
  }
  async function doAction(action){
    if(!ref)return
    setActionState('loading:'+action)
    try{
      const r=await fetch('/api/importos/admin/quotes/'+encodeURIComponent(ref)+'/'+action,{method:'POST',headers:{'Content-Type':'application/json','X-Danini-Admin':secret},body:'{}'})
      const p=await r.json();if(!r.ok)throw new Error(p.error||'ACTION_FAILED')
      setActionState(JSON.stringify(p))
    }catch(e){setActionState(e.message)}
  }

  return <div className="ioo">
    <header><a href="/de/"><img src="/importos-mark.svg" alt=""/><span><strong>DANINI</strong><small>OWNER QUOTE DESK</small></span></a></header>
    <main>
      <p className="ioo-kicker">INTERNAL · NOINDEX</p>
      <h1>Service Quote & Payment Control</h1>
      <p className="ioo-note">Ovde se kreira konkretna ponuda. Klijentu se šalje booking link. On autorizuje karticu ili PayPal. Posle izvršene usluge bira se Capture; ako usluga nije izvršena, Void oslobađa rezervaciju.</p>

      <label className="ioo-secret">Admin secret<input type="password" value={secret} onChange={e=>setSecret(e.target.value)} autoComplete="off"/></label>

      <form onSubmit={createQuote}>
        <label>Email<input required type="email" value={form.email} onChange={e=>set('email',e.target.value)}/></label>
        <label>Ime / firma<input value={form.name} onChange={e=>set('name',e.target.value)}/></label>
        <label>Usluga<select value={form.serviceType} onChange={e=>set('serviceType',e.target.value)}>{SERVICES.map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Iznos EUR<input required type="number" min="5" step="0.01" value={form.amountEur} onChange={e=>set('amountEur',e.target.value)}/></label>
        <label>Termin<input type="datetime-local" value={form.serviceDate} onChange={e=>set('serviceDate',e.target.value)}/></label>
        <label>Rok ponude (h)<input type="number" min="1" max="168" value={form.expiresInHours} onChange={e=>set('expiresInHours',e.target.value)}/></label>
        <label>Jezik<select value={form.language} onChange={e=>set('language',e.target.value)}><option value="de">DE</option><option value="sr">SR</option></select></label>
        <label className="wide">Opis<textarea required value={form.description} onChange={e=>set('description',e.target.value)}/></label>
        <button className="wide">Create secure quote</button>
      </form>

      {quote&&<section className="ioo-result">
        <span>{quote.quote.reference}</span>
        <strong>{(quote.quote.amountCents/100).toFixed(2)} €</strong>
        <a href={quote.bookingUrl} target="_blank" rel="noreferrer">{quote.bookingUrl}</a>
      </section>}

      <section className="ioo-actions">
        <h2>Capture / Release</h2>
        <label>Quote reference<input value={ref} onChange={e=>setRef(e.target.value)}/></label>
        <div><button onClick={()=>doAction('capture')}>CAPTURE AFTER SERVICE</button><button className="void" onClick={()=>doAction('void')}>VOID / RELEASE</button></div>
        {actionState&&<pre>{actionState}</pre>}
      </section>
    </main>
  </div>
}
