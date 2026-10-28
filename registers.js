/* Doctor desk registers: Patient Register, Stock Register, Death Register.
   Entries stay in this browser (localStorage) on the doctor's device. Use "Export backup" regularly.
   No entry can be deleted: a wrong entry is edited or cancelled (struck through but kept). */
(()=>{'use strict';
const KEY='hvicu.registers.v1';
const $=id=>document.getElementById(id);
const node=(tag,text,parent,cls)=>{const e=document.createElement(tag);if(text!==undefined&&text!==null&&text!=='')e.textContent=text;if(cls)e.className=cls;if(parent)parent.append(e);return e;};
const FOOT='© Dr Pramod G Kulkarni · Home Visiting ICU Doctor · Emergency and HomeCare Specialist · BAMS, PGDEMS · Reg. No. I-24809-A-1 · +91 95613 94341 · drkulkarnipg@gmail.com';
const pad=(n,w)=>String(n).padStart(w,'0');
function todayISO(){try{const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(new Date());return p;}catch(e){return new Date().toISOString().slice(0,10);}}
function nowTime(){try{return new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());}catch(e){return '';}}
function dmy(iso){return /^\d{4}-\d{2}-\d{2}$/.test(iso||'')?iso.split('-').reverse().join('-'):(iso||'');}
const money=v=>v===''||v==null?'':'₹ '+Number(v).toLocaleString('en-IN');

const REG={
 patient:{title:'Patient Register',prefix:'PR',note:'Every patient seen, in the order seen.',
  fields:[
   {k:'date',l:'Date',t:'date',req:1,def:'today'},{k:'time',l:'Time',t:'time',def:'now'},
   {k:'name',l:'Patient name',t:'text',req:1,wide:1},{k:'age',l:'Age',t:'text',ph:'e.g. 67 years'},
   {k:'sex',l:'Sex',t:'select',o:['Female','Male','Other']},{k:'mobile',l:'Mobile',t:'tel'},
   {k:'visit',l:'Type of visit',t:'select',o:['Home visit','Online consultation','Telephone advice','Clinic']},{k:'fee',l:'Fee (₹)',t:'number'},
   {k:'address',l:'Address with landmark',t:'textarea',wide:1},
   {k:'complaint',l:'Complaint and provisional diagnosis',t:'textarea',wide:1},
   {k:'treatment',l:'Treatment and advice',t:'textarea',wide:1},
   {k:'remarks',l:'Remarks',t:'text',wide:1}],
  cols:[['No.',e=>e.no],['Date',e=>dmy(e.date)+(e.time?'\n'+e.time:'')],['Patient',e=>[e.name,[e.age,e.sex].filter(Boolean).join(' / '),e.address].filter(Boolean).join('\n')],['Mobile',e=>e.mobile,'tel'],['Visit',e=>e.visit],['Complaint / diagnosis',e=>e.complaint],['Treatment / advice',e=>e.treatment+(e.remarks?'\nRemarks: '+e.remarks:'')],['Fee',e=>money(e.fee)]]},
 stock:{title:'Stock Register',prefix:'SR',note:'Medicines and consumables: received, issued and balance.',
  fields:[
   {k:'date',l:'Date',t:'date',req:1,def:'today'},{k:'txn',l:'Entry type',t:'select',o:['Received','Issued','Expired / discarded'],req:1},
   {k:'item',l:'Item (medicine / consumable)',t:'text',req:1,wide:1},{k:'strength',l:'Strength / size',t:'text',ph:'e.g. 500 mg, 18 Fr'},
   {k:'unit',l:'Unit',t:'select',o:['Tablet','Capsule','Strip','Vial','Ampoule','Bottle','Tube','Piece','Pack'],req:1},
   {k:'qty',l:'Quantity',t:'number',req:1},{k:'batch',l:'Batch no.',t:'text'},
   {k:'expiry',l:'Expiry (month and year)',t:'month'},{k:'rate',l:'Rate per unit (₹)',t:'number'},
   {k:'party',l:'Supplier / issued to',t:'text',wide:1},{k:'remarks',l:'Remarks',t:'text',wide:1}],
  cols:[['No.',e=>e.no],['Date',e=>dmy(e.date)],['Item',e=>[e.item,e.strength].filter(Boolean).join(' · ')],['Entry',e=>e.txn],['Quantity',e=>e.qty===''?'':e.qty+' '+e.unit],['Batch / expiry',e=>[e.batch,e.expiry&&('exp. '+e.expiry.split('-').reverse().join('-'))].filter(Boolean).join('\n')],['Supplier / issued to',e=>e.party],['Balance',(e,ctx)=>ctx.balance(e)],['Remarks',e=>e.remarks]]},
 death:{title:'Death Register',prefix:'DR',note:'Deaths attended or certified. Statutory Forms 4A, 4 and 2 are in the Death Certificates tab.',
  fields:[
   {k:'date',l:'Date of death',t:'date',req:1,def:'today'},{k:'time',l:'Time of death',t:'time'},
   {k:'name',l:'Name of the deceased',t:'text',req:1,wide:1},{k:'age',l:'Age',t:'text',ph:'e.g. 82 years'},
   {k:'sex',l:'Sex',t:'select',o:['Female','Male','Other']},{k:'place',l:'Place of death',t:'select',o:['Home','Hospital','On the way','Other']},
   {k:'lastSeen',l:'Date last seen alive by the doctor',t:'date'},
   {k:'address',l:'Address of the deceased',t:'textarea',wide:1},
   {k:'cause',l:'Cause of death as certified',t:'textarea',wide:1},
   {k:'form',l:'Certificate issued',t:'select',o:['Form 4A','Form 4','Form 2','Not issued']},{k:'certNo',l:'Certificate / reference no.',t:'text'},
   {k:'informant',l:'Informant: name and relationship',t:'text',wide:1},{k:'mobile',l:'Informant mobile',t:'tel'},
   {k:'remarks',l:'Remarks',t:'text',wide:1}],
  cols:[['No.',e=>e.no],['Date / time of death',e=>dmy(e.date)+(e.time?'\n'+e.time:'')],['Deceased',e=>[e.name,[e.age,e.sex].filter(Boolean).join(' / '),e.address].filter(Boolean).join('\n')],['Place',e=>e.place],['Cause of death',e=>e.cause],['Certificate',e=>[e.form,e.certNo].filter(Boolean).join('\n')],['Informant',e=>[e.informant,e.mobile].filter(Boolean).join('\n')],['Remarks',e=>e.remarks+(e.lastSeen?'\nLast seen alive: '+dmy(e.lastSeen):'')]]}
};

let db={patient:[],stock:[],death:[]},memoryOnly=false,current='patient',editingId=null,query='';
function load(){try{const raw=localStorage.getItem(KEY);if(raw){const d=JSON.parse(raw);for(const k of Object.keys(db))if(Array.isArray(d[k]))db[k]=d[k];}}catch(e){memoryOnly=true;}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(db));memoryOnly=false;return true;}catch(e){memoryOnly=true;return false;}}

