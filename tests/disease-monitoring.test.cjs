'use strict';
const assert=require('node:assert/strict');
const {validatePatient,createHandler}=require('../api/disease-monitoring');
const valid={id:'2c9b4602-27a7-718e-e5b8-ff2e730a0034',code:'PT-001',age:68,sex:'M',diseases:['hf','htn'],chemo:false,baselines:{spo2:94},readings:[{id:'r1',t:Date.now(),v:{sbp:132,dbp:82,spo2:96},flags:[],note:'Stable'}]};
const clean=validatePatient(valid);assert.equal(clean.code,'PT-001');assert.deepEqual(clean.record.diseases,['hf','htn']);assert.equal(clean.record.readings[0].v.spo2,96);
for(const bad of [{...valid,code:'Patient Name'},{...valid,age:140},{...valid,diseases:['unknown']},{...valid,readings:[{id:'r1',t:Date.now(),v:{spo2:120},flags:[],note:''}]},{...valid,baselines:{spo2:101}},{...valid,name:'Real patient name'},{...valid,patientName:'Real patient name'},{...valid,phone:'9876543210'},{...valid,address:'Street address'},{...valid,readings:[{id:'r1',t:Date.now(),v:{sbp:120},flags:[],note:'Call 9876543210'}]}])assert.throws(()=>validatePatient(bad));
let status=0,body=null;const res={setHeader(){},status(n){status=n;return this;},json(v){body=v;return this;}};
(async()=>{const handler=createHandler({env:{SUPABASE_URL:'https://example.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test'},ownerCheck:async()=>null});await handler({method:'GET',query:{action:'list'},headers:{}},res);assert.equal(status,401);assert.match(body.message,/owner login/i);console.log('Disease Monitoring Centre validation and owner-gate tests passed.');})().catch(e=>{console.error(e);process.exitCode=1;});
