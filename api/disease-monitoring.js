'use strict';
const {randomUUID}=require('node:crypto');
const {owner:defaultOwner}=require('../server/owner-session');
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CODE=/^[A-Za-z0-9][A-Za-z0-9._-]{0,23}$/;
const DISEASES=new Set(['dm','htn','ihd','hf','copd','ckd','cir','eld','onc']);
const LIMITS={sbp:[50,280],dbp:[30,160],pulse:[20,220],spo2:[50,100],rr:[4,60],temp:[32,43],weight:[15,250],glucF:[20,700],glucP:[20,700],pefr:[30,800],puffs:[0,80],angina:[0,40],gtn:[0,12],pillows:[0,8],creat:[0.2,20],egfr:[1,150],k:[2,9],na:[100,170],hb:[3,20],bili:[0.1,40],inr:[0.8,8],girth:[40,200],enc:[0,4],falls:[0,20],barthel:[0,100],pain:[0,10],pps:[10,100],bm:[0,30],bt:[0,20]};
const BASELINES=new Set(['spo2','pefr','creat','egfr','bili','weight']);
function validatePatient(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Invalid patient record.');
 const id=input.id==null||input.id===''?randomUUID():String(input.id);if(!UUID.test(id))throw Error('Invalid patient record identifier.');
 const code=typeof input.code==='string'?input.code.trim():'';if(!CODE.test(code))throw Error('Use a short patient code only. Do not enter a patient name, phone or address.');
 if(input.age!==null&&input.age!==undefined&&(!Number.isInteger(input.age)||input.age<0||input.age>120))throw Error('Enter a valid age from 0 to 120.');
 const sex=input.sex==null?'':input.sex;if(!['','M','F','Other'].includes(sex))throw Error('Invalid sex selection.');
 if(!Array.isArray(input.diseases)||!input.diseases.length||input.diseases.length>DISEASES.size||input.diseases.some(d=>!DISEASES.has(d))||new Set(input.diseases).size!==input.diseases.length)throw Error('Choose one or more supported conditions.');
 if(typeof input.chemo!=='boolean'&&input.chemo!==undefined)throw Error('Invalid chemotherapy status.');
 const baselines={};if(input.baselines!=null&&(typeof input.baselines!=='object'||Array.isArray(input.baselines)))throw Error('Invalid baseline values.');
 for(const [key,value] of Object.entries(input.baselines||{})){if(!BASELINES.has(key)||typeof value!=='number'||!Number.isFinite(value)||value<LIMITS[key][0]||value>LIMITS[key][1])throw Error('Invalid baseline value.');baselines[key]=value;}
 if(!Array.isArray(input.readings)||input.readings.length>2000)throw Error('A patient history may contain at most 2,000 readings.');
 const readings=input.readings.map(r=>{
  if(!r||typeof r!=='object'||Array.isArray(r)||typeof r.id!=='string'||!/^[A-Za-z0-9_-]{1,40}$/.test(r.id)||!Number.isFinite(r.t)||r.t<0||r.t>Date.now()+366*86400000)throw Error('Invalid reading entry.');
  if(!r.v||typeof r.v!=='object'||Array.isArray(r.v)||Object.keys(r.v).length>Object.keys(LIMITS).length)throw Error('Invalid reading measurements.');
  const values={};for(const [key,value] of Object.entries(r.v)){if(!(key in LIMITS)||typeof value!=='number'||!Number.isFinite(value)||value<LIMITS[key][0]||value>LIMITS[key][1])throw Error('Invalid measurement: '+key+'.');values[key]=value;}
  if(!Array.isArray(r.flags)||r.flags.length>40||r.flags.some(f=>typeof f!=='string'||!/^[a-z0-9_]{1,60}$/.test(f)))throw Error('Invalid symptom flags.');
  if(r.note!=null&&(typeof r.note!=='string'||r.note.length>200||/[\r\n]/.test(r.note)))throw Error('Notes must be short and must not contain names or contact details.');
  return{id:r.id,t:r.t,v:values,flags:r.flags,note:r.note||''};
 });
 const record={age:input.age??null,sex,diseases:[...input.diseases],chemo:input.chemo===true,baselines,readings,created:Number.isFinite(input.created)?input.created:Date.now()};
 if(Buffer.byteLength(JSON.stringify(record))>450000)throw Error('Patient history is too large to save.');
 const revision=input.revision==null||input.revision===''?null:String(input.revision);if(revision&&!UUID.test(revision))throw Error('Invalid record revision.');
 return{id,code,revision,record};
}
function mapRow(row){return{...row.record,id:row.id,code:row.patient_code,revision:row.revision,updatedAt:row.updated_at};}
function createHandler({env=process.env,request=(...args)=>fetch(...args),ownerCheck=defaultOwner}={}){
 return async(req,res)=>{
  const reply=(status,data)=>res.status(status).json(data);
  res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','private, no-store');res.setHeader('Vercel-CDN-Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Vary','Cookie');
  if(!['GET','POST'].includes(req.method))return reply(405,{message:'Unsupported method.'});
  if(req.headers?.['sec-fetch-site']==='cross-site')return reply(403,{message:'Same-site access required.'});
  if(req.method==='POST'&&(req.headers?.origin!==('https://'+req.headers?.host)||!String(req.headers?.['content-type']||'').startsWith('application/json')))return reply(403,{message:'Same-origin JSON request required.'});
  let body={};if(req.method==='POST'){try{body=typeof req.body==='string'?JSON.parse(req.body):req.body;if(!body||typeof body!=='object'||Array.isArray(body)||Buffer.byteLength(JSON.stringify(body))>1000000)return reply(400,{message:'Invalid or oversized request.'});}catch{return reply(400,{message:'Invalid JSON request.'});}}
  const action=String(req.query?.action||'list');
  const session=await ownerCheck(req,env,request).catch(()=>null);if(!session)return reply(401,{message:'Doctor Workstation owner login required. Sign in again and reopen Disease Monitoring Centre.'});
  let supabase;try{const url=new URL(env.SUPABASE_URL);if(url.protocol!=='https:'||!url.hostname.endsWith('.supabase.co')||url.username||url.password||url.pathname!=='/'||!String(env.SUPABASE_PUBLISHABLE_KEY||'').startsWith('sb_publishable_'))throw Error();supabase=async(path,options={})=>request(url.origin+path,{...options,redirect:'error',signal:AbortSignal.timeout(12000),headers:{apikey:env.SUPABASE_PUBLISHABLE_KEY,Authorization:'Bearer '+session.token,...options.headers}});}catch{return reply(503,{message:'Secure clinic cloud is not configured. No browser-only storage is available.'});}
  try{
   if(action==='list'&&req.method==='GET'){const r=await supabase('/rest/v1/clinic_disease_monitoring?select=id,patient_code,record,revision,created_at,updated_at&owner_id=eq.'+encodeURIComponent(session.id)+'&archived_at=is.null&order=updated_at.desc&limit=500');if(!r.ok)throw Error('Cloud records could not be loaded.');const rows=await r.json();return reply(200,{patients:rows.map(mapRow),limit:500});}
   if(action==='save'&&req.method==='POST'){let p;try{p=validatePatient(body.patient);}catch(e){return reply(400,{message:e.message});}const r=await supabase('/rest/v1/rpc/save_clinic_disease_monitoring',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p_id:p.id,p_expected_revision:p.revision,p_patient_code:p.code,p_record:p.record})});if(!r.ok){const detail=await r.text().catch(()=> '');if(/REVISION_CONFLICT|PATIENT_CODE_EXISTS/i.test(detail))return reply(409,{message:'This record changed on another device or the patient code is already in use. Refresh before retrying; no overwrite occurred.'});if(r.status===401||r.status===403)return reply(r.status,{message:'Owner access is required. No patient data was saved.'});return reply(400,{message:'The clinic cloud rejected this record. No local copy was created.'});}const rows=await r.json(),row=Array.isArray(rows)?rows[0]:rows;if(!row?.id||!row.revision)return reply(502,{message:'Cloud save could not be confirmed. Refresh the list before retrying.'});return reply(200,{patient:mapRow(row)});}
   if(action==='archive'&&req.method==='POST'){if(Object.keys(body).some(k=>!['id','revision'].includes(k))||!UUID.test(body.id||'')||!UUID.test(body.revision||''))return reply(400,{message:'Invalid record or revision.'});const r=await supabase('/rest/v1/rpc/archive_clinic_disease_monitoring',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p_id:body.id,p_expected_revision:body.revision})});if(!r.ok){const detail=await r.text().catch(()=> '');if(/REVISION_CONFLICT/i.test(detail))return reply(409,{message:'This record changed on another device. Refresh before archiving.'});throw Error('Archive could not be confirmed.');}return reply(200,{archived:true});}
   return reply(405,{message:'Unsupported action or method.'});
  }catch(e){return reply(502,{message:e.message||'Secure clinic cloud request failed. No browser-only copy was used.'});}
 };
}
module.exports=createHandler();module.exports.createHandler=createHandler;module.exports.validatePatient=validatePatient;
