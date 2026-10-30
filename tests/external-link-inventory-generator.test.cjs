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
 assert.ok(!inv.source_files_scanned.some(p=>p.startsWith('tests/')));
 assert.ok(!inv.source_files_scanned.some(p=>p.startsWith('assets/drugs/')));
 const get=url=>inv.links.find(link=>link.url===url);
 assert.equal(get('https://fonts.googleapis.com').classification,'domain-allowlist');
 assert.equal(get('https://hook.eu1.make.com/').classification,'placeholder');
 assert.equal(get('https://api.example.org/v1').classification,'service-endpoint');
 assert.equal(get('https://example.org/clinical').classification,'external-destination');
 assert.equal(get('https://official.example.gov/forms.pdf').classification,'external-destination');
 const output=path.join(root,'reports','inventory.json');writeInventory(inv,output);const saved=fs.readFileSync(output,'utf8');assert.doesNotMatch(saved,/\\\\n$/,'Generated inventory must end with a real newline, not a literal backslash-n');assert.deepEqual(JSON.parse(saved),inv,'Generated inventory file must parse as exactly one JSON document');
 console.log('Full-source link inventory generator checks passed, including valid on-disk JSON output.');
}finally{fs.rmSync(root,{recursive:true,force:true});}
