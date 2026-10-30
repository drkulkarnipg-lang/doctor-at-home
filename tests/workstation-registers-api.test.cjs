'use strict';
const assert=require('node:assert/strict');
const {validateRegister,createHandler}=require('../api/clinical-cloud.js');
const daily={registerType:'daily',entryDate:'2026-10-30',patientName:'Example Only',patientCode:'PT-DEMO',age:'65',sex:'Female',visitType:'Home visit',clinicalSummary:'Test fixture only',amount:'1200',paymentStatus:'Pending'};
assert.equal(validateRegister(daily).registerType,'daily');
assert.throws(()=>validateRegister({...daily,entryDate:'2026-02-30'}));
assert.throws(()=>validateRegister({...daily,patientName:''}));
const death={registerType:'death',entryDate:'2026-10-30',patientName:'Example Only',patientCode:'PT-DEMO',age:'65',sex:'Female',deathDateTime:'2026-10-30T09:15',place:'Hospital',certificateReference:'DEMO',notes:'Test fixture only'};
assert.equal(validateRegister(death).registerType,'death');
assert.throws(()=>validateRegister({...death,deathDateTime:'bad'}));
const stock={registerType:'stock',entryDate:'2026-10-30',itemName:'Example item',category:'General',batch:'DEMO',expiry:'2027-10-30',quantity:'10',unit:'packs',movement:'received',supplier:'Example supplier',reference:'DEMO',notes:'Test fixture only'};
assert.equal(validateRegister(stock).registerType,'stock');
assert.throws(()=>validateRegister({...stock,quantity:'-5'}));
(async()=>{
const owner='11111111-1111-4111-8111-111111111111',other='22222222-2222-4222-8222-222222222222',env={SUPABASE_URL:'https://synthetic.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test',CLINIC_OWNER_USER_ID:owner};
const response=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});
async function call(handler,action,method='GET',body,query={}){const res={headers:{},code:200,setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(data){this.data=data;return this;}};await handler({query:{action,...query},method,body,headers:{host:'clinic.test',origin:'https://clinic.test','content-type':'application/json',cookie:'__Host-clinicSession=synthetic-token'}},res);return res;}
const id='33333333-3333-4333-8333-333333333333',revision='44444444-4444-4444-8444-444444444444';
const handler=createHandler({env,request:async(url,o={})=>{if(url.endsWith('/auth/v1/user'))return response({id:owner});if(url.includes('/rest/v1/clinic_workstation_registers?select='))return response([{id,register_type:'daily',entry_date:'2026-10-30',data:{patientName:'Example Only',visitType:'Home visit'},revision,created_at:'2026-10-30T00:00:00Z',updated_at:'2026-10-30T00:00:00Z'}]);if(url.endsWith('/rest/v1/clinic_workstation_registers')&&o.method==='POST'){const row=JSON.parse(o.body);assert.equal(row.owner_id,owner);return response([{...row,id,created_at:'2026-10-30T00:00:00Z'}]);}if(url.includes('/rest/v1/clinic_workstation_registers?id=eq.')&&o.method==='PATCH')return response([]);throw Error('Unexpected request '+url);}});
let out=await call(handler,'register-list','GET',undefined,{registerType:'daily'});assert.equal(out.code,200);assert.equal(out.data.records.length,1);
out=await call(handler,'register-save','POST',{entry:daily});assert.equal(out.code,200);assert.equal(out.data.record.owner_id,owner);
out=await call(handler,'register-save','POST',{entry:{...daily,id,revision}});assert.equal(out.code,409,'conflict must not overwrite a changed record');
out=await call(createHandler({env,request:async url=>url.endsWith('/auth/v1/user')?response({id:other}):(()=>{throw Error('non-owner must not access the register table');})()}),'register-list','GET',undefined,{registerType:'daily'});assert.equal(out.code,403);
out=await call(createHandler({env,request:async url=>url.endsWith('/auth/v1/user')?response({id:owner}):response({message:'missing relation'},404)}),'register-list','GET',undefined,{registerType:'daily'});assert.equal(out.code,503);assert.match(out.data.message,/not installed yet/i);
out=await call(handler,'register-list','GET',undefined,{registerType:'unknown'});assert.equal(out.code,400);
console.log('Register API checks passed: owner-only list/create, revision conflict, missing migration and field validation.');
})().catch(e=>{console.error(e);process.exitCode=1;});

