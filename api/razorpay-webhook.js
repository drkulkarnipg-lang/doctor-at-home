'use strict';
const {env,safeEqualHex,hmac,db}=require('../server/razorpay-payments');
module.exports=async function(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).end('Use POST.');
 let c;try{c=env();}catch{return res.status(503).end('Webhook is not configured.');}
 const raw=Buffer.isBuffer(req.body)?req.body:Buffer.from(typeof req.body==='string'?req.body:JSON.stringify(req.body||{}));
 const signature=String(req.headers['x-razorpay-signature']||''),eventId=String(req.headers['x-razorpay-event-id']||'');
 if(!safeEqualHex(hmac(c.RAZORPAY_WEBHOOK_SECRET,raw),signature)||!eventId||eventId.length>200)return res.status(400).end('Invalid webhook signature or event ID.');
 let event;try{event=JSON.parse(raw.toString('utf8'));}catch{return res.status(400).end('Invalid webhook payload.');}
 try{
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
