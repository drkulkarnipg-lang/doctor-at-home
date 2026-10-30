'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const css=fs.readFileSync('workstation.css','utf8'),html=fs.readFileSync('index.html','utf8');
const nav=css.match(/\.doctor-tabs\{([^}]*)\}/);assert.ok(nav,'Doctor Workstation navigation rule exists');
assert.match(nav[1],/display:flex/);assert.match(nav[1],/flex-wrap:wrap/,'Workstation tabs must wrap on desktop, not only mobile');assert.match(nav[1],/overflow:visible/,'No workstation tabs should be clipped in the base layout');assert.match(nav[1],/align-items:stretch/);
assert.doesNotMatch(nav[1],/overflow-x:auto|overflow:hidden|white-space:nowrap/);
const buttons=css.match(/\.doctor-tabs button\{([^}]*)\}/);assert.ok(buttons);assert.match(buttons[1],/white-space:normal/);assert.match(buttons[1],/overflow-wrap:anywhere/);assert.match(buttons[1],/max-width:100%/);
assert.ok(/class="[^"]*\\bdoctor-tabs\\b/.test(html),'The existing workstation tab container is preserved');
console.log('Workstation navigation layout checks passed: tabs wrap visibly at desktop and mobile widths without horizontal clipping.');
