'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { url: 'https://clinic.example.test/', runScripts: 'outside-only' });
const { window: w } = dom;
const d = w.document;

// Lab choices requested in the owner notes must exist with their full selectable identities.
for (const id of ['t_lipid', 't_iron', 't_ammonia']) {
  assert.ok(d.getElementById(id), `lab test ${id} must be present`);
}
assert.match(d.getElementById('t_lipid').value, /Lipid Profile/);
assert.match(d.getElementById('t_iron').value, /Iron Studies/);
assert.match(d.getElementById('t_ammonia').value, /Ammonia/i);

// Nothing is preselected: selection must be a clinician action, not an implied order.
assert.equal(d.querySelectorAll('#pathCheckboxesGrid input[type="checkbox"]:checked').length, 0,
  'lab tests must all start unselected');
assert.equal(d.querySelectorAll('#radSlipSheet input[type="checkbox"]:checked').length, 0,
  'radiology tests must all start unselected');

// The clinical document module creates the radiology identity/date/time fields at runtime.
const clinicalDocuments = fs.readFileSync('clinical-documents.js', 'utf8');
assert.match(clinicalDocuments, /field\(row,'radPatName','Patient name'/);
assert.match(clinicalDocuments, /field\(row,'radPatAge','Age \/ sex'/);
assert.match(clinicalDocuments, /field\(row,'radDate','Document date'/);
assert.match(clinicalDocuments, /field\(row,'radTime','Time \(IST\)'/);
for (const id of ['rad_usg', 'rad_dop_v', 'rad_dop_a', 'rad_ct_brain', 'rad_ct_chest', 'rad_mri_brain', 'rad_mri_spine']) {
  assert.ok(d.getElementById(id), `radiology choice ${id} must exist`);
}
assert.match(d.getElementById('rad_usg').value, /Bedside USG/);
assert.match(d.getElementById('rad_dop_v').value, /Venous/);
assert.match(d.getElementById('rad_dop_a').value, /Arterial/);
assert.match(d.getElementById('rad_ct_brain').value, /NCCT Brain/);
assert.match(d.getElementById('rad_ct_chest').value, /CT Chest/);
assert.match(d.getElementById('rad_mri_brain').value, /MRI Brain/);
assert.match(d.getElementById('rad_mri_spine').value, /MRI Spine/);

// Execute the real clinical document mount so its dynamic radiology fields are tested.
w.calculateFee = () => 100;
w.switchDocTab = () => {};
w.scrollTo = () => {};
w.HTMLElement.prototype.scrollIntoView = () => {};
w.eval(clinicalDocuments);
w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
for (const id of ['radPatName', 'radPatAge', 'radDate', 'radTime']) {
  assert.ok(d.getElementById(id), `runtime radiology patient field ${id} must exist`);
}
const runtimeIds = [...d.querySelectorAll('[id]')].map(el => el.id);
assert.equal(new Set(runtimeIds).size, runtimeIds.length, 'runtime mount must not create duplicate element IDs');

// Execute the actual share function against synthetic data and verify chosen tests + correct patient identity.
const start = html.indexOf('function universalShareDocument(type) {');
const end = html.indexOf('function openDirectWhatsAppFallback(phone, text) {', start);
assert.ok(start >= 0 && end > start, 'document sharing function must exist');
w.eval(html.slice(start, end));
let shared = null;
Object.defineProperty(w.navigator, 'share', { configurable: true, value: payload => { shared = payload; return Promise.resolve(); } });

d.getElementById('reqPatName').value = 'Lab Test Patient';
d.getElementById('reqPatAge').value = '64 Y / F';
d.getElementById('reqDate').value = '31/10/2026';
d.getElementById('t_lipid').checked = true;
d.getElementById('t_iron').checked = true;
d.getElementById('t_ammonia').checked = true;
w.universalShareDocument('path');
assert.ok(shared, 'lab share should hand the prepared requisition to the share API');
assert.match(shared.text, /Patient: Lab Test Patient/);
assert.match(shared.text, /Age\/Sex: 64 Y \/ F/);
assert.match(shared.text, /Date: 2026-10-31/);
assert.match(shared.text, /Lipid Profile/);
assert.match(shared.text, /Iron Studies/);
assert.match(shared.text, /Serum Ammonia/);

shared = null;
d.getElementById('radPatName').value = 'Radiology Test Patient';
d.getElementById('radPatAge').value = '71 Y / M';
d.getElementById('radDate').value = '2026-10-31';
d.getElementById('rad_usg').checked = true;
d.getElementById('rad_dop_v').checked = true;
d.getElementById('rad_dop_a').checked = true;
d.getElementById('rad_ct_brain').checked = true;
d.getElementById('rad_ct_chest').checked = true;
d.getElementById('rad_mri_brain').checked = true;
d.getElementById('rad_mri_spine').checked = true;
d.getElementById('radIndication').value = 'Synthetic test indication';
w.universalShareDocument('rad');
assert.ok(shared, 'radiology share should hand the prepared requisition to the share API');
assert.match(shared.text, /Patient: Radiology Test Patient/);
assert.match(shared.text, /Age\/Sex: 71 Y \/ M/);
assert.match(shared.text, /Date: 31\/10\/2026/);
for (const label of ['Bedside USG Abdomen & Pelvis', 'Venous Color Doppler Lower Limb', 'Arterial Color Doppler Lower Limb', 'NCCT Brain (Stroke)', 'CT Chest', 'MRI Brain', 'MRI Spine']) {
  assert.ok(shared.text.includes(label), `shared radiology requisition must include selected ${label}`);
}
assert.match(shared.text, /Clinical indication: Synthetic test indication/);

dom.window.close();
console.log('Lab/radiology choices, safe defaults, patient identity and selected-item share output checks passed.');
