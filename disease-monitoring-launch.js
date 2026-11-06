'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const tab=document.getElementById('tabDiseaseMonitoring');
 const frame=document.getElementById('diseaseMonitoringFrame');
 const status=document.getElementById('diseaseMonitoringStatus');
 const reload=document.getElementById('reloadDiseaseMonitoring');
 if(!tab||!frame)return;
 const hasOwner=()=>Boolean(window.WorkstationAuth?.isOwnerSession?.());
 const load=()=>{
  if(!hasOwner()){
   if(status)status.textContent='Sign in with the Doctor Workstation owner account, then select Disease Monitoring Centre again.';
   window.WorkstationAuth?.open?.();
   return false;
  }
  frame.src='/api/disease-monitoring-page';
  frame.dataset.loaded='1';
  if(status)status.textContent='Loading the private monitoring workspace…';
  return true;
 };
 tab.addEventListener('click',()=>{
  if(!hasOwner()){
   if(status)status.textContent='Owner login required. Complete sign-in, then select this tab again.';
   window.WorkstationAuth?.open?.();
   return;
  }
  if(frame.dataset.loaded!=='1')load();
 });
 reload?.addEventListener('click',()=>load());
 frame.addEventListener('load',()=>{if(status)status.textContent='Disease Monitoring Centre loaded. Cloud records remain owner-protected.';});
});
