/* Payment UI helpers. Never expose the doctor's bank account number on the public site. */
(()=>{'use strict';
const UPI='drkulkarnipg@upi';
window.KULKARNI_UPI_ID=UPI;
const $=id=>document.getElementById(id);
function paymentUri(amount){const fee=Number.isFinite(Number(amount))?Math.max(0,Number(amount)):0;return 'upi://pay?'+new URLSearchParams({pa:UPI,pn:'Dr Pramod G Kulkarni',am:String(fee),cu:'INR'});}
function formatInr(amount){const value=Number.isFinite(Number(amount))?Math.max(0,Number(amount)):0;return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(value);}
let qrRequest=0;
async function updatePaymentQr(amount){
 const image=$('upiQrImg'),details=$('upiQrDetails'),status=$('upiMethodStatus');
 if(!image||!details?.open)return;
 const fee=Number.isFinite(Number(amount))?Math.max(0,Number(amount)):0;
 const amountLabel=$('upiQrAmount');if(amountLabel)amountLabel.textContent=formatInr(fee);
 image.hidden=true;image.removeAttribute('src');
 const download=$('upiQrDownload');if(download){download.hidden=true;download.removeAttribute('href');}
 const enlarge=$('upiQrEnlarge');if(enlarge)enlarge.disabled=true;
 const qr=window.KulkarniQRCode;
 if(!qr||typeof qr.toDataURL!=='function'){
  if(status)status.textContent='QR generation is unavailable in this browser. Use Open UPI app or Copy UPI ID.';
  return;
 }
 const uri=paymentUri(fee),request=++qrRequest;
 image.dataset.qrPayload=uri;
 if(status)status.textContent='Preparing UPI QR…';
 try{
  const data=await qr.toDataURL(uri,{width:320,margin:2,errorCorrectionLevel:'M'});
  if(request!==qrRequest||!details.open||image.dataset.qrPayload!==uri)return;
  image.src=data;image.hidden=false;
  image.alt='UPI payment QR for Dr Pramod G Kulkarni. Confirm the payee and amount in your UPI app before paying.';
  const download=$('upiQrDownload');if(download){download.href=data;download.hidden=false;}
  const enlarge=$('upiQrEnlarge');if(enlarge)enlarge.disabled=false;
  const zoomImage=$('upiQrZoomImage');if(zoomImage)zoomImage.src=data;
  if(status)status.textContent='Payment QR ready. Verify Dr. Pramod G. Kulkarni and '+formatInr(fee)+' in your UPI app before approving. QR display is not proof of payment.';
 }catch{
  if(request===qrRequest){
   const download=$('upiQrDownload');if(download)download.hidden=true;
   const enlarge=$('upiQrEnlarge');if(enlarge)enlarge.disabled=true;
   if(status)status.textContent='Could not generate the QR. Use Open UPI app or Copy UPI ID instead.';
  }
 }
}
function updatePaymentLink(amount){const link=$('upiPaymentLink');const uri=paymentUri(amount);if(link)link.href=uri;const details=$('upiQrDetails');if(details?.open)updatePaymentQr(amount);}
const previousCalculateFee=window.calculateFee;
if(typeof previousCalculateFee==='function'){window.calculateFee=function(){const total=previousCalculateFee();updatePaymentLink(total);return total;};}
async function copyUpi(){
 const status=$('upiMethodStatus');
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(UPI);}else{const input=document.createElement('textarea');input.value=UPI;input.setAttribute('readonly','');input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();const ok=document.execCommand('copy');input.remove();if(!ok)throw Error('Clipboard access is unavailable.');}
 status.textContent='UPI ID copied: '+UPI+'. Confirm the payee and amount in your UPI app before paying.';
 }catch{status.textContent='UPI ID: '+UPI+'. Select and copy it, then confirm the payee and amount in your UPI app.';}
}
function closeZoom(dialog){if(!dialog)return;try{if(typeof dialog.close==='function'&&dialog.open){dialog.close();return;}}catch{}dialog.removeAttribute('open');}
document.addEventListener('DOMContentLoaded',()=>{
 const copy=$('upiCopyId'),details=$('upiQrDetails'),link=$('upiPaymentLink'),paymentMethods=$('paymentMethods'),showQr=$('showPaymentQr');
 const image=$('upiQrImg'),download=$('upiQrDownload'),enlarge=$('upiQrEnlarge'),zoomDialog=$('upiQrZoomDialog'),zoomImage=$('upiQrZoomImage'),zoomClose=$('upiQrZoomClose');
 if(link){link.addEventListener('click',()=>{if(typeof window.calculateFee==='function')window.calculateFee();});}
 if(showQr){showQr.addEventListener('click',()=>{if(paymentMethods)paymentMethods.open=true;if(details){details.open=true;details.dispatchEvent(new Event('toggle'));}details?.scrollIntoView?.({behavior:'smooth',block:'center'});});}
 if(copy)copy.addEventListener('click',copyUpi);
 if(enlarge)enlarge.addEventListener('click',()=>{
  if(!image||image.hidden||!image.src||!zoomDialog||!zoomImage)return;
  zoomImage.src=image.src;
  if(typeof zoomDialog.showModal==='function')zoomDialog.showModal();else zoomDialog.setAttribute('open','');
 });
 if(zoomClose)zoomClose.addEventListener('click',()=>closeZoom(zoomDialog));
 if(zoomDialog)zoomDialog.addEventListener('click',event=>{if(event.target===zoomDialog)closeZoom(zoomDialog);});
 const transfer=$('bankTransferRequest');if(transfer)transfer.addEventListener('click',()=>{if(typeof window.openDoctorContact==='function')window.openDoctorContact();else{const status=$('upiMethodStatus');if(status)status.textContent='Use the Contact the doctor options to request verified transfer instructions.';}});
 if(details)details.addEventListener('toggle',()=>{
  if(details.open){if(typeof window.calculateFee==='function')window.calculateFee();else updatePaymentQr(0);}
  else{
   qrRequest++;closeZoom(zoomDialog);
   if(image){image.hidden=true;image.removeAttribute('src');}
   const amountLabel=$('upiQrAmount');if(amountLabel)amountLabel.textContent='Calculated after opening';
   if(download){download.hidden=true;download.removeAttribute('href');}
   if(enlarge)enlarge.disabled=true;
   if(zoomImage)zoomImage.removeAttribute('src');
  }
 });
 const controls=[$('calcTime'),$('calcDistance'),...document.querySelectorAll('#procedureList input[type="checkbox"]')].filter(Boolean);
 controls.forEach(control=>{control.addEventListener('input',()=>{if(typeof window.calculateFee==='function')window.calculateFee();});control.addEventListener('change',()=>{if(typeof window.calculateFee==='function')window.calculateFee();});});
 if(typeof window.calculateFee==='function')window.calculateFee();else updatePaymentLink(0);
});
})();