'use strict';
/*
 * Build the existing AppDeploy v12 HTML/CSS design for a Hostinger staging
 * deployment. Run from repository root:
 *   npm run build:autodanini-hostinger
 *
 * It does not deploy, edit DNS, enable payment, or overwrite the old frontend.
 */
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const dir=path.join(__dirname,'..','autodanini','staging-v12');
const npm=process.platform==='win32'?'npm.cmd':'npm';
function run(args,extraEnv={}){
  const result=spawnSync(npm,args,{cwd:dir,env:{...process.env,...extraEnv},stdio:'inherit',shell:process.platform==='win32'});
  if(result.error)throw result.error;
  if(result.status!==0)throw new Error('Hostinger AutoDanini build failed: '+args.join(' '));
}
run(['install','--no-audit','--no-fund']);
run(['run','build'],{AUTODANINI_BUILD_TARGET:'hostinger',VITE_AUTODANINI_HOSTINGER_BUILD:'true'});
console.log('AutoDanini staging files: autodanini/staging-v12/dist');
