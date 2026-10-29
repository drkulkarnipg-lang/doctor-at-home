'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('reading-print-fixes.css','utf8');

// Emergency communication must be English-only and must not use the doctor's
// home-visit number as an emergency dispatch number.
const strip=html.match(/<aside class="emergency-strip no-print"[^>]*>[\s\S]*?<\/aside>/);
assert.ok(strip,'Emergency strip exists');
assert.match(strip[0],/Emergency\?/);
assert.match(strip[0],/href="tel:112"/);
assert.match(strip[0],/href="tel:108"/);
assert.match(strip[0],/home-visit requests, not emergency dispatch/i);
assert.doesNotMatch(strip[0],/आपत्कालीन|आपातकालीन|मराठी|हिन्दी/);

// Main contact actions and public contact channels must be actionable.
assert.match(html,/href="tel:\+919561394341"[^>]*aria-label="Call Dr\. Kulkarni at \+91 9561394341"/);
assert.match(html,/href="mailto:drkulkarnipg@gmail\.com">drkulkarnipg@gmail\.com<\/a>/);
assert.doesNotMatch(html,/Direct Helpline:/);
assert.doesNotMatch(html,/Emergency Helpline:/);
assert.doesNotMatch(html,/Drkulkarnipg@gmail\.com/);

// Prescription safety text should route emergencies to official numbers.
assert.match(html,/In an emergency \(including severe breathlessness or chest pain\), call <a href="tel:112">112<\/a> or <a href="tel:108">108<\/a> immediately/);
assert.match(html,/Home-visit requests:/);

// Emergency strip should remain legible and usable on narrow screens.
assert.match(css,/\.emergency-strip\{/);
assert.match(css,/\.emergency-strip-actions a\{/);
assert.match(css,/@media\(max-width:640px\)/);
assert.match(css,/\.emergency-strip-actions\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);

// Core workspace entry points and preserved booking logic must remain present.
for(const id of ['publicPortal','doctorWorkstation','navPublicBtn','navDoctorBtn','wikiSection','bookingSection','bkGpsLat','bkGpsLng','calcTime','calcDistance','viewArticlesHub','tabRx','tabPath','tabRad','viewClinicalCertificates']) {
  assert.match(html,new RegExp('id="'+id+'"'),`preserved element #${id}`);
}
assert.match(html,/Elderly care/);
assert.match(html,/id="rad_cxr_view"/);
assert.match(html,/id="rad_dop_a"/);
assert.match(html,/id="rad_custom_test"/);
assert.match(html,/id="deathFormLanguage"/);
assert.ok(html.includes('a[data-direct-call]'));
console.log('End-to-end contact/emergency preservation assertions passed.');
