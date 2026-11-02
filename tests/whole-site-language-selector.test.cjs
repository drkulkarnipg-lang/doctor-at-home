'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('whole-site language picker exposes every A-Z language and a searchable, non-blocking desktop panel',()=>{
 const html=fs.readFileSync('index.html','utf8'),sourceTranslation=fs.readFileSync('source-translation.js','utf8');
 const block=html.match(/<select id="siteLanguageSelector"[\\s\\S]*?<\\/select>/);
 assert.ok(block,'whole-site language selector exists');
 const options=[...block[0].matchAll(/<option value="([^"]+)">([^<]+)<\\/option>/g)];
 assert.ok(options.length>=100,'full alphabetical language catalogue is present');
 const names=options.map(x=>x[2]);
 for(const name of ['Danish','Dutch','English','French','German','Hindi','Japanese','Marathi','Zulu'])assert.ok(names.some(x=>x.includes(name)),name+' must be present beyond A-C');
 assert.match(html,/picker\\.size = 9/,'the full language picker must be a visible scrollable list, not a clipped native dropdown');
 assert.match(html,/Search all website languages/,'language search must be available');
 assert.match(html,/position:fixed;top:var\\(--language-panel-top/,'desktop panel must float above page content');
 assert.match(html,/document\\.addEventListener\\('pointerdown',[\\s\\S]*?\\},true\\)/,'outside pointer closes the panel in capture phase');
 assert.match(html,/event\\.key === 'Escape'[\\s\\S]*?panel\\.open = false/,'Escape closes the panel');
 assert.match(html,/picker.addEventListener\\('change',[\\s\\S]*?panel.open = false/,'choosing a language closes the panel');
 assert.match(sourceTranslation,/Keep the complete static 17-language list/);
});
