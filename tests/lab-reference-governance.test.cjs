const assert=require('node:assert/strict');
const {parseCSV,validateEntry,classify,matchInterval}=require('../lab-reference-governance.js');
let checks=0;
const csv='test,unit,low,high,source,source_url,category,aliases,specimen,method,population,age_min,age_max,sex,pregnancy_scope,range_type\nSodium,mmol/L,135,145,Mayo Clinic Laboratories,https://www.mayocliniclabs.com/test-catalog/Overview/113630,Electrolytes,Na; serum sodium,Serum,ISE,Healthy adult reference population,18,120,all,not_validated_for_pregnancy,reference_interval';
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
 {...row,pregnancy_scope:''},
 {...row,pregnancy_scope:'unknown'},
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
assert.equal(LAB_REFERENCE_TESTS.length,85);checks++;
assert.ok(LAB_REFERENCE_TESTS.every(x=>x[9]&&x[9].pregnancyScope));checks++;
assert.equal(LAB_REFERENCE_TESTS.find(x=>x[0]==='na-india')[9].pregnancyScope,'non_pregnant_not_postpartum');checks++;
assert.equal(LAB_REFERENCE_TESTS.find(x=>x[0]==='na')[9].pregnancyScope,'not_validated_for_pregnancy');checks++;
assert.equal(new Set(LAB_REFERENCE_TESTS.map(x=>x[0])).size,85);checks++;
for(const [id,lo,hi] of [['monoabs',0.26,0.81],['eosabs',0.03,0.48],['basoabs',0.01,0.08]]){
 const entry=LAB_REFERENCE_TESTS.find(x=>x[0]===id);assert.ok(entry);assert.equal(entry[5],lo);assert.equal(entry[6],hi);assert.match(entry[7],/Mayo Clinic Laboratories · CBC with Differential/);checks+=4;
}

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



for(const id of ['glu-india-under45','glu-india-45plus']){const e=LAB_REFERENCE_TESTS.find(x=>x[0]===id);assert.equal(e[9].requiresFasting,true);assert.ok(e[9].collectionConditions.includes('10–12 h'));checks+=2;}


const sodiumRecords=LAB_REFERENCE_TESTS.filter(x=>x[1]==='Sodium');
assert.equal(matchInterval(sodiumRecords,40,'male',''),null);checks++;
const fastingGlucose=LAB_REFERENCE_TESTS.filter(x=>x[1]==='Fasting glucose');
assert.equal(matchInterval(fastingGlucose,40,'female','no')[0],'glu-india-under45');checks++;
assert.equal(matchInterval(fastingGlucose,55,'male','')[0],'glu-india-45plus');checks++;
const haemoglobin=LAB_REFERENCE_TESTS.filter(x=>x[0]==='hb');
assert.equal(matchInterval(haemoglobin,35,'male','no')[0],'hb');checks++;
assert.equal(matchInterval(haemoglobin,35,'female','no')[0],'hb');checks++;
assert.equal(matchInterval(haemoglobin,17,'male','no'),null);checks++;
assert.equal(matchInterval(fastingGlucose,40,'female',''),null);checks++;
assert.equal(matchInterval(fastingGlucose,40,'female','yes'),null);checks++;
assert.equal(matchInterval(fastingGlucose,40,'female','recent'),null);checks++;
assert.equal(matchInterval(fastingGlucose,40,'',''),null);checks++;
assert.equal(matchInterval(fastingGlucose,40,'','no')[0],'glu-india-under45');checks++;


