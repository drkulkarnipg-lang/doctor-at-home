'use strict';const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');assert.ok(!html.includes('24/7 ICU'));assert.ok(!fs.readFileSync('preserved-features.js','utf8').includes('24x7 home ICU'));
for(const file of fs.readdirSync('.').filter(f=>/\.(html|js)$/.test(f))){assert.ok(!fs.readFileSync(file,'utf8').includes('9822594341'),`Old number in ${file}`);}
assert.match(html,/href="tel:\+919561394341" data-direct-call class="contact-board-phone">Call \+91 9561394341/);
assert.match(fs.readFileSync('contact-actions.js','utf8'),/number='9561394341',phone='\+919561394341'/);
assert.match(fs.readFileSync('booking-intake.js','utf8'),/wa\.me\/919561394341/);
console.log('Live contact contract passed: new number throughout active root HTML/JS, clickable contact board, removed 24/7 badge and 24x7 helper claim.');
