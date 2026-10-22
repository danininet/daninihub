'use strict';

require('dotenv').config({path:require('path').join(__dirname,'.env')});
const express=require('express');
const {mountImportOSRuntime}=require('./server-importos-runtime');
const {mountPublicRuntime}=require('./server-public-runtime');

const app=express();
const PORT=Number(process.env.PORT||4242);
const DEPLOYMENT_MARKER='daninihub-sales-20260924';

app.set('trust proxy',1);

// Separate domains share this repository but must NOT share public content.
// auto.daninihub.com gets the AutoDanini visual-only release; the existing
// DaniniHub root domain continues using the original public runtime.
const fs=require('node:fs');
const path=require('node:path');
const autoDist=path.join(__dirname,'autodanini-auto-dist');
app.use((req,res,next)=>{
  // Use only the actual HTTP Host, NOT spoofable X-Forwarded-Host.
  const host=String(req.headers.host||'').split(':')[0].toLowerCase();
  if(host!=='auto.daninihub.com')return next();
  res.set({
    'X-Robots-Tag':'noindex,nofollow',
    'Cache-Control':'no-store',
    'X-Content-Type-Options':'nosniff',
    'X-Frame-Options':'DENY',
    'Referrer-Policy':'strict-origin-when-cross-origin',
    'Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=()',
    'Content-Security-Policy':"default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data:; connect-src 'self'; form-action 'self'; upgrade-insecure-requests"
  });
  // Do not publish the owner's source portrait or the 3x3 grid. The owner
  // approved ONLY individually cropped, clearly identified business scenes.
  if(['/dragan-original-portrait.jpg','/dragan-business-grid-ai.png'].includes(req.path)){
    return res.status(404).type('text/plain').send('Not found');
  }
  if(req.path==='/robots.txt')return res.type('text/plain').send('User-agent: *\\nDisallow: /\\n');
  if(req.path==='/health' && req.method==='GET')return res.json({
    ok:true,service:'AutoDanini preview',releaseMode:'public-visual-only',
    adminEnabled:false,accountsEnabled:false,checkoutEnabled:false,
    durableStore:false
  });
  if(req.path.startsWith('/api/')||req.path==='/owner'||req.path.startsWith('/owner/')){
    return res.status(503).json({ok:false,error:'AUTODANINI_INTERACTIVE_SERVICES_NOT_RELEASED'});
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){
    return res.status(405).type('text/plain').send('Not available in this preview');
  }
  if(!fs.existsSync(path.join(autoDist,'index.html'))){
    return res.status(503).type('text/plain').send('AutoDanini release build unavailable');
  }
  return express.static(autoDist,{index:'index.html',fallthrough:false,maxAge:0})(req,res,next);
});

app.get('/health',async(req,res)=>{
  res.set('Cache-Control','no-store');
  const store=req.app.locals.importOSStore;
  try { await store.init(); }
  catch(error) { console.error('ImportOS health storage check failed:',error.message); return res.status(503).json({ok:false,service:'DANINI Automotive Import Intelligence',deploymentMarker:DEPLOYMENT_MARKER,storage:'unavailable'}); }
  res.json({
    ok:true,
    service:'DANINI Automotive Import Intelligence',
    deploymentMarker:DEPLOYMENT_MARKER,
    languages:['de','sr'],
    routes:['DE→RS','CH→RS'],
    products:['QuickCheck','Import Passport','SafeBuy','Model DNA','FieldCheck Live','Pro Mechanic Check','Original Parts Desk','Vehicle Delivery','Import Base Čalije','Dealer Radar Pro'],
    checkoutEnabled:process.env.DANINI_IMPORTOS_CHECKOUT_ENABLED==='true',
    durableStore:store.mode==='mysql',
    storage:store.mode==='mysql'?'database':'local-file'
  });
});

app.get('/api/runtime-version',(req,res)=>res.json({
  ok:true,
  service:'Danini ImportOS',
  deploymentMarker:DEPLOYMENT_MARKER,
  promise:'DECIDE · VERIFY · EXECUTE',
  contact:'info@daninihub.com'
}));

mountImportOSRuntime(app);
mountPublicRuntime(app);

app.use((req,res)=>res.status(404).type('text/plain').send('Not found'));

app.listen(PORT,()=>console.log(`Danini ImportOS listening on port ${PORT}`));
