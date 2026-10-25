/* Load optional services only when requested. Existing controls stay available. */
(()=>{'use strict';const pending=new Map();
function load(key,src){if(pending.has(key))return pending.get(key);const promise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=true;s.dataset.optionalService=key;s.onload=resolve;s.onerror=()=>{pending.delete(key);s.remove();reject(Error('Optional service did not load. Please retry or use Print / Save as PDF.'));};document.head.append(s);});pending.set(key,promise);return promise;}
window.ensurePdfEngine=()=>typeof window.html2pdf==='function'?Promise.resolve():load('pdf','/assets/pdf/html2pdf.bundle.min.js').then(()=>{if(typeof window.html2pdf!=='function')throw Error('PDF service is unavailable. Use Print / Save as PDF.');});
window.ensureTranslation=()=>window.google?.translate?.TranslateElement?Promise.resolve():load('translation','https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit').catch(e=>{const status=document.getElementById('translationStatus');if(status)status.textContent='Automatic translation could not load. English and authored Marathi remain available.';throw e;});
document.addEventListener('toggle',e=>{if(e.target.matches?.('.language-control')&&e.target.open)window.ensureTranslation().catch(()=>{});},true);
document.addEventListener('focusin',e=>{if(e.target.closest?.('.patient-section-language,.patient-language-controls'))window.ensureTranslation().catch(()=>{});});
})();
