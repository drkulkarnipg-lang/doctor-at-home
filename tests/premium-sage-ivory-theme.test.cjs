'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const match=html.match(/<style id="premium-sage-ivory-theme">([\\s\\S]*?)<\\/style>/);
assert.ok(match,'Premium theme is loaded inline by the main page.');
const css=match[1];
for(const token of ['#FCFBF8','#F7F8F4','#F4F0E8','#EAF0E9','#A8B9A8','#263B35','#78847D','#E8EAE4','#C9B99A']){
 assert.ok(css.toUpperCase().includes(token),'Required design token is present: '+token);
}
assert.match(css,/\\.site-header[\\s\\S]*?background:/,'Header is included in the design layer.');
assert.match(css,/#publicPortal[\\s\\S]*?background:/,'Patient Portal is included in the design layer.');
assert.match(css,/#publicPortal :is\\(input,select,textarea\\)/,'Patient-facing forms receive accessible styling.');
assert.match(css,/@media\\(max-width:680px\\)/,'Responsive mobile rules are included.');
assert.match(css,/@media print/,'Print output has a safe white background.');
assert.match(css,/prefers-reduced-motion:reduce/,'Reduced-motion preference is respected.');
console.log('Premium Sage & Ivory theme checks passed.');
