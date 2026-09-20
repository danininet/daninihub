'use strict';

const Stripe=require('stripe');

function clean(value,max=4000){return String(value||'').trim().slice(0,max)}
function cents(value){const n=Number(value);if(!Number.isFinite(n)||n<=0)throw new Error('INVALID_AMOUNT');return Math.round(n)}
function paypalBase(){
  return String(process.env.PAYPAL_ENV||'sandbox').toLowerCase()==='live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}
async function paypalToken(){
  const id=process.env.PAYPAL_CLIENT_ID;
  const secret=process.env.PAYPAL_CLIENT_SECRET;
  if(!id||!secret)throw new Error('PAYPAL_NOT_CONFIGURED');
  const auth=Buffer.from(id+':'+secret).toString('base64');
  const r=await fetch(paypalBase()+'/v1/oauth2/token',{
    method:'POST',
    headers:{Authorization:'Basic '+auth,'Content-Type':'application/x-www-form-urlencoded'},
    body:'grant_type=client_credentials'
  });
  if(!r.ok)throw new Error('PAYPAL_TOKEN_FAILED');
  return (await r.json()).access_token;
}
async function paypal(path,options={}){
  const token=await paypalToken();
  const r=await fetch(paypalBase()+path,{
    ...options,
    headers:{Authorization:'Bearer '+token,'Content-Type':'application/json','PayPal-Request-Id':options.requestId||undefined,...(options.headers||{})}
  });
  const body=await r.json().catch(()=>({}));
  if(!r.ok){
    const error=new Error('PAYPAL_API_FAILED');
    error.details=body;
    throw error;
  }
  return body;
}
function stripeClient(){
  if(!process.env.STRIPE_SECRET_KEY)throw new Error('STRIPE_NOT_CONFIGURED');
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}
async function createStripeHoldCheckout({origin,quoteRef,email,amountCents,currency='eur',description,language='de'}){
  const stripe=stripeClient();
  const session=await stripe.checkout.sessions.create({
    mode:'payment',
    customer_email:email||undefined,
    success_url:origin+'/payment/stripe/authorized?session_id={CHECKOUT_SESSION_ID}&quote='+encodeURIComponent(quoteRef),
    cancel_url:origin+'/'+language+'/?payment_cancelled=1#payment-protection',
    payment_intent_data:{
      capture_method:'manual',
      metadata:{system:'Danini ImportOS',quote_ref:quoteRef,payment_flow:'service_authorization'}
    },
    line_items:[{
      quantity:1,
      price_data:{
        currency,
        unit_amount:cents(amountCents),
        product_data:{name:'Danini Service Authorization',description:clean(description,240)}
      }
    }],
    metadata:{system:'Danini ImportOS',quote_ref:quoteRef,payment_flow:'service_authorization'}
  });
  return {provider:'stripe',checkoutUrl:session.url,sessionId:session.id};
}
async function getStripeAuthorization(sessionId){
  const stripe=stripeClient();
  const session=await stripe.checkout.sessions.retrieve(sessionId,{expand:['payment_intent.latest_charge']});
  const pi=session.payment_intent;
  if(!pi||typeof pi==='string')throw new Error('STRIPE_PAYMENT_INTENT_MISSING');
  const charge=pi.latest_charge&&typeof pi.latest_charge!=='string'?pi.latest_charge:null;
  const captureBefore=charge?.payment_method_details?.card?.capture_before||null;
  return {
    provider:'stripe',
    sessionId:session.id,
    paymentIntentId:pi.id,
    status:pi.status,
    amountCapturable:pi.amount_capturable,
    captureBefore
  };
}
async function captureStripe(paymentIntentId,amountCents){
  const stripe=stripeClient();
  const payload={};
  if(amountCents)payload.amount_to_capture=cents(amountCents);
  const pi=await stripe.paymentIntents.capture(paymentIntentId,payload);
  return {provider:'stripe',id:pi.id,status:pi.status,amountReceived:pi.amount_received};
}
async function cancelStripe(paymentIntentId){
  const stripe=stripeClient();
  const pi=await stripe.paymentIntents.cancel(paymentIntentId);
  return {provider:'stripe',id:pi.id,status:pi.status};
}
async function createPayPalAuthorizeOrder({origin,quoteRef,amountCents,currency='EUR',description,language='de'}){
  const value=(cents(amountCents)/100).toFixed(2);
  const data=await paypal('/v2/checkout/orders',{
    method:'POST',
    requestId:'quote-'+quoteRef+'-'+Date.now(),
    body:JSON.stringify({
      intent:'AUTHORIZE',
      purchase_units:[{
        reference_id:quoteRef,
        custom_id:quoteRef,
        description:clean(description,120),
        amount:{currency_code:String(currency).toUpperCase(),value}
      }],
      payment_source:{
        paypal:{
          experience_context:{
            brand_name:'DANINI',
            user_action:'CONTINUE',
            return_url:origin+'/payment/paypal/authorized?quote='+encodeURIComponent(quoteRef),
            cancel_url:origin+'/'+language+'/?payment_cancelled=1#payment-protection'
          }
        }
      }
    })
  });
  const approve=(data.links||[]).find(x=>x.rel==='payer-action'||x.rel==='approve')?.href;
  if(!approve)throw new Error('PAYPAL_APPROVAL_URL_MISSING');
  return {provider:'paypal',orderId:data.id,checkoutUrl:approve,status:data.status};
}
async function authorizePayPalOrder(orderId){
  const data=await paypal('/v2/checkout/orders/'+encodeURIComponent(orderId)+'/authorize',{
    method:'POST',
    requestId:'authorize-'+orderId+'-'+Date.now(),
    body:'{}'
  });
  const auth=data.purchase_units?.[0]?.payments?.authorizations?.[0];
  if(!auth)throw new Error('PAYPAL_AUTHORIZATION_MISSING');
  return {
    provider:'paypal',
    orderId:data.id,
    authorizationId:auth.id,
    status:auth.status,
    amount:auth.amount,
    expirationTime:auth.expiration_time||null
  };
}
async function capturePayPal(authorizationId,amount){
  const payload={final_capture:true};
  if(amount)payload.amount=amount;
  const data=await paypal('/v2/payments/authorizations/'+encodeURIComponent(authorizationId)+'/capture',{
    method:'POST',
    requestId:'capture-'+authorizationId+'-'+Date.now(),
    body:JSON.stringify(payload)
  });
  return {provider:'paypal',id:data.id,status:data.status,amount:data.amount};
}
async function voidPayPal(authorizationId){
  await paypal('/v2/payments/authorizations/'+encodeURIComponent(authorizationId)+'/void',{method:'POST',body:'{}'});
  return {provider:'paypal',id:authorizationId,status:'VOIDED'};
}
async function createPayPalPassportOrder({origin,reference,email,language='de'}){
  const data=await paypal('/v2/checkout/orders',{
    method:'POST',
    requestId:'passport-'+reference+'-'+Date.now(),
    body:JSON.stringify({
      intent:'CAPTURE',
      purchase_units:[{
        reference_id:reference,
        custom_id:reference,
        description:'Danini Import Passport',
        amount:{currency_code:'EUR',value:'9.90'}
      }],
      payment_source:{
        paypal:{
          experience_context:{
            brand_name:'DANINI',
            user_action:'PAY_NOW',
            return_url:origin+'/payment/paypal/passport?ref='+encodeURIComponent(reference),
            cancel_url:origin+'/'+language+'/?importos_cancelled=1#passport'
          }
        }
      }
    })
  });
  const approve=(data.links||[]).find(x=>x.rel==='payer-action'||x.rel==='approve')?.href;
  if(!approve)throw new Error('PAYPAL_APPROVAL_URL_MISSING');
  return {provider:'paypal',orderId:data.id,checkoutUrl:approve,status:data.status,email};
}
async function capturePayPalOrder(orderId){
  const data=await paypal('/v2/checkout/orders/'+encodeURIComponent(orderId)+'/capture',{
    method:'POST',
    requestId:'passport-capture-'+orderId+'-'+Date.now(),
    body:'{}'
  });
  const capture=data.purchase_units?.[0]?.payments?.captures?.[0];
  return {provider:'paypal',orderId:data.id,captureId:capture?.id||'',status:data.status,amount:capture?.amount||null};
}

module.exports={
  createStripeHoldCheckout,
  getStripeAuthorization,
  captureStripe,
  cancelStripe,
  createPayPalAuthorizeOrder,
  authorizePayPalOrder,
  capturePayPal,
  voidPayPal,
  createPayPalPassportOrder,
  capturePayPalOrder
};
