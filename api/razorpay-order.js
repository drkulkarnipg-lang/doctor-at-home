'use strict';
const {env,sameOrigin,body,db,razorpay,uuid}=require('../server/razorpay-payments');
module.exports=async function(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({message:'Use POST.'});
 if(!sameOrigin(req))return res.status(403).json({message:'Same-origin request required.'});
 let c;try{c=env();}catch{return res.status(503).json({message:'Secure gateway is not configured yet. No payment was initiated.'});}
 try{
  const b=body(req);
  if(!uuid(b.bookingReference)||b.appointmentConfirmed!==true)return res.status(400).json({message:'Confirm the doctor-approved appointment before starting payment.'});
  const existing=await db('consultation_payments?select=booking_reference,order_id,status,amount_paise,currency,attempt_number&booking_reference=eq.'+encodeURIComponent(b.bookingReference)+'&order=attempt_number.desc&limit=1');
  if(!existing.ok)throw Error();
  if(existing.data?.length){
   const row=existing.data[0];
   if(row.status==='created'||row.status==='authorized')return res.status(200).json({keyId:c.RAZORPAY_KEY_ID,orderId:row.order_id,amount:row.amount_paise,currency:row.currency,bookingReference:row.booking_reference,attemptNumber:row.attempt_number});
   if(row.status==='captured'||row.status==='refunded')return res.status(409).json({message:'This consultation payment reference has already reached '+row.status+'. Start a new confirmed consultation only if the doctor instructs you to do so.'});
  }
  const attemptNumber=existing.data?.length?Number(existing.data[0].attempt_number||1)+1:1;
  const receipt='oc-'+b.bookingReference.replace(/-/g,'').slice(0,24)+'-'+attemptNumber;
  const created=await razorpay('orders','POST',{amount:50000,currency:'INR',receipt,notes:{service:'online_consultation',booking_reference:b.bookingReference}});
  if(!created?.id||created.amount!==50000||created.currency!=='INR')throw Error();
  const saved=await db('consultation_payments','POST',{booking_reference:b.bookingReference,attempt_number:attemptNumber,provider:'razorpay',order_id:created.id,amount_paise:50000,currency:'INR',status:'created',updated_at:new Date().toISOString()},'return=representation');
  if(!saved.ok||!Array.isArray(saved.data)||saved.data.length!==1)throw Error();
  return res.status(200).json({keyId:c.RAZORPAY_KEY_ID,orderId:created.id,amount:50000,currency:'INR',bookingReference:b.bookingReference,attemptNumber});
 }catch{return res.status(502).json({message:'Could not prepare a verified payment order. No successful payment or appointment is recorded.'});}
};
