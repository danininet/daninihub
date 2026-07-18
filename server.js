'use strict';

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require('path');
const { mountPublicRuntime } = require('./server-public-runtime');

const app = express();
const PORT = Number(process.env.PORT || 4242);
const DEPLOYMENT_MARKER = 'daninihub-transport-operations-2026-07-18-service-pages';

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.DANINI_PUBLIC_URL || 'https://daninihub.com' }));
mountPublicRuntime(app);

const businessRoutes = [
  '/de/leistungsrahmen', '/de/continuity-support', '/de/fahrerkommunikation',
  '/sr/obim-usluge', '/sr/kontinuitet-podrska', '/sr/komunikacija-vozaci'
];
businessRoutes.forEach(route => app.get(route, (req, res) => {
  res.sendFile(path.join(__dirname, 'daninihub-front', 'dist', 'index.html'));
}));

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'DaniniHub Transport & Logistics',
    deploymentMarker: DEPLOYMENT_MARKER,
    publicLanguages: ['de', 'sr'],
    contactDelivery: Boolean(process.env.BREVO_API_KEY)
  });
});

app.get('/api/runtime-version', (req, res) => {
  res.json({
    ok: true,
    service: 'Balkan-DACH Transport Operations Support',
    deploymentMarker: DEPLOYMENT_MARKER,
    contact: 'info@daninihub.com'
  });
});

app.listen(PORT, () => {
  console.log(`DaniniHub Transport runtime listening on port ${PORT}`);
});
