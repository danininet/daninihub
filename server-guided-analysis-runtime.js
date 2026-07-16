'use strict';

const express = require('express');
const { listProducts } = require('./core/product-registry');
const { createSession, getSession, submitAnswer } = require('./core/guided-analysis-service');

function bearerToken(req) {
  const value = String(req.headers.authorization || '');
  return value.startsWith('Bearer ') ? value.slice(7).trim() : '';
}

function errorStatus(error) {
  const code = error?.code || error?.message;
  if (['INVALID_ACCESS_TOKEN'].includes(code)) return 401;
  if (['VALID_EMAIL_REQUIRED', 'ANSWER_TOO_SHORT', 'PRODUCT_NOT_FOUND'].includes(code)) return 400;
  if (['SESSION_NOT_FOUND'].includes(code)) return 404;
  if (['SESSION_PROCESSING'].includes(code)) return 409;
  if (['SESSION_SECRET_NOT_CONFIGURED', 'MODEL_NOT_CONFIGURED'].includes(code)) return 503;
  return 500;
}

function sendError(res, error) {
  return res.status(errorStatus(error)).json({
    ok: false,
    error: error.code || 'GUIDED_ANALYSIS_ERROR',
    message: error.message
  });
}

function mountGuidedAnalysisRuntime(app) {
  app.use('/api/v1/guided-analysis', express.json({ limit: '64kb' }));

  app.get('/api/v1/products', (req, res) => {
    res.json({ ok: true, products: listProducts() });
  });

  app.post('/api/v1/guided-analysis/activate', (req, res) => {
    const expected = process.env.DANINI_ACTIVATION_SECRET;
    const supplied = String(req.headers['x-danini-activation-secret'] || '');
    if (!expected || supplied !== expected) {
      return res.status(401).json({ ok: false, error: 'ACTIVATION_NOT_AUTHORIZED' });
    }

    try {
      const result = createSession({
        productId: req.body?.productId || 'die-ki-fragt-nach',
        email: req.body?.email,
        locale: req.body?.locale,
        orderId: req.body?.orderId
      });
      return res.status(201).json({ ok: true, ...result });
    } catch (error) {
      return sendError(res, error);
    }
  });

  app.get('/api/v1/guided-analysis/session', (req, res) => {
    try {
      return res.json({ ok: true, session: getSession(bearerToken(req)) });
    } catch (error) {
      return sendError(res, error);
    }
  });

  app.post('/api/v1/guided-analysis/answer', async (req, res) => {
    try {
      const session = await submitAnswer(bearerToken(req), req.body?.answer);
      return res.json({ ok: true, session });
    } catch (error) {
      return sendError(res, error);
    }
  });
}

module.exports = { mountGuidedAnalysisRuntime };
