import { router, json, error, ai, db, increment, requireAuth } from '@appdeploy/sdk';

type AdviceInput = { mode?: unknown; question?: unknown; lang?: unknown; consent?: unknown };
const roles = ['buyer', 'import', 'dealer'] as const;
const rules: Record<string,string> = {
 buyer: 'Buyer adviser: return likely risk points, exact questions to ask seller, which documents to request and safe next steps.',
 import: 'Import case adviser: flag missing inputs for country-specific customs and VAT; never calculate actual taxes without verified origin, valuation and destination. Give checklist of documents and official verification steps.',
 dealer: 'B2B sourcing adviser: refine RFQ specification, supplier due diligence, commercial risks and delivery terms. Never invent vehicle stock, prices, sellers or bids.'
};
type VehicleCase = {
 type:string; vehicle:string; destination:string; budget:number|null;
 listing:string; notes:string; status:'saved_not_submitted'; createdAt:string;
};
const caseTypes = ['sourcing','inspection','import','dealer','exclusive','auction_interest'];
const destinations = ['Srbija','Nemačka','BiH','Crna Gora','Hrvatska','Slovenija','Drugo'];
function privateTable(userId:string):string {
  // Auth SDK provides a verified UUID userId, never a caller-supplied identifier.
  const key=userId.replace(/-/g,'');
  if(!/^[A-Za-z0-9]{20,80}$/.test(key)) throw new Error('Invalid authenticated user identifier');
  return 'autodanini_cases_'+key;
}
function checkVehicleRequest(input:unknown): VehicleCase | null {
 if(!input || typeof input!=='object' || Array.isArray(input))return null;
 const record=input as Record<string,unknown>;
 const text=(k:string,max:number)=>typeof record[k]==='string'?record[k].trim().slice(0,max+1):'';
 const type=text('type',40),vehicle=text('vehicle',120),destination=text('destination',50);
 const listing=text('listing',500),notes=text('notes',800);
 const budget=record.budget;
 if(record.consent!==true || !caseTypes.includes(type) || vehicle.length<3 || vehicle.length>120 ||
    !destinations.includes(destination) || notes.length>800 || listing.length>500)return null;
 if(budget!==null && (typeof budget!=='number'||!Number.isFinite(budget)||budget<1||budget>1000000))return null;
 if(listing) {
  try {const url=new URL(listing);if(url.protocol!=='https:' || !url.hostname.includes('.'))return null;}
  catch(_error){return null;}
 }
 return {type,vehicle,destination,budget:budget===null?null:budget as number,
  listing,notes,status:'saved_not_submitted',createdAt:new Date().toISOString()};
}

import { adminRoutes } from './admin';
export const handler = router({
  ...adminRoutes,

 'GET /api/my-profile': [requireAuth(), async (ctx) => {
   // Never return a different user account based on a supplied ID.
   return json({userId:ctx.user!.userId,name:ctx.user!.name||'',email:ctx.user!.email||''});
 }],
 'GET /api/my-cases': [requireAuth(), async (ctx) => {
   const table=privateTable(ctx.user!.userId);
   const page=await db.list<VehicleCase>(table,{limit:21});
   return json({cases:page.items,hasMore:Boolean(page.nextToken)});
 }],
 'POST /api/my-cases': [requireAuth(), async (ctx) => {
   const vehicleCase=checkVehicleRequest(ctx.body);
   if(!vehicleCase)return error('Invalid request fields or consent missing',400);
   const table=privateTable(ctx.user!.userId);
   const list=await db.list<VehicleCase>(table,{limit:21});
   // Pilot hard cap on saved requests; this is not a credit/payment quota.
   if(list.items.length>=20 || list.nextToken)return error('Saved request limit reached (20)',429);
   const [id]=await db.add(table,[vehicleCase]);
   if(!id)return error('Could not persist request',503);
   return json({id,saved:true,submitted:false},201);
 }],
 'DELETE /api/my-cases/:id': [requireAuth(), async (ctx) => {
   const id=ctx.params.id;
   if(typeof id!=='string' || id.length<6 || id.length>128 || !/^[A-Za-z0-9_-]+$/.test(id))return error('Invalid case ID',400);
   const table=privateTable(ctx.user!.userId);
   const [removed]=await db.delete(table,[id]);
   if(!removed)return error('Case not found',404);
   return json({deleted:true,id});
 }],

 'GET /api/_healthcheck': [async () => json({ ok: true, service: 'autodanini-ai-advisor' })],
 'POST /api/advice': [async ({ body }) => {
   const input = (body || {}) as AdviceInput;
   if (input.consent !== true) return error('Consent required', 400);
   if (typeof input.mode !== 'string' || !roles.includes(input.mode as typeof roles[number])) return error('Invalid advisory mode', 400);
   if (typeof input.question !== 'string' || input.question.length < 30 || input.question.length > 1000) return error('Description must be between 30 and 1000 characters', 400);
   const question = input.question.trim();
   if (/\b(?:\+?\d[\d ()-]{9,}|[A-Z0-9]{17}|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})\b/i.test(question)) return error('Do not submit phone, email or VIN; remove personal identifiers', 400);
   const mode = input.mode;
   const language = input.lang === 'de' ? 'German' : 'Serbian Latin';
   const dateId = 'd' + new Date().toISOString().slice(0,10).replace(/-/g,'');
   const monthId = 'm' + new Date().toISOString().slice(0,7).replace(/-/g,'');
   try {
      await db.tx.add('ai_usage_daily',[{id:dateId,count:0}]);
      await db.tx.add('ai_usage_monthly',[{id:monthId,count:0}]);
      const [daily,monthly] = await Promise.all([
       db.get<{count?:number}>('ai_usage_daily',[dateId],{consistent:true}),
       db.get<{count?:number}>('ai_usage_monthly',[monthId],{consistent:true})
      ]);
      const d=daily[0]?.count, m=monthly[0]?.count;
      if (!Number.isSafeInteger(d) || !Number.isSafeInteger(m)) return error('Quota unavailable',503);
      if ((d as number)>=20 || (m as number)>=400) return error('AI pilot usage limit reached',429);
      const du=db.tx.update('ai_usage_daily',[{id:dateId,record:{count:increment(1)},if:{count:d}}],{patch:true});
      const mu=db.tx.update('ai_usage_monthly',[{id:monthId,record:{count:increment(1)},if:{count:m}}],{patch:true});
      const [dr,mr]=await db.transact([du,mu]);
      if (!dr[0] || !mr[0]) return error('Quota conflict',429);
   } catch (_err) { return error('AI quota service unavailable',503); }
   try {
      const result = await ai.generate({
       system: 'You are AutoDanini AI, a cautious vehicle-purchase and independent inspection assistant. Respond in ' + language + '. This is preliminary guidance, not live market verification, not legal or technical certification. You have NO web, VIN, listing, pricing database or ADAC partner access. Base output ONLY on the user-provided description. Never invent inventory, partners, actual customs taxes, defect evidence, guarantees, auction offers or completed inspections. Clearly separate known, unknown and required verification. Be concise, organized and actionable. Do not ask for personal identifiers. '+ rules[mode],
       prompt: 'Mode: ' + mode + '\nVehicle/case description: ' + question + '\nReturn: short overview, 4-6 concrete risk questions, specific documents or inspections to request, then 2 clear next actions. No made-up prices or invented certainty.',
       thinkingMode: 'FAST', maxTokens: 560, temperature: 0.25
      });
      return json({ answer: result.text, mode, advisory: true });
   } catch (_err) { return error('AI unavailable, please try later',503); }
 }]
});