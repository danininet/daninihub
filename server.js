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
const { mountTransportRoomRuntime } = require('./server-transport-room-runtime');
const { mountTransportNetworkRuntime } = require('./server-transport-network-runtime');
const { mountCapacitySignalRuntime } = require('./server-capacity-signal-runtime');
const { mountCapacityConsentRuntime } = require('./server-capacity-consent-runtime');

const app = express();
const PORT = Number(process.env.PORT || 4242);
const DEPLOYMENT_MARKER = 'daninihub-video-route-cache-fix-v27';
const DISPATCH_PATH = '/internal/dispatch-pilot-workspace';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const COOKIE_NAME = 'danini_dispatch_session';
const FRONTEND_INDEX = path.join(__dirname, 'daninihub-front', 'dist', 'index.html');

if (!signingMaterial()) {
  process.env.DANINI_SESSION_SECRET = crypto.randomBytes(32).toString('hex');
  process.env.DANINI_DISPATCH_ACCESS_MODE = 'ephemeral-direct-pilot';
}

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.DANINI_PUBLIC_URL || 'https://daninihub.com' }));

app.get(DISPATCH_PATH, (req, res, next) => {
  const lang = req.query.lang === 'de' ? 'de' : 'sr';
  const token = createSessionToken();
  if (!token) return res.status(503).type('text/plain').send('Dispatch session unavailable');
  res.set('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Strict`);
  if (req.query.open === '1') return next();
  return res.redirect(303, `${DISPATCH_PATH}?lang=${lang}&open=1`);
});

mountDispatchRuntime(app);
mountTransportRoomRuntime(app);
mountTransportNetworkRuntime(app);
mountDispoCheckRuntime(app);
mountDispoCheckContactInterceptor(app);
mountCapacitySignalRuntime(app);
mountCapacityConsentRuntime(app);

const FRESH_FRONTEND_ROUTES = [
  '/de/fuer-dach-speditionen',
  '/sr/za-balkanske-transportne-firme',
  '/de/vorher-nachher',
  '/sr/pre-posle',
  '/de/capacity-signal',
  '/sr/signal-kapaciteta',
  '/de/praxis-wissen/video',
  '/sr/praksa-znanje/video',
  '/de/praxis-wissen/warum-tms-disponenten-nicht-ersetzen',
  '/sr/praksa-znanje/zasto-tms-ne-menja-disponente'
];

app.get(FRESH_FRONTEND_ROUTES, (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  return res.sendFile(FRONTEND_INDEX);
});

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
    targetAudiencePages: true,
    beforeAfterProofPage: true,
    capacitySignalForms: true,
    capacitySignalDesk: true,
    capacityMatchConsentDesk: true,
    transportNetworkSessionRecovery: true,
    transportNetworkWorkspaceRepair: true,
    tmsArticleVideos: { de:'FTMCWxUGcig', sr:'wGFtA53BirQ' },
    driveVideoLibrary: {
      dispatchersVsSoftware: '1jEKzE64EaHneeMk219tF1WgbIkchINia',
      balkanDach: '1hR5qcUxPX4emg-_YokPLmWSDNMfQbP4F'
    },
    contactDelivery: Boolean(process.env.BREVO_API_KEY && (process.env.BREVO_SENDER_EMAIL || process.env.DANINIHUB_SENDER_EMAIL || process.env.MAIL_FROM || process.env.EMAIL_FROM)),
    dispoCheckResultEmail: Boolean(process.env.BREVO_API_KEY),
    transportRoomPersistence: true,
    transportRoomRoleAccess: true,
    transportRoomInvitations: true,
    transportRoomOtpVerification: true,
    transportRoomAuditLog: true,
    transportNetworkCompanies: true,
    transportNetworkMembers: true,
    transportNetworkMultipleRooms: true,
    transportNetworkRoomConnection: true,
    transportRoomInvitationEmail: Boolean(process.env.BREVO_API_KEY),
    manualLeadReview: Boolean(process.env.DANINI_ADMIN_SECRET || process.env.DANINI_SESSION_SECRET || process.env.BREVO_API_KEY),
    dispatchAccessConfigured: Boolean(signingMaterial()),
    dispatchAccessMode: process.env.DANINI_DISPATCH_ACCESS_MODE || 'direct-fictitious-pilot',
    dispatchAiConfigured: Boolean(process.env.OPENAI_API_KEY),
    durableLeadDatabase: Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME),
    durableDispatchDatabase: Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME)
  });
});

app.get('/api/runtime-version', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({
    ok: true,
    service: 'Balkan-DACH Transport Operations Support',
    deploymentMarker: DEPLOYMENT_MARKER,
    serbianTmsVideoId: 'wGFtA53BirQ',
    germanTmsVideoId: 'FTMCWxUGcig',
    driveDispatchersVideoId: '1jEKzE64EaHneeMk219tF1WgbIkchINia',
    driveBalkanDachVideoId: '1hR5qcUxPX4emg-_YokPLmWSDNMfQbP4F',
    dispatchWorkspaceVersion: 'no-startup-email-v9',
    dispoCheckVersion: 'personalized-result-email-v2',
    transportRoomVersion: 'case-specific-company-access-v5',
    transportNetworkVersion: 'session-recovery-workspace-repair-v3',
    audiencePagesVersion: 'balkan-dach-target-pages-v1',
    beforeAfterProofVersion: 'status-and-capacity-signal-v1',
    capacitySignalVersion: 'manual-review-v2',
    signalDeskVersion: 'protected-manual-review-v2',
    signalConsentVersion: 'two-sided-consent-and-connection-v2',
    knowledgeVideoVersion: 'drive-library-de-sr-v5-route-cache-fix',
    contact: 'info@daninihub.com'
  });
});

// Register the broad public runtime only after exact public/API routes.
// This prevents an earlier fallback from serving a stale or wrong page.
mountPublicRuntime(app);

app.listen(PORT, () => {
  console.log(`DaniniHub Transport runtime listening on port ${PORT}`);
});