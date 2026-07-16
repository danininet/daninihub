const cors = require('cors');
require('dotenv').config();

const express = require('express');
const Stripe = require('stripe');
const path = require('path');
const fs = require('fs');

const { writeAudit } = require('./core/audit');
const { mountLegalRuntime } = require('./server-legal-runtime');
const { mountEntryFlowLayer } = require('./server-entry-flow-layer');
const { mountPublicRuntime } = require('./server-public-runtime');
const { mountGuidedAnalysisRuntime } = require('./server-guided-analysis-runtime');

const app = express();
app.use(cors());

const DEPLOYMENT_MARKER = 'danini-os-guided-analysis-mvp-2026-07-17';
const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const PORT = Number(process.env.PORT || 4242);

mountLegalRuntime(app);
mountEntryFlowLayer(app);
mountGuidedAnalysisRuntime(app);
mountPublicRuntime(app);

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not configured: Stripe automation remains disabled; Gumroad ENTRY MVP can stay public.');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn('STRIPE_WEBHOOK_SECRET not configured: Stripe webhook remains disabled; Gumroad ENTRY MVP can stay public.');
}

app.get('/api/runtime-version', (req, res) => {
  res.json({
    ok: true,
    system: 'Danini OS',
    deploymentMarker: DEPLOYMENT_MARKER,
    publicRoot: 'sr',
    source: 'server.js + guided-analysis-runtime',
    expectedRoot: 'https://daninihub.com/'
  });
});

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripeConfigured || !stripe) {
    return res.status(503).json({
      status: 'stripe_webhook_not_configured',
      rule: 'Stripe automation is disabled until STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are configured and validated.'
    });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    try {
      const session = event.data.object;
      const { activateFromStripeSession } = require('./core/activation-from-stripe');
      await activateFromStripeSession(session);
      await writeAudit('stripe.checkout.completed', { sessionId: session.id });
    } catch (err) {
      console.error('Activation from Stripe failed:', err);
      await writeAudit('stripe.activation.failed', { error: err.message });
      return res.status(500).json({ error: 'activation_failed' });
    }
  }

  res.json({ received: true });
});

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    system: 'Danini OS',
    deploymentMarker: DEPLOYMENT_MARKER,
    port: PORT,
    publicWebLayer: 'stable_runtime',
    legalRuntime: 'mounted_before_public_routes',
    guidedAnalysis: {
      product: 'die-ki-fragt-nach',
      price: 12,
      currency: 'EUR',
      activationConfigured: Boolean(process.env.DANINI_ACTIVATION_SECRET),
      sessionSecurityConfigured: Boolean(process.env.DANINI_SESSION_SECRET),
      modelConfigured: Boolean(process.env.GEMINI_API_KEY)
    },
    entry: {
      provider: 'gumroad_mvp',
      configured: Boolean(process.env.GUMROAD_ENTRY_URL)
    },
    stripeAutomation: stripeConfigured ? 'configured' : 'disabled'
  });
});

app.listen(PORT, () => {
  console.log(`Danini OS runtime listening on port ${PORT}`);
});
