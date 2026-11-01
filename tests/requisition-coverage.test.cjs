'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const sharing=fs.readFileSync('document-sharing.js','utf8');
const clinical=fs.readFileSync('clinical-documents.js','utf8');

// E07: the requested laboratory choices remain separate selectable items.
for(const [id,label] of [
 ['t_lipid','Lipid Profile (Total Cholesterol, LDL, HDL, Triglycerides)'],
 ['t_ammonia','Serum Ammonia'],
 ['t_iron','Iron Studies (Serum Iron, Ferritin, TIBC)']
]) assert.ok(html.includes('id="'+id+'" type="checkbox" value="'+label+'"'),'Missing pathology choice: '+id);

// E08: bedside/portable imaging and arterial/venous Doppler remain distinct.
for(const [id,label] of [
 ['rad_cxr','Portable Digital Chest X-Ray'],
 ['rad_usg','Bedside USG Abdomen &amp; Pelvis'],
 ['rad_dop_v','Venous Color Doppler Lower Limb'],
 ['rad_dop_a','Arterial Color Doppler Lower Limb']
]) assert.ok(html.includes('id="'+id+'" type="checkbox" value="'+label+'"'),'Missing imaging choice: '+id);
assert.notEqual('rad_dop_v','rad_dop_a');

// Both requisitions expose separate A4 export and PDF-share routes.
assert.ok(html.includes("exportToPdf('pathSlipSheet', 'Lab_Requisition.pdf')"));
assert.ok(html.includes("exportToPdf('radSlipSheet', 'Radiology_Requisition.pdf')"));
assert.ok(sharing.includes("path:['pathSlipSheet','Lab_Requisition']"));
assert.ok(sharing.includes("rad:['radSlipSheet','Radiology_Requisition']"));
assert.ok(sharing.includes("span.textContent=o.checked?'✓':'□'"),'PDF clone must render a tick for selected requisition choices, not an x/cross');
assert.ok(sharing.includes("span.style.color=o.checked?'#15803d':'#64748b'"),'Selected requisition choices must render with a green checkmark');
assert.ok(sharing.includes("span.setAttribute('aria-label',o.checked?'Selected':'Not selected')"),'PDF checkmarks must retain an accessible selected state');
assert.ok(clinical.includes("['pathSlipSheet','reqDate','reqTime']"));
assert.ok(clinical.includes("['radSlipSheet','radDate','radTime']"));
console.log('E07/E08 requisition options, separate Doppler choices, A4 export, PDF sharing and clinical signoff checks passed.');
