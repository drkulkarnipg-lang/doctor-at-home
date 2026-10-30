'use strict';
const ORIGIN='https://home-visiting-icu-doctor.vercel.app';
const OWNER_EMAIL='drkulkarnipg@gmail.com';
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','private, no-store');
 res.setHeader('Content-Type','application/json; charset=utf-8');
 const reply=(status,data)=>res.status(status).json(data);
 if(req.method!=='POST')return reply(405,{message:'Use POST.'});
 if('https://'+req.headers.host!==ORIGIN||req.headers.origin!==ORIGIN||req.headers['sec-fetch-site']==='cross-site'||!String(req.headers['content-type']||'').startsWith('application/json'))return reply(403,{message:'Use the main clinic website to request password recovery.'});
 let body;try{body=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return reply(400,{message:'Invalid request.'});}
 if(!body||Buffer.byteLength(JSON.stringify(body))>4096||typeof body.email!=='string')return reply(400,{message:'Enter the clinic login email.'});
 const email=body.email.trim().toLowerCase();
 if(email!==OWNER_EMAIL)return reply(200,{message:'For security, password recovery is available only for the configured clinic email. If this is the registered owner email, check its inbox and spam folder.'});
 let url;try{url=new URL(process.env.SUPABASE_URL);if(url.protocol!=='https:'||!url.hostname.endsWith('.supabase.co')||url.username||url.password||url.pathname!=='/'||!String(process.env.SUPABASE_PUBLISHABLE_KEY||'').startsWith('sb_publishable_')||!UUID.test(process.env.CLINIC_OWNER_USER_ID||''))throw Error();}catch{return reply(503,{message:'Password recovery is not configured on this deployment. No password was changed.'});}
 try{
  const response=await fetch(url.origin+'/auth/v1/recover?redirect_to='+encodeURIComponent(ORIGIN+'/doctor-password-reset.html'),{method:'POST',headers:{apikey:process.env.SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({email}),redirect:'error',signal:AbortSignal.timeout(12000)});
  if(response.status===429)return reply(429,{message:'Too many recovery requests. Wait before trying again.'});
  if(!response.ok)return reply(502,{message:'The recovery email service did not confirm the request. Check the clinic email configuration and try again.'});
  return reply(200,{message:'If the clinic email is registered and email delivery is configured, a secure password setup/reset link has been sent. Check inbox and spam.'});
 }catch{return reply(502,{message:'Could not reach the recovery email service. No password was changed.'});}
};
