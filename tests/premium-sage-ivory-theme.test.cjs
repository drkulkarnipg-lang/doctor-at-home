'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const open='<style id="premium-sage-ivory-theme">';
const start=html.indexOf(open),end=html.indexOf('</style>',start+open.length);
assert.ok(start>=0&&end>start,'Premium theme is loaded inline by the main page.');
const css=html.slice(start+open.length,end);
for(const token of ['#FCFBF8','#F7F8F4','#F4F0E8','#EAF0E9','#A8B9A8','#263B35','#78847D','#E8EAE4','#C9B99A']){
 assert.ok(css.toUpperCase().includes(token),'Required design token is present: '+token);
}
for(const selector of ['.site-header','#publicPortal','.calc-card','input,select,textarea','@media(max-width:680px)','@media print','prefers-reduced-motion:reduce']){
 assert.ok(css.includes(selector),'Expected design or accessibility rule is present: '+selector);
}
console.log('Premium Sage & Ivory theme checks passed.');
