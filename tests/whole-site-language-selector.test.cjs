'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('whole-site language picker exposes complete language list and has a fallback for missing widget options',()=>{
 const html=fs.readFileSync('index.html','utf8'),sourceTranslation=fs.readFileSync('source-translation.js','utf8');
 assert.match(html,/id="siteLanguageSelector"/);
 for(const code of ['en','mr','hi','gu','bn','ta','te','kn','ml','ur','pa','or','as','ne','fr','es','ar','zh-CN'])assert.match(html,new RegExp('<option value="'+code.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'">'));
 assert.match(html,/picker\.addEventListener\('change',\(\) => quickTranslate\(picker\.value\)\)/);
 assert.match(html,/const supported = select && \[\.\.\.select\.options\]\.some\(option => option\.value === code\)/);
 assert.match(html,/googtrans=\/en\/' \+ code/);
 assert.match(html,/code === 'en'/);
 assert.match(html,/current page, tabs and visible library content/);
 assert.doesNotMatch(sourceTranslation,/select\.replaceChildren\(/,'A partially loaded Google widget must never truncate the full source-language selector.');
 assert.match(sourceTranslation,/Keep the complete static 17-language list/);
});
