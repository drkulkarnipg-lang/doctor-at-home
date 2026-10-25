/* Native telephone links are never intercepted. The optional contact chooser retains copy support. */
(()=>{'use strict';const number='9561394341',phone='+919561394341';let returnFocus=null;
function dialog(){return document.getElementById('doctorContactDialog');}
function close(){const d=dialog();if(typeof d.close==='function')d.close();else d.removeAttribute('open');if(returnFocus&&document.contains(returnFocus))returnFocus.focus();}
window.openDoctorContact=()=>{const d=dialog();if(d.open)return;returnFocus=document.activeElement;document.getElementById('contactCopyStatus').textContent='Choose how to contact the doctor. The website remains open.';if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');document.getElementById('contactClose').focus();};
document.addEventListener('DOMContentLoaded',()=>{
 const d=dialog();document.getElementById('contactClose').onclick=close;d.addEventListener('click',e=>{if(e.target===d)close();});d.addEventListener('cancel',()=>{if(returnFocus&&document.contains(returnFocus))returnFocus.focus();});
 document.getElementById('contactCopy').onclick=async()=>{const status=document.getElementById('contactCopyStatus');try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(number);status.textContent='Number copied: '+number;}catch{const field=document.getElementById('contactNumber');field.focus();field.select();status.textContent='The number is selected. Use your device’s Copy option.';}};
 document.addEventListener('click',e=>{const button=e.target.closest?.('[data-contact-options]');if(!button||e.defaultPrevented)return;e.preventDefault();window.openDoctorContact();});
 document.getElementById('contactDial').href='tel:'+phone;
});
})();
