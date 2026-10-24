(async()=>{
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const base=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://preview.example.test/'}),w=dom.window;
Object.defineProperty(w,'crypto',{value:require('node:crypto').webcrypto});w.TextEncoder=TextEncoder;
w.scrollTo=()=>{};w.alert=()=>{};w.tailwind={};w.showToast=()=>{};
const scripts=[];
for(const script of [...w.document.scripts]){
 if(script.type==='application/ld+json')continue;
 if(script.src){const src=script.getAttribute('src');if(/^(https?:)?\/\//.test(src))continue;if(['assets/tailwind-config-compat.js','assets/pdf/html2pdf.bundle.min.js','assets/qr-code.js'].includes(src))continue;scripts.push(fs.readFileSync(path.join(base,src),'utf8'));}
 else scripts.push(script.textContent);
}
w.eval(scripts.join('\n;\n'));
await new Promise(resolve=>setTimeout(resolve,30));w.populate30Calculators();
assert.equal(w.document.querySelectorAll('#calc30Grid .calc-card').length,2);
assert.equal(w.document.querySelectorAll('#clinicalCalculatorGrid .calc-card').length,28);
assert.equal(w.document.querySelectorAll('#clinicalCalculatorGrid input').length>50,true);
assert.equal(w.document.querySelector('#calculator-6-verbal option[value="2"]').textContent,'2 · sounds');
assert.equal(w.document.querySelector('#calculator-6-motor option[value="3"]').textContent,'3 · abnormal flexion');
assert.equal(w.document.querySelector('#calculator-6-eye').value,'');
w.switchDocTab('clinicalCalculators');assert.equal(w.document.querySelector('#viewClinicalCalculators').classList.contains('hidden'),false);
w.switchDocTab('rxPad');assert.equal(w.document.querySelector('#viewClinicalCalculators').classList.contains('hidden'),true);
const change=(id,v)=>{const x=w.document.getElementById(id);x.value=v;x.dispatchEvent(new w.Event('input',{bubbles:true}));};
change('calculator-6-eye','4');change('calculator-6-verbal','NT');change('calculator-6-motor','6');
w.document.querySelector('[data-calculator-id="6"] form').dispatchEvent(new w.Event('submit',{cancelable:true}));
assert.match(w.document.getElementById('calculator-result-6').textContent,/Total not calculated/);
change('calculator-6-verbal','5');assert.match(w.document.getElementById('calculator-result-6').textContent,/calculate again/);
change('calculator-30-acid','ph');assert.equal(w.document.getElementById('calculator-30-hco3').disabled,true);
change('calculator-30-acid','hco3');assert.equal(w.document.getElementById('calculator-30-ph').disabled,true);
change('calculator-18-method','p421');assert.equal(w.document.getElementById('calculator-18-factor').disabled,true);
const search=w.document.getElementById('clinicalCalculatorSearch');search.value='Wells';search.oninput();assert.equal([...w.document.querySelectorAll('#clinicalCalculatorGrid .calc-card')].filter(e=>!e.hidden).length,2);
for(const id of require('./existing-feature-ids.json'))assert.ok(w.document.getElementById(id),`Lost existing interface element ${id}`);
const websiteSchema=JSON.parse(w.document.querySelector('script[type="application/ld+json"]').textContent);assert.equal(websiteSchema['@graph'][0].name,'Dr. Pramod G. Kulkarni');assert.ok(w.document.querySelector('link[rel=canonical]'));assert.ok(w.document.querySelector('a[href="site-information.html"]'));
const ids=[...w.document.querySelectorAll('[id]')].map(e=>e.id);assert.equal(ids.length,new Set(ids).size,'Duplicate HTML IDs');
for(const id of ['rxSheet','pathSlipSheet','radSlipSheet','viewChart20','viewLegalForms','viewClinicalCertificates','viewDrugDir','viewArticlesHub','viewJournalsHub','chatbotWindow','patientFaq','bookingSection'])assert.ok(w.document.getElementById(id),`Lost feature ${id}`);
assert.equal(w.document.querySelectorAll('#wikiCardsGrid article').length,9);
w.document.getElementById('wikiSearchInput').value='catheter';w.filterWikiArticles();assert.equal(w.document.querySelectorAll('#wikiCardsGrid article').length,1);
assert.ok(w.document.querySelector('#drugSetuReference a[href="https://drugsetu.com/"]'));
assert.ok(w.document.querySelector('#doctorWorkstation').classList.contains('notranslate'));
const phoneLink=w.document.querySelector('a[onclick="handleDirectCall(event)"]');const phoneEvent=new w.MouseEvent('click',{bubbles:true,cancelable:true});phoneLink.dispatchEvent(phoneEvent);
assert.equal(phoneEvent.defaultPrevented,true,'Phone click must leave the website open');assert.equal(w.document.getElementById('doctorContactDialog').open,true);
assert.equal(w.document.getElementById('contactDial').getAttribute('href'),'tel:+919822594341');
w.document.getElementById('contactClose').click();assert.equal(w.document.getElementById('doctorContactDialog').open,false);
let copied='';Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async text=>{copied=text;}}});w.openDoctorContact();w.document.getElementById('contactCopy').click();await new Promise(resolve=>setTimeout(resolve,0));assert.equal(copied,'9822594341');assert.match(w.document.getElementById('contactCopyStatus').textContent,/Number copied/);w.document.getElementById('contactClose').click();
assert.equal(w.document.querySelector('.portal-nav a').getAttribute('aria-current'),'location');

// Local privacy lock: no default passphrase, password fields masked, verifier only.
for(const id of ['deviceCurrentPassword','customPinInput','deviceConfirmPassword','deviceUnlockPassword'])assert.equal(w.document.getElementById(id).type,'password');
w.switchWorkspace('doctor');assert.equal(w.DevicePrivacyLock.isUnlocked(),false);assert.equal(w.document.getElementById('doctorWorkstation').classList.contains('hidden'),true);
change('customPinInput','SyntheticTest-2026');change('deviceConfirmPassword','SyntheticTest-2026');await w.saveSecuritySettings();
assert.equal(w.DevicePrivacyLock.isUnlocked(),true);const record=w.localStorage.getItem('kulkarniDeviceLockV2');assert.ok(record);assert.equal(record.includes('SyntheticTest-2026'),false);assert.equal(JSON.parse(record).iterations,600000);
w.lockWorkstationNow();assert.equal(w.DevicePrivacyLock.isUnlocked(),false);w.verifyAndOpenWorkstation();change('deviceUnlockPassword','incorrect-test');await w.document.getElementById('deviceUnlockForm').onsubmit({preventDefault(){}});assert.equal(w.DevicePrivacyLock.isUnlocked(),false);assert.match(w.document.getElementById('deviceUnlockError').textContent,/Incorrect/);
change('deviceUnlockPassword','SyntheticTest-2026');await w.document.getElementById('deviceUnlockForm').onsubmit({preventDefault(){}});assert.equal(w.DevicePrivacyLock.isUnlocked(),true);
w.openSecuritySettingsModal();change('deviceCurrentPassword','wrong');change('customPinInput','OtherTest-2026');change('deviceConfirmPassword','OtherTest-2026');await w.saveSecuritySettings();assert.equal(w.localStorage.getItem('kulkarniDeviceLockV2'),record);assert.match(w.document.getElementById('deviceLockSettingsError').textContent,/incorrect/);
w.closeSecuritySettingsModal();w.lockWorkstationNow();
// Conversions and presets preserve the entered advice.
const {convert}=w.ReleaseTools;assert.equal(convert(0,'c-f'),32);assert.equal(convert(212,'f-c'),100);assert.equal(convert(1,'lb-kg'),.45359237);assert.ok(Math.abs(convert(convert(70,'kg-lb'),'lb-kg')-70)<1e-10);assert.throws(()=>convert(-1,'kg-lb'));assert.throws(()=>convert('','c-f'));assert.throws(()=>convert(-274,'c-f'));
const advice=w.document.getElementById('rxAdvice');advice.value='Existing individual advice';w.insertDietPreset('dash');const added=advice.value;assert.ok(added.startsWith('Existing individual advice'));assert.match(added,/DASH/);w.insertDietPreset('dash');assert.equal(advice.value,added);
// Provenance is present on clones and every generated PDF page.
const copy=w.decorateDocumentClone(w.document.createElement('article'),'cert-form4');assert.match(copy.textContent,/Dr. Pramod/);assert.match(copy.textContent,/#document=cert-form4/);assert.equal(w.documentReference('wikiModalContent').url.endsWith('#wikiSection'),true);
let page=0;const stamped=[];w.stampDocumentPdf({internal:{getNumberOfPages:()=>3,pageSize:{getWidth:()=>210,getHeight:()=>297}},setPage:p=>{page=p;},setFont(){},setFontSize(){},setTextColor(){},text:t=>stamped.push([page,t])},'rxSheet');for(let p=1;p<=3;p++)assert.ok(stamped.some(([n,t])=>n===p&&t.includes('#document=rxSheet')));

// The tools are discoverable in the workstation, with independently wired conversion controls.
w.switchDocTab('everydayTools');assert.equal(w.document.getElementById('viewEverydayTools').classList.contains('hidden'),false);assert.equal(w.document.querySelectorAll('#dietPresetCards article').length,7);change('doctorUnitConversionValue','37');w.document.getElementById('doctorUnitConverterForm').onsubmit({preventDefault(){}});assert.match(w.document.getElementById('doctorUnitConversionResult').textContent,/98.6/);w.switchDocTab('chart20');assert.equal(w.document.getElementById('viewEverydayTools').classList.contains('hidden'),true);
// Two synthetic patients with the same display name must never share a history.
const pa=w.PatientTrends.addPatient('Synthetic patient'),rowInput=k=>w.document.querySelector('#trendRows tr [data-field="'+k+'"]');rowInput('sbp').value='120';rowInput('dbp').value='80';rowInput('glucose').value='110';rowInput('context').value='Fasting';assert.equal(w.saveTrendReadings(),true);
const pb=w.PatientTrends.addPatient('Synthetic patient');assert.notEqual(pa,pb);assert.equal(rowInput('sbp').value,'');assert.equal(rowInput('glucose').value,'');rowInput('sbp').value='140';rowInput('dbp').value='90';rowInput('glucose').value='180';assert.equal(w.saveTrendReadings(),true);w.PatientTrends.choose(pa);assert.equal(rowInput('sbp').value,'120');assert.equal(rowInput('glucose').value,'110');assert.equal(rowInput('context').value,'Fasting');assert.equal(w.document.querySelector('#trendRows output').textContent,'93.3');
change('trendMetricSelect','glucose');w.document.getElementById('trendMetricSelect').onchange();assert.equal(rowInput('glucose').closest('td').hidden,false);assert.equal(rowInput('sbp').closest('td').hidden,true);assert.equal(w.document.querySelectorAll('#bpTrendGraph circle').length,1);assert.match(w.document.getElementById('trendPatientIdentity').textContent,new RegExp(pa));
const originalStore=w.localStorage.getItem(w.PatientTrends.key);w.localStorage.setItem('kulkarniTrend20V1',JSON.stringify([{sbp:'160',dbp:'100',notes:'Unassigned original'}]));w.document.getElementById('trendImportLegacy').click();assert.equal(w.localStorage.getItem('kulkarniTrend20V1'),JSON.stringify([{sbp:'160',dbp:'100',notes:'Unassigned original'}]));w.PatientTrends.choose(pa);assert.equal(rowInput('sbp').value,'120');
const backup=JSON.parse(originalStore);w.PatientTrends.restore(backup);const restored=JSON.parse(w.localStorage.getItem(w.PatientTrends.key));assert.equal(restored.patients.length,5);assert.equal(new Set(restored.patients.map(p=>p.id)).size,5);assert.equal(restored.patients.find(p=>p.id===pb).readings[0].glucose,'180');assert.throws(()=>w.PatientTrends.restore({version:2,patients:[{name:'invalid',readings:null}]}));

// Name-led identity, distinct page headings, breadcrumbs and non-identifying browser titles.
assert.match(w.document.getElementById('portalHeroTitle').textContent,/Thoughtful care/);assert.equal(w.document.querySelector('.doctor-hero-name'),null);assert.equal(w.document.querySelector('.doctor-wordmark').textContent,'DR. PRAMOD G. KULKARNI');assert.ok(w.document.querySelector('.original-georgia-brand'));w.switchDocTab('legalForms');assert.equal(w.document.getElementById('workspacePageTitle').textContent,'Forms 2, 4 & 4A');assert.equal(w.document.querySelector('#workspacePageIdentity [aria-current="page"]').textContent,'Forms 2, 4 & 4A');w.switchDocTab('everydayTools');assert.equal(w.document.getElementById('workspacePageTitle').textContent,'Diet presets & conversions');w.openWikiModal(1);assert.match(w.document.getElementById('wikiModalContent').textContent,/डॉक्टरांच्या अंतिम मंजुरीसाठी/);assert.ok(w.document.querySelector('a[href="editorial-policy.html"]'));assert.equal(w.document.querySelectorAll('.section-location-label').length,0);assert.equal(w.document.querySelectorAll('.public-page-intro').length,7);w.verifyAndOpenWorkstation();change('deviceUnlockPassword','SyntheticTest-2026');await w.document.getElementById('deviceUnlockForm').onsubmit({preventDefault(){}});w.switchDocTab('chart20');assert.equal(w.document.title,'Patient trends | Dr. Pramod G. Kulkarni');assert.equal(w.document.activeElement.id,'workspacePageIdentity');assert.equal(w.location.hash,'#workstation=chart20');assert.equal(w.document.title.includes('Synthetic patient'),false);w.lockWorkstationNow();assert.match(w.document.title,/Home visits/);
console.log('Patient isolation, glucose/BP switching, preserved legacy backup, non-overwriting restore and workstation tool discovery checks passed.');
console.log('Privacy lock, conversions, diet preservation and PDF page provenance checks passed.');
console.log('Calculator UI integration checks passed: 2 public / 28 clinical, full GCS, tab switching, conditional fields, stale-result clearing, search, existing feature IDs retained.');
await new Promise(resolve=>setTimeout(resolve,30));w.close();

})().catch(e=>{console.error(e);process.exitCode=1;});
