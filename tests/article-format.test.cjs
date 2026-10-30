'use strict';
const assert=require('node:assert/strict');
const {createFormatter,validateInput,validateOutput}=require('../server/article-format');
const draft={title:'COPD care at home',category:'Respiratory',body:'A long draft that describes the current evidence and home-care advice in careful terms. It includes the existing cautions and explains when the reader should contact their treating doctor. No new dose or threshold should be added by a formatter.',sources:['https://www.nice.org.uk/guidance'],confirmNoPatientData:true};
const formatted={title:'COPD care at home',standfirst:'A practical overview of home care and questions to discuss with your treating doctor.',bodyMarkdown:'# Understanding COPD\n\nThis formatted draft preserves the existing content and its uncertainty. It uses clear headings, short paragraphs and a useful list. It does not add a new treatment recommendation or invent a reference.\n\n## What to discuss with your doctor\n\n- Review the existing care plan.\n- Ask about any unclear instructions.\n\n## Takeaway\n\nKeep the original safety cautions and seek individual advice when needed.',editorialNotes:['Verify each clinical statement against the linked source before publication.']};
(async()=>{
 let calls=0;const formatter=createFormatter({env:{AI_GATEWAY_API_KEY:'synthetic-token',AI_GATEWAY_MODEL:'test-model'},now:()=>100000,request:async(url,options)=>{calls++;assert.equal(url,'https://ai-gateway.vercel.sh/v1/chat/completions');assert.equal(options.method,'POST');assert.equal(options.redirect,'error');assert.match(options.headers.Authorization,/^Bearer /);const body=JSON.parse(options.body);assert.equal(body.max_tokens,2500);assert.equal(body.response_format.type,'json_object');assert.match(body.messages[0].content,/Do not add new clinical claims/);return{ok:true,json:async()=>({model:'test-model',usage:{total_tokens:100},choices:[{finish_reason:'stop',message:{content:JSON.stringify(formatted)}}]})};}});
 const input=validateInput(draft);assert.equal(input.sources[0],'https://www.nice.org.uk/guidance');
 const result=await formatter(draft,'owner-1');assert.equal(result.title,formatted.title);assert.equal(result.bodyMarkdown,formatted.bodyMarkdown);assert.deepEqual(result.editorialNotes,formatted.editorialNotes);assert.equal(result.model,'test-model');assert.equal(calls,1);
 await assert.rejects(()=>formatter(draft,'owner-1'),/wait 30 seconds/i,'Repeated formatting calls are throttled for the same warm instance');
 assert.throws(()=>validateInput({...draft,confirmNoPatientData:false}),/Confirm that/);
 assert.throws(()=>validateInput({...draft,sources:['http://example.org']}),/HTTPS/);
 assert.throws(()=>validateOutput({...formatted,bodyMarkdown:'<script>alert(1)</script>'}),/disallowed markup/);
 assert.throws(()=>validateOutput({...formatted,bodyMarkdown:'short'}),/validation/);
 const disabled=createFormatter({env:{},request:async()=>{throw Error('must not call');}});await assert.rejects(()=>disabled(draft,'owner-2'),/not configured/i);
 const payment=createFormatter({env:{AI_GATEWAY_API_KEY:'synthetic-token',AI_GATEWAY_MODEL:'test-model'},request:async()=>({ok:false,status:402})});await assert.rejects(()=>payment(draft,'owner-3'),/authentication or credits/i);
 console.log('AI article formatter checks passed: explicit no-patient-data consent, bounded input/output, HTTPS sources, owner-scoped throttle, gateway configuration and no-publish structured formatting.');
})().catch(e=>{console.error(e);process.exitCode=1;});
