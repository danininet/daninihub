const root='https://daninihub.com';
const pages=['/','/sr/','/de/','/index.html',...['prepurchase','buyers','dealers','live','inspection','import','exclusive','tender','auctions','guides','digital','ai-solutions','business','cnc','selbstimport','uvoz-vodic','about','contact','cenovnik','faq','ai-advisor','ai-primer'].flatMap(x=>['/'+x,'/'+x+'.html'])];
const needles=['Pripremite kupovinu auta sami','Pomoć kada zatreba','Pripremi digitalni dosije','7 besplatnih vodiča','Samostalna kontrolna lista','Besplatan kalkulator uvoza'];
const hits=[];
await Promise.all([...new Set(pages)].map(async path=>{
 try {const r=await fetch(root+path,{signal:AbortSignal.timeout(14000)}),s=await r.text();
 const found=needles.filter(x=>s.includes(x));
 if(found.length){const i=s.indexOf(found[0]);hits.push({path,final:r.url,code:r.status,title:(s.match(/<title[^>]*>([^<]+)/)||[])[1],found,near:s.slice(Math.max(0,i-140),i+240)});}
 }catch(e){console.log('FETCH_ERROR',path,String(e).slice(0,140))}
}));
console.log('CLUTTER_ROUTE_SCAN',JSON.stringify(hits,null,2));
if(!hits.length)console.log('CLUTTER_ROUTE_SCAN: no matching page in surveyed routes');
