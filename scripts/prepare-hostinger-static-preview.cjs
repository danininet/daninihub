'use strict';
// Static Hostinger deployments do not execute Express response headers.
const fs=require('node:fs'), path=require('node:path');
const dist=path.resolve('dist');
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else if(e.name.endsWith('.html')){
 let html=fs.readFileSync(f,'utf8');
 html=html.replace(/<meta\b[^>]*name=["']robots["'][^>]*>/gi,'');
 html=html.replace(/<\/head>/i,'<meta name="robots" content="noindex,nofollow,noarchive"></head>');
 if(!html.includes('data-hostinger-preview'))html=html.replace(/<body(?:\s[^>]*)?>/i,m=>m+'<aside data-hostinger-preview style="padding:12px;background:#fff3cd;color:#3d3013;text-align:center">TEST / VORSCHAU — keine Kundendaten / bez podataka klijenata. <a href="https://daninihub.com/">daninihub.com</a></aside>');
 fs.writeFileSync(f,html);
}}}
walk(dist);
fs.writeFileSync(path.join(dist,'robots.txt'),'User-agent: *\nAllow: /\n');
