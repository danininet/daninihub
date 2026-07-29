'use strict';

const express = require('express');
const { createContactLeadStore } = require('./contact-lead-store');
const { adminAuthorized } = require('./server-admin-runtime');

const SOURCES = ['capacity-truck', 'capacity-freight'];
const STATUSES = [
  'NEW',
  'DATA_MISSING',
  'VERIFIED',
  'SEARCHING_MATCH',
  'POSSIBLE_MATCH',
  'WAITING_CONSENT',
  'CONTACTS_CONNECTED',
  'REJECTED',
  'EXPIRED',
  'CLOSED'
];

function requireAdmin(req, res, next) {
  if (!adminAuthorized(req)) return res.status(401).json({ ok:false, error:'ADMIN_NOT_AUTHORIZED' });
  return next();
}

function normalizeStatus(value) {
  const status = String(value || '').trim().toUpperCase();
  return STATUSES.includes(status) ? status : null;
}

function publicSignal(lead) {
  const payload = lead.payload && typeof lead.payload === 'object' ? lead.payload : lead;
  return {
    reference: lead.reference,
    kind: lead.source === 'capacity-truck' ? 'TRUCK' : 'FREIGHT',
    language: lead.language,
    company: lead.company,
    email: lead.email,
    phone: payload.phone || lead.phone || '',
    contactName: payload.name || lead.name || '',
    status: normalizeStatus(lead.status) || 'NEW',
    note: lead.reviewNote || '',
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
    route: payload.routes || lead.routes || '',
    summary: payload.message || lead.message || '',
    payload
  };
}

function counts(signals) {
  return signals.reduce((result, signal) => {
    result.total += 1;
    result[signal.kind] += 1;
    result[signal.status] = (result[signal.status] || 0) + 1;
    return result;
  }, { total:0, TRUCK:0, FREIGHT:0 });
}

