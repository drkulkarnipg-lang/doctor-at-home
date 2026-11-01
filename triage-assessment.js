/* Clinician-led adult home-visit triage. NEWS2 faithful scoring + WHO IITT red/yellow override.
 * No autonomous diagnosis, no automatic home clearance, no patient-data persistence.
 * NEWS2 reproduction acknowledgement: Royal College of Physicians, NEWS2, 2017.
 */
(function(root){
'use strict';
const RCP='https://www.rcp.ac.uk/resources/national-early-warning-score-news-2/';
const WHO='https://www.who.int/tools/triage';
const NICE='https://www.nice.org.uk/guidance/ng253';
function scoreNEWS2(v){
 const required=['rr','spo2','sbp','hr','temp','conscious','oxygen'];
 for(const k of required)if(v[k]===undefined||v[k]===null||v[k]==='')return {complete:false,score:null,parts:{},red3:[],reason:'Complete all six physiological parameters and oxygen status.'};
 const n={rr:Number(v.rr),spo2:Number(v.spo2),sbp:Number(v.sbp),hr:Number(v.hr),temp:Number(v.temp)};
 if(Object.values(n).some(x=>!Number.isFinite(x)))return {complete:false,score:null,parts:{},red3:[],reason:'Enter valid numeric observations.'};
 if(n.rr<1||n.rr>80||n.spo2<50||n.spo2>100||n.sbp<30||n.sbp>300||n.hr<20||n.hr>250||n.temp<25||n.temp>45)return {complete:false,score:null,parts:{},red3:[],reason:'One or more observations are outside the supported entry range; recheck measurement.'};
 const parts={
  rr:n.rr<=8?3:n.rr<=11?1:n.rr<=20?0:n.rr<=24?2:3,
  spo2:n.spo2<=91?3:n.spo2<=93?2:n.spo2<=95?1:0,
  sbp:n.sbp<=90?3:n.sbp<=100?2:n.sbp<=110?1:n.sbp<=219?0:3,
  hr:n.hr<=40?3:n.hr<=50?1:n.hr<=90?0:n.hr<=110?1:n.hr<=130?2:3,
  conscious:v.conscious==='alert'?0:3,
  temp:n.temp<=35?3:n.temp<=36?1:n.temp<=38?0:n.temp<=39?1:2,
  oxygen:v.oxygen==='yes'?2:0
 };
 const red3=Object.entries(parts).filter(([k,x])=>x===3&&k!=='oxygen').map(([k])=>k);
 return {complete:true,score:Object.values(parts).reduce((a,b)=>a+b,0),parts,red3,reason:''};
}
const requiredYesNo=['infection','fever3','highFever','severeWeakness','oralIntake','urine','dyspnoea','stridorCyanosis','chestPain','palpitationSyncope','neuroDeficit','confusion','unresponsive','seizure','vomiting','bleeding','rash','hypoglycaemia','frail','immunosuppressed','pregnant','caregiver','followup','clinicalConcern'];
const labels={infection:'Suspected/confirmed infection',fever3:'Fever for ≥3 days',highFever:'High-grade fever (≥39°C documented or strongly reported)',severeWeakness:'Severe weakness / unable to perform usual activity',oralIntake:'Able to drink and retain oral fluids',urine:'Urine output reasonably maintained',dyspnoea:'Breathlessness at rest / respiratory distress',stridorCyanosis:'Stridor or central cyanosis',chestPain:'New or severe chest pain',palpitationSyncope:'Syncope or sustained symptomatic palpitations',neuroDeficit:'New focal neurological deficit / stroke symptoms',confusion:'New confusion / reduced responsiveness',unresponsive:'Unresponsive / cannot be roused',seizure:'Current/recent acute seizure',hypoglycaemia:'Clinically significant hypoglycaemia',vomiting:'Persistent vomiting / unable to retain fluids',bleeding:'Significant active bleeding',rash:'Non-blanching purpuric rash / rapidly progressive rash',frail:'Frailty / major functional dependence',immunosuppressed:'Immunosuppression / chemotherapy / transplant',pregnant:'Pregnant or recently pregnant',caregiver:'Reliable caregiver available if home plan considered',followup:'Reliable reassessment / emergency access available',clinicalConcern:'Doctor has any overriding concern about home treatment'};
const triageRed=['dyspnoea','stridorCyanosis','neuroDeficit','unresponsive','seizure','bleeding','rash','hypoglycaemia'];
const triageYellow=['severeWeakness','highFever','vomiting','oralIntake','urine'];
function val(id){return document.getElementById('triage_'+id)?.value??'';}
function checked(id){return val(id)==='yes';}
function html(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function buildMarkup(){
 const yn=requiredYesNo.map(k=>'<div class="triage-field"><label for="triage_'+k+'">'+labels[k]+'</label><select id="triage_'+k+'"><option value="">Select</option><option value="no">No</option><option value="yes">Yes</option><option value="unassessed">Unable to assess</option></select></div>').join('');
 return '<section id="viewTriageAssessment" class="hidden triage-shell space-y-5" aria-labelledby="triageTitle">'+
 '<div class="triage-hero"><span class="section-eyebrow">Doctor Workstation · clinician-only decision support</span><h2 id="triageTitle">Home Visit Clinical Triage &amp; Disposition</h2><p>Structured ABCDE assessment, NEWS2 physiology score, WHO emergency danger-sign override and documented home-care suitability review. Designed for clinician completion; it is not an autonomous diagnosis or clearance tool.</p><div class="triage-help"><b>Scope:</b> adult patients aged 16 years or older, not pregnant/recently pregnant. Pregnancy and paediatric cases require their own validated pathway. Record observations at the time of assessment.</div></div>'+
 '<div class="triage-grid"><section class="triage-card"><h3>1 · Patient &amp; encounter</h3><div class="triage-fields">'+
 field('patient','Patient name / ID','text','full')+field('age','Age (years)','number')+field('sex','Sex','select','', ['Select','Female','Male','Other / not recorded'])+field('date','Assessment date / time','datetime-local','full')+field('location','Assessment location','text','full')+
 field('chief','Chief complaint / likely source','textarea','full')+field('duration','Illness duration (days)','number')+
 '</div></section><section class="triage-card"><h3>2 · Mandatory physiological observations</h3><div class="triage-fields">'+
 field('rr','Respiratory rate /min','number')+field('spo2','SpO₂ (%) · Scale 1','number')+field('sbp','Systolic BP (mmHg)','number')+field('dbp','Diastolic BP (mmHg)','number')+field('hr','Pulse /min','number')+field('temp','Temperature °C','number')+
 field('conscious','Consciousness / AVPU','select','',['Select','Alert','New confusion / Verbal / Pain / Unresponsive'])+
 field('oxygen','Supplemental oxygen currently required?','select','',['Select','No','Yes'])+
 field('glucose','Capillary glucose (mmol/L or mg/dL as recorded)','text')+field('pain','Pain score (0–10)','number')+
 '</div><p class="triage-muted">NEWS2 uses RR, SpO₂ Scale 1, SBP, pulse, consciousness, temperature and +2 for supplemental oxygen. SpO₂ Scale 2 is intentionally not auto-selected; it is only for a clinician-confirmed hypercapnic respiratory-failure pathway.</p></section></div>'+
 '<section class="triage-card"><h3>3 · History, red flags and home-care factors — compulsory clinician checklist</h3><p class="triage-help">Tick each item present / applicable. For positive oral intake, urine, caregiver and follow-up items, tick only when confirmed.</p><div class="triage-checks">'+yn+'</div><div class="triage-fields" style="margin-top:12px">'+field('comorbids','Important comorbidities / baseline BP / usual SpO₂','textarea','full')+field('exam','ABCDE findings, perfusion, hydration, chest/cardiac/neuro examination','textarea','full')+field('investigations','Available ECG / laboratory / imaging findings','textarea','full')+'</div></section>'+
 '<div class="triage-grid"><section class="triage-card"><h3>4 · Clinical judgement &amp; proposed disposition</h3><div class="triage-fields">'+
 field('diagnosis','Working diagnosis / differential','textarea','full')+
 field('homeReason','If home care is proposed, why is it clinically suitable?','textarea','full')+
 field('treatment','Home treatment, monitoring and review plan','textarea','full')+
 field('review','Planned reassessment interval / named reviewer','text','full')+
 field('referral','Referral destination / ambulance / handover if required','textarea','full')+
 field('doctor','Assessing doctor name / registration','text','full')+
 '</div></section><section class="triage-card"><h3>5 · Mandatory final decision</h3><div class="triage-fields">'+
 field('decision','Doctor’s final disposition','select','full',['Select','Emergency transfer / resuscitation','Urgent hospital assessment','Same-day in-person reassessment','Home treatment with documented safety-net','Observation / monitored facility'])+
 field('override','Any clinician override?','select','full',['Select','No','Escalate above score','Do not home-treat despite low score'])+
 field('overrideReason','Reason / safety-net / shared decision discussion','textarea','full')+
 '<label class="triage-check full"><input type="checkbox" id="triage_confirm"><span>I personally assessed the patient, reviewed the observations and red flags, and accept responsibility for the final disposition. The score does not replace my judgement.</span></label>'+
 '</div></section></div>'+
 '<div class="triage-actions no-print"><button type="button" id="triageCalculate">Calculate NEWS2 &amp; triage</button><button type="button" id="triagePrint">Print / Save as PDF</button><button type="button" id="triageReset">Clear form</button></div>'+
 '<section id="triageResult" class="triage-result" aria-live="polite"><b>Assessment not yet calculated.</b><p class="triage-output">Complete all required observations and checklist items, then calculate. Missing values are never treated as normal.</p></section>'+
 '<p class="triage-muted">No patient data are sent to a server or saved by this module. Print/export is initiated by the clinician. NEWS2: Royal College of Physicians (2017), reproduced scoring faithfully; WHO IITT adult triage danger signs; NICE NG253 suspected sepsis guidance. Clinical governance review is required before routine clinical deployment.</p></section>';
}
function field(id,label,type='text',size='',opts=[]){
 let input=type==='textarea'?'<textarea id="triage_'+id+'" '+(size==='full'?'':'')+'></textarea>':type==='select'?'<select id="triage_'+id+'">'+opts.map((o,i)=>'<option value="'+(i===0?'':o==='No'?'no':o==='Yes'?'yes':o==='Alert'?'alert':o==='New confusion / Verbal / Pain / Unresponsive'?'not-alert':o.toLowerCase().replace(/[^a-z0-9]+/g,'-'))+'">'+html(o)+'</option></select>':'<input id="triage_'+id+'" type="'+type+'" '+(type==='number'?'step="any"':'')+'>';
 return '<div class="triage-field '+(size==='full'?'full':'')+'"><label for="triage_'+id+'">'+label+'</label>'+input+'</div>';
}
function getForm(){
 const required=['age','sex','rr','spo2','sbp','dbp','hr','temp','conscious','oxygen','duration',...requiredYesNo,'decision','override'];
 const missing=required.filter(k=>val(k)===''||val(k)==='unassessed');\n if(!document.getElementById('triage_confirm')?.checked)missing.push('Doctor confirmation');
 const bools=requiredYesNo;
 const yes=bools.filter(k=>checked(k));
 return {missing,yes,age:Number(val('age')),sex:val('sex'),duration:Number(val('duration')),v:{rr:val('rr'),spo2:val('spo2'),sbp:val('sbp'),hr:val('hr'),temp:val('temp'),conscious:val('conscious'),oxygen:val('oxygen')==='yes'?'yes':val('oxygen')==='no'?'no':''}};
}
function calculate(){
 const f=getForm(),out=document.getElementById('triageResult');if(!out)return;
 if(f.missing.length){out.className='triage-result yellow';out.innerHTML='<b>Assessment incomplete — no risk category assigned.</b><p class="triage-output">Complete all mandatory fields: '+f.missing.map(html).join(', ')+'. Do not interpret missing values as normal.</p>';return;}
 if(f.age<16||f.age>120){out.className='triage-result yellow';out.innerHTML='<b>Outside validated age scope.</b><p class="triage-output">This adult pathway is limited to age ≥16 years. Use a paediatric pathway for children. Review age entry.</p>';return;}
 if(f.yes.includes('pregnant')){out.className='triage-result yellow';out.innerHTML='<b>Pregnancy / recent pregnancy pathway required.</b><p class="triage-output">Do not use this non-pregnant adult pathway. Use an obstetric emergency/sepsis pathway.</p>';return;}
 const n=scoreNEWS2(f.v);if(!n.complete){out.className='triage-result yellow';out.textContent=n.reason;return;}
 const red=f.yes.filter(k=>triageRed.includes(k));
 const yellow=f.yes.filter(k=>triageYellow.includes(k));
 const vit={hr:Number(f.v.hr),rr:Number(f.v.rr),temp:Number(f.v.temp),spo2:Number(f.v.spo2)};
 const whoHigh=(vit.hr<60||vit.hr>130||vit.rr<10||vit.rr>30||vit.temp<36||vit.temp>39||vit.spo2<92||f.v.conscious!=='alert');
 const anyYellow=yellow.some(k=>k==='oralIntake'||k==='urine'? !f.yes.includes(k):true)||whoHigh||f.yes.includes('palpitationSyncope');
 const sepsis=f.yes.includes('infection');
 const scoreHigh=n.score>=7,scoreMedium=n.score>=5&&n.score<=6,single3=n.red3.length>0;
 let category='green',reasons=[];
 if(red.length){category='red';reasons.push('WHO emergency danger sign(s): '+red.map(k=>labels[k]).join('; '));}\n if(vit.hr<50||vit.hr>150){category='red';reasons.push('WHO red vital-sign threshold: heart rate <50 or >150/min.');}
 if(f.yes.includes('clinicalConcern')){category='red';reasons.push('Doctor reports overriding clinical concern: escalation is required.');}
 if(scoreHigh){category='red';reasons.push('NEWS2 ≥7: high-risk physiological score.');}
 if(category!=='red'&&(scoreMedium||single3||anyYellow)){category='yellow';if(scoreMedium)reasons.push('NEWS2 5–6: urgent assessment threshold.');if(single3)reasons.push('At least one NEWS2 parameter scores 3: urgent clinician review irrespective of aggregate.');if(anyYellow)reasons.push('WHO urgent/high-risk feature(s) present.');}
 if(category==='green'&&sepsis&&n.score===0)reasons.push('NEWS2 0 does not exclude sepsis; reassess if clinical concern or deterioration.');
 if(category==='green'&&n.score>=1)reasons.push('NEWS2 1–4: low physiological score band only; it is not a home-treatment clearance.');\n if(category==='green'&&sepsis&&n.score===0)reasons.push('For suspected infection, NEWS2 0 does not exclude sepsis or deterioration.');
 const canConsiderHome=category==='green'&&n.score<=4&&!single3&&!whoHigh&&f.yes.includes('oralIntake')&&f.yes.includes('urine')&&f.yes.includes('caregiver')&&f.yes.includes('followup')&&!f.yes.includes('frail')&&!f.yes.includes('immunosuppressed')&&!f.yes.includes('severeWeakness')&&!f.yes.includes('highFever')&&!f.yes.includes('vomiting')&&!f.yes.includes('clinicalConcern')&&val('decision')==='home-treatment-with-documented-safety-net'&&val('homeReason').trim()&&val('diagnosis').trim()&&val('treatment').trim()&&val('review').trim()&&document.getElementById('triage_confirm')?.checked===true;
 const partLabels={rr:'Respiratory rate',spo2:'SpO₂',sbp:'Systolic BP',hr:'Pulse',conscious:'Consciousness',temp:'Temperature',oxygen:'Supplemental oxygen'};
 const breakdown=Object.entries(n.parts).map(([k,v])=>'<li>'+partLabels[k]+': <b>'+v+'</b></li>').join('');
 const title=category==='red'?'RED — EMERGENCY / TRANSFER':category==='yellow'?'YELLOW — URGENT IN-PERSON ASSESSMENT':'GREEN — NO CURRENT RED/YELLOW TRIGGER IDENTIFIED';
 const disposition=category==='red'?'Do not manage as routine home care. Initiate ABCDE first response, arrange emergency transfer/ambulance and pre-alert receiving facility.':category==='yellow'?'Do not label as routine home-care eligible. Arrange urgent same-day assessment in an appropriate facility or monitored setting; clinician must determine transfer urgency.':'A low triage trigger state is not proof of safety. Home treatment may be considered only after a definitive clinical assessment, diagnosis, treatment feasibility, patient/caregiver understanding and reliable reassessment.';
 const home=canConsiderHome?'<p><b>Home-care consideration:</b> prerequisites in this checklist are present. This is not automatic clearance. The doctor must still document a plausible diagnosis, why hospital care is not needed, treatment/monitoring, explicit return precautions and review time.</p>':'<p><b>Home-care gate:</b> not met on this checklist. Do not record “safe for home” from the score alone. Review the positive factors and disposition with clinical judgement.</p>';
 out.className='triage-result '+category;
 out.innerHTML='<div class="triage-badge '+category+'">'+title+'</div><div class="triage-score">NEWS2: '+n.score+'</div><div class="triage-output"><p><b>Score components</b></p><ul>'+breakdown+'</ul><p><b>Risk / escalation reasons</b></p><ul>'+ (reasons.length?reasons.map(x=>'<li>'+html(x)+'</li>').join(''):'<li>No WHO red/yellow trigger detected from the entered checklist.</li>')+'</ul><p><b>Disposition prompt</b> '+disposition+'</p>'+home+'<p><b>Doctor's recorded decision:</b> '+html(val('decision')||'Not selected')+'</p><p><b>Clinical override:</b> '+html(val('override')||'Not selected')+' — '+html(val('overrideReason'))+'</p><p class="triage-muted">NEWS2 thresholds: 0–4 low, 5–6 medium, ≥7 high; any single parameter score 3 triggers urgent clinician review. For suspected sepsis, use history, examination and clinical concern as well as score; NICE NG253. WHO danger signs override the aggregate score.</p></div>';
 out.dataset.category=category;out.dataset.score=String(n.score);out.dataset.homeConsideration=String(canConsiderHome);
}
function build(){
 if(document.getElementById('viewTriageAssessment'))return;
 const nav=document.querySelector('.doctor-tabs'),anchor=document.getElementById('tabShareDesk')||document.getElementById('tabSet'),launch=document.getElementById('viewClinicalTools');
 if(!nav||!launch)return;
 const btn=document.createElement('button');btn.type='button';btn.id='tabTriage';btn.className='px-3.5 py-1.5 bg-white border petal-border text-[#0F2942] text-xs font-bold rounded-xl';btn.textContent='🚦 Clinical Triage';btn.addEventListener('click',()=>window.switchDocTab('triageAssessment'));nav.insertBefore(btn,anchor||null);
 const holder=document.createElement('div');holder.innerHTML=buildMarkup();launch.parentNode.insertBefore(holder.firstElementChild,launch);
 const original=window.switchDocTab;
 if(typeof original==='function'&&!original.__triageWrapped){const wrapped=function(tabId){const panel=document.getElementById('viewTriageAssessment');if(tabId!=='triageAssessment')panel?.classList.add('hidden');const result=original.apply(this,arguments);if(tabId==='triageAssessment')panel?.classList.remove('hidden');return result;};wrapped.__triageWrapped=true;window.switchDocTab=wrapped;}
 document.getElementById('triageCalculate').addEventListener('click',calculate);
 document.getElementById('triagePrint').addEventListener('click',()=>window.print());
 document.getElementById('triageReset').addEventListener('click',()=>{document.querySelectorAll('#viewTriageAssessment input,#viewTriageAssessment select,#viewTriageAssessment textarea').forEach(el=>{if(el.type==='checkbox')el.checked=false;else el.value='';});const o=document.getElementById('triageResult');o.className='triage-result';o.innerHTML='<b>Assessment not yet calculated.</b>';});
 const now=new Date();const local=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,16);document.getElementById('triage_date').value=local;
}
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();}
if(typeof module!=='undefined'&&module.exports)module.exports={scoreNEWS2,requiredYesNo,triageRed,triageYellow};
})(typeof window!=='undefined'?window:globalThis);
