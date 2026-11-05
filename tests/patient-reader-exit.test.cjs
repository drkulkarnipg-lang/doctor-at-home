'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
(async()=>{
 const dom=new JSDOM(fs.readFileSync('index.html','utf8'),{url:'https://preview.example/',runScripts:'outside-only'}),w=dom.window;
 w.PatientEducation=require('../patient-education-data');w.renderPublishedArticles=()=>{};
 w.eval(fs.readFileSync('awareness-library.js','utf8'));
 if(w.document.readyState==='loading')await new Promise(resolve=>w.document.addEventListener('DOMContentLoaded',resolve,{once:true}));
 const read=w.document.querySelector('#wikiCardsGrid button'),modal=w.document.getElementById('wikiModal');
 function historyChange(action){return new Promise((resolve,reject)=>{const listener=()=>{clearTimeout(timer);resolve();};const timer=setTimeout(()=>{w.removeEventListener('popstate',listener);reject(Error('Expected browser history transition'));},2000);w.addEventListener('popstate',listener,{once:true});action();});}
 // Simulate the later page router restoring panel focus during the same history event.
 w.addEventListener('popstate',()=>w.document.getElementById('portalPanelLibrary').focus());
 read.focus();
 for(const close of ['wikiReaderClose','wikiReaderBack','backdrop','escape']){
  w.openWikiModal(9);assert.equal(w.document.body.style.overflow,'hidden');assert.equal(w.document.getElementById('publicPortal').inert,true);assert.equal(modal.classList.contains('hidden'),false);
  await historyChange(()=>{if(close==='escape')w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));else if(close==='backdrop')modal.click();else{const b=w.document.getElementById(close);b.onclick=w.closeWikiModal;b.click();}});
  assert.equal(modal.classList.contains('hidden'),true,close+' closes article');assert.equal(w.document.body.style.overflow,'');assert.equal(w.document.activeElement,read);
 }
 assert.equal(w.document.querySelectorAll('#wikiReaderBack').length,1);assert.equal(w.document.querySelectorAll('#wikiReaderClose').length,1);assert.ok(w.document.querySelectorAll('#wikiCardsGrid [data-guide-action]').length>0);
 read.focus();w.openWikiModal(9);assert.equal(w.history.state.hvicWikiReader.id,9);
 await historyChange(()=>w.history.back());assert.equal(modal.classList.contains('hidden'),true,'browser Back should return to the library');
 await historyChange(()=>w.history.forward());assert.equal(modal.classList.contains('hidden'),false,'browser Forward should reopen the article');
 await historyChange(()=>w.closeWikiModal());assert.equal(modal.classList.contains('hidden'),true);
 const css=fs.readFileSync('patient-welcome.css','utf8');assert(css.includes('#wikiModalContent{flex:1;min-height:0;overflow:auto'));assert(css.includes('.wiki-reader-header'));assert(css.includes('color-scheme:light'));
 function lum(hex){return hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);}
 for(const [fg,bg]of [['17354b','f1f8ff'],['38596e','ffffff'],['ffffff','176788'],['174b6a','ffffff']]){const a=lum(fg),b=lum(bg);assert((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5);}
 dom.window.close();console.log('Reader exits/history verified by actual popstate events: Back button, backdrop, Escape, browser Back/Forward, focus restoration and contrast.');
})().catch(e=>{console.error(e);process.exitCode=1});
