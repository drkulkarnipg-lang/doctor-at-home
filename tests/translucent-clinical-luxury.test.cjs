'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('translucent-clinical-luxury.css','utf8');
const marker='/* FIX-001 — owner-approved sky / ivory / sage / powder-blue palette.';
const start=css.lastIndexOf(marker);
assert.ok(start>=0,'FIX-001 final palette layer must exist');
const finalLayer=css.slice(start);
assert.match(html,/<link rel="stylesheet" href="translucent-clinical-luxury\.css"\s*\/?\s*>/i,'Home page must load the shared design system');
assert.ok(html.indexOf('international-portal.css')<html.indexOf('translucent-clinical-luxury.css'),'Design system must load after the legacy public-page stylesheet');
for(const token of ['--dkl-sky-0:#f7fbff','--dkl-ivory:#fffefa','--dkl-sage:#eaf2ec','--dkl-powder:#e8f1fb','--dkl-blush:#f8eef1','--dkl-lavender:#f1eff9','--dkl-ink:#24384b','--dkl-muted:#526577']){
  assert.ok(finalLayer.includes(token),'Missing approved design token: '+token);
}
assert.match(finalLayer,/body\s*\{[\s\S]*?linear-gradient\(135deg,#f7fbff 0%,#fffefa 54%,#f1f6f8 100%\)/,'Global canvas must use cool sky/ivory rather than the previous yellow palette');
assert.match(finalLayer,/#publicPortal\s*\{[\s\S]*?linear-gradient\(180deg,#f7fbff 0%,#fffefa 52%,#f3f7fa 100%\)/,'Public Home surface must use the approved cool palette');
assert.match(finalLayer,/#portalPanelOverview \.hero-primary-actions \.primary-link\s*\{[^}]*color:#fff!important/s,'Primary action must retain high-contrast white text');
assert.match(finalLayer,/@media\(max-width:767px\)/,'Mobile Home layout refinements must remain present');
assert.match(finalLayer,/@media\(prefers-reduced-transparency:reduce\)/,'Reduced-transparency fallback must be provided');
assert.match(finalLayer,/:focus-visible/,'Keyboard focus styling must remain visible');
assert.doesNotMatch(finalLayer,/#fff3cf|#fff1cf|#fff3d5|#fff2ce/i,'Old custard/yellow surfaces must not override the approved palette');
function luminance(hex){
  const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
  return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
assert.ok(contrast('#24384b','#fffefa')>=7,'Primary body text must meet WCAG AAA contrast on ivory');
assert.ok(contrast('#526577','#f7fbff')>=4.5,'Muted text must meet WCAG AA contrast on sky background');
console.log('FIX-001 translucent clinical luxury design-system checks passed.');
