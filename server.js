const cors = require('cors');
require('dotenv').config();

const express = require('express');
const Stripe = require('stripe');

const { writeAudit } = require('./core/audit');
const { mountLegalRuntime } = require('./server-legal-runtime');
const { mountEntryFlowLayer } = require('./server-entry-flow-layer');
const { mountPublicRuntime } = require('./server-public-runtime');
const { mountGuidedAnalysisRuntime } = require('./server-guided-analysis-runtime');
const { mountGumroadRuntime } = require('./server-gumroad-runtime');

const app = express();
app.set('trust proxy', 1);
app.use(cors());

const DEPLOYMENT_MARKER = 'danini-os-gumroad-activation-2026-07-17';
const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const PORT = Number(process.env.PORT || 4242);

mountLegalRuntime(app);
mountEntryFlowLayer(app);
mountGumroadRuntime(app);
mountGuidedAnalysisRuntime(app);
mountPublicRuntime(app);

app.get('/api/runtime-version', (req, res) => {
  res.json({
    ok: true,
    system: 'Danini OS',
    deploymentMarker: DEPLOYMENT_MARKER,
    publicRoot: 'sr',
    source: 'server.js + gumroad + guided-analysis-runtime',
    expectedRoot: process.env.DANINI_PUBLIC_URL || 'https://daninihub.com/'
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
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    try {
      const { activateFromStripeSession } = require('./core/activation-from-stripe');
      await activateFromStripeSession({
        session: event.data.object,
        stripeEventId: event.id,
        source: 'stripe_webhook'
      });
      writeAudit({ event: 'stripe_checkout_completed', stripe_event_id: event.id, session_id: event.data.object.id });
    } catch (error) {
      writeAudit({ event: 'stripe_activation_failed', stripe_event_id: event.id, error: error.message });
      return res.status(500).json({ error: 'activation_failed' });
    }
  }

  return res.json({ received: true });
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
    gumroad: {
      checkoutConfigured: Boolean(process.env.GUMROAD_ENTRY_URL),
      pingSecretConfigured: Boolean(process.env.GUMROAD_PING_SECRET),
      productConfigured: Boolean(process.env.GUMROAD_PRODUCT_ID || process.env.GUMROAD_PRODUCT_PERMALINK),
      deliveryConfigured: Boolean(process.env.BREVO_API_KEY && (process.env.BREVO_SENDER_EMAIL || process.env.DANINIHUB_SENDER_EMAIL))
    },
    stripeAutomation: stripeConfigured ? 'configured' : 'disabled'
  });
});

app.listen(PORT, () => {
  console.log(`Danini OS runtime listening on port ${PORT}`);
});