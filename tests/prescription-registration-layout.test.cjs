const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');

const registration = html.match(/<strong id="rxRegistrationNumber" class="rx-registration-number">([^<]+)<\/strong>/);
assert.ok(registration, 'prescription registration identifier must use its dedicated layout class');
assert.equal(registration[1], 'I24809-A-1', 'registration identifier must match the owner-approved format');
assert.match(html, /\.rx-registration-number\s*\{[^}]*white-space:\s*nowrap\s*!important/i, 'registration number must not wrap');
assert.match(html, /\.rx-registration-number\s*\{[^}]*font-family:\s*Arial, Helvetica, sans-serif\s*!important/i, 'registration number must use a stable sans-serif font');
assert.match(html, /\.rx-registration-number\s*\{[^}]*line-height:\s*1\s*!important/i, 'registration number must keep a compact single baseline');
console.log('Prescription registration layout regression checks passed.');
