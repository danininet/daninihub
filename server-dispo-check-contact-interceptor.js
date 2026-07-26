'use strict';

const express = require('express');
const { BrevoClient } = require('@getbrevo/brevo');
const { resultProfile, userEmail } = require('./server-dispo-check-runtime');

const clean = (value, max = 2000) => String(value || '').trim().slice(0, max);
const escapeHtml = value => clean(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

function sender() {
  const email = process.env.BREVO_SENDER_EMAIL || process.env.DANINIHUB_SENDER_EMAIL || process.env.MAIL_FROM || process.env.EMAIL_FROM;
  if (!email) throw new Error('BREVO_SENDER_NOT_CONFIGURED');
  return { email, name: process.env.BREVO_SENDER_NAME || process.env.DANINIHUB_SENDER_NAME || 'DaniniHub DispoLab' };
}

function parseScore(payload) {
  const source = `${payload.tasks || ''}\n${payload.message || ''}`;
  const match = source.match(/(?:Score|rezultat|Ergebnis)[^0-9]{0,20}(\d{1,3})\s*\/\s*100/i);
  const score = match ? Number(match[1]) : NaN;
  return Number.isFinite(score) && score >= 0 && score <= 100 ? score : NaN;
}

function parseRole(payload) {
  const match = String(payload.tasks || '').match(/(?:Role|Uloga|Rolle):\s*(.+)/i);
  return clean(match?.[1] || '', 120);
}

function mountDispoCheckContactInterceptor(app) {
  app.post('/api/contact', express.json({ limit: '40kb' }), async (req, res, next) => {
    if (req.body?.source !== 'free-dispo-check') return next();
    const language = req.body?.language === 'de' ? 'de' : 'sr';
    const data = {
      language,
      name: clean(req.body?.company, 100),
      email: clean(req.body?.email, 180),
      role: parseRole(req.body || {}),
      score: parseScore(req.body || {}),
      consent: clean(req.body?.consent, 20),
      website: clean(req.body?.website, 120)
    };
    if (data.website) return res.json({ ok: true });
    if (!data.name || !/^\S+@\S+\.\S+$/.test(data.email) || !Number.isFinite(data.score) || data.consent !== 'yes') {
      return res.status(400).json({ ok: false, error: 'INVALID_DISPO_CHECK_RESULT' });
    }
    try {
      const from = sender();
      const mail = userEmail(data);
      const profile = resultProfile(data.score, language);
      const api = new BrevoClient({ apiKey: process.env.BREVO_API_KEY }).transactionalEmails;
      const deliveries = await Promise.allSettled([
        api.sendTransacEmail({
          sender: from,
          to: [{ email: data.email, name: data.name }],
          replyTo: { email: 'info@daninihub.com', name: 'DaniniHub' },
          subject: mail.subject,
          htmlContent: mail.body
        }),
        api.sendTransacEmail({
          sender: from,
          to: [{ email: 'info@daninihub.com', name: 'DaniniHub' }],
          replyTo: { email: data.email, name: data.name },
          subject: `[Dispo-Check ${data.score}/100] ${data.name}`,
          htmlContent: `<h2>Neuer Dispo-Check Lead</h2><p><strong>Name:</strong> ${escapeHtml(data.name)}<br><strong>E-Mail:</strong> ${escapeHtml(data.email)}<br><strong>Rolle:</strong> ${escapeHtml(data.role || '—')}<br><strong>Sprache:</strong> ${escapeHtml(language)}<br><strong>Score:</strong> ${data.score}/100<br><strong>Niveau:</strong> ${escapeHtml(profile.level)}</p><p>Interesse am vollständigen Dispatch Readiness Check zum geplanten Preis von 29 €.</p>`
        })
      ]);
      if (deliveries.every(item => item.status === 'rejected')) throw deliveries[0].reason || new Error('EMAIL_DELIVERY_FAILED');
      return res.json({ ok: true, score: data.score, level: profile.level, personalizedResultEmail: true, deliveryPartial: deliveries.some(item => item.status === 'rejected') });
    } catch (error) {
      console.error('Personalized Dispo-Check email failed:', error.message);
      return res.status(503).json({ ok: false, error: 'RESULT_EMAIL_FAILED' });
    }
  });
}

module.exports = { mountDispoCheckContactInterceptor, parseRole, parseScore };
