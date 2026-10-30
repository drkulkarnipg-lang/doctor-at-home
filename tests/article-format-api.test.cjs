'use strict';
const assert=require('node:assert/strict');
process.env.AI_GATEWAY_API_KEY='synthetic-test-token';process.env.AI_GATEWAY_MODEL='synthetic-test-model';
const ownerModule=require('../server/owner-session');ownerModule.owner=async req=>req.fakeOwner?{id:'owner-test',token:'synthetic-session'}:null;
let aiCalls=0;global.fetch=async(url,options)=>{aiCalls++;assert.equal(url,'https://ai-gateway.vercel.sh/v1/chat/completions');return{ok:true,json:async()=>({model:'synthetic-test-model',choices:[{finish_reason:'stop',message:{content:JSON.stringify({title:'Formatted clinical guide',standfirst:'A concise standfirst for the reader to understand this guide.',bodyMarkdown:'# Guide\n\nThis is a sufficiently long formatted article body with all original caveats retained and no invented clinical recommendation, dose, statistic or reference.',editorialNotes:[]})}}]})};};
const handler=require('../api/article-format');
function res(){const headers={};return{headers,statusCode:200,body:null,setHeader(k,v){headers[k.toLowerCase()]=v;},status(n){this.statusCode=n;return this;},json(v){this.body=v;return this;}};}
const headers={'sec-fetch-site':'same-origin',origin:'https://clinic.test',host:'clinic.test','content-type':'application/json'};
const body={title:'Original title',category:'General',body:'A long clinical draft that exceeds one hundred characters and includes uncertainty and safety caveats that must be preserved during formatting.',sources:['https://example.org/source'],confirmNoPatientData:true};
(async()=>{
 let r=res();await handler({method:'GET',headers},r);assert.equal(r.statusCode,405);assert.equal(r.headers.allow,'POST');
 r=res();await handler({method:'POST',headers,body,fakeOwner:false},r);assert.equal(r.statusCode,401);assert.equal(aiCalls,0,'Unauthenticated request cannot call AI');
 r=res();await handler({method:'POST',headers:{...headers,origin:'https://attacker.test'},body,fakeOwner:true},r);assert.equal(r.statusCode,403);assert.equal(aiCalls,0,'Cross-origin request cannot call AI');
 r=res();await handler({method:'POST',headers,body,fakeOwner:true},r);assert.equal(r.statusCode,200);assert.equal(r.headers['cache-control'],'private, no-store');assert.equal(r.body.title,'Formatted clinical guide');assert.equal(r.body.model,'synthetic-test-model');assert.equal(aiCalls,1);
 r=res();await handler({method:'POST',headers,body:{...body,confirmNoPatientData:false},fakeOwner:true},r);assert.equal(r.statusCode,400);assert.equal(aiCalls,1,'Missing no-patient-data confirmation is rejected before AI call');
 console.log('AI article formatting API checks passed: POST-only, owner-authenticated, same-origin, no-store and consent-gated.');
})().catch(e=>{console.error(e);process.exitCode=1;});
