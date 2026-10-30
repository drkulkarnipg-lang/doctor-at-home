'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const prescription = html.match(/onclick="exportToPdf\('rxSheet', '([^']+)'\)"/);
const lab = html.match(/onclick="exportToPdf\('pathSlipSheet', '([^']+)'\)"/);
const radiology = html.match(/onclick="exportToPdf\('radSlipSheet', '([^']+)'\)"/);

assert.ok(prescription, 'prescription must have a PDF download action');
assert.ok(lab, 'lab requisition must have a PDF download action');
assert.ok(radiology, 'radiology requisition must have a PDF download action');
assert.equal(prescription[1], 'Prescription.pdf', 'prescription filename should identify the document, not the doctor');
assert.equal(lab[1], 'Lab_Requisition.pdf', 'lab requisition filename should identify the document');
assert.equal(radiology[1], 'Radiology_Requisition.pdf', 'radiology requisition filename should identify the document');
assert.doesNotMatch(prescription[1], /Dr.?_?Kulkarni/i);
assert.doesNotMatch(lab[1], /Dr.?_?Kulkarni/i);
assert.doesNotMatch(radiology[1], /Dr.?_?Kulkarni/i);

console.log('Document-specific PDF filename checks passed.');
