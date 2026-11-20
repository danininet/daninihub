'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),out=path.join(root,'catalog-pilot-dist');
fs.mkdirSync(out,{recursive:true});
for(const name of ['index.html','style.css','app.js'])fs.copyFileSync(path.join(root,'catalog-pilot',name),path.join(out,name));
fs.copyFileSync(path.join(root,'core/catalog-proof.js'),path.join(out,'catalog-proof.js'));
fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
fs.writeFileSync(path.join(out,'_headers'),'/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  Content-Security-Policy: default-src \'self\'; script-src \'self\'; style-src \'self\'; object-src \'none\'; frame-ancestors \'none\'; base-uri \'none\'; form-action \'self\'\n');
console.log('Browser-local catalog pilot built; no API, payment or production domain access.');
