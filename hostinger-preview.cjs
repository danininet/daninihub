'use strict';
// Isolated visual preview only. Never forward customer data to production.
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const {createStagingHealth} = require('./hostinger-staging-health.cjs');
const stagingHealth = createStagingHealth({enabled:process.env.DANINI_STAGING_HEALTH === 'true'});
const app = express();
const dist = path.join(__dirname, 'dist');
if (!fs.existsSync(path.join(dist,'de','index.html')) || !fs.existsSync(path.join(dist,'sr','index.html'))) throw new Error('Run npm run build:platform before starting preview');
app.use((req,res,next)=>{
  res.set({'X-Robots-Tag':'noindex, nofollow, noarchive','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"form-action 'none'; connect-src 'self'; frame-ancestors 'none'"});
  if (!['GET','HEAD'].includes(req.method)) return res.status(405).json({error:'preview_read_only'});
  if (/^\/(api|portal|owner)(\/|$)/i.test(req.path)) return res.status(503).json({error:'preview_backend_disabled'});
  if (/(^|\/)(admin|nalog)(\.html|\/|$)/i.test(req.path)) return res.sendStatus(404);
  next();
});
app.get('/health',(_req,res)=>res.json({ok:true,mode:'visual-preview',backend:false}));
app.get('/health/staging',async(req,res)=>{
  if (req.originalUrl !== '/health/staging') return res.sendStatus(400);
  const result = await stagingHealth();
  res.status(result.ok?200:503).json(result);
});
app.get('/robots.txt',(_req,res)=>res.type('text/plain').send('User-agent: *\nDisallow: /\n'));
app.get('/',(_req,res)=>res.redirect(302,'/de/'));
app.use(express.static(dist,{index:'index.html',extensions:['html'],dotfiles:'deny'}));
app.use((_req,res)=>res.sendStatus(404));
app.listen(Number(process.env.PORT||4242),'0.0.0.0');
