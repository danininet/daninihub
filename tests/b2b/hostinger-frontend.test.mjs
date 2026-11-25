import test from 'node:test';
import assert from 'node:assert/strict';
import {hostingerFrontend} from '../../src/hostinger-frontend.mjs';
const staging='https://danini-b2b-staging.dragangaganet.workers.dev';
const prod='https://daninihub.com';
const origin='https://gleaming-orangered-crow-58.hostingersite.com';
const env=(mode,site=staging)=>({HOSTINGER_FRONTEND_MODE:mode,SITE_ORIGIN:site,ASSETS:{fetch:async()=>new Response('local')}});
test('default preserves existing Cloudflare assets',async()=>assert.equal(await (await hostingerFrontend(new Request(prod+'/de/'),env(undefined))).text(),'local'));
test('preview uses fixed public origin without credentials or query and prevents indexing',async()=>{
 const r=await hostingerFrontend(new Request(staging+'/de/?token=private',{headers:{cookie:'private',authorization:'Bearer private',origin:'https://other.test'}}),env('preview'),async(url,opts)=>{
 assert.equal(url,origin+'/de/');assert.equal(opts.credentials,'omit');assert.deepEqual(Object.keys(opts.headers),['accept']);assert.equal(opts.redirect,'manual');
 return new Response('<html>preview</html>',{headers:{'content-type':'text/html','set-cookie':'bad=1','x-robots-tag':'index'}});
 });
 assert.equal(r.status,200);assert.equal(r.headers.get('x-danini-frontend'),'hostinger');assert.match(r.headers.get('x-robots-tag'),/noindex/);assert.equal(r.headers.get('set-cookie'),null);
});
test('blocks unexpected hosts, private paths, unsafe methods and external redirects',async()=>{
 const never=async()=>{assert.fail('unexpected upstream')};
 for(const p of ['/api/health','/portal/','/operator/sandbox-checkout/','/auto/admin.html','/downloads/private.pdf','/de/%2561pi/health'])assert.ok((await hostingerFrontend(new Request(staging+p),env('preview'),never)).status>=400,p);
 assert.equal((await hostingerFrontend(new Request(prod+'/de/'),env('preview'),never)).status,503);
 assert.equal((await hostingerFrontend(new Request(staging+'/de/',{method:'POST'}),env('preview'),never)).status,405);
 for(const location of ['https://evil.test/','https://gleaming-orangered-crow-58.hostingersite.com//evil.test/','/portal/'])assert.equal((await hostingerFrontend(new Request(staging+'/de/'),env('preview'),async()=>new Response(null,{status:302,headers:{location}}))).status,503);
});
test('production refuses preview HTML and keeps legitimate noindex pages',async()=>{
 const req=new Request(prod+'/de/');const e=env('production',prod);
 const html=(body,headers={})=>new Response(body,{headers:{'content-type':'text/html','x-danini-runtime':'hostinger-frontend',...headers}});
 assert.equal((await hostingerFrontend(req,e,async()=>html('<aside data-hostinger-preview>test</aside>'))).status,503);
 assert.equal((await hostingerFrontend(req,e,async()=>html('test',{'x-danini-runtime':'hostinger-preview'}))).status,503);
 const page=await hostingerFrontend(req,e,async()=>html('public',{'x-robots-tag':'noindex'}));
 assert.equal(page.status,200);
 assert.equal(page.headers.get('x-robots-tag'),'noindex');
 assert.equal((await hostingerFrontend(req,e,async()=>new Response('placeholder'))).status,503);
 const originStructure=async()=>html('public',{'x-robots-tag':'noindex, nofollow, noarchive'});
 assert.equal((await hostingerFrontend(req,e,originStructure)).headers.get('x-robots-tag'),null);
 const staged=await hostingerFrontend(new Request(staging+'/de/'),env('staging'),originStructure);
 assert.equal(staged.status,200);
 assert.match(staged.headers.get('x-robots-tag'),/noindex/);
 assert.equal((await hostingerFrontend(new Request(staging+'/de/'),env('staging'),async()=>new Response('preview'))).status,503);
 const redirect=await hostingerFrontend(new Request('https://www.daninihub.com/de/?lang=de'),e);
 assert.equal(redirect.status,308);
 assert.equal(redirect.headers.get('location'),prod+'/de/?lang=de');
 const robots=await hostingerFrontend(new Request(prod+'/robots.txt'),e,async()=>assert.fail('origin robots would block production'));
 assert.equal(await robots.text(),'local');
});
