const base='https://daninihub.com';
const redirected={
'/auctions':'/buyers','/digital':'/guides','/ai-solutions':'/business','/prepurchase':'/guides','/cnc':'/business'
};
const results=[];
for(const [oldPath,target] of Object.entries(redirected)){
 for(const suffix of ['', '.html']){
  const path=oldPath+suffix, r=await fetch(base+path,{redirect:'manual',signal:AbortSignal.timeout(14000)});
  const location=r.headers.get('location')||'';
  results.push({path,status:r.status,location});
  if(r.status!==302||location!==base+target)throw new Error('Expected temporary redirect '+path+' => '+base+target+'; got '+r.status+' '+location);
 }
}
const business=await fetch(base+'/business',{signal:AbortSignal.timeout(14000)}),html=await business.text();
if(business.status!==200||!html.includes('id="dn-business-modern"')||!html.includes('dn-service-nav')||!html.includes('DANINI_Kartica_06_B2B_Sourcing_I_Preuzimanje.jpg')||html.includes('danini-prelaunch'))throw new Error('Business landing incomplete');
if(html.includes('content="noindex,follow"'))throw new Error('Business remains noindex');
const image=await fetch(base+'/images/DANINI_Kartica_06_B2B_Sourcing_I_Preuzimanje.jpg',{signal:AbortSignal.timeout(14000)}),bytes=new Uint8Array(await image.arrayBuffer());
if(image.status!==200||bytes[0]!==255||bytes[1]!==216)throw new Error('B2B visual missing');
const sitemap=await fetch(base+'/sitemap.xml',{signal:AbortSignal.timeout(14000)});const xml=await sitemap.text();
if(sitemap.status!==200)throw new Error('Sitemap not available');
const listed=xml.split('<loc>').slice(1).map(x=>x.split('</loc>')[0].trim());
for(const page of Object.keys(redirected)){if(listed.includes(base+page)||listed.includes(base+page+'.html'))throw new Error('Sitemap contains unfinished route '+page)}
const price=await fetch(base+'/cenovnik',{signal:AbortSignal.timeout(14000)});
const priceHTML=await price.text();
if(price.status!==200||priceHTML.includes('AI savetnik je informativni pilot alat.')||!priceHTML.includes('Digitalni alati služe za pripremu upita'))throw new Error('Pricing page retains misleading AI pilot marketing');
console.log('PRICING_CLARITY_PASS');
console.log('ACTIVE_SITEMAP_ENTRIES',listed.length);
console.log('UNREADY_ROUTE_TEST_PASS',JSON.stringify({redirects:results.length,business:business.status,photoBytes:bytes.length},null,2));
