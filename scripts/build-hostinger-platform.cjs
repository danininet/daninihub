'use strict';
const {spawnSync, execFileSync} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const mode = process.argv[2] ?? (process.env.DANINI_HOSTINGER_RELEASE === 'true' ? 'release' : 'preview');
const preview = mode === 'preview';
if (!['preview', 'production', 'release'].includes(mode)) throw new Error('Invalid Hostinger build mode');
const env = {...process.env, DANINI_HOSTINGER_PREVIEW: preview ? 'true' : 'false'};
const build=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['run','build:platform'],{env,stdio:'inherit'});
if(build.status!==0)process.exit(build.status||1);
if(preview){
  const prepare=spawnSync(process.execPath,['scripts/prepare-hostinger-static-preview.cjs'],{env,stdio:'inherit'});
  if(prepare.status!==0)process.exit(prepare.status||1);
}
let revision='unknown';
try{revision=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();}catch{}
fs.mkdirSync('dist/_danini',{recursive:true});
fs.writeFileSync('dist/_danini/build.json',JSON.stringify({schema:1,mode:preview?'preview':'production',revision,builtAt:new Date().toISOString(),node:process.versions.node})+'\n');
// A production artifact must not carry a preview banner or a preview CSP.
function audit(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory())audit(file);
  else if(entry.name.endsWith('.html')){
    const html=fs.readFileSync(file,'utf8');
    if(!preview && /data-hostinger-preview|data-hostinger-preview-csp/.test(html))throw new Error('Preview marker in production artifact: '+file);
  }
}}
audit('dist');
console.log('Hostinger '+(preview?'preview':'production')+' artifact validated: '+revision);
if (mode === 'release') require('./package-hostinger-release.cjs');
