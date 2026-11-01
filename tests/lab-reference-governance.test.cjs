const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
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
assert.equal(LAB_REFERENCE_TESTS.length,105);checks++;
assert.equal(new Set(LAB_REFERENCE_TESTS.map(x=>x[0])).size,105);checks++;
assert.ok(LAB_REFERENCE_TESTS.every(x=>x[9]&&x[9].pregnancyScope));checks++;
assert.equal(LAB_REFERENCE_TESTS.find(x=>x[0]==='na-india')[9].pregnancyScope,'non_pregnant_not_postpartum');checks++;
assert.equal(LAB_REFERENCE_TESTS.find(x=>x[0]==='na')[9].pregnancyScope,'not_validated_for_pregnancy');checks++;
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
 const e=LAB_REFERENCE_TESTS.find(x=>x[0]===id);assert.ok(e,id+' missing');assert.equal(e[5],lo);assert.equal(e[6],hi);assert.equal(e[4],unit);assert.equal(e[9].ageMin,amin);assert.equal(e[9].ageMax,amax);assert.equal(e[9].sourceUrl,'https://doi.org/10.1515/cclm-2018-0152');assert.equal(e[9].pregnancyScope,'non_pregnant_not_postpartum');checks+=7;
}



for(const id of ['glu-india-under45','glu-india-45plus']){const e=LAB_REFERENCE_TESTS.find(x=>x[0]===id);assert.equal(e[9].requiresFasting,true);assert.ok(e[9].collectionConditions.includes('10–12 h'));checks+=2;}


const sodiumRecords=LAB_REFERENCE_TESTS.filter(x=>x[1]==='Sodium');
assert.equal(matchInterval(sodiumRecords,40,'male'),null);checks++;
const fastingGlucose=LAB_REFERENCE_TESTS.filter(x=>x[1]==='Fasting glucose');
assert.equal(matchInterval(fastingGlucose,40,'female','no')[0],'glu-india-under45');checks++;
assert.equal(matchInterval(fastingGlucose,55,'male')[0],'glu-india-45plus');checks++;
const haemoglobin=LAB_REFERENCE_TESTS.filter(x=>x[0]==='hb');
assert.equal(matchInterval(haemoglobin,35,'male')[0],'hb');checks++;
assert.equal(matchInterval(haemoglobin,35,'female','no')[0],'hb');checks++;
assert.equal(matchInterval(haemoglobin,17,'male'),null);checks++;



assert.equal(matchInterval(fastingGlucose,40,'female',''),null);checks++;
assert.equal(matchInterval(fastingGlucose,40,'female','yes'),null);checks++;
assert.equal(matchInterval(fastingGlucose,40,'female','recent'),null);checks++;
assert.equal(matchInterval(fastingGlucose,40,'',''),null);checks++;
assert.equal(matchInterval(fastingGlucose,40,'','no')[0],'glu-india-under45');checks++;
assert.equal(matchInterval(fastingGlucose,40,'male','yes'),null);checks++;
const pregnancyOnly=[{...LAB_REFERENCE_TESTS.find(x=>x[0]==='na'),9:{...LAB_REFERENCE_TESTS.find(x=>x[0]==='na')[9],pregnancyScope:'pregnancy_specific'}}];
assert.equal(matchInterval(pregnancyOnly,40,'female','no'),null);checks++;
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


