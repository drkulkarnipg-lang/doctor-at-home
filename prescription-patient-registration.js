/* Prescription -> practice patient register bridge.
 * Demographics only: no symptoms, diagnosis, medicines, or prescription text are copied to the register.
 * Cloud writes require the authenticated owner session and the clinician's patient-information confirmation.
 */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const watched=['rxPatName','rxPatAge','rxPatSex','rxPatPhone','rxPatAddress','rxPatLoc','rxDateTime','rxPatientRegisterConsent'];
let timer=null,saving=false,dirty=false,savedRecord=null,patientCode='',identityKey='',lastSavedSnapshot='';
const normal=s=>String(s||'').trim().toLocaleLowerCase('en');
function indiaNow(date=new Date()){
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date).map(x=>[x.type,x.value]));
 return {date:parts.day+'/'+parts.month+'/'+parts.year,time:parts.hour+':'+parts.minute,iso:parts.year+'-'+parts.month+'-'+parts.day,stamp:parts.year+parts.month+parts.day+'-'+parts.hour+parts.minute};
}
function suffix(n=8){try{return crypto.randomUUID().replace(/-/g,'').slice(0,n).toUpperCase();}catch{const a=new Uint8Array(n);crypto.getRandomValues(a);return [...a].map(x=>(x%16).toString(16)).join('').toUpperCase();}}
function phoneDigits(){let digits=String($('rxPatPhone')?.value||'').replace(/\D/g,'');if(digits.length===12&&digits.startsWith('91'))digits=digits.slice(2);return digits;}
function validPhone(){return /^[6-9]\d{9}$/.test(phoneDigits());}
function status(message){const el=$('rxPatientRegistrationStatus');if(el)el.textContent=message;}
function currentIdentity(){return normal($('rxPatName')?.value)+'|'+phoneDigits();}
function dateParts(){
 const raw=$('rxDateTime')?.value||'',m=raw.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
 if(m)return {iso:m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0'),display:raw};
 return indiaNow();
}
function setSerials(){
 const now=indiaNow(),rx=$('rxSerialNo');
 if(rx&&!rx.value)rx.value='RX-'+now.stamp+'-'+suffix(4);
}
function assignPatientCode(){
 if(!patientCode){const now=indiaNow();patientCode='PT-'+now.iso.replace(/-/g,'')+'-'+suffix(8);}
 const input=$('rxPatientCode');if(input)input.value=patientCode;
}
function collect(){
 const now=dateParts(),display=$('rxDateTime')?.value.trim()||now.display+' '+indiaNow().time+' IST';
 return {
  registerType:'daily',entryDate:now.iso,patientDateTime:display,
  patientName:$('rxPatName')?.value.trim()||'',patientCode,
  prescriptionSerial:$('rxSerialNo')?.value.trim()||'',
  phone:phoneDigits(),address:[$('rxPatAddress')?.value.trim(),$('rxPatLoc')?.value.trim()].filter(Boolean).join(', '),
  age:$('rxPatAge')?.value.trim()||'',sex:$('rxPatSex')?.value||'',
  visitType:'Prescription / clinical encounter',
  clinicalSummary:'',amount:'',paymentStatus:'Not recorded'
 };
}
function snapshot(data){return JSON.stringify(data);}
async function findOrCreatePatientCode(data){
 const listed=await window.ClinicCloud.listRegister('daily');
 const match=(listed.records||[]).find(record=>
  normal(record.data?.patientName)===normal(data.patientName) &&
  String(record.data?.phone||'').replace(/\D/g,'').replace(/^91(?=\d{10}$)/,'')===data.phone &&
  typeof record.data?.patientCode==='string'&&record.data.patientCode.trim()
 );
 if(match)return match.data.patientCode.trim();
 assignPatientCode();return patientCode;
}
async function persist(){
 if(saving){dirty=true;return;}
 const data=collect();
 if(!data.patientName){status('Enter the patient name. A patient number will be assigned after the mobile number is entered.');return;}
 if(!validPhone()){status('Enter a valid 10-digit Indian patient mobile number to create or match the patient register entry. Prescription details remain on this screen.');return;}
 assignPatientCode();
 if(!$('rxPatientRegisterConsent')?.checked){status('Patient number assigned: '+patientCode+'. Confirm that the patient / authorised representative has been informed before the private cloud register is updated.');return;}
 let session;
 try{session=await window.ClinicCloud.session();}catch(e){status('Patient number '+patientCode+' assigned, but cloud registration is not confirmed: '+e.message);return;}
 if(!session.configured||!session.signedIn||!window.ClinicCloud.isSignedIn()){
  status('Patient number '+patientCode+' assigned. Sign in to Doctor Workstation; the patient has not yet been saved to the private register.');
  return;
 }
 saving=true;
 try{
  data.patientCode=await findOrCreatePatientCode(data);
  $('rxPatientCode').value=data.patientCode;patientCode=data.patientCode;
  let repeat=true;
  while(repeat){
   dirty=false;
   const requestIdentity=currentIdentity();
   const payload=collect();payload.patientCode=patientCode;
   const body={...payload};
   if(savedRecord){body.id=savedRecord.id;body.revision=savedRecord.revision;}
   const result=await window.ClinicCloud.saveRegister(body);
   if(!result?.record?.id||!result.record.revision)throw Error('The cloud did not return a saved record ID and revision.');
   if(requestIdentity!==currentIdentity()){
    savedRecord=null;lastSavedSnapshot='';patientCode='';identityKey=currentIdentity();patientCode=await findOrCreatePatientCode(collect());$('rxPatientCode').value=patientCode;
    repeat=true;continue;
   }
   savedRecord=result.record;lastSavedSnapshot=snapshot(collect());
   const latest=collect();repeat=dirty||snapshot(latest)!==lastSavedSnapshot;
  }
  const missing=[];if(!$('rxPatAge')?.value.trim())missing.push('age');if(!$('rxPatSex')?.value)missing.push('sex');if(!$('rxPatAddress')?.value.trim())missing.push('full address');status('Registered in the private Daily Patient Register · '+patientCode+'. '+(missing.length?'Complete the remaining patient details: '+missing.join(', ')+'.':'Patient demographics are complete.')+' Prescription '+($('rxSerialNo')?.value||'')+' remains a separate document serial.');
  window.dispatchEvent(new CustomEvent('clinic-patient-register-updated',{detail:{patientCode,recordId:savedRecord.id}}));
 }catch(e){status('PATIENT NOT REGISTERED IN CLOUD: '+e.message+'. Prescription entries remain on screen; correct the issue and retry.');}
 finally{saving=false;}
}
function schedule(){
 clearTimeout(timer);timer=setTimeout(()=>persist(),650);
}
function onIdentityEdit(){
 const next=currentIdentity();
 if(savedRecord&&identityKey&&next!==identityKey){
  savedRecord=null;lastSavedSnapshot='';patientCode='';assignPatientCode();
  status('Patient identity changed after a previous register save. A new patient number is being assigned; the earlier patient entry remains unchanged.');
 }
 if(!identityKey||!savedRecord)identityKey=next;
 assignPatientCodeIfReady();schedule();
}
function assignPatientCodeIfReady(){if($('rxPatName')?.value.trim()&&validPhone())assignPatientCode();}
document.addEventListener('DOMContentLoaded',()=>{
 const now=indiaNow();
 const date=$('rxDateTime');if(date&&!date.value)date.value=now.date+' '+now.time+' IST';
 setSerials();
 for(const id of watched){const el=$(id);if(!el)continue;el.addEventListener('input',onIdentityEdit);el.addEventListener('change',onIdentityEdit);}
 $('rxPatientRegisterConsent')?.addEventListener('change',schedule);
 window.addEventListener('clinic-owner-signed-in',schedule);
 window.addEventListener('clinic-owner-signed-out',()=>status('Doctor signed out. Patient details remain in the open prescription but no cloud registration can occur until owner login is restored.'));
 const retry=document.createElement('button');retry.type='button';retry.className='no-print text-xs font-bold underline';retry.textContent='Retry patient registration';retry.addEventListener('click',()=>persist());
 const host=$('rxPatientRegistrationStatus')?.parentElement;if(host)host.append(retry);
 assignPatientCodeIfReady();
});
window.PrescriptionPatientRegistration={persist,collect,indiaNow};
})();