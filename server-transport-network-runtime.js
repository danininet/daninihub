'use strict';

const crypto = require('crypto');
const express = require('express');
const path = require('path');
const { createDispatchCaseStore } = require('./dispatch-case-store');
const { signAccess } = require('./server-transport-room-runtime');

const clean = (value, max = 500) => String(value || '').trim().slice(0, max);
const allowedMemberRoles = new Set(['OWNER','DISPATCHER','VIEWER']);

function secret() {
  return String(process.env.DANINI_TRANSPORT_NETWORK_SECRET || process.env.DANINI_SESSION_SECRET || process.env.BREVO_API_KEY || 'fictitious-network-secret');
}

function sign(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret()).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

function verify(token) {
  try {
    const [encoded, signature] = String(token || '').split('.');
    if (!encoded || !signature) return null;
    const expected = crypto.createHmac('sha256', secret()).update(encoded).digest('base64url');
    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (Number(payload.exp) < Date.now() || !payload.companyId || !payload.identity) return null;
    return payload;
  } catch { return null; }
}

function bearer(req) {
  const value = String(req.get('authorization') || '');
  return value.startsWith('Bearer ') ? value.slice(7) : '';
}

function seedWorkspace() {
  return {
    companies: [
      { companyId:'CMP-DACH-001', type:'DACH_CUSTOMER', name:'RheinCargo Demo GmbH', country:'DE', city:'Duisburg', status:'VERIFIED', routes:['DE–RS','DE–HR','DE–BG'], documentStatus:'COMPLETE' },
      { companyId:'CMP-BALKAN-001', type:'BALKAN_CARRIER', name:'Danube Logistics Demo d.o.o.', country:'RS', city:'Beograd', status:'VERIFIED', routes:['RS–DE','RS–AT'], documentStatus:'REVIEW' }
    ],
    members: [
      { memberId:'MBR-001', companyId:'CMP-DACH-001', name:'Anna Keller', email:'anna.demo@daninihub.example', role:'OWNER', status:'ACTIVE' },
      { memberId:'MBR-002', companyId:'CMP-DACH-001', name:'Markus Vogel', email:'markus.demo@daninihub.example', role:'DISPATCHER', status:'ACTIVE' },
      { memberId:'MBR-003', companyId:'CMP-BALKAN-001', name:'Milan Petrović', email:'milan.demo@daninihub.example', role:'OWNER', status:'ACTIVE' }
    ],
    rooms: [
      { caseId:'DH-TR-0001', route:'Duisburg → Beograd', customerCompanyId:'CMP-DACH-001', carrierCompanyId:'CMP-BALKAN-001', status:'DELAY_RISK', eta:'18:40', risk:'HIGH', updatedAt:new Date().toISOString() },
      { caseId:'DH-TR-0002', route:'Dortmund → Zagreb', customerCompanyId:'CMP-DACH-001', carrierCompanyId:'CMP-BALKAN-001', status:'IN_TRANSIT', eta:'21:10', risk:'MEDIUM', updatedAt:new Date().toISOString() }
    ]
  };
}

function normalizeWorkspace(value) {
  const seed = seedWorkspace();
  const workspace = value && typeof value === 'object' ? value : {};
  const byCompany = new Map((Array.isArray(workspace.companies) ? workspace.companies : []).map(item => [item?.companyId, item]));
  const companies = seed.companies.map(base => {
    const current = byCompany.get(base.companyId) || {};
    return {
      ...base,
      ...current,
      companyId: base.companyId,
      routes: Array.isArray(current.routes) ? current.routes.filter(Boolean) : base.routes
    };
  });

  const rawMembers = Array.isArray(workspace.members) ? workspace.members.filter(Boolean) : [];
  const memberIds = new Set(rawMembers.map(item => item.memberId));
  const members = [...rawMembers, ...seed.members.filter(item => !memberIds.has(item.memberId))]
    .filter(item => item.companyId && item.name && item.email)
    .map(item => ({ ...item, role: allowedMemberRoles.has(item.role) ? item.role : 'VIEWER', status:item.status || 'ACTIVE' }));

  const rawRooms = Array.isArray(workspace.rooms) ? workspace.rooms.filter(Boolean) : [];
  const roomIds = new Set(rawRooms.map(item => String(item.caseId || '').toUpperCase()));
  const rooms = [...rawRooms, ...seed.rooms.filter(item => !roomIds.has(item.caseId))]
    .map(item => ({
      ...item,
      caseId: clean(item.caseId, 64).toUpperCase(),
      route: clean(item.route, 160) || 'Demo route',
      customerCompanyId: clean(item.customerCompanyId, 64).toUpperCase() || 'CMP-DACH-001',
      carrierCompanyId: clean(item.carrierCompanyId, 64).toUpperCase() || 'CMP-BALKAN-001',
      status: clean(item.status, 40).toUpperCase() || 'ORDER_RECORDED',
      eta: clean(item.eta, 40) || '—',
      risk: clean(item.risk, 20).toUpperCase() || 'LOW',
      updatedAt: item.updatedAt || new Date().toISOString(),
      fictitious: true
    }))
    .filter(item => item.caseId);

  return { companies, members, rooms };
}

