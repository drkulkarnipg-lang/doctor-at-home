'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');

const placements = [
  ['homeLanguagePicker', 'portalPanelOverview', 'main public home page'],
  ['libraryLanguagePicker', 'wikiSection', 'patient Health Library'],
  ['doctorLanguagePicker', 'doctorWorkstation', 'Doctor Workstation'],
  ['encyclopediaLanguagePicker', 'wikiModal', 'Knowledge Encyclopedia reader']
];
for (const [id, container, label] of placements) {
  assert.equal((html.match(new RegExp('id="' + id + '"', 'g')) || []).length, 1, label + ' translator has one unique control.');
  const controlAt = html.indexOf('id="' + id + '"');
  const containerAt = html.lastIndexOf('id="' + container + '"', controlAt);
  assert.ok(containerAt >= 0, label + ' translator is nested in its intended section.');
  const nextSection = html.indexOf('<section', containerAt + 8);
  assert.ok(nextSection < 0 || controlAt < nextSection || container === 'wikiModal', label + ' translator placement is within its intended region.');
}
assert.ok(html.includes('class="section-language-picker"'), 'Section selectors share the language-picker class.');
assert.ok(html.includes('syncSectionLanguagePickers'), 'Section selectors are populated from the canonical language list.');
assert.ok(html.includes("target.matches('.section-language-picker')"), 'Changing a section selector invokes the shared translation action.');
assert.ok(html.includes('quickTranslate(code)'), 'Section selectors use the existing Google Translate integration.');
assert.ok(html.includes('Applies to the whole page.'), 'Users are told translation applies to the complete page.');
assert.ok(html.includes('@media(max-width:640px){.section-translator'), 'Section translators have a mobile layout.');
const master = html.match(/id="siteLanguageSelector"[\s\S]*?<\/select>/);
assert.ok(master, 'Canonical language list exists.');
const codes = [...master[0].matchAll(/<option value="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(codes).size, codes.length, 'Canonical language list contains no duplicate language codes.');
for (const code of ['mr','hi','gu','bn','ta','te','kn','ml','ur','pa','or','as']) {
  assert.ok(codes.includes(code), 'Indian/South Asian language is available: ' + code);
}
console.log('Section-specific translator placement and synchronization checks passed.');
