'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const { readLastAudit } = require('./core/audit');
const { resendSessionDelivery, retryFailedSession } = require('./core/guided-analysis-service');
const { createContactLeadStore } = require('./contact-lead-store');
const { evaluateMarketTest } = require('./core/revenue-os');
const { getCampaignState, approveCampaign, pauseCampaign } = require('./revenue-campaign-store');

const SESSION_DIR = path.join(process.cwd(), 'runtime', 'guided-sessions');
const REVENUE_SOURCES = ['revenue-os-intake', 'ai-opportunity-check'];
const ALLOWED_REVENUE_STATUSES = new Set([
  'NEW', 'QUALIFIED', 'NEEDS_INFO', 'NOT_FIT',
  'OFFER_READY', 'APPROVED_TO_SEND', 'OFFER_SENT', 'PAID'
]);

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
      try { return JSON.parse(fs.readFileSync(path.join(SESSION_DIR, name), 'utf8')); }
      catch { return null; }
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
    failure: session.failure || null,
    recovery: session.recovery || null,
    canRetry: ['failed', 'processing'].includes(session.status),
    canResend: session.status === 'completed' && Boolean(session.result?.artifacts)
  };
}

function publicRevenueLead(lead) {
  return {
    reference: lead.reference,
    source: lead.source,
    language: lead.language,
    email: lead.email,
    company: lead.company,
    phone: lead.payload?.phone || '',
    message: lead.payload?.message || '',
    status: String(lead.status || 'NEW').toUpperCase(),
    recommendation: lead.recommendation || '',
    reviewNote: lead.reviewNote || '',
    reviewedAt: lead.reviewedAt || null,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt
  };
}

function summarizeRevenue(leads) {
  const counts = {
    total: leads.length,
    new: 0,
    qualified: 0,
    needs_info: 0,
    not_fit: 0,
    offer_ready: 0,
    approved_to_send: 0,
    offer_sent: 0,
    paid: 0
  };
  for (const lead of leads) {
    const status = String(lead.status || 'NEW').toUpperCase();
    const key = status.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(counts, key)) counts[key] += 1;
  }
  const metrics = {
    targeted_contacts: 0,
    positive_replies: leads.length,
    qualified_conversations: counts.qualified + counts.offer_ready + counts.approved_to_send + counts.offer_sent + counts.paid,
    paid_customers: counts.paid
  };
  return { counts, metrics, marketDecision: evaluateMarketTest(metrics) };
}

