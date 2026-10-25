/* Optional DOB entry. Calendar age uses today's date in India; no storage or requests. */
(function(root){'use strict';
const utc=(y,m,d)=>{const date=new Date(0);date.setUTCFullYear(y,m-1,d);date.setUTCHours(0,0,0,0);return date;};
const daysInMonth=(y,m)=>utc(y,m+1,0).getUTCDate();
function today(){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date());return Object.fromEntries(parts.filter(p=>['year','month','day'].includes(p.type)).map(p=>[p.type,Number(p.value)]));}
function age(day,month,year,asOf=today()){
 const d=Number(day),m=Number(month),y=Number(year),t=utc(asOf.year,asOf.month,asOf.day);
 if(![d,m,y].every(Number.isInteger)||y<1||m<1||m>12||d<1||d>daysInMonth(y,m))throw Error('Enter a valid day, month and year.');
 const birth=utc(y,m,d);if(birth>t)throw Error('Date of birth cannot be in the future.');
 // Completed calendar months, clamping anniversaries to the month's last day.
 let months=(asOf.year-y)*12+asOf.month-m;
 const anniversary=n=>{const total=y*12+m-1+n,ay=Math.floor(total/12),am=total%12+1;return utc(ay,am,Math.min(d,daysInMonth(ay,am)));};
 if(anniversary(months)>t)months--;
 const days=Math.round((t-anniversary(months))/86400000);
 return {years:Math.floor(months/12),months:months%12,days,totalMonths:months,totalDays:Math.round((t-birth)/86400000)};
}
function mount(targetId,unitId){const target=document.getElementById(targetId);if(!target)return;const unit=unitId&&document.getElementById(unitId),box=document.createElement('fieldset');box.className='patient-dob';box.id=targetId+'DOB';const legend=document.createElement('legend');legend.textContent='Date of birth (optional)';box.append(legend);const row=document.createElement('div');row.className='dob-blocks';box.append(row);const entries=[];
 for(const [key,label,max]of [['day','Day',2],['month','Month',2],['year','Year',4]]){const wrap=document.createElement('label');wrap.textContent=label;const input=document.createElement('input');input.type='text';input.inputMode='numeric';input.maxLength=max;input.pattern='[0-9]*';input.autocomplete='off';input.id=targetId+'DOB'+key;input.setAttribute('aria-label','Date of birth: '+label);input.className='notranslate';input.setAttribute('translate','no');wrap.htmlFor=input.id;wrap.append(input);row.append(wrap);entries.push(input);}
 const status=document.createElement('p');status.id=box.id+'Status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');box.append(status);const reset=document.createElement('button');reset.type='button';reset.className='no-print';reset.textContent='Clear date of birth';box.append(reset);target.parentElement.after(box);
 let previous=null,generated=null;
 const restore=()=>{if(previous){if(target.value===generated){target.value=previous.value;if(unit)unit.value=previous.unit;target.dispatchEvent(new Event('input',{bubbles:true}));}previous=null;generated=null;}};
 function update(){restore();if(unit){document.getElementById('intake-birthDate').value='';document.getElementById('intake-calendarAge').value='';}entries.forEach(e=>e.removeAttribute('aria-invalid'));if(entries.some(e=>!e.value)){status.textContent=entries.some(e=>e.value)?'Complete all three boxes to calculate age.':'Leave blank if unknown; age can be entered manually.';return;}
  try{if(!entries.every(e=>/^\d+$/.test(e.value))||entries[2].value.length!==4)throw Error('Enter day, month and a four-digit year.');const result=age(...entries.map(e=>e.value));previous={value:target.value,unit:unit?.value};if(unit){const years=result.years>0,months=result.totalMonths>0;generated=String(years?result.years:months?result.totalMonths:result.totalDays);unit.value=years?'Years':months?'Months':'Days';}else{const suffix=target.value.includes('/')?' /'+target.value.split('/').slice(1).join('/'):'';generated=`${result.years} Y ${result.months} M ${result.days} D${suffix}`;}target.value=generated;if(unit){document.getElementById('intake-birthDate').value=entries.map(e=>e.value).join(' ');document.getElementById('intake-calendarAge').value=`${result.years} years ${result.months} months ${result.days} days`;}status.textContent=`Age today (India): ${result.years} years ${result.months} months ${result.days} days.`;target.dispatchEvent(new Event('input',{bubbles:true}));}
  catch(e){status.textContent=e.message;entries.forEach(el=>el.setAttribute('aria-invalid','true'));}}
 entries.forEach(e=>e.addEventListener('input',update));reset.onclick=()=>{entries.forEach(e=>e.value='');update();entries[0].focus();};update();}
root.PatientAge={age,today};if(typeof module==='object'&&module.exports)module.exports=root.PatientAge;
if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>{mount('intake-age','intake-ageUnit');mount('rxPatAge');});
})(typeof window==='undefined'?globalThis:window);
