'use strict';

const express = require('express');
const path = require('path');
const { createDispatchCaseStore } = require('./dispatch-case-store');

const clean = (value, max = 1000) => String(value || '').trim().slice(0, max);
const allowedStatuses = new Set(['ORDER_RECORDED','IN_TRANSIT','DELAY_RISK','CUSTOMER_INFORMED','ESCALATED','COMPLETED']);
const allowedDocStates = new Set(['PRESENT','MISSING','REVIEW']);

function initialTransportRoomCase() {
  return {
    caseId: 'DH-TR-0001',
    fictitious: true,
    route: 'Duisburg → Beograd',
    partner: 'Danube Logistics d.o.o.',
    vehicle: 'BG-TEST-101',
    driver: 'TEST DRIVER',
    owner: 'Operations Desk',
    status: 'DELAY_RISK',
    eta: '18:40',
    nextCheck: '15:30',
    risk: 'HIGH',
    approvedMessage: false,
    standardizedMessage: 'Driver reports congestion before Budapest. Current position and remaining driving time must be confirmed before a reliable ETA can be issued.',
    documents: { order: 'PRESENT', cmr: 'REVIEW', pod: 'MISSING', insurance: 'PRESENT' },
    incident: { status: 'OPEN', severity: 'HIGH', decision: 'Confirm next customer update and decide whether a new unloading slot is required.' },
    timeline: [
      { at: '08:10', status: 'ORDER_RECORDED', note: 'Loading completed in Duisburg.' },
      { at: '12:20', status: 'IN_TRANSIT', note: 'Vehicle passed Nürnberg.' },
      { at: '14:52', status: 'DELAY_RISK', note: 'Driver reported congestion before Budapest.' }
    ],
    updatedAt: new Date().toISOString()
  };
}

function validatePayload(body) {
  if (body?.fictitious !== true) return { error: 'ONLY_FICTITIOUS_PILOT_DATA_ALLOWED' };
  const caseId = clean(body.caseId, 64).toUpperCase();
  if (!/^DH-TR-[A-Z0-9-]{1,30}$/.test(caseId)) return { error: 'INVALID_CASE_ID' };
  const status = clean(body.status, 40).toUpperCase();
  if (!allowedStatuses.has(status)) return { error: 'INVALID_STATUS' };
  const documents = body.documents || {};
  for (const key of ['order','cmr','pod','insurance']) {
    if (!allowedDocStates.has(clean(documents[key], 20).toUpperCase())) return { error: 'INVALID_DOCUMENT_STATE' };
  }
  const timeline = Array.isArray(body.timeline) ? body.timeline.slice(-50).map(item => ({
    at: clean(item.at, 20), status: clean(item.status, 40).toUpperCase(), note: clean(item.note, 500)
  })).filter(item => allowedStatuses.has(item.status) && item.note) : [];
  return { value: {
    caseId, fictitious: true,
    route: clean(body.route, 160), partner: clean(body.partner, 160), vehicle: clean(body.vehicle, 80), driver: clean(body.driver, 120), owner: clean(body.owner, 120),
    status, eta: clean(body.eta, 40), nextCheck: clean(body.nextCheck, 40), risk: clean(body.risk, 20).toUpperCase(),
    approvedMessage: body.approvedMessage === true, standardizedMessage: clean(body.standardizedMessage, 2000),
    documents: Object.fromEntries(Object.entries(documents).map(([key,value]) => [key, clean(value,20).toUpperCase()])),
    incident: { status: clean(body.incident?.status, 30).toUpperCase(), severity: clean(body.incident?.severity, 20).toUpperCase(), decision: clean(body.incident?.decision, 1200) },
    timeline, updatedAt: new Date().toISOString()
  }};
}

function mountTransportRoomRuntime(app, options = {}) {
  const store = options.store || createDispatchCaseStore({ storageFile: path.join(__dirname, 'runtime', 'transport-room-cases.json') });
  app.use('/api/v1/transport-room', express.json({ limit: '250kb' }));

  app.get('/api/v1/transport-room/:caseId', async (req, res) => {
    const caseId = clean(req.params.caseId, 64).toUpperCase();
    try {
      const record = await store.get(caseId);
      if (record) return res.json({ ok: true, storageMode: store.mode, case: record.payload, updatedAt: record.updatedAt });
      if (caseId === 'DH-TR-0001') return res.json({ ok: true, storageMode: store.mode, case: initialTransportRoomCase(), seeded: true });
      return res.status(404).json({ ok: false, error: 'TRANSPORT_CASE_NOT_FOUND' });
    } catch (error) {
      console.error('Transport Room load failed:', error.message);
      return res.status(503).json({ ok: false, error: 'TRANSPORT_ROOM_STORAGE_UNAVAILABLE' });
    }
  });

  app.put('/api/v1/transport-room/:caseId', async (req, res) => {
    const validation = validatePayload({ ...req.body, caseId: req.params.caseId });
    if (validation.error) return res.status(400).json({ ok: false, error: validation.error });
    try {
      const record = await store.upsert({ caseId: validation.value.caseId, status: validation.value.status, approval: validation.value.approvedMessage ? 'APPROVED' : 'PENDING', payload: validation.value });
      return res.json({ ok: true, storageMode: store.mode, case: record.payload, updatedAt: record.updatedAt });
    } catch (error) {
      console.error('Transport Room save failed:', error.message);
      return res.status(503).json({ ok: false, error: 'TRANSPORT_ROOM_STORAGE_UNAVAILABLE' });
    }
  });
}

module.exports = { initialTransportRoomCase, mountTransportRoomRuntime, validatePayload };
