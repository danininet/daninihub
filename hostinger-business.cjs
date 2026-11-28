'use strict';

const {publicDomainEnabled} = require('./hostinger-assets.cjs');
const STAGING_HOST = 'gleaming-orangered-crow-58.hostingersite.com';
const STAGING_ORIGIN = 'https://' + STAGING_HOST;
const PUBLIC_ORIGIN = 'https://daninihub.com';
const validAddress = value => typeof value === 'string' &&
  value.length <= 254 && /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(value);

// Staging remains restricted to the test recipient. Production never falls back to it.
function businessContext(env, hostname) {
  const staging = hostname === STAGING_HOST;
  if (!staging && !publicDomainEnabled(env, true, hostname)) return null;
  const recipient = (staging ? env.MAIL_TEST_RECIPIENT : env.DANINI_NOTIFY_TO)?.trim().toLowerCase();
  const enabled = (staging ? env.HOSTINGER_BUSINESS_TEST_ENABLED : env.HOSTINGER_BUSINESS_PUBLIC_ENABLED) === 'true' &&
    validAddress(recipient) && validAddress(env.DANINI_BREVO_SENDER);
  const origin = staging ? STAGING_ORIGIN : PUBLIC_ORIGIN;
  return {
    origin, staging,
    test: staging ? {origin, hostname, recipient} : undefined,
    env: {
      DANINI_CONTACT_ACTIVE: enabled ? 'true' : 'false',
      DANINI_NOTIFY_TO: recipient,
      DANINI_BREVO_SENDER: env.DANINI_BREVO_SENDER,
      DANINI_TURNSTILE_SITEKEY: env.DANINI_TURNSTILE_SITEKEY,
      DANINI_TURNSTILE_SECRET: env.DANINI_TURNSTILE_SECRET,
      BREVO_API_KEY: env.BREVO_API_KEY
    }
  };
}

function mountHostingerBusiness(app, express, env = process.env) {
  const send = async (req, res) => {
    const ctx = businessContext(env, req.hostname);
    if (!ctx || (ctx.staging && req.path === '/api/ai-intake')) return res.sendStatus(404);
    if (req.method === 'POST' && req.get('origin') !== ctx.origin) return res.status(403).json({error:'invalid_origin'});
    try {
      const { handleApi } = await import('./workers/danini-intake.mjs');
      const headers = new Headers();
      for (const name of ['origin', 'content-type', 'content-length']) {
        const value = req.get(name);
        if (value) headers.set(name, value);
      }
      const request = new Request(ctx.origin + req.path, {
        method: req.method,
        headers,
        ...(req.method === 'POST' ? {body: req.body} : {})
      });
      const response = await handleApi(request, ctx.env, ctx.test);
      res.set(Object.fromEntries(response.headers));
      return res.status(response.status).send(await response.text());
    } catch {
      return res.status(503).json({ error: 'business_service_unavailable' });
    }
  };

  // The stateful B2B intake is not yet migrated. Do not advertise it as enabled.
  app.get('/api/tenant-config', (req, res) => {
    if (!businessContext(env, req.hostname)) return res.sendStatus(404);
    return res.json({ name: 'DANINI', enabled: false, siteKey: null, languages: ['de', 'sr'] });
  });
  app.get('/api/lead/status', send);
  const parseBody = express.raw({ type: 'application/json', limit: 12000, inflate: false });
  for (const route of ['/api/lead', '/api/ai-intake']) {
    app.post(route, (req, res, next) => {
      const ctx = businessContext(env, req.hostname);
      if (!ctx || (ctx.staging && route === '/api/ai-intake')) return res.sendStatus(404);
      if (req.get('origin') !== ctx.origin) return res.status(403).json({error:'invalid_origin'});
      return parseBody(req, res, error => {
        if (!error) return next();
        return res.status(error.status === 413 ? 413 : 400).json({
          error: error.status === 413 ? 'too_large' : 'invalid_body'
        });
      });
    }, send);
  }
}

module.exports = { mountHostingerBusiness, businessContext };