const indianExpandedExpected=[
 ['alb-india-m18-44',39,52,'g/L',18,44,'male'],
 ['alb-india-m45-65',37,49,'g/L',45,65,'male'],
 ['alb-india-f18-65',36,47,'g/L',18,65,'female'],
 ['tc-india-m18-44',3.1,6.2,'mmol/L',18,44,'male'],
 ['tc-india-m45-65',2.5,6.7,'mmol/L',45,65,'male'],
 ['tc-india-f18-65',2.9,6.6,'mmol/L',18,65,'female'],
 ['hdl-india-m',0.7,1.5,'mmol/L',18,65,'male'],
 ['hdl-india-f',0.8,1.8,'mmol/L',18,65,'female'],
 ['tg-india-m',0.6,2.7,'mmol/L',18,65,'male'],
 ['tg-india-f',0.5,2.1,'mmol/L',18,65,'female'],
 ['cre-india-m',58,95,'μmol/L',18,65,'male'],
 ['cre-india-f',35,74,'μmol/L',18,65,'female'],
 ['urea-india-m',2.2,6.0,'mmol/L',18,65,'male'],
 ['urea-india-f18-44',1.9,5.1,'mmol/L',18,44,'female'],
 ['urea-india-f45-65',2.4,6.7,'mmol/L',45,65,'female'],
 ['ua-india-m',248,509,'μmol/L',18,65,'male'],
 ['ua-india-f',159,404,'μmol/L',18,65,'female'],
 ['ast-india-m',20,53,'U/L',18,65,'male'],
 ['ast-india-f',17,39,'U/L',18,65,'female'],
 ['alt-india-m',15,74,'U/L',18,65,'male'],
 ['alt-india-f',10,37,'U/L',18,65,'female'],
 ['ldh-india',104,206,'U/L',18,65,'all'],
 ['alp-india-m',41,111,'U/L',18,65,'male'],
 ['alp-india-f18-44',35,100,'U/L',18,44,'female'],
 ['alp-india-f45-65',43,117,'U/L',45,65,'female'],
 ['ggt-india-m',14,62,'U/L',18,65,'male'],
 ['ggt-india-f',11,40,'U/L',18,65,'female'],
 ['ck-india-m',48,304,'U/L',18,65,'male'],
 ['ck-india-f',36,184,'U/L',18,65,'female'],
 ['amy-india',36,135,'U/L',18,65,'all'],
 ['tbil-india-m',6.2,23.7,'μmol/L',18,65,'male'],
 ['tbil-india-f',4.0,17.3,'μmol/L',18,65,'female'],
 ['fe-india-m',7,33,'μmol/L',18,65,'male'],
 ['fe-india-f',4,26,'μmol/L',18,65,'female'],
 ['tf-india',2.2,4.0,'g/L',18,65,'all'],
 ['hscrp-india-m',0.33,7.34,'mg/L',18,65,'male'],
 ['hscrp-india-f',0.35,11.90,'mg/L',18,65,'female'],
 ['igg-india',9.1,20.4,'g/L',18,65,'all'],
 ['iga-india',0.94,4.35,'g/L',18,65,'all'],
 ['igm-india-m',0.40,2.54,'g/L',18,65,'male'],
 ['igm-india-f',0.51,3.10,'g/L',18,65,'female'],
 ['c3-india',0.85,1.82,'g/L',18,65,'all'],
 ['c4-india',0.16,0.55,'g/L',18,65,'all'],
 ['ttr-india-m',161,360,'mg/L',18,65,'male'],
 ['ttr-india-f',133,278,'mg/L',18,65,'female']
];
for(const [id,lo,hi,unit,amin,amax,sex] of indianExpandedExpected){
 const e=LAB_REFERENCE_TESTS.find(x=>x[0]===id);assert.ok(e,id+' missing');assert.equal(e[5],lo);assert.equal(e[6],hi);assert.equal(e[4],unit);assert.equal(e[9].ageMin,amin);assert.equal(e[9].ageMax,amax);assert.equal(e[9].sex,sex);assert.equal(e[9].sourceUrl,'https://doi.org/10.1515/cclm-2018-0152');checks+=8;
}
assert.equal(LAB_REFERENCE_TESTS.filter(x=>x[7].includes('Indian IFCC')).length,55);checks++;

console.log('Lab reference governance tests passed: '+checks+' assertions.');
