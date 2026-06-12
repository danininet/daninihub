const cors = require('cors');
require('dotenv').config();

const express = require('express');
const Stripe = require('stripe');
const path = require('path');
const fs = require('fs');

const { writeAudit } = require('./core/audit');
const { activateFromStripeSession } = require('./core/activation-from-stripe');
const { mountPublicWebLayer } = require('./server-public-layer');

const app = express();
app.use(cors());
require('./core/plasmic-api.js')(app);

const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const PORT = Number(process.env.PORT || 4242);

mountPublicWebLayer(app);

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
  } catch (error) {
    writeAudit({
      event: 'stripe_webhook_signature_failed',
      error: error.message
    });

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  writeAudit({
    event: 'stripe_webhook_received',
    stripe_event_id: event.id,
    stripe_event_type: event.type
  });

  try {
    if (event.type !== 'checkout.session.completed') {
      writeAudit({
        event: 'stripe_webhook_ignored',
        stripe_event_id: event.id,
        stripe_event_type: event.type
      });

      return res.json({ received: true, ignored: true });
    }

    const session = event.data.object;

    const result = await activateFromStripeSession({
      session,
      stripe_event_id: event.id,
      source: 'stripe_webhook'
    });

    writeAudit({
      event: 'stripe_webhook_fulfilled',
      stripe_event_id: event.id,
      stripe_event_type: event.type,
      stripe_session_id: session.id,
      activation_id: result.activation_id,
      run_id: result.run_id,
      artifact_path: result.artifact_path,
      pdf_path: result.pdf_path,
      email_html_path: result.email_html_path
    });

    return res.json({ received: true, fulfilled: true, result });
  } catch (error) {
    writeAudit({
      event: 'stripe_webhook_failed',
      stripe_event_id: event.id,
      stripe_event_type: event.type,
      error: error.message
    });

    return res.status(500).json({
      received: true,
      fulfilled: false,
      error: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    system: 'DaniniHub',
    port: PORT,
    publicWebLayer: 'ready_for_review',
    entry: {
      provider: 'gumroad_mvp',
      configured: Boolean(process.env.GUMROAD_ENTRY_URL)
    },
    stripeAutomation: stripeConfigured ? 'configured' : 'disabled'
  });
});

app.get('/activation/download/pdf', (req, res) => {
  const runId = String(req.query.run_id || '').trim();

  if (!/^dh_[a-zA-Z0-9_]+$/.test(runId)) {
    return res.status(400).send('Invalid run_id');
  }

  const pdfPath = path.join(process.cwd(), 'outputs', 'pdf', `${runId}.pdf`);

  if (!fs.existsSync(pdfPath)) {
    return res.status(404).send('PDF not found');
  }

  writeAudit({
    event: 'pdf_download_started',
    run_id: runId,
    pdf_path: pdfPath
  });

  res.download(pdfPath, `${runId}.pdf`, error => {
    if (error) {
      writeAudit({
        event: 'pdf_download_failed',
        run_id: runId,
        pdf_path: pdfPath,
        error: error.message
      });
      return;
    }

    writeAudit({
      event: 'pdf_download_completed',
      run_id: runId,
      pdf_path: pdfPath
    });
  });
});

app.get('/activation/status', (req, res) => {
  const sessionId = String(req.query.session_id || '').trim();

  const dir = path.join(process.cwd(), 'logs', 'stripe_processed');
  if (!fs.existsSync(dir)) {
    return res.status(404).json({ status: 'not_found', stripe_session_id: sessionId });
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const full = path.join(dir, file);
    const data = JSON.parse(fs.readFileSync(full, 'utf8'));

    if (data.stripe_session_id === sessionId) {
      return res.json({
        status: data.run_id ? 'completed' : 'ignored',
        ...data
      });
    }
  }

  return res.status(404).json({ status: 'not_found', stripe_session_id: sessionId });
});

app.get('/success', async (req, res) => {
  const sessionId = String(req.query.session_id || '').trim();

  let status = null;
  try {
    const dir = path.join(process.cwd(), 'logs', 'stripe_processed');
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
      for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
        if (data.stripe_session_id === sessionId) {
          status = data;
          break;
        }
      }
    }
  } catch (_) {}

  const runId = status?.run_id || '';
  const pdfLink = runId ? `/activation/download/pdf?run_id=${encodeURIComponent(runId)}` : '#';

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(`<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>DaniniHub Activation</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;background:#f4f1ea;color:#111;margin:0;padding:40px}
    main{max-width:760px;margin:0 auto;background:#fff;padding:34px;border:1px solid #e4dac9}
    .badge{color:#9b772c;letter-spacing:3px;font-size:12px;text-transform:uppercase}
    h1{font-weight:400}
    a.btn{display:inline-block;background:#070707;color:#f6efe3;padding:13px 18px;text-decoration:none;margin:12px 0}
    dl{display:grid;grid-template-columns:160px 1fr;gap:10px;margin-top:24px}
    dt{color:#777}
    dd{margin:0;word-break:break-all}
    footer{margin-top:30px;color:#777;font-size:12px;line-height:1.6}
  </style>
</head>
<body>
<main>
  <div class="badge">DaniniHub · System Verified</div>
  <h1>Ihre Aktivierung ist ${status?.run_id ? 'abgeschlossen' : 'in Bearbeitung'}.</h1>
  <p>Ihr DaniniHub Report wurde erstellt, sobald der Stripe Webhook vollständig verarbeitet wurde.</p>
  ${runId ? `<p><a class="btn" href="${pdfLink}">PDF Report herunterladen</a></p>` : ''}
  <dl>
    <dt>Stripe Session</dt><dd>${sessionId}</dd>
    <dt>Activation ID</dt><dd>${status?.activation_id || '-'}</dd>
    <dt>Run ID</dt><dd>${runId || '-'}</dd>
    <dt>E-Mail Status</dt><dd>${status?.email_sent ? 'Gesendet' : 'Nicht bestätigt'}</dd>
  </dl>
  <footer>
    Hinweis: Dieses Ergebnis ist ein DaniniHub-Systemartefakt. Keine Finanz-, Rechts- oder medizinische Beratung.
    <br>DaniniHub · DACH-first decision system · AI transparency · GDPR-aware workflow
  </footer>
</main>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`DaniniHub server listening on http://localhost:${PORT}`);
  console.log('Public web layer: ready for review');
  console.log(`Stripe automation: ${stripeConfigured ? 'configured' : 'disabled'}`);
  console.log(`Gumroad ENTRY URL: ${process.env.GUMROAD_ENTRY_URL ? 'configured' : 'not configured'}`);
});
