const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');

const registration = html.match(/<strong id="rxRegistrationNumber" class="rx-registration-number">([^<]+)<\/strong>/);
assert.ok(registration, 'prescription registration identifier must use its dedicated layout class');
const rxHeader = html.match(/id="rxSheet"[\s\S]*?<\/div>\s*<div class="text-right/);
assert.ok(rxHeader, 'patient prescription header must be present');
assert.doesNotMatch(rxHeader[0], /Bachelor of Ayurvedic Medicine and Surgery/i, 'patient prescription must not expand BAMS below the doctor name');
assert.match(rxHeader[0], />BAMS<\/p>/, 'patient prescription should retain the concise BAMS qualification');
assert.equal(registration[1], 'I-24809A-1', 'registration identifier must match the owner-approved format');
assert.match(html, /\.rx-registration-number\s*\{[^}]*white-space:\s*nowrap\s*!important/i, 'registration number must not wrap');
assert.match(html, /\.rx-registration-number\s*\{[^}]*font-family:\s*Arial, Helvetica, sans-serif\s*!important/i, 'registration number must use a stable sans-serif font');
assert.match(html, /\.rx-registration-number\s*\{[^}]*line-height:\s*1\s*!important/i, 'registration number must keep a compact single baseline');
console.log('Prescription registration layout regression checks passed.');