function nextNo(reg,date){const year=(date||todayISO()).slice(0,4);const n=db[reg].filter(e=>(e.no||'').split('/')[1]===year).length+1;return REG[reg].prefix+'/'+year+'/'+pad(n,4);}
function itemKey(e){return [e.item,e.strength,e.unit].map(s=>String(s||'').trim().toLowerCase()).join('|');}
function balances(){const run={},per={};for(const e of db.stock){if(e.cancelled)continue;const q=Number(e.qty)||0;run[itemKey(e)]=(run[itemKey(e)]||0)+(e.txn==='Received'?q:-q);per[e.id]=run[itemKey(e)];}return{per,run};}
function ctxFor(reg){if(reg!=='stock')return{};const b=balances();return{balance:e=>e.cancelled?'':String(b.per[e.id]),totals:b.run};}

function matches(e){if(!query)return true;const q=query.toLowerCase();return Object.values(e).some(v=>String(v).toLowerCase().includes(q));}

/* ---------- screen ---------- */
let host,formBox,tableBox,statusEl,summaryBox,navButtons={};
function status(msg){if(statusEl)statusEl.textContent=msg;if(msg&&typeof window.showToast==='function')window.showToast(msg);}

function buildFormFields(reg,entry){formBox.replaceChildren();const cfg=REG[reg];const form=node('form','',formBox,'rg-form');form.autocomplete='off';
 const title=node('h4',entry?'Edit entry '+entry.no:'New entry',form);title.className='rg-form-title';
 const grid=node('div','',form,'rg-grid');
 for(const f of cfg.fields){const wrap=node('label','',grid,f.wide?'rg-wide':'');node('span',f.l+(f.req?' *':''),wrap);let e;
  if(f.t==='select'){e=node('select','',wrap);for(const o of ['',...f.o]){const op=node('option',o||'Choose',e);op.value=o;}}
  else if(f.t==='textarea'){e=node('textarea','',wrap);e.rows=2;e.maxLength=1000;}
  else{e=node('input','',wrap);e.type=f.t;if(f.t==='number'){e.min='0';e.step='any';e.inputMode='decimal';}if(f.t==='tel'){e.inputMode='tel';e.maxLength=20;}else if(f.t==='text')e.maxLength=300;if(f.ph)e.placeholder=f.ph;}
  e.name=f.k;e.id='rg-'+reg+'-'+f.k;e.required=!!f.req&&f.t!=='select';
  const v=entry?entry[f.k]:(f.def==='today'?todayISO():f.def==='now'?nowTime():'');e.value=v==null?'':v;}
 const actions=node('div','',form,'rg-actions');
 const submit=node('button',entry?'Save changes':'Add entry',actions);submit.type='submit';submit.className='rg-primary';
 if(entry){const cancel=node('button','Cancel editing',actions);cancel.type='button';cancel.onclick=()=>{editingId=null;buildFormFields(reg,null);status('Editing cancelled. Nothing was changed.');};}
 form.onsubmit=ev=>{ev.preventDefault();const rec={};for(const f of cfg.fields){const el=$('rg-'+reg+'-'+f.k);rec[f.k]=(el.value||'').trim();}
  for(const f of cfg.fields)if(f.req&&!rec[f.k]){status(f.l+' is required.');$('rg-'+reg+'-'+f.k).focus();return;}
  if(reg==='stock'&&!(Number(rec.qty)>0)){status('Quantity must be more than zero.');$('rg-stock-qty').focus();return;}
  if(entry){Object.assign(entry,rec,{edited:new Date().toISOString()});}
  else{db[reg].push(Object.assign({id:reg+Date.now().toString(36)+Math.random().toString(36).slice(2,6),no:nextNo(reg,rec.date),created:new Date().toISOString()},rec));}
  const ok=save();editingId=null;buildFormFields(reg,null);renderAll();
  status((entry?'Entry updated. ':'Entry added. ')+(ok?'Saved on this device.':'Could not save on this device: this browser blocks storage. Export a backup now.'));};
 return form;}

