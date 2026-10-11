'use strict';

const fs=require('node:fs');
const path=require('node:path');
const {shell,seoPage}=require('../server-public-runtime');
const experience=require('../site-experience');
const founder=require('../founder-site');

const root=path.join(__dirname,'..');
for(const directory of ['dist',path.join('daninihub-front','dist')]){
  const output=path.join(root,directory);
  fs.mkdirSync(output,{recursive:true});
  fs.writeFileSync(path.join(output,'index.html'),founder.render('sr','home'));
  for(const lang of ['sr','de']){
    const localized=path.join(output,lang);
    fs.mkdirSync(localized,{recursive:true});
    fs.writeFileSync(path.join(localized,'index.html'),founder.render(lang,'home'));
  }
  for(const [route,meta] of Object.entries(experience.routes)){
    const pageDir=path.join(output,route.slice(1));
    fs.mkdirSync(pageDir,{recursive:true});
    fs.writeFileSync(path.join(pageDir,'index.html'),seoPage(experience.render(meta.lang,meta.key,shell),route));
  }
  for(const route of founder.paths.filter(route=>!['/sr/','/de/'].includes(route))){
    const lang=route.startsWith('/sr/')?'sr':'de';
    const key=['about','services','gtm','automotive','projects','career','contact'].find(k=>founder.pathFor(lang,k)===route);
    if(!key)throw new Error('Unknown founder route: '+route);
    const pageDir=path.join(output,route.slice(1));
    fs.mkdirSync(pageDir,{recursive:true});
    fs.writeFileSync(path.join(pageDir,'index.html'),founder.render(lang,key));
  }
  for(const asset of fs.readdirSync(path.join(root,'public'))){
    fs.copyFileSync(path.join(root,'public',asset),path.join(output,asset));
  }
  const html=fs.readFileSync(path.join(output,'index.html'),'utf8');
  if(!html.includes('Dragan Zdravković')||!html.includes('dragan-zdravkovic-original.jpg')||!fs.existsSync(path.join(output,'sr','kalkulator','index.html'))||!fs.existsSync(path.join(output,'dragan-zdravkovic-original.jpg'))||!fs.existsSync(path.join(output,'dragan-business-grid-3x3.png'))){
    throw new Error('Hostinger build output is incomplete: '+directory);
  }
  console.log('Hostinger build output ready: '+directory);
}
