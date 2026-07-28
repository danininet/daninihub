'use strict';

const crypto = require('crypto');
const express = require('express');
const path = require('path');
const { BrevoClient } = require('@getbrevo/brevo');
const { createDispatchCaseStore } = require('./dispatch-case-store');

const clean = (value, max = 1000) => String(value || '').trim().slice(0, max);
const allowedStatuses = new Set(['ORDER_RECORDED','IN_TRANSIT','DELAY_RISK','CUSTOMER_INFORMED','ESCALATED','COMPLETED']);
const allowedDocStates = new Set(['PRESENT','MISSING','REVIEW']);
const allowedRoles = new Set(['DACH_CUSTOMER','BALKAN_CARRIER','DANINIHUB_OPERATOR']);
const rolePermissions = {
  DACH_CUSTOMER: new Set(['status','eta','nextCheck','risk','approvedMessage','standardizedMessage','incident','timeline']),
  BALKAN_CARRIER: new Set(['eta','nextCheck','vehicle','driver','documents','incident','timeline']),
  DANINIHUB_OPERATOR: new Set(['route','partner','vehicle','driver','owner','status','eta','nextCheck','risk','approvedMessage','standardizedMessage','documents','incident','timeline'])
};

function initialTransportRoomCase() {
  return {
    caseId: 'DH-TR-0001', fictitious: true, route: 'Duisburg → Beograd', partner: 'Danube Logistics d.o.o.',
    vehicle: 'BG-TEST-101', driver: 'TEST DRIVER', owner: 'Operations Desk', status: 'DELAY_RISK', eta: '18:40', nextCheck: '15:30', risk: 'HIGH',
    approvedMessage: false,
    standardizedMessage: 'Driver reports congestion before Budapest. Current position and remaining driving time must be confirmed before a reliable ETA can be issued.',
    documents: { order: 'PRESENT', cmr: 'REVIEW', pod: 'MISSING', insurance: 'PRESENT' },
    incident: { status: 'OPEN', severity: 'HIGH', decision: 'Confirm next customer update and decide whether a new unloading slot is required.' },
    timeline: [
      { at: '08:10', status: 'ORDER_RECORDED', note: 'Loading completed in Duisburg.' },
      { at: '12:20', status: 'IN_TRANSIT', note: 'Vehicle passed Nürnberg.' },
      { at: '14:52', status: 'DELAY_RISK', note: 'Driver reported congestion before Budapest.' }
    ], updatedAt: new Date().toISOString()
  };
}

function secret() { return String(process.env.DANINI_TRANSPORT_ROOM_SECRET || process.env.DANINI_SESSION_SECRET || process.env.BREVO_API_KEY || 'development-fictitious-room-secret'); }
function signAccess(payload) { const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url'); return `${encoded}.${crypto.createHmac('sha256', secret()).update(encoded).digest('base64url')}`; }
function verifyAccess(token, caseId) {
  try {
    const [encoded, signature] = String(token || '').split('.');
    if (!encoded || !signature) return null;
    const expected = crypto.createHmac('sha256', secret()).update(encoded).digest('base64url');
    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!allowedRoles.has(payload.role) || payload.caseId !== caseId || Number(payload.exp) < Date.now()) return null;
    return payload;
  } catch { return null; }
}
const bearer = req => String(req.get('authorization') || '').startsWith('Bearer ') ? String(req.get('authorization')).slice(7) : '';
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(value, 180));
const publicUrl = () => String(process.env.DANINI_PUBLIC_URL || 'https://daninihub.com').replace(/\/$/, '');
const hashCode = code => crypto.createHmac('sha256', secret()).update(String(code)).digest('hex');
const newCode = () => String(crypto.randomInt(100000, 1000000));