function renderTable(reg){tableBox.replaceChildren();const cfg=REG[reg],ctx=ctxFor(reg);const rows=db[reg].filter(matches);
 const wrap=node('div','',tableBox,'rg-scroll');const t=node('table','',wrap,'rg-table');const head=node('thead','',t).appendChild(document.createElement('tr'));
 for(const c of cfg.cols)node('th',c[0],head);node('th','Action',head).className='rg-noprint';
 const body=node('tbody','',t);
 if(!rows.length){const tr=node('tr','',body),td=node('td',db[reg].length?'No entry matches the search.':'No entries yet. Add the first entry above.',tr);td.colSpan=cfg.cols.length+1;td.className='rg-empty';}
 for(const e of rows.slice().reverse()){const tr=node('tr','',body);if(e.cancelled)tr.className='rg-cancelled';
  for(const c of cfg.cols){const td=node('td','',tr);td.dataset.label=c[0];const v=String(c[1](e,ctx)||'');
   if(c[2]==='tel'&&v){const a=node('a',v,td);a.href='tel:'+v.replace(/[^\d+]/g,'');}else td.textContent=v;}
  const act=node('td','',tr,'rg-noprint');act.dataset.label='Action';
  if(e.cancelled){node('span','Cancelled'+(e.cancelReason?': '+e.cancelReason:''),act);}
  else{const ed=node('button','Edit',act);ed.type='button';ed.onclick=()=>{editingId=e.id;buildFormFields(reg,e);formBox.scrollIntoView({block:'start',behavior:'smooth'});status('Editing '+e.no+'.');};
   const cn=node('button','Cancel entry',act);cn.type='button';cn.onclick=()=>{const why=window.prompt('Reason for cancelling '+e.no+' (the entry stays in the register, struck through):','');if(why===null)return;e.cancelled=true;e.cancelReason=(why||'').trim()||'wrong entry';e.cancelledOn=new Date().toISOString();save();renderAll();status(e.no+' cancelled. It remains visible, struck through.');};}}
 }

