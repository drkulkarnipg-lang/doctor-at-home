/* Payment UI helpers. Never expose the doctor's bank account number on the public site. */
(()=>{'use strict';
const UPI='drkulkarnipg@upi';
window.KULKARNI_UPI_ID=UPI;
const $=id=>document.getElementById(id);
function updatePaymentLink(amount){const link=$('upiPaymentLink');if(!link)return;const fee=Number.isFinite(Number(amount))?Math.max(0,Number(amount)):0;link.href='upi://pay?'+new URLSearchParams({pa:UPI,pn:'Dr Pramod G Kulkarni',am:String(fee),cu:'INR'});}
const previousCalculateFee=window.calculateFee;
if(typeof previousCalculateFee==='function'){window.calculateFee=function(){const total=previousCalculateFee();updatePaymentLink(total);return total;};}
async function copyUpi(){
 const status=$('upiMethodStatus');
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(UPI);}else{const input=document.createElement('textarea');input.value=UPI;input.setAttribute('readonly','');input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();const ok=document.execCommand('copy');input.remove();if(!ok)throw Error('Clipboard access is unavailable.');}
 status.textContent='UPI ID copied: '+UPI+'. Confirm the payee and amount in your UPI app before paying.';
 }catch{status.textContent='UPI ID: '+UPI+'. Select and copy it, then confirm the payee and amount in your UPI app.';}
}
document.addEventListener('DOMContentLoaded',()=>{
 const copy=$('upiCopyId'),details=$('upiQrDetails'),link=$('upiPaymentLink');
 if(link){link.addEventListener('click',()=>{if(typeof window.calculateFee==='function')window.calculateFee();});}
 if(copy)copy.addEventListener('click',copyUpi);
 if(details)details.addEventListener('toggle',()=>{if(details.open&&typeof window.calculateFee==='function')window.calculateFee();});
 const controls=[$('calcTime'),$('calcDistance'),...document.querySelectorAll('#procedureList input[type="checkbox"]')].filter(Boolean);
 controls.forEach(control=>{control.addEventListener('input',()=>{if(typeof window.calculateFee==='function')window.calculateFee();});control.addEventListener('change',()=>{if(typeof window.calculateFee==='function')window.calculateFee();});});
 if(typeof window.calculateFee==='function')window.calculateFee();else updatePaymentLink(0);
});
})();