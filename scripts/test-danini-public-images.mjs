import fs from 'node:fs';import {chromium} from 'playwright-core';
const executablePath=[process.env.CHROME_PATH,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].find(p=>p&&fs.existsSync(p));
if(!executablePath)throw Error('Chromium required');
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const pages=['/','/de/','/sr/','/danini.html','/danini-sr.html','/buyers.html','/dealers.html','/live.html','/inspection.html','/about.html','/contact.html','/guides.html','/prepurchase.html','/impressum.html','/privacy.html','/tender.html','/import.html','/exclusive.html','/auctions.html','/digital.html','/ai-solutions.html','/business.html','/cnc.html','/selbstimport.html','/uvoz-vodic.html','/faq.html','/support.html','/terms.html','/cookies.html'];
const errors=[];let checked=0,images=0,broken=0,external=0;const hrefs=new Set();
const suspect=await fetch('https://daninihub.com/danini-auto-uvoz.webp',{signal:AbortSignal.timeout(18000)});
const sample=Buffer.from(await suspect.arrayBuffer());
console.log('DANINI HERO IMAGE DIAGNOSTIC '+JSON.stringify({status:suspect.status,contentType:suspect.headers.get('content-type'),size:sample.length,prefix:sample.subarray(0,24).toString('hex'),cache:suspect.headers.get('cf-cache-status')}));

try{const page=await browser.newPage({viewport:{width:1280,height:900}});for(const p of pages){
 const res=await page.goto('https://daninihub.com'+p,{waitUntil:'domcontentloaded',timeout:25000});
 if(res?.status()!==200){errors.push(p+' HTTP '+res?.status());continue}
 await page.waitForTimeout(300);
 const v=await page.evaluate(async()=>{
  const imgs=[...document.querySelectorAll('img')].filter(e=>e.getAttribute('src'));
  const entries=await Promise.all(imgs.map(async img=>{
   try {if(!img.complete)await Promise.race([img.decode(),new Promise((_,reject)=>setTimeout(()=>reject(Error('timeout')),3500))]);}catch{}
   return {src:img.currentSrc||img.src,complete:img.complete,ok:img.naturalWidth>0,alt:img.getAttribute('alt')||''};
  }));
  const bg=[...document.querySelectorAll('[style*="--image:"],[style*="background-image"]')].map(e=>getComputedStyle(e).backgroundImage).filter(v=>v&&v!=='none');
  return {entries,bg,links:[...document.querySelectorAll('a[href]')].map(a=>a.href).filter(s=>s.startsWith(location.origin)&&!s.includes('#'))};
 });
 checked++;for(const img of v.entries){images++;if(!img.ok){broken++;errors.push('BROKEN '+p+' '+img.src)}if(!img.alt.trim())errors.push('ALT MISSING '+p+' '+img.src);if(new URL(img.src).origin!=='https://daninihub.com')external++;}
 for(const href of v.links)hrefs.add(href);
 for(const css of v.bg){for(const m of css.matchAll(/url\(["']?([^)"']+)/gi)){const u=m[1];if(u.startsWith('http')&&!u.startsWith('https://daninihub.com'))external++;}}
}
const keyLinks=[...hrefs].filter(s=>/\.(?:html)$/.test(s)).slice(0,80);
const codes=await Promise.all(keyLinks.map(async x=>{try{const r=await fetch(x,{method:'HEAD',signal:AbortSignal.timeout(7000)});return {url:x,code:r.status}}catch(e){return {url:x,code:0}}}));
for(const x of codes)if(x.code>=400||x.code===0)errors.push('BROKEN LINK '+x.code+' '+x.url);
console.log('DANINI LIVE ASSET AUDIT '+JSON.stringify({pagesChecked:checked,images,broken,externalMediaReferences:external,linksChecked:codes.length,issues:errors.length}));
for(const e of errors)console.log('ISSUE '+e);
}finally{await browser.close()}
if(errors.length)process.exitCode=1;
