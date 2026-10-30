'use strict';
const crypto=require('node:crypto');
function env(){
 const names=['RAZORPAY_KEY_ID','RAZORPAY_KEY_SECRET','RAZORPAY_WEBHOOK_SECRET','SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY'];
 const out=Object.fromEntries(names.map(k=>[k,process.env[k]]));
 if(names.some(k=>!out[k]))throw Error('Payment gateway is not configured.');
 return out;
}
function sameOrigin(req){
 const host=String(req.headers?.host||'').toLowerCase(),origin=String(req.headers?.origin||'').toLowerCase();
 return !!host && origin.startsWith('https:') && (()=>{try{return new URL(origin).host.toLowerCase()===host;}catch{return false;}})() && req.headers?.['sec-fetch-site']!=='cross-site';
}
function body(req){if(req.body&&typeof req.body==='object'&&!Buffer.isBuffer(req.body))return req.body;const raw=Buffer.isBuffer(req.body)?req.body.toString('utf8'):String(req.body||'');return JSON.parse(raw||'{}');}
function safeEqualHex(a,b){if(typeof a!=='string'||typeof b!=='string'||!/^[a-f0-9]{64}$/i.test(a)||!/^[a-f0-9]{64}$/i.test(b))return false;return crypto.timingSafeEqual(Buffer.from(a,'hex'),Buffer.from(b,'hex'));}
function hmac(secret,value){return crypto.createHmac('sha256',secret).update(value).digest('hex');}
async function db(path,method='GET',data,prefer){
 const c=env();const headers={apikey:c.SUPABASE_SERVICE_ROLE_KEY,Authorization:'Bearer '+c.SUPABASE_SERVICE_ROLE_KEY};
 if(data!==undefined)headers['Content-Type']='application/json';
 if(prefer)headers.Prefer=prefer;
 const r=await fetch(c.SUPABASE_URL.replace(/\/+$/,'')+'/rest/v1/'+path,{method,headers,body:data===undefined?undefined:JSON.stringify(data),redirect:'error',signal:AbortSignal.timeout(12000)});
 let payload;try{payload=await r.json();}catch{payload=null;}
 return {ok:r.ok,status:r.status,data:payload};
}
async function razorpay(path,method='GET',data){
 const c=env(),headers={Authorization:'Basic '+Buffer.from(c.RAZORPAY_KEY_ID+':'+c.RAZORPAY_KEY_SECRET).toString('base64'),'Content-Type':'application/json'};
 const r=await fetch('https://api.razorpay.com/v1/'+path,{method,headers,body:data===undefined?undefined:JSON.stringify(data),redirect:'error',signal:AbortSignal.timeout(12000)});
 let payload;try{payload=await r.json();}catch{payload=null;}
 if(!r.ok)throw Error('Payment provider request failed.');
 return payload;
}
function uuid(value){return typeof value==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);}
module.exports={env,sameOrigin,body,safeEqualHex,hmac,db,razorpay,uuid};
