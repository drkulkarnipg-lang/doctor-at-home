'use strict';
const {env,safeEqualHex,hmac,db}=require('../server/razorpay-payments');
async function rawBody(req){
 if(Buffer.isBuffer(req.body))return req.body;
 if(typeof req.body==='string')return Buffer.from(req.body);
 if(req.body&&typeof req.body==='object')return Buffer.from(JSON.stringify(req.body));
 const chunks=[];let size=0;
 for await(const chunk of req){const part=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);size+=part.length;if(size>1024*1024)throw Error('Webhook payload too large.');chunks.push(part);}
 return Buffer.concat(chunks);
}
module.exports=async function(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).end('Use POST.');
 let c;try{c=env();}catch{return res.status(503).end('Webhook is not configured.');}
 let raw;try{raw=await rawBody(req);}catch{return res.status(413).end('Webhook payload is invalid or too large.');}
 const signature=String(req.headers['x-razorpay-signature']||''),eventId=String(req.headers['x-razorpay-event-id']||'');
 if(!safeEqualHex(hmac(c.RAZORPAY_WEBHOOK_SECRET,raw),signature)||!eventId||eventId.length>200)return res.status(400).end('Invalid webhook signature or event ID.');
 let event;try{event=JSON.parse(raw.toString('utf8'));}catch{return res.status(400).end('Invalid webhook payload.');}
 try{
  const prior=await db('consultation_payment_webhook_events?select=event_id&event_id=eq.'+encodeURIComponent(eventId)+'&limit=1');
  if(!prior.ok)throw Error();
  if(prior.data?.length)return res.status(200).json({received:true,duplicate:true});
  const type=String(event.event||''),entity=event.payload?.payment?.entity,refund=event.payload?.refund?.entity;
  let orderId=entity?.order_id||null,paymentId=entity?.id||refund?.payment_id||null,nextStatus=null;
  if(type==='payment.captured'&&entity?.amount===50000&&entity?.currency==='INR'&&entity?.status==='captured')nextStatus='captured';
  else if(type==='payment.failed'&&entity?.order_id&&entity?.amount===50000&&entity?.currency==='INR')nextStatus='failed';
  else if(type==='refund.processed'&&refund?.payment_id&&refund?.status==='processed')nextStatus='refunded';
  if(nextStatus){
   const query=orderId?'order_id=eq.'+encodeURIComponent(orderId):'payment_id=eq.'+encodeURIComponent(paymentId);
   const found=await db('consultation_payments?select=booking_reference,order_id,payment_id,status,amount_paise,currency&'+query+'&limit=1');
   if(!found.ok)throw Error();
   if(found.data?.length){
    const row=found.data[0];let finalStatus=nextStatus;
    if((row.status==='captured'||row.status==='refunded')&&(nextStatus==='failed'||nextStatus==='captured'))finalStatus=row.status;
    if(nextStatus==='captured'&&row.status==='refunded')finalStatus='refunded';
    const patch={status:finalStatus,updated_at:new Date().toISOString()};
    if(entity?.id&&entity.status==='captured')patch.payment_id=entity.id;
    const saved=await db('consultation_payments?order_id=eq.'+encodeURIComponent(row.order_id),'PATCH',patch,'return=representation');
    if(!saved.ok)throw Error();
   }
  }
  const logged=await db('consultation_payment_webhook_events','POST',{event_id:eventId,event_type:type,order_id:orderId,payment_id:paymentId,received_at:new Date().toISOString()},'return=minimal');
  if(!logged.ok&&logged.status!==409)return res.status(500).end('Webhook event could not be recorded.');
  return res.status(200).json({received:true});
 }catch{return res.status(500).end('Webhook processing failed; provider may retry.');}
};
module.exports.config={api:{bodyParser:false}};
