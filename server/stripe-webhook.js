require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const Stripe = require('stripe');

const { writeAudit } = require('../core/audit');
const { activateFromStripeSession } = require('../core/activation-from-stripe');
const { registerAgentExecutionRoutes } = require('../core/agent-execution-layer');
const { registerPublicSite } = require('../core/public-site');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const PORT = Number(process.env.STRIPE_WEBHOOK_PORT || 4242);

if (!STRIPE_SECRET_KEY) {
  console.error('STRIPE_WEBHOOK_ERROR: STRIPE_SECRET_KEY nije definisan u .env.');
  process.exit(1);
}

if (!STRIPE_WEBHOOK_SECRET) {
  console.error('STRIPE_WEBHOOK_ERROR: STRIPE_WEBHOOK_SECRET nije definisan u .env.');
  console.error('Za lokalni test koristi: stripe listen --forward-to localhost:4242/webhook');
  console.error('Stripe CLI će ti dati whsec_... koji treba upisati u .env.');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);
const app = express();
registerAgentExecutionRoutes(app);
registerPublicSite(app);

function processedPath(eventId) {
  return path.join(process.cwd(), 'logs', 'stripe_processed', `${eventId}.json`);
}

function isProcessed(eventId) {
  return fs.existsSync(processedPath(eventId));
}