function renderAdminPage() {
  return `<!doctype html><html lang="sr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Danini Revenue Control Center</title><style>
  *{box-sizing:border-box}body{margin:0;background:#08111f;color:#e5edf7;font-family:Inter,Arial,sans-serif}.wrap{max-width:1240px;margin:auto;padding:28px 18px}.brand{color:#f4d26b;font-weight:900;letter-spacing:.08em}.muted{color:#94a3b8}.top{display:flex;justify-content:space-between;gap:20px;align-items:flex-end;flex-wrap:wrap}h1{font-size:42px;margin:12px 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}.card{background:#101b2d;border:1px solid #26344a;border-radius:16px;padding:18px}.value{font-size:30px;font-weight:900}.label{color:#94a3b8}.table{margin-top:22px;overflow:auto}.row{display:grid;grid-template-columns:1fr 1.2fr .8fr 2fr 1.2fr;gap:12px;padding:12px;border-bottom:1px solid #26344a;min-width:1080px;align-items:start}.head{font-weight:800;color:#f4d26b}.lead-message{white-space:pre-wrap;color:#cbd5e1;font-size:13px;line-height:1.5}.actions{display:flex;gap:7px;flex-wrap:wrap}.section{margin-top:30px}input,select,textarea,button{padding:10px 12px;border-radius:10px;border:1px solid #41516a;background:#0d1728;color:#fff;font:inherit}button{background:#d4af37;color:#111827;font-weight:850;cursor:pointer}button.secondary{background:#22304a;color:#fff}.error{color:#fca5a5}.ok{color:#86efac}.small{font-size:12px}.pill{display:inline-block;border:1px solid #41516a;border-radius:999px;padding:4px 8px;font-size:11px;font-weight:800}.decision{border-left:3px solid #d4af37;padding-left:12px}
  </style></head><body><main class="wrap">
  <div class="top"><div><div class="brand">DANINI · REVENUE OS</div><h1>Control Center</h1><p class="muted">Ti potvrđuješ važne odluke. Sistem prati upite, kvalifikaciju, ponude i dokaz.</p></div><div><input id="key" type="password" placeholder="Admin secret"><button id="load">Učitaj</button></div></div>
  <p id="msg" class="error"></p>
  <section class="section"><h2>Revenue Unit #1</h2><div id="campaign" class="card" style="margin-bottom:14px"></div><div id="revenueStats" class="grid"></div><p id="decision" class="decision muted"></p></section>
  <section class="card table"><div class="row head"><div>Firma / kontakt</div><div>Status</div><div>Jezik</div><div>Problem / poruka</div><div>Kontrola</div></div><div id="leadRows"></div></section>
  <section class="section"><details><summary>Legacy interne sesije</summary><div id="legacyStats" class="grid" style="margin-top:16px"></div></details></section>
  </main><script>(()=>{const key=document.getElementById('key'),msg=document.getElementById('msg'),leadRows=document.getElementById('leadRows'),revenueStats=document.getElementById('revenueStats'),legacyStats=document.getElementById('legacyStats'),decision=document.getElementById('decision'),campaign=document.getElementById('campaign');key.value=sessionStorage.getItem('danini_admin_secret')||'';function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}async function request(path,options={}){const r=await fetch(path,{...options,headers:{'Content-Type':'application/json','x-danini-admin-secret':key.value,...(options.headers||{})}});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||d.error||'Greška');return d}function statCards(obj){return Object.entries(obj).map(([k,v])=>'<div class="card"><div class="value">'+esc(v)+'</div><div class="label">'+esc(k)+'</div></div>').join('')}async function setStatus(reference,status){const note=prompt('Interna beleška (opciono):','')||'';await request('/api/v1/admin/revenue/leads/'+encodeURIComponent(reference),{method:'POST',body:JSON.stringify({status,note})});await load()}async function load(){msg.textContent='';sessionStorage.setItem('danini_admin_secret',key.value);const d=await request('/api/v1/admin/revenue');revenueStats.innerHTML=statCards(d.summary.counts);legacyStats.innerHTML=statCards(d.legacy.counts);decision.textContent='Market decision: '+d.summary.marketDecision.decision+' — '+d.summary.marketDecision.reason;campaign.innerHTML='<strong>Campaign:</strong> '+esc(d.campaign.campaignId)+' · <span class="pill">'+esc(d.campaign.status)+'</span><p class="small muted">Mode: '+esc(d.campaign.mode)+' · cold bulk email and automated cold calls remain blocked.</p><div class="actions"><button data-campaign="approve">ODOBRI COMPLIANT CAMPAIGN</button><button class="secondary" data-campaign="pause">PAUZIRAJ</button></div>';leadRows.innerHTML=(d.leads||[]).map(l=>'<div class="row"><div><strong>'+esc(l.company)+'</strong><div class="small">'+esc(l.email)+'</div><div class="small">'+esc(l.phone)+'</div><div class="small">'+esc(l.reference)+'</div></div><div><span class="pill">'+esc(l.status)+'</span><div class="small muted">'+esc(l.reviewNote||'')+'</div></div><div>'+esc(l.language||'—')+'</div><div class="lead-message">'+esc(l.message||'—')+'</div><div class="actions"><button data-ref="'+esc(l.reference)+'" data-status="QUALIFIED">Kvalifikuj</button><button class="secondary" data-ref="'+esc(l.reference)+'" data-status="NEEDS_INFO">Treba info</button><button class="secondary" data-ref="'+esc(l.reference)+'" data-status="NOT_FIT">Nije fit</button><button data-ref="'+esc(l.reference)+'" data-status="OFFER_READY">Ponuda spremna</button><button data-ref="'+esc(l.reference)+'" data-status="APPROVED_TO_SEND">ODOBRI SLANJE</button><button data-ref="'+esc(l.reference)+'" data-status="PAID">Plaćeno</button></div></div>').join('')||'<p class="muted">Još nema Revenue OS upita.</p>'}leadRows.addEventListener('click',e=>{const b=e.target.closest('button[data-ref]');if(!b)return;b.disabled=true;setStatus(b.dataset.ref,b.dataset.status).catch(err=>msg.textContent=err.message).finally(()=>b.disabled=false)});campaign.addEventListener('click',e=>{const b=e.target.closest('button[data-campaign]');if(!b)return;b.disabled=true;const note=prompt('Interna beleška (opciono):','')||'';request('/api/v1/admin/revenue/campaign/'+b.dataset.campaign,{method:'POST',body:JSON.stringify({note})}).then(load).catch(err=>msg.textContent=err.message).finally(()=>b.disabled=false)});document.getElementById('load').onclick=()=>load().catch(e=>msg.textContent=e.message);if(key.value)load().catch(()=>{});})();</script></body></html>`;
}

