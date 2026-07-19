'use strict';

const crypto = require('crypto');
const express = require('express');
const { structureDispatchMessage } = require('./core/dispatch-ai-structure');
const { createDispatchCaseStore } = require('./dispatch-case-store');

const COOKIE_NAME = 'danini_dispatch_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const clean = (value, max = 200) => String(value || '').trim().slice(0, max);

function dispatchSecret() {
  return String(process.env.DANINI_DISPATCH_ADMIN_SECRET || process.env.DANINI_ADMIN_SECRET || '');
}

function sameSecret(candidate) {
  const expected = dispatchSecret();
  const supplied = String(candidate || '');
  if (!expected || !supplied || expected.length !== supplied.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
}

function sessionKey() {
  const secret = dispatchSecret();
  if (!secret) return null;
  return crypto.createHash('sha256').update(`daninihub-dispatch-session-v1:${secret}`).digest();
}

function createSessionToken() {
  const key = sessionKey();
  if (!key) return '';
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const value = String(expiresAt);
  const signature = crypto.createHmac('sha256', key).update(value).digest('hex');
  return `${value}.${signature}`;
}

function parseCookies(req) {
  return Object.fromEntries(String(req.headers.cookie || '').split(';').map(part => part.trim()).filter(Boolean).map(part => {
    const separator = part.indexOf('=');
    if (separator < 0) return [part, ''];
    return [part.slice(0, separator), decodeURIComponent(part.slice(separator + 1))];
  }));
}

function validSessionToken(candidate) {
  const key = sessionKey();
  const [expiresRaw, signature = ''] = String(candidate || '').split('.');
  const expiresAt = Number(expiresRaw);
  if (!key || !Number.isFinite(expiresAt) || expiresAt <= Date.now() || signature.length !== 64) return false;
  const expected = crypto.createHmac('sha256', key).update(String(expiresAt)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

function dispatchAuthorized(req) {
  const supplied = req.headers['x-danini-admin-secret'] || req.query.key;
  if (sameSecret(supplied)) return true;
  return validSessionToken(parseCookies(req)[COOKIE_NAME]);
}

function requireDispatchAdmin(req, res, next) {
  if (!dispatchSecret()) {
    return res.status(503).json({ ok: false, error: 'DISPATCH_ADMIN_SECRET_NOT_CONFIGURED' });
  }
  if (!dispatchAuthorized(req)) {
    return res.status(401).json({ ok: false, error: 'DISPATCH_NOT_AUTHORIZED' });
  }
  return next();
}

function renderAccessPage(message = '') {
  const safe = clean(message, 240).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  return `<!doctype html><html lang="sr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>DaniniHub Dispatch Access</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#07131f;color:#e5edf7;font-family:Inter,Arial,sans-serif}.card{width:min(520px,calc(100% - 32px));padding:30px;border:1px solid #28425a;border-radius:18px;background:#0d1d2c}.badge{display:inline-block;padding:7px 10px;border-radius:999px;background:#123149;color:#69d9e5;font-size:12px;font-weight:800;letter-spacing:.08em}h1{margin:16px 0 8px}.muted{color:#a9b9c7}.divider{height:1px;background:#28425a;margin:20px 0}input,button{width:100%;padding:14px;border-radius:10px;border:1px solid #38556f;box-sizing:border-box}input{background:#07131f;color:#fff;margin:12px 0}button{background:#16b8c8;color:#06131c;font-weight:900;cursor:pointer}.error{color:#fca5a5;padding:10px 12px;border:1px solid #7f1d1d;border-radius:10px;background:#2a1116}</style></head><body><main class="card"><span class="badge">INTERNI PRISTUP / INTERNER ZUGANG</span><h1>Dispatch Pilot Workspace</h1><p><strong>SR:</strong> Otvorite najnoviji pristupni link poslat na DaniniHub administratorski email.</p><p><strong>DE:</strong> Öffnen Sie den neuesten Zugangslink aus der DaniniHub-Administrator-E-Mail.</p>${safe ? `<p class="error">${safe}</p>` : ''}<div class="divider"></div><p class="muted">Ručni unos je rezervna opcija. / Die manuelle Eingabe ist nur die Reserveoption.</p><form method="get"><input name="key" type="password" required autocomplete="current-password" placeholder="Administratorski ključ / Administratorschlüssel"><button type="submit">OTVORI / ÖFFNEN</button></form></main></body></html>`;
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
  const structure = options.structureDispatchMessage || structureDispatchMessage;

  app.get('/internal/dispatch-pilot-workspace', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow');
    if (!dispatchSecret()) return res.status(503).type('html').send(renderAccessPage('SR: Pristupni link još nije generisan. DE: Der Zugangslink wurde noch nicht erzeugt.'));
    if (req.query.key && sameSecret(req.query.key)) {
      res.set('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(createSessionToken())}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Strict`);
      return res.redirect(303, '/internal/dispatch-pilot-workspace');
    }
    if (!validSessionToken(parseCookies(req)[COOKIE_NAME])) return res.status(401).type('html').send(renderAccessPage(req.query.key ? 'SR: Pogrešan ili istekao ključ. DE: Falscher oder abgelaufener Schlüssel.' : ''));
    return next();
  });

  app.use('/api/v1/dispatch', express.json({ limit: '64kb' }), requireDispatchAdmin);

  app.post('/api/v1/dispatch/logout', (req, res) => {
    res.set('Set-Cookie', `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`);
    return res.json({ ok: true });
  });

  app.post('/api/v1/dispatch/structure', async (req, res) => {
    if (!process.env.OPENAI_API_KEY && !options.aiClient) {
      return res.status(503).json({ ok: false, error: 'DISPATCH_AI_NOT_CONFIGURED' });
    }
    const input = {
      fictitious: req.body?.fictitious === true,
      rawMessage: clean(req.body?.rawMessage, 5000),
      route: clean(req.body?.route, 300),
      vehicle: clean(req.body?.vehicle, 200)
    };
    try {
      const result = await structure(input, { client: options.aiClient, model: options.aiModel });
      return res.json({ ok: true, approval: 'PENDING', structure: result });
    } catch (error) {
      const inputErrors = ['FICTITIOUS_CASE_REQUIRED', 'RAW_MESSAGE_REQUIRED'];
      const status = inputErrors.includes(error.code) ? 400 : 503;
      console.error('Dispatch AI structure failed:', error.message);
      return res.status(status).json({ ok: false, error: error.code || 'DISPATCH_AI_FAILED' });
    }
  });

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

module.exports = { createSessionToken, dispatchAuthorized, dispatchSecret, mountDispatchRuntime, requireDispatchAdmin, validSessionToken, validateCaseInput };
