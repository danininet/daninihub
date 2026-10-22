'use strict';
/**
 * Self-contained AutoDanini visual-only release.
 * All 23 source pages and browser sources are VENDORED from the reviewed
 * AutoDanini v12 snapshot into this repository. No nested GitHub clone,
 * no external GitHub branch used during Hostinger's build.
 */
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const frontend=path.join(__dirname,'..','autodanini','staging-v12');
const out=path.resolve(__dirname,'../autodanini-auto-dist');
const pages=['index','buyers','dealers','live','inspection','import','exclusive','tender',
 'auctions','guides','about','contact','impressum','privacy','terms','cookies',
 'ai-advisor','disclaimer','cenovnik','ai-primer','faq','nalog','admin'];
function run(args,env){
 const npm=process.platform==='win32'?'npm.cmd':'npm';
 const result=spawnSync(npm,args,{cwd:frontend,env,stdio:'inherit',shell:process.platform==='win32'});
 if(result.error)throw result.error;
 if(result.status!==0)throw new Error('AUTODANINI_SELF_CONTAINED_BUILD_FAILED '+args.join(' '));
}
if(!fs.existsSync(path.join(frontend,'vite.config.ts')))
 throw Error('AUTODANINI_VENDORED_SOURCE_MISSING');
const env={...process.env,
 NODE_ENV:'production',
 AUTODANINI_BUILD_TARGET:'hostinger',
 VITE_AUTODANINI_HOSTINGER_BUILD:'true',
 VITE_AUTODANINI_AUTH_ENABLED:'false',
 VITE_AUTODANINI_ADMIN_ENABLED:'false',
 VITE_AUTODANINI_SUBMISSIONS_ENABLED:'false',
 VITE_AUTODANINI_AI_ENABLED:'false'
};
// Vite is a devDependency. Hostinger can set NODE_ENV=production during build.
run(['install','--include=dev','--no-audit','--no-fund'],env);
run(['run','build'],env);
const compiled=path.join(frontend,'dist');
const absent=pages.filter(name=>!fs.existsSync(path.join(compiled,name+'.html')));
if(absent.length)throw Error('AUTODANINI_RELEASE_PAGES_MISSING '+absent.join(','));
for(const image of ['danini-auto-uvoz.webp','danini-pregled-auta.webp']){
 if(!fs.existsSync(path.join(compiled,image)))throw Error('AUTODANINI_RELEASE_ORIGINAL_PHOTO_MISSING '+image);
}
const admin=fs.readFileSync(path.join(compiled,'admin.html'),'utf8');
if(!admin.includes('data-page="admin"')||!admin.includes('noindex'))
 throw Error('AUTODANINI_OWNER_PAGE_UNSAFE');
fs.rmSync(out,{recursive:true,force:true});
fs.cpSync(compiled,out,{recursive:true});
fs.writeFileSync(path.join(out,'AUTODANINI_RELEASE_INFO.json'),
 JSON.stringify({site:'AutoDanini',source:'vendored-reviewed-v12-20261022',pages:pages.length,
  releaseMode:'public-visual-only',accounts:false,admin:false,payments:false,ai:false},null,2)+'\n');
console.log('AutoDanini self-contained release complete:',pages.length,'pages');
