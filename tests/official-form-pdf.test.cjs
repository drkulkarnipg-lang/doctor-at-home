'use strict';
const assert=require('node:assert/strict');
const {PDFDocument}=require('pdf-lib');
const handler=require('../api/official-form-pdf.js');

function response(){
 const headers={};return{headers,statusCode:200,body:null,setHeader(k,v){headers[k.toLowerCase()]=v;},status(n){this.statusCode=n;return this;},send(v){this.body=v;return this;},json(v){this.body=v;return this;}};
}
async function invoke(form,method='GET'){
 const res=response();await handler({method,query:form===undefined?{}:{form}},res);return res;
}
(async()=>{
 const originalFetch=global.fetch;
 try{
  const source=await PDFDocument.create();
  for(let i=0;i<23;i++)source.addPage([300+i,500+i]);
  const sourceBytes=await source.save();let fetchCount=0;
  global.fetch=async(url,options)=>{fetchCount++;assert.match(String(url),/dc\.crsorgi\.gov\.in\/assets\/download\/all_forms_CRS_2019_new\.pdf/);assert.ok(options.signal);return{ok:true,arrayBuffer:async()=>sourceBytes};};
  for(const [form,index,filename] of [['2',4,'Form_2_Official_Blank.pdf'],['4',8,'Form_4_Official_Blank.pdf'],['4a',10,'Form_4A_Official_Blank.pdf']]){
   const res=await invoke(form);assert.equal(res.statusCode,200);assert.equal(res.headers['content-type'],'application/pdf');assert.match(res.headers['content-disposition'],new RegExp(filename));assert.ok(Buffer.isBuffer(res.body));
   const out=await PDFDocument.load(res.body);assert.equal(out.getPageCount(),1,form+' must download as a separate one-page official form');assert.equal(out.getPage(0).getWidth(),300+index);assert.equal(out.getPage(0).getHeight(),500+index);
  }
  assert.equal(fetchCount,1,'Official source PDF is cached per warm function instance');
  const bad=await invoke('999');assert.equal(bad.statusCode,400);
  const method=await invoke('4','POST');assert.equal(method.statusCode,405);assert.equal(method.headers.allow,'GET');
  console.log('Official Form 2, Form 4 and Form 4A single-page extraction checks passed.');
 }finally{global.fetch=originalFetch;}
})().catch(error=>{console.error(error);process.exitCode=1;});
