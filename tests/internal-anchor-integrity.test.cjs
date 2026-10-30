'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');

const ids = [...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map(m => m[1]);
const counts = new Map();
for (const id of ids) counts.set(id, (counts.get(id) || 0) + 1);
const duplicates = [...counts].filter(([, count]) => count > 1);
assert.deepEqual(duplicates, [], 'index.html must not contain duplicate IDs');

const idSet = new Set(ids);
const hrefs = [...html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/g)].map(m => m[1]);
const internalTargets = [...new Set(hrefs.filter(href => href.startsWith('#') && href.length > 1).map(href => href.slice(1)))];
const missing = internalTargets.filter(target => !idSet.has(target));
assert.deepEqual(missing, [], 'all explicit internal anchor links must resolve to existing IDs');

for (const target of ['bookingSection', 'wikiSection', 'patientToolsSection']) {
  assert.ok(idSet.has(target), 'patient pathway target must remain present: #' + target);
  assert.ok(hrefs.includes('#' + target), 'patient pathway must remain linked: #' + target);
}
console.log('Internal anchor integrity passed: unique IDs, all in-page targets resolve, and booking/library/health-tool pathways remain linked.');
