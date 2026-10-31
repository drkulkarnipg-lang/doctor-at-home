'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
(async()=>{
 const dom=new JSDOM('<div id="chatMessages"></div><div id="helperShortcuts"></div><input id="chatInput"><div id="chatbotWindow" class="hidden"></div>',{url:'https://clinic.example.test/',runScripts:'outside-only'});
 const w=dom.window;
 w.eval(fs.readFileSync('patient-helper.js','utf8'));
 await new Promise(resolve=>setTimeout(resolve,20));
 const input=w.document.getElementById('chatInput');input.value='fees';w.sendChatMessage();
 const response=w.document.querySelector('#chatMessages .helper-message.assistant')?.textContent||'';
 assert.match(response,/₹100[^.]*service-assistant \/ guided help/i,'show the separate ₹100 guided-help fee');
 assert.match(response,/₹500[^.]*online consultation/i,'show the separate ₹500 online-consultation fee');
 assert.match(response,/₹1,200[^.]*daytime home-visit fee/i,'show the separate ₹1,200 daytime home-visit base');
 assert.match(response,/different service categories, not one combined fee/i,'do not present the three amounts as one combined charge');
 assert.match(response,/Guided help is not a medical consultation/i,'distinguish service assistance from clinical consultation');
 assert.match(response,/This helper does not collect payment/i,'do not imply that payment is collected by the helper');
 assert.doesNotMatch(response,/payment received|paid successfully|pay now|payment collected/i,'never claim a payment has been taken');
 dom.window.close();
 console.log('Patient service-fee clarity checks passed: ₹100 guided help, ₹500 online consultation, ₹1,200 daytime home-visit base; no payment collection claim.');
})().catch(error=>{console.error(error);process.exitCode=1;});
