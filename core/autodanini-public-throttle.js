'use strict';
/**
 * Conservative, per-process abuse throttle for PUBLIC endpoints.
 * A supplemental safeguard, NOT a replacement for database-backed global
 * quotas or a CDN/WAF. Behind a reverse proxy, Express trust proxy must
 * specify verified proxy CIDRs; never trust arbitrary X-Forwarded-For.
 */
function createPublicThrottle({max,windowMs,scope,maxEntries=20000,clock=Date.now}={}){
  if(!Number.isSafeInteger(max)||max<1||!Number.isSafeInteger(windowMs)||windowMs<1000||
     typeof scope!=='string'||!/^[a-z0-9_-]{1,40}$/.test(scope))throw new Error('INVALID_THROTTLE_CONFIG');
  const buckets=new Map();
  function throttle(req,res,next){
    const now=clock();
    const ip=String(req.ip||req.socket?.remoteAddress||'unknown').slice(0,160);
    const key=scope+':'+ip;
    let b=buckets.get(key);
    if(!b||now>=b.start+windowMs)b={start:now,count:0};
    if(b.count>=max){
      res.set('Retry-After',String(Math.max(1,Math.ceil((b.start+windowMs-now)/1000))));
      return res.status(429).json({ok:false,error:'RATE_LIMITED'});
    }
    b.count++;
    buckets.set(key,b);
    if(buckets.size>maxEntries){
      for(const [k,v] of buckets){
        if(now>=v.start+windowMs)buckets.delete(k);
      }
      // Bounded worst-case memory if many unique addresses flood the app.
      while(buckets.size>maxEntries)buckets.delete(buckets.keys().next().value);
    }
    return next();
  }
  return throttle;
}
module.exports={createPublicThrottle};
