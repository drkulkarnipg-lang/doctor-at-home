/* Optional local password-entry aid. Does not save, log or submit credentials. */
(()=>{'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const input=document.getElementById('doctorLoginPassword');if(!input)return;
 const toggle=document.createElement('button');toggle.type='button';toggle.id='passwordKeyboardToggle';toggle.textContent='On-screen keyboard';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','passwordKeyboard');
 const panel=document.createElement('section');panel.id='passwordKeyboard';panel.className='password-keyboard';panel.hidden=true;panel.setAttribute('aria-label','Optional password keyboard');
 const note=document.createElement('p');note.textContent='Optional typing aid. Your regular keyboard and password manager still work.';panel.append(note);
 const keys=document.createElement('div');keys.className='password-keyboard-keys';panel.append(keys);let upper=false;
 const insert=text=>{const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;input.setRangeText(text,start,end,'end');input.dispatchEvent(new Event('input',{bubbles:true}));};
 function button(text,run,parent=keys){const b=document.createElement('button');b.type='button';b.textContent=text;b.onpointerdown=e=>e.preventDefault();b.onclick=run;parent.append(b);return b;}
 function render(){keys.replaceChildren();for(const row of ['1234567890','qwertyuiop','asdfghjkl','zxcvbnm','!@#$%^&*()','-_=+[]{};:',"'\"\\|,.<>/?`~"]){const line=document.createElement('div');line.className='password-keyboard-row';keys.append(line);for(const c of row){const value=upper?c.toUpperCase():c;button(value,()=>insert(value),line);}}
 const controls=document.createElement('div');controls.className='password-keyboard-row';keys.append(controls);const shift=button('Shift',()=>{upper=!upper;render();},controls);shift.setAttribute('aria-pressed',String(upper));button('Space',()=>insert(' '),controls);button('Backspace',()=>{const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;if(start===end&&start>0)input.setSelectionRange(start-1,end);insert('');},controls);button('Clear',()=>{input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));},controls);button('Hide',close,controls);}
 function close(){panel.hidden=true;toggle.setAttribute('aria-expanded','false');upper=false;}
 toggle.onclick=()=>{if(!panel.hidden){close();return;}panel.hidden=false;toggle.setAttribute('aria-expanded','true');render();input.focus();};
 panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();toggle.focus();}});
 input.insertAdjacentElement('afterend',toggle);toggle.after(panel);
 const dialog=document.getElementById('doctorLoginDialog');dialog?.addEventListener('close',close);dialog?.addEventListener('cancel',close);document.getElementById('doctorLoginCancel')?.addEventListener('click',close);document.getElementById('doctorLoginForm')?.addEventListener('submit',close);
});
})();
