'use strict';
const {JSDOM}=require('jsdom'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{webcrypto}=require('node:crypto');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),script=fs.readFileSync(path.join(root,'device-lock.js'),'utf8');
const key='kulkarniDeviceLockV2',sk='kulkarniDeviceSessionV2';
async function boot(local={},session={},now=Date.now()){
 const dom=new JSDOM(html,{url:'https://clinic.example.test',runScripts:'outside-only'}),w=dom.window;Object.defineProperty(w,'crypto',{value:webcrypto});w.TextEncoder=TextEncoder;let clock=now;w.Date.now=()=>clock;w.switchWorkspace=t=>{w.document.getElementById('doctorWorkstation').classList.toggle('hidden',t!=='doctor');};w.showToast=()=>{};
 for(const [k,v]of Object.entries(local))w.localStorage.setItem(k,v);for(const [k,v]of Object.entries(session))w.sessionStorage.setItem(k,v);w.eval(script);await new Promise(r=>setTimeout(r,10));return{w,close:()=>w.close(),advance:ms=>clock+=ms,clock:()=>clock};
}
(async()=>{
 const a=await boot();a.w.openSecuritySettingsModal();a.w.document.getElementById('customPinInput').value='SyntheticSession-2026';a.w.document.getElementById('deviceConfirmPassword').value='SyntheticSession-2026';await a.w.saveSecuritySettings();assert.equal(a.w.DevicePrivacyLock.isUnlocked(),true);
 const record=a.w.localStorage.getItem(key),session=a.w.sessionStorage.getItem(sk);assert.ok(session);assert.equal(session.includes('SyntheticSession-2026'),false);
 a.w.document.dispatchEvent(new a.w.Event('visibilitychange'));assert.equal(a.w.DevicePrivacyLock.isUnlocked(),true,'A brief page switch must not lock');
 const b=await boot({[key]:record},{[sk]:session},a.clock()+1000);assert.equal(b.w.DevicePrivacyLock.isUnlocked(),true,'Same-tab reload keeps unexpired device session');b.w.verifyAndOpenWorkstation();assert.equal(b.w.document.getElementById('deviceUnlockDialog').open,false);b.advance(15*60*1000+1);b.w.dispatchEvent(new b.w.Event('focus'));assert.equal(b.w.DevicePrivacyLock.isUnlocked(),false,'Expiry is enforced after background timer throttling');assert.equal(b.w.sessionStorage.getItem(sk),null);b.close();
 a.w.lockWorkstationNow();assert.equal(a.w.sessionStorage.getItem(sk),null);a.w.dispatchEvent(new a.w.Event('pagehide'));assert.equal(a.w.sessionStorage.getItem(sk),null,'Pagehide must never recreate a manually locked session');a.close();
 const legacy=await boot({[key]:record},{docAuthenticated:'true'});assert.equal(legacy.w.DevicePrivacyLock.isUnlocked(),false);legacy.close();
 const stale=await boot({[key]:record},{[sk]:session},JSON.parse(session).startedAt+8*60*60*1000+1);assert.equal(stale.w.DevicePrivacyLock.isUnlocked(),false);stale.close();
 const wrong=JSON.parse(session);wrong.recordHash='different verifier';const c=await boot({[key]:record},{[sk]:JSON.stringify(wrong)});assert.equal(c.w.DevicePrivacyLock.isUnlocked(),false);c.close();
 console.log('Device session checks passed: brief visibility changes, reload continuity, elapsed-time expiry, explicit lock, no pagehide resurrection, absolute expiry and verifier change. Device privacy only; no server-auth claim.');
})().catch(e=>{console.error(e);process.exitCode=1;});
