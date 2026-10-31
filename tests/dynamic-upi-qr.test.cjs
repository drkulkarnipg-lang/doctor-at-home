'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
const script=fs.readFileSync('payment-options.js','utf8'),html=fs.readFileSync('index.html','utf8');
assert.match(html,/Show my UPI payment QR[\s\S]*भुगतान QR दिखाएँ/);
assert.match(html,/id="upiQrImg" loading="lazy" hidden/);
(async()=>{
 const dom=new JSDOM('<button id="showPaymentQr"></button><details id="paymentMethods"><details id="upiQrDetails"><summary>Show QR</summary><img id="upiQrImg" hidden><p id="upiQrAmount"></p><button id="upiQrEnlarge" disabled></button><a id="upiQrDownload" hidden></a><dialog id="upiQrZoomDialog"><button id="upiQrZoomClose"></button><img id="upiQrZoomImage"></dialog></details></details><a id="upiPaymentLink"></a><button id="upiCopyId"></button><p id="upiMethodStatus"></p><button id="bankTransferRequest"></button><input id="calcTime"><input id="calcDistance"><div id="procedureList"><input type="checkbox"></div>',{url:'https://clinic.example.test',runScripts:'outside-only'});
 const w=dom.window,$=id=>w.document.getElementById(id),payloads=[];let fee=1200;
 w.calculateFee=()=>fee;w.openDoctorContact=()=>{};w.KulkarniQRCode={toDataURL:async(uri,options)=>{payloads.push({uri,options});return 'data:image/png;base64,SYNTHETIC_QR';}};
 w.eval(script);await new Promise(r=>setTimeout(r,20));
 $('showPaymentQr').click();await new Promise(r=>setTimeout(r,20));
 assert.equal($('paymentMethods').open,true,'patient-facing QR action opens payment methods');assert.equal($('upiQrDetails').open,true,'patient-facing QR action opens QR panel');await new Promise(r=>setTimeout(r,10));
 assert.ok(payloads.length>=1,'Opening the QR control must invoke the QR generator');
 let last=payloads.at(-1);let url=new URL(last.uri);assert.equal(url.protocol,'upi:');assert.equal(url.searchParams.get('pa'),'drkulkarnipg@upi');assert.equal(url.searchParams.get('am'),'1200');assert.equal(url.searchParams.get('cu'),'INR');assert.equal(last.options.width,320);assert.equal($('upiQrImg').hidden,false);assert.match($('upiQrImg').src,/^data:image\/png;base64,/);assert.match($('upiMethodStatus').textContent,/verify the payee.*amount/i);

 assert.equal($('upiQrAmount').textContent,'₹1,200.00','QR panel must show the exact calculated amount');
 assert.equal($('upiQrDownload').hidden,false,'download action appears only after QR generation');
 assert.equal($('upiQrDownload').href,$('upiQrImg').src,'download must use the exact generated QR image');
 assert.equal($('upiQrEnlarge').disabled,false,'enlarge action becomes available after QR generation');
 $('upiQrEnlarge').click();
 assert.equal($('upiQrZoomDialog').open,true,'enlarge action opens the QR dialog');
 assert.equal($('upiQrZoomImage').src,$('upiQrImg').src,'enlarged dialog must show the same fee-bearing QR');
 $('upiQrZoomClose').click();
 assert.equal($('upiQrZoomDialog').open,false,'QR dialog can be closed');

 fee=1500;w.calculateFee();await new Promise(r=>setTimeout(r,10));last=payloads.at(-1);assert.equal(new URL(last.uri).searchParams.get('am'),'1500','QR updates when the calculated visit fee changes');
 assert.equal($('upiQrAmount').textContent,'₹1,500.00','visible amount updates with the calculated fee');
 $('upiQrDetails').open=false;$('upiQrDetails').dispatchEvent(new w.Event('toggle'));assert.equal($('upiQrImg').hidden,true,'Closing QR details clears the rendered QR');
 assert.equal($('upiQrDownload').hidden,true,'closing the QR panel hides the download link');
 assert.equal($('upiQrEnlarge').disabled,true,'closing the QR panel disables enlargement');
 dom.window.close();console.log('Dynamic UPI QR checks passed: opens on demand, embeds current fee, refreshes after fee changes, and clears on close.');
})().catch(e=>{console.error(e);process.exitCode=1;});
