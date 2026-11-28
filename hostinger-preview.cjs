'use strict';
// Serve the isolated visual preview or the public frontend for the Cloudflare gateway.
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const {resolveAssets, readRedirects} = require('./hostinger-assets.cjs');
const {createStagingHealth} = require('./hostinger-staging-health.cjs');
const stagingHealth = createStagingHealth({enabled:process.env.DANINI_STAGING_HEALTH === 'true'});
const app = express();
const assets = resolveAssets();
const dist = assets?.directory;
const redirects = assets ? readRedirects(dist) : new Map();
const functionalFrontend = assets?.mode === 'production';
const runtime = functionalFrontend ? 'hostinger-frontend' : 'hostinger-preview';
const mode = functionalFrontend ? 'functional-frontend' : 'visual-preview';
const robots = 'noindex, nofollow, noarchive';
const frontendCsp = "default-src 'self'; script-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self' https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";

app.disable('x-powered-by');
// Mount only exact Gmail endpoints. All other preview backend guards stay intact.
if (functionalFrontend) {
  const gmail = require('./hostinger-native-gmail.cjs').createNativeGmail();
  app.get('/portal/gmail-intake', gmail);
  app.post('/portal/gmail-intake/poll', express.json({limit:1000,strict:true}), gmail);
}
// Keep the listener alive on a bad release so health reports the actual failure.
// Log only release metadata, never environment values, secrets, or requests.
console.log(JSON.stringify({event:'hostinger_start',mode,node:process.versions.node,assets:assets?.layout || 'missing'}));
app.use((req,res,next)=>{
  res.set({'X-DANINI-Runtime':runtime,'X-Robots-Tag':robots,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Referrer-Policy':functionalFrontend ? 'strict-origin-when-cross-origin' : 'no-referrer'});
  if (!functionalFrontend) res.set('Content-Security-Policy',"form-action 'none'; connect-src 'self'; frame-ancestors 'none'");
  next();
});
if (functionalFrontend) require('./hostinger-business.cjs').mountHostingerBusiness(app, express);
if (functionalFrontend) require('./hostinger-academy.cjs').mountHostingerAcademy(app, express);
if (functionalFrontend) require('./hostinger-native-digital.cjs').mountHostingerDigital(app, express, dist);
app.use((req,res,next)=>{
  if (!['GET','HEAD'].includes(req.method)) return res.status(405).json({error:'frontend_read_only'});
  let decoded;
  try { decoded = decodeURIComponent(req.path); } catch { return res.sendStatus(400); }
  if (/[%\\\x00-\x1f]/.test(decoded) || decoded.startsWith('//') || decoded.split('/').some(part => part === '.' || part === '..')) return res.sendStatus(400);
  if (/^\/(api|portal|owner|operator)(\/|\.|$)/i.test(decoded)) return res.status(functionalFrontend ? 404 : 503).json({error:'frontend_backend_disabled'});
  if (/(^|\/)(admin|nalog|private)(\.html|\/|$)/i.test(decoded) || decoded.split('/').some(part=>part.startsWith('.')) || /^\/_(headers|redirects)$/.test(decoded) || (/^\/downloads(?:\/|$)/i.test(decoded) && !decoded.startsWith('/downloads/akademija/')) || /\.cjs$/i.test(decoded)) return res.sendStatus(404);
  if (functionalFrontend && /^\/(de|sr)(\/|$)/.test(decoded)) res.set('Content-Security-Policy',frontendCsp);
  next();
});
app.get('/health',(_req,res)=>res.status(assets?200:503).json({ok:!!assets,mode,backend:false,assets:assets?.layout || 'missing'}));
app.get('/health/staging',async(req,res)=>{
  if (req.originalUrl !== '/health/staging') return res.sendStatus(400);
  const result = await stagingHealth();
  res.status(result.ok?200:503).json(result);
});
app.get('/robots.txt',(_req,res)=>res.type('text/plain').send('User-agent: *\nDisallow: /\n'));
if (!functionalFrontend) app.get('/',(_req,res)=>res.redirect(302,'/de/'));
app.use((req,res,next)=>{
  if (!assets) return res.status(503).json({error:'preview_assets_missing'});
  const redirect = redirects.get(req.path);
  if (redirect) return res.redirect(301, redirect + (req.url.includes('?')?req.url.slice(req.url.indexOf('?')):''));
  // Keep the historical /auto/name/ URL contract for exported name.html pages.
  if (/^\/auto\/[a-z0-9-]+\/$/.test(req.path)) {
    const file=path.join(dist,req.path.slice(0,-1)+'.html');
    if(fs.existsSync(file))return res.sendFile(file);
  }
  next();
});
if (assets) app.use(express.static(dist,{index:'index.html',extensions:['html'],dotfiles:'deny'}));
app.use((_req,res)=>res.sendStatus(404));
const port=Number(process.env.PORT||4242);
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Invalid PORT');
app.listen(port,'0.0.0.0',()=>{
  if (functionalFrontend && process.env.DANINI_GMAIL_STAGING_CHECK === 'true') {
    const {checkNativeGmailStaging} = require('./hostinger-native-gmail.cjs');
    void checkNativeGmailStaging().then(result=>console.log(JSON.stringify(result)),()=>{
      console.log(JSON.stringify({event:'gmail_staging_check', gmail:'unavailable'}));
    });
  }
});
