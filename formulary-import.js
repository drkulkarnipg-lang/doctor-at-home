/* Bulk catalogue support. Imported products never receive inferred prescription doses. */
(() => {
 'use strict';
 let imported=[],bundled=[],page=0,loading=null,loaded=false,catalogueError='',catalogueVersion='';
 async function ensureCatalogue(){
  if(loaded)return;if(loading)return loading;catalogueError='';
  loading=(async()=>{try{
   const response=await fetch('/assets/drugs/rxnorm-scd.json',{credentials:'same-origin'});if(!response.ok)throw Error('Catalogue could not be loaded.');const data=await response.json();
   if(data.schemaVersion!==1||data.termType!=='SCD'||!Array.isArray(data.entries)||data.entries.length!==data.count||data.count<700||data.count>50000)throw Error('Catalogue validation failed.');
   const seen=new Set();const next=data.entries.map(r=>{if(!/^\d+$/.test(r.rxcui)||typeof r.name!=='string'||!r.name.trim()||seen.has(r.rxcui))throw Error('Invalid catalogue record.');seen.add(r.rxcui);return{generic:r.name,brands:'',cat:'RxNorm formulation',code:r.rxcui,source:'https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm='+r.rxcui,rxnorm:true,timing:'',freq:'',days:'',advice:''};});
   bundled=next;catalogueVersion=data.sourceVersion;loaded=true;
  }catch(e){catalogueError=e.message;}finally{loading=null;view();}})();return loading;
 }
 window.DrugCatalogue={load:ensureCatalogue,get count(){return bundled.length;},get loaded(){return loaded;}};
 const baseDrugs=getAllDrugs;
 getAllDrugs=function(){const rows=[...baseDrugs(),...bundled,...imported];const seen=new Set();return rows.filter(d=>{const k=(d.generic+'|'+(d.brands||'')).toLowerCase();if(seen.has(k))return false;seen.add(k);return true;});};
 const dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open('kulkarniFormulary',1);r.onupgradeneeded=()=>r.result.createObjectStore('catalogue');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});dbPromise.catch(()=>{});
 async function save(rows){const db=await dbPromise;await new Promise((resolve,reject)=>{const tx=db.transaction('catalogue','readwrite');tx.objectStore('catalogue').put(rows,'drugs');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
 function csv(text){
  const rows=[];let row=[],field='',quoted=false;
  for(let i=0;i<text.length;i++){
   const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}
   else if(c===','&&!quoted){row.push(field);field='';}
   else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);if(row.some(v=>v.trim()))rows.push(row);row=[];field='';}
   else field+=c;
  }
  if(quoted)throw Error('CSV contains an unclosed quoted field.');
  row.push(field);if(row.some(v=>v.trim()))rows.push(row);if(rows.length<2)throw Error('CSV needs a header and at least one medicine.');
  const headers=rows.shift().map(h=>h.replace(/^\uFEFF/,'').trim().toLowerCase().replace(/[\s-]+/g,'_'));
  return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]||''])));
 }
 function normalized(rows){
  if(!Array.isArray(rows)||!rows.length||rows.length>10000)throw Error('Import 1–10,000 catalogue rows at a time.');
  return rows.map((row,i)=>{
   if(!row||typeof row!=='object')throw Error(`Invalid row ${i+1}.`);
   const value=(...keys)=>{for(const k of keys){if(typeof row[k]==='string'&&row[k].trim())return row[k].trim().slice(0,1500);}return '';};
   const name=value('generic','generic_name','name');if(!name)throw Error(`Row ${i+1} needs a generic or medicine name.`);
   const strength=value('strength'),form=value('form','formulation','dosage_form');
   return {generic:[name,strength,form].filter(Boolean).join(' '),brands:value('brands','brand','brand_name'),cat:value('category','cat')||'Imported catalogue',manufacturer:value('manufacturer','supplier'),source:value('source','source_url'),code:value('code','drug_code'),reviewedOn:value('reviewed_on','reviewedOn'),imported:true,timing:'',freq:'',days:'',advice:''};
  });
 }
 function view(){
  const query=(document.getElementById('dirSearch').value||'').toLowerCase();
  const all=getAllDrugs();const matches=all.filter(d=>`${d.generic} ${d.brands} ${d.cat} ${d.manufacturer||''} ${d.code||''}`.toLowerCase().includes(query));
  const status=document.getElementById('bundledCatalogueStatus');if(status){status.textContent=catalogueError?'RxNorm catalogue unavailable: '+catalogueError+' Existing medicines remain available. Use Retry.':loaded?bundled.length+' RxNorm formulations loaded. Names include strength and form; prescribing dose must be entered by the doctor.':loading?'Loading the source-labelled RxNorm catalogue…':'Open this directory or the Rx medicine picker to load the RxNorm catalogue.';}
  const pages=Math.max(1,Math.ceil(matches.length/100));page=Math.min(page,pages-1);
  const tbody=document.getElementById('drugDirBody');tbody.replaceChildren();
  matches.slice(page*100,page*100+100).forEach(d=>{
   const tr=tbody.insertRow();tr.className='border-b';
   for(const text of [d.cat,d.generic,d.brands+(d.manufacturer?' · '+d.manufacturer:'')]){const td=tr.insertCell();td.textContent=text;td.className='p-3';}
   if(d.imported||d.rxnorm){const small=document.createElement('small');small.style.display='block';small.textContent=d.rxnorm?'RxNorm '+d.code+' · formulation reference; verify local availability. Dose and frequency are not supplied.':'Imported: verify product and source. Dosing fields left blank.';tr.cells[1].appendChild(small);}
   if(d.rxnorm){const link=document.createElement('a');link.textContent='View source ↗';link.href=d.source;link.target='_blank';link.rel='noopener noreferrer';tr.cells[1].append(link);}
   const button=document.createElement('button');button.type='button';button.textContent='+ Add to Rx';button.className='bg-[#0D9488] text-white px-3 py-2 rounded-xl';
   button.onclick=()=>addDrugDirectlyToRx([d.generic,d.brands?'('+d.brands.split(',')[0]+')':''].filter(Boolean).join(' '),d.freq,d.timing,d.days,d.advice);tr.insertCell().appendChild(button);
  });
  document.getElementById('formularyCount').textContent=`${all.length} catalogue entries · ${bundled.length} RxNorm formulations${catalogueVersion?' (release '+catalogueVersion+')':''} · ${matches.length} matches · page ${page+1} of ${pages}. Formulations are not unique ingredients or verified Indian brands.`;
  document.getElementById('formularyPrev').disabled=page===0;document.getElementById('formularyNext').disabled=page>=pages-1;
 }
 const oldSwitch=switchDocTab;switchDocTab=function(name){const result=oldSwitch(name);if(name==='drugDir'){view();ensureCatalogue();}return result;};
 const oldOpen=openDrugModal;openDrugModal=function(target){oldOpen(target);ensureCatalogue().then(()=>{if(!document.getElementById('drugModal').classList.contains('hidden'))filterModalDrugs();});};
 renderDrugDirectory=view;filterDrugDirectory=function(){page=0;view();};
 // Cap picker display too, while searching the complete catalogue.
 const renderPicker=populateModalDrugs;
 populateModalDrugs=function(drugs){renderPicker(drugs.slice(0,100));if(drugs.length>100){const note=document.createElement('p');note.textContent=`Showing 100 of ${drugs.length}. Type a more specific name to find the medicine.`;document.getElementById('modalDrugList').prepend(note);}};
 function download(name,contents,type){const url=URL.createObjectURL(new Blob([contents],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 document.addEventListener('DOMContentLoaded',async()=>{
  document.getElementById('bundledCatalogueRetry').onclick=()=>ensureCatalogue();
  document.getElementById('formularyPrev').onclick=()=>{page--;view();};document.getElementById('formularyNext').onclick=()=>{page++;view();};
  document.getElementById('formularyTemplate').onclick=()=>download('formulary-import-template.csv','generic,strength,form,brands,category,manufacturer,source,code,reviewed_on\n','text/csv');
  document.getElementById('formularyExport').onclick=()=>download('formulary-backup.json',JSON.stringify({drugs:getAllDrugs().filter(d=>!d.rxnorm),bundledCatalogue:{source:'NLM Prescribable RxNorm',version:catalogueVersion,count:bundled.length}},null,2),'application/json');
  document.getElementById('formularyImport').onchange=async e=>{
   const status=document.getElementById('formularyImportStatus');try{
    const file=e.target.files[0];if(!file)return;if(file.size>20*1024*1024)throw Error('Import a file up to 20 MB.');
    const text=await file.text();const data=/\.csv$/i.test(file.name)?csv(text):JSON.parse(text.replace(/^\uFEFF/,''));const rows=normalized(Array.isArray(data)?data:data.drugs);
    const combined=[...imported];const keys=new Set(combined.map(d=>(d.generic+'|'+d.brands).toLowerCase()));let added=0;
    for(const d of rows){const k=(d.generic+'|'+d.brands).toLowerCase();if(!keys.has(k)){keys.add(k);combined.push(d);added++;}}
    if(combined.length>10000)throw Error('Catalogue capacity is 10,000 imported entries. Export a backup before reorganizing it.');
    await save(combined);imported=combined;page=0;view();status.textContent=`${added} entries added. Existing medicines retained. No prescription doses inferred.`;
   }catch(err){status.textContent=err.message;}finally{e.target.value='';}
  };
  try{const db=await dbPromise;const rows=await new Promise((resolve,reject)=>{const r=db.transaction('catalogue').objectStore('catalogue').get('drugs');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});if(Array.isArray(rows))imported=rows;view();}
  catch{document.getElementById('formularyImportStatus').textContent='Bulk catalogue storage unavailable in this browser. Existing medicines remain accessible.';view();}
 });
})();
