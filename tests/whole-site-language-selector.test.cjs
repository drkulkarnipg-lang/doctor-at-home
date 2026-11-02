'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('whole-site language picker exposes complete language list and has a fallback for missing widget options',()=>{
 const html=fs.readFileSync('index.html','utf8'),sourceTranslation=fs.readFileSync('source-translation.js','utf8');
 assert.match(html,/id="siteLanguageSelector"/);
 for(const code of ['en','mr','hi','gu','bn','ta','te','kn','ml','ur','pa','or','as','ne','fr','es','ar','zh-CN','da','nl','de','el','it','ja','ko','pt','ru','sv','tr','vi','zu'])assert.match(html,new RegExp('<option value="'+code.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'">'));
 assert.match(html,/picker\.addEventListener\('change',\s*\(\)\s*=>\s*\{[\s\S]*?quickTranslate\(picker\.value\)[\s\S]*?panel\.open = false/,'the native picker must invoke the shared whole-site translation handler');
 assert.match(html,/const supported = select && \[\.\.\.select\.options\]\.some\(option => option\.value === code\)/);
 assert.match(html,/googtrans=\/en\/' \+ code/);
 assert.match(html,/code === 'en'/);
 assert.match(html,/current page, tabs and visible library content/);
 assert.match(html,/\.language-control\[open\]>.language-row\{position:absolute/,'desktop language panel must open as an anchored overlay');
 assert.match(html,/\.language-control>summary\{display:flex/,'language panel must have a visible, clickable summary');
 assert.match(html,/event\.key === 'Escape'[\\s\\S]*?panel\.open = false/,'Escape must close the language panel');
 assert.match(html,/pointerdown[\\s\\S]*?panel\.open = false/,'outside click must close the language panel');
 assert.doesNotMatch(sourceTranslation,/select\.replaceChildren\(/,'A partially loaded Google widget must never truncate the full source-language selector.');
 assert.match(sourceTranslation,/Keep the complete static 17-language list/);
});