function renderSummary(reg){summaryBox.replaceChildren();summaryBox.hidden=reg!=='stock';if(reg!=='stock')return;
 const b=balances(),seen={};for(const e of db.stock){if(e.cancelled)continue;seen[itemKey(e)]=e;}
 const keys=Object.keys(seen);node('h4','Current stock',summaryBox);
 if(!keys.length){node('p','No stock entries yet.',summaryBox);return;}
 const t=node('table','',summaryBox,'rg-table rg-mini');const tr=node('tr','',node('thead','',t));for(const h of ['Item','Unit','Balance'])node('th',h,tr);
 const tb=node('tbody','',t);for(const k of keys.sort()){const e=seen[k],r=node('tr','',tb);node('td',[e.item,e.strength].filter(Boolean).join(' · '),r).dataset.label='Item';node('td',e.unit,r).dataset.label='Unit';const td=node('td',String(b.run[k]),r);td.dataset.label='Balance';if(b.run[k]<=0)td.className='rg-low';}}

function renderAll(){for(const [k,b]of Object.entries(navButtons))b.setAttribute('aria-selected',String(k===current));
 $('rgTitle').textContent=REG[current].title;$('rgNote').textContent=REG[current].note;
 $('rgDeathLink').hidden=current!=='death';renderSummary(current);renderTable(current);$('rgCount').textContent=db[current].length+' entries'+(db[current].some(e=>e.cancelled)?' (including cancelled)':'');
 $('rgMemory').hidden=!memoryOnly;}

function select(reg){current=reg;editingId=null;query='';$('rgSearch').value='';buildFormFields(reg,null);renderAll();status('');}

/* ---------- print, PDF, CSV, backup ---------- */
function printNode(reg){const cfg=REG[reg],ctx=ctxFor(reg),rows=db[reg].filter(matches);
 const root=document.createElement('article');root.className='rg-doc';
 const top=node('div','',root,'rg-doc-top');const l=node('div','',top);node('strong','Dr Pramod G Kulkarni',l,'rg-doc-name');node('span','Home Visiting ICU Doctor · Emergency and HomeCare Specialist',l);node('span','BAMS, PGDEMS · Reg. No. I-24809-A-1',l);
 const r=node('div','',top,'rg-doc-date');node('span','Date',r);node('strong',dmy(todayISO()),r);
 node('h2',cfg.title,root);
 const t=node('table','',root,'rg-table rg-print-table');const tr=node('tr','',node('thead','',t));for(const c of cfg.cols)node('th',c[0],tr);const tb=node('tbody','',t);
 for(const e of rows){const row=node('tr','',tb);if(e.cancelled)row.className='rg-cancelled';for(const c of cfg.cols)node('td',String(c[1](e,ctx)||''),row);}
 if(!rows.length){const row=node('tr','',tb),td=node('td','No entries.',row);td.colSpan=cfg.cols.length;}
 const sign=node('div','',root,'rg-doc-sign');node('span','Signature of the doctor',sign);
 node('p',FOOT,root,'rg-doc-foot');return root;}
