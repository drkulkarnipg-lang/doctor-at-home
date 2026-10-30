'use strict';
const {env,sameOrigin,body,safeEqualHex,hmac,db,razorpay,uuid}=require('../server/razorpay-payments');
module.exports=async function(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({message:'Use POST.'});
 if(!sameOrigin(req))return res.status(403).json({message:'Same-origin request required.'});
 let c;try{c=env();}catch{return res.status(503).json({message:'Payment verification is not configured.'});}
 try{
  const b=body(req);
  if(!uuid(b.bookingReference)||typeof b.orderId!=='string'||typeof b.paymentId!=='string'||typeof b.signature!=='string')return res.status(400).json({message:'Payment verification fields are incomplete.'});
  if(!safeEqualHex(hmac(c.RAZORPAY_KEY_SECRET,b.orderId+'|'+b.paymentId),b.signature))return res.status(400).json({message:'Payment signature verification failed.'});
  const found=await db('consultation_payments?select=booking_reference,order_id,payment_id,status,amount_paise,currency&booking_reference=eq.'+encodeURIComponent(b.bookingReference)+'&order_id=eq.'+encodeURIComponent(b.orderId)+'&limit=1');
  if(!found.ok)throw Error();
  if(!found.data?.length)return res.status(404).json({message:'No matching consultation payment order exists.'});
  const row=found.data[0];
  if(row.status==='refunded')return res.status(409).json({message:'This payment has already been refunded.'});
  const payment=await razorpay('payments/'+encodeURIComponent(b.paymentId));
  if(payment.order_id!==row.order_id||payment.amount!==50000||payment.currency!=='INR'||payment.status!=='captured'||payment.captured!==true)return res.status(409).json({message:'The provider has not confirmed a captured ₹500 payment. Do not treat this as paid.'});
  const saved=await db('consultation_payments?booking_reference=eq.'+encodeURIComponent(b.bookingReference)+'&order_id=eq.'+encodeURIComponent(b.orderId),'PATCH',{payment_id:payment.id,status:'captured',updated_at:new Date().toISOString()},'return=representation');
  if(!saved.ok||!Array.isArray(saved.data)||saved.data.length!==1)throw Error();
  return res.status(200).json({verified:true,status:'captured',amount:50000,currency:'INR',message:'Payment capture verified. Appointment confirmation remains a separate clinic workflow.'});
 }catch{return res.status(502).json({message:'Payment could not be verified with the provider. Do not assume payment success; contact the doctor with your provider receipt.'});}
};
