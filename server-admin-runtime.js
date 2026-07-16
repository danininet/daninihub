'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const { readLastAudit } = require('./core/audit');

const SESSION_DIR = path.join(process.cwd(), 'runtime', 'guided-sessions');

function adminAuthorized(req) {
  const expected = String(process.env.DANINI_ADMIN_SECRET || '');
  const supplied = String(req.headers['x-danini-admin-secret'] || req.query.key || '');
  return Boolean(expected && supplied && supplied === expected);
}

function requireAdmin(req, res, next) {
  if (!adminAuthorized(req)) {
    return res.status(401).json({ ok: false, error: 'ADMIN_NOT_AUTHORIZED' });
  }
  return next();
}

function readSessions(limit = 100) {
  if (!fs.existsSync(SESSION_DIR)) return [];
  return fs.readdirSync(SESSION_DIR)
    .filter(name => name.endsWith('.json'))
    .map(name => {
      try {
        return JSON.parse(fs.readFileSync(path.join(SESSION_DIR, name), 'utf8'));
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
    .slice(0, limit);
}

function summarizeSessions(sessions) {
  const counts = { total: sessions.length, awaiting: 0, processing: 0, completed: 0, failed: 0, delivered: 0 };
  for (const session of sessions) {
    if (session.status === 'completed') counts.completed += 1;
    else if (session.status === 'failed') counts.failed += 1;
    else if (session.status === 'processing') counts.processing += 1;
    else counts.awaiting += 1;
    if (session.result?.delivery?.sent) counts.delivered += 1;
  }
  return counts;
}

function publicAdminSession(session) {
  return {
    id: session.id,
    productId: session.productId,
    email: session.email,
    orderId: session.orderId,
    status: session.status,
    followUpsAsked: session.followUpsAsked,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    delivery: session.result?.delivery || null,
    failure: session.failure || null
  };
}

function renderAdminPage() {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Danini OS Control Center</title><style>*{box-sizing:border-box}body{margin:0;background:#08111f;color:#e5edf7;font-family:Inter,Arial,sans-serif}.wrap{max-width:1180px;margin:auto;padding:28px 18px}.brand{color:#f4d26b;font-weight:900;letter-spacing:.05em}h1{font-size:42px;margin:12px 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}.card{background:#101b2d;border:1px solid #26344a;border-radius:16px;padding:18px}.value{font-size:32px;font-weight:900}.label{color:#94a3b8}.table{margin-top:22px;overflow:auto}.row{display:grid;grid-template-columns:1.2fr 1.4fr 1fr .8fr 1fr;gap:12px;padding:12px;border-bottom:1px solid #26344a;min-width:850px}.head{font-weight:800;color:#f4d26b}input,button{padding:12px;border-radius:10px;border:1px solid #41516a;background:#0d1728;color:#fff}button{background:#d4af37;color:#111827;font-weight:850;cursor:pointer}.error{color:#fca5a5}</style></head><body><main class="wrap"><div class="brand">Danini OS</div><h1>Control Center</h1><p>Prodaje, sesije, isporuke i greške.</p><div><input id="key" type="password" placeholder="Admin secret"><button id="load">Učitaj</button></div><p id="msg" class="error"></p><section id="stats" class="grid"></section><section class="card table"><div class="row head"><div>Email</div><div>Order / Session</div><div>Status</div><div>Pitanja</div><div>Isporuka</div></div><div id="rows"></div></section></main><script>(()=>{const key=document.getElementById('key'),msg=document.getElementById('msg'),stats=document.getElementById('stats'),rows=document.getElementById('rows');key.value=sessionStorage.getItem('danini_admin_secret')||'';function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}async function load(){msg.textContent='';sessionStorage.setItem('danini_admin_secret',key.value);const r=await fetch('/api/v1/admin/overview',{headers:{'x-danini-admin-secret':key.value}});const d=await r.json().catch(()=>({}));if(!r.ok){msg.textContent=d.error||'Greška';return}stats.innerHTML=Object.entries(d.counts).map(([k,v])=>'<div class="card"><div class="value">'+esc(v)+'</div><div class="label">'+esc(k)+'</div></div>').join('');rows.innerHTML=d.sessions.map(s=>'<div class="row"><div>'+esc(s.email)+'</div><div>'+esc(s.orderId||s.id)+'</div><div>'+esc(s.status)+'</div><div>'+esc(s.followUpsAsked)+'</div><div>'+esc(s.delivery?.sent?'poslato':s.failure?.message||'nije poslato')+'</div></div>').join('')}document.getElementById('load').onclick=()=>load().catch(e=>msg.textContent=e.message);if(key.value)load().catch(()=>{});})();</script></body></html>`;
}

function mountAdminRuntime(app) {
  app.use('/api/v1/admin', express.json({ limit: '32kb' }));
  app.get('/admin', (req, res) => res.type('html').send(renderAdminPage()));
  app.get('/api/v1/admin/overview', requireAdmin, (req, res) => {
    const sessions = readSessions(250);
    return res.json({
      ok: true,
      counts: summarizeSessions(sessions),
      sessions: sessions.map(publicAdminSession),
      audit: readLastAudit(50)
    });
  });
}

module.exports = { adminAuthorized, mountAdminRuntime, readSessions, summarizeSessions };
