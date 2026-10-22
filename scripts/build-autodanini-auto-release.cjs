'use strict';
// Build a public, read-only AutoDanini front end for auto.daninihub.com.
// Keeps the existing DaniniHub server and root-domain routing unchanged.
// The staging source is a separate, tested GitHub feature branch.
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');

const source='https://github.com/danininet/daninihub.git';
// This snapshot branch deliberately never advances. The immutable SHA
// prevents a newer feature-branch commit silently shipping to production.
const sourceBranch='release/autodanini-v12-snapshot-20261022';
const expectedSourceCommit='7a05f37be2298edfee8878fa9889c1752d2c4b0f';
const expectedPages=['index','buyers','dealers','live','inspection','import','exclusive','tender',
 'auctions','guides','about','contact','impressum','privacy','terms','cookies','ai-advisor',
 'disclaimer','cenovnik','ai-primer','faq','nalog','admin'];
const stage=fs.mkdtempSync(path.join(os.tmpdir(),'danini-auto-release-'));
const checkout=path.join(stage,'source');
const out=path.resolve(__dirname,'../autodanini-auto-dist');
function run(command,args,cwd,env=process.env){
 const commandForOS=process.platform==='win32'&&command==='npm'?'npm.cmd':command;
 const result=spawnSync(commandForOS,args,{cwd,env,stdio:'inherit',shell:process.platform==='win32'});
 if(result.error)throw result.error;
 if(result.status!==0)throw new Error('AutoDanini release build failed: '+command+' '+args.join(' '));
}
try {
 // Sparse clone avoids downloading old unrelated DaniniHub repositories,
 // large media folders and backend data during an AutoDanini frontend build.
 run('git',['clone','--filter=blob:none','--depth=1','--sparse',
   '--single-branch','--branch',sourceBranch,source,checkout],stage);
 run('git',['-C',checkout,'sparse-checkout','set','autodanini/staging-v12','public'],stage);
 const version=spawnSync('git',['-C',checkout,'rev-parse','HEAD'],{
  cwd:stage,encoding:'utf8',stdio:['ignore','pipe','pipe']
 });
 if(version.status!==0||version.stdout.trim()!==expectedSourceCommit){
   throw new Error('AUTODANINI_SOURCE_REVISION_NOT_APPROVED: expected '+expectedSourceCommit);
 }
 const frontend=path.join(checkout,'autodanini','staging-v12');
 if(!fs.existsSync(path.join(frontend,'package.json')))throw Error('AUTODANINI_FRONTEND_SOURCE_MISSING');
 // These values are fixed for this first public visual preview. The customer
 // account, admin, AI and paid APIs will NOT be activated by client flags.
 const env={...process.env,
  NODE_ENV:'production',AUTODANINI_BUILD_TARGET:'hostinger',
  VITE_AUTODANINI_HOSTINGER_BUILD:'true',
  VITE_AUTODANINI_AUTH_ENABLED:'false',
  VITE_AUTODANINI_ADMIN_ENABLED:'false',
  VITE_AUTODANINI_SUBMISSIONS_ENABLED:'false',
  VITE_AUTODANINI_AI_ENABLED:'false'};
 run('npm',['install','--include=dev','--no-audit','--no-fund'],frontend,env);
 run('npm',['run','build'],frontend,env);
 const result=path.join(frontend,'dist');
 const absent=expectedPages.filter(name=>!fs.existsSync(path.join(result,name+'.html')));
 if(absent.length)throw Error('AUTODANINI_RELEASE_PAGES_MISSING: '+absent.join(','));
 for(const image of ['danini-auto-uvoz.webp','danini-pregled-auta.webp']){
  if(!fs.existsSync(path.join(result,image)))throw Error('AUTODANINI_ORIGINAL_PHOTO_MISSING '+image);
 }
 const owner=fs.readFileSync(path.join(result,'admin.html'),'utf8');
 if(!owner.includes('data-page="admin"')||!owner.includes('noindex'))
  throw Error('AUTODANINI_PRIVATE_OWNER_UI_NOT_STAGED');
 fs.rmSync(out,{recursive:true,force:true});
 fs.cpSync(result,out,{recursive:true});
 fs.writeFileSync(path.join(out,'AUTODANINI_RELEASE_INFO.json'),JSON.stringify({
   site:'AutoDanini',sourceBranch,expectedSourceCommit,releaseMode:'public-visual-only',
   accounts:false,admin:false,payments:false,ai:false,documents:'noindex'
 },null,2)+'\n');
 console.log('AutoDanini PUBLIC VISUAL release built:',expectedPages.length,'pages at',out);
}finally{
 fs.rmSync(stage,{recursive:true,force:true});
}