const mayoBatchExpected=[
 ['ferritin-m',31,409,'mcg/L',18,120,'male','reference_interval','https://www.mayocliniclabs.com/test-catalog/overview/619953','Serum','Electrochemiluminescence immunoassay'],
 ['ferritin-f18-50',6,175,'mcg/L',18,50,'female','reference_interval','https://www.mayocliniclabs.com/test-catalog/overview/619953','Serum','Electrochemiluminescence immunoassay'],
 ['ferritin-f51plus',11,328,'mcg/L',51,120,'female','reference_interval','https://www.mayocliniclabs.com/test-catalog/overview/619953','Serum','Electrochemiluminescence immunoassay'],
 ['ft4-mayo-adult',0.9,1.7,'ng/dL',20,120,'all','reference_interval','https://www.mayocliniclabs.com/test-catalog/Overview/8725','Serum','Electrochemiluminescence immunoassay'],
 ['tsh-mayo-adult',0.3,4.2,'mIU/L',20,120,'all','reference_interval','https://www.mayocliniclabs.com/test-catalog/Overview/8939','Serum','Electrochemiluminescent immunoassay (Roche Elecsys)'],
 ['t3-total-mayo-adult',80,200,'ng/dL',20,120,'all','reference_interval','https://www.mayocliniclabs.com/test-catalog/Overview/800093','Serum','Electrochemiluminescence immunoassay (Roche Elecsys)'],
 ['t4-total-mayo-adult',4.5,11.7,'mcg/dL',20,120,'all','reference_interval','https://www.mayocliniclabs.com/test-catalog/overview/8724','Serum','Electrochemiluminescence immunoassay (Roche Elecsys)'],
 ['b12-mayo-adult',180,914,'ng/L',18,120,'all','reference_interval','https://www.mayocliniclabs.com/test-catalog/Overview/9154','Serum','Immunoenzymatic assay'],
 ['lactate-mayo-adult',0.5,2.0,'mmol/L',18,120,'all','reference_interval','https://www.mayocliniclabs.com/test-catalog/overview/601685','Plasma NaFl-KOx (gray-top sodium fluoride/potassium oxalate)','Colorimetric'],
 ['amylase-mayo-adult',28,100,'U/L',18,120,'all','reference_interval','https://www.mayocliniclabs.com/test-catalog/overview/8352','Serum','Colorimetric'],
 ['ldh-mayo-adult',122,222,'U/L',18,120,'all','reference_interval','https://www.mayocliniclabs.com/test-catalog/Overview/800058','Serum','Photometric'],
 ['lipase-mayo-adult',13,60,'U/L',18,120,'all','reference_interval','https://www.mayocliniclabs.com/test-catalog/Overview/8328','Serum','Colorimetric'],
 ['pt-mayo-adult',9.4,12.5,'seconds',18,120,'all','reference_interval','https://www.mayocliniclabs.com/test-catalog/Overview/40934','Platelet-poor plasma in 3.2% sodium citrate (plasma Na Cit)','Coagulometric (turbidimetric) clot detection'],
 ['inr-mayo-adult',0.9,1.1,'ratio',18,120,'all','reference_interval','https://www.mayocliniclabs.com/test-catalog/Overview/40934','Platelet-poor plasma in 3.2% sodium citrate (plasma Na Cit)','Calculated INR from PT using thromboplastin ISI; PT measured by coagulometric (turbidimetric) clot detection'],
 ['aptt-mayo-adult',25,37,'seconds',18,120,'all','reference_interval','https://www.mayocliniclabs.com/test-catalog/Overview/40935','Platelet-poor plasma in 3.2% sodium citrate (plasma Na Cit)','Coagulometric (turbidimetric) clot detection using SynthASil reagent'],
 ['fibrinogen-mayo-adult',200,500,'mg/dL',18,120,'all','reference_interval','https://www.mayocliniclabs.com/test-catalog/overview/602173','Plasma Na Cit','Clauss functional clotting assay (HemosIL Fibrinogen-C on Instrumentation Laboratory ACL TOP)'],
 ['pth-mayo-adult',15,65,'pg/mL',18,120,'all','reference_interval','https://www.mayocliniclabs.com/test-catalog/overview/28379','Serum','Electrochemiluminescence'],
 ['pct-mayo-adult',0,0.24,'ng/mL',18,120,'all','reference_interval','https://www.mayocliniclabs.com/test-catalog/overview/40947','Serum','Electrochemiluminescence'],
 ['hstni-mayo-male',0,20,'ng/L',18,120,'male','decision_limit','https://www.mayocliniclabs.com/test-catalog/Overview/614422','Plasma (lithium heparin)','Electrochemiluminescence immunoassay'],
 ['hstni-mayo-female',0,15,'ng/L',18,120,'female','decision_limit','https://www.mayocliniclabs.com/test-catalog/Overview/614422','Plasma (lithium heparin)','Electrochemiluminescence immunoassay']
];
assert.equal(mayoBatchExpected.length,20);checks++;
for(const [id,lo,hi,unit,amin,amax,sex,kind,url,specimen,method] of mayoBatchExpected){
 const e=LAB_REFERENCE_TESTS.find(x=>x[0]===id);assert.ok(e,id+' missing');
 assert.equal(e[5],lo,id+' lower limit');assert.equal(e[6],hi,id+' upper limit');assert.equal(e[4],unit,id+' unit');
 assert.equal(e[9].ageMin,amin,id+' age minimum');assert.equal(e[9].ageMax,amax,id+' age maximum');assert.equal(e[9].sex,sex,id+' sex partition');
 assert.equal(e[9].rangeType,kind,id+' interval type');assert.equal(e[9].sourceUrl,url,id+' source URL');
 assert.equal(e[9].specimen,specimen,id+' specimen');assert.equal(e[9].method,method,id+' method');
 assert.ok(e[9].sourceName&&e[9].population&&e[9].reviewStatus,id+' provenance metadata');
 assert.ok(!e[8]||Boolean(e[8][sex]),id+' sex tuple must not block matching');
 assert.equal(e[9].pregnancyScope,'not_validated_for_pregnancy',id+' pregnancy scope');
 assert.equal(e[9].pregnancyScope,'not_validated_for_pregnancy',id+' pregnancy scope');
 checks+=11;
 const lowLabel=kind==='decision_limit'?'WITHIN DECISION THRESHOLD':'WITHIN REFERENCE INTERVAL';
 const highLabel=kind==='decision_limit'?'WITHIN DECISION THRESHOLD':'WITHIN REFERENCE INTERVAL';
 assert.equal(classify(lo,lo,hi,kind),lowLabel,id+' inclusive lower boundary');
 assert.equal(classify(hi,lo,hi,kind),highLabel,id+' inclusive upper boundary');
 assert.equal(classify(lo-0.001,lo,hi,kind),kind==='decision_limit'?'BELOW DECISION THRESHOLD':'LOW',id+' below lower boundary');
 assert.equal(classify(hi+0.001,lo,hi,kind),kind==='decision_limit'?'ABOVE DECISION THRESHOLD':'HIGH',id+' above upper boundary');
 checks+=4;
}

