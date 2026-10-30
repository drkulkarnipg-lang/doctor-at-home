/* Owner-authenticated cloud registers. No localStorage copy and no delete action. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const schemas={
daily:{label:'Daily patient register',fields:[
['entryDate','Register date','date',true],['patientName','Patient name','text',true],['patientCode','Patient code / file no.','text',false],['age','Age (years)','number',false],['sex','Sex','select',false,[['','Choose…'],['Female','Female'],['Male','Male'],['Other','Other / not recorded']]],['visitType','Visit / service','select',true,[['','Choose…'],['Home visit','Home visit'],['Online consultation','Online consultation'],['Follow-up','Follow-up'],['Other','Other']]],['clinicalSummary','Brief visit note (minimum necessary)','textarea',false],['amount','Fee (INR)','number',false],['paymentStatus','Payment status','select',false,[['Not recorded','Not recorded'],['Pending','Pending'],['Paid — manually verified','Paid — manually verified'],['Waived','Waived']]]],columns:['entryDate','patientName','patientCode','visitType','amount','paymentStatus']},
death:{label:'Death register',fields:[
['entryDate','Register entry date','date',true],['patientName','Patient name','text',true],['patientCode','Patient code / file no.','text',false],['age','Age (years)','number',false],['sex','Sex','select',false,[['','Choose…'],['Female','Female'],['Male','Male'],['Other','Other / not recorded']]],['deathDateTime','Recorded date and time of death','datetime-local',true],['place','Place','text',true],['certificateReference','Certificate / record reference','text',false],['notes','Minimum necessary factual note','textarea',false]],columns:['entryDate','patientName','deathDateTime','place','certificateReference']},
stock:{label:'Stock register',fields:[
['entryDate','Movement date','date',true],['itemName','Item / medicine name','text',true],['category','Category','text',false],['batch','Batch / lot number','text',false],['expiry','Expiry date','date',false],['quantity','Quantity moved','number',true],['unit','Unit (vials, strips, packs, etc.)','text',true],['movement','Movement','select',true,[['','Choose…'],['received','Received'],['issued','Issued'],['adjustment','Adjustment']]],['supplier','Supplier / source','text',false],['reference','Invoice / issue reference','text',false],['notes','Notes','textarea',false]],columns:['entryDate','itemName','batch','expiry','quantity','unit','movement']}
};
let current='daily',records=[],editing=null,loading=false;
const status=t=>{const e=$('registerStatus');if(e)e.textContent=t;};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
function signedIn(){return !!window.ClinicCloud?.isSignedIn?.();}
function el(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;}
function makeField(field,value=''){
const [key,label,type,required,options]=field,wrap=el('label','register-field');wrap.append(el('span','',label+(required?' *':'')));
let input;
if(type==='select'){input=el('select');for(const [v,t]of options)input.add(new Option(t,v));}
else if(type==='textarea')input=el('textarea');
else input=el('input');
input.id='register-'+key;input.name=key;input.dataset.registerField=key;input.type=type==='datetime-local'?'datetime-local':type==='date'?'date':type==='number'?'number':'text';if(type==='number'){input.min='0';input.max=key==='age'?'130':'10000000';input.step='any';}input.required=required;input.maxLength=key==='clinicalSummary'||key==='notes'?2000:160;input.autocomplete='off';input.value=value||'';wrap.append(input);return wrap;
}
function renderForm(){
const host=$('registerEntryFields'),form=$('registerEntryForm');if(!host||!form)return;host.replaceChildren();
const schema=schemas[current];for(const field of schema.fields){const key=field[0],value=key==='entryDate'?(editing?.entry_date||editing?.data?.[key]||(!editing?today():'')):(editing?.data?.[key]??'');host.append(makeField(field,value));}
$('registerSave').textContent=editing?'Save changes':'Save entry';$('registerCancel').hidden=!editing;form.hidden=!signedIn();
}
function safeCell(value){return value===null||value===undefined?'':String(value);}
function renderTable(){
const head=$('registerTableHead'),body=$('registerTableBody');if(!head||!body)return;head.replaceChildren();body.replaceChildren();
const schema=schemas[current],tr=el('tr');for(const key of schema.columns)tr.append(el('th','',schema.fields.find(f=>f[0]===key)?.[1]||key));tr.append(el('th','','Action'));head.append(tr);
if(!records.length){const row=el('tr'),cell=el('td','register-empty','No entries loaded for this register.');cell.colSpan=schema.columns.length+1;row.append(cell);body.append(row);return;}
for(const record of records){const row=el('tr');for(const key of schema.columns)row.append(el('td','',safeCell(key==='entryDate'?record.entry_date:record.data?.[key])));const action=el('td'),button=el('button','register-edit','Edit');button.type='button';button.addEventListener('click',()=>{editing=record;renderForm();status('Editing saved entry. Saving checks the last revision to prevent overwriting another change.');$('registerEntryForm').scrollIntoView?.({block:'nearest',behavior:'auto'});});action.append(button);row.append(action);body.append(row);}
}
async function load(){
if(loading)return;loading=true;
try{if(!window.ClinicCloud?.session||!window.ClinicCloud?.listRegister)throw Error('Cloud register service is not available in this build.');
const session=await window.ClinicCloud.session();if(!session.configured||!session.signedIn){records=[];editing=null;renderForm();renderTable();status('Sign in through Doctor Workstation to use these private cloud registers. No register entries are stored on this browser.');return;}
status('Loading '+schemas[current].label.toLowerCase()+'…');const data=await window.ClinicCloud.listRegister(current);records=Array.isArray(data.records)?data.records:[];renderForm();renderTable();status(records.length+' entries loaded. Cloud limit: latest 500 entries for this register. No delete action is provided; updates are revision-checked.');}
catch(error){records=[];renderForm();renderTable();status(error.message||'Register could not load. No local copy was created.');}
finally{loading=false;}
}
function clearForm(){editing=null;$('registerEntryForm').reset();renderForm();status('Form cleared. Saved cloud entries are unchanged.');}
function csvCell(value){let s=safeCell(value);if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
function exportCsv(){
const schema=schemas[current],keys=schema.fields.map(f=>f[0]),rows=[keys.map(k=>csvCell(schema.fields.find(f=>f[0]===k)?.[1]||k)).join(',')];
for(const r of records)rows.push(keys.map(k=>csvCell(k==='entryDate'?r.entry_date:r.data?.[k])).join(','));
const blob=new Blob(['\uFEFF'+rows.join('\r\n')],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=current+'-register-'+today()+'.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status('CSV export prepared for '+records.length+' entries. Protect the downloaded file as confidential practice data.');
}
document.addEventListener('DOMContentLoaded',()=>{
document.querySelectorAll('[data-register-type]').forEach(button=>button.addEventListener('click',()=>{current=button.dataset.registerType;if(!schemas[current])return;editing=null;document.querySelectorAll('[data-register-type]').forEach(b=>{b.setAttribute('aria-pressed',String(b===button));});renderForm();load();}));
$('registerEntryForm')?.addEventListener('submit',async event=>{event.preventDefault();if(!signedIn()){status('Sign in through Doctor Workstation before saving.');return;}const button=$('registerSave');button.disabled=true;const entry={registerType:current};for(const input of $('registerEntryFields').querySelectorAll('[data-register-field]'))entry[input.dataset.registerField]=input.value.trim();if(editing){entry.id=editing.id;entry.revision=editing.revision;}try{status('Saving securely to the clinic register…');const result=await window.ClinicCloud.saveRegister(entry);editing=null;await load();status('Saved successfully to the private cloud register.');}catch(error){status('NOT SAVED: '+(error.message||'Cloud save failed')+'. Your entered form remains available for retry.');}finally{button.disabled=false;}});
$('registerCancel')?.addEventListener('click',clearForm);$('registerRefresh')?.addEventListener('click',load);$('registerExport')?.addEventListener('click',exportCsv);$('registerPrint')?.addEventListener('click',()=>window.print());
window.addEventListener('clinic-owner-signed-in',load);window.addEventListener('clinic-owner-signed-out',()=>{records=[];editing=null;renderForm();renderTable();status('Signed out. Register data cleared from this page; cloud entries remain stored.');});
document.querySelector('[data-register-type="daily"]')?.setAttribute('aria-pressed','true');renderForm();renderTable();load();
});
window.WorkstationRegisters={load,schemas};
})();
