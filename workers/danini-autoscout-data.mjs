/**
 * Single-ad adapter. Disabled until the owner confirms data-use permission
 * and browser-rendering spend approval. Never fetch arbitrary user URLs.
 */
const text=(v,n=180)=>typeof v==='string'?v.trim().slice(0,n):null;
const number=(v,max)=>{const raw=String(v||'').replace(/[.]/g,'').replace(',','.');const n=Number(raw);return Number.isFinite(n)&&n>0&&n<=max?n:null;};
const field=(body,name)=>{
 const parts=body.split('\n').map(s=>s.trim());
 const pos=parts.findIndex(x=>x.toLowerCase()===name.toLowerCase());
 return pos<0?null:text(parts.slice(pos+1).find(Boolean)||'');
};
export function canonicalAutoScoutUrl(raw){
 try{
  const u=new URL(raw);
  if(u.protocol!=='https:'||u.username||u.password||u.port)return null;
  if(!['www.autoscout24.de','autoscout24.de'].includes(u.hostname.toLowerCase()))return null;
  if(!/^\/angebote\/[a-z0-9-]{10,230}-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\/?$/i.test(u.pathname))return null;
  return 'https://www.autoscout24.de'+u.pathname.replace(/\/$/,'');
 }catch{return null}
}
export function parseAutoScoutMarkdown(body){
 if(typeof body!=='string'||body.length<400||body.length>300000)return null;
 const title=text(body.match(/^title:\s*"([^"\n]+)"/mi)?.[1],240);
 if(!title||!/\b(?:Audi|BMW|Volkswagen|Mercedes|Škoda|Skoda|Opel|Ford|Toyota|Hyundai|Kia|Volvo|Renault|Peugeot|Seat|Mazda|Fiat|Nissan|Porsche|Tesla|Dacia)\b/i.test(title))return null;
 const priceRaw=title.match(/(?:€|EUR)\s*([\d.,]+)/i)?.[1];
 const priceEur=number(priceRaw,10000000);
 const kmRaw=field(body,'Kilometerstand')?.match(/([\d.,]+)\s*km/i)?.[1];
 const mileageKm=number(kmRaw,3000000);
 const registration=field(body,'Erstzulassung');
 const year=registration?.match(/\b(20\d{2}|19\d{2})\b/)?.[1];
 const history=body.match(/## Fahrzeughistorie([\s\S]{0,3500}?)(?:\n## |$)/i)?.[1]||'';
 const accident=field(history,'Fahrzeugzustand');
 const repaired=accident==='Unfallfahrzeug'&&/\bRepariert\b/i.test(history);
 const fuel=field(body,'Kraftstoff'),gearbox=field(body,'Getriebe');
 if(!priceEur&&!mileageKm&&!year)return null;
 const brand=title.match(/\b(Audi|BMW|Volkswagen|Mercedes|Škoda|Skoda|Opel|Ford|Toyota|Hyundai|Kia|Volvo|Renault|Peugeot|Seat|Mazda|Fiat|Nissan|Porsche|Tesla|Dacia)\b/i)?.[1]||null;
 const model=brand?text(title.match(new RegExp(brand+'\\s+([^\\s]+(?:\\s+allroad)?)','i'))?.[1],90):null;
 return {title,fields:{brand,model,year:year?Number(year):null,mileageKm,priceEur,fuel,gearbox},accidentRepaired:repaired,
   warnings:accident==='Unfallfahrzeug'?['accident_reported']:[],
   sourceExcerpt:[title,priceEur&&priceEur+' EUR',mileageKm&&mileageKm+' km',registration,fuel,gearbox,accident,repaired&&'Repariert'].filter(Boolean).join('; ').slice(0,1500)};
}
export async function readPermittedAutoScoutAd(url,env){
 const canonical=canonicalAutoScoutUrl(url.href);
 if(!canonical)return {status:'unsupported'};
 if(env.DANINI_AUTOSCOUT24_DATA_PERMISSION!=='true')return {status:'permission_required'};
 if(env.DANINI_BROWSER_RENDERING_COST_APPROVED!=='true')return {status:'budget_not_approved'};
 if(!env.BROWSER?.quickAction||!env.PARTNERS?.get||!env.PARTNERS?.put)return {status:'not_configured'};
 const cacheKey='as24:single:'+canonical.split('/').pop();
 try{
  const cached=await env.PARTNERS.get(cacheKey);
  if(cached){const record=JSON.parse(cached);if(record?.fields)return {status:'ok',record,cache:true};}
  const quota='as24:browser:'+new Date().toISOString().slice(0,10);
  const used=Number(await env.PARTNERS.get(quota)||0);
  if(used>=8)return {status:'daily_limit'};
  // Best-effort KV daily cap, not a hard billing cap.
  await env.PARTNERS.put(quota,String(used+1),{expirationTtl:90000});
  const response=await env.BROWSER.quickAction('markdown',{url:canonical,actionTimeout:12000});
  if(!response?.ok)return {status:'provider_unavailable'};
  const record=parseAutoScoutMarkdown(await response.text());
  if(!record)return {status:'unreadable'};
  await env.PARTNERS.put(cacheKey,JSON.stringify(record),{expirationTtl:21600});
  return {status:'ok',record,cache:false};
 }catch{return {status:'provider_unavailable'}}
}
