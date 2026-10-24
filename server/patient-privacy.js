'use strict';
const ID=/^pt-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NOTICE='2026-10-24';
function patientCode(id){if(!ID.test(id||''))throw Error('Invalid patient ID.');return 'PT-'+id.slice(3).replace(/-/g,'').toUpperCase();}
function consent(value){if(!value||value.status!=='granted'||value.noticeVersion!==NOTICE||!['verbal','written','guardian'].includes(value.method))throw Error('Record the patient’s permission for cloud trend storage before uploading.');return{status:'granted',method:value.method,noticeVersion:NOTICE,purpose:'private-cloud-trend-storage',...(typeof value.recorded_at==='string'&&Number.isFinite(Date.parse(value.recorded_at))&&Date.parse(value.recorded_at)<=Date.now()?{recorded_at:value.recorded_at}:{})};}
module.exports={patientCode,consent,NOTICE};