function printRegister(){const old=$('rgPrintHost');if(old)old.remove();const h=document.createElement('div');h.id='rgPrintHost';h.append(printNode(current));document.body.append(h);document.body.classList.add('printing-register');window.print();}
window.addEventListener('afterprint',()=>{document.body.classList.remove('printing-register');$('rgPrintHost')?.remove();});

async function pdfFile(){if(typeof html2pdf!=='function')throw Error('The PDF engine did not load. Refresh the page, or use Print and choose Save as PDF.');
 const h=document.createElement('div');h.className='rg-pdf-host';h.setAttribute('aria-hidden','true');const doc=printNode(current);doc.classList.add('rg-doc-pdf');h.append(doc);document.body.append(h);
 try{await document.fonts?.ready;const worker=html2pdf().set({margin:[8,8,16,8],image:{type:'jpeg',quality:.95},html2canvas:{scale:1.6,useCORS:true,scrollY:0,backgroundColor:'#ffffff',windowWidth:1180},jsPDF:{unit:'mm',format:'a4',orientation:'landscape'},pagebreak:{mode:['css','legacy'],avoid:['tr']}}).from(doc).toPdf();
  const pdf=await worker.get('pdf');const total=pdf.internal.getNumberOfPages(),w=pdf.internal.pageSize.getWidth(),ht=pdf.internal.pageSize.getHeight();
  for(let p=1;p<=total;p++){pdf.setPage(p);pdf.setFont('times','normal');pdf.setFontSize(8);pdf.setTextColor(60,70,80);pdf.text(REG[current].title+' · Dr Pramod G Kulkarni',8,ht-8);pdf.text('Page '+p+' of '+total,w-8,ht-8,{align:'right'});}
  const blob=await worker.outputPdf('blob');if(!blob||blob.size<500)throw Error('The PDF could not be prepared.');
  return new File([blob],REG[current].title.replace(/\s+/g,'_')+'_'+todayISO()+'.pdf',{type:'application/pdf'});}
 finally{h.remove();}}
function saveBlob(file){const url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;a.download=file.name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
async function downloadPdf(){status('Preparing the PDF on this device…');try{const f=await pdfFile();saveBlob(f);status('PDF downloaded: '+f.name);}catch(e){status(e.message);}}
async function sharePdf(){status('Preparing the PDF on this device…');try{const f=await pdfFile();if(navigator.share&&navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:f.name});status('PDF passed to the sharing app you chose.');}catch(e){status(e.name==='AbortError'?'Sharing cancelled. Nothing was sent.':'Sharing was not accepted. Use Download PDF and attach it yourself.');}}else{saveBlob(f);status('This device cannot share files directly. The PDF was downloaded: in WhatsApp or e-mail choose Attach, then select it.');}}catch(e){status(e.message);}}
function csvCell(v){const s=String(v==null?'':v);return /[",\n\r]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
function exportCsv(){const cfg=REG[current],ctx=ctxFor(current),rows=db[current].filter(matches);const lines=[cfg.cols.map(c=>csvCell(c[0])).join(',')];for(const e of rows)lines.push(cfg.cols.map(c=>csvCell(c[1](e,ctx))).join(',')+(e.cancelled?','+csvCell('CANCELLED'):''));
 saveBlob(new File(['﻿'+lines.join('\r\n')],cfg.title.replace(/\s+/g,'_')+'_'+todayISO()+'.csv',{type:'text/csv'}));status('CSV downloaded. It opens in Excel or Google Sheets.');}
function exportBackup(){saveBlob(new File([JSON.stringify({app:'hvicu-registers',version:1,exported:new Date().toISOString(),data:db},null,1)],'Registers_backup_'+todayISO()+'.json',{type:'application/json'}));status('Backup downloaded. Keep it safe: it contains patient information.');}
function restoreBackup(file){const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(d.app!=='hvicu-registers'||!d.data)throw Error('x');if(!window.confirm('Restore this backup? It will replace the entries now stored on this device.'))return;for(const k of Object.keys(db))db[k]=Array.isArray(d.data[k])?d.data[k]:[];save();select(current);status('Backup restored.');}catch(e){status('This file is not a valid registers backup.');}};r.readAsText(file);}

