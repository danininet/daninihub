'use strict';

const crypto = require('crypto');
const { BrevoClient } = require('@getbrevo/brevo');

function publicUrl(env = process.env) {
  return String(env.DANINI_PUBLIC_URL || 'https://daninihub.com').replace(/\/$/, '');
}

function sender(env = process.env) {
  const email = env.BREVO_SENDER_EMAIL || env.DANINIHUB_SENDER_EMAIL || env.MAIL_FROM || env.EMAIL_FROM;
  if (!email) throw new Error('DISPATCH_ACCESS_SENDER_NOT_CONFIGURED');
  return {
    email,
    name: env.BREVO_SENDER_NAME || env.DANINIHUB_SENDER_NAME || 'DaniniHub Transport & Logistics'
  };
}

function adminEmail(env = process.env) {
  return env.DANINIHUB_ADMIN_EMAIL || 'info@daninihub.com';
}

async function defaultSendEmail(message, env = process.env) {
  if (!env.BREVO_API_KEY) throw new Error('DISPATCH_ACCESS_BREVO_NOT_CONFIGURED');
  const api = new BrevoClient({ apiKey: env.BREVO_API_KEY }).transactionalEmails;
  return api.sendTransacEmail(message);
}

async function bootstrapDispatchAccess(options = {}) {
  const env = options.env || process.env;
  if (env.DANINI_DISPATCH_ADMIN_SECRET || env.DANINI_ADMIN_SECRET) {
    env.DANINI_DISPATCH_ACCESS_MODE = 'configured-secret';
    return { ok: true, mode: 'configured-secret', emailSent: false };
  }

  if (!env.BREVO_API_KEY) {
    env.DANINI_DISPATCH_ACCESS_MODE = 'unconfigured';
    return { ok: false, mode: 'unconfigured', emailSent: false };
  }

  const generatedSecret = options.generatedSecret || crypto.randomBytes(32).toString('hex');
  env.DANINI_DISPATCH_ADMIN_SECRET = generatedSecret;
  env.DANINI_DISPATCH_ACCESS_MODE = 'email-bootstrap';

  const accessUrl = `${publicUrl(env)}/internal/dispatch-pilot-workspace?key=${encodeURIComponent(generatedSecret)}`;
  const recipient = adminEmail(env);
  const message = {
    sender: sender(env),
    to: [{ email: recipient, name: 'DaniniHub Admin' }],
    replyTo: { email: 'info@daninihub.com', name: 'DaniniHub' },
    subject: 'DaniniHub Dispatch Workspace – interni pristup / interner Zugang',
    htmlContent: `<h2>Dispatch Pilot Workspace</h2><p><strong>SR:</strong> Kliknite dugme ispod da otvorite internu dvojezičnu radnu stranu. Link važi do sledećeg restartovanja aplikacije i postavlja zaštićenu HttpOnly sesiju.</p><p><strong>DE:</strong> Klicken Sie auf die Schaltfläche unten, um den internen zweisprachigen Workspace zu öffnen. Der Link gilt bis zum nächsten Neustart der Anwendung und setzt eine geschützte HttpOnly-Sitzung.</p><p><a href="${accessUrl}" style="display:inline-block;background:#087f8c;color:#fff;padding:14px 20px;border-radius:8px;text-decoration:none;font-weight:800">OTVORI WORKSPACE / WORKSPACE ÖFFNEN</a></p><p><strong>SR:</strong> Ako niste pokrenuli ovu aplikaciju, ignorišite poruku.<br><strong>DE:</strong> Wenn Sie diese Anwendung nicht gestartet haben, ignorieren Sie diese Nachricht.</p>`
  };

  const sendEmail = options.sendEmail || (payload => defaultSendEmail(payload, env));
  try {
    await sendEmail(message);
    return { ok: true, mode: 'email-bootstrap', emailSent: true, recipient };
  } catch (error) {
    delete env.DANINI_DISPATCH_ADMIN_SECRET;
    env.DANINI_DISPATCH_ACCESS_MODE = 'email-failed';
    throw error;
  }
}

module.exports = { adminEmail, bootstrapDispatchAccess, publicUrl, sender };
