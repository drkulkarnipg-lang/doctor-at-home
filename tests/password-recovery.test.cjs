'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
const html=fs.readFileSync('password-reset.html','utf8'),script=fs.readFileSync('password-recovery.js','utf8'),tick=()=>new Promise(r=>setTimeout(r,10));
(async()=>{
const token='T'.repeat(40),fakePassword='x'.repeat(16);let requests=[];
const dom=new JSDOM(html,{url:'https://clinic.example.test/password-reset.html#access_token='+token+'&type=recovery',runScripts:'outside-only'}),w=dom.window;
w.fetch=async(url,options)=>{requests.push([url,options]);return{ok:true,status:200,json:async()=>({updated:true,message:'Password changed.'})};};
w.eval(script);assert.equal(w.location.hash,'');assert.equal(w.document.getElementById('resetPasswordForm').hidden,false);assert.equal(w.localStorage.length,0);
w.document.getElementById('newPassword').value=fakePassword;w.document.getElementById('confirmPassword').value='different';w.document.getElementById('resetPasswordForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await tick();assert.equal(requests.length,0);
w.document.getElementById('confirmPassword').value=fakePassword;w.document.getElementById('resetPasswordForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await tick();assert.equal(requests.length,1);assert.equal(requests[0][0],'/api/clinical-cloud?action=reset-password');assert.equal(requests[0][1].credentials,'same-origin');assert.deepEqual(JSON.parse(requests[0][1].body),{accessToken:token,password:fakePassword});assert.equal(w.document.getElementById('resetPasswordForm').hidden,true);assert.match(w.document.getElementById('resetStatus').textContent,/Password changed/);assert.equal(w.document.getElementById('newPassword').value,'');assert.equal(w.document.getElementById('confirmPassword').value,'');assert.equal(w.localStorage.length,0);dom.window.close();
const noToken=new JSDOM(html,{url:'https://clinic.example.test/password-reset.html',runScripts:'outside-only'});noToken.window.eval(script);assert.equal(noToken.window.document.getElementById('resetPasswordForm').hidden,true);assert.match(noToken.window.document.getElementById('resetStatus').textContent,/invalid or expired/i);noToken.window.close();
console.log('Password recovery UI checks passed: URL token scrubbed, mismatches blocked, same-origin request, fields cleared, no local storage and invalid link handling.');
})().catch(e=>{console.error(e);process.exitCode=1;});
