'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
(async()=>{const dom=new JSDOM('<main id="doctorWorkstation"></main>',{runScripts:'outside-only',url:'https://clinic.example/'}),w=dom.window,calls=[],legacy=[];
w.shareDocumentPdf=async(...args)=>(calls.push(args),'ready');w.exportToPdf=(...args)=>(legacy.push(args),'legacy');
w.eval(fs.readFileSync('clinical-document-workflow.js','utf8'));
for(const id of w.ClinicalDocumentWorkflow.documents.keys()){
 await w.exportToPdf(id,'Test');assert.equal(calls.at(-1)[0],id);assert.equal(calls.at(-1)[2].direct,false);
 await w.shareDocumentPdf(id,'Test',{direct:true,recipientPhone:'0000000000'});assert.equal(calls.at(-1)[0],id);assert.equal(calls.at(-1)[2].direct,false);assert.equal(calls.at(-1)[2].recipientPhone,'0000000000');
}
assert.equal(w.exportToPdf('publicArticle_0','Article'),'legacy','Existing public article download remains available');
await w.shareDocumentPdf('intakeDocument','History',{direct:true});assert.equal(calls.at(-1)[2].direct,true,'Nonclinical sharing keeps its existing explicit options');
assert.equal(legacy.length,1);dom.window.close();console.log('All 11 clinical document types share one PDF-ready path for Prepare/Share; recipient options and legacy public downloads retained.');
})().catch(e=>{console.error(e);process.exitCode=1});
