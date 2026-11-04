'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('navigation picker preserves the language catalogue but never forces whole-page translation',()=>{
 const html=fs.readFileSync('index.html','utf8'),sourceTranslation=fs.readFileSync('source-translation.js','utf8');
 assert.match(html,/id="siteLanguageSelector"/);
 for(const code of ['en','mr','hi','gu','bn','ta','te','kn','ml','ur','pa','or','as','ne','fr','es','ar','zh-CN'])assert.match(html,new RegExp('<option value="'+code.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'">'));
 assert.match(html,/picker\.addEventListener\('change',\s*\(\)\s*=>\s*\{\s*const code = picker\.value;[\s\S]*?quickTranslate\(code\);/,'the native picker must close the panel and invoke the shared whole-site translation handler');
 assert.match(html,/SectionLanguages\?\.choose\('siteLanguageSelector'/,'Header selection delegates to its own scope');
 const quick=html.slice(html.indexOf('function quickTranslate'),html.indexOf('function populateGoogleLanguagePickers'));
 assert.doesNotMatch(quick,/location\.(reload|replace)|googtrans=\/en\//,'Changing a selector must not reload or install a whole-page translation cookie');
 assert.match(html,/Changes only this section/);
 assert.doesNotMatch(sourceTranslation,/select\.replaceChildren\(/,'A partially loaded Google widget must never truncate the full source-language selector.');
 assert.match(sourceTranslation,/Keep the complete static 17-language list/);
});
