'use strict';

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { mountPublicRuntime } = require('./server-public-runtime');

const app = express();
const PORT = Number(process.env.PORT || 4242);
const DEPLOYMENT_MARKER = 'daninihub-transport-2026-07-19-serbian-video-wGFtA53BirQ-v2';
const SERBIAN_TMS_ARTICLE = /^\/sr\/praksa-znanje\/zasto-tms-ne-menja-disponente\/?$/;
const SERBIAN_TMS_VIDEO_ID = 'wGFtA53BirQ';

const serbianVideoRepairScript = `<script data-daninihub-video-fix="${SERBIAN_TMS_VIDEO_ID}">
(() => {
  const correctId = '${SERBIAN_TMS_VIDEO_ID}';
  const correctEmbed = 'https://www.youtube-nocookie.com/embed/' + correctId + '?autoplay=1&rel=0&start=5';
  const correctWatch = 'https://youtu.be/' + correctId + '?t=5';
  const repair = () => {
    document.querySelectorAll('iframe[src*="youtube"], iframe[src*="youtu.be"]').forEach(frame => {
      if (frame.getAttribute('src') !== correctEmbed) frame.setAttribute('src', correctEmbed);
      frame.setAttribute('title', 'Dispečeri vs. softver: zašto TMS ne menja disponenta | DaniniHub');
    });
    document.querySelectorAll('.article-video a[href*="youtu"], .article-video a[href*="youtube"]').forEach(link => {
      if (link.getAttribute('href') !== correctWatch) link.setAttribute('href', correctWatch);
    });
  };
  const observer = new MutationObserver(repair);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'href'] });
  document.addEventListener('DOMContentLoaded', repair, { once: true });
  repair();
})();
</script>`;

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.DANINI_PUBLIC_URL || 'https://daninihub.com' }));
app.use((req, res, next) => {
  if (!SERBIAN_TMS_ARTICLE.test(req.path)) return next();

  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    'Surrogate-Control': 'no-store'
  });

  const originalSend = res.send.bind(res);
  res.send = body => {
    if (typeof body === 'string' && body.includes('</body>')) {
      const withoutOldFix = body.replace(/<script data-daninihub-video-fix="[^"]+">[\s\S]*?<\/script>/g, '');
      body = withoutOldFix.replace('</body>', `${serbianVideoRepairScript}</body>`);
    }
    return originalSend(body);
  };
  next();
});
mountPublicRuntime(app);

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'DaniniHub Transport & Logistics',
    deploymentMarker: DEPLOYMENT_MARKER,
    publicLanguages: ['de', 'sr'],
    contactDelivery: Boolean(process.env.BREVO_API_KEY && (process.env.BREVO_SENDER_EMAIL || process.env.DANINIHUB_SENDER_EMAIL || process.env.MAIL_FROM || process.env.EMAIL_FROM)),
    manualLeadReview: Boolean(process.env.DANINI_ADMIN_SECRET || process.env.DANINI_SESSION_SECRET || process.env.BREVO_API_KEY),
    durableLeadDatabase: Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME)
  });
});

app.get('/api/runtime-version', (req, res) => {
  res.json({
    ok: true,
    service: 'Balkan-DACH Transport Operations Support',
    deploymentMarker: DEPLOYMENT_MARKER,
    serbianTmsVideoId: SERBIAN_TMS_VIDEO_ID,
    contact: 'info@daninihub.com'
  });
});

app.listen(PORT, () => {
  console.log(`DaniniHub Transport runtime listening on port ${PORT}`);
});