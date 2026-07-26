'use strict';

require('dotenv').config();
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');
const express = require('express');
const { signingMaterial } = require('./dispatch-access-bootstrap');
const { createSessionToken, mountDispatchRuntime } = require('./server-dispatch-runtime');
const { mountPublicRuntime } = require('./server-public-runtime');
const { mountDispoCheckRuntime } = require('./server-dispo-check-runtime');
const { mountDispoCheckContactInterceptor } = require('./server-dispo-check-contact-interceptor');

const app = express();
const PORT = Number(process.env.PORT || 4242);
const DEPLOYMENT_MARKER = 'daninihub-dispocheck-personalized-email-v11';
const DISPATCH_PATH = '/internal/dispatch-pilot-workspace';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const COOKIE_NAME = 'danini_dispatch_session';
const FRONTEND_INDEX = path.join(__dirname, 'daninihub-front', 'dist', 'index.html');

// The current Workspace accepts fictitious TEST/DEMO cases only. Ensure the
// internal pilot can always establish a server-side session even when no
// persistent Dispatch secret has been configured in the hosting environment.
if (!signingMaterial()) {
  process.env.DANINI_SESSION_SECRET = crypto.randomBytes(32).toString('hex');
  process.env.DANINI_DISPATCH_ACCESS_MODE = 'ephemeral-direct-pilot';
}

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.DANINI_PUBLIC_URL || 'https://daninihub.com' }));

// Do not send Dispatch access emails during startup, deployment or restart.
// Access email delivery remains available only through an explicit user action.

// Always replace a stale browser cookie with a fresh valid session before the
// protected runtime evaluates the request. The redirect happens once.
app.get(DISPATCH_PATH, (req, res, next) => {
  const lang = req.query.lang === 'de' ? 'de' : 'sr';
  const token = createSessionToken();
  if (!token) return res.status(503).type('text/plain').send('Dispatch session unavailable');
  res.set('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Strict`);
  if (req.query.open === '1') return next();
  return res.redirect(303, `${DISPATCH_PATH}?lang=${lang}&open=1`);
});

mountDispatchRuntime(app);
mountDispoCheckRuntime(app);
mountDispoCheckContactInterceptor(app);
mountPublicRuntime(app);

// Explicit SPA document handler. express.static serves assets, but the virtual
// internal route needs the built React index document to avoid "Cannot GET".
app.get(DISPATCH_PATH, (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('X-Robots-Tag', 'noindex, nofollow');
  return res.sendFile(FRONTEND_INDEX);
});

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'DaniniHub Transport & Logistics',
    deploymentMarker: DEPLOYMENT_MARKER,
    publicLanguages: ['de', 'sr'],
    contactDelivery: Boolean(process.env.BREVO_API_KEY && (process.env.BREVO_SENDER_EMAIL || process.env.DANINIHUB_SENDER_EMAIL || process.env.MAIL_FROM || process.env.EMAIL_FROM)),
    dispoCheckResultEmail: Boolean(process.env.BREVO_API_KEY),
    manualLeadReview: Boolean(process.env.DANINI_ADMIN_SECRET || process.env.DANINI_SESSION_SECRET || process.env.BREVO_API_KEY),
    dispatchAccessConfigured: Boolean(signingMaterial()),
    dispatchAccessMode: process.env.DANINI_DISPATCH_ACCESS_MODE || 'direct-fictitious-pilot',
    dispatchAiConfigured: Boolean(process.env.OPENAI_API_KEY),
    durableLeadDatabase: Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME),
    durableDispatchDatabase: Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME)
  });
});

app.get('/api/runtime-version', (req, res) => {
  res.json({
    ok: true,
    service: 'Balkan-DACH Transport Operations Support',
    deploymentMarker: DEPLOYMENT_MARKER,
    serbianTmsVideoId: 'wGFtA53BirQ',
    dispatchWorkspaceVersion: 'no-startup-email-v9',
    dispoCheckVersion: 'personalized-result-email-v2',
    contact: 'info@daninihub.com'
  });
});

app.listen(PORT, () => {
  console.log(`DaniniHub Transport runtime listening on port ${PORT}`);
});