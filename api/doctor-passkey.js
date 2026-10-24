'use strict';
const {owner}=require('../server/owner-session');
const ORIGIN='https://home-visiting-icu-doctor.vercel.app';
function createHandler({env=process.env,request=(...a)=>fetch(...a)}={}){return async(req,res)=>{
 res.setHeader('Cache-Control','private, no-store');res.setHeader('Content-Type','application/json');const reply=(s,d)=>res.status(s).json(d);const correctOrigin='https://'+req.headers.host===ORIGIN;
 if(req.method==='GET')return reply(200,{origin:ORIGIN,onSupportedOrigin:correctOrigin,provider:'Supabase native passkeys (experimental)',message:correctOrigin?'Passkey availability is checked when requested. Existing password login remains available.':'Passkeys must be registered and used on the main website, not a changing preview address.'});
 if(req.method!=='POST')return reply(405,{message:'Use same-origin POST.'});
 if(!correctOrigin||req.headers.origin!==ORIGIN||req.headers['sec-fetch-site']==='cross-site'||!String(req.headers['content-type']||'').startsWith('application/json'))return reply(403,{message:'Use the main website for passkey login or registration. Your existing password is unchanged.',origin:ORIGIN});
 let b;try{b=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return reply(400,{message:'Invalid JSON.'});}
 if(!b||Buffer.byteLength(JSON.stringify(b))>64000||!['authentication_options','authentication_verify','registration_options','registration_verify'].includes(b.action))return reply(400,{message:'Unsupported passkey request.'});
 const registration=b.action.startsWith('registration');const verify=b.action.endsWith('verify');
 if(Object.keys(b).some(k=>!['action','challenge_id','credential'].includes(k)))return reply(400,{message:'Only the passkey ceremony is accepted.'});
 if(verify&&(!/^[0-9a-f-]{36}$/i.test(b.challenge_id||'')||!b.credential||b.credential.type!=='public-key'||typeof b.credential.id!=='string'||!b.credential.response))return reply(400,{message:'Invalid passkey response.'});
 let base;try{base=new URL(env.SUPABASE_URL);if(base.protocol!=='https:'||!base.hostname.endsWith('.supabase.co')||base.username||base.password||base.pathname!=='/'||!env.SUPABASE_PUBLISHABLE_KEY||!env.CLINIC_OWNER_USER_ID)throw Error();}catch{return reply(503,{message:'Owner authentication configuration is missing. No password change is needed.'});}
 try{
  const session=registration?await owner(req,env,request):null;if(registration&&!session)return reply(401,{message:'Sign in with your existing doctor account before adding a passkey.'});
  const headers={apikey:env.SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json',...(session?{Authorization:'Bearer '+session.token}:{})};
  const path='/auth/v1/passkeys/'+(registration?'registration/':'authentication/')+(verify?'verify':'options');
  const r=await request(base.origin+path,{method:'POST',headers,redirect:'error',signal:AbortSignal.timeout(20000),body:JSON.stringify(verify?{challenge_id:b.challenge_id,credential:b.credential}:{})});const d=await r.json();
  if(!r.ok){const code=String(d.error_code||d.code||'');if(code==='passkey_disabled'||r.status===404)return reply(503,{message:'Native passkeys are not enabled for this Supabase project yet. Enable Passkeys and the main-site relying party settings in Supabase first. Your password still works.',code:'passkey_setup_required'});return reply(r.status===429?429:400,{message:r.status===429?'Too many attempts; try later.':'Passkey verification did not complete. Use your existing password or retry the device prompt.',code:'passkey_not_completed'});}
  if(!verify){if(!d.challenge_id||!d.options)return reply(502,{message:'Invalid provider challenge.'});const rp=registration?d.options.rp?.id:d.options.rpId;if(rp!==new URL(ORIGIN).hostname)return reply(503,{message:'Passkey relying party must match the main website. No credential was registered.',code:'passkey_setup_required'});return reply(200,{challenge_id:d.challenge_id,options:d.options,expires_at:d.expires_at});}
  if(registration)return reply(200,{registered:true,id:d.id,message:'Passkey registered to your existing doctor account.'});
  // A provider assertion is never accepted as an owner session without server verification.
  if(typeof d.access_token!=='string')return reply(502,{message:'No verified session was issued.'});
  const userResponse=await request(base.origin+'/auth/v1/user',{headers:{apikey:env.SUPABASE_PUBLISHABLE_KEY,Authorization:'Bearer '+d.access_token},redirect:'error',signal:AbortSignal.timeout(12000)});
  const user=userResponse.ok?await userResponse.json():null;if(user?.id!==env.CLINIC_OWNER_USER_ID)return reply(403,{message:'This passkey does not belong to the clinic owner.'});
  res.setHeader('Set-Cookie','__Host-clinicSession='+encodeURIComponent(d.access_token)+'; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age='+Math.min(900,Number(d.expires_in)||900));return reply(200,{signedIn:true});
 }catch{return reply(502,{message:'Passkey service did not complete. Your existing doctor password remains available.'});}
};}
module.exports=createHandler();module.exports.createHandler=createHandler;