function mountAdminRuntime(app, options = {}) {
  const leadStore = options.leadStore || createContactLeadStore();
  app.use('/api/v1/admin', express.json({ limit: '64kb' }));
  app.get('/admin', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow');
    return res.type('html').send(renderAdminPage());
  });

  app.get('/api/v1/admin/revenue', requireAdmin, async (req, res) => {
    const leads = await leadStore.list({ sources: REVENUE_SOURCES, limit: 500 });
    const sessions = readSessions(250);
    return res.json({
      ok: true,
      summary: summarizeRevenue(leads),
      campaign: getCampaignState(),
      leads: leads.map(publicRevenueLead),
      legacy: { counts: summarizeSessions(sessions), sessions: sessions.map(publicAdminSession) },
      audit: readLastAudit(50)
    });
  });

  app.post('/api/v1/admin/revenue/campaign/approve', requireAdmin, (req, res) => {
    return res.json({ ok:true, campaign:approveCampaign(req.body?.note || '') });
  });

  app.post('/api/v1/admin/revenue/campaign/pause', requireAdmin, (req, res) => {
    return res.json({ ok:true, campaign:pauseCampaign(req.body?.note || '') });
  });

  app.post('/api/v1/admin/revenue/leads/:reference', requireAdmin, async (req, res) => {
    const reference = String(req.params.reference || '').trim();
    const status = String(req.body?.status || '').trim().toUpperCase();
    const note = String(req.body?.note || '').trim().slice(0, 2000);
    if (!ALLOWED_REVENUE_STATUSES.has(status)) {
      return res.status(400).json({ ok:false, error:'INVALID_REVENUE_STATUS' });
    }
    try {
      const lead = await leadStore.update(reference, {
        status,
        recommendation: status === 'NOT_FIT' ? 'do-not-pursue' : 'manual-review',
        reviewedAt: new Date().toISOString(),
        reviewNote: note
      });
      return res.json({ ok:true, lead:publicRevenueLead(lead) });
    } catch (error) {
      return res.status(404).json({ ok:false, error:error.message || 'LEAD_UPDATE_FAILED' });
    }
  });

  app.get('/api/v1/admin/overview', requireAdmin, (req, res) => {
    const sessions = readSessions(250);
    return res.json({ ok:true, counts:summarizeSessions(sessions), sessions:sessions.map(publicAdminSession), audit:readLastAudit(50) });
  });

  app.post('/api/v1/admin/sessions/:id/retry', requireAdmin, async (req, res) => {
    try {
      const session = await retryFailedSession(req.params.id);
      return res.json({ ok:true, session });
    } catch (error) {
      return res.status(409).json({ ok:false, error:error.code || 'SESSION_RETRY_FAILED', message:error.message });
    }
  });

  app.post('/api/v1/admin/sessions/:id/resend', requireAdmin, async (req, res) => {
    try {
      const session = await resendSessionDelivery(req.params.id);
      return res.json({ ok:true, session });
    } catch (error) {
      return res.status(409).json({ ok:false, error:error.code || 'DELIVERY_RESEND_FAILED', message:error.message });
    }
  });
}

module.exports = { adminAuthorized, mountAdminRuntime, publicAdminSession, publicRevenueLead, summarizeRevenue, readSessions, summarizeSessions };
