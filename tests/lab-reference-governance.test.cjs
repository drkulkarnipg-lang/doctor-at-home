const assert=require('node:assert/strict');
const {parseCSV,validateEntry,classify}=require('../lab-reference-governance.js');
let checks=0;
const csv='test,unit,low,high,source,source_url,category,aliases,specimen,method,population,age_min,age_max,sex,range_type\nSodium,mmol/L,135,145,Mayo Clinic Laboratories,https://www.mayocliniclabs.com/test-catalog/Overview/113630,Electrolytes,Na; serum sodium,Serum,ISE,Healthy adult reference population,18,120,all,reference_interval';
const rows=parseCSV(csv);assert.equal(rows.length,2);checks++;
const row=Object.fromEntries(rows[0].map((k,i)=>[k.toLowerCase(),rows[1][i]]));
assert.equal(validateEntry(row).valid,true);checks++;
for(const bad of [
 {...row,source_url:'http://example.org'},
 {...row,method:''},
 {...row,specimen:''},
 {...row,population:''},
 {...row,age_min:'17'},
 {...row,age_max:'121'},
 {...row,sex:'unspecified'},
 {...row,range_type:'normal'},
 {...row,low:'150',high:'140'},
 {...row,source_url:'not a url'}
]){assert.equal(validateEntry(bad).valid,false);checks++;}
assert.equal(classify(134,135,145),'LOW');checks++;
assert.equal(classify(135,135,145),'WITHIN REFERENCE INTERVAL');checks++;
assert.equal(classify(140,135,145),'WITHIN REFERENCE INTERVAL');checks++;
assert.equal(classify(145,135,145),'WITHIN REFERENCE INTERVAL');checks++;
assert.equal(classify(146,135,145),'HIGH');checks++;
assert.equal(classify(59,60,Infinity,'decision_limit'),'BELOW DECISION THRESHOLD');checks++;
assert.equal(classify(60,60,Infinity,'decision_limit'),'WITHIN DECISION THRESHOLD');checks++;
assert.equal(classify(100,60,Infinity,'decision_limit'),'WITHIN DECISION THRESHOLD');checks++;
assert.equal(classify('not numeric',0,10),'INVALID');checks++;
assert.throws(()=>parseCSV('a,b\n"broken,field'));
checks++;
console.log('Lab reference governance tests passed: '+checks+' assertions.');
