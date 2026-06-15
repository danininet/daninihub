const cors = require('cors');
require('dotenv').config();

const express = require('express');
const Stripe = require('stripe');
const path = require('path');
const fs = require('fs');

const { writeAudit } = require('./core/audit');
const { mountEntryFlowLayer } = require('./server-entry-flow-layer');
const { mountPublicLayer } = require('./server-public-layer');

const app = express();
app.use(cors());

const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const PORT = Number(process.env.PORT || 4242);

mountEntryFlowLayer(app);
mountPublicLayer(app);

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not configured: Stripe automation remains disabled; Gumroad ENTRY MVP can stay public.');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn('STRIPE_WEBHOOK_SECRET not configured: Stripe webhook remains disabled; Gumroad ENTRY MVP can stay public.');
}

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

  try {
    if (event.type === 'checkout.session.completed') {
      const { activateFromStripeSession } = require('./core/activation-from-stripe');
      await activateFromStripeSession(event.data.object);
    }
  } catch (err) {
    console.error('Activation failed:', err);
    return res.status(500).json({ error: 'activation_failed' });
  }

  res.json({ received: true });
});

app.get('/health', (req, res) => res.json({
  ok: true,
  system: 'DaniniHub',
  port: PORT,
  publicWebLayer: 'ready_for_review',
  entry: {
    provider: 'gumroad_mvp',
    configured: Boolean(process.env.GUMROAD_ENTRY_URL)
  },
  stripeAutomation: stripeConfigured ? 'configured' : 'disabled_until_validated'
}));

app.use(express.static(path.join(__dirname, 'daninihub-front', 'dist')));

app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'daninihub-front', 'dist', 'index.html'));
});

app.get('/download/:id', (req, res) => {
  const file = path.join(__dirname, 'artifacts', `${req.params.id}.pdf`);
  if (!fs.existsSync(file)) return res.status(404).send('Not found');
  res.download(file);
});

app.get('/api/admin/leads', (req, res) => {
  res.json({ leads: [] });
});

app.listen(PORT, () => {
  console.log(`DaniniHub running on port ${PORT}`);
});
