'use strict';

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { bootstrapDispatchAccess, signingMaterial } = require('./dispatch-access-bootstrap');
const { createSessionToken, mountDispatchRuntime } = require('./server-dispatch-runtime');
const { mountPublicRuntime } = require('./server-public-runtime');

const app = express();
const PORT = Number(process.env.PORT || 4242);
const DEPLOYMENT_MARKER = 'daninihub-dispatch-direct-workspace-v6';
const DISPATCH_PATH = '/internal/dispatch-pilot-workspace';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const COOKIE_NAME = 'danini_dispatch_session';

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.DANINI_PUBLIC_URL || 'https://daninihub.com' }));

bootstrapDispatchAccess().catch(error => {
  console.error(`Dispatch access bootstrap failed: ${error.message}`);
});

// V6: the internal pilot uses fictitious TEST/DEMO data only. Open the visible
// Workspace directly and establish a short HttpOnly session automatically.
app.get(DISPATCH_PATH, (req, res, next) => {
  const hasSession = String(req.headers.cookie || '').includes(`${COOKIE_NAME}=`);
  if (hasSession) return next();
  const token = createSessionToken();
  if (!token) return next();
  res.set('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Strict`);
  return res.redirect(303, req.originalUrl || `${DISPATCH_PATH}?lang=sr`);
});

mountDispatchRuntime(app);
mountPublicRuntime(app);

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'DaniniHub Transport & Logistics',
    deploymentMarker: DEPLOYMENT_MARKER,
    publicLanguages: ['de', 'sr'],
    contactDelivery: Boolean(process.env.BREVO_API_KEY && (process.env.BREVO_SENDER_EMAIL || process.env.DANINIHUB_SENDER_EMAIL || process.env.MAIL_FROM || process.env.EMAIL_FROM)),
    manualLeadReview: Boolean(process.env.DANINI_ADMIN_SECRET || process.env.DANINI_SESSION_SECRET || process.env.BREVO_API_KEY),
    dispatchAccessConfigured: Boolean(signingMaterial()),
    dispatchAccessMode: 'direct-fictitious-pilot',
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
    dispatchWorkspaceVersion: 'direct-workspace-v6',
    contact: 'info@daninihub.com'
  });
});

app.listen(PORT, () => {
  console.log(`DaniniHub Transport runtime listening on port ${PORT}`);
});
