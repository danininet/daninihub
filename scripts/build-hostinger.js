'use strict';

const fs=require('node:fs');
const path=require('node:path');
const {shell,seoPage}=require('../server-public-runtime');
const experience=require('../site-experience');

const root=path.join(__dirname,'..');
for(const directory of ['dist',path.join('daninihub-front','dist')]){
  const output=path.join(root,directory);
  fs.mkdirSync(output,{recursive:true});
  fs.writeFileSync(path.join(output,'index.html'),seoPage(experience.render('sr','start',shell),'/sr/'));
  for(const lang of ['sr','de']){
    const localized=path.join(output,lang);
    fs.mkdirSync(localized,{recursive:true});
    fs.writeFileSync(path.join(localized,'index.html'),seoPage(experience.render(lang,'start',shell),'/'+lang+'/'));
  }
  for(const [route,meta] of Object.entries(experience.routes)){
    const pageDir=path.join(output,route.slice(1));
    fs.mkdirSync(pageDir,{recursive:true});
    fs.writeFileSync(path.join(pageDir,'index.html'),seoPage(experience.render(meta.lang,meta.key,shell),route));
  }
  for(const asset of fs.readdirSync(path.join(root,'public'))){
    const source=path.join(root,'public',asset);
    const destination=path.join(output,asset);
    if(fs.statSync(source).isDirectory())fs.cpSync(source,destination,{recursive:true});
    else fs.copyFileSync(source,destination);
  }
  const html=fs.readFileSync(path.join(output,'index.html'),'utf8');
  if(!html.includes('href="/sr/upit"')||
    !fs.existsSync(path.join(output,'sr','upit','index.html'))||
    !fs.existsSync(path.join(output,'images','DANINI_Dragan_Portret_CLEAN_1200x1200.jpg'))||
    !fs.existsSync(path.join(output,'images','DANINI_Dragan_Telefon_CLEAN_1200x1200.jpg'))||
    !fs.existsSync(path.join(output,'images','DANINI_Dragan_Pregled_Auta_CLEAN_1200x1200.jpg'))||
    !fs.existsSync(path.join(output,'images','DANINI_Kartica_01_Salon_Auto_Bez_Osobe.jpg'))||
    !fs.existsSync(path.join(output,'images','DANINI_Kartica_02_Uvoz_Dokumentacija_EUR1.jpg'))||
    !fs.existsSync(path.join(output,'images','DANINI_Kartica_03_Dovoz_Transport_Srbija.jpg'))||
    !fs.existsSync(path.join(output,'images','DANINI_Kartica_04_Zoll_Tablice_Dovoz_Na_Tockovima.jpg'))||
    !fs.existsSync(path.join(output,'images','DANINI_Kartica_05_Originalni_OE_Delovi_Servis.jpg'))||
    !fs.existsSync(path.join(output,'images','DANINI_Kartica_06_B2B_Sourcing_I_Preuzimanje.jpg'))){
    throw new Error('Hostinger build output is incomplete: '+directory);
  }
  console.log('Hostinger build output ready: '+directory);
}
