'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {generateInventory,writeInventory}=require('../scripts/generate-external-link-inventory.cjs');

const root=fs.mkdtempSync(path.join(os.tmpdir(),'external-link-inventory-'));
try{
 fs.mkdirSync(path.join(root,'api'),{recursive:true});
 fs.mkdirSync(path.join(root,'assets/forms'),{recursive:true});
 fs.writeFileSync(path.join(root,'assets','tailwind.css'),'/*! generated framework bundle source: https://tailwindcss.com */');
 fs.mkdirSync(path.join(root,'assets/drugs'),{recursive:true});
 fs.mkdirSync(path.join(root,'tests'),{recursive:true});
 fs.writeFileSync(path.join(root,'index.html'),'<link rel="preconnect" href="https://fonts.googleapis.com"><a href="https://example.org/clinical">Reference</a><input placeholder="https://hook.eu1.make.com/...">');
 fs.writeFileSync(path.join(root,'api','provider.js'),"fetch('https://api.example.org/v1');");
 fs.writeFileSync(path.join(root,'assets/forms','sources.json'),JSON.stringify([{source:'https://official.example.gov/forms.pdf'}]));
 fs.writeFileSync(path.join(root,'assets/drugs','catalog.json'),JSON.stringify([{source:'https://should-not-be-scanned.example'}]));
 fs.writeFileSync(path.join(root,'tests','fixture.js'),"const ignored='https://test-only.example';");
 const inv=generateInventory({root,sourceRevision:'test-sha'});
 assert.ok(inv.source_files_scanned.includes('index.html'));
 assert.ok(inv.source_files_scanned.includes('api/provider.js'));
 assert.ok(inv.source_files_scanned.includes('assets/forms/sources.json'));
 assert.ok(!inv.source_files_scanned.includes('assets/tailwind.css'),'Generated framework CSS is not a clickable-link source and must not produce false URL matches');
 assert.ok(!inv.source_files_scanned.some(p=>p.startsWith('tests/')));
 assert.ok(!inv.source_files_scanned.some(p=>p.startsWith('assets/drugs/')));
 const get=url=>inv.links.find(link=>link.url===url);
 assert.equal(get('https://fonts.googleapis.com').classification,'domain-allowlist');
 assert.equal(get('https://hook.eu1.make.com/').classification,'placeholder');
 assert.equal(get('https://api.example.org/v1').classification,'service-endpoint');
 assert.equal(get('https://example.org/clinical').classification,'external-destination');
 assert.equal(get('https://official.example.gov/forms.pdf').classification,'external-destination');
 assert.equal(require('../scripts/generate-external-link-inventory.cjs').classifyUrl('https://www.ebi.ac.uk/europepmc/webservices/rest/','const base = \'https://www.ebi.ac.uk/europepmc/webservices/rest/\';','server/evidence-source.js','https://www.ebi.ac.uk/europepmc/webservices/rest/'),'service-endpoint','API root endpoints may return 404 to HEAD but are not broken user links');
 assert.equal(require('../scripts/generate-external-link-inventory.cjs').classifyUrl('https://translate.google.com/translate?sl=auto&tl=','return \'https://translate.google.com/translate?sl=auto&tl=\'+lang;','source-translation.js','https://translate.google.com/translate?sl=auto&tl='),'runtime-template','Machine-translation URL prefixes are assembled dynamically and should not be HEAD checked as static destinations');
 const output=path.join(root,'reports','inventory.json');writeInventory(inv,output);const saved=fs.readFileSync(output,'utf8');assert.ok(saved.endsWith('\n')&&!saved.endsWith('\\n'),'Generated inventory must end with a real newline, not a literal backslash-n');assert.deepEqual(JSON.parse(saved),inv,'Generated inventory file must parse as exactly one JSON document');
 const committed=JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','external-link-inventory-2026-10-30.json'),'utf8'));
 const current=generateInventory({sourceRevision:committed.source_revision});


 assert.deepEqual(committed.source_files_scanned,current.source_files_scanned,'Committed inventory must cover the current active source-file set');
 assert.deepEqual(committed.links,current.links,'Committed inventory destinations, classifications and source-line evidence must match current source');
 assert.equal(committed.unique_extracted_destinations,current.unique_extracted_destinations,'Committed unique destination count must match regenerated inventory');
 assert.ok(committed.source_files_scanned.length>50&&committed.unique_extracted_destinations>200,'Committed inventory must remain repository-wide, not only a small shortlist');
 console.log('Full-source link inventory generator checks passed, including valid on-disk JSON output.');
}finally{fs.rmSync(root,{recursive:true,force:true});}