async function sendEmail(to, subject, htmlContent) {
  if (!process.env.BREVO_API_KEY) return { sent: false, reason: 'BREVO_NOT_CONFIGURED' };
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.DANINIHUB_SENDER_EMAIL || process.env.MAIL_FROM || process.env.EMAIL_FROM;
  if (!senderEmail) return { sent: false, reason: 'SENDER_NOT_CONFIGURED' };
  const api = new BrevoClient({ apiKey: process.env.BREVO_API_KEY }).transactionalEmails;
  await api.sendTransacEmail({ sender: { email: senderEmail, name: process.env.BREVO_SENDER_NAME || 'DaniniHub Transport Network' }, to: [{ email: to }], replyTo: { email: 'info@daninihub.com', name: 'DaniniHub' }, subject, htmlContent });
  return { sent: true };
}

function validatePayload(body) {
  if (body?.fictitious !== true) return { error: 'ONLY_FICTITIOUS_PILOT_DATA_ALLOWED' };
  const caseId = clean(body.caseId, 64).toUpperCase();
  if (!/^DH-TR-[A-Z0-9-]{1,30}$/.test(caseId)) return { error: 'INVALID_CASE_ID' };
  const status = clean(body.status, 40).toUpperCase();
  if (!allowedStatuses.has(status)) return { error: 'INVALID_STATUS' };
  const documents = body.documents || {};
  for (const key of ['order','cmr','pod','insurance']) if (!allowedDocStates.has(clean(documents[key], 20).toUpperCase())) return { error: 'INVALID_DOCUMENT_STATE' };
  const timeline = Array.isArray(body.timeline) ? body.timeline.slice(-50).map(item => ({ at: clean(item.at, 20), status: clean(item.status, 40).toUpperCase(), note: clean(item.note, 500), actor: clean(item.actor, 180), role: clean(item.role, 40) })).filter(item => allowedStatuses.has(item.status) && item.note) : [];
  return { value: { caseId, fictitious: true, route: clean(body.route,160), partner: clean(body.partner,160), vehicle: clean(body.vehicle,80), driver: clean(body.driver,120), owner: clean(body.owner,120), status, eta: clean(body.eta,40), nextCheck: clean(body.nextCheck,40), risk: clean(body.risk,20).toUpperCase(), approvedMessage: body.approvedMessage === true, standardizedMessage: clean(body.standardizedMessage,2000), documents: Object.fromEntries(Object.entries(documents).map(([k,v])=>[k,clean(v,20).toUpperCase()])), incident: { status: clean(body.incident?.status,30).toUpperCase(), severity: clean(body.incident?.severity,20).toUpperCase(), decision: clean(body.incident?.decision,1200) }, timeline, updatedAt: new Date().toISOString() } };
}
function enforceRole(existing, proposed, role) {
  const permitted = rolePermissions[role] || new Set();
  for (const field of ['route','partner','vehicle','driver','owner','status','eta','nextCheck','risk','approvedMessage','standardizedMessage','documents','incident','timeline']) if (!permitted.has(field) && JSON.stringify(existing[field]) !== JSON.stringify(proposed[field])) return { error: `ROLE_CANNOT_EDIT_${field.toUpperCase()}` };
  return { value: proposed };
}

