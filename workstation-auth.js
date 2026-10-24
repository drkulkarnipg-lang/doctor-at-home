/* Single UI for configured owner authentication. Server endpoints remain the data boundary. */
(()=>{'use strict';if(typeof fetch!=='function')return;const $=id=>document.getElementById(id);
const legacyOpen=window.verifyAndOpenWorkstation,legacySettings=window.openSecuritySettingsModal,legacySwitch=window.switchWorkspace,privacy=window.DevicePrivacyLock;
let mode='checking',verified=false,pending=null,checking=null,sessionTimer=null;
function hide(){const d=$('doctorLoginDialog');if(d.open){if(typeof d.close==='function')d.close();else d.removeAttribute('open');}}
function show(message=''){const d=$('doctorLoginDialog');$('doctorLoginError').textContent=message;$('doctorLoginPassword').value='';if(!d.open){if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');}$('doctorLoginEmail').focus();}
function update(){const old=$('cloudSignInForm');if(old)old.hidden=true;const button=$('cloudSignOut');if(button)button.textContent='Logout Doctor Workstation';const icon=$('navLockIcon');if(icon){icon.textContent=verified?'🔓':'🔒';icon.parentElement.title=mode==='owner'?'Doctor login and logout':'Device privacy settings — server login not configured';}const note=$('doctorAccessStatus');if(note)note.textContent=mode==='owner'?(verified?'Owner signed in · Workstation & cloud':'Doctor login required'):mode==='local'?'Device privacy only · owner server login not configured':'Checking doctor login';}
async function check(){if(checking)return checking;checking=window.ClinicCloud.session().then(data=>{mode=data.configured?'owner':'local';verified=mode==='owner'&&data.signedIn===true;update();return data;}).finally(()=>{checking=null;});return checking;}
function enter(){hide();$('securityModal').classList.add('hidden');$('deviceUnlockDialog').removeAttribute('open');privacy.acceptServerSession();update();clearTimeout(sessionTimer);sessionTimer=setTimeout(()=>{verified=false;privacy.lock();update();},15*60*1000);}
function open(){if(pending)return pending;pending=(async()=>{try{await check();if(mode==='local'){legacyOpen();return;}if(verified)enter();else show();}catch(e){show('The owner login service could not be checked. '+e.message);}})().finally(()=>{pending=null;});return pending;}
window.WorkstationAuth={open,isOwnerSession:()=>mode==='owner'&&verified};
window.verifyAndOpenWorkstation=open;
window.switchWorkspace=type=>{if(type==='doctor')return open();legacySwitch(type);};
window.openSecuritySettingsModal=async()=>{try{await check();if(mode==='local'){legacySettings();return;}if(!verified){show();return;}const d=$('doctorSessionDialog');if(!d.open){if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');}}catch(e){show(e.message);}};
window.lockWorkstationNow=async()=>{if(mode==='owner'){try{await window.ClinicCloud.logout();}catch(e){privacy.lock();show('Cloud logout could not be confirmed. '+e.message);return;}verified=false;clearTimeout(sessionTimer);privacy.lock();update();}else privacy.lock();};
window.addEventListener('clinic-owner-signed-out',()=>{verified=false;clearTimeout(sessionTimer);privacy.lock();update();});
window.addEventListener('clinical-workspace-locked',()=>{if(mode==='owner'){verified=false;update();}});
document.addEventListener('DOMContentLoaded',()=>{
const badge=document.createElement('p');badge.id='doctorAccessStatus';badge.className='doctor-access-status no-print';$('doctorWorkstation').querySelector('.workstation-heading').append(badge);
const session=document.createElement('dialog');session.id='doctorSessionDialog';const h=document.createElement('h2'),p=document.createElement('p'),logout=document.createElement('button'),close=document.createElement('button');h.textContent='Doctor session';p.textContent='The same owner login is used for Workstation and cloud trends. Device privacy is not a separate account. Local downloaded copies remain on this browser.';logout.type=close.type='button';logout.textContent='Logout';close.textContent='Continue working';logout.onclick=async()=>{await window.lockWorkstationNow();if(typeof session.close==='function')session.close();else session.removeAttribute('open');};close.onclick=()=>{if(typeof session.close==='function')session.close();else session.removeAttribute('open');};session.append(h,p,logout,close);document.body.append(session);
$('doctorLoginCancel').onclick=hide;
$('doctorLoginForm').onsubmit=async e=>{e.preventDefault();const button=$('doctorLoginSubmit');button.disabled=true;try{const state=await check();if(!state.configured)throw Error('Owner login setup is pending. No cloud login account was created by this website.');await window.ClinicCloud.login($('doctorLoginEmail').value.trim(),$('doctorLoginPassword').value);verified=true;mode='owner';enter();}catch(err){$('doctorLoginError').textContent=err.message;}finally{$('doctorLoginPassword').value='';button.disabled=false;}};
$('cloudSignOut').onclick=window.lockWorkstationNow;const cloudAccessForm=$('cloudSignInForm');cloudAccessForm.hidden=true;
const link=document.createElement('button');link.type='button';link.className='research-upload';link.textContent='Use Doctor login';link.onclick=open;$('cloudSignInForm').after(link);$('cloudSignInForm').hidden=true;
check().catch(e=>{mode='unavailable';update();$('cloudConnectionStatus').textContent='Owner login service is unavailable. '+e.message;});
});
})();
