/* Reliable local save, download and PDF export for the prescription pad.
   No patient prescription is uploaded to cloud storage by these actions. */
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 let busy=false;
 function istDate(){const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day;}
 function fileName(ext){return 'Prescription_'+istDate()+'.'+ext;}
 function status(message,kind='ok'){
  let el=$('rxActionStatus');
  if(!el){el=document.createElement('p');el.id='rxActionStatus';el.className='w-full basis-full text-xs font-semibold';el.setAttribute('role','status');el.setAttribute('aria-live','polite');const toolbar=$('viewRxPad')?.querySelector(':scope > .no-print');(toolbar||$('viewRxPad'))?.append(el);}
  el.textContent=message;el.dataset.state=kind;el.style.color=kind==='error'?'#a92323':'#166534';
 }
 function prescriptionText(){if(typeof window.generatePrescriptionText!=='function')throw Error('Prescription data could not be read. Refresh the workstation and retry.');return window.generatePrescriptionText();}
 function fallbackDownload(blob,name){
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.style.display='none';a.setAttribute('aria-hidden','true');document.body.append(a);
  try{a.click();}finally{a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),120000);}
 }
 async function savePrescription(){
  if(busy)return;busy=true;const button=$('rxSavePrescriptionBtn');if(button)button.disabled=true;
  try{
   const text=prescriptionText(),blob=new Blob([text],{type:'text/plain;charset=utf-8'}),name=fileName('txt');
   if(typeof window.showSaveFilePicker==='function'){
    try{const handle=await window.showSaveFilePicker({suggestedName:name,types:[{description:'Prescription text',accept:{'text/plain':['.txt']}}]});const writable=await handle.createWritable();await writable.write(blob);await writable.close();status('Prescription saved to the location you selected. No cloud upload was made.');return;}
    catch(e){if(e?.name==='AbortError'){status('Save cancelled. Your prescription remains open and unchanged.');return;}status('Direct Save dialog was unavailable; starting a normal device download.');}
   }
   fallbackDownload(blob,name);status('Prescription file download started. Check your device Downloads folder. Your entered prescription remains on screen; nothing was uploaded.');
  }catch(e){status('Prescription NOT saved: '+(e.message||'Unknown error')+'. Your entered data remains on screen.', 'error');}
  finally{busy=false;if(button)button.disabled=false;}
 }
 function downloadText(){
  try{const blob=new Blob([prescriptionText()],{type:'text/plain;charset=utf-8'});fallbackDownload(blob,fileName('txt'));status('Text copy download started. Check your device Downloads folder.');}
  catch(e){status('Text download failed: '+(e.message||'Unknown error'), 'error');}
 }
 function exportPdf(){
  if(typeof window.shareDocumentPdf!=='function'){status('PDF service is not loaded. Refresh the workstation and retry. No file was sent.','error');return;}
  status('Preparing prescription PDF. The next panel will provide an explicit Download PDF button.');
  return window.shareDocumentPdf('rxSheet','Prescription',{direct:false,recipientPhone:$('rxPatPhone')?.value||''});
 }
 const oldExport=window.exportToPdf;
 window.exportToPdf=function(id,name){if(id==='rxSheet')return exportPdf();if(typeof oldExport==='function')return oldExport(id,name);status('PDF export service is not available.','error');};
 window.saveRecordAsPrompt=savePrescription;
 window.downloadPatientPrescriptionText=downloadText;
 const oldShare=window.universalShareDocument;
 window.universalShareDocument=function(type){if(type==='rx')return exportPdf();if(typeof oldShare==='function')return oldShare(type);};
 window.PrescriptionActions={save:savePrescription,downloadText,exportPdf};
})();