function mountTransportRoomRuntime(app, options = {}) {
  const store = options.store || createDispatchCaseStore({ storageFile: path.join(__dirname, 'runtime', 'transport-room-cases.json') });
  const inviteStore = options.inviteStore || createDispatchCaseStore({ storageFile: path.join(__dirname, 'runtime', 'transport-room-invites.json') });
  const otpStore = options.otpStore || createDispatchCaseStore({ storageFile: path.join(__dirname, 'runtime', 'transport-room-otp.json') });
  const auditStore = options.auditStore || createDispatchCaseStore({ storageFile: path.join(__dirname, 'runtime', 'transport-room-audit.json') });
  app.use('/api/v1/transport-room', express.json({ limit: '250kb' }));
  const audit = async (caseId, action, access, details = {}) => {
    const id = `AUD-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    await auditStore.upsert({ caseId: id, status: action, approval: access?.role || 'SYSTEM', payload: { id, caseId, action, identity: access?.identity || 'system', role: access?.role || 'SYSTEM', at: new Date().toISOString(), details } });
  };

  app.post('/api/v1/transport-room/access', (req, res) => {
    const caseId = clean(req.body?.caseId,64).toUpperCase(), role = clean(req.body?.role,40).toUpperCase();
    if (caseId !== 'DH-TR-0001' || !allowedRoles.has(role)) return res.status(400).json({ ok:false,error:'INVALID_DEMO_ACCESS_REQUEST' });
    const expiresAt = Date.now() + 2*60*60*1000;
    return res.json({ ok:true,caseId,role,identity:'demo-user',expiresAt,token:signAccess({caseId,role,identity:'demo-user',exp:expiresAt}) });
  });

  app.post('/api/v1/transport-room/:caseId/invitations', async (req,res) => {
    const caseId = clean(req.params.caseId,64).toUpperCase(), access = verifyAccess(bearer(req),caseId);
    if (!access || access.role !== 'DANINIHUB_OPERATOR') return res.status(403).json({ok:false,error:'OPERATOR_ACCESS_REQUIRED'});
    const email = clean(req.body?.email,180).toLowerCase(), name = clean(req.body?.name,120), role = clean(req.body?.role,40).toUpperCase(), hours = Math.max(1,Math.min(Number(req.body?.hours)||48,168));
    if (!validEmail(email) || !allowedRoles.has(role) || role === 'DANINIHUB_OPERATOR') return res.status(400).json({ok:false,error:'INVALID_INVITATION'});
    const inviteId = `INV-${crypto.randomBytes(6).toString('hex').toUpperCase()}`, expiresAt = Date.now()+hours*3600000;
    const inviteToken = signAccess({caseId,role,identity:email,inviteId,kind:'INVITE',exp:expiresAt});
    const route = role === 'BALKAN_CARRIER' ? '/sr/transportna-soba-demo' : '/de/transport-room-demo';
    const invite = { inviteId,caseId,email,name,role,status:'ACTIVE',createdBy:access.identity||'operator',expiresAt,link:`${publicUrl()}${route}?invite=${encodeURIComponent(inviteToken)}`,createdAt:new Date().toISOString(),usedAt:null,revokedAt:null };
    await inviteStore.upsert({caseId:inviteId,status:'ACTIVE',approval:role,payload:invite});
    let delivery; try { delivery = await sendEmail(email,`DaniniHub Transport Room – Einladung ${caseId}`,`<h2>DaniniHub Transport Room</h2><p>Sie wurden für <strong>${caseId}</strong> eingeladen.</p><p><a href="${invite.link}">Transport Room öffnen</a></p><p>Nach dem Öffnen erhalten Sie einen einmaligen Sicherheitscode per E-Mail.</p>`); } catch(error) { delivery={sent:false,reason:error.message}; }
    await audit(caseId,'INVITATION_CREATED',access,{inviteId,email,role});
    return res.json({ok:true,invitation:invite,delivery});
  });

  app.post('/api/v1/transport-room/invitations/start', async (req,res) => {
    const token = clean(req.body?.token,5000); let decoded;
    try { decoded=JSON.parse(Buffer.from(token.split('.')[0],'base64url').toString('utf8')); } catch { return res.status(400).json({ok:false,error:'INVALID_INVITATION_TOKEN'}); }
    const access = verifyAccess(token,clean(decoded.caseId,64).toUpperCase());
    if (!access?.inviteId || access.kind !== 'INVITE') return res.status(401).json({ok:false,error:'INVITATION_EXPIRED_OR_INVALID'});
    const record = await inviteStore.get(access.inviteId), invite = record?.payload;
    if (!invite || invite.status !== 'ACTIVE' || Number(invite.expiresAt)<Date.now()) return res.status(401).json({ok:false,error:'INVITATION_NOT_ACTIVE'});
    const code = newCode(), challengeId=`OTP-${crypto.randomBytes(8).toString('hex')}`, expiresAt=Date.now()+10*60*1000;
    await otpStore.upsert({caseId:challengeId,status:'PENDING',approval:access.inviteId,payload:{challengeId,inviteId:access.inviteId,caseId:access.caseId,email:access.identity,role:access.role,codeHash:hashCode(code),attempts:0,expiresAt,status:'PENDING'}});
    let delivery; try { delivery=await sendEmail(access.identity,`DaniniHub Sicherheitscode ${access.caseId}`,`<h2>Ihr Sicherheitscode</h2><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>Der Code ist 10 Minuten gültig.</p>`); } catch(error){delivery={sent:false,reason:error.message};}
    await audit(access.caseId,'OTP_REQUESTED',access,{inviteId:access.inviteId,challengeId});
    return res.json({ok:true,challengeId,emailMasked:access.identity.replace(/^(.{2}).*(@.*)$/,'$1***$2'),delivery});
  });

  app.post('/api/v1/transport-room/invitations/verify', async (req,res) => {
    const challengeId=clean(req.body?.challengeId,100), code=clean(req.body?.code,10), record=await otpStore.get(challengeId), otp=record?.payload;
    if (!otp || otp.status!=='PENDING' || Number(otp.expiresAt)<Date.now()) return res.status(401).json({ok:false,error:'OTP_EXPIRED_OR_INVALID'});
    if (Number(otp.attempts)>=5) return res.status(429).json({ok:false,error:'OTP_ATTEMPTS_EXCEEDED'});
    if (hashCode(code)!==otp.codeHash) { otp.attempts=Number(otp.attempts)+1; await otpStore.upsert({caseId:challengeId,status:'PENDING',approval:otp.inviteId,payload:otp}); return res.status(401).json({ok:false,error:'OTP_INCORRECT',attemptsRemaining:Math.max(0,5-otp.attempts)}); }
    const inviteRecord=await inviteStore.get(otp.inviteId), invite=inviteRecord?.payload;
    if (!invite || invite.status!=='ACTIVE') return res.status(401).json({ok:false,error:'INVITATION_NOT_ACTIVE'});
    otp.status='VERIFIED'; otp.verifiedAt=new Date().toISOString();
    invite.status='USED'; invite.usedAt=new Date().toISOString();
    await otpStore.upsert({caseId:challengeId,status:'VERIFIED',approval:otp.inviteId,payload:otp});
    await inviteStore.upsert({caseId:invite.inviteId,status:'USED',approval:invite.role,payload:invite});
    const expiresAt=Math.min(Number(invite.expiresAt),Date.now()+8*60*60*1000), sessionToken=signAccess({caseId:invite.caseId,role:invite.role,identity:invite.email,inviteId:invite.inviteId,kind:'SESSION',exp:expiresAt});
    await audit(invite.caseId,'INVITATION_VERIFIED',{identity:invite.email,role:invite.role},{inviteId:invite.inviteId});
    return res.json({ok:true,caseId:invite.caseId,role:invite.role,identity:invite.email,expiresAt,token:sessionToken});
  });

  app.get('/api/v1/transport-room/:caseId/invitations', async (req,res) => {
    const caseId=clean(req.params.caseId,64).toUpperCase(), access=verifyAccess(bearer(req),caseId);
    if (!access || access.role!=='DANINIHUB_OPERATOR') return res.status(403).json({ok:false,error:'OPERATOR_ACCESS_REQUIRED'});
    const items=(await inviteStore.list(100)).map(x=>x.payload).filter(x=>x.caseId===caseId);
    return res.json({ok:true,invitations:items});
  });
  app.post('/api/v1/transport-room/:caseId/invitations/:inviteId/revoke', async (req,res) => {
    const caseId=clean(req.params.caseId,64).toUpperCase(), access=verifyAccess(bearer(req),caseId);
    if (!access || access.role!=='DANINIHUB_OPERATOR') return res.status(403).json({ok:false,error:'OPERATOR_ACCESS_REQUIRED'});
    const record=await inviteStore.get(clean(req.params.inviteId,100));
    if (!record?.payload || record.payload.caseId!==caseId) return res.status(404).json({ok:false,error:'INVITATION_NOT_FOUND'});
    const invite={...record.payload,status:'REVOKED',revokedAt:new Date().toISOString()};
    await inviteStore.upsert({caseId:invite.inviteId,status:'REVOKED',approval:invite.role,payload:invite});
    await audit(caseId,'INVITATION_REVOKED',access,{inviteId:invite.inviteId,email:invite.email});
    return res.json({ok:true,invitation:invite});
  });
  app.get('/api/v1/transport-room/:caseId/audit', async (req,res) => {
    const caseId=clean(req.params.caseId,64).toUpperCase(), access=verifyAccess(bearer(req),caseId);
    if (!access || access.role!=='DANINIHUB_OPERATOR') return res.status(403).json({ok:false,error:'OPERATOR_ACCESS_REQUIRED'});
    const events=(await auditStore.list(100)).map(x=>x.payload).filter(x=>x.caseId===caseId).sort((a,b)=>String(b.at).localeCompare(String(a.at)));
    return res.json({ok:true,events});
  });

  app.get('/api/v1/transport-room/:caseId', async (req,res) => {
    const caseId=clean(req.params.caseId,64).toUpperCase(), access=verifyAccess(bearer(req),caseId);
    if (!access) return res.status(401).json({ok:false,error:'TRANSPORT_ROOM_ACCESS_REQUIRED'});
    const record=await store.get(caseId), payload=record?.payload||(caseId==='DH-TR-0001'?initialTransportRoomCase():null);
    if (!payload) return res.status(404).json({ok:false,error:'TRANSPORT_CASE_NOT_FOUND'});
    await audit(caseId,'ROOM_OPENED',access);
    return res.json({ok:true,storageMode:store.mode,role:access.role,identity:access.identity||'demo-user',permissions:[...rolePermissions[access.role]],case:payload,updatedAt:record?.updatedAt||payload.updatedAt,seeded:!record});
  });
  app.put('/api/v1/transport-room/:caseId', async (req,res) => {
    const caseId=clean(req.params.caseId,64).toUpperCase(), access=verifyAccess(bearer(req),caseId);
    if (!access) return res.status(401).json({ok:false,error:'TRANSPORT_ROOM_ACCESS_REQUIRED'});
    const validation=validatePayload({...req.body,caseId}); if(validation.error)return res.status(400).json({ok:false,error:validation.error});
    const existingRecord=await store.get(caseId), existing=existingRecord?.payload||initialTransportRoomCase(), authorized=enforceRole(existing,validation.value,access.role);
    if(authorized.error)return res.status(403).json({ok:false,error:authorized.error});
    authorized.value.timeline=(authorized.value.timeline||[]).map(item=>({...item,actor:item.actor||access.identity||'demo-user',role:item.role||access.role}));
    const changed=Object.keys(authorized.value).filter(k=>JSON.stringify(existing[k])!==JSON.stringify(authorized.value[k]));
    const record=await store.upsert({caseId,status:authorized.value.status,approval:authorized.value.approvedMessage?'APPROVED':'PENDING',payload:authorized.value});
    await audit(caseId,'ROOM_UPDATED',access,{changedFields:changed});
    return res.json({ok:true,storageMode:store.mode,role:access.role,identity:access.identity||'demo-user',permissions:[...rolePermissions[access.role]],case:record.payload,updatedAt:record.updatedAt});
  });
}

module.exports={initialTransportRoomCase,mountTransportRoomRuntime,validatePayload,verifyAccess,enforceRole,rolePermissions,signAccess};
