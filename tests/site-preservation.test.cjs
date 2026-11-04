'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const baseline = require('../data/site-preservation-baseline-2026-11-04.json');
const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;
for (const id of baseline.ids) assert.ok(document.getElementById(id), `Retain #${id}`);
const attributes = [...html.matchAll(/\b(href|src|onclick|onchange)=["']([^"']*)/g)].map(m => JSON.stringify([m[1], m[2]]));
const counts = values => values.reduce((m, value) => (m.set(value, (m.get(value) || 0) + 1), m), new Map());
const current = counts(attributes);
for (const [attribute, count] of counts(baseline.link_and_action_attributes.map(x => JSON.stringify(x)))) {
  assert.ok((current.get(attribute) || 0) >= count, `Retain every occurrence: ${attribute}`);
}
for (const path of baseline.tracked_paths) assert.ok(fs.existsSync(path), `Retain ${path}`);
for (const label of document.querySelectorAll('label[for]')) {
  assert.ok(document.getElementById(label.htmlFor), `Label resolves to #${label.htmlFor}`);
}
assert.ok(document.querySelector('label[for="rxPatName"]'));
assert.ok(document.querySelector('label[for="rxAllergies"]') || document.getElementById('rxAllergies'));
const hero = document.querySelector('.hero-copy');
assert.ok(hero.querySelector('.hero-primary-actions').compareDocumentPosition(hero.querySelector('.section-translator')) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING,
  'Keyboard reading order follows visual order: visit actions before translation');
dom.window.close();
console.log(`Preserved ${baseline.ids.length} IDs, ${baseline.link_and_action_attributes.length} link/action attributes and ${baseline.tracked_paths.length} tracked files; explicit label targets resolve.`);
