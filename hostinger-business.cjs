'use strict';

const STAGING_HOST = 'gleaming-orangered-crow-58.hostingersite.com';
const STAGING_ORIGIN = 'https://' + STAGING_HOST;

function mountHostingerBusiness(app, express, env = process.env) {
  const recipient = env.MAIL_TEST_RECIPIENT?.trim().toLowerCase();
  const mailEnabled = env.HOSTINGER_BUSINESS_TEST_ENABLED === 'true' &&
    /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(recipient || '');
  const test = { origin: STAGING_ORIGIN, hostname: STAGING_HOST, recipient };
  const testEnv = {
    DANINI_CONTACT_ACTIVE: mailEnabled ? 'true' : 'false',
    DANINI_NOTIFY_TO: recipient,
    DANINI_BREVO_SENDER: env.DANINI_BREVO_SENDER,
    DANINI_TURNSTILE_SITEKEY: env.DANINI_TURNSTILE_SITEKEY,
    DANINI_TURNSTILE_SECRET: env.DANINI_TURNSTILE_SECRET,
    BREVO_API_KEY: env.BREVO_API_KEY
  };

  const send = async (req, res) => {
    if (req.hostname !== STAGING_HOST) return res.sendStatus(404);
    try {
      const { handleApi } = await import('./workers/danini-intake.mjs');
      const headers = new Headers();
      for (const name of ['origin', 'content-type', 'content-length']) {
        const value = req.get(name);
        if (value) headers.set(name, value);
      }
      const request = new Request(STAGING_ORIGIN + req.path, {
        method: req.method,
        headers,
        body: req.body
      });
      const response = await handleApi(request, testEnv, test);
      res.set(Object.fromEntries(response.headers));
      return res.status(response.status).send(await response.text());
    } catch {
      return res.status(503).json({ error: 'business_service_unavailable' });
    }
  };

  app.get('/api/tenant-config', (req, res) => {
    if (req.hostname !== STAGING_HOST) return res.sendStatus(404);
    return res.json({ name: 'DANINI', enabled: false, siteKey: null, languages: ['de', 'sr'] });
  });
  app.get('/api/lead/status', send);
  const parseBody = express.raw({ type: 'application/json', limit: 12000, inflate: false });
  app.post('/api/lead', (req, res, next) => {
    if (req.hostname !== STAGING_HOST) return res.sendStatus(404);
    return parseBody(req, res, error => {
      if (!error) return next();
      return res.status(error.status === 413 ? 413 : 400).json({
        error: error.status === 413 ? 'too_large' : 'invalid_body'
      });
    });
  }, send);
}

module.exports = { mountHostingerBusiness };
