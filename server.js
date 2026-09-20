'use strict';

require('dotenv').config();
const express=require('express');
const {mountImportOSRuntime}=require('./server-importos-runtime');
const {mountPublicRuntime}=require('./server-public-runtime');

const app=express();
const PORT=Number(process.env.PORT||4242);
const DEPLOYMENT_MARKER='danini-importos-clean-v1';

app.set('trust proxy',1);

app.get('/health',(req,res)=>{
  res.set('Cache-Control','no-store');
  res.json({
    ok:true,
    service:'Danini ImportOS',
    deploymentMarker:DEPLOYMENT_MARKER,
    languages:['de','sr'],
    routes:['DE→RS','CH→RS'],
    products:['QuickCheck','Import Passport','SafeBuy','Model DNA','FieldCheck Live','Pro Mechanic Check','Original Parts Desk','Vehicle Delivery','Import Base Čalije','Dealer Radar Pro'],
    checkoutEnabled:process.env.DANINI_IMPORTOS_CHECKOUT_ENABLED==='true',
    durableStore:Boolean(process.env.DB_HOST&&process.env.DB_USER&&process.env.DB_NAME)
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
