/* Bidirectional unit conversions shared by the patient portal and Doctor Workstation. */
(()=>{'use strict';
function bindPair(leftId,rightId,leftToRight,rightToLeft,precision){
 const left=document.getElementById(leftId),right=document.getElementById(rightId);if(!left||!right)return;
 let updating=false;
 function sync(source,target,fn){
  if(updating)return;updating=true;
  const raw=source.value.trim();
  if(!raw)target.value='';
  else{const n=Number(raw),out=fn(n);target.value=Number.isFinite(n)&&Number.isFinite(out)?String(Number(out.toFixed(precision))):'';}
  updating=false;
 }
 left.addEventListener('input',()=>sync(left,right,leftToRight));
 right.addEventListener('input',()=>sync(right,left,rightToLeft));
}
function init(){
 for(const prefix of ['patient','doctor']){
  bindPair(prefix+'Celsius',prefix+'Fahrenheit',c=>c*9/5+32,f=>(f-32)*5/9,1);
  bindPair(prefix+'Kilograms',prefix+'Pounds',kg=>kg/0.45359237,lb=>lb*0.45359237,2);
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();