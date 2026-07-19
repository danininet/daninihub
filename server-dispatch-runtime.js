'use strict';

const crypto = require('crypto');
const express = require('express');
const { structureDispatchMessage } = require('./core/dispatch-ai-structure');
const { createDispatchCaseStore } = require('./dispatch-case-store');
const { sendDispatchAccessLink, signingMaterial, verifyAccessToken } = require('./dispatch-access-bootstrap');

const COOKIE_NAME = 'danini_dispatch_session';
const DISPATCH_PATH = '/internal/dispatch-pilot-workspace';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const ACCESS_REQUEST_COOLDOWN_MS = 5 * 60 * 1000;
const accessRequestTimes = new Map();
const clean = (value, max = 200) => String(value || '').trim().slice(0, max);

function sessionKey() {
  const material = signingMaterial();
  if (!material) return null;
  return crypto.createHash('sha256').update(`daninihub-dispatch-session-v2:${material}`).digest();
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
  return validSessionToken(parseCookies(req)[COOKIE_NAME]);
}

function requireDispatchAdmin(req, res, next) {
  if (!signingMaterial()) return res.status(503).json({ ok: false, error: 'DISPATCH_ACCESS_NOT_CONFIGURED' });
  if (!dispatchAuthorized(req)) return res.status(401).json({ ok: false, error: 'DISPATCH_NOT_AUTHORIZED' });
  return next();
}

function escapeHtml(value) {
  return clean(value, 300).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function renderAccessPage(lang = 'sr', options = {}) {
  const de = lang === 'de';
  const message = escapeHtml(options.message || '');
  const sent = Boolean(options.sent);
  const title = de ? 'Interner Zugang' : 'Interni pristup';
  const intro = de
    ? 'Fordern Sie einen neuen geschützten Zugangslink an. Er wird ausschließlich an die DaniniHub-Administratoradresse gesendet.'
    : 'Zatražite novi zaštićeni pristupni link. Šalje se isključivo na DaniniHub administratorsku adresu.';
  const action = de ? 'NEUEN ZUGANGSLINK SENDEN' : 'POŠALJI NOVI PRISTUPNI LINK';
  const sentText = de
    ? 'Der neue Link wurde gesendet. Öffnen Sie die neueste DaniniHub-E-Mail.'
    : 'Novi link je poslat. Otvorite najnoviji DaniniHub email.';
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>DaniniHub Dispatch Access</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#07131f;color:#e5edf7;font-family:Inter,Arial,sans-serif}.card{width:min(520px,calc(100% - 32px));padding:30px;border:1px solid #28425a;border-radius:18px;background:#0d1d2c}.lang{display:flex;justify-content:flex-end;gap:8px}.lang a{padding:8px 12px;border:1px solid #38556f;border-radius:999px;color:#d9e8f3;text-decoration:none;font-weight:800}.lang a.active{background:#16b8c8;color:#06131c;border-color:#16b8c8}.badge{display:inline-block;padding:7px 10px;border-radius:999px;background:#123149;color:#69d9e5;font-size:12px;font-weight:800;letter-spacing:.08em}h1{margin:16px 0 8px}.muted{color:#a9b9c7}.notice,.error{padding:12px 14px;border-radius:10px;margin:18px 0}.notice{background:#0d3b31;color:#9ff3d6;border:1px solid #1f7a62}.error{background:#2a1116;color:#fca5a5;border:1px solid #7f1d1d}button{width:100%;padding:15px;border-radius:10px;border:0;background:#16b8c8;color:#06131c;font-weight:900;cursor:pointer;margin-top:18px}</style></head><body><main class="card"><nav class="lang"><a class="${lang === 'sr' ? 'active' : ''}" href="${DISPATCH_PATH}?lang=sr">SR</a><a class="${lang === 'de' ? 'active' : ''}" href="${DISPATCH_PATH}?lang=de">DE</a></nav><span class="badge">${title.toUpperCase()}</span><h1>Dispatch Pilot Workspace</h1><p>${intro}</p>${sent ? `<p class="notice">${sentText}</p>` : ''}${message ? `<p class="error">${message}</p>` : ''}<form method="post" action="${DISPATCH_PATH}/request-access"><input type="hidden" name="lang" value="${lang}"><button type="submit">${action}</button></form><p class="muted">${de ? 'Nach dem Öffnen sehen Sie den geführten Ablauf mit den Schritten 1–2–3.' : 'Nakon otvaranja videćete vođeni tok sa koracima 1–2–3.'}</p></main></body></html>`;
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
  const sendAccessLink = options.sendDispatchAccessLink || sendDispatchAccessLink;

  app.post(`${DISPATCH_PATH}/request-access`, express.urlencoded({ extended: false }), async (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow');
    const lang = req.body?.lang === 'de' ? 'de' : 'sr';
    const requestKey = String(req.ip || req.socket?.remoteAddress || 'global');
    const now = Date.now();
    const previous = accessRequestTimes.get(requestKey) || 0;
    if (now - previous < ACCESS_REQUEST_COOLDOWN_MS) {
      const message = lang === 'de' ? 'Ein Zugangslink wurde bereits angefordert. Bitte prüfen Sie die neueste E-Mail.' : 'Pristupni link je već zatražen. Proverite najnoviji email.';
      return res.status(429).type('html').send(renderAccessPage(lang, { message }));
    }
    try {
      await sendAccessLink({ lang });
      accessRequestTimes.set(requestKey, now);
      return res.type('html').send(renderAccessPage(lang, { sent: true }));
    } catch (error) {
      console.error('Dispatch access request failed:', error.message);
      const message = lang === 'de' ? 'Der Zugangslink konnte nicht gesendet werden. Prüfen Sie die Runtime-Protokolle.' : 'Pristupni link nije mogao biti poslat. Proverite runtime log.';
      return res.status(503).type('html').send(renderAccessPage(lang, { message }));
    }
  });

  app.get(DISPATCH_PATH, (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow');
    const lang = req.query.lang === 'de' ? 'de' : 'sr';
    if (req.query.access) {
      const verified = verifyAccessToken(req.query.access);
      if (verified) {
        res.set('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(createSessionToken())}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Strict`);
        return res.redirect(303, `${DISPATCH_PATH}?lang=${verified.lang}`);
      }
      return res.redirect(303, `${DISPATCH_PATH}?lang=${lang}`);
    }
    return next();
  });

  app.use('/api/v1/dispatch', express.json({ limit: '64kb' }), requireDispatchAdmin);

  app.post('/api/v1/dispatch/logout', (req, res) => {
    res.set('Set-Cookie', `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`);
    return res.json({ ok: true });
  });

  app.post('/api/v1/dispatch/structure', async (req, res) => {
    if (!process.env.OPENAI_API_KEY && !options.aiClient) return res.status(503).json({ ok: false, error: 'DISPATCH_AI_NOT_CONFIGURED' });
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

module.exports = {
  ACCESS_REQUEST_COOLDOWN_MS,
  DISPATCH_PATH,
  createSessionToken,
  dispatchAuthorized,
  mountDispatchRuntime,
  renderAccessPage,
  requireDispatchAdmin,
  validSessionToken,
  validateCaseInput
};