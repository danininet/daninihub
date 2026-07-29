'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { createContactLeadStore } = require('./contact-lead-store');
const { adminAuthorized } = require('./server-admin-runtime');
const { publicSignal, buildMatches } = require('./server-capacity-signal-runtime');

const CASE_FILE = path.join(__dirname, 'runtime', 'capacity-match-cases.json');
const CONSENT_VALUES = ['PENDING', 'GRANTED', 'DECLINED', 'WITHDRAWN'];

function requireAdmin(req, res, next) {
  if (!adminAuthorized(req)) return res.status(401).json({ ok:false, error:'ADMIN_NOT_AUTHORIZED' });
  return next();
}

function ensureFile() {
  fs.mkdirSync(path.dirname(CASE_FILE), { recursive:true });
  if (!fs.existsSync(CASE_FILE)) fs.writeFileSync(CASE_FILE, '{}\n', { mode:0o600 });
}

function readCases() {
  ensureFile();
  return JSON.parse(fs.readFileSync(CASE_FILE, 'utf8'));
}

function writeCases(cases) {
  ensureFile();
  const temp = `${CASE_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(cases, null, 2)}\n`, { mode:0o600 });
  fs.renameSync(temp, CASE_FILE);
}

function caseStatus(record) {
  const values = [record.truckConsent.status, record.freightConsent.status];
  if (values.includes('DECLINED') || values.includes('WITHDRAWN')) return 'DECLINED';
  if (values.every(value => value === 'GRANTED')) return 'READY_TO_CONNECT';
  return 'WAITING_CONSENT';
}

