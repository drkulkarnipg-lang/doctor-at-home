/* No patient information is persisted or transmitted by these certificate tools. */
(() => {
  'use strict';
  function activeId(group) {
    if (group === 'clinical') return 'cdoc-' + document.getElementById('clinDocSelect').value;
    return 'cert-' + document.getElementById('certTypeSelect').value;
  }
  function selectedGroup() {
    if (document.getElementById('doctorWorkstation').classList.contains('hidden')) return null;
    if (!document.getElementById('viewClinicalCertificates').classList.contains('hidden')) return 'clinical';
    if (!document.getElementById('viewLegalForms').classList.contains('hidden')) return 'death';
    return null;
  }
  function printableClone(id) {
    const source = document.getElementById(id);
    const copy = source.cloneNode(true);
    copy.classList.remove('hidden'); copy.classList.add('certificate-export');
    const originals = [...source.querySelectorAll('input,select,textarea')];
    copy.querySelectorAll('input,select,textarea').forEach((control, i) => {
      const original = originals[i];
      const output = document.createElement('span'); output.className = 'certificate-value';
      let value = original.value;
      if (original.type === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(value)) value = value.split('-').reverse().join('-');
      if (original.tagName === 'SELECT') value = original.selectedOptions[0]?.textContent || '';
      output.textContent = value || '\u00a0'; control.replaceWith(output);
    });
    copy.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    copy.removeAttribute('id');
    return copy;
  }
  function preparePrint(group) {
    document.getElementById('certificatePrintRoot')?.remove();
    const root = document.createElement('div'); root.id = 'certificatePrintRoot';
    root.appendChild(printableClone(activeId(group))); document.body.appendChild(root);
    document.body.classList.add('certificate-printing');
  }
  function clearPrint() {
    document.body.classList.remove('certificate-printing');
    document.getElementById('certificatePrintRoot')?.remove();
  }
  window.printActiveCertificate = function(group) { preparePrint(group); window.print(); };
  window.addEventListener('beforeprint', () => { const group = selectedGroup(); if (group) preparePrint(group); });
  window.addEventListener('afterprint', clearPrint);
  const originalClinicalExport = window.exportCurrentClinDocPdf;
  async function exportCertificate(group) {
    const id = activeId(group), source = document.getElementById(id);
    if (!source.dataset.certificateTemplate) return originalClinicalExport();
    if (typeof window.html2pdf !== 'function') { window.printActiveCertificate(group); return; }
    const copy = printableClone(id);
    const holder = document.createElement('div'); holder.setAttribute('aria-hidden','true');
    holder.style.cssText = 'position:absolute;left:0;top:0;z-index:-10;pointer-events:none;background:white;width:194mm';
    holder.appendChild(copy); document.body.appendChild(holder);
    try {
      await document.fonts.ready;
      await window.html2pdf().set({margin:[8,8,8,8],filename:'Dr_Kulkarni_'+id+'.pdf',image:{type:'jpeg',quality:0.98},html2canvas:{scale:2,useCORS:true,scrollY:0},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy'],avoid:['.certificate-field','.certificate-causes','.certificate-signature']}}).from(copy).save();
    } catch (e) { window.showToast?.('PDF export unavailable. Use Print and Save as PDF.'); }
    finally { holder.remove(); }
  }
  window.exportCurrentClinDocPdf = () => exportCertificate('clinical');
  window.exportCurrentDeathFormPdf = () => exportCertificate('death');
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.certificate-sheet textarea').forEach(el => {
      const resize = () => { if (el.offsetParent) {el.style.height='auto'; el.style.height=Math.max(52,el.scrollHeight+2)+'px';} };
      el.addEventListener('input',resize);
    });
    // Date-only UTC arithmetic avoids timezone/DST errors; no clinical dates are inferred.
    ['leaveFrom','leaveTo'].forEach(id => document.getElementById(id).addEventListener('change', () => {
      const from=document.getElementById('leaveFrom').value, to=document.getElementById('leaveTo').value;
      const days=document.getElementById('leaveDays');
      if (!from || !to) {days.value=''; document.getElementById('leaveTo').setCustomValidity(''); return;}
      const count=(Date.parse(to+'T00:00:00Z')-Date.parse(from+'T00:00:00Z'))/86400000+1;
      days.value=count>0?String(count):'';
      document.getElementById('leaveTo').setCustomValidity(count>0?'':'End date must be on or after the start date.');
    }));
  });
})();
