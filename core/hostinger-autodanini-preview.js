'use strict';
/**
 * Mount the compiled, UNCHANGED AutoDanini v12 frontend on a temporary
 * Hostinger Node.js staging app. Does not modify production domains.
 * API routes must be mounted before this module.
 */
const fs=require('node:fs');
const path=require('node:path');
const express=require('express');

function mountHostingerAutoDaniniPreview(app){
  const root=path.resolve(__dirname,'../autodanini/staging-v12/dist');
  const index=path.join(root,'index.html');
  if(!fs.existsSync(index))throw new Error('AUTODANINI_STAGING_BUILD_MISSING');
  app.use((req,res,next)=>{
    // The preview cannot be indexed or confused with the approved production site.
    res.set({'X-Robots-Tag':'noindex,nofollow','Cache-Control':'no-store'});
    next();
  });
  app.get('/robots.txt',(_req,res)=>res.type('text/plain').send('User-agent: *\nDisallow: /\n'));
  app.use(express.static(root,{index:'index.html',fallthrough:true,maxAge:0}));
}
module.exports={mountHostingerAutoDaniniPreview};
