'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {PDFDocument,StandardFonts}=require('pdf-lib');
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
  const source=await PDFDocument.create(),font=await source.embedFont(StandardFonts.Helvetica);
  for(let i=0;i<23;i++){const page=source.addPage([300+i,500+i]);page.drawText('OFFICIAL FORM PAGE '+i,{x:20,y:20,font,size:12});}
  const sourceBytes=await source.save();assert.ok(sourceBytes.length>1000,'Synthetic source PDF passes the minimum-size safety check');let fetchCount=0;
  global.fetch=async(url,options)=>{fetchCount++;assert.match(String(url),/dc\.crsorgi\.gov\.in\/assets\/download\/all_forms_CRS_2019_new\.pdf/);assert.ok(options.signal);return{ok:true,arrayBuffer:async()=>sourceBytes};};
  for(const [form,index,filename] of [['2',4,'Form_2_Official_Blank.pdf'],['4',8,'Form_4_Official_Blank.pdf'],['4a',10,'Form_4A_Official_Blank.pdf']]){
   const res=await invoke(form);assert.equal(res.statusCode,200);assert.equal(res.headers['content-type'],'application/pdf');assert.match(res.headers['content-disposition'],new RegExp(filename));assert.ok(Buffer.isBuffer(res.body));
   const out=await PDFDocument.load(res.body);assert.equal(out.getPageCount(),1,form+' must download as a separate one-page official form');assert.equal(out.getPage(0).getWidth(),300+index);assert.equal(out.getPage(0).getHeight(),500+index);
  }
  assert.equal(fetchCount,1,'Official source PDF is cached per warm function instance');
  const page=fs.readFileSync('index.html','utf8');for(const form of ['2','4','4a'])assert.ok(page.includes('/api/official-form-pdf?form='+form),'Separate official Form '+form+' download link exists');assert.ok(page.includes('https://dc.crsorgi.gov.in/assets/download/all_forms_CRS_2019_new.pdf'),'Complete official CRS forms PDF remains directly accessible');assert.ok(page.includes('https://cdnbbsr.s3waas.gov.in/s3f3ac63c91272f19ce97c7397825cc15f/uploads/2026/03/2026032088191524.pdf'),'Official Maharashtra CRS handbook (2026) remains directly accessible');assert.ok(page.includes('Maharashtra CRS handbook (2026)'),'State-specific reference link is clearly labelled');assert.ok(page.includes('reverse-side instructions remain in the complete official CRS PDF reference above'),'UI explains that reverse-side instructions are in the full official reference');
  const bad=await invoke('999');assert.equal(bad.statusCode,400);
  const method=await invoke('4','POST');assert.equal(method.statusCode,405);assert.equal(method.headers.allow,'GET');
  console.log('Official Form 2, Form 4 and Form 4A single-page extraction checks passed.');
 }finally{global.fetch=originalFetch;}
})().catch(error=>{console.error(error);process.exitCode=1;});
