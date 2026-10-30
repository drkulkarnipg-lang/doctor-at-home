'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const orderRoute=require('../api/razorpay-order'),verifyRoute=require('../api/razorpay-verify'),webhookRoute=require('../api/razorpay-webhook');
process.env.RAZORPAY_KEY_ID='rzp_test_public';process.env.RAZORPAY_KEY_SECRET='test_secret';process.env.RAZORPAY_WEBHOOK_SECRET='webhook_secret';process.env.SUPABASE_URL='https://synthetic.supabase.co';process.env.SUPABASE_SERVICE_ROLE_KEY='service_role_test';
const bookingReference='11111111-1111-4111-8111-111111111111',retryReference='22222222-2222-4222-8222-222222222222';
function res(){return{statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.statusCode=n;return this;},json(v){this.data=v;return this;},end(v){this.body=v;return this;}};}
function req(body,extra={}){return{method:'POST',headers:{host:'clinic.test',origin:'https://clinic.test','content-type':'application/json',...extra},body};}
const mac=(secret,v)=>crypto.createHmac('sha256',secret).update(v).digest('hex');
(async()=>{
 let savedRows=[],providerPayment=null,orderCreated=0;
 global.fetch=async(url,opts={})=>{
  const u=String(url);
  if(u.includes('/rest/v1/consultation_payments?select=')&&opts.method!=='PATCH'){
   const b=(u.match(/booking_reference=eq\.([^&]+)/)||[])[1],o=(u.match(/order_id=eq\.([^&]+)/)||[])[1];
   let rows=savedRows.filter(x=>(!b||x.booking_reference===decodeURIComponent(b))&&(!o||x.order_id===decodeURIComponent(o)));
   if(u.includes('order=attempt_number.desc'))rows=rows.sort((a,b)=>b.attempt_number-a.attempt_number);
   return new Response(JSON.stringify(rows));
  }
  if(u.endsWith('/v1/orders')){orderCreated++;return new Response(JSON.stringify({id:'order_test_'+orderCreated,amount:50000,currency:'INR'}));}
  if(u.includes('/rest/v1/consultation_payments')&&opts.method==='POST'){const row=JSON.parse(opts.body);savedRows.push(row);return new Response(JSON.stringify([row]),{status:201});}
  if(u.includes('/v1/payments/payment_test_1'))return new Response(JSON.stringify(providerPayment));
  if(u.includes('/rest/v1/consultation_payments')&&opts.method==='PATCH'){
   const o=(u.match(/order_id=eq\.([^&]+)/)||[])[1];const row=savedRows.find(x=>x.order_id===decodeURIComponent(o));if(!row)return new Response('[]');
   Object.assign(row,JSON.parse(opts.body));return new Response(JSON.stringify([row]));
  }
  if(u.includes('/rest/v1/consultation_payment_webhook_events'))return new Response('',{status:201});
  throw Error('Unexpected fetch '+u+' '+opts.method);
 };
 let r=res();await orderRoute(req({bookingReference,appointmentConfirmed:false}),r);assert.equal(r.statusCode,400,'must require appointment confirmation');
 r=res();await orderRoute(req({bookingReference,appointmentConfirmed:true}),r);assert.equal(r.statusCode,200);assert.equal(r.data.amount,50000);assert.equal(r.data.currency,'INR');assert.equal(r.data.attemptNumber,1);assert.equal(orderCreated,1);
 providerPayment={id:'payment_test_1',order_id:'order_test_1',amount:50000,currency:'INR',status:'captured',captured:true};
 r=res();await verifyRoute(req({bookingReference,orderId:'order_test_1',paymentId:'payment_test_1',signature:mac('test_secret','order_test_1|payment_test_1')}),r);assert.equal(r.statusCode,200);assert.equal(r.data.status,'captured');assert.equal(savedRows[0].status,'captured');
 r=res();await verifyRoute(req({bookingReference,orderId:'order_test_1',paymentId:'payment_test_1',signature:'0'.repeat(64)}),r);assert.equal(r.statusCode,400,'forged checkout signature must fail');
 r=res();await orderRoute(req({bookingReference:retryReference,appointmentConfirmed:true}),r);assert.equal(r.statusCode,200);assert.equal(r.data.attemptNumber,1);
 const failedEvent={event:'payment.failed',payload:{payment:{entity:{id:'payment_test_failed',order_id:'order_test_2',amount:50000,currency:'INR',status:'failed'}}}};
 let raw=Buffer.from(JSON.stringify(failedEvent));r=res();await webhookRoute({method:'POST',headers:{'x-razorpay-signature':mac('webhook_secret',raw),'x-razorpay-event-id':'evt_failed_1'},body:raw},r);assert.equal(r.statusCode,200);assert.equal(savedRows.find(x=>x.order_id==='order_test_2').status,'failed');
 r=res();await orderRoute(req({bookingReference:retryReference,appointmentConfirmed:true}),r);assert.equal(r.statusCode,200);assert.equal(r.data.attemptNumber,2,'a failed attempt must permit a new order attempt');assert.equal(r.data.orderId,'order_test_3');
 const capturedEvent={event:'payment.captured',payload:{payment:{entity:{id:'payment_test_1',order_id:'order_test_1',amount:50000,currency:'INR',status:'captured'}}}};
 raw=Buffer.from(JSON.stringify(capturedEvent));r=res();await webhookRoute({method:'POST',headers:{'x-razorpay-signature':mac('webhook_secret',raw),'x-razorpay-event-id':'evt_capture_1'},body:raw},r);assert.equal(r.statusCode,200);assert.equal(savedRows.find(x=>x.order_id==='order_test_1').status,'captured');
 r=res();await webhookRoute({method:'POST',headers:{'x-razorpay-signature':'0'.repeat(64),'x-razorpay-event-id':'evt_bad'},body:Buffer.from('{}')},r);assert.equal(r.statusCode,400,'forged webhook signature must fail');
 r=res();await orderRoute({method:'POST',headers:{host:'clinic.test',origin:'https://attacker.test'},body:{bookingReference,appointmentConfirmed:true}},r);assert.equal(r.statusCode,403,'cross-origin order creation must fail');
 console.log('Razorpay consultation gateway tests passed: fixed INR 500 order, appointment acknowledgement, provider capture verification, forged-signature rejection, signed webhook, failed-attempt retry and same-origin order protection.');
})().catch(e=>{console.error(e);process.exitCode=1;});