const calculatorSource=fs.readFileSync(path.join(__dirname,'../clinical-calculators.js'),'utf8');
assert.ok(calculatorSource.includes('750-record evidence expansion target remains open.'));checks++;
assert.ok(!calculatorSource.includes('700+ test validation remains the expansion target'));checks++;
assert.ok(calculatorSource.includes('Decision limits are separately labelled and require assay-specific clinical interpretation'));checks++;
const sourceInventory=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/external-link-inventory-2026-10-30.json'),'utf8'));
assert.ok(sourceInventory.source_files_scanned.includes('clinical-diet-presets.js'));checks++;
assert.ok(sourceInventory.source_files_scanned.includes('lab-reference-governance.js'));checks++;
const mayoInventoryLines=[
 ['https://www.mayocliniclabs.com/test-catalog/overview/619953',[132,133,134]],
 ['https://www.mayocliniclabs.com/test-catalog/Overview/8725',[135]],
 ['https://www.mayocliniclabs.com/test-catalog/Overview/8939',[136]],
 ['https://www.mayocliniclabs.com/test-catalog/Overview/800093',[137]],
 ['https://www.mayocliniclabs.com/test-catalog/overview/8724',[138]],
 ['https://www.mayocliniclabs.com/test-catalog/Overview/9154',[139]],
 ['https://www.mayocliniclabs.com/test-catalog/overview/601685',[140]],
 ['https://www.mayocliniclabs.com/test-catalog/overview/8352',[141]],
 ['https://www.mayocliniclabs.com/test-catalog/Overview/800058',[142]],
 ['https://www.mayocliniclabs.com/test-catalog/Overview/8328',[143]],
 ['https://www.mayocliniclabs.com/test-catalog/Overview/40934',[144,145]],
 ['https://www.mayocliniclabs.com/test-catalog/Overview/40935',[146]],
 ['https://www.mayocliniclabs.com/test-catalog/overview/602173',[147]],
 ['https://www.mayocliniclabs.com/test-catalog/overview/28379',[148]],
 ['https://www.mayocliniclabs.com/test-catalog/overview/40947',[149]],
 ['https://www.mayocliniclabs.com/test-catalog/Overview/614422',[150,151]]
];
for(const [url,expectedLines] of mayoInventoryLines){
 const link=sourceInventory.links.find(x=>x.url===url);assert.ok(link,'Source inventory must contain '+url);
 assert.ok(link.source_files.includes('clinical-calculators.js'),'Inventory must cite clinical-calculators.js for '+url);
 for(const line of expectedLines){assert.ok(link.source_lines.includes(line),'Inventory must retain exact source line '+line+' for '+url);checks++;}
 checks+=2;
}
const ferritinBatch=LAB_REFERENCE_TESTS.filter(x=>x[1]==='Ferritin'&&x[9]?.sourceUrl==='https://www.mayocliniclabs.com/test-catalog/overview/619953');
assert.equal(ferritinBatch.length,3);checks++;
assert.equal(matchInterval(ferritinBatch,35,'male')[0],'ferritin-m');checks++;
assert.equal(matchInterval(ferritinBatch,35,'female','no')[0],'ferritin-f18-50');checks++;
assert.equal(matchInterval(ferritinBatch,60,'female','no')[0],'ferritin-f51plus');checks++;
assert.equal(matchInterval(ferritinBatch,17,'female','no'),null);checks++;
const hsTniBatch=LAB_REFERENCE_TESTS.filter(x=>x[1]==='High-sensitivity troponin I');
assert.equal(matchInterval(hsTniBatch,45,'male')[0],'hstni-mayo-male');checks++;
assert.equal(matchInterval(hsTniBatch,45,'female','no')[0],'hstni-mayo-female');checks++;
assert.equal(matchInterval(hsTniBatch,17,'male'),null);checks++;
assert.equal(LAB_REFERENCE_TESTS.filter(x=>x[0].startsWith('ferritin-')||x[0].includes('-mayo-')).length,20);checks++;

console.log('Lab reference governance tests passed: '+checks+' assertions.');
