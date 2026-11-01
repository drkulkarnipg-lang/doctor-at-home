'use strict';
const crypto=require('node:crypto');
const BASE={
 pubmed:'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi',
 pubmedSummary:'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi',
 europepmc:'https://www.ebi.ac.uk/europepmc/webservices/rest/search',
 trials:'https://clinicaltrials.gov/api/v2/studies',
 crossref:'https://api.crossref.org/works'
};
const CONFIG={
 pubmed:{name:'PubMed / MEDLINE',kind:'indexed biomedical literature',home:'https://pubmed.ncbi.nlm.nih.gov/',fields:['All specialties']},
 europepmc:{name:'Europe PMC',kind:'biomedical literature + abstracts',home:'https://europepmc.org/',fields:['All specialties']},
 clinicaltrials:{name:'ClinicalTrials.gov',kind:'registered clinical trials — not proof of efficacy',home:'https://clinicaltrials.gov/',fields:['Clinical trials']},
 crossref:{name:'Crossref',kind:'scholarly publication metadata',home:'https://search.crossref.org/',fields:['All specialties']}
};
const safeQuery=v=>String(v||'').replace(/[<>\u0000-\u001f]/g,' ').replace(/\s+/g,' ').trim().slice(0,180);
const safeUrl=v=>{try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}};
async function get(url){const c=new AbortController(),t=setTimeout(()=>c.abort(),12000);try{const r=await fetch(url,{redirect:'error',signal:c.signal,headers:{Accept:'application/json','User-Agent':'DrKulkarniClinicalResearch/1.0 (mailto:drkulkarnipg@gmail.com)'}});if(!r.ok)throw Error('Provider HTTP '+r.status);const txt=await r.text();if(txt.length>3000000)throw Error('Provider response too large');return JSON.parse(txt);}finally{clearTimeout(t);}}
const trim=(v,n=6000)=>String(v||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,n);
async function search(id,q){
 const c=CONFIG[id];if(!c)throw Error('Choose a supported research source.');
 let items=[];
 if(id==='pubmed'){
  const u=new URL(BASE.pubmed);u.search=new URLSearchParams({db:'pubmed',term:q,retmax:'12',sort:'date',retmode:'json'}).toString();
  const ids=(await get(u.href)).esearchresult?.idlist||[];
  if(ids.length){const s=new URL(BASE.pubmedSummary);s.search=new URLSearchParams({db:'pubmed',id:ids.join(','),retmode:'json'}).toString();const data=await get(s.href);items=ids.map(id=>{const x=data.result?.[id]||{};return{title:trim(x.title,800),link:'https://pubmed.ncbi.nlm.nih.gov/'+id+'/',pubDate:x.pubdate||'',description:[x.fulljournalname,x.elocationid,(x.authors||[]).slice(0,5).map(a=>a.name).join(', ')].filter(Boolean).join(' · ')};});}
 }else if(id==='europepmc'){
  const u=new URL(BASE.europepmc);u.search=new URLSearchParams({query:q,resultType:'core',pageSize:'12',format:'json',sort_date:'y'}).toString();
  const rows=(await get(u.href)).resultList?.result||[];items=rows.map(x=>({title:trim(x.title,800),link:x.doi?'https://doi.org/'+x.doi:'https://europepmc.org/article/'+encodeURIComponent(x.source||'MED')+'/'+encodeURIComponent(x.id||''),pubDate:x.firstPublicationDate||x.pubYear||'',description:[x.journalTitle,x.authorString,x.abstractText].filter(Boolean).join(' · ')}));
 }else if(id==='clinicaltrials'){
  const u=new URL(BASE.trials);u.search=new URLSearchParams({'query.term':q,pageSize:'12',format:'json',countTotal:'true','sort':'LastUpdatePostDate:desc'}).toString();
  const rows=(await get(u.href)).studies||[];items=rows.map(x=>{const p=x.protocolSection||{},idm=p.identificationModule||{},s=p.statusModule||{},d=p.designModule||{};const n=idm.nctId;return{title:trim(idm.briefTitle||idm.officialTitle,800),link:n?'https://clinicaltrials.gov/study/'+n:'https://clinicaltrials.gov/',pubDate:s.studyFirstPostDateStruct?.date||s.studyFirstPostDate||'',description:[n,s.overallStatus,(d.phases||[]).join(', '),d.studyType,idm.organization?.fullName].filter(Boolean).join(' · ')};});
 }else{
  const u=new URL(BASE.crossref);u.search=new URLSearchParams({'query.bibliographic':q,rows:'12',select:'title,author,published,published-print,published-online,container-title,DOI,type,URL'}).toString();
  const rows=(await get(u.href)).message?.items||[];items=rows.map(x=>({title:trim(x.title?.[0],800),link:safeUrl(x.URL)||(x.DOI?'https://doi.org/'+x.DOI:null),pubDate:x.published?.['date-parts']?.[0]?.join('-')||x['published-online']?.['date-parts']?.[0]?.join('-')||'',description:[x['container-title']?.[0],(x.author||[]).slice(0,5).map(a=>[a.given,a.family].filter(Boolean).join(' ')).join(', '),x.type].filter(Boolean).join(' · ')}));}
 return {source:c.name,kind:c.kind,sourceUrl:c.home,fields:c.fields,checkedAt:new Date().toISOString(),feedTitle:c.name,items:items.filter(x=>x.title&&safeUrl(x.link)).slice(0,12).map(x=>({...x,link:safeUrl(x.link)}))};
}
module.exports=async function handler(req,res){
 res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({status:'error',message:'Use GET.'});}
 const id=String(req.query?.source||''),q=safeQuery(req.query?.q||'diabetes OR cardiovascular disease OR critical care');
 if(!CONFIG[id])return res.status(400).json({status:'error',message:'Choose PubMed, Europe PMC, ClinicalTrials.gov or Crossref.'});
 if(q.length<2)return res.status(400).json({status:'error',message:'Enter at least two characters to search.'});
 try{const result=await search(id,q);return res.status(200).json({status:'ok',query:q,totalReturned:result.items.length,...result});}
 catch(e){return res.status(502).json({status:'unavailable',source:CONFIG[id].name,sourceUrl:CONFIG[id].home,message:'The research database did not respond successfully. Retry or select another database. No sample results are shown.'});}
};
module.exports.search=search;module.exports.safeQuery=safeQuery;module.exports.CONFIG=CONFIG;