function createCase(truckReference, freightReference, score) {
  const now = new Date().toISOString();
  return {
    id:`DH-MATCH-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
    truckReference,
    freightReference,
    score:Number(score || 0),
    status:'WAITING_CONSENT',
    truckConsent:{ status:'PENDING', at:null, note:'' },
    freightConsent:{ status:'PENDING', at:null, note:'' },
    createdAt:now,
    updatedAt:now
  };
}

function renderPage() {
  return `<!doctype html><html lang="sr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>DaniniHub Match Consent Desk</title><style>
  *{box-sizing:border-box}body{margin:0;background:#07131f;color:#eaf2f5;font-family:Inter,Arial,sans-serif}.wrap{max-width:1250px;margin:auto;padding:28px 18px 70px}.brand{font-size:13px;font-weight:900;letter-spacing:.12em;color:#67d7e4}h1{font-size:clamp(34px,5vw,54px);margin:10px 0 4px}h2{margin-top:28px}p{color:#b9c9d2}.auth,.actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.auth{margin:22px 0}.auth input,select,textarea,button{font:inherit;border:1px solid #3a5262;border-radius:10px;background:#0d2030;color:#fff;padding:11px 12px}button{background:#0d8b98;border-color:#0d8b98;font-weight:800;cursor:pointer}.secondary{background:#193245}.msg{min-height:24px;color:#ffb4a4}.list,.candidates{display:grid;gap:16px}.case,.candidate{border:1px solid #29495b;border-radius:17px;background:#0b1c2a;padding:18px}.head{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}.tag{display:inline-block;padding:5px 9px;border-radius:999px;background:#123848;color:#8ee8f2;font-size:12px;font-weight:900}.ref{font-family:ui-monospace,monospace;color:#a8c0cb}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}.side{border:1px solid #29495b;border-radius:12px;padding:14px;background:#071722}.side h3{margin:0 0 10px}.side textarea{width:100%;min-height:75px;margin-top:8px}.status{font-size:28px;font-weight:900}.empty{padding:28px;border:1px dashed #3a5262;border-radius:14px;text-align:center}@media(max-width:760px){.grid{grid-template-columns:1fr}.auth input{width:100%}}
  </style></head><body><main class="wrap"><div class="brand">DANINIHUB · INTERNAL</div><h1>Match Consent Desk</h1><p>Odvojeno evidentiranje saglasnosti firme sa kamionom i firme sa teretom. Nema automatskog prosleđivanja kontakata.</p><div class="auth"><input id="key" type="password" placeholder="DANINI_ADMIN_SECRET"><button id="load">Učitaj</button></div><div id="msg" class="msg"></div><h2>Predloženi parovi bez otvorenog predmeta</h2><section id="candidates" class="candidates"></section><h2>Otvoreni predmeti saglasnosti</h2><section id="list" class="list"></section></main><script>(()=>{
  const key=document.getElementById('key'),msg=document.getElementById('msg'),list=document.getElementById('list'),candidatesEl=document.getElementById('candidates');
  key.value=sessionStorage.getItem('danini_signal_admin_secret')||'';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function request(url,options={}){const r=await fetch(url,{...options,headers:{'Content-Type':'application/json','x-danini-admin-secret':key.value,...(options.headers||{})}});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Greška');return d}
  function side(name,label,data,id){return '<div class="side"><h3>'+label+'</h3><select data-side="'+name+'" data-id="'+id+'">'+['PENDING','GRANTED','DECLINED','WITHDRAWN'].map(v=>'<option value="'+v+'" '+(v===data.status?'selected':'')+'>'+v+'</option>').join('')+'</select><textarea data-note="'+name+'" data-id="'+id+'" placeholder="Interna beleška / datum razgovora">'+esc(data.note||'')+'</textarea><button data-save="'+name+'" data-id="'+id+'">Sačuvaj saglasnost</button></div>'}
  function renderCases(cases){list.innerHTML=cases.length?cases.map(c=>'<article class="case"><div class="head"><div><span class="tag">'+esc(c.status)+'</span><h3>'+esc(c.truckCompany||c.truckReference)+' ↔ '+esc(c.freightCompany||c.freightReference)+'</h3><div class="ref">'+esc(c.id)+'</div></div><div class="status">'+esc(c.score)+'/100</div></div><p>'+esc(c.truckReference)+' · '+esc(c.freightReference)+'</p><div class="grid">'+side('truck','Firma sa kamionom',c.truckConsent,c.id)+side('freight','Firma sa teretom',c.freightConsent,c.id)+'</div></article>').join(''):'<div class="empty">Nema otvorenih predmeta.</div>'}
  function renderCandidates(candidates){candidatesEl.innerHTML=candidates.length?candidates.map(c=>'<article class="candidate"><div class="head"><div><span class="tag">'+esc(c.level)+'</span><h3>'+esc(c.truck.company)+' ↔ '+esc(c.freight.company)+'</h3><div class="ref">'+esc(c.truck.reference)+' · '+esc(c.freight.reference)+'</div></div><div class="status">'+esc(c.score)+'/100</div></div><button data-open="1" data-truck="'+esc(c.truck.reference)+'" data-freight="'+esc(c.freight.reference)+'">Otvori predmet saglasnosti</button></article>').join(''):'<div class="empty">Nema novih predloženih parova.</div>'}
  async function load(){msg.textContent='';sessionStorage.setItem('danini_signal_admin_secret',key.value);const d=await request('/api/v1/signal-consents/cases');renderCases(d.cases||[]);renderCandidates(d.candidates||[])}
  candidatesEl.addEventListener('click',async e=>{const b=e.target.closest('button[data-open]');if(!b)return;b.disabled=true;msg.textContent='Otvaram predmet…';try{await request('/api/v1/signal-consents/cases',{method:'POST',body:JSON.stringify({truckReference:b.dataset.truck,freightReference:b.dataset.freight})});msg.textContent='Predmet je otvoren.';await load()}catch(error){msg.textContent=error.message}finally{b.disabled=false}});
  list.addEventListener('click',async e=>{const b=e.target.closest('button[data-save]');if(!b)return;const id=b.dataset.id,sideName=b.dataset.save;const status=document.querySelector('select[data-side="'+sideName+'"][data-id="'+CSS.escape(id)+'"]').value;const note=document.querySelector('textarea[data-note="'+sideName+'"][data-id="'+CSS.escape(id)+'"]').value;b.disabled=true;msg.textContent='Čuvam…';try{await request('/api/v1/signal-consents/cases/'+encodeURIComponent(id)+'/consent',{method:'PATCH',body:JSON.stringify({side:sideName,status,note})});msg.textContent='Sačuvano.';await load()}catch(error){msg.textContent=error.message}finally{b.disabled=false}});
  document.getElementById('load').onclick=()=>load().catch(e=>msg.textContent=e.message);if(key.value)load().catch(()=>{});
  })();</script></body></html>`;
}

function mountCapacityConsentRuntime(app, options = {}) {
  const store = options.store || createContactLeadStore();
  app.use('/api/v1/signal-consents', express.json({ limit:'64kb' }));
  app.get('/internal/signal-consents', (req,res) => {
    res.set('Cache-Control','no-store');
    res.set('X-Robots-Tag','noindex, nofollow');
    return res.type('html').send(renderPage());
  });
  app.get('/api/v1/signal-consents/cases', requireAdmin, async (req,res) => {
    const caseMap = readCases();
    const cases = Object.values(caseMap);
    const leads = await store.list({ sources:['capacity-truck','capacity-freight'], limit:500 });
    const signals = leads.map(publicSignal);
    const map = new Map(signals.map(signal => [signal.reference, signal]));
    const openPairs = new Set(cases.filter(record => record.status !== 'DECLINED').map(record => `${record.truckReference}::${record.freightReference}`));
    const candidates = buildMatches(signals).filter(match => !openPairs.has(`${match.truck.reference}::${match.freight.reference}`));
    return res.json({ ok:true, candidates, cases:cases.map(record => ({ ...record, truckCompany:map.get(record.truckReference)?.company || '', freightCompany:map.get(record.freightReference)?.company || '' })) });
  });
  app.post('/api/v1/signal-consents/cases', requireAdmin, async (req,res) => {
    const truckReference = String(req.body?.truckReference || '').trim();
    const freightReference = String(req.body?.freightReference || '').trim();
    if (!truckReference || !freightReference) return res.status(400).json({ ok:false, error:'MATCH_REFERENCES_REQUIRED' });
    const leads = await store.list({ sources:['capacity-truck','capacity-freight'], limit:500 });
    const signals = leads.map(publicSignal);
    const match = buildMatches(signals).find(item => item.truck.reference === truckReference && item.freight.reference === freightReference);
    if (!match) return res.status(404).json({ ok:false, error:'MATCH_NOT_FOUND' });
    const cases = readCases();
    const existing = Object.values(cases).find(item => item.truckReference === truckReference && item.freightReference === freightReference && item.status !== 'DECLINED');
    if (existing) return res.json({ ok:true, case:existing, existing:true });
    const record = createCase(truckReference, freightReference, match.score);
    cases[record.id] = record;
    writeCases(cases);
    return res.status(201).json({ ok:true, case:record });
  });
  app.patch('/api/v1/signal-consents/cases/:id/consent', requireAdmin, (req,res) => {
    const side = req.body?.side === 'truck' ? 'truckConsent' : req.body?.side === 'freight' ? 'freightConsent' : null;
    const status = String(req.body?.status || '').toUpperCase();
    const note = String(req.body?.note || '').trim().slice(0,3000);
    if (!side || !CONSENT_VALUES.includes(status)) return res.status(400).json({ ok:false, error:'INVALID_CONSENT_UPDATE' });
    const cases = readCases();
    const record = cases[req.params.id];
    if (!record) return res.status(404).json({ ok:false, error:'MATCH_CASE_NOT_FOUND' });
    record[side] = { status, at:new Date().toISOString(), note };
    record.status = caseStatus(record);
    record.updatedAt = new Date().toISOString();
    cases[record.id] = record;
    writeCases(cases);
    return res.json({ ok:true, case:record });
  });
}

module.exports = { mountCapacityConsentRuntime, createCase, caseStatus };
