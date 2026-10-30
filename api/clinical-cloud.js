'use strict';
const {randomUUID}=require('node:crypto');
const {patientCode,consent:validateConsent}=require('../server/patient-privacy');
const COOKIE='__Host-clinicSession',UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,ID=/^pt-[0-9a-f-]{36}$/i;
const FIELDS=['date','time','sbp','dbp','glucose','context','weight','pulse','spo2','temperature','creatinine','hba1c','notes'];
function validatePatient(p){if(!p||!ID.test(p.id)||typeof p.name!=='string'||!p.name.trim()||p.name.length>120||!Array.isArray(p.readings)||p.readings.length>2000)throw Error('Invalid patient history.');const readings=p.readings.map(r=>{if(!r||typeof r!=='object'||Array.isArray(r))throw Error('Invalid entry.');return Object.fromEntries(FIELDS.map(k=>{const v=r[k]??'';if(typeof v!=='string'||v.length>(k==='notes'?2000:100))throw Error('Invalid measurement field.');return[k,v];}));});if(p.revision!==null&&p.revision!==undefined&&!UUID.test(p.revision))throw Error('Invalid revision.');return{id:p.id,name:patientCode(p.id),readings,revision:p.revision||null,cloudConsent:validateConsent(p.cloudConsent)};}
function createHandler({env=process.env,request=(...args)=>fetch(...args)}={}){return async(req,res)=>{
res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','private, no-store');res.setHeader('Vercel-CDN-Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Vary','Cookie');
const reply=(code,data)=>res.status(code).json(data),cookie=(token='',ttl=0)=>res.setHeader('Set-Cookie',`${COOKIE}=${encodeURIComponent(token)}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${ttl}`);
const action=String(req.query?.action||'session'),method=req.method;
if(!['GET','POST'].includes(method)){res.setHeader('Allow','GET, POST');return reply(405,{message:'Unsupported method.'});}
if(req.headers['sec-fetch-site']==='cross-site')return reply(403,{message:'Same-site access required.'});
if(method==='POST'&&(req.headers.origin!==`https://${req.headers.host}`||!String(req.headers['content-type']||'').startsWith('application/json')))return reply(403,{message:'Same-origin JSON request required.'});
if(action==='logout'&&method==='POST'){cookie();return reply(200,{signedIn:false});}
let url;try{url=new URL(env.SUPABASE_URL);if(url.protocol!=='https:'||!url.hostname.endsWith('.supabase.co')||url.username||url.password||url.pathname!=='/')throw Error();}catch{return reply(503,{configured:false,message:'Cloud is not configured. Local records remain on this device.'});}
if(!String(env.SUPABASE_PUBLISHABLE_KEY||'').startsWith('sb_publishable_')||!UUID.test(env.CLINIC_OWNER_USER_ID||''))return reply(503,{configured:false,message:'Cloud owner login is not configured.'});
const api=async(path,options={})=>request(url.origin+path,{...options,redirect:'error',signal:AbortSignal.timeout(12000),headers:{apikey:env.SUPABASE_PUBLISHABLE_KEY,...options.headers}});
let body={};try{if(method==='POST'){body=typeof req.body==='string'?JSON.parse(req.body):req.body;if(!body||typeof body!=='object'||Buffer.byteLength(JSON.stringify(body))>4500000)return reply(400,{message:'Invalid or oversized request.'});}}catch{return reply(400,{message:'Invalid JSON request.'});}
try{
let token;const raw=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='));try{token=raw?decodeURIComponent(raw.slice(COOKIE.length+1)):'';}catch{token='';}
if(action==='login'&&method==='POST'){
if(typeof body.email!=='string'||body.email.length>254||typeof body.password!=='string'||body.password.length>1024)return reply(400,{message:'Enter your cloud login email and password.'});
const response=await api('/auth/v1/token?grant_type=password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:body.email,password:body.password})});
if(!response.ok)return reply(response.status===429?429:401,{message:response.status===429?'Too many login attempts. Try later.':'Cloud sign-in was not accepted.'});const data=await response.json();
if(data.user?.id!==env.CLINIC_OWNER_USER_ID||typeof data.access_token!=='string'){cookie();return reply(403,{message:'This account is not the clinic owner.'});}
// Store only a short-lived secure cookie, never a refresh token or browser-storage token.
cookie(data.access_token,Math.min(900,Number(data.expires_in)||900));return reply(200,{configured:true,signedIn:true});
}
if(action==='reset-request'&&method==='POST'){
const ownerEmail=String(env.CLINIC_OWNER_EMAIL||'').trim().toLowerCase();
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail))return reply(503,{message:'Password recovery is not configured. No password was changed.'});
if(typeof body.email!=='string'||body.email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()))return reply(400,{message:'Enter the clinic owner email address.'});
const generic='If this is the configured clinic owner account, a recovery email will be sent.';
if(body.email.trim().toLowerCase()!==ownerEmail)return reply(200,{message:generic});
const redirect='https://home-visiting-icu-doctor.vercel.app/password-reset.html';
const sent=await api('/auth/v1/recover?redirect_to='+encodeURIComponent(redirect),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:ownerEmail})});
if(sent.status===429)return reply(429,{message:'Too many recovery requests. Wait before trying again.'});
if(!sent.ok)return reply(502,{message:'Password recovery email could not be requested. Check provider configuration; no password was changed.'});
return reply(200,{message:generic});
}
if(action==='reset-password'&&method==='POST'){
if(typeof body.accessToken!=='string'||body.accessToken.length<20||body.accessToken.length>4096||typeof body.password!=='string'||body.password.length<12||body.password.length>1024)return reply(400,{message:'Use a unique password with at least 12 characters and a valid recovery link.'});
const recovery=await api('/auth/v1/user',{headers:{Authorization:'Bearer '+body.accessToken}});
if(!recovery.ok)return reply(401,{message:'Recovery link is invalid or expired. Request a new link from Doctor login.'});
const recoveryUser=await recovery.json();
if(recoveryUser.id!==env.CLINIC_OWNER_USER_ID)return reply(403,{message:'This recovery link is not for the clinic owner account.'});
const updated=await api('/auth/v1/user',{method:'PUT',headers:{Authorization:'Bearer '+body.accessToken,'Content-Type':'application/json'},body:JSON.stringify({password:body.password})});
if(updated.status===429)return reply(429,{message:'Too many password updates. Wait before trying again.'});
if(!updated.ok)return reply(400,{message:'Password update was not accepted. Use a unique password and request a fresh link if needed.'});
return reply(200,{updated:true,message:'Password changed. Return to Doctor login and sign in with the new password.'});
}
if(!token)return reply(action==='session'?200:401,{configured:true,signedIn:false,message:'Sign in with the clinic owner account.'});
const auth=await api('/auth/v1/user',{headers:{Authorization:'Bearer '+token}});if(!auth.ok){cookie();return reply(401,{signedIn:false,message:'Session expired. Sign in again.'});}const user=await auth.json();if(user.id!==env.CLINIC_OWNER_USER_ID){cookie();return reply(403,{message:'Owner access required.'});}
if(action==='session'&&method==='GET')return reply(200,{configured:true,signedIn:true});
const headers={Authorization:'Bearer '+token,'Content-Type':'application/json',Prefer:'return=representation'};
if(action==='list'&&method==='GET'){const after=String(req.query?.after||'');if(after&&!ID.test(after))return reply(400,{message:'Invalid page cursor.'});const r=await api('/rest/v1/clinic_patient_trends?select=id,name,revision,updated_at&order=id.asc&limit=100'+(after?'&id=gt.'+encodeURIComponent(after):''),{headers});if(!r.ok)throw Error();const records=await r.json();return reply(200,{records,next:records.length===100?records.at(-1).id:null});}
if(action==='patient'&&method==='GET'){const id=String(req.query?.id||'');if(!ID.test(id))return reply(400,{message:'Invalid patient ID.'});const r=await api('/rest/v1/clinic_patient_trends?select=id,name,readings,revision,updated_at,cloud_consent&id=eq.'+encodeURIComponent(id),{headers});if(!r.ok)throw Error();const records=await r.json();return records.length?reply(200,{patient:records[0]}):reply(404,{message:'Patient not found.'});}
if(action==='save'&&method==='POST'){let p;try{p=validatePatient(body.patient);}catch(e){return reply(400,{message:e.message});}const revision=randomUUID(),updated_at=new Date().toISOString();const record={id:p.id,owner_id:user.id,name:p.name,readings:p.readings,revision,updated_at,cloud_consent:{...p.cloudConsent,recorded_by:user.id,recorded_at:p.cloudConsent.recorded_at||new Date().toISOString()}};const path='/rest/v1/clinic_patient_trends'+(p.revision?'?id=eq.'+encodeURIComponent(p.id)+'&revision=eq.'+encodeURIComponent(p.revision):'');const r=await api(path,{method:p.revision?'PATCH':'POST',headers,body:JSON.stringify(record)});if(r.status===409)return reply(409,{message:'A cloud history with this ID already exists. Load its latest version before changing it.'});if(!r.ok)throw Error();const saved=await r.json();if(saved.length!==1)return reply(409,{message:'This patient changed on another device. Local entries are safe; compare the latest cloud version before retrying.'});return reply(200,{id:p.id,revision,updated_at,cloudConsent:record.cloud_consent});}
if(action==='delete'&&method==='POST'){if(!ID.test(body.id||'')||!UUID.test(body.revision||'')||body.confirmCode!==patientCode(body.id))return reply(400,{message:'Confirm the exact cloud patient code and latest revision.'});const r=await api('/rest/v1/clinic_patient_trends?id=eq.'+encodeURIComponent(body.id)+'&revision=eq.'+encodeURIComponent(body.revision),{method:'DELETE',headers});if(!r.ok)throw Error();const removed=await r.json();if(removed.length!==1)return reply(409,{message:'This record changed. Refresh and load its latest revision before deleting.'});return reply(200,{deleted:true,id:body.id,message:'Cloud trend history deleted. Device copies and downloaded backups are separate; minimal privacy audit events and provider backups may remain under their retention policies.'});}
return reply(405,{message:'Unsupported action or method.'});
}catch{return reply(502,{message:'Cloud request did not complete. Local records are unchanged; retry after checking the connection.'});}
};}
module.exports=createHandler();module.exports.createHandler=createHandler;module.exports.validatePatient=validatePatient;
