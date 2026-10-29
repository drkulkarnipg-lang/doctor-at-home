'use strict';
const assert=require('node:assert/strict');const {createHandler,validatePatient}=require('../api/clinical-cloud.js');
const owner='11111111-1111-4111-8111-111111111111',other='22222222-2222-4222-8222-222222222222',id='pt-33333333-3333-4333-8333-333333333333',revision='44444444-4444-4444-8444-444444444444';
const consent={status:'granted',method:'verbal',noticeVersion:'2026-10-24'};
const env={SUPABASE_URL:'https://synthetic.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test',CLINIC_OWNER_USER_ID:owner};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});
async function call(handler,action,method='GET',body,headers={}){const res={headers:{},code:200,setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(data){this.data=data;return this;}};await handler({query:{action},method,body,headers:{host:'clinic.test',origin:'https://clinic.test','content-type':'application/json',...headers}},res);return res;}
(async()=>{
let requests=[];let handler=createHandler({env:{},request:async()=>{throw Error('No network expected');}});assert.equal((await call(handler,'session')).code,503);
handler=createHandler({env,request:async(url,o)=>{requests.push([url,o]);throw Error('No request expected');}});let r=await call(handler,'save','POST',{}, {origin:'https://attacker.test'});assert.equal(r.code,403);assert.equal(requests.length,0);r=await call(handler,'patient');assert.equal(r.code,401);assert.equal(requests.length,0);assert.equal(r.headers['Cache-Control'],'private, no-store');
handler=createHandler({env,request:async()=>json({access_token:'synthetic-token',expires_in:3600,user:{id:other}})});r=await call(handler,'login','POST',{email:'other@example.test',password:'test-only'});assert.equal(r.code,403);assert.equal(r.data.message.includes('token'),false);
handler=createHandler({env,request:async()=>json({access_token:'synthetic-token',expires_in:3600,user:{id:owner}})});r=await call(handler,'login','POST',{email:'owner@example.test',password:'test-only'});assert.equal(r.code,200);assert.match(r.headers['Set-Cookie'],/HttpOnly; SameSite=Strict; Max-Age=900/);assert.match(r.headers['Set-Cookie'],/Secure/);assert.equal(JSON.stringify(r.data).includes('synthetic-token'),false);
const cookie='__Host-clinicSession=synthetic-token';requests=[];handler=createHandler({env,request:async(url,o)=>{requests.push([url,o]);return url.endsWith('/auth/v1/user')?json({id:other}):json([]);}});r=await call(handler,'list','GET',undefined,{cookie});assert.equal(r.code,403);assert.equal(requests.length,1,'Non-owner must not reach database');
requests=[];handler=createHandler({env,request:async(url,o)=>{requests.push([url,o]);return url.endsWith('/auth/v1/user')?json({id:owner}):json([]);}});r=await call(handler,'save','POST',{patient:{id,name:'Synthetic patient',cloudConsent:consent,readings:[{sbp:'120',dbp:'80'}],revision}},{cookie});assert.equal(r.code,409);assert.equal(requests[1][1].method,'PATCH');assert.ok(requests[1][0].includes('revision=eq.'+revision));assert.equal(requests[1][1].headers.Authorization,'Bearer synthetic-token');assert.equal(JSON.parse(requests[1][1].body).owner_id,owner);
handler=createHandler({env,request:async(url)=>url.endsWith('/auth/v1/user')?json({id:owner}):json([{id}])});r=await call(handler,'save','POST',{patient:{id,name:'Synthetic patient',cloudConsent:consent,readings:[{glucose:'110',context:'Fasting'}]}},{cookie});assert.equal(r.code,200);assert.ok(r.data.revision);
handler=createHandler({env:{...env,SUPABASE_PUBLISHABLE_KEY:'sb_secret_NOT_ALLOWED'},request:async()=>{throw Error('must not run');}});assert.equal((await call(handler,'session')).code,503);
assert.throws(()=>validatePatient({id,name:'Bad',readings:Array(2001).fill({})}));assert.throws(()=>validatePatient({id,name:'Bad',readings:[{notes:'x'.repeat(2001)}]}));assert.throws(()=>validatePatient({id:'arbitrary',name:'Bad',readings:[]}));assert.deepEqual(Object.keys(validatePatient({id,name:'Good',cloudConsent:consent,readings:[{owner_id:'injected',sbp:'120'}]}).readings[0]).includes('owner_id'),false);
r=await call(createHandler({env:{}}),'logout','POST',{});assert.equal(r.code,200);assert.match(r.headers['Set-Cookie'],/Max-Age=0/);
// Owner password recovery is email-only and never requires an existing session cookie.
r=await call(createHandler({env,request:async()=>json({})}),'recover','POST',{});
assert.equal(r.code,503,'Recovery fails closed without the configured owner email');
let recoveryRequests=[];
handler=createHandler({env:{...env,CLINIC_OWNER_EMAIL:'owner@example.test'},request:async(url,o)=>{recoveryRequests.push([url,o]);return json({});}});
r=await call(handler,'recover','POST',{});
assert.equal(r.code,200);assert.equal(recoveryRequests.length,1);assert.ok(recoveryRequests[0][0].includes('/auth/v1/recover?redirect_to='));assert.equal(JSON.parse(recoveryRequests[0][1].body).email,'owner@example.test');
recoveryRequests=[];
handler=createHandler({env,request:async(url,o)=>{recoveryRequests.push([url,o]);if(url.endsWith('/auth/v1/user')&&o.method==='PUT')return json({id:owner});if(url.endsWith('/auth/v1/user'))return json({id:owner});throw Error('Unexpected recovery request');}});
r=await call(handler,'complete-recovery','POST',{accessToken:'synthetic-recovery-token-123456789',password:'Synthetic-Strong-Passphrase-2026!'});
assert.equal(r.code,200);assert.equal(recoveryRequests.length,2);assert.equal(recoveryRequests[1][1].method,'PUT');assert.equal(JSON.parse(recoveryRequests[1][1].body).password,'Synthetic-Strong-Passphrase-2026!');
recoveryRequests=[];
handler=createHandler({env,request:async(url,o)=>{recoveryRequests.push([url,o]);return json({id:other});}});
r=await call(handler,'complete-recovery','POST',{accessToken:'synthetic-recovery-token-123456789',password:'Synthetic-Strong-Passphrase-2026!'});
assert.equal(r.code,403,'Recovery token for a non-owner must be rejected');assert.equal(recoveryRequests.length,1,'Non-owner password must never be updated');
console.log('Cloud API tests passed: unconfigured fail-closed, CSRF, owner authentication, token cookie flags, no client tokens, wrong-owner rejection, optimistic conflict, validation and logout. Live RLS/integration remains untested.');
})().catch(e=>{console.error(e);process.exitCode=1;});
