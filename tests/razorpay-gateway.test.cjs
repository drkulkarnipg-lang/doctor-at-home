'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const orderRoute=require('../api/razorpay-order'),verifyRoute=require('../api/razorpay-verify'),webhookRoute=require('../api/razorpay-webhook');
process.env.RAZORPAY_KEY_ID='rzp_test_public';process.env.RAZORPAY_KEY_SECRET='test_secret';process.env.RAZORPAY_WEBHOOK_SECRET='webhook_secret';process.env.SUPABASE_URL='https://synthetic.supabase.co';process.env.SUPABASE_SERVICE_ROLE_KEY='service_role_test';
const bookingReference='11111111-1111-4111-8111-111111111111';
function res(){return{statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.statusCode=n;return this;},json(v){this.data=v;return this;},end(v){this.body=v;return this;}};}
function req(body,extra={}){return{method:'POST',headers:{host:'clinic.test',origin:'https://clinic.test','content-type':'application/json',...extra},body};}
const mac=(secret,v)=>crypto.createHmac('sha256',secret).update(v).digest('hex');
(async()=>{
 let savedRow=null,providerPayment=null,orderCreated=0;
 global.fetch=async(url,opts={})=>{
  if(String(url).includes('/rest/v1/consultation_payments?select=')&&opts.method!=='PATCH')return new Response(JSON.stringify(savedRow?[savedRow]:[]));
  if(String(url).endsWith('/v1/orders')){orderCreated++;return new Response(JSON.stringify({id:'order_test_1',amount:50000,currency:'INR'}));}
  if(String(url).includes('/rest/v1/consultation_payments')&&opts.method==='POST'){savedRow=JSON.parse(opts.body);return new Response(JSON.stringify([savedRow]),{status:201});}
  if(String(url).includes('/v1/payments/payment_test_1'))return new Response(JSON.stringify(providerPayment));
  if(String(url).includes('/rest/v1/consultation_payments')&&opts.method==='PATCH'){savedRow={...savedRow,...JSON.parse(opts.body)};return new Response(JSON.stringify([savedRow]));}
  if(String(url).includes('/rest/v1/consultation_payment_webhook_events'))return new Response('',{status:201});
  throw Error('Unexpected fetch '+url+' '+opts.method);
 };
 let r=res();await orderRoute(req({bookingReference,appointmentConfirmed:false}),r);assert.equal(r.statusCode,400,'must require appointment confirmation');
 r=res();await orderRoute(req({bookingReference,appointmentConfirmed:true}),r);assert.equal(r.statusCode,200);assert.equal(r.data.amount,50000);assert.equal(r.data.currency,'INR');assert.equal(orderCreated,1);
 providerPayment={id:'payment_test_1',order_id:'order_test_1',amount:50000,currency:'INR',status:'captured',captured:true};
 r=res();await verifyRoute(req({bookingReference,orderId:'order_test_1',paymentId:'payment_test_1',signature:mac('test_secret','order_test_1|payment_test_1')}),r);assert.equal(r.statusCode,200);assert.equal(r.data.status,'captured');assert.equal(savedRow.status,'captured');
 r=res();await verifyRoute(req({bookingReference,orderId:'order_test_1',paymentId:'payment_test_1',signature:'0'.repeat(64)}),r);assert.equal(r.statusCode,400,'forged checkout signature must fail');
 const event={event:'payment.captured',payload:{payment:{entity:{id:'payment_test_1',order_id:'order_test_1',amount:50000,currency:'INR',status:'captured'}}}};
 const raw=Buffer.from(JSON.stringify(event));r=res();await webhookRoute({method:'POST',headers:{'x-razorpay-signature':mac('webhook_secret',raw),'x-razorpay-event-id':'evt_test_1'},body:raw},r);assert.equal(r.statusCode,200);assert.equal(savedRow.status,'captured');
 r=res();await orderRoute({method:'POST',headers:{host:'clinic.test',origin:'https://attacker.test'},body:{bookingReference,appointmentConfirmed:true}},r);assert.equal(r.statusCode,403,'cross-origin order creation must fail');
 console.log('Razorpay consultation gateway tests passed: fixed INR 500 order, appointment acknowledgement, provider capture verification, forged-signature rejection, signed webhook and same-origin order protection.');
})().catch(e=>{console.error(e);process.exitCode=1;});
