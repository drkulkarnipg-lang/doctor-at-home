'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('translucent-clinical-luxury.css','utf8');
const marker='/* FIX-001 — owner-approved sky / ivory / sage / powder-blue palette.';
const start=css.lastIndexOf(marker);
assert.ok(start>=0,'FIX-001 final palette layer must exist');
const finalLayer=css.slice(start);
const link=html.indexOf('<link rel="stylesheet" href="translucent-clinical-luxury.css"/>');
const inlineTheme=html.indexOf('<style id="premium-sage-ivory-theme">');
const themeEnd=html.indexOf('</style>',inlineTheme);
assert.ok(link>themeEnd,'Design system stylesheet MUST load after the inline premium theme; otherwise later inline CSS overrides FIX-001');
assert.equal((html.match(/translucent-clinical-luxury\.css/g)||[]).length,1,'Load exactly one design-system stylesheet');
for(const token of ['--dkl-sky-0:#f7fbff','--dkl-ivory:#fffefa','--dkl-sage:#eaf2ec','--dkl-powder:#e8f1fb','--dkl-blush:#f8eef1','--dkl-lavender:#f1eff9','--dkl-ink:#24384b','--dkl-muted:#526577']) assert.ok(finalLayer.includes(token),'Missing approved design token: '+token);
assert.match(finalLayer,/body\s*\{[\s\S]*?linear-gradient\(135deg,#f7fbff 0%,#fffefa 54%,#f1f6f8 100%\)/);
assert.match(finalLayer,/#publicPortal\s*\{[\s\S]*?linear-gradient\(180deg,#f7fbff 0%,#fffefa 52%,#f3f7fa 100%\)/);
assert.match(finalLayer,/#portalPanelOverview \.hero-primary-actions \.primary-link\s*\{[^}]*color:#fff!important/s);
assert.match(finalLayer,/@media\(max-width:767px\)/);
assert.match(finalLayer,/@media\(prefers-reduced-transparency:reduce\)/);
assert.match(finalLayer,/:focus-visible/);
assert.doesNotMatch(finalLayer,/#fff3cf|#fff1cf|#fff3d5|#fff2ce/i);
function lum(hex){const v=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*v[0]+.7152*v[1]+.0722*v[2]}
function ratio(a,b){const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
assert.ok(ratio('#24384b','#fffefa')>=7,'Primary text must meet WCAG AAA contrast on ivory');
assert.ok(ratio('#526577','#f7fbff')>=4.5,'Muted text must meet WCAG AA contrast on sky');
console.log('FIX-001 translucent clinical luxury design-system checks passed.');

// High-visibility component finish must target the real homepage structure.
for(const selector of ['#publicPortal #portalPanelOverview .portal-hero','#publicPortal #portalPanelOverview .hero-copy','#publicPortal #portalPanelOverview .dispatch-card','#publicPortal #portalPanelOverview .care-pathways>a','#publicPortal #bookingSection']) assert.ok(css.includes(selector),'Missing explicit high-visibility component treatment: '+selector);
assert.match(css,/--dkl-card-radius:24px/);
assert.match(css,/background:linear-gradient\(125deg,#fffefa 0%,#edf5fb 58%,#f4f0f8 100%\)!important/);
assert.match(css,/font-size:clamp\(42px,5\.4vw,72px\)!important/);
