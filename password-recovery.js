/* Owner-only Supabase recovery flow. Tokens remain in memory only. */
(()=>{'use strict';
const $=id=>document.getElementById(id),form=$('resetPasswordForm'),status=$('resetStatus'),button=$('resetPasswordSubmit');
const params=new URLSearchParams(window.location.hash.replace(/^#/,''));
let accessToken=params.get('access_token')||'';
const recoveryType=params.get('type')||'';
if(window.location.hash)history.replaceState(null,'',window.location.pathname+window.location.search);
function message(text,state=''){status.textContent=text;status.dataset.state=state;}
if(recoveryType!=='recovery'||accessToken.length<20){form.hidden=true;message('This recovery link is missing, invalid or expired. Return to the website and request a new link from Doctor login.','error');accessToken='';return;}
form.hidden=false;message('Recovery link accepted. Choose a new unique password.');
form.addEventListener('submit',async event=>{event.preventDefault();if(!accessToken){message('Recovery link is no longer available. Request a new link.','error');form.hidden=true;return;}
const password=$('newPassword').value,confirm=$('confirmPassword').value;
if(password.length<12){message('Use a password with at least 12 characters.','error');return;}
if(password!==confirm){message('The passwords do not match.','error');$('confirmPassword').focus();return;}
button.disabled=true;message('Updating password securely…');
try{const response=await fetch('/api/clinical-cloud?action=reset-password',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({accessToken,password})});let data={};try{data=await response.json();}catch{}
if(!response.ok)throw Error(data.message||'Password update could not be confirmed.');
accessToken='';form.reset();form.hidden=true;message('Password changed. Return to the website and sign in with your new password.','success');
}catch(error){message(error.message||'Password update could not be confirmed. Request a fresh recovery link if this one has expired.','error');}
finally{button.disabled=false;$('newPassword').value='';$('confirmPassword').value='';}
});
})();
