'use strict';

const fs=require('node:fs');
const path=require('node:path');
const {home}=require('../server-public-runtime');

const root=path.join(__dirname,'..');
for(const directory of ['dist',path.join('daninihub-front','dist')]){
  const output=path.join(root,directory);
  fs.mkdirSync(output,{recursive:true});
  fs.writeFileSync(path.join(output,'index.html'),home('sr'));
  for(const asset of fs.readdirSync(path.join(root,'public'))){
    fs.copyFileSync(path.join(root,'public',asset),path.join(output,asset));
  }
  const html=fs.readFileSync(path.join(output,'index.html'),'utf8');
  if(!html.includes('id="service-form"')||!fs.existsSync(path.join(output,'pregled-polovnog-automobila.webp'))){
    throw new Error('Hostinger build output is incomplete: '+directory);
  }
  console.log('Hostinger build output ready: '+directory);
}
