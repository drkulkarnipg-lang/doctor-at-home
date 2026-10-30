'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
(async()=>{
const dom=new JSDOM(fs.readFileSync('index.html','utf8'),{url:'https://clinic.example.test/',runScripts:'outside-only'}),w=dom.window;
w.renderPublishedArticles=()=>{};w.URL.createObjectURL=()=> 'blob:synthetic';w.URL.revokeObjectURL=()=>{};
const calls=[],pdfOptions=[];Object.defineProperty(w.navigator,'canShare',{configurable:true,value:()=>true});Object.defineProperty(w.navigator,'share',{configurable:true,value:async payload=>{calls.push(payload);if(calls.length===1)throw Object.assign(new Error('share fallback test'),{name:'NotAllowedError'});}});
w.html2pdf=()=>{const worker={set(options){pdfOptions.push(options);return this;},from(){return this;},toPdf(){return this;},get:async()=>({internal:{getNumberOfPages:()=>1,pageSize:{getWidth:()=>210,getHeight:()=>297}},setPage(){},setFont(){},setFontSize(){},setTextColor(){},text(){}}),outputPdf:async()=>new w.Blob(['%PDF-1.4\\n'+'x'.repeat(700)],{type:'application/pdf'})};return worker;};
const source=w.document.createElement('article');source.id='intakeDocument';source.textContent='Synthetic complete pre-visit history';w.document.body.append(source);
const attachment=new w.File(['synthetic original prescription'],'latest-prescription.pdf',{type:'application/pdf'});
w.eval(fs.readFileSync('document-provenance.js','utf8'));w.eval(fs.readFileSync('document-sharing.js','utf8'));await new Promise(r=>setTimeout(r,25));
await w.shareDocumentPdf('intakeDocument','Pre_visit_patient_history',{direct:true,attachments:[attachment]});
assert.equal(calls.length,1);assert.equal(calls[0].files.length,2);assert.equal(calls[0].files[1],attachment);assert.equal(w.document.getElementById('pdfShareDialog').hidden,false);
w.document.getElementById('pdfNativeShare').click();await new Promise(r=>setTimeout(r,20));assert.equal(calls.length,2);assert.equal(calls[1].files.length,2,'dialog fallback must retain both the generated history and original file');assert.equal(calls[1].files[1],attachment);assert.match(w.document.getElementById('pdfShareStatus').textContent,/passed to the selected sharing app/i);
await w.shareDocumentPdf('rxSheet','Prescription',{direct:true});assert.deepEqual(Array.from(pdfOptions.at(-1).margin),[8,8,8,8],'Prescription uses compact margins without a footer reserve');const rxClone=w.buildDocumentPdfClone('rxSheet');assert.equal(rxClone.querySelector('.document-origin'),null,'Prescription clone excludes the website provenance footer');await w.shareDocumentPdf('cert-form4','Form_4',{direct:true});assert.deepEqual(Array.from(pdfOptions.at(-1).margin),[8,8,8,8],'Government forms use compact margins');const formClone=w.buildDocumentPdfClone('cert-form4');assert.equal(formClone.querySelector('.document-origin'),null,'Government form clone excludes website provenance');
dom.window.close();console.log('Document sharing tests passed: selected original files remain attached after direct share fails and the user retries from the share dialog.');
})().catch(e=>{console.error(e);process.exitCode=1;});
