/* Phone links open a recoverable contact chooser before handing off to another app. */
(()=>{'use strict';const number='9822594341',phone='+919822594341';let returnFocus=null;
function dialog(){return document.getElementById('doctorContactDialog');}
function close(){const d=dialog();if(typeof d.close==='function')d.close();else d.removeAttribute('open');if(returnFocus&&document.contains(returnFocus))returnFocus.focus();}
window.openDoctorContact=()=>{const d=dialog();if(d.open)return;returnFocus=document.activeElement;document.getElementById('contactCopyStatus').textContent='Choose how to contact the doctor. The website remains open.';if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');document.getElementById('contactClose').focus();};
document.addEventListener('DOMContentLoaded',()=>{
 const d=dialog();document.getElementById('contactClose').onclick=close;d.addEventListener('click',e=>{if(e.target===d)close();});d.addEventListener('cancel',()=>{if(returnFocus&&document.contains(returnFocus))returnFocus.focus();});
 document.getElementById('contactCopy').onclick=async()=>{const status=document.getElementById('contactCopyStatus');try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(number);status.textContent='Number copied: '+number;}catch{const field=document.getElementById('contactNumber');field.focus();field.select();status.textContent='The number is selected. Use your device’s Copy option.';}};
 document.addEventListener('click',e=>{const a=e.target.closest?.('a[href^="tel:"]');if(!a||a.hasAttribute('data-direct-call')||e.defaultPrevented)return;e.preventDefault();window.openDoctorContact();});
 document.getElementById('contactDial').href='tel:'+phone;
});
})();
