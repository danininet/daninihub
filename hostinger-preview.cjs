'use strict';
// Isolated visual preview only. Never forward customer data to production.
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
app.disable('x-powered-by');
// Keep the listener alive on a bad release so health reports the actual failure.
// Log only release metadata, never environment values, secrets, or requests.
console.log(JSON.stringify({event:'hostinger_preview_start',node:process.versions.node,assets:assets?.layout || 'missing'}));
app.use((req,res,next)=>{
  res.set({'X-DANINI-Runtime':'hostinger-preview','X-Robots-Tag':'noindex, nofollow, noarchive','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"form-action 'none'; connect-src 'self'; frame-ancestors 'none'"});
  if (!['GET','HEAD'].includes(req.method)) return res.status(405).json({error:'preview_read_only'});
  let decoded;
  try { decoded = decodeURIComponent(req.path); } catch { return res.sendStatus(400); }
  if (/[%\\\x00-\x1f]/.test(decoded) || decoded.split('/').some(part => part === '.' || part === '..')) return res.sendStatus(400);
  if (/^\/(api|portal|owner|operator)(\/|$)/i.test(decoded)) return res.status(503).json({error:'preview_backend_disabled'});
  if (/(^|\/)(admin|nalog)(\.html|\/|$)/i.test(decoded) || decoded.split('/').some(part=>part.startsWith('.')) || /^\/_(headers|redirects)$/.test(decoded)) return res.sendStatus(404);
  next();
});
app.get('/health',(_req,res)=>res.status(assets?200:503).json({ok:!!assets,mode:'visual-preview',backend:false,assets:assets?.layout || 'missing'}));
app.get('/health/staging',async(req,res)=>{
  if (req.originalUrl !== '/health/staging') return res.sendStatus(400);
  const result = await stagingHealth();
  res.status(result.ok?200:503).json(result);
});
app.get('/robots.txt',(_req,res)=>res.type('text/plain').send('User-agent: *\nDisallow: /\n'));
app.get('/',(_req,res)=>res.redirect(302,'/de/'));
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
app.listen(port,'0.0.0.0');
