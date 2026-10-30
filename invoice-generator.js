/* Draft invoice/receipt helper. No payment is marked received by this tool. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
function dateParts(){const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));return p;}
function refreshNumber(){const p=dateParts();const date=p.year+p.month+p.day;const time=p.hour+p.minute;const id=$('invoiceNumber');if(id&&!id.value)id.value='HVICD-'+date+'-'+time;}
function refreshDate(){const p=dateParts();const d=$('invoiceDate');if(d&&!d.value)d.value=p.day+'/'+p.month+'/'+p.year;}
function createFromPrescription(){const map=[['rxPatName','invoicePatientName'],['rxPatPhone','invoicePatientPhone'],['rxPatLoc','invoicePatientAddress']];for(const [from,to]of map){const a=$(from),b=$(to);if(a&&b&&a.value.trim())b.value=a.value.trim();}const name=$('invoicePatientName');if(name)name.focus();window.switchDocTab?.('invoice');}
function exportInvoice(share){const id='invoiceSheet';const amount=Number($('invoiceAmount')?.value||0);if(!Number.isFinite(amount)||amount<0){$('invoiceStatus').textContent='Enter a valid non-negative invoice amount.';return;}const p=dateParts();const filename='Invoice_'+p.year+'-'+p.month+'-'+p.day;if(share&&window.shareDocumentPdf)window.shareDocumentPdf(id,filename,{direct:true});else if(window.exportToPdf)window.exportToPdf(id,filename);else $('invoiceStatus').textContent='PDF service is not loaded. Use Print / Save as PDF.';}
document.addEventListener('DOMContentLoaded',()=>{
 refreshNumber();refreshDate();
 $('invoiceFromPrescription')?.addEventListener('click',createFromPrescription);
 $('invoiceSharePdf')?.addEventListener('click',()=>exportInvoice(true));
 $('invoiceDownloadPdf')?.addEventListener('click',()=>exportInvoice(false));
 $('invoicePrint')?.addEventListener('click',()=>window.print());
 $('invoiceAmount')?.addEventListener('input',()=>{const amount=Number($('invoiceAmount').value);$('invoiceTotal').textContent=Number.isFinite(amount)&&amount>=0?'₹'+amount.toLocaleString('en-IN',{maximumFractionDigits:2}):'—';});
});
})();