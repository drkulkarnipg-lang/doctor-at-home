'use strict';
const assert=require('node:assert/strict');
const {classifyStatus,checkOne,runPool,summarizeReport}=require('../scripts/audit-external-links.cjs');
(async()=>{
 assert.equal(classifyStatus(200),'reachable');
 assert.equal(classifyStatus(404),'broken');
 assert.equal(classifyStatus(403),'blocked_or_rate_limited');
 assert.equal(classifyStatus(429),'blocked_or_rate_limited');
 assert.equal(classifyStatus(405),'method_not_allowed');
 assert.equal(classifyStatus(501),'method_not_allowed');
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
 const summary=summarizeReport({candidates_checked:3,counts:{reachable:1,broken:1,blocked_or_rate_limited:1},results:[
  {url:'https://ok.example',outcome:'reachable',source_files:['index.html']},
  {url:'https://broken.example/form.pdf',outcome:'broken',http_status:404,method:'HEAD',source_files:['index.html']},
  {url:'https://blocked.example',outcome:'blocked_or_rate_limited',http_status:403,reason:'Host blocked',source_files:['patient-education-data.js']},
  {url:'https://skipped.example',outcome:'skipped',source_files:[]}
 ]},'reports/audit.json');
 assert.equal(summary.unresolved_destinations.length,2,'Unreachable and blocked destinations must be visible in workflow logs');
 assert.equal(summary.unresolved_destinations[0].url,'https://broken.example/form.pdf');
 assert.equal(summary.unresolved_destinations[0].http_status,404);
 assert.equal(summary.unresolved_destinations[1].reason,'Host blocked');
 assert.equal(summary.output,'reports/audit.json');
 console.log('External link audit checks passed: safe classification, HEAD-to-range fallback, no template requests, bounded worker pool and visible unresolved URLs.');
})().catch(error=>{console.error(error);process.exitCode=1;});
