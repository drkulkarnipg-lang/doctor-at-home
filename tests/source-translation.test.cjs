'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
const html='<!doctype html><html><body><div id="google_translate_element"></div><select id="sourceTranslateLanguage"><option value="mr">Marathi</option><option value="hi">Hindi</option></select><section id="exploreHealthResources"><a id="original" href="https://example.org/guide">Original guide</a><span>|</span><a id="existingTranslate" href="https://translate.google.com/translate?sl=auto&tl=mr&u=https%3A%2F%2Fexample.org%2Fguide" target="_blank" rel="noopener noreferrer">Translate ↗</a><a id="other" href="https://example.org/other">Another source</a><a id="pdf" href="https://example.org/official.pdf">Official PDF</a><a id="internal" href="/articles">Internal article</a><a id="mail" href="mailto:doctor@example.org">Email</a></section></body></html>';
const dom=new JSDOM(html,{url:'https://clinic.example/',runScripts:'outside-only'}),w=dom.window;
w.eval(fs.readFileSync('source-translation.js','utf8'));
const tick=()=>new Promise(resolve=>setTimeout(resolve,25));
(async()=>{
 await tick();
 const root=w.document.getElementById('exploreHealthResources'),select=w.document.getElementById('sourceTranslateLanguage');
 const original=w.document.getElementById('original'),existing=w.document.getElementById('existingTranslate'),other=w.document.getElementById('other'),pdf=w.document.getElementById('pdf');
 assert.equal(original.href,'https://example.org/guide','Original source URL must remain unchanged');
 assert.equal(root.querySelectorAll('a[href*="translate.google.com/translate"]').length,3,'One translation link per eligible source; existing translated link must not be duplicated');
 assert.equal(existing.classList.contains('source-translate-link'),true,'Existing translation link receives consistent visible styling');
 assert.ok(existing.href.includes('tl=mr'),'Existing translation link follows the selected language');
 const otherTranslate=other.nextElementSibling;assert.ok(otherTranslate.classList.contains('source-translate-link'));assert.ok(otherTranslate.href.includes('u='+encodeURIComponent('https://example.org/other')));
 const pdfTranslate=pdf.nextElementSibling;assert.ok(pdfTranslate.classList.contains('source-translate-link'),'PDF source gets a best-effort Google Translate link while original remains available');
 select.value='hi';select.dispatchEvent(new w.Event('change',{bubbles:true}));assert.ok(existing.href.includes('tl=hi'));assert.ok(otherTranslate.href.includes('tl=hi'));assert.ok(pdfTranslate.href.includes('tl=hi'));
 for(const a of [existing,otherTranslate,pdfTranslate]){assert.equal(a.target,'_blank');assert.match(a.rel,/noopener/);assert.match(a.rel,/noreferrer/);assert.ok(a.getAttribute('aria-label'));}
 assert.equal(w.document.getElementById('internal').nextElementSibling,null,'Internal links are not wrapped in external translation links');
 assert.equal(w.document.getElementById('mail').nextElementSibling,null,'Non-web protocols are not translated');
 assert.equal(w.document.getElementById('original').href,'https://example.org/guide','Language changes must never overwrite the original destination');
 assert.match(fs.readFileSync('patient-education.css','utf8'),/source-translate-link:focus-visible/,'Translation controls need visible keyboard focus');
 dom.window.close();console.log('Source translation regression passed: no duplicate links, selected language updates, originals remain intact, and controls are styled/accessibile.');
})().catch(e=>{console.error(e);process.exitCode=1;});
