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
  const old='https://raw.githubusercontent.com/danininet/daninihub/main/public/';
  let changed=0;
  for(const page of pages){
    const dest=join(outDir,page+'.html');
    let html=readFileSync(dest,'utf8');
    if(html.includes(old)){
      html=html.split(old).join('./');
      writeFileSync(dest,html);
      changed++;
    }
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
