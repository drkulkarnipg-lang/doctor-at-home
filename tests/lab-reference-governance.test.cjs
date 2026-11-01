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

const {LAB_REFERENCE_TESTS}=require('../clinical-calculators.js');
assert.equal(LAB_REFERENCE_TESTS.length,40);checks++;
assert.equal(new Set(LAB_REFERENCE_TESTS.map(x=>x[0])).size,40);checks++;
for(const [id,lo,hi] of [['monoabs',0.26,0.81],['eosabs',0.03,0.48],['basoabs',0.01,0.08]]){
 const entry=LAB_REFERENCE_TESTS.find(x=>x[0]===id);assert.ok(entry);assert.equal(entry[5],lo);assert.equal(entry[6],hi);assert.match(entry[7],/Mayo Clinic Laboratories · CBC with Differential/);checks+=4;
}
console.log('Total lab reference assertions including seed records: '+checks+'.');

const indianExpected=[
 ['na-india',135,146,'mmol/L',18,65],
 ['k-india',3.8,5.0,'mmol/L',18,65],
 ['cl-india',102,113,'mmol/L',18,65],
 ['ca-india',2.10,2.44,'mmol/L',18,65],
 ['phos-india',0.80,1.43,'mmol/L',18,65],
 ['mg-india',0.77,1.07,'mmol/L',18,65],
 ['tp-india',68,86,'g/L',18,65],
 ['ldl-india',1.7,4.4,'mmol/L',18,65],
 ['glu-india-under45',4.1,5.5,'mmol/L',18,44],
 ['glu-india-45plus',4.3,6.0,'mmol/L',45,65]
];
for(const [id,lo,hi,unit,amin,amax] of indianExpected){
 const e=LAB_REFERENCE_TESTS.find(x=>x[0]===id);assert.ok(e,id+' missing');assert.equal(e[5],lo);assert.equal(e[6],hi);assert.equal(e[4],unit);assert.equal(e[9].ageMin,amin);assert.equal(e[9].ageMax,amax);assert.equal(e[9].sourceUrl,'https://doi.org/10.1515/cclm-2018-0152');checks+=6;
}
