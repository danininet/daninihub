'use strict';

// Preserve existing Hostinger environment variables. Existing .env may be in
// the application root or the Node process working directory, depending on
// hosting release layout. Dotenv never overrides already configured variables.
const nodePath=require('node:path');
const dotenv=require('dotenv');
const projectEnv=nodePath.join(__dirname,'.env');
dotenv.config({path:projectEnv,quiet:true});
if(process.cwd()!==__dirname)dotenv.config({path:nodePath.join(process.cwd(),'.env'),quiet:true});
const express=require('express');
const {mountImportOSRuntime}=require('./server-importos-runtime');
const {mountPublicRuntime}=require('./server-public-runtime');
const {mountDigitalCommerce}=require('./digital-commerce');

const app=express();
const PORT=Number(process.env.PORT||4242);
const DEPLOYMENT_MARKER='daninihub-sales-20260924';

app.set('trust proxy',1);

// AutoDanini is the site's brand on the EXISTING daninihub.com domain.
// The cutover is explicit and reversible. Existing /sr/, /de/, /api/,
// /owner/, /health, robots and sitemap routes stay on the proven backend.
// Do not enable before the legal/operator review and production QA.
const fs=require('node:fs');
const path=require('node:path');
const autoDist=path.join(__dirname,'autodanini-auto-dist');
const autoRootEnabled=process.env.DANINI_AUTODANINI_ROOT_ENABLED==='true';
const autoPages=new Set([
  'index','buyers','dealers','live','inspection','import','exclusive','tender',
  'auctions','guides','about','contact','impressum','privacy','terms','cookies',
  'ai-advisor','disclaimer','cenovnik','ai-primer','faq','nalog','admin','support'
].map(name=>'/'+name+'.html'));
const autoStatic=express.static(autoDist,{index:false,fallthrough:false,maxAge:0});
const approvedAutoImages=Object.freeze({
  '/dragan-business-phone.jpg':'image/jpeg',
  '/dragan-business-portrait.jpg':'image/jpeg',
  '/danini-auto-uvoz.webp':'image/webp',
  '/danini-pregled-auta.webp':'image/webp'
});
app.use((req,res,next)=>{
  const host=String(req.headers.host||'').split(':')[0].toLowerCase();
  if(!autoRootEnabled||!['daninihub.com','www.daninihub.com'].includes(host))return next();
  if(['/dragan-original-portrait.jpg','/dragan-business-grid-ai.png'].includes(req.path)){
    return res.status(404).type('text/plain').send('Not found');
  }
  const isPage=req.path==='/'||autoPages.has(req.path);
  const isImage=Object.prototype.hasOwnProperty.call(approvedAutoImages,req.path);
  const isAsset=req.path.startsWith('/assets/');
  if(!isPage&&!isImage&&!isAsset)return next();
  if(req.method!=='GET'&&req.method!=='HEAD')return res.sendStatus(405);
  res.set({
    // Preview stays unindexed until the legal operator and site claims are verified.
    'X-Robots-Tag':'noindex,nofollow',
    'Cache-Control':'no-store',
    'X-Content-Type-Options':'nosniff',
    'X-Frame-Options':'DENY',
    'Referrer-Policy':'strict-origin-when-cross-origin',
    'Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=()',
    'Content-Security-Policy':"default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data:; connect-src 'self'; form-action 'self'; upgrade-insecure-requests"
  });
  if(isImage){
    const absolute=path.join(autoDist,req.path.slice(1));
    try{
      const stat=fs.statSync(absolute);
      if(!stat.isFile()||stat.size<100||stat.size>2000000)throw Error('image unavailable');
      const image=fs.readFileSync(absolute);
      res.set('Content-Type',approvedAutoImages[req.path]);
      res.set('Cache-Control','public, max-age=300, must-revalidate');
      res.set('Content-Length',String(image.length));
      return req.method==='HEAD'?res.status(200).end():res.status(200).end(image);
    }catch{
      return res.status(404).type('text/plain').send('Image not found');
    }
  }
  if(!fs.existsSync(path.join(autoDist,'index.html'))){
    return res.status(503).type('text/plain').send('AutoDanini release build unavailable');
  }
  if(req.path==='/')return res.sendFile(path.join(autoDist,'index.html'));
  return autoStatic(req,res,next);
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
mountDigitalCommerce(app);
mountPublicRuntime(app);

app.use((req,res)=>res.status(404).type('text/plain').send('Not found'));

app.listen(PORT,()=>console.log(`Danini ImportOS listening on port ${PORT}`));
