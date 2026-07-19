'use strict';

const crypto = require('crypto');
const { BrevoClient } = require('@getbrevo/brevo');

const ACCESS_TTL_MS = 30 * 60 * 1000;

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

function signingMaterial(env = process.env) {
  return String(
    env.DANINI_DISPATCH_LINK_SECRET ||
    env.DANINI_DISPATCH_ADMIN_SECRET ||
    env.DANINI_ADMIN_SECRET ||
    env.DANINI_SESSION_SECRET ||
    env.BREVO_API_KEY ||
    ''
  );
}

function signingKey(env = process.env) {
  const material = signingMaterial(env);
  if (!material) return null;
  return crypto.createHash('sha256').update(`daninihub-dispatch-magic-link-v1:${material}`).digest();
}

function createAccessToken(options = {}) {
  const env = options.env || process.env;
  const key = signingKey(env);
  if (!key) throw new Error('DISPATCH_ACCESS_SIGNING_NOT_CONFIGURED');
  const lang = options.lang === 'de' ? 'de' : 'sr';
  const now = Number(options.now || Date.now());
  const payload = Buffer.from(JSON.stringify({
    scope: 'dispatch-access',
    lang,
    exp: now + Number(options.ttlMs || ACCESS_TTL_MS)
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', key).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyAccessToken(token, options = {}) {
  const env = options.env || process.env;
  const key = signingKey(env);
  const [payload = '', signature = ''] = String(token || '').split('.');
  if (!key || !payload || !signature) return null;
  const expected = crypto.createHmac('sha256', key).update(payload).digest('base64url');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    const now = Number(options.now || Date.now());
    if (parsed.scope !== 'dispatch-access' || !Number.isFinite(parsed.exp) || parsed.exp <= now) return null;
    return { lang: parsed.lang === 'de' ? 'de' : 'sr', exp: parsed.exp };
  } catch {
    return null;
  }
}

async function defaultSendEmail(message, env = process.env) {
  if (!env.BREVO_API_KEY) throw new Error('DISPATCH_ACCESS_BREVO_NOT_CONFIGURED');
  const api = new BrevoClient({ apiKey: env.BREVO_API_KEY }).transactionalEmails;
  return api.sendTransacEmail(message);
}

function accessEmail(lang, accessUrl, env = process.env) {
  const de = lang === 'de';
  return {
    sender: sender(env),
    to: [{ email: adminEmail(env), name: 'DaniniHub Admin' }],
    replyTo: { email: 'info@daninihub.com', name: 'DaniniHub' },
    subject: de ? 'DaniniHub Dispatch Workspace – Zugang' : 'DaniniHub Dispatch Workspace – pristup',
    htmlContent: de
      ? `<h2>Dispatch Pilot Workspace</h2><p>Öffnen Sie den geschützten internen Workspace über die Schaltfläche unten. Der Zugangslink ist 30 Minuten gültig; die Sitzung bleibt danach bis zu acht Stunden aktiv.</p><p><a href="${accessUrl}" style="display:inline-block;background:#087f8c;color:#fff;padding:14px 20px;border-radius:8px;text-decoration:none;font-weight:800">WORKSPACE ÖFFNEN</a></p><p>Wenn Sie diesen Zugang nicht angefordert haben, ignorieren Sie diese Nachricht.</p>`
      : `<h2>Dispatch Pilot Workspace</h2><p>Otvorite zaštićeni interni Workspace preko dugmeta ispod. Pristupni link važi 30 minuta, a sesija nakon toga ostaje aktivna do osam sati.</p><p><a href="${accessUrl}" style="display:inline-block;background:#087f8c;color:#fff;padding:14px 20px;border-radius:8px;text-decoration:none;font-weight:800">OTVORI WORKSPACE</a></p><p>Ako niste tražili ovaj pristup, ignorišite poruku.</p>`
  };
}

async function sendDispatchAccessLink(options = {}) {
  const env = options.env || process.env;
  const lang = options.lang === 'de' ? 'de' : 'sr';
  if (!env.BREVO_API_KEY || !signingKey(env)) throw new Error('DISPATCH_ACCESS_NOT_CONFIGURED');
  const token = createAccessToken({ env, lang, now: options.now, ttlMs: options.ttlMs });
  const accessUrl = `${publicUrl(env)}/internal/dispatch-pilot-workspace?access=${encodeURIComponent(token)}&lang=${lang}`;
  const message = accessEmail(lang, accessUrl, env);
  const sendEmail = options.sendEmail || (payload => defaultSendEmail(payload, env));
  await sendEmail(message);
  env.DANINI_DISPATCH_ACCESS_MODE = 'signed-email-link';
  return { ok: true, mode: 'signed-email-link', emailSent: true, recipient: adminEmail(env), lang };
}

async function bootstrapDispatchAccess(options = {}) {
  const env = options.env || process.env;
  if (!env.BREVO_API_KEY || !signingKey(env)) {
    env.DANINI_DISPATCH_ACCESS_MODE = 'unconfigured';
    return { ok: false, mode: 'unconfigured', emailSent: false };
  }
  return sendDispatchAccessLink({ ...options, env, lang: options.lang || 'sr' });
}

module.exports = {
  ACCESS_TTL_MS,
  accessEmail,
  adminEmail,
  bootstrapDispatchAccess,
  createAccessToken,
  publicUrl,
  sendDispatchAccessLink,
  sender,
  signingMaterial,
  verifyAccessToken
};