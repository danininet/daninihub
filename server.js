'use strict';

require('dotenv').config();
const express=require('express');
const {mountImportOSRuntime}=require('./server-importos-runtime');
const {mountPublicRuntime}=require('./server-public-runtime');

const app=express();
const PORT=Number(process.env.PORT||4242);
const DEPLOYMENT_MARKER='daninihub-sales-20260924';

app.set('trust proxy',1);

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
