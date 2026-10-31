'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const {validateRegister}=require('../api/clinical-cloud');
const script=fs.readFileSync('prescription-patient-registration.js','utf8');
const markup=`<main>
<input id="rxSerialNo"><input id="rxPatientCode"><input id="rxDateTime">
<input id="rxPatName"><input id="rxPatAge"><select id="rxPatSex"><option value="">Choose</option><option>Female</option><option>Male</option></select>
<input id="rxPatPhone"><input id="rxPatLoc"><textarea id="rxPatAddress"></textarea>
<input id="rxPatientRegisterConsent" type="checkbox"><p id="rxPatientRegistrationStatus"></p>
</main>`;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function makeWindow(records=[]){
 const dom=new JSDOM(markup,{url:'https://clinic.example.test',runScripts:'outside-only'}),w=dom.window;
 const saves=[],lookups=[],returned=[];
 let revision=0;
 w.ClinicCloud={
  session:async()=>({configured:true,signedIn:true}),
  isSignedIn:()=>true,
  listRegister:async type=>{lookups.push(type);return {records};},
  findPatient:async(phone,name)=>{lookups.push({phone,name});const match=records.find(record=>String(record.data?.phone||'').replace(/\D/g,'')===phone&&String(record.data?.patientName||'').trim().toLowerCase()===name.trim().toLowerCase());return {patientCode:match?.data?.patientCode||null};},
  saveRegister:async entry=>{
   saves.push({...entry});
   revision++;
   const record={id:entry.id||'00000000-0000-4000-8000-000000000001',revision:'00000000-0000-4000-8000-'+String(revision).padStart(12,'0'),data:{...entry}};returned.push(record);return {record};
  }
 };
 w.eval(script);w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
 return {dom,w,saves,lookups,returned};
}
(async()=>{
 const {dom,w,saves,lookups,returned}=makeWindow();
 const $=id=>w.document.getElementById(id);
 assert.match($('rxSerialNo').value,/^RX-\d{8}-\d{4}-[A-F0-9]{4}$/,'prescription serial is automatically generated and distinct');
 $('rxPatName').value='Test Patient';$('rxPatName').dispatchEvent(new w.Event('input',{bubbles:true}));
 $('rxPatPhone').value='+91 98765 43210';$('rxPatPhone').dispatchEvent(new w.Event('input',{bubbles:true}));
 assert.match($('rxPatientCode').value,/^PT-\d{8}-[A-F0-9]{8}$/,'patient registration number is automatically assigned after name and valid phone');
 await wait(750);assert.equal(saves.length,0,'no cloud registration before patient-information confirmation');
 $('rxPatientRegisterConsent').checked=true;$('rxPatientRegisterConsent').dispatchEvent(new w.Event('change',{bubbles:true}));
 await wait(850);
 assert.equal(saves.length,1,'confirmed patient details automatically create one daily register encounter');
 assert.equal(saves[0].registerType,'daily');
 assert.equal(saves[0].patientName,'Test Patient');
 assert.equal(saves[0].phone,'9876543210');
 assert.equal(saves[0].patientCode,$('rxPatientCode').value);
 assert.equal(saves[0].visitType,'Prescription / clinical encounter');
 assert.ok(saves[0].patientDateTime.includes('IST')||/\d{2}:\d{2}/.test(saves[0].patientDateTime),'encounter date/time is recorded');
 assert.equal(saves[0].clinicalSummary,'','clinical notes and prescription content are not copied into the demographic register');
 $('rxPatAge').value='65 years 4 months';$('rxPatAge').dispatchEvent(new w.Event('input',{bubbles:true}));
 $('rxPatSex').value='Female';$('rxPatSex').dispatchEvent(new w.Event('change',{bubbles:true}));
 $('rxPatAddress').value='12 Example Road, Pune';$('rxPatAddress').dispatchEvent(new w.Event('input',{bubbles:true}));
 await wait(850);
 assert.equal(saves.length,2,'later demographic edits update the same register encounter');
 assert.equal(saves[1].id,returned[0].id,'demographic update reuses the same cloud record');
 assert.equal(saves[1].revision,returned[0].revision,'demographic update sends the last saved revision');
 assert.equal(saves[1].age,'65 years 4 months','age text is preserved as entered');
 assert.equal(saves[1].sex,'Female');
 assert.equal(saves[1].address,'12 Example Road, Pune');
 assert.equal(saves[1].prescriptionSerial,$('rxSerialNo').value,'prescription serial is linked to the patient register encounter');
 assert.equal(w.localStorage.length,0,'patient demographics are not silently stored in browser local storage');
 assert.match($('rxPatientRegistrationStatus').textContent,/Registered in the private Daily Patient Register/);
 assert.ok(lookups.every(x=>x.phone&&x.name),'returning-patient lookup uses the patient mobile and name');
 dom.window.close();

 const existing={data:{patientName:'Returning Patient',phone:'9123456789',patientCode:'PT-EXISTING-01'}};
 const second=makeWindow([existing]),w2=second.w,$2=id=>w2.document.getElementById(id);
 $2('rxPatName').value='Returning Patient';$2('rxPatName').dispatchEvent(new w2.Event('input',{bubbles:true}));
 $2('rxPatPhone').value='9123456789';$2('rxPatPhone').dispatchEvent(new w2.Event('input',{bubbles:true}));
 assert.equal($2('rxPatientCode').value,'PT-EXISTING-01','returning patient reuses the existing patient number');
 $2('rxPatientRegisterConsent').checked=true;$2('rxPatientRegisterConsent').dispatchEvent(new w2.Event('change',{bubbles:true}));
 await wait(850);
 assert.equal(second.saves.length,1,'a new prescription creates a new encounter row for the returning patient');
 assert.equal(second.saves[0].patientCode,'PT-EXISTING-01');
 assert.equal(second.saves[0].id,undefined,'a new encounter does not overwrite the previous encounter');
 second.dom.window.close();

 const valid=validateRegister({registerType:'daily',entryDate:'2026-10-31',patientName:'Test Patient',patientCode:'PT-20261031-ABC12345',phone:'9876543210',address:'Pune',patientDateTime:'31/10/2026 12:00 IST',prescriptionSerial:'RX-20261031-1200-ABCD',age:'65 years 4 months',sex:'Female',visitType:'Prescription / clinical encounter'});
 assert.equal(valid.data.age,'65 years 4 months','daily register accepts the age format entered on a prescription');
 assert.equal(valid.data.address,'Pune');
 assert.throws(()=>validateRegister({registerType:'daily',entryDate:'2026-10-31',patientName:'Test Patient',phone:'123',visitType:'Prescription / clinical encounter'}),/valid patient mobile/i);
 assert.throws(()=>validateRegister({registerType:'death',entryDate:'2026-10-31',patientName:'Test Patient',age:'not an age',deathDateTime:'2026-10-31T10:00',place:'Pune'}),/valid age/i,'death register age validation remains strict');
 console.log('Prescription patient-registration checks passed: automatic separate serials, patient code assignment, consent gate, private cloud auto-create, demographic update without duplicate encounter, returning-patient number reuse, no localStorage, and API validation.');
})().catch(error=>{console.error(error);process.exitCode=1;});
