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
assert.ok(w.document.getElementById('tabShareDesk'),'Workstation must expose a dedicated Share Desk tab.');
assert.ok(w.document.getElementById('viewShareDesk'),'Share Desk workspace must be present.');
for(const label of ['Prescription','Laboratory requisition','Radiology requisition','Invoice / receipt','Certificates','Patient articles','Share any file'])assert.ok(w.document.getElementById('viewShareDesk').textContent.includes(label),'Share Desk must expose '+label+'.');
assert.match(w.document.getElementById('viewShareDesk').innerHTML,/onclick="shareDeskDocument\('rx'\)"/);

await w.shareDocumentPdf('intakeDocument','Pre_visit_patient_history',{direct:true,attachments:[attachment]});
assert.equal(calls.length,1);assert.equal(calls[0].files.length,2);assert.equal(calls[0].files[1],attachment);assert.equal(w.document.getElementById('pdfShareDialog').hidden,false);
w.document.getElementById('pdfNativeShare').click();await new Promise(r=>setTimeout(r,20));assert.equal(calls.length,2);assert.equal(calls[1].files.length,2,'dialog fallback must retain both the generated history and original file');assert.equal(calls[1].files[1],attachment);assert.match(w.document.getElementById('pdfShareStatus').textContent,/passed to the selected sharing app/i);assert.equal(w.document.getElementById('pdfShareDialog').hidden,true,'successful fallback share must close the modal instead of appearing stuck');
await w.shareDocumentPdf('rxSheet','Prescription',{direct:true});assert.deepEqual(Array.from(pdfOptions.at(-1).margin),[8,8,8,8],'Prescription uses compact margins without a footer reserve');const rxClone=w.buildDocumentPdfClone('rxSheet');assert.equal(rxClone.querySelector('.document-origin'),null,'Prescription clone excludes the website provenance footer');await w.shareDocumentPdf('cert-form4','Form_4',{direct:true});assert.deepEqual(Array.from(pdfOptions.at(-1).margin),[8,8,8,8],'Government forms use compact margins');const formClone=w.buildDocumentPdfClone('cert-form4');assert.ok(formClone.querySelector('.document-origin'),'Editable statutory working layouts must retain the legal-status disclaimer');assert.match(formClone.querySelector('.document-origin').textContent,/Working layout: certifier must complete, sign and verify the receiving Registrar requirements\. Not an issued civil death certificate\./);

const deskCalls=[];w.shareDocumentPdf=(...args)=>{deskCalls.push(args);return Promise.resolve();};
w.shareDeskDocument('rx');w.shareDeskDocument('path');w.shareDeskDocument('rad');
assert.equal(deskCalls.length,3,'Prescription, lab and radiology share buttons must invoke the PDF share pipeline.');
assert.deepEqual(deskCalls.map(x=>x[0]),['rxSheet','pathSlipSheet','radSlipSheet']);
w.shareDeskInvoice();assert.equal(deskCalls.at(-1)[0],'invoiceSheet','Invoice share button must target the invoice PDF.');
for(const [type,id] of [['referral','cdoc-referral'],['consent','cdoc-consent'],['fitness','cdoc-fitness'],['leave','cdoc-leave'],['form4','cert-form4'],['form4a','cert-form4a'],['form2','cert-form2']]){w.document.getElementById('shareDeskCertificate').value=type;w.shareDeskCertificate();assert.equal(deskCalls.at(-1)[0],id,'Certificate share must target '+type+'.');}
const article=w.document.createElement('article');article.id='publicArticle_0';article.innerHTML='<h3>Test patient article</h3>';w.document.getElementById('publicGuidanceSection').append(article);
w.document.getElementById('shareDeskArticle').innerHTML='<option value="publicArticle_0">Test patient article</option>';w.document.getElementById('shareDeskArticle').value='publicArticle_0';w.shareDeskArticle();assert.equal(deskCalls.at(-1)[0],'publicArticle_0','Article share button must target the selected patient article.');
const localFile=new w.File(['private local report'],'local-lab-report.pdf',{type:'application/pdf'});
const fileInput=w.document.getElementById('shareDeskFile');Object.defineProperty(fileInput,'files',{configurable:true,value:[localFile]});
let arbitraryFileNetworkCalls=0;w.fetch=async()=>{arbitraryFileNetworkCalls++;throw new Error('Unexpected upload/network call from local-file Share Desk action.');};
const beforeLocalShare=calls.length;await w.shareDeskAnyFile();assert.equal(calls.length,beforeLocalShare+1,'Arbitrary local file must be passed to the native share sheet only after the Share Desk action.');assert.equal(calls.at(-1).files[0],localFile,'The selected original local File must be shared without replacing or uploading it.');assert.equal(calls.at(-1).title,localFile.name);assert.match(w.document.getElementById('shareDeskStatus').textContent,/handed to the selected sharing app/i);assert.equal(arbitraryFileNetworkCalls,0,'Arbitrary local-file sharing must not upload the file.');
Object.defineProperty(w.navigator,'canShare',{configurable:true,value:()=>false});const beforeUnsupportedShare=calls.length;await w.shareDeskAnyFile();assert.equal(calls.length,beforeUnsupportedShare,'Unsupported browsers must not attempt a share or upload.');assert.match(w.document.getElementById('shareDeskStatus').textContent,/not been uploaded or sent/i);
Object.defineProperty(fileInput,'files',{configurable:true,value:[]});await w.shareDeskAnyFile();assert.match(w.document.getElementById('shareDeskStatus').textContent,/Choose a file first/i);
dom.window.close();console.log('Document sharing tests passed: selected original files remain attached after direct share fails and the user retries from the share dialog.');
})().catch(e=>{console.error(e);process.exitCode=1;});
