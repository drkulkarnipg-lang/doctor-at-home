'use strict';
(()=> {
 const $=id=>document.getElementById(id);
 const checkbox=$('consultationAppointmentConfirmed'),button=$('razorpayConsultationPay'),status=$('razorpayConsultationStatus');
 if(!checkbox||!button||!status)return;
 let busy=false;
 const setStatus=message=>{status.textContent=message;};
 checkbox.addEventListener('change',()=>{button.disabled=!checkbox.checked||busy;});
 function reference(){
  const key='hvicd_consultation_booking_reference';
  try{let v=sessionStorage.getItem(key);if(!v){v=crypto.randomUUID();sessionStorage.setItem(key,v);}return v;}catch{return crypto.randomUUID();}
 }
 function loadCheckout(){
  if(window.Razorpay)return Promise.resolve();
  return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://checkout.razorpay.com/v1/checkout.js';script.async=true;script.onload=resolve;script.onerror=()=>reject(Error('Razorpay Checkout could not be loaded.'));document.head.append(script);});
 }
 async function post(url,data){
  const response=await fetch(url,{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  let result={};try{result=await response.json();}catch{}
  if(!response.ok)throw Error(result.message||'Secure payment request failed.');
  return result;
 }
 button.addEventListener('click',async()=>{
  if(busy||!checkbox.checked)return;
  busy=true;button.disabled=true;setStatus('Preparing secure payment. No payment is confirmed yet.');
  try{
   const bookingReference=reference();
   const order=await post('/api/razorpay-order',{bookingReference,appointmentConfirmed:true});
   if(!order.keyId||!order.orderId||order.amount!==50000||order.currency!=='INR')throw Error('The server returned an invalid consultation order.');
   await loadCheckout();
   let checkoutOpened=false;
   const checkout=new window.Razorpay({
    key:order.keyId,amount:order.amount,currency:order.currency,name:'Dr. Pramod G. Kulkarni',
    description:'Online consultation — ₹500',order_id:order.orderId,
    notes:{service:'online_consultation'},
    handler:async response=>{
     setStatus('Verifying payment with the provider. Do not close this page yet.');
     try{
      const verified=await post('/api/razorpay-verify',{bookingReference,orderId:response.razorpay_order_id,paymentId:response.razorpay_payment_id,signature:response.razorpay_signature});
      if(verified.verified&&verified.status==='captured'){
       try{sessionStorage.removeItem('hvicd_consultation_booking_reference');}catch{}
       setStatus('Payment capture verified by the provider. Keep your receipt. The doctor’s appointment confirmation and consultation remain separate steps.');
      }else setStatus('Payment verification is incomplete. Do not assume success; contact the doctor with your provider receipt.');
     }catch(error){setStatus((error.message||'Payment verification failed.')+' Do not assume success; contact the doctor with your provider receipt.');}
     finally{busy=false;button.disabled=!checkbox.checked;}
    },
    modal:{ondismiss:()=>{setStatus('Checkout closed. Payment is not confirmed by closing the window; if your app shows a debit, keep the receipt and contact the doctor for verification.');busy=false;button.disabled=!checkbox.checked;}},
    theme:{color:'#0F2942'}
   });
   checkout.on('payment.failed',event=>setStatus('The payment provider reported a failure. No appointment is confirmed. '+(event?.error?.description||'Please contact the doctor if money appears to have been debited.')));
   checkout.open();checkoutOpened=true;
   setStatus('Secure checkout opened. Approve only after verifying the merchant and amount.');
  }catch(error){setStatus((error.message||'Secure checkout is unavailable.')+' No payment success is recorded.');}
  finally{if(!checkoutOpened){busy=false;button.disabled=!checkbox.checked;}}
 });
})();