function renderSignalDesk() {
  return `<!doctype html><html lang="sr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>DaniniHub Signal Desk</title><style>
  *{box-sizing:border-box}body{margin:0;background:#07131f;color:#eaf2f5;font-family:Inter,Arial,sans-serif}.wrap{max-width:1320px;margin:auto;padding:28px 18px 70px}.brand{font-size:13px;font-weight:900;letter-spacing:.12em;color:#67d7e4}h1{margin:10px 0 4px;font-size:clamp(34px,5vw,54px)}p{color:#b9c9d2}.auth,.filters,.stats,.signal-head,.actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.auth{margin:22px 0}.auth input,.filters input,.filters select,textarea,select,button{font:inherit;border:1px solid #3a5262;border-radius:10px;background:#0d2030;color:#fff;padding:11px 12px}button{background:#0d8b98;border-color:#0d8b98;font-weight:800;cursor:pointer}.secondary{background:#193245;border-color:#36556b}.msg{min-height:24px;color:#ffb4a4}.stats{margin:20px 0}.stat{min-width:140px;padding:16px;border:1px solid #284354;border-radius:14px;background:#0b1d2b}.stat strong{display:block;font-size:28px}.stat span{color:#9eb4bf}.filters{margin:20px 0}.filters input{min-width:250px;flex:1}.list{display:grid;gap:16px}.signal{border:1px solid #29495b;border-radius:17px;background:#0b1c2a;padding:18px}.signal-head{justify-content:space-between;align-items:flex-start}.tag{display:inline-block;padding:5px 9px;border-radius:999px;background:#123848;color:#8ee8f2;font-size:12px;font-weight:900}.ref{font-family:ui-monospace,monospace;color:#a8c0cb}.signal h2{margin:8px 0 4px;font-size:22px}.meta{display:flex;gap:16px;flex-wrap:wrap;color:#a9bdc7;font-size:14px}.summary{margin-top:14px;padding:13px;border-radius:10px;background:#071722;white-space:pre-wrap;color:#dce8ed;max-height:230px;overflow:auto}.edit{display:grid;grid-template-columns:minmax(180px,.35fr) 1fr auto;gap:10px;margin-top:14px;align-items:start}.edit textarea{min-height:78px;resize:vertical}.empty{padding:28px;border:1px dashed #3a5262;border-radius:14px;text-align:center}.small{font-size:12px;color:#8fa8b4}@media(max-width:760px){.edit{grid-template-columns:1fr}.auth input,.filters input{width:100%;min-width:0}.signal-head{display:block}.signal-head>div:last-child{margin-top:10px}}
  </style></head><body><main class="wrap"><div class="brand">DANINIHUB · INTERNAL</div><h1>Signal Desk</h1><p>Ručna obrada slobodnih kamiona i tereta koji čekaju. Nema automatskog povezivanja ni ugovaranja.</p><div class="auth"><input id="key" type="password" placeholder="DANINI_ADMIN_SECRET"><button id="load">Učitaj signale</button></div><div id="msg" class="msg"></div><section id="stats" class="stats"></section><section class="filters"><select id="kind"><option value="">Sve vrste</option><option value="TRUCK">Kamioni</option><option value="FREIGHT">Tereti</option></select><select id="status"><option value="">Svi statusi</option>${STATUSES.map(status=>`<option value="${status}">${status}</option>`).join('')}</select><input id="search" placeholder="Pretraži firmu, relaciju ili referencu"></section><section id="list" class="list"></section></main><script>(()=>{
  const key=document.getElementById('key'),msg=document.getElementById('msg'),stats=document.getElementById('stats'),list=document.getElementById('list'),kind=document.getElementById('kind'),status=document.getElementById('status'),search=document.getElementById('search');let signals=[];
  key.value=sessionStorage.getItem('danini_signal_admin_secret')||'';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function request(path,options={}){const response=await fetch(path,{...options,headers:{'Content-Type':'application/json','x-danini-admin-secret':key.value,...(options.headers||{})}});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'Greška');return data}
  function render(){const q=search.value.toLowerCase().trim();const filtered=signals.filter(s=>(!kind.value||s.kind===kind.value)&&(!status.value||s.status===status.value)&&(!q||[s.reference,s.company,s.route,s.summary].join(' ').toLowerCase().includes(q)));const summary={ukupno:signals.length,kamioni:signals.filter(s=>s.kind==='TRUCK').length,tereti:signals.filter(s=>s.kind==='FREIGHT').length,moguca_podudaranja:signals.filter(s=>s.status==='POSSIBLE_MATCH').length};stats.innerHTML=Object.entries(summary).map(([label,value])=>'<div class="stat"><strong>'+value+'</strong><span>'+esc(label.replaceAll('_',' '))+'</span></div>').join('');list.innerHTML=filtered.length?filtered.map(s=>'<article class="signal"><div class="signal-head"><div><span class="tag">'+(s.kind==='TRUCK'?'SLOBODAN KAMION':'TERET')+'</span><h2>'+esc(s.company)+'</h2><div class="ref">'+esc(s.reference)+'</div></div><div class="small">'+esc(new Date(s.createdAt).toLocaleString())+'</div></div><div class="meta"><span>'+esc(s.contactName||'—')+'</span><span>'+esc(s.email)+'</span><span>'+esc(s.phone||'—')+'</span><span>'+esc(s.route||'—')+'</span></div><div class="summary">'+esc(s.summary||'Nema sažetka')+'</div><div class="edit"><select data-status="'+esc(s.reference)+'">${STATUSES.map(st=>'<option value="'+st+'" '+(st===s.status?'selected':'')+'>'+st+'</option>').join('')}</select><textarea data-note="'+esc(s.reference)+'" placeholder="Interna beleška, mogući par, podaci koji nedostaju…">'+esc(s.note||'')+'</textarea><button data-save="'+esc(s.reference)+'">Sačuvaj</button></div></article>').join(''):'<div class="empty">Nema signala za izabrani filter.</div>'}
  async function load(){msg.textContent='';sessionStorage.setItem('danini_signal_admin_secret',key.value);const data=await request('/api/v1/signal-desk/signals');signals=data.signals||[];render()}
  list.addEventListener('click',async event=>{const button=event.target.closest('button[data-save]');if(!button)return;const reference=button.dataset.save;const statusInput=document.querySelector('[data-status="'+CSS.escape(reference)+'"]');const noteInput=document.querySelector('[data-note="'+CSS.escape(reference)+'"]');button.disabled=true;msg.textContent='Čuvam…';try{const data=await request('/api/v1/signal-desk/signals/'+encodeURIComponent(reference),{method:'PATCH',body:JSON.stringify({status:statusInput.value,note:noteInput.value})});signals=signals.map(signal=>signal.reference===reference?data.signal:signal);msg.textContent='Sačuvano.';render()}catch(error){msg.textContent=error.message}finally{button.disabled=false}});
  [kind,status,search].forEach(element=>element.addEventListener(element===search?'input':'change',render));document.getElementById('load').onclick=()=>load().catch(error=>msg.textContent=error.message);if(key.value)load().catch(()=>{});
})();</script></body></html>`;
}

function mountCapacitySignalRuntime(app, options = {}) {
  const store = options.store || createContactLeadStore();
  app.use('/api/v1/signal-desk', express.json({ limit:'64kb' }));
  app.get('/internal/signal-desk', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow');
    return res.type('html').send(renderSignalDesk());
  });
  app.get('/api/v1/signal-desk/signals', requireAdmin, async (req, res) => {
    try {
      const leads = await store.list({ sources:SOURCES, limit:500 });
      const signals = leads.map(publicSignal);
      return res.json({ ok:true, counts:counts(signals), signals });
    } catch (error) {
      return res.status(500).json({ ok:false, error:'SIGNAL_LIST_FAILED', message:error.message });
    }
  });
  app.patch('/api/v1/signal-desk/signals/:reference', requireAdmin, async (req, res) => {
    const status = normalizeStatus(req.body?.status);
    const note = String(req.body?.note || '').trim().slice(0, 5000);
    if (!status) return res.status(400).json({ ok:false, error:'INVALID_SIGNAL_STATUS' });
    try {
      const existing = await store.get(req.params.reference);
      if (!existing || !SOURCES.includes(existing.source)) return res.status(404).json({ ok:false, error:'SIGNAL_NOT_FOUND' });
      const updated = await store.update(req.params.reference, { status, reviewNote:note, reviewedAt:new Date().toISOString() });
      return res.json({ ok:true, signal:publicSignal(updated) });
    } catch (error) {
      return res.status(409).json({ ok:false, error:error.message || 'SIGNAL_UPDATE_FAILED' });
    }
  });
}

module.exports = { mountCapacitySignalRuntime, publicSignal, STATUSES };
