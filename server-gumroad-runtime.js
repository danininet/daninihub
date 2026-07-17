'use strict';

const crypto = require('crypto');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { createSession } = require('./core/guided-analysis-service');
const { writeAudit } = require('./core/audit');
const { sendArtifactEmail } = require('./core/send-artifact-email');
const { buildAccessUrl } = require('./server-guided-analysis-runtime');

const SALES_DIR = path.join(process.cwd(), 'runtime', 'gumroad-sales');
const EMAIL_DIR = path.join(process.cwd(), 'runtime', 'gumroad-emails');

function normalize(value) {
  return String(value || '').trim();
}

function safeId(value) {
  return normalize(value).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function requestOrigin(req) {
  const configured = normalize(process.env.DANINI_PUBLIC_URL).replace(/\/$/, '');
  if (configured) return configured;
  const protocol = normalize(req.headers['x-forwarded-proto'] || req.protocol || 'https').split(',')[0].trim();
  return `${protocol}://${req.get('host')}`;
}

function authorized(req) {
  const expected = normalize(process.env.GUMROAD_PING_SECRET);
  const supplied = normalize(req.headers['x-danini-gumroad-secret'] || req.query?.secret);
  if (!expected || !supplied) return false;
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function validateProduct(payload) {
  const expectedId = normalize(process.env.GUMROAD_PRODUCT_ID);
  const expectedPermalink = normalize(process.env.GUMROAD_PRODUCT_PERMALINK);
  const receivedId = normalize(payload.product_id);
  const receivedPermalink = normalize(payload.product_permalink);

  if (expectedId && receivedId !== expectedId) return false;
  if (expectedPermalink && receivedPermalink !== expectedPermalink) return false;
  return Boolean(expectedId || expectedPermalink);
}

function saleKey(payload) {
  return safeId(payload.sale_id || payload.order_number || payload.order_id);
}

function salePath(key) {
  return path.join(SALES_DIR, `${key}.json`);
}

function readExistingSale(key) {
  const target = salePath(key);
  if (!fs.existsSync(target)) return null;
  return JSON.parse(fs.readFileSync(target, 'utf8'));
}

function saveSale(key, record) {
  fs.mkdirSync(SALES_DIR, { recursive: true });
  const target = salePath(key);
  const temp = `${target}.${process.pid}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(record, null, 2), 'utf8');
  fs.renameSync(temp, target);
  return record;
}

function renderAccessEmail(accessUrl) {
  return `<!doctype html><html lang="de"><body style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px;color:#172033"><div style="max-width:640px;margin:auto;background:#fff;border-radius:16px;padding:30px"><p style="color:#9b772c;font-weight:bold;letter-spacing:.08em">DANINIHUB</p><h1>Ihre persönliche KI-Analyse</h1><p>Vielen Dank für Ihren Kauf von <strong>Die KI fragt nach</strong>.</p><p>Ihr persönlicher Link führt direkt zum geführten Dialog. Beantworten Sie die Ausgangsfrage und danach drei gezielte Rückfragen möglichst konkret. Anschließend erhalten Sie Ihre Analyse und das PDF per E-Mail.</p><p style="margin:28px 0"><a href="${escapeHtml(accessUrl)}" style="background:#d4af37;color:#111827;text-decoration:none;padding:14px 20px;border-radius:10px;font-weight:bold">Persönliche Analyse starten</a></p><p>Der Link ist nur für Sie bestimmt. Bitte geben Sie ihn nicht weiter.</p><p style="font-size:13px;color:#68758a">DaniniHub · Die KI fragt nach</p></div></body></html>`;
}

async function sendAccessEmail({ email, accessUrl, saleId }) {
  fs.mkdirSync(EMAIL_DIR, { recursive: true });
  const file = path.join(EMAIL_DIR, `${safeId(saleId)}.html`);
  fs.writeFileSync(file, renderAccessEmail(accessUrl), 'utf8');
  return sendArtifactEmail({
    to: email,
    recipient: email,
    runId: `gumroad-${safeId(saleId)}`,
    emailHtmlPath: file,
    subject: 'Dein Zugang: Die KI fragt nach'
  });
}

async function activateSale(payload, origin) {
  const key = saleKey(payload);
  if (!key) {
    const error = new Error('GUMROAD_SALE_ID_REQUIRED');
    error.code = 'GUMROAD_SALE_ID_REQUIRED';
    throw error;
  }

  const existing = readExistingSale(key);
  if (existing) return { duplicate: true, record: existing };

  const email = normalize(payload.email || payload.purchaser_email || payload.giftee_email).toLowerCase();
  if (!email || !email.includes('@')) {
    const error = new Error('GUMROAD_BUYER_EMAIL_REQUIRED');
    error.code = 'GUMROAD_BUYER_EMAIL_REQUIRED';
    throw error;
  }

  const created = createSession({
    productId: 'die-ki-fragt-nach',
    email,
    locale: 'de',
    orderId: key
  });
  const accessUrl = buildAccessUrl(origin, created.accessToken);

  const record = {
    saleId: key,
    email,
    productId: normalize(payload.product_id),
    productPermalink: normalize(payload.product_permalink),
    orderNumber: normalize(payload.order_number),
    sessionId: created.session.id,
    accessUrl,
    status: 'activated',
    createdAt: new Date().toISOString(),
    emailDelivery: null
  };
  saveSale(key, record);

  try {
    const sent = await sendAccessEmail({ email, accessUrl, saleId: key });
    record.emailDelivery = { sent: true, messageId: sent?.messageId || null };
    record.status = 'delivered';
  } catch (error) {
    record.emailDelivery = { sent: false, error: error.message };
    record.status = 'activation_created_email_failed';
  }

  saveSale(key, record);
  writeAudit({ event: 'gumroad_sale_activated', sale_id: key, session_id: created.session.id, email_sent: Boolean(record.emailDelivery?.sent) });
  return { duplicate: false, record };
}

function mountGumroadRuntime(app) {
  app.post('/webhooks/gumroad/ping', express.urlencoded({ extended: false, limit: '64kb' }), async (req, res) => {
    if (!authorized(req)) return res.status(401).json({ ok: false, error: 'GUMROAD_PING_NOT_AUTHORIZED' });
    if (!validateProduct(req.body || {})) return res.status(400).json({ ok: false, error: 'GUMROAD_PRODUCT_MISMATCH' });

    try {
      const result = await activateSale(req.body || {}, requestOrigin(req));
      return res.status(200).json({ ok: true, duplicate: result.duplicate, status: result.record.status });
    } catch (error) {
      writeAudit({ event: 'gumroad_activation_failed', error: error.message, sale_id: saleKey(req.body || {}) || null });
      return res.status(500).json({ ok: false, error: error.code || 'GUMROAD_ACTIVATION_FAILED' });
    }
  });
}

module.exports = { activateSale, authorized, mountGumroadRuntime, renderAccessEmail, saleKey, validateProduct };
