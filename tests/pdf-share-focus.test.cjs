'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
(async()=>{
 const dom=new JSDOM('<button id="launch">Share</button><div id="pdfShareDialog" hidden role="dialog"><button id="pdfShareClose">Close</button><button disabled>Not ready</button><button id="download">Download</button><a id="send" href="#">Open app</a></div>',{runScripts:'outside-only',url:'https://clinic.example/'});
 const w=dom.window,d=w.document,dialog=d.getElementById('pdfShareDialog'),close=d.getElementById('pdfShareClose'),launch=d.getElementById('launch');
 w.HTMLElement.prototype.getClientRects=function(){return [{}]};
 let cleanup=0;close.onclick=()=>{cleanup++;dialog.hidden=true};
 w.eval(fs.readFileSync('pdf-share-focus.js','utf8'));
 await new Promise(r=>w.setTimeout(r,0));
 launch.focus();dialog.hidden=false;await Promise.resolve();
 assert.equal(d.activeElement,close);assert.equal(d.body.style.overflow,'hidden');
 const backwards=new w.KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true,cancelable:true});close.dispatchEvent(backwards);assert.equal(d.activeElement.id,'send');assert.ok(backwards.defaultPrevented);
 const forwards=new w.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true});d.activeElement.dispatchEvent(forwards);assert.equal(d.activeElement,close);assert.ok(forwards.defaultPrevented);
 close.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));await Promise.resolve();
 assert.equal(cleanup,1);assert.equal(dialog.hidden,true);assert.equal(d.activeElement,launch);assert.equal(d.body.style.overflow,'');
 dialog.hidden=false;await Promise.resolve();dialog.click();await Promise.resolve();assert.equal(cleanup,2);assert.equal(d.activeElement,launch);
 dom.window.close();console.log('PDF share: initial focus, Tab containment, disabled-control exclusion, Escape/backdrop cleanup and focus restoration pass.');
})().catch(e=>{console.error(e);process.exitCode=1});
