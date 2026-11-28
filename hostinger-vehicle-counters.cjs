'use strict';
// Deliberately narrow adapter for the existing vehicle handler's get/check/put
// counter protocol. Reserve atomically on get, before any inference; put is only
// an acknowledgement. Not a general-purpose KV implementation or listing cache.
function createVehicleCounters(pool){
 const rules=[
  [/^vehicle-analysis-rate:[a-f0-9]{64}$/,5,3600],
  [/^vehicle-ai-daily:\d{4}-\d{2}-\d{2}$/,20,90000],
  [/^vehicle-vision-daily:\d{4}-\d{2}-\d{2}$/,6,90000]
 ];
 function rule(key){
  const found=typeof key==='string'&&rules.find(([pattern])=>pattern.test(key));
  if(!found)throw Error('vehicle_counter_not_allowed');
  return found;
 }
 return {
  async get(key){
   const [,limit,ttl]=rule(key);
   const now=Math.floor(Date.now()/1000);
   const conn=await pool.getConnection();
   try{
    await conn.beginTransaction();
    await conn.execute('INSERT IGNORE INTO danini_ai_daily_quota (bucket,used,expires_at) VALUES (?,0,?)',[key,now+ttl]);
    await conn.execute('UPDATE danini_ai_daily_quota SET used=0, expires_at=? WHERE bucket=? AND expires_at<=?',[now+ttl,key,now]);
    const [updated]=await conn.execute('UPDATE danini_ai_daily_quota SET used=used+1 WHERE bucket=? AND used<?',[key,limit]);
    const [rows]=await conn.execute('SELECT used FROM danini_ai_daily_quota WHERE bucket=?',[key]);
    const used=Number(rows[0]?.used);
    if(!Number.isInteger(used)||used<0||used>limit)throw Error('vehicle_counter_invalid');
    await conn.commit();
    return String(updated.affectedRows===1?used-1:limit);
   }catch(e){await conn.rollback();throw e;}finally{conn.release();}
  },
  async put(key,value,options){
   const [,limit,ttl]=rule(key);
   if(!/^\d+$/.test(value)||Number(value)<1||Number(value)>limit||options?.expirationTtl!==ttl)throw Error('vehicle_counter_invalid');
   // The slot has already been durably reserved. No second write or refund.
  }
 };
}
module.exports={createVehicleCounters};
