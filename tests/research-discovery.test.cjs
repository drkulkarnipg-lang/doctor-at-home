'use strict';
const assert=require('node:assert/strict');
const api=require('../api/research-discovery.js');
const {sources}=require('../research-sources.js');
const mkres=()=>({headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(v){this.data=v;return this;}});
(async()=>{
for(const id of ['pubmed','europepmc','clinicaltrials','crossref'])assert.ok(sources[id]?.mode==='api','Fetch selector includes live API '+id);
assert.equal(api.safeQuery('<script> diabetes </script>'),'script diabetes');
assert.equal(api.safeQuery('x'.repeat(250)).length,180);
const original=global.fetch;
try{
global.fetch=async url=>{
 const u=new URL(url);
 if(u.hostname==='eutils.ncbi.nlm.nih.gov'&&u.pathname.endsWith('esearch.fcgi'))return new Response(JSON.stringify({esearchresult:{idlist:['12345']}}));
 if(u.hostname==='eutils.ncbi.nlm.nih.gov'&&u.pathname.endsWith('esummary.fcgi'))return new Response(JSON.stringify({result:{'12345':{title:'A clinical trial',pubdate:'2026',fulljournalname:'Journal',authors:[{name:'Author'}]}}}));
 if(u.hostname==='www.ebi.ac.uk')return new Response(JSON.stringify({resultList:{result:[{title:'An abstract',doi:'10.1000/test',abstractText:'Study abstract',journalTitle:'Journal',firstPublicationDate:'2026-01-01'}]}}));
 if(u.hostname==='clinicaltrials.gov')return new Response(JSON.stringify({studies:[{protocolSection:{identificationModule:{nctId:'NCT12345678',briefTitle:'Trial title'},statusModule:{overallStatus:'RECRUITING',studyFirstPostDateStruct:{date:'2026-01-01'}},designModule:{phases:['PHASE3'],studyType:'INTERVENTIONAL'}}}]}));
 if(u.hostname==='api.crossref.org')return new Response(JSON.stringify({message:{items:[{title:['Crossref paper'],DOI:'10.1000/crossref',URL:'https://doi.org/10.1000/crossref',type:'journal-article',published:{'date-parts':[[2026,1,1]]},'container-title':['Journal']}]}}));
 throw Error('Unexpected provider '+u.hostname);
};
for(const id of ['pubmed','europepmc','clinicaltrials','crossref']){
 const result=await api.search(id,'diabetes');
 assert.equal(result.items.length,1,id+' returns one mapped result');
 assert.ok(result.items[0].title,id+' maps a title');
 assert.ok(result.items[0].link.startsWith('https://'),id+' maps HTTPS link');
}
const res=mkres();await api({method:'GET',query:{source:'__proto__',q:'diabetes'}},res);assert.equal(res.code,400);
const good=mkres();await api({method:'GET',query:{source:'clinicaltrials',q:'diabetes'}},good);assert.equal(good.code,200);assert.equal(good.data.items[0].title,'Trial title');
}finally{global.fetch=original;}
const fs=require('node:fs'),ui=fs.readFileSync(require('node:path').join(__dirname,'../research-feed.js'),'utf8');
assert.match(ui,/api\/research-discovery\?source=/,'Fetch UI must call live research discovery route for API-backed sources');
assert.match(ui,/rssResearchQuery/,'Fetch UI must expose a disease / biomarker / drug query');
assert.match(ui,/mode==='api'/,'Fetch UI must distinguish live databases from RSS feeds');
console.log('Live research discovery checks passed: PubMed, Europe PMC, ClinicalTrials.gov and Crossref API mappings, safe query handling and same-origin Fetch UI.');
})().catch(e=>{console.error(e);process.exitCode=1;});
