'use strict';
const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('reading-print-fixes.css', 'utf8');
const share = fs.readFileSync('document-sharing.js', 'utf8');
const intake = fs.readFileSync('booking-intake.js', 'utf8');
const publisher = fs.readFileSync('public-article-editor.js', 'utf8');
const awareness = fs.readFileSync('awareness-library.js', 'utf8');
const education = fs.readFileSync('patient-education-data.js', 'utf8');

// Language selector is in the global header and English remains the authored default.
assert.match(html, /<html lang="en">/);
assert.match(html, /class="language-control"/);
assert.ok(html.indexOf('class="language-control"') < html.indexOf('id="navPublicBtn"'), 'language selector precedes workspace navigation');
assert.match(html, /pageLanguage:\s*'en'/);
assert.match(html, /More languages ↗/);
assert.match(css, /\.language-control/);

// Phone and WhatsApp are separate, visitor-chosen actions; no fake social URLs.
assert.match(html, /href="tel:\+919561394341"[^>]*data-direct-call/);
assert.match(html, /href="https:\/\/wa\.me\/919561394341"/);
assert.match(html, /href="mailto:drkulkarnipg@gmail\.com"/);
assert.match(html, /href="tel:112"/);
assert.match(html, /href="tel:108"/);

// Patient navigation must switch sections rather than leave every section in one long page.
for (const id of ['elderlySection','wikiSection','bookingSection','patientToolsSection','patientFaq','exploreHealthSources']) {
  assert.match(html, new RegExp('id="' + id + '"'));
}
assert.match(html, /data-portal-view="health-library"/);
assert.match(html, /portal-section-hidden/);
assert.match(html, /history\.pushState/);
assert.match(html, /window\.addEventListener\('popstate', viewFromHash\)/);

// Full article reader uses the original English article object and all sections, FAQ and references.
assert.match(html, /<dialog id="wikiModal"/);
assert.match(html, /function renderFullHealthArticle\(article\)/);
assert.match(awareness, /dialog\.showModal\(\)/);
assert.match(awareness, /history\.pushState/);
assert.match(awareness, /let lang='en'/);
assert.doesNotMatch(awareness, /Open Patient Portal language controls|patientLanguageControls|articleLanguageControls|translatorMount\(true\)/);
assert.match(html, /const content = article\[lang\]/);
assert.match(html, /content\.sections/);
assert.match(html, /content\.faq/);
assert.match(html, /PatientEducation\?\.sources/);
assert.match(html, /history\.pushState\(\{ wikiReader: true/);
assert.match(html, /function closeWikiModal/);
assert.doesNotMatch(html, /wikiReaderBack|लेखसूचीकडे परत|बंद करा/);
assert.doesNotMatch(share, /shareFullGuidePdf|downloadFullGuidePdf/);

// Quick home-visit intake supports concise details and original clinical attachments.
for (const id of ['quickComplaints','quickKnownCase','quickAllergies','quickSurgeries','quickLmp','quickHeight','quickWeight','quickBmi','quickTemperature','quickMedicines','quickClinicalFiles','quickMedicationFile']) {
  assert.match(html, new RegExp('id="' + id + '"'));
}
assert.match(html, /navigator\.canShare\(\{ files: selected \}\)/);
assert.match(intake, /Optional detailed history — expand only if needed/);
assert.match(intake, /d\.open=false/);

// Prescription/lab/radiology sharing uses correct document IDs and descriptive names.
assert.match(share, /rx:\{id:'rxSheet',name:'Prescription\.pdf'\}/);
assert.match(share, /path:\{id:'pathSlipSheet',name:'Lab_Slip\.pdf'\}/);
assert.match(share, /rad:\{id:'radSlipSheet',name:'Radiology_Slip\.pdf'\}/);
assert.match(share, /navigator\.share\(\{files:\[prepared\],title:filename\(name\)\}\)/);
assert.match(html, /prescription-registration-line/);
assert.doesNotMatch(html, /Home-visit requests: <a href="tel:\+919561394341" data-direct-call>\+91 9561394341<\/a> \| Email:/);

// Article import and cloud actions must be visibly present and connected to handlers.
for (const id of ['articleContentFile','articleFetchSourceBtn','articleReloadDraftBtn','newArtBody','publicArticlePublisher']) {
  if (id === 'publicArticlePublisher') assert.match(publisher, /panel\.id='publicArticlePublisher'/);
  else assert.match(html, new RegExp('id="' + id + '"'));
}
assert.match(publisher, /Refresh cloud articles/);
assert.match(publisher, /Load selected cloud article/);
assert.match(publisher, /Start a new cloud article/);
assert.match(html, /Direct import was blocked or unavailable/);

// Government originals remain available; editable working layouts are not called exact facsimiles.
assert.match(html, /assets\/forms\/crs-form4-4a-original\.pdf/);
assert.match(html, /assets\/forms\/form2-government-reference\.pdf/);
assert.doesNotMatch(html, /FORM 4A \(EXACT STATUTORY FORMAT\)/);

// Core workstation, booking and medical tools remain in place.
for (const id of ['doctorWorkstation','tabRx','tabPath','tabRad','viewClinicalCertificates','calcTime','calcDistance','bkGpsLat','bkGpsLng','rxSheet','pathSlipSheet','radSlipSheet']) {
  assert.match(html, new RegExp('id="' + id + '"'));
}
assert.match(education, /en:\{title:/);
assert.match(html,/articleOpenSourceBtn/);
assert.match(html,/Add typed medicine to prescription/);
assert.match(html,/Doctor username/);
assert.match(fs.readFileSync('clinical-calculators.js','utf8'),/const updateResult=/);
console.log('End-to-end website preservation assertions passed.');
