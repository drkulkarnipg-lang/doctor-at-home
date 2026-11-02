'use strict';
const fs = require('node:fs');
const path = require('node:path');
const education = require('../patient-education-data.js');
const output = path.resolve(__dirname, '../tmp/pdfs/education-content.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({
  articles: education.articles,
  sources: education.sources,
  presentation: education.presentation
}, null, 2) + '\n');
console.log('Exported ' + education.articles.length + ' bilingual patient education guides for PDF generation.');
