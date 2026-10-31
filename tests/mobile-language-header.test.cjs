'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('international-portal.css','utf8');
assert.match(html,/layout:\s*google\.translate\.TranslateElement\.InlineLayout\.SIMPLE/,'Language widget must use compact inline layout');
const mobile=html.match(/@media\(max-width:640px\)\{([^\n]*?\.site-header\{position:relative!important;[^\n]*?)\}\s*\.register-type-controls/s);
assert.ok(mobile,'Phone breakpoint must explicitly override the sticky header');
assert.match(mobile[1],/\.site-header>div\{display:flex;flex-direction:column;align-items:stretch/,'Brand and controls must stack in normal flow on phones');
assert.match(mobile[1],/\.language-control\{flex:1 1 100%;width:100%;min-width:0;max-width:100%/,'Language control must use the full available phone width');
assert.match(mobile[1],/\.language-status,\.language-help-link\{display:none!important\}/,'Explanatory text and external help link must not inflate the mobile header');
assert.match(mobile[1],/\.goog-te-banner-frame,\.goog-te-banner-frame\.skiptranslate\{display:none!important\}/,'Google Translate banner must not cover the phone viewport');
assert.match(mobile[1],/body\{top:0!important\}/,'Translate widget must not leave a blank offset above the page');

const inFlow=css.match(/\.site-header\s+\.language-control\[open\]\s*>\s*div\s*\{([^}]+)\}/s);
assert.ok(inFlow,'the open language panel must have a dedicated in-flow override in the imported stylesheet');
for(const declaration of [/position:\s*static\s*!important/i,/inset:\s*auto\s*!important/i,/left:\s*auto\s*!important/i,/right:\s*auto\s*!important/i,/top:\s*auto\s*!important/i,/bottom:\s*auto\s*!important/i,/width:\s*100%\s*!important/i,/max-height:\s*none\s*!important/i,/overflow:\s*visible\s*!important/i])assert.match(inFlow[1],declaration,'the mobile open panel must override the global fixed-position popover rule');
assert.match(css,/\.site-header\s+\.language-control\s*>\s*summary\s*\{[^}]*min-height:\s*44px/s,'the language summary must remain a comfortable touch target');
console.log('Mobile language/header regression checks passed.');
