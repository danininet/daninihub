const url='https://daninihub.com/business';
const resp=await fetch(url,{signal:AbortSignal.timeout(12000)});
const html=await resp.text();
const markers=['Informativni pilot','Poslovno posredovanje','CNC i industrijski RFQ','Opšti poslovni upit','u pripremi','U pripremi','pilot','Pilot','<main','</main>','<section class','<style'];
console.log('BUSINESS_HTTP',resp.status,'FINAL',resp.url,'BYTES',html.length);
for(const q of markers){const i=html.indexOf(q);console.log('MARKER',JSON.stringify(q),i,i>=0?html.slice(Math.max(0,i-350),i+600).replace(/\s+/g,' ').slice(0,950):'');}
const snippets=[...html.matchAll(/<section\b[^>]*>|<div\b[^>]*class="[^"]*(?:hero|pilot|card)[^"]*"[^>]*>|<a\b[^>]*href="[^"]*"[^>]*>/gi)].map(m=>m[0]).slice(0,120);
console.log('STRUCTURAL_TAGS',JSON.stringify(snippets));

const required=['id="dn-business-modern"','class="bphoto"','class="bcta"','class="bstages"','DANINI_Kartica_06_B2B_Sourcing_I_Preuzimanje.jpg'];
for(const token of required)if(!html.includes(token))throw new Error('Business redesign missing: '+token);
if(html.includes('class="danini-prelaunch"')||html.includes('class="danini-b2b-hero"'))throw new Error('Old pilot hero still visible');
if(html.includes('content="noindex,follow"'))throw new Error('Business page still noindex');
const image=await fetch('https://daninihub.com/images/DANINI_Kartica_06_B2B_Sourcing_I_Preuzimanje.jpg',{signal:AbortSignal.timeout(15000)});
const bytes=new Uint8Array(await image.arrayBuffer());
if(image.status!==200||bytes[0]!==255||bytes[1]!==216)throw new Error('Business JPEG not served: '+image.status);
console.log('BUSINESS_REDESIGN_PASS',{html:html.length,image:bytes.length,headline:html.includes('Vaš poslovni zahtev.'),heroButtons:(html.match(/class="bcta"/g)||[]).length});

if(!html.includes('dn-service-header')||!html.includes('dn-service-logo'))throw new Error('DANINI shared header not visible');
if(!html.includes('data-business-lang'))throw new Error('DE/SR language switch missing');
console.log('BUSINESS_HEADER_PASS');

const paths=['/','/buyers','/dealers','/live','/inspection','/import','/exclusive','/tender','/auctions','/guides','/digital','/ai-solutions','/business','/cnc','/selbstimport','/uvoz-vodic','/about','/cenovnik','/faq','/support','/prepurchase'];
const unfinished=[];
await Promise.all(paths.map(async path=>{try{
 const response=await fetch('https://daninihub.com'+path,{signal:AbortSignal.timeout(15000)});
 const body=await response.text();
 const content=(body.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)||[])[0]||'';
 const matches=[...content.matchAll(/u pripremi|informativni pilot|in vorbereitung|informationspilot|uskoro|kommt bald|pilot phase|planirano|geplant/gi)].slice(0,10);
 if(matches.length)unfinished.push({path,status:response.status,count:matches.length,samples:matches.map(m=>content.slice(Math.max(0,m.index-100),m.index+140).replace(/\s+/g,' '))});
}catch(e){unfinished.push({path,error:String(e).slice(0,150)})}}));
console.log('UNFINISHED_PUBLIC_SECTIONS',JSON.stringify(unfinished,null,2));