function roomPayload(room, workspace) {
  const customer = workspace.companies.find(c => c.companyId === room.customerCompanyId);
  const carrier = workspace.companies.find(c => c.companyId === room.carrierCompanyId);
  return {
    caseId: room.caseId,
    fictitious: true,
    route: room.route,
    partner: carrier?.name || 'Balkan carrier',
    vehicle: room.caseId === 'DH-TR-0001' ? 'BG-TEST-101' : 'TEST-VEHICLE',
    driver: room.caseId === 'DH-TR-0001' ? 'TEST DRIVER' : 'Demo driver',
    owner: customer?.name || 'DACH customer',
    status: room.status || 'ORDER_RECORDED',
    eta: room.eta || '—',
    nextCheck: '—',
    risk: room.risk || 'LOW',
    approvedMessage: false,
    standardizedMessage: `Transport ${room.caseId}: ${room.route}. Current operational status must be confirmed by the responsible human user.`,
    documents: { order:'PRESENT', cmr:'REVIEW', pod:'MISSING', insurance:'REVIEW' },
    incident: { status:'OPEN', severity: room.risk === 'HIGH' ? 'HIGH' : 'LOW', decision:'No open decision has been confirmed yet.' },
    timeline: [{ at:new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}), status:room.status || 'ORDER_RECORDED', note:'Transport Room opened from company workspace.', actor:'company-workspace', role:'SYSTEM' }],
    updatedAt:new Date().toISOString()
  };
}

