'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const html=fs.readFileSync('index.html','utf8');
const script=fs.readFileSync('clinical-calculators.js','utf8');
function mount(){
 const dom=new JSDOM('<!doctype html><html><head></head><body><div id="viewPathCheatSheet"></div></body></html>',{url:'https://clinic.example.test',runScripts:'outside-only'});
 Object.defineProperty(dom.window.document,'readyState',{configurable:true,value:'complete'});
 dom.window.eval(script);
 return dom;
}
function select(dom,id){
 const w=dom.window,search=w.document.getElementById('labrcSearch');
 search.value=id;search.dispatchEvent(new w.Event('input',{bubbles:true}));
 assert.equal(search.value,id);
 assert.equal(w.document.getElementById('labrcSuggestions').hidden,true);
}
function set(w,id,value){const el=w.document.getElementById(id);el.value=String(value);el.dispatchEvent(new w.Event('input',{bubbles:true}));}
test('prescription uses exact MCIM registration number confirmed in council electoral roll',()=>{
 assert.match(html,/id="rxRegistrationNumber"[^>]*>I-24809A-1<\/strong>/);
 assert.doesNotMatch(html,/I-24809-A-1/);
 const regTest=fs.readFileSync('tests/prescription-registration-layout.test.cjs','utf8');
 assert.match(regTest,/I-24809A-1/);
});
test('lab checker instantly searches, partitions and classifies a documented Indian interval',()=>{
 const dom=mount(),w=dom.window;
 assert.equal(w.LAB_REFERENCE_TESTS.length,111);
 const search=w.document.getElementById('labrcSearch');search.value='Sodium';search.dispatchEvent(new w.Event('input',{bubbles:true}));
 assert.ok(w.document.querySelector('[data-test-id="na-india"]'));
 assert.ok(w.document.getElementById('labrcSuggestions').children.length>=2,'duplicate analyte partitions must be selectable');
 set(w,'labrcAge',30);select(dom,'na-india');set(w,'labrcValue',140);
 assert.match(w.document.getElementById('labrcResult').textContent,/WITHIN SELECTED REFERENCE INTERVAL/);
 assert.match(w.document.getElementById('labrcSelected').textContent,/Shah et al\. \(2018\)/);
 dom.window.close();
});
test('lab checker blocks out-of-population age and pregnancy transfer',()=>{
 let dom=mount(),w=dom.window;set(w,'labrcAge',70);select(dom,'na-india');
 assert.match(w.document.getElementById('labrcResult').textContent,/No compatible age partition/);dom.window.close();
 dom=mount();w=dom.window;set(w,'labrcAge',30);set(w,'labrcPregnancyContext','pregnant');select(dom,'na-india');
 assert.match(w.document.getElementById('labrcResult').textContent,/No pregnancy\/postpartum-specific interval/);dom.window.close();
});
test('decision limits are not mislabeled as population reference intervals',()=>{
 const dom=mount(),w=dom.window;set(w,'labrcAge',35);set(w,'labrcSex','male');
 select(dom,'hstni-mayo-male');set(w,'labrcValue',21);
 const result=w.document.getElementById('labrcResult').textContent;
 assert.match(result,/ABOVE assay-specific 99th-percentile decision limit/);
 assert.doesNotMatch(result,/WITHIN SELECTED REFERENCE INTERVAL/);
 dom.window.close();
});
test('legacy intervals require the actual reporting-laboratory interval before classification',()=>{
 const dom=mount(),w=dom.window;set(w,'labrcAge',30);select(dom,'na');
 assert.match(w.document.getElementById('labrcResult').textContent,/documentation is incomplete/);
 set(w,'labrcLow',135);set(w,'labrcHigh',145);set(w,'labrcUnit','mmol/L');set(w,'labrcValue',140);
 assert.match(w.document.getElementById('labrcResult').textContent,/WITHIN SELECTED REFERENCE INTERVAL/);
 dom.window.close();
});
