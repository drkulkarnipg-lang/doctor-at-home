'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
const script=fs.readFileSync('page-identity.js','utf8');
const html='<main id="publicPortal" class="hidden"></main><main id="doctorWorkstation" class="hidden"><div class="doctor-tabs"></div><div id="viewRxPad" class="hidden"></div><div id="viewPathReq" class="hidden"></div></main><section id="elderlySection"></section><section id="wikiSection"></section><section id="publicGuidanceSection"></section><section id="nutritionSection"></section><section id="bookingSection"></section><section id="patientToolsSection"></section><section id="patientFaq"></section>';
const tick=()=>new Promise(r=>setTimeout(r,30));
async function waitForPop(w,method){const event=new Promise(resolve=>w.addEventListener('popstate',resolve,{once:true}));w.history[method]();await Promise.race([event,new Promise((_,reject)=>setTimeout(()=>reject(Error('popstate did not fire')),500))]);await tick();}
(async()=>{
 const dom=new JSDOM(html,{url:'https://clinic.example.test/#workstation=rxPad',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 let currentTab='rxPad';w.DevicePrivacyLock={isUnlocked:()=>true};w.verifyAndOpenWorkstation=()=>{throw Error('Unexpected login prompt in unlocked test');};
 w.switchWorkspace=type=>{w.document.getElementById('publicPortal').classList.toggle('hidden',type!=='public');w.document.getElementById('doctorWorkstation').classList.toggle('hidden',type!=='doctor');};
 w.switchDocTab=tab=>{currentTab=tab;for(const id of ['rxPad','pathReq'])w.document.getElementById('view'+id[0].toUpperCase()+id.slice(1)).classList.toggle('hidden',id!==tab);};
 w.eval(script);await tick();
 assert.equal(currentTab,'rxPad','Direct workstation hash opens the requested tab');
 w.switchDocTab('pathReq');assert.equal(currentTab,'pathReq');assert.equal(w.location.hash,'#workstation=pathReq','Selecting a tab creates a navigable URL');
 await waitForPop(w,'back');assert.equal(w.location.hash,'#workstation=rxPad');assert.equal(currentTab,'rxPad','Browser Back restores the prior workstation tab');
 await waitForPop(w,'forward');assert.equal(w.location.hash,'#workstation=pathReq');assert.equal(currentTab,'pathReq','Browser Forward restores the next workstation tab');
 dom.window.close();console.log('Workstation browser-history checks passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
