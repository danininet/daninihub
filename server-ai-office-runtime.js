'use strict';

const express = require('express');
const crypto = require('crypto');
const path = require('path');
const { BrevoClient } = require('@getbrevo/brevo');
const { createContactLeadStore } = require('./contact-lead-store');

const clean=(v,max=3000)=>String(v||'').trim().slice(0,max);
const html=v=>clean(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const fallbackTenants={
  demo:{
    name:'Muster Gebäudeservice',
    language:'de',
    notificationEmail:'info@daninihub.com',
    services:['Gebäudereinigung','Hausmeisterservice','Garten- / Objektpflege','Sonstiges']
  }
};

function parseJsonEnv(name,fallback={}){
  try { return process.env[name] ? JSON.parse(process.env[name]) : fallback; }
  catch { return fallback; }
}

function tenants(){
  return { ...fallbackTenants, ...parseJsonEnv('DANINI_OFFICE_TENANTS_JSON',{}) };
}

function tenantKeys(){
  return parseJsonEnv('DANINI_OFFICE_TENANT_KEYS_JSON',{});
}

function getTenant(slug){ return tenants()[slug] || null; }

function dashboardAuthorized(req,slug){
  const supplied=clean(req.query.key || req.headers['x-office-key'],300);
  const perTenant=String(tenantKeys()[slug]||'');
  const owner=String(process.env.DANINI_ADMIN_SECRET||'');
  return Boolean(supplied && ((perTenant && supplied===perTenant) || (owner && supplied===owner)));
}

function brevo(){
  if(!process.env.BREVO_API_KEY) return null;
  return new BrevoClient({apiKey:process.env.BREVO_API_KEY}).transactionalEmails;
}

function sender(){
  const email=process.env.BREVO_SENDER_EMAIL || process.env.DANINIHUB_SENDER_EMAIL || process.env.MAIL_FROM || process.env.EMAIL_FROM;
  return email ? {email,name:process.env.BREVO_SENDER_NAME || 'DaniniHub AI Office'} : null;
}

function officeSource(slug){ return 'ai-office:' + slug; }

function caseReference(slug){
  const date=new Date().toISOString().slice(0,10).replace(/-/g,'');
  return 'AO-' + clean(slug,24).toUpperCase() + '-' + date + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

function caseView(lead){
  const p=lead?.payload || {};
  return {
    id:lead.reference,
    tenant:p.tenant || String(lead.source||'').replace(/^ai-office:/,''),
    status:String(lead.status||'NEW').toUpperCase(),
    customerName:lead.company || '',
    email:lead.email || '',
    phone:p.phone || '',
    service:p.service || '',
    address:p.address || '',
    objectType:p.objectType || '',
    urgency:p.urgency || '',
    preferredTime:p.preferredTime || '',
    message:p.message || '',
    summary:p.summary || '',
    createdAt:lead.createdAt,
    updatedAt:lead.updatedAt,
    reviewNote:lead.reviewNote || ''
  };
}

function summarizeCases(items){
  const counts={total:items.length,new:0,ready_for_callback:0,callback_planned:0,appointment_planned:0,followup:0,done:0,not_fit:0};
  for(const item of items){
    const key=String(item.status||'').toLowerCase();
    if(Object.prototype.hasOwnProperty.call(counts,key)) counts[key]+=1;
  }
  return counts;
}

function makeSummary(data){
  const parts=[
    data.service && 'Leistung: '+data.service,
    data.address && 'Ort/Adresse: '+data.address,
    data.objectType && 'Objekt: '+data.objectType,
    data.urgency && 'Dringlichkeit: '+data.urgency,
    data.preferredTime && 'Wunschzeit: '+data.preferredTime,
    data.message && 'Hinweis: '+data.message
  ].filter(Boolean);
  return parts.join(' | ');
}

async function notify(tenant,record){
  try{
    const api=brevo(), from=sender();
    if(!api || !from || !tenant.notificationEmail) return false;
    await api.sendTransacEmail({
      sender:from,
      to:[{email:tenant.notificationEmail,name:tenant.name}],
      replyTo:record.email ? {email:record.email,name:record.customerName||'Kunde'} : undefined,
      subject:'Neue Anfrage '+record.id+' · '+tenant.name,
      htmlContent:`<h2>Neue Anfrage</h2><p><strong>${html(record.customerName)}</strong><br>${html(record.phone)}<br>${html(record.email)}</p><p>${html(record.summary)}</p><p>Status: <strong>NEW</strong></p>`
    });
    if(record.email){
      await api.sendTransacEmail({
        sender:from,
        to:[{email:record.email,name:record.customerName||'Kunde'}],
        subject:'Ihre Anfrage · '+tenant.name,
        htmlContent:`<h2>Vielen Dank für Ihre Anfrage.</h2><p>Referenz: <strong>${html(record.id)}</strong></p><p>Ihre Angaben wurden aufgenommen und für den Rückruf bzw. die weitere Bearbeitung vorbereitet.</p><p>Diese Bestätigung ist noch keine Preiszusage oder Auftragsannahme.</p>`
      });
    }
    return true;
  }catch(error){
    console.error('AI Office notification failed:',error.message);
    return false;
  }
}

function baseCss(){
  return `*{box-sizing:border-box}body{margin:0;background:#f4f1ea;color:#0b1727;font-family:Inter,Arial,sans-serif}.wrap{max-width:980px;margin:auto;padding:32px 18px}.top{display:flex;justify-content:space-between;gap:18px;align-items:center}.brand{font-weight:900}.tag{font-size:12px;color:#8a6a32;letter-spacing:.12em;text-transform:uppercase}.hero{padding:52px 0 30px}.hero h1{font-size:clamp(38px,7vw,68px);line-height:1.02;margin:10px 0 18px;letter-spacing:-.04em}.lead{font-size:18px;line-height:1.65;color:#5b6470;max-width:760px}.panel{background:#fff;border:1px solid #d7d0c4;border-radius:18px;padding:24px;box-shadow:0 18px 50px rgba(10,25,45,.07)}form{display:grid;grid-template-columns:1fr 1fr;gap:14px}label{display:grid;gap:7px;font-size:13px;font-weight:800}label.full{grid-column:1/-1}input,select,textarea,button{font:inherit}input,select,textarea{padding:13px;border:1px solid #c9c2b6;border-radius:10px;background:#fff}textarea{min-height:120px;resize:vertical}button{border:0;border-radius:999px;background:#071424;color:#fff;font-weight:850;padding:14px 18px;cursor:pointer}.small{font-size:12px;color:#6b7280;line-height:1.5}.ok{background:#eaf7ee;color:#175b32;padding:12px;border-radius:10px}.err{background:#fff0f0;color:#8b1e1e;padding:12px;border-radius:10px}.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:18px 0}.stat{background:#fff;border:1px solid #d7d0c4;border-radius:13px;padding:14px}.stat strong{font-size:24px;display:block}.case{background:#fff;border:1px solid #d7d0c4;border-radius:15px;padding:18px;margin:12px 0}.case-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.pill{display:inline-block;padding:5px 9px;border-radius:999px;background:#eef1f5;font-size:11px;font-weight:850}.meta{color:#667085;font-size:13px;line-height:1.55}.actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.actions button{padding:8px 11px;font-size:12px}.hidden{display:none}@media(max-width:700px){form{grid-template-columns:1fr}label.full{grid-column:auto}.hero{padding-top:34px}.top{align-items:flex-start;flex-direction:column}}`;
}

function intakePage(slug,tenant){
  const services=(tenant.services||[]).map(x=>`<option value="${html(x)}">${html(x)}</option>`).join('');
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Anfrage · ${html(tenant.name)}</title><style>${baseCss()}</style></head><body><main class="wrap"><div class="top"><div><div class="tag">Powered by DaniniHub</div><div class="brand">${html(tenant.name)}</div></div><a href="https://daninihub.com/de/">AI Office 24/7</a></div><section class="hero"><div class="tag">ANFRAGE ASSISTENT</div><h1>Ihre Anfrage in 2 Minuten vollständig vorbereiten.</h1><p class="lead">Damit beim Rückruf nicht alles noch einmal abgefragt werden muss: Leistung, Ort, Objekt, Dringlichkeit und Wunschtermin werden strukturiert aufgenommen. Preis und Auftrag werden weiterhin von einem Menschen bestätigt.</p></section><section class="panel"><form id="f"><label>Name / Firma<input name="customerName" required maxlength="180"></label><label>Telefon<input name="phone" required maxlength="120"></label><label>E-Mail<input name="email" type="email" maxlength="180"></label><label>Leistung<select name="service" required><option value="">Bitte wählen</option>${services}</select></label><label class="full">Adresse / Einsatzort<input name="address" required maxlength="300"></label><label>Objektart<input name="objectType" placeholder="z. B. Büro, Haus, Außenfläche" maxlength="180"></label><label>Dringlichkeit<select name="urgency"><option>Normal</option><option>Diese Woche</option><option>Dringend</option></select></label><label>Wunschtermin / Rückrufzeit<input name="preferredTime" maxlength="180"></label><label class="full">Zusätzliche Angaben<textarea name="message" maxlength="4000"></textarea></label><label class="full" style="display:grid;grid-template-columns:20px 1fr;font-weight:500"><input style="width:auto" type="checkbox" name="privacy" required><span>Ich bestätige, dass meine Angaben zur Bearbeitung dieser konkreten Anfrage verwendet werden dürfen. Keine Marketing-Einwilligung.</span></label><label class="hidden">Website<input name="website" tabindex="-1" autocomplete="off"></label><div class="full"><button>ANFRAGE SENDEN</button></div><div id="msg" class="full"></div></form></section></main><script>document.getElementById('f').addEventListener('submit',async e=>{e.preventDefault();const f=e.currentTarget,m=document.getElementById('msg');m.className='full';m.textContent='Wird gesendet…';const d=Object.fromEntries(new FormData(f).entries());d.privacyAcknowledged=Boolean(new FormData(f).get('privacy'));try{const r=await fetch('/api/office/${encodeURIComponent(slug)}/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const j=await r.json();if(!r.ok)throw new Error(j.error||'Fehler');m.className='full ok';m.textContent='Erhalten. Referenz: '+j.case.id+'. Die Anfrage ist jetzt im Bearbeitungs-Workflow.';f.reset()}catch(err){m.className='full err';m.textContent='Senden fehlgeschlagen: '+err.message}})</script></body></html>`;
}

function dashboardPage(slug,tenant){
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Office Desk · ${html(tenant.name)}</title><style>${baseCss()}</style></head><body><main class="wrap"><div class="top"><div><div class="tag">DANINI AI OFFICE</div><div class="brand">${html(tenant.name)} · Office Desk</div></div><button onclick="load()">AKTUALISIEREN</button></div><div id="stats" class="stats"></div><div id="msg"></div><div id="cases"></div></main><script>const key=new URLSearchParams(location.search).get('key')||'';const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));async function api(path,opt={}){const r=await fetch(path,{...opt,headers:{'Content-Type':'application/json','x-office-key':key,...(opt.headers||{})}});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Fehler');return j}async function setStatus(id,status){const note=prompt('Interne Notiz (optional)','')||'';await api('/api/office/${encodeURIComponent(slug)}/cases/'+encodeURIComponent(id)+'/status',{method:'POST',body:JSON.stringify({status,note})});load()}async function load(){try{const d=await api('/api/office/${encodeURIComponent(slug)}/cases');document.getElementById('stats').innerHTML=Object.entries(d.summary).map(([k,v])=>'<div class="stat"><strong>'+esc(v)+'</strong><span>'+esc(k)+'</span></div>').join('');document.getElementById('cases').innerHTML=d.cases.map(x=>'<article class="case"><div class="case-head"><div><strong>'+esc(x.customerName||'Ohne Name')+'</strong><div class="meta">'+esc(x.phone)+' · '+esc(x.email)+'</div></div><span class="pill">'+esc(x.status)+'</span></div><p>'+esc(x.summary)+'</p><div class="meta">Ref: '+esc(x.id)+' · '+new Date(x.createdAt).toLocaleString()+'</div><div class="actions">'+['READY_FOR_CALLBACK','CALLBACK_PLANNED','APPOINTMENT_PLANNED','FOLLOWUP','DONE','NOT_FIT'].map(s=>'<button onclick="setStatus(\''+esc(x.id)+'\',\''+s+'\')">'+s+'</button>').join('')+'</div></article>').join('')||'<p>Noch keine Anfragen.</p>';document.getElementById('msg').textContent=''}catch(e){document.getElementById('msg').className='err';document.getElementById('msg').textContent=e.message}}load()</script></body></html>`;
}

function mountAiOfficeRuntime(app, options = {}){
  const officeStore = options.store || createContactLeadStore({ storageFile:path.join(__dirname,'runtime','ai-office-cases.json') });
  app.get('/office/:tenant', (req,res)=>{
    const tenant=getTenant(clean(req.params.tenant,80));
    if(!tenant) return res.status(404).type('text/plain').send('Unknown office');
    res.set('Cache-Control','no-store');
    return res.type('html').send(intakePage(req.params.tenant,tenant));
  });

  app.get('/office/:tenant/dashboard', (req,res)=>{
    const slug=clean(req.params.tenant,80), tenant=getTenant(slug);
    if(!tenant) return res.status(404).type('text/plain').send('Unknown office');
    if(!dashboardAuthorized(req,slug)) return res.status(401).type('text/plain').send('Office key required');
    res.set('Cache-Control','no-store');
    return res.type('html').send(dashboardPage(slug,tenant));
  });

  app.post('/api/office/:tenant/intake', express.json({limit:'80kb'}), async (req,res)=>{
    const slug=clean(req.params.tenant,80), tenant=getTenant(slug);
    if(!tenant) return res.status(404).json({ok:false,error:'UNKNOWN_OFFICE'});
    const data=req.body||{};
    if(clean(data.website,200)) return res.status(400).json({ok:false,error:'SPAM_REJECTED'});
    if(data.privacyAcknowledged!==true) return res.status(400).json({ok:false,error:'PRIVACY_NOTICE_REQUIRED'});
    if(!clean(data.customerName,180) || !clean(data.phone,120) || !clean(data.service,180) || !clean(data.address,300)) return res.status(400).json({ok:false,error:'MISSING_REQUIRED_FIELDS'});
    const summary=makeSummary(data);
    const reference=caseReference(slug);
    const lead=await officeStore.create({
      reference,
      source:officeSource(slug),
      language:tenant.language || 'de',
      email:clean(data.email,180),
      company:clean(data.customerName,180),
      status:'NEW',
      recommendation:'manual-review',
      payload:{
        tenant:slug,
        phone:clean(data.phone,120),
        service:clean(data.service,180),
        address:clean(data.address,300),
        objectType:clean(data.objectType,180),
        urgency:clean(data.urgency,80),
        preferredTime:clean(data.preferredTime,180),
        message:clean(data.message,4000),
        summary,
        privacyAcknowledged:true
      }
    });
    const record=caseView(lead);
    const notified=await notify(tenant,record);
    return res.json({ok:true,case:{id:record.id,status:record.status},notified,durableMode:officeStore.mode});
  });

  app.get('/api/office/:tenant/cases',async (req,res)=>{
    const slug=clean(req.params.tenant,80);
    if(!getTenant(slug)) return res.status(404).json({ok:false,error:'UNKNOWN_OFFICE'});
    if(!dashboardAuthorized(req,slug)) return res.status(401).json({ok:false,error:'OFFICE_NOT_AUTHORIZED'});
    const leads=await officeStore.list({sources:[officeSource(slug)],limit:500});
    const cases=leads.map(caseView);
    return res.json({ok:true,summary:summarizeCases(cases),cases,durableMode:officeStore.mode});
  });

  app.post('/api/office/:tenant/cases/:id/status',express.json({limit:'20kb'}),async (req,res)=>{
    const slug=clean(req.params.tenant,80);
    if(!getTenant(slug)) return res.status(404).json({ok:false,error:'UNKNOWN_OFFICE'});
    if(!dashboardAuthorized(req,slug)) return res.status(401).json({ok:false,error:'OFFICE_NOT_AUTHORIZED'});
    const allowed=new Set(['NEW','READY_FOR_CALLBACK','CALLBACK_PLANNED','APPOINTMENT_PLANNED','FOLLOWUP','DONE','NOT_FIT']);
    const status=String(req.body?.status||'').toUpperCase();
    if(!allowed.has(status)) return res.status(400).json({ok:false,error:'INVALID_OFFICE_STATUS'});
    try{
      const current=await officeStore.get(clean(req.params.id,160));
      if(!current || current.source!==officeSource(slug)) return res.status(404).json({ok:false,error:'OFFICE_CASE_NOT_FOUND'});
      const lead=await officeStore.update(current.reference,{
        status,
        reviewedAt:new Date().toISOString(),
        reviewNote:clean(req.body?.note,1000)
      });
      return res.json({ok:true,case:caseView(lead)});
    }catch(error){
      return res.status(400).json({ok:false,error:error.message});
    }
  });
}

module.exports={mountAiOfficeRuntime,getTenant,makeSummary,dashboardAuthorized,caseView,summarizeCases,officeSource};
