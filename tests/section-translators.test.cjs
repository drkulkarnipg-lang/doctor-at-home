'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');

const placements = [
  ['homeLanguagePicker', 'portalPanelOverview', 'portalPanelLibrary', 'main public home page'],
  ['libraryLanguagePicker', 'wikiSection', 'wikiSearchInput', 'patient Health Library'],
  ['doctorLanguagePicker', 'doctorWorkstation', 'tabClinicalTools', 'Doctor Workstation'],
  ['encyclopediaLanguagePicker', 'wikiModal', 'wikiModalTitle', 'Knowledge Encyclopedia reader']
];
for (const [id, startMarker, endMarker, label] of placements) {
  assert.equal((html.match(new RegExp('id="' + id + '"', 'g')) || []).length, 1, label + ' translator has one unique control.');
  const startAt = html.indexOf('id="' + startMarker + '"');
  const controlAt = html.indexOf('id="' + id + '"');
  const endAt = html.indexOf('id="' + endMarker + '"', controlAt);
  assert.ok(startAt >= 0 && controlAt > startAt, label + ' translator follows its intended section start.');
  assert.ok(endAt > controlAt, label + ' translator appears before the section content/navigation marker.');
}
const libraryHeading = html.slice(html.indexOf('class="library-heading-row'), html.indexOf('</div><div class="section-intro"', html.indexOf('class="library-heading-row')));
assert.ok(libraryHeading.includes('Health Library') && libraryHeading.includes('id="libraryLanguagePicker"'), 'Health Library translator is directly beside the Health Library title.');
assert.ok(libraryHeading.includes('library-heading-translator'), 'Health Library title and translator share the compact heading row.');
assert.ok(html.includes('class="section-language-picker"'), 'Section selectors share the language-picker class.');
assert.ok(html.includes('syncSectionLanguagePickers'), 'Section selectors are populated from the canonical language list.');
assert.ok(html.includes("target.matches('.section-language-picker')"), 'Changing a section selector invokes the shared translation action.');
assert.ok(html.includes('SectionLanguages?.choose(target.id, code)'), 'Section selectors delegate to an independent scope.');
assert.ok(html.includes('Changes only this section.'), 'Users are told the selected section alone changes.');
assert.ok(!html.includes('select.value = code; });'), 'No section-wide selector value synchronization.');
assert.ok(html.includes('@media(max-width:640px){.section-translator'), 'Section translators have a mobile layout.');
const master = html.match(/id="siteLanguageSelector"[\s\S]*?<\/select>/);
assert.ok(master, 'Canonical language list exists.');
const codes = [...master[0].matchAll(/<option value="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(codes).size, codes.length, 'Canonical language list contains no duplicate language codes.');
for (const code of ['mr','hi','gu','bn','ta','te','kn','ml','ur','pa','or','as']) {
  assert.ok(codes.includes(code), 'Indian/South Asian language is available: ' + code);
}
console.log('Section-specific translator placement and independent-scope contract checks passed.');
