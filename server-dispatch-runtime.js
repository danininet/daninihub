'use strict';

const crypto = require('crypto');
const express = require('express');
const { createDispatchCaseStore } = require('./dispatch-case-store');

const clean = (value, max = 200) => String(value || '').trim().slice(0, max);

function dispatchAuthorized(req) {
  const expected = String(process.env.DANINI_ADMIN_SECRET || '');
  const supplied = String(req.headers['x-danini-admin-secret'] || req.query.key || '');
  if (!expected || !supplied || expected.length !== supplied.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
}

function requireDispatchAdmin(req, res, next) {
  if (!process.env.DANINI_ADMIN_SECRET) {
    return res.status(503).json({ ok: false, error: 'DISPATCH_ADMIN_SECRET_NOT_CONFIGURED' });
  }
  if (!dispatchAuthorized(req)) {
    return res.status(401).json({ ok: false, error: 'DISPATCH_NOT_AUTHORIZED' });
  }
  return next();
}

function renderAccessPage(message = '') {
  const safe = clean(message, 200).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  return `<!doctype html><html lang="sr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>DaniniHub Dispatch Access</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#07131f;color:#e5edf7;font-family:Inter,Arial,sans-serif}.card{width:min(440px,calc(100% - 32px));padding:28px;border:1px solid #28425a;border-radius:18px;background:#0d1d2c}h1{margin-top:0}input,button{width:100%;padding:13px;border-radius:10px;border:1px solid #38556f;box-sizing:border-box}input{background:#07131f;color:#fff;margin:12px 0}button{background:#16b8c8;color:#06131c;font-weight:800;cursor:pointer}.error{color:#fca5a5}</style></head><body><main class="card"><h1>Dispatch Pilot Workspace</h1><p>Interni pristup. Unesite administratorski ključ.</p>${safe ? `<p class="error">${safe}</p>` : ''}<form method="get"><input name="key" type="password" required autocomplete="current-password"><button type="submit">Otvori Workspace</button></form></main></body></html>`;
}

function validateCaseInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'INVALID_CASE_BODY' };
  const caseId = clean(body.caseId, 64);
  if (!/^(TEST|DEMO)-[A-Z0-9_-]{1,50}$/i.test(caseId)) return { error: 'FICTITIOUS_CASE_ID_REQUIRED' };
  if (!body.payload || typeof body.payload !== 'object' || body.payload.fictitious !== true) return { error: 'FICTITIOUS_CASE_REQUIRED' };
  if (body.payload.realData === true) return { error: 'REAL_DATA_NOT_ALLOWED' };
  const serialized = JSON.stringify(body.payload);
  if (Buffer.byteLength(serialized, 'utf8') > 48 * 1024) return { error: 'CASE_PAYLOAD_TOO_LARGE' };
  const approval = clean(body.approval, 20).toUpperCase();
  if (!['PENDING', 'APPROVED', 'REJECTED'].includes(approval)) return { error: 'INVALID_APPROVAL_STATE' };
  const status = clean(body.status || 'DRAFT', 40).toUpperCase();
  if (!['DRAFT', 'IN_REVIEW', 'CLOSED'].includes(status)) return { error: 'INVALID_CASE_STATUS' };
  return { caseId, approval, status, payload: body.payload };
}

function mountDispatchRuntime(app, options = {}) {
  const store = options.store || createDispatchCaseStore(options.storeOptions);

  app.get('/internal/dispatch-pilot-workspace', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow');
    if (!process.env.DANINI_ADMIN_SECRET) return res.status(503).type('html').send(renderAccessPage('Administratorski pristup još nije konfigurisan.'));
    if (!dispatchAuthorized(req)) return res.status(401).type('html').send(renderAccessPage(req.query.key ? 'Pogrešan ključ.' : ''));
    return next();
  });

  app.use('/api/v1/dispatch', express.json({ limit: '64kb' }), requireDispatchAdmin);

  app.get('/api/v1/dispatch/cases', async (req, res) => {
    try {
      const cases = await store.list(req.query.limit);
      return res.json({ ok: true, storageMode: store.mode, cases });
    } catch (error) {
      console.error('Dispatch case list failed:', error.message);
      return res.status(503).json({ ok: false, error: 'DISPATCH_STORE_UNAVAILABLE' });
    }
  });

  app.get('/api/v1/dispatch/cases/:caseId', async (req, res) => {
    try {
      const caseId = clean(req.params.caseId, 64);
      const record = await store.get(caseId);
      if (!record) return res.status(404).json({ ok: false, error: 'DISPATCH_CASE_NOT_FOUND' });
      return res.json({ ok: true, storageMode: store.mode, case: record });
    } catch (error) {
      console.error('Dispatch case read failed:', error.message);
      return res.status(503).json({ ok: false, error: 'DISPATCH_STORE_UNAVAILABLE' });
    }
  });

  app.put('/api/v1/dispatch/cases/:caseId', async (req, res) => {
    const input = validateCaseInput({ ...req.body, caseId: req.params.caseId });
    if (input.error) return res.status(400).json({ ok: false, error: input.error });
    try {
      const record = await store.upsert(input);
      return res.json({ ok: true, storageMode: store.mode, case: record });
    } catch (error) {
      console.error('Dispatch case save failed:', error.message);
      return res.status(503).json({ ok: false, error: 'DISPATCH_STORE_UNAVAILABLE' });
    }
  });
}

module.exports = { dispatchAuthorized, mountDispatchRuntime, requireDispatchAdmin, validateCaseInput };