/* ---------- mount ---------- */
function mount(){const ws=$('doctorWorkstation');if(!ws||$('viewRegisters'))return;load();
 const tabs=ws.querySelector('.doctor-tabs');const tab=document.createElement('button');tab.type='button';tab.id='tabRegisters';tab.setAttribute('onclick',"switchDocTab('registers')");tab.className='px-3.5 py-1.5 bg-white border petal-border text-[#0F2942] rounded-xl text-xs font-bold hover:bg-slate-50';tab.textContent='📒 Registers';const settings=$('tabSet');if(tabs){if(settings)settings.before(tab);else tabs.append(tab);}
 host=document.createElement('div');host.id='viewRegisters';host.className='hidden space-y-4 registers-view';
 const head=node('section','',host,'rg-head');node('span','Dr Pramod G Kulkarni · Home Visiting ICU Doctor',head,'section-eyebrow');node('h3','Registers',head);
 const nav=node('div','',head,'rg-nav');nav.setAttribute('role','tablist');nav.setAttribute('aria-label','Registers');
 for(const k of Object.keys(REG)){const b=node('button',REG[k].title,nav);b.type='button';b.setAttribute('role','tab');b.onclick=()=>select(k);navButtons[k]=b;}
 const safe=node('p','',head,'rg-safe');safe.textContent='Entries are kept on this device only, in this browser, and are not sent anywhere. No entry can be deleted: correct it with Edit, or Cancel entry. Export a backup regularly.';
 const mem=node('p','This browser is blocking storage, so entries will be lost when the page closes. Export a backup before leaving.',head,'rg-warn');mem.id='rgMemory';mem.hidden=true;
 const bar=node('section','',host,'rg-card');node('h3','',bar).id='rgTitle';node('p','',bar).id='rgNote';
 const dl=node('button','Open Death Certificates (Forms 4A, 4, 2)',bar);dl.type='button';dl.id='rgDeathLink';dl.hidden=true;dl.onclick=()=>window.switchDocTab('legalForms');
 formBox=node('div','',bar,'rg-formbox');
 const tools=node('div','',host,'rg-card');const row=node('div','',tools,'rg-tools');
 const s=node('input','',row);s.type='search';s.id='rgSearch';s.placeholder='Search this register';s.setAttribute('aria-label','Search this register');s.oninput=()=>{query=s.value.trim();renderTable(current);};
 node('span','',row).id='rgCount';
 for(const [t,f]of [['Print (A4)',printRegister],['Download PDF',downloadPdf],['Share PDF',sharePdf],['Export CSV',exportCsv],['Export backup',exportBackup]]){const b=node('button',t,row);b.type='button';b.onclick=f;}
 const lab=node('label','Restore backup',row,'rg-file');const fi=node('input','',lab);fi.type='file';fi.accept='application/json,.json';fi.onchange=()=>{if(fi.files[0])restoreBackup(fi.files[0]);fi.value='';};
 statusEl=node('p','',host,'rg-status');statusEl.id='rgStatus';statusEl.setAttribute('role','status');
 summaryBox=node('section','',host,'rg-card');tableBox=node('section','',host,'rg-card');
 const anchor=$('viewSettingsTab');if(anchor)anchor.before(host);else ws.append(host);
 const previous=window.switchDocTab;window.switchDocTab=function(tab){const r=previous.apply(this,arguments);host.classList.toggle('hidden',tab!=='registers');return r;};
 select('patient');}
document.addEventListener('DOMContentLoaded',mount);
window.Registers={REG,nextNo,balances:()=>balances(),get db(){return db;}};
})();
