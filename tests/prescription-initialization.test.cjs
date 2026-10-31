'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const allergyField = html.match(/<input[^>]*id="rxAllergies"[^>]*>/);
assert.ok(allergyField, 'prescription must include an allergy-status field');
assert.match(allergyField[0], /value=""/, 'allergy status must not be prefilled as NKDA without verification');
assert.match(allergyField[0], /placeholder="Confirm and document allergy status"/);
const start = html.indexOf('function initRxPad() {');
const end = html.indexOf('function renderDrugDirectory()', start);
assert.ok(start >= 0 && end > start, 'prescription initializer and row helpers must exist');
const helpers = html.slice(start, end);
const dom = new JSDOM('<!doctype html><input id="rxDateTime" type="date"><table><tbody id="rxTableBody"></tbody></table>', {
  url: 'https://clinic.example.test/',
  runScripts: 'outside-only'
});
const w = dom.window;
w.eval(helpers);

const body = w.document.getElementById('rxTableBody');
w.initRxPad();
assert.equal(body.rows.length, 1, 'first open should create one blank row');
assert.match(w.document.getElementById('rxDateTime').value, /^\d{4}-\d{2}-\d{2}$/, 'prescription date defaults to the local calendar date');
assert.deepEqual(
  [...body.rows[0].querySelectorAll('input')].map(input => input.value),
  ['', '', '', '', ''],
  'no drug, strength, frequency, duration or instruction may be prefilled'
);
assert.doesNotMatch(body.textContent, /Pantoprazole|Cidmus|Dytor-Plus/);

const fields = body.rows[0].querySelectorAll('input');
fields[0].value = 'Owner-entered medicine';
fields[1].value = 'Owner-entered strength';
w.initRxPad();
assert.equal(body.rows.length, 1, 'reopening must not clear or duplicate an existing row');
assert.equal(body.rows[0].querySelectorAll('input')[0].value, 'Owner-entered medicine');
assert.equal(body.rows[0].querySelectorAll('input')[1].value, 'Owner-entered strength');

w.addRxRow();
assert.equal(body.rows.length, 2, 'Add Medicine Row should add another row');
assert.deepEqual(
  [...body.rows[1].querySelectorAll('input')].map(input => input.value),
  ['', '', '', '', ''],
  'an added row must be blank so no regimen is accidentally implied'
);

dom.window.close();
console.log('Prescription initialization safety and row-preservation checks passed.');

assert.match(html, /id="rxSerialNo"/, 'prescription must include a serial number');
assert.match(html, /id="rxPatSex"/, 'age and sex must be separate patient fields');
assert.match(html, /id="rxProvisionalDiagnosis"/, 'prescription must include provisional diagnosis');
assert.match(html, /src="assets\/dr-kulkarni-signature\.svg"/, 'doctor signature asset must be embedded in the prescription');
assert.ok(fs.existsSync('assets/dr-kulkarni-signature.svg'), 'signature image asset must exist in the repository');
assert.match(html, /Drug name[\s\S]*Strength[\s\S]*Frequency[\s\S]*Duration[\s\S]*Instructions/, 'prescription medication columns must match requested order');