function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderSuccessPage(status) {
  const isCompleted = status.status === 'completed';
  const isProcessing = status.status === 'processing';

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>DaniniHub Activation Status</title>
  <style>
    body {
      margin: 0;
      background: #f4f1ea;
      color: #111;
      font-family: Arial, Helvetica, sans-serif;
    }
    .wrap {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
    }
    .card {
      width: 100%;
      max-width: 760px;
      background: #fff;
      border: 1px solid #e3ddcf;
      box-shadow: 0 24px 80px rgba(0,0,0,.08);
    }
    .head {
      background: #070707;
      color: #f6efe3;
      padding: 34px;
    }
    .eyebrow {
      color: #c9aa68;
      letter-spacing: 4px;
      text-transform: uppercase;
      font-size: 11px;
      margin-bottom: 18px;
    }
    h1 {
      margin: 0;
      font-weight: 400;
      font-size: 34px;
      line-height: 1.15;
    }
    .body {
      padding: 34px;
    }
    .status {
      display: inline-block;
      padding: 8px 12px;
      border: 1px solid #ddd1bc;
      background: #faf7ef;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 22px;
    }
    .grid {
      display: grid;
      gap: 12px;
      margin: 24px 0;
    }
    .row {
      border: 1px solid #eee;
      background: #fafafa;
      padding: 14px;
      font-size: 14px;
      line-height: 1.6;
    }
    .label {
      color: #777;
      display: block;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .note {
      color: #555;
      line-height: 1.8;
      font-size: 15px;
    }
    .actions {
      margin: 28px 0;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .button {
      display: inline-block;
      background: #070707;
      color: #f6efe3;
      text-decoration: none;
      padding: 14px 18px;
      border: 1px solid #070707;
      font-size: 14px;
      letter-spacing: .4px;
    }
    .button.secondary {
      background: #ffffff;
      color: #111111;
      border-color: #d8cbb4;
    }
    .foot {
      background: #f8f6f1;
      color: #777;
      font-size: 12px;
      line-height: 1.7;
      padding: 22px 34px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <main class="wrap">
    <section class="card">
      <div class="head">
        <div class="eyebrow">DaniniHub Activation</div>
        <h1>${isCompleted ? 'Ihre Aktivierung ist abgeschlossen.' : isProcessing ? 'Ihre Aktivierung wird verarbeitet.' : 'Aktivierungsstatus'}</h1>
      </div>

      <div class="body">
        <div class="status">${escapeHtml(status.status)}</div>

        <p class="note">
          ${isCompleted
            ? 'Ihr DaniniHub Report wurde erstellt. Falls eine E-Mail-Adresse im Checkout vorhanden war, wurde der Report zusätzlich per E-Mail versendet.'
            : 'Die Zahlung wurde erkannt oder wird geprüft. Bitte aktualisieren Sie diese Seite in wenigen Momenten erneut.'}
        </p>

        ${isCompleted && status.run_id ? `
        <div class="actions">
          <a class="button" href="/activation/download/pdf?run_id=${encodeURIComponent(status.run_id)}">
            PDF Report herunterladen
          </a>
          <a class="button secondary" href="/activation/status?session_id=${encodeURIComponent(status.stripe_session_id)}">
            Technischen Status anzeigen
          </a>
        </div>` : ''}

        <div class="grid">
          <div class="row">
            <span class="label">Stripe Session</span>
            ${escapeHtml(status.stripe_session_id)}
          </div>
          <div class="row">
            <span class="label">Activation ID</span>
            ${escapeHtml(status.activation_id || 'Noch nicht verfügbar')}
          </div>
          <div class="row">
            <span class="label">Run ID</span>
            ${escapeHtml(status.run_id || 'Noch nicht verfügbar')}
          </div>
          <div class="row">
            <span class="label">E-Mail Status</span>
            ${status.email_sent ? 'Gesendet' : status.email_failed ? 'Fehler beim Versand' : 'Noch nicht gesendet'}
          </div>
        </div>

        <p class="note">
          Hinweis: Dieses Ergebnis ist ein DaniniHub-Systemartefakt. Keine Finanz-, Rechts- oder medizinische Beratung.
          Ergebnisse müssen bei Bedarf fachlich geprüft werden.
        </p>
      </div>

      <div class="foot">
        DaniniHub · DACH-first decision system · AI transparency · GDPR-aware workflow
      </div>
    </section>
  </main>
</body>
</html>`;
}

function findProcessedBySessionId(sessionId) {
  const dir = path.join(process.cwd(), 'logs', 'stripe_processed');

  if (!fs.existsSync(dir)) return null;

  const files = fs
    .readdirSync(dir)
    .filter(file => file.endsWith('.json'));

  for (const file of files) {
    const fullPath = path.join(dir, file);

    try {
      const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

      if (data.stripe_session_id === sessionId) {
        return {
          event_file: file,
          event_path: fullPath,
          ...data
        };
      }
    } catch {
      continue;
    }
  }

  return null;
}


function findRecoveredActivationBySessionId(sessionId) {
  const auditPath = path.join(process.cwd(), 'logs', 'audit.jsonl');

  if (!sessionId || !fs.existsSync(auditPath)) {
    return null;
  }

  const rows = fs
    .readFileSync(auditPath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter(row => row.stripe_session_id === sessionId);

  const completed = [...rows].reverse().find(row =>
    row.event === 'stripe_activation_completed' && row.run_id
  );

  if (!completed) {
    return null;
  }

  return {
    event_file: 'audit_recovery_fallback',
    event_path: auditPath,
    processed_at: completed.timestamp,
    stripe_event_type: 'checkout.session.completed',
    stripe_session_id: sessionId,
    activation_id: completed.activation_id || null,
    run_id: completed.run_id || null,
    artifact_path: completed.artifact_path || null,
    pdf_path: completed.pdf_path || null,
    email_html_path: completed.email_html_path || null,
    recovered_from_audit: true,
    recovery_source: completed.source || null
  };
}



function readLatestAuditEvent(eventName) {
  const auditPath = path.join(process.cwd(), 'logs', 'audit.jsonl');

  if (!fs.existsSync(auditPath)) {
    return null;
  }

  const rows = fs
    .readFileSync(auditPath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter(row => row.event === eventName);

  return rows.length ? rows[rows.length - 1] : null;
}

function renderOwnerEntryPage() {
  const latestCheckout = readLatestAuditEvent('stripe_checkout_test_created');
  const latestCompleted = readLatestAuditEvent('stripe_activation_completed');
  const latestEmail = readLatestAuditEvent('stripe_activation_email_sent');

  const checkoutUrl = latestCheckout?.checkout_url || '';
  const checkoutSessionId = latestCheckout?.stripe_session_id || '';
  const completedRunId = latestCompleted?.run_id || '';
  const completedPdfPath = latestCompleted?.pdf_path || '';
  const emailSent = Boolean(latestEmail?.brevo_message_id);

  const statusUrl = checkoutSessionId
    ? `/activation/status?session_id=${encodeURIComponent(checkoutSessionId)}`
    : '/health';

  const downloadUrl = completedRunId
    ? `/activation/download/pdf?run_id=${encodeURIComponent(completedRunId)}`
    : '';

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>DaniniHub · Activation Desk</title>
  <style>
    :root{
      --bg:#11110f;
      --panel:#f4efe6;
      --ink:#151515;
      --muted:#6f6658;
      --gold:#b58a3c;
      --line:rgba(181,138,60,.28);
      --ok:#235f3a;
    }
    *{box-sizing:border-box}
    body{margin:0;background:radial-gradient(circle at top,#2b261d 0,#11110f 52%,#050505 100%);font-family:Arial,Helvetica,sans-serif;color:var(--panel)}
    main{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px}
    section{width:min(980px,100%);background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:28px;box-shadow:0 28px 90px rgba(0,0,0,.35);overflow:hidden}
    header{padding:38px 42px 26px;background:#151515;color:#f4efe6}
    .eyebrow{font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:var(--gold);font-weight:700}
    h1{font-size:clamp(34px,5vw,62px);line-height:.95;margin:18px 0 14px;letter-spacing:-.055em;font-weight:500}
    .lead{max-width:720px;color:#d8cdbc;font-size:18px;line-height:1.7;margin:0}
    .grid{display:grid;grid-template-columns:1.1fr .9fr;gap:0}
    .left,.right{padding:34px 42px}
    .right{background:#e9dfcf;border-left:1px solid rgba(0,0,0,.08)}
    h2{font-size:22px;margin:0 0 14px;letter-spacing:-.02em}
    p{line-height:1.65;color:var(--muted)}
    .actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
    a.btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:13px 18px;border-radius:999px;text-decoration:none;font-weight:800;font-size:13px;letter-spacing:.11em;text-transform:uppercase}
    .primary{background:#111;color:#fff}
    .secondary{border:1px solid rgba(0,0,0,.18);color:#111;background:#fff}
    .ghost{color:#111;text-decoration:underline;text-underline-offset:4px}
    dl{display:grid;grid-template-columns:150px 1fr;gap:12px 18px;margin:18px 0 0}
    dt{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#80642d;font-weight:800}
    dd{margin:0;color:#161616;word-break:break-word}
    .ok{color:var(--ok);font-weight:800}
    footer{padding:20px 42px;border-top:1px solid rgba(0,0,0,.08);color:#8b8173;font-size:12px;line-height:1.5}
    @media(max-width:800px){.grid{grid-template-columns:1fr}.right{border-left:0;border-top:1px solid rgba(0,0,0,.08)}header,.left,.right,footer{padding-left:24px;padding-right:24px}}
  </style>
</head>
<body>
<main>
<section>
  <header>
    <div class="eyebrow">DaniniHub · Owner Activation Desk</div>
    <h1>12 € Analyse-Workflow</h1>
    <p class="lead">Interna kontrolna stranica za checkout, status, PDF i email isporuku.</p>
  </header>

  <div class="grid">
    <div class="left">
      <h2>Trenutni ulaz</h2>
      <p>Ova stranica koristi postojeći Express runtime i poslednji zapis iz audit loga. Namenjena je da odmah vidiš radni tok bez traženja Next frontend strukture koja u ovom folderu ne postoji.</p>

      <div class="actions">
        ${checkoutUrl ? `<a class="btn primary" href="${checkoutUrl}">Otvori 12 € Checkout</a>` : `<a class="btn primary" href="/health">Checkout nije konfigurisan</a>`}
        <a class="btn secondary" href="${statusUrl}">Status</a>
        ${downloadUrl ? `<a class="btn secondary" href="${downloadUrl}">Preuzmi PDF</a>` : ''}
      </div>
    </div>

    <div class="right">
      <h2>Sistemski trag</h2>
      <dl>
        <dt>Checkout</dt>
        <dd>${checkoutSessionId || 'Još nije kreiran'}</dd>

        <dt>Run ID</dt>
        <dd>${completedRunId || 'Još nije kompletirano'}</dd>

        <dt>PDF</dt>
        <dd>${completedPdfPath || 'Još nije generisan'}</dd>

        <dt>Email</dt>
        <dd class="${emailSent ? 'ok' : ''}">${emailSent ? 'Brevo poslat' : 'Još nije potvrđen'}</dd>
      </dl>
    </div>
  </div>

  <footer>
    DaniniHub · Human-in-the-loop · Customer-facing output guarded · No legal, financial, medical or tax advice.
  </footer>
</section>
</main>
</body>
</html>`;
}


function findAuditEmailStatus(runId) {
  const auditPath = path.join(process.cwd(), 'logs', 'audit.jsonl');

  if (!runId || !fs.existsSync(auditPath)) {
    return {
      email_sent: false,
      email_failed: false,
      brevo_message_id: null
    };
  }

  const rows = fs
    .readFileSync(auditPath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter(row => row.run_id === runId);

  const sent = [...rows].reverse().find(row => row.event === 'stripe_activation_email_sent');
  const failed = [...rows].reverse().find(row => row.event === 'stripe_activation_email_failed');

  return {
    email_sent: Boolean(sent),
    email_failed: Boolean(failed),
    brevo_message_id: sent?.brevo_message_id || null,
    email_error: failed?.error || null
  };
}


async function recoverPaidCheckoutSessionIfNeeded(sessionId) {
  const existing = findProcessedBySessionId(sessionId);
  if (existing && existing.run_id) {
    return existing;
  }

  const recovered = findRecoveredActivationBySessionId(sessionId);
  if (recovered && recovered.run_id) {
    markRecoveredPaidSessionProcessed(sessionId, recovered);
    return recovered;
  }

  const lock = tryAcquireRecoveryLock(sessionId);

  if (!lock.acquired) {
    const afterLockExisting = findProcessedBySessionId(sessionId) || findRecoveredActivationBySessionId(sessionId);

    if (afterLockExisting && afterLockExisting.run_id) {
      return afterLockExisting;
    }

    return null;
  }

  try {
    const insideLockExisting = findProcessedBySessionId(sessionId) || findRecoveredActivationBySessionId(sessionId);
    if (insideLockExisting && insideLockExisting.run_id) {
      markRecoveredPaidSessionProcessed(sessionId, insideLockExisting);
      return insideLockExisting;
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.status !== 'complete' || session.payment_status !== 'paid') {
      return null;
    }

    const result = await activateFromStripeSession({
      session,
      stripe_event_id: `success_page_paid_session_${Date.now()}`,
      source: 'success_page_paid_session_recovery'
    });

    const processed = {
      stripe_session_id: session.id,
      stripe_event_type: 'checkout.session.completed',
      activation_id: result.activation_id || session.metadata?.activation_id || null,
      run_id: result.artifact?.run_id || result.run_id || null,
      artifact_path: result.artifact_path || null,
      pdf_path: result.pdf_path || null,
      email_html_path: result.email_html_path || null,
      processed_at: new Date().toISOString(),
      recovered_from_success_page: true
    };

    markRecoveredPaidSessionProcessed(sessionId, processed);

    return processed;
  } finally {
    releaseRecoveryLock(lock.lockPath);
  }
}


function markProcessed(eventId, data) {
  fs.mkdirSync(path.join(process.cwd(), 'logs', 'stripe_processed'), { recursive: true });
  fs.writeFileSync(
    processedPath(eventId),
    JSON.stringify({
      processed_at: new Date().toISOString(),
      ...data
    }, null, 2) + '\n',
    'utf8'
  );
}


function recoveryLockPath(sessionId) {
  const safeSessionId = String(sessionId || '').replace(/[^a-zA-Z0-9_\-]/g, '_');
  const dir = path.join(process.cwd(), 'logs', 'stripe_recovery_locks');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${safeSessionId}.lock`);
}

function tryAcquireRecoveryLock(sessionId) {
  const lockPath = recoveryLockPath(sessionId);

  try {
    const fd = fs.openSync(lockPath, 'wx');
    fs.writeFileSync(fd, JSON.stringify({
      stripe_session_id: sessionId,
      locked_at: new Date().toISOString(),
      pid: process.pid
    }, null, 2) + '\n', 'utf8');
    fs.closeSync(fd);
    return { acquired: true, lockPath };
  } catch (error) {
    if (error && error.code === 'EEXIST') {
      return { acquired: false, lockPath };
    }
    throw error;
  }
}

function releaseRecoveryLock(lockPath) {
  if (!lockPath) return;
  try {
    if (fs.existsSync(lockPath)) {
      fs.unlinkSync(lockPath);
    }
  } catch {
    // best effort
  }
}

function markRecoveredPaidSessionProcessed(sessionId, data) {
  const eventId = `recovered_${String(sessionId || '').replace(/[^a-zA-Z0-9_\-]/g, '_')}`;
  markProcessed(eventId, {
    ...data,
    recovery_processed: true
  });
}




app.get('/activation/download/pdf', (req, res) => {
  const runId = String(req.query.run_id || '').trim();

  if (!/^dh_[a-zA-Z0-9_\-]+$/.test(runId)) {
    writeAudit({
      event: 'pdf_download_rejected',
      reason: 'invalid_run_id',
      run_id: runId
    });

    return res.status(400).json({
      error: 'invalid_run_id'
    });
  }

  const pdfDir = path.join(process.cwd(), 'outputs', 'pdf');
  const pdfPath = path.join(pdfDir, `${runId}.pdf`);
  const resolvedPdfDir = path.resolve(pdfDir);
  const resolvedPdfPath = path.resolve(pdfPath);

  if (!resolvedPdfPath.startsWith(resolvedPdfDir + path.sep)) {
    writeAudit({
      event: 'pdf_download_rejected',
      reason: 'path_traversal_attempt',
      run_id: runId
    });

    return res.status(400).json({
      error: 'invalid_path'
    });
  }

  if (!fs.existsSync(resolvedPdfPath)) {
    writeAudit({
      event: 'pdf_download_missing',
      run_id: runId,
      pdf_path: pdfPath
    });

    return res.status(404).json({
      error: 'pdf_not_found'
    });
  }

  writeAudit({
    event: 'pdf_download_started',
    run_id: runId,
    pdf_path: pdfPath
  });

  return res.download(resolvedPdfPath, `${runId}.pdf`, error => {
    if (error) {
      writeAudit({
        event: 'pdf_download_failed',
        run_id: runId,
        pdf_path: pdfPath,
        error: error.message
      });
    } else {
      writeAudit({
        event: 'pdf_download_completed',
        run_id: runId,
        pdf_path: pdfPath
      });
    }
  });
});



app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(renderOwnerEntryPage());
});

app.get('/analyse-starten', (req, res) => {
  const cancelled = String(req.query.cancelled || '').trim();

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>DaniniHub · Aktivierung abgebrochen</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;background:#f4f1ea;color:#111;margin:0;padding:40px}
    main{max-width:760px;margin:0 auto;background:#fff;padding:34px;border:1px solid #e4dac9}
    .badge{color:#9b772c;letter-spacing:3px;font-size:12px;text-transform:uppercase}
    h1{font-weight:400}
    a.btn{display:inline-block;background:#070707;color:#f6efe3;padding:13px 18px;text-decoration:none;margin:12px 0}
    p{line-height:1.7}
    footer{margin-top:30px;color:#777;font-size:12px;line-height:1.6}
  </style>
</head>
<body>
<main>
  <div class="badge">DaniniHub · Local Checkout</div>
  <h1>Aktivierung wurde nicht abgeschlossen.</h1>
  <p>Der Checkout wurde verlassen oder die Session ist abgelaufen. Für einen neuen Test muss eine neue Stripe Checkout Session erzeugt werden.</p>
  <p><a class="btn" href="/health">Server Health prüfen</a></p>
  <dl>
    <dt>Status</dt><dd>${cancelled ? 'cancelled' : 'not_completed'}</dd>
  </dl>
  <footer>
    DaniniHub · DACH-first decision system · Local Stripe test route
  </footer>
</main>
</body>
</html>`);
});


app.get('/success', async (req, res) => {
  const sessionId = req.query.session_id;

  if (!sessionId) {
    return res.status(400).send(renderSuccessPage({
      status: 'missing_session_id',
      stripe_session_id: ''
    }));
  }

  const processed = await recoverPaidCheckoutSessionIfNeeded(sessionId);

  if (!processed) {
    return res.status(200).send(renderSuccessPage({
      status: 'processing',
      stripe_session_id: sessionId
    }));
  }

  const emailStatus = findAuditEmailStatus(processed.run_id);

  return res.status(200).send(renderSuccessPage({
    status: emailStatus.email_failed ? 'completed_email_failed' : 'completed',
    stripe_session_id: sessionId,
    activation_id: processed.activation_id || null,
    run_id: processed.run_id || null,
    email_sent: emailStatus.email_sent,
    email_failed: emailStatus.email_failed
  }));
});

app.get('/activation/status', async (req, res) => {
  const sessionId = req.query.session_id;

  if (!sessionId) {
    return res.status(400).json({
      status: 'missing_session_id',
      error: 'session_id query parameter is required'
    });
  }

  const processed = await recoverPaidCheckoutSessionIfNeeded(sessionId);

  if (!processed) {
    return res.json({
      status: 'processing',
      stripe_session_id: sessionId,
      message: 'Activation is not completed yet or the session was not processed by this runtime.'
    });
  }

  if (processed.ignored) {
    return res.json({
      status: 'ignored',
      stripe_session_id: sessionId,
      stripe_event_type: processed.stripe_event_type
    });
  }

  const emailStatus = findAuditEmailStatus(processed.run_id);

  return res.json({
    status: emailStatus.email_failed ? 'completed_email_failed' : 'completed',
    stripe_session_id: sessionId,
    stripe_event_type: processed.stripe_event_type,
    activation_id: processed.activation_id || null,
    run_id: processed.run_id || null,
    artifact_path: processed.artifact_path || null,
    pdf_path: processed.pdf_path || null,
    email_html_path: processed.email_html_path || null,
    email_sent: emailStatus.email_sent,
    email_failed: emailStatus.email_failed,
    brevo_message_id: emailStatus.brevo_message_id,
    email_error: emailStatus.email_error,
    processed_at: processed.processed_at || null
  });
});

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'DaniniHub Stripe Webhook',
    port: PORT
  });
});

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    writeAudit({
      event: 'stripe_webhook_signature_failed',
      error: error.message
    });

    console.error('STRIPE_SIGNATURE_ERROR:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  writeAudit({
    event: 'stripe_webhook_received',
    stripe_event_id: event.id,
    stripe_event_type: event.type
  });

  if (isProcessed(event.id)) {
    writeAudit({
      event: 'stripe_webhook_duplicate_skipped',
      stripe_event_id: event.id,
      stripe_event_type: event.type
    });

    return res.status(200).json({
      received: true,
      duplicate: true
    });
  }

  try {
    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      const session = event.data.object;

      const result = await activateFromStripeSession({
        session,
        stripeEventId: event.id,
        source: 'stripe_webhook'
      });

      markProcessed(event.id, {
        stripe_event_type: event.type,
        stripe_session_id: session.id,
        activation_id: result.activation_id,
        run_id: result.artifact?.run_id || null,
        artifact_path: result.artifact_path || null,
        pdf_path: result.pdf_path || null,
        email_html_path: result.email_html_path || null
      });

      writeAudit({
        event: 'stripe_webhook_fulfilled',
        stripe_event_id: event.id,
        stripe_event_type: event.type,
        stripe_session_id: session.id,
        activation_id: result.activation_id,
        run_id: result.artifact?.run_id || null,
        artifact_path: result.artifact_path || null,
        pdf_path: result.pdf_path || null,
        email_html_path: result.email_html_path || null
      });
    } else {
      markProcessed(event.id, {
        stripe_event_type: event.type,
        ignored: true
      });

      writeAudit({
        event: 'stripe_webhook_ignored',
        stripe_event_id: event.id,
        stripe_event_type: event.type
      });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    writeAudit({
      event: 'stripe_webhook_fulfillment_failed',
      stripe_event_id: event.id,
      stripe_event_type: event.type,
      error: error.message
    });

    console.error('STRIPE_WEBHOOK_FULFILLMENT_ERROR:', error.message);
    return res.status(500).json({
      received: true,
      fulfilled: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`DaniniHub Stripe webhook listening on http://localhost:${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhook`);
});
