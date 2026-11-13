'use strict';
/** Build standalone, no-secrets DANINI PR preview Worker. Never deploy to production worker. */
const fs=require('node:fs');
const path=require('node:path');
const out=path.resolve('danini-ai-preview-dist');
fs.mkdirSync(out,{recursive:true});
const source=path.resolve('scripts/danini-advisor-pages.cjs');
const pageDir=path.join(out,'pages');
fs.mkdirSync(pageDir,{recursive:true});
require(source).writeAdvisorPages(pageDir);
const pages={
 '/de/ai-savetnik/':fs.readFileSync(path.join(pageDir,'de/ai-savetnik/index.html'),'utf8'),
 '/sr/ai-savetnik/':fs.readFileSync(path.join(pageDir,'sr/ai-savetnik/index.html'),'utf8'),
 '/danini-advisor-client.js':fs.readFileSync('public/danini-advisor-client.js','utf8')
};
for(const [key,html] of Object.entries(pages)){
 if(key.endsWith('.js'))continue;
 if((html.match(/data-question=/g)||[]).length!==3 ||
    (html.match(/data-risk-row=/g)||[]).length!==3 ||
    !html.includes('id="advisor-cta" class="cta" disabled'))
  throw Error('Invalid advisor preview: '+key);
}
const worker=fs.readFileSync('workers/danini-ai-preview.mjs','utf8');
const marker='const PAGES = {};';
if(!worker.includes(marker))throw Error('Preview placeholder missing');
const bundle=worker.replace(marker,'const PAGES = '+JSON.stringify(pages)+';');
if(bundle.includes('env.BREVO_API_KEY')||bundle.includes('api.brevo.com'))
 throw Error('Preview contains production mail integration');
fs.writeFileSync(path.join(out,'worker.mjs'),bundle);
console.log('PASS: isolated DANINI SR/DE advisor preview Worker bundle generated (no Brevo)');
