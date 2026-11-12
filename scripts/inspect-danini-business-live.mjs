const url='https://daninihub.com/business';
const resp=await fetch(url,{signal:AbortSignal.timeout(12000)});
const html=await resp.text();
const markers=['Informativni pilot','Poslovno posredovanje','CNC i industrijski RFQ','Opšti poslovni upit','u pripremi','U pripremi','pilot','Pilot','<main','</main>','<section class','<style'];
console.log('BUSINESS_HTTP',resp.status,'FINAL',resp.url,'BYTES',html.length);
for(const q of markers){const i=html.indexOf(q);console.log('MARKER',JSON.stringify(q),i,i>=0?html.slice(Math.max(0,i-350),i+600).replace(/\s+/g,' ').slice(0,950):'');}
const snippets=[...html.matchAll(/<section\b[^>]*>|<div\b[^>]*class="[^"]*(?:hero|pilot|card)[^"]*"[^>]*>|<a\b[^>]*href="[^"]*"[^>]*>/gi)].map(m=>m[0]).slice(0,120);
console.log('STRUCTURAL_TAGS',JSON.stringify(snippets));
