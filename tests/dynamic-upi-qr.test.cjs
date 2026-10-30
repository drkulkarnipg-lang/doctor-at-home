'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
const script=fs.readFileSync('payment-options.js','utf8'),html=fs.readFileSync('index.html','utf8');
assert.match(html,/Show payment QR \/ भुगतान QR दिखाएँ/);
assert.match(html,/id="upiQrImg" loading="lazy" hidden/);
(async()=>{
 const dom=new JSDOM('<a id="upiPaymentLink"></a><button id="upiCopyId"></button><p id="upiMethodStatus"></p><details id="upiQrDetails"><summary>Show QR</summary><img id="upiQrImg" hidden></details><button id="bankTransferRequest"></button><input id="calcTime"><input id="calcDistance"><div id="procedureList"><input type="checkbox"></div>',{url:'https://clinic.example.test',runScripts:'outside-only'});
 const w=dom.window,$=id=>w.document.getElementById(id),payloads=[];let fee=1200;
 w.calculateFee=()=>fee;w.openDoctorContact=()=>{};w.KulkarniQRCode={toDataURL:async(uri,options)=>{payloads.push({uri,options});return 'data:image/png;base64,SYNTHETIC_QR';}};
 w.eval(script);w.document.dispatchEvent(new w.Event('DOMContentLoaded'));await new Promise(r=>setTimeout(r,10));
 $('upiQrDetails').open=true;$('upiQrDetails').dispatchEvent(new w.Event('toggle'));await new Promise(r=>setTimeout(r,10));
 assert.ok(payloads.length>=1,'Opening the QR control must invoke the QR generator');
 let last=payloads.at(-1);let url=new URL(last.uri);assert.equal(url.protocol,'upi:');assert.equal(url.searchParams.get('pa'),'drkulkarnipg@upi');assert.equal(url.searchParams.get('am'),'1200');assert.equal(url.searchParams.get('cu'),'INR');assert.equal(last.options.width,320);assert.equal($('upiQrImg').hidden,false);assert.match($('upiQrImg').src,/^data:image\/png;base64,/);assert.match($('upiMethodStatus').textContent,/verify the payee and amount/i);
 fee=1500;w.calculateFee();await new Promise(r=>setTimeout(r,10));last=payloads.at(-1);assert.equal(new URL(last.uri).searchParams.get('am'),'1500','QR updates when the calculated visit fee changes');
 $('upiQrDetails').open=false;$('upiQrDetails').dispatchEvent(new w.Event('toggle'));assert.equal($('upiQrImg').hidden,true,'Closing QR details clears the rendered QR');
 dom.window.close();console.log('Dynamic UPI QR checks passed: opens on demand, embeds current fee, refreshes after fee changes, and clears on close.');
})().catch(e=>{console.error(e);process.exitCode=1;});
