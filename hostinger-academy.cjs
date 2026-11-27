'use strict';

const { createImportOSStore } = require('./importos-store.js');
const { initializeAcademy } = require('./hostinger-academy-db.cjs');
const HOST = 'gleaming-orangered-crow-58.hostingersite.com';
const ORIGIN = 'https://' + HOST;

function mountHostingerAcademy(app, express, env = process.env) {
  const recipient = env.MAIL_TEST_RECIPIENT?.trim().toLowerCase();
  const academyEnv = {
    ACADEMY_AUTH_ENABLED: env.HOSTINGER_ACADEMY_TEST_ENABLED,
    ACADEMY_INVITE_ONLY: 'true',
    ACADEMY_AUTH_SECRET: env.ACADEMY_AUTH_SECRET,
    MAIL_TEST_RECIPIENT: /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(recipient || '') ? recipient : undefined,
    SITE_ORIGIN: ORIGIN,
    BREVO_API_KEY: env.BREVO_API_KEY,
    DANINI_BREVO_SENDER: env.DANINI_BREVO_SENDER,
    DANINI_TURNSTILE_SITEKEY: env.DANINI_TURNSTILE_SITEKEY,
    DANINI_TURNSTILE_SECRET: env.DANINI_TURNSTILE_SECRET
  };
  const { connectionOptions } = createImportOSStore({ env });
  async function connect() {
    const pool = require('mysql2/promise').createPool({
      ...connectionOptions, connectTimeout: 5000, connectionLimit: 5, queueLimit: 20
    });
    try {
      return await initializeAcademy(pool);
    } catch (error) {
      await pool.end().catch(() => {});
      throw error;
    }
  }
  let database;
  const parseBody = express.raw({ type: 'application/json', limit: 15000, inflate: false });
  const send = async (req, res) => {
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
      const request = new Request(ORIGIN + req.path, { method, headers, body: req.body });
      database ??= connect().catch(error => { database = undefined; throw error; });
      const response = await academyRoute(request, { ...academyEnv, DANINI_DB: await database });
      res.set(Object.fromEntries(response.headers));
      return res.status(response.status).send(await response.text());
    } catch {
      return res.status(503).json({ error: 'academy_service_unavailable' });
    }
  };
  app.all(/^\/api\/academy\/(?:config|auth\/(?:start|verify)|session|logout|account|projects(?:\/[0-9a-f-]{36}(?:\/export|\/steps\/[a-z_]+)?)?)$/, (req, res, next) => {
    if (req.hostname !== HOST) return res.sendStatus(404);
    if (!['GET', 'HEAD', 'POST', 'PUT', 'DELETE'].includes(req.method)) return res.sendStatus(405);
    if (!['GET', 'HEAD'].includes(req.method) && req.get('origin') !== ORIGIN) {
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

module.exports = { mountHostingerAcademy };
