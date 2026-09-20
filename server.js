'use strict';

require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');
const { mountPublicRuntime } = require('./server-public-runtime');
const { mountAdminRuntime } = require('./server-admin-runtime');
const { mountAiOfficeRuntime } = require('./server-ai-office-runtime');

const app = express();
const PORT = Number(process.env.PORT || 4242);
const DEPLOYMENT_MARKER = 'daninihub-ai-office-mvp-v1';
const FRONTEND_INDEX = path.join(__dirname, 'daninihub-front', 'dist', 'index.html');

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.DANINI_PUBLIC_URL || 'https://daninihub.com' }));

// The current production surface is intentionally narrow:
// public Revenue OS + protected owner Control Center.
// Legacy transport/dispatch runtimes remain in the repository for rollback/history,
// but are not mounted on the production web server.
mountAdminRuntime(app);

app.get('/health', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({
    ok: true,
    service: 'DaniniHub Revenue OS',
    deploymentMarker: DEPLOYMENT_MARKER,
    publicLanguages: ['de', 'sr'],
    publicProduct: 'AI Office 24/7 working pilot MVP',
    revenueControlCenter: Boolean(process.env.DANINI_ADMIN_SECRET),
    contactDelivery: Boolean(process.env.BREVO_API_KEY && (process.env.BREVO_SENDER_EMAIL || process.env.DANINIHUB_SENDER_EMAIL || process.env.MAIL_FROM || process.env.EMAIL_FROM)),
    durableLeadDatabase: Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME),
    aiPublicDecisioning: false,
    aiOfficeWorkflowMounted: true,
    legacyTransportPublicRuntimeMounted: false
  });
});

app.get('/api/runtime-version', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({
    ok: true,
    service: 'DaniniHub Revenue OS',
    deploymentMarker: DEPLOYMENT_MARKER,
    product: 'Revenue Unit #1 — AI Office 24/7',
    workflow: ['SIGNAL','OFFER','SELL','EXECUTE','EVIDENCE','DECIDE'],
    ownerRole: 'controller',
    contact: 'info@daninihub.com'
  });
});

// Working AI Office pilot runtime: client intake + protected office dashboard.
mountAiOfficeRuntime(app);

// Server-rendered SEO/legal/public routes and contact intake.
mountPublicRuntime(app);

// SPA fallback only for current public language routes that are not explicitly
// server-rendered above.
app.get(/^\/(?:de|sr)(?:\/.*)?$/, (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  return res.sendFile(FRONTEND_INDEX);
});

app.listen(PORT, () => {
  console.log(`DaniniHub Revenue OS runtime listening on port ${PORT}`);
});
