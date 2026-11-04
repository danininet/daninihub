'use strict';
// Isolated local/server pilot. Deliberately not mounted by server.js.
const express=require('express'),crypto=require('node:crypto'),path=require('node:path');
const {createImportOSStore}=require('./importos-store');
const {createCatalogJobs}=require('./core/catalog-job');
function createPilotApp({store,adminSecret}={}) {
  if(typeof adminSecret!=='string'||adminSecret.length<32)throw Error('PILOT_ADMIN_SECRET_REQUIRED');
  if(!store)throw Error('STORE_REQUIRED');
  const app=express(),jobs=createCatalogJobs(store),rates=new Map();
  app.use((req,res,next)=>{res.set({'Cache-Control':'no-store','X-Robots-Tag':'noindex,nofollow','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"});next();});
  app.use('/api',(req,res,next)=>{
    const now=Date.now(),key=req.socket.remoteAddress;
    for(const [k,v] of rates)if(v.until<now)rates.delete(k);
    const current=rates.get(key)||{count:0,until:now+60000};current.count++;rates.set(key,current);
    if(current.count>60)return res.status(429).json({error:'RATE_LIMIT'});next();
  });
  app.use(express.json({limit:'600kb'}));
  function admin(req,res,next){const a=Buffer.from(String(req.headers['x-danini-admin']||'')),b=Buffer.from(adminSecret);if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(403).json({error:'FORBIDDEN'});next();}
  function handle(fn){return async(req,res)=>{try{await fn(req,res);}catch(e){const code=['NOT_FOUND','EXPIRED'].includes(e.message)?404:e.message==='CASE_VERSION_CONFLICT'?409:400;res.status(code).json({error:code===404?'NOT_FOUND':e.message});}};}
  app.get('/api/pilot/status',(req,res)=>res.json({mode:'technical-pilot',aiEnabled:false,paymentsEnabled:false,storage:store.mode,accountsEnabled:false}));
  // Creation and execution are owner-controlled until real auth, payment and retention are installed.
  app.post('/api/pilot/jobs',admin,handle(async(req,res)=>res.status(201).json(await jobs.create(req.body))));
  app.get('/api/pilot/jobs/:id',handle(async(req,res)=>res.json(await jobs.get(req.params.id,req.headers['x-project-token']||''))));
  app.post('/api/pilot/jobs/:id/advance',admin,handle(async(req,res)=>{await jobs.advance(req.params.id);res.json({ok:true});}));
  app.post('/api/pilot/jobs/:id/approve',admin,handle(async(req,res)=>{await jobs.approve(req.params.id,req.body);res.json({ok:true});}));
  app.get('/api/pilot/jobs/:id/download',handle(async(req,res)=>res.set('Content-Disposition','attachment; filename="danini-catalog-report.json"').json(await jobs.deliver(req.params.id,req.headers['x-project-token']||''))));
  app.get('/api/pilot/admin/jobs',admin,handle(async(req,res)=>res.json({jobs:await jobs.list()})));
  app.post('/api/pilot/checkout',(req,res)=>res.status(409).json({error:'PAYMENTS_DISABLED',charged:false}));
  app.use(express.static(path.join(__dirname,'catalog-pilot')));
  app.get('/catalog-proof.js',(req,res)=>res.sendFile(path.join(__dirname,'core/catalog-proof.js')));
  app.use((error,req,res,next)=>res.status(error.type==='entity.too.large'?413:400).json({error:'INVALID_REQUEST'}));
  return app;
}
if(require.main===module){
  const secret=process.env.DANINI_PILOT_ADMIN_SECRET;
  const store=createImportOSStore({env:{},storageFile:path.join(__dirname,'runtime/catalog-pilot.json')});
  createPilotApp({store,adminSecret:secret}).listen(Number(process.env.PORT||4243),'127.0.0.1',()=>console.log('DANINI catalog technical pilot on loopback; payments and AI off.'));
}
module.exports={createPilotApp};
