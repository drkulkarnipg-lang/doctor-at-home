(async()=>{
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const base=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://preview.example.test/'}),w=dom.window;
w.scrollTo=()=>{};w.alert=()=>{};w.tailwind={};w.showToast=()=>{};
const scripts=[];
for(const script of [...w.document.scripts]){
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
const ids=[...w.document.querySelectorAll('[id]')].map(e=>e.id);assert.equal(ids.length,new Set(ids).size,'Duplicate HTML IDs');
for(const id of ['rxSheet','pathSlipSheet','radSlipSheet','viewChart20','viewLegalForms','viewClinicalCertificates','viewDrugDir','viewArticlesHub','viewJournalsHub','chatbotWindow','patientFaq','bookingSection'])assert.ok(w.document.getElementById(id),`Lost feature ${id}`);
assert.equal(w.document.querySelectorAll('#wikiCardsGrid article').length,8);
w.document.getElementById('wikiSearchInput').value='catheter';w.filterWikiArticles();assert.equal(w.document.querySelectorAll('#wikiCardsGrid article').length,1);
assert.ok(w.document.querySelector('#drugSetuReference a[href="https://drugsetu.com/"]'));
assert.ok(w.document.querySelector('#doctorWorkstation').classList.contains('notranslate'));
console.log('Calculator UI integration checks passed: 2 public / 28 clinical, full GCS, tab switching, conditional fields, stale-result clearing, search, existing feature IDs retained.');
await new Promise(resolve=>setTimeout(resolve,30));w.close();

})().catch(e=>{console.error(e);process.exitCode=1;});