function mountTransportNetworkRuntime(app, options = {}) {
  const store = options.store || createDispatchCaseStore({ storageFile: path.join(__dirname, 'runtime', 'transport-network-workspace.json') });
  const roomStore = options.roomStore || createDispatchCaseStore({ storageFile: path.join(__dirname, 'runtime', 'transport-room-cases.json') });
  app.use('/api/v1/transport-network', express.json({ limit:'200kb' }));

  async function getWorkspace() {
    const record = await store.get('NETWORK-DEMO');
    const normalized = normalizeWorkspace(record?.payload);
    if (record?.payload && JSON.stringify(record.payload) !== JSON.stringify(normalized)) {
      try { await store.upsert({ caseId:'NETWORK-DEMO', status:'ACTIVE', approval:'FICTITIOUS', payload:normalized }); } catch (error) { console.error('Transport Network repair save failed:', error.message); }
    }
    return normalized;
  }

  async function saveWorkspace(workspace) {
    const normalized = normalizeWorkspace(workspace);
    const record = await store.upsert({ caseId:'NETWORK-DEMO', status:'ACTIVE', approval:'FICTITIOUS', payload:normalized });
    return record.payload;
  }

  app.post('/api/v1/transport-network/access', async (req, res) => {
    const companyId = clean(req.body?.companyId, 64).toUpperCase();
    const workspace = await getWorkspace();
    const company = workspace.companies.find(item => item.companyId === companyId);
    const member = workspace.members.find(item => item.companyId === companyId && item.role === 'OWNER');
    if (!company || !member) return res.status(400).json({ ok:false, error:'INVALID_DEMO_COMPANY' });
    const exp = Date.now() + 2 * 60 * 60 * 1000;
    return res.json({ ok:true, token:sign({ companyId, identity:member.email, memberRole:member.role, companyType:company.type, exp }), company, identity:member.email, expiresAt:exp });
  });

  app.get('/api/v1/transport-network/workspace', async (req, res) => {
    const access = verify(bearer(req));
    if (!access) return res.status(401).json({ ok:false, error:'NETWORK_ACCESS_REQUIRED' });
    const workspace = await getWorkspace();
    const company = workspace.companies.find(item => item.companyId === access.companyId);
    if (!company) return res.status(404).json({ ok:false, error:'COMPANY_NOT_FOUND' });
    const members = workspace.members.filter(item => item.companyId === access.companyId);
    const rooms = workspace.rooms.filter(item => item.customerCompanyId === access.companyId || item.carrierCompanyId === access.companyId);
    return res.json({ ok:true, storageMode:store.mode, identity:access.identity, memberRole:access.memberRole, company, members, rooms });
  });

  app.post('/api/v1/transport-network/rooms/:caseId/open', async (req, res) => {
    const access = verify(bearer(req));
    if (!access) return res.status(401).json({ ok:false, error:'NETWORK_ACCESS_REQUIRED' });
    const caseId = clean(req.params.caseId, 64).toUpperCase();
    const workspace = await getWorkspace();
    const room = workspace.rooms.find(item => item.caseId === caseId && (item.customerCompanyId === access.companyId || item.carrierCompanyId === access.companyId));
    if (!room) return res.status(404).json({ ok:false, error:'ROOM_NOT_AVAILABLE' });
    let roomRecord = await roomStore.get(caseId);
    if (!roomRecord) {
      const payload = roomPayload(room, workspace);
      roomRecord = await roomStore.upsert({ caseId, status:payload.status, approval:'PENDING', payload });
    }
    const role = access.companyType === 'DACH_CUSTOMER' ? 'DACH_CUSTOMER' : 'BALKAN_CARRIER';
    const exp = Date.now() + 2 * 60 * 60 * 1000;
    const token = signAccess({ caseId, role, identity:access.identity, companyId:access.companyId, source:'TRANSPORT_NETWORK', exp });
    return res.json({ ok:true, caseId, role, identity:access.identity, token, expiresAt:exp });
  });

  app.post('/api/v1/transport-network/members', async (req, res) => {
    const access = verify(bearer(req));
    if (!access || access.memberRole !== 'OWNER') return res.status(403).json({ ok:false, error:'OWNER_ACCESS_REQUIRED' });
    const name = clean(req.body?.name, 120);
    const email = clean(req.body?.email, 180).toLowerCase();
    const role = clean(req.body?.role, 30).toUpperCase();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !allowedMemberRoles.has(role)) return res.status(400).json({ ok:false, error:'INVALID_MEMBER' });
    const workspace = await getWorkspace();
    const member = { memberId:`MBR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`, companyId:access.companyId, name, email, role, status:'ACTIVE' };
    workspace.members.push(member);
    await saveWorkspace(workspace);
    return res.json({ ok:true, member });
  });

  app.post('/api/v1/transport-network/rooms', async (req, res) => {
    const access = verify(bearer(req));
    if (!access || !['OWNER','DISPATCHER'].includes(access.memberRole)) return res.status(403).json({ ok:false, error:'ROOM_CREATE_ACCESS_REQUIRED' });
    const route = clean(req.body?.route, 160);
    const partnerCompanyId = clean(req.body?.partnerCompanyId, 64).toUpperCase();
    if (!route || !partnerCompanyId) return res.status(400).json({ ok:false, error:'INVALID_ROOM' });
    const workspace = await getWorkspace();
    const ownCompany = workspace.companies.find(item => item.companyId === access.companyId);
    const partner = workspace.companies.find(item => item.companyId === partnerCompanyId && item.companyId !== access.companyId);
    if (!ownCompany || !partner) return res.status(400).json({ ok:false, error:'PARTNER_NOT_FOUND' });
    const used = workspace.rooms.map(r => Number(String(r.caseId).split('-').pop()) || 0);
    const caseId = `DH-TR-${String(Math.max(0,...used) + 1).padStart(4,'0')}`;
    const room = {
      caseId, route,
      customerCompanyId: ownCompany.type === 'DACH_CUSTOMER' ? ownCompany.companyId : partner.companyId,
      carrierCompanyId: ownCompany.type === 'BALKAN_CARRIER' ? ownCompany.companyId : partner.companyId,
      status:'ORDER_RECORDED', eta:'—', risk:'LOW', updatedAt:new Date().toISOString(), fictitious:true
    };
    workspace.rooms.push(room);
    await saveWorkspace(workspace);
    const payload = roomPayload(room, workspace);
    await roomStore.upsert({ caseId, status:payload.status, approval:'PENDING', payload });
    return res.json({ ok:true, room });
  });
}

module.exports = { mountTransportNetworkRuntime, seedWorkspace, normalizeWorkspace, sign, verify, roomPayload };
