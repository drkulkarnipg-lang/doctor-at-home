/* Bidirectional unit conversions shared by the patient portal and Doctor Workstation. */
(()=>{'use strict';
function bindPair(prefix,leftId,rightId,leftToRight,rightToLeft,precision,validateLeft,validateRight){
 const left=document.getElementById(leftId),right=document.getElementById(rightId);if(!left||!right)return;
 const host=prefix==='patient'?left.closest('.conversion-panel'):document.getElementById('workstationConversionHost');
 if(!host)return;
 let status=host.querySelector('[data-conversion-status]');
 if(!status){status=document.createElement('p');status.dataset.conversionStatus='true';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.className='text-xs';host.append(status);}
 let updating=false;
 function sync(source,target,fn,validate,label){
  if(updating)return;updating=true;
  try{
   const raw=source.value.trim();
   if(!raw){target.value='';status.textContent='';return;}
   const n=Number(raw);if(!Number.isFinite(n))throw Error('Enter a finite number.');
   validate(n);
   const out=fn(n);if(!Number.isFinite(out))throw Error('The converted value is outside the supported range.');
   target.value=String(Number(out.toFixed(precision)));
   status.textContent=label+' conversion updated.';
  }catch(error){target.value='';status.textContent=error.message;}
  finally{updating=false;}
 }
 left.addEventListener('input',()=>sync(left,right,leftToRight,validateLeft,prefix==='patient'?'Patient temperature':'Doctor temperature'));
 right.addEventListener('input',()=>sync(right,left,rightToLeft,validateRight,prefix==='patient'?'Patient temperature':'Doctor temperature'));
}
function finiteRange(value){if(!Number.isFinite(value))throw Error('Enter a finite number.');}
function celsiusRange(value){finiteRange(value);if(value< -273.15)throw Error('Temperature is below absolute zero.');}
function fahrenheitRange(value){finiteRange(value);if(value< -459.67)throw Error('Temperature is below absolute zero.');}
function massRange(value){finiteRange(value);if(value<0)throw Error('Mass cannot be negative.');}
function init(){
 for(const prefix of ['patient','doctor']){
  bindPair(prefix,prefix+'Celsius',prefix+'Fahrenheit',c=>c*9/5+32,f=>(f-32)*5/9,1,celsiusRange,fahrenheitRange);
  bindPair(prefix,prefix+'Kilograms',prefix+'Pounds',kg=>kg/0.45359237,lb=>lb*0.45359237,2,massRange,massRange);
 }
}
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();}
})();