require('dotenv').config();

const controller = require('./controller');
const { writeAudit } = require('./audit');
const { sendArtifactEmail } = require('./send-artifact-email');

function resolveCustomerEmail(session) {
  return String(
    session?.customer_details?.email ||
    session?.customer_email ||
    session?.metadata?.email ||
    ''
  ).trim();
}

async function activateFromStripeSession({
  session,
  stripeEventId = null,
  source = 'stripe_simulation'
}) {
  if (!session || !session.id) {
    throw new Error('Neispravna Stripe session struktura.');
  }

  const metadata = session.metadata || {};

  const activationId =
    metadata.activation_id ||
    `act_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

  const locale = metadata.locale || 'de';
  const customerEmail = resolveCustomerEmail(session) || null;

  const task = String(metadata.task || '').trim();
  if (!task) {
    const error = new Error('STRIPE_GUIDED_DIALOG_REQUIRED');
    error.code = 'STRIPE_GUIDED_DIALOG_REQUIRED';
    throw error;
  }

  writeAudit({
    event: 'stripe_activation_started',
    source,
    activation_id: activationId,
    stripe_event_id: stripeEventId,
    stripe_session_id: session.id,
    customer_email: customerEmail,
    locale
  });

  try {
    const result = await controller.verifyAndExecute(task, locale);

    writeAudit({
      event: 'stripe_activation_completed',
      source,
      activation_id: activationId,
      stripe_event_id: stripeEventId,
      stripe_session_id: session.id,
      customer_email: customerEmail,
      locale,
      run_id: result.artifact?.run_id || result.run_id || null,
      artifact_path: result.artifact_path || null,
      pdf_path: result.pdf_path || null,
      email_html_path: result.email_html_path || null
    });

    let email_send = null;

    if (customerEmail && result.email_html_path) {
      try {
        const sent = await sendArtifactEmail({
          to: customerEmail,
          recipient: customerEmail,
          runId: result.artifact?.run_id || result.run_id || activationId,
          emailHtmlPath: result.email_html_path,
          pdfPath: result.pdf_path,
          subject: 'Ihre persönliche KI-Analyse ist fertig'
        });

        email_send = {
          sent: true,
          message_id: sent?.messageId || null
        };

        writeAudit({
          event: 'stripe_activation_email_sent',
          source,
          activation_id: activationId,
          stripe_event_id: stripeEventId,
          stripe_session_id: session.id,
          customer_email: customerEmail,
          run_id: result.artifact?.run_id || result.run_id || null,
          email_html_path: result.email_html_path || null,
          pdf_path: result.pdf_path || null,
          brevo_message_id: sent?.messageId || null
        });
      } catch (emailError) {
        email_send = {
          sent: false,
          error: emailError.message
        };

        writeAudit({
          event: 'stripe_activation_email_failed',
          source,
          activation_id: activationId,
          stripe_event_id: stripeEventId,
          stripe_session_id: session.id,
          customer_email: customerEmail,
          run_id: result.artifact?.run_id || result.run_id || null,
          error: emailError.message
        });
      }
    } else {
      writeAudit({
        event: 'stripe_activation_email_skipped',
        source,
        activation_id: activationId,
        stripe_event_id: stripeEventId,
        stripe_session_id: session.id,
        customer_email: customerEmail,
        reason: !customerEmail ? 'missing_customer_email' : 'missing_email_html_path'
      });
    }

    return {
      activation_id: activationId,
      customer_email: customerEmail,
      email_send,
      ...result
    };
  } catch (error) {
    writeAudit({
      event: 'stripe_activation_failed',
      source,
      activation_id: activationId,
      stripe_event_id: stripeEventId,
      stripe_session_id: session.id,
      customer_email: customerEmail,
      locale,
      error: error.message
    });

    throw error;
  }
}

module.exports = { activateFromStripeSession };
