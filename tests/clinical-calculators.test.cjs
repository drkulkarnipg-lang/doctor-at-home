const assert=require('node:assert/strict');
const {calculators,calculate}=require('../clinical-calculators.js');
let checks=0;
const near=(id,v,x,tol=1e-8)=>{const r=calculate(id,v);assert.ok(Math.abs(r.value-x)<=tol,`${id}: ${r.value} != ${x}`);checks++;return r;};
const reject=(id,v)=>{assert.throws(()=>calculate(id,v));checks++;};
const fixtures={
1:[{weight:70,height:175,age:40},22.857142857142858],2:[{sbp:120,dbp:80},93.33333333333333],3:[{target:1500,intake:400},1100],
4:[{age:60,weight:72,cr:1,sex:'male'},80],5:[{a1c:7},154.2],6:[{eye:'4',verbal:'5',motor:'6'},15],
7:[{weight:60,kcal:25,protein:1.2},1500],8:[{volume:1000,hours:8,factor:20},125],9:[{age:30,weight:70,tbsa:30,factor:'2'},4200],
10:[{ca:8,albumin:2},9.6],11:[{confusion:'0',urea:7,rr:29,sbp:120,dbp:61,age:64},0],12:[{na:140,cl:104,hco3:24,albumin:4},12],
13:[{pressure:2000,reserve:200,factor:0.28,flow:2},252],14:[{rr:22,sbp:100,altered:'1'},3],15:[{pao2:80,fio2:40},200],
16:[{na:130,glucose:400},134.8],17:[{una:20,sna:140,ucr:100,scr:2},0.2857142857142857],18:[{weight:25,method:'p421'},65],
19:[{dose:5,from:'5',to:'0.75'},0.75],20:[{cancer:'0',paresis:'0',bed:'0',tender:'0',whole:'0',calf:'0',edema:'0',veins:'0',prior:'0',alternative:'1'},-2],
21:[{dvt:'1',alternative:'0',tachy:'1',immobile:'0',prior:'0',blood:'0',cancer:'0'},4.5],
22:[{hf:'1',htn:'1',age:75,diabetes:'1',stroke:'1',vascular:'1',female:'1'},9],
23:[{htn:'1',renal:'1',liver:'1',stroke:'1',bleed:'1',inr:'1',elder:'1',drugs:'1',alcohol:'1'},9],
24:[{glucose:250,target:150,sensitivity:50,active:0.5,confirmed:'1'},1.5],25:[{physical:'4',mental:'4',activity:'4',mobility:'4',incontinence:'4'},20],
26:[{hr:100,sbp:80},1.25],27:[{age:40,rest:60,intensity:60},132],
28:[{age:40,female:'1',bili:2.5,inr:1.8,cr:1.4,na:130,albumin:2.8,dialysis:'0'},26],
29:[{bili:1,albumin:4,inr:1.2,ascites:'1',enceph:'1'},5],
30:[{temp:'0',map:'0',hr:'0',rr:'0',oxygen:'low',oxygenValue:90,acid:'ph',ph:'0',na:'0',k:'0',cr:'0',arf:'0',hct:'0',wbc:'0',gcs:15,age:40,chronic:'0'},0]
};
assert.equal(calculators.length,30);assert.equal(new Set(calculators.map(c=>c.id)).size,30);assert.ok(calculators.every(c=>c.note&&c.note.trim()&&/^https:\/\//.test(c.url)),'Every calculator must include a reference/interpretation note and a source link');const a1c=calculators.find(c=>c.id===5);assert.match(a1c.note,/<5\.7%/);assert.match(a1c.note,/5\.7–6\.4%/);assert.match(a1c.note,/≥6\.5%/);assert.match(a1c.note,/not personal treatment targets/);assert.equal(a1c.interpretationUrl,'https://diabetes.org/about-diabetes/diagnosis');checks+=7;
for(const c of calculators){const [v,x]=fixtures[c.id];near(c.id,v,x);reject(c.id,{});for(const field of c.fields){if(field.when&&!field.when(v))continue;for(const bad of ['',null,undefined,'garbage',field.type==='number'?Infinity:'unlisted'])reject(c.id,{...v,[field.key]:bad});if(field.type==='number'){reject(c.id,{...v,[field.key]:field.min-1});if(Number.isFinite(field.max))reject(c.id,{...v,[field.key]:field.max+1});}}}
near(4,{...fixtures[4][0],sex:'female'},68);
assert.equal(calculate(6,{eye:'4',verbal:'NT',motor:'6'}).value,null);checks++;
near(6,{eye:'1',verbal:'2',motor:'3'},6);
assert.match(calculate(8,fixtures[8][0]).text,/42 drops\/min/);checks++;
near(9,{...fixtures[9][0],factor:'4'},8400);
const curb=fixtures[11][0];near(11,{...curb,dbp:60},1);near(11,{...curb,sbp:89,dbp:59},1);near(11,{...curb,urea:7.01,rr:30,age:65,confusion:'1',dbp:60},5);
near(13,{...fixtures[13][0],pressure:100},0);reject(13,{...fixtures[13][0],flow:0});
near(14,{rr:21,sbp:101,altered:'0'},0);
for(const [p,band]of [[100,'≤100'],[200,'>100–200'],[300,'>200–300'],[301,'>300']]){assert.ok(calculate(15,{pao2:p,fio2:100}).text.includes(band));checks++;}
near(16,{na:130,glucose:100},130);reject(16,{na:130,glucose:99});
near(17,{...fixtures[17][0],una:0},0);reject(17,{...fixtures[17][0],ucr:0});
near(18,{weight:10,method:'p421'},40);near(18,{weight:20,method:'p421'},60);near(18,{weight:25,method:'pday'},1600);near(18,{weight:70,method:'adult',factor:25},1750);
near(19,{dose:0.75,from:'0.75',to:'20'},20);
near(20,Object.fromEntries(Object.keys(fixtures[20][0]).map(k=>[k,k==='alternative'?'0':'1'])),9);
const pe=fixtures[21][0];near(21,{...pe,tachy:'0',blood:'1'},4);assert.match(calculate(21,{...pe,tachy:'0',blood:'1'}).text,/unlikely/);checks++;
const af=fixtures[22][0];near(22,{...af,age:74},8);near(22,{...af,age:64},7);
near(24,{...fixtures[24][0],glucose:100},0);reject(24,{...fixtures[24][0],glucose:69});reject(24,{...fixtures[24][0],confirmed:'0'});
near(25,{physical:'1',mental:'1',activity:'1',mobility:'1',incontinence:'1'},5);
reject(26,{hr:100,sbp:0});reject(27,{age:70,rest:160,intensity:60});
near(28,{age:30,female:'0',bili:.5,inr:.5,cr:.5,na:150,albumin:4,dialysis:'0'},6);
near(28,{age:30,female:'1',bili:100,inr:10,cr:20,na:100,albumin:1,dialysis:'1'},40);
assert.equal(calculate(28,{...fixtures[28][0],cr:1,dialysis:'1'}).value,calculate(28,{...fixtures[28][0],cr:3,dialysis:'0'}).value);checks++;
near(29,{bili:2,albumin:3.5,inr:1.7,ascites:'2',enceph:'2'},10);near(29,{bili:3,albumin:2.8,inr:2.3,ascites:'1',enceph:'1'},8);
const ap=fixtures[30][0];near(30,{...ap,age:44},0);near(30,{...ap,age:45},2);near(30,{...ap,age:55},3);near(30,{...ap,age:65},5);near(30,{...ap,age:75},6);
for(const [p,x] of [[71,0],[70,1],[61,1],[60,3],[55,3],[54,4]])near(30,{...ap,oxygenValue:p},x);
for(const [p,x] of [[199,0],[200,2],[350,3],[500,4]])near(30,{...ap,oxygen:'high',oxygenValue:p},x);
near(30,{...ap,acid:'hco3',ph:'4',hco3:'0'},0);reject(30,{...ap,acid:'hco3'});near(30,{...ap,cr:'4',arf:'1'},8);reject(30,{...ap,gcs:14.5});
near(30,{temp:'4',map:'4',hr:'4',rr:'4',oxygen:'high',oxygenValue:600,acid:'ph',ph:'4',na:'4',k:'4',cr:'4',arf:'1',hct:'4',wbc:'4',gcs:3,age:80,chronic:'5'},71);
console.log(`${checks} assertions passed across all 30 calculators.`);
