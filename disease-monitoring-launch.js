'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const link=document.getElementById('openDiseaseMonitoringCentre');if(!link)return;
 link.addEventListener('click',event=>{if(!window.WorkstationAuth?.isOwnerSession?.()){event.preventDefault();window.WorkstationAuth?.open?.();}});
});
