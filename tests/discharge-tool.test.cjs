const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
const dom=new JSDOM('<section id="portalPanelTools"></section><select id="cloudPatientSelect"></select>',{runScripts:'outside-only',url:'https://example.test'}),w=dom.window,d=w.document;
w.eval(fs.readFileSync('discharge-tool.js','utf8'));d.dispatchEvent(new w.Event('DOMContentLoaded'));const f=d.querySelector('#dtForm');
f.elements.reference.value='<img src=x>';f.elements.symptoms.value='urgent';f.dispatchEvent(new w.Event('change'));assert.match(d.querySelector('#dtAlert').textContent,/तातडीची/);
for(const select of f.querySelectorAll('fieldset select'))select.value='done';
f.elements.action.value='Test';f.elements.due.value='2020-01-01';f.elements.owner.value='Test clinician';f.dispatchEvent(new w.Event('submit',{cancelable:true}));assert.match(d.querySelector('#dtSummary').textContent,/तारीख उलटली/);assert.equal(d.querySelector('#dtSummary img'),null);
f.elements.notes.value='Changed';f.dispatchEvent(new w.Event('input'));assert.equal(d.querySelector('#dtSummary').textContent,'');
w.dispatchEvent(new w.Event('clinic-owner-signed-out'));assert.equal(f.elements.reference.value,'');assert.equal(f.elements.notes.value,'');
f.elements.reference.value='Test';d.querySelector('#cloudPatientSelect').dispatchEvent(new w.Event('change',{bubbles:true}));assert.equal(f.elements.reference.value,'');assert.equal(w.localStorage.length,0);assert.equal(w.sessionStorage.length,0);dom.window.close();console.log('Discharge checklist: urgent notice, overdue task, escaping, stale summary invalidation and patient reset passed.');
