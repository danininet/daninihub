const base='https://daninihub.com';
const paths=['/buyers','/dealers','/live','/inspection','/guides','/business','/import','/selbstimport','/uvoz-vodic','/about','/tender','/exclusive'];
const errors=[];
const records=[];
for (const path of paths) {
  try {
    const r=await fetch(base+path,{signal:AbortSignal.timeout(13000),redirect:'follow'});
    const html=await r.text();
    const oldLinks=[...html.matchAll(/<a\b[^>]*href=["']\/?auctions(?:\.html)?(?:[?#][^"']*)?["'][^>]*>/gi)];
    const hasOldBadge=html.includes('Aukcije — u pripremi')||html.includes('Auktionen — geplant');
    records.push({path,status:r.status,oldLinks:oldLinks.length,oldBadge:hasOldBadge});
    if(r.status!==200||oldLinks.length||hasOldBadge)errors.push(path+' '+r.status+' links '+oldLinks.length+' badge '+hasOldBadge);
    if(path==='/business') {
      if(!html.includes('id="dn-business-modern"'))errors.push('Business new layout absent');
      if(!html.includes('dn-service-header'))errors.push('Business shared header absent');
      if(!html.includes('DANINI_Kartica_06_B2B_Sourcing_I_Preuzimanje.jpg'))errors.push('Business hero image absent');
    }
  }catch(error){errors.push(path+': '+String(error))}
}
console.log('DANINI_UNFINISHED_NAV_AUDIT',JSON.stringify({records,errors},null,2));
if(errors.length)process.exitCode=1;
