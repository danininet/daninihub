import { defineConfig } from 'vite';
import { resolve, join } from 'node:path';
import { existsSync, readdirSync, readFileSync, writeFileSync, copyFileSync, mkdirSync, rmSync } from 'node:fs';

const pages = ["index","buyers","dealers","live","inspection","import","exclusive","tender","auctions","guides","about","contact","impressum","privacy","terms","cookies","ai-advisor","disclaimer","cenovnik","ai-primer","faq","nalog","admin","support"];
const hostinger=process.env.AUTODANINI_BUILD_TARGET === 'hostinger';

function prepareOwnedImages(){
  // Run before Vite transforms HTML: images must already exist in publicDir.
  const publicDir=resolve(process.cwd(),'public');
  const ownedDir=resolve(process.cwd(),'owned-assets');
  mkdirSync(publicDir,{recursive:true});
  // The owner explicitly requested that neither the source portrait nor the
  // full 3x3 contact sheet be published. Never ship obsolete generated assets.
  for(const old of ['dragan-original-portrait.jpg','dragan-business-grid-ai.png']){
    rmSync(join(publicDir,old),{force:true});
  }
  const entries=[
    ['dragan-business-phone.jpg.base64','dragan-business-phone.jpg'],
    ['dragan-business-portrait.jpg.base64','dragan-business-portrait.jpg']
  ];
  for(const [input,name] of entries){
    const source=join(ownedDir,input);
    if(!existsSync(source))throw Error('Business image source missing: '+source);
    const bytes=Buffer.from(readFileSync(source,'utf8').trim(),'base64');
    if(bytes.length<50000)throw Error('Business image corrupt: '+name);
    writeFileSync(join(publicDir,name),bytes);
  }
}

