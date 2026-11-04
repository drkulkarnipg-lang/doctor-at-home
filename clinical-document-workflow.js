/* One review/download/share path; legacy text and private-cloud saves remain available. */
(function () {
  'use strict';
  const documents = new Map([
    ['rxSheet','Prescription'], ['pathSlipSheet','Laboratory requisition'],
    ['radSlipSheet','Radiology requisition'], ['cdoc-fitness','Fitness certificate'],
    ['cdoc-leave','Unfitness certificate'], ['cdoc-referral','Referral letter'],
    ['cdoc-consent','Consent form'], ['cert-form2','Form 2'],
    ['cert-form4','Form 4'], ['cert-form4a','Form 4A'], ['invoiceSheet','Invoice / receipt']
  ]);
  const originalShare = window.shareDocumentPdf;
  const originalExport = window.exportToPdf;
  if (typeof originalShare !== 'function') return;
  function open(id, name, options = {}) {
    if (!documents.has(id)) throw new Error('Choose a supported clinical document.');
    const result=originalShare(id, name || documents.get(id), {...options,direct:false});
    const title=document.getElementById('pdfShareTitle');
    if(title)title.textContent='Review, save or share · '+documents.get(id);
    return result;
  }
  window.shareDocumentPdf = function (id, name, options = {}) {
    return documents.has(id) ? open(id,name,options) : originalShare(id,name,options);
  };
  window.exportToPdf = function (id, name) {
    return documents.has(id) ? open(id,name) : originalExport?.(id,name);
  };
  function labelActions() {
    const workspace = document.getElementById('doctorWorkstation');
    if (!workspace) return;
    workspace.querySelectorAll('button[onclick]').forEach(button => {
      const action = button.getAttribute('onclick') || '';
      if (/^exportToPdf\('(rxSheet|pathSlipSheet|radSlipSheet)'/.test(action) || /^exportCurrent(ClinDoc|DeathForm)Pdf\(/.test(action) || /^exportCertificateFormPdf\(/.test(action)) {
        button.textContent = 'Prepare PDF';
        button.dataset.documentAction = 'prepare-pdf';
      } else if (/^universalShareDocument\(/.test(action) || /^shareSelectedCertificate\(/.test(action) || /^shareCertificateFormPdf\(/.test(action)) {
        button.textContent = 'Share PDF';
        button.dataset.documentAction = 'share-pdf';
      } else if (/^printClinicalDocument\(/.test(action) || /^printActiveCertificate\(/.test(action)) {
        button.textContent='Print';
        button.dataset.documentAction='print';
      }
    });
    for(const [id,label,action] of [['invoiceDownloadPdf','Prepare PDF','prepare-pdf'],['invoiceSharePdf','Share PDF','share-pdf'],['invoicePrint','Print','print']]){
      const button=document.getElementById(id);if(button){button.textContent=label;button.dataset.documentAction=action;}
    }
    const textSave = document.getElementById('rxSavePrescriptionBtn');
    if (textSave) { textSave.textContent = 'Save text as…'; textSave.title = 'Save a text copy; use Prepare PDF for the formatted document.'; }
    const help = document.createElement('p');
    help.className = 'clinical-workflow-help no-print';
    help.textContent = 'Document workflow: complete and review the details → Prepare PDF → Download PDF or Share PDF → verify the file and recipient. Text copies and private-cloud saves are separate actions.';
    help.id = 'clinicalWorkflowHelp';
    const home = document.getElementById('viewDocumentHome');
    if (home && !document.getElementById(help.id)) home.append(help);
  }
  window.ClinicalDocumentWorkflow = Object.freeze({open,documents});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',labelActions,{once:true}); else labelActions();
})();
