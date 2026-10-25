'use strict';
const {makePipeline}=require('./evidence-pipeline');
function makeRunner({env=process.env,request=(...a)=>fetch(...a),pipeline=makePipeline}={}){
 async function rpc(action,data={}){if(!env.SUPABASE_URL||!env.SUPABASE_PUBLISHABLE_KEY||!env.RESEARCH_JOB_SECRET)throw Error('Research cloud configuration is incomplete.');const r=await request(env.SUPABASE_URL+'/rest/v1/rpc/clinic_evidence_job',{method:'POST',headers:{apikey:env.SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'},redirect:'error',signal:AbortSignal.timeout(15000),body:JSON.stringify({p_secret:env.RESEARCH_JOB_SECRET,p_action:action,p_data:data})});if(!r.ok)throw Error('Evidence checkpoint unavailable ('+r.status+').');return r.json();}
 async function tick(requestId){const claim=await rpc('claim',{requestId});if(!claim.claimed)return{...claim,continue:claim.state==='busy'};const run=claim.run,ctx={runId:run.id,lease:run.lease,revision:run.revision};let payload=run.payload,state='running',message='One checkpoint completed.';
 const reserve=async tokens=>{if(!(await rpc('reserve',{...ctx,tokens})).allowed){const e=Error('Daily AI request/context budget reached.');e.budget=true;throw e;}};
 try{payload=await pipeline({env,request,reserve,seen:keys=>rpc('seen',{keys})}).step(payload);state=payload.stage==='done'?'done':'running';message=payload.message||message;}catch(e){state=e.budget?'budget_exhausted':e.setup?'needs_setup':'needs_setup';message=e.budget?'Daily AI budget reached; no automatic top-up.':e.setup?'AI Gateway needs verification, credentials or credits.':'Checkpoint stopped; saved work is retained. Check service configuration.';}
 await rpc('save',{...ctx,payload,state,message});return{state,stage:payload.stage,runId:run.id,continue:state==='running',message};
 }
 return{tick};
}
module.exports={makeRunner};
