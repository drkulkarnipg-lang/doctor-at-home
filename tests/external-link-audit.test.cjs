'use strict';
const assert=require('node:assert/strict');
const {classifyStatus,checkOne,runPool}=require('../scripts/audit-external-links.cjs');
(async()=>{
 assert.equal(classifyStatus(200),'reachable');
 assert.equal(classifyStatus(404),'broken');
 assert.equal(classifyStatus(403),'blocked_or_rate_limited');
 assert.equal(classifyStatus(429),'blocked_or_rate_limited');
 assert.equal(classifyStatus(503),'server_error');
 let calls=[];
 const result=await checkOne({url:'https://example.test/resource',classification:'external-destination',source_files:['index.html']},async(url,options)=>{
  calls.push({url,method:options.method,range:options.headers.range});
  if(options.method==='HEAD')return{status:405,url};
  return{status:206,url:'https://example.test/final',};
 });
 assert.equal(result.outcome,'reachable');
 assert.equal(result.http_status,206);
 assert.equal(result.method,'GET');
 assert.equal(result.final_url,'https://example.test/final');
 assert.deepEqual(calls.map(c=>c.method),['HEAD','GET']);
 assert.equal(calls[1].range,'bytes=0-0');
 const skipped=await checkOne({url:'https://example.test',classification:'runtime-template'},async()=>{throw Error('must not request');});
 assert.equal(skipped.outcome,'skipped');
 const bad=await checkOne({url:'not a url',classification:'external-destination'},async()=>{throw Error('must not request');});
 assert.equal(bad.outcome,'invalid_url');
 const ordered=await runPool([1,2,3,4],async n=>n*2,2);
 assert.deepEqual(ordered,[2,4,6,8]);
 console.log('External link audit checks passed: safe classification, HEAD-to-range fallback, no template requests and bounded worker pool.');
})().catch(error=>{console.error(error);process.exitCode=1;});
