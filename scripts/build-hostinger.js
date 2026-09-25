'use strict';

const fs=require('node:fs');
const path=require('node:path');
const {shell}=require('../server-public-runtime');
const experience=require('../site-experience');

const root=path.join(__dirname,'..');
for(const directory of ['dist',path.join('daninihub-front','dist')]){
  const output=path.join(root,directory);
  fs.mkdirSync(output,{recursive:true});
  fs.writeFileSync(path.join(output,'index.html'),experience.render('sr','start',shell));
  for(const lang of ['sr','de']){
    const localized=path.join(output,lang);
    fs.mkdirSync(localized,{recursive:true});
    fs.writeFileSync(path.join(localized,'index.html'),experience.render(lang,'start',shell));
  }
  for(const [route,meta] of Object.entries(experience.routes)){
    const pageDir=path.join(output,route.slice(1));
    fs.mkdirSync(pageDir,{recursive:true});
    fs.writeFileSync(path.join(pageDir,'index.html'),experience.render(meta.lang,meta.key,shell));
  }
  for(const asset of fs.readdirSync(path.join(root,'public'))){
    fs.copyFileSync(path.join(root,'public',asset),path.join(output,asset));
  }
  const html=fs.readFileSync(path.join(output,'index.html'),'utf8');
  if(!html.includes('href="/sr/upit"')||!fs.existsSync(path.join(output,'sr','upit','index.html'))||!fs.existsSync(path.join(output,'pregled-polovnog-automobila.webp'))){
    throw new Error('Hostinger build output is incomplete: '+directory);
  }
  console.log('Hostinger build output ready: '+directory);
}
