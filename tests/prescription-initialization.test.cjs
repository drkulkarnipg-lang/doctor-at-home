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
fields[1].value = 'Owner-entered timing';
w.initRxPad();
assert.equal(body.rows.length, 1, 'reopening must not clear or duplicate an existing row');
assert.equal(body.rows[0].querySelectorAll('input')[0].value, 'Owner-entered medicine');
assert.equal(body.rows[0].querySelectorAll('input')[1].value, 'Owner-entered timing');

w.addRxRow();
assert.equal(body.rows.length, 2, 'Add Medicine Row should add another row');
assert.deepEqual(
  [...body.rows[1].querySelectorAll('input')].map(input => input.value),
  ['', '', '', '', ''],
  'an added row must be blank so no regimen is accidentally implied'
);

dom.window.close();
console.log('Prescription initialization safety and row-preservation checks passed.');
