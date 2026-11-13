/** Safe, clearly labelled NON-AI listing text extraction.
 * Never fetch third-party URLs: listing-site consent and SSRF safety take precedence.
 * AI activation requires separate reviewed provider binding and spending approval.
 */
const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'};
const json=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers});
const allowed=['daninihub.com','www.daninihub.com'];
const question={
 de:['Ist die FIN mit Fahrzeugbrief und Fahrzeug abgleichbar?','Gibt es Servicebelege und dokumentierte Kilometerstände?','Sind Unfallschäden und Reparaturen schriftlich dokumentiert?','Kann eine unabhängige Prüfung vor dem Kauf stattfinden?'],
 sr:['Da li se VIN poklapa na vozilu i u dokumentima?','Postoje li servisni računi i dokaz o kilometraži?','Da li su oštećenja i popravke dokumentovani?','Može li nezavisan pregled pre kupovine?']
};
function extract(text){
 const match=(re)=>text.match(re)?.[1]?.trim()||null;
 const price=match(/(?:€\s*|EUR\s*)([\d.,\s]{3,14})\b|/i); // overwritten by two unambiguous alternatives
 const rawPrice=match(/(?:€|EUR)\s*([\d.,]{3,14})\b/i)||match(/\b([\d.,]{3,14})\s*(?:€|EUR)\b/i);
 const km=match(/\b([\d.,]{2,12})\s*km\b/i);
 const year=match(/(?:baujahr|erstzulassung|ez|godište|godina|year)\s*[:\-]?\s*((?:19|20)\d{2})\b/i);
 const fuel=match(/\b(diesel|benzin|benziner|petrol|hybrid|elektro|electric|elektrisch|dizel|plin|gas)\b/i);
 const gearbox=match(/\b(automatik|automatikgetriebe|automatic|manuel|schaltgetriebe|manual|automatski|ručni)\b/i);
 const brands=['Volkswagen','VW','Audi','BMW','Mercedes','Opel','Ford','Škoda','Skoda','Toyota','Renault','Peugeot','Citroen','Citroën','Fiat','Hyundai','Kia','Seat','Volvo','Mazda','Nissan','Honda','Tesla','Dacia'];
 const brand=brands.find(b=>new RegExp('\\b'+b+'\\b','i').test(text))||null;
 const vin=match(/\b([A-HJ-NPR-Z0-9]{17})\b/i);
 return {brand,model:null,year:year?Number(year):null,mileageKm:km?Number(km.replace(/[^0-9]/g,'')):null,priceEur:rawPrice?Number(rawPrice.replace(/[^0-9]/g,'')):null,fuel,gearbox,engine:null,equipment:null,location:null,vinClaim:vin,description:text.slice(0,1500)};
}
function normalizeFields(fields){
 if(fields.year && (fields.year<1950||fields.year>new Date().getUTCFullYear()+1))fields.year=null;
 if(fields.priceEur && (fields.priceEur>10000000||fields.priceEur<100))fields.priceEur=null;
 if(fields.mileageKm && fields.mileageKm>3000000)fields.mileageKm=null;
 return fields;
}
export async function handleVehicleAnalysis(request,env={}){
 if(request.method!=='POST')return json({error:'method_not_allowed'},405);
 if(!allowed.map(h=>'https://'+h).includes(request.headers.get('origin')))return json({error:'invalid_origin'},403);
 if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type')||''))return json({error:'invalid_type'},415);
 if(Number(request.headers.get('content-length')||0)>16000)return json({error:'too_large'},413);
 let body;
 try{const raw=await request.text();if(raw.length>16000)return json({error:'too_large'},413);body=JSON.parse(raw);}
 catch{return json({error:'invalid_json'},400);}
 if(!body||typeof body!=='object'||Array.isArray(body))return json({error:'invalid_fields'},400);
 const language=body.language==='de'?'de':body.language==='sr'?'sr':null;
 const source=typeof body.source==='string'?body.source.trim():'';
 if(!language||source.length>12000)return json({error:'invalid_fields'},400);
 if(/^https?:\/\//i.test(source)){
  let url;try{url=new URL(source)}catch{return json({error:'invalid_url'},400)}
  if(url.protocol!=='https:'||url.username||url.password)return json({error:'invalid_url'},400);
  // URL is never fetched or dereferenced. This prevents SSRF and unauthorized scraping.
  return json({error:'text_required',message:language==='de'?'Bitte den öffentlich sichtbaren Inseratstext kopieren und hier einfügen.':'Kopirajte javno vidljiv tekst oglasa i nalepite ga ovde.'},422);
 }
 if(source.length<80)return json({error:'text_too_short'},422);
 if(!env.DANINI_TURNSTILE_SECRET)return json({error:'verification_unavailable'},503);
 const token=typeof body.turnstileToken==='string'?body.turnstileToken:'';
 if(token.length<10||token.length>2048)return json({error:'human_verification_required'},403);
 try{
  const form=new FormData();form.set('secret',env.DANINI_TURNSTILE_SECRET);form.set('response',token);
  const verified=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form,signal:AbortSignal.timeout(8000)});
  if(!verified.ok)return json({error:'human_verification_failed'},403);
  const check=await verified.json();
  if(check.success!==true||!allowed.includes(check.hostname))return json({error:'human_verification_failed'},403);
 }catch{return json({error:'verification_unavailable'},503)}
 // Conservative best-effort abuse protection. Cloudflare edge WAF remains recommended.
 if(!env.PARTNERS || typeof env.PARTNERS.get!=='function'||typeof env.PARTNERS.put!=='function')return json({error:'rate_limit_unavailable'},503);
 const ip=request.headers.get('cf-connecting-ip');
 if(!ip)return json({error:'rate_limit_unavailable'},503);
 try{
  const keyData=new TextEncoder().encode(ip+'|'+new Date().toISOString().slice(0,13));
  const digest=await crypto.subtle.digest('SHA-256',keyData);
  const key='vehicle-analysis-rate:'+Array.from(new Uint8Array(digest)).map(v=>v.toString(16).padStart(2,'0')).join('');
  const count=Number(await env.PARTNERS.get(key)||0);
  if(count>=5)return json({error:'rate_limited'},429);
  await env.PARTNERS.put(key,String(count+1),{expirationTtl:3600});
 }catch{return json({error:'rate_limit_unavailable'},503)}
 const fields=normalizeFields(extract(source));
 const missing=Object.entries({brand:fields.brand,model:fields.model,year:fields.year,mileageKm:fields.mileageKm,priceEur:fields.priceEur,fuel:fields.fuel,gearbox:fields.gearbox}).filter(([,v])=>v==null).map(([k])=>k);
 const warnings=[];
 if(/unfallfrei|bez udesa/i.test(source))warnings.push(language==='de'?'Unfallfreiheit wird behauptet, aber nicht unabhängig belegt.':'Tvrdi se da vozilo nije imalo udes, ali to nije nezavisno potvrđeno.');
 if(/scheckheftgepflegt|servisna knjiga/i.test(source))warnings.push(language==='de'?'Servicehistorie wird behauptet; Belege anfordern.':'Servisna istorija se tvrdi; tražite dokumentaciju.');
 return json({status:'preliminary',method:'rule_based_text_extraction',aiUsed:false,sourceType:'user_supplied_text',fields,missing,warnings,questions:question[language],independentVerificationRequired:true,disclaimer:language==='de'?'Automatische Texterkennung, KEINE KI-Analyse, keine Fahrzeugbewertung oder unabhängige Prüfung.':'Automatsko izdvajanje iz teksta, NIJE AI analiza, procena vrednosti niti nezavisna provera.'});
}