function packageOriginalPhotos(){
  // Only for Hostinger staging: use real photos already in this repository
  // instead of links to GitHub raw, which can fail in visitors' browsers.
  const outDir=resolve(process.cwd(),process.env.APPDEPLOY_VITE_OUT_DIR||'dist');
  const originals=resolve(process.cwd(),'../../public');
  const files=['danini-auto-uvoz.webp','danini-pregled-auta.webp'];
  for(const name of files){
    const input=join(originals,name);
    if(!existsSync(input))throw new Error('Missing original business photo: '+input);
    copyFileSync(input,join(outDir,name));
  }
  // Two user-approved individual AI-stylized business photos are vendored as
  // base64 because the GitHub text connector cannot upload binary bytes.
  // Never publish the owner's original photo or the full 3x3 collage.
  const privateAssets=resolve(process.cwd(),'owned-assets');
  const own=[
    ['dragan-business-phone.jpg.base64','dragan-business-phone.jpg'],
    ['dragan-business-portrait.jpg.base64','dragan-business-portrait.jpg']
  ];
  for(const [encoded,name] of own){
    const source=join(privateAssets,encoded);
    if(!existsSync(source))throw new Error('Missing owned business photo: '+source);
    const bytes=Buffer.from(readFileSync(source,'utf8').trim(),'base64');
    if(bytes.length<50000)throw new Error('Corrupt owner photo: '+name);
    writeFileSync(join(outDir,name),bytes);
  }
  for(const old of ['dragan-original-portrait.jpg','dragan-business-grid-ai.png']){
    rmSync(join(outDir,old),{force:true});
  }
  console.log('Approved single business photos packaged:',own.map(v=>v[1]).join(', '));
  // Embed only the two approved public JPGs into owner-facing pages. Hostinger
  // intermittently returns nginx 502 for simultaneous binary requests. HTML
  // was consistently served, so inline images avoid those separate fetches.
  // This is intentionally limited to small, public business photos, never
  // private IDs, owner source photo, the full 3x3 grid, or customer records.
  const inlinePhotos=Object.fromEntries(own.map(([encoded,name])=>
    [name,'data:image/jpeg;base64,'+readFileSync(join(privateAssets,encoded),'utf8').trim()]
  ));


  const old='https://raw.githubusercontent.com/danininet/daninihub/main/public/';
  let changed=0;
  for(const page of pages){
    const dest=join(outDir,page+'.html');
    let html=readFileSync(dest,'utf8');
    if(html.includes(old)){
      html=html.split(old).join('./');
      changed++;
    }
    // Use owned vehicle images ONLY in vehicle/service content.
    // Owner-facing pages must feature real owner or clearly-labelled AI business
    // photographs; never quietly replace the user's portrait or business grid
    // with car imagery or unrelated stock photography.
    const ownerPage=['index','about','contact'].includes(page);
    const ownerImage=page==='about'?'dragan-business-portrait.jpg':'dragan-business-phone.jpg';
    if(ownerPage){
      // Match the first hero image by fixed HTML delimiter, with no regex
      // ambiguity in TypeScript/Vite and no effect on vehicle imagery.
      const heroClass=page==='index'?'hero':'pagehero';
      const marker='<section class="'+heroClass+'" style="--image:url(';
      const begin=html.indexOf(marker);
      if(begin<0)throw Error('Missing owner business hero in '+page);
      const imageBegin=begin+marker.length;
      const imageEnd=html.indexOf("')",imageBegin);
      if(imageEnd<0)throw Error('Malformed business hero image in '+page);
      html=html.slice(0,imageBegin)+"'./"+ownerImage+html.slice(imageEnd);
    }
    html=html.replace(/https:\/\/images\.unsplash\.com\/[^'"<>\s)]+/g,'./danini-auto-uvoz.webp');
    const socialImage=ownerPage?'dragan-business-portrait.jpg':'danini-auto-uvoz.webp';
    html=html.replace(/(<meta\s+property="og:image"\s+content=")[^"]*/g,
      '$1https://auto.daninihub.com/'+socialImage);
    if(['index','about','contact','support'].includes(page)){
      for(const [name,dataUrl] of Object.entries(inlinePhotos)){
        html=html.split("url('./"+name+"')").join("url('"+dataUrl+"')");
        html=html.split('src="./'+name+'"').join('src="'+dataUrl+'"');
        html=html.split('src="/'+name+'"').join('src="'+dataUrl+'"');
      }
      // Portraits styled in CSS must not issue another JPEG fetch. Inline
      // override wins over the class background-image, which we retain as
      // a graceful non-inline fallback in development.
      if(html.includes('class="portrait-single')){
        const dataUrl=inlinePhotos['dragan-business-portrait.jpg'];
        html=html.replace(/(<div class="portrait-single[^"]*")(?=\s)/g,
          '$1 style="background-image:url(\''+dataUrl+'\')"');
      }
    }
    writeFileSync(dest,html);
  }
  // Historical business grid URLs must resolve to ONE approved individual
  // business image, never the entire collage or an unrelated car photo.
  const oldGrid='https://raw.githubusercontent.com/danininet/daninihub/assets/autodanini-business-20261020/public/branding/autodanini-business-grid.png';
  const assetsDir=join(outDir,'assets');
  for(const name of readdirSync(assetsDir).filter(s=>s.endsWith('.css'))){
    const dest=join(assetsDir,name);
    const css=readFileSync(dest,'utf8');
    if(css.includes(oldGrid))writeFileSync(dest,css.split(oldGrid).join('/dragan-business-portrait.jpg'));
  }
  console.log('Hostinger original photos packaged:',files.join(', '),'HTML files updated:',changed);
}
export default defineConfig({
  resolve: hostinger
    ? { alias: { '@appdeploy/client': resolve(process.cwd(), 'src/hostinger-client.ts') } }
    : {},
  plugins: hostinger ? [{
    name: 'autodanini-package-owned-photos',
    apply: 'build',
    buildStart: prepareOwnedImages,
    closeBundle: packageOriginalPhotos
  }] : [],
  base: './',
  build: {
    outDir: process.env.APPDEPLOY_VITE_OUT_DIR || 'dist',
    sourcemap:
      process.env.APPDEPLOY_VITE_SOURCEMAP === 'hidden' ? 'hidden' : false,
    rollupOptions: {
      maxParallelFileOps: 128,
      input: Object.fromEntries(pages.map(name => [name, resolve(process.cwd(), name + '.html')])),
    },
  },
});
