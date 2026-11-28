'use strict';

const { createImportOSStore } = require('./importos-store.js');
const { initializeAcademy } = require('./hostinger-academy-db.cjs');
const HOST = 'gleaming-orangered-crow-58.hostingersite.com';
const ORIGIN = 'https://' + HOST;

const { publicDomainEnabled } = require('./hostinger-assets.cjs');
const validEmail = value => typeof value === 'string' && value.length <= 254 && /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(value);

function academyContext(env, hostname) {
  const staging = hostname === HOST;
  if (!staging && !publicDomainEnabled(env, true, hostname)) return null;
  const origin = staging ? ORIGIN : 'https://daninihub.com';
  const recipients = String(staging ? env.MAIL_TEST_RECIPIENT || '' : env.HOSTINGER_ACADEMY_PUBLIC_INVITES || '').split(',').map(v=>v.trim().toLowerCase()).filter(validEmail);
  const secret = staging ? env.ACADEMY_AUTH_SECRET : env.HOSTINGER_ACADEMY_PUBLIC_SECRET;
  const enabled = (staging ? env.HOSTINGER_ACADEMY_TEST_ENABLED : env.HOSTINGER_ACADEMY_PUBLIC_ENABLED) === 'true' &&
    recipients.length > 0 && typeof secret === 'string' && secret.length >= 48 &&
    (staging || secret !== env.ACADEMY_AUTH_SECRET);
  return {production: !staging, origin, env: {
    ACADEMY_AUTH_ENABLED: enabled ? 'true' : 'false',
    ACADEMY_INVITE_ONLY: 'true',
    ACADEMY_AUTH_SECRET: secret,
    MAIL_TEST_RECIPIENTS: recipients.join(','),
    SITE_ORIGIN: origin,
    BREVO_API_KEY: env.BREVO_API_KEY,
    DANINI_BREVO_SENDER: env.DANINI_BREVO_SENDER,
    DANINI_TURNSTILE_SITEKEY: env.DANINI_TURNSTILE_SITEKEY,
    DANINI_TURNSTILE_SECRET: env.DANINI_TURNSTILE_SECRET
  }};
}

function mountHostingerAcademy(app, express, env = process.env) {
  const { connectionOptions } = createImportOSStore({ env });
  async function connect(production) {
    const pool = require('mysql2/promise').createPool({
      ...connectionOptions, connectTimeout: 5000, connectionLimit: 5, queueLimit: 20
    });
    try {
      return await initializeAcademy(pool, production);
    } catch (error) {
      await pool.end().catch(() => {});
      throw error;
    }
  }
  const databases = new Map();
  const parseBody = express.raw({ type: 'application/json', limit: 15000, inflate: false });
  const send = async (req, res) => {
    const ctx = academyContext(env, req.hostname);
    if (!ctx) return res.sendStatus(404);
    const academyEnv = ctx.env;
    try {
      const { academyRoute } = await import('./src/academy/routes.mjs');
      const { isConfigured } = await import('./src/academy/auth.mjs');
      if (!connectionOptions || !isConfigured({ ...academyEnv, DANINI_DB: true })) {
        return res.status(404).json({ error: 'not_found' });
      }
      const headers = new Headers();
      for (const name of ['origin', 'content-type', 'content-length', 'cookie']) {
        const value = req.get(name);
        if (value) headers.set(name, value);
      }
      const method = req.method === 'HEAD' ? 'GET' : req.method;
      const request = new Request(ctx.origin + req.path, { method, headers, ...(['GET','HEAD'].includes(method) ? {} : {body: req.body}) });
      if (!databases.has(ctx.production)) databases.set(ctx.production, connect(ctx.production).catch(error => { databases.delete(ctx.production); throw error; }));
      const response = await academyRoute(request, { ...academyEnv, DANINI_DB: await databases.get(ctx.production) });
      res.set(Object.fromEntries(response.headers));
      return res.status(response.status).send(await response.text());
    } catch {
      return res.status(503).json({ error: 'academy_service_unavailable' });
    }
  };
  app.all(/^\/api\/academy\/(?:config|auth\/(?:start|verify)|session|logout|account|projects(?:\/[0-9a-f-]{36}(?:\/export|\/steps\/[a-z_]+)?)?)$/, (req, res, next) => {
    const ctx = academyContext(env, req.hostname);
    if (!ctx) return res.sendStatus(404);
    if (!['GET', 'HEAD', 'POST', 'PUT', 'DELETE'].includes(req.method)) return res.sendStatus(405);
    if (!['GET', 'HEAD'].includes(req.method) && req.get('origin') !== ctx.origin) {
      return res.status(403).json({ error: 'invalid_origin' });
    }
    return parseBody(req, res, error => {
      if (!error) return next();
      return res.status(error.status === 413 ? 413 : 400).json({
        error: error.status === 413 ? 'too_large' : 'invalid_body'
      });
    });
  }, send);
}

module.exports = { mountHostingerAcademy, academyContext };
