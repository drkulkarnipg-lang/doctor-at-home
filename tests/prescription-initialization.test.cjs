'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const allergyField = html.match(/<input[^>]*id="rxAllergies"[^>]*>/);
assert.ok(allergyField, 'prescription must include an allergy-status field');
assert.match(allergyField[0], /value=""/, 'allergy status must not be prefilled as NKDA without verification');
assert.match(allergyField[0], /placeholder="Confirm and document allergy status"/);
const fullDom = new JSDOM(html, { url: 'https://clinic.example.test/', runScripts: 'outside-only' });
const rx = fullDom.window.document.getElementById('rxSheet');
for (const id of ['rxPatName','rxPatAge','rxDateTime','rxComplaints','vTemp','vPulse','vBP','rxTableBody']) assert.ok(rx.querySelector('#'+id), 'prescription includes '+id);
const headers = [...rx.querySelectorAll('#rxTable thead th')].map(th => th.textContent.trim().toLowerCase());
assert.equal(headers.length, 8, 'prescription has separate medicine and strength columns');
for (const header of ['medicine name','strength','timing / food','frequency','duration','additional instructions']) assert.ok(headers.some(h=>h.includes(header)), 'prescription header '+header);
assert.ok(rx.querySelector('button[onclick="addRxRow()"]'));
assert.ok(rx.querySelector('button[onclick="openDrugModal()"]'));
assert.doesNotMatch(fs.readFileSync('patient-age.js','utf8'),/mount\\('rxPatAge'\\)/,'Prescription must not mount a DOB widget.');
assert.equal(rx.querySelector('#rxPatAgeDOB'), null, 'Prescription must not contain a DOB control.');
fullDom.window.close();
const start = html.indexOf('function initRxPad() {');
const end = html.indexOf('function renderDrugDirectory()', start);
assert.ok(start >= 0 && end > start, 'prescription initializer and row helpers must exist');
const helpers = html.slice(start, end);
const dom = new JSDOM('<!doctype html><table><tbody id="rxTableBody"></tbody></table>', {
  url: 'https://clinic.example.test/',
  runScripts: 'outside-only'
});
const w = dom.window;
w.eval(helpers);

const body = w.document.getElementById('rxTableBody');
w.initRxPad();
assert.equal(body.rows.length, 1, 'first open should create one blank row');
assert.deepEqual(
  [...body.rows[0].querySelectorAll('input')].map(input => input.value),
  ['', '', '', '', ''],
  'no medicine, frequency, timing, duration or instructions may be prefilled'
);
assert.doesNotMatch(body.textContent, /Pantoprazole|Cidmus|Dytor-Plus/);

const fields = body.rows[0].querySelectorAll('input');
fields[0].value = 'Owner-entered medicine';
fields[1].value = 'Owner-entered strength';
const timing = body.rows[0].querySelector('select');
assert.equal(timing.value, '', 'timing starts blank');
const timingOptions = [...timing.options].map(option => option.textContent.toLowerCase()).join('|');
for (const label of ['before food','after food','empty stomach','at night']) assert.ok(timingOptions.includes(label), 'timing option '+label);
w.initRxPad();
assert.equal(body.rows.length, 1, 'reopening must not clear or duplicate an existing row');
assert.equal(body.rows[0].querySelectorAll('input')[0].value, 'Owner-entered medicine');
assert.equal(body.rows[0].querySelectorAll('input')[1].value, 'Owner-entered strength');
assert.equal(body.rows[0].querySelector('select').value, '', 'blank timing remains blank after reinitialisation');

w.addRxRow();
assert.equal(body.rows.length, 2, 'Add Medicine Row should add another row');
assert.deepEqual(
  [...body.rows[1].querySelectorAll('input')].map(input => input.value),
  ['', '', '', '', ''],
  'an added row must be blank so no regimen is accidentally implied'
);

w.showToast=()=>{};w.switchDocTab=()=>{};
const drugStart=html.indexOf('function addDrugDirectlyToRx('),drugEnd=html.indexOf('function filterDrugDirectory()',drugStart);
assert.ok(drugStart>=0&&drugEnd>drugStart,'formulary add helper exists');
w.eval(html.slice(drugStart,drugEnd));
w.addDrugDirectlyToRx('Amlodipine 5 mg','BD','after-food','5','Take after food');
const formularyRow=body.rows[2];
assert.equal(formularyRow.cells[1].querySelector('input').value,'Amlodipine 5 mg');
assert.equal(formularyRow.cells[2].querySelector('input').value,'','Formulary must not infer strength.');
assert.equal(formularyRow.cells[3].querySelector('select').value,'','Formulary must not infer timing.');
for(const cell of [4,5,6])assert.equal(formularyRow.cells[cell].querySelector('input').value,'','Formulary must not infer frequency, duration or instructions.');
dom.window.close();
console.log('Prescription initialization safety and row-preservation checks passed.');
