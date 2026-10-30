'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
const script=fs.readFileSync('page-identity.js','utf8');
const sections=['elderlySection','wikiSection','publicGuidanceSection','onlineConsultationNotice','bookingSection','patientFaq','exploreHealthResources','nutritionSection','patientToolsSection'];
const publicChildren='<section class="portal-hero"></section><nav class="care-pathways"></nav>'+sections.map(id=>'<section id="'+id+'"></section>').join('')+'<footer></footer>';
const html='<main id="publicPortal">'+publicChildren+'</main><main id="doctorWorkstation" class="hidden"><div class="doctor-tabs"></div><div id="viewRxPad" class="hidden"></div><div id="viewPathReq" class="hidden"></div></main>';
const tick=()=>new Promise(r=>setTimeout(r,100));
async function backTo(w,expected){w.history.back();for(let i=0;i<20&&w.location.hash!==expected;i++)await tick();assert.equal(w.location.hash,expected,'Browser Back reaches '+(expected||'the root overview'));}
(async()=>{
 const dom=new JSDOM(html,{url:'https://clinic.example.test/#elderlySection',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 w.DevicePrivacyLock={isUnlocked:()=>true};w.verifyAndOpenWorkstation=()=>{};w.switchWorkspace=type=>{w.document.getElementById('publicPortal').classList.toggle('hidden',type!=='public');w.document.getElementById('doctorWorkstation').classList.toggle('hidden',type!=='doctor');};w.switchDocTab=()=>{};
 w.eval(script);await tick();const $=id=>w.document.getElementById(id);
 assert.equal($('elderlySection').hidden,false,'Selected public topic stays visible');
 assert.equal($('wikiSection').hidden,true,'Other public topics are hidden in focused-page mode');
 assert.equal(w.document.querySelector('.portal-hero').hidden,true,'The general hero does not occupy every focused topic page');
 assert.equal(w.document.querySelector('.care-pathways').hidden,false,'Topic navigation remains available');
 assert.equal(w.document.querySelector('footer').hidden,false,'Footer remains available');
 w.location.hash='#wikiSection';await tick();assert.equal($('wikiSection').hidden,false);assert.equal($('elderlySection').hidden,true);assert.match(w.document.title,/Health library/);
 await backTo(w,'#elderlySection');assert.equal($('elderlySection').hidden,false,'Back restores the previous topic');assert.equal($('wikiSection').hidden,true);
 await backTo(w,'');assert.equal($('elderlySection').hidden,false,'Back to root shows overview sections');assert.equal($('wikiSection').hidden,false,'Back to root restores all public topics');assert.equal(w.document.querySelector('.portal-hero').hidden,false,'Root overview restores hero');
 dom.window.close();console.log('Topic-specific public page checks passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
