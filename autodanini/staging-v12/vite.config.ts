import { defineConfig } from 'vite';
import { resolve, join } from 'node:path';
import { existsSync, readdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';

const pages = ["index","buyers","dealers","live","inspection","import","exclusive","tender","auctions","guides","about","contact","impressum","privacy","terms","cookies","ai-advisor","disclaimer","cenovnik","ai-primer","faq","nalog","admin"];
const hostinger=process.env.AUTODANINI_BUILD_TARGET === 'hostinger';

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
  // Real owner's source photo and distinctly labelled AI-stylized business grid
  // live inside this repository as base64 because the GitHub text connector
  // cannot upload binary bytes. Decode only at build time; no Drive hotlinks.
  const privateAssets=resolve(process.cwd(),'owned-assets');
  const own=[
    ['dragan-original-portrait.jpg.base64','dragan-original-portrait.jpg'],
    ['dragan-business-grid-ai.png.base64','dragan-business-grid-ai.png']
  ];
  for(const [encoded,name] of own){
    const source=join(privateAssets,encoded);
    if(!existsSync(source))throw new Error('Missing owned business photo: '+source);
    const bytes=Buffer.from(readFileSync(source,'utf8').trim(),'base64');
    if(bytes.length<50000)throw new Error('Corrupt owner photo: '+name);
    writeFileSync(join(outDir,name),bytes);
  }
  console.log('Owned Dragan photos packaged locally:',own.map(v=>v[1]).join(', '));

  const old='https://raw.githubusercontent.com/danininet/daninihub/main/public/';
  let changed=0;
  for(const page of pages){
    const dest=join(outDir,page+'.html');
    let html=readFileSync(dest,'utf8');
    if(html.includes(old)){
      html=html.split(old).join('./');
      changed++;
    }
    // Remote stock-photo URLs are fragile and undermine the owner's branding.
    // All 23 pages use locally packaged first-party automotive photographs;
    // the real owner portrait stays on the personal About/Contact sections.
    html=html.replace(/https:\/\/images\.unsplash\.com\/[^'"<>\s)]+/g,'./danini-auto-uvoz.webp');
    html=html.replace(/(<meta\s+property="og:image"\s+content=")[^"]*/g,
      '$1https://auto.daninihub.com/danini-auto-uvoz.webp');
    writeFileSync(dest,html);
  }
  // The CSS decorative photo-grid branch is not part of the deployable
  // source tree; use an existing first-party image for the same background.
  const oldGrid='https://raw.githubusercontent.com/danininet/daninihub/assets/autodanini-business-20261020/public/branding/autodanini-business-grid.png';
  const assetsDir=join(outDir,'assets');
  for(const name of readdirSync(assetsDir).filter(s=>s.endsWith('.css'))){
    const dest=join(assetsDir,name);
    const css=readFileSync(dest,'utf8');
    if(css.includes(oldGrid))writeFileSync(dest,css.split(oldGrid).join('/danini-auto-uvoz.webp'));
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
