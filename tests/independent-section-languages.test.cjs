'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
(async()=>{
 const dom=new JSDOM(fs.readFileSync('index.html','utf8'),{runScripts:'outside-only',url:'https://clinic.example/'}),w=dom.window,d=w.document;
 w.PatientEducation=require('../patient-education-data.js');w.renderPublishedArticles=()=>{};
 w.eval(fs.readFileSync('awareness-library.js','utf8'));
 w.eval(fs.readFileSync('section-languages.js','utf8'));
 await new Promise(r=>w.setTimeout(r,10));
 for(const id of ['siteLanguageSelector','homeLanguagePicker','libraryLanguagePicker','doctorLanguagePicker','encyclopediaLanguagePicker']){
  const select=d.getElementById(id);select.replaceChildren(new w.Option('English','en'),new w.Option('मराठी','mr'),new w.Option('Hindi','hi'));select.value='en';
 }
 const header=d.querySelector('.site-header').textContent;
 d.getElementById('libraryLanguagePicker').value='mr';d.getElementById('libraryLanguagePicker').dispatchEvent(new w.Event('change',{bubbles:true}));
 assert.equal(w.PatientEducationView.language,'mr');assert.equal(w.PatientEducationView.readerLanguage,'en');
 assert.equal(d.querySelector('#wikiCardsGrid article').lang,'mr');assert.equal(d.getElementById('doctorLanguagePicker').value,'en');assert.equal(d.getElementById('homeLanguagePicker').value,'en');assert.equal(d.getElementById('siteLanguageSelector').value,'en');assert.equal(d.querySelector('.site-header').textContent,header);
 w.openWikiModal(9);assert.equal(d.querySelector('#wikiModalContent article').lang,'en');
 w.SectionLanguages.choose('encyclopediaLanguagePicker','mr');assert.equal(d.querySelector('#wikiModalContent article').lang,'mr');
 w.SectionLanguages.choose('libraryLanguagePicker','en');assert.equal(d.querySelector('#wikiCardsGrid article').lang,'en');assert.equal(d.querySelector('#wikiModalContent article').lang,'mr','Changing library must not change an already open article');
 const patient=d.getElementById('rxPatName');patient.value='SYNTHETIC PATIENT';
 w.SectionLanguages.choose('doctorLanguagePicker','mr');assert.equal(patient.value,'SYNTHETIC PATIENT');assert.equal(w.SectionLanguages.getState('libraryLanguagePicker'),'en');assert.equal(w.SectionLanguages.getState('encyclopediaLanguagePicker'),'mr');
 const heading=d.querySelector('.workstation-heading'),newTitle=d.createElement('p');newTitle.textContent='Clinical documents';heading.append(newTitle);await Promise.resolve();assert.equal(newTitle.textContent,'वैद्यकीय कागदपत्रे','Available navigation labels remain scoped after a workstation tab rebuild');
 assert.equal(w.SectionLanguages.choose('doctorLanguagePicker','hi'),false);assert.equal(w.SectionLanguages.getState('doctorLanguagePicker'),'mr');assert.match(d.querySelector('[data-section-language-status="doctorLanguagePicker"]').textContent,/not connected/);
 assert.ok(!d.cookie.includes('googtrans=/en/'));dom.window.close();console.log('Independent scopes: Library/reader/workstation/home/header selections do not propagate; patient values retained; unavailable scoped languages leave content unchanged.');
})().catch(e=>{console.error(e);process.exitCode=1});
