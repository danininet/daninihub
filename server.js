'use strict';

require('dotenv').config({path:require('path').join(__dirname,'.env')});
const express=require('express');
const {mountImportOSRuntime}=require('./server-importos-runtime');
const {mountPublicRuntime}=require('./server-public-runtime');

const app=express();
const PORT=Number(process.env.PORT||4242);
const DEPLOYMENT_MARKER='daninihub-sales-20260924';

app.set('trust proxy',1);
app.disable('x-powered-by');
app.use((req,res,next)=>{
  res.set({
    'X-Content-Type-Options':'nosniff',
    'X-Frame-Options':'DENY',
    'Referrer-Policy':'strict-origin-when-cross-origin'
  });
  next();
});
// Existing header-secret administration must not be exposed in production.
// A verified owner-login/session/role workflow will replace this temporary lock.
app.use('/owner',(req,res,next)=>{
  if(process.env.NODE_ENV==='production'){
    res.set({'Cache-Control':'no-store','X-Robots-Tag':'noindex,nofollow'});
    return res.status(503).type('text/plain').send('Administracija se priprema.');
  }
  next();
});
app.use('/api/importos/admin',(req,res,next)=>{
  if(process.env.NODE_ENV==='production'){
    res.set('Cache-Control','no-store');
    return res.status(503).json({ok:false,error:'ADMIN_UNAVAILABLE_PENDING_SECURE_LOGIN'});
  }
  next();
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
if(process.env.AUTODANINI_PREVIEW_ENABLED==='true'){
  // Auth is off by default; both backend and Vite feature flag must be enabled
  // after Brevo verification, database checks, and private-case E2E review.
  if(process.env.AUTODANINI_AUTH_ENABLED==='true'){
    const {makeCustomerAuth}=require('./core/autodanini-customer-auth');
    const auth=makeCustomerAuth({store:app.locals.importOSStore});
    app.use('/api',auth.router);
  }
  require('./core/hostinger-autodanini-preview').mountHostingerAutoDaniniPreview(app);
}else{
  mountPublicRuntime(app);
}

app.use((req,res)=>res.status(404).type('text/plain').send('Not found'));

const {checkProductionStorage}=require('./core/hostinger-release-readiness');
checkProductionStorage(app.locals.importOSStore).then(()=>{
  app.listen(PORT,()=>console.log(`Danini ImportOS listening on port ${PORT}`));
}).catch(error=>{
  console.error('Hostinger release refused at startup:',error.message);
  process.exitCode=1;
});
