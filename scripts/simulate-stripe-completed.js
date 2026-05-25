require('dotenv').config();

const Stripe = require('stripe');
const { readLastAudit, writeAudit } = require('../core/audit');
const { activateFromStripeSession } = require('../core/activation-from-stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_ERROR: STRIPE_SECRET_KEY nije definisan u .env.');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function findLatestCheckoutSession() {
  const rows = readLastAudit(300) || [];
  return [...rows].reverse().find(row => row.event === 'stripe_checkout_test_created');
}

async function main() {
  const explicitSessionId = process.argv[2];
  const latest = findLatestCheckoutSession();
  const sessionId = explicitSessionId || latest?.stripe_session_id;

  if (!sessionId) {
    throw new Error('Nema dostupnog stripe_session_id. Prvo pokreni: npm run stripe:checkout:test');
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  writeAudit({
    event: 'stripe_simulation_started',
    stripe_session_id: session.id,
    payment_status: session.payment_status,
    status: session.status
  });

  const result = await activateFromStripeSession({
    session,
    stripeEventId: `evt_sim_${Date.now()}`,
    source: 'stripe_simulation'
  });

  writeAudit({
    event: 'stripe_simulation_completed',
    stripe_session_id: session.id,
    activation_id: result.activation_id,
    run_id: result.artifact?.run_id || null,
    artifact_path: result.artifact_path || null,
    pdf_path: result.pdf_path || null,
    email_html_path: result.email_html_path || null
  });

  console.log(JSON.stringify({
    success: true,
    activation_id: result.activation_id,
    customer_email: result.customer_email,
    run_id: result.artifact?.run_id,
    artifact_path: result.artifact_path,
    pdf_path: result.pdf_path,
    email_html_path: result.email_html_path
  }, null, 2));
}

main().catch(error => {
  writeAudit({
    event: 'stripe_simulation_failed',
    error: error.message
  });

  console.error('STRIPE_SIMULATION_ERROR:', error.message);
  process.exit(1);
});
