require('dotenv').config();

const Stripe = require('stripe');
const { writeAudit } = require('../core/audit');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const SITE_URL =
  process.env.DANINIHUB_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  'https://daninihub.com';

if (!STRIPE_SECRET_KEY) {
  console.error('STRIPE_ERROR: STRIPE_SECRET_KEY nije definisan u .env.');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

async function run() {
  const activationId = `act_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/success?cancelled=1`,
    customer_creation: 'if_required',
    billing_address_collection: 'auto',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          unit_amount: 700,
          product_data: {
            name: 'DaniniHub Activation',
            description: '7 EUR activation entry for DaniniHub structured AI artifact flow.'
          }
        },
        quantity: 1
      }
    ],
    metadata: {
      system: 'DaniniHub',
      activation_id: activationId,
      product: '7_eur_activation',
      source: 'cli_test'
    },
    payment_intent_data: {
      metadata: {
        system: 'DaniniHub',
        activation_id: activationId,
        product: '7_eur_activation',
        source: 'cli_test'
      }
    }
  });

  writeAudit({
    event: 'stripe_checkout_test_created',
    activation_id: activationId,
    stripe_session_id: session.id,
    checkout_url: session.url,
    amount_eur: 7,
    success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/analyse-starten?cancelled=1`
  });

  console.log(JSON.stringify({
    success: true,
    event: 'stripe_checkout_test_created',
    activation_id: activationId,
    stripe_session_id: session.id,
    checkout_url: session.url,
    amount_eur: 7
  }, null, 2));
}

run().catch(error => {
  writeAudit({
    event: 'stripe_checkout_test_failed',
    error: error.message
  });

  console.error('STRIPE_ERROR:', error.message);
  process.exit(1);
});
