'use strict';
const assert=require('node:assert/strict');
const handler=require('../api/patient-assistant');
async function call(method,body,headers={}){
 const res={headers:{},statusCode:200,setHeader(k,v){this.headers[k]=v;},status(n){this.statusCode=n;return this;},json(data){this.data=data;return this;}};
 await handler({method,body,headers:{host:'clinic.example.test',origin:'https://clinic.example.test','content-type':'application/json',...headers}},res);
 return res;
}
(async()=>{
 delete process.env.AI_GATEWAY_API_KEY;delete process.env.VERCEL_OIDC_TOKEN;delete process.env.AI_GATEWAY_MODEL;
 let r=await call('GET');assert.equal(r.statusCode,200);assert.equal(r.data.enabled,false);
 r=await call('POST',{messages:[{role:'user',content:'I have severe chest pain'}]});assert.equal(r.statusCode,200);assert.match(r.data.reply,/112/,'emergency response must work even when AI is not configured');
 r=await call('POST',{messages:[{role:'user',content:'Hello'}]});assert.equal(r.statusCode,503);
 r=await call('POST',{messages:[{role:'user',content:'Hello'}]},{'sec-fetch-site':'cross-site'});assert.equal(r.statusCode,403);
 process.env.AI_GATEWAY_API_KEY='test-only';process.env.AI_GATEWAY_MODEL='provider/model';
 const oldFetch=global.fetch;global.fetch=async(url,options)=>{assert.equal(url,'https://ai-gateway.vercel.sh/v1/chat/completions');assert.match(options.headers.Authorization,/Bearer test-only/);return new Response(JSON.stringify({model:'provider/model',choices:[{message:{content:'You can request a visit through the booking form. The clinic confirms availability.'}}]}),{status:200,headers:{'Content-Type':'application/json'}});};
 r=await call('POST',{messages:[{role:'user',content:'How do I book a visit?'}]});assert.equal(r.statusCode,200);assert.match(r.data.reply,/booking form/);
 r=await call('POST',{messages:[{role:'user',content:'x'.repeat(3000)}]});assert.equal(r.statusCode,400);
 global.fetch=oldFetch;delete process.env.AI_GATEWAY_API_KEY;delete process.env.AI_GATEWAY_MODEL;
 console.log('Patient assistant API checks passed: disabled status, emergency fallback, fail-closed setup, same-origin guard, server-side AI routing and input limits.');
})().catch(e=>{console.error(e);process.exitCode=1;});
