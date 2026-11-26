'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

// Audit the existing isolated build only; no deployment, form submissions or external API calls.
async function auditPublicVisuals(browser, base) {
  const root=path.resolve('dist');
  const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
  const routes=new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname).filter(p=>p==='/' || /^\/(?:de|sr|auto)(?:\/|$)/.test(p)));
  function walk(dir) {
    if(!fs.existsSync(dir))return;
    for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
      const file=path.join(dir,entry.name);
      if(entry.isDirectory())walk(file);
      else if(entry.name==='index.html')routes.add('/'+path.relative(root,dir).split(path.sep).join('/')+'/');
    }
  }
  for(const l of ['de','sr'])walk(path.join(root,l));
  const core=['/de/','/sr/','/de/auto-check/','/sr/auto-check/','/de/business/','/sr/business/','/de/akademija/','/sr/akademija/','/de/wissen/','/sr/wissen/','/sr/wissen/javne-nabavke-nemacka-balkan-vodic/'];
  const queue=[...routes].flatMap(route=>[390,1280].map(width=>({route,width})));
  queue.push(...core.flatMap(route=>[360,768].map(width=>({route,width}))));
  const results=[];
  const origin=new URL(base).origin;
  const ownOrigins=new Set([origin,'https://daninihub.com','https://www.daninihub.com']);
  const wiki='/sr/wissen/javne-nabavke-nemacka-balkan-vodic/';
  async function worker() {
    const context=await browser.newContext({viewport:{width:390,height:850},serviceWorkers:'block',acceptDownloads:true});
    const external=new Set();
    await context.route('**/*', async route=>{
      const req=route.request(), u=new URL(req.url());
      if(u.origin===origin) {
        if(!['GET','HEAD'].includes(req.method())||u.pathname.startsWith('/api/'))return route.abort();
        return route.continue();
      }
      if(ownOrigins.has(u.origin)&&req.resourceType()==='image') {
        try{return await route.fulfill({response:await route.fetch({url:base+u.pathname+u.search,timeout:8000,maxRedirects:0})});}catch{return route.abort();}
      }
      if(req.resourceType()==='image')external.add(req.url());
      return route.abort();
    });
    const page=await context.newPage();
    try {
      for(let item; (item=queue.shift());) {
        const {route,width}=item;
        external.clear();
        const brokenRequests=[];
        const onResponse=r=>{if(r.request().resourceType()==='image'&&ownOrigins.has(new URL(r.url()).origin)&&r.status()>=400)brokenRequests.push({url:r.url(),status:r.status()});};
        page.on('response',onResponse);
        try {
          await page.setViewportSize({width,height:850});
          const response=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:20000});
          const details=await page.evaluate(async({own})=>{
            const owned=new Set(own), sources=new Set();
            const imgs=[...document.images];
            for(const img of imgs)img.loading='eager';
            const decode=img=>Promise.race([img.decode().then(()=>true).catch(()=>false),new Promise(resolve=>setTimeout(()=>resolve(false),5000))]);
            const images=await Promise.all(imgs.map(async img=>{
              const src=img.currentSrc||img.src||img.getAttribute('src');
              if(!src)return {src:'',ok:false,owned:true};
              const url=new URL(src,location.href);
              const local=owned.has(url.origin)||['data:','blob:'].includes(url.protocol);
              return {src,owned:local,ok:local?await decode(img):null,alt:img.getAttribute('alt')};
            }));
            const background=new Set();
            for(const el of document.querySelectorAll('body,body *')) {
              if(!el.getClientRects().length)continue;
              for(const pseudo of [null,'::before','::after']){
                const value=getComputedStyle(el,pseudo).backgroundImage;
                for(const m of value.matchAll(/url\(["']?([^"')]+)["']?\)/g))background.add(m[1]);
              }
            }
            const backgrounds=await Promise.all([...background].map(async src=>{
              const u=new URL(src,location.href);
              const local=owned.has(u.origin)||['data:','blob:'].includes(u.protocol);
              if(!local)return {src,owned:false,ok:null};
              const img=new Image();img.src=u.href;
              return {src,owned:true,ok:await decode(img)};
            }));
            return {images,backgrounds,scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,diagrams:document.querySelectorAll('.diagram').length};
          },{own:[...ownOrigins]});
          const broken=[...details.images,...details.backgrounds].filter(i=>i.owned&&!i.ok).map(i=>i.src);
          const skippedExternal=[...new Set([...external,...[...details.images,...details.backgrounds].filter(i=>!i.owned).map(i=>i.src)])];
          const overflow=details.scrollWidth>width+3;
          const record={route,width,status:response?.status(),imageCount:details.images.length,backgroundCount:details.backgrounds.length,broken,brokenRequests,skippedExternal,overflow,scrollWidth:details.scrollWidth,diagrams:details.diagrams};
          results.push(record);
          console.log('PUBLIC_VISUAL_QA '+JSON.stringify(record));
          if(broken.length||brokenRequests.length||overflow||!response?.ok()||route===wiki){
            const label=width+'-'+(route.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'')||'root');
            await page.screenshot({path:'artifacts/hostinger-desktop/public-'+label+'.png',fullPage:true,animations:'disabled',timeout:12000}).catch(()=>{});
          }
        }catch(e){const record={route,width,error:String(e)};results.push(record);console.log('PUBLIC_VISUAL_QA '+JSON.stringify(record));}
        finally{page.off('response',onResponse);}
      }
    }finally{await context.close();}
  }
  await Promise.all(Array.from({length:3},()=>worker()));
  const pdf=await fetch(base+wiki+'demo.pdf',{signal:AbortSignal.timeout(10000)});
  const bytes=Buffer.from(await pdf.arrayBuffer());
  const pdfOk=pdf.status===200&&/application\/pdf/i.test(pdf.headers.get('content-type')||'')&&bytes.subarray(0,5).toString()==='%PDF-';
  const alias='/wiki/javne-nabavke-nemacka-balkan-vodic/';
  const redirect=await fetch(base+alias,{redirect:'manual',signal:AbortSignal.timeout(10000)});
  const aliasOk=redirect.status===301&&new URL(redirect.headers.get('location')||'/',base).pathname===wiki;
  const failures=results.filter(r=>r.error||r.status!==200||r.broken?.length||r.brokenRequests?.length||(core.includes(r.route)&&r.overflow)||(r.route===wiki&&r.diagrams<4));
  const report={routes:routes.size,checks:results.length,failed:failures.length,pdfOk,aliasOk,results};
  fs.writeFileSync('artifacts/hostinger-desktop/public-visual-report.json',JSON.stringify(report,null,2));
  console.log('PUBLIC_VISUAL_SUMMARY '+JSON.stringify({routes:report.routes,checks:report.checks,failed:report.failed,pdfOk,aliasOk,overflow:results.filter(r=>r.overflow).map(r=>[r.route,r.width]),external:results.filter(r=>r.skippedExternal?.length).length}));
  assert.ok(pdfOk,'Public tender demo PDF failed HTTP/MIME/signature check');
  assert.ok(aliasOk,'Public tender wiki alias failed redirect check');
  assert.equal(failures.length,0,'Public visual QA failures: '+JSON.stringify(failures));
}
module.exports={auditPublicVisuals};
