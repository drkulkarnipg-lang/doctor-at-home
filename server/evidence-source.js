'use strict';
const {XMLParser}=require('fast-xml-parser');
const {createHash}=require('node:crypto');
const parser=new XMLParser({ignoreAttributes:false,removeNSPrefix:true,parseTagValue:false,processEntities:false});
const flat=v=>v==null?'':typeof v==='string'||typeof v==='number'?String(v):Array.isArray(v)?v.map(flat).join(' '):Object.entries(v).filter(([k])=>!k.startsWith('@_')).map(([,x])=>flat(x)).join(' ');
const clean=v=>flat(v).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&(?:nbsp|amp|lt|gt|quot);/g,' ').replace(/\s+/g,' ').trim();
const digest=v=>createHash('sha256').update(v).digest('hex');
function canonical(value){try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.href.length>2000)return null;u.hash='';for(const k of [...u.searchParams.keys()])if(/^utm_|^(fbclid|gclid)$/i.test(k))u.searchParams.delete(k);return u.href;}catch{return null;}}
function candidate(raw,source,now=new Date()){
 const url=canonical(raw.link);if(!url)return null;
 const title=clean(raw.title).slice(0,800),snippet=clean(raw.description).slice(0,1400);if(!title)return null;
 const doi=(decodeURIComponent(url).match(/10\.\d{4,9}\/[^?#\s]+/i)||[])[0]?.replace(/[.,;)]*$/,'').toLowerCase()||null;
 const published=Number.isFinite(Date.parse(raw.pubDate))?new Date(raw.pubDate).toISOString():null;
 const alert=/retract|correction|withdraw|safety alert|recall/i.test(title);
 if(published&&(Date.parse(published)>now.getTime()+86400000||(!alert&&Date.parse(published)<now.getTime()-7*86400000)))return null;
 const key=doi?'doi:'+doi:'url:'+url;
 return{id:digest(key),key,title,url,doi,published,dateVerified:!!published,source:source.name,sourceKind:source.kind,fields:source.fields||[],snippet,alert};
}
async function readBounded(response,max=2000000){if(!response.ok)throw Error('Source unavailable');if(!response.body?.getReader){const text=await response.text();if(Buffer.byteLength(text)>max)throw Error('Source too large');return text;}const reader=response.body.getReader(),parts=[];let size=0;try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max)throw Error('Source too large');parts.push(Buffer.from(value));}return Buffer.concat(parts).toString('utf8');}finally{await reader.cancel().catch(()=>{});}}
function parseFullText(xml){if(/<!DOCTYPE|<!ENTITY/i.test(xml))throw Error('Unsupported source XML');const article=parser.parse(xml).article;if(!article?.body)throw Error('Full article body unavailable');const body=clean(article.body);if(body.length<300)throw Error('Insufficient full text');return{text:body.slice(0,14000),scope:body.length>14000?'full_text_excerpt':'full_text',truncated:body.length>14000,license:clean(article.front?.['article-meta']?.permissions).slice(0,1000)};}
async function retrieve(item,{request=fetch,now=()=>new Date()}={}){
 const base={text:item.snippet,scope:'rss_excerpt',truncated:false,url:item.url,retrievedAt:now().toISOString(),identityVerified:false,correctionStatus:'not_checked',license:'Not established'};
 try{
  // Exact DOI match only. No fuzzy title matching and no arbitrary source URL fetching.
  if(!item.doi)return{...base,note:'No exact DOI available; open and verify the original source.'};
  const url='https://www.ebi.ac.uk/europepmc/webservices/rest/search?format=json&resultType=core&query='+encodeURIComponent('DOI:"'+item.doi+'"');
  const raw=await readBounded(await request(url,{redirect:'error',signal:AbortSignal.timeout(15000)}),500000),results=JSON.parse(raw).resultList?.result||[];
  const match=results.find(r=>String(r.doi||'').toLowerCase()===item.doi);if(!match)return{...base,note:'Exact DOI was not found in Europe PMC.'};
  const verified={...base,identityVerified:true,doi:item.doi,pmid:match.id||null,pmcid:match.pmcid||null,correctionStatus:'physician_check_required',articleType:match.pubTypeList?.pubType||[]};
  if(match.isOpenAccess==='Y'&&/^PMC\d+$/.test(match.pmcid||'')){
   try{const xml=await readBounded(await request('https://www.ebi.ac.uk/europepmc/webservices/rest/'+match.pmcid+'/fullTextXML',{redirect:'error',signal:AbortSignal.timeout(15000)}));return{...verified,...parseFullText(xml)};}catch{/* An abstract fallback must remain labelled as such. */}
  }
  const abstract=clean(match.abstractText||'');return abstract?{...verified,text:abstract.slice(0,14000),scope:'abstract',truncated:abstract.length>14000}:{...verified,note:'No accessible abstract or open full text.'};
 }catch{return{...base,note:'Source retrieval failed; no full-text reading is claimed.'};}
}
module.exports={candidate,canonical,clean,digest,readBounded,parseFullText,retrieve};
