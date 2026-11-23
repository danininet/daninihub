/**
 * DANINI contextual site helper. One light-weight assistant for public DE/SR
 * Academy, AutoDanini and DANINI Business forms, not an autonomous agent.
 *
 * Free local tips are in public/js/danini-site-assistant.js and use NO AI.
 * An explicitly requested answer shares the Academy's strict global 8/day
 * and per-IP 2/day D1 quota; no extra subscription, billing or AI provider.
 * No user form values are read automatically or persisted here.
 */
import {configured,verifyHuman,quota} from './danini-academy-ai.mjs';
const MODEL='@cf/meta/llama-3.1-8b-instruct-fast';
const categories=new Set(['academy','auto','business','general']);
const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer','x-frame-options':'DENY'};
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers});
const clean=(x,max)=>typeof x==='string'?x.replace(/[\u0000-\u001f]/g,' ').trim().slice(0,max):'';
const isOn=e=>e?.DANINI_SITE_ASSISTANT_ENABLED==='true'&&configured(e);
const common={
 sr:'Ti si DANINI pomoćnik za početnike na daninihub.com. Odgovaraš SAMO o korišćenju DANINI formulara, učenju u Akademiji, proveri oglasa pre puta/kapare i poslovnim upitima. Korisnik pita za uputstvo; nemaš pristup njegovim podacima, nalozima, stvarnom stanju vozila, porezu, kupovinama, tržištu ili nezavisnim izvorima. Ne govori da si proverio činjenice ili prikupio dokument. Za pravna, poreska, carinska pitanja ili naplatu objasni da je potrebna ljudska provera i predloži kontakt podrške. Ne obećavaj novac, tržišnu tražnju, povraćaj novca niti aktivnu naplatu. Nikad ne traži lozinke, OTP, kartice ni identifikaciona dokumenta. Vrati samo JSON: {"answer":"jasna pomoć do 4 rečenice","nextStep":"jedna sledeća radnja","requiresHuman":false}. Razlikuj činjenice u interfejsu od opštih saveta.',
 de:'Du bist die DANINI-Hilfe für Einsteiger auf daninihub.com. Antworte NUR zu DANINI-Formularen, Akademie-Lernschritten, der Vorbereitung einer Fahrzeug-Inseratsprüfung oder Geschäftsanfragen. Du hast keinen Zugriff auf Kundendaten, Konten, Fahrzeugregister, Steuern, Bestellungen, Marktrecherchen oder externe Quellen. Behaupte keine unabhängige Prüfung. Bei Recht, Steuern, Zoll, Zahlungen oder Erstattungen weise auf menschliche Klärung und den Support hin. Keine Erfolgs-, Umsatz-, Nachfrage- oder Preisgarantie. Niemals Passwörter, OTPs, Karten- oder Ausweisdaten anfordern. Antworte ausschließlich mit JSON: {"answer":"verständliche Antwort in höchstens vier Sätzen","nextStep":"ein sinnvoller nächster Schritt","requiresHuman":false}.'
};
const scopes={
 academy:{sr:'Online Business Builder: šest koraka su ciljna grupa i problem, provera pretpostavki, obim ponude, početna stranica, tok upita i prvi test. Korisnik unosi svoja saznanja; AI predlaže pitanja, ne potvrđuje potražnju. Lokalni TXT/JSON/PDF izvoz ne zahteva nalog. Privatni nalozi i plaćeni paketi nisu javno aktivni.',de:'Online Business Builder: sechs Schritte: Kundengruppe/Problem, Annahmen, Angebot, Online-Auftritt, Anfragenablauf, erster Validierungstest. KI gibt Rückfragen, bestätigt keine Nachfrage. Lokaler TXT-/JSON-/PDF-Export benötigt kein Konto. Private Konten und bezahlte Pakete sind nicht öffentlich freigeschaltet.'},
 auto:{sr:'AutoDanini: korisnik može uneti link ili prepis oglasa, mjesto vozila i svoje pitanje; URL sam po sebi ne potvrđuje oglas. Rezultat razlikuje tvrdnje prodavca od priloženih dokaza. Nema automatske VIN, vlasničke ili fizičke provere; kaparu ne savetovati bez odgovarajuće dokumentacije.',de:'AutoDanini: Inseratslink oder kopierten Text und eigene Fragen eingeben; ein Link ist keine belegte Inseratsprüfung. Verkäuferangaben werden von vorhandenen Belegen getrennt. Keine automatische FIN-, Eigentums- oder technische Prüfung; vor einer Anzahlung fehlen oft Belege.'},
 business:{sr:'DANINI Business: navedite konkretan administrativni problem, postojeći tok, tržište i očekivan rezultat. Upit nije plaćena narudžbina. AI može pomoći da sastavite nacrt, ali slanje trećim licima i ponude zahtevaju ljudsko odobrenje.',de:'DANINI Business: konkreten Verwaltungsschritt, Ausgangslage, Markt und gewünschtes Ergebnis nennen. Eine Anfrage ist keine kostenpflichtige Bestellung. KI kann einen Entwurf vorbereiten; Kontakte mit Dritten und Angebote erfordern menschliche Freigabe.'},
 general:{sr:'DANINI obuhvata AutoDanini, DANINI Business i besplatni Academy Builder. Plaćene usluge se posebno ugovaraju; javnu automatsku kupovinu ne predstavljaj kao dostupnu.',de:'DANINI umfasst AutoDanini, DANINI Business und den kostenlosen Academy Builder. Bezahlte Leistungen werden separat vereinbart; behaupte keine aktivierte öffentliche Zahlung.'}
};
function parse(value){
 let p=typeof value==='string'?value:value?.response??value?.choices?.[0]?.message?.content;
 if(p&&typeof p==='object'&&!Array.isArray(p))return p;
 if(typeof p!=='string')return null;
 try{return JSON.parse(p)}catch{}
 const i=p.indexOf('{'),j=p.lastIndexOf('}');
 if(i<0||j<=i)return null;try{return JSON.parse(p.slice(i,j+1))}catch{return null}
}
function checked(raw){
 const p=parse(raw);if(!p||typeof p!=='object'||Array.isArray(p))return null;
 if(typeof p.answer!=='string'||typeof p.nextStep!=='string')return null;
 const answer=clean(p.answer,950),nextStep=clean(p.nextStep,300);
 if(answer.length<18||nextStep.length<8)return null;
 return {answer,nextStep,requiresHuman:p.requiresHuman===true,unverified:true};
}
export async function siteAssistantRoute(request,env={}){
 const path=new URL(request.url).pathname;
 if(path==='/api/assistant/status'){
  if(request.method!=='GET')return json({error:'method_not_allowed'},405);
  return json({enabled:isOn(env),siteKey:isOn(env)?env.DANINI_TURNSTILE_SITEKEY:null,limit:'Shared Academy AI daily quota; local guides remain available without AI.'});
 }
 if(path!=='/api/assistant/ask')return json({error:'not_found'},404);
 if(request.method!=='POST')return json({error:'method_not_allowed'},405);
 if(!isOn(env))return json({error:'assistant_disabled'},503);
 if(!['https://daninihub.com','https://www.daninihub.com'].includes(request.headers.get('origin')))return json({error:'invalid_origin'},403);
 if(!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')||''))return json({error:'invalid_type'},415);
 if(Number(request.headers.get('content-length')||0)>1800)return json({error:'too_large'},413);
 let data;try{const text=await request.text();if(new TextEncoder().encode(text).length>1800)return json({error:'too_large'},413);data=JSON.parse(text)}catch{return json({error:'invalid_json'},400)}
 if(!data||typeof data!=='object'||Array.isArray(data)||!['de','sr'].includes(data.language)||!categories.has(data.context)||
   typeof data.question!=='string'||data.question.length>420||clean(data.question,420).length<8||
   typeof data.field!=='string'||data.field.length>65||
   typeof data.turnstileToken!=='string'||data.turnstileToken.length<10||data.turnstileToken.length>2048)return json({error:'invalid_fields'},400);
 if(!await verifyHuman(request,env,data.turnstileToken,'danini-assistant'))return json({error:'human_verification_failed'},403);
 const ip=request.headers.get('cf-connecting-ip');const budget=await quota(env,ip);
 if(budget==='limited')return json({error:'assistant_daily_limit'},429);
 if(budget!=='ok')return json({error:'assistant_quota_unavailable'},503);
 const lang=data.language;let ai;
 try{ai=await env.AI.run(MODEL,{messages:[
  {role:'system',content:common[lang]+' '+scopes[data.context][lang]},
  {role:'user',content:JSON.stringify({language:lang,context:data.context,formFieldLabel:clean(data.field,65),userQuestion:clean(data.question,420)})}
 ],max_tokens:280,temperature:0})}catch{return json({error:'assistant_provider_unavailable'},503)}
 const result=checked(ai);
 if(!result)return json({error:'assistant_invalid_output'},502);
 return json({aiUsed:true,...result});
}
