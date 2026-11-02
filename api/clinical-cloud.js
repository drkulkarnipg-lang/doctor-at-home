'use strict';
const {randomUUID}=require('node:crypto');
const {patientCode,consent:validateConsent}=require('../server/patient-privacy');
const COOKIE='__Host-clinicSession',REFRESH_COOKIE='__Host-clinicRefresh',PENDING_COOKIE='__Host-clinicMfaPending',PENDING_REMEMBER='__Host-clinicMfaRemember',OWNER_PHONE='+919561394341',UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,ID=/^pt-[0-9a-f-]{36}$/i;
const FIELDS=['date','time','sbp','dbp','glucose','context','weight','height','bmi','pulse','spo2','temperature','creatinine','hba1c','notes'];
function validatePatient(p){if(!p||!ID.test(p.id)||typeof p.name!=='string'||!p.name.trim()||p.name.length>120||!Array.isArray(p.readings)||p.readings.length>2000)throw Error('Invalid patient history.');const readings=p.readings.map(r=>{if(!r||typeof r!=='object'||Array.isArray(r))throw Error('Invalid entry.');return Object.fromEntries(FIELDS.map(k=>{const v=r[k]??'';if(typeof v!=='string'||v.length>(k==='notes'?2000:100))throw Error('Invalid measurement field.');return[k,v];}));});if(p.revision!==null&&p.revision!==undefined&&!UUID.test(p.revision))throw Error('Invalid revision.');return{id:p.id,name:patientCode(p.id),readings,revision:p.revision||null,cloudConsent:validateConsent(p.cloudConsent)};}
const REGISTER_FIELDS={
daily:{patientName:120,patientCode:80,age:20,sex:30,visitType:80,clinicalSummary:2000,amount:20,paymentStatus:40},
death:{patientName:120,patientCode:80,age:20,sex:30,deathDateTime:40,place:100,certificateReference:100,notes:2000},
stock:{itemName:160,category:100,batch:100,expiry:10,quantity:30,unit:40,movement:20,adjustmentDirection:20,supplier:160,reference:120,notes:2000}
};
function validISODate(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const d=new Date(value+'T00:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===value;}
function validateRegister(entry){
if(!entry||typeof entry!=='object'||Array.isArray(entry)||!['daily','death','stock'].includes(entry.registerType))throw Error('Choose a valid register type.');
if(!validISODate(entry.entryDate))throw Error('Enter a valid register date.');
const schema=REGISTER_FIELDS[entry.registerType],data={};
for(const [key,max] of Object.entries(schema)){const value=entry[key]??'';if(typeof value!=='string'||value.length>max)throw Error('Invalid register field: '+key+'.');data[key]=value.trim();}
if(entry.id!==undefined&&entry.id!==null&&entry.id!==''&&!UUID.test(entry.id))throw Error('Invalid register record ID.');
if(entry.revision!==undefined&&entry.revision!==null&&entry.revision!==''&&!UUID.test(entry.revision))throw Error('Invalid register revision.');
if(entry.id&& !entry.revision)throw Error('Reload the current record before editing it.');
if(entry.registerType==='daily'&&(!data.patientName||!data.visitType))throw Error('Enter the patient name and visit type.');
if(entry.registerType==='death'){
if(!data.patientName||!data.deathDateTime||!data.place)throw Error('Enter the name, date/time of death and place.');
if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(data.deathDateTime)||!Number.isFinite(Date.parse(data.deathDateTime)))throw Error('Enter a valid date and time of death.');
}
if(entry.registerType==='stock'){
if(!data.itemName||!data.unit||!['received','issued','adjustment'].includes(data.movement))throw Error('Enter the item, unit and stock movement.');
if(!data.quantity||!Number.isFinite(Number(data.quantity))||Number(data.quantity)<=0)throw Error('Enter a quantity greater than zero.');
if(data.movement==='adjustment'&&!['increase','decrease'].includes(data.adjustmentDirection))throw Error('Choose whether the stock adjustment increases or decreases quantity.');
if(data.expiry&&!validISODate(data.expiry))throw Error('Enter a valid expiry date or leave it blank.');
}
if(entry.registerType==='daily'&&data.amount&&(!Number.isFinite(Number(data.amount))||Number(data.amount)<0||Number(data.amount)>10000000))throw Error('Enter a valid non-negative INR amount.');
if(data.age&&(!Number.isFinite(Number(data.age))||Number(data.age)<0||Number(data.age)>130))throw Error('Enter a valid age.');
return{id:entry.id||null,revision:entry.revision||null,registerType:entry.registerType,entryDate:entry.entryDate,data};
}
function createHandler({env=process.env,request=(...args)=>fetch(...args)}={}){return async(req,res)=>{
res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','private, no-store');res.setHeader('Vercel-CDN-Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Vary','Cookie');
const reply=(code,data)=>res.status(code).json(data),cookieHeaders=[];
const setCookie=(name,token,ttl)=>{cookieHeaders.push(`${name}=${encodeURIComponent(token)}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${ttl}`);res.setHeader('Set-Cookie',cookieHeaders.length===1?cookieHeaders[0]:cookieHeaders.slice());};
const cookie=(token='',ttl=0)=>setCookie(COOKIE,token,ttl),refreshCookie=(token='',ttl=0)=>setCookie(REFRESH_COOKIE,token,ttl),pendingCookie=(token='',ttl=0)=>setCookie(PENDING_COOKIE,token,ttl),pendingRemember=(value='',ttl=0)=>setCookie(PENDING_REMEMBER,value,ttl),clearCookies=()=>{cookie();refreshCookie();pendingCookie();pendingRemember();};
const ACCESS_TTL=900,REMEMBER_TTL=30*24*60*60;
const action=String(req.query?.action||'session'),method=req.method;
if(!['GET','POST'].includes(method)){res.setHeader('Allow','GET, POST');return reply(405,{message:'Unsupported method.'});}
if(req.headers['sec-fetch-site']==='cross-site')return reply(403,{message:'Same-site access required.'});
if(method==='POST'&&(req.headers.origin!==`https://${req.headers.host}`||!String(req.headers['content-type']||'').startsWith('application/json')))return reply(403,{message:'Same-origin JSON request required.'});
if(action==='logout'&&method==='POST'){clearCookies();return reply(200,{signedIn:false});}
let url;try{url=new URL(env.SUPABASE_URL);if(url.protocol!=='https:'||!url.hostname.endsWith('.supabase.co')||url.username||url.password||url.pathname!=='/')throw Error();}catch{return reply(503,{configured:false,message:'Cloud is not configured. Local records remain on this device.'});}
if(!String(env.SUPABASE_PUBLISHABLE_KEY||'').startsWith('sb_publishable_')||!UUID.test(env.CLINIC_OWNER_USER_ID||''))return reply(503,{configured:false,message:'Cloud owner login is not configured.'});
const api=async(path,options={})=>request(url.origin+path,{...options,redirect:'error',signal:AbortSignal.timeout(12000),headers:{apikey:env.SUPABASE_PUBLISHABLE_KEY,...options.headers}});
let body={};try{if(method==='POST'){body=typeof req.body==='string'?JSON.parse(req.body):req.body;if(!body||typeof body!=='object'||Buffer.byteLength(JSON.stringify(body))>4500000)return reply(400,{message:'Invalid or oversized request.'});}}catch{return reply(400,{message:'Invalid JSON request.'});}
try{
let token,refreshToken;const cookiePairs=(req.headers.cookie||'').split(';').map(x=>x.trim());
const raw=cookiePairs.find(x=>x.startsWith(COOKIE+'=')),refreshRaw=cookiePairs.find(x=>x.startsWith(REFRESH_COOKIE+'='));
try{token=raw?decodeURIComponent(raw.slice(COOKIE.length+1)):'';}catch{token='';}
try{refreshToken=refreshRaw?decodeURIComponent(refreshRaw.slice(REFRESH_COOKIE.length+1)):'';}catch{refreshToken='';}
if(action==='login'&&method==='POST'){
clearCookies();
const ownerEmail=String(env.CLINIC_OWNER_EMAIL||'').trim().toLowerCase();
const ownerUsername=String(env.CLINIC_OWNER_USERNAME||'').trim().toLowerCase();
const suppliedUsername=typeof body.username==='string'?body.username.trim().toLowerCase():'';
const suppliedEmail=typeof body.email==='string'?body.email.trim().toLowerCase():'';
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail))return reply(503,{message:'Clinic owner login is not configured.'});
if(!suppliedUsername||suppliedUsername.length>80||suppliedEmail||typeof body.password!=='string'||body.password.length>1024||('rememberDevice'in body&&typeof body.rememberDevice!=='boolean'))return reply(400,{message:'Enter your clinic username and password.'});
if(suppliedUsername!==ownerUsername)return reply(401,{message:'Cloud sign-in was not accepted.'});
const response=await api('/auth/v1/token?grant_type=password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:ownerEmail,password:body.password})});
if(!response.ok)return reply(response.status===429?429:401,{message:response.status===429?'Too many login attempts. Try later.':'Cloud sign-in was not accepted.'});
const data=await response.json();
if(data.user?.id!==env.CLINIC_OWNER_USER_ID||typeof data.access_token!=='string'){clearCookies();return reply(403,{message:'This account is not the clinic owner.'});}
const authHeaders={Authorization:'Bearer '+data.access_token,'Content-Type':'application/json'};
const factorsResponse=await api('/auth/v1/factors',{headers:authHeaders});
if(!factorsResponse.ok)return reply(503,{message:'Mandatory phone verification is unavailable. Workstation access is blocked.'});
const factorData=await factorsResponse.json(),factors=Array.isArray(factorData.all)?factorData.all:Array.isArray(factorData.phone)?factorData.phone:[];
let factor=factors.find(x=>x.factor_type==='phone'&&x.phone===OWNER_PHONE&&x.status==='verified');
if(!factor)factor=factors.find(x=>x.factor_type==='phone'&&x.phone===OWNER_PHONE&&x.status!=='verified');
if(!factor){
 const enrolled=await api('/auth/v1/factors',{method:'POST',headers:authHeaders,body:JSON.stringify({factor_type:'phone',phone:OWNER_PHONE,friendly_name:'Doctor Workstation primary phone'})});
 if(!enrolled.ok)return reply(503,{message:'Phone MFA enrollment is not configured. Workstation access is blocked; no password-only login is allowed.'});
 factor=await enrolled.json();
}
if(typeof factor.id!=='string')return reply(503,{message:'Phone MFA factor could not be established. Workstation access is blocked.'});
const challenge=await api('/auth/v1/factors/'+encodeURIComponent(factor.id)+'/challenge',{method:'POST',headers:authHeaders,body:JSON.stringify({})});
if(!challenge.ok)return reply(503,{message:'SMS OTP delivery is not configured or unavailable. Workstation access is blocked; no password-only login is allowed.'});
const challengeData=await challenge.json();
if(typeof challengeData.id!=='string')return reply(502,{message:'The SMS challenge could not be confirmed. Workstation access is blocked.'});
pendingCookie(data.access_token,300);
pendingRemember('0',300);
return reply(200,{configured:true,mfaRequired:true,phone:'••••••••341',challengeId:challengeData.id,factorId:factor.id,message:'Enter the one-time code sent to the registered clinic mobile.'});
}
if(action==='mfa-verify'&&method==='POST'){
const pendingRaw=cookiePairs.find(x=>x.startsWith(PENDING_COOKIE+'='));
let pendingToken='';try{pendingToken=pendingRaw?decodeURIComponent(pendingRaw.slice(PENDING_COOKIE.length+1)):'';}catch{}
const factorId=typeof body.factorId==='string'?body.factorId:'',challengeId=typeof body.challengeId==='string'?body.challengeId:'',code=typeof body.code==='string'?body.code.trim():'';
if(!pendingToken||!UUID.test(factorId)||!UUID.test(challengeId)||!/^\d{6,10}$/.test(code))return reply(401,{message:'The verification request expired. Sign in again.'});
const pendingHeaders={Authorization:'Bearer '+pendingToken,'Content-Type':'application/json'};
const enrolledFactors=await api('/auth/v1/factors',{headers:pendingHeaders});
if(!enrolledFactors.ok){clearCookies();return reply(401,{message:'The registered phone factor could not be confirmed. Sign in again.'});}
const factorSet=await enrolledFactors.json(),availableFactors=Array.isArray(factorSet.all)?factorSet.all:Array.isArray(factorSet.phone)?factorSet.phone:[];
if(!availableFactors.some(item=>item.id===factorId&&item.factor_type==='phone'&&item.phone===OWNER_PHONE)){clearCookies();return reply(403,{message:'This OTP factor is not the registered clinic mobile.'});}
const pendingUser=await api('/auth/v1/user',{headers:{Authorization:'Bearer '+pendingToken}});
if(!pendingUser.ok||((await pendingUser.json()).id!==env.CLINIC_OWNER_USER_ID)){clearCookies();return reply(401,{message:'The pending owner login expired. Sign in again.'});}
const verified=await api('/auth/v1/factors/'+encodeURIComponent(factorId)+'/verify',{method:'POST',headers:pendingHeaders,body:JSON.stringify({challenge_id:challengeId,code})});
if(!verified.ok)return reply(verified.status===429?429:401,{message:verified.status===429?'Too many OTP attempts. Wait before trying again.':'The one-time code was not accepted. Request a new code and retry.'});
const session=await verified.json();
if(typeof session.access_token!=='string'||typeof session.refresh_token!=='string'||session.user?.id!==env.CLINIC_OWNER_USER_ID){clearCookies();return reply(502,{message:'The verified owner session could not be established.'});}
cookie(session.access_token,Math.min(ACCESS_TTL,Number(session.expires_in)||ACCESS_TTL));
const rememberRaw=cookiePairs.find(x=>x.startsWith(PENDING_REMEMBER+'='));
const remember=rememberRaw?rememberRaw.slice(PENDING_REMEMBER.length+1)==='1':false;
if(remember)refreshCookie(session.refresh_token,REMEMBER_TTL);else refreshCookie('',0);
pendingCookie('',0);pendingRemember('',0);
return reply(200,{configured:true,signedIn:true,remembered:remember,mfaVerified:true});
}
if(action==='reset-request'&&method==='POST'){
const ownerEmail=String(env.CLINIC_OWNER_EMAIL||'').trim().toLowerCase();
const ownerUsername=String(env.CLINIC_OWNER_USERNAME||'').trim().toLowerCase();
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail))return reply(503,{message:'Password recovery is not configured. No password was changed.'});
const suppliedUsername=typeof body.username==='string'?body.username.trim().toLowerCase():'';
const suppliedEmail=typeof body.email==='string'?body.email.trim().toLowerCase():'';
if(!suppliedUsername||suppliedUsername.length>80||suppliedEmail)return reply(400,{message:'Enter your clinic username.'});
const generic='If this is the configured clinic owner account, a recovery email will be sent.';
if(suppliedUsername!==ownerUsername)return reply(200,{message:generic});
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
let user=null;
const renew=async()=>{if(!refreshToken)return null;try{const refreshed=await api('/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refresh_token:refreshToken})});if(!refreshed.ok)return null;const data=await refreshed.json();if(data.user?.id!==env.CLINIC_OWNER_USER_ID||typeof data.access_token!=='string'||typeof data.refresh_token!=='string'){clearCookies();return null;}cookie(data.access_token,Math.min(ACCESS_TTL,Number(data.expires_in)||ACCESS_TTL));refreshCookie(data.refresh_token,REMEMBER_TTL);token=data.access_token;refreshToken=data.refresh_token;return data.user;}catch{return null;}};
if(!token&&refreshToken)user=await renew();
if(!token&&!user){if(refreshToken)clearCookies();return reply(action==='session'?200:401,{configured:true,signedIn:false,message:'Sign in with the clinic owner account.'});}
if(!user){const auth=await api('/auth/v1/user',{headers:{Authorization:'Bearer '+token}});if(!auth.ok)user=await renew();else user=await auth.json();}
if(!user){clearCookies();return reply(action==='session'?200:401,{configured:true,signedIn:false,message:'Session expired. Sign in again.'});}
if(user.id!==env.CLINIC_OWNER_USER_ID){clearCookies();return reply(403,{message:'Owner access required.'});}
let claims={};try{claims=JSON.parse(Buffer.from(String(token||'').split('.')[1]||'','base64url').toString('utf8'));}catch{}
if(claims.aal!=='aal2'){clearCookies();return reply(action==='session'?200:401,{configured:true,signedIn:false,message:'Phone OTP verification is mandatory. Sign in again and complete the SMS challenge.'});}
if(action==='change-password'&&method==='POST'){
const currentPassword=typeof body.currentPassword==='string'?body.currentPassword:'';
const newPassword=typeof body.newPassword==='string'?body.newPassword:'';
const confirmPassword=typeof body.confirmPassword==='string'?body.confirmPassword:'';
if(!currentPassword||newPassword.length<12||newPassword.length>1024||newPassword!==confirmPassword)return reply(400,{message:'Enter your current password and the same new password twice (minimum 12 characters).'});
const ownerEmail=String(env.CLINIC_OWNER_EMAIL||'').trim().toLowerCase();
const reauth=await api('/auth/v1/token?grant_type=password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:ownerEmail,password:currentPassword})});
if(!reauth.ok)return reply(401,{message:'Current password was not accepted. Password unchanged.'});
const reauthData=await reauth.json();
if(reauthData.user?.id!==env.CLINIC_OWNER_USER_ID)return reply(403,{message:'Owner verification failed. Password unchanged.'});
const updated=await api('/auth/v1/user',{method:'PUT',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({password:newPassword})});
if(updated.status===429)return reply(429,{message:'Too many password changes. Wait and try again.'});
if(!updated.ok)return reply(400,{message:'Password update failed. Password unchanged.'});
clearCookies();
return reply(200,{updated:true,signedOut:true,message:'Password changed. Sign in again with username, new password and phone OTP.'});
}
if(action==='session'&&method==='GET')return reply(200,{configured:true,signedIn:true,remembered:!!refreshToken});
const headers={Authorization:'Bearer '+token,'Content-Type':'application/json',Prefer:'return=representation'};
if(action==='list'&&method==='GET'){const after=String(req.query?.after||'');if(after&&!ID.test(after))return reply(400,{message:'Invalid page cursor.'});const r=await api('/rest/v1/clinic_patient_trends?select=id,name,revision,updated_at&order=id.asc&limit=100'+(after?'&id=gt.'+encodeURIComponent(after):''),{headers});if(!r.ok)throw Error();const records=await r.json();return reply(200,{records,next:records.length===100?records.at(-1).id:null});}
if(action==='patient'&&method==='GET'){const id=String(req.query?.id||'');if(!ID.test(id))return reply(400,{message:'Invalid patient ID.'});const r=await api('/rest/v1/clinic_patient_trends?select=id,name,readings,revision,updated_at,cloud_consent&id=eq.'+encodeURIComponent(id),{headers});if(!r.ok)throw Error();const records=await r.json();return records.length?reply(200,{patient:records[0]}):reply(404,{message:'Patient not found.'});}
if(action==='save'&&method==='POST'){let p;try{p=validatePatient(body.patient);}catch(e){return reply(400,{message:e.message});}const revision=randomUUID(),updated_at=new Date().toISOString();const record={id:p.id,owner_id:user.id,name:p.name,readings:p.readings,revision,updated_at,cloud_consent:{...p.cloudConsent,recorded_by:user.id,recorded_at:p.cloudConsent.recorded_at||new Date().toISOString()}};const path='/rest/v1/clinic_patient_trends'+(p.revision?'?id=eq.'+encodeURIComponent(p.id)+'&revision=eq.'+encodeURIComponent(p.revision):'');const r=await api(path,{method:p.revision?'PATCH':'POST',headers,body:JSON.stringify(record)});if(r.status===409)return reply(409,{message:'A cloud history with this ID already exists. Load its latest version before changing it.'});if(!r.ok)throw Error();const saved=await r.json();if(saved.length!==1)return reply(409,{message:'This patient changed on another device. Local entries are safe; compare the latest cloud version before retrying.'});return reply(200,{id:p.id,revision,updated_at,cloudConsent:record.cloud_consent});}
if(action==='documents-list'&&method==='GET'){
const r=await api('/rest/v1/clinic_documents?select=id,title,document_type,mime_type,byte_size,storage_path,sha256,source_ref,metadata,created_at&order=created_at.desc&limit=300',{headers});
if(!r.ok)throw Error();
return reply(200,{documents:await r.json(),limit:300});
}
if(action==='document-upload'&&method==='POST'){
const e=body.document,clean=(v,n)=>typeof v==='string'?v.trim().slice(0,n):'';
if(!e||typeof e!=='object')return reply(400,{message:'Document details are required.'});
const title=clean(e.title,240),type=clean(e.documentType,40),mime=clean(e.mimeType,60),sourceRef=clean(e.sourceRef,160),base64=typeof e.base64==='string'?e.base64:'',hash=clean(e.sha256,64);
const allowedTypes=['prescription','lab_requisition','radiology_requisition','referral','fitness','unfitness','consent','invoice','death_form','patient_attachment','clinical_note','article_draft','other'];
const allowedMime=['application/pdf','image/png','image/jpeg','text/plain','application/json'];
if(!title||!allowedTypes.includes(type)||!allowedMime.includes(mime)||! /^[a-f0-9]{64}$/.test(hash)||!base64||base64.length>10500000||!/^[A-Za-z0-9+/]*={0,2}$/.test(base64))return reply(400,{message:'Invalid document title, type, format or payload.'});
const bytes=Buffer.from(base64,'base64');
if(!bytes.length||bytes.length>7864320||bytes.toString('base64').replace(/=+$/,'')!==base64.replace(/=+$/,''))return reply(400,{message:'File must be valid and no larger than 7.5 MB.'});
const actual=require('node:crypto').createHash('sha256').update(bytes).digest('hex');
if(actual!==hash)return reply(400,{message:'Document integrity check failed. Nothing was uploaded.'});
const sig= mime==='application/pdf'?bytes.subarray(0,5).toString()==='%PDF-':mime==='image/png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):mime==='image/jpeg'?bytes[0]===255&&bytes[1]===216:mime==='text/plain'? !bytes.includes(0):bytes[0]===123||bytes[0]===91;
if(!sig)return reply(400,{message:'File content does not match the selected format.'});
const id=randomUUID(),path=user.id+'/'+id+'.'+({ 'application/pdf':'pdf','image/png':'png','image/jpeg':'jpg','text/plain':'txt','application/json':'json'}[mime]);
const uploaded=await api('/storage/v1/object/clinic-document-vault/'+path.split('/').map(encodeURIComponent).join('/'),{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':mime,'x-upsert':'false'},body:bytes});
if(!uploaded.ok)return reply(502,{message:'Private cloud file upload failed. No document was saved.'});
const metadata={owner_id:user.id,id,title,document_type:type,mime_type:mime,byte_size:bytes.length,storage_path:path,sha256:actual,source_ref:sourceRef,metadata:e.metadata&&typeof e.metadata==='object'&&!Array.isArray(e.metadata)?e.metadata:{},created_at:new Date().toISOString()};
const saved=await api('/rest/v1/clinic_documents',{method:'POST',headers,body:JSON.stringify(metadata)});
if(!saved.ok){await api('/storage/v1/object/clinic-document-vault/'+path.split('/').map(encodeURIComponent).join('/'),{method:'DELETE',headers:{Authorization:'Bearer '+token}}).catch(()=>{});throw Error();}
return reply(201,{saved:true,document:{id,title,documentType:type,mimeType:mime,byteSize:bytes.length,createdAt:metadata.created_at}});
}
if(action==='document-download'&&method==='POST'){
const id=String(body.id||'');if(!UUID.test(id))return reply(400,{message:'Invalid document ID.'});
const found=await api('/rest/v1/clinic_documents?select=id,storage_path,title,mime_type&id=eq.'+encodeURIComponent(id)+'&limit=1',{headers});
if(!found.ok)throw Error();const rows=await found.json();if(rows.length!==1)return reply(404,{message:'Document not found in your private vault.'});
const path=rows[0].storage_path;
const signed=await api('/storage/v1/object/sign/clinic-document-vault/'+path.split('/').map(encodeURIComponent).join('/'),{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({expiresIn:90})});
if(!signed.ok)throw Error();
const result=await signed.json();const signedURL=result.signedURL||result.signedUrl;
if(typeof signedURL!=='string')throw Error();
return reply(200,{url:new URL(signedURL,url.origin).href,title:rows[0].title,mimeType:rows[0].mime_type,expiresIn:90});
}
if(action==='register-list'&&method==='GET'){
const type=String(req.query?.registerType||'');if(!['daily','death','stock'].includes(type))return reply(400,{message:'Choose daily, death or stock register.'});
const r=await api('/rest/v1/clinic_workstation_registers?select=id,register_type,entry_date,data,revision,created_at,updated_at&register_type=eq.'+encodeURIComponent(type)+'&order=entry_date.desc,created_at.desc&limit=500',{headers});
if(!r.ok){if(r.status===404||r.status===400)return reply(503,{message:'Register cloud storage is not installed yet. No register data was changed.'});throw Error();}
return reply(200,{records:await r.json(),limit:500});
}
if(action==='register-death-from-form'&&method==='POST'){
const e=body.entry;
if(!e||typeof e!=='object'||!['form4','form4a','form2'].includes(e.formType))return reply(400,{message:'Choose a valid death form.'});
const clean=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
const patientName=clean(e.patientName,120),deathDate=clean(e.deathDate,10),deathTime=clean(e.deathTime,5),place=clean(e.place,100);
if(!patientName||!validISODate(deathDate)||!/^([01]\\d|2[0-3]):[0-5]\\d$/.test(deathTime)||!place)return reply(400,{message:'Enter patient name, valid death date, 24-hour time and actual place. No missing value is inferred.'});
const entryDate=validISODate(e.entryDate)?e.entryDate:deathDate;
const sourceKey=require('node:crypto').createHash('sha256').update(['death-form-v1',patientName.normalize('NFKC').toLocaleLowerCase(),deathDate,deathTime,place.normalize('NFKC').toLocaleLowerCase()].join('|')).digest('hex');
const data={patientName,patientCode:'',age:clean(e.age,20),sex:clean(e.sex,30),deathDateTime:deathDate+'T'+deathTime,place,certificateReference:'Source form: '+e.formType.toUpperCase(),notes:"Entered from the doctor-selected death form; verify against the signed source before final filing."};
const record={owner_id:user.id,register_type:'death',entry_date:entryDate,data,source_form_key:sourceKey,revision:randomUUID(),updated_at:new Date().toISOString()};
const r=await api('/rest/v1/clinic_workstation_registers?on_conflict=owner_id,source_form_key',{method:'POST',headers:{...headers,Prefer:'resolution=ignore-duplicates,return=representation'},body:JSON.stringify(record)});
if(!r.ok){if(r.status===404||r.status===400)return reply(503,{message:'Death register cloud storage is not ready. No register entry was saved.'});throw Error();}
const inserted=await r.json();
if(inserted.length===1)return reply(200,{saved:true,duplicate:false,record:inserted[0]});
const existing=await api('/rest/v1/clinic_workstation_registers?select=id,register_type,entry_date,data,revision,created_at,updated_at&owner_id=eq.'+encodeURIComponent(user.id)+'&source_form_key=eq.'+encodeURIComponent(sourceKey),{headers});
if(!existing.ok)throw Error();
const rows=await existing.json();
if(rows.length!==1)throw Error('Could not confirm the existing idempotent death register entry.');
return reply(200,{saved:true,duplicate:true,record:rows[0]});
}
if(action==='register-save'&&method==='POST'){
let e;try{e=validateRegister(body.entry);}catch(err){return reply(400,{message:err.message});}
const now=new Date().toISOString(),record={owner_id:user.id,register_type:e.registerType,entry_date:e.entryDate,data:e.data,revision:randomUUID(),updated_at:now};
const path=e.id?'/rest/v1/clinic_workstation_registers?id=eq.'+encodeURIComponent(e.id)+'&owner_id=eq.'+encodeURIComponent(user.id)+'&revision=eq.'+encodeURIComponent(e.revision):'/rest/v1/clinic_workstation_registers';
const r=await api(path,{method:e.id?'PATCH':'POST',headers,body:JSON.stringify(record)});
if(!r.ok){if(r.status===404||r.status===400)return reply(503,{message:'Register cloud storage is not installed yet. No register data was changed.'});throw Error();}
const saved=await r.json();if(saved.length!==1)return reply(409,{message:'This register entry changed or was removed elsewhere. Refresh the register before editing; no overwrite occurred.'});
return reply(200,{record:saved[0]});
}
if(action==='delete'&&method==='POST'){if(!ID.test(body.id||'')||!UUID.test(body.revision||'')||body.confirmCode!==patientCode(body.id))return reply(400,{message:'Confirm the exact cloud patient code and latest revision.'});const r=await api('/rest/v1/clinic_patient_trends?id=eq.'+encodeURIComponent(body.id)+'&revision=eq.'+encodeURIComponent(body.revision),{method:'DELETE',headers});if(!r.ok)throw Error();const removed=await r.json();if(removed.length!==1)return reply(409,{message:'This record changed. Refresh and load its latest revision before deleting.'});return reply(200,{deleted:true,id:body.id,message:'Cloud trend history deleted. Device copies and downloaded backups are separate; minimal privacy audit events and provider backups may remain under their retention policies.'});}
return reply(405,{message:'Unsupported action or method.'});
}catch{return reply(502,{message:'Cloud request did not complete. Local records are unchanged; retry after checking the connection.'});}
};}
module.exports=createHandler();module.exports.createHandler=createHandler;module.exports.validatePatient=validatePatient;module.exports.validateRegister=validateRegister;
