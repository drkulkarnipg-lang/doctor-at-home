/* Payment UI helpers. Never expose the doctor's bank account number on the public site. */
(()=>{'use strict';
const UPI='drkulkarnipg@upi';
window.KULKARNI_UPI_ID=UPI;
const $=id=>document.getElementById(id);
async function copyUpi(){
 const status=$('upiMethodStatus');
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(UPI);}else{const input=document.createElement('textarea');input.value=UPI;input.setAttribute('readonly','');input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();const ok=document.execCommand('copy');input.remove();if(!ok)throw Error('Clipboard access is unavailable.');}
 status.textContent='UPI ID copied: '+UPI+'. Confirm the payee and amount in your UPI app before paying.';
 }catch{status.textContent='UPI ID: '+UPI+'. Select and copy it, then confirm the payee and amount in your UPI app.';}
}
document.addEventListener('DOMContentLoaded',()=>{
 const copy=$('upiCopyId'),details=$('upiQrDetails'),link=$('upiPaymentLink');
 if(link){link.href='upi://pay?pa='+encodeURIComponent(UPI)+'&pn=Dr%20Pramod%20G%20Kulkarni&cu=INR';link.addEventListener('click',()=>{if(typeof window.calculateFee==='function')window.calculateFee();});}
 if(copy)copy.addEventListener('click',copyUpi);
 if(details)details.addEventListener('toggle',()=>{if(details.open&&typeof window.calculateFee==='function')window.calculateFee();});
 const controls=[$('calcTime'),$('calcDistance'),...document.querySelectorAll('#procedureList input[type="checkbox"]')].filter(Boolean);
 controls.forEach(control=>{control.addEventListener('input',()=>{if(typeof window.calculateFee==='function')window.calculateFee();});control.addEventListener('change',()=>{if(typeof window.calculateFee==='function')window.calculateFee();});});
});
})();