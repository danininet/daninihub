'use strict';

const crypto = require('crypto');
const express = require('express');
const path = require('path');
const { createDispatchCaseStore } = require('./dispatch-case-store');

const clean = (value, max = 500) => String(value || '').trim().slice(0, max);
const allowedCompanyTypes = new Set(['DACH_CUSTOMER','BALKAN_CARRIER']);
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

function mountTransportNetworkRuntime(app, options = {}) {
  const store = options.store || createDispatchCaseStore({ storageFile: path.join(__dirname, 'runtime', 'transport-network-workspace.json') });
  app.use('/api/v1/transport-network', express.json({ limit:'200kb' }));

  async function getWorkspace() {
    const record = await store.get('NETWORK-DEMO');
    return record?.payload || seedWorkspace();
  }

  async function saveWorkspace(workspace) {
    const record = await store.upsert({ caseId:'NETWORK-DEMO', status:'ACTIVE', approval:'FICTITIOUS', payload:workspace });
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
    const caseId = `DH-TR-${String(workspace.rooms.length + 1).padStart(4,'0')}`;
    const room = {
      caseId, route,
      customerCompanyId: ownCompany.type === 'DACH_CUSTOMER' ? ownCompany.companyId : partner.companyId,
      carrierCompanyId: ownCompany.type === 'BALKAN_CARRIER' ? ownCompany.companyId : partner.companyId,
      status:'ORDER_RECORDED', eta:'—', risk:'LOW', updatedAt:new Date().toISOString(), fictitious:true
    };
    workspace.rooms.push(room);
    await saveWorkspace(workspace);
    return res.json({ ok:true, room });
  });
}

module.exports = { mountTransportNetworkRuntime, seedWorkspace, sign, verify };
