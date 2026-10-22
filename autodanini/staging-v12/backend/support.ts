import {db,json,error,requireAuth,requireAdminEmailAllowlist} from '@appdeploy/sdk';
import type {RouterRoutes} from '@appdeploy/sdk';
import {randomUUID} from 'node:crypto';

// DEVELOPMENT ONLY: deny all admin access until owner confirms the authenticated email.
const ADMIN_EMAILS: string[] = [];
const inbox = 'autodanini_support_inbox_v1';
type Ticket = {id:string;userId:string;email:string;category:string;subject:string;description:string;status:string;createdAt:string;updatedAt:string;reply:string};
const categories=['account','analysis','listing','inspection','other'];
const statuses=['new','in_progress','waiting_on_user','resolved','closed'];
function ownTable(userId:string){
 const key=userId.replace(/-/g,'');
 if(!/^[A-Za-z0-9]{20,80}$/.test(key))throw new Error('Invalid user ID');
 return 'autodanini_support_user_'+key;
}
function validId(value:unknown):value is string{
 return typeof value==='string'&&/^t_[a-f0-9]{32}$/.test(value);
}
export const supportRoutes:RouterRoutes={
 'POST /api/support/tickets':[requireAuth(),async ctx=>{
  const body=(ctx.body||{}) as Record<string,unknown>;
  if(!categories.includes(String(body.category))||typeof body.subject!=='string'||body.subject.trim().length<5||
    body.subject.length>120||typeof body.description!=='string'||body.description.trim().length<15||
    body.description.length>2000) return error('Invalid support request',400);
  const ownerId=ctx.user!.userId;
  const page=await db.list<Ticket>(ownTable(ownerId),{limit:21});
  if(page.items.length>=20||page.nextToken)return error('Too many open support cases',429);
  const id='t_'+randomUUID().replace(/-/g,'');
  const now=new Date().toISOString();
  const ticket:Ticket={id,userId:ownerId,email:ctx.user!.email||'',category:String(body.category),
    subject:body.subject.trim(),description:body.description.trim(),status:'new',reply:'',createdAt:now,updatedAt:now};
  // Both user copy and admin inbox are created atomically, preventing orphan support records.
  try {
   const [mine,submitted]=await db.transact([
    db.tx.add(ownTable(ownerId),[ticket]),
    db.tx.add(inbox,[ticket])
   ]);
   if(!mine[0]||!submitted[0])return error('Ticket not confirmed',503);
   return json({id,status:'new'},201);
  }catch{ return error('Ticket not confirmed; contact support if problem persists',503); }
 }],
 'GET /api/support/tickets':[requireAuth(),async ctx=>{
  const page=await db.list<Ticket>(ownTable(ctx.user!.userId),{limit:20});
  return json({tickets:page.items.map(t=>({id:t.id,category:t.category,subject:t.subject,
   description:t.description,status:t.status,createdAt:t.createdAt,reply:t.reply})),
   hasMore:Boolean(page.nextToken)});
 }],
 'GET /api/admin/support':[requireAuth(),requireAdminEmailAllowlist(ADMIN_EMAILS),async ctx=>{
  const page=await db.list<Ticket>(inbox,{limit:20,nextToken:ctx.query.nextToken||undefined});
  return json({tickets:page.items,nextToken:page.nextToken||null});
 }]
};