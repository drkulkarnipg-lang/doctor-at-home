'use strict';
const {XMLParser}=require('fast-xml-parser');
const SOURCES={
 criticalcare:{name:'Critical Care',url:'https://link.springer.com/search.rss?facet-journal-id=13054&sortOrder=newestFirst',home:'https://link.springer.com/journal/13054',kind:'journal feed',hosts:['link.springer.com','link.springernature.com']},
 medicalxpress:{name:'Medical Xpress',url:'https://medicalxpress.com/rss-feed/',home:'https://medicalxpress.com/',kind:'research news',hosts:['medicalxpress.com']},
 nejm:{name:'NEJM',url:'https://www.nejm.org/action/showFeed?jc=nejm&type=etoc&feed=rss',home:'https://www.nejm.org/',kind:'journal feed',hosts:['www.nejm.org']},
 lancet:{name:'The Lancet',url:'https://www.thelancet.com/action/showFeed?jc=lancet&type=etoc&feed=rss',home:'https://www.thelancet.com/',kind:'journal feed',hosts:['www.thelancet.com']},
 cdc:{name:'CDC Newsroom',url:'https://tools.cdc.gov/api/v2/resources/media/132608.rss',home:'https://www.cdc.gov/media/',kind:'public health news',hosts:['tools.cdc.gov']}
};
const parser=new XMLParser({ignoreAttributes:false,removeNSPrefix:true,parseTagValue:false,processEntities:true,trimValues:true});
const text=v=>typeof v==='string'?v:typeof v==='number'?String(v):v&&typeof v==='object'?text(v['#text']):'';
const arr=v=>Array.isArray(v)?v:v?[v]:[];
function https(v){try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}}
function parseFeed(xml){
 if(typeof xml!=='string'||xml.length>2000000||/<!DOCTYPE|<!ENTITY/i.test(xml))throw Error('Unsupported feed document');
 const d=parser.parse(xml),c=d.rss?.channel;if(!c&&!d.feed&&!d.RDF)throw Error('Publisher returned a page instead of RSS/Atom');
 return{title:text(c?.title||d.feed?.title),items:arr(c?.item||d.feed?.entry||d.RDF?.item).slice(0,12).map(i=>({title:text(i.title).slice(0,800),link:https(typeof i.link==='object'?arr(i.link).find(l=>!l['@_rel']||l['@_rel']==='alternate')?.['@_href']:text(i.link)),pubDate:text(i.pubDate||i.published||i.updated||i.date).slice(0,80),description:text(i.description||i.summary||i.encoded||i.content).slice(0,6000)})).filter(i=>i.title&&i.link)};
}
async function fetchFeed(source){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),9000);
 try{let url=source.url,response;
  for(let hop=0;hop<4;hop++){const u=new URL(url);if(u.protocol!=='https:'||!source.hosts.includes(u.hostname)||u.username||u.password)throw Error('Unexpected redirect');
   response=await fetch(url,{redirect:'manual',signal:controller.signal,headers:{Accept:'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9','User-Agent':'DrKulkarniResearchReader/1.0'}});
   if([301,302,303,307,308].includes(response.status)){url=new URL(response.headers.get('location'),url).href;continue;}break;}
  if(!response?.ok)throw Error('Publisher response '+response?.status);
  const reader=response.body.getReader(),chunks=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>2000000){await reader.cancel();throw Error('Feed too large');}chunks.push(Buffer.from(value));}
  return parseFeed(Buffer.concat(chunks).toString('utf8'));
 }finally{clearTimeout(timer);}
}
async function handler(req,res){
 res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({status:'error',message:'Use GET.'});}
 const id=String(req.query?.source||'criticalcare'),source=Object.hasOwn(SOURCES,id)?SOURCES[id]:null;
 if(!source)return res.status(400).json({status:'error',message:'Choose a listed publisher. Custom URLs are not accepted.'});
 try{const d=await fetchFeed(source);if(!d.items.length)throw Error('No readable items');res.setHeader('Cache-Control','public, s-maxage=600, stale-while-revalidate=1800');return res.status(200).json({status:'ok',source:source.name,kind:source.kind,sourceUrl:source.home,checkedAt:new Date().toISOString(),feedTitle:d.title,items:d.items});}
 catch(e){res.setHeader('Cache-Control','no-store');return res.status(502).json({status:'unavailable',source:source.name,sourceUrl:source.home,message:'This publisher feed is unavailable. Open the original source or choose another feed. No separate internet connection is needed.'});}
}
module.exports=handler;module.exports.parseFeed=parseFeed;